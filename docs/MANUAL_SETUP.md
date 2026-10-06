# Configurations manuelles restantes

Ce fichier liste uniquement les interventions externes à effectuer hors développement.

## Domaine et HTTPS

- Acheter/configurer le domaine de production.
- Pointer les DNS vers le serveur Ubuntu.
- Configurer les variables: `NEXT_PUBLIC_APP_URL`, `COOKIE_DOMAIN` si sous-domaines utilisés.
- Vérifier: ouvrir le domaine en HTTPS, cadenas valide, redirection HTTP→HTTPS.

## Email transactionnel

- Ouvrir un compte fournisseur SMTP/API compatible production.
- Renseigner: `EMAIL_PROVIDER`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `EMAIL_FROM`.
- Configurer SPF, DKIM et DMARC.
- Vérifier: inscription d’un compte test et réception email de vérification.

## SMS / OTP téléphone

- Choisir un prestataire SMS couvrant le Gabon.
- Renseigner: `SMS_PROVIDER`, `SMS_API_KEY`, `SMS_SENDER_ID`.
- Vérifier: demande OTP sur numéro de test, expiration et limitation renvoi.

## OAuth Google

- Créer application OAuth Google.
- Callback prévu: `https://votre-domaine/api/auth/callback/google`.
- Renseigner: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.
- Vérifier: connexion Google avec compte test.

## OAuth Facebook

- Créer application Facebook Login.
- Callback prévu: `https://votre-domaine/api/auth/callback/facebook`.
- Renseigner: `FACEBOOK_CLIENT_ID`, `FACEBOOK_CLIENT_SECRET`.
- Vérifier: connexion Facebook avec compte test.

## Paiements Gabon

- Choisir le ou les prestataires disponibles au Gabon.
- Obtenir clés sandbox puis production.
- Renseigner: `PAYMENT_PROVIDER`, `PAYMENT_PUBLIC_KEY`, `PAYMENT_SECRET_KEY`, `PAYMENT_WEBHOOK_SECRET`.
- URL webhook prévue: `https://votre-domaine/api/payments/webhook`.
- Vérifier: paiement sandbox, webhook signé reçu, facture générée, idempotence en rejouant le webhook.

## Cartes / géocodage

- Choisir fournisseur carte compatible Gabon.
- Renseigner: `NEXT_PUBLIC_MAP_PROVIDER`, `NEXT_PUBLIC_MAP_API_KEY`, éventuelle `GEOCODING_API_KEY`.
- Vérifier: carte charge sans exposer de clé secrète; aucune coordonnée inventée pour les annonces non géocodées.

## Stockage médias

- Provisionner stockage persistant local ou objet S3-compatible.
- Renseigner: `MEDIA_STORAGE_DRIVER`, `MEDIA_PUBLIC_BASE_URL`, `S3_ENDPOINT`, `S3_BUCKET_PUBLIC`, `S3_BUCKET_PRIVATE`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`.
- Vérifier: upload photo publique, document privé non accessible sans autorisation, suppression média inutilisé.

## Premier administrateur

- Exécuter la commande documentée de création du premier administrateur sur le serveur.
- Utiliser une adresse email personnelle contrôlée et activer MFA dès disponibilité.
- Vérifier: connexion admin, accès tableau de bord, action sensible journalisée.

## Sauvegardes

- Choisir emplacement externe sécurisé pour sauvegardes chiffrées.
- Renseigner: `BACKUP_TARGET`, `BACKUP_ENCRYPTION_KEY`, fréquence cron souhaitée.
- Vérifier: restauration testée sur environnement séparé.
