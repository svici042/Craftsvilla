// Category data used to build the homepage category cards.
const categories = [
  {
    name: "Ceramics",
    nameKey: "categoryCeramicsName",
    text: "Clay forms, vases and warm table objects.",
    textKey: "categoryCeramicsText",
    category: "ceramics",
    image: "images/Master in workshop.png",
    optimizedImage: "images/optimized/master-workshop-720.webp",
    width: 1536,
    height: 1024,
    color: "#d89b7a",
  },
  {
    name: "Textiles",
    nameKey: "categoryTextilesName",
    text: "Woven bags, soft goods and handmade fabrics.",
    textKey: "categoryTextilesText",
    category: "textiles",
    image: "images/Master`s hands 1m.png",
    optimizedImage: "images/optimized/master-hands-720.webp",
    width: 1204,
    height: 804,
    color: "#7aa68a",
  },
  {
    name: "Woodwork",
    nameKey: "categoryWoodworkName",
    text: "Oak trays, small furniture and useful objects.",
    textKey: "categoryWoodworkText",
    category: "woodwork",
    image: "images/Master 1m.png",
    optimizedImage: "images/optimized/master-720.webp",
    width: 1212,
    height: 808,
    color: "#d8c27a",
  },
  {
    name: "Jewelry",
    nameKey: "categoryJewelryName",
    text: "Minimal rings, earrings and wearable craft.",
    textKey: "categoryJewelryText",
    category: "jewelry",
    image: "images/Margarita 1m.png",
    optimizedImage: "images/optimized/margarita-720.webp",
    width: 1212,
    height: 808,
    color: "#7ea68a",
  },
];

// Product data used by the filters and product card renderer.
const products = [
  {
    name: "Mosaikk Kunst",
    category: "ceramics",
    price: 400,
    image: "images/Mosaikk kunst.jpg",
    optimizedImage: "images/optimized/mosaikk-720.webp",
    width: 5200,
    height: 3466,
    currency: "kr",
    description:
      "Sett inkluderer: Ramme, A4 størrelse treplate, små fargede steiner, gummi.",
    descriptionKey: "productMosaicDescription",
  },
  {
    name: "Akvarellmaling",
    category: "textiles",
    price: 200,
    image: "images/Akvarellmaling 1.jpg",
    optimizedImage: "images/optimized/akvarell-720.webp",
    width: 3381,
    height: 2481,
    currency: "kr",
    description:
      "Sett inkluderer: Ramme, akvarellpapir med designmal, akvarellfarger, pensler.",
    descriptionKey: "productWatercolorDescription",
  },
  {
    name: "Lerretsmaling",
    category: "woodwork",
    price: 300,
    image: "images/Lerretsmaling.jpg",
    optimizedImage: "images/optimized/lerretsmaling-720.webp",
    width: 4460,
    height: 3256,
    currency: "NOK",
    description:
      "Sett inkluderer: Ramme, akrylpapir med designmal, akrylfarger, pensler.",
    descriptionKey: "productCanvasDescription",
  },
];

let cartCount = 0;
let activeCategory = "all";
let lastAddedProduct = "";

const categoryGrid = document.querySelector("#categoryGrid");
const productGrid = document.querySelector("#productGrid");
const productsSection = document.querySelector("#products");
const filterButtons = document.querySelectorAll("[data-filter]");
const cartStatus = document.querySelector("#cartStatus");
const exploreBtn = document.querySelector("#exploreBtn");
const workshopBtn = document.querySelector("#workshopBtn");
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);

function refreshReveal() {
  if (typeof window.initReveal === "function") {
    window.initReveal();
  }
}

// Adds a click listener only when the element exists on the current page.
function onClick(element, handler) {
  if (element) {
    element.addEventListener("click", handler);
  }
}

function clearElement(element) {
  element.replaceChildren();
}

function getText(key, fallback, values = {}) {
  const translated =
    typeof translateMessage === "function"
      ? translateMessage(key, values)
      : "";
  return translated || fallback;
}

