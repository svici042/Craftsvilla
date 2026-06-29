const feedbackForm = document.querySelector(".feedback-form");
const feedbackMessage = document.querySelector("#feedbackMessage");

// Handles feedback locally so the page does not reload on submit.
if (feedbackForm && feedbackMessage) {
  feedbackForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(feedbackForm);
    const name = formData.get("name").trim();
    const message = formData.get("message").trim();

    // Name and message are required before showing a success state.
    if (!name || !message) {
      feedbackMessage.textContent =
        typeof translateMessage === "function"
          ? translateMessage("feedbackValidationMissing")
          : "Please enter your name and feedback message.";
      feedbackMessage.classList.add("error");
      return;
    }

    // Uses the shared translation helper for the confirmation text.
    feedbackMessage.textContent =
      typeof translateMessage === "function"
        ? translateMessage("feedbackValidationSuccess", { name: name })
        : "Thank you, " + name + ". Your feedback has been sent.";
    feedbackMessage.classList.remove("error");
    feedbackForm.reset();
  });
}
