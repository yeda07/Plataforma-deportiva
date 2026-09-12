# Staging deployment

Este documento prepara el frontend para desplegarse en staging sin secretos en el repositorio.

## Entornos

La aplicación reconoce tres entornos públicos:

- `development`
- `staging`
- `production`

Usa como base los archivos:

- `.env.development.example`
- `.env.staging.example`
- `.env.production.example`

No subas archivos `.env` reales al repositorio.

## Variables requeridas

```bash
NEXT_PUBLIC_APP_ENV="staging"
NEXT_PUBLIC_APP_NAME="Competencias Platform Staging"
NEXT_PUBLIC_WEB_URL="https://staging.example.com"
NEXT_TELEMETRY_DISABLED="1"
```

`NEXT_PUBLIC_WEB_URL` debe apuntar al dominio público del entorno. En producción debe cambiarse por el dominio final.

## Build

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm type-check
pnpm test
pnpm build
```

## Start

Para ejecutar el build local de Next:

```bash
pnpm --filter @competencias-platform/web build
pnpm --dir apps/web exec next start -H 0.0.0.0 -p 3000
```

Luego abre:

```text
http://localhost:3000
```

## Docker

Construir y ejecutar con Docker Compose:

```bash
docker compose --env-file .env.staging.example up --build
```

La aplicación queda disponible en:

```text
http://localhost:3000
```

Para detener:

```bash
docker compose down
```

## Health check

Endpoint:

```text
/api/health
```

Respuesta esperada:

```json
{
  "app": "Competencias Platform Staging",
  "environment": "staging",
  "status": "ok"
}
```

Ejemplo:

```bash
curl -f https://staging.example.com/api/health
```

## Vercel

Crear un proyecto de Vercel conectado al repositorio.

Configuración recomendada:

- Framework: Next.js
- Install command: `pnpm install --frozen-lockfile`
- Build command: `pnpm build`
- Output: detectado automáticamente por Next.js
- Variables de entorno: cargar las variables de staging desde `.env.staging.example`

No configurar despliegue automático a producción todavía. Staging puede conectarse a previews o a una rama de staging cuando exista.

## Infraestructura Docker

Para una plataforma con Docker:

1. Construir la imagen con las variables públicas del entorno.
2. Publicar la imagen en el registry elegido.
3. Ejecutar el contenedor exponiendo el puerto `3000`.
4. Configurar el balanceador para consultar `/api/health`.
5. Promover a producción solo una imagen que haya pasado CI.

## Rollback básico

Vercel:

1. Abrir el proyecto en Vercel.
2. Ir a Deployments.
3. Seleccionar el despliegue estable anterior.
4. Usar Promote to Production o redeploy del despliegue anterior, según el entorno.

Docker:

1. Mantener tags inmutables por commit, por ejemplo `web:<commit-sha>`.
2. Si falla el release, volver al tag anterior estable.
3. Reiniciar el servicio.
4. Verificar `/api/health`.

Ejemplo:

```bash
docker pull registry.example.com/competencias-web:<previous-sha>
docker stop competencias-web
docker run -d --name competencias-web -p 3000:3000 registry.example.com/competencias-web:<previous-sha>
curl -f https://staging.example.com/api/health
```
