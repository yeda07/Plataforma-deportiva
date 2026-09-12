# Competencias Platform

Monorepo inicial para una plataforma de competencias, eventos deportivos, predicciones gratuitas y rankings.

## Stack

- pnpm workspaces
- Turborepo
- Next.js App Router
- React
- TypeScript strict
- Tailwind CSS
- ESLint
- Prettier

## Estructura

```text
apps/
  web/
packages/
  ui/
  contracts/
  validation/
  config/
docs/
  architecture/
  ux/
  api/
```

## Comandos

```bash
pnpm dev
pnpm build
pnpm lint
pnpm type-check
```

## Docker frontend

El contenedor construye el monorepo y ejecuta únicamente `apps/web`.

```bash
docker compose up --build
```

Luego abre:

```text
http://localhost:3000
```

Variables disponibles:

```bash
NEXT_PUBLIC_APP_NAME="Competencias Platform"
NEXT_PUBLIC_WEB_URL="http://localhost:3000"
NEXT_TELEMETRY_DISABLED="1"
```

## Variables de entorno

Copia `.env.example` a `.env.local` en `apps/web` o configura las variables en tu entorno local.

No se deben guardar secretos en el repositorio.
