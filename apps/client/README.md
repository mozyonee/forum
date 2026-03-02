# Client

Next.js 16 (React 19) frontend for Forum. Runs on port 3000.

## Commands

```bash
npm run dev          # dev server
npm run build        # production build
npm run start        # production server
npm run lint         # ESLint --fix over src/
npm run format       # Prettier over src/**/*.{ts,tsx}
npm run typecheck    # TypeScript check without emitting
```

## Environment

Copy `.env.example` to `.env.local` and fill values:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SERVER_URL` | Base URL of the server API (default `http://localhost:8080`) |
| `EDGE_STORE_ACCESS_KEY` | EdgeStore access key for file uploads |
| `EDGE_STORE_SECRET_KEY` | EdgeStore secret key for file uploads |

## Architecture

### Routing

App Router. `apps/client/src/proxy.ts` protects routes — unauthenticated users are redirected to `/authenticate`, authenticated users are redirected away from `/authenticate`.

### State

React context via `UserProvider` (`src/helpers/authentication/context.tsx`). `useUser()` returns `{ user, setUser }`. Session is created only on login/register; calling `setUser(null)` clears the cookie via `deleteSession()`.

### Authentication flow

On login/register, the server returns `{ token }`. The client stores it in an HTTP-only cookie named `session` via `createSession()`. `verifySession()` validates the token by calling `GET /auth/me` on the server — there is no client-side JWT verification.

### API layer

Single Axios instance from `src/helpers/api.ts` with `baseURL` from `NEXT_PUBLIC_SERVER_URL` and `withCredentials: true`. All API calls go through this instance.

### Path alias

`@/*` maps to `src/*` (configured in `tsconfig.json`).
