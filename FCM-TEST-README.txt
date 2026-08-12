WETrendingTeam FCM TEST-READY
===============================

Firebase setup already required:
- Authentication > Sign-in method > Anonymous: ENABLED
- Firestore rules: published corrected rules

Testing flow:
1. Open index.html through a web server/hosting (do not open with file://).
2. Tap "Enable WETrendingTeam Notifications".
3. Allow browser notifications.
4. The site signs the visitor in anonymously.
5. FCM creates a device token.
6. The token is saved to Firestore collection: fcmTokens.
7. In Firebase Console, open Firestore > Data > fcmTokens and confirm a new document.

Important:
- Do NOT delete firebase-messaging-sw.js.
- Do NOT use file:// for testing; service workers require a secure origin (HTTPS, or localhost).
- This test package does not require the live website to be replaced yet.
- firebase-messaging.js registers the FCM service worker and saves the token.
