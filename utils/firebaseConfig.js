import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCRXU9rQW1VBnjFbp9QK67sh9WQGcTmrEI",
    authDomain: "bicycle-ad5e4.firebaseapp.com",
    projectId: "bicycle-ad5e4",
    storageBucket: "bicycle-ad5e4.appspot.com",
    messagingSenderId: "425356937704",
    appId: "1:425356937704:web:c0ecc0df7196b0ac73fc5d",
    measurementId: "G-MEVQC8WB36",
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
