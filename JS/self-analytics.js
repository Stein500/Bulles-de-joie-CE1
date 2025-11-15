// Analytics simple (console log events)
document.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    console.log('Lien cliqué : ' + e.target.href);
  }
});