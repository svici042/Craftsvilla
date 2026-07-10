function getFormValue(form, fieldName) {
  const field = form.elements.namedItem(fieldName);
  if (field?.type === "checkbox") return field.checked ? field.value : "";
  return typeof field?.value === "string" ? field.value.trim() : "";
}

function setFieldError(field, message) {
  if (!field) return;

  const errorId = `${field.form.id}-${field.name}-error`;
  let error = document.getElementById(errorId);

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

function clearFieldError(field) {
  if (!field) return;

  const errorId = `${field.form.id}-${field.name}-error`;
  document.getElementById(errorId)?.remove();
  field.removeAttribute("aria-invalid");
  field.removeAttribute("aria-describedby");
}

function validateFormFields(form, rules) {
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

  invalidFields[0]?.focus();
  return invalidFields.length === 0;
}

function initializeErrorClearing(form) {
  form.addEventListener("input", (event) => {
    if (event.target.matches("input, select, textarea")) {
      clearFieldError(event.target);
    }
  });
}

window.formValidation = {
  getValue: getFormValue,
  initializeErrorClearing,
  validateFields: validateFormFields,
};
