const categories = [
  {
    name: "Ceramics",
    text: "Clay forms, vases and warm table objects.",
    image: "images/Master 1m.png",
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
    image: "images/Master in workshop.png",
    color: "#d8c27a",
  },
  {
    name: "Jewelry",
    text: "Minimal rings, earrings and wearable craft.",
    image: "images/Margarita 1m.png",
    color: "#7ea68a",
  },
];

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

let cartCount = 0;
let activeCategory = "all";

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

function onClick(element, handler) {
  if (element) {
    element.addEventListener("click", handler);
  }
}

function renderCategories() {
  if (!categoryGrid) {
    return;
  }

  categoryGrid.innerHTML = "";

  for (const category of categories) {
    const card = document.createElement("article");
    card.className = "category-card";

    card.innerHTML = `
      <div class="media-frame">
        <img src="${category.image}" alt="${category.name}" />
      </div>
      <div class="card-body">
        <span class="cat-dot" style="background:${category.color}"></span>
        <h3>${category.name}</h3>
        <p>${category.text}</p>
      </div>
    `;

    categoryGrid.appendChild(card);
  }
}

function renderProducts(category) {
  if (!productGrid) {
    return;
  }

  productGrid.innerHTML = "";

  const filteredProducts = products.filter(function (product) {
    if (category === "all") {
      return true;
    }

    return product.category === category;
  });

  if (filteredProducts.length === 0) {
    productGrid.innerHTML = "<p>No products found.</p>";
    return;
  }

  for (const product of filteredProducts) {
    const card = document.createElement("article");
    card.className = "product-card";

    const makerHTML = product.maker
      ? `<p class="product-maker">${product.maker}</p>`
      : "";

    card.innerHTML = `
      <div class="media-frame product-image">
        <img src="${product.image}" alt="${product.name}" />
      </div>
      <h3>${product.name}</h3>
      ${makerHTML}
      <p class="product-desc">${product.description}</p>
      <div class="card-bottom">
        <span class="price">${product.price} ${product.currency || "NOK"}</span>
        <button class="view-btn">View</button>
      </div>
    `;

    const viewButton = card.querySelector(".view-btn");

    onClick(viewButton, function () {
      if (dynamicText) {
        dynamicText.textContent = `${product.name} costs ${product.price} ${product.currency || "NOK"}. Category: ${product.category}.`;
      }
    });

    productGrid.appendChild(card);
  }
}

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

onClick(exploreBtn, function () {
  const categoriesSection = document.querySelector("#categories");
  if (categoriesSection) {
    categoriesSection.scrollIntoView({ behavior: "smooth" });
  }
});

onClick(workshopBtn, function () {
  const workshopsSection = document.querySelector("#workshops");
  if (workshopsSection) {
    workshopsSection.scrollIntoView({ behavior: "smooth" });
  }
});

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

renderCategories();
renderProducts(activeCategory);
