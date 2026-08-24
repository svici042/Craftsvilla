// Renders and updates browser-local demonstration orders for the administration page.
// Static front-end demonstration only: this page has no secure authentication or authorization.
const orderList = document.querySelector("#orderList");
const adminEmpty = document.querySelector("#adminEmpty");
const adminStats = document.querySelector("#adminStats");
const orderSearch = document.querySelector("#orderSearch");
const statusFilter = document.querySelector("#statusFilter");
const orderSort = document.querySelector("#orderSort");
const adminMessage = document.querySelector("#adminMessage");
const orderDialog = document.querySelector("#orderDialog");
const orderDetails = document.querySelector("#orderDetails");
const closeOrderDialog = document.querySelector("#closeOrderDialog");
const createDemoOrderButton = document.querySelector("#createDemoOrder");
const clearOrdersButton = document.querySelector("#clearOrders");

let activeDialogOrderId = null;
let dialogReturnFocus = null;
let adminMessageState = null;

// Read admin translations from the shared language system without duplicating it.
function adminText(key, fallback, values = {}) {
  const translated = window.translateMessage?.(key, values);
  if (translated) return translated;
  return Object.keys(values).reduce(
    (text, name) => text.replaceAll(`{${name}}`, values[name]),
    fallback,
  );
}

function adminLocale() {
  return document.documentElement.lang === "no" ? "nb-NO" : "en-GB";
}

function statusLabel(status) {
  const keys = {
    New: "adminStatusNew",
    Processing: "adminStatusProcessing",
    Ready: "adminStatusReady",
    Shipped: "adminStatusShipped",
    Completed: "adminStatusCompleted",
    Cancelled: "adminStatusCancelled",
  };
  return adminText(keys[status], status);
}

function deliveryLabel(method) {
  const keys = {
    standard: "adminDeliveryStandard",
    express: "adminDeliveryExpress",
    pickup: "adminDeliveryPickup",
  };
  return adminText(keys[method], method);
}

function itemCountLabel(count) {
  const key = count === 1 ? "adminItemSingular" : "adminItemPlural";
  const fallback = count === 1 ? "{count} item" : "{count} items";
  return adminText(key, fallback, { count });
}

function setAdminMessage(key, fallback, values = {}) {
  adminMessageState = { key, fallback, values };
  adminMessage.textContent = adminText(key, fallback, values);
}

// Rebuild status choices with translated labels while keeping stable values.
function renderStatusFilter() {
  const selectedStatus = statusFilter.value || "all";
  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = adminText("adminAllStatuses", "All statuses");
  const options = window.Craftsvilla.orderStatuses.map((status) => {
    const option = document.createElement("option");
    option.value = status;
    option.textContent = statusLabel(status);
    return option;
  });
  statusFilter.replaceChildren(allOption, ...options);
  statusFilter.value = window.Craftsvilla.orderStatuses.includes(selectedStatus)
    ? selectedStatus
    : "all";
}

// Build one reusable statistics tile for the dashboard summary.
function createStat(label, value) {
  const card = document.createElement("article");
  const heading = document.createElement("h2");
  heading.textContent = label;
  const output = document.createElement("strong");
  output.textContent = String(value);
  card.append(heading, output);
  return card;
}

// Convert stored demonstration payment codes into readable labels.
function paymentLabel(method) {
  const keys = {
    "card-demo": "adminPaymentCard",
    "vipps-demo": "adminPaymentVipps",
    "pickup-demo": "adminPaymentPickup",
  };
  return adminText(keys[method] || "adminPaymentUnknown", "Unknown");
}

function renderStats(orders) {
  // Derive dashboard totals from the currently stored orders.
  const totalValue = orders.reduce((sum, order) => sum + order.total, 0);
  adminStats.replaceChildren(
    createStat(adminText("adminStatTotalOrders", "Total orders"), orders.length),
    createStat(statusLabel("New"), orders.filter((order) => order.status === "New").length),
    createStat(statusLabel("Processing"), orders.filter((order) => order.status === "Processing").length),
    createStat(statusLabel("Completed"), orders.filter((order) => order.status === "Completed").length),
    createStat(statusLabel("Cancelled"), orders.filter((order) => order.status === "Cancelled").length),
    createStat(adminText("adminStatOrderValue", "Order value"), window.Craftsvilla.formatMoney(totalValue)),
  );
}

