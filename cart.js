const cartItems = document.querySelector("#cartItems");
const cartSummary = document.querySelector("#cartSummary");
const emptyCart = document.querySelector("#emptyCart");
const cartSubtotal = document.querySelector("#cartSubtotal");
const cartTotal = document.querySelector("#cartTotal");

// Use translated text when the shared language helper is available.
function cartText(key, fallback, values = {}) {
  return typeof translateMessage === "function"
    ? translateMessage(key, values) || fallback
    : fallback;
}

function createCartImage(product) {
  // Construct image elements with DOM APIs and retain the product dimensions
  // to reduce layout movement while the image loads.
  const picture = document.createElement("picture");
  const source = document.createElement("source");
  source.type = "image/webp";
  source.srcset = product.optimizedImage;
  const image = document.createElement("img");
  image.src = product.image;
  image.alt = cartText(product.titleKey, product.id);
  image.width = product.width;
  image.height = product.height;
  image.decoding = "async";
  picture.append(source, image);
  return picture;
}

function renderCart() {
  // Rebuild the view from validated storage data so totals and controls always
  // reflect the current cart state.
  const details = window.Craftsvilla.cart.details();
  cartItems.replaceChildren();
  const isEmpty = details.length === 0;
  emptyCart.hidden = !isEmpty;
  cartSummary.hidden = isEmpty;
  cartItems.hidden = isEmpty;

  let subtotal = 0;
  details.forEach(({ product, quantity }) => {
    subtotal += product.price * quantity;
    const item = document.createElement("article");
    item.className = "cart-item";
    item.dataset.productId = product.id;

    const content = document.createElement("div");
    content.className = "cart-item-content";
    const heading = document.createElement("h2");
    const productName = cartText(product.titleKey, product.id);
    heading.textContent = productName;
    const unitPrice = document.createElement("p");
    unitPrice.textContent = `${cartText("unitPrice", "Unit price")}: ${window.Craftsvilla.formatMoney(product.price)}`;

    const controls = document.createElement("div");
    controls.className = "quantity-controls";
    const decrease = document.createElement("button");
    decrease.type = "button";
    decrease.dataset.action = "decrease";
    decrease.textContent = "−";
    decrease.setAttribute("aria-label", cartText("decreaseQuantity", `Decrease quantity for ${productName}`, { productName }));
    const value = document.createElement("span");
    value.className = "quantity-value";
    value.textContent = String(quantity);
    value.setAttribute("aria-label", `${cartText("quantity", "Quantity")}: ${quantity}`);
    const increase = document.createElement("button");
    increase.type = "button";
    increase.dataset.action = "increase";
    increase.textContent = "+";
    increase.setAttribute("aria-label", cartText("increaseQuantity", `Increase quantity for ${productName}`, { productName }));
    controls.append(decrease, value, increase);

    const itemSubtotal = document.createElement("strong");
    itemSubtotal.className = "item-subtotal";
    itemSubtotal.textContent = window.Craftsvilla.formatMoney(product.price * quantity);
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-item";
    remove.dataset.action = "remove";
    remove.textContent = cartText("removeItem", `Remove ${productName}`, { productName });

    content.append(heading, unitPrice, controls, itemSubtotal, remove);
    item.append(createCartImage(product), content);
    cartItems.appendChild(item);
  });

  cartSubtotal.textContent = window.Craftsvilla.formatMoney(subtotal);
  cartTotal.textContent = window.Craftsvilla.formatMoney(subtotal);
}

// Event delegation handles every quantity button, including elements recreated
// by renderCart().
cartItems?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  const item = event.target.closest(".cart-item");
  if (!button || !item) return;
  const current = window.Craftsvilla.cart.get().find((entry) => entry.productId === item.dataset.productId);
  if (!current) return;
  if (button.dataset.action === "increase") window.Craftsvilla.cart.update(current.productId, current.quantity + 1);
  if (button.dataset.action === "decrease") window.Craftsvilla.cart.update(current.productId, current.quantity - 1);
  if (button.dataset.action === "remove") window.Craftsvilla.cart.remove(current.productId);
});

// Both language and cart changes require visible labels/totals to be refreshed.
document.addEventListener("site-language-change", renderCart);
document.addEventListener("craftsvilla-cart-change", renderCart);
renderCart();
