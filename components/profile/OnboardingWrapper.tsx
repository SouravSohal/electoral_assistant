"use client";

import { useAuth } from "@/hooks/useAuth";
import { ProfileOnboarding } from "./ProfileOnboarding";
import { useEffect, useState } from "react";

export function OnboardingWrapper() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    console.log("Onboarding Check:", { 
      loading, 
      user: !!user, 
      profileId: profile ? "Found" : "Missing",
      profileCompleted: profile?.onboardingCompleted 
    });
    
    if (!loading && user && !profile?.onboardingCompleted) {
      console.log("Triggering onboarding modal visibility");
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
