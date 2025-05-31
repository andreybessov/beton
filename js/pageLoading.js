document.addEventListener("DOMContentLoaded", () => {
  const mainContainer = document.querySelector("main");

  function scrollToHash(hash) {
    if (!hash) return;
    const target = document.querySelector(hash);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }

  function loadPage(url, addToHistory = true) {
    const [path, hash] = url.split("#");

    fetch(path)
      .then(response => {
        if (!response.ok) throw new Error("Page load error");
        return response.text();
      })
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const newMain = doc.querySelector("main");

        if (newMain) {
          mainContainer.innerHTML = newMain.innerHTML;

          if (addToHistory) {
            history.pushState({ html: newMain.innerHTML, url }, "", url);
          }

          // Прокрутка до якоря після рендеру
          setTimeout(() => scrollToHash("#" + hash), 50);
        }
      })
      .catch(err => {
        console.error(err);
        alert("Не вдалося завантажити сторінку.");
      });
  }

  // Клік по посиланню
  document.body.addEventListener("click", e => {
    const link = e.target.closest("a[href]");
    if (!link) return;

    const href = link.getAttribute("href");

    // Пропускаємо зовнішні посилання
    if (href.startsWith("http") && !href.includes(location.hostname)) return;

    // Пропускаємо якірні переходи всередині цієї ж сторінки
    if (href.startsWith("#")) return;

    // Якщо це .html або .html#anchor — ловимо
    if (href.endsWith(".html") || href.includes(".html#")) {
      e.preventDefault();
      loadPage(href);
    }
  });

  // Назад/вперед
  window.addEventListener("popstate", e => {
    if (e.state?.html) {
      mainContainer.innerHTML = e.state.html;

      // Прокрутка до якоря з URL
      const hash = location.hash;
      if (hash) scrollToHash(hash);
    } else if (location.pathname.endsWith(".html")) {
      loadPage(location.pathname + location.hash, false);
    }
  });
});
