// JS principal - Menu toggle, header hide on scroll
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav ul');

toggle.addEventListener('click', () => {
  nav.classList.toggle('active');
});

let lastScroll = 0;
window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  const header = document.querySelector('.sticky-header');
  if (currentScroll > lastScroll && currentScroll > 100) {
    header.classList.add('hide');
  } else {
    header.classList.remove('hide');
  }
  lastScroll = currentScroll;
});

// Self-analytics basique (compte visites locales)
if (localStorage.getItem('visits')) {
  localStorage.setItem('visits', parseInt(localStorage.getItem('visits')) + 1);
} else {
  localStorage.setItem('visits', 1);
}
console.log('Visites : ' + localStorage.getItem('visits'));
