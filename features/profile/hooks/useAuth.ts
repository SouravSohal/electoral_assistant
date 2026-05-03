import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { getFirebaseAuth, getUserProfile } from "@/lib/firebase";
import { UserProfile } from "@/lib/schemas";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const auth = getFirebaseAuth();
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setUser(user);
        if (user) {
          try {
            const auth = getFirebaseAuth();
            
            // Give Firestore a moment to sync the auth token
            await new Promise(resolve => setTimeout(resolve, 800)); // Increased delay slightly
            
            const profileData = await getUserProfile(user.uid);
            setProfile(profileData);
          } catch (e: any) {
            console.error("Failed to fetch profile:", e);
            if (e.code === "unavailable" || (e.message && e.message.includes("offline"))) {
              console.warn("Firestore is reporting offline. Attempting to reconnect...");
              try {
                const { reconnectFirestore } = await import("@/lib/firebase");
                await reconnectFirestore();
                // Retry once
                const retryProfile = await getUserProfile(user.uid);
                setProfile(retryProfile);
                return;
              } catch (reconnectError) {
                console.error("Reconnection failed:", reconnectError);
              }
            }
            setProfile(null);
          }
        } else {
          setProfile(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (error) {
      console.warn("Firebase Auth is not configured. Please add your keys to .env.local");
      setLoading(false);
    }
  }, []);

  const logout = async () => {
    try {
      const auth = getFirebaseAuth();
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const refreshProfile = async () => {
    try {
      if (user) {
        const profileData = await getUserProfile(user.uid);
        setProfile(profileData);
      }
    } catch (error) {
      console.error("Refresh Profile Error:", error);
    }
  };

  return { user, profile, loading, logout, refreshProfile };
}
