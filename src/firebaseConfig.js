import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDqHW7C7SIvkp_Bp9pJrWSHONl181jPSdo",
  authDomain: "pract-chat.firebaseapp.com",
  databaseURL: "https://pract-chat-default-rtdb.firebaseio.com",
  projectId: "pract-chat",
  storageBucket: "pract-chat.appspot.com",
  messagingSenderId: "828679656058",
  appId: "1:828679656058:web:a62aff6d72a5cf8ec2e1c3",
  measurementId: "G-LYH1TBF56B"
};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore()
