// GALERÍA EDITORIAL ACTUALIZADA
let currentImageIndex = 0
let allPieces = []

// Inicialización
window.addEventListener("DOMContentLoaded", () => {
  const galleryPieces = document.querySelectorAll(".gallery-piece")
  const imageModal = document.getElementById("imageModal")
  const modalImage = document.getElementById("modalImage")
  const modalTitle = document.getElementById("modalTitle")
  const modalDescription = document.getElementById("modalDescription")
  const modalNumber = document.getElementById("modalNumber")
  const modalFilm = document.getElementById("modalFilm")
  const modalClose = document.querySelector(".modal-close")
  const modalPrev = document.querySelector(".modal-prev")
  const modalNext = document.querySelector(".modal-next")
  const modalOverlay = document.querySelector(".modal-overlay")

  // Obtener todas las piezas de galería
  allPieces = Array.from(galleryPieces).map((piece, index) => {
    const img = piece.querySelector("img")
    const title = piece.querySelector(".piece-title")
    const description = piece.querySelector(".piece-description")
    const number = piece.querySelector(".piece-number")
    const film = piece.querySelector(".piece-film")

    return {
      index,
      src: img.src,
      alt: img.alt,
      title: title?.textContent || "",
      description: description?.textContent || "",
      number: number?.textContent || "",
      film: film?.textContent || "",
    }
  })

  // Clic en imagen para abrir modal
  galleryPieces.forEach((piece, index) => {
    piece.addEventListener("click", () => {
      openModal(allPieces[index])
    })
  })

  // Navegación modal
  modalPrev.addEventListener("click", () => showImage(currentImageIndex - 1))
  modalNext.addEventListener("click", () => showImage(currentImageIndex + 1))
  modalClose.addEventListener("click", closeModal)
  modalOverlay.addEventListener("click", closeModal)

  document.addEventListener("keydown", (e) => {
    if (!imageModal.classList.contains("active")) return
    if (e.key === "Escape") closeModal()
    if (e.key === "ArrowLeft") showImage(currentImageIndex - 1)
    if (e.key === "ArrowRight") showImage(currentImageIndex + 1)
  })

  // Swipe para mobile
  let touchStartX = 0
  let touchEndX = 0

  imageModal.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX
  })
  imageModal.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX
    handleSwipe()
  })

  function handleSwipe() {
    const threshold = 50
    if (touchEndX < touchStartX - threshold) showImage(currentImageIndex + 1)
    if (touchEndX > touchStartX + threshold) showImage(currentImageIndex - 1)
  }

  function openModal(data) {
    currentImageIndex = allPieces.findIndex((p) => p.index === data.index)
    updateModal(data)
    imageModal.classList.add("active")
    document.body.style.overflow = "hidden"
  }

  function closeModal() {
    imageModal.classList.remove("active")
    document.body.style.overflow = "auto"
  }

  function showImage(index) {
    currentImageIndex = (index + allPieces.length) % allPieces.length
    updateModal(allPieces[currentImageIndex])
  }

  function updateModal(data) {
    modalImage.style.opacity = "0"
    setTimeout(() => {
      modalImage.src = data.src
      modalImage.alt = data.alt
      modalTitle.textContent = data.title
      modalDescription.textContent = data.description
      modalNumber.textContent = data.number
      modalFilm.textContent = data.film
      modalImage.style.opacity = "1"
    }, 150)
  }
})
