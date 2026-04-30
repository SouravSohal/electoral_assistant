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
            console.log("Fetching profile for user:", user.uid);
            const profileData = await getUserProfile(user.uid);
            console.log("Profile data fetched:", profileData);
            setProfile(profileData);
          } catch (e) {
            console.error("Failed to fetch profile:", e);
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
