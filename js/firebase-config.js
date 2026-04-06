import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCHn_nQ1jzW0jCGA8ATUnKNf73vYangmdA",
    authDomain: "jolayemi-portfolio.firebaseapp.com",
    projectId: "jolayemi-portfolio",
    storageBucket: "jolayemi-portfolio.firebasestorage.app",
    messagingSenderId: "647750202923",
    appId: "1:647750202923:web:4f058a15fd327db1499c6e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
