document.addEventListener("DOMContentLoaded", () => {
  // --- LÓGICA DEL MENÚ HAMBURGUESA ---
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const links = document.querySelectorAll(".nav-link");

  if (menuToggle) {
    const icon = menuToggle.querySelector("i");

    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");

      // Cambiar ícono entre Barras y X
      if (navLinks.classList.contains("active")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-xmark");
      } else {
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
      }
    });

    // Cerrar menú al hacer clic en un enlace
    links.forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
      });
    });
  }

  // --- EFECTO SUAVE EN EL SCROLL (CORREGIDO) ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");

      // CASO ESPECIAL: Si el href es solo "#", subir al inicio
      if (targetId === "#") {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
      // CASO NORMAL: Si es un ancla (ej: #sobre-mi), buscar la sección
      else {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
          });
        }
      }
    });
  });
});
