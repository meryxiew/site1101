const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a[data-nav]');
const footerYear = document.getElementById('footer-year');
const themeToggle = document.querySelector('.theme-toggle');

const projects = [
  {
    title: 'Project 1',
    description: 'In this project, we explored how digital hardware works by constructing basic logic gates from scratch using electronic components. The goal was to understand the physical implementation of logical operations that form the foundation of modern computing systems.Working as a team, we designed, built, and tested NOT, AND, and OR logic gates using NPN transistors, resistors, LEDs, and a solderless breadboard. Each gate was constructed manually and verified through real electrical signals rather than simulations..',
    longDescription: [
      
    ],
    takeaways: [
      'Gained hands-on understanding of how logic gates work physically',
      'Improved teamwork and lab collaboration skills',
      'Developed practical experience with breadboards and circuits'
    ],
    image: '../images/logic gate.jpg',
    tag: 'Featured',
    category: 'Product',
    badges: ['Logic Gates', 'Hardware', 'Electronics'],
    video: 'https://www.youtube.com/watch?v=ZP1d8sk3GFE',
    gallery: [
      { src: '../images/Video.mp4', caption: 'Demo video clip' },
      { src: '../images/Photo 1 for logic gate.jpg', caption: 'Photo 1' },
      { src: '../images/photo 2 for logic gate.jpg', caption: 'Photo 2' },
      
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
const modalVideoEmbed = modal?.querySelector('#modal-video-embed');

const lightbox = document.getElementById('lightbox');
const lightboxImage = lightbox?.querySelector('#lightbox-image');
const lightboxCaption = lightbox?.querySelector('#lightbox-caption');
const lightboxPrev = lightbox?.querySelector('#lightbox-prev');
const lightboxNext = lightbox?.querySelector('#lightbox-next');
const lightboxClose = lightbox?.querySelector('#lightbox-close');
const lightboxContent = lightbox?.querySelector('.lightbox-content');

let currentProject = null;
let currentGalleryIndex = 0;

const isVideo = src => /\.mp4($|\?)/i.test(src);

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
          ${project.gallery.map((item, idx) => isVideo(item.src)
            ? `<div class="gallery-thumb video-thumb thumb-click" data-idx="${idx}" data-project="${projectIndex}">
                 <div class="video-thumb-label">Video</div>
                 <div class="video-thumb-play">▶</div>
               </div>`
            : `<img src="${item.src}" alt="${project.title} gallery image" loading="lazy" data-idx="${idx}" data-project="${projectIndex}" class="thumb-click">`
          ).join('')}
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
    .map((item, idx) => isVideo(item.src)
      ? `<div class="modal-thumb video-thumb" data-idx="${idx}">
            <div class="video-thumb-label">Video</div>
            <div class="video-thumb-play">▶</div>
          </div>`
      : `<img src="${item.src}" alt="${item.caption || project.title}" loading="lazy" data-idx="${idx}" class="modal-thumb">`
    )
    .join('');

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
  const existingVideo = lightbox?.querySelector('video.lightbox-video');
  if (isVideo(item.src)) {
    if (existingVideo) {
      existingVideo.src = item.src;
      existingVideo.style.display = 'block';
    } else if (lightboxContent) {
      const video = document.createElement('video');
      video.className = 'lightbox-video';
      video.src = item.src;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      lightboxContent.insertBefore(video, lightboxCaption);
    }
    if (lightboxImage) lightboxImage.style.display = 'none';
  } else {
    if (existingVideo) existingVideo.remove();
    if (lightboxImage) {
      lightboxImage.style.display = 'block';
      lightboxImage.src = item.src;
      lightboxImage.alt = item.caption || currentProject.title;
    }
  }
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

const applyTheme = theme => {
  const isDark = theme === 'dark';
  document.body.classList.toggle('dark-mode', isDark);
  document.documentElement.classList.toggle('dark-mode', isDark);
  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.classList.toggle('is-dark', isDark);
    themeToggle.classList.add('rotating');
    setTimeout(() => themeToggle.classList.remove('rotating'), 220);
  }
};

const initTheme = () => {
  const saved = localStorage.getItem('theme');
  const initial = saved || 'light';
  applyTheme(initial);
};

// Intersection Observer for reveal animations
const initReveals = () => {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-dot');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
          const delay = entry.target.dataset.delay || 0;
          entry.target.style.transitionDelay = `${delay}ms`;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2
    }
  );

  revealElements.forEach(el => observer.observe(el));
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

initTheme();
initReveals();

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

themeToggle?.addEventListener('click', () => {
  const isDark = document.body.classList.contains('dark-mode');
  const next = isDark ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('theme', next);
});