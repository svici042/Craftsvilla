document.documentElement.classList.add("js");

const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector("nav");
const langToggle = document.querySelector("#langToggle");
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

// Opens and closes the mobile navigation menu.
if (navToggle && navMenu) {
  function closeMenu() {
    navMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation");
  }

  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation",
    );
  });

  navMenu.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navMenu.classList.contains("open")) {
      closeMenu();
      navToggle.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1100) closeMenu();
  });
}

// Text used by the language switcher for every page.
const translations = {
  en: {
    navHome: "Home",
    navProducts: "Products",
    navWorkshops: "Workshops",
    navGallery: "Gallery",
    navBooking: "Booking",
    navFeedback: "Feedback",
    navContact: "Contact",
    shopNow: "Shop now",
    pageTitleHome: "CRAFTSVILLA",
    pageTitleGallery: "CRAFTSVILLA — Gallery",
    pageTitleBooking: "CRAFTSVILLA — Booking",
    pageTitleFeedback: "CRAFTSVILLA — Feedback",
    heroEyebrow: "HANDMADE MARKETPLACE",
    heroHeading: "Find handmade craft, stories and local makers in one place.",
    heroText:
      "Craftsvilla connects visitors with artisan products, creative workshops and a gallery-like shopping experience. The layout is ready for DOM updates, filters, arrays, objects and event listeners.",
    exploreProducts: "Explore products",
    joinWorkshop: "Join workshop",
    heroGallery: "Gallery",
    heroBooking: "Booking",
    heroFeedback: "Feedback",
    parallaxEyebrow: "MAKER STORIES",
    parallaxHeading: "Slow craft, warm materials, and local creativity.",
    parallaxText:
      "Explore a calm handmade world where products, workshops, and gallery moments share the same craft spirit.",
    statsMakers: "Makers",
    statsProducts: "Products",
    statsWorkshops: "Workshops",
    categoryHeading: "Browse by craft category",
    featuredProducts: "Featured products",
    filterAll: "All",
    filterCeramics: "Ceramics",
    filterTextiles: "Textiles",
    filterWoodwork: "Woodwork",
    filterJewelry: "Jewelry",
    filterGroupLabel: "Product filters",
    addToCart: "Add to cart",
    addProductToCart: "Add {productName} to cart",
    cartEmpty: "Cart is empty",
    cartSingle: "{productName} added. 1 item in cart.",
    cartMultiple: "{productName} added. {count} items in cart.",
    filterEmpty: "No products are available in this category yet.",
    categoryAction: "View products →",
    categoryCeramicsName: "Ceramics",
    categoryCeramicsText: "Clay forms, vases and warm table objects.",
    categoryTextilesName: "Textiles",
    categoryTextilesText: "Woven bags, soft goods and handmade fabrics.",
    categoryWoodworkName: "Woodwork",
    categoryWoodworkText: "Oak trays, small furniture and useful objects.",
    categoryJewelryName: "Jewelry",
    categoryJewelryText: "Minimal rings, earrings and wearable craft.",
    productMosaicDescription:
      "Set includes a frame, A4 wooden board, colored stones, and adhesive.",
    productWatercolorDescription:
      "Set includes a frame, watercolor paper with a template, paints, and brushes.",
    productCanvasDescription:
      "Set includes a frame, acrylic paper with a template, paints, and brushes.",
    lightboxOpen: "Open larger image: {caption}",
    lightboxClose: "Close image preview",
    lightboxPrevious: "Previous image",
    lightboxNext: "Next image",
    homeGalleryHeading: "Gallery",
    homeGalleryPortrait: "Handmade portrait",
    homeGalleryCeramics: "Ceramics & textiles",
    homeGalleryWreath: "Laurel wreath",
    footerText:
      "Handmade marketplace for craft, workshops and creative makers.",
    galleryEyebrow: "GALLERY",
    galleryHeading: "Explore handmade creations and workshop highlights.",
    galleryText:
      "A visual collection of the craft pieces, art projects, and studio moments that bring Craftsvilla to life.",
    gallerySectionHeading: "Featured gallery",
    galleryHeroImageAlt: "Gallery highlight",
    galleryCardPottery: "Pottery and ceramics",
    galleryCardPotteryAlt: "Pottery craft",
    galleryCardWreath: "Decorative wreath",
    galleryCardWreathAlt: "Art wreath",
    galleryCardWatercolor: "Watercolor set",
    galleryCardWatercolorAlt: "Watercolor painting",
    galleryCardCanvas: "Canvas art",
    galleryCardCanvasAlt: "Canvas painting",
    galleryCardJewelry: "Jewelry pieces",
    galleryCardJewelryAlt: "Jewelry collection",
    galleryCardWoodwork: "Woodwork studio",
    galleryCardWoodworkAlt: "Woodwork studio",
    bookingEyebrow: "BOOK A WORKSHOP",
    bookingHeading: "Reserve your spot in a hands-on craft session.",
    bookingText:
      "Choose your favorite workshop, select a date and time, and book a creative moment with expert makers.",
    bookingCta: "Book now",
    bookingDetailsHeading: "Booking details",
    bookingExperienceHeading: "Craft workshop experiences",
    bookingExperienceText:
      "Every booking includes a curated kit, step-by-step guidance, and a friendly studio atmosphere. Pick the session that fits your skill level and creative goal.",
    bookingList1: "Small groups with expert makers",
    bookingList2: "All materials are included",
    bookingList3: "Flexible weekend and evening slots",
    bookingHighlight1: "Workshop types",
    bookingHighlight2: "Available dates",
    bookingHighlight3: "Local craft focus",
    bookingFormHeading: "Book your session",
    bookingLabelName: "Full name",
    bookingPlaceholderName: "Your name",
    bookingLabelEmail: "Email address",
    bookingPlaceholderEmail: "you@example.com",
    bookingLabelWorkshop: "Workshop type",
    bookingOptionChoose: "Choose a workshop",
    bookingOptionWatercolor: "Watercolor painting",
    bookingOptionMosaic: "Mosaic art",
    bookingOptionCanvas: "Canvas craft",
    bookingLabelDate: "Preferred date",
    bookingLabelMessage: "Message",
    bookingPlaceholderMessage: "Any special requests?",
    bookingConfirmButton: "Confirm booking",
    bookingImageAlt: "Workshop booking",
    bookingValidationMissing: "Please complete all required booking fields.",
    bookingValidationSuccess:
      "Thank you, {name}. Your details were validated locally; this demo did not send a booking request.",
    promptEnterName: "Enter your name:",
    feedbackEyebrow: "FEEDBACK",
    feedbackHeading: "Share your experience with Craftsvilla.",
    feedbackText:
      "Tell us what you loved, how we can improve, and what craft experiences you'd like to see next.",
    feedbackReview1:
      '"The workshop was inspiring and the host guided us through every step. I left with a beautiful piece and a new craft skill."',
    feedbackReview2:
      '"Lovely atmosphere, excellent materials, and an easy booking process. The booking page made it straightforward to reserve my spot."',
    feedbackReview3:
      '"I enjoyed the gallery and the variety of crafts. The booking and feedback flow is clean and helpful."',
    feedbackFormHeading: "Send your feedback",
    feedbackLabelName: "Your name",
    feedbackLabelEmail: "Email",
    feedbackLabelMessage: "Message",
    feedbackPlaceholderName: "Name",
    feedbackPlaceholderEmail: "Email address",
    feedbackPlaceholderMessage: "Write your feedback here...",
    feedbackSubmitButton: "Submit feedback",
    feedbackImageAlt: "Artisan working on a handmade piece in the studio",
    feedbackValidationMissing: "Please enter your name and feedback message.",
    feedbackValidationSuccess:
      "Thank you, {name}. Your feedback was validated locally and was not sent or stored.",
  },
  no: {
    navHome: "Hjem",
    navProducts: "Produkter",
    navWorkshops: "Workshops",
    navGallery: "Galleri",
    navBooking: "Booking",
    navFeedback: "Tilbakemelding",
    navContact: "Kontakt",
    shopNow: "Handle nå",
    pageTitleHome: "CRAFTSVILLA",
    pageTitleGallery: "CRAFTSVILLA — Galleri",
    pageTitleBooking: "CRAFTSVILLA — Booking",
    pageTitleFeedback: "CRAFTSVILLA — Tilbakemelding",
    heroEyebrow: "HÅNDLAGET MARKED",
    heroHeading:
      "Finn håndlagde produkter, historier og lokale skapere på ett sted.",
    heroText:
      "Craftsvilla kobler besøkende med kunsthåndverk, kreative workshops og en gallerilignende handleopplevelse. Layouten er klar for DOM-oppdateringer, filtre, arrays, objekter og event-lyttere.",
    exploreProducts: "Utforsk produkter",
    joinWorkshop: "Bli med workshop",
    heroGallery: "Galleri",
    heroBooking: "Booking",
    heroFeedback: "Tilbakemelding",
    parallaxEyebrow: "SKAPERHISTORIER",
    parallaxHeading:
      "Langsomt håndverk, varme materialer og lokal kreativitet.",
    parallaxText:
      "Utforsk en rolig håndlaget verden der produkter, workshops og galleriøyeblikk deler samme håndverksånd.",
    statsMakers: "Skapere",
    statsProducts: "Produkter",
    statsWorkshops: "Workshops",
    categoryHeading: "Bla gjennom håndverkskategorier",
    featuredProducts: "Utvalgte produkter",
    filterAll: "Alle",
    filterCeramics: "Keramikk",
    filterTextiles: "Tekstiler",
    filterWoodwork: "Trearbeid",
    filterJewelry: "Smykker",
    filterGroupLabel: "Produktfiltre",
    addToCart: "Legg i handlekurv",
    addProductToCart: "Legg {productName} i handlekurven",
    cartEmpty: "Handlekurven er tom",
    cartSingle: "{productName} er lagt til. 1 vare i handlekurven.",
    cartMultiple: "{productName} er lagt til. {count} varer i handlekurven.",
    filterEmpty: "Det finnes ingen produkter i denne kategorien ennå.",
    categoryAction: "Vis produkter →",
    categoryCeramicsName: "Keramikk",
    categoryCeramicsText: "Leireformer, vaser og varme borddetaljer.",
    categoryTextilesName: "Tekstiler",
    categoryTextilesText: "Vevde vesker, myke varer og håndlagde tekstiler.",
    categoryWoodworkName: "Trearbeid",
    categoryWoodworkText: "Eikebrett, små møbler og nyttige gjenstander.",
    categoryJewelryName: "Smykker",
    categoryJewelryText: "Enkle ringer, øredobber og brukskunst.",
    productMosaicDescription:
      "Settet inneholder ramme, A4-treplate, fargede steiner og lim.",
    productWatercolorDescription:
      "Settet inneholder ramme, akvarellpapir med mal, farger og pensler.",
    productCanvasDescription:
      "Settet inneholder ramme, akrylpapir med mal, farger og pensler.",
    lightboxOpen: "Åpne større bilde: {caption}",
    lightboxClose: "Lukk bildevisning",
    lightboxPrevious: "Forrige bilde",
    lightboxNext: "Neste bilde",
    homeGalleryHeading: "Galleri",
    homeGalleryPortrait: "Håndlaget portrett",
    homeGalleryCeramics: "Keramikk og tekstiler",
    homeGalleryWreath: "Laurbærkrans",
    footerText:
      "Håndlaget marked for kunsthåndverk, workshops og kreative skapere.",
    galleryEyebrow: "GALLERI",
    galleryHeading: "Utforsk håndlagde kreasjoner og workshop-høydepunkter.",
    galleryText:
      "En visuell samling av håndverksarbeid, kunstprosjekter og studioøyeblikk som gir Craftsvilla liv.",
    gallerySectionHeading: "Utvalgt galleri",
    galleryHeroImageAlt: "Galleri høydepunkt",
    galleryCardPottery: "Keramikk og porselen",
    galleryCardPotteryAlt: "Keramikk håndverk",
    galleryCardWreath: "Dekorativ krans",
    galleryCardWreathAlt: "Kunstkrans",
    galleryCardWatercolor: "Akvarellsett",
    galleryCardWatercolorAlt: "Akvarellmaling",
    galleryCardCanvas: "Lerretskunst",
    galleryCardCanvasAlt: "Lerretsmaling",
    galleryCardJewelry: "Smykker",
    galleryCardJewelryAlt: "Smykkekolleksjon",
    galleryCardWoodwork: "Treskjærerstudio",
    galleryCardWoodworkAlt: "Treskjærerstudio",
    bookingEyebrow: "BESTILL EN WORKSHOP",
    bookingHeading: "Reserver din plass i en praktisk håndverksøkt.",
    bookingText:
      "Velg din favorittworkshop, velg en dato og tid, og book et kreativt øyeblikk med erfarne skapere.",
    bookingCta: "Book nå",
    bookingDetailsHeading: "Bookingdetaljer",
    bookingExperienceHeading: "Opplevelser i håndverksworkshop",
    bookingExperienceText:
      "Hver booking inkluderer et kuratert sett, steg-for-steg veiledning og en hyggelig studioatmosfære. Velg sesjonen som passer ditt ferdighetsnivå og kreative mål.",
    bookingList1: "Små grupper med erfarne skapere",
    bookingList2: "Alt materiale er inkludert",
    bookingList3: "Fleksible helge- og kveldstider",
    bookingHighlight1: "Workshop-typer",
    bookingHighlight2: "Tilgjengelige datoer",
    bookingHighlight3: "Lokalt fokus på håndverk",
    bookingFormHeading: "Book din økt",
    bookingLabelName: "Fullt navn",
    bookingPlaceholderName: "Ditt navn",
    bookingLabelEmail: "E-postadresse",
    bookingPlaceholderEmail: "du@eksempel.no",
    bookingLabelWorkshop: "Workshop-type",
    bookingOptionChoose: "Velg en workshop",
    bookingOptionWatercolor: "Akvarellmaling",
    bookingOptionMosaic: "Mosaikk-kunst",
    bookingOptionCanvas: "Lerretsmaling",
    bookingLabelDate: "Foretrukket dato",
    bookingLabelMessage: "Melding",
    bookingPlaceholderMessage: "Spesielle ønsker?",
    bookingConfirmButton: "Bekreft booking",
    bookingImageAlt: "Workshopbooking",
    bookingValidationMissing: "Vennligst fyll ut alle påkrevde bookingsfelt.",
    bookingValidationSuccess:
      "Takk, {name}. Opplysningene ble validert lokalt; denne demoen sendte ingen bookingforespørsel.",
    promptEnterName: "Skriv inn navnet ditt:",
    feedbackEyebrow: "TILBAKEMELDING",
    feedbackHeading: "Del din opplevelse med Craftsvilla.",
    feedbackText:
      "Fortell oss hva du likte, hvordan vi kan forbedre oss, og hvilke håndverksopplevelser du ønsker å se neste gang.",
    feedbackReview1:
      '"Workshopen var inspirerende og verten guidet oss gjennom hvert steg. Jeg dro hjem med et vakkert produkt og en ny håndverksferdighet."',
    feedbackReview2:
      '"Herlig atmosfære, førsteklasses materialer og en enkel bookingprosess. Bookingsiden gjorde det lett å sikre plassen min."',
    feedbackReview3:
      '"Jeg likte galleriet og variasjonen av håndverk. Booking- og tilbakemeldingsflyten er ren og nyttig."',
    feedbackFormHeading: "Send din tilbakemelding",
    feedbackLabelName: "Ditt navn",
    feedbackLabelEmail: "E-post",
    feedbackLabelMessage: "Melding",
    feedbackPlaceholderName: "Navn",
    feedbackPlaceholderEmail: "E-postadresse",
    feedbackPlaceholderMessage: "Skriv tilbakemeldingen din her...",
    feedbackSubmitButton: "Send tilbakemelding",
    feedbackImageAlt: "Kunsthåndverker som arbeider med et håndlaget verk i studioet",
    feedbackValidationMissing:
      "Vennligst skriv inn navn og tilbakemelding.",
    feedbackValidationSuccess:
      "Takk, {name}. Tilbakemeldingen ble validert lokalt og ble ikke sendt eller lagret.",
  },
};

