// FCM status for the Control Center notifications page.
const statusEl = document.getElementById("fcmStatus");

function render(message) { if (statusEl) statusEl.innerHTML = `<p>${message}</p>`; }

export async function showFCMReadyStatus() {
  try {
    if (!("Notification" in window)) return render("⚠️ This browser does not expose notification support.");
    const permission = Notification.permission;
    if (permission === "granted") return render("✅ Push notification permission is enabled on this device.");
    if (permission === "denied") return render("⚠️ Push notifications are blocked for this site. Enable them in browser/site settings.");
    return render("🔔 Push permission has not been granted on this device yet.");
  } catch (error) {
    console.error("FCM status error:", error);
    render("⚠️ Unable to check push notification status.");
  }
}

showFCMReadyStatus();
