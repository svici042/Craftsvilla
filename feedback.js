const feedbackForm = document.querySelector(".feedback-form");
const feedbackMessage = document.querySelector("#feedbackMessage");

function setFieldInvalid(form, fieldName, isInvalid) {
  const field = form.elements.namedItem(fieldName);

  if (field) {
    field.setAttribute("aria-invalid", String(isInvalid));
  }
}

// Handles feedback locally so the page does not reload on submit.
if (feedbackForm && feedbackMessage) {
  feedbackForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(feedbackForm);
    const name = formData.get("name").trim();
    const message = formData.get("message").trim();
    const missingFields = {
      name: !name,
      message: !message,
    };

    Object.entries(missingFields).forEach(([fieldName, isInvalid]) => {
      setFieldInvalid(feedbackForm, fieldName, isInvalid);
    });

    // Name and message are required before showing a success state.
    if (Object.values(missingFields).some(Boolean)) {
      feedbackMessage.textContent =
        typeof translateMessage === "function"
          ? translateMessage("feedbackValidationMissing")
          : "Please enter your name and feedback message.";
      feedbackMessage.classList.add("error");
      return;
    }

    ["name", "message"].forEach((fieldName) => {
      setFieldInvalid(feedbackForm, fieldName, false);
    });

    // Uses the shared translation helper for the confirmation text.
    feedbackMessage.textContent =
      typeof translateMessage === "function"
        ? translateMessage("feedbackValidationSuccess", { name: name })
        : "Thank you, " + name + ". Your feedback has been sent.";
    feedbackMessage.classList.remove("error");
    feedbackForm.reset();
  });
}
