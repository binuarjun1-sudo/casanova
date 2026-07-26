/* ==========================================================================
   CASANOVA — B.Com 2026–2029
   script.js
   Loads content.json, renders it into the page, then wires up all
   interactivity (loader, nav, particles, reveals, counters, gallery,
   lightbox, GSAP).
   ========================================================================== */

document.addEventListener('DOMContentLoaded', async () => {

  /* ------------------------------------------------------------------
     0. LOAD CONTENT
     ------------------------------------------------------------------ */
  let content;
  try {
    const res = await fetch('content.json', { cache: 'no-store' });
    content = await res.json();
  } catch (err) {
    console.error('Could not load content.json — using page as-is.', err);
    content = null;
  }

  if (content) renderContent(content);


  /* ------------------------------------------------------------------
     1. LOADER
     ------------------------------------------------------------------ */
  const loader = document.getElementById('loader');
  document.body.style.overflow = 'hidden';
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('loader-hidden');
      document.body.style.overflow = '';
    }, 2000);
  });
  setTimeout(() => { document.body.style.overflow = ''; }, 2200);


  /* ------------------------------------------------------------------
     2. NAVBAR — scroll state, mobile toggle, active link
     ------------------------------------------------------------------ */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navLinkEls = document.querySelectorAll('.nav-link[href^="#"]');

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  navLinkEls.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  const sections = document.querySelectorAll('main section[id]');
  const highlightNav = () => {
    let current = 'home';
    const scrollPos = window.scrollY + 140;
    sections.forEach(sec => {
      if (scrollPos >= sec.offsetTop) current = sec.id;
    });
    navLinkEls.forEach(link => {
      link.classList.toggle('active-link', link.getAttribute('href') === `#${current}`);
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();


  /* ------------------------------------------------------------------
     3. HERO PARTICLES
     ------------------------------------------------------------------ */
  const particleField = document.getElementById('particles');
  const PARTICLE_COUNT = window.innerWidth < 700 ? 20 : 40;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    const size = Math.random() * 2 + 1;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.left = `${Math.random() * 100}%`;
    p.style.bottom = `-10px`;
    p.style.animationDuration = `${Math.random() * 10 + 10}s`;
    p.style.animationDelay = `${Math.random() * 12}s`;
    particleField.appendChild(p);
  }


  /* ------------------------------------------------------------------
     4. SCROLL REVEAL
     ------------------------------------------------------------------ */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


  /* ------------------------------------------------------------------
     5. ANIMATED COUNTERS
     ------------------------------------------------------------------ */
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1600;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = target;
        }
      };
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));


  /* ------------------------------------------------------------------
     6. GALLERY — lightbox behaviour (grid itself built in renderContent)
     ------------------------------------------------------------------ */
  const galleryImages = (content && content.gallery) ? content.gallery : [];
  const galleryGrid = document.getElementById('galleryGrid');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  let currentIndex = 0;

  const bigVersion = (src) => src.includes('picsum.photos') ? src.replace(/\/\d+\/\d+$/, '/1200/1200') : src;

  const openLightbox = (index) => {
    currentIndex = index;
    lightboxImg.src = bigVersion(galleryImages[index].src);
    lightboxImg.alt = galleryImages[index].alt || '';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };
  const showImage = (dir) => {
    currentIndex = (currentIndex + dir + galleryImages.length) % galleryImages.length;
    lightboxImg.src = bigVersion(galleryImages[currentIndex].src);
    lightboxImg.alt = galleryImages[currentIndex].alt || '';
  };

  galleryGrid.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item');
    if (item) openLightbox(parseInt(item.dataset.index, 10));
  });
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxNext.addEventListener('click', () => showImage(1));
  lightboxPrev.addEventListener('click', () => showImage(-1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showImage(1);
    if (e.key === 'ArrowLeft') showImage(-1);
  });


  /* ------------------------------------------------------------------
     7. GSAP — parallax + orchestrated reveals
     ------------------------------------------------------------------ */
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.to('.hero-spotlight', {
      y: 120,
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
    });

    gsap.to('.hero-logo', {
      y: 60, opacity: 0.4,
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
    });

    gsap.fromTo('.timeline-line',
      { scaleY: 0 },
      {
        scaleY: 1, transformOrigin: 'top', ease: 'none',
        scrollTrigger: { trigger: '.timeline', start: 'top 70%', end: 'bottom 90%', scrub: 1 }
      }
    );
  }

});


