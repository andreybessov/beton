const mobileMenu = document.querySelector('.mobile-menu')
const mobileBtnOpen = document.querySelector('.menu-btn-open');
const mobileBtnClose = document.querySelector('.menu-btn-close');
const mobileBtnLink = document.querySelector('.mobile-link')

const mobileMenuOpen = () => mobileMenu.classList.toggle('is-open')

mobileBtnOpen.addEventListener("click", mobileMenuOpen)
mobileBtnClose.addEventListener("click", mobileMenuOpen)
mobileBtnLink.addEventListener("click", mobileMenuOpen)