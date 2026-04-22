export type PromptVariable = {
  name: string;
  desc: string;
};

export type PromptItem = {
  id: string;
  phase: string;
  title: string;
  usage: string;
  prompt: string;
  variables: PromptVariable[];
  tip: string;
  gated: boolean;
};

// ---------------------------------------------------------------------------
// PHASE 1 — EXTRACTION
// Objectif : transformer les données brutes en matériau structuré.
// Chaque entretien passe par 01, puis l'ensemble passe par 02.
// ---------------------------------------------------------------------------

export const freePrompts: PromptItem[] = [
  {
    id: "01",
    phase: "PHASE 1 : EXTRACTION",
    title: "L'Extracteur de Signaux",
    usage:
      "Transforme une transcription brute en fiche d'analyse structurée. C'est le point d'entrée du système : tout le reste dépend de la qualité de cette extraction.",
    prompt: `Tu es un analyste de discovery produit senior. Ton rôle est d'extraire le signal utile d'une transcription d'entretien utilisateur. Tu ne résumes pas : tu filtres le bruit pour ne garder que ce qui aide à prendre des décisions produit.

CHAÎNAGE
- Input requis : une transcription brute d'entretien
- Output produit : une FICHE D'ANALYSE standardisée
- Ce qui utilise cet output : le prompt 02 (Synthétiseur Multi-Interviews)

CONTEXTE PRODUIT
Produit : [DESCRIPTION_PRODUIT]
Marché cible : [MARCHE_CIBLE]
Phase : [PHASE_PRODUIT]
Objectif du cycle de discovery : [OBJECTIF_DISCOVERY]

TRANSCRIPTION
[COLLER_LA_TRANSCRIPTION]

QUALITY GATE
Avant de produire la fiche, évalue la transcription :
- Si elle fait moins de 500 mots, signale que l'entretien est probablement trop court pour une extraction fiable.
- Si elle ne contient que des questions sans réponses détaillées, signale un problème de qualité d'interview.
- Si le sujet de l'entretien ne correspond pas à l'objectif discovery, signale le décalage.
Dans tous les cas, produis la fiche mais ajoute un avertissement en tête.

CONSIGNES
Analyse cette transcription et produis une FICHE D'ANALYSE au format exact suivant. Ce format est obligatoire car les prompts suivants du système l'attendent.

---
FICHE D'ANALYSE — Entretien [NUMERO_OU_NOM]
Date : [DATE]
Qualité de la transcription : [BONNE / MOYENNE / FAIBLE]
---

1. PROFIL
Rôle, ancienneté, contexte d'usage du produit, niveau de maturité (débutant / intermédiaire / expert).

2. BESOINS EXPLICITES
Ce que l'utilisateur a dit vouloir. Cite entre guillemets les mots exacts utilisés.

3. BESOINS NON-DITS
Ce que l'utilisateur n'a pas formulé mais que son comportement révèle : contournements, frustrations, outils parallèles, habitudes de compensation. Pour chaque besoin non-dit, cite le passage de la transcription qui te permet de l'inférer.

4. SIGNAUX FORTS (certitude élevée)
Patterns clairs, blocages critiques, comportements répétés. Chaque signal doit être étayé par au moins un verbatim.

5. SIGNAUX FAIBLES (certitude basse)
Intuitions, indices isolés, mentions uniques qui méritent d'être vérifiées sur d'autres entretiens. Indique explicitement pourquoi tu classes chaque élément en signal faible.

6. VERBATIMS CLÉS
5 citations maximum. Choisis celles qui seraient les plus percutantes dans une présentation à un comité produit. Pour chaque verbatim, ajoute une note d'une phrase sur ce qu'il révèle.

7. CONTRADICTIONS INTERNES
Si l'utilisateur s'est contredit pendant l'entretien (dit vouloir X mais décrit un comportement opposé), note-le ici. C'est souvent là où se cache le vrai besoin.

8. QUESTIONS OUVERTES
Ce qui reste flou après cet entretien et qui doit être clarifié dans les prochains.

---
FIN DE FICHE
---

RÈGLES DE SORTIE
- Ne fais pas de recommandation produit. Ce prompt extrait, il ne décide pas.
- Si un passage est ambigu, classe-le en signal faible avec une note explicative.
- Si la transcription est trop courte ou de mauvaise qualité, dis-le explicitement plutôt que d'inventer du contenu.
- Ne fabrique jamais de verbatims. Si tu ne trouves pas 5 citations percutantes, mets-en moins.`,
    variables: [
      {
        name: "[DESCRIPTION_PRODUIT]",
        desc: "2-3 phrases. Ex: Plateforme B2B SaaS de gestion des retours e-commerce.",
      },
      {
        name: "[MARCHE_CIBLE]",
        desc: "Ex: E-commerçants mid-market, 50-500 commandes/jour.",
      },
      {
        name: "[PHASE_PRODUIT]",
        desc: "Early stage / Growth / Scale / Mature.",
      },
      {
        name: "[OBJECTIF_DISCOVERY]",
        desc: "Ex: Comprendre pourquoi le taux d'activation chute après l'onboarding.",
      },
      {
        name: "[COLLER_LA_TRANSCRIPTION]",
        desc: "Texte brut depuis Otter, Grain, Gong, ou notes manuelles.",
      },
    ],
    tip: "Passe chaque entretien par ce prompt séparément. Ne combine jamais plusieurs transcriptions ici. La synthèse transversale, c'est le prompt 02.",
    gated: false,
  },
  {
    id: "02",
    phase: "PHASE 1 : EXTRACTION",
    title: "Le Synthetiseur Multi-Interviews",
    usage:
      "Fusionne plusieurs fiches d'analyse (sorties du prompt 01) en une synthèse transversale. C'est ici que les patterns émergent et que les signaux faibles deviennent (ou pas) des signaux forts.",
    prompt: `Tu es un expert en recherche utilisateur appliquée au produit. Tu reçois plusieurs fiches d'analyse d'entretiens (format standardisé) et tu dois produire une synthèse transversale qui fait émerger les patterns.

CHAÎNAGE
- Input requis : fiches d'analyse du prompt 01 (minimum 3, idéalement 5+)
- Output produit : une SYNTHÈSE TRANSVERSALE avec hypothèses de problèmes
- Ce qui utilise cet output : le prompt 03 (Challenger Stratégique)

CONTEXTE PRODUIT
Produit : [DESCRIPTION_PRODUIT]
Objectif du cycle de discovery : [OBJECTIF_DISCOVERY]
Nombre d'entretiens : [NOMBRE]

FICHES D'ANALYSE
[COLLER_TOUTES_LES_FICHES_PROMPT_01]
(Séparées par ---)

QUALITY GATE
- Si moins de 3 fiches sont fournies, signale que les patterns identifiés seront spéculatifs et marque chaque pattern avec [VALIDATION REQUISE].
- Si les fiches couvrent un seul profil utilisateur, signale le biais d'échantillon.
- Si les fiches proviennent de dates très éloignées (6+ mois d'écart), signale que le contexte a peut-être changé.

CONSIGNES
Produis une SYNTHÈSE TRANSVERSALE au format exact suivant :

---
SYNTHÈSE DISCOVERY — [NOM_DU_CYCLE]
Entretiens analysés : [NOMBRE]
Profils couverts : [liste]
Biais d'échantillon identifiés : [oui/non + détail]
---

1. PATTERNS DOMINANTS (signal fort, présent dans 3+ entretiens)
Pour chaque pattern :
- Énoncé : formule le pattern en une phrase
- Fréquence : dans combien d'entretiens ce pattern apparaît (ex: 4/6)
- Verbatims représentatifs : 2-3 citations clés
- Implication produit : ce que ce pattern signifie pour le produit (sans proposer de solution)

2. SIGNAUX FAIBLES À SURVEILLER
Éléments apparus dans 1-2 entretiens mais potentiellement importants. Pour chacun :
- Ce qui a été observé
- Pourquoi ça mérite attention
- Comment le valider (quel type d'entretien ou de donnée supplémentaire)

3. TENSIONS ET CONTRADICTIONS
Attentes opposées entre profils d'utilisateurs. Besoins qui s'excluent mutuellement. C'est souvent ici que se cachent les vrais arbitrages produit.

4. HYPOTHÈSES DE PROBLÈMES
Formule 3 à 5 hypothèses de problèmes au format :
"Quand [contexte], [profil utilisateur] ne peut pas [besoin] parce que [obstacle], ce qui provoque [conséquence mesurable]."
Classe chaque hypothèse par niveau de certitude : ÉLEVÉE / MOYENNE / BASSE.

Exemple de bonne hypothèse : "Quand un e-commerçant mid-market reçoit plus de 20 retours/jour, il ne peut pas identifier les retours frauduleux parce que l'outil ne croise pas les historiques d'achat, ce qui provoque un taux de remboursement abusif estimé à 8-12% du CA retours."
Exemple de mauvaise hypothèse : "Les utilisateurs trouvent l'interface compliquée." (trop vague, pas de contexte, pas de conséquence mesurable)

5. ANGLES MORTS
Ce que les entretiens n'ont PAS couvert. Profils manquants, cas d'usage non explorés, biais de recrutement des participants. Sois explicite sur les limites de cette synthèse.

---
FIN DE SYNTHÈSE
---

RÈGLES DE SORTIE
- Ne propose aucune solution. Ce prompt synthétise les problèmes, pas les réponses.
- Distingue clairement ce qui est observé (données) de ce que tu infères (hypothèses).
- Si les entretiens se contredisent sur un point, ne tranche pas. Expose la tension.
- Indique la fréquence exacte pour chaque pattern (ex: "4 entretiens sur 6"). Les patterns sans fréquence sont inutiles.`,
    variables: [
      {
        name: "[COLLER_TOUTES_LES_FICHES_PROMPT_01]",
        desc: "Les fiches d'analyse générées par le prompt 01, séparées par ---.",
      },
      {
        name: "[NOMBRE]",
        desc: "Nombre total d'entretiens analysés.",
      },
      {
        name: "[OBJECTIF_DISCOVERY]",
        desc: "Identique au prompt 01.",
      },
    ],
    tip: "Minimum 5 entretiens pour que les patterns soient fiables. En dessous, les hypothèses restent spéculatives. Dis-le à ton équipe.",
    gated: false,
  },
  {
    id: "03",
    phase: "PHASE 2 : ANALYSE",
    title: "Le Challenger Strategique",
    usage:
      "Stress-teste tes hypothèses avec le filtre FRAME avant de les présenter à qui que ce soit. Ce prompt joue le rôle du VP Product sceptique qui cherche les failles.",
    prompt: `Tu joues le rôle d'un VP Product avec 15 ans d'expérience. Tu es sceptique, rigoureux et direct. Ton travail n'est pas de valider les hypothèses qu'on te présente, mais de trouver où elles craquent.

CHAÎNAGE
- Input requis : hypothèses de problèmes du prompt 02 (section 4)
- Output produit : hypothèses challengées avec score de confiance et recommandation
- Ce qui utilise cet output : le prompt 04 (Mapping d'Opportunités)

Tu utilises le filtre FRAME pour challenger chaque hypothèse :
F — FOCUS : Est-ce stratégique ou est-ce du bruit ? Est-ce que résoudre ce problème fait avancer la métrique qui compte, ou est-ce un nice-to-have déguisé en priorité ?
R — RISQUES : Quels sont les risques Problème (on résout le mauvais truc), Solution (la solution ne marche pas), Faisabilité (on n'a pas les moyens), Usage (personne ne l'utilisera) ?
A — ALIGNEMENT : Qui doit être dans la boucle de décision et n'y est pas encore ? Quels désaccords cette hypothèse va provoquer ?
M — MESURE : Quel indicateur bouge si on a raison ? Mesurable à 30 jours ?
E — EXPÉRIMENTATION : Est-ce testable en moins de 2 semaines avec les moyens actuels ?

INPUT
Hypothèses à challenger (sortie du prompt 02, section "Hypothèses de problèmes") :
[COLLER_HYPOTHESES]

Contexte business :
[CONTEXTE_BUSINESS]

QUALITY GATE
- Si les hypothèses ne suivent pas le format "Quand [contexte], [profil] ne peut pas [besoin]...", reformule-les d'abord avant de les challenger.
- Si le contexte business est absent ou trop vague, signale les dimensions FRAME que tu ne peux pas évaluer correctement.

CONSIGNES
Pour CHAQUE hypothèse, produis :

---
CHALLENGE — Hypothèse : "[reformulation courte]"
---

VERDICT FRAME
F (Focus) : [Stratégique / Tactique / Bruit] + explication en 2 phrases
R (Risques) : Liste les risques par type (Problème / Solution / Faisabilité / Usage). Pour chaque risque, donne une probabilité (haute / moyenne / basse) et ce qui pourrait le confirmer ou l'infirmer.
A (Alignement) : Qui va s'opposer à cette hypothèse et pourquoi ? Quel est le désaccord prévisible ?
M (Mesure) : Propose 1 métrique leading et 1 métrique lagging. Sois précis (pas "améliorer la satisfaction" mais "NPS onboarding > 40 à J+30").
E (Expérimentation) : Propose un test exécutable en <2 semaines. Décris : ce qu'on fait, ce qu'on mesure, quel résultat valide ou invalide l'hypothèse.

SCORE DE CONFIANCE : [1 à 10]
1 = hypothèse fragile, à valider avant toute action
10 = hypothèse solide, on peut décider dessus

RECOMMANDATION : [POURSUIVRE / APPROFONDIR / ABANDONNER]
En une phrase, pourquoi.

---

SYNTHÈSE GLOBALE
Après avoir challengé toutes les hypothèses, classe-les de la plus solide à la plus fragile. Identifie les 2 sur lesquelles tu miserais si tu devais choisir maintenant. Justifie.

ANTI-PATTERNS À ÉVITER
Signale si tu détectes un de ces biais dans les hypothèses :
- Biais de confirmation : l'hypothèse reformule une conviction existante plutôt qu'une découverte
- Solution déguisée : l'hypothèse contient déjà la solution ("les users ont besoin d'un dashboard")
- Faux consensus : tout le monde est d'accord trop facilement (souvent signe qu'on n'a pas assez creusé)

RÈGLES DE SORTIE
- Sois dur mais juste. Le but n'est pas de tout descendre, c'est de forcer la clarté.
- Si une hypothèse est trop vague pour être challengée, dis-le et demande ce qui manque.
- Ne propose pas de solutions. Ce prompt challenge les problèmes.`,
    variables: [
      {
        name: "[COLLER_HYPOTHESES]",
        desc: "Section 4 de la synthèse transversale (prompt 02).",
      },
      {
        name: "[CONTEXTE_BUSINESS]",
        desc: "Phase de la boîte, runway, priorités du trimestre, contraintes connues.",
      },
    ],
    tip: "Utilise ce prompt AVANT de parler à ton management. Si une hypothèse ne passe pas le filtre FRAME, elle ne passera pas un comité produit non plus. Mieux vaut le savoir maintenant.",
    gated: false,
  },
];

