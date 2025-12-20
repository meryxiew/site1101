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
    tag: 'Logic gates',
    category: 'Logic Gates',
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
    description: 'In this project, we participated in the global Hour of Code initiative to introduce school students to the fundamentals of programming through game development. The main objective was to make coding engaging, accessible, and interactive by using Microsoft MakeCode Arcade, a block-based programming platform designed for beginners. We visited a local school and worked directly with students, guiding them step by step as they created their own simple games. The activities focused on core programming concepts such as events, conditions, loops, sprites, and basic game logic. By learning through hands-on practice, students were able to understand how code translates into real-time actions within a game environment. Throughout the project, we emphasized creativity, problem-solving, and logical thinking, while also encouraging students to experiment and learn from mistakes in a supportive learning atmosphere.',
    longDescription: [
      
    ],
    takeaways: [
      'Gained experience in teaching programming concepts to beginners',
      'Improved communication and leadership skills while working with students',
      'Learned how to use Microsoft MakeCode Arcade as an educational tool'
    ],
    image: '../images/First Photo for hour code .jpg',
    tag: 'Hour of Code',
    category: 'Hour of Code',
    badges: ['Education', 'Programming', 'Game Development'],
    video: 'https://youtu.be/dd-zlNZ9X8g?feature=shared',
    gallery: [
      { src: '../images/First Photo for hour code .jpg', caption: 'Main project image' },
      { src: '../images/Hourofcode1.jpg', caption: 'Prototype screen' },
      { src: '../images/Hourofcode2.jpg', caption: 'Interaction detail' }
    ],
    links: [
      { label: 'GitHub repo', url: '#' },
      { label: 'Live demo', url: '#' }
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

// Convert YouTube URL to embed format
const convertYouTubeToEmbed = url => {
  if (!url) return '';
  
  let videoId = '';
  
  // Handle youtube.com/watch?v=VIDEO_ID format
  if (url.includes('youtube.com/watch?v=')) {
    videoId = url.split('watch?v=')[1].split('&')[0].split('?')[0];
  }
  // Handle youtu.be/VIDEO_ID format
  else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1].split('?')[0].split('&')[0];
  }
  // Handle youtube.com/embed/VIDEO_ID (already embed format)
  else if (url.includes('youtube.com/embed/')) {
    return url.split('?')[0]; // Return as-is, just remove query params
  }
  
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  return url; // Return original if we can't parse it
};

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
  allButton.className = 'filter-btn active fade-in';
  allButton.dataset.filter = 'all';
  allButton.setAttribute('data-delay', '0');
  allButton.textContent = 'All';
  fragment.appendChild(allButton);

  categories.forEach((cat, index) => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn fade-in';
    btn.dataset.filter = cat;
    btn.setAttribute('data-delay', ((index + 1) * 50).toString());
    btn.textContent = cat;
    fragment.appendChild(btn);
  });

  filtersContainer.appendChild(fragment);
  
  // Re-initialize reveals for filter buttons
  setTimeout(() => {
    initReveals();
  }, 50);
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
    const projectIndex = projects.indexOf(project);
    const card = document.createElement('article');
    card.className = 'project-card stagger-item';
    card.setAttribute('data-delay', (index * 100).toString());
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
  
  // Re-initialize reveals for newly rendered project cards
  setTimeout(() => {
    initReveals();
  }, 50);
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
    ? `<div class="video-embed"><iframe src="${convertYouTubeToEmbed(project.video)}" title="${project.title} demo video" frameborder="0" allowfullscreen loading="lazy"></iframe></div>`
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

// Global Scroll Animation System using Intersection Observer
let animationObserver = null;

const initReveals = () => {
  // Create observer only once, reuse for all elements
  if (!animationObserver) {
    animationObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const element = entry.target;
          const delay = parseInt(element.dataset.delay) || 0;
          
          // Apply delay if specified (only set once, persist)
          if (delay > 0 && !element.style.transitionDelay) {
            element.style.transitionDelay = `${delay}ms`;
          }
          
          // Add 'animate' class when entering viewport, remove when leaving
          if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
            element.classList.add('animate');
          } else {
            element.classList.remove('animate');
          }
        });
      },
      {
        threshold: [0.15, 0.2], // Trigger at 15-20% visibility
        rootMargin: '0px 0px -50px 0px' // Start animation slightly before element enters viewport
      }
    );
  }

  // Select all elements with animation classes or data-animate attribute
  const animatedElements = document.querySelectorAll(
    '.fade-up, .fade-in, .fade-left, .fade-right, .scale-in, ' +
    '.reveal, .reveal-left, .reveal-right, .reveal-dot, .stagger-item, ' +
    '[data-animate]'
  );
  
  if (!animatedElements.length) return;

  // Observe all animated elements (keep observing, don't unobserve)
  // Check if already observed to avoid duplicates
  animatedElements.forEach(el => {
    // Only observe if not already being observed
    if (!el.dataset.observed) {
      animationObserver.observe(el);
      el.dataset.observed = 'true';
    }
  });
  
  // Handle stagger animations for grid items
  initStaggerAnimations();
};

