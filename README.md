# CASANOVA — B.Com 2026–2029

The official digital identity of the B.Com 2026–2029 batch. A static, single-page site built with plain HTML, CSS and JavaScript — no build tools, no backend, deploys straight to GitHub Pages.

## Project structure

```
/
├── index.html          Page markup (all sections)
├── style.css            All styles
├── script.js             All behaviour (loader, nav, particles, counters, gallery, lightbox, GSAP)
├── README.md
└── assets/
    ├── logo.png          Site emblem (navbar + hero + favicon)
    ├── gallery/           Real batch photos go here
    ├── team/               Team member photos go here
    └── icons/               Extra icons/social assets
```

## Editing text

Everything lives in plain text inside `index.html`. Open it in any text editor and search for the section you want to change:

| Section | Look for |
|---|---|
| Hero heading/subtitle | `<section id="home" class="hero">` |
| About paragraphs | `<section id="about" class="section about">` |
| Statistics numbers | `data-target="65"` etc. — change the number, the counter animation picks it up automatically |
| Timeline events | `<section id="timeline" ...>` — each `.timeline-item` is one event card |
| Team members | `<section id="team" ...>` — each `.team-card` has a name and role |
| Footer quote | `<footer class="footer">` |
| Instagram link | search for `instagram.com` (appears twice — navbar + Instagram section) and replace with your real profile URL |

## Replacing the logo

Drop your logo file at `assets/logo.png` (transparent PNG recommended, square-ish, at least 256×256px). It's referenced in two places automatically:

- The browser tab favicon (`<link rel="icon" ...>` in `<head>`)
- The hero section (`<img src="assets/logo.png" class="hero-logo">`)

If no `logo.png` is present, the hero logo image simply hides itself and the rest of the page still works.

## Adding gallery images

The gallery currently uses placeholder photos loaded from the internet (`picsum.photos`) so the site works out of the box.

To use your own batch photos:

1. Add your image files to `assets/gallery/` (e.g. `assets/gallery/fresher-night-01.jpg`).
2. Open `script.js` and find the `galleryImages` array near the top of the gallery section.
3. Replace each entry's `src` with your local path, e.g.:

```js
const galleryImages = [
  { src: 'assets/gallery/fresher-night-01.jpg', alt: 'Freshers Night 2026' },
  { src: 'assets/gallery/sports-meet-02.jpg',  alt: 'Sports Meet 2027' },
  // add as many as you like
];
```

4. The masonry grid, lazy loading and lightbox all work automatically with any number of images — no other code changes needed.

## Adding/editing team photos

Team photos live at `assets/team/member1.jpg`, `member2.jpg`, etc. Replace those files with real photos (square images crop best, since they're displayed in circles). If a photo is missing, the card automatically falls back to a plain circle placeholder — nothing breaks.

To add more team members, copy an existing `.team-card` block in `index.html` and update the image path, name and role.

## Customizing colors

All colors are defined once, at the top of `style.css`, as CSS variables:

```css
:root {
  --bg: #050505;              /* page background */
  --card: #101010;             /* card background */
  --text: #ffffff;              /* primary text */
  --text-secondary: #b0b0b0;     /* muted text */
  --border: rgba(255,255,255,.08);        /* hairline borders */
  --border-strong: rgba(255,255,255,.16);  /* hover borders */
}
```

Change any value here and it updates everywhere on the site — no need to hunt through the rest of the file.

## Fonts

Headings use **Bebas Neue**, body text uses **Inter**, both loaded from Google Fonts in `index.html`. To swap a font, change the `<link href="https://fonts.googleapis.com/...">` tag and the matching `--font-display` / `--font-body` variables in `style.css`.

## Deploying to GitHub Pages

1. Create a new GitHub repository (public).
2. Upload all files (`index.html`, `style.css`, `script.js`, `README.md`, and the `assets/` folder) to the repository root — no build step needed.
3. In the repository, go to **Settings → Pages**.
4. Under **Source**, select the `main` branch and `/ (root)` folder, then save.
5. GitHub will give you a live URL (usually `https://your-username.github.io/repo-name/`) within a minute or two.
6. Any time you push changes to `main`, the live site updates automatically.

That's it — no npm, no build tools, no server required.

## Notes

- The site respects `prefers-reduced-motion` for visitors who've disabled animations at the OS level.
- All images use `loading="lazy"` where appropriate for performance.
- GSAP is loaded from a CDN for the parallax/scroll effects; the site's core layout and reveal animations work even if that CDN is blocked.
