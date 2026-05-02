"use client";

import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { DynamicIcon } from "@/components/shared/DynamicIcon";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

export default function VerifyPage() {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom as result streams in
  useEffect(() => {
    if (resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [result]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.length < 10) {
      setError("Please paste a longer text to verify (at least 10 characters).");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult("");

    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Verification failed");
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setResult((prev) => prev + chunk);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to extract verdict from the streaming result
  const getVerdict = () => {
    if (!result) return null;
    const match = result.match(/VERDICT:\s*(True|False|Misleading|Verified|Debunked)/i);
    return match ? match[1].toUpperCase() : null;
  };

  const verdict = getVerdict();

  return (
    <div className="flex flex-col min-h-screen bg-civic-navy text-civic-white overflow-x-hidden">
      <Navbar />
      
      <main className="flex-grow container-max section-padding pt-32 pb-20 animate-fade-in-up">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 relative">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-civic-blue/10 blur-[100px] rounded-full -z-10 animate-pulse-glow" />
            
            <div className="inline-flex items-center justify-center p-4 mb-8 rounded-2xl bg-gradient-to-br from-civic-blue/20 to-transparent border border-civic-blue/30 shadow-[0_0_40px_hsla(215,85%,55%,0.1)]">
              <DynamicIcon name="ShieldCheck" className="w-10 h-10 text-civic-blue" />
            </div>
            
            <h1 className="text-display mb-6 tracking-tight">
              AI <span className="gradient-text">Fact-Checker</span>
            </h1>
            <p className="text-subheadline text-civic-gray-300 max-w-2xl mx-auto leading-relaxed">
              Combat misinformation with intelligence. Paste any suspected election rumor 
              to verify it against official ECI guidelines and legal frameworks.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Input Form */}
            <div className="lg:col-span-7">
              <div className="glass-card p-6 md:p-10 border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-civic-blue/5 to-transparent -z-10 group-hover:scale-110 transition-transform duration-700" />
                
                <form onSubmit={handleVerify} className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label 
                        htmlFor="misinfo-input" 
                        className="text-sm font-bold uppercase tracking-widest text-civic-gray-500"
                      >
                        Suspected Claim
                      </label>
                      <span className="text-[10px] px-2 py-1 rounded bg-white/5 text-white/40 uppercase tracking-tighter">
                        Min 10 chars
                      </span>
                    </div>
                    <textarea
                      id="misinfo-input"
                      className="input-base min-h-[220px] resize-none text-lg leading-relaxed placeholder:text-white/20 focus:border-civic-blue/50"
                      placeholder="Paste the message here... e.g. 'ECI has changed the voting age to 21 for 2026'"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-4 animate-in fade-in slide-in-from-top-2">
                      <DynamicIcon name="AlertCircle" className="w-6 h-6 text-red-500 shrink-0" />
                      <p className="text-sm text-red-200 leading-tight">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading || inputText.length < 10}
                    className="btn-gold w-full flex items-center justify-center gap-3 py-5 text-lg shadow-[0_8px_30px_hsla(43,92%,58%,0.15)] group-hover:shadow-[0_12px_40px_hsla(43,92%,58%,0.25)] transition-all active:scale-[0.98]"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-6 h-6 border-3 border-civic-navy border-t-transparent rounded-full animate-spin" />
                        Analyzing Claims...
                      </>
                    ) : (
                      <>
                        <DynamicIcon name="Sparkles" className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                        Start AI Verification
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Results / Sidebar Area */}
            <div className="lg:col-span-5 space-y-6">
              {(result || isLoading) ? (
                <div className="glass-card p-6 md:p-8 border-civic-blue/20 bg-civic-blue/[0.02] animate-in fade-in slide-in-from-right-4 duration-500 sticky top-32">
                  <div className="flex items-center gap-4 mb-8 pb-4 border-b border-white/10">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg",
                      isLoading ? "bg-civic-gold/20 animate-pulse" : "bg-civic-blue/20"
                    )}>
                      <DynamicIcon 
                        name={isLoading ? "Loader2" : "FileCheck2"} 
                        className={cn("w-6 h-6", isLoading ? "animate-spin text-civic-gold" : "text-civic-blue")} 
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold leading-none mb-1">AI Analysis</h2>
                      <p className="text-xs text-civic-gray-500 uppercase tracking-widest">
                        {isLoading ? "Generating report..." : "Verified by Gemini"}
                      </p>
                    </div>
                  </div>

                  <div className="prose prose-invert prose-civic max-w-none text-[15px] leading-relaxed">
                    {/* Verdict Banner */}
                    {verdict && !isLoading && (
                      <div className={cn(
                        "mb-6 p-4 rounded-2xl border flex items-center gap-3 animate-in zoom-in-95 duration-500",
                        verdict === "TRUE" || verdict === "VERIFIED" 
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                          : verdict === "FALSE" || verdict === "DEBUNKED"
                          ? "bg-red-500/10 border-red-500/20 text-red-400"
                          : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                      )}>
                        <DynamicIcon 
                          name={verdict === "TRUE" || verdict === "VERIFIED" ? "CheckCircle2" : "AlertTriangle"} 
                          className="w-5 h-5 shrink-0" 
                        />
                        <span className="font-black uppercase tracking-[0.2em] text-xs">
                          Verdict: {verdict}
                        </span>
                      </div>
                    )}

                    {!result && isLoading && (
                      <div className="space-y-4">
                        <div className="h-4 bg-white/5 rounded-full w-3/4 animate-pulse" />
                        <div className="h-4 bg-white/5 rounded-full w-full animate-pulse" />
                        <div className="h-20 bg-white/5 rounded-2xl w-full animate-pulse" />
                        <div className="h-4 bg-white/5 rounded-full w-1/2 animate-pulse" />
                      </div>
                    )}
                    <ReactMarkdown>{result}</ReactMarkdown>
                  </div>
                  <div ref={resultRef} />
                </div>
              ) : (
                <div className="glass-card p-8 border-dashed border-white/10 flex flex-col items-center text-center justify-center min-h-[400px]">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                    <DynamicIcon name="MessageSquareText" className="w-10 h-10 text-white/20" />
                  </div>
                  <h3 className="text-lg font-bold text-white/60 mb-2">No Analysis Yet</h3>
                  <p className="text-sm text-white/30 max-w-[200px]">
                    Paste text on the left to start the AI verification process.
                  </p>
                </div>
              )}

              {/* How it works Mini-Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-civic-saffron/10 to-transparent border border-civic-saffron/20 group">
                <div className="flex items-center gap-3 mb-3">
                  <DynamicIcon name="Scale" className="w-5 h-5 text-civic-saffron" />
                  <h4 className="font-bold text-sm text-civic-saffron uppercase tracking-widest">Legal Framework</h4>
                </div>
                <p className="text-xs text-civic-gray-300 leading-relaxed group-hover:text-white transition-colors">
                  Our agent cross-references data with the <strong>Representation of the People Act (1951)</strong> 
                  and the <strong>Election Commission's</strong> latest guidelines to ensure 100% procedural accuracy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
