// JS pour contact - Interactif si besoin (ex: copy phone)
const phones = document.querySelectorAll('.contacts-section p');
phones.forEach(p => {
  p.addEventListener('click', () => {
    navigator.clipboard.writeText(p.textContent.trim());
    alert('Numéro copié !');
  });
});