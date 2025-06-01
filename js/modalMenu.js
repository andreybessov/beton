function initModal() {
  const modal = document.getElementById("callbackModal");
  const modalClose = document.getElementById("modalClose");
  const form = document.getElementById("feedbackForm");

  if (!modal || !modalClose || !form) return;

  // Закрытие по кнопке
  modalClose.addEventListener("click", () => {
    modal.classList.remove("modal--active");
  });

  // Закрытие по фону
  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.classList.contains("modal__overlay")) {
      modal.classList.remove("modal--active");
    }
  });

  // Обработка формы
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(form);

    fetch("https://script.google.com/macros/s/AKfycbzpgVb0HowifEgS6SifBV1p4OuUCKCZNTY9Xq3GVJjHQb88CDu28K6ElEfz76T8Pug8/exec", {
      method: "POST",
      body: formData,
    })
    .then((response) => {
      if (response.ok) {
        alert("Форма успішно надіслана!");
        form.reset();
        modal.classList.remove("modal--active");
      } else {
        alert("Помилка при надсиланні форми!");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Сталася помилка.");
    });
  });

  // Открытие модалки
  const openModalBtns = [
    document.getElementById("catalogLink"),
    ...document.querySelectorAll(".aboutUs-section__button"),
  ];

  openModalBtns.forEach((btn) => {
    if (btn) {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        modal.classList.add("modal--active");
      });
    }
  });
}

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

          requestAnimationFrame(() => {
            if (hash) {
              scrollToHash("#" + hash);
            } else {
              window.scrollTo({ top: 0 });
            }
          });

          // 💡 Повторная инициализация модалки после загрузки страницы
          initModal();
        }
      })
      .catch(err => {
        console.error(err);
        alert("Не вдалося завантажити сторінку.");
      });
  }

  // Клик по ссылкам
  document.body.addEventListener("click", e => {
    const link = e.target.closest("a[href]");
    if (!link) return;

    const href = link.getAttribute("href");
    if (!href || href.startsWith("mailto:") || href.startsWith("tel:")) return;

    const linkURL = new URL(href, location.origin);
    if (linkURL.origin !== location.origin) return;

    if (href.startsWith("#")) return;

    if (href.endsWith(".html") || href.includes(".html#")) {
      e.preventDefault();
      loadPage(href);
    }
  });

  // Назад/вперед в браузере
  window.addEventListener("popstate", e => {
    if (e.state?.html) {
      mainContainer.innerHTML = e.state.html;
      const hash = location.hash;
      if (hash) {
        requestAnimationFrame(() => scrollToHash(hash));
      } else {
        window.scrollTo({ top: 0 });
      }

      initModal(); // 💡 Повторная инициализация после popstate
    } else {
      loadPage(location.pathname + location.hash, false);
    }
  });

  // Первая инициализация
  history.replaceState(
    { html: mainContainer.innerHTML, url: location.href },
    "",
    location.href
  );

  initModal(); // 💡 Первая инициализация модалки
});