/* ==========================================================================
   RENDER CONTENT — builds all dynamic sections from content.json
   ========================================================================== */
function renderContent(content) {
  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el && value !== undefined) el.textContent = value;
  };
  const setHTML = (id, value) => {
    const el = document.getElementById(id);
    if (el && value !== undefined) el.innerHTML = value;
  };

  // ----- Hero -----
  if (content.hero) {
    setText('heroEyebrow', content.hero.eyebrow);
    setHTML('heroTitle', `${content.hero.titleLine1}<br><span>${content.hero.titleLine2}</span>`);
    setHTML('heroSubtitle', `${content.hero.subtitleLine1}<br>${content.hero.subtitleLine2}`);
  }

  // ----- About -----
  if (content.about) {
    setText('aboutEyebrow', content.about.eyebrow);
    setText('aboutTitle', content.about.title);

    const aboutWrap = document.getElementById('aboutParagraphs');
    aboutWrap.innerHTML = '';
    (content.about.paragraphs || []).forEach(text => {
      const p = document.createElement('p');
      p.className = 'about-text reveal';
      p.textContent = text;
      aboutWrap.appendChild(p);
    });
  }

  // ----- Stats -----
  const statsGrid = document.getElementById('statsGrid');
  statsGrid.innerHTML = '';
  (content.stats || []).forEach(stat => {
    const card = document.createElement('div');
    card.className = 'stat-card reveal';
    card.innerHTML = `
      <span class="stat-number" data-target="${stat.target}">0</span>${stat.suffix ? `<span class="stat-plus">${stat.suffix}</span>` : ''}
      <p class="stat-label">${stat.label}</p>
    `;
    statsGrid.appendChild(card);
  });

  // ----- Timeline -----
  const timelineWrap = document.getElementById('timelineItems');
  timelineWrap.innerHTML = '';
  (content.timeline || []).forEach(item => {
    const el = document.createElement('div');
    el.className = 'timeline-item reveal';
    el.innerHTML = `
      <div class="timeline-dot"></div>
      <div class="timeline-card">
        <span class="timeline-tag">${item.tag}</span>
        <h3>${item.title}</h3>
        <p>${item.text}</p>
      </div>
    `;
    timelineWrap.appendChild(el);
  });

  // ----- Gallery -----
  const galleryGrid = document.getElementById('galleryGrid');
  galleryGrid.innerHTML = '';
  (content.gallery || []).forEach((img, i) => {
    const item = document.createElement('div');
    item.className = 'gallery-item reveal';
    item.dataset.index = i;
    item.innerHTML = `<img src="${img.src}" alt="${img.alt || ''}" loading="lazy">`;
    galleryGrid.appendChild(item);
  });

  // ----- Team -----
  const teamGrid = document.getElementById('teamGrid');
  teamGrid.innerHTML = '';
  (content.team || []).forEach(member => {
    const card = document.createElement('div');
    card.className = 'team-card reveal';
    card.innerHTML = `
      <div class="team-photo">
        <img src="${member.photo}" alt="" onerror="this.parentElement.classList.add('no-img')">
      </div>
      <h3 class="team-name">${member.name}</h3>
      <p class="team-role">${member.role}</p>
    `;
    teamGrid.appendChild(card);
  });

  // ----- Instagram links -----
  if (content.instagram) {
    const navInsta = document.getElementById('navInstagram');
    const btnInsta = document.getElementById('instagramBtn');
    if (navInsta) navInsta.href = content.instagram;
    if (btnInsta) btnInsta.href = content.instagram;
  }

  // ----- Footer -----
  if (content.footer) {
    setHTML('footerQuote', `&ldquo;${content.footer.quote}&rdquo;`);
    setHTML('footerCredit', content.footer.credit);
    setText('footerMeta', content.footer.meta);
  }

  // Re-observe any elements that got freshly injected with .reveal
  // (main observer is created after this function runs in DOMContentLoaded)
}
