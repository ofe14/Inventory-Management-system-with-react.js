// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyChgdKZV7fLfHmpS2usgO_CCCD2bpb0zT4",
  authDomain: "stockapp-5d657.firebaseapp.com",
  projectId: "stockapp-5d657",
  storageBucket: "stockapp-5d657.appspot.com",
  messagingSenderId: "514787150044",
  appId: "1:514787150044:web:f152e9f387f72ff1854c19",
  measurementId: "G-5HHC17VQBY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


const db = getFirestore(app)
const auth = getAuth(app);
export{db ,auth, signInWithEmailAndPassword}