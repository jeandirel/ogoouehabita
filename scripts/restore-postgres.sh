#!/usr/bin/env bash
: "${DATABASE_URL:?DATABASE_URL est requis}"
: "${1:?Chemin du dump requis}"
pg_restore --clean --if-exists --no-owner --no-privileges --dbname="$DATABASE_URL" "$1"
