const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector("nav");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("open");
  });
}
