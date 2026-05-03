"use client";

import React, { useState, useEffect, useRef } from "react";
import { MOCK_EVM_CANDIDATES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { DynamicIcon } from "@/components/ui/DynamicIcon";

export function EVMMachine() {
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [isVVPATPrinting, setIsVVPATPrinting] = useState(false);
  const [vvpatSlip, setVvpatSlip] = useState<{ name: string; symbol: string } | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [showCoach, setShowCoach] = useState(true);
  
  const beepRef = useRef<HTMLAudioElement | null>(null);

  // Initialize beep sound
  useEffect(() => {
    beepRef.current = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
  }, []);

  const handleVote = (candidateId: string) => {
    if (hasVoted || isVVPATPrinting) return;

    const candidate = MOCK_EVM_CANDIDATES.find((c) => c.id === candidateId);
    if (!candidate) return;

    setSelectedCandidate(candidateId);
    setIsVVPATPrinting(true);
    setVvpatSlip({ name: candidate.name, symbol: candidate.symbol });
    
    // Play beep
    if (beepRef.current) {
      beepRef.current.play().catch(() => {});
    }

    // VVPAT logic: visible for 7 seconds, then drops
    setTimeout(() => {
      setIsVVPATPrinting(false);
      setHasVoted(true);
      setShowCoach(true);
    }, 7000);
  };

  const resetSimulator = () => {
    setHasVoted(false);
    setSelectedCandidate(null);
    setVvpatSlip(null);
    setIsVVPATPrinting(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-12 items-start justify-center py-12">
      {/* 1. Balloting Unit (EVM) */}
      <div className="w-full max-w-md bg-[#e2e4d8] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.3)] p-4 border border-[#c5c7b8] relative">
        {/* BU Labeling */}
        <div className="flex justify-between items-center mb-4 px-2">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter leading-none">Election Commission of India</span>
            <span className="text-xs font-black text-gray-800">BALLOTING UNIT</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-[8px] text-gray-500 font-bold uppercase">Ready</span>
              <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
            </div>
          </div>
        </div>

        {/* The Ballot Paper Insert Area */}
        <div className="bg-[#fff9e6] rounded border-2 border-gray-400/30 p-1 shadow-inner">
          <div className="space-y-0.5">
            {MOCK_EVM_CANDIDATES.map((cand, index) => (
              <div 
                key={cand.id}
                className="flex items-center bg-white border-b border-gray-200 last:border-b-0 h-14 relative group"
              >
                {/* Serial Number */}
                <div className="w-10 flex items-center justify-center border-r border-gray-100 font-mono text-sm text-gray-700 font-bold">
                  {index + 1}
                </div>
                
                {/* Candidate Name & Party */}
                <div className="flex-1 px-3 flex flex-col justify-center">
                  <p className="text-black font-bold text-sm leading-tight uppercase">{cand.name}</p>
                  <p className="text-[9px] text-gray-500 font-medium tracking-tight">{cand.party}</p>
                </div>

                {/* Symbol Area */}
                <div className="w-14 h-full flex items-center justify-center border-l border-gray-100 bg-[#fafafa]">
                  <div className="text-2xl filter grayscale contrast-125 opacity-80 group-hover:opacity-100 transition-opacity">
                    {cand.symbol === "Lotus" && "🪷"}
                    {cand.symbol === "Hand" && "✋"}
                    {cand.symbol === "Elephant" && "🐘"}
                    {cand.symbol === "Broom" && "🧹"}
                    {cand.symbol === "Bicycle" && "🚲"}
                    {cand.symbol === "Clock" && "🕒"}
                    {cand.symbol === "Hammer & Sickle" && "☭"}
                    {cand.symbol === "Cross" && "✖"}
                  </div>
                </div>

                {/* Candidate Lamp (The Red LED) */}
                <div className="w-8 flex items-center justify-center">
                  <div className={cn(
                    "w-3 h-3 rounded-full transition-all duration-300",
                    selectedCandidate === cand.id 
                      ? "bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]" 
                      : "bg-gray-200"
                  )} />
                </div>

                {/* The Blue Button */}
                <div className="w-14 h-full bg-[#d1d5c2] flex items-center justify-center border-l border-[#b8baab]">
                  <button
                    onClick={() => handleVote(cand.id)}
                    disabled={hasVoted || isVVPATPrinting}
                    className={cn(
                      "w-10 h-8 rounded bg-[#1e40af] shadow-[0_4px_0_rgb(30,58,138),0_8px_15px_rgba(0,0,0,0.3)] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center border border-blue-900",
                      (hasVoted || isVVPATPrinting) && "opacity-50 cursor-not-allowed grayscale"
                    )}
                    aria-label={`Vote for ${cand.name}`}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Brand/Model details */}
        <div className="mt-4 flex justify-between items-end px-2 opacity-50">
          <div className="text-[7px] text-gray-800 font-bold">MODEL NO. EVM-2026-V4</div>
          <div className="text-[7px] text-gray-800 font-bold">BHARAT ELECTRONICS LTD</div>
        </div>

        {hasVoted && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-20 rounded-xl animate-in fade-in duration-300">
            <button 
              onClick={resetSimulator}
              className="bg-civic-saffron text-civic-navy font-black py-3 px-8 rounded-full shadow-2xl hover:scale-105 transition-transform"
            >
              RESET FOR NEXT VOTER
            </button>
          </div>
        )}
      </div>

      {/* 2. VVPAT Unit */}
      <div className="w-full max-w-sm flex flex-col gap-6">
        <div className="bg-[#cfd1cc] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.4)] p-6 border border-[#b8baa4] min-h-[480px] flex flex-col relative overflow-hidden">
          {/* VVPAT Head */}
          <div className="mb-6 flex justify-between items-start">
            <div>
              <span className="text-[9px] font-bold text-gray-600 block uppercase tracking-tighter">Election Commission</span>
              <h3 className="text-sm font-black text-gray-900 tracking-widest uppercase">VVPAT UNIT</h3>
            </div>
            <div className="w-12 h-2 rounded-full bg-black/20" />
          </div>

          {/* The Viewing Window */}
          <div className="flex-1 bg-[#1a1a1a] rounded-lg border-4 border-[#a3a595] relative overflow-hidden flex items-center justify-center shadow-inner">
            <div className="w-56 h-72 bg-white/95 relative overflow-hidden flex flex-col items-center justify-center p-6 shadow-2xl">
              {isVVPATPrinting ? (
                <div className="animate-in fade-in slide-in-from-top-full duration-1000 flex flex-col items-center w-full">
                  <div className="w-full border-t border-dashed border-gray-300 pt-6 text-center">
                    <div className="w-12 h-12 bg-black mx-auto mb-4 flex items-center justify-center text-white rounded-sm text-3xl">
                      {vvpatSlip?.symbol === "Lotus" && "🪷"}
                      {vvpatSlip?.symbol === "Hand" && "✋"}
                      {vvpatSlip?.symbol === "Elephant" && "🐘"}
                      {vvpatSlip?.symbol === "Broom" && "🧹"}
                      {vvpatSlip?.symbol === "Bicycle" && "🚲"}
                      {vvpatSlip?.symbol === "Clock" && "🕒"}
                      {vvpatSlip?.symbol === "Hammer & Sickle" && "☭"}
                      {vvpatSlip?.symbol === "Cross" && "✖"}
                    </div>
                    <p className="text-black font-black text-xl leading-none mb-1">{vvpatSlip?.name}</p>
                    <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest mb-4">Candidate Choice</p>
                    
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-gray-400 text-[8px] uppercase tracking-tighter font-bold">Paper Audit Trail - Verify your vote</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-400 text-[10px] font-mono tracking-widest uppercase text-center rotate-[-5deg]">
                  {hasVoted ? "Slip Deposited" : "Unit Ready"}
                </div>
              )}

              {/* Window Glass Reflection Effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />
            </div>

            {/* Bezel details */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-white/10 rounded-full" />
          </div>

          {/* VVPAT Footer */}
          <div className="mt-6 flex items-center justify-between opacity-40">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />
              <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />
            </div>
            <div className="text-[7px] text-gray-800 font-black">SERIAL NO. VVP-992-X</div>
          </div>
        </div>

        {/* Instruction Card */}
        <div className="glass-card p-5 border-l-4 border-civic-saffron bg-civic-saffron/5">
          <div className="flex items-start gap-4">
            <div className="mt-1">
              <DynamicIcon name="Info" className="text-civic-saffron w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-civic-saffron mb-1 uppercase tracking-wider">How to verify</h4>
              <p className="text-xs text-civic-gray-300 leading-relaxed italic">
                After you press the blue button, look at the VVPAT window. Your selection will be printed and displayed for 7 seconds. This is your definitive proof that your vote has been recorded as intended.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
