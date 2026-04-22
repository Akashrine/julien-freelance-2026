"use client";

import { useState, useCallback, useEffect } from "react";
import { buildPRDPrompt, PROMPT_SPLIT_MARKER, type PRDInputs } from "../../lib/prd-prompt-template";

const UNLOCK_KEY = "prd_tool_unlocked";

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" aria-hidden="true">
      <path d="M9 9h9v11H9zM6 15H5a1 1 0 01-1-1V5a1 1 0 011-1h9a1 1 0 011 1v1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type FieldProps = {
  id: string;
  label: string;
  placeholder: string;
  helper?: string;
  required?: boolean;
  rows?: number;
  value: string;
  onChange: (v: string) => void;
};

function Field({ id, label, placeholder, helper, required, rows, value, onChange }: FieldProps) {
  const sharedClass =
    "w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#C5A070]/20 focus:border-[#C5A070] transition-all resize-none";

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-[#C5A070] ml-1">*</span>}
      </label>
      {rows ? (
        <textarea id={id} rows={rows} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className={sharedClass} />
      ) : (
        <input id={id} type="text" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className={sharedClass} />
      )}
      {helper && <p className="text-xs text-gray-400">{helper}</p>}
    </div>
  );
}

export default function PRDGenerator() {
  const [inputs, setInputs] = useState<PRDInputs>({
    nomInitiative: "", probleme: "", contexteProduit: "",
    hypotheseSolution: "", metriqueCible: "", contraintes: "", okrConcerne: "",
  });
  const [prompt, setPrompt] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [email, setEmail] = useState("");
  const [subStatus, setSubStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [subError, setSubError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") setUnlocked(localStorage.getItem(UNLOCK_KEY) === "1");
  }, []);

  const set = (key: keyof PRDInputs) => (v: string) => setInputs((prev) => ({ ...prev, [key]: v }));

  const requiredFilled = inputs.nomInitiative.trim() && inputs.probleme.trim() && inputs.contexteProduit.trim() && inputs.metriqueCible.trim();

  const pushEvent = (name: string) => {
    if (typeof window !== "undefined") {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({ event: name });
    }
  };

  const handleGenerate = () => {
    if (!requiredFilled) return;
    setPrompt(buildPRDPrompt(inputs));
    pushEvent("prd_tool_generate");
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubStatus("loading");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      const res = await fetch("/api/subscribe-pack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: "generateur-prd" }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Erreur."); }
      localStorage.setItem(UNLOCK_KEY, "1");
      setUnlocked(true);
      setSubStatus("success");
      pushEvent("prd_tool_email");
    } catch (err: any) {
      clearTimeout(timeout);
      setSubStatus("error");
      setSubError(err.name === "AbortError" ? "La requête a expiré. Réessaie." : err.message || "Impossible de s'inscrire.");
    }
  };

  const handleCopy = useCallback(() => {
    if (!prompt) return;
    navigator.clipboard?.writeText(prompt).catch(() => {
      const el = document.createElement("textarea");
      el.value = prompt; el.style.position = "fixed"; el.style.opacity = "0";
      document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el);
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    pushEvent("prd_tool_copy");
  }, [prompt]);

  const splitIdx = prompt?.indexOf(PROMPT_SPLIT_MARKER) ?? -1;
  const previewPart = splitIdx > -1 ? prompt!.slice(0, splitIdx).trimEnd() : prompt ?? "";
  const gatedPart = splitIdx > -1 ? prompt!.slice(splitIdx) : "";

  return (
    <div className="space-y-8">
      {/* Formulaire */}
      <div className="border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-6 bg-white/50">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Field id="nom-initiative" label="Nom de l'initiative" placeholder="Ex: Refonte onboarding mobile" required value={inputs.nomInitiative} onChange={set("nomInitiative")} />
          <Field id="contexte-produit" label="Contexte produit" placeholder="Ex: App mobile B2C, 50k MAU" helper="Type de produit, taille de la base, modèle de croissance." required value={inputs.contexteProduit} onChange={set("contexteProduit")} />
        </div>
        <Field id="probleme" label="Quel problème utilisateur tu résous ?" placeholder="Ex: 62% des nouveaux utilisateurs abandonnent le onboarding avant l'étape 3" helper="Sois précis. Ajoute des données si tu en as." required rows={3} value={inputs.probleme} onChange={set("probleme")} />
        <Field id="hypothese-solution" label="Quelle solution tu envisages ?" placeholder="Ex: Réduire le onboarding de 5 étapes à 2" helper="La direction, pas le détail. Si tu ne sais pas encore, écris 'à explorer'." rows={3} value={inputs.hypotheseSolution ?? ""} onChange={set("hypotheseSolution")} />
        <Field id="metrique-cible" label="Quelle métrique tu veux bouger ?" placeholder="Ex: Taux de complétion onboarding, activation J+7" helper="Le KPI principal que cette initiative doit impacter." required value={inputs.metriqueCible} onChange={set("metriqueCible")} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Field id="contraintes" label="Contraintes connues" placeholder="Ex: Pas de refonte backend, deadline fin Q2" helper="Laisse vide si aucune." rows={2} value={inputs.contraintes ?? ""} onChange={set("contraintes")} />
          <Field id="okr-concerne" label="OKR ou objectif trimestriel" placeholder="Ex: O: Améliorer l'activation / KR: +15pts" helper="Laisse vide si tu n'as pas d'OKRs formalisés." rows={2} value={inputs.okrConcerne ?? ""} onChange={set("okrConcerne")} />
        </div>
        <div className="pt-2">
          <button onClick={handleGenerate} disabled={!requiredFilled} className="btn-cta font-mono text-[10px] tracking-widest disabled:opacity-40 disabled:cursor-not-allowed">
            Générer le prompt
          </button>
          <p className="mt-3 text-xs text-gray-400">Champs marqués * obligatoires</p>
        </div>
      </div>

      {/* Résultat */}
      {prompt && (
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-2xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-[#F2E9E1]/30">
              <span className="font-mono text-[10px] tracking-[0.2em] text-gray-400">TON PROMPT</span>
              {unlocked && (
                <button onClick={handleCopy} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-gray-300 text-gray-500 hover:text-gray-900 hover:border-gray-400 transition-all">
                  <CopyIcon />{copied ? "Copié !" : "Copier"}
                </button>
              )}
            </div>

            <div className="p-5 bg-[#F2E9E1]/20">
              <pre className="font-mono text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{previewPart}</pre>
            </div>

            {gatedPart && (
              <div className="relative">
                {unlocked ? (
                  <div className="px-5 pb-5 bg-[#F2E9E1]/20">
                    <pre className="font-mono text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{gatedPart}</pre>
                  </div>
                ) : (
                  <>
                    <div className="px-5 pb-5 select-none pointer-events-none blur-sm opacity-40 max-h-48 overflow-hidden bg-[#F2E9E1]/20">
                      <pre className="font-mono text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{gatedPart}</pre>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-linear-to-t from-white via-white/95 to-transparent">
                      <div className="w-full max-w-sm px-6 py-6 text-center">
                        <p className="text-sm font-medium text-gray-900 mb-1">Le prompt est calibré avec tes données.</p>
                        <p className="text-xs text-gray-500 mb-5">Entre ton email pour voir la structure complète.</p>
                        {subStatus === "success" ? (
                          <p className="text-[#C5A070] text-sm font-medium">C'est noté. Prompt débloqué.</p>
                        ) : (
                          <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                            <input type="email" placeholder="ton@email.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={subStatus === "loading"} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A070]/20 focus:border-[#C5A070] transition-all" />
                            <button type="submit" disabled={subStatus === "loading"} className="btn-cta font-mono text-[10px] tracking-widest disabled:opacity-50">
                              {subStatus === "loading" ? "..." : "Voir le prompt complet"}
                            </button>
                            {subStatus === "error" && <p className="text-red-500 text-xs">{subError}</p>}
                          </form>
                        )}
                        <p className="mt-3 text-[10px] text-gray-400">Pas de spam. Désinscription en 1 clic.</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {unlocked && (
            <div className="border-l-2 border-[#C5A070] pl-5 py-1">
              <p className="text-xs font-mono tracking-[0.15em] text-[#C5A070] mb-2">COMMENT L'UTILISER</p>
              <ol className="text-sm text-gray-500 space-y-1.5 list-decimal list-inside font-light">
                <li>Copie le prompt ci-dessus</li>
                <li>Colle-le dans Claude, ChatGPT ou tout autre LLM</li>
                <li>Récupère ton PRD structuré en 7 sections, prêt à partager</li>
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
