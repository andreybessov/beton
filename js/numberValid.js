 const phoneInput = document.getElementById("phone");

  // Не даём удалить +380
  phoneInput.addEventListener("keydown", function (e) {
    const prefix = "+380";
    if (
      phoneInput.selectionStart <= prefix.length &&
      (e.key === "Backspace" || e.key === "Delete" || e.key === "ArrowLeft")
    ) {
      e.preventDefault();
    }
  });

  // Автоматически добавляем +380, если поле пустое
  phoneInput.addEventListener("focus", function () {
    if (!phoneInput.value.startsWith("+380")) {
      phoneInput.value = "+380";
    }
  });

  // Очищаем всё, кроме цифр после +380
  phoneInput.addEventListener("input", function () {
    const prefix = "+380";
    let input = phoneInput.value;

    if (!input.startsWith(prefix)) {
      input = prefix + input.replace(/\D/g, "");
    } else {
      input =
        prefix + input.slice(prefix.length).replace(/\D/g, "").slice(0, 9);
    }

    phoneInput.value = input;
  });

  // Валидация при отправке формы
  document.querySelector("form").addEventListener("submit", function (e) {
    if (phoneInput.value.length !== 13) {
      e.preventDefault();
      alert("Будь ласка, введіть повний номер телефону у форматі +380XXXXXXXXX");
    }
  });