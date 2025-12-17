const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a[data-nav]');
const footerYear = document.getElementById('footer-year');

const projects = [
  {
    title: 'Project 1',
    description: 'Flagship case study. Summarize the challenge, your approach, and the measurable outcome in a concise narrative.',
    image: '../images/project-16x9-placeholder.svg',
    tag: 'Featured',
    category: 'Product',
    badges: ['Design Systems', 'UX', 'Frontend'],
    video: 'https://www.youtube.com/watch?v=ZP1d8sk3GFE',
    gallery: [
      '../images/project-16x9-placeholder.svg',
      '../images/project-16x9-placeholder.svg'
    ],
    links: [
      { label: 'View repo', url: 'https://github.com/yourusername/project-1' },
      { label: 'Live demo', url: '#' }
    ]
  },
  {
    title: 'Project 2',
    description: 'Secondary project with a focus on rapid prototyping, testing, and iteration.',
    image: '../images/project-16x9-placeholder.svg',
    tag: 'Web',
    category: 'Web',
    badges: ['Prototype', 'Usability', 'API'],
    video: 'https://www.youtube.com/watch?v=ZP1d8sk3GFE',
    gallery: [
      '../images/project-16x9-placeholder.svg'
    ],
    links: [
      { label: 'View repo', url: '#' },
      { label: 'Live demo', url: '#' }
    ]
  },
  {
    title: 'Project 3',
    description: 'A design system initiative to improve consistency and delivery speed.',
    image: '../images/project-16x9-placeholder.svg',
    tag: 'Design System',
    category: 'Systems',
    badges: ['Tokens', 'Components', 'Docs'],
    video: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    gallery: [
      '../images/project-16x9-placeholder.svg'
    ],
    links: [
      { label: 'View repo', url: '#' }
    ]
  }
];

const filtersContainer = document.getElementById('filter-controls');
const modal = document.getElementById('project-modal');
const modalBackdrop = modal?.querySelector('.modal-backdrop');
const modalClose = modal?.querySelector('.modal-close');
const modalMedia = modal?.querySelector('#modal-media');
const modalTag = modal?.querySelector('#modal-tag');
const modalTitle = modal?.querySelector('#modal-title');
const modalDescription = modal?.querySelector('#modal-description');
const modalBadges = modal?.querySelector('#modal-badges');
const modalGallery = modal?.querySelector('#modal-gallery');
const modalVideo = modal?.querySelector('#modal-video');
const modalLink = modal?.querySelector('#modal-link');

const createBadgeMarkup = badges =>
  badges.map(badge => `<span class="badge">${badge}</span>`).join('');

const renderFilters = () => {
  if (!filtersContainer) return;
  const categories = Array.from(new Set(projects.map(p => p.category)));
  const fragment = document.createDocumentFragment();

  const allButton = document.createElement('button');
  allButton.className = 'filter-btn active';
  allButton.dataset.filter = 'all';
  allButton.textContent = 'All';
  fragment.appendChild(allButton);

  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.dataset.filter = cat;
    btn.textContent = cat;
    fragment.appendChild(btn);
  });

  filtersContainer.appendChild(fragment);
};

const renderProjects = (filter = 'all') => {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const fragment = document.createDocumentFragment();
  const filtered = filter === 'all'
    ? projects
    : projects.filter(p => p.category === filter);

  filtered.forEach((project, index) => {
    const card = document.createElement('article');
    card.className = 'project-card';
    card.innerHTML = `
      <div class="project-media">
        <img src="${project.image}" alt="${project.title} preview" loading="lazy">
      </div>
      <div class="project-body">
        <div class="pill">${project.tag}</div>
        <h3>${project.title}</h3>
        <p class="muted">${project.description}</p>
        <div class="badge-row">
          ${createBadgeMarkup(project.badges)}
        </div>
        <div class="project-links">
          <button class="btn ghost details-btn" data-index="${index}">View Details</button>
          ${project.video ? `<a class="btn primary" href="${project.video}" target="_blank" rel="noopener">Watch Demo</a>` : ''}
        </div>
        <div class="gallery-thumbs">
          ${project.gallery.map(src => `<img src="${src}" alt="${project.title} gallery image" loading="lazy">`).join('')}
        </div>
      </div>
    `;
    fragment.appendChild(card);
  });

  grid.appendChild(fragment);
};

const setActiveFilter = target => {
  if (!filtersContainer) return;
  filtersContainer.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn === target);
  });
};

const openModal = project => {
  if (!modal) return;
  modal.setAttribute('aria-hidden', 'false');
  modal.classList.add('open');

  modalTag.textContent = project.tag || '';
  modalTitle.textContent = project.title;
  modalDescription.textContent = project.description;
  modalBadges.innerHTML = createBadgeMarkup(project.badges || []);
  modalGallery.innerHTML = project.gallery
    .map(src => `<img src="${src}" alt="${project.title} gallery image" loading="lazy">`)
    .join('');
  modalVideo.href = project.video || '#';
  modalLink.href = project.links?.[0]?.url || '#';

  modalMedia.innerHTML = `
    <div class="project-media">
      <img src="${project.image}" alt="${project.title} preview">
    </div>
  `;
};

const closeModal = () => {
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
};

const toggleNav = () => {
  if (!nav || !navToggle) return;
  const isOpen = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
};

const closeNav = () => {
  if (!nav || !navToggle) return;
  if (nav.classList.contains('open')) {
    nav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
};

const handleNavToggleKey = event => {
  if (!navToggle) return;
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    toggleNav();
  } else if (event.key === 'Escape') {
    closeNav();
    navToggle.focus();
  }
};

const highlightActiveLink = () => {
  if (!navLinks.length) return;
  const path = window.location.pathname.replace(/\\/g, '/');
  let current = 'home';
  if (path.includes('about.html')) current = 'about';
  else if (path.includes('projects.html')) current = 'projects';

  navLinks.forEach(link => {
    const isActive = link.dataset.nav === current;
    link.classList.toggle('active', isActive);
    if (isActive) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
};

navToggle?.addEventListener('click', toggleNav);
navToggle?.addEventListener('keydown', handleNavToggleKey);

navLinks.forEach(link => {
  link.addEventListener('click', () => closeNav());
});

// Close menu when clicking outside on small screens
document.addEventListener('click', event => {
  if (!nav || !navToggle) return;
  const isNavClick = nav.contains(event.target) || navToggle.contains(event.target);
  if (!isNavClick && nav.classList.contains('open')) {
    closeNav();
  }
});

// Allow Escape to close menu globally
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeNav();
    closeModal();
  }
});

highlightActiveLink();
renderFilters();
renderProjects();

if (footerYear) {
  footerYear.textContent = new Date().getFullYear();
}

filtersContainer?.addEventListener('click', event => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  if (!target.matches('.filter-btn')) return;
  const filter = target.dataset.filter || 'all';
  setActiveFilter(target);
  renderProjects(filter);
});

document.getElementById('projects-grid')?.addEventListener('click', event => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  if (target.classList.contains('details-btn')) {
    const idx = Number(target.dataset.index);
    const project = projects[idx];
    if (project) openModal(project);
  }
});

modalClose?.addEventListener('click', closeModal);
modalBackdrop?.addEventListener('click', closeModal);