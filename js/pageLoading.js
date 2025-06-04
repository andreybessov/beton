document.addEventListener("DOMContentLoaded", () => {
  const mainContainer = document.querySelector("main");

  function scrollToHash(hash) {
    if (!hash) return;
    const target = document.querySelector(hash);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  }

  function loadPage(url, addToHistory = true) {
    const [path, hash] = url.split("#");

    fetch(path)
      .then(r => {
        if (!r.ok) throw new Error("Page load error");
        return r.text();
      })
      .then(html => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        const newMain = doc.querySelector("main");
        if (!newMain) return;

        mainContainer.innerHTML = newMain.innerHTML;

        if (addToHistory) {
          history.pushState({ html: newMain.innerHTML, url }, "", url);
        }

        requestAnimationFrame(() => {
          if (hash) scrollToHash("#" + hash);
          else window.scrollTo({ top: 0 });
        });

        initModal(); // Після AJAX-завантаження — перевірити модалку
      })
      .catch(err => {
        console.error(err);
        alert("Не вдалося завантажити сторінку.");
      });
  }

  document.body.addEventListener("click", (e) => {
    const link = e.target.closest("a[href]");
    if (!link) return;

    const href = link.getAttribute("href");
    if (
      !href ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:")
    ) return;

    const linkURL = new URL(href, location.origin);
    if (linkURL.origin !== location.origin) return;

    if (href.startsWith("#")) {
      // Плавний скрол, модалка делегується окремо
      requestAnimationFrame(() => scrollToHash(href));
      return;
    }

    if (href.endsWith(".html") || href.includes(".html#")) {
      e.preventDefault();
      loadPage(href);
    }
  });

  window.addEventListener("popstate", (e) => {
    if (e.state?.html) {
      mainContainer.innerHTML = e.state.html;
      const hash = location.hash;
      if (hash) requestAnimationFrame(() => scrollToHash(hash));
      else window.scrollTo({ top: 0 });
      initModal();
    } else {
      loadPage(location.pathname + location.hash, false);
    }
  });

  history.replaceState(
    { html: mainContainer.innerHTML, url: location.href },
    "",
    location.href
  );

  initModal(); // Перша ініціалізація
});
