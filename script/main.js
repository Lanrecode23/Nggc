import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import { getFirestore, collection, addDoc, deleteDoc, doc, Timestamp, serverTimestamp, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDC5VwP6EEIcgO0m1wodA9FwXt_vn1GfQo",
  authDomain: "nggc-site.firebaseapp.com",
  projectId: "nggc-site",
  storageBucket: "nggc-site.firebasestorage.app",
  messagingSenderId: "128382769453",
  appId: "1:128382769453:web:abb1d58d96c64c5762dba4",
  measurementId: "G-9WTMG243KC"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Elements
const loginForm = document.getElementById('loginForm');
const eventForm = document.getElementById('eventForm');
const dashboard = document.getElementById('dashboard');
const loginContainer = document.getElementById('loginContainer');
const eventsList = document.getElementById('eventsList');
const sidebar = document.getElementById('sidebar');
const logoutBtn = document.getElementById('logoutBtn');
const toggleBtn = document.getElementById('toggleSidebar');
const closeBtn = document.getElementById('closeSidebar');


// Toggle sidebar on mobile

toggleBtn.addEventListener('click', () => {
  sidebar.classList.remove('-translate-x-full');
});

closeBtn.addEventListener('click', () => {
  sidebar.classList.add('-translate-x-full');
});


// Login
loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = e.target.email.value.trim();
  const password = e.target.password.value;

  try {
    await signInWithEmailAndPassword(auth, email, password);

    loginForm.reset();

    await Swal.fire({
      title: "Successfully Logged In",
      icon: "success",
      customClass: {
        title: 'small-title',
        popup: 'small-popup'
      },
      showConfirmButton: true,
      timer: 1500
    });

  } catch (err) {
    Swal.fire({
      title: "Login Failed: Not an Admin",
      icon: "error",
      customClass: {
        title: 'small-title',
        popup: 'small-popup'
      }
    });
  }
});


// Logout
logoutBtn?.addEventListener('click', async () => {
  await signOut(auth);
});

// Auth state
onAuthStateChanged(auth, (user) => {
  if (user) {
    setTimeout (()=>{
      loginContainer.style.display = 'none';
    dashboard.classList.remove('hidden');
    }, 1500)
  } else {
    loginContainer.style.display = 'flex';
    dashboard.classList.add('hidden');
  }
});

// Convert date string to Firestore Timestamp
function dateStringToTimestamp(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr + "T00:00:00");
  return isNaN(date.getTime()) ? null : Timestamp.fromDate(date);
}

// Add Event
eventForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const { title, startDate, endDate, time, description } = e.target;

  if (!title.value || !startDate.value || !description.value) return alert("⚠️ Fill all required fields");

  const startTs = dateStringToTimestamp(startDate.value);
  const endTs = dateStringToTimestamp(endDate.value);

  if (endTs && endTs.toMillis() < startTs.toMillis()) return alert("End date cannot be before start date");

  try {
    await addDoc(collection(db, "events"), {
      title: title.value.trim(),
      startDate: startTs,
      endDate: endTs || null,
      time: time.value.trim() || null,
      description: description.value.trim(),
      createdAt: serverTimestamp()
    });
    alert("✅ EVENT SUCCESSFULLY ADDED")
    e.target.reset();
  } catch (err) {
    console.error(err);
    alert("Failed to add event");
  }
});

// Load events for admin panel
const eventsQuery = query(collection(db, "events"), orderBy("startDate", "asc"));
onSnapshot(eventsQuery, (snapshot) => {
  eventsList.innerHTML = "";
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const id = docSnap.id;
    const start = data.startDate ? new Date(data.startDate.seconds * 1000) : null;
    const end = data.endDate ? new Date(data.endDate.seconds * 1000) : null;

    const card = document.createElement("div");
    card.className = "bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md flex justify-between items-start";
    card.innerHTML = `
      <div>
        <h3 class="font-bold text-yellow-600 text-lg">${data.title}</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          ${start ? start.toLocaleDateString() : ""}${end ? " - " + end.toLocaleDateString() : ""} ${data.time || ""}
        </p>
        <p class="text-gray-700 dark:text-gray-300 mt-1">${data.description}</p>
      </div>
      <button class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md delete-btn">Delete</button>
    `;

    card.querySelector(".delete-btn").addEventListener("click", async () => {
      if (confirm("Are you sure you want to delete this event?")) {
        await deleteDoc(doc(db, "events", id));
      }
    });

    eventsList.appendChild(card);
  });
});
