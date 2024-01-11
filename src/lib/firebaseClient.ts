import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCosbLioKvt7VCLFuoTYVxKPRXhMb54-X0",
    authDomain: "humanmade-b1f8c.firebaseapp.com",
    projectId: "humanmade-b1f8c",
    storageBucket: "humanmade-b1f8c.appspot.com",
    messagingSenderId: "645532977740",
    appId: "1:645532977740:web:f6a9f7209800ca5d4a82e9",
    measurementId: "G-SQRXRS4MNW"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export default db;
