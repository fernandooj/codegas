import { getAuth } from 'firebase/auth';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6E9gud74D4iJ8p7lIl99usgp0OZGAXuM",
  authDomain: "codegas-1d43a.firebaseapp.com",
  databaseURL: "https://codegas-1d43a.firebaseio.com",
  projectId: "codegas-1d43a",
  storageBucket: "codegas-1d43a.appspot.com",
  messagingSenderId: "421814098476",
  appId: "1:421814098476:web:cca5984aecc69b9e6b8f89"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)