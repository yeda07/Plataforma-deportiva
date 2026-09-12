import {
  AlertCircle,
  Ban,
  CalendarDays,
  LockKeyhole,
  SearchX,
  ShieldAlert,
  WifiOff
} from "lucide-react";
import type { ReactNode } from "react";
import { Button, Card, Skeleton } from "@competencias-platform/ui";

export type InterfaceStateKind =
  | "loading"
  | "loaded"
  | "empty"
  | "error"
  | "offline"
  | "unauthorized"
  | "forbidden";

type BaseStateProps = Readonly<{
  action?: ReactNode;
  description: string;
  title: string;
}>;

type LoadingStateProps = Readonly<{
  "aria-label": string;
  children?: ReactNode;
}>;

type RetryStateProps = BaseStateProps &
  Readonly<{
    onRetry?: () => void;
  }>;

type InterfaceStateSimulationProps = Readonly<{
  loadingAriaLabel: string;
  resourceName: string;
  skeleton?: ReactNode;
  state: Exclude<InterfaceStateKind, "loaded">;
}>;

const defaultSkeleton = (
  <>
    <Skeleton className="h-32 w-full rounded-xl" />
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => (
        <Skeleton className="h-44 w-full" key={index} />
      ))}
    </div>
  </>
);

export function LoadingState({ "aria-label": ariaLabel, children }: LoadingStateProps) {
  return (
    <div className="grid gap-4" aria-busy="true" aria-label={ariaLabel}>
      {children ?? defaultSkeleton}
    </div>
  );
}

export function EmptyState({ action, description, title }: BaseStateProps) {
  return (
    <StateCard
      action={action}
      description={description}
      icon={<SearchX className="size-8" aria-hidden="true" />}
      title={title}
    />
  );
}

export function ErrorState({ action, description, onRetry, title }: RetryStateProps) {
  return (
    <StateCard
      action={action ?? <RetryButton {...(onRetry ? { onRetry } : {})} />}
      description={description}
      icon={<AlertCircle className="size-8" aria-hidden="true" />}
      tone="error"
      title={title}
    />
  );
}

export function OfflineState({ action, description, onRetry, title }: RetryStateProps) {
  return (
    <StateCard
      action={action ?? <RetryButton {...(onRetry ? { onRetry } : {})} />}
      description={description}
      icon={<WifiOff className="size-8" aria-hidden="true" />}
      tone="warning"
      title={title}
    />
  );
}

export function UnauthorizedState({ action, description, title }: BaseStateProps) {
  return (
    <StateCard
      action={action}
      description={description}
      icon={<LockKeyhole className="size-8" aria-hidden="true" />}
      tone="warning"
      title={title}
    />
  );
}

export function ForbiddenState({ action, description, title }: BaseStateProps) {
  return (
    <StateCard
      action={action}
      description={description}
      icon={<ShieldAlert className="size-8" aria-hidden="true" />}
      tone="error"
      title={title}
    />
  );
}

export function NoResultsState({ description, title }: Pick<BaseStateProps, "description" | "title">) {
  return (
    <StateCard
      description={description}
      icon={<CalendarDays className="size-8" aria-hidden="true" />}
      title={title}
    />
  );
}

export function InterfaceStateSimulation({
  loadingAriaLabel,
  resourceName,
  skeleton,
  state
}: InterfaceStateSimulationProps) {
  if (state === "loading") {
    return <LoadingState aria-label={loadingAriaLabel}>{skeleton}</LoadingState>;
  }

  if (state === "empty") {
    return (
      <EmptyState
        description={`No hay ${resourceName} para mostrar con los filtros o datos actuales.`}
        title="Sin resultados"
      />
    );
  }

  if (state === "error") {
    return (
      <ErrorState
        description={`No pudimos cargar ${resourceName}. Intenta nuevamente.`}
        title="Algo salió mal"
      />
    );
  }

  if (state === "offline") {
    return (
      <OfflineState
        description={`Estás sin conexión. Mostraremos ${resourceName} nuevamente cuando recuperes internet.`}
        title="Sin conexión"
      />
    );
  }

  if (state === "unauthorized") {
    return (
      <UnauthorizedState
        description="Inicia sesión para continuar con esta sección."
        title="Necesitas iniciar sesión"
      />
    );
  }

  return (
    <ForbiddenState
      description="Tu cuenta no tiene permisos suficientes para ver esta sección."
      title="Acceso restringido"
    />
  );
}

function StateCard({
  action,
  description,
  icon,
  title,
  tone = "muted"
}: BaseStateProps &
  Readonly<{
    icon: ReactNode;
    tone?: "error" | "muted" | "warning";
  }>) {
  const toneClassName =
    tone === "error" ? "text-error" : tone === "warning" ? "text-warning" : "text-muted-foreground";

  return (
    <Card className="grid gap-3 p-4 text-center sm:p-5">
      <div className={`mx-auto grid size-12 place-items-center rounded-xl bg-muted ${toneClassName}`}>
        {icon}
      </div>
      <div className="grid gap-1">
        <h2 className="text-h3">{title}</h2>
        <p className="mx-auto max-w-2xl text-body text-muted-foreground">{description}</p>
      </div>
      {action ? <div className="mx-auto w-full max-w-xs">{action}</div> : null}
    </Card>
  );
}

function RetryButton({ onRetry }: Readonly<{ onRetry?: () => void }>) {
  return (
    <Button
      onClick={() => {
        if (onRetry) {
          onRetry();
          return;
        }

        window.location.reload();
      }}
      variant="secondary"
    >
      Reintentar
    </Button>
  );
}

export function AccessDeniedIcon() {
  return <Ban className="size-4" aria-hidden="true" />;
}
