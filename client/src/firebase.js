// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getMessaging,getToken,onMessage} from "firebase/messaging"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_XWlb5pkYh669K5DNiXfaVcQ0NtxHT6c",
  authDomain: "easy-fest-9338f.firebaseapp.com",
  projectId: "easy-fest-9338f",
  storageBucket: "easy-fest-9338f.firebasestorage.app",
  messagingSenderId: "1019388827510",
  appId: "1:1019388827510:web:d348cfca4d65a005b0cc57",
  measurementId: "G-LCL3VTHRHX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
export {messaging,getToken,onMessage,app};