# Critères de validation

## Vérifications automatiques minimales

- `npm run lint` doit réussir sans erreur.
- `npm run build` doit réussir.
- Les migrations doivent s’appliquer sur une base vide.
- Le seed de démonstration doit être optionnel et identifiable.

## Sécurité et permissions

- Un utilisateur ne peut lire/modifier que ses données privées.
- Un membre d’agence ne peut gérer que les annonces/prospects de ses agences autorisées.
- Les rôles modérateur/admin sont contrôlés côté serveur, pas seulement dans l’UI.
- Toute action sensible admin requiert confirmation et journalisation.
- Les documents privés ne sont jamais servis comme médias publics.

## Parcours utilisateur

- Inscription → vérification email → connexion → session persistante → déconnexion.
- Mot de passe oublié → token expirant → changement mot de passe → révocation sessions.
- Création brouillon annonce → ajout médias → prévisualisation → soumission modération → publication.
- Contact annonce → suivi prospect côté propriétaire/agence.
- Favori, comparaison, recherche sauvegardée et alerte persistants.

## Paiements

- Aucun paiement réussi ne peut être simulé en production.
- Webhook vérifié cryptographiquement.
- Traitement idempotent par identifiant transaction/prestataire.
- Facture/historique consultable après paiement confirmé.

## Exploitation

- Déploiement reproductible sur Ubuntu avec Docker.
- Volumes persistants documentés.
- Sauvegarde et restauration testées en développement.
