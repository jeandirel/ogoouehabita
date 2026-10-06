<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->


## Ogooué Habitat — notes de reprise

- Les données existantes (`data/*`, `data/local/*`) sont des démonstrations ou locales navigateur, pas une source de production.
- Socle PostgreSQL/Prisma: `prisma/schema.prisma`, migration initiale et seed isolé dans `prisma/seed.ts`.
- Vérifications courantes: `DATABASE_URL=... npx prisma validate`, `npm run lint`, `npm run build`.
- Ne modifiez pas le design; les nouveaux parcours doivent réemployer les styles/composants actuels.
