# Massive Dashboard

SvelteKit dashboard for the Massive.com Stocks and Economy APIs. The app is protected by a generic OpenID Connect provider, uses PostgreSQL through Drizzle, and exposes an admin-only interface for market status, movers, snapshots, tickers, filings, fundamentals, corporate actions, news, ticker detail pages, and economy pages (treasury yields, inflation, inflation expectations, labor market).

## Stack

- SvelteKit with `@sveltejs/adapter-node`
- Svelte 5, Tailwind CSS, shadcn-svelte, and `@lucide/svelte`
- PostgreSQL, Drizzle ORM, and Drizzle Kit migrations
- Generic confidential OpenID Connect client with server-side application sessions
- Massive.com Stocks and Economy APIs
- Vitest, svelte-check, ESLint, and Prettier

## Environment

Create `.env` from `.env.example` and fill in the deployment-specific values:

```bash
DATABASE_URL="postgres://user:password@host:5432/db-name"
MASSIVE_API_KEY="your-massive-api-key"
ORIGIN="https://stocks.example.com"
OIDC_ISSUER="https://identity.example.com/application/o/massive-dashboard/"
OIDC_CLIENT_ID="massive-dashboard"
OIDC_CLIENT_SECRET="provider-issued-client-secret"
```

Required variables are `DATABASE_URL`, `MASSIVE_API_KEY`, `ORIGIN`, `OIDC_ISSUER`, `OIDC_CLIENT_ID`, and `OIDC_CLIENT_SECRET`. No other authentication variables are used.

## Authentication Setup

Massive Dashboard is a confidential OIDC web client using Authorization Code flow with one-time server-side state, nonce validation, and PKCE S256. After the callback, it creates an opaque app-local server-side session; the provider's application access policy is the sole admission control for this admin-only dashboard, with no application email, group, subject, identity, or claim allowlist.

- Public Client: Off
- Callback path: `/auth/callback`
- Application logout path: `/auth/logout` (POST)
- Post-logout path: `/auth/logged-out`
- Authentication environment: use the required and optional variables listed once under Environment above.

Set `ORIGIN` to the final public HTTPS origin. No production origin is committed; if production uses `https://stocks.example.com`, register callback URL `https://stocks.example.com/auth/callback` and post-logout URL `https://stocks.example.com/auth/logged-out`. Logout uses the provider's advertised RP-Initiated Logout endpoint and the application does not implement back-channel logout.

The app requests only the `openid` scope, never requests `offline_access`, and never performs refresh requests. Access and refresh tokens are discarded after the code exchange; only the raw ID token remains in the server-side session, solely as `id_token_hint`, and is deleted with that session. The browser cookie contains only a random opaque token whose hash is stored in PostgreSQL. Sessions have a 24-hour sliding idle timeout extended only by explicit same-origin signals from trusted pointer, keyboard, or click activity—not navigation, probes, polling, prefetch, or passive traffic—and a fixed seven-day absolute lifetime.

Manual provider/deployment handoff:

1. Create a confidential web application with Public Client Off, Authorization Code enabled, and the exact callback and post-logout URLs derived from `ORIGIN` above.
2. Ensure discovery advertises PKCE `S256` and `end_session_endpoint`.
3. Apply the provider's access policy to admit only the administrator or administrators; do not reproduce that policy with application claims.
4. Set the required environment variables in the deployment secret manager, run `pnpm db:migrate`, and deploy. The migration removes obsolete local-account/session records without changing dashboard data or Massive API behavior.

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

The server startup hook runs Drizzle migrations before handling requests. You can still run `pnpm db:migrate` manually during deployment if your platform supports a pre-deploy command; it is idempotent with the startup migration.

For Coolify/Nixpacks deployments:

- Base directory: repository root
- Build command: `pnpm build`
- Start command: `node build`
- Publish directory: leave empty for adapter-node
- Set `DATABASE_URL`, `MASSIVE_API_KEY`, `ORIGIN`, `OIDC_ISSUER`, `OIDC_CLIENT_ID`, and `OIDC_CLIENT_SECRET`.
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
    - `MASSIVE_API_KEY` — Massive.com API key
    - `ORIGIN` — Public HTTPS URL of the deployed app
    - `OIDC_ISSUER` — OIDC issuer URL used for provider discovery
    - `OIDC_CLIENT_ID` — Confidential client identifier
    - `OIDC_CLIENT_SECRET` — Confidential client secret
  - **Optional**
