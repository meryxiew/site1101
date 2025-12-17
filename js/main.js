const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a[data-nav]');
const footerYear = document.getElementById('footer-year');

const projects = [
  {
    title: 'Project 1',
    description: 'Flagship case study. Summarize the challenge, your approach, and the measurable outcome in a concise narrative.',
    longDescription: [
      'This placeholder project outlines how you can describe the business problem, constraints, and the audience you served. Swap this text with your own story.',
      'Call out your process: discovery, research, prototyping, validation, and delivery. Mention collaborators, tools, and any metrics you moved.'
    ],
    takeaways: [
      'Validated concepts quickly with lean usability tests',
      'Defined a component library to speed delivery',
      'Improved task success rate through iterative design'
    ],
    image: '../images/project-16x9-placeholder.svg',
    tag: 'Featured',
    category: 'Product',
    badges: ['Design Systems', 'UX', 'Frontend'],
    video: 'https://www.youtube.com/watch?v=ZP1d8sk3GFE',
    gallery: [
      { src: '../images/project-16x9-placeholder.svg', caption: 'Landing view mock' },
      { src: '../images/project-16x9-placeholder.svg', caption: 'Dashboard concept' },
      { src: '../images/project-16x9-placeholder.svg', caption: 'Mobile responsive layout' }
    ],
    links: [
      { label: 'GitHub repo', url: 'https://github.com/yourusername/project-1' },
      { label: 'Live demo', url: '#' }
    ]
  },
  {
    title: 'Project 2',
    description: 'Secondary project with a focus on rapid prototyping, testing, and iteration.',
    longDescription: [
      'Describe how you validated ideas through prototypes and short feedback loops.',
      'Highlight how you collaborated with engineering to ship quickly and safely.'
    ],
    takeaways: [
      'Shortened cycle time with design tokens',
      'De-risked features via prototype testing'
    ],
    image: '../images/project-16x9-placeholder.svg',
    tag: 'Web',
    category: 'Web',
    badges: ['Prototype', 'Usability', 'API'],
    video: 'https://www.youtube.com/watch?v=ZP1d8sk3GFE',
    gallery: [
      { src: '../images/project-16x9-placeholder.svg', caption: 'Prototype screen' },
      { src: '../images/project-16x9-placeholder.svg', caption: 'Interaction detail' }
    ],
    links: [
      { label: 'GitHub repo', url: '#' },
      { label: 'Live demo', url: '#' }
    ]
  },
  {
    title: 'Project 3',
    description: 'A design system initiative to improve consistency and delivery speed.',
    longDescription: [
      'Document how you structured tokens, components, and governance.',
      'Explain how adoption improved delivery quality and reduced drift.'
    ],
    takeaways: [
      'Rolled out tokens and accessibility guidelines',
      'Increased component re-use across teams'
    ],
    image: '../images/project-16x9-placeholder.svg',
    tag: 'Design System',
    category: 'Systems',
    badges: ['Tokens', 'Components', 'Docs'],
    video: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    gallery: [
      { src: '../images/project-16x9-placeholder.svg', caption: 'System overview' }
    ],
    links: [
      { label: 'GitHub repo', url: '#' }
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
const modalDescriptionLong = modal?.querySelector('#modal-description-long');
const modalTakeaways = modal?.querySelector('#modal-takeaways');
const modalBadges = modal?.querySelector('#modal-badges');
const modalGallery = modal?.querySelector('#modal-gallery');
const modalVideo = modal?.querySelector('#modal-video');
const modalLink = modal?.querySelector('#modal-link');
const modalLinksList = modal?.querySelector('#modal-links-list');
const modalVideoEmbed = modal?.querySelector('#modal-video-embed');

const lightbox = document.getElementById('lightbox');
const lightboxImage = lightbox?.querySelector('#lightbox-image');
const lightboxCaption = lightbox?.querySelector('#lightbox-caption');
const lightboxPrev = lightbox?.querySelector('#lightbox-prev');
const lightboxNext = lightbox?.querySelector('#lightbox-next');
const lightboxClose = lightbox?.querySelector('#lightbox-close');

let currentProject = null;
let currentGalleryIndex = 0;

const createBadgeMarkup = badges =>
  badges.map(badge => `<span class="badge">${badge}</span>`).join('');

const createLinksMarkup = links =>
  (links || [])
    .map(link => `<li><a href="${link.url}" target="_blank" rel="noopener">${link.label}</a></li>`)
    .join('');

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

  filtered.forEach(project => {
    const projectIndex = projects.indexOf(project);
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
          <button class="btn ghost details-btn" data-index="${projectIndex}">View Details</button>
          ${project.video ? `<a class="btn primary" href="${project.video}" target="_blank" rel="noopener">Watch Demo</a>` : ''}
        </div>
        <div class="gallery-thumbs">
          ${project.gallery.map((item, idx) => `<img src="${item.src}" alt="${project.title} gallery image" loading="lazy" data-idx="${idx}" data-project="${projectIndex}" class="thumb-click">`).join('')}
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
  currentProject = project;
  currentGalleryIndex = 0;

  modal.setAttribute('aria-hidden', 'false');
  modal.classList.add('open');
  document.body.classList.add('no-scroll');

  modalTag.textContent = project.tag || '';
  modalTitle.textContent = project.title;
  modalDescription.textContent = project.description;

  modalDescriptionLong.innerHTML = (project.longDescription || [])
    .map(p => `<p class="muted">${p}</p>`)
    .join('');

  modalTakeaways.innerHTML = (project.takeaways || [])
    .map(item => `<li><span aria-hidden="true">✔</span>${item}</li>`)
    .join('');

  modalBadges.innerHTML = createBadgeMarkup(project.badges || []);

  modalGallery.innerHTML = project.gallery
    .map((item, idx) => `<img src="${item.src}" alt="${item.caption || project.title}" loading="lazy" data-idx="${idx}" class="modal-thumb">`)
    .join('');

  modalLinksList.innerHTML = createLinksMarkup(project.links);
  modalVideo.href = project.video || '#';
  modalLink.href = project.links?.[0]?.url || '#';
  modalVideoEmbed.innerHTML = project.video
    ? `<div class="video-embed"><iframe src="${project.video.replace('watch?v=', 'embed/')}" title="${project.title} demo video" frameborder="0" allowfullscreen loading="lazy"></iframe></div>`
    : '';

  modalMedia.innerHTML = `
    <div class="project-media modal-hero">
      <img src="${project.image}" alt="${project.title} preview" data-idx="0">
    </div>
  `;
};

const closeModal = () => {
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  if (!lightbox?.classList.contains('open')) {
    document.body.classList.remove('no-scroll');
  }
};

const updateLightbox = () => {
  if (!lightbox || !currentProject) return;
  const item = currentProject.gallery[currentGalleryIndex];
  if (!item) return;
  lightboxImage.src = item.src;
  lightboxImage.alt = item.caption || currentProject.title;
  lightboxCaption.textContent = item.caption || '';
};

const openLightbox = (project, index = 0) => {
  if (!lightbox) return;
  currentProject = project;
  currentGalleryIndex = index;
  updateLightbox();
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
};

const closeLightbox = () => {
  if (!lightbox) return;
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  if (!modal?.classList.contains('open')) {
    document.body.classList.remove('no-scroll');
  }
};

const nextLightbox = () => {
  if (!currentProject) return;
  currentGalleryIndex = (currentGalleryIndex + 1) % currentProject.gallery.length;
  updateLightbox();
};

const prevLightbox = () => {
  if (!currentProject) return;
  currentGalleryIndex = (currentGalleryIndex - 1 + currentProject.gallery.length) % currentProject.gallery.length;
  updateLightbox();
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
    closeLightbox();
  }
  if (event.key === 'ArrowRight' && lightbox?.classList.contains('open')) {
    nextLightbox();
  }
  if (event.key === 'ArrowLeft' && lightbox?.classList.contains('open')) {
    prevLightbox();
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
  } else if (target.classList.contains('thumb-click')) {
    const idx = Number(target.dataset.project);
    const imgIdx = Number(target.dataset.idx);
    const project = projects[idx];
    if (project) openLightbox(project, imgIdx);
  }
});

modalClose?.addEventListener('click', closeModal);
modalBackdrop?.addEventListener('click', closeModal);

modalGallery?.addEventListener('click', event => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  if (target.classList.contains('modal-thumb')) {
    const idx = Number(target.dataset.idx);
    if (currentProject) openLightbox(currentProject, idx);
  }
});

modalMedia?.addEventListener('click', () => {
  if (currentProject) openLightbox(currentProject, 0);
});

lightboxPrev?.addEventListener('click', prevLightbox);
lightboxNext?.addEventListener('click', nextLightbox);
lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.querySelector('.lightbox-backdrop')?.addEventListener('click', closeLightbox);