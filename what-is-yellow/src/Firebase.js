// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyACuIVTTt4DZF5lmvpQuY9vMFhI-kyROm0",
  authDomain: "what-is-yellow.firebaseapp.com",
  projectId: "what-is-yellow",
  storageBucket: "what-is-yellow.appspot.com",
  messagingSenderId: "697520380028",
  appId: "1:697520380028:web:eb62880c7d310f1e3191f9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default getFirestore();