import { initializeApp, FirebaseApp } from 'firebase/app';
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
} from 'firebase/auth';
import {
  getFirestore,
  Firestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  onSnapshot,
} from 'firebase/firestore';
import {
  getStorage,
  FirebaseStorage,
  ref as _ref,
  uploadBytesResumable as _upload,
  getDownloadURL as _dlUrl,
} from 'firebase/storage';
import {
  getFunctions,
  httpsCallable as _httpsCallable,
  Functions,
} from 'firebase/functions';

// ─── Types ────────────────────────────────────────────────────────────────────
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
  databaseURL?: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────
// const firebaseConfig: FirebaseConfig = {
//   apiKey: "AIzaSyDyjd30AFI5giahRMU62665BXAZWCDBTYw",
//   authDomain: "dcs-workshop-2026.firebaseapp.com",
//   projectId: "dcs-workshop-2026",
//   storageBucket: "dcs-workshop-2026.firebasestorage.app",
//   messagingSenderId: "56910798748",
//   appId: "1:56910798748:web:ba41e621f3fbb76790b259",
//   measurementId: "G-BGCT3W4PP6",
// };
const firebaseConfig = {
  apiKey: 'AIzaSyAErAF_udUNbnc8wyMJibylino3ZuNBDPQ',
  authDomain: 'ug-postgrad-workshop-d6919.firebaseapp.com',
  projectId: 'ug-postgrad-workshop-d6919',
  storageBucket: 'ug-postgrad-workshop-d6919.firebasestorage.app',
  messagingSenderId: '33431380873',
  appId: '1:33431380873:web:937326a802deb646463758',
  measurementId: 'G-0YCXL0LGXP',
};

// ─── Initialize ───────────────────────────────────────────────────────────────
const app: FirebaseApp = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);

// Firestore — protected so a missing/unconfigured project can't crash the app
let _db: Firestore | null = null;
try {
  _db = getFirestore(app);
} catch (e) {
  console.warn('Firestore init failed:', (e as Error).message);
}
export { _db as db, doc, getDoc, setDoc, collection, getDocs, onSnapshot };

// Storage — protected so a missing bucket can't crash the app
let _storage: FirebaseStorage | null = null;
try {
  _storage = getStorage(app);
} catch (e) {
  console.warn('Storage init failed:', (e as Error).message);
}
export {
  _storage as storage,
  _ref as storageRef,
  _upload as uploadBytesResumable,
  _dlUrl as getDownloadURL,
};

// Functions — protected so a missing/unconfigured project can't crash the app
let _functions: Functions | null = null;
try {
  _functions = getFunctions(app, 'us-central1');
} catch (e) {
  console.warn('Functions init failed:', (e as Error).message);
}
export { _functions as functions, _httpsCallable as httpsCallable };

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
