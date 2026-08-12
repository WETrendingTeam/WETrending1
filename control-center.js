const firebaseConfig = {
  apiKey: "AIzaSyDY5F84tiRyDLNPBaBGpO5giwxlJ4q27Cg",
  authDomain: "wetrendingteam-1f8ce.firebaseapp.com",
  projectId: "wetrendingteam-1f8ce",
  storageBucket: "wetrendingteam-1f8ce.firebasestorage.app",
  messagingSenderId: "1072737815830",
  appId: "1:1072737815830:web:4fce8aa6e88680404e1437",
  measurementId: "G-21NRQ5TYPB"
};

/* WETrendingTeam CONTROL CENTER LOGIN */
const CONTROL_EMAIL = "lade.galleria@gmail.com";

function status(message, error = false) {
  const el = document.getElementById("loginStatus");
  if (!el) return;
  el.textContent = message;
  el.style.color = error ? "#ff5a5a" : "";
}

function friendlyError(error) {
  const code = error && error.code ? error.code : "";
  if (code === "auth/invalid-credential" || code === "auth/wrong-password")
    return "Incorrect Control Center email or password.";
  if (code === "auth/user-not-found")
    return "Control Center account was not found.";
  if (code === "auth/operation-not-allowed")
    return "Email/Password sign-in is disabled in Firebase.";
  if (code === "auth/unauthorized-domain")
    return "This website is not authorized in Firebase.";
  if (code === "auth/network-request-failed")
    return "Network error. Check your connection.";
  if (code === "auth/too-many-requests")
    return "Too many login attempts. Try again later.";
  if (code === "auth/user-disabled")
    return "The Control Center account is disabled.";
  return (error && error.message) || "Login failed.";
}

window.addEventListener("error", (e) => {
  console.error(e.error || e.message);
  status("Login system error. Please refresh and try again.", true);
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const button = document.getElementById("loginButton");
  const reset = document.getElementById("controlResetLink");

  if (!form || !button) {
    status("Control Center login form could not be loaded.", true);
    return;
  }

  status("Login system ready.");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const remember = document.getElementById("remember").checked;

    if (email !== CONTROL_EMAIL) {
      status("Use the Control Center email address.", true);
      return;
    }

    if (!password) {
      status("Enter your password.", true);
      return;
    }

    button.disabled = true;
    button.textContent = "Signing in…";
    status("Connecting to Firebase…");

    try {
      const auth = firebase.auth();

      await auth.setPersistence(
        remember
          ? firebase.auth.Auth.Persistence.LOCAL
          : firebase.auth.Auth.Persistence.SESSION
      );

      const result = await auth.signInWithEmailAndPassword(CONTROL_EMAIL, password);

      if (!result.user || (result.user.email || "").toLowerCase() !== CONTROL_EMAIL) {
        await auth.signOut();
        throw new Error("This Firebase account is not authorized for Control Center.");
      }

      localStorage.setItem("userEmail", CONTROL_EMAIL);
      localStorage.setItem("userRole", "control");
      localStorage.setItem("userUID", result.user.uid);

      status("Login successful. Opening Control Center…");
      window.location.href = "dashboard.html";
    } catch (error) {
      console.error("Control Center login:", error);
      status(friendlyError(error), true);
    } finally {
      button.disabled = false;
      button.textContent = "Login";
    }
  });

  reset?.addEventListener("click", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim().toLowerCase();

    if (email !== CONTROL_EMAIL) {
      status("Use the Control Center email address.", true);
      return;
    }

    try {
      await firebase.auth().sendPasswordResetEmail(CONTROL_EMAIL);
      status("Password reset email sent.");
    } catch (error) {
      console.error(error);
      status(friendlyError(error), true);
    }
  });
});
