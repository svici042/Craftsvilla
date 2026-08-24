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

window.Craftsvilla.orderStatuses.forEach((status) => {
  const option = document.createElement("option");
  option.value = status;
  option.textContent = status;
  statusFilter.appendChild(option);
});

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
  return { "card-demo": "Card (simulated)", "vipps-demo": "Vipps (simulated)", "pickup-demo": "Pay on pickup (simulated)" }[method] || "Unknown";
}

function renderStats(orders) {
  // Derive dashboard totals from the currently stored orders.
  const totalValue = orders.reduce((sum, order) => sum + order.total, 0);
  adminStats.replaceChildren(
    createStat("Total orders", orders.length),
    createStat("New", orders.filter((order) => order.status === "New").length),
    createStat("Processing", orders.filter((order) => order.status === "Processing").length),
    createStat("Completed", orders.filter((order) => order.status === "Completed").length),
    createStat("Cancelled", orders.filter((order) => order.status === "Cancelled").length),
    createStat("Order value", window.Craftsvilla.formatMoney(totalValue)),
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
  adminMessage.textContent = `Order ${orderId} updated to ${status}.`;
  renderAdmin();
}

// Remove an order only after explicit confirmation from the user.
function deleteOrder(orderId) {
  if (!confirm(`Delete demonstration order ${orderId}?`)) return;
  window.Craftsvilla.orders.save(window.Craftsvilla.orders.get().filter((order) => order.id !== orderId));
  adminMessage.textContent = `Order ${orderId} deleted.`;
  renderAdmin();
}

function openOrder(orderId, trigger) {
  // Populate one reusable dialog and return focus to its opener on close.
  const order = window.Craftsvilla.orders.get().find((entry) => entry.id === orderId);
  if (!order) return;
  orderDetails.replaceChildren();
  const customer = document.createElement("p");
  customer.textContent = `${order.customer.name} · ${order.customer.email} · ${order.customer.phone}`;
  const address = document.createElement("p");
  address.textContent = `${order.address.address}, ${order.address.postalCode} ${order.address.city}, ${order.address.country}`;
  const meta = document.createElement("p");
  meta.textContent = `${paymentLabel(order.paymentMethod)} · ${order.deliveryMethod} · ${order.status}`;
  const items = document.createElement("ul");
  order.items.forEach((item) => {
    const product = window.Craftsvilla.productMap.get(item.productId);
    const row = document.createElement("li");
    row.textContent = `${product?.id || item.productId} × ${item.quantity} — ${window.Craftsvilla.formatMoney(item.unitPrice * item.quantity)}`;
    items.appendChild(row);
  });
  const total = document.createElement("strong");
  total.textContent = `Total: ${window.Craftsvilla.formatMoney(order.total)}`;
  orderDetails.append(customer, address, meta, items, total);
  orderDialog.showModal();
  closeOrderDialog.focus();
  orderDialog.addEventListener("close", () => trigger.focus(), { once: true });
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
  info.textContent = `${new Date(order.createdAt).toLocaleString()} · ${order.customer.name} · ${itemCount} item(s)`;
  const meta = document.createElement("p");
  meta.textContent = `${window.Craftsvilla.formatMoney(order.total)} · ${paymentLabel(order.paymentMethod)} · ${order.deliveryMethod}`;
  const status = document.createElement("select");
  status.setAttribute("aria-label", `Status for order ${order.id}`);
  window.Craftsvilla.orderStatuses.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    option.selected = value === order.status;
    status.appendChild(option);
  });
  status.addEventListener("change", () => updateOrderStatus(order.id, status.value));
  const actions = document.createElement("div");
  actions.className = "admin-order-actions";
  const view = document.createElement("button");
  view.type = "button";
  view.className = "btn secondary";
  view.textContent = "View details";
  view.addEventListener("click", () => openOrder(order.id, view));
  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "btn danger-button";
  remove.textContent = "Delete";
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
      name: "Demo Customer",
      email: "demo@example.com",
      phone: "+47 000 00 000"
    },
    address: {
      address: "Example Street 1",
      postalCode: "0001",
      city: "Oslo",
      country: "Norway"
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
  adminMessage.textContent = "Sample demonstration order created.";
  renderAdmin();
}

[orderSearch, statusFilter, orderSort].forEach((control) => control.addEventListener("input", renderAdmin));
document.querySelector("#createDemoOrder").addEventListener("click", createSampleOrder);
document.querySelector("#clearOrders").addEventListener("click", () => {
  if (!confirm("Clear every locally stored demonstration order? This cannot be undone.")) return;
  window.Craftsvilla.orders.save([]);
  adminMessage.textContent = "All demonstration orders cleared.";
  renderAdmin();
});
closeOrderDialog.addEventListener("click", () => orderDialog.close());
orderDialog.addEventListener("click", (event) => {
  if (event.target === orderDialog) orderDialog.close();
});
renderAdmin();
