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
