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
import {
  Avatar,
  Badge,
  Button,
  Card,
  IconButton,
  Input,
  LiveBadge,
  Modal,
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
        <header className="grid gap-4 rounded-lg border border-border bg-surface p-4 shadow-md sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <Badge tone="accent">Design System</Badge>
            <h1 className="mt-3 text-h1">Sistema visual deportivo</h1>
            <p className="mt-2 max-w-3xl text-body text-muted-foreground">
              Tokens y componentes base para experiencias de competencia, comunidad,
              predicciones gratuitas, puntos, rankings y logros.
            </p>
          </div>
          <div className="flex gap-2">
            <IconButton icon={<Search className="size-5" />} label="Buscar" />
            <IconButton icon={<Bell className="size-5" />} label="Notificaciones" />
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="grid gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-label text-muted-foreground">Partido destacado</p>
                <h2 className="text-h2">Titanes FC vs Norte Unido</h2>
              </div>
              <LiveBadge />
            </div>
            <div className="grid gap-3 rounded-md border border-border bg-background p-3 sm:grid-cols-3">
              <Metric label="Comunidad" value="12.430" />
              <Metric label="Predicciones" value="8.921" />
              <Metric label="Puntos en juego" value="45K" />
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
            <Button onClick={openModal}>Abrir modal</Button>
          </Card>

          <Card className="grid gap-4">
            <h2 className="text-h3">Tipografia</h2>
            <p className="text-display">Display</p>
            <p className="text-h1">Titulo H1</p>
            <p className="text-h2">Titulo H2</p>
            <p className="text-h3">Titulo H3</p>
            <p className="text-body text-muted-foreground">Texto base para contenido deportivo.</p>
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
    <div className="rounded-md bg-surface p-3">
      <p className="text-caption text-muted-foreground">{label}</p>
      <p className="mt-1 text-h3">{value}</p>
    </div>
  );
}

type QuickActionProps = Readonly<{
  icon: React.ReactNode;
  label: string;
}>;

function QuickAction({ icon, label }: QuickActionProps) {
  return (
    <button
      className="grid min-h-24 place-items-center gap-2 rounded-md border border-border bg-background p-3 text-label transition-colors hover:border-primary hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      type="button"
    >
      <span aria-hidden="true" className="text-primary">
        {icon}
      </span>
      {label}
    </button>
  );
}
