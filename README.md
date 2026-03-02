# Forum

A minimal forum web app monorepo (Next.js client, NestJS server).

## Repository layout

| Path | Description |
|------|-------------|
| [apps/client](apps/client) | Next.js 16 frontend (React 19), port 3000 |
| [apps/server](apps/server) | NestJS 11 backend, port 8080 |

## Getting started

Prerequisites: Node.js LTS and a MongoDB instance.

```bash
npm install
```

```bash
npm run dev:client   # start client on port 3000
npm run dev:server   # start server on port 8080
```

Copy `.env.example` to `.env.local` in each app and fill in the values before starting.

## Root scripts

```bash
npm run build    # build all workspaces
npm run tsc      # type-check client and server
npm run lint     # lint and autofix client and server
npm run format   # format client and server
npm run test     # run tests across all workspaces
```
