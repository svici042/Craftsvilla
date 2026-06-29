// Category data used to build the homepage category cards.
const categories = [
  {
    name: "Ceramics",
    text: "Clay forms, vases and warm table objects.",
    image: "images/Master in workshop.png",
    color: "#d89b7a",
  },
  {
    name: "Textiles",
    text: "Woven bags, soft goods and handmade fabrics.",
    image: "images/Master`s hands 1m.png",
    color: "#7aa68a",
  },
  {
    name: "Woodwork",
    text: "Oak trays, small furniture and useful objects.",
    image: "images/Master 1m.png",
    color: "#d8c27a",
  },
  {
    name: "Jewelry",
    text: "Minimal rings, earrings and wearable craft.",
    image: "images/Margarita 1m.png",
    color: "#7ea68a",
  },
];

// Product data used by the filters and product card renderer.
const products = [
  {
    name: "Mosaikk Kunst",
    category: "ceramics",
    maker: "",
    price: 400,
    image: "images/Mosaikk kunst.jpg",
    currency: "kr",
    description:
      "Sett inkluderer: Ramme, A4 størrelse treplate,<br>små fargede steiner, gummi.",
  },
  {
    name: "Akvarellmaling",
    category: "textiles",
    maker: "",
    price: 200,
    image: "images/Akvarellmaling 1.jpg",
    currency: "kr",
    description:
      "Sett inkluderer: Ramme, akvarellpapir med designmal,<br>akvarellfarger, pensler.",
  },
  {
    name: "Lerretsmaling",
    category: "woodwork",
    maker: "",
    price: 300,
    image: "images/Lerretsmaling.jpg",
    currency: "NOK",
    description:
      "Sett inkluderer: Ramme, akrylpapir med designmal,<br>akrylfarger, pensler.",
  },
];

// Simple state values for cart count and active product filter.
let cartCount = 0;
let activeCategory = "all";

// Home page elements used by the interactive JavaScript features.
const categoryGrid = document.querySelector("#categoryGrid");
const productGrid = document.querySelector("#productGrid");
const filterButtons = document.querySelectorAll(".filter-btn");
const dynamicText = document.querySelector("#dynamicText");

const exploreBtn = document.querySelector("#exploreBtn");
const workshopBtn = document.querySelector("#workshopBtn");
const filterCeramicsBtn = document.querySelector("#filterCeramicsBtn");
const addCartBtn = document.querySelector("#addCartBtn");
const validateBtn = document.querySelector("#validateBtn");
const updateDomBtn = document.querySelector("#updateDomBtn");

// Adds a click listener only when the element exists on the current page.
function onClick(element, handler) {
  if (element) {
    element.addEventListener("click", handler);
  }
}

function clearElement(element) {
  element.replaceChildren();
}

// Builds image wrappers with DOM APIs instead of innerHTML for safer rendering.
function createMediaFrame(imageSrc, imageAlt, extraClass = "") {
  const mediaFrame = document.createElement("div");
  mediaFrame.className = extraClass
    ? `media-frame ${extraClass}`
    : "media-frame";

  const image = document.createElement("img");
  image.src = imageSrc;
  image.alt = imageAlt;

  mediaFrame.appendChild(image);
  return mediaFrame;
}

// Allows line breaks in product descriptions without parsing arbitrary HTML.
function appendDescription(descriptionElement, descriptionText) {
  const parts = descriptionText.split(/<br\s*\/?>/gi);

  parts.forEach((part, index) => {
    if (index > 0) {
      descriptionElement.appendChild(document.createElement("br"));
    }

    descriptionElement.appendChild(document.createTextNode(part));
  });
}

// Renders the craft category cards on the home page.
function renderCategories() {
  if (!categoryGrid) {
    return;
  }

  clearElement(categoryGrid);

  for (const category of categories) {
    const card = document.createElement("article");
    card.className = "category-card";

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const categoryDot = document.createElement("span");
    categoryDot.className = "cat-dot";
    categoryDot.style.backgroundColor = category.color;

    const heading = document.createElement("h3");
    heading.textContent = category.name;

    const text = document.createElement("p");
    text.textContent = category.text;

    cardBody.append(categoryDot, heading, text);
    card.append(createMediaFrame(category.image, category.name), cardBody);

    categoryGrid.appendChild(card);
  }
}

