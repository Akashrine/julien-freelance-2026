export type PRDInputs = {
  nomInitiative: string;
  probleme: string;
  contexteProduit: string;
  hypotheseSolution?: string;
  metriqueCible: string;
  contraintes?: string;
  okrConcerne?: string;
};

export function buildPRDPrompt(inputs: PRDInputs): string {
  const {
    nomInitiative,
    probleme,
    contexteProduit,
    hypotheseSolution,
    metriqueCible,
    contraintes,
    okrConcerne,
  } = inputs;

  return `Tu es un Product Manager senior avec 10 ans d'expérience en produit B2B et B2C. Tu rédiges des PRDs concis, orientés impact, qui tiennent sur une page.

CONTEXTE
Produit : ${contexteProduit}
Initiative : ${nomInitiative}
OKR concerné : ${okrConcerne?.trim() || "Non spécifié"}

CONSIGNE
Rédige un PRD structuré pour cette initiative en suivant exactement les 7 sections ci-dessous. Chaque section fait 2-3 phrases maximum. Le PRD complet doit tenir sur une page.

INPUTS UTILISATEUR
Problème identifié : ${probleme}
Hypothèse de solution : ${hypotheseSolution?.trim() || "À explorer — propose 2-3 directions possibles"}
Métrique cible : ${metriqueCible}
Contraintes connues : ${contraintes?.trim() || "Aucune contrainte spécifiée"}

STRUCTURE DU PRD

1. PROBLÈME
Reformule le problème de manière précise et factuelle. Intègre les données fournies. Si les données sont insuffisantes, indique explicitement quelles données manquent pour valider le problème.

2. OPPORTUNITÉ
Explique pourquoi résoudre ce problème maintenant. Quel impact business attendu ? Quel coût de l'inaction ? Connecte au contexte produit fourni.

3. HYPOTHÈSE DE SOLUTION
Si une hypothèse est fournie : reformule-la clairement et explique le raisonnement.
Si "à explorer" : propose 2-3 directions possibles avec les avantages et inconvénients de chacune.

4. NON-GOALS
Liste 3-5 choses que cette initiative ne couvre PAS. Sois spécifique au contexte. Chaque non-goal doit prévenir un malentendu plausible.

5. SUCCESS METRICS
Définis un leading indicator (mesurable dès le lancement) et un lagging indicator (mesurable à 4-8 semaines). Pour chaque métrique, propose un seuil de succès réaliste basé sur la métrique cible fournie.

6. PLAN D'EXPÉRIMENTATION
Propose une méthode de validation (A/B test, feature flag, rollout progressif). Définis les conditions de go/no-go. Inclus une timeline réaliste.

7. DÉPENDANCES ET RISQUES
Liste les dépendances (équipes, systèmes, données). Identifie 2-3 risques (technique, UX, business) avec une mitigation pour chacun. Intègre les contraintes fournies.

RÈGLES DE SORTIE
- Le PRD tient sur une page. Si une section dépasse 3 phrases, coupe.
- Ne génère pas de contenu générique. Chaque phrase doit être spécifique au contexte fourni.
- Si une information manque pour être précis, signale-le explicitement plutôt que d'inventer.
- Termine par une section "QUESTIONS OUVERTES" : 3 questions que le PM devrait résoudre avant de lancer le dev.`;
}

// Split point between preview and gated content
export const PROMPT_SPLIT_MARKER = "STRUCTURE DU PRD";
