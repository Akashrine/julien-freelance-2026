"use client";

import { useEffect, useMemo, useState } from "react";
import { freePrompts, promptNavItems, type PromptItem } from "../../lib/pack-prompts";

function LockIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M7 10V8a5 5 0 0110 0v2m-9 0h8a2 2 0 012 2v7a2 2 0 01-2 2H8a2 2 0 01-2-2v-7a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CopyIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M9 9h9v11H9zM6 15H5a1 1 0 01-1-1V5a1 1 0 011-1h9a1 1 0 011 1v1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function trackEvent(name: string, payload: Record<string, string | number | boolean> = {}) {
  if (typeof window === "undefined") return;
  const dl = (window as any).dataLayer;
  if (Array.isArray(dl)) dl.push({ event: name, ...payload });
}

const phaseBreaks: Record<number, string> = {
  0: "Phase 1 — Extraction",
  2: "Phase 2 — Analyse & Décision",
  6: "Phase 3 — Exécution & Pilotage",
};

export default function PackDiscovery() {
  const [activePrompt, setActivePrompt] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [email, setEmail] = useState("");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [gatedPrompts, setGatedPrompts] = useState<PromptItem[]>([]);
  const [gatedError, setGatedError] = useState("");
  const [loadingGated, setLoadingGated] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    const unlocked = window.localStorage.getItem("pack_unlocked") === "true";
    setIsUnlocked(unlocked);
    if (unlocked) setActivePrompt((p) => (p < 3 ? 3 : p));
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = window.setInterval(() => setCooldown((p) => (p > 0 ? p - 1 : 0)), 1000);
    return () => window.clearInterval(t);
  }, [cooldown]);

  useEffect(() => {
    const fetch_ = async () => {
      if (!isUnlocked || gatedPrompts.length > 0 || loadingGated) return;
      setLoadingGated(true);
      try {
        const res = await fetch("/api/pack-prompts", { headers: { "x-pack-unlocked": "true" } });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || "Impossible de charger les prompts.");
        setGatedPrompts(data.prompts || []);
      } catch (err: any) {
        setGatedError(err?.message || "Erreur de chargement.");
      } finally {
        setLoadingGated(false);
      }
    };
    void fetch_();
  }, [isUnlocked, gatedPrompts.length, loadingGated]);

  const prompts = useMemo(() => [...freePrompts, ...gatedPrompts], [gatedPrompts]);
  const activeData = prompts[activePrompt];
  const activeNavItem = promptNavItems[activePrompt];
  const isLocked = !!activeNavItem?.gated && !isUnlocked;

  const unlockedCount = useMemo(() => promptNavItems.filter((p) => !p.gated || isUnlocked).length, [isUnlocked]);

  useEffect(() => {
    if (!isLocked) return;
    const t = window.setTimeout(() => {
      document.getElementById("unlock-section")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
    return () => window.clearTimeout(t);
  }, [activePrompt, isLocked]);

  const copyToClipboard = async (text: string, id: string) => {
    try { await navigator.clipboard.writeText(text); } catch { return; }
    setCopiedId(id);
    window.setTimeout(() => setCopiedId(null), 1500);
  };

  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const submitDisabled = submitStatus === "loading" || !emailIsValid || cooldown > 0;

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitDisabled) return;
    setSubmitStatus("loading");
    setErrorMessage("");
    trackEvent("pack_unlock_attempt", { source: "prompts-discovery" });
    try {
      const res = await fetch("/api/subscribe-pack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: "prompts-discovery" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Impossible de débloquer.");
      window.localStorage.setItem("pack_unlocked", "true");
      setIsUnlocked(true);
      setSubmitStatus("success");
      setShowConfirmation(true);
      setActivePrompt(3);
      trackEvent("pack_unlock_success", { source: "prompts-discovery" });
    } catch (err: any) {
      setSubmitStatus("error");
      setErrorMessage(err?.message || "Une erreur est survenue.");
      setCooldown(10);
      trackEvent("pack_unlock_error", { source: "prompts-discovery" });
    }
  };

  const progressPct = `${Math.round((unlockedCount / promptNavItems.length) * 100)}%`;

  return (
    <div className="max-w-[1150px] mx-auto px-8 py-12 flex flex-col lg:flex-row gap-12">

      {/* Sidebar */}
      <aside className="lg:w-64 shrink-0">
        <div className="lg:sticky lg:top-8 space-y-1">
          {/* Progression */}
          <div className="border border-gray-200 rounded-xl p-4 mb-6 bg-gray-50/50">
            <div className="flex items-center justify-between mb-2">
              <p className="font-mono text-[10px] tracking-[0.2em] text-dim">PROGRESSION</p>
              <p className="font-mono text-[10px] text-dim">{unlockedCount}/{promptNavItems.length}</p>
            </div>
            <div className="w-full h-0.5 rounded-full bg-gray-200 overflow-hidden">
              <div className="h-full rounded-full bg-gold transition-all duration-500" style={{ width: progressPct }} />
            </div>
          </div>

          {promptNavItems.map((prompt, index) => {
            const locked = prompt.gated && !isUnlocked;
            const isActive = index === activePrompt;
            const phaseLabel = phaseBreaks[index];
            return (
              <div key={prompt.id}>
                {phaseLabel && (
                  <p className="font-mono text-[10px] tracking-[0.2em] text-dim px-2 pt-5 pb-2">
                    {phaseLabel.toUpperCase()}
                  </p>
                )}
                <button
                  onClick={() => setActivePrompt(index)}
                  className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all text-sm ${
                    isActive
                      ? "bg-sand border-l-2 border-[#C5A070] text-gray-900"
                      : "border-l-2 border-transparent text-dim hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <span className={`w-5 h-5 rounded flex items-center justify-center font-mono text-[9px] font-bold shrink-0 ${isActive ? "bg-gold text-canvas" : "bg-gray-100 text-dim"}`}>
                    {prompt.id}
                  </span>
                  <span className="truncate flex-1">{prompt.title}</span>
                  {locked && <LockIcon className="w-3.5 h-3.5 text-dim" />}
                </button>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Contenu */}
      <div className="flex-1 min-w-0">
        {showConfirmation && (
          <div className="mb-8 border-l-2 border-[#C5A070] pl-5 py-2">
            <p className="text-sm text-gray-600">
              <span className="text-gold font-medium">Accès débloqué</span> — Les 7 séquences supplémentaires sont disponibles.
            </p>
          </div>
        )}

        {isLocked ? (
          <div id="unlock-section" className="max-w-xl mx-auto mt-8 md:mt-16">
            <div className="border border-gray-200 rounded-2xl p-8 md:p-10 text-center bg-gray-50/50">
              <div className="w-12 h-12 mx-auto rounded-full border border-clay flex items-center justify-center text-gold mb-6">
                <LockIcon className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-serif mb-2 text-gray-900">Débloquer les 7 prompts suivants</h3>
              <p className="text-dim text-sm font-light mb-8">Accès gratuit. Inscris-toi à la newsletter.</p>
              {submitStatus === "success" ? (
                <p className="text-gold font-medium">Accès débloqué. Les 10 prompts sont disponibles.</p>
              ) : (
                <form onSubmit={handleUnlock} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
                  <label htmlFor="pack-unlock-email" className="sr-only">Adresse email</label>
                  <input
                    id="pack-unlock-email"
                    type="email" required value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ton@email.com"
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder:text-dim focus:outline-none focus:ring-2 focus:ring-[#C5A070]/20 focus:border-[#C5A070] transition-all text-sm"
                  />
                  <button type="submit" disabled={submitDisabled} className="btn-cta font-mono text-[10px] tracking-widest disabled:opacity-50 whitespace-nowrap">
                    {submitStatus === "loading" ? "..." : cooldown > 0 ? `Réessayer (${cooldown}s)` : "Débloquer"}
                  </button>
                </form>
              )}
              {submitStatus === "error" && <p className="mt-3 text-sm text-red-500">{errorMessage}</p>}
              <p className="mt-4 text-xs text-dim">Pas de spam. Désinscription en 1 clic.</p>
            </div>
          </div>
        ) : loadingGated && activePrompt > 2 && !activeData ? (
          <div className="mt-16 text-center text-dim font-light">Chargement des séquences…</div>
        ) : gatedError && activePrompt > 2 && !activeData ? (
          <div className="mt-16 text-center text-red-500 text-sm">{gatedError}</div>
        ) : activeData ? (
          <div className="max-w-3xl">
            <p className="font-mono text-[10px] tracking-[0.3em] text-dim mb-3">{activeData.phase}</p>
            <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">{activeData.title}</h2>
            <p className="text-dim font-light leading-relaxed mb-10">{activeData.usage}</p>

            {/* Prompt */}
            <section className="border border-gray-200 rounded-2xl overflow-hidden mb-6">
              <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-sand/30">
                <span className="font-mono text-[10px] tracking-[0.2em] text-dim">PROMPT</span>
                <button
                  onClick={() => copyToClipboard(activeData.prompt, activeData.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-gray-300 text-dim hover:text-gray-900 hover:border-gray-400 transition-all"
                >
                  <CopyIcon />{copiedId === activeData.id ? "Copié !" : "Copier"}
                </button>
              </div>
              <div className="p-5 md:p-7 bg-sand/10">
                <pre className="font-mono text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{activeData.prompt}</pre>
              </div>
            </section>

            {/* Variables */}
            {activeData.variables.length > 0 && (
              <section className="border border-gray-200 rounded-2xl overflow-hidden mb-6">
                <div className="px-5 py-3.5 border-b border-gray-100 bg-sand/30">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-dim">VARIABLES À COMPLÉTER</span>
                </div>
                <div className="divide-y divide-gray-100">
                  {activeData.variables.map((v) => (
                    <div key={v.name} className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-sand text-gold font-mono text-xs font-semibold shrink-0">
                        {v.name}
                      </span>
                      <span className="text-sm text-dim font-light">{v.desc}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Pro tip */}
            <section className="border-l-2 border-[#C5A070] pl-5 py-1 mb-6">
              <p className="text-sm text-gray-600">
                <span className="text-gold font-medium">Pro tip </span>
                {activeData.tip}
              </p>
            </section>
          </div>
        ) : null}
      </div>
    </div>
  );
}
