"use client";

import { useState } from "react";
import { 
  User as UserIcon, 
  Calendar, 
  MapPin, 
  Target, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Loader2,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { User } from "firebase/auth";
import { updateUserProfile } from "@/lib/firebase";
import { UserProfile, UserProfileSchema } from "@/lib/schemas";

interface ProfileOnboardingProps {
  user: User;
  onComplete: () => void;
}

const STEPS = [
  { id: 1, title: "Identity", icon: UserIcon },
  { id: 2, title: "Voter Profile", icon: Target },
  { id: 3, title: "Location", icon: MapPin },
];

const VOTER_TYPES = [
  { id: "first_time", label: "First-time Voter", description: "Turning 18 or never voted before" },
  { id: "senior", label: "Senior Citizen (80+)", description: "Eligible for home voting options" },
  { id: "pwd", label: "Person with Disability", description: "Needs assistance or accessibility info" },
  { id: "nri", label: "NRI Voter", description: "Overseas Indian citizen" },
  { id: "general", label: "General Voter", description: "Regular voter" },
];

const INTERESTS = [
  "Registration Steps",
  "Polling Booth Locator",
  "Candidate Affidavits",
  "Voter Rights & Laws",
  "Model Code of Conduct",
  "EVM & VVPAT Info",
];

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", 
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", 
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Puducherry"
];

