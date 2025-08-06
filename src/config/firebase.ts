// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Check if Firebase is disabled
const isFirebaseDisabled = import.meta.env.VITE_DISABLE_FIREBASE === 'true';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxX",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "your-project-id.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "your-project-id.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:xxxxxxxxxxxxxxxxxxxxxxxx"
};

// Initialize Firebase only if not disabled
let app: any = null;
let auth: any = null;
let db: any = null;
let storage: any = null;

if (!isFirebaseDisabled) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    console.log('Firebase initialized successfully');
  } catch (error) {
    console.warn('Firebase initialization failed:', error);
    console.log('Running in offline mode');
  }
} else {
  console.log('Firebase disabled - running in offline mode');
}

export { auth, db, storage };
export default app;
