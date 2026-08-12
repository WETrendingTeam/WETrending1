// ==========================================
// WETrending SPACE
// Shared WETrendingTeam FCM subscription
// ==========================================

import {
    getMessaging,
    getToken
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js";

import {
    app,
    db
} from "./firebase-config.js";

import {
    getAuth,
    signInAnonymously
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const VAPID_KEY =
    "BAw-ZA0fgoyK9bcUVcbZOeI_0oRNJZBtSkxRcPDJGba3nXRdo27FV4L0qHTZd_K7z_RE3qCToyK34gwMivNNBdE";

const auth = getAuth(app);
const messaging = getMessaging(app);

function setButton(button, enabled) {
    if (!button) return;
    const icon = button.querySelector("i");

    if (enabled) {
        if (icon) icon.className = "fa-solid fa-bell";
        button.style.color = "var(--primary)";
        button.title = "Turn Off SPACE Notifications";
    } else {
        if (icon) icon.className = "fa-solid fa-bell-slash";
        button.style.color = "var(--text-muted)";
        button.title = "Turn On SPACE Notifications";
    }
}

async function enableSpaceNotifications(button) {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
        customAlert?.("This browser/device does not support push notifications.");
        return false;
    }

    if (Notification.permission === "denied") {
        customAlert?.("Notifications are blocked for this site. Enable them in your browser settings.");
        return false;
    }

    const permission =
        Notification.permission === "granted"
            ? "granted"
            : await Notification.requestPermission();

    if (permission !== "granted") {
        setButton(button, false);
        customAlert?.("Notification permission was not granted.");
        return false;
    }

    try {
        if (!auth.currentUser) {
            await signInAnonymously(auth);
        }

        // IMPORTANT:
        // This is the existing WETrendingTeam root service worker.
        const registration = await navigator.serviceWorker.register(
            "./firebase-messaging-sw.js",
            { scope: "./" }
        );

        await navigator.serviceWorker.ready;

        const token = await getToken(messaging, {
            vapidKey: VAPID_KEY,
            serviceWorkerRegistration: registration
        });

        if (!token) {
            throw new Error("Firebase did not return an FCM registration token.");
        }

        await setDoc(
            doc(db, "fcmTokens", token),
            {
                token,
                uid: auth.currentUser.uid,
                updatedAt: serverTimestamp(),
                platform: navigator.platform || "unknown",
                userAgent: navigator.userAgent,
                subscriptions: {
                    space: true
                }
            },
            { merge: true }
        );

        localStorage.setItem("wetrending_space_notifications_enabled", "true");
        setButton(button, true);

        customAlert?.("WETrending SPACE notifications are now enabled on this device.");
        return true;

    } catch (error) {
        console.error("[WETrending SPACE FCM]", error);
        customAlert?.(
            "Could not enable push notifications. " +
            (error?.message || "Please try again.")
        );
        return false;
    }
}

function setupSpaceNotifications() {
    const button = document.getElementById("notify-btn");
    if (!button) return;

    const enabled =
        Notification.permission === "granted" &&
        localStorage.getItem("wetrending_space_notifications_enabled") === "true";

    setButton(button, enabled);

    button.addEventListener("click", async () => {
        if (
            localStorage.getItem("wetrending_space_notifications_enabled") === "true"
        ) {
            localStorage.setItem("wetrending_space_notifications_enabled", "false");
            setButton(button, false);
            customAlert?.("WETrending SPACE notifications disabled on this device.");
            return;
        }

        await enableSpaceNotifications(button);
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupSpaceNotifications);
} else {
    setupSpaceNotifications();
}