export function ProfileOnboarding({ user, onComplete }: ProfileOnboardingProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<UserProfile>>({
    fullName: user.displayName || "",
    dateOfBirth: "",
    gender: "prefer_not_to_say",
    voterType: "general",
    location: { state: "", district: "" },
    interests: [],
  });

  const handleNext = () => {
    if (step < STEPS.length) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleInterest = (interest: string) => {
    const current = formData.interests || [];
    if (current.includes(interest)) {
      setFormData({ ...formData, interests: current.filter(i => i !== interest) });
    } else {
      setFormData({ ...formData, interests: [...current, interest] });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const profileData = {
        ...formData,
        onboardingCompleted: true,
        updatedAt: Date.now(),
      } as UserProfile;

      // Validate with Zod
      console.log("Validating profile data:", profileData);
      const result = UserProfileSchema.safeParse(profileData);
      
      if (!result.success) {
        const firstError = result.error.errors[0].message;
        setError(firstError);
        console.error("Validation failed:", result.error.format());
        setLoading(false);
        return;
      }

      await updateUserProfile(user.uid, profileData);
      onComplete();
    } catch (err: any) {
      console.error("Save Error:", err);
      setError(err.message || "Failed to save profile. Please check all fields.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[var(--color-brand-navy)]/95 backdrop-blur-md">
      <div className="w-full max-w-2xl glass-panel p-8 md:p-12 relative overflow-hidden animate-[fade-in-up_0.5s_ease-out]">
        {/* Background Glows */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[var(--color-brand-blue)] opacity-[0.05] blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[var(--color-brand-saffron)] opacity-[0.03] blur-[80px] pointer-events-none" />

        <div className="relative z-10">
          <header className="mb-10">
            <div className="flex items-center gap-4 mb-4">
              {STEPS.map((s) => (
                <div key={s.id} className="flex items-center gap-2">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                    step === s.id 
                      ? "bg-[var(--color-brand-blue)] text-white shadow-[0_0_15px_hsla(215,85%,55%,0.4)]" 
                      : step > s.id 
                        ? "bg-[var(--color-brand-green)] text-white" 
                        : "bg-[hsla(210,20%,98%,0.05)] text-[var(--color-brand-muted)]"
                  )}>
                    {step > s.id ? <Check size={14} /> : s.id}
                  </div>
                  {s.id < STEPS.length && (
                    <div className="w-8 h-px bg-[hsla(210,20%,98%,0.1)]" />
                  )}
                </div>
              ))}
            </div>
            <h1 className="text-3xl font-black text-white mb-2">Help Us Personalize <span className="text-[var(--color-brand-blue)]">Your Experience</span></h1>
            <p className="text-[var(--color-brand-muted)]">This information helps CivicGuide India provide relevant voting guidance tailored to your specific needs.</p>
          </header>

          <main className="min-h-[320px]">
            {/* Step 1: Identity */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-muted)]">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-brand-muted)]" size={18} />
                    <input 
                      type="text" 
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Enter your full name"
                      className="w-full bg-[hsla(210,20%,98%,0.03)] border border-[hsla(210,20%,98%,0.1)] rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[var(--color-brand-blue)] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-muted)]">Date of Birth</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-brand-muted)]" size={18} />
                      <input 
                        type="date" 
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        className="w-full bg-[hsla(210,20%,98%,0.03)] border border-[hsla(210,20%,98%,0.1)] rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[var(--color-brand-blue)] transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-muted)]">Gender</label>
                    <select 
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                      className="w-full bg-[hsla(210,20%,98%,0.03)] border border-[hsla(210,20%,98%,0.1)] rounded-xl py-4 px-4 text-white focus:outline-none focus:border-[var(--color-brand-blue)] transition-all appearance-none"
                    >
                      <option value="prefer_not_to_say">Prefer not to say</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Voter Profile */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-muted)]">Which category best describes you?</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {VOTER_TYPES.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setFormData({ ...formData, voterType: type.id as any })}
                        className={cn(
                          "text-left p-4 rounded-2xl border transition-all duration-300",
                          formData.voterType === type.id 
                            ? "bg-[hsla(215,85%,55%,0.1)] border-[var(--color-brand-blue)] shadow-[0_4px_12px_hsla(215,85%,55%,0.1)]" 
                            : "bg-[hsla(210,20%,98%,0.03)] border-[hsla(210,20%,98%,0.1)] hover:border-[hsla(210,20%,98%,0.2)]"
                        )}
                      >
                        <p className="font-bold text-white text-sm">{type.label}</p>
                        <p className="text-[11px] text-[var(--color-brand-muted)] mt-1">{type.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-muted)]">What are you most interested in?</label>
                  <div className="flex flex-wrap gap-2">
                    {INTERESTS.map((interest) => (
                      <button
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={cn(
                          "px-4 py-2 rounded-full text-xs font-bold transition-all border",
                          formData.interests?.includes(interest)
                            ? "bg-[var(--color-brand-blue)] text-white border-[var(--color-brand-blue)]"
                            : "bg-transparent text-[var(--color-brand-muted)] border-[hsla(210,20%,98%,0.1)] hover:border-[hsla(210,20%,98%,0.3)]"
                        )}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Location */}
            {step === 3 && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-muted)]">State / UT</label>
                  <select 
                    value={formData.location?.state}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      location: { ...formData.location!, state: e.target.value } 
                    })}
                    className="w-full bg-[hsla(210,20%,98%,0.03)] border border-[hsla(210,20%,98%,0.1)] rounded-xl py-4 px-4 text-white focus:outline-none focus:border-[var(--color-brand-blue)] transition-all"
                  >
                    <option value="">Select State</option>
                    {INDIAN_STATES.map(state => <option key={state} value={state}>{state}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-muted)]">District / Constituency</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-brand-muted)]" size={18} />
                    <input 
                      type="text" 
                      value={formData.location?.district}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        location: { ...formData.location!, district: e.target.value } 
                      })}
                      placeholder="e.g. Pune City, South Delhi"
                      className="w-full bg-[hsla(210,20%,98%,0.03)] border border-[hsla(210,20%,98%,0.1)] rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[var(--color-brand-blue)] transition-all"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[hsla(28,100%,55%,0.05)] border border-[hsla(28,100%,55%,0.1)] flex items-start gap-3 mt-8">
                  <AlertCircle size={18} className="text-[var(--color-brand-saffron)] mt-0.5" />
                  <p className="text-xs text-[var(--color-brand-gray-300)] leading-relaxed">
                    <strong>Why location?</strong> Election dates and candidate lists vary by state. Providing your district allows the AI to give you specific details for your local constituency.
                  </p>
                </div>
              </div>
            )}
          </main>

          <footer className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6">
            {error && (
              <p className="text-xs font-bold text-red-400 flex items-center gap-2">
                <AlertCircle size={14} />
                {error}
              </p>
            )}
            <div className="flex items-center gap-4 w-full md:w-auto ml-auto">
              {step > 1 && (
                <button
                  onClick={handleBack}
                  className="btn-ghost px-8 py-3 flex items-center gap-2"
                >
                  <ChevronLeft size={18} />
                  Back
                </button>
              )}
              {step < STEPS.length ? (
                <button
                  onClick={handleNext}
                  disabled={!formData.fullName || (step === 1 && !formData.dateOfBirth)}
                  className="btn-primary px-10 py-3 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight size={18} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading || !formData.location?.state || !formData.location?.district || (formData.interests?.length || 0) === 0}
                  className="btn-gold px-12 py-3 flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      Complete Profile
                      <Check size={18} />
                    </>
                  )}
                </button>
              )}
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
