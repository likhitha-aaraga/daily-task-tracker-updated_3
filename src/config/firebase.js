import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//     apiKey: "AIzaSyAY0QFWBS1rrjwX00Id7xrCdFqKLQ3jVws",
//     authDomain: "employeestatus-98cb9.firebaseapp.com",
//     projectId: "employeestatus-98cb9",
//     storageBucket: "employeestatus-98cb9.firebasestorage.app",
//     messagingSenderId: "40645520643",
//     appId: "1:40645520643:web:6a32c65317b5274a32cd36",
//     measurementId: "G-PCVJ311MDD",
// };
const firebaseConfig = {
    apiKey: "AIzaSyAMe7cIZj7PJFxEknVCw1e0rXmuGZY7ZSs",
    authDomain: "advent-6a5c9.firebaseapp.com",
    projectId: "advent-6a5c9",
    storageBucket: "advent-6a5c9.firebasestorage.app",
    messagingSenderId: "567135145805",
    appId: "1:567135145805:web:282a683ab96f44094ab104",
    measurementId: "G-QQJ55EHBDC"
  };


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app, "gs://daily-tracker-doc");

console.log(auth);
export { db, auth, storage};
