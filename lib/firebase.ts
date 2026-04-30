/**
 * lib/firebase.ts
 * Firebase initialization — singleton pattern to prevent multiple instances.
 * Only public env vars (NEXT_PUBLIC_*) are used here — safe for client-side.
 */
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  type Firestore 
} from "firebase/firestore";
import { UserProfile } from "./schemas";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check for missing config in development
if (process.env.NODE_ENV === "development") {
  const missingKeys = Object.entries(firebaseConfig)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingKeys.length > 0) {
    console.warn(
      `Firebase config is missing keys: ${missingKeys.join(", ")}. ` +
      "Ensure your .env.local is correctly populated and you have restarted the dev server."
    );
  }
}

// Singleton pattern — prevent re-initialization in hot-reload
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

function getFirebaseApp(): FirebaseApp {
  if (!app) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  }
  return app;
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    auth = getAuth(getFirebaseApp());
  }
  return auth;
}

export function getFirebaseDb(): Firestore {
  if (!db) {
    db = getFirestore(getFirebaseApp());
  }
  return db;
}

/**
 * Firestore Helpers for User Profiles
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const db = getFirebaseDb();
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  }
  return null;
}

export async function updateUserProfile(uid: string, profile: Partial<UserProfile>): Promise<void> {
  const db = getFirebaseDb();
  const docRef = doc(db, "users", uid);
  
  // Try updating first, if doesn't exist, set it
  try {
    await updateDoc(docRef, {
      ...profile,
      updatedAt: Date.now(),
    });
  } catch (e) {
    await setDoc(docRef, {
      ...profile,
      updatedAt: Date.now(),
    });
  }
}

export { getFirebaseApp };
