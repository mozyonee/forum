# AGENTS.md

This file provides guidance to AI Agents when working with code in this repository.

## Project Overview

Minimal forum web app — npm workspaces monorepo with two apps:
- `apps/client` — Next.js 16 + React 19 frontend (port 3000)
- `apps/server` — NestJS 11 backend (port 8080)

Shared root dependencies: `class-transformer`, `rxjs`.

## Environment Setup

Copy `.env.example` → `.env.local` in each app before starting.

**Client env vars:** `NEXT_PUBLIC_SERVER_URL`, `EDGE_STORE_ACCESS_KEY`, `EDGE_STORE_SECRET_KEY`
**Server env vars:** `MONGODB_URI`, `CLIENT_URL`, `JWT_SECRET`

## Commands

```bash
# Install
npm install

# Dev (run each in its own terminal)
npm run dev:client       # Next.js on port 3000
npm run dev:server       # NestJS on port 8080

# Workspace-wide
npm run build            # build all
npm run tsc              # type-check all
npm run lint             # lint + autofix all
npm run format           # format all
npm run test             # test all

# Server-only test variants (run from apps/server)
npm test                 # jest unit tests
npm run test:watch       # watch mode
npm run test:cov         # with coverage
npm run test:e2e         # e2e tests (jest-e2e.json config)
```

## Architecture

### Backend (NestJS)

Feature-based modules in `apps/server/src/`: `auth/`, `users/`, `posts/`.
Each module has a controller, service, and a `define/` subdirectory containing the Mongoose schema.

- **Auth**: JWT tokens signed with `JWT_SECRET`, stored in the client as HTTP-only cookies. `GET /auth/me` is the session-verify endpoint.
- **Database**: MongoDB via Mongoose. Schemas live in `<module>/define/`.
- **Rate limiting**: Global throttler guard (3 req / 1000ms).
- **CORS**: Enabled, origin set to `CLIENT_URL` env var.

**Data models:**
- `User` — `username`, `email`, `authentication.{salt,password}` (`select: false`), `following[]`
- `Post` — `parent` (reply threading), `author`, `text`, `likes[]`, `reposts[]`, `attachments[]`, `date`

### Frontend (Next.js)

App Router (`apps/client/src/app/`). Key conventions:

- **Middleware** (`src/proxy.ts`): redirects `/settings` → `/authenticate` when unauthenticated; redirects `/authenticate` → `/` when already authenticated.
- **API helpers** (`src/helpers/`): Axios instance with `NEXT_PUBLIC_SERVER_URL` as base, `withCredentials: true`, `Authorization: Bearer <token>` header. Server-side helpers use `"use server"` directive.
- **File uploads**: EdgeStore integration via `app/api/edgestore/` route.
- **Types** (`src/types/`): shared TypeScript interfaces for User, Post, etc.
- **Validation**: Zod schemas for form data.

## Code Style

Prettier config (shared): tabs, tab width 4, print width 120, trailing commas.
ESLint: Next.js ESLint config for client; TypeScript ESLint for server.
TypeScript: strict mode on client; relaxed on server.

## Pre-commit Hooks

Husky runs on every commit: `format → tsc → lint → test → git add -A`. All checks must pass.

## CI/CD

GitHub Actions (`.github/workflows/ci.yml`) triggers on push to `dev` and all PRs: install → build → tsc → lint → test.
