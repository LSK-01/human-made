// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCosbLioKvt7VCLFuoTYVxKPRXhMb54-X0",
  authDomain: "humanmade-b1f8c.firebaseapp.com",
  projectId: "humanmade-b1f8c",
  storageBucket: "humanmade-b1f8c.appspot.com",
  messagingSenderId: "645532977740",
  appId: "1:645532977740:web:f6a9f7209800ca5d4a82e9",
  measurementId: "G-SQRXRS4MNW",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);