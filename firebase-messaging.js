// ==========================================
// WETrendingTeam Notifications
// firebase-messaging.js
// PRODUCTION FCM VERSION
// ==========================================

import {
 getMessaging,
 getToken,
 onMessage
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


// ==========================================
// FIREBASE SERVICES
// ==========================================

const messaging = getMessaging(app);

const auth = getAuth(app);


// ==========================================
// FCM VAPID KEY
// ==========================================

const VAPID_KEY =
 "BAw-ZA0fgoyK9bcUVcbZOeI_0oRNJZBtSkxRcPDJGba3nXRdo27FV4L0qHTZd_K7z_RE3qCToyK34gwMivNNBdE";


// ==========================================
// CHECK NOTIFICATION STATUS
// ==========================================

export async function checkPushStatus() {

 if (!("Notification" in window)) {
 return "unsupported";
 }

 return Notification.permission;
}


// ==========================================
// REQUEST NOTIFICATION PERMISSION
// ==========================================

export async function requestNotificationPermission() {

 try {

 // ------------------------------------------
 // CHECK NOTIFICATION SUPPORT
 // ------------------------------------------

 if (!("Notification" in window)) {

 alert(
 "This browser/device does not support notifications."
 );

 return false;
 }


 // ------------------------------------------
 // CHECK SERVICE WORKER SUPPORT
 // ------------------------------------------

 if (!("serviceWorker" in navigator)) {

 alert(
 "This browser does not support service workers."
 );

 return false;
 }


 // ------------------------------------------
 // REQUEST NOTIFICATION PERMISSION
 // ------------------------------------------

 let permission = Notification.permission;

 if (permission !== "granted") {

 permission =
 await Notification.requestPermission();
 }


 if (permission !== "granted") {

 alert(
 "Notification permission was not granted."
 );

 return false;
 }


 console.log(
 "Notification permission granted."
 );


 // ------------------------------------------
 // ANONYMOUS FIREBASE AUTHENTICATION
 // ------------------------------------------

 if (!auth.currentUser) {

 await signInAnonymously(auth);
 }


 const user = auth.currentUser;


 if (!user) {

 throw new Error(
 "Firebase could not create a subscriber identity."
 );
 }


 console.log(
 "Anonymous Firebase user:",
 user.uid
 );


 // ------------------------------------------
 // REGISTER FCM SERVICE WORKER
 // ------------------------------------------

 const registration =
 await navigator.serviceWorker.register(
 "./firebase-messaging-sw.js",
 {
 scope: "./"
 }
 );


 console.log(
 "WETrendingTeam FCM Service Worker registered.",
 registration
 );


 // ------------------------------------------
 // WAIT FOR SERVICE WORKER
 // ------------------------------------------

 await navigator.serviceWorker.ready;


 console.log(
 "WETrendingTeam FCM Service Worker ready."
 );


 // ------------------------------------------
 // GET FCM TOKEN
 // ------------------------------------------

 const token =
 await getToken(
 messaging,
 {
 vapidKey: VAPID_KEY,
 serviceWorkerRegistration:
 registration
 }
 );


 if (!token) {

 throw new Error(
 "Firebase did not return an FCM registration token."
 );
 }


 // ------------------------------------------
 // SHOW TOKEN IN CONSOLE
 // ------------------------------------------

 console.log(
 "FCM Token:",
 token
 );


 // ------------------------------------------
 // SAVE TOKEN TO FIRESTORE
 // ------------------------------------------

 await setDoc(

 doc(
 db,
 "fcmTokens",
 token
 ),

 {
 token: token,

 uid: user.uid,

 updatedAt:
 serverTimestamp(),

 platform:
 navigator.platform ||
 "unknown",

 userAgent:
 navigator.userAgent,

 subscriptions: {
  team: true
 }
 },

 {
 merge: true
 }
 );


 console.log(
 "FCM token successfully saved to Firestore."
 );


 // ------------------------------------------
 // SUCCESS
 // ------------------------------------------

 alert(
 "WETrendingTeam notifications are now enabled on this device."
 );


 return true;


 } catch (error) {

 console.error(
 "Firebase Messaging Error:",
 error
 );


 // ------------------------------------------
 // AUTHENTICATION ERROR
 // ------------------------------------------

 if (
 error?.code ===
 "auth/operation-not-allowed"
 ) {

 alert(
 "Anonymous Authentication is not enabled in Firebase. Enable Anonymous sign-in in Firebase Authentication, then try again."
 );

 }


 // ------------------------------------------
 // NOTIFICATION BLOCKED
 // ------------------------------------------

 else if (
 error?.code ===
 "messaging/permission-blocked"
 ) {

 alert(
 "Notifications are blocked for this site. Please allow notifications in your browser settings."
 );

 }


 // ------------------------------------------
 // TOKEN ERROR
 // ------------------------------------------

 else if (
 error?.code ===
 "messaging/token-subscribe-failed"
 ) {

 alert(
 "Firebase could not register this device for notifications. Check the FCM configuration and try again."
 );

 }


 // ------------------------------------------
 // GENERAL ERROR
 // ------------------------------------------

 else {

 alert(
 "Firebase notification error: " +
 (
 error?.message ||
 "Unknown error."
 )
 );
 }


 return false;
 }
}


// ==========================================
// FOREGROUND NOTIFICATIONS
// ==========================================

onMessage(
 messaging,
 (payload) => {

 console.log(
 "Foreground notification received:",
 payload
 );


 const title =
 payload.notification?.title ||
 payload.data?.title ||
 "WETrendingTeam";


 const body =
 payload.notification?.body ||
 payload.data?.body ||
 "New notification from WETrendingTeam.";


 // ------------------------------------------
 // SHOW FOREGROUND NOTIFICATION
 // ------------------------------------------

 if (
 "Notification" in window &&
 Notification.permission === "granted"
 ) {

 new Notification(
 title,
 {
 body: body,
 icon: "./images/logo.png"
 }
 );
 }
 }
);