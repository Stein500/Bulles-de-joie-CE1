// JS interactif pour pédagogie - Expand list items
const listItems = document.querySelectorAll('.cycles-list li');
listItems.forEach(li => {
  li.addEventListener('click', () => {
    li.classList.toggle('expanded');
    // Ajoute description si besoin
  });
});