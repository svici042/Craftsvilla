const bookingForm = document.querySelector("#bookingForm");
const bookingMessage = document.querySelector("#bookingMessage");

// Handles the booking form without sending data to a backend.
if (bookingForm && bookingMessage) {
  bookingForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(bookingForm);
    const name = formData.get("name").trim();
    const email = formData.get("email").trim();
    const workshop = formData.get("workshop");
    const date = formData.get("date");

    // Shows a translated error when required fields are missing.
    if (!name || !email || !workshop || workshop === "" || !date) {
      bookingMessage.textContent =
        typeof translateMessage === "function"
          ? translateMessage("bookingValidationMissing")
          : "Please complete all required booking fields.";
      bookingMessage.classList.add("error");
      return;
    }

    // Shows a translated success message and clears the form.
    bookingMessage.textContent =
      typeof translateMessage === "function"
        ? translateMessage("bookingValidationSuccess", { name: name })
        : "Thank you, " + name + "! Your booking request has been received.";
    bookingMessage.classList.remove("error");
    bookingForm.reset();
  });
}
