import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB94ZYTdP3jQGz3gE3wUlmjnAhjOoS975U",
  authDomain: "bitzmanager-4fa09.firebaseapp.com",
  projectId: "bitzmanager-4fa09",
  storageBucket: "bitzmanager-4fa09.firebasestorage.app",
  messagingSenderId: "626056356955",
  appId: "1:626056356955:web:399b0d74f635509d35cb7e"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
