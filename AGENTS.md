# Repository Guidelines

## Project

- Full-stack TypeScript monorepo managed with pnpm workspaces.
- `apps/api`: Express API with layered route, controller, service, and repository modules.
- `apps/web`: React SPA built with Vite.
- `packages/contracts`: shared transport contracts only; keep business rules in the API.
- `database`: numbered SQL migrations and optional seeds.

## Commands

- Install dependencies with `pnpm install`.
- Run both applications with `pnpm dev`.
- Validate changes with `pnpm lint`, `pnpm typecheck`, and `pnpm test`.
- Build all workspaces with `pnpm build`.
- Run browser tests with `pnpm e2e`.

## Development Rules

- Use TypeScript and follow the existing module structure and local coding style.
- Keep changes minimal and do not place API business logic in shared contracts.
- Add a numbered migration for every database schema change.
- Never commit `.env` files or credentials; update the relevant `.env.example` instead.
- Run the checks relevant to the changed workspaces before finishing.

## Authorization

- RBAC uses atomic permission keys in the `<entity>:<action>` format.
- Roles group permissions; users may hold multiple roles through `user_roles`.
- Protect API routes with `authenticate` followed by `checkPermission([...])`; do not authorize by role name.
- Keep resource ownership checks in the service layer. Use the corresponding `*:access-any` permission for global resource access.
- The JWT carries the effective roles and permissions. The frontend helper `checkPermission(token, permission)` is only for UI visibility; the API is the authorization authority.
- Keep the permission catalog fixed in migrations. Any new protected action requires a catalog entry, role assignments, route protection, contracts, documentation, and tests.

## Versioned Push

- Use `pnpm push` instead of `git push` for normal project pushes.
- `pnpm push` requires a clean working tree, increments the root patch version, creates a `chore: bump version to X.Y.Z` commit, and then pushes.
- Forward normal Git push arguments after the script, for example `pnpm push -- origin main`.
- If the network push fails, run `pnpm push` again. The pending bump is recorded under `.git`, so a retry does not create another version commit.
- Use `pnpm version:bump minor` or `pnpm version:bump major` only when a non-patch release is explicitly required.
