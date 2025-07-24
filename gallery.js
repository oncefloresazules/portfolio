// Variables para la galería
let currentImageIndex = 0
let filteredImages = []
let allImages = []

// Inicialización de la galería
document.addEventListener("DOMContentLoaded", () => {
  initPhotoGallery()
})

function initPhotoGallery() {
  const galleryItems = document.querySelectorAll(".gallery-item")
  const filterBtns = document.querySelectorAll(".gallery-filter-btn")
  const lightboxModal = document.getElementById("lightboxModal")
  const lightboxImage = document.getElementById("lightboxImage")
  const lightboxTitle = document.getElementById("lightboxTitle")
  const lightboxDetails = document.getElementById("lightboxDetails")
  const lightboxClose = document.querySelector(".lightbox-close")
  const lightboxPrev = document.querySelector(".lightbox-prev")
  const lightboxNext = document.querySelector(".lightbox-next")
  const lightboxOverlay = document.querySelector(".lightbox-overlay")

  // Recopilar todas las imágenes
  allImages = Array.from(galleryItems).map((item, index) => {
    const img = item.querySelector("img")
    const title = item.querySelector(".image-title")
    const details = item.querySelector(".image-details")
    const category = item.getAttribute("data-category")

    return {
      index,
      src: img.src,
      alt: img.alt,
      title: title ? title.textContent : "",
      details: details ? details.textContent : "",
      category,
      element: item,
    }
  })

  filteredImages = [...allImages]

  // Filtros de galería
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter")

      // Actualizar botones activos
      filterBtns.forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")

      // Filtrar imágenes
      filterGalleryImages(filter)
    })
  })

  // Abrir lightbox al hacer clic en imagen
  galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      const imageData = allImages[index]
      openLightbox(imageData)
    })
  })

  // Cerrar lightbox
  lightboxClose.addEventListener("click", closeLightbox)
  lightboxOverlay.addEventListener("click", closeLightbox)

  // Navegación del lightbox
  lightboxPrev.addEventListener("click", showPreviousImage)
  lightboxNext.addEventListener("click", showNextImage)

  // Navegación con teclado
  document.addEventListener("keydown", (e) => {
    if (lightboxModal.classList.contains("active")) {
      switch (e.key) {
        case "Escape":
          closeLightbox()
          break
        case "ArrowLeft":
          showPreviousImage()
          break
        case "ArrowRight":
          showNextImage()
          break
      }
    }
  })

  // Animación de entrada para las imágenes
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = "1"
          entry.target.style.transform = "translateY(0) scale(1)"
        }, index * 100)
      }
    })
  }, observerOptions)

  galleryItems.forEach((item) => {
    item.style.opacity = "0"
    item.style.transform = "translateY(30px) scale(0.95)"
    item.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out"
    observer.observe(item)
  })
}

function filterGalleryImages(filter) {
  const galleryItems = document.querySelectorAll(".gallery-item")

  galleryItems.forEach((item) => {
    const category = item.getAttribute("data-category")

    if (filter === "all" || category === filter) {
      item.style.display = "block"
      setTimeout(() => {
        item.style.opacity = "1"
        item.style.transform = "translateY(0) scale(1)"
      }, 100)
    } else {
      item.style.opacity = "0"
      item.style.transform = "translateY(20px) scale(0.95)"
      setTimeout(() => {
        item.style.display = "none"
      }, 300)
    }
  })

  // Actualizar array de imágenes filtradas
  if (filter === "all") {
    filteredImages = [...allImages]
  } else {
    filteredImages = allImages.filter((img) => img.category === filter)
  }
}

function openLightbox(imageData) {
  const lightboxModal = document.getElementById("lightboxModal")
  const lightboxImage = document.getElementById("lightboxImage")
  const lightboxTitle = document.getElementById("lightboxTitle")
  const lightboxDetails = document.getElementById("lightboxDetails")

  // Encontrar el índice en las imágenes filtradas
  currentImageIndex = filteredImages.findIndex((img) => img.index === imageData.index)

  lightboxImage.src = imageData.src
  lightboxImage.alt = imageData.alt
  lightboxTitle.textContent = imageData.title
  lightboxDetails.textContent = imageData.details

  lightboxModal.classList.add("active")
  document.body.style.overflow = "hidden"

  // Animación de entrada
  setTimeout(() => {
    lightboxModal.querySelector(".lightbox-content").style.transform = "scale(1)"
    lightboxModal.querySelector(".lightbox-content").style.opacity = "1"
  }, 10)
}

function closeLightbox() {
  const lightboxModal = document.getElementById("lightboxModal")
  const lightboxContent = lightboxModal.querySelector(".lightbox-content")

  lightboxContent.style.transform = "scale(0.9)"
  lightboxContent.style.opacity = "0"

  setTimeout(() => {
    lightboxModal.classList.remove("active")
    document.body.style.overflow = "auto"
  }, 300)
}

function showPreviousImage() {
  if (filteredImages.length === 0) return

  currentImageIndex = (currentImageIndex - 1 + filteredImages.length) % filteredImages.length
  updateLightboxImage()
}

function showNextImage() {
  if (filteredImages.length === 0) return

  currentImageIndex = (currentImageIndex + 1) % filteredImages.length
  updateLightboxImage()
}

function updateLightboxImage() {
  const lightboxImage = document.getElementById("lightboxImage")
  const lightboxTitle = document.getElementById("lightboxTitle")
  const lightboxDetails = document.getElementById("lightboxDetails")
  const currentImage = filteredImages[currentImageIndex]

  // Animación de transición
  lightboxImage.style.opacity = "0"

  setTimeout(() => {
    lightboxImage.src = currentImage.src
    lightboxImage.alt = currentImage.alt
    lightboxTitle.textContent = currentImage.title
    lightboxDetails.textContent = currentImage.details

    lightboxImage.style.opacity = "1"
  }, 150)
}

// Precargar imágenes para mejor rendimiento
function preloadImages() {
  allImages.forEach((imageData) => {
    const img = new Image()
    img.src = imageData.src
  })
}

// Inicializar precarga después de un delay
setTimeout(preloadImages, 2000)
