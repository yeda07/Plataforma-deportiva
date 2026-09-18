"use client";

import {
  Activity,
  Bell,
  CalendarDays,
  Search,
  Trophy,
  UserRound,
  X
} from "lucide-react";
import { useCallback, useState } from "react";
import type { ReactNode } from "react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  IconButton,
  Input,
  LiveBadge,
  Modal,
  Progress,
  SearchInput,
  Select,
  Skeleton,
  StatusIndicator,
  Tabs,
  Toast
} from "@competencias-platform/ui";

const competitionTabs = [
  { label: "En vivo", value: "live" },
  { label: "Hoy", value: "today" },
  { label: "Rankings", value: "rankings" }
] as const;

const sportOptions = [
  { label: "Futbol", value: "football" },
  { label: "Baloncesto", value: "basketball" },
  { label: "Tenis", value: "tennis" }
] as const;

const primarySwatches = [
  { className: "bg-primary-50", label: "50" },
  { className: "bg-primary-100", label: "100" },
  { className: "bg-primary-200", label: "200" },
  { className: "bg-primary-300", label: "300" },
  { className: "bg-primary-400", label: "400" },
  { className: "bg-primary-500", label: "500" },
  { className: "bg-primary-600", label: "600" },
  { className: "bg-primary-700", label: "700" },
  { className: "bg-primary-800", label: "800" },
  { className: "bg-primary-900", label: "900" }
] as const;

