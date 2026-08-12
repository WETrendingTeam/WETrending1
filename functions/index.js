const { onRequest } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const { getMessaging } = require("firebase-admin/messaging");

initializeApp();

const db = getFirestore();

function getRole(data) {
  return String(data.role ?? data.Role ?? "").trim().toLowerCase();
}

function chunks(list, size) {
  const out = [];
  for (let i = 0; i < list.length; i += size) {
    out.push(list.slice(i, i + size));
  }
  return out;
}

exports.sendNotification = onRequest(
  { region: "us-central1", cors: true },
  async (req, res) => {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "POST required." });
    }

    try {
      const header = req.get("Authorization") || "";
      if (!header.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authentication required." });
      }

      const idToken = header.substring(7);
      const decoded = await getAuth().verifyIdToken(idToken);

      const senderEmail = String(decoded.email || "").trim().toLowerCase();
      if (senderEmail !== "wetrendingteam@gmail.com") {
        return res.status(403).json({ message: "Only the authorized Admin account can send notifications." });
      }

      const title = String(req.body?.title || "").trim();
      const message = String(req.body?.message || "").trim();
      const audience = String(req.body?.audience || "team").trim().toLowerCase();
      const url = String(req.body?.url || "").trim();

      if (!title || !message) {
        return res.status(400).json({ message: "Title and message are required." });
      }

      if (!["team", "space"].includes(audience)) {
        return res.status(400).json({ message: "Invalid notification audience." });
      }

      if (audience === "space" && !url) {
        return res.status(400).json({ message: "A destination URL is required for WETrending SPACE notifications." });
      }

      await db.collection("notifications").add({
        title,
        message,
        audience,
        url: url || null,
        sender: decoded.email || decoded.uid,
        deliveryMode: "http-v2",
        createdAt: FieldValue.serverTimestamp()
      });

      const tokenSnap = await db.collection("fcmTokens").get();

      const tokens = [
        ...new Set(
          tokenSnap.docs
            .map(d => d.data())
            .filter(data => audience === "space"
              ? data?.subscriptions?.space === true
              : data?.subscriptions?.team === true || !data?.subscriptions)
            .map(data => data.token)
            .filter(Boolean)
        )
      ];
      let sent = 0;
      let failed = 0;

      for (const batch of chunks(tokens, 500)) {
        const response = await getMessaging().sendEachForMulticast({
          tokens: batch,
          notification: { title, body: message },
          webpush: {
            notification: {
              title,
              body: message,
              icon: "/images/logo.png",
              badge: "/images/logo.png"
            },
            data: {
              title,
              body: message,
              url: url || "/"
            },
            fcmOptions: {
              link: url || "https://wetrendingteam.github.io/"
            }
          }
        });

        sent += response.successCount;
        failed += response.failureCount;
      }

      return res.status(200).json({ sent, failed });
    } catch (error) {
      console.error("sendNotification error:", error);
      return res.status(500).json({
        message: error.message || "Notification server error."
      });
    }
  }
);
