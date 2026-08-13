import { app } from "./firebase-config.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const ADMIN_EMAIL = "wetrendingteam@gmail.com";
const auth = getAuth(app);

const form = document.getElementById("adminLoginForm");
const remember = document.getElementById("adminRemember");
const button = document.getElementById("adminLoginButton");
const status = document.getElementById("adminLoginStatus");
const resetLink = document.getElementById("adminResetLink");

function setStatus(message, error = false) {
  if (status) {
    status.textContent = message;
    status.style.color = error ? "#ff5a5a" : "";
  }
}

resetLink?.addEventListener("click", async (event) => {
  event.preventDefault();

  const emailInput = document.getElementById("adminEmail");
  const email = emailInput?.value.trim().toLowerCase();

  if (!email) {
    setStatus("Enter your email first, then tap Forgot password.", true);
    emailInput?.focus();
    return;
  }

  if (email !== ADMIN_EMAIL) {
    setStatus("Use the authorized Admin email address.", true);
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    setStatus("Password reset email sent. Check your Gmail inbox.");
  } catch (error) {
    console.error("Admin password reset:", error);
    setStatus("Unable to send reset email. Check the email and Firebase Auth settings.", true);
  }
});

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("adminEmail")?.value.trim().toLowerCase();
  const password = document.getElementById("adminPassword")?.value || "";

  if (!email || !password) return;

  button.disabled = true;
  button.textContent = "Signing in…";
  setStatus("Checking your account…");

  try {
    await setPersistence(
      auth,
      remember?.checked ? browserLocalPersistence : browserSessionPersistence
    );

    const credential = await signInWithEmailAndPassword(auth, email, password);

    if ((credential.user.email || "").toLowerCase() !== ADMIN_EMAIL) {
      await signOut(auth);
      throw new Error("This account is not authorized for Admin Login.");
    }

    localStorage.setItem("userEmail", credential.user.email || "");
    localStorage.setItem("userRole", "admin");
    localStorage.setItem("userUID", credential.user.uid);

    setStatus("Login successful. Opening Admin Panel…");
    window.location.replace("admin-dashboard.html");
  } catch (error) {
    console.error("Admin login:", error);

    let message = "Login failed.";
    if (error.code === "auth/invalid-credential") {
      message = "Incorrect email or password.";
    } else if (error.code === "auth/too-many-requests") {
      message = "Too many attempts. Please try again later.";
    } else if (error.code === "auth/user-disabled") {
      message = "This Firebase account is disabled.";
    } else if (error.message) {
      message = error.message;
    }

    setStatus(message, true);
  } finally {
    button.disabled = false;
    button.textContent = "Login";
  }
});
