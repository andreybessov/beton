// Ініціалізація модалки — можна викликати одразу, або після DOMContentLoaded
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

  form.addEventListener("submit", (e) => {
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
      console.error(error);
      alert("Сталася помилка.");
    });
  });
}

// Делегування відкриття модалки — працює навіть після переходів та DOM-змін
document.body.addEventListener("click", (e) => {
  const btn = e.target.closest("#catalogLink, .aboutUs-section__button button");
  if (btn) {
    e.preventDefault();
    const modal = document.getElementById("callbackModal");
    if (modal) modal.classList.add("modal--active");
  }
});

// Початкова ініціалізація
document.addEventListener("DOMContentLoaded", initModal);
