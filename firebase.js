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
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey:            "AIzaSyDyjd30AFI5giahRMU62665BXAZWCDBTYw",
  authDomain:        "dcs-workshop-2026.firebaseapp.com",
  projectId:         "dcs-workshop-2026",
  storageBucket:     "dcs-workshop-2026.firebasestorage.app",
  messagingSenderId: "56910798748",
  appId:             "1:56910798748:web:ba41e621f3fbb76790b259",
};

const app = initializeApp(firebaseConfig);

export const auth    = getAuth(app);
export const db      = getFirestore(app);
export const storage = getStorage(app);

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
  doc,
  getDoc,
  setDoc,
  storageRef,
  uploadBytesResumable,
  getDownloadURL,
};
