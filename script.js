/* ==========================================================================
   CASANOVA — B.Com 2026–2029
   script.js
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------
     1. LOADER
     ------------------------------------------------------------------ */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('loader-hidden');
      document.body.style.overflow = '';
    }, 2000);
  });
  // Prevent scroll while loader is visible
  document.body.style.overflow = 'hidden';
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

  // Highlight active section link on scroll
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
     4. SCROLL REVEAL (IntersectionObserver — works with/without GSAP)
     ------------------------------------------------------------------ */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ------------------------------------------------------------------
     5. ANIMATED COUNTERS
     ------------------------------------------------------------------ */
  const counters = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1600;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
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

  counters.forEach(el => counterObserver.observe(el));


  /* ------------------------------------------------------------------
     6. GALLERY — build grid + lightbox
     ------------------------------------------------------------------ */
  // Placeholder image set (swap paths for real photos in /assets/gallery/)
  const galleryImages = [
    { src: 'https://picsum.photos/seed/casanova1/600/800', alt: 'Batch memory 1' },
    { src: 'https://picsum.photos/seed/casanova2/600/450', alt: 'Batch memory 2' },
    { src: 'https://picsum.photos/seed/casanova3/600/700', alt: 'Batch memory 3' },
    { src: 'https://picsum.photos/seed/casanova4/600/500', alt: 'Batch memory 4' },
    { src: 'https://picsum.photos/seed/casanova5/600/780', alt: 'Batch memory 5' },
    { src: 'https://picsum.photos/seed/casanova6/600/460', alt: 'Batch memory 6' },
    { src: 'https://picsum.photos/seed/casanova7/600/640', alt: 'Batch memory 7' },
    { src: 'https://picsum.photos/seed/casanova8/600/520', alt: 'Batch memory 8' },
    { src: 'https://picsum.photos/seed/casanova9/600/720', alt: 'Batch memory 9' },
  ];

  const galleryGrid = document.getElementById('galleryGrid');
  galleryImages.forEach((img, i) => {
    const item = document.createElement('div');
    item.className = 'gallery-item reveal';
    item.dataset.index = i;
    item.innerHTML = `<img src="${img.src}" alt="${img.alt}" loading="lazy">`;
    galleryGrid.appendChild(item);
    revealObserver.observe(item);
  });

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  let currentIndex = 0;

  const openLightbox = (index) => {
    currentIndex = index;
    lightboxImg.src = galleryImages[index].src.replace('/600/', '/1200/');
    lightboxImg.alt = galleryImages[index].alt;
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
    lightboxImg.src = galleryImages[currentIndex].src.replace('/600/', '/1200/');
    lightboxImg.alt = galleryImages[currentIndex].alt;
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
     7. GSAP — parallax + orchestrated reveals (progressive enhancement)
     ------------------------------------------------------------------ */
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    // Hero parallax on the spotlight + logo
    gsap.to('.hero-spotlight', {
      y: 120,
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });

    gsap.to('.hero-logo', {
      y: 60,
      opacity: 0.4,
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });

    // Timeline line draw-in
    gsap.fromTo('.timeline-line',
      { scaleY: 0 },
      {
        scaleY: 1,
        transformOrigin: 'top',
        ease: 'none',
        scrollTrigger: {
          trigger: '.timeline',
          start: 'top 70%',
          end: 'bottom 90%',
          scrub: 1
        }
      }
    );
  }

});
