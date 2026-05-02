"use client";

import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { DynamicIcon } from "@/components/shared/DynamicIcon";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

export default function CandidatesPage() {
  const [candidateName, setCandidateName] = useState("");
  const [report, setReport] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-scroll to bottom as report is generated
  useEffect(() => {
    if (reportRef.current) {
      reportRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [report]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName || candidateName.length < 3) return;

    setIsLoading(true);
    setError(null);
    setReport("");

    try {
      const response = await fetch("/api/candidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: candidateName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Search failed");
      }

      setReport(data.report);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const buttonDisabled = !mounted || isLoading || candidateName.length < 3;

  return (
    <div className="flex flex-col h-screen bg-civic-navy text-civic-white overflow-hidden">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-6 px-4 md:px-8 overflow-hidden">
        <div className="container-max h-full flex flex-col">
          {/* Header */}
          <div className="mb-8 relative flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-display font-black tracking-tighter flex items-center gap-3">
                <span className="p-2 rounded-xl bg-civic-saffron/20 border border-civic-saffron/30">
                  <DynamicIcon name="FileSearch" className="w-8 h-8 text-civic-saffron" />
                </span>
                Affidavit <span className="gradient-text-gold">Analyzer</span>
              </h1>
              <p className="text-sm text-civic-gray-300 mt-1 max-w-xl">
                Simplifying candidate disclosures. Get Criminal, Financial, and Educational (CFE) summaries in seconds.
              </p>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest font-bold text-civic-gray-500">
                Source: <span className="text-civic-saffron">ECI / ADR Portals</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow overflow-hidden min-h-0">
            {/* Search Panel */}
            <div className="lg:col-span-5 flex flex-col h-full overflow-hidden">
              <div className="glass-card p-6 md:p-8 border-white/5 flex-grow overflow-y-auto custom-scrollbar">
                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-civic-saffron/5 to-transparent -z-10" />
                
                <form onSubmit={handleSearch} className="space-y-10 h-full flex flex-col">
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-3">
                      <label 
                        htmlFor="candidate-search" 
                        className="text-xs font-bold uppercase tracking-widest text-civic-gray-500"
                      >
                        Search Candidate
                      </label>
                      <span className="text-[10px] px-2 py-1 rounded bg-white/5 text-white/40 uppercase tracking-tighter">
                        e.g. Narendra Modi
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        id="candidate-search"
                        type="text"
                        className="input-base text-lg py-5 pl-14 placeholder:text-white/20 focus:border-civic-saffron/50"
                        placeholder="Enter candidate name..."
                        value={candidateName}
                        onChange={(e) => setCandidateName(e.target.value)}
                        disabled={isLoading}
                      />
                      <DynamicIcon 
                        name="UserSearch" 
                        className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-white/20" 
                      />
                    </div>
                    
                    <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/10">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-civic-saffron mb-4">Why use this?</h4>
                      <ul className="space-y-3">
                        {[
                          "Extracts hidden criminal cases",
                          "Summarizes assets & liabilities",
                          "Verifies educational claims",
                          "Direct links to official affidavits"
                        ].map((tip, i) => (
                          <li key={i} className="flex items-center gap-3 text-xs text-civic-gray-300">
                            <div className="w-1 h-1 rounded-full bg-civic-saffron" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-4 animate-in fade-in slide-in-from-top-2">
                      <DynamicIcon name="AlertCircle" className="w-5 h-5 text-red-500 shrink-0" />
                      <p className="text-sm text-red-200 leading-tight">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={buttonDisabled}
                    className="btn-gold w-full flex items-center justify-center gap-3 py-5 text-lg shadow-[0_8px_30px_hsla(43,92%,58%,0.15)] hover:shadow-[0_12px_40px_hsla(43,92%,58%,0.25)] transition-all active:scale-[0.98] shrink-0"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-6 h-6 border-3 border-civic-navy border-t-transparent rounded-full animate-spin" />
                        Analyzing Affidavit...
                      </>
                    ) : (
                      <>
                        <DynamicIcon name="Search" className="w-6 h-6" />
                        Analyze Candidate
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Analysis Report Area */}
            <div className="lg:col-span-7 flex flex-col h-full overflow-hidden">
              <div className="glass-card flex-grow overflow-hidden flex flex-col border-civic-saffron/20 bg-civic-saffron/[0.01]">
                {(report || isLoading) ? (
                  <>
                    <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center",
                          isLoading ? "bg-civic-saffron/20 animate-pulse" : "bg-civic-saffron/20"
                        )}>
                          <DynamicIcon 
                            name={isLoading ? "Loader2" : "FileText"} 
                            className={cn("w-5 h-5", isLoading ? "animate-spin text-civic-saffron" : "text-civic-saffron")} 
                          />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold leading-none mb-1">CFE Summary Report</h2>
                          <p className="text-[10px] text-civic-gray-500 uppercase tracking-widest">
                            {isLoading ? "Crawling official records..." : "Extraction Complete"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
                      <div className="prose prose-invert prose-civic max-w-none text-[16px] leading-relaxed">
                        {!report && isLoading && (
                          <div className="space-y-6">
                            <div className="h-4 bg-white/5 rounded-full w-3/4 animate-pulse" />
                            <div className="h-4 bg-white/5 rounded-full w-full animate-pulse" />
                            <div className="h-40 bg-white/5 rounded-2xl w-full animate-pulse" />
                            <div className="h-4 bg-white/5 rounded-full w-1/2 animate-pulse" />
                          </div>
                        )}
                        <ReactMarkdown>{report}</ReactMarkdown>
                      </div>
                      <div ref={reportRef} />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-center justify-center h-full p-12">
                    <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 relative">
                      <div className="absolute inset-0 rounded-full bg-civic-saffron/5 animate-pulse-glow" />
                      <DynamicIcon name="User" className="w-10 h-10 text-white/20" />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-white/40 mb-3 tracking-tight">No Candidate Selected</h3>
                    <p className="text-sm text-white/30 max-w-[300px] leading-relaxed">
                      Search for a candidate to see their criminal records, financial assets, and educational background.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
