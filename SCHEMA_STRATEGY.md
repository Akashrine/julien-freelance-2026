# SCHEMA_STRATEGY.md

**Date** : Janvier 2026  
**Contexte** : Site éditorial, thought leadership, positionnement filtrant  
**Objectif** : Découvrabilité intellectuelle, pas conversion transactionnelle

---

## 1. Philosophie Schema.org pour ce site

### Principe fondamental

Les schémas Schema.org doivent renforcer la **crédibilité éditoriale** et la **découvrabilité intellectuelle**, pas créer des signaux transactionnels ou commerciaux.

**Objectif** : Aider les moteurs de recherche à comprendre que ce site est une source de réflexion et d'analyse, pas un catalogue de services.

**Risque à éviter** : Utiliser des schémas qui signalent une intention commerciale (ProfessionalService, Offer, Service) et qui attireraient des requêtes transactionnelles incompatibles avec le positionnement filtrant.

---

## 2. Schémas inclus et justification

### Person

**Pourquoi** :
- Le site est centré sur une personne (Julien Brionne) et son point de vue
- Le thought leadership nécessite une identité claire de l'auteur
- Les moteurs de recherche peuvent associer le contenu à un auteur crédible

**Ce qu'il signale** :
- Identité de l'auteur
- Rôle professionnel (Product Lead Indépendant)
- Présence éditoriale, pas commerciale

**Ce qu'il ne signale pas** :
- Pas de services à vendre
- Pas d'offres commerciales
- Pas de catalogue de prestations

**Utilisation** : Sur la page Home uniquement, pour établir l'identité de l'auteur.

### WebSite

**Pourquoi** :
- Permet de signaler la structure globale du site
- Peut inclure un SearchAction pour la recherche (si implémentée)
- Renforce la compréhension du site comme entité éditoriale

**Ce qu'il signale** :
- Structure du site
- Potentiellement un moteur de recherche interne (si présent)
- Site comme source éditoriale

**Ce qu'il ne signale pas** :
- Pas de catalogue de services
- Pas d'offres commerciales

**Utilisation** : Sur la page Home uniquement, une fois pour tout le site.

### WebPage

**Pourquoi** :
- Permet de signaler les pages principales (Approche, Situations, Diagnostic, Articles)
- Renforce la compréhension de la structure éditoriale
- Peut inclure `about` pour indiquer le sujet de la page

**Ce qu'il signale** :
- Structure des pages
- Sujet de chaque page (`about`)
- Hiérarchie éditoriale

**Ce qu'il ne signale pas** :
- Pas d'intention transactionnelle
- Pas de conversion

**Utilisation** : Sur les pages principales (Approche, Situations, Diagnostic, Articles listing), pas sur les articles individuels (qui utilisent Article).

### Article

**Pourquoi** :
- Les articles MDX sont du contenu éditorial, pas du contenu marketing
- Le schéma Article signale du contenu de réflexion, pas du contenu commercial
- Permet d'associer les articles à l'auteur (Person)

**Ce qu'il signale** :
- Contenu éditorial de réflexion
- Auteur clairement identifié
- Date de publication
- Pas de contenu marketing

**Ce qu'il ne signale pas** :
- Pas de "blog SEO spam"
- Pas de contenu transactionnel
- Pas d'offres commerciales

**Utilisation** : Sur chaque article MDX individuel uniquement.

**Améliorations par rapport à la version actuelle** :
- Ajouter `about` pour indiquer les concepts centraux abordés
- Ajouter `keywords` uniquement si pertinent (concepts centraux, pas mots-clés SEO)
- S'assurer que `publisher` pointe vers Person, pas vers une Organisation

### BreadcrumbList

**Pourquoi** :
- Améliore la compréhension de la structure du site
- Aide à la navigation dans les résultats de recherche
- Renforce la hiérarchie éditoriale

**Ce qu'il signale** :
- Structure de navigation
- Hiérarchie des pages
- Pas d'intention transactionnelle

**Ce qu'il ne signale pas** :
- Pas de tunnel de conversion
- Pas de parcours commercial

**Utilisation** : Sur toutes les pages sauf la Home, pour indiquer le chemin de navigation.

---

## 3. Schémas intentionnellement exclus

### ProfessionalService