function getSiteLang() {
  try {
    return localStorage.getItem("siteLang") || "en";
  } catch {
    return "en";
  }
}

function storeSiteLang(lang) {
  try {
    localStorage.setItem("siteLang", lang);
  } catch {
    // Language switching still works for the current page if storage is blocked.
  }
}

// Replaces placeholders like {name} or {count} in translated messages.
function translateMessage(key, values = {}) {
  const lang = getSiteLang();
  const template =
    (translations[lang] && translations[lang][key]) ||
    translations.en[key] ||
    "";
  return Object.keys(values).reduce((text, varName) => {
    return text.replace(new RegExp(`\{${varName}\}`, "g"), values[varName]);
  }, template);
}

window.getSiteLang = getSiteLang;
window.translateMessage = translateMessage;

// Updates visible text, placeholders, alt text, and the browser tab title.
function translatePage(lang) {
  const elements = document.querySelectorAll("[data-i18n]");
  elements.forEach((element) => {
    const key = element.getAttribute("data-i18n");
    if (translations[lang] && translations[lang][key]) {
      element.textContent = translations[lang][key];
    }
  });

  const translationAttributes = [
    { attr: "data-i18n-placeholder", prop: "placeholder" },
    { attr: "data-i18n-alt", prop: "alt" },
    { attr: "data-i18n-value", prop: "value" },
    { attr: "data-i18n-aria-label", prop: "ariaLabel" },
  ];

  translationAttributes.forEach(({ attr, prop }) => {
    document.querySelectorAll(`[${attr}]`).forEach((element) => {
      const key = element.getAttribute(attr);
      if (translations[lang] && translations[lang][key]) {
        element[prop] = translations[lang][key];
      }
    });
  });

  const titleElement = document.querySelector("title[data-i18n-title]");
  if (titleElement) {
    const titleKey = titleElement.getAttribute("data-i18n-title");
    if (translations[lang] && translations[lang][titleKey]) {
      titleElement.textContent = translations[lang][titleKey];
    }
  }

  document.documentElement.lang = lang;
  document.dispatchEvent(new CustomEvent("site-language-change"));
}