// Builds image wrappers with DOM APIs instead of innerHTML for safer rendering.
function createMediaFrame(item, extraClass = "") {
  const mediaFrame = document.createElement("div");
  mediaFrame.className = extraClass
    ? `media-frame ${extraClass}`
    : "media-frame";

  const image = document.createElement("img");
  image.src = item.image;
  image.alt = item.name;
  image.width = item.width;
  image.height = item.height;
  image.loading = "lazy";
  image.decoding = "async";

  if (item.optimizedImage) {
    const picture = document.createElement("picture");
    const source = document.createElement("source");
    source.type = "image/webp";
    source.srcset = item.optimizedImage;
    picture.append(source, image);
    mediaFrame.appendChild(picture);
  } else {
    mediaFrame.appendChild(image);
  }
  return mediaFrame;
}

function renderCategories() {
  if (!categoryGrid) {
    return;
  }

  clearElement(categoryGrid);

  for (const category of categories) {
    const card = document.createElement("article");
    card.className = "category-card reveal";

    const link = document.createElement("a");
    link.className = "category-link";
    link.href = "#products";
    link.dataset.filter = category.category;

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const categoryDot = document.createElement("span");
    categoryDot.className = "cat-dot";
    categoryDot.style.backgroundColor = category.color;

    const heading = document.createElement("h3");
    heading.textContent = getText(category.nameKey, category.name);
    heading.dataset.i18n = category.nameKey;

    const text = document.createElement("p");
    text.textContent = getText(category.textKey, category.text);
    text.dataset.i18n = category.textKey;

    const action = document.createElement("span");
    action.className = "category-cue";
    action.textContent = getText("categoryAction", "View products →");
    action.dataset.i18n = "categoryAction";

    cardBody.append(categoryDot, heading, text, action);
    link.append(createMediaFrame(category), cardBody);
    card.appendChild(link);

    categoryGrid.appendChild(card);
  }
}

function renderProducts() {
  if (!productGrid) {
    return;
  }

  clearElement(productGrid);

  for (const product of products) {
    const card = document.createElement("article");
    card.className = "product-card reveal";
    card.dataset.category = product.category;

    const heading = document.createElement("h3");
    heading.textContent = product.name;

    const description = document.createElement("p");
    description.className = "product-desc";
    description.textContent = getText(
      product.descriptionKey,
      product.description,
    );
    description.dataset.i18n = product.descriptionKey;

    const cardBottom = document.createElement("div");
    cardBottom.className = "card-bottom";

    const price = document.createElement("span");
    price.className = "price";
    price.textContent = `${product.price} ${product.currency || "NOK"}`;

    const cartButton = document.createElement("button");
    cartButton.className = "product-action add-cart-btn";
    cartButton.type = "button";
    cartButton.textContent = getText("addToCart", "Add to cart");
    cartButton.dataset.i18n = "addToCart";
    cartButton.dataset.productName = product.name;
    cartButton.setAttribute(
      "aria-label",
      getText("addProductToCart", `Add ${product.name} to cart`, {
        productName: product.name,
      }),
    );

    cardBottom.append(price, cartButton);
    card.append(createMediaFrame(product, "product-image"));
    card.appendChild(heading);

    card.append(description, cardBottom);
    productGrid.appendChild(card);
  }

  const emptyMessage = document.createElement("p");
  emptyMessage.className = "empty-state";
    emptyMessage.textContent = getText(
      "filterEmpty",
      "No products are available in this category yet.",
    );
  emptyMessage.dataset.i18n = "filterEmpty";
  emptyMessage.hidden = true;
  productGrid.appendChild(emptyMessage);
}

