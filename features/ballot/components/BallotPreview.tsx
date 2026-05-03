"use client";

import { useState, useEffect } from "react";
import { MOCK_CANDIDATES, NOTA_CANDIDATE, Candidate } from "@/lib/mock-candidates";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { cn } from "@/lib/utils";
import { Info, ShieldAlert, CheckCircle2, Volume2, VolumeX } from "lucide-react";

export function BallotPreview() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isBeeping, setIsBeeping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleVote = (id: number) => {
    if (selectedId) return; // Only one vote allowed in preview session

    setSelectedId(id);
    setIsBeeping(true);
    
    // Simulate the EVM beep and red light
    if (soundEnabled) {
      const audio = new Audio("https://www.soundjay.com/buttons/beep-07.wav");
      audio.play().catch(() => {}); // Ignore errors if browser blocks audio
    }

    setTimeout(() => {
      setIsBeeping(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto" role="region" aria-label="EVM Ballot Unit Mockup">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* EVM Ballot Unit */}
        <div 
          className="flex-1 w-full bg-[#e5e7eb] rounded-xl p-4 shadow-2xl border-4 border-[#d1d5db] relative"
          aria-label="Ballot Unit"
        >
          {/* Header of EVM */}
          <div className="bg-[#cbd5e1] rounded-t-lg p-4 mb-4 flex justify-between items-center border-b border-[#94a3b8]">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-[#475569]" aria-hidden="true" />
              <span className="text-[10px] font-black text-[#475569] uppercase tracking-widest">
                Ballot Unit No. 01
              </span>
            </div>
            <div 
              className={cn(
                "w-6 h-6 rounded-full border-2 border-[#94a3b8] transition-all duration-300",
                isBeeping ? "bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]" : "bg-transparent"
              )} 
              role="status"
              aria-label={isBeeping ? "Voting light active" : "Voting light inactive"}
            />
          </div>

          {/* Candidate List */}
          <div className="space-y-1" role="list" aria-label="List of candidates">
            {MOCK_CANDIDATES.map((candidate) => (
              <BallotRow 
                key={candidate.id} 
                candidate={candidate} 
                onVote={() => handleVote(candidate.id)}
                isSelected={selectedId === candidate.id}
                disabled={selectedId !== null}
              />
            ))}
            
            {/* Spacers for standard EVM layout (16 slots) */}
            {[...Array(5)].map((_, i) => (
              <div 
                key={`spacer-${i}`} 
                className="h-14 bg-white/50 border border-[#94a3b8] rounded flex items-center px-4"
                aria-hidden="true"
              >
                <span className="text-xs text-[#94a3b8] font-mono">{11 + i}</span>
              </div>
            ))}

            <BallotRow 
              candidate={NOTA_CANDIDATE} 
              onVote={() => handleVote(NOTA_CANDIDATE.id)}
              isSelected={selectedId === NOTA_CANDIDATE.id}
              disabled={selectedId !== null}
            />
          </div>

          {/* Bottom Branding */}
          <div className="mt-6 pt-4 border-t border-[#cbd5e1] text-center">
            <p className="text-[9px] font-bold text-[#64748b] uppercase tracking-[0.2em]">
              Electronic Voting Machine • Election Commission of India
            </p>
          </div>
        </div>

        {/* Info & Side Panel */}
        <div className="w-full md:w-80 space-y-6">
          <section className="glass-panel p-6 space-y-4" aria-labelledby="practice-heading">
            <h2 id="practice-heading" className="text-xl font-bold flex items-center gap-2">
              <Info size={20} className="text-[var(--color-brand-blue)]" aria-hidden="true" />
              Practice Voting
            </h2>
            <p className="text-sm text-[var(--color-brand-gray-300)] leading-relaxed">
              This is a digital mockup of the Electronic Voting Machine (EVM) used in Indian elections. 
              Familiarize yourself with the layout before you head to the polling station.
            </p>
            
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-muted)]">Instructions</h3>
              <ul className="space-y-2 text-xs text-[var(--color-brand-gray-400)]">
                <li className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-blue)] mt-1 shrink-0" aria-hidden="true" />
                  Look for your candidate's name and symbol.
                </li>
                <li className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-blue)] mt-1 shrink-0" aria-hidden="true" />
                  Press the blue button next to the symbol.
                </li>
                <li className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-blue)] mt-1 shrink-0" aria-hidden="true" />
                  A red light will glow and a beep sound will confirm your vote.
                </li>
              </ul>
            </div>

            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="flex items-center gap-2 text-xs font-bold text-[var(--color-brand-blue)] hover:underline pt-2 focus-visible:ring-2 focus-visible:ring-[var(--color-brand-blue)] rounded outline-none"
              aria-label={soundEnabled ? "Mute voting sound" : "Unmute voting sound"}
            >
              {soundEnabled ? <Volume2 size={14} aria-hidden="true" /> : <VolumeX size={14} aria-hidden="true" />}
              {soundEnabled ? "Sound Enabled" : "Sound Muted"}
            </button>
          </section>

          <div aria-live="polite" aria-atomic="true">
            {selectedId ? (
              <div className="glass-panel p-6 border-[var(--color-brand-blue)] bg-[hsla(215,85%,55%,0.05)] animate-fade-in">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 className="text-green-500" size={24} aria-hidden="true" />
                  <h3 className="font-bold">Vote Simulated!</h3>
                </div>
                <p className="text-sm text-[var(--color-brand-gray-300)] mb-6">
                  In a real election, the VVPAT machine next to the EVM would show a paper slip for 7 seconds to confirm your choice.
                </p>
                <button 
                  onClick={() => setSelectedId(null)}
                  className="btn-primary w-full py-2 text-sm"
                  aria-label="Reset ballot to try again"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[hsla(28,92%,58%,0.05)] border border-[hsla(28,92%,58%,0.1)] flex items-start gap-3">
                <ShieldAlert size={18} className="text-[var(--color-brand-saffron)] mt-0.5" aria-hidden="true" />
                <p className="text-[10px] text-[var(--color-brand-gray-300)] uppercase font-bold tracking-tight">
                  EDUCATIONAL PURPOSE ONLY • NOT AN OFFICIAL VOTE
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface BallotRowProps {
  candidate: Candidate;
  onVote: () => void;
  isSelected: boolean;
  disabled: boolean;
}

function BallotRow({ candidate, onVote, isSelected, disabled }: BallotRowProps) {
  return (
    <div 
      className={cn(
        "flex items-stretch h-16 bg-white border border-[#94a3b8] rounded transition-all group",
        isSelected && "ring-2 ring-blue-600 ring-inset"
      )}
      role="listitem"
    >
      {/* Number */}
      <div className="w-12 border-r border-[#cbd5e1] flex items-center justify-center font-mono font-bold text-[#475569] bg-[#f8fafc]" aria-hidden="true">
        {candidate.id}
      </div>

      {/* Name and Hindi Name */}
      <div className="flex-1 px-4 flex flex-col justify-center min-w-0">
        <p className="text-sm font-bold text-gray-900 truncate leading-tight">
          {candidate.name}
        </p>
        <p className="text-xs text-gray-500 truncate" lang="hi">
          {candidate.nameHi}
        </p>
      </div>

      {/* Symbol */}
      <div className="w-16 border-l border-[#cbd5e1] flex items-center justify-center bg-[#f8fafc]" aria-label={`Party Symbol: ${candidate.symbol}`}>
        <DynamicIcon name={candidate.symbol} size={28} className="text-gray-700" aria-hidden="true" />
      </div>

      {/* Blue Button */}
      <div className="w-20 border-l border-[#cbd5e1] flex items-center justify-center bg-[#f1f5f9]">
        <button
          onClick={onVote}
          disabled={disabled}
          className={cn(
            "w-12 h-8 rounded bg-blue-700 shadow-md transition-all active:scale-90 active:bg-blue-900 active:shadow-inner focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 outline-none",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            isSelected ? "bg-blue-900 shadow-inner scale-95" : "hover:bg-blue-800"
          )}
          aria-label={`Press blue button to vote for ${candidate.name}`}
          aria-pressed={isSelected}
        />
      </div>
    </div>
  );
}
