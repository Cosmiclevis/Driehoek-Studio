// --- Hello World (for testing) ---
const helloWorld = () => {
  console.log("Hello World");
};
helloWorld();

// --- Projects Tab Logic ---
const originalContent = (document.querySelector('.projects-content')).innerHTML; // Save original HTML

document.querySelectorAll('.projects-menu button').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.projects-menu button').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    const group = this.getAttribute('data-group');

    // Restore original HTML before each action
    (document.querySelector('.projects-content')).innerHTML = originalContent;

    const allGroups = (document.querySelector('.projects-content')).querySelectorAll('.project-group');

    if (group === 'all') {
      // Collect all projects from all groups
      let projects = [];
      allGroups.forEach(g => {
        g.querySelectorAll('.project').forEach(p => projects.push(p));
        g.style.display = 'none';
      });
      // Sort by data-date descending (most recent first)
      projects.sort((a, b) => (b.dataset.date || '').localeCompare(a.dataset.date || ''));
      // Display sorted projects in a single group
      (document.querySelector('.projects-content')).innerHTML = `<div class="project-group" data-group="all">
        ${projects.map(p => `<div class="project" data-date="${p.dataset.date}">${p.innerHTML}</div>`).join('')}
      </div>`;
      initCarousels();
    } else {
      // Show only the selected group
      allGroups.forEach(g => {
        g.style.display = (g.getAttribute('data-group') === group) ? 'block' : 'none';
      });
      initCarousels();
    }
  });
});

// --- Carousel Logic (supports images and videos) ---
function initCarousels() {
  document.querySelectorAll('.carousel').forEach(carousel => {
    const items = carousel.querySelectorAll('.carousel-image, .carousel-video');
    const counter = carousel.querySelector('.carousel-counter');
    let current = 0;

    if (!items.length) {
      if (counter) counter.textContent = '1/1';
      return;
    }

    function updateCarousel() {
      items.forEach((item, i) => {
        const isCurrent = i === current;
        item.style.display = isCurrent ? 'block' : 'none';
        item.style.cursor = isCurrent ? 'pointer' : 'default';

        if (item.tagName === 'VIDEO') {
          item.pause();
          item.playbackRate = 1;
          item.muted = true;
          item.volume = 0;

          if (isCurrent) {
            item.currentTime = 0;
            item.play().catch(() => {});
          }
        }
      });
      if (counter) counter.textContent = `${current + 1}/${items.length}`;
    }

    items.forEach(item => {
      item.onclick = null;
    });

    function setClickHandler() {
      items[current].onclick = () => {
        const currentItem = items[current];

        if (currentItem.tagName === 'VIDEO') {
          if (currentItem.muted) {
            currentItem.muted = false;
            currentItem.volume = 1;
            currentItem.play().catch(() => {});
            return;
          }
        }

        current = (current + 1) % items.length;
        updateCarousel();
        setClickHandler();
      };
    }

    updateCarousel();
    setClickHandler();
  });
}
document.addEventListener('DOMContentLoaded', initCarousels);
