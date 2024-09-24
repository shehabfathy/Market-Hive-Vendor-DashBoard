// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyB3YpaMtjcLBNF9V5S_T7O4ALpqxaLCOAM',
  authDomain: 'markethive-recovery.firebaseapp.com',
  projectId: 'markethive-recovery',
  storageBucket: 'markethive-recovery.appspot.com',
  messagingSenderId: '113383015154',
  appId: '1:113383015154:web:8005a74f003b5b0932066b',
  measurementId: 'G-JEZYYHVKGT'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
