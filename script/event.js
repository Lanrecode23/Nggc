// Import Firebase SDKs (from CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getFirestore, collection, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

// Firebase config (same as your admin panel)
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
const db = getFirestore(app);

// Target the eventsList container
const listEl = document.getElementById("eventsList");

// Format date range (e.g., AUG 12 – SEP 4, 2025)
function formatDateRange(startDate, endDate) {
  if (!startDate) return "";

  const start = new Date(startDate.seconds * 1000);
  const startMonth = start.toLocaleString("default", { month: "short" }).toUpperCase();
  const startDay = start.getDate();
  const startYear = start.getFullYear();

  if (!endDate) {
    return `${startMonth} ${startDay}, ${startYear}`;
  }

  const end = new Date(endDate.seconds * 1000);
  const endMonth = end.toLocaleString("default", { month: "short" }).toUpperCase();
  const endDay = end.getDate();
  const endYear = end.getFullYear();

  // Same month & year
  if (startMonth === endMonth && startYear === endYear) {
    return `${startMonth} ${startDay} – ${endDay}, ${startYear}`;
  }

  // Same year but different months
  if (startYear === endYear) {
    return `${startMonth} ${startDay} – ${endMonth} ${endDay}, ${startYear}`;
  }

  // Different years
  return `${startMonth} ${startDay}, ${startYear} – ${endMonth} ${endDay}, ${endYear}`;
}

// Listen for real-time updates
const q = query(collection(db, "events"), orderBy("startDate", "asc"));
onSnapshot(q, (snapshot) => {
  if (snapshot.empty) {
    listEl.innerHTML = `<p class="text-center text-gray-500 dark:text-gray-400">No upcoming events.</p>`;
    return;
  }

  listEl.innerHTML = ""; // Clear existing content

  let index = 0;
  snapshot.forEach((doc) => {
    const data = doc.data();

    // Handle Firestore Timestamp fields
    const startDate = data.startDate || null;
    const endDate = data.endDate || null;
    const formattedRange = formatDateRange(startDate, endDate);

    // For date badge, use start date only
    const badgeDate = startDate ? new Date(startDate.seconds * 1000) : new Date();
    const month = badgeDate.toLocaleString("default", { month: "short" }).toUpperCase();
    const day = badgeDate.getDate();

    // Alternate animation direction
    const animation = index % 2 === 0 ? "fade-left" : "fade-right";

    const card = `
      <div 
        class="bg-white dark:bg-background-dark/50 font_all rounded-2xl shadow-md p-6 flex flex-col sm:flex-row sm:items-start gap-6 w-full max-w-3xl mx-auto my-4 transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg"
        data-aos="${animation}"
      >
        <!-- Date Badge -->
        <div class="flex-shrink-0 text-center sm:text-left">
          <div class="bg-primary text-[#181611] text_round rounded-lg px-4 py-2 inline-block">
            <p class="text-lg font-bold">${month}</p>
            <p class="text-3xl font-black">${day}</p>
          </div>
        </div>

        <!-- Event Info -->
        <div class="flex-1 min-w-0">
          <h3 class="text-xl font-bold text-[#181611] dark:text-white break-words leading-tight mb-1">
            ${data.title}
          </h3>
          <p class="text-gray-500 dark:text-gray-400 text-sm mb-2">
            ${formattedRange}
            ${data.time ? ` — ${data.time}` : ""}
          </p>
          <p class="text-gray-600 dark:text-gray-300 text-base leading-relaxed break-words">
            ${data.description}
          </p>
        </div>
      </div>
    `;

    listEl.innerHTML += card;
    index++;
  });

  // Reinitialize AOS after dynamic content is added
  if (window.AOS) {
    AOS.refresh();
  }
});
