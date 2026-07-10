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
- `cart.html`: persistent local demonstration cart with quantity controls
- `checkout.html`: simulated checkout that creates a local demonstration order
- `admin-orders.html`: non-secure local order-management demonstration
- Shared responsive navigation and English/Norwegian language switching
- Keyboard focus styles and reduced-motion support
- Responsive WebP images with original PNG/JPEG fallbacks

Booking and feedback submissions are demonstrations only. Checkout orders are stored locally in the current browser so the cart and administration workflow can be demonstrated.

Images used by the interface have optimized local WebP variants. Hero and parallax images use responsive `srcset` candidates, while card images use dimensions close to their rendered size. Original files remain as fallbacks. The parallax effect runs only while its section is visible, is disabled on small screens, and is fully disabled when reduced motion is requested.

## Run locally

Open `index.html` in a browser. For behavior closest to GitHub Pages, serve the folder with any simple static server; no installation is needed.

## GitHub Pages

Push the source files to a GitHub repository, then enable Pages for the repository branch and root folder. All links and asset paths are relative and Pages-safe.

## Structure

```text
CRAFTSVILLA/
├── index.html, gallery.html, booking.html, feedback.html
├── cart.html, checkout.html, admin-orders.html
├── style.css
├── product-data.js, nav.js, script.js, form-validation.js
├── cart.js, checkout.js, admin-orders.js, booking.js, feedback.js
└── images/
```

## Known limitations

- Forms do not submit to a server.
- Original fallback images increase repository size even though modern browsers load the smaller WebP variants.

## Demo architecture and production limitations

The cart, checkout, order creation, simulated payment choices, and administrator page are front-end demonstrations. Cart and order records use versioned `localStorage` keys and exist only in the current browser. No real money is transferred, no card number or CVV is collected, and the administrator page is not securely protected. `noindex` reduces search-engine discovery but is not security.

A production version would require a secure HTTPS backend, database, authentication, authorization, server-side validation, protected administrator routes, secure order APIs, and integration with a real payment provider. Sensitive payment credentials must be handled only by the payment provider and must never be stored in this front-end.
