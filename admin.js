/* ==========================================================================
   CASANOVA — Admin Panel logic
   Loads content.json into the form, and exports edited data as a
   downloadable content.json file.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const loadStatus = document.getElementById('loadStatus');
  const downloadStatus = document.getElementById('downloadStatus');

  const templates = {
    stats: document.getElementById('statRowTemplate'),
    timeline: document.getElementById('timelineRowTemplate'),
    gallery: document.getElementById('galleryRowTemplate'),
    team: document.getElementById('teamRowTemplate'),
  };
  const lists = {
    stats: document.getElementById('statsList'),
    timeline: document.getElementById('timelineList'),
    gallery: document.getElementById('galleryList'),
    team: document.getElementById('teamList'),
  };

  /* ------------------------------------------------------------------
     Row builders
     ------------------------------------------------------------------ */
  function addRow(type, data = {}) {
    const clone = templates[type].content.cloneNode(true);
    const row = clone.querySelector('.admin-repeat-row');

    if (type === 'stats') {
      row.querySelector('.stat-target').value = data.target ?? '';
      row.querySelector('.stat-suffix').value = data.suffix ?? '';
      row.querySelector('.stat-label').value = data.label ?? '';
    }
    if (type === 'timeline') {
      row.querySelector('.tl-tag').value = data.tag ?? '';
      row.querySelector('.tl-title').value = data.title ?? '';
      row.querySelector('.tl-text').value = data.text ?? '';
    }
    if (type === 'gallery') {
      row.querySelector('.gal-src').value = data.src ?? '';
      row.querySelector('.gal-alt').value = data.alt ?? '';
    }
    if (type === 'team') {
      row.querySelector('.team-name').value = data.name ?? '';
      row.querySelector('.team-role').value = data.role ?? '';
      row.querySelector('.team-photo').value = data.photo ?? '';
    }

    row.querySelector('.admin-btn-remove').addEventListener('click', () => row.remove());
    lists[type].appendChild(row);
  }

  document.querySelectorAll('[data-add]').forEach(btn => {
    btn.addEventListener('click', () => addRow(btn.dataset.add));
  });

  /* ------------------------------------------------------------------
     Populate the whole form from a content object
     ------------------------------------------------------------------ */
  function populateForm(content) {
    // Hero
    if (content.hero) {
      document.getElementById('heroEyebrow').value = content.hero.eyebrow || '';
      document.getElementById('heroTitleLine1').value = content.hero.titleLine1 || '';
      document.getElementById('heroTitleLine2').value = content.hero.titleLine2 || '';
      document.getElementById('heroSubtitleLine1').value = content.hero.subtitleLine1 || '';
      document.getElementById('heroSubtitleLine2').value = content.hero.subtitleLine2 || '';
    }
    // About
    if (content.about) {
      document.getElementById('aboutEyebrow').value = content.about.eyebrow || '';
      document.getElementById('aboutTitle').value = content.about.title || '';
      document.getElementById('aboutParagraphs').value = (content.about.paragraphs || []).join('\n');
    }
    // Repeatable lists
    Object.keys(lists).forEach(key => { lists[key].innerHTML = ''; });
    (content.stats || []).forEach(s => addRow('stats', s));
    (content.timeline || []).forEach(t => addRow('timeline', t));
    (content.gallery || []).forEach(g => addRow('gallery', g));
    (content.team || []).forEach(t => addRow('team', t));

    // Instagram
    document.getElementById('instagramLink').value = content.instagram || '';

    // Footer
    if (content.footer) {
      document.getElementById('footerQuote').value = content.footer.quote || '';
      document.getElementById('footerCredit').value = content.footer.credit || '';
      document.getElementById('footerMeta').value = content.footer.meta || '';
    }
  }

  /* ------------------------------------------------------------------
     Load content.json
     ------------------------------------------------------------------ */
  async function loadContent() {
    loadStatus.textContent = 'Loading…';
    loadStatus.className = 'admin-status';
    try {
      const res = await fetch('content.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('File not found');
      const data = await res.json();
      populateForm(data);
      loadStatus.textContent = 'Loaded current site data ✓';
      loadStatus.classList.add('is-success');
    } catch (err) {
      loadStatus.textContent = 'Could not load content.json — start filling the form manually, or check the file exists in this folder.';
    }
  }

  document.getElementById('loadBtn').addEventListener('click', loadContent);
  loadContent(); // auto-load on page open

  /* ------------------------------------------------------------------
     Collect form data back into a content object
     ------------------------------------------------------------------ */
  function collectForm() {
    const content = {
      hero: {
        eyebrow: document.getElementById('heroEyebrow').value.trim(),
        titleLine1: document.getElementById('heroTitleLine1').value.trim(),
        titleLine2: document.getElementById('heroTitleLine2').value.trim(),
        subtitleLine1: document.getElementById('heroSubtitleLine1').value.trim(),
        subtitleLine2: document.getElementById('heroSubtitleLine2').value.trim(),
      },
      about: {
        eyebrow: document.getElementById('aboutEyebrow').value.trim(),
        title: document.getElementById('aboutTitle').value.trim(),
        paragraphs: document.getElementById('aboutParagraphs').value
          .split('\n').map(s => s.trim()).filter(Boolean),
      },
      stats: [...lists.stats.querySelectorAll('.admin-repeat-row')].map(row => ({
        target: parseInt(row.querySelector('.stat-target').value, 10) || 0,
        suffix: row.querySelector('.stat-suffix').value.trim(),
        label: row.querySelector('.stat-label').value.trim(),
      })),
      timeline: [...lists.timeline.querySelectorAll('.admin-repeat-row')].map(row => ({
        tag: row.querySelector('.tl-tag').value.trim(),
        title: row.querySelector('.tl-title').value.trim(),
        text: row.querySelector('.tl-text').value.trim(),
      })),
      gallery: [...lists.gallery.querySelectorAll('.admin-repeat-row')].map(row => ({
        src: row.querySelector('.gal-src').value.trim(),
        alt: row.querySelector('.gal-alt').value.trim(),
      })),
      team: [...lists.team.querySelectorAll('.admin-repeat-row')].map(row => ({
        name: row.querySelector('.team-name').value.trim(),
        role: row.querySelector('.team-role').value.trim(),
        photo: row.querySelector('.team-photo').value.trim(),
      })),
      instagram: document.getElementById('instagramLink').value.trim(),
      footer: {
        quote: document.getElementById('footerQuote').value.trim(),
        credit: document.getElementById('footerCredit').value.trim(),
        meta: document.getElementById('footerMeta').value.trim(),
      },
    };
    return content;
  }

  /* ------------------------------------------------------------------
     Download content.json
     ------------------------------------------------------------------ */
  document.getElementById('downloadBtn').addEventListener('click', () => {
    const content = collectForm();
    const json = JSON.stringify(content, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'content.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    downloadStatus.textContent = 'Downloaded ✓ — now upload this file to GitHub to update your live site.';
    downloadStatus.classList.add('is-success');
  });

});
