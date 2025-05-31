const mobileMenu = document.querySelector('.mobile-menu');
const mobileBtnOpen = document.querySelector('.menu-btn-open');
const mobileBtnClose = document.querySelector('.menu-btn-close');
const mobileBtnLink1 = document.querySelector('.mobile-link1');
const mobileBtnLink2 = document.querySelector('.mobile-link2');
const mobileBtnLink3 = document.querySelector('.mobile-link3');

const mobileMenuOpen = () => mobileMenu.classList.toggle('is-open');

// Додаємо обробники лише якщо елементи існують
if (mobileBtnOpen) {
  mobileBtnOpen.addEventListener("click", mobileMenuOpen);
}
if (mobileBtnClose) {
  mobileBtnClose.addEventListener("click", mobileMenuOpen);
}
if (mobileBtnLink1) {
  mobileBtnLink1.addEventListener("click", mobileMenuOpen);
}
if (mobileBtnLink2) {
  mobileBtnLink2.addEventListener("click", mobileMenuOpen);
}
if (mobileBtnLink3) {
  mobileBtnLink3.addEventListener("click", mobileMenuOpen);
}
