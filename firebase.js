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
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getStorage, ref as _ref, uploadBytesResumable as _upload, getDownloadURL as _dlUrl } from "firebase/storage";

const firebaseConfig = {
  apiKey:            "AIzaSyDyjd30AFI5giahRMU62665BXAZWCDBTYw",
  authDomain:        "dcs-workshop-2026.firebaseapp.com",
  projectId:         "dcs-workshop-2026",
  storageBucket:     "dcs-workshop-2026.firebasestorage.app",
  messagingSenderId: "56910798748",
  appId:             "1:56910798748:web:ba41e621f3fbb76790b259",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Firestore — protected so a missing/unconfigured project can't crash the app
let _db = null;
try { _db = getFirestore(app); } catch (e) { console.warn("Firestore init failed:", e.message); }
export { _db as db, doc, getDoc, setDoc };

// Storage — protected so a missing bucket can't crash the app
let _storage = null;
try { _storage = getStorage(app); } catch (e) { console.warn("Storage init failed:", e.message); }
export {
  _storage as storage,
  _ref    as storageRef,
  _upload as uploadBytesResumable,
  _dlUrl  as getDownloadURL,
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
