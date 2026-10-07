# Progression — Ogooué Habitat

## Terminé

- Branche de travail créée: `production-readiness-ogooue`.
- Audit initial du dépôt effectué.
- Dépendances installées avec `npm ci`.
- Erreurs bloquantes lint/build corrigées sans changement graphique.
- `npm run lint` réussit avec avertissements non bloquants.
- `npm run build` réussit.
- Documents créés: `docs/AUDIT.md`, `docs/PLAN.md`, `docs/VALIDATION.md`, `docs/MANUAL_SETUP.md`, `docs/PROGRESS.md`.

## Décisions

- Préserver strictement le design existant.
- Ne pas déclarer opérationnels les paiements, emails, SMS, OAuth ou cartes avant configuration et test fournisseur.
- Prioriser le socle base de données/auth/permissions avant de multiplier les écrans.

## Restant prioritaire

1. Ajouter schéma DB, migrations et seed démonstration séparé.
2. Ajouter Docker Compose PostgreSQL et scripts migration/seed.
3. Implémenter auth serveur et sessions.
4. Brancher publication/recherche aux données serveur.
5. Ajouter admin connecté avec audit log.

## Dernière vérification

- `npm run lint` — succès, 6 avertissements.
- `npm run build` — succès.

## Prochaine action

Mettre en place le socle de base de données persistante et les migrations, puis commencer l’authentification serveur.


## Ajout socle persistance

- Schéma Prisma PostgreSQL ajouté: utilisateurs, sessions, vérification, rôles, agences, équipes, invitations, géographie, annonces, médias, leads, favoris, recherches sauvegardées, offres, abonnements, paiements, signalements et audit log.
- Migration SQL initiale générée avec extension `citext`.
- Seed démonstration séparé ajouté dans `prisma/seed.ts`.
- Dockerfile, docker-compose, `.env.example`, client Prisma et scripts sauvegarde/restauration ajoutés.
- Commande sécurisée de bootstrap premier administrateur ajoutée: `npm run admin:create`.

## Limite de vérification

- Docker CLI est installé mais le daemon ne peut pas démarrer sans privilèges root dans cet environnement; l’application effective de la migration et du seed PostgreSQL est donc à vérifier sur une machine Docker/Ubuntu autorisée. Le schéma et la migration ont été validés statiquement avec Prisma.

## Prochaine action après socle DB

Brancher les parcours auth/annonces existants aux API serveur et appliquer les permissions côté serveur.


## Authentification serveur — implémenté, à tester avec PostgreSQL réel

- Routes API ajoutées: inscription, connexion, session HttpOnly, profil courant, vérification email, demande/réinitialisation de mot de passe, déconnexion du terminal courant ou de tous les appareils, suppression de compte avec confirmation.
- Mot de passe: `scrypt` salé; sessions opaques hachées en base avec expiration de 30 jours.
- Les vérifications et réinitialisations sont des jetons opaques hachés, à durée d’une heure et usage unique.
- Permissions serveur disponibles via `requireUser` et `requireRole`; elles doivent être employées dans chaque prochaine route métier.
- Les écrans connexion et inscription existants utilisent maintenant les API réelles, sans changement de design.
- Blocage: les emails ne peuvent pas être délivrés tant que le fournisseur n’est pas configuré; aucun jeton n’est exposé en production.


## Annonces persistantes — API serveur ajoutée, à intégrer complètement après migration réelle

- API annonces ajoutée: création de brouillon, liste des annonces accessibles, édition, soumission à modération, publication/rejet par modérateur, archivage, vendu/loué et suppression.
- Chaque opération contrôle côté serveur le propriétaire, l’appartenance active à l’agence, ou le rôle modérateur/admin.
- Chaque action est inscrite dans `AuditLog`.
- Les écrans publication et mes annonces conservent encore leur stockage navigateur: leur bascule nécessitera la disponibilité de la migration appliquée, des identifiants de géographie persistants et du stockage média.
- Médias: le modèle persistant existe mais aucun upload n’est activé tant que le stockage public/privé n’est pas configuré.


## Agences — API serveur ajoutée

- Création d’agence avec statut `PENDING_REVIEW`, équipe propriétaire initiale et journalisation.
- Liste limitée aux agences auxquelles appartient l’utilisateur connecté.
- Invitations réservées aux responsables/propriétaires d’agence et expirant après sept jours.
- Acceptation d’invitation, validation des justificatifs et interface de gestion d’agence restent à développer et à relier après migration réelle.


## Médias persistants locaux — API ajoutée

- Stockage local persistant prévu dans le volume Docker `media_data`, sans fournisseur cloud obligatoire.
- Upload limité: images publiques JPEG/PNG/WebP (10 Mo) et PDF privé (15 Mo).
- Les documents privés ne sont servis qu’au propriétaire, aux membres actifs de l’agence ou aux modérateurs/administrateurs; cache privé désactivé.
- Les médias publics disposent d’une URL applicative; les accès sont validés par la base.
- Limite: l’upload/lecture n’est pas testé contre PostgreSQL réel ni volume Docker effectif faute d’accès local à ces services.


