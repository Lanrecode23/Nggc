const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCaption = document.getElementById("lightboxCaption");
const closeLightbox = document.getElementById("closeLightbox");

window.openLightbox = (url, caption) => {
  lightboxImg.src = url;
  lightboxCaption.textContent = caption;
  lightbox.classList.remove("hidden");
};

closeLightbox.addEventListener("click", () => {
  lightbox.classList.add("hidden");
});
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) lightbox.classList.add("hidden");
});
