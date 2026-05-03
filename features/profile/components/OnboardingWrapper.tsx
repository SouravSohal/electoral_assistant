"use client";

import { useAuth } from "@/features/profile/hooks/useAuth";
import { ProfileOnboarding } from "./ProfileOnboarding";
import { useEffect, useState } from "react";

export function OnboardingWrapper() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    
    if (!loading && user && !profile?.onboardingCompleted) {
      setShowOnboarding(true);
    } else {
      setShowOnboarding(false);
    }
  }, [user, profile, loading]);

  if (!showOnboarding || !user) return null;

  return (
    <ProfileOnboarding 
      user={user} 
      onComplete={() => {
        refreshProfile();
        setShowOnboarding(false);
      }} 
    />
  );
}