## Favoris, demandes et recherche — API PostgreSQL ajoutées

- Favoris persistants par utilisateur via clé composite base de données.
- Demandes de contact persistantes, accessibles uniquement au demandeur, au propriétaire ou à l’équipe d’agence concernée.
- Recherche publique paginée uniquement sur les annonces `PUBLISHED`, avec critères vérifiables: transaction, ville, catégorie, fourchette de prix et texte libre. Elle ne génère aucune caractéristique inventée.
- Les écrans existants utilisent encore leurs stores navigateur: l’API est prête mais ne peut pas être validée sans migration PostgreSQL réelle.

## Vérification PostgreSQL locale

- Recherche effectuée: binaires `postgres`, `initdb`, `pg_ctl` et `psql` absents de l’environnement; aucun service local accessible n’a été trouvé.
- Docker CLI est présent mais son daemon exige des privilèges non disponibles. Aucune migration ni parcours API n’est déclaré vérifié avec une base réelle.


## Administration — premier tableau connecté ajouté

- Page `/admin` protégée côté serveur, refusant tout utilisateur non modérateur/admin.
- Indicateurs connectés: comptes, agences, annonces à modérer, signalements ouverts.
- APIs d’administration protégées: synthèse et file des annonces à modérer, sans exposer de secret.
- Les actions de modération passent déjà par l’API d’annonces avec journal d’audit. La gestion exhaustive des comptes, paiements, offres et contenus administrables reste à compléter.

## Écrans métier connectés — implémenté, non vérifié en conditions réelles

- `/publier` charge catégories/villes/quartiers depuis `/api/reference`, crée une annonce persistante, téléverse la photo locale puis soumet l’annonce à modération. États chargement, erreur et confirmation ajoutés sans refonte graphique.
- `/mes-annonces` et `/favoris` utilisent des listes API avec états chargement, vide, erreur et accès non authentifié; les stores navigateur ne sont plus utilisés par ces écrans.
- La route média propriétaire ajoute suppression, ordre et choix de couverture avec contrôle serveur et journalisation.
- `docs/COVERAGE_MATRIX.md` distingue explicitement implémentation et validation en conditions réelles.

## Recherche et demandes connectées — implémenté, compilation vérifiée

- `/recherche` n’importe plus le catalogue simulé ni le store navigateur. Les critères URL sont traduits vers `/api/search`; chargement, vide et erreur sont rendus dans le design existant.
- `/mes-demandes` n’utilise plus `leads-store`; les demandes authentifiées sont chargées depuis `/api/leads`, avec chargement, vide, erreur et accès refusé.
- La carte n’affiche aucun marqueur inventé tant que les coordonnées PostgreSQL ne sont pas exploitées.
- Premier `npm run lint` échoué sur `react-hooks/set-state-in-effect` dans `recherche-results.tsx`; correction appliquée, lint suivant réussi sans erreur.
- `npm run build` réussi. Validation réelle toujours bloquée par l’absence de PostgreSQL accessible.

## Séparation administrateur / modérateur — implémentée, non testée sur base réelle

- Gestion des rôles, suspension/réactivation et vérification email réservée à `ADMIN` avec `adminMfaEnabled=true`; la suspension révoque les sessions.
- Validation, rejet et suspension d’agence réservés à l’administrateur renforcé.
- Les modérateurs conservent la modération de contenu sans pouvoir gérer comptes ou agences.
- Chaque action produit une entrée `AuditLog`.
- Build réussi; comportement runtime non vérifié faute de PostgreSQL accessible.

## Base locale, comptes de validation et MFA administrateur — vérifiés sur PostgreSQL

- PostgreSQL 17 local installé et démarré; migrations initiale et MFA appliquées sur `ogooue_habitat`.
- Cinq comptes temporaires de développement créés directement dans la base, sans identifiants dans Git: particulier, propriétaire, responsable d’agence, modérateur et administrateur.
- Une agence et trois annonces portant le préfixe `[DÉMO DEV]` créées uniquement dans la base locale.
- Cinq connexions vérifiées via l’API. Refus et capacités propres aux rôles vérifiés: publication interdite au particulier, annonces accessibles au propriétaire, invitations accessibles au responsable, file de modération accessible au modérateur, gestion des comptes interdite au modérateur.
- Parcours `/connexion` puis `/admin` vérifié avec le compte administrateur.
- Enrôlement TOTP ajouté sous `/admin/securite`: secret en attente chiffré AES-GCM, activation seulement après validation d’un vrai code, puis validation requise par session pour les actions sensibles.
- Code TOTP invalide refusé; aucune activation MFA forcée et compte laissé en attente de configuration par son utilisateur.
