# Server

NestJS 11 backend for Forum. Runs on port 8080.

## Commands

```bash
npm run dev          # watch-mode dev server
npm run build        # nest build → dist/
npm run start        # node dist/main (production)
npm run lint         # ESLint --fix over src & test
npm run format       # Prettier over src & test
npm run typecheck    # TypeScript check without emitting
npm run test         # Jest unit tests (*.spec.ts)
npm run test:watch   # Jest in watch mode
npm run test:cov     # Jest with coverage report
```

## Environment

Copy `.env.example` to `.env.local` and fill values:

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | JWT signing and verification secret |
| `AUTH_SECRET` | HMAC secret for password hashing |
| `CLIENT_URL` | Client origin (used for CORS) |

## Architecture

### Module structure

Each domain is a NestJS module following the controller → service → entity pattern:

| Module | Responsibility |
|--------|----------------|
| `auth` | Register, login, JWT signing, HMAC password hashing, `GET /auth/me` session verification |
| `users` | User CRUD, follow/unfollow, search |
| `posts` | Post CRUD, likes, reposts, replies, search |

### Authentication

On login/register, `AuthService` signs a JWT with the user payload (`_id`, `username`, `email`, `following`) and returns `{ token }`. `GET /auth/me` accepts a `Bearer` token and returns the decoded payload — used by the client to verify sessions without sharing `JWT_SECRET`.

### CORS

Configured in `src/main.ts` via `app.enableCors()`. Allowed origin is read from `CLIENT_URL` env var.

### Path aliases

Bare `src/…` imports are resolved by `tsconfig-paths` at test time and by the NestJS CLI at build time.
