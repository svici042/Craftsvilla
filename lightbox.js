const galleryItems = Array.from(document.querySelectorAll(".gallery-card"));

if (galleryItems.length) {
  // Build one reusable modal instead of placing duplicate lightbox markup in
  // every gallery card.
  const dialog = document.createElement("dialog");
  dialog.className = "lightbox";
  dialog.setAttribute("aria-labelledby", "lightboxCaption");

  const content = document.createElement("div");
  content.className = "lightbox-content";

  const image = document.createElement("img");
  image.className = "lightbox-image";
  image.alt = "";

  const caption = document.createElement("p");
  caption.id = "lightboxCaption";
  caption.className = "lightbox-caption";

  const closeButton = document.createElement("button");
  closeButton.className = "lightbox-close";
  closeButton.type = "button";
  closeButton.textContent = "×";

  const previousButton = document.createElement("button");
  previousButton.className = "lightbox-nav lightbox-previous";
  previousButton.type = "button";
  previousButton.textContent = "‹";

  const nextButton = document.createElement("button");
  nextButton.className = "lightbox-nav lightbox-next";
  nextButton.type = "button";
  nextButton.textContent = "›";

  content.append(image, caption, closeButton, previousButton, nextButton);
  dialog.appendChild(content);
  document.body.appendChild(dialog);

  let currentIndex = 0;
  let opener = null;

  function getTranslation(key, values = {}) {
    return typeof translateMessage === "function"
      ? translateMessage(key, values)
      : "";
  }

  function updateLabels() {
    // Accessible button labels follow the currently selected site language.
    closeButton.setAttribute(
      "aria-label",
      getTranslation("lightboxClose") || "Close image preview",
    );
    previousButton.setAttribute(
      "aria-label",
      getTranslation("lightboxPrevious") || "Previous image",
    );
    nextButton.setAttribute(
      "aria-label",
      getTranslation("lightboxNext") || "Next image",
    );
  }

  function updateTriggerLabels() {
    galleryItems.forEach((card) => {
      const trigger = card.querySelector(".gallery-trigger");
      const cardCaption = card.querySelector("p")?.textContent.trim() || "image";
      trigger?.setAttribute(
        "aria-label",
        getTranslation("lightboxOpen", { caption: cardCaption }) ||
          `Open larger image: ${cardCaption}`,
      );
    });
  }

  function showItem(index) {
    // Modulo arithmetic wraps navigation from the last image to the first and
    // vice versa.
    currentIndex = (index + galleryItems.length) % galleryItems.length;
    const card = galleryItems[currentIndex];
    const sourceImage = card.querySelector("img");
    const cardCaption = card.querySelector("p")?.textContent.trim() || sourceImage.alt;

    image.src = sourceImage.dataset.fullImage || sourceImage.currentSrc || sourceImage.getAttribute("src");
    image.alt = sourceImage.alt;
    caption.textContent = cardCaption;
  }

  function openLightbox(index, trigger) {
    // Remember the opener so keyboard focus can be restored after closing.
    opener = trigger;
    showItem(index);
    updateLabels();
    document.body.classList.add("lightbox-open");
    dialog.showModal();
    closeButton.focus();
  }

  function closeLightbox() {
    if (dialog.open) dialog.close();
  }

  galleryItems.forEach((card, index) => {
    // A picture is made keyboard-accessible while retaining its visual markup.
    const trigger = card.querySelector("picture");
    const cardCaption = card.querySelector("p")?.textContent.trim() || "image";
    if (!trigger) return;

    trigger.classList.add("gallery-trigger");
    trigger.tabIndex = 0;
    trigger.setAttribute("role", "button");
    trigger.setAttribute(
      "aria-label",
      getTranslation("lightboxOpen", { caption: cardCaption }) ||
        `Open larger image: ${cardCaption}`,
    );

    trigger.addEventListener("click", () => openLightbox(index, trigger));
    trigger.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(index, trigger);
      }
    });
  });

  closeButton.addEventListener("click", closeLightbox);
  previousButton.addEventListener("click", () => showItem(currentIndex - 1));
  nextButton.addEventListener("click", () => showItem(currentIndex + 1));
  // Clicking the backdrop, pressing Escape, or using arrow keys provides the
  // expected modal and gallery controls.
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeLightbox();
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("lightbox-open");
    opener?.focus();
  });
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeLightbox();
  });
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") showItem(currentIndex - 1);
    if (event.key === "ArrowRight") showItem(currentIndex + 1);
  });
  document.addEventListener("site-language-change", () => {
    updateLabels();
    updateTriggerLabels();
    if (dialog.open) showItem(currentIndex);
  });
}
