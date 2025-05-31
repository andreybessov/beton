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

          // Додаємо в історію тільки якщо це нова сторінка
          if (addToHistory) {
            history.pushState(
              { html: newMain.innerHTML, url },
              "",
              url
            );
          }

          // Після рендеру скролимо
          requestAnimationFrame(() => {
            if (hash) {
              scrollToHash("#" + hash);
            } else {
              window.scrollTo({ top: 0 });
            }
          });
        }
      })
      .catch(err => {
        console.error(err);
        alert("Не вдалося завантажити сторінку.");
      });
  }

  // Слухач кліку по лінках
  document.body.addEventListener("click", e => {
    const link = e.target.closest("a[href]");
    if (!link) return;

    const href = link.getAttribute("href");
    if (!href || href.startsWith("mailto:") || href.startsWith("tel:")) return;

    // Пропускаємо зовнішні лінки
    const linkURL = new URL(href, location.origin);
    if (linkURL.origin !== location.origin) return;

    // Якщо це лише якір — залишаємо браузеру
    if (href.startsWith("#")) return;

    // Якщо це .html або .html#... — ловимо
    if (href.endsWith(".html") || href.includes(".html#")) {
      e.preventDefault();
      loadPage(href);
    }
  });

  // Слухач натискання кнопки "Назад"/"Вперед"
  window.addEventListener("popstate", e => {
    if (e.state?.html) {
      mainContainer.innerHTML = e.state.html;
      const hash = location.hash;
      if (hash) {
        requestAnimationFrame(() => scrollToHash(hash));
      } else {
        window.scrollTo({ top: 0 });
      }
    } else {
      // Повне завантаження, якщо не збережено state
      loadPage(location.pathname + location.hash, false);
    }
  });

  // Стартове збереження поточної сторінки
  history.replaceState(
    { html: mainContainer.innerHTML, url: location.href },
    "",
    location.href
  );
});
