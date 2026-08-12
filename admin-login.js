const firebaseConfig = {
  apiKey: "AIzaSyDY5F84tiRyDLNPBaBGpO5giwxlJ4q27Cg",
  authDomain: "wetrendingteam-1f8ce.firebaseapp.com",
  projectId: "wetrendingteam-1f8ce",
  storageBucket: "wetrendingteam-1f8ce.firebasestorage.app",
  messagingSenderId: "1072737815830",
  appId: "1:1072737815830:web:4fce8aa6e88680404e1437",
  measurementId: "G-21NRQ5TYPB"
};

/* WETrendingTeam ADMIN LOGIN */
const ADMIN_EMAIL = "wetrendingteam@gmail.com";

function status(message, error = false) {
  const el = document.getElementById("adminLoginStatus");
  if (!el) return;
  el.textContent = message;
  el.style.color = error ? "#ff5a5a" : "";
}

function friendlyError(error) {
  const code = error && error.code ? error.code : "";
  if (code === "auth/invalid-credential" || code === "auth/wrong-password")
    return "Incorrect Admin email or password.";
  if (code === "auth/user-not-found")
    return "Admin account was not found.";
  if (code === "auth/operation-not-allowed")
    return "Email/Password sign-in is disabled in Firebase.";
  if (code === "auth/unauthorized-domain")
    return "This website is not authorized in Firebase.";
  if (code === "auth/network-request-failed")
    return "Network error. Check your connection.";
  if (code === "auth/too-many-requests")
    return "Too many login attempts. Try again later.";
  if (code === "auth/user-disabled")
    return "The Admin account is disabled.";
  return (error && error.message) || "Login failed.";
}

window.addEventListener("error", (e) => {
  console.error(e.error || e.message);
  status("Login system error. Please refresh and try again.", true);
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("adminLoginForm");
  const button = document.getElementById("adminLoginButton");
  const reset = document.getElementById("adminResetLink");

  if (!form || !button) {
    status("Admin login form could not be loaded.", true);
    return;
  }

  status("Login system ready.");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("adminEmail").value.trim().toLowerCase();
    const password = document.getElementById("adminPassword").value;
    const remember = document.getElementById("adminRemember").checked;

    if (email !== ADMIN_EMAIL) {
      status("Use the Admin email address.", true);
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

      const result = await auth.signInWithEmailAndPassword(ADMIN_EMAIL, password);

      if (!result.user || (result.user.email || "").toLowerCase() !== ADMIN_EMAIL) {
        await auth.signOut();
        throw new Error("This Firebase account is not authorized for Admin Login.");
      }

      localStorage.setItem("userEmail", ADMIN_EMAIL);
      localStorage.setItem("userRole", "admin");
      localStorage.setItem("userUID", result.user.uid);

      status("Login successful. Opening Admin Panel…");
      window.location.href = "admin-dashboard.html";
    } catch (error) {
      console.error("Admin login:", error);
      status(friendlyError(error), true);
    } finally {
      button.disabled = false;
      button.textContent = "Login";
    }
  });

  reset?.addEventListener("click", async (e) => {
    e.preventDefault();
    const email = document.getElementById("adminEmail").value.trim().toLowerCase();

    if (email !== ADMIN_EMAIL) {
      status("Use the Admin email address.", true);
      return;
    }

    try {
      await firebase.auth().sendPasswordResetEmail(ADMIN_EMAIL);
      status("Password reset email sent.");
    } catch (error) {
      console.error(error);
      status(friendlyError(error), true);
    }
  });
});
