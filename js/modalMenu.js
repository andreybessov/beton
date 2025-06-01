
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("callbackModal");
  const modalClose = document.getElementById("modalClose");
  const form = document.getElementById("feedbackForm");

  const openModalBtns = [
    document.getElementById("catalogLink"),
    ...document.querySelectorAll(".aboutUs-section__button a"),
  ];

  openModalBtns.forEach((btn) => {
    if (btn) {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        modal.classList.add("modal--active");
      });
    }
  });

  modalClose.addEventListener("click", () => {
    modal.classList.remove("modal--active");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.classList.contains("modal__overlay")) {
      modal.classList.remove("modal--active");
    }
  });

  // Отправка формы
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
});

