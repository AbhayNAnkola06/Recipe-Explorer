
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC12zlh3_S8pRYoninXu_SByv_dh-P8cbA",
  authDomain: "recipe-explorer-web.firebaseapp.com",
  projectId: "recipe-explorer-web",
  storageBucket: "recipe-explorer-web.firebasestorage.app",
  messagingSenderId: "581087703683",
  appId: "1:581087703683:web:486d6f8b1cf5cd69dfa1b6",
};

const app = getApps().length > 0
  ? getApp()
  : initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);
