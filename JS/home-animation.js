// Animation unique d'ouverture comme Play Store/Facebook
document.addEventListener('DOMContentLoaded', () => {
  const splash = document.getElementById('splash-screen');
  setTimeout(() => {
    splash.classList.add('fade-out');
  }, 3000);
  setTimeout(() => {
    splash.remove();
  }, 4000);

  // Flying 3D stickers
  const container = document.getElementById('particles-container');
  for (let i = 0; i < 20; i++) {
    const sticker = document.createElement('div');
    sticker.classList.add('sticker');
    sticker.style.left = Math.random() * 100 + '%';
    sticker.style.animationDelay = Math.random() * 5 + 's';
    sticker.style.--rand-x = Math.random() * 2 - 1;
    sticker.style.--rand-z = Math.random() * 500 - 250 + 'px';
    container.appendChild(sticker);
  }
});
