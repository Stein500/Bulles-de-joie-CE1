// JS pour activités - Hover descriptions
const activities = document.querySelectorAll('.activities-list li');
activities.forEach(li => {
  li.addEventListener('mouseover', () => {
    li.style.backgroundColor = '#FF1493';
    li.style.color = '#FFFFFF';
  });
  li.addEventListener('mouseout', () => {
    li.style.backgroundColor = '#000000';
    li.style.color = '#FFFFFF';
  });
});