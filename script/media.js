import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getFirestore, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-storage.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDC5VwP6EEIcgO0m1wodA9FwXt_vn1GfQo",
  authDomain: "nggc-site.firebaseapp.com",
  projectId: "nggc-site",
  storageBucket: "nggc-site.appspot.com",
  messagingSenderId: "128382769453",
  appId: "1:128382769453:web:abb1d58d96c64c5762dba4",
  measurementId: "G-9WTMG243KC"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Upload Image
const imageInput = document.getElementById("imageInput");
const captionInput = document.getElementById("captionInput");
const uploadBtn = document.getElementById("uploadBtn");

uploadBtn.addEventListener("click", async () => {
  const file = imageInput.files[0];
  if (!file) return alert("Please select an image!");

  const storageRef = ref(storage, `gallery/${file.name}_${Date.now()}`);
  await uploadBytes(storageRef, file);

  const url = await getDownloadURL(storageRef);

  await addDoc(collection(db, "gallery"), {
    url,
    caption: captionInput.value || "",
    createdAt: serverTimestamp()
  });

  alert("Image uploaded successfully!");
  imageInput.value = "";
  captionInput.value = "";
});

// Display Gallery
const dynamicGallery = document.getElementById("dynamicGallery");
const galleryRef = collection(db, "gallery");
const q = query(galleryRef, orderBy("createdAt", "desc"));

onSnapshot(q, (snapshot) => {
  dynamicGallery.innerHTML = "";
  snapshot.forEach((doc) => {
    const data = doc.data();
    dynamicGallery.innerHTML += `
      <div class="relative group cursor-pointer">
        <img src="${data.url}" alt="${data.caption || ''}" class="w-full h-48 object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105" onclick="openLightbox('${data.url}', '${data.caption || ''}')">
      </div>
    `;
  });
});

// Lightbox
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
