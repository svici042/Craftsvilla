// Validates the feedback demo locally and reports success without storing or sending data.
const feedbackForm = document.querySelector("#feedbackForm");
const feedbackMessage = document.querySelector("#feedbackMessage");
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Handles feedback locally so the page does not reload on submit.
if (feedbackForm && feedbackMessage && window.formValidation) {
  const { getValue, initializeErrorClearing, validateFields } =
    window.formValidation;
  initializeErrorClearing(feedbackForm);

  // Reset old status messages before validating the current form values.
  feedbackForm.addEventListener("submit", (event) => {
    event.preventDefault();
    feedbackMessage.textContent = "";
    feedbackMessage.classList.remove("error", "success");

    const isValid = validateFields(feedbackForm, {
      name: (value) =>
        value.length >= 2 ? "" : "Please enter at least 2 characters.",
      email: (value) =>
        !value || emailPattern.test(value)
          ? ""
          : "Please enter a valid email address.",
      message: (value) =>
        value.length >= 10 ? "" : "Please enter at least 10 characters.",
    });

    if (!isValid) {
      feedbackMessage.textContent =
        typeof translateMessage === "function"
          ? translateMessage("feedbackValidationMissing")
          : "Please enter your name and feedback message.";
      feedbackMessage.classList.add("error");
      return;
    }

    const name = getValue(feedbackForm, "name");
    feedbackMessage.textContent =
      typeof translateMessage === "function"
        ? translateMessage("feedbackValidationSuccess", { name: name })
        : `Thank you, ${name}. Your feedback was validated locally and was not sent or stored.`;
    feedbackMessage.classList.add("success");
    feedbackForm.reset();
  });
}
