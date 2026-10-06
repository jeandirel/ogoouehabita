# Matrice de couverture — Ogooué Habitat

| Fonctionnalité | Utilisateur | Administration | Permissions / stockage | Implémenté | Vérifié réellement |
|---|---|---|---|---|---|
| Authentification | Inscription, session, mot de passe | Premier administrateur | Sessions et jetons hachés | Oui | Non : PostgreSQL/email indisponibles |
| Publication | Brouillon, photo, soumission | Modération API | Propriétaire/agence/modérateur | Oui, écran connecté | Non : PostgreSQL indisponible |
| Mes annonces | Chargement, vide, erreur, accès refusé | N/A | Propriétaire/membre agence | Oui, écran connecté | Non : PostgreSQL indisponible |
| Favoris | Chargement, vide, erreur, accès refusé | N/A | Par compte, contrainte composite | Oui, écran connecté | Non : PostgreSQL indisponible |
| Demandes | Liste connectée, chargement/vide/erreur | Prospect propriétaire/agence | Accès relationnel | Oui, écran connecté | Non : PostgreSQL indisponible |
| Recherche | Liste connectée, filtres, chargement/vide/erreur | N/A | Annonces publiées uniquement | Oui, écran connecté | Non : PostgreSQL indisponible |
| Médias | Image/document local | Contrôle propriétaire/agence | Volume, accès privé, audit | API upload/ordre/couverture/suppression | Non : volume + PostgreSQL indisponibles |
| Agences | Création, invitation | Validation à compléter | Membre/invitation expirante | Partiel | Non : PostgreSQL indisponible |
| Modération | Soumission | File/publication/refus | Modérateur/admin séparés | Partiel | Non : PostgreSQL indisponible |
| Paiements/abonnements | Non exposé | Non exposé | Schéma seul | Non | Non |