function setActiveNavLink() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const currentHash = window.location.hash;

  document.querySelectorAll("nav a").forEach((link) => {
    const linkUrl = new URL(link.getAttribute("href"), window.location.href);
    const linkPage = linkUrl.pathname.split("/").pop() || "index.html";
    const linkHash = linkUrl.hash;
    const isSamePage = linkPage === currentPage;
    const isActive =
      isSamePage &&
      (linkHash === currentHash ||
        (!currentHash && (!linkHash || linkHash === "#home")));

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function initReveal() {
  const revealElements = document.querySelectorAll(".reveal:not(.is-visible)");

  if (!revealElements.length) {
    return;
  }

  if (reducedMotionQuery.matches || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, revealObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 },
  );

  revealElements.forEach((element) => observer.observe(element));
}

window.initReveal = initReveal;

if (langToggle) {
  const storedLang = getSiteLang();
  langToggle.textContent = storedLang === "en" ? "NO" : "EN";
  translatePage(storedLang);

  langToggle.addEventListener("click", () => {
    const currentLang = document.documentElement.lang || "en";
    const nextLang = currentLang === "en" ? "no" : "en";
    storeSiteLang(nextLang);
    langToggle.textContent = nextLang === "en" ? "NO" : "EN";
    translatePage(nextLang);
  });
}

setActiveNavLink();
initReveal();
window.addEventListener("hashchange", setActiveNavLink);