function filteredOrders() {
  // Apply the selected search, status, and date ordering before rendering.
  const query = orderSearch.value.trim().toLowerCase().slice(0, 160);
  const status = statusFilter.value;
  const orders = window.Craftsvilla.orders.get().filter((order) => {
    const matchesStatus = status === "all" || order.status === status;
    const haystack = `${order.id} ${order.customer.name} ${order.customer.email}`.toLowerCase();
    return matchesStatus && (!query || haystack.includes(query));
  });
  const direction = orderSort.value;
  return orders.sort((a, b) => {
    if (direction === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
    if (direction === "highest") return b.total - a.total;
    if (direction === "lowest") return a.total - b.total;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
}

function updateOrderStatus(orderId, status) {
  // Update only known statuses and record when the local order changed.
  if (!window.Craftsvilla.orderStatuses.includes(status)) return;
  const orders = window.Craftsvilla.orders.get();
  const order = orders.find((entry) => entry.id === orderId);
  if (!order) return;
  order.status = status;
  order.updatedAt = new Date().toISOString();
  window.Craftsvilla.orders.save(orders);
  setAdminMessage("adminOrderUpdated", "Order {orderId} updated to {status}.", {
    orderId,
    status: statusLabel(status),
    statusValue: status,
  });
  renderAdmin();
}

// Remove an order only after explicit confirmation from the user.
function deleteOrder(orderId) {
  if (!confirm(adminText("adminDeleteConfirm", "Delete demonstration order {orderId}?", { orderId }))) return;
  window.Craftsvilla.orders.save(window.Craftsvilla.orders.get().filter((order) => order.id !== orderId));
  setAdminMessage("adminOrderDeleted", "Order {orderId} deleted.", { orderId });
  renderAdmin();
}

function renderOrderDetails(orderId) {
  // Populate the reusable dialog with translated labels and safe text nodes.
  const order = window.Craftsvilla.orders.get().find((entry) => entry.id === orderId);
  if (!order) return false;
  orderDetails.replaceChildren();
  const customer = document.createElement("p");
  customer.textContent = `${order.customer.name} · ${order.customer.email} · ${order.customer.phone}`;
  const address = document.createElement("p");
  address.textContent = `${order.address.address}, ${order.address.postalCode} ${order.address.city}, ${order.address.country}`;
  const meta = document.createElement("p");
  meta.textContent = `${paymentLabel(order.paymentMethod)} · ${deliveryLabel(order.deliveryMethod)} · ${statusLabel(order.status)}`;
  const items = document.createElement("ul");
  order.items.forEach((item) => {
    const product = window.Craftsvilla.productMap.get(item.productId);
    const row = document.createElement("li");
    const productName = product
      ? adminText(product.titleKey, product.id)
      : item.productId;
    row.textContent = `${productName} × ${item.quantity} — ${window.Craftsvilla.formatMoney(item.unitPrice * item.quantity)}`;
    items.appendChild(row);
  });
  const total = document.createElement("strong");
  total.textContent = adminText("adminTotal", "Total: {total}", {
    total: window.Craftsvilla.formatMoney(order.total),
  });
  orderDetails.append(customer, address, meta, items, total);
  return true;
}

function findOrderViewButton(orderId) {
  return [...orderList.querySelectorAll(".admin-order-card")]
    .find((card) => card.dataset.orderId === orderId)
    ?.querySelector(".view-order");
}

function openOrder(orderId, trigger) {
  // Open one reusable dialog and remember where keyboard focus should return.
  if (!renderOrderDetails(orderId)) return;
  activeDialogOrderId = orderId;
  dialogReturnFocus = trigger;
  orderDialog.showModal();
  closeOrderDialog.focus();
}

// Build one interactive order summary card for the administration list.
function createOrderCard(order) {
  // Build cards with DOM APIs so stored customer text is never parsed as HTML.
  const card = document.createElement("article");
  card.className = "admin-order-card";
  card.dataset.orderId = order.id;
  const title = document.createElement("h2");
  title.textContent = order.id;
  const info = document.createElement("p");
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  info.textContent = `${new Date(order.createdAt).toLocaleString(adminLocale())} · ${order.customer.name} · ${itemCountLabel(itemCount)}`;
  const meta = document.createElement("p");
  meta.textContent = `${window.Craftsvilla.formatMoney(order.total)} · ${paymentLabel(order.paymentMethod)} · ${deliveryLabel(order.deliveryMethod)}`;
  const status = document.createElement("select");
  status.setAttribute(
    "aria-label",
    adminText("adminStatusForOrder", "Status for order {orderId}", { orderId: order.id }),
  );
  window.Craftsvilla.orderStatuses.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = statusLabel(value);
    option.selected = value === order.status;
    status.appendChild(option);
  });
  status.addEventListener("change", () => updateOrderStatus(order.id, status.value));
  const actions = document.createElement("div");
  actions.className = "admin-order-actions";
  const view = document.createElement("button");
  view.type = "button";
  view.className = "btn secondary view-order";
  view.textContent = adminText("adminViewDetails", "View details");
  view.addEventListener("click", () => openOrder(order.id, view));
  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "btn danger-button";
  remove.textContent = adminText("adminDelete", "Delete");
  remove.addEventListener("click", () => deleteOrder(order.id));
  actions.append(view, remove);
  card.append(title, info, meta, status, actions);
  return card;
}

function renderAdmin() {
  // Rebuild both statistics and the visible list from validated storage.
  const allOrders = window.Craftsvilla.orders.get();
  const visible = filteredOrders();
  renderStats(allOrders);
  orderList.replaceChildren(...visible.map(createOrderCard));
  adminEmpty.hidden = visible.length !== 0;
}

function createSampleOrder() {
  // Seed data keeps the static administration demo useful on first use.
  const product = window.Craftsvilla.products[3];
  const now = new Date().toISOString();
  const order = {
    id: `DEMO-${Date.now().toString(36).toUpperCase()}`,
    createdAt: now,
    updatedAt: now,
    customer: {
      name: adminText("adminDemoCustomer", "Demo Customer"),
      email: "demo@example.com",
      phone: "+47 000 00 000"
    },
    address: {
      address: adminText("adminDemoAddress", "Example Street 1"),
      postalCode: "0001",
      city: "Oslo",
      country: adminText("adminDemoCountry", "Norway")
    },
    deliveryMethod: "standard",
    paymentMethod: "card-demo",
    items: [
      {
        productId: product.id,
        quantity: 1,
        unitPrice: product.price
      }
    ],
    total: product.price,
    status: "New",
    demo: true
  };
  window.Craftsvilla.orders.add(order);
  setAdminMessage("adminSampleCreated", "Sample demonstration order created.");
  renderAdmin();
}

[orderSearch, statusFilter, orderSort].forEach((control) => control.addEventListener("input", renderAdmin));
createDemoOrderButton.addEventListener("click", createSampleOrder);
clearOrdersButton.addEventListener("click", () => {
  if (!confirm(adminText("adminClearConfirm", "Clear every locally stored demonstration order? This cannot be undone."))) return;
  window.Craftsvilla.orders.save([]);
  setAdminMessage("adminAllCleared", "All demonstration orders cleared.");
  renderAdmin();
});
closeOrderDialog.addEventListener("click", () => orderDialog.close());
orderDialog.addEventListener("click", (event) => {
  if (event.target === orderDialog) orderDialog.close();
});

orderDialog.addEventListener("close", () => {
  const focusTarget = dialogReturnFocus?.isConnected
    ? dialogReturnFocus
    : findOrderViewButton(activeDialogOrderId);
  activeDialogOrderId = null;
  dialogReturnFocus = null;
  focusTarget?.focus();
});

// Refresh every generated label as soon as nav.js changes the site language.
document.addEventListener("site-language-change", () => {
  renderStatusFilter();
  renderAdmin();
  if (adminMessageState) {
    const messageValues = { ...adminMessageState.values };
    if (messageValues.statusValue) {
      messageValues.status = statusLabel(messageValues.statusValue);
    }
    adminMessage.textContent = adminText(
      adminMessageState.key,
      adminMessageState.fallback,
      messageValues,
    );
  }
  if (activeDialogOrderId && orderDialog.open) {
    dialogReturnFocus = findOrderViewButton(activeDialogOrderId);
    renderOrderDetails(activeDialogOrderId);
  }
});

renderStatusFilter();
renderAdmin();
