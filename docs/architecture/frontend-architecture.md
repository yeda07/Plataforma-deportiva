# Frontend Architecture

La aplicacion web usa una arquitectura basada en features dentro de `apps/web/src`.

## Estructura

```text
src/
  app/
  components/
    layout/
    shared/
  features/
    auth/
    matches/
    competitions/
    predictions/
    rankings/
    explore/
    profile/
    notifications/
  services/
  repositories/
  mocks/
  hooks/
  lib/
  config/
  providers/
```

## Responsabilidades

`app` contiene rutas, layouts y entrypoints de Next.js App Router. Debe componer features y componentes, pero no concentrar logica de negocio.

`components` contiene UI reutilizable que no pertenece a un dominio especifico. `layout` agrupa estructura visual de pagina y `shared` agrupa piezas genericas.

`features` contiene modulos funcionales por dominio de producto. Cada feature puede crecer con `components`, `services`, `hooks`, `types` y `utils` cuando exista una necesidad real.

`services` contiene clientes de aplicacion e integraciones tecnicas. Los componentes de presentacion no deben hacer llamadas HTTP directas.

`repositories` contiene contratos de acceso a datos desde la perspectiva del frontend. En el futuro puede conectar mocks, API NestJS o cache sin cambiar la UI.

`contracts` vive en `packages/contracts` y define tipos compartidos entre aplicaciones y paquetes. Es el lugar para contratos estables entre frontend y backend.

`mocks` contiene datos simulados y utilidades locales para desarrollo mientras no exista la API real.

`hooks` contiene hooks reutilizables transversales. Los hooks propios de una feature deben vivir dentro de esa feature.

`lib` contiene utilidades de bajo nivel y helpers sin dependencia de UI ni dominio.

`config` contiene configuracion publica de frontend, banderas de features y constantes de composicion.

`providers` contiene providers globales de React, como clientes de datos, temas, autenticacion o estado global cuando se agreguen.

## Aliases

```text
@/              -> apps/web/src/
@components/    -> apps/web/src/components/
@features/      -> apps/web/src/features/
@lib/           -> apps/web/src/lib/
```

Los imports hacia paquetes compartidos usan el namespace `@competencias-platform/*`.

## Estados de interfaz

Las vistas criticas deben representar estados de interfaz mediante componentes reutilizables en `components/shared`:

- `LoadingState`
- `EmptyState`
- `ErrorState`
- `OfflineState`
- `UnauthorizedState`
- `ForbiddenState`

Los skeletons deben pasarse como contenido de `LoadingState` cuando la pantalla necesite una silueta especifica. Las paginas no deben duplicar tarjetas de error, vacio u offline.

Durante desarrollo se puede simular un estado agregando el query param `uiState`:

```text
?uiState=loading
?uiState=empty
?uiState=error
?uiState=offline
?uiState=unauthorized
?uiState=forbidden
?uiState=loaded
```

La simulacion se ignora en produccion y `loaded` equivale a usar el estado real de la pantalla.
