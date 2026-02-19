
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: (typeof process !== 'undefined' ? process.env.VITE_FIREBASE_API_KEY : '') || import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: (typeof process !== 'undefined' ? process.env.VITE_FIREBASE_AUTH_DOMAIN : '') || import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: (typeof process !== 'undefined' ? process.env.VITE_FIREBASE_PROJECT_ID : '') || import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: (typeof process !== 'undefined' ? process.env.VITE_FIREBASE_STORAGE_BUCKET : '') || import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: (typeof process !== 'undefined' ? process.env.VITE_FIREBASE_MESSAGING_SENDER_ID : '') || import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: (typeof process !== 'undefined' ? process.env.VITE_FIREBASE_APP_ID : '') || import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

// Voltando para o banco de dados 'bookscanner' conforme solicitado.
export const db = getFirestore(app, "bookscanner");
export const auth = getAuth(app);
export default app;