// Initialize stagger animations for grid layouts
const initStaggerAnimations = () => {
  // Project cards grid
  const projectGrid = document.querySelector('.project-grid');
  if (projectGrid) {
    const projectCards = projectGrid.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
      if (!card.classList.contains('stagger-item')) {
        card.classList.add('stagger-item');
        card.setAttribute('data-delay', (index * 100).toString());
      }
    });
  }
  
  // Education cards grid
  const eduGrid = document.querySelector('.edu-grid');
  if (eduGrid) {
    const eduCards = eduGrid.querySelectorAll('.edu-card');
    eduCards.forEach((card, index) => {
      if (!card.hasAttribute('data-delay')) {
        card.setAttribute('data-delay', (index * 150).toString());
      }
    });
  }
  
  // Qualification cards grid
  const qualGrid = document.querySelector('.qual-grid');
  if (qualGrid) {
    const qualCards = qualGrid.querySelectorAll('.qual-card');
    qualCards.forEach((card, index) => {
      if (!card.hasAttribute('data-delay')) {
        card.setAttribute('data-delay', (index * 100).toString());
      }
    });
  }
  
  // Highlights cards grid (Home page)
  const highlightsCards = document.querySelector('.highlights .cards');
  if (highlightsCards) {
    const cards = highlightsCards.querySelectorAll('.card');
    cards.forEach((card, index) => {
      if (!card.classList.contains('stagger-item')) {
        card.classList.add('stagger-item');
        card.setAttribute('data-delay', (index * 150).toString());
      }
    });
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
  else if (path.includes('pictures.html')) current = 'pictures';

  navLinks.forEach(link => {
    const isActive = link.dataset.nav === current;
    link.classList.toggle('active', isActive);
    if (isActive) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
};

// Pictures Gallery
const pictures = [
  { src: '../images/picture1.jpg',  },
  { src: '../images/picture2.jpg', },
  { src: '../images/picture3.jpg',  },
  { src: '../images/picture4.jpg',  },
 
];

let currentPictureIndex = 0;
const picturesGrid = document.getElementById('pictures-grid');
const picturesLightbox = document.getElementById('pictures-lightbox');
const picturesLightboxImage = document.getElementById('pictures-lightbox-image');
const picturesLightboxCaption = document.getElementById('pictures-lightbox-caption');
const picturesLightboxClose = document.getElementById('pictures-lightbox-close');
const picturesLightboxPrev = document.getElementById('pictures-lightbox-prev');
const picturesLightboxNext = document.getElementById('pictures-lightbox-next');

const renderPictures = () => {
  if (!picturesGrid) return;
  picturesGrid.innerHTML = '';

  const fragment = document.createDocumentFragment();
  pictures.forEach((picture, index) => {
    const item = document.createElement('div');
    item.className = 'picture-item stagger-item';
    item.setAttribute('data-delay', (index * 50).toString());
    item.setAttribute('role', 'listitem');
    item.setAttribute('tabindex', '0');
    item.setAttribute('aria-label', `View ${picture.alt}`);
    item.innerHTML = `
      <img src="${picture.src}" alt="${picture.alt}" loading="lazy" data-index="${index}">
    `;
    item.addEventListener('click', () => openPicturesLightbox(index));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openPicturesLightbox(index);
      }
    });
    fragment.appendChild(item);
  });

  picturesGrid.appendChild(fragment);
  
  // Re-initialize reveals for newly rendered pictures
  setTimeout(() => {
    initReveals();
  }, 50);
};

const openPicturesLightbox = (index) => {
  if (!picturesLightbox || !pictures.length) return;
  currentPictureIndex = index;
  updatePicturesLightbox();
  picturesLightbox.classList.add('open');
  picturesLightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
};

const closePicturesLightbox = () => {
  if (!picturesLightbox) return;
  picturesLightbox.classList.remove('open');
  picturesLightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
};

const updatePicturesLightbox = () => {
  if (!picturesLightbox || !pictures.length) return;
  const picture = pictures[currentPictureIndex];
  if (!picture) return;
  
  if (picturesLightboxImage) {
    picturesLightboxImage.src = picture.src;
    picturesLightboxImage.alt = picture.alt;
  }
  if (picturesLightboxCaption) {
    picturesLightboxCaption.textContent = picture.caption || '';
  }
};

const nextPicture = () => {
  if (!pictures.length) return;
  currentPictureIndex = (currentPictureIndex + 1) % pictures.length;
  updatePicturesLightbox();
};

const prevPicture = () => {
  if (!pictures.length) return;
  currentPictureIndex = (currentPictureIndex - 1 + pictures.length) % pictures.length;
  updatePicturesLightbox();
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

// Pictures gallery initialization
renderPictures();

// Pictures lightbox event listeners
picturesLightboxClose?.addEventListener('click', closePicturesLightbox);
picturesLightboxPrev?.addEventListener('click', prevPicture);
picturesLightboxNext?.addEventListener('click', nextPicture);
picturesLightbox?.querySelector('.lightbox-backdrop')?.addEventListener('click', closePicturesLightbox);

// Keyboard navigation for pictures lightbox
document.addEventListener('keydown', event => {
  if (picturesLightbox?.classList.contains('open')) {
    if (event.key === 'Escape') {
      closePicturesLightbox();
    } else if (event.key === 'ArrowRight') {
      nextPicture();
    } else if (event.key === 'ArrowLeft') {
      prevPicture();
    }
  }
});