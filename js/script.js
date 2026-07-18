document.addEventListener("DOMContentLoaded", () => {
  // --- LÓGICA DE MODO OSCURO (INICIALIZACIÓN Y PERSISTENCIA) ---
  const themeToggle = document.getElementById("theme-toggle");
  
  const applyTheme = (theme) => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const savedTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light");
  applyTheme(initialTheme);

  themeToggle?.addEventListener("click", () => {
    const isDark = document.documentElement.classList.contains("dark");
    const nextTheme = isDark ? "light" : "dark";
    applyTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
  });

  // 1. Inicialización de Iconos Lucide
  lucide.createIcons();

  // --- ELEMENTOS DEL DOM ---
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  const openBtn = document.getElementById("open-sidebar");
  const closeBtn = document.getElementById("close-sidebar");

  const captchaDisplay = document.getElementById("captcha-display");
  const captchaInput = document.getElementById("captcha-input");
  const refreshBtn = document.getElementById("refresh-captcha");
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  const track = document.getElementById("news-track");
  const nextBtn = document.getElementById("next-news");
  const prevBtn = document.getElementById("prev-news");

  // --- LÓGICA DEL SIDEBAR (MENÚ) ---
  const closeMenu = () => {
    sidebar.classList.add("translate-x-full");
    if (overlay) overlay.classList.add("hidden");
    document.body.style.overflow = "auto";
  };

  const openMenu = () => {
    sidebar.classList.remove("translate-x-full");
    if (overlay) overlay.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  };

  openBtn?.addEventListener("click", openMenu);
  closeBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    closeMenu();
  });
  overlay?.addEventListener("click", closeMenu);

  document.querySelectorAll(".sidebar-link").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  // --- LÓGICA DEL CAPTCHA ---
  let currentCaptcha = "";
  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    currentCaptcha = result;
    if (captchaDisplay) captchaDisplay.textContent = currentCaptcha;
  };

  generateCaptcha();
  refreshBtn?.addEventListener("click", generateCaptcha);

  // --- LÓGICA DEL FORMULARIO DE CONTACTO (ENVÍO REAL) ---
  contactForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 1. Validar CAPTCHA
    if (captchaInput.value.toUpperCase() !== currentCaptcha) {
      formStatus.textContent = "VERIFICACIÓN FALLIDA. INTENTA DE NUEVO.";
      formStatus.className =
        "text-center text-xs font-bold mt-4 text-red-500 block";
      generateCaptcha();
      captchaInput.value = "";
      return;
    }

    // 2. Verificación Honeypot (Anti-Spam)
    if (document.getElementById("hp_field")?.value !== "") return;

    // 3. Estado UI: Enviando
    formStatus.textContent = "ENVIANDO MENSAJE...";
    formStatus.className =
      "text-center text-xs font-bold mt-4 text-blue-600 block";
    formStatus.classList.remove("hidden");

    try {
      // 4. Envío Real a Google Apps Script
      await fetch(
        "https://script.google.com/macros/s/AKfycbxkm50CBmX7GapMhSbOYqrazRYVMthT5Sor_fBr79deq5SsbukOiysIS7XRC8B6HDonmQ/exec",
        {
          method: "POST",
          mode: "no-cors",
          body: new FormData(contactForm),
        },
      );

      // 5. Estado UI: Éxito
      formStatus.textContent = "¡MENSAJE ENVIADO CON ÉXITO!";
      formStatus.className =
        "text-center text-xs font-bold mt-4 text-green-600 block";
      contactForm.reset();
      generateCaptcha();
    } catch (error) {
      formStatus.textContent = "ERROR AL ENVIAR. INTENTA MÁS TARDE.";
      formStatus.className =
        "text-center text-xs font-bold mt-4 text-red-500 block";
      console.error("Error en el envío:", error);
    }
  });

  // --- LÓGICA DEL CARRUSEL DE NOTICIAS ---
  if (track && nextBtn && prevBtn) {
    let newsIndex = 0;

    const getVisibleCardsCount = () => {
      const trackWidth = track.parentElement.offsetWidth;
      const cardWidth = track.firstElementChild.offsetWidth + 32;
      return Math.max(1, Math.floor(trackWidth / cardWidth));
    };

    const updateSlider = () => {
      const cardWidth = track.firstElementChild.offsetWidth + 32;
      track.style.transform = `translateX(-${newsIndex * cardWidth}px)`;
    };

    nextBtn.addEventListener("click", () => {
      const visibleCards = getVisibleCardsCount();
      const maxIndex = Math.max(0, track.children.length - visibleCards);
      if (newsIndex < maxIndex) {
        newsIndex++;
      } else {
        newsIndex = 0;
      }
      updateSlider();
    });

    prevBtn.addEventListener("click", () => {
      if (newsIndex > 0) {
        newsIndex--;
        updateSlider();
      }
    });

    // Soporte Táctil
    let touchStartX = 0;
    track.addEventListener(
      "touchstart",
      (e) => (touchStartX = e.changedTouches[0].screenX),
    );
    track.addEventListener("touchend", (e) => {
      let touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 50) nextBtn.click();
      if (touchEndX - touchStartX > 50) prevBtn.click();
    });

    window.addEventListener("resize", () => {
      const visibleCards = getVisibleCardsCount();
      const maxIndex = Math.max(0, track.children.length - visibleCards);
      if (newsIndex > maxIndex) {
        newsIndex = maxIndex;
      }
      updateSlider();
    });
  }

  // --- LÓGICA DE SCROLL REVEAL (ANIMACIONES) ---
  const reveals = document.querySelectorAll(".reveal");
  const revealOnScroll = () => {
    reveals.forEach((el) => {
      const windowHeight = window.innerHeight;
      const elementTop = el.getBoundingClientRect().top;
      if (elementTop < windowHeight - 150) {
        el.classList.add("active");
      }
    });
  };

  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll();

  // --- ENLACES INTERNOS (SCROLL SUAVE) ---
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const targetElement = document.querySelector(href);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });

  // --- LÓGICA DE TRADUCCIÓN DE IDIOMAS (UNIFICADA - DECOUPLED ASYNC) ---
  const loadedTranslations = {};

  const changeLanguage = async (lang) => {
    if (!loadedTranslations[lang]) {
      try {
        const response = await fetch(`./locales/${lang}.json`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        loadedTranslations[lang] = await response.json();
      } catch (err) {
        console.error("Error loading locale file:", err);
        return;
      }
    }

    const dict = loadedTranslations[lang];
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-key]").forEach((el) => {
      const key = el.getAttribute("data-key");
      if (dict && dict[key]) {
        if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
          el.setAttribute("placeholder", dict[key]);
        } else {
          el.innerHTML = dict[key];
        }
      }
    });
    
    // Volver a renderizar los iconos Lucide creados dinámicamente
    if (window.lucide) {
      window.lucide.createIcons();
    }
  };

  const langButtons = document.querySelectorAll(".lang-btn-container button");

  const updateLangUI = (lang) => {
    langButtons.forEach((btn) => {
      const btnLang = btn.textContent.trim().toLowerCase();
      if (btnLang === lang) {
        btn.classList.remove("text-slate-400");
        btn.classList.add("text-blue-600");
      } else {
        btn.classList.remove("text-blue-600");
        btn.classList.add("text-slate-400");
      }
    });
  };
  
  // Autodetección de idioma y persistencia
  const savedLang = localStorage.getItem("language");
  const systemLang = navigator.language || navigator.userLanguage;
  const initialLang = savedLang || (systemLang.startsWith("en") ? "en" : "es");
  
  changeLanguage(initialLang).then(() => {
    updateLangUI(initialLang);
  });

  langButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const selectedLang = btn.textContent.trim().toLowerCase();
      changeLanguage(selectedLang).then(() => {
        updateLangUI(selectedLang);
        localStorage.setItem("language", selectedLang);
      });
    });
  });
});
