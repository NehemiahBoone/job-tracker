import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDPvM0vmk-NzMnhPtphQKJ0-ibwp8vr7-4",
  authDomain: "job-tracker-545fa.firebaseapp.com",
  projectId: "job-tracker-545fa",
  storageBucket: "job-tracker-545fa.firebasestorage.app",
  messagingSenderId: "1047482317077",
  appId: "1:1047482317077:web:6e15b8c1a9bb073254911c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
