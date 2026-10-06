#!/usr/bin/env bash
: "${DATABASE_URL:?DATABASE_URL est requis}"
BACKUP_DIR=${BACKUP_DIR:-backups}
mkdir -p "$BACKUP_DIR"
file="$BACKUP_DIR/ogooue-$(date -u +%Y%m%dT%H%M%SZ).dump"
pg_dump "$DATABASE_URL" --format=custom --no-owner --no-privileges --file="$file"
echo "$file"
