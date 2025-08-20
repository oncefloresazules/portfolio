// Variables globales
let currentLanguage = "es"
let mouseX = 0
let mouseY = 0

// Elementos del DOM
const loader = document.querySelector(".loader")
const cursor = document.querySelector(".cursor")
const cursorDot = document.querySelector(".cursor-dot")
const cursorOutline = document.querySelector(".cursor-outline")
const navItems = document.querySelectorAll(".nav-item")
const navToggle = document.querySelector(".nav-toggle")
const navMenu = document.querySelector(".nav-menu")
const langButtons = document.querySelectorAll(".lang-btn")

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  initLoader()
  initCursor()
  initNavigation()
  initFilters()
  initLanguageSwitch()
  initInteractions()
})

// Loader mejorado - solo primera vez
function initLoader() {
  const loadingText = document.getElementById("loading-text")
  if (!loadingText) return

  // Verificar si ya se mostró el loader en esta sesión
  const hasSeenLoader = sessionStorage.getItem("portfolio-loader-shown")

  if (hasSeenLoader) {
    // Si ya se mostró, ocultar inmediatamente
    loader.classList.add("hidden")
    return
  }

  const loadingMessages = [
    "Inicializando portfolio...",
    "Cargando proyectos creativos...",
    "Preparando experiencia audiovisual...",
    "Compilando arte y tecnología...",
    "¡Listo para explorar!",
  ]

  let messageIndex = 0
  const messageInterval = setInterval(() => {
    if (messageIndex < loadingMessages.length - 1) {
      loadingText.textContent = loadingMessages[messageIndex]
      messageIndex++
    } else {
      clearInterval(messageInterval)
      setTimeout(() => {
        loader.classList.add("hidden")
        // Marcar que el loader ya se mostró en esta sesión
        sessionStorage.setItem("portfolio-loader-shown", "true")
      }, 500)
    }
  }, 600)
}

// Sistema de idiomas mejorado con persistencia
function initLanguageSwitch() {
  // Cargar idioma guardado o usar español por defecto
  const savedLang = localStorage.getItem("portfolio-language") || "es"
  currentLanguage = savedLang

  // Aplicar idioma guardado al cargar la página
  switchLanguage(currentLanguage)

  // Actualizar botón activo
  langButtons.forEach((btn) => {
    if (btn.getAttribute("data-lang") === currentLanguage) {
      btn.classList.add("active")
    } else {
      btn.classList.remove("active")
    }
  })

  langButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang")
      currentLanguage = lang

      // Guardar idioma en localStorage
      localStorage.setItem("portfolio-language", lang)

      switchLanguage(lang)

      // Actualizar botones activos
      langButtons.forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")

      // Cerrar menú móvil después de cambiar idioma
      if (navMenu && navMenu.classList.contains("active")) {
        navMenu.classList.remove("active")
        if (navToggle) navToggle.classList.remove("active")
      }
    })
  })
}

function switchLanguage(lang) {
  currentLanguage = lang

  // Cambiar contenido de elementos con data-es y data-en
  const elements = document.querySelectorAll("[data-es][data-en]")
  elements.forEach((el) => {
    if (lang === "es") {
      el.textContent = el.getAttribute("data-es")
    } else {
      el.textContent = el.getAttribute("data-en")
    }
  })

  // Mostrar/ocultar contenido por idioma
  const langContents = document.querySelectorAll(".lang-content")
  langContents.forEach((content) => {
    const contentLang = content.getAttribute("data-lang")
    if (contentLang === lang) {
      content.style.display = "block"
    } else {
      content.style.display = "none"
    }
  })
}

// Cursor personalizado
function initCursor() {
  // Solo mostrar cursor personalizado en desktop
  if (window.innerWidth <= 768) {
    if (cursor) cursor.style.display = "none"
    document.body.style.cursor = "auto"
    return
  }

  if (cursor) cursor.style.display = "block"
  document.body.style.cursor = "none"

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX
    mouseY = e.clientY

    if (cursorDot) {
      cursorDot.style.left = mouseX + "px"
      cursorDot.style.top = mouseY + "px"
    }

    if (cursorOutline) {
      cursorOutline.style.left = mouseX + "px"
      cursorOutline.style.top = mouseY + "px"
    }
  })

  // Efectos hover
  const hoverElements = document.querySelectorAll("a, button, .project-item, .filter-btn, .nav-item")

  hoverElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      if (cursorDot) {
        cursorDot.style.transform = "translate(-50%, -50%) scale(1.5)"
        cursorDot.style.background = "var(--accent-secondary)"
      }
      if (cursorOutline) {
        cursorOutline.style.transform = "translate(-50%, -50%) scale(1.3)"
        cursorOutline.style.borderColor = "var(--accent-secondary)"
      }
    })

    el.addEventListener("mouseleave", () => {
      if (cursorDot) {
        cursorDot.style.transform = "translate(-50%, -50%) scale(1)"
        cursorDot.style.background = "var(--accent-color)"
      }
      if (cursorOutline) {
        cursorOutline.style.transform = "translate(-50%, -50%) scale(1)"
        cursorOutline.style.borderColor = "var(--accent-color)"
      }
    })
  })
}

// Navegación
function initNavigation() {
  // Navegación móvil
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active")
      navToggle.classList.toggle("active")
    })
  }

  // Cerrar menú móvil al hacer clic en un enlace
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      if (navMenu) navMenu.classList.remove("active")
      if (navToggle) navToggle.classList.remove("active")
    })
  })

  // Cerrar menú al hacer clic fuera de él
  document.addEventListener("click", (e) => {
    if (navMenu && navMenu.classList.contains("active")) {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navMenu.classList.remove("active")
        navToggle.classList.remove("active")
      }
    }
  })
}

// Filtros de proyectos
function initFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn")
  const projectItems = document.querySelectorAll(".project-item")

  if (!filterBtns.length || !projectItems.length) return

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter")

      // Actualizar botones activos
      filterBtns.forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")

      // Filtrar elementos
      projectItems.forEach((item) => {
        const category = item.getAttribute("data-category")

        if (filter === "all" || category === filter) {
          item.style.display = "block"
          item.style.animation = "fadeInUp 0.6s ease-out"
        } else {
          item.style.display = "none"
        }
      })
    })
  })
}

// Interacciones generales
function initInteractions() {
  // Efectos hover en proyectos
  const projectItems = document.querySelectorAll(".project-item")
  projectItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      item.style.zIndex = "10"
    })

    item.addEventListener("mouseleave", () => {
      item.style.zIndex = "1"
    })
  })

  // Animaciones de entrada
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  // Observar elementos para animaciones
  const animatedElements = document.querySelectorAll(".project-item, .content-section, .contact-method")
  animatedElements.forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(30px)"
    el.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out"
    observer.observe(el)
  })
}

// Manejo de resize
window.addEventListener("resize", () => {
  // Reinicializar cursor según tamaño de pantalla
  initCursor()
})

// Preload de imágenes
function preloadImages() {
  const images = document.querySelectorAll("img")
  images.forEach((img) => {
    const imageLoader = new Image()
    imageLoader.src = img.src
  })
}

// Inicializar después del loader
setTimeout(() => {
  preloadImages()
}, 3000)
