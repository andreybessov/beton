document.addEventListener("DOMContentLoaded", () => {
  const mainContainer = document.querySelector("main");

  // МОДАЛКА: відкриття по кліку
  document.body.addEventListener("click", (e) => {
    const btn = e.target.closest("#catalogLink, #aboutUsBtn");
    if (btn) {
      e.preventDefault();
      const modal = document.getElementById("callbackModal");
      if (modal) modal.classList.add("modal--active");
    }
  });

  // Завжди ініціалізуємо після зміни контенту
  function initModal() {
    const modal = document.getElementById("callbackModal");
    const modalClose = document.getElementById("modalClose");
    const form = document.getElementById("feedbackForm");

    if (!modal || !modalClose || !form) return;

    modalClose.addEventListener("click", () => {
      modal.classList.remove("modal--active");
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal || e.target.classList.contains("modal__overlay")) {
        modal.classList.remove("modal--active");
      }
    });

    // Уникнути дублювання submit-обробника
    form.onsubmit = function (e) {
      e.preventDefault();

      const formData = new FormData(form);
      fetch("https://script.google.com/macros/s/AKfycbzpgVb0HowifEgS6SifBV1p4OuUCKCZNTY9Xq3GVJjHQb88CDu28K6ElEfz76T8Pug8/exec", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            alert("✅ Форма успішно надіслана!");
            form.reset();
            modal.classList.remove("modal--active");
          } else {
            alert("❌ Помилка при надсиланні форми!");
          }
        })
        .catch((error) => {
          console.error(error);
          alert("🚫 Сталася помилка.");
        });
    };
  }

  // Scroll до якірного елемента
  function scrollToHash(hash) {
    if (!hash) return;
    const target = document.querySelector(hash);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  }

  // Завантаження сторінки без перезавантаження
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

        initModal(); // повторна ініціалізація форми
      })
      .catch(err => {
        console.error(err);
        alert("Не вдалося завантажити сторінку.");
      });
  }

  // Обробка всіх внутрішніх посилань
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
      requestAnimationFrame(() => scrollToHash(href));
      return;
    }

    if (href.endsWith(".html") || href.includes(".html#")) {
      e.preventDefault();
      loadPage(href);
    }
  });

  // Повернення назад/вперед у браузері
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

  // Початкове збереження стану
  history.replaceState(
    { html: mainContainer.innerHTML, url: location.href },
    "",
    location.href
  );

  initModal(); // перший запуск
});
