// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// IMPORTANT: This is a public configuration and is safe to be exposed.
// Security is handled by Firebase Security Rules.
const firebaseConfig = {
  "projectId": "career-quest-wkb6l",
  "appId": "1:766253540873:web:0927e48254543fedfa3ad8",
  "storageBucket": "career-quest-wkb6l.firebasestorage.app",
  "apiKey": "AIzaSyCNSgoyExZzuGajYjVsoZmeBrulHSY3gec",
  "authDomain": "career-quest-wkb6l.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "766253540873"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
