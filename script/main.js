// Import Firebase SDKs (from CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import { getFirestore, collection, addDoc, Timestamp, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

// 🔧 Your Firebase configuration (replace with your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyDC5VwP6EEIcgO0m1wodA9FwXt_vn1GfQo",
  authDomain: "nggc-site.firebaseapp.com",
  projectId: "nggc-site",
  storageBucket: "nggc-site.firebasestorage.app",
  messagingSenderId: "128382769453",
  appId: "1:128382769453:web:abb1d58d96c64c5762dba4",
  measurementId: "G-9WTMG243KC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Select elements
const loginForm = document.getElementById('loginForm');
const eventForm = document.getElementById('eventForm');

// Helper: convert "yyyy-mm-dd" string → Firestore Timestamp
function dateStringToTimestamp(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr + "T00:00:00");
  if (isNaN(date.getTime())) return null;
  return Timestamp.fromDate(date);
}

// 🔐 Listen for authentication state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    loginForm.style.display = 'none';
    eventForm.style.display = 'block';
  } else {
    loginForm.style.display = 'block';
    eventForm.style.display = 'none';
  }
});

// 🔑 Handle login
loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = e.target.email.value.trim();
  const password = e.target.password.value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert('✅ Login successful!');
  } catch (error) {
    console.error('Login error:', error);
    alert('❌ Login failed: Not An Admin');
  }
});

// 🗓️ Handle adding new event (with start & end dates)
eventForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = e.target.title.value.trim();
  const startDateStr = e.target.startDate?.value;
  const endDateStr = e.target.endDate?.value;
  const time = e.target.time.value.trim();
  const description = e.target.description.value.trim();

  if (!title || !startDateStr || !description) {
    alert("⚠️ Please fill in all required fields.");
    return;
  }

  const startTs = dateStringToTimestamp(startDateStr);
  const endTs = dateStringToTimestamp(endDateStr);

  if (!startTs) {
    alert("⚠️ Invalid start date.");
    return;
  }

  if (endTs && endTs.toMillis() < startTs.toMillis()) {
    alert("⚠️ End date cannot be before start date.");
    return;
  }

  try {
    await addDoc(collection(db, "events"), {
      title,
      description,
      time: time || null,
      startDate: startTs,
      endDate: endTs || null,
      createdAt: serverTimestamp()
    });

    alert("✅ Event added successfully!");
    e.target.reset();
  } catch (error) {
    console.error("Error adding event:", error);
    alert("❌ Failed to add event: " + error.message);
  }
});

AOS.init();