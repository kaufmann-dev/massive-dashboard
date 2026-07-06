# Massive Dashboard

SvelteKit dashboard for the Massive.com Stocks API. The app is protected by Better Auth, uses PostgreSQL through Drizzle, and exposes an admin-only interface for market status, movers, snapshots, tickers, filings, fundamentals, corporate actions, news, and ticker detail pages.

## Stack

- SvelteKit with `@sveltejs/adapter-node`
- Svelte 5, Tailwind CSS, shadcn-svelte, and `@lucide/svelte`
- PostgreSQL, Drizzle ORM, and Drizzle Kit migrations
- Better Auth with a single seeded admin account
- Massive.com Stocks API
- Vitest, svelte-check, ESLint, and Prettier

## Environment

Create `.env` from `.env.example` and fill in the deployment-specific values:

```bash
DATABASE_URL="postgres://user:password@host:5432/db-name"
MASSIVE_API_KEY="your-massive-api-key"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="change-me-at-least-12-chars"
BETTER_AUTH_SECRET="generate-a-random-secret"
ORIGIN="https://stocks.example.com"
```

`ADMIN_PASSWORD` must be at least 12 characters. The app seeds this admin account on startup and updates the stored password hash if the password is rotated.

Use `BETTER_AUTH_URL` when Better Auth should use a different public base URL than `ORIGIN`. Otherwise `ORIGIN` is used as the Better Auth base URL.

## Development

Install dependencies:

```bash
pnpm install
```

Start the local PostgreSQL database with Podman:

```bash
podman run \
  --name postgres-sveltekit \
  --env-file .env \
  --publish 5432:5432 \
  --volume postgres-sveltekit-data:/var/lib/postgresql/data \
  --detach \
  postgres:18-alpine
```

Run migrations and start the app:

```bash
pnpm db:migrate
pnpm dev
```

Useful commands:

```bash
pnpm check
pnpm lint
pnpm test
pnpm build
pnpm db:generate
pnpm db:migrate
```

## Deployment

Build command:

```bash
pnpm build
```

Runtime command:

```bash
node build
```

The project uses SvelteKit adapter-node, so production output is written to `build/`. Provide the environment variables listed above in the hosting platform. In production, do not rely on a checked-in `.env` file; set variables in the platform UI or secret manager.

The server startup hook runs Drizzle migrations and seeds the admin account before handling requests. You can still run `pnpm db:migrate` manually during deployment if your platform supports a pre-deploy command, but it is idempotent with the startup migration.

For Coolify/Nixpacks deployments:

- Base directory: repository root
- Build command: `pnpm build`
- Start command: `node build`
- Publish directory: leave empty for adapter-node
- Set `DATABASE_URL`, `MASSIVE_API_KEY`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `BETTER_AUTH_SECRET`, and `ORIGIN`
- Ensure the PostgreSQL database is provisioned separately and reachable from the app container

If the app is behind a reverse proxy, set `ORIGIN` to the final public HTTPS URL. If the platform requires forwarded headers instead, configure them according to SvelteKit adapter-node hosting rules.

## Verification

Before finishing changes, run:

```bash
pnpm check
pnpm lint
pnpm build
pnpm db:migrate
```

## Coolify Deployment

- **Build Pack**: Nixpacks
- **Base Directory**: `/`

The build and start commands are handled by `nixpacks.toml`. The runtime is pinned via `engines.node` in `package.json` — do **not** set `NIXPACKS_NODE_VERSION` in Coolify environment variables.

- **Environment Variables**
  - **Required**
    - `DATABASE_URL` — PostgreSQL connection string
    - `MASSIVE_API_KEY` — Massive.com Stocks API key
    - `ADMIN_EMAIL` — Admin account email
    - `ADMIN_PASSWORD` — Admin account password (minimum 12 characters)
    - `BETTER_AUTH_SECRET` — Session signing secret
    - `ORIGIN` — Public HTTPS URL of the deployed app
  - **Optional**
    - `BETTER_AUTH_URL` — Override auth base URL (defaults to `ORIGIN`)
