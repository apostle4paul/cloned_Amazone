// Utility/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlURqIEavOIdcu_PJZ6NFY57RtlnaVCVU",
  authDomain: "clone-c278a.firebaseapp.com",
  projectId: "clone-c278a",
  storageBucket: "clone-c278a.appspot.com",
  messagingSenderId: "601064436312",
  appId: "1:601064436312:web:e9ea82d301efed5f1fd02d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth and Firestore instances
export const auth = getAuth(app);
export const db = getFirestore(app);

// 🔹 Connect to local Firestore emulator if running on localhost
if (window.location.hostname === "localhost") {
  connectFirestoreEmulator(db, "localhost", 8081); // Ensure this matches your emulator port
  console.log("✅ Connected to Firestore emulator on localhost:8080");
}
