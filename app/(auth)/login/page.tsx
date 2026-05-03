"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  onAuthStateChanged 
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const auth = getFirebaseAuth();
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          router.push("/");
        } else {
          setCheckingAuth(false);
        }
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn("Firebase Auth is not configured.");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCheckingAuth(false);
    }
  }, [router]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const auth = getFirebaseAuth();
      await signInWithPopup(auth, provider);
      // router.push("/") is handled by onAuthStateChanged
    } catch (error) {
      const err = error as { code?: string; message?: string };
      console.error("Login Error:", err);
      
      if (err.code === "auth/user-cancelled") {
        // Silent or subtle notification - user closed the popup
        console.log("User cancelled the login flow.");
      } else if (err.message?.includes("IdP denied access")) {
        alert(
          "Access denied by Google. This often means:\n" +
          "1. Google Sign-in is not enabled in Firebase Console.\n" +
          "2. Authorized domains (localhost) are not configured.\n" +
          "3. The API key has restrictions."
        );
      } else {
        alert(`Sign-in failed: ${err.message || "Unknown error"}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-brand-navy)]">
        <DynamicIcon name="Loader2" className="text-[var(--color-brand-blue)] animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col selection:bg-[var(--color-brand-saffron)] selection:text-[var(--color-brand-navy)] bg-[var(--color-brand-navy)]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 pt-24 md:pt-[120px] relative overflow-hidden">
        {/* Decorative background glows */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[var(--color-brand-blue)] opacity-[0.05] blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[var(--color-brand-saffron)] opacity-[0.03] blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md animate-[fade-in-up_0.6s_ease-out]">
          <div className="glass-panel p-6 md:p-12 text-center relative">
            <div className="absolute -top-5 md:-top-6 left-1/2 -translate-x-1/2 w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-[var(--color-brand-blue)] flex items-center justify-center shadow-xl shadow-blue-500/20">
              <DynamicIcon name="ShieldCheck" className="text-white md:size-24" size={20} />
            </div>

            <h1 className="text-2xl md:text-3xl font-black mb-2 tracking-tight mt-4">Welcome Back</h1>
            <p className="text-sm md:text-base text-[var(--color-brand-gray-300)] mb-8 md:mb-10">
              Sign in to save your voting reminders and personalized election alerts.
            </p>

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full btn-ghost py-4 flex items-center justify-center gap-4 hover:bg-[hsla(215,85%,55%,0.05)] border-[hsla(210,20%,98%,0.1)] transition-all active:scale-[0.98]"
            >
              {loading ? (
                <DynamicIcon name="Loader2" size={20} className="animate-spin" />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              <span className="font-bold">Continue with Google</span>
            </button>

            <div className="mt-10 pt-8 border-t border-[hsla(210,20%,98%,0.05)] space-y-4">
              <div className="flex items-center gap-3 text-left">
                <div className="w-8 h-8 rounded-lg bg-[hsla(215,85%,55%,0.05)] flex items-center justify-center text-[var(--color-brand-blue)]">
                  <DynamicIcon name="Star" size={16} />
                </div>
                <p className="text-xs text-[var(--color-brand-gray-500)]">
                  Save your designated polling station.
                </p>
              </div>
              <div className="flex items-center gap-3 text-left">
                <div className="w-8 h-8 rounded-lg bg-[hsla(215,85%,55%,0.05)] flex items-center justify-center text-[var(--color-brand-blue)]">
                  <DynamicIcon name="Star" size={16} />
                </div>
                <p className="text-xs text-[var(--color-brand-gray-500)]">
                  Get notified when voter registration opens.
                </p>
              </div>
            </div>
          </div>
          
          <p className="text-center mt-8 text-xs text-[var(--color-brand-gray-500)]">
            By signing in, you agree to our Terms of Service and Privacy Policy. 
            CivicGuide will never share your voting preferences.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
