const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');

const projects = [
  {
    title: 'Project 1',
    description: 'Flagship project description. Summarize the problem, your approach, and the measurable outcome.',
    image: '../images/project-placeholder.svg',
    tag: 'Featured',
    links: [
      { label: 'View repo', url: 'https://github.com/yourusername/project-1' },
      { label: 'Live demo', url: '#' }
    ]
  },
  {
    title: 'Project 2',
    description: 'Brief description of another project. Mention tools or stack used.',
    image: '../images/project-placeholder.svg',
    tag: 'Web',
    links: [
      { label: 'View repo', url: '#' }
    ]
  },
  {
    title: 'Project 3',
    description: 'Another highlight with outcomes or metrics. Keep it concise and clear.',
    image: '../images/project-placeholder.svg',
    tag: 'Design System',
    links: [
      { label: 'View repo', url: '#' }
    ]
  }
];

const renderProjects = () => {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  const fragment = document.createDocumentFragment();

  projects.forEach(project => {
    const card = document.createElement('article');
    card.className = 'project-card';
    card.innerHTML = `
      <img src="${project.image}" alt="${project.title} preview">
      <div class="project-body">
        <div class="pill">${project.tag}</div>
        <h3>${project.title}</h3>
        <p class="muted">${project.description}</p>
        <div class="project-links">
          ${project.links.map(link => `<a href="${link.url}" target="_blank" rel="noopener">${link.label}</a>`).join('')}
        </div>
      </div>
    `;
    fragment.appendChild(card);
  });

  grid.appendChild(fragment);
};

const toggleNav = () => {
  const isOpen = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
};

navToggle?.addEventListener('click', toggleNav);

// Close menu when clicking outside on small screens
document.addEventListener('click', event => {
  if (!nav || !navToggle) return;
  const isNavClick = nav.contains(event.target) || navToggle.contains(event.target);
  if (!isNavClick && nav.classList.contains('open')) {
    toggleNav();
  }
});

renderProjects();

