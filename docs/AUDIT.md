# Audit initial — Ogooué Habitat

Date: 2026-10-06  
Branche: `production-readiness-ogooue`

## État technique constaté

- Application Next.js 16 / React 19 avec App Router.
- Design existant cohérent, basé sur Tailwind et composants maison; contrainte: aucune refonte graphique.
- Données principales dans `data/*.ts` et stockage local navigateur dans `data/local/*` / `lib/local-store/*`.
- Aucune base de données serveur, aucun ORM, aucune migration et aucune API serveur métier au moment de l’audit.
- Authentification réelle absente: les écrans connexion/inscription affichent explicitement un mode démonstration.
- Publication d’annonce fonctionnelle uniquement côté navigateur via `localStorage`, non partagée entre appareils et non persistée serveur.
- Recherche, favoris, comparaison et demandes reposent sur données statiques ou locales.
- Aucun paiement réel; aucune intégration email/SMS/OAuth/cartographie/prestataire paiement configurée.
- Administration complète absente.
- Docker/déploiement production absent du dépôt initial.

## Vérifications exécutées

1. `npm ci` — succès, avec 10 vulnérabilités npm signalées par audit (2 modérées, 8 hautes). Aucune correction automatique appliquée sans analyse car cela peut être cassant.
2. `npm run lint` initial — échec: erreurs TypeScript/React Compiler dans recherche/filtres.
3. Corrections minimales sans changement visuel:
   - typage du tri de recherche;
   - extraction de composants internes créés pendant le rendu;
   - suppression d’un `setState` synchronisé en effet.
4. `npm run lint` final — succès avec avertissements non bloquants existants.
5. `npm run build` final — succès, 47 pages générées/contrôlées.

## Ce qui fonctionne réellement

- Pages publiques principales: accueil, acheter, louer, terrains, agences, détail bien, aide, estimation, diaspora, publier.
- Build production Next.js.
- Recherche et filtres sur un sous-ensemble de données statiques.
- Favoris/comparaison et annonces publiées localement par navigateur.
- SEO de base: metadata, robots, sitemap.

## Ce qui est simulé ou local uniquement

- Comptes, sessions, inscription, connexion, récupération de mot de passe.
- Création d’annonces: stockée dans le navigateur uniquement.
- Leads/contact/demandes: stockés localement ou déclaratifs selon les écrans.
- Photos: encodées côté client et non stockées sur un serveur persistant.
- Vérification Ogooué Shield / modération: données statiques ou message informatif.
- Paiements, abonnements, factures, webhooks: non implémentés.

## Manques majeurs pour production

- Base PostgreSQL, schéma complet, migrations, contraintes, index.
- Authentification sécurisée, vérification email, récupération mot de passe, sessions, suppression compte.
- Autorisations serveur pour rôles utilisateur/agence/modération/admin.
- API métier server-side et validation serveur.
- Stockage média persistant public/privé avec nettoyage et droits d’accès.
- Workflows agence, équipes, invitations, prospects.
- Modération, signalements, expiration/renouvellement, vendu/loué.
- Paiements adaptés au Gabon avec webhooks signés et idempotence.
- Administration connectée aux données et audit log.
- Docker, sauvegardes/restauration et procédure premier administrateur.

## Décisions initiales

- Conserver l’identité visuelle existante et intégrer les nouveaux parcours dans les composants/styles actuels.
- Prioriser une base serveur réelle avant d’ajouter des écrans: données persistantes, permissions et validation d’abord.
- Séparer strictement données de démonstration et données réelles.
- Ne jamais marquer une intégration externe comme opérationnelle sans identifiants et test prestataire.
