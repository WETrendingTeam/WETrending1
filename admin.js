// WETrendingTeam Control Center authentication
import { app } from "./firebase-config.js";
import {
  getAuth, signInWithEmailAndPassword, setPersistence,
  browserLocalPersistence, browserSessionPersistence, signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore, doc, getDoc, collection, query, where, getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const auth = getAuth(app);
const db = getFirestore(app);
const form = document.getElementById("loginForm");
const remember = document.getElementById("remember");
const button = document.getElementById("loginButton");
const status = document.getElementById("loginStatus");

function setStatus(message, error = false) {
  if (status) { status.textContent = message; status.style.color = error ? "#ff5a5a" : ""; }
}

async function findProfile(user) {
  // Preferred profile location: users/{uid}.
  const byUid = await getDoc(doc(db, "users", user.uid));
  if (byUid.exists()) return byUid.data();

  // Compatibility with the older project: users documents keyed by email.
  const snap = await getDocs(query(collection(db, "users"), where("email", "==", user.email)));
  if (!snap.empty) return snap.docs[0].data();
  return null;
}

function normalizeRole(value) {
  return String(value || "").trim().toLowerCase();
}

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    if (!email || !password) return;

    button.disabled = true;
    button.textContent = "Signing in…";
    setStatus("Checking your Control Center account…");

    try {
      await setPersistence(auth, remember?.checked ? browserLocalPersistence : browserSessionPersistence);
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const profile = await findProfile(credential.user);
      const role = normalizeRole(profile?.role ?? profile?.Role);
      const allowed = ["developer", "admin", "moderator"];

      if (!profile || !allowed.includes(role)) {
        await signOut(auth);
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userUID");
        throw new Error("This account is authenticated, but it has no authorized Control Center role.");
      }

      localStorage.setItem("userEmail", credential.user.email || email);
      localStorage.setItem("userRole", role);
      localStorage.setItem("userUID", credential.user.uid);
      setStatus("Login successful. Opening Control Center…");
      window.location.replace("dashboard.html");
    } catch (error) {
      console.error("Control Center login error:", error);
      let message = error.message || "Login failed.";
      if (error.code === "auth/invalid-credential") message = "Incorrect email or password.";
      if (error.code === "auth/too-many-requests") message = "Too many login attempts. Please try again later.";
      setStatus(message, true);
    } finally {
      button.disabled = false;
      button.textContent = "Login";
    }
  });
}
