import { app } from "./firebase-config.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const CONTROL_EMAIL = "lade.galleria@gmail.com";
const auth = getAuth(app);
const db = getFirestore(app);

function liveCount(collectionName, elementId) {
  const element = document.getElementById(elementId);
  if (!element) return;
  onSnapshot(collection(db, collectionName),
    snap => element.textContent = String(snap.size),
    error => {
      console.warn(`Could not load ${collectionName}:`, error.message);
      element.textContent = "—";
    }
  );
}

onAuthStateChanged(auth, (user) => {
  if (!user || (user.email || "").toLowerCase() !== CONTROL_EMAIL) {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userUID");
    window.location.replace("control-center.html");
    return;
  }

  const roleEl = document.getElementById("userRole");
  if (roleEl) roleEl.textContent = "Control Center";

  const welcome = document.querySelector(".welcome h1");
  if (welcome) welcome.textContent = "Welcome Back";

  liveCount("users", "usersCount");
  liveCount("campaigns", "campaignCount");
  liveCount("notifications", "notificationCount");
  liveCount("trendRequests", "trendCount");
});

document.getElementById("logoutBtn")?.addEventListener("click", async () => {
  if (!confirm("Logout from Control Center?")) return;
  await signOut(auth);
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userUID");
  window.location.replace("control-center.html");
});
