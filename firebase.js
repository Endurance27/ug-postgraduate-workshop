import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import {
  getStorage,
  ref as _ref,
  uploadBytesResumable as _upload,
  getDownloadURL as _dlUrl,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAErAF_udUNbnc8wyMJibylino3ZuNBDPQ",
  authDomain: "ug-postgrad-workshop-d6919.firebaseapp.com",
  projectId: "ug-postgrad-workshop-d6919",
  storageBucket: "ug-postgrad-workshop-d6919.firebasestorage.app",
  messagingSenderId: "33431380873",
  appId: "1:33431380873:web:46b1590188489e69463758",
  measurementId: "G-T3H3K0X7FH",
};

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Firestore — protected so a missing/unconfigured project can't crash the app
let _db = null;
try {
  _db = getFirestore(app);
} catch (e) {
  console.warn("Firestore init failed:", e.message);
}
export { _db as db, doc, getDoc, setDoc, collection, getDocs };

// Storage — protected so a missing bucket can't crash the app
let _storage = null;
try {
  _storage = getStorage(app);
} catch (e) {
  console.warn("Storage init failed:", e.message);
}
export {
  _storage as storage,
  _ref as storageRef,
  _upload as uploadBytesResumable,
  _dlUrl as getDownloadURL,
};

export {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
};
