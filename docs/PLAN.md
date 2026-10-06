# Plan priorisé de mise en production

## P0 — Socle fiable

1. Stabiliser lint/build sans modification visuelle.
2. Ajouter base PostgreSQL via Prisma ou couche SQL équivalente, migrations, seed démonstration isolé.
3. Ajouter Docker Compose de développement/production avec volumes persistants.
4. Créer variables d’environnement typées et documentation.
5. Mettre en place journal d’audit et procédure de création du premier administrateur.

## P1 — Authentification et permissions

1. Inscription, vérification email, connexion, déconnexion, récupération mot de passe.
2. Sessions sécurisées, révocation globale, limitation tentatives/renvois.
3. Rôles: particulier, propriétaire, agent, responsable agence, modérateur, administrateur.
4. Middleware/API de contrôle serveur; tests négatifs accès croisé.
5. Préparer OAuth Google/Facebook, OTP email/téléphone et MFA admin sans les déclarer actifs avant clés externes.

## P2 — Annonces, médias et agences

1. Modèle annonces complet: brouillon, prévisualisation, modération, publication, expiration, renouvellement, archivé, vendu/loué.
2. Médias persistants: photos multiples, ordre, couverture, vidéos, liens visite virtuelle; documents privés séparés.
3. Agences: inscription, validation, page publique, équipe, invitations, attribution annonces/prospects.
4. Leads, demandes de contact, rendez-vous, messagerie et notifications.

## P3 — Recherche et expérience utilisateur

1. Recherche DB paginée avec filtres, tri, quartiers, carte sans inventer de coordonnées.
2. Favoris, comparaison, recherches sauvegardées et alertes persistantes.
3. Recherche langage naturel traduite en critères vérifiables uniquement.
4. Accessibilité/mobile en conservant le design.

## P4 — Administration et monétisation

1. Admin connecté: utilisateurs, rôles, agences, annonces, médias, signalements, référentiels géographiques.
2. Offres, abonnements, quotas, mises en avant, promotions.
3. Paiements Gabon: prestataire choisi, webhooks signés, idempotence, historique, factures, remboursements.
4. Statistiques, exports, état intégrations.

## P5 — Exploitation

1. Docker production Ubuntu, HTTPS reverse proxy documenté.
2. Sauvegardes/restauration PostgreSQL et médias.
3. Healthchecks, logs, rotation, monitoring minimal.
4. Procédure de migration production avec sauvegarde préalable.
