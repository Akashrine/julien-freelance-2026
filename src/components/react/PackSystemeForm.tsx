"use client";

import { useState } from "react";

export default function PackSystemeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailIsValid || status === "loading") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe-pack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: "pack-systeme-interest" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Impossible de s'inscrire.");
      setStatus("success");
    } catch (error: any) {
      setStatus("error");
      setErrorMessage(error?.message || "Une erreur est survenue.");
    }
  };

  if (status === "success") {
    return (
      <div className="border-l-2 border-[#C5A070] pl-5 py-2 text-left">
        <p className="text-[#C5A070] font-medium text-sm mb-1">
          Tu seras prévenu(e) dès le lancement.
        </p>
        <p className="text-xs text-gray-500 font-light">
          En attendant,{" "}
          <a href="/ressources/prompts-discovery" className="underline underline-offset-2 hover:text-gray-900 transition-colors">
            explore les 10 prompts gratuits
          </a>
        </p>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <label htmlFor="pack-systeme-email" className="sr-only">Adresse email</label>
        <input
          id="pack-systeme-email"
          type="email" required value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ton@email.com"
          className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C5A070]/20 focus:border-[#C5A070] transition-all text-sm"
        />
        <button
          type="submit"
          disabled={!emailIsValid || status === "loading"}
          className="btn-cta font-mono text-[10px] tracking-widest disabled:opacity-50 whitespace-nowrap"
        >
          {status === "loading" ? "..." : "Être prévenu"}
        </button>
      </form>
      {status === "error" && <p className="mt-3 text-sm text-red-500">{errorMessage}</p>}
    </div>
  );
}
