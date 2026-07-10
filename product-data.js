(function initializeCraftsvillaData() {
  const CART_KEY = "craftsvilla-cart-v1";
  const ORDERS_KEY = "craftsvilla-orders-v1";

  const categories = Object.freeze([
    { id: "mosaic", nameKey: "filterMosaic", textKey: "categoryMosaicText", color: "#d89b7a" },
    { id: "watercolor", nameKey: "filterWatercolor", textKey: "categoryWatercolorText", color: "#7aa68a" },
    { id: "painting", nameKey: "filterPainting", textKey: "categoryPaintingText", color: "#d8c27a" },
    { id: "jewelry", nameKey: "filterJewelry", textKey: "categoryJewelryText", color: "#7ea68a" },
  ]);

  const products = Object.freeze([
    {
      id: "mosaic-art-kit",
      category: "mosaic",
      titleKey: "productMosaicTitle",
      descriptionKey: "productMosaicDescription",
      price: 400,
      image: "images/Mosaikk kunst.jpg",
      optimizedImage: "images/optimized/mosaikk-720.webp",
      width: 5200,
      height: 3466,
    },
    {
      id: "watercolor-kit",
      category: "watercolor",
      titleKey: "productWatercolorTitle",
      descriptionKey: "productWatercolorDescription",
      price: 200,
      image: "images/Akvarellmaling 1.jpg",
      optimizedImage: "images/optimized/akvarell-720.webp",
      width: 3381,
      height: 2481,
    },
    {
      id: "canvas-painting-kit",
      category: "painting",
      titleKey: "productPaintingTitle",
      descriptionKey: "productCanvasDescription",
      price: 300,
      image: "images/Lerretsmaling.jpg",
      optimizedImage: "images/optimized/lerretsmaling-720.webp",
      width: 4460,
      height: 3256,
    },
    {
      id: "handcrafted-jewelry",
      category: "jewelry",
      titleKey: "productJewelryTitle",
      descriptionKey: "productJewelryDescription",
      price: 650,
      image: "images/optimized/Master and jewerly.png",
      optimizedImage: "images/optimized/jewelry-720.webp",
      fullImage: "images/optimized/jewelry-1400.webp",
      width: 1536,
      height: 1024,
    },
  ]);

  const productMap = new Map(products.map((product) => [product.id, product]));
  const orderStatuses = Object.freeze(["New", "Processing", "Ready", "Shipped", "Completed", "Cancelled"]);
  const paymentMethods = Object.freeze(["card-demo", "vipps-demo", "pickup-demo"]);
  const deliveryMethods = Object.freeze(["standard", "express", "pickup"]);

  function readStorage(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }

  function validateCartItem(item) {
    return (
      item &&
      typeof item.productId === "string" &&
      productMap.has(item.productId) &&
      Number.isInteger(item.quantity) &&
      item.quantity >= 1 &&
      item.quantity <= 99
    );
  }

  function getCart() {
    const stored = readStorage(CART_KEY, []);
    return Array.isArray(stored) ? stored.filter(validateCartItem) : [];
  }

  function saveCart(items) {
    const safeItems = Array.isArray(items) ? items.filter(validateCartItem) : [];
    const saved = writeStorage(CART_KEY, safeItems);
    document.dispatchEvent(new CustomEvent("craftsvilla-cart-change", { detail: safeItems }));
    return saved;
  }

  function addToCart(productId, quantity = 1) {
    if (!productMap.has(productId) || !Number.isInteger(quantity) || quantity < 1) return false;
    const cart = getCart();
    const existing = cart.find((item) => item.productId === productId);
    if (existing) existing.quantity = Math.min(99, existing.quantity + quantity);
    else cart.push({ productId, quantity: Math.min(99, quantity) });
    return saveCart(cart);
  }

  function updateCartItem(productId, quantity) {
    if (!productMap.has(productId) || !Number.isInteger(quantity)) return false;
    if (quantity < 1) return removeCartItem(productId);
    const cart = getCart();
    const item = cart.find((entry) => entry.productId === productId);
    if (!item) return false;
    item.quantity = Math.min(99, quantity);
    return saveCart(cart);
  }

  function removeCartItem(productId) {
    return saveCart(getCart().filter((item) => item.productId !== productId));
  }

  function clearCart() {
    return saveCart([]);
  }

  function getCartCount() {
    return getCart().reduce((total, item) => total + item.quantity, 0);
  }

  function getCartDetails() {
    return getCart().map((item) => ({ ...item, product: productMap.get(item.productId) }));
  }

  function cleanText(value, maxLength = 160) {
    return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
  }

  function validateOrder(order) {
    if (!order || typeof order !== "object") return null;
    const items = Array.isArray(order.items)
      ? order.items.filter(
          (item) =>
            item &&
            productMap.has(item.productId) &&
            Number.isInteger(item.quantity) &&
            item.quantity >= 1 &&
            Number.isFinite(item.unitPrice) &&
            item.unitPrice >= 0,
        )
      : [];
    if (!items.length || !orderStatuses.includes(order.status)) return null;
    if (!paymentMethods.includes(order.paymentMethod) || !deliveryMethods.includes(order.deliveryMethod)) return null;
    return {
      id: cleanText(order.id, 40),
      createdAt: cleanText(order.createdAt, 40),
      updatedAt: cleanText(order.updatedAt || order.createdAt, 40),
      customer: {
        name: cleanText(order.customer?.name, 120),
        email: cleanText(order.customer?.email, 160),
        phone: cleanText(order.customer?.phone, 40),
      },
      address: {
        address: cleanText(order.address?.address, 160),
        postalCode: cleanText(order.address?.postalCode, 20),
        city: cleanText(order.address?.city, 80),
        country: cleanText(order.address?.country, 80),
      },
      deliveryMethod: order.deliveryMethod,
      paymentMethod: order.paymentMethod,
      items,
      total: Number.isFinite(order.total) && order.total >= 0 ? Math.round(order.total) : 0,
      status: order.status,
      demo: Boolean(order.demo),
    };
  }

  function getOrders() {
    const stored = readStorage(ORDERS_KEY, []);
    if (!Array.isArray(stored)) return [];
    return stored.map(validateOrder).filter(Boolean);
  }

  function saveOrders(orders) {
    const safeOrders = Array.isArray(orders) ? orders.map(validateOrder).filter(Boolean) : [];
    return writeStorage(ORDERS_KEY, safeOrders);
  }

  function addOrder(order) {
    const safeOrder = validateOrder(order);
    if (!safeOrder) return false;
    return saveOrders([safeOrder, ...getOrders()]);
  }

  function formatMoney(amount) {
    const locale = document.documentElement.lang === "no" ? "nb-NO" : "en-NO";
    return new Intl.NumberFormat(locale, { style: "currency", currency: "NOK", maximumFractionDigits: 0 }).format(amount);
  }

  window.Craftsvilla = Object.freeze({
    products,
    categories,
    productMap,
    orderStatuses,
    paymentMethods,
    deliveryMethods,
    cart: Object.freeze({ get: getCart, details: getCartDetails, count: getCartCount, add: addToCart, update: updateCartItem, remove: removeCartItem, clear: clearCart }),
    orders: Object.freeze({ get: getOrders, save: saveOrders, add: addOrder, validate: validateOrder }),
    formatMoney,
  });
})();
