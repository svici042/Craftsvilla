const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector("nav");
const langToggle = document.querySelector("#langToggle");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("open");
  });
}

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
    statsMakers: "Makers",
    statsProducts: "Products",
    statsWorkshops: "Workshops",
    categoryHeading: "Browse by craft category",
    featuredProducts: "Featured products",
    filterAll: "All",
    filterCeramics: "Ceramics",
    filterTextiles: "Textiles",
    filterWoodwork: "Woodwork",
    interactiveHeading: "Interactive JavaScript section",
    interactiveText:
      "Use the buttons to filter products, add items to cart and update DOM content.",
    filterProducts: "Filter products",
    addToCart: "Add to cart",
    validateForm: "Validate form",
    updateDom: "Update DOM",
    footerText:
      "Handmade marketplace for craft, workshops and creative makers.",
    footerLinks:
      "Home · Products · Workshops · Gallery · Booking · Feedback · Contact",
    dynamicFilterCeramics: "Products are now filtered by ceramics.",
    dynamicCartSingle: "You have {count} item in the cart.",
    dynamicCartMultiple: "You have {count} items in the cart.",
    dynamicValidationSuccess: "Thank you, {name}. Your form input is valid.",
    dynamicValidationFail:
      "Validation failed. Name must contain at least 2 characters.",
    dynamicDomUpdated:
      "DOM updated: featured product is {productName}, price {price} {currency}.",
    promptEnterName: "Enter your name:",
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
      "Thank you, {name}! Your booking request has been received.",
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
    feedbackImageAlt: "Feedback conversation",
    feedbackValidationMissing: "Please enter your name and feedback message.",
    feedbackValidationSuccess: "Thank you, {name}. Your feedback has been sent.",
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
    statsMakers: "Skapere",
    statsProducts: "Produkter",
    statsWorkshops: "Workshops",
    categoryHeading: "Bla gjennom håndverkskategorier",
    featuredProducts: "Utvalgte produkter",
    filterAll: "Alle",
    filterCeramics: "Keramikk",
    filterTextiles: "Tekstiler",
    filterWoodwork: "Trearbeid",
    interactiveHeading: "Interaktiv JavaScript-seksjon",
    interactiveText:
      "Bruk knappene for å filtrere produkter, legge til varer i handlekurven og oppdatere DOM-innhold.",
    filterProducts: "Filtrer produkter",
    addToCart: "Legg i handlekurv",
    validateForm: "Valider skjema",
    updateDom: "Oppdater DOM",
    footerText:
      "Håndlaget marked for kunsthåndverk, workshops og kreative skapere.",
    footerLinks:
      "Hjem · Produkter · Workshops · Galleri · Booking · Tilbakemelding · Kontakt",
    dynamicFilterCeramics: "Produktene er nå filtrert etter keramikk.",
    dynamicCartSingle: "Du har {count} vare i handlekurven.",
    dynamicCartMultiple: "Du har {count} varer i handlekurven.",
    dynamicValidationSuccess:
      "Takk, {name}. Innholdet i skjemaet ditt er gyldig.",
    dynamicValidationFail:
      "Validering mislyktes. Navnet må inneholde minst 2 tegn.",
    dynamicDomUpdated:
      "DOM oppdatert: utvalgt produkt er {productName}, pris {price} {currency}.",
    promptEnterName: "Skriv inn navnet ditt:",
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
      "Takk, {name}! Bookingsforespørselen din er mottatt.",
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
    feedbackImageAlt: "Tilbakemeldingssamtale",
    feedbackValidationMissing:
      "Vennligst skriv inn navn og tilbakemelding.",
    feedbackValidationSuccess:
      "Takk, {name}. Tilbakemeldingen din er sendt.",
  },
};

function getSiteLang() {
  return localStorage.getItem("siteLang") || "en";
}

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
}

if (langToggle) {
  const storedLang = localStorage.getItem("siteLang") || "en";
  langToggle.textContent = storedLang === "en" ? "NO" : "EN";
  translatePage(storedLang);

  langToggle.addEventListener("click", () => {
    const currentLang = localStorage.getItem("siteLang") || "en";
    const nextLang = currentLang === "en" ? "no" : "en";
    localStorage.setItem("siteLang", nextLang);
    langToggle.textContent = nextLang === "en" ? "NO" : "EN";
    translatePage(nextLang);
  });
}
