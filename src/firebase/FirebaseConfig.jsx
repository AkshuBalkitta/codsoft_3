// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDS-BVEeUfNwWIfL7fJSf85C5DV02Ro3kY",
  authDomain: "myblog-2581d.firebaseapp.com",
  projectId: "myblog-2581d",
  storageBucket: "myblog-2581d.firebasestorage.app",
  messagingSenderId: "553528121934",
  appId: "1:553528121934:web:8091b790de5adae273411f"
};

const app = initializeApp(firebaseConfig);
const fireDB = getFirestore(app);
const auth = getAuth(app)
export { fireDB, auth};