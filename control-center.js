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

const CONTROL_EMAIL = "lade.galleria@gmail.com";
const auth = getAuth(app);

const form = document.getElementById("loginForm");
const remember = document.getElementById("remember");
const button = document.getElementById("loginButton");
const status = document.getElementById("loginStatus");
const resetLink = document.getElementById("controlResetLink");

function setStatus(message, error = false) {
  if (status) {
    status.textContent = message;
    status.style.color = error ? "#ff5a5a" : "";
  }
}

resetLink?.addEventListener("click", async (event) => {
  event.preventDefault();

  const emailInput = document.getElementById("email");
  const email = emailInput?.value.trim().toLowerCase();

  if (!email) {
    setStatus("Enter your email first, then tap Forgot password.", true);
    emailInput?.focus();
    return;
  }

  if (email !== CONTROL_EMAIL) {
    setStatus("Use the authorized Control Center email address.", true);
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    setStatus("Password reset email sent. Check your Gmail inbox.");
  } catch (error) {
    console.error("Control Center password reset:", error);
    setStatus("Unable to send reset email. Check the email and Firebase Auth settings.", true);
  }
});

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email")?.value.trim().toLowerCase();
  const password = document.getElementById("password")?.value || "";

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

    if ((credential.user.email || "").toLowerCase() !== CONTROL_EMAIL) {
      await signOut(auth);
      throw new Error("This account is not authorized for Control Center.");
    }

    localStorage.setItem("userEmail", credential.user.email || "");
    localStorage.setItem("userRole", "control");
    localStorage.setItem("userUID", credential.user.uid);

    setStatus("Login successful. Opening Control Center…");
    window.location.replace("dashboard.html");
  } catch (error) {
    console.error("Control Center login:", error);

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
