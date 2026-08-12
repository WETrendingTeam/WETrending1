// ==========================================
// WETrendingTeam Firebase Config
// Production Firebase Configuration
// ==========================================

import {
 initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
 getFirestore
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ==========================================
// FIREBASE CONFIGURATION
// ==========================================

const firebaseConfig = {
 apiKey: "AIzaSyDY5F84tiRyDLNPBaBGpO5giwxlJ4q27Cg",
 authDomain: "wetrendingteam-1f8ce.firebaseapp.com",
 projectId: "wetrendingteam-1f8ce",
 storageBucket: "wetrendingteam-1f8ce.firebasestorage.app",
 messagingSenderId: "1072737815830",
 appId: "1:1072737815830:web:4fce8aa6e88680404e1437",
 measurementId: "G-21NRQ5TYPB"
};


// ==========================================
// INITIALIZE FIREBASE
// ==========================================

const app = initializeApp(firebaseConfig);


// ==========================================
// FIRESTORE
// ==========================================

const db = getFirestore(app);


// ==========================================
// EXPORT
// ==========================================

export {
 app,
 db,
 firebaseConfig
};