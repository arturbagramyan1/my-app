// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD9afGAPkJ-qxWGXrB80BVWIbPvT5FN1xE",
  authDomain: "my-app-e2c13.firebaseapp.com",
  projectId: "my-app-e2c13",
  storageBucket: "my-app-e2c13.firebasestorage.app",
  messagingSenderId: "770154464855",
  appId: "1:770154464855:web:72acc59f990310a0304512",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
