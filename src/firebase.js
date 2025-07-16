import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCuGmNw_OSSxahp9f0J5gKmA0CTRkjSgHE",
  authDomain: "todo-app-31545.firebaseapp.com",
  projectId: "todo-app-31545",
  storageBucket: "todo-app-31545.firebasestorage.app",
  messagingSenderId: "521411462281",
  appId: "1:521411462281:web:c955d3dff6691b3c8bb258"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);



