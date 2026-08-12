import { app } from "./firebase-config.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const ADMIN_EMAIL = "wetrendingteam@gmail.com";
const auth = getAuth(app);
const db = getFirestore(app);
const list = document.getElementById("notificationList");

function showList(message) {
  if (list) list.innerHTML = `<p>${message}</p>`;
}

onAuthStateChanged(auth, (user) => {
  if (!user || (user.email || "").toLowerCase() !== ADMIN_EMAIL) {
    showList("Admin session required. Redirecting to Admin Login…");
    window.location.replace("admin.html");
    return;
  }

  const q = query(collection(db, "notifications"), orderBy("createdAt", "desc"));
  onSnapshot(q, (snapshot) => {
    if (!list) return;
    list.innerHTML = "";

    if (snapshot.empty) {
      showList("No notifications available.");
      return;
    }

    snapshot.forEach((item) => {
      const data = item.data();
      const card = document.createElement("div");
      card.className = "notification-card";

      const title = document.createElement("h3");
      title.textContent = data.title || "No Title";

      const message = document.createElement("p");
      message.textContent = data.message || "";

      card.append(title, message);
      list.appendChild(card);
    });
  }, (error) => {
    console.error(error);
    showList(`Firestore Error: ${error.message}`);
  });
});
