import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js';

const firebaseConfig = {
  apiKey: "AIzaSyCKyzkeC0DIX_hU2BviCWDEGgYsfDDN9dE",
  authDomain: "tienda-laser.firebaseapp.com",
  projectId: "tienda-laser",
  storageBucket: "tienda-laser.firebasestorage.app",
  messagingSenderId: "482459246498",
  appId: "1:482459246498:web:3681e2edfc1a8e502a9cfb"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);