// Renders product cards and filters them by the selected category.
function renderProducts(category) {
  if (!productGrid) {
    return;
  }

  clearElement(productGrid);

  const filteredProducts = products.filter(function (product) {
    if (category === "all") {
      return true;
    }

    return product.category === category;
  });

  if (filteredProducts.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "No products found.";
    productGrid.appendChild(emptyMessage);
    return;
  }

  for (const product of filteredProducts) {
    const card = document.createElement("article");
    card.className = "product-card";

    const heading = document.createElement("h3");
    heading.textContent = product.name;

    const description = document.createElement("p");
    description.className = "product-desc";
    appendDescription(description, product.description);

    const cardBottom = document.createElement("div");
    cardBottom.className = "card-bottom";

    const price = document.createElement("span");
    price.className = "price";
    price.textContent = `${product.price} ${product.currency || "NOK"}`;

    const viewButton = document.createElement("button");
    viewButton.className = "view-btn";
    viewButton.type = "button";
    viewButton.textContent = "View";

    onClick(viewButton, function () {
      if (dynamicText) {
        dynamicText.textContent = `${product.name} costs ${product.price} ${product.currency || "NOK"}. Category: ${product.category}.`;
      }
    });

    cardBottom.append(price, viewButton);
    card.append(createMediaFrame(product.image, product.name, "product-image"));
    card.appendChild(heading);

    if (product.maker) {
      const maker = document.createElement("p");
      maker.className = "product-maker";
      maker.textContent = product.maker;
      card.appendChild(maker);
    }

    card.append(description, cardBottom);
    productGrid.appendChild(card);
  }
}

// Updates the active filter button and refreshes the product list.
function setActiveFilter(category) {
  activeCategory = category;

  filterButtons.forEach(function (button) {
    if (button.dataset.category === category) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });

  renderProducts(category);
}

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    setActiveFilter(button.dataset.category);
  });
});

// Scrolls to the product categories section from the hero button.
onClick(exploreBtn, function () {
  const categoriesSection = document.querySelector("#categories");
  if (categoriesSection) {
    categoriesSection.scrollIntoView({ behavior: "smooth" });
  }
});

// Scrolls to the interactive workshop section from the hero button.
onClick(workshopBtn, function () {
  const workshopsSection = document.querySelector("#workshops");
  if (workshopsSection) {
    workshopsSection.scrollIntoView({ behavior: "smooth" });
  }
});

// Filters directly to ceramics and updates the status text.
onClick(filterCeramicsBtn, function () {
  setActiveFilter("ceramics");
  if (!dynamicText) {
    return;
  }

  if (typeof translateMessage === "function") {
    dynamicText.textContent = translateMessage("dynamicFilterCeramics");
  } else {
    dynamicText.textContent = "Products are now filtered by ceramics.";
  }
});

// Increments a local cart counter and displays the translated result.
onClick(addCartBtn, function () {
  cartCount++;

  if (!dynamicText) {
    return;
  }

  if (typeof translateMessage === "function") {
    if (cartCount === 1) {
      dynamicText.textContent = translateMessage("dynamicCartSingle", {
        count: cartCount,
      });
    } else {
      dynamicText.textContent = translateMessage("dynamicCartMultiple", {
        count: cartCount,
      });
    }
  } else {
    if (cartCount === 1) {
      dynamicText.textContent = `You have ${cartCount} item in the cart.`;
    } else {
      dynamicText.textContent = `You have ${cartCount} items in the cart.`;
    }
  }
});

// Demonstrates simple user input validation with a prompt.
onClick(validateBtn, function () {
  const userName =
    typeof translateMessage === "function"
      ? prompt(translateMessage("promptEnterName"))
      : prompt("Enter your name:");

  if (!dynamicText) {
    return;
  }

  if (userName && userName.trim().length >= 2) {
    dynamicText.textContent =
      typeof translateMessage === "function"
        ? translateMessage("dynamicValidationSuccess", {
            name: userName.trim(),
          })
        : `Thank you, ${userName}. Your form input is valid.`;
  } else {
    dynamicText.textContent =
      typeof translateMessage === "function"
        ? translateMessage("dynamicValidationFail")
        : "Validation failed. Name must contain at least 2 characters.";
  }
});

// Picks a random product and writes its details into the page.
onClick(updateDomBtn, function () {
  if (!dynamicText) {
    return;
  }

  const randomProduct = products[Math.floor(Math.random() * products.length)];
  dynamicText.textContent =
    typeof translateMessage === "function"
      ? translateMessage("dynamicDomUpdated", {
          productName: randomProduct.name,
          price: randomProduct.price,
          currency: randomProduct.currency || "NOK",
        })
      : `DOM updated: featured product is ${randomProduct.name}, price ${randomProduct.price} ${randomProduct.currency || "NOK"}.`;
});

// Initial render when the home page loads.
renderCategories();
renderProducts(activeCategory);