**Pourquoi exclu** :
- Le site n'est pas un catalogue de services
- ProfessionalService signale une intention commerciale explicite
- Attirerait des requêtes transactionnelles ("conseil produit", "service product management")
- Incompatible avec le positionnement filtrant

**Risque si inclus** :
- Le site serait classé comme un site de services
- Attirerait des requêtes commerciales génériques
- Diluerait le positionnement thought leadership

### Offer / OfferCatalog

**Pourquoi exclu** :
- Aucune offre commerciale sur le site
- Pas de pricing, pas de packages
- Offer signale une intention transactionnelle explicite

**Risque si inclus** :
- Créerait une attente commerciale inexistante
- Attirerait des requêtes de comparaison de prix
- Incompatible avec le positionnement éditorial

### Service

**Pourquoi exclu** :
- Trop générique et commercial
- Signale une intention de vente de services
- Incompatible avec le positionnement thought leadership

**Risque si inclus** :
- Le site serait classé comme un site de services
- Attirerait des requêtes commerciales
- Diluerait le positionnement éditorial

### Review / AggregateRating

**Pourquoi exclu** :
- Pas de témoignages clients sur le site
- Pas de système de notation
- Review signale une logique de preuve sociale commerciale

**Risque si inclus** :
- Créerait une attente de preuves sociales
- Attirerait des requêtes de comparaison ("meilleur consultant produit")
- Incompatible avec le positionnement filtrant

### Organization (pour l'auteur)

**Pourquoi exclu** :
- L'auteur est une Person, pas une Organization
- Organization signale une entreprise, pas un auteur individuel
- Le site est personnel, pas corporatif

**Risque si inclus** :
- Diluerait l'identité personnelle de l'auteur
- Signalerait une structure organisationnelle inexistante
- Incompatible avec le positionnement thought leadership individuel

---

## 4. Alignement avec la stratégie SEO filtrante

### Comment cette stratégie Schema.org sert le SEO filtrant

**Signaux éditoriaux renforcés** :
- Person + Article signalent du contenu d'auteur, pas du contenu marketing
- WebPage avec `about` signale des sujets de réflexion, pas des services
- BreadcrumbList signale une structure éditoriale, pas un tunnel de conversion

**Requêtes ciblées** :
- Les schémas Person et Article aident à ranker sur des requêtes d'auteur ("Julien Brionne", "articles Julien Brionne")
- Les schémas Article avec `about` aident à ranker sur des concepts réflexifs ("dette de décision produit", "arbitrage produit")
- Les schémas WebPage avec `about` aident à ranker sur des sujets de réflexion ("leadership opérationnel", "système produit")

**Requêtes évitées** :
- Pas de ProfessionalService → pas de requêtes "conseil produit prix"
- Pas d'Offer → pas de requêtes "offre product management"
- Pas de Service → pas de requêtes "service product lead"

### Comment cette stratégie évite les requêtes transactionnelles

**Signaux évités** :
- Aucun schéma transactionnel (ProfessionalService, Offer, Service)
- Aucun schéma de preuve sociale (Review, AggregateRating)
- Focus sur les signaux éditoriaux (Person, Article, WebPage)

**Résultat** :
- Le site est classé comme source éditoriale, pas comme catalogue de services
- Les requêtes transactionnelles ne sont pas attirées
- Seules les requêtes réflexives et d'auteur sont ciblées

---

## 5. Structure des schémas par page

### Home (`/`)

**Schémas inclus** :
- **Person** : Identité de l'auteur
- **WebSite** : Structure globale du site

