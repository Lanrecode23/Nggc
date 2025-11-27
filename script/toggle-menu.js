const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImg");
const galleryImages = document.querySelectorAll("#media img");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let currentIndex = 0;

const sidebar = document.getElementById("mobileSidebar");
    const overlay = document.getElementById("sidebarOverlay");
    const openBtn = document.getElementById("openSidebar");
    const closeBtn = document.getElementById("closeSidebar");

    function openSidebar() {
        sidebar.classList.remove("-translate-x-full");
        overlay.classList.remove("hidden");
        setTimeout(() => overlay.classList.remove("opacity-0"), 10);
    }

    function closeSidebar() {
        sidebar.classList.add("-translate-x-full");
        overlay.classList.add("opacity-0");
        setTimeout(() => overlay.classList.add("hidden"), 300);
    }

    openBtn.addEventListener("click", openSidebar);
    closeBtn.addEventListener("click", closeSidebar);
    overlay.addEventListener("click", closeSidebar);



new Typed("#typedSubText", {
    strings: [
        "A place to find hope, community, and purpose.",
        "A place where faith grows.",
        "A place for worship and fellowship.",
        "Join us on our journey of faith."
    ],
    typeSpeed: 40,
    backSpeed: 0,
    loop: true,
    fadeOut: true,
    fadeOutDelay: 600
});



// Function to show modal with a specific index
function showModal(index) {
  currentIndex = index;
  modalImg.src = galleryImages[currentIndex].src;
  modal.classList.remove("opacity-0", "pointer-events-none");
  modal.classList.add("opacity-100");
  modalImg.classList.add("scale-100");
}

// Click on any gallery image
galleryImages.forEach((img, index) => {
  img.addEventListener("click", () => showModal(index));
});

// Close modal by clicking outside image
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("opacity-100");
    modalImg.classList.remove("scale-100");
    modal.classList.add("opacity-0", "pointer-events-none");
  }
});

// Next button
nextBtn.addEventListener("click", (e) => {
  e.stopPropagation(); 
  currentIndex = (currentIndex + 1) % galleryImages.length;
  modalImg.src = galleryImages[currentIndex].src;
});

// Previous button
prevBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
  modalImg.src = galleryImages[currentIndex].src;
});




