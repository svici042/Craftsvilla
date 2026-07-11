warning: in the working copy of 'nav.js', CRLF will be replaced by LF the next time Git touches it
warning: in the working copy of 'script.js', CRLF will be replaced by LF the next time Git touches it
[1mdiff --git a/nav.js b/nav.js[m
[1mindex 3db98ca..7b2c0d2 100644[m
[1m--- a/nav.js[m
[1m+++ b/nav.js[m
[36m@@ -1,7 +1,7 @@[m
 document.documentElement.classList.add("js");[m
 [m
 const navToggle = document.querySelector(".nav-toggle");[m
[31m-const navMenu = document.querySelector("nav");[m
[32m+[m[32mconst navMenu = document.querySelector(".navbar nav");[m
 const langToggle = document.querySelector("#langToggle");[m
 const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");[m
 [m
[36m@@ -443,7 +443,7 @@[m [mconst translations = {[m
 [m
 function getSiteLang() {[m
   try {[m
[31m-    return localStorage.getItem("siteLang") === "no" ? "no" : "en";[m
[32m+[m[32m    return localStorage.getItem(window.Craftsvilla.storageKeys.language) === "no" ? "no" : "en";[m
   } catch {[m
     return "en";[m
   }[m
[36m@@ -451,7 +451,7 @@[m [mfunction getSiteLang() {[m
 [m
 function storeSiteLang(lang) {[m
   try {[m
[31m-    localStorage.setItem("siteLang", lang);[m
[32m+[m[32m    localStorage.setItem(window.Craftsvilla.storageKeys.language, lang);[m
   } catch {[m
     // Language switching still works for the current page if storage is blocked.[m
   }[m
[1mdiff --git a/product-data.js b/product-data.js[m
[1mindex 5e6fdcf..d063980 100644[m
[1m--- a/product-data.js[m
[1m+++ b/product-data.js[m
[36m@@ -1,6 +1,9 @@[m
 (function initializeCraftsvillaData() {[m
[31m-  const CART_KEY = "craftsvilla-cart-v1";[m
[31m-  const ORDERS_KEY = "craftsvilla-orders-v1";[m
[32m+[m[32m  const storageKeys = Object.freeze({[m
[32m+[m[32m    cart: "craftsvilla-cart-v1",[m
[32m+[m[32m    orders: "craftsvilla-orders-v1",[m
[32m+[m[32m    language: "siteLang",[m
[32m+[m[32m  });[m
   const MAX_ITEM_QUANTITY = 99;[m
   const MAX_ORDERS = 500;[m
 [m
[36m@@ -94,13 +97,13 @@[m
   }[m
 [m
   function getCart() {[m
[31m-    const stored = readStorage(CART_KEY, []);[m
[32m+[m[32m    const stored = readStorage(storageKeys.cart, []);[m
     return Array.isArray(stored) ? stored.filter(validateCartItem) : [];[m
   }[m
 [m
   function saveCart(items) {[m
     const safeItems = Array.isArray(items) ? items.filter(validateCartItem) : [];[m
[31m-    const saved = writeStorage(CART_KEY, safeItems);[m
[32m+[m[32m    const saved = writeStorage(storageKeys.cart, safeItems);[m
     document.dispatchEvent(new CustomEvent("craftsvilla-cart-change", { detail: safeItems }));[m
     return saved;[m
   }[m
[36m@@ -194,7 +197,7 @@[m
   }[m
 [m
   function getOrders() {[m
[31m-    const stored = readStorage(ORDERS_KEY, []);[m
[32m+[m[32m    const stored = readStorage(storageKeys.orders, []);[m
     if (!Array.isArray(stored)) return [];[m
     return stored.map(validateOrder).filter(Boolean);[m
   }[m
[36m@@ -203,7 +206,7 @@[m
     const safeOrders = Array.isArray(orders)[m
       ? orders.map(validateOrder).filter(Boolean).slice(0, MAX_ORDERS)[m
       : [];[m
[31m-    return writeStorage(ORDERS_KEY, safeOrders);[m
[32m+[m[32m    return writeStorage(storageKeys.orders, safeOrders);[m
   }[m
 [m
   function addOrder(order) {[m
[36m@@ -224,6 +227,7 @@[m
     orderStatuses,[m
     paymentMethods,[m
     deliveryMethods,[m
[32m+[m[32m    storageKeys,[m
     cart: Object.freeze({ get: getCart, details: getCartDetails, count: getCartCount, add: addToCart, update: updateCartItem, remove: removeCartItem, clear: clearCart }),[m
     orders: Object.freeze({ get: getOrders, save: saveOrders, add: addOrder, validate: validateOrder }),[m
     formatMoney,[m
[1mdiff --git a/script.js b/script.js[m
[1mindex b232446..14232b5 100644[m
[1m--- a/script.js[m
[1m+++ b/script.js[m
[36m@@ -1,4 +1,4 @@[m
[31m-const { products, categories, cart, formatMoney } = window.Craftsvilla;[m
[32m+[m[32mconst { products, categories, productMap, cart, formatMoney } = window.Craftsvilla;[m
 [m
 let activeCategory = "all";[m
 let lastAddedProductId = "";[m
[36m@@ -10,6 +10,8 @@[m [mconst filterButtons = document.querySelectorAll("[data-filter]");[m
 const cartStatus = document.querySelector("#cartStatus");[m
 const exploreBtn = document.querySelector("#exploreBtn");[m
 const workshopBtn = document.querySelector("#workshopBtn");[m
[32m+[m[32mconst workshopsSection = document.querySelector("#workshops");[m
[32m+[m[32mconst productControls = document.querySelector(".controls");[m
 const prefersReducedMotion = window.matchMedia([m
   "(prefers-reduced-motion: reduce)",[m
 );[m
[36m@@ -198,7 +200,7 @@[m [mfunction updateCartStatus(productId = "") {[m
   if (productId) lastAddedProductId = productId;[m
 [m
   const cartCount = cart.count();[m
[31m-  const lastProduct = window.Craftsvilla.productMap.get(lastAddedProductId);[m
[32m+[m[32m  const lastProduct = productMap.get(lastAddedProductId);[m
   const productName = lastProduct[m
     ? getText(lastProduct.titleKey, lastProduct.id)[m
     : "";[m
[36m@@ -227,7 +229,7 @@[m [mfunction updateCartStatus(productId = "") {[m
   window.setTimeout(() => cartStatus.classList.remove("is-updated"), 350);[m
 }[m
 [m
[31m-document.querySelector(".controls")?.addEventListener("click", (event) => {[m
[32m+[m[32mproductControls?.addEventListener("click", (event) => {[m
   const button = event.target.closest("[data-filter]");[m
   if (!button) return;[m
   setActiveFilter(button.dataset.filter);[m
[36m@@ -244,7 +246,7 @@[m [mcategoryGrid?.addEventListener("click", (event) => {[m
 productGrid?.addEventListener("click", (event) => {[m
   const button = event.target.closest(".add-cart-btn");[m
   if (!button) return;[m
[31m-  const product = window.Craftsvilla.productMap.get(button.dataset.productId);[m
[32m+[m[32m  const product = productMap.get(button.dataset.productId);[m
   if (!product || !cart.add(product.id)) return;[m
   updateCartStatus(product.id);[m
 });[m
[36m@@ -256,7 +258,6 @@[m [monClick(exploreBtn, function () {[m
 [m
 // Scrolls to the interactive workshop section from the hero button.[m
 onClick(workshopBtn, function () {[m
[31m-  const workshopsSection = document.querySelector("#workshops");[m
   if (workshopsSection) {[m
     workshopsSection.scrollIntoView({[m
       behavior: prefersReducedMotion.matches ? "auto" : "smooth",[m
[36m@@ -267,7 +268,7 @@[m [monClick(workshopBtn, function () {[m
 document.addEventListener("site-language-change", () => {[m
   updateCartStatus();[m
   productGrid?.querySelectorAll(".add-cart-btn").forEach((button) => {[m
[31m-    const product = window.Craftsvilla.productMap.get(button.dataset.productId);[m
[32m+[m[32m    const product = productMap.get(button.dataset.productId);[m
     if (!product) return;[m
     button.setAttribute([m
       "aria-label",[m