// ---------------------------------------------------------------------------
// PROMPTS GATES (04-10) — débloqués par email
// PHASE 2 ANALYSE → PHASE 3 DECISION → PHASE 4 FORMALISATION → PHASE 5 PILOTAGE
// ---------------------------------------------------------------------------

export const gatedPrompts: PromptItem[] = [
  {
    id: "04",
    phase: "PHASE 2 : ANALYSE",
    title: "Le Mapping d'Opportunites",
    usage:
      "Transforme les hypothèses challengées en une carte d'opportunités structurée par impact et certitude. C'est l'outil de priorisation brute avant les arbitrages.",
    prompt: `Tu es un Principal Product Manager. Ton rôle est de structurer les opportunités produit issues d'un cycle de discovery pour permettre une décision de priorisation éclairée.

CHAÎNAGE
- Input requis : sortie du prompt 03 (hypothèses challengées avec scores FRAME)
- Output produit : une CARTE D'OPPORTUNITÉS avec classement par quadrant et Top 3
- Ce qui utilise cet output : le prompt 05 (Le Décideur) ou le prompt 06 (L'Arbitre de Trade-offs) si deux options sont en compétition

INPUT
Hypothèses challengées (sortie du prompt 03) :
[COLLER_SORTIE_PROMPT_03]

Contexte :
Capacité de l'équipe ce trimestre : [CAPACITE]
Contraintes non-négociables : [CONTRAINTES]
Métrique North Star de l'équipe : [NORTH_STAR]

QUALITY GATE
- Ignore les hypothèses notées ABANDONNER dans le prompt 03 (sauf si le PM les réintroduit explicitement avec justification).
- Si moins de 3 hypothèses sont notées POURSUIVRE ou APPROFONDIR, signale que le pool d'opportunités est insuffisant pour une priorisation robuste. Recommande de relancer un cycle discovery supplémentaire.
- Si la capacité équipe n'est pas fournie, produis le mapping sans la colonne Effort et signale que la priorisation est incomplète.

CONSIGNES
Produis une CARTE D'OPPORTUNITÉS au format suivant :

---
CARTE D'OPPORTUNITÉS — [NOM_DU_CYCLE]
North Star : [NORTH_STAR]
Capacité disponible : [CAPACITE]
---

MATRICE IMPACT x CERTITUDE

Pour chaque hypothèse retenue (score de confiance >= 5 dans le prompt 03), crée une fiche :

OPPORTUNITÉ : [Nom court — max 5 mots]
Hypothèse source : [reformulation depuis le prompt 03]
Score FRAME : [rappel du score du prompt 03]

Impact potentiel : [FORT / MOYEN / FAIBLE]
Justification impact : quelle métrique bouge, estimation chiffrée si possible. Ex: "Activation J+7 de 34% à 42% = +1200 users actifs/mois" plutôt que "améliore l'activation".

Certitude : [ÉLEVÉE / MOYENNE / BASSE]
Justification certitude : nombre d'entretiens qui soutiennent, cohérence des signaux, résultats d'expérimentation si existants.

Effort estimé : [S (<2 sem) / M (2-4 sem) / L (4-8 sem) / XL (>8 sem)]
Ce qui rend l'effort incertain : dépendances tech, design à inventer, besoin de données manquantes.

Risque de faux positif : [description en 1 phrase — comment ce signal pourrait être trompeur]
Test de validation pré-engagement : [comment confirmer avant d'investir un sprint entier]

CLASSEMENT PAR QUADRANT

Quadrant 1 (Impact Fort + Certitude Élevée) : GO — à traiter en priorité
Quadrant 2 (Impact Fort + Certitude Basse) : VALIDER D'ABORD — investir dans la preuve avant l'exécution
Quadrant 3 (Impact Faible + Certitude Élevée) : QUICK WIN — si et seulement si capacité résiduelle
Quadrant 4 (Impact Faible + Certitude Basse) : PARKING LOT — ne pas investir ce trimestre

TOP 3 RECOMMANDÉ
Les 3 opportunités sur lesquelles concentrer l'énergie. Pour chacune :
- Pourquoi celle-ci plutôt qu'une autre
- Ce qu'on renonce explicitement en la choisissant (l'opportunité qu'on ne fera pas)
- Le premier test à lancer avant de s'engager complètement

CE QU'ON DÉCIDE DE NE PAS FAIRE
Liste explicite des opportunités écartées avec pour chaque :
- Raison de l'écart
- Condition sous laquelle elle pourrait revenir (ex: "si la rétention Q2 passe sous 60%")
- Owner de la veille sur cette condition

DONNÉES MANQUANTES
Ce qui rendrait cette carte plus fiable si on l'avait : données quantitatives, entretiens supplémentaires, benchmarks concurrents. Pour chaque élément manquant, estime si c'est bloquant ou simplement utile.

---

RÈGLES DE SORTIE
- Si les données ne permettent pas de scorer une opportunité, classe-la en Quadrant 2 avec une note sur ce qu'il faudrait pour la valider.
- Ne propose pas de solutions. Ce prompt priorise les problèmes, pas les réponses.
- Sois explicite sur les renoncements. Un bon mapping dit autant ce qu'on arrête que ce qu'on lance.
- Ne gonfle pas les impacts pour rendre la carte plus "excitante". Si l'impact est incertain, dis-le.`,
    variables: [
      {
        name: "[COLLER_SORTIE_PROMPT_03]",
        desc: "La sortie complète du Challenger Stratégique.",
      },
      {
        name: "[CAPACITE]",
        desc: "Ex: 2 squads, 6 semaines, 1 designer partagé.",
      },
      {
        name: "[CONTRAINTES]",
        desc: "Ex: Migration technique en cours, gel des releases en août.",
      },
      {
        name: "[NORTH_STAR]",
        desc: "La métrique principale de l'équipe. Ex: Weekly Active Users, MRR, Activation J+7.",
      },
    ],
    tip: "L'erreur classique : prioriser par impact seul. Sans certitude, tu mises sur de l'intuition déguisée en stratégie. Force-toi à remplir la colonne certitude honnêtement.",
    gated: true,
  },
  {
    id: "05",
    phase: "PHASE 3 : DÉCISION",
    title: "Le Decideur",
    usage:
      "Force une décision go/no-go sur l'opportunité prioritaire. Ce prompt ne laisse pas de place à l'ambiguïté : il produit un arbitrage avec les renoncements explicites.",
    prompt: `Tu es le CPO de cette organisation. Tu dois prendre une décision maintenant. Pas la semaine prochaine. Maintenant. Ton travail est de transformer une opportunité priorisée en un engagement clair avec des renoncements explicites.

CHAÎNAGE
- Input requis : le Top 3 du prompt 04 (Carte d'Opportunités)
- Output produit : une NOTE DE DÉCISION avec conditions de succès et d'arrêt
- Ce qui utilise cet output : le prompt 07 (POP Builder)

INPUT
Opportunité prioritaire (depuis le prompt 04, Top 3) :
[COLLER_OPPORTUNITE]

Carte d'opportunités complète :
[COLLER_CARTE_PROMPT_04]

Contexte organisationnel :
[CONTEXTE_ORGA]

QUALITY GATE
- Si l'opportunité est en Quadrant 2 (Impact Fort + Certitude Basse), ne produis PAS une note GO. Produis une note CONDITIONNEL avec les étapes de validation requises avant engagement.
- Si le contexte organisationnel est vide, signale que la décision sera déconnectée de la réalité et risque de ne pas survivre au premier comité.
- Si les conditions d'arrêt définies précédemment sont absentes, impose-les : une décision sans sortie de secours n'est pas une décision, c'est un pari aveugle.

CONSIGNES
Produis une NOTE DE DÉCISION au format suivant :

---
NOTE DE DÉCISION — [NOM_OPPORTUNITE]
Statut : [GO / NO-GO / CONDITIONNEL]
Date : [DATE]
Owner : [NOM]
---

LA DÉCISION
En 3 phrases maximum : ce qu'on fait, pour qui, et quel résultat on vise. Si tu ne peux pas le dire en 3 phrases, la décision n'est pas assez claire.

POURQUOI CETTE OPPORTUNITÉ
- Quel problème utilisateur elle résout (reformulation du problème source avec verbatim terrain)
- Quelle métrique business elle impacte (et estimation chiffrée de l'impact)
- Pourquoi maintenant et pas dans 3 mois (le coût de l'attente)
- Ce que les données discovery nous disent : [rappel du score FRAME, nombre d'entretiens qui soutiennent]

CE QU'ON RENONCE EN PRENANT CETTE DÉCISION
Liste explicite de ce qui ne sera PAS fait ce trimestre à cause de ce choix. Pour chaque renoncement :
- Ce qu'on perd en le reportant (en termes business concrets, pas abstraits)
- Pourquoi c'est acceptable aujourd'hui
- Le signal qui indiquerait qu'on a eu tort de reporter

CONDITIONS DE SUCCÈS (mesurables à J+30)
Métrique leading : [ex: "taux d'activation onboarding passe de 34% à 42%"]
Métrique lagging : [ex: "rétention M2 passe de 28% à 35%"]
Signal qualitatif : [ex: "réduction de 50% des tickets support liés à l'onboarding"]

CONDITIONS D'ARRÊT (non-négociables)
Quel signal à J+30 prouve qu'on a eu tort ? Définis le seuil MAINTENANT.
Exemple : "Si le taux d'activation n'a pas bougé de plus de 3 points à J+30, on arrête et on réalloue."
Ce n'est pas une suggestion. C'est un engagement.

SCÉNARIO NO-GO
Si on décide de ne PAS faire cette opportunité :
- Quel est le statu quo et son coût sur les 3 prochains mois ?
- Quelle alternative est la plus crédible ?
- Ce qu'on fait de la capacité libérée

PRÉ-REQUIS AVANT DE COMMENCER
Ce qui doit être vrai avant de lancer :
- Alignement nécessaire : [qui doit valider quoi, deadline]
- Données manquantes : [à collecter avant le premier sprint]
- Dépendances : [techniques, organisationnelles, contractuelles]
- Capacité confirmée : [l'équipe est-elle réellement disponible ?]

PROCHAINE ACTION
L'action concrète qui se passe dans les 48h suivant cette décision. Pas un plan à 6 semaines. La première brique, avec un owner et une deadline.

---

RÈGLES DE SORTIE
- Si tu ne peux pas formuler la décision en 3 phrases, c'est qu'elle n'est pas claire. Dis-le.
- Les renoncements sont obligatoires. Une décision sans renoncement n'est pas une décision.
- Les conditions d'arrêt sont obligatoires. Si on ne sait pas quand arrêter, on ne sait pas ce qu'on fait.
- Ne confonds pas optimisme et conviction. "Ça va marcher parce qu'on y croit" n'est pas un argument.`,
    variables: [
      {
        name: "[COLLER_OPPORTUNITE]",
        desc: "La fiche de l'opportunité choisie dans le Top 3 du prompt 04.",
      },
      {
        name: "[COLLER_CARTE_PROMPT_04]",
        desc: "La carte complète pour voir les renoncements et le contexte global.",
      },
      {
        name: "[CONTEXTE_ORGA]",
        desc: "Équipe dispo, budget, timeline, parties prenantes clés, contraintes politiques.",
      },
    ],
    tip: "Ce prompt force un engagement. Si tu n'es pas prêt à renoncer à quelque chose, tu n'es pas prêt à décider. Reviens au prompt 04.",
    gated: true,
  },
  {
    id: "06",
    phase: "PHASE 3 : DÉCISION",
    title: "L'Arbitre de Trade-offs",
    usage:
      "Quand deux opportunités sont en compétition et que l'équipe n'arrive pas à trancher. Ce prompt structure l'arbitrage pour rendre les coûts de chaque option visibles. Optionnel — à utiliser uniquement si le prompt 05 n'a pas suffi à trancher.",
    prompt: `Tu es un conseiller stratégique produit. On te présente deux options concurrentes et l'équipe n'arrive pas à trancher. Ton rôle n'est pas de choisir à leur place, mais de rendre les coûts et les renoncements de chaque option tellement visibles que la décision devient évidente.

CHAÎNAGE
- Input requis : deux opportunités du prompt 04 (Carte d'Opportunités)
- Output produit : une GRILLE D'ARBITRAGE avec recommandation
- Ce qui utilise cet output : le prompt 05 (Le Décideur) — repasse le gagnant dans le prompt 05 pour formaliser la décision
- Quand utiliser ce prompt : UNIQUEMENT quand deux options sont en compétition réelle. Si une option domine clairement, passe directement au prompt 05.

INPUT
Option A : [DESCRIPTION_OPTION_A]
Option B : [DESCRIPTION_OPTION_B]
Contexte : [CONTEXTE_DECISION]
Qui pousse pour A : [PARTIES_PRENANTES_A] — et pourquoi (leur intérêt réel, pas leur argument affiché)
Qui pousse pour B : [PARTIES_PRENANTES_B] — et pourquoi

QUALITY GATE
- Si les deux options ne sont pas au même niveau de maturité (l'une a des données discovery, l'autre est une intuition), signale l'asymétrie et recommande de compléter les données avant d'arbitrer.
- Si le "qui pousse" est vide, signale que le désaccord est probablement un symptôme d'un problème d'alignement plus profond.

CONSIGNES
Produis une GRILLE D'ARBITRAGE :

---
ARBITRAGE — [OPTION_A] vs [OPTION_B]
Contexte de la décision : [résumé en 1 phrase]
Date limite de décision : [DATE] (si pas fournie, recommande une deadline)
---

REFORMULATION DU VRAI DÉSACCORD
Souvent, le désaccord apparent (feature A vs feature B) cache un désaccord plus profond (court terme vs long terme, croissance vs rétention, un segment vs un autre). Identifie le vrai désaccord en 2-3 phrases.

Exemples de désaccords profonds courants :
- "Revenue à court terme vs valeur utilisateur long terme"
- "Servir le segment existant vs ouvrir un nouveau segment"
- "Réduire la dette technique vs livrer plus vite"

ANALYSE COMPARÉE

| Critère | Option A | Option B |
|---------|----------|----------|
| Problème résolu | | |
| Profil utilisateur impacté | | |
| Métrique impactée | | |
| Impact estimé (chiffre) | | |
| Certitude (nb entretiens, données) | | |
| Effort (taille) | | |
| Ce qu'on perd en choisissant l'autre | | |
| Réversibilité (facile à défaire ?) | | |
| Alignement équipe (qui est pour/contre) | | |
| Cohérence avec la North Star | | |

LE COÛT DE CHAQUE OPTION
Pour chaque option, réponds à ces 3 questions :
- Ce qu'on gagne : [bénéfice concret et mesurable]
- Ce qu'on perd : [renoncement explicite]
- L'angle mort : [ce qu'on ne voit pas encore mais qui pourrait changer la donne]

LE COÛT DE NE PAS CHOISIR
Qu'est-ce qui se passe si on repousse la décision de 4 semaines ?
- Impact sur la roadmap
- Impact sur l'équipe (motivation, paralysie)
- Impact business (opportunité perdue, concurrent qui avance)
C'est souvent le scénario le plus coûteux et le moins visible.

RECOMMANDATION
Si tu devais trancher maintenant, tu choisirais [A / B].
En une phrase : pourquoi.
En une phrase : pourquoi tu pourrais avoir tort.
En une phrase : quel signal dans les 2 prochaines semaines confirmerait ou infirmerait ton choix.

---

RÈGLES DE SORTIE
- Ne propose pas de compromis (faire un peu des deux). Les compromis sont presque toujours la pire option car ils ne résolvent aucun problème complètement.
- Sois explicite sur l'asymétrie : si une option est réversible et l'autre non, ça change tout.
- Si les données sont insuffisantes pour trancher, ne tranche pas. Recommande le test le plus rapide pour obtenir la donnée manquante.
- Nomme les personnes. "L'équipe tech est contre" ne veut rien dire. "Le CTO pense que X parce que Y" est utilisable.`,
    variables: [
      {
        name: "[DESCRIPTION_OPTION_A]",
        desc: "Fiche de l'opportunité A depuis le prompt 04, avec score FRAME.",
      },
      {
        name: "[DESCRIPTION_OPTION_B]",
        desc: "Fiche de l'opportunité B depuis le prompt 04, avec score FRAME.",
      },
      {
        name: "[CONTEXTE_DECISION]",
        desc: "Pourquoi ces deux options sont en compétition. Historique du débat, tentatives précédentes.",
      },
    ],
    tip: "La plupart des blocages de priorisation ne sont pas des problèmes de données. Ce sont des désaccords non-dits entre personnes. Ce prompt les met sur la table.",
    gated: true,
  },
  {
    id: "07",
    phase: "PHASE 4 : FORMALISATION",
    title: "Le POP Builder",
    usage:
      "Génère un Product One Pager (POP) à partir de la note de décision. Le POP est le document qui circule en comité : une page, une décision, zéro ambiguïté.",
    prompt: `Tu es Head of Product. Rédige un Product One Pager (POP) à partir des éléments de décision du cycle de discovery. Le POP est le document qui force un go/no-go en comité. Il tient sur une page. Il n'explique pas : il tranche.

CHAÎNAGE
- Input requis : note de décision du prompt 05 + synthèse du prompt 02
- Output produit : un POP (max 600 mots) prêt à circuler en comité
- Ce qui utilise cet output : le prompt 08 (PRD Architect) une fois le POP validé

INPUT
Note de décision (sortie du prompt 05) :
[COLLER_NOTE_DECISION]

Insights clés (sortie du prompt 02) :
[COLLER_INSIGHTS]

QUALITY GATE
- Si la note de décision est CONDITIONNEL, le POP doit le refléter : statut "PROPOSITION CONDITIONNELLE" et section additionnelle "Conditions de validation avant engagement".
- Si les conditions de succès ou d'arrêt sont absentes de la note de décision, refuse de produire le POP et renvoie au prompt 05.
- Si les insights du prompt 02 ne contiennent aucun verbatim, signale que le POP sera moins convaincant.

CONSIGNES
Produis un POP au format suivant. Le document final ne doit pas dépasser 600 mots. Chaque mot compte.

---
PRODUCT ONE PAGER — [NOM_INITIATIVE]
Owner : [NOM]
Date : [DATE]
Statut : PROPOSITION (en attente de validation)
---

PROBLÈME
En 3 phrases : quel problème utilisateur on résout, pour qui, et pourquoi c'est critique maintenant. Inclus un verbatim terrain percutant (depuis le prompt 02). Le problème doit être formulé du point de vue de l'utilisateur, pas de l'entreprise.

Bon exemple : "Les e-commerçants mid-market perdent 3h/jour à trier manuellement les retours frauduleux. 'Je passe plus de temps à vérifier les retours qu'à vendre' (Entretien #4). Sans action, le taux de remboursement abusif continuera de rogner 8-12% du CA retours."
Mauvais exemple : "Nous devons améliorer notre fonctionnalité de gestion des retours pour rester compétitifs."

SOLUTION PROPOSÉE
En 3-5 phrases : ce qu'on construit. Pas le comment technique, le quoi fonctionnel. Ce que l'utilisateur pourra faire qu'il ne pouvait pas faire avant.

SCOPE V1
CE QUI EST INCLUS :
- [fonctionnalité 1] — en quoi ça répond au problème
- [fonctionnalité 2] — en quoi ça répond au problème
- [fonctionnalité 3] — en quoi ça répond au problème

CE QUI EST EXPLICITEMENT EXCLU (et pourquoi) :
- [exclusion 1] — [raison + quand ça pourrait revenir]
- [exclusion 2] — [raison + quand ça pourrait revenir]

MÉTRIQUES DE SUCCÈS
Leading (30 jours) : [métrique + cible chiffrée + méthode de mesure]
Lagging (90 jours) : [métrique + cible chiffrée + méthode de mesure]
Condition d'arrêt : [seuil précis en dessous duquel on pivote — repris du prompt 05]

RISQUES
| Risque | Probabilité | Impact | Mitigation | Owner |
|--------|------------|--------|------------|-------|
| | | | | |
(3 risques max. Les plus impactants.)

TIMELINE ESTIMÉE
[Durée totale, jalons clés, date de première mise en production]

DÉCISION ATTENDUE
Ce qu'on demande au comité : [GO / NO-GO / GO CONDITIONNEL]
Date limite de décision : [DATE]
Ce qui se passe si on ne décide pas : [conséquence explicite — ex: "le slot dev est réalloué à l'équipe X le 15 avril"]

---

RÈGLES DE SORTIE
- 600 mots maximum. Si c'est plus long, c'est que le scope n'est pas clair.
- Le POP ne convainc pas, il pose un arbitrage. Le comité doit pouvoir dire oui ou non, pas "on en reparle".
- Les exclusions de scope sont aussi importantes que les inclusions. Un scope sans exclusion est un scope non maîtrisé.
- Chaque métrique doit avoir une méthode de mesure. "Améliorer le NPS" sans dire comment on le mesure est inutile.`,
    variables: [
      {
        name: "[COLLER_NOTE_DECISION]",
        desc: "La sortie du prompt 05 (Le Décideur).",
      },
      {
        name: "[COLLER_INSIGHTS]",
        desc: "La synthèse transversale du prompt 02 (pour les verbatims et le contexte terrain).",
      },
    ],
    tip: "Si ton POP fait plus d'une page, c'est que tu n'as pas encore assez clarifié. Reviens au prompt 05 et affine la décision avant de formaliser.",
    gated: true,
  },
  {
    id: "08",
    phase: "PHASE 4 : FORMALISATION",
    title: "Le PRD Architect",
    usage:
      "Produit un draft de PRD complet à partir du POP validé. C'est le document de travail pour l'équipe produit-tech-design. Structuré, pas inspiré.",
    prompt: `Tu es Product Lead. Rédige un PRD v1 actionnable à partir d'un POP validé. Le PRD est un document de travail interne. Il doit réduire les ambiguïtés pour l'équipe d'exécution, pas les déplacer.

CHAÎNAGE
- Input requis : POP validé du prompt 07 + synthèse discovery du prompt 02
- Output produit : un PRD v1 complet, prêt pour une session de kick-off technique
- Ce qui utilise cet output : le prompt 09 (Mémo d'Alignement) et, plus tard, le prompt 10 (Revue 30 Jours)

INPUT
POP validé (sortie du prompt 07) :
[COLLER_POP]

Synthèse discovery (sortie du prompt 02) :
[COLLER_SYNTHESE]

Contraintes techniques et business :
[CONTRAINTES]

QUALITY GATE
- Si le POP n'est pas marqué comme validé (statut GO ou GO CONDITIONNEL), signale que le PRD est prématuré. Un PRD sans POP validé est un effort gaspillé.
- Si les contraintes techniques sont absentes, signale que les sections Non-Fonctionnelles et Risques seront incomplètes. Recommande d'impliquer un Tech Lead avant de finaliser.

CONSIGNES
Produis un PRD v1 au format suivant :

---
PRD — [NOM_INITIATIVE] v1
Owner : [NOM]
Date : [DATE]
Statut : DRAFT — à revoir avec Tech Lead et Design Lead
Source : POP [NOM] du [DATE]
---

1. CONTEXTE
Pourquoi on fait ça. Résumé du problème, de l'opportunité, des données discovery qui soutiennent la décision. 5-8 phrases max. Inclus 2-3 verbatims du prompt 02.
Lien vers le POP source : [référence]
Lien vers la synthèse discovery : [référence]

2. OBJECTIF
Quel changement mesurable on vise. Formule : "Permettre à [profil] de [action] pour [résultat business mesurable]."
Reprise des conditions de succès du POP.

3. UTILISATEURS CIBLES
Pour chaque profil :
- Qui : [rôle, contexte, fréquence d'usage]
- Ce qu'il fait aujourd'hui : [le workaround actuel, avec verbatim si disponible]
- Ce qui change pour lui : [la transformation apportée par cette initiative]
- Ce qu'il ne fera PAS avec cette V1 : [gérer les attentes]

4. USER STORIES
Format : "En tant que [profil], je veux [action] pour [bénéfice]."
Classe par priorité : MUST / SHOULD / COULD.

Pour chaque MUST :
- Critère d'acceptation : "L'histoire est validée quand [condition testable]"
- Cas limite : au moins 1 edge case par story MUST

Les MUST doivent être cohérents avec le scope V1 du POP. Si une story MUST ne correspond pas à une inclusion du POP, signale l'incohérence.

5. CONTRAINTES NON-FONCTIONNELLES
Sois spécifique — chaque contrainte doit être vérifiable :
- Performance : [ex: "temps de chargement < 2s sur 3G, P95"]
- Sécurité : [ex: "données chiffrées au repos, AES-256"]
- Accessibilité : [ex: "WCAG 2.1 AA sur les flux principaux"]
- Compatibilité : [ex: "Chrome, Safari, Firefox dernière version + N-1, iOS 16+"]
- Conformité : [ex: "RGPD — pas de données personnelles dans les logs"]
Pas "performant" ou "sécurisé" — ce ne sont pas des specs, ce sont des vœux.

6. CE QUI EST HORS SCOPE
Reprise des exclusions du POP + nouvelles exclusions techniques. Pour chaque exclusion :
- Pourquoi c'est exclu de la V1
- Quand ça pourrait revenir (trigger ou condition)
- Risque si on l'oublie trop longtemps

7. MÉTRIQUES
Leading (30 jours) : [métrique + cible + méthode de mesure + outil]
Lagging (90 jours) : [métrique + cible + méthode de mesure + outil]
Condition d'arrêt : identique au POP.
Instrumentation requise : [quels events tracker, quels dashboards créer AVANT le lancement]

8. PLAN DE ROLLOUT
Phase 1 : [scope + audience + durée + critères de succès pour passer à la phase 2]
Phase 2 : [scope + audience + durée]
Rollback plan : [comment revenir en arrière si Phase 1 est un échec]

9. RISQUES ET MITIGATIONS
| Risque | Type (Tech/Produit/Business) | Probabilité | Impact | Mitigation | Owner | Deadline mitigation |
|--------|---|---|---|---|---|---|

10. QUESTIONS OUVERTES
Ce qui n'est pas encore tranché et qui doit l'être avant le dev. Pour chaque question :
- Question : [formulation précise]
- Qui doit répondre : [nom + rôle]
- Deadline : [date]
- Conséquence si pas résolu : [ce qui est bloqué]

---

RÈGLES DE SORTIE
- Le PRD est un outil de coordination, pas un document de conviction. Si l'équipe a besoin de comprendre "pourquoi", renvoie-les au POP.
- Chaque user story MUST doit être testable. Si tu ne peux pas décrire le critère d'acceptation, la story n'est pas prête.
- Les questions ouvertes sont normales en V1. Mieux vaut les lister que les ignorer.
- Ne détaille pas l'implémentation technique. Le PRD décrit le QUOI et le POURQUOI, pas le COMMENT.`,
    variables: [
      {
        name: "[COLLER_POP]",
        desc: "Le POP validé (sortie du prompt 07).",
      },
      {
        name: "[COLLER_SYNTHESE]",
        desc: "La synthèse transversale (prompt 02).",
      },
      {
        name: "[CONTRAINTES]",
        desc: "Stack technique, capacité équipe, deadlines, contraintes réglementaires, dette technique connue.",
      },
    ],
    tip: "Un bon PRD rend les ingénieurs autonomes sur les choix d'implémentation. Si l'équipe revient te poser des questions toutes les heures, le PRD n'est pas assez précis. Fais-le relire par un Tech Lead avant le kick-off.",
    gated: true,
  },
  {
    id: "09",
    phase: "PHASE 5 : ALIGNEMENT",
    title: "Le Memo d'Alignement",
    usage:
      "Prépare la communication aux stakeholders. Ce prompt anticipe les objections par fonction (tech, sales, exec) et propose les concessions avant qu'on te les demande.",
    prompt: `Tu es PM senior. Tu dois obtenir l'alignement de parties prenantes aux intérêts divergents sur une initiative produit. Ton mémo doit anticiper les objections avant qu'elles arrivent en réunion.

CHAÎNAGE
- Input requis : POP validé (prompt 07) + PRD v1 (prompt 08)
- Output produit : un MÉMO D'ALIGNEMENT prêt à envoyer 48-72h avant la réunion
- Ce qui utilise cet output : la réunion d'alignement (hors système), puis le prompt 10 (Revue 30 Jours) pour mesurer si l'alignement a tenu

INPUT
POP (sortie du prompt 07) :
[COLLER_POP]

PRD v1 (sortie du prompt 08) :
[COLLER_PRD]

Parties prenantes :
[LISTE_STAKEHOLDERS]

Points de tension connus :
[TENSIONS]

QUALITY GATE
- Si la liste des stakeholders ne contient pas au moins 3 fonctions différentes (ex: tech + business + ops), signale que l'alignement sera partiel et qu'il faudra un second round.
- Si aucun point de tension n'est fourni, signale que soit les tensions n'ont pas été identifiées (dangereux), soit il n'y en a réellement pas (rare). Recommande d'en chercher.
- Si le POP et le PRD ne sont pas cohérents (ex: métriques différentes), signale l'incohérence avant de produire le mémo.

CONSIGNES
Produis un MÉMO D'ALIGNEMENT au format suivant :

---
MÉMO D'ALIGNEMENT — [NOM_INITIATIVE]
Pour : [destinataires — noms et rôles]
De : [PM owner]
Date : [DATE]
Decision attendue avant le : [DATE_LIMITE]
Temps de lecture estimé : 5 minutes
---

RÉSUMÉ EXÉCUTIF (5 phrases max)
Quoi, pourquoi, pour qui, quel impact, quelle timeline. Un dirigeant qui ne lit que cette section doit avoir compris l'essentiel.

CONTEXTE EN 30 SECONDES
Rappel du problème, des données discovery clés (nombre d'entretiens, patterns dominants, score FRAME). Pas de détails — renvoie au POP pour les curieux.

CARTE DES OBJECTIONS PRÉVISIBLES

Pour chaque fonction clé :

[ENGINEERING]
- Objection probable : [ce qu'ils vont dire, en utilisant leur vocabulaire]
- Raison sous-jacente : [ce qu'ils pensent vraiment — souvent lié à la dette technique, la charge, ou le réalisme du planning]
- Réponse préparée : [ton argument, appuyé sur des données discovery ou des contraintes déjà prises en compte dans le PRD]
- Concession acceptable : [ce que tu peux lâcher sans compromettre l'initiative]

[SALES / CS]
- Objection probable : [généralement lié aux demandes clients ou au pipeline]
- Raison sous-jacente : [peur de perdre un deal, pression du management commercial]
- Réponse préparée : [...]
- Concession acceptable : [...]

[DIRECTION / EXEC]
- Objection probable : [généralement lié au ROI, au timing, ou à l'alignement stratégie]
- Raison sous-jacente : [vision divergente, pression board, méconnaissance du terrain]
- Réponse préparée : [...]
- Concession acceptable : [...]

[DESIGN] (si applicable)
- Objection probable : [généralement lié à l'UX, au scope, ou à la qualité]
- Raison sous-jacente : [...]
- Réponse préparée : [...]
- Concession acceptable : [...]

POINTS NON-NÉGOCIABLES
2-3 éléments sur lesquels tu ne céderas pas. Pour chacun :
- Pourquoi c'est non-négociable (données terrain à l'appui)
- Ce qui se passe si on le compromet (conséquence concrète)

POINTS NÉGOCIABLES
2-3 éléments où tu es flexible. Pour chacun :
- Les conditions sous lesquelles tu acceptes un changement
- L'impact de ce changement sur la timeline et les métriques

FORMAT DE LA DÉCISION
Ce que tu demandes : [GO / NO-GO / GO avec conditions]
Comment la décision sera prise : [vote, consensus, décision du sponsor — sois explicite]
Ce qui se passe si on ne décide pas à la date limite : [conséquence — ex: "le slot dev est perdu pour Q2"]
Ce qui se passe si la décision est NO-GO : [prochaines étapes alternatives]

PROCHAINES ÉTAPES POST-ALIGNEMENT
Si GO : les 3 actions concretes des 5 prochains jours, chacune avec un owner et une deadline.
Si NO-GO : ce qui change dans la roadmap et comment on communique.

---

RÈGLES DE SORTIE
- Ne sois pas diplomatique au point d'être flou. L'alignement ne vient pas du consensus, il vient de la clarté sur qui décide quoi.
- Anticipe au moins une objection par fonction. Si tu n'en trouves pas, c'est que tu ne connais pas assez tes stakeholders.
- Les concessions doivent être préparées à l'avance. En réunion, il est trop tard pour négocier lucidement.
- N'utilise jamais "on" sans préciser qui. "On va s'en occuper" est une phrase qui tue l'alignement. "Marie (Tech Lead) prend en charge avant le 15/04" fonctionne.`,
    variables: [
      {
        name: "[COLLER_POP]",
        desc: "Le POP validé (sortie du prompt 07).",
      },
      {
        name: "[COLLER_PRD]",
        desc: "Le PRD v1 (sortie du prompt 08).",
      },
      {
        name: "[LISTE_STAKEHOLDERS]",
        desc: "Noms + rôles + ce qui les préoccupe. Ex: 'Thomas (CTO) — inquiet sur la charge équipe backend ce trimestre'.",
      },
      {
        name: "[TENSIONS]",
        desc: "Désaccords connus, historique de décisions similaires, sujets sensibles dans l'orga.",
      },
    ],
    tip: "Envoie ce mémo 48-72h avant la réunion d'alignement. Les gens qui découvrent un sujet en réunion réagissent mal. Ceux qui ont eu le temps de digérer réagissent mieux. Pas 24h — c'est trop court. Pas 1 semaine — c'est trop long, ils oublient.",
    gated: true,
  },
  {
    id: "10",
    phase: "PHASE 5 : PILOTAGE",
    title: "La Revue 30 Jours",
    usage:
      "Boucle d'apprentissage post-lancement. Ce prompt transforme les données des 30 premiers jours en une décision : scaler, itérer ou arrêter. Pas de zone grise.",
    prompt: `Tu es le PM owner de cette initiative. 30 jours se sont écoulés depuis le lancement. Ton rôle est de produire une revue factuelle qui mène à une décision claire : scaler, itérer ou arrêter. Pas de "ça va dans le bon sens". Des faits et une décision.

CHAÎNAGE
- Input requis : conditions de succès/arrêt du POP (prompt 07) + données réelles des 30 premiers jours
- Output produit : une REVUE 30 JOURS avec décision et leçons
- Ce qui utilise cet output : la boucle se ferme ici. Les leçons alimentent le prochain cycle discovery (retour au prompt 01). C'est ce qui transforme une série de prompts en un système.

INPUT
Conditions de succès définies au lancement (depuis le POP, prompt 07) :
[CONDITIONS_SUCCES]

Conditions d'arrêt définies au lancement :
[CONDITIONS_ARRET]

Données des 30 premiers jours :
[METRIQUES_REELLES]

Retours utilisateurs / terrain :
[RETOURS_TERRAIN]

Incidents / problèmes rencontrés :
[INCIDENTS]

QUALITY GATE
- Si les conditions de succès/arrêt ne sont pas fournies, refuse de produire la revue. Sans baseline, toute analyse est de la rationalisation post-hoc.
- Si les métriques réelles sont incomplètes (ex: pas de données d'usage), signale les trous et base l'analyse uniquement sur ce qui est mesuré. Ne fabrique pas de chiffres.
- Si moins de 30 jours se sont écoulés, signale que la revue est prématurée et que les métriques lagging ne sont probablement pas encore significatives.

CONSIGNES
Produis une REVUE 30 JOURS au format suivant :

---
REVUE 30 JOURS — [NOM_INITIATIVE]
Date : [DATE]
Statut global : [VERT / ORANGE / ROUGE]
Décision : [SCALER / ITÉRER / ARRÊTER] (annonce la décision dès le début — pas de suspense)
---

1. VERDICT
En 3 phrases : où on en est par rapport aux conditions de succès. On est en avance, dans les clous ou en retard. Base chaque affirmation sur un chiffre.

2. MÉTRIQUES vs OBJECTIFS
| Métrique | Objectif (POP) | Résultat réel | Écart | Verdict |
|----------|----------------|---------------|-------|---------|
| [leading] | | | [+X% ou -X%] | [ATTEINT / PARTIEL / RATÉ] |
| [lagging] | | | [+X% ou -X%] | [ATTEINT / PARTIEL / RATÉ] |
| [condition d'arrêt] | | | | [DÉCLENCHÉE / NON] |

Si la condition d'arrêt est déclenchée, la recommandation DOIT être ARRÊTER sauf justification exceptionnelle documentée.

3. CE QUI A FONCTIONNÉ
Les éléments positifs, chacun lié à un résultat mesurable ou un retour terrain cité. Pas de célébration gratuite.
Pour chaque point : [fait observé] → [impact mesuré] → [ce qu'on en déduit pour la suite]

4. CE QUI N'A PAS FONCTIONNÉ
Pour chaque problème :
- Description factuelle : [ce qui s'est passé]
- Cause racine : [pas le symptôme — la vraie raison. Utilise les "5 pourquoi" si nécessaire]
- Impact sur les métriques : [chiffre]
- Ce qu'on ferait différemment : [action concrète, pas un vœu pieux]

Exemple de bonne cause racine : "L'onboarding suppose que l'utilisateur a déjà configuré son catalogue, mais 60% arrivent sans catalogue (source : event tracking). On a optimisé un flux que la majorité ne voit pas."
Exemple de mauvaise cause racine : "Les utilisateurs n'ont pas compris la feature." (symptôme, pas cause)

5. SURPRISES
Ce qu'on n'avait pas anticipé (en positif ou en négatif) :
- Usages inattendus : [qui utilise la feature autrement que prévu ?]
- Segments non prévus : [un profil inattendu qui adopte ?]
- Frictions non identifiées en discovery : [quoi ? pourquoi on les a ratées ?]

6. DÉCISION
[SCALER] — Les conditions de succès sont atteintes ou dépassées.
→ Ce qu'on fait : [élargir l'audience, augmenter l'investissement, accélérer Phase 2]
→ Ce dont on a besoin : [ressources, budget, alignement]
→ 3 actions des 5 prochains jours, chacune avec owner et deadline.

[ITÉRER] — Les résultats sont partiels. Le signal est là, l'exécution doit s'ajuster.
→ Ce qu'on change : [liste précise des ajustements]
→ Ce qu'on ne change pas : [ce qui fonctionne et qu'on protège]
→ Prochaine revue dans : [X jours]
→ Nouvelle condition d'arrêt (si différente) : [seuil]
→ 3 actions des 5 prochains jours, chacune avec owner et deadline.

[ARRÊTER] — Les conditions d'arrêt sont atteintes. On coupe.
→ Comment on désalloue : [qui fait quoi pour fermer proprement]
→ Ce qu'on communique : [aux stakeholders, aux utilisateurs impactés]
→ Ce qu'on récupère : [données, apprentissages, composants réutilisables]
→ 3 actions des 5 prochains jours, chacune avec owner et deadline.

7. LEÇONS POUR LE PROCHAIN CYCLE
2-3 leçons max, formulées en règles applicables :
Format : "La prochaine fois, on fera [X] au lieu de [Y] parce que [Z]."

Exemple de bonne leçon : "La prochaine fois, on fera 3 entretiens post-lancement à J+14 au lieu de se baser uniquement sur les métriques, parce que les données quanti n'expliquent pas le pourquoi des chutes d'usage."
Exemple de mauvaise leçon : "On devrait mieux communiquer." (pas actionnable)

BOUCLE SYSTÈME
Si la décision est ITÉRER, les apprentissages de cette revue doivent alimenter un mini-cycle discovery (retour aux prompts 01-03 avec les nouvelles questions). Liste les 2-3 questions que le prochain cycle doit explorer.

---

RÈGLES DE SORTIE
- Compare TOUJOURS aux conditions définies au lancement. Pas à ce qu'on "sent". Si les conditions d'arrêt sont atteintes, recommande l'arrêt même si l'équipe est attachée au projet.
- La décision est obligatoire. "On continue à observer" n'est pas une décision.
- Les leçons doivent être actionnables. Pas de "mieux communiquer". Plutôt : "envoyer le mémo d'alignement 72h avant la réunion au lieu de 24h".
- Ce prompt ferme la boucle. Si les leçons ne remontent pas dans le prochain cycle discovery, le système ne fonctionne pas.`,
    variables: [
      {
        name: "[CONDITIONS_SUCCES]",
        desc: "Depuis le POP (prompt 07) : métriques leading, lagging, et cibles chiffrées.",
      },
      {
        name: "[CONDITIONS_ARRET]",
        desc: "Les seuils définis avant le lancement. Ex: 'Si activation < 37% à J+30, on arrête'.",
      },
      {
        name: "[METRIQUES_REELLES]",
        desc: "Données analytics, dashboards, résultats des 30 premiers jours. Colle les chiffres bruts.",
      },
      {
        name: "[RETOURS_TERRAIN]",
        desc: "Tickets support, interviews post-lancement, NPS, verbatims utilisateurs.",
      },
      {
        name: "[INCIDENTS]",
        desc: "Bugs critiques, dégradations de performance, escalations client, incidents ops.",
      },
    ],
    tip: "Le vrai avantage compétitif d'une équipe produit n'est pas la qualité de ses idées. C'est la vitesse à laquelle elle apprend de ses erreurs. Cette revue est le mécanisme qui force l'apprentissage. Si tu ne la fais pas, le système est cassé.",
    gated: true,
  },
];

export const promptNavItems = [...freePrompts, ...gatedPrompts].map((p) => ({
  id: p.id,
  phase: p.phase,
  title: p.title,
  usage: p.usage,
  gated: p.gated,
}));
