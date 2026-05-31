import { initializeApp, FirebaseApp } from "firebase/app";
import {
  getAuth,
  Auth,
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
import {
  getFirestore,
  Firestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import {
  getStorage,
  FirebaseStorage,
  ref as _ref,
  uploadBytesResumable as _upload,
  getDownloadURL as _dlUrl,
} from "firebase/storage";

// ─── Types ────────────────────────────────────────────────────────────────────
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────
const firebaseConfig: FirebaseConfig = {
  apiKey: "AIzaSyAErAF_udUNbnc8wyMJibylino3ZuNBDPQ",
  authDomain: "ug-postgrad-workshop-d6919.firebaseapp.com",
  projectId: "ug-postgrad-workshop-d6919",
  storageBucket: "ug-postgrad-workshop-d6919.firebasestorage.app",
  messagingSenderId: "33431380873",
  appId: "1:33431380873:web:46b1590188489e69463758",
  measurementId: "G-T3H3K0X7FH",
};

// ─── Initialize ───────────────────────────────────────────────────────────────
const app: FirebaseApp = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);

// Firestore — protected so a missing/unconfigured project can't crash the app
let _db: Firestore | null = null;
try {
  _db = getFirestore(app);
} catch (e) {
  console.warn("Firestore init failed:", (e as Error).message);
}
export { _db as db, doc, getDoc, setDoc, collection, getDocs };

// Storage — protected so a missing bucket can't crash the app
let _storage: FirebaseStorage | null = null;
try {
  _storage = getStorage(app);
} catch (e) {
  console.warn("Storage init failed:", (e as Error).message);
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
