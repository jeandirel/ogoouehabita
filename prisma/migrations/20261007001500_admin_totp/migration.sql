ALTER TABLE "User"
  ADD COLUMN "adminMfaSecretEncrypted" TEXT,
  ADD COLUMN "adminMfaPendingEncrypted" TEXT;

ALTER TABLE "Session"
  ADD COLUMN "adminMfaVerifiedAt" TIMESTAMP(3);
