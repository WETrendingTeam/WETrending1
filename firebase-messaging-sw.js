// ==========================================
// WETrendingTeam
// Firebase Cloud Messaging Service Worker
// ==========================================

importScripts(
 "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"
);

importScripts(
 "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js"
);


// ==========================================
// FIREBASE CONFIG
// ==========================================

firebase.initializeApp({
 apiKey: "AIzaSyDY5F84tiRyDLNPBaBGpO5giwxlJ4q27Cg",
 authDomain: "wetrendingteam-1f8ce.firebaseapp.com",
 projectId: "wetrendingteam-1f8ce",
 storageBucket: "wetrendingteam-1f8ce.firebasestorage.app",
 messagingSenderId: "1072737815830",
 appId: "1:1072737815830:web:4fce8aa6e88680404e1437",
 measurementId: "G-21NRQ5TYPB"
});


// ==========================================
// FIREBASE MESSAGING
// ==========================================

const messaging = firebase.messaging();


// ==========================================
// BACKGROUND NOTIFICATIONS
// ==========================================

messaging.onBackgroundMessage((payload) => {

 console.log(
 "[firebase-messaging-sw.js] Background message:",
 payload
 );

 const notification =
 payload.notification || {};

 const data =
 payload.data || {};

 const title =
 notification.title ||
 data.title ||
 "WETrendingTeam";

 const body =
 notification.body ||
 data.body ||
 "You have a new notification from WETrendingTeam.";

 const icon =
 notification.icon ||
 data.icon ||
 "/images/logo.png";


 self.registration.showNotification(
 title,
 {
 body: body,
 icon: icon,
 badge: icon,
 data: {
 url:
 data.url ||
 "/"
 }
 }
 );

});


// ==========================================
// NOTIFICATION CLICK
// ==========================================

self.addEventListener(
 "notificationclick",
 (event) => {

 event.notification.close();

 const url =
 event.notification?.data?.url ||
 "/";

 event.waitUntil(

 clients.matchAll({
 type: "window",
 includeUncontrolled: true
 }).then((clientList) => {

 for (const client of clientList) {

 if (
 "focus" in client
 ) {

 client.navigate(url);

 return client.focus();

 }

 }

 if (
 clients.openWindow
 ) {

 return clients.openWindow(url);

 }

 })

 );

 }
);


// ==========================================
// SERVICE WORKER READY
// ==========================================

self.addEventListener(
 "install",
 () => {

 console.log(
 "WETrendingTeam FCM Service Worker installed."
 );

 self.skipWaiting();

 }
);


self.addEventListener(
 "activate",
 (event) => {

 console.log(
 "WETrendingTeam FCM Service Worker activated."
 );

 event.waitUntil(
 self.clients.claim()
 );

 }
);