const activities = [
  {
    id: 'asimov-2024',
    year: '2023',
    label: '2023/24',
    hours: 30,
    title: 'Premio Asimov 2024',
    type: 'Divulgazione scientifica',
    image: 'immagini/premio-asimov-2024.png',
    fit: 'contain',
    short: 'Lettura e recensione di un testo scientifico, con attenzione alla chiarezza e al giudizio personale.'
  },
  {
    id: 'realta-aumentata',
    year: '2023',
    label: '2023/24',
    hours: 26,
    title: 'Realtà aumentata',
    type: 'Scuola aumentata',
    image: 'immagini/realta-aumentata.svg',
    short: 'Unire realtà e digitale, rendendo visibile ciò che normalmente non lo è.'
  },
  {
    id: 'inail',
    year: '2023',
    label: '2023/24',
    hours: 4,
    title: 'Corso sicurezza INAIL',
    type: 'Sicurezza',
    image: 'immagini/inail.png',
    fit: 'contain',
    short: 'Formazione sui concetti base di prevenzione, rischio e comportamento responsabile.'
  },
  {
    id: 'maker-faire',
    year: '2024',
    label: '2024/25',
    hours: 7,
    title: 'Maker Faire 2024',
    type: 'Innovazione',
    image: 'immagini/maker-faire.png',
    short: 'Prototipi, robotica, elettronica e idee innovative viste da vicino.'
  },
  {
    id: 'asimov-2025',
    year: '2024',
    label: '2024/25',
    hours: 30,
    title: 'Premio Asimov 2025',
    type: 'Divulgazione scientifica',
    image: 'immagini/premio-asimov-2025.png',
    fit: 'contain',
    short: 'Seconda esperienza nel concorso, utile per migliorare lettura, sintesi e scrittura.'
  },
  {
    id: 'cisco',
    year: '2024',
    label: '2024/25',
    hours: 70,
    title: 'Cisco IT Essentials',
    type: 'Certificazione tecnica',
    image: 'immagini/cisco-it-essentials.png',
    fit: 'contain',
    short: 'Percorso tecnico su hardware, sistemi operativi, reti di base e troubleshooting.'
  },
  {
    id: 'betflag',
    year: '2025',
    label: '2025/26',
    hours: 36,
    title: 'Learn to Grow Softer Future',
    type: 'Attività in azienda',
    image: 'immagini/betflag.png',
    fit: 'contain',
    short: 'Esperienza in azienda per osservare organizzazione, ruoli e responsabilità.'
  },
  {
    id: 'bussola-app',
    year: '2025',
    label: '2025/26',
    hours: 12,
    title: 'Dalla bussola all’app',
    type: 'Territorio e applicazione',
    image: 'immagini/bussola-app.png',
    short: 'Escursione e applicazione digitale usata come supporto all’attività.'
  }
];

const grid = document.querySelector('[data-activity-grid]');
const modal = document.querySelector('[data-modal]');
const modalBody = document.querySelector('[data-modal-body]');
const closeModal = document.querySelector('[data-close]');
const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('[data-menu]');
const progressLine = document.querySelector('.cursor-line');

function mediaMarkup(activity, modalView = false) {
  const classes = modalView ? ['modal-image'] : ['activity-media'];
  if (activity.fit === 'contain' && !modalView) classes.push('contain');

  return `<div class="${classes.join(' ')}"><img src="${activity.image}" alt="${activity.title}"></div>`;
}

function renderActivities(filter = 'all') {
  if (!grid) return;
  grid.innerHTML = activities
    .filter(activity => filter === 'all' || activity.year === filter)
    .map(activity => `
      <article class="activity-card reveal visible" data-year="${activity.year}">
        ${mediaMarkup(activity)}
        <div class="activity-body">
          <div class="activity-meta">
            <span>${activity.label}</span>
            <span>${activity.hours} ore</span>
          </div>
          <h3>${activity.title}</h3>
          <p>${activity.short}</p>
          <button type="button" class="card-action" data-open="${activity.id}">Dettagli</button>
        </div>
      </article>
    `).join('');
}

function openActivity(id) {
  const activity = activities.find(item => item.id === id);
  if (!activity || !modal || !modalBody) return;

  modalBody.innerHTML = mediaMarkup(activity, true);

  if (typeof modal.showModal === 'function') {
    modal.showModal();
  } else {
    modal.setAttribute('open', 'open');
  }
}

function closeActivityModal() {
  if (!modal) return;
  if (typeof modal.close === 'function') modal.close();
  else modal.removeAttribute('open');
}

function initFilters() {
  document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      renderActivities(button.dataset.filter);
    });
  });
}

function initModal() {
  document.addEventListener('click', event => {
    const opener = event.target.closest('[data-open]');
    if (opener) openActivity(opener.dataset.open);
  });

  closeModal?.addEventListener('click', closeActivityModal);
  modal?.addEventListener('click', event => {
    const dialog = event.currentTarget;
    const rect = dialog.getBoundingClientRect();
    const isOutside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    if (isOutside) closeActivityModal();
  });
}

function initReveal() {
  const items = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(item => observer.observe(item));
}

function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.counter);
      let current = 0;
      const increment = Math.max(1, Math.ceil(target / 44));
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          el.textContent = target;
          clearInterval(timer);
        } else {
          el.textContent = current;
        }
      }, 22);
      observer.unobserve(el);
    });
  }, { threshold: 0.6 });

  counters.forEach(counter => observer.observe(counter));
}

function initNavigation() {
  const links = [...document.querySelectorAll('.nav-links a')];
  const sections = links
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });

  sections.forEach(section => observer.observe(section));

  links.forEach(link => {
    link.addEventListener('click', () => {
      menu?.classList.remove('open');
      menuToggle?.setAttribute('aria-expanded', 'false');
    });
  });
}

function initMenu() {
  menuToggle?.addEventListener('click', () => {
    const open = menu?.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(Boolean(open)));
  });
}

function initBackToTop() {
  document.querySelector('.back-to-top')?.addEventListener('click', event => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    history.replaceState(null, '', '#top');
  });
}

function initProgressLine() {
  const update = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    if (progressLine) progressLine.style.transform = `scaleX(${progress})`;
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}

renderActivities();
initFilters();
initModal();
initReveal();
initCounters();
initNavigation();
initMenu();
initBackToTop();
initProgressLine();