function setActiveFilter(category) {
  activeCategory = category;

  filterButtons.forEach(function (button) {
    const isActive = button.dataset.filter === category;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  let visibleProducts = 0;
  productGrid?.querySelectorAll(".product-card").forEach((card) => {
    const isVisible = category === "all" || card.dataset.category === category;
    card.hidden = !isVisible;
    if (isVisible) visibleProducts++;
  });

  const emptyState = productGrid?.querySelector(".empty-state");
  if (emptyState) emptyState.hidden = visibleProducts !== 0;
}

function scrollToProducts() {
  productsSection?.scrollIntoView({
    behavior: prefersReducedMotion.matches ? "auto" : "smooth",
    block: "start",
  });
}

function updateCartStatus(productName = "") {
  if (!cartStatus) return;

  if (productName) lastAddedProduct = productName;

  const messageKey =
    cartCount === 0
      ? "cartEmpty"
      : cartCount === 1
        ? "cartSingle"
        : "cartMultiple";
  const message =
    typeof translateMessage === "function"
      ? translateMessage(messageKey, {
          count: cartCount,
          productName: lastAddedProduct,
        })
      : cartCount === 0
        ? "Cart is empty"
        : `${lastAddedProduct} added. ${cartCount} item${cartCount === 1 ? "" : "s"} in cart.`;
  cartStatus.lastElementChild.textContent = message;
  cartStatus.classList.add("is-updated");
  window.setTimeout(() => cartStatus.classList.remove("is-updated"), 350);
}

document.querySelector(".controls")?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  setActiveFilter(button.dataset.filter);
});

categoryGrid?.addEventListener("click", (event) => {
  const link = event.target.closest(".category-link");
  if (!link) return;
  event.preventDefault();
  setActiveFilter(link.dataset.filter);
  scrollToProducts();
});

productGrid?.addEventListener("click", (event) => {
  const button = event.target.closest(".add-cart-btn");
  if (!button) return;
  cartCount++;
  updateCartStatus(button.dataset.productName);
});

// Scrolls to the product categories section from the hero button.
onClick(exploreBtn, function () {
  scrollToProducts();
});

// Scrolls to the interactive workshop section from the hero button.
onClick(workshopBtn, function () {
  const workshopsSection = document.querySelector("#workshops");
  if (workshopsSection) {
    workshopsSection.scrollIntoView({
      behavior: prefersReducedMotion.matches ? "auto" : "smooth",
    });
  }
});

document.addEventListener("site-language-change", () => {
  updateCartStatus();
  productGrid?.querySelectorAll(".add-cart-btn").forEach((button) => {
    button.setAttribute(
      "aria-label",
      getText("addProductToCart", `Add ${button.dataset.productName} to cart`, {
        productName: button.dataset.productName,
      }),
    );
  });
});

function initParallax() {
  const parallaxItems = Array.from(
    document.querySelectorAll(".parallax-section"),
    (section) => ({
      section,
      image: section.querySelector(".parallax-image"),
      speed: Number(section.dataset.parallaxSpeed || 0.16),
      isVisible: false,
    }),
  ).filter((item) => item.image);

  if (!parallaxItems.length) {
    return;
  }

  let ticking = false;
  const isParallaxEnabled = () =>
    !prefersReducedMotion.matches && window.innerWidth > 768;

  function updateParallax() {
    if (document.hidden || !isParallaxEnabled()) {
      ticking = false;
      return;
    }

    parallaxItems.forEach(({ section, image, speed, isVisible }) => {
      if (!isVisible) return;

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const progress =
        (rect.top + rect.height / 2 - viewportHeight / 2) / viewportHeight;
      const offset = Math.max(-44, Math.min(44, progress * speed * -140));

      image.style.setProperty("--parallax-y", `${offset}px`);
    });

    ticking = false;
  }

  function requestParallaxUpdate() {
    if (!ticking && isParallaxEnabled()) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  const visibilityObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const item = parallaxItems.find(
        ({ section }) => section === entry.target,
      );
      if (!item) return;

      item.isVisible = entry.isIntersecting;
      item.section.classList.toggle(
        "is-parallax-active",
        entry.isIntersecting && isParallaxEnabled(),
      );
    });
    requestParallaxUpdate();
  });

  parallaxItems.forEach(({ section }) => visibilityObserver.observe(section));

  window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
  window.addEventListener("resize", () => {
    parallaxItems.forEach(({ section, image, isVisible }) => {
      const isActive = isVisible && isParallaxEnabled();
      section.classList.toggle("is-parallax-active", isActive);
      if (!isActive) image.style.removeProperty("--parallax-y");
    });
    requestParallaxUpdate();
  });
  document.addEventListener("visibilitychange", requestParallaxUpdate);
}

// Initial render when the home page loads.
renderCategories();
renderProducts();
setActiveFilter(activeCategory);
refreshReveal();
initParallax();
