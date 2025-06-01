document.getElementById("form").addEventListener("submit", function(e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  fetch("https://script.google.com/macros/s/AKfycbzvTKAyqy2RQXWlwX22e0_FU1IPvmSkjk5fXOik-IVrOq1lNKzcfbf-UahgqVBCaT35/exec", {
    method: "POST",
    body: formData
  })
  .then(response => {
    if (response.ok) {
      alert("Форма успішно надіслана!");
      form.reset();
    } else {
      alert("Помилка при надсиланні форми!");
    }
  })
  .catch(error => {
    console.error("Error:", error);
    alert("Сталася помилка.");
  });
});
