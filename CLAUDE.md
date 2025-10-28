# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a "Pair Programming Lottery" application - a monorepo using pnpm workspaces, Turborepo, and modern TypeScript tooling. The application randomly pairs developers for pair programming sessions.

**Tech Stack:**
- Backend: Node.js HTTP server with oRPC (type-safe RPC framework)
- Frontend: React 19 + TanStack Router + Vite + Tailwind CSS 4
- Monorepo: Turborepo + pnpm workspaces
- Type Safety: Zod schemas shared between frontend and backend via oRPC

## Development Commands

**Package Manager:** pnpm (v10.18.2+)
**Node Version:** >=20.19.0

### Root Level
```bash
pnpm dev           # Run all apps in dev mode (backend + web)
pnpm build         # Build all apps
pnpm lint          # Lint all apps
```

### Backend (`apps/backend`)
```bash
cd apps/backend
pnpm dev           # Start dev server with tsx watch on port 3001
pnpm build         # Build with tsup (outputs to dist/)
pnpm start         # Run production build
pnpm lint          # Run ESLint with auto-fix
pnpm type-check    # TypeScript type checking
```

### Web (`apps/web`)
```bash
cd apps/web
pnpm dev           # Start Vite dev server
pnpm build         # TypeScript check + Vite production build
pnpm preview       # Preview production build
pnpm lint          # Run ESLint with auto-fix
pnpm type-check    # TypeScript type checking
```

## Architecture

### Type-Safe RPC Communication

The application uses **oRPC** for end-to-end type safety between backend and frontend:

1. **Backend Router** (`apps/backend/src/router.ts`): Exports a typed router with procedures
2. **Frontend Client** (`apps/web/src/lib/api-client.ts`): Imports the backend Router type directly from `@repo/backend/src/router`
3. **Type Flow**: Zod schemas → oRPC procedures → Frontend gets full TypeScript autocomplete and type checking

Example:
```typescript
// Backend: apps/backend/src/router.ts
export const router = {
  generatePairing: os.output(PairingSchema).handler(() => {...}),
};
export type Router = typeof router;

// Frontend: apps/web/src/lib/api-client.ts
import type { Router } from '@repo/backend/src/router';
export const apiClient: RouterClient<Router> = createORPCClient(link);

// Usage in components gets full type safety:
const pairing = await apiClient.generatePairing(); // Typed!
```

### Monorepo Structure

```
apps/
  backend/       # Node.js HTTP server with oRPC
  web/          # React SPA with TanStack Router
packages/
  eslint-config/   # Shared ESLint configuration
  typescript-config/  # Shared TypeScript configs (base.json, node.json, react.json)
```

### Backend Architecture (`apps/backend`)

- **Entry Point:** `src/index.ts` - HTTP server with oRPC handler at `/rpc` prefix
- **Router:** `src/router.ts` - oRPC procedures (health, getUsers, generatePairing)
- **Services:** `src/services/users.ts` - Business logic (user decoding, pairing generation)
- **Types:** `src/types/` - Zod schemas for validation
- **Build:** tsup bundles `index.ts` and `router.ts` to `dist/` as ESM with source maps

**Important:** The backend exports `router.ts` as a build entry point so the frontend can import types without bundling backend code.

### Database Schema

The application uses SQLite as the database provider. The schema consists of a single `History` table that stores the pairing history:

- `id`: Auto-incrementing primary key
- `firstWinnerName`: Name of the first winner in the pair
- `firstWinnerGithub`: GitHub username of the first winner
- `secondWinnerName`: Name of the second winner in the pair
- `secondWinnerGithub`: GitHub username of the second winner
- `createdAt`: Timestamp when the pairing was created

Indexes are set on `firstWinnerGithub` and `secondWinnerGithub` for efficient querying.

### Frontend Architecture (`apps/web`)

- **Router:** TanStack Router (file-based routing in `src/routes/`)
- **Root Route:** `src/routes/__root.tsx` - Layout wrapper
- **Home Route:** `src/routes/index.tsx` - Main pairing lottery UI
- **Components:** `src/components/` - Reusable UI components (shadcn/ui-based)
- **API Client:** `src/lib/api-client.ts` - oRPC client with type safety
- **Styling:** Tailwind CSS 4 with CSS-first approach

### Data Flow

1. User clicks "Run the Gamble!" button in `apps/web/src/routes/index.tsx`
2. Frontend calls `apiClient.generatePairing()` (fully typed via oRPC)
3. Backend `apps/backend/src/router.ts` handles the request
4. `apps/backend/src/services/users.ts` decodes base64-encoded user data and generates random pairing
5. Backend returns typed `Pairing` object (validated with Zod)
6. Frontend receives typed response and updates UI

## Key Technical Details

### User Data Management
Users are stored as base64-encoded JSON in `apps/backend/src/services/users.ts`. The data is decoded, validated with Zod, and cached on first access. Users have an `active` flag - only active users are eligible for pairing.

### Path Aliases
Both apps use `@/` path alias for `src/`:
```typescript
import { router } from '@/router';
import { Button } from '@/components/ui/button';
```

### Shared Packages
- `@repo/eslint-config`: ESLint config using flat config format with TypeScript ESLint
- `@repo/typescript-config`: Shared tsconfig.json files (base, node, react)
- `@repo/backend`: Backend package imported by frontend for type definitions only

### Turborepo Task Dependencies
- `build` tasks have `^build` dependency (build dependencies first)
- `lint` depends on `^build`
- `dev` is persistent and uncached

## Environment Variables

**Backend:**
- `PORT` - Server port (default: 3001)

**Frontend:**
- `VITE_API_URL` - Backend RPC URL (default: http://localhost:3001/rpc)

## Instructions for Claude Code

When editing code in this repository, please follow these guidelines:
- Maintain type safety with TypeScript and Zod schemas
- Preserve the oRPC type-safe communication pattern between backend and frontend
- Follow the established project structure and conventions
- Ensure that any changes to shared types or schemas are reflected in both backend and frontend
- Write declarative code with clear function and variable names
- Don't create comments for obvious code; focus on clarity through code itself
- Always prefer types over interfaces (example `type User = { ... }` instead of `interface User { ... }`)