**Schémas exclus** :
- WebPage (la Home n'a pas besoin de WebPage, elle est couverte par WebSite)
- BreadcrumbList (pas de breadcrumb sur la Home)

### Approche (`/approche`)

**Schémas inclus** :
- **WebPage** : Page sur le sujet "leadership opérationnel" / "approche d'intervention"
- **BreadcrumbList** : Home → Approche

**Schémas exclus** :
- Person (déjà sur la Home)
- Article (ce n'est pas un article)
- ProfessionalService (pas de service à vendre)

### Situations (`/situations`)

**Schémas inclus** :
- **WebPage** : Page sur le sujet "situations d'intervention" / "problèmes récurrents produit"
- **BreadcrumbList** : Home → Situations

**Schémas exclus** :
- Person (déjà sur la Home)
- Article (ce n'est pas un article)
- ProfessionalService (pas de service à vendre)

### Articles listing (`/articles`)

**Schémas inclus** :
- **WebPage** : Page sur le sujet "réflexions et analyses produit"
- **BreadcrumbList** : Home → Articles

**Schémas exclus** :
- Person (déjà sur la Home)
- Article (ce n'est pas un article individuel)
- CollectionPage (trop complexe, WebPage suffit)

### Article individuel (`/articles/[slug]`)

**Schémas inclus** :
- **Article** : Contenu éditorial avec auteur, date, sujet
- **BreadcrumbList** : Home → Articles → [Titre article]

**Schémas exclus** :
- Person (déjà sur la Home, et dans Article.author)
- WebPage (Article couvre déjà la page)
- BlogPosting (Article est plus générique et approprié pour du thought leadership)

### Diagnostic (`/diagnostic`)

**Schémas inclus** :
- **WebPage** : Page sur le sujet "diagnostic de situation produit"
- **BreadcrumbList** : Home → Diagnostic

**Schémas exclus** :
- Person (déjà sur la Home)
- Article (ce n'est pas un article)
- ProfessionalService (pas de service à vendre, c'est une page explicative)

---

## 6. Champs Schema.org à utiliser avec précaution

### `keywords`

**Quand utiliser** :
- Dans Article, uniquement pour les concepts centraux abordés ("dette de décision", "arbitrage produit", "système produit")
- Pas pour des mots-clés SEO génériques

**Quand éviter** :
- Ne pas utiliser pour des mots-clés commerciaux ("conseil produit", "coaching product manager")
- Ne pas surcharger avec des mots-clés non pertinents

### `about`

**Quand utiliser** :
- Dans WebPage, pour indiquer le sujet principal de la page
- Dans Article, pour indiquer les concepts centraux abordés

**Quand éviter** :
- Ne pas utiliser pour des sujets commerciaux ("services product management")
- Ne pas utiliser pour des offres ("diagnostic gratuit")

### `mainEntityOfPage`

**Quand utiliser** :
- Dans Article, pour lier l'article à sa page WebPage
- Pour renforcer la relation entre contenu et page

**Quand éviter** :
- Ne pas utiliser pour créer des relations commerciales
- Ne pas utiliser pour lier à des pages de services

---

## 7. Risques de dérive Schema.org

### Signaux faibles de dérive commerciale

**Si le site commence à ranker sur des requêtes transactionnelles** :
- Vérifier qu'aucun schéma ProfessionalService ou Service n'a été ajouté
- Vérifier que les schémas Article n'utilisent pas de mots-clés commerciaux
- Vérifier que les schémas WebPage n'utilisent pas `about` avec des sujets commerciaux

**Si le trafic augmente sur des requêtes génériques** :
- Vérifier que les schémas n'attirent pas de requêtes commerciales
- Vérifier que les `keywords` ne contiennent pas de mots-clés commerciaux
- Vérifier que les `about` ne signalent pas d'intention commerciale

### Signaux faibles de sur-optimisation

**Si les schémas deviennent trop complexes** :
- Réduire le nombre de champs utilisés
- Garder uniquement les champs essentiels
- Éviter les champs qui n'apportent pas de valeur réelle

**Si les schémas deviennent trop marketing** :
- Retirer les champs qui signalent une intention commerciale
- Revenir à une structure éditoriale simple
- Prioriser Person, Article, WebPage basiques

---

## 8. Validation de la stratégie

### Critères de validation

- [x] **Aucun schéma transactionnel** : ProfessionalService, Offer, Service exclus
- [x] **Schémas éditoriaux uniquement** : Person, Article, WebPage, BreadcrumbList
- [x] **Signaux d'auteur renforcés** : Person sur la Home, Article.author sur les articles
- [x] **Pas de preuve sociale commerciale** : Review, AggregateRating exclus
- [x] **Structure cohérente** : Chaque page a les schémas appropriés

### État actuel : **Stratégie Schema.org cohérente avec le positionnement**

La stratégie proposée renforce les signaux éditoriaux et évite les signaux transactionnels. Les schémas sont minimalistes et alignés avec le positionnement thought leadership.

---

**Document prêt pour validation et décision. Aucune modification automatique. Tous les schémas doivent être validés avant implémentation.**
