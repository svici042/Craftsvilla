// Provides reusable accessible validation helpers for every form in the site.
// Return a normalized value for text fields and checkbox state for consent fields.
function getFormValue(form, fieldName) {
  const field = form.elements.namedItem(fieldName);
  if (field?.type === "checkbox") return field.checked ? field.value : "";
  return typeof field?.value === "string" ? field.value.trim() : "";
}

// Attach an accessible inline validation message to one form control.
function setFieldError(field, message) {
  if (!field) return;

  const errorId = `${field.form.id}-${field.name}-error`;
  let error = document.getElementById(errorId);

  // Create one reusable inline error and connect it to the field for screen readers.
  if (!error) {
    error = document.createElement("span");
    error.id = errorId;
    error.className = "field-error";
    error.setAttribute("role", "alert");
    field.insertAdjacentElement("afterend", error);
  }

  error.textContent = message;
  field.setAttribute("aria-invalid", "true");
  field.setAttribute("aria-describedby", errorId);
}

// Remove an existing inline error and its accessibility attributes.
function clearFieldError(field) {
  if (!field) return;

  const errorId = `${field.form.id}-${field.name}-error`;
  document.getElementById(errorId)?.remove();
  field.removeAttribute("aria-invalid");
  field.removeAttribute("aria-describedby");
}

// Run a rule set, display errors, and focus the first invalid control.
function validateFormFields(form, rules) {
  // Each rule returns an empty string when valid or a user-facing error message.
  const invalidFields = [];

  Object.entries(rules).forEach(([fieldName, validate]) => {
    const field = form.elements.namedItem(fieldName);
    const errorMessage = validate(getFormValue(form, fieldName));
    clearFieldError(field);

    if (errorMessage) {
      setFieldError(field, errorMessage);
      invalidFields.push(field);
    }
  });

  // Move focus to the first problem so keyboard users can correct it immediately.
  invalidFields[0]?.focus();
  return invalidFields.length === 0;
}

// Clear field-level feedback when the user starts correcting a value.
function initializeErrorClearing(form) {
  // Remove stale feedback as soon as the user edits the affected control.
  form.addEventListener("input", (event) => {
    if (event.target.matches("input, select, textarea")) {
      clearFieldError(event.target);
    }
  });
}

// Expose a small shared API without coupling forms to this file's internals.
window.formValidation = {
  getValue: getFormValue,
  initializeErrorClearing,
  validateFields: validateFormFields,
};
