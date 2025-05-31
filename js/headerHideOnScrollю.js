document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector(".header");
  let lastScroll = window.scrollY;

  function handleScroll() {
    const currentScroll = window.scrollY;

    if (window.innerWidth <= 768) {
      if (currentScroll > lastScroll && currentScroll > 100) {
        header.classList.add("header--hidden");
      } else if (currentScroll < lastScroll) {
        header.classList.remove("header--hidden");
      }
    } else {
      // Якщо не мобілка — завжди показуємо хедер
      header.classList.remove("header--hidden");
    }

    lastScroll = currentScroll;
  }

  window.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", handleScroll);
});