export function DesignSystemShowcase() {
  const [activeTab, setActiveTab] = useState("live");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <div className="grid gap-6 text-foreground">
      <header className="grid gap-4 overflow-hidden rounded-2xl border border-border-strong bg-gradient-hero p-5 shadow-hero sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <Badge tone="accent">Design System V2</Badge>
          <h1 className="mt-3 text-display">Competencias V2</h1>
          <p className="mt-2 max-w-3xl text-body text-muted-foreground">
            Sistema visual deportivo, premium y competitivo para comunidad,
            predicciones gratuitas, puntos, rankings y logros.
          </p>
        </div>
        <div className="flex gap-2">
          <IconButton icon={<Search className="size-5" />} label="Buscar" />
          <IconButton icon={<Bell className="size-5" />} label="Notificaciones" />
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="grid gap-4 bg-gradient-hero">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-label text-muted-foreground">Partido destacado</p>
              <h2 className="text-h2">Titanes FC vs Norte Unido</h2>
            </div>
            <LiveBadge />
          </div>
          <div className="grid gap-3 rounded-xl border border-border bg-surface/80 p-3 shadow-sm sm:grid-cols-3">
            <Metric label="Comunidad" value="12.430" />
            <Metric label="Predicciones" value="8.921" />
            <Metric label="Puntos en juego" value="45K" />
          </div>
          <div className="grid gap-2 rounded-xl border border-border bg-surface/75 p-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-title">Marcador</span>
              <span className="text-score text-primary">2 - 1</span>
            </div>
            <Progress label="Prediccion de comunidad" value={68} />
          </div>
          <Tabs
            ariaLabel="Vistas de competencia"
            items={competitionTabs}
            onValueChange={setActiveTab}
            value={activeTab}
          />
          <div className="grid gap-3 sm:grid-cols-3">
            <StatusIndicator label="Marcador activo" tone="live" />
            <StatusIndicator label="Ranking actualizado" tone="success" />
            <StatusIndicator label="Cierre cercano" tone="warning" />
          </div>
        </Card>

        <Card className="grid gap-4">
          <h2 className="text-h3">Accesos rapidos</h2>
          <div className="grid grid-cols-2 gap-3">
            <QuickAction icon={<Trophy className="size-5" />} label="Rankings" />
            <QuickAction icon={<Activity className="size-5" />} label="En vivo" />
            <QuickAction icon={<CalendarDays className="size-5" />} label="Eventos" />
            <QuickAction icon={<UserRound className="size-5" />} label="Perfil" />
          </div>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="grid gap-4">
          <h2 className="text-h3">Brand tokens</h2>
          <div className="grid grid-cols-5 gap-2">
            {primarySwatches.map((swatch) => (
              <div className="grid gap-2" key={swatch.label}>
                <span className={`h-12 rounded-lg border border-border ${swatch.className}`} />
                <span className="text-caption text-muted-foreground">primary-{swatch.label}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="grid gap-4">
          <h2 className="text-h3">Gradientes y progreso</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <GradientSwatch className="bg-gradient-brand" label="gradient-brand" />
            <GradientSwatch className="bg-gradient-hero" label="gradient-hero" />
            <GradientSwatch className="bg-gradient-button" label="gradient-button" />
            <GradientSwatch className="bg-gradient-live" label="gradient-live" />
          </div>
          <Progress label="Nivel de temporada" tone="warning" value={74} />
          <Progress label="Actividad en vivo" tone="live" value={42} />
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="grid gap-4">
          <h2 className="text-h3">Botones</h2>
          <div className="flex flex-wrap gap-3">
            <Button>Primario</Button>
            <Button variant="secondary">Secundario</Button>
            <Button variant="accent">Logro</Button>
            <Button variant="ghost">Fantasma</Button>
            <Button variant="danger">Error</Button>
            <Button isLoading>Guardando</Button>
            <Button disabled>Deshabilitado</Button>
          </div>
        </Card>

        <Card className="grid gap-4">
          <h2 className="text-h3">Formularios</h2>
          <Input label="Nombre visible" placeholder="Ej. Capitan Deportivo" />
          <SearchInput label="Buscar competencia" placeholder="Liga, equipo o torneo" />
          <Select label="Deporte" options={sportOptions} defaultValue="football" />
        </Card>

        <Card className="grid gap-4">
          <h2 className="text-h3">Estados</h2>
          <div className="flex flex-wrap gap-2">
            <Badge tone="primary">Competencia</Badge>
            <Badge tone="success">Ganador</Badge>
            <Badge tone="warning">Pendiente</Badge>
            <Badge tone="error">Cerrado</Badge>
            <Badge tone="muted">Comunidad</Badge>
          </div>
          <Toast title="Prediccion registrada" tone="success">
            Sumaste puntos potenciales para el ranking semanal.
          </Toast>
          <Skeleton className="h-16 w-full" />
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="grid gap-4">
          <h2 className="text-h3">Avatar y modal</h2>
          <div className="flex items-center gap-3">
            <Avatar fallback="SD" />
            <div>
              <p className="text-label">Sebastian Deportivo</p>
              <p className="text-caption text-muted-foreground">Nivel comunidad</p>
            </div>
          </div>
          <Button className="justify-self-start" onClick={openModal}>
            Abrir modal
          </Button>
        </Card>

        <Card className="grid gap-4">
          <h2 className="text-h3">Tipografia</h2>
          <p className="text-display">Display</p>
          <p className="text-h1">Titulo H1</p>
          <p className="text-h2">Titulo H2</p>
          <p className="text-h3">Titulo H3</p>
          <p className="text-title">Title para encabezados compactos</p>
          <p className="text-score text-primary">3 - 2</p>
          <p className="text-body text-muted-foreground">Texto base para contenido deportivo.</p>
          <p className="text-body-small text-muted-foreground">Texto secundario para cards densas.</p>
          <p className="text-caption text-muted-foreground">Caption y metadatos compactos.</p>
          <p className="text-label">Etiqueta de interfaz</p>
        </Card>
      </section>

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Detalle de logro">
        <div className="grid gap-4">
          <p className="text-body text-muted-foreground">
            Este modal valida foco, cierre por teclado y acciones accesibles.
          </p>
          <div className="flex justify-end gap-2">
            <Button onClick={closeModal} variant="ghost">
              Cancelar
            </Button>
            <Button onClick={closeModal}>
              <X className="size-4" aria-hidden="true" />
              Entendido
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

type MetricProps = Readonly<{
  label: string;
  value: string;
}>;

function Metric({ label, value }: MetricProps) {
  return (
    <div className="rounded-lg bg-surface-elevated p-3 shadow-xs">
      <p className="text-caption text-muted-foreground">{label}</p>
      <p className="mt-1 text-h3">{value}</p>
    </div>
  );
}

type QuickActionProps = Readonly<{
  icon: ReactNode;
  label: string;
}>;

function QuickAction({ icon, label }: QuickActionProps) {
  return (
    <button
      className="grid min-h-24 place-items-center gap-2 rounded-xl border border-border bg-surface-elevated p-3 text-label shadow-xs transition duration-200 hover:border-primary/40 hover:bg-card-hover hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98]"
      type="button"
    >
      <span aria-hidden="true" className="text-primary">
        {icon}
      </span>
      {label}
    </button>
  );
}

function GradientSwatch({ className, label }: Readonly<{ className: string; label: string }>) {
  return (
    <div className="grid gap-2">
      <span className={`h-16 rounded-xl border border-border shadow-sm ${className}`} />
      <span className="text-caption text-muted-foreground">{label}</span>
    </div>
  );
}
