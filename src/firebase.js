// ────────────────────────────────────────────────────────────────
// FIREBASE SETUP
// ────────────────────────────────────────────────────────────────
// 1. Go to https://console.firebase.google.com -> Create project (free)
// 2. Project settings -> General -> Add app -> Web app -> copy the config
// 3. Paste your config values below, replacing the placeholders.
// 4. In Firebase console: Build -> Authentication -> Sign-in method ->
//    enable "Google" (and/or "Email/Password").
// 5. In Firebase console: Build -> Firestore Database -> Create database
//    -> start in "production mode" (rules are set for you below to copy).
//
// Firestore security rules to paste in the Firebase console
// (Build -> Firestore Database -> Rules):
//
//   rules_version = '2';
//   service cloud.firestore {
//     match /databases/{database}/documents {
//       match /users/{userId}/{document=**} {
//         allow read, write: if request.auth != null && request.auth.uid == userId;
//       }
//     }
//   }
//
// Until you fill in real keys below, the app runs fine in
// "local only" mode (saved to this device via localStorage) and will
// tell you sync is off instead of crashing.
// ────────────────────────────────────────────────────────────────

import { initializeApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
} from 'firebase/auth'
import {
  getFirestore,
  doc,
  setDoc,
  onSnapshot,
} from 'firebase/firestore'

export const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT.appspot.com',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
}

export const isFirebaseConfigured = firebaseConfig.apiKey !== 'YOUR_API_KEY'

let app = null
let auth = null
let db = null

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
}

export function watchAuth(callback) {
  if (!isFirebaseConfigured) {
    callback(null)
    return () => {}
  }
  return onAuthStateChanged(auth, callback)
}

export async function signIn() {
  if (!isFirebaseConfigured) throw new Error('Firebase not configured')
  const provider = new GoogleAuthProvider()
  await signInWithPopup(auth, provider)
}

export async function signOutUser() {
  if (!isFirebaseConfigured) return
  await fbSignOut(auth)
}

export function watchUserData(uid, callback) {
  if (!isFirebaseConfigured || !uid) return () => {}
  const ref = doc(db, 'users', uid)
  return onSnapshot(ref, (snap) => {
    if (snap.exists()) callback(snap.data())
  })
}

export async function saveUserData(uid, data) {
  if (!isFirebaseConfigured || !uid) return
  const ref = doc(db, 'users', uid)
  await setDoc(ref, data, { merge: true })
}
