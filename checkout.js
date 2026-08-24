// Validates checkout details and creates simulated orders in browser storage.
const checkoutForm = document.querySelector("#checkoutForm");
const checkoutItems = document.querySelector("#checkoutItems");
const checkoutTotal = document.querySelector("#checkoutTotal");
const checkoutEmpty = document.querySelector("#checkoutEmpty");
const confirmation = document.querySelector("#orderConfirmation");
const confirmationText = document.querySelector("#confirmationText");
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Read checkout messages from the shared translation dictionary.
function checkoutText(key, fallback, values = {}) {
  return typeof translateMessage === "function" ? translateMessage(key, values) || fallback : fallback;
}

// Return the extra amount associated with the selected delivery option.
function deliveryCost() {
  return checkoutForm?.elements.delivery.value === "express" ? 100 : 0;
}

// Rebuild the visible checkout items and return the calculated order total.
function renderSummary() {
  // Calculate the total while rebuilding the order summary from the live cart.
  const details = window.Craftsvilla.cart.details();
  checkoutItems.replaceChildren();
  const empty = details.length === 0;
  checkoutEmpty.hidden = !empty;
  checkoutForm.hidden = empty;
  let total = deliveryCost();
  details.forEach(({ product, quantity }) => {
    total += product.price * quantity;
    const row = document.createElement("div");
    row.className = "checkout-item";
    const name = document.createElement("span");
    name.textContent = `${checkoutText(product.titleKey, product.id)} × ${quantity}`;
    const price = document.createElement("strong");
    price.textContent = window.Craftsvilla.formatMoney(product.price * quantity);
    row.append(name, price);
    checkoutItems.appendChild(row);
  });
  checkoutTotal.textContent = window.Craftsvilla.formatMoney(total);
  return total;
}

// Create a readable identifier for a browser-local demonstration order.
function createOrderId() {
  // This identifier is suitable for the local demo only; a production backend
  // would generate and guarantee unique order identifiers.
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `CV-${Date.now().toString(36).toUpperCase()}-${random}`;
}

if (checkoutForm && window.formValidation) {
  // Share validation behavior with the booking and feedback forms.
  const { getValue, initializeErrorClearing, validateFields } = window.formValidation;
  initializeErrorClearing(checkoutForm);
  checkoutForm.addEventListener("change", (event) => {
    if (event.target.name === "delivery") renderSummary();
  });
  checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const submitButton = checkoutForm.querySelector('[type="submit"]');
    if (submitButton?.disabled) return;
    const required = (value) => (value ? "" : checkoutText("requiredField", "Please complete this field."));
    const valid = validateFields(checkoutForm, {
      firstName: required, lastName: required,
      email: (value) => emailPattern.test(value) ? "" : checkoutText("invalidEmail", "Enter a valid email address."),
      phone: required, address: required, postalCode: required, city: required, country: required,
      terms: (value) => value ? "" : checkoutText("termsRequired", "Confirm the demonstration terms to continue."),
    });
    if (!valid) return;
    if (submitButton) submitButton.disabled = true;
    const details = window.Craftsvilla.cart.details();
    if (!details.length) {
      renderSummary();
      if (submitButton) submitButton.disabled = false;
      return;
    }
    const now = new Date().toISOString();
    // Store only normalized form values and product identifiers. No real card
    // details or payment credentials are collected by this demonstration.
    const order = {
      id: createOrderId(),
      createdAt: now,
      updatedAt: now,
      customer: {
        name: `${getValue(checkoutForm, "firstName")} ${getValue(checkoutForm, "lastName")}`,
        email: getValue(checkoutForm, "email"),
        phone: getValue(checkoutForm, "phone")
      },
      address: {
        address: getValue(checkoutForm, "address"),
        postalCode: getValue(checkoutForm, "postalCode"),
        city: getValue(checkoutForm, "city"),
        country: getValue(checkoutForm, "country")
      },
      deliveryMethod: getValue(checkoutForm, "delivery"),
      paymentMethod: getValue(checkoutForm, "payment"),
      items: details.map(({ product, quantity }) => ({
        productId: product.id,
        quantity,
        unitPrice: product.price
      })),
      total: renderSummary(),
      status: "New",
      demo: true,
    };
    if (!window.Craftsvilla.orders.add(order)) {
      if (submitButton) submitButton.disabled = false;
      return;
    }
    // Clear the cart only after the order has been validated and saved.
    window.Craftsvilla.cart.clear();
    checkoutForm.hidden = true;
    confirmation.hidden = false;
    confirmationText.textContent = checkoutText("orderConfirmationText", `No payment occurred. Order ${order.id} is stored only in this browser.`, { orderId: order.id });
    confirmation.focus();
  });
}

document.addEventListener("site-language-change", renderSummary);
renderSummary();
