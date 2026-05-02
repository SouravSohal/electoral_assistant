"use client";

import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { DynamicIcon } from "@/components/shared/DynamicIcon";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

export default function VerifyPage() {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync disabled state after mount to avoid hydration mismatch
  useEffect(() => {
    if (mounted) {
      setButtonDisabled(isLoading || inputText.length < 10);
    }
  }, [mounted, isLoading, inputText]);

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
    <div className="flex flex-col h-screen bg-civic-navy text-civic-white overflow-hidden">
      <Navbar />

      <main className="flex-grow pt-24 pb-6 px-4 md:px-8 overflow-hidden">
        <div className="container-max h-full flex flex-col">
          {/* Header - Compact */}
          <div className="mb-8 relative flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-display font-black tracking-tighter flex items-center gap-3">
                <span className="p-2 rounded-xl bg-civic-blue/20 border border-civic-blue/30">
                  <DynamicIcon name="ShieldCheck" className="w-8 h-8 text-civic-blue" />
                </span>
                AI <span className="gradient-text">Fact-Checker</span>
              </h1>
              <p className="text-sm text-civic-gray-300 mt-1 max-w-xl">
                Verifying electoral claims against ECI guidelines and the Representation of the People Act.
              </p>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest font-bold text-civic-gray-500">
                Agentic Status: <span className="text-emerald-400">Online</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow overflow-hidden min-h-0">
            {/* Input Form Area - Scrollable if content too long */}
            <div className="lg:col-span-5 flex flex-col h-full overflow-hidden">
              <div className="glass-card p-6 md:p-8 border-white/5 overflow-y-auto custom-scrollbar">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-civic-blue/5 to-transparent -z-10" />

                <form onSubmit={handleVerify} className="space-y-10 h-full flex flex-col">
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-3">
                      <label
                        htmlFor="misinfo-input"
                        className="text-xs font-bold uppercase tracking-widest text-civic-gray-500"
                      >
                        Suspected Claim
                      </label>
                      <span className="text-[10px] px-2 py-1 rounded bg-white/5 text-white/40 uppercase tracking-tighter">
                        Min 10 chars
                      </span>
                    </div>
                    <textarea
                      id="misinfo-input"
                      className="input-base min-h-[270px] lg:min-h-[370px] h-full resize-none text-lg leading-relaxed placeholder:text-white/20 focus:border-civic-blue/50"
                      placeholder="Paste the message here... e.g. 'ECI has changed the voting age to 21 for 2026'"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      disabled={isLoading}
                    />
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
                    suppressHydrationWarning
                    className="btn-gold w-full flex items-center justify-center gap-3 py-5 text-lg shadow-[0_8px_30px_hsla(43,92%,58%,0.15)] hover:shadow-[0_12px_40px_hsla(43,92%,58%,0.25)] transition-all active:scale-[0.98] shrink-0"
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

              {/* How it works - Compact Footer for column */}
              <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-civic-saffron/10 to-transparent border border-civic-saffron/20">
                <div className="flex items-center gap-3 mb-1">
                  <DynamicIcon name="Scale" className="w-4 h-4 text-civic-saffron" />
                  <h4 className="font-bold text-[10px] text-civic-saffron uppercase tracking-widest">Legal Engine</h4>
                </div>
                <p className="text-[10px] text-civic-gray-300 leading-tight">
                  Cross-referenced with <strong>RP Act (1951)</strong> and ECI guidelines.
                </p>
              </div>
            </div>

            {/* Results Area - Independent Scroll */}
            <div className="lg:col-span-7 flex flex-col h-full overflow-hidden">
              <div className="glass-card flex-grow overflow-hidden flex flex-col border-civic-blue/20 bg-civic-blue/[0.01]">
                {(result || isLoading) ? (
                  <>
                    <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center",
                          isLoading ? "bg-civic-gold/20 animate-pulse" : "bg-civic-blue/20"
                        )}>
                          <DynamicIcon
                            name={isLoading ? "Loader2" : "FileCheck2"}
                            className={cn("w-5 h-5", isLoading ? "animate-spin text-civic-gold" : "text-civic-blue")}
                          />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold leading-none mb-1">AI Intelligence Report</h2>
                          <p className="text-[10px] text-civic-gray-500 uppercase tracking-widest">
                            {isLoading ? "Synthesizing research..." : "Final Verdict Issued"}
                          </p>
                        </div>
                      </div>

                      {verdict && !isLoading && (
                        <div className={cn(
                          "px-4 py-2 rounded-full border flex items-center gap-2",
                          verdict === "TRUE" || verdict === "VERIFIED"
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                            : verdict === "FALSE" || verdict === "DEBUNKED"
                              ? "bg-red-500/10 border-red-500/20 text-red-400"
                              : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                        )}>
                          <DynamicIcon
                            name={verdict === "TRUE" || verdict === "VERIFIED" ? "CheckCircle2" : "AlertTriangle"}
                            className="w-4 h-4"
                          />
                          <span className="font-black text-xs uppercase tracking-wider">
                            {verdict}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
                      <div className="prose prose-invert prose-civic max-w-none text-[16px] leading-relaxed">
                        {!result && isLoading && (
                          <div className="space-y-6">
                            <div className="h-4 bg-white/5 rounded-full w-3/4 animate-pulse" />
                            <div className="h-4 bg-white/5 rounded-full w-full animate-pulse" />
                            <div className="h-32 bg-white/5 rounded-2xl w-full animate-pulse" />
                            <div className="h-4 bg-white/5 rounded-full w-1/2 animate-pulse" />
                            <div className="h-4 bg-white/5 rounded-full w-2/3 animate-pulse" />
                          </div>
                        )}
                        <ReactMarkdown>{result}</ReactMarkdown>
                      </div>
                      <div ref={resultRef} />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-center justify-center h-full p-12">
                    <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 relative">
                      <div className="absolute inset-0 rounded-full bg-civic-blue/5 animate-pulse-glow" />
                      <DynamicIcon name="MessageSquareText" className="w-10 h-10 text-white/20" />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-white/40 mb-3 tracking-tight">System Ready</h3>
                    <p className="text-sm text-white/30 max-w-[300px] leading-relaxed">
                      Enter a claim on the left. The Multi-Agent system will perform research, legal analysis, and issue a verdict.
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
