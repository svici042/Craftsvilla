const feedbackForm = document.querySelector(".feedback-form");
const feedbackMessage = document.querySelector("#feedbackMessage");

if (feedbackForm && feedbackMessage) {
  feedbackForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(feedbackForm);
    const name = formData.get("name").trim();
    const message = formData.get("message").trim();

    if (!name || !message) {
      feedbackMessage.textContent =
        typeof translateMessage === "function"
          ? translateMessage("feedbackValidationMissing")
          : "Please enter your name and feedback message.";
      feedbackMessage.classList.add("error");
      return;
    }

    feedbackMessage.textContent =
      typeof translateMessage === "function"
        ? translateMessage("feedbackValidationSuccess", { name: name })
        : "Thank you, " + name + ". Your feedback has been sent.";
    feedbackMessage.classList.remove("error");
    feedbackForm.reset();
  });
}
