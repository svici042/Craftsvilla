// Validates the workshop booking demo locally and displays accessible form feedback.
const bookingForm = document.querySelector("#bookingForm");
const bookingMessage = document.querySelector("#bookingMessage");
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Handles the booking form without sending data to a backend.
if (bookingForm && bookingMessage && window.formValidation) {
  const { getValue, initializeErrorClearing, validateFields } =
    window.formValidation;
  // Convert the current local date to an ISO value accepted by the date input.
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  bookingForm.elements.date.min = today.toISOString().split("T")[0];
  initializeErrorClearing(bookingForm);

  // Validate each required field before showing the simulated success state.
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    bookingMessage.textContent = "";
    bookingMessage.classList.remove("error", "success");

    const isValid = validateFields(bookingForm, {
      name: (value) =>
        value.length >= 2 ? "" : "Please enter at least 2 characters.",
      email: (value) =>
        emailPattern.test(value) ? "" : "Please enter a valid email address.",
      workshop: (value) => (value ? "" : "Please choose a workshop."),
      date: (value) => {
        if (!value) return "Please choose a date.";
        return value >= bookingForm.elements.date.min
          ? ""
          : "Please choose today or a future date.";
      },
    });

    if (!isValid) {
      bookingMessage.textContent =
        typeof translateMessage === "function"
          ? translateMessage("bookingValidationMissing")
          : "Please complete all required booking fields.";
      bookingMessage.classList.add("error");
      return;
    }

    const name = getValue(bookingForm, "name");
    bookingMessage.textContent =
      typeof translateMessage === "function"
        ? translateMessage("bookingValidationSuccess", { name: name })
        : `Thank you, ${name}. Your details were validated locally; this demo did not send a booking request.`;
    bookingMessage.classList.add("success");
    bookingForm.reset();
  });
}
