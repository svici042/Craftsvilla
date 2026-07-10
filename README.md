# CRAFTSVILLA

CRAFTSVILLA is a static, responsive craft marketplace concept featuring local makers, products, workshops, gallery inspiration, booking, and feedback pages.

## Technology

- HTML5
- CSS3
- Vanilla JavaScript
- Local image assets

No framework, build step, backend, database, or external service is required.

## Pages and features

- `index.html`: landing page, product categories, filters, cart demonstration, scroll reveals, and lightweight parallax
- `gallery.html`: responsive craft gallery
- `booking.html`: local demonstration booking form with inline validation
- `feedback.html`: testimonials and a locally handled feedback form
- Shared responsive navigation and English/Norwegian language switching
- Keyboard focus styles and reduced-motion support
- Responsive WebP images with original PNG/JPEG fallbacks

Form submissions are demonstrations only. They are validated in the browser, are not sent anywhere, and are not stored.

Images used by the interface have optimized local WebP variants. Hero and parallax images use responsive `srcset` candidates, while card images use dimensions close to their rendered size. Original files remain as fallbacks. The parallax effect runs only while its section is visible, is disabled on small screens, and is fully disabled when reduced motion is requested.

## Run locally

Open `index.html` in a browser. For behavior closest to GitHub Pages, serve the folder with any simple static server; no installation is needed.

## GitHub Pages

Push the source files to a GitHub repository, then enable Pages for the repository branch and root folder. All links and asset paths are relative and Pages-safe.

## Structure

```text
CRAFTSVILLA/
├── index.html, gallery.html, booking.html, feedback.html
├── style.css
├── nav.js, script.js, form-validation.js, booking.js, feedback.js
└── images/
```

## Known limitations

- There is no checkout or persistent cart.
- Forms do not submit to a server.
- Product and category copy is stored directly in JavaScript and is not translated.
- Original fallback images increase repository size even though modern browsers load the smaller WebP variants.
