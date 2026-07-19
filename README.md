# Full-stack TypeScript Boilerplate

Base genérica y autónoma para aplicaciones con React, Express y PostgreSQL. Incluye autenticación JWT Bearer, roles, un CRUD de tareas, migraciones SQL, pruebas y CI.

## Stack

- Node.js 22 y pnpm workspaces
- React 19, Vite 7, React Router y Axios
- Express 5, Zod, PostgreSQL y JWT
- Vitest, Testing Library, Supertest y Playwright
- Docker Compose y GitHub Actions

## Estructura

```text
apps/
  api/                 API y arquitectura por capas
  web/                 SPA responsive
packages/
  contracts/           Contratos TypeScript compartidos
database/
  migrations/          Migraciones SQL versionadas
  seeds/               Datos opcionales
```

La API organiza cada módulo como `route -> controller -> service -> repository`. El módulo `tasks` es un ejemplo reemplazable: los usuarios acceden a sus propias tareas y los administradores pueden ver todas.

## Inicio rápido

Requisitos: Node.js 22+, pnpm 9+ y Docker.

```bash
pnpm install
cp apps/api/.env.example apps/api/.env
pnpm db:up
pnpm db:migrate
pnpm db:seed
pnpm dev
```

En PowerShell, reemplazá el comando `cp` por:

```powershell
Copy-Item apps/api/.env.example apps/api/.env
```

- Web: <http://localhost:5180>
- API: <http://localhost:3180>
- OpenAPI: <http://localhost:3180/docs>
- Liveness: <http://localhost:3180/health>
- Readiness: <http://localhost:3180/ready>

Registrá el primer usuario desde la interfaz. No se incluyen contraseñas ni usuarios predeterminados.

## Variables

La API carga `apps/api/.env`. Las variables obligatorias están documentadas en `apps/api/.env.example`:

- `DATABASE_URL`: conexión PostgreSQL.
- `JWT_SECRET`: secreto de al menos 32 caracteres; usá uno aleatorio en producción.
- `JWT_ISSUER` y `JWT_AUDIENCE`: validación del token.
- `CORS_ORIGIN`: orígenes permitidos separados por coma.

El frontend usa `VITE_API_URL`; por defecto consume `/api` mediante el proxy de Vite. El JWT se almacena en `localStorage`, según la estrategia Bearer elegida. Esta decisión exige una política CSP estricta y prevención de XSS en producción.

## Comandos

```bash
pnpm dev                 # API y web
pnpm build               # build de todos los paquetes
pnpm lint
pnpm typecheck
pnpm test
pnpm test:unit
pnpm test:integration
pnpm e2e
pnpm db:up
pnpm db:migrate
pnpm db:seed
pnpm db:reset
pnpm db:down
pnpm push                # incrementa patch, crea el commit y pushea
pnpm version:bump minor  # incremento manual: major, minor o patch
```

Las migraciones se aplican por nombre y se registran en `schema_migrations`. Para agregar una, creá el siguiente archivo numerado en `database/migrations` y ejecutá `pnpm db:migrate`.

`pnpm db:seed` crea o restablece los usuarios de desarrollo `admin@example.com` (`admin`) y `user@example.com` (`user`). Ambos usan la contraseña `Test12345!`; no uses estas credenciales en producción.

## Versionado

Usá `pnpm push` en lugar de `git push`. El comando requiere un árbol de trabajo limpio, valida el remoto, incrementa la versión `patch` del `package.json` raíz, crea un commit `chore: bump version to X.Y.Z` y finalmente ejecuta el push. Podés reenviar argumentos de Git con `pnpm push -- origin main`.

Si el push falla por un problema de red, ejecutá `pnpm push` nuevamente: el comando reutiliza el incremento pendiente y no crea otra versión. Para un cambio mayor, ejecutá `pnpm version:bump minor` o `pnpm version:bump major` y confirmá ese cambio antes del push versionado.

## Pruebas

Los tests unitarios no necesitan PostgreSQL. Las pruebas de integración se habilitan cuando existe `TEST_DATABASE_URL`.

```bash
docker compose --profile test up -d postgres-test
$env:DATABASE_URL='postgresql://postgres:postgres@localhost:5433/boilerplate_test'
$env:TEST_DATABASE_URL=$env:DATABASE_URL
pnpm db:migrate
pnpm test:integration
```

En Bash usá `export` en lugar de `$env:`. Playwright levanta el servidor Vite automáticamente.

## Seguridad

- Contraseñas hasheadas con bcrypt y nunca devueltas por la API.
- JWT HS256 con issuer, audience y expiración.
- Helmet, CORS explícito, límite global y límite reforzado en auth.
- Consultas SQL parametrizadas y validación Zod.
- Respuesta 404 uniforme para recursos inexistentes o ajenos.

Para múltiples réplicas, reemplazá el rate limiter en memoria por Redis. Si cambian roles críticos, reducí la vigencia del token o añadí revocación server-side.

## Extensión

Usá `tasks` como referencia para nuevos módulos. Compartí únicamente contratos de transporte estables en `packages/contracts`; las reglas de negocio deben permanecer en la API.
