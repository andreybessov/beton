const main = document.querySelector('main');

// Функція для плавного завантаження контенту
function loadPage(url) {
  // Додаємо клас для затемнення
  main.classList.add('fade-out');

  // Чекаємо закінчення анімації
  setTimeout(() => {
    fetch(url)
      .then(response => response.text())
      .then(data => {
        const parser = new DOMParser();
        const newDoc = parser.parseFromString(data, 'text/html');
        const newContent = newDoc.querySelector('main').innerHTML;

        main.innerHTML = newContent;

        // Після заміни контенту плавно показуємо новий контент
        main.classList.remove('fade-out');

        window.scrollTo(0, 0); // Скролимо вверх
        setupLinks(); // Щоб заново підв'язати всі лінки після зміни main
      });
  }, 300); // Час повинен співпадати з transition в CSS
}

// Підключаємо всі лінки
function setupLinks() {
  document.querySelectorAll('a[data-link]').forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      const url = this.getAttribute('href');
      history.pushState({}, '', url);
      loadPage(url);
    });
  });
}

// Обробка кнопки "Назад"
window.addEventListener('popstate', () => {
  loadPage(location.pathname);
});

// Перший запуск
setupLinks();
