"use client";

import { CalendarDays, Clock, MessageCircle, Users } from "lucide-react";
import { useMemo, useState } from "react";
import type { Match, MatchEvent } from "@competencias-platform/contracts";
import { Badge, Card, LiveBadge, Skeleton, StatusIndicator, Tabs } from "@competencias-platform/ui";
import { InterfaceStateSimulation } from "@components";
import { FreePredictionFlow } from "@features/predictions";
import { useInterfaceStateSimulation } from "@/hooks";
import { PredictionCard } from "./prediction-card";
import { StatBar } from "./stat-bar";
import { TimelineEvent } from "./timeline-event";
import type { MatchDetailsData, MatchDetailsTab } from "../types/match-details";

export type MatchDetailsPageProps = Readonly<{
  data: MatchDetailsData;
}>;

const detailTabs = [
  { label: "Resumen", value: "summary" },
  { label: "Estadísticas", value: "statistics" },
  { label: "Alineaciones", value: "lineups" },
  { label: "Predicciones", value: "predictions" },
  { label: "Comentarios", value: "comments" }
] as const;

const statusLabels = {
  SCHEDULED: "Programado",
  LIVE: "En vivo",
  HALFTIME: "Entretiempo",
  FINISHED: "Finalizado",
  POSTPONED: "Aplazado",
  CANCELLED: "Cancelado"
} as const satisfies Record<Match["status"], string>;

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date(value));
}

function formatTime(value: string): string {
  return new Intl.DateTimeFormat("es-CO", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function getTeamInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getLatestMinute(match: Match): number | null {
  const minutes = match.events
    .map((event) => event.minute)
    .filter((minute): minute is number => typeof minute === "number");

  return minutes.length > 0 ? Math.max(...minutes) : null;
}

function getStatusTone(status: Match["status"]): "live" | "success" | "warning" | "error" | "muted" {
  if (status === "LIVE" || status === "HALFTIME") {
    return "live";
  }

  if (status === "FINISHED") {
    return "success";
  }

  if (status === "POSTPONED") {
    return "warning";
  }

  if (status === "CANCELLED") {
    return "error";
  }

  return "muted";
}

function hasScore(match: Match): boolean {
  return match.status === "LIVE" || match.status === "HALFTIME" || match.status === "FINISHED";
}

export function MatchDetailsPage({ data }: MatchDetailsPageProps) {
  const [activeTab, setActiveTab] = useState<MatchDetailsTab>("summary");
  const simulatedState = useInterfaceStateSimulation();
  const { match, predictions } = data;

  const sortedEvents = useMemo(
    () =>
      [...match.events].sort((firstEvent, secondEvent) => {
        const firstMinute = firstEvent.minute ?? 0;
        const secondMinute = secondEvent.minute ?? 0;
        return secondMinute - firstMinute;
      }),
    [match.events]
  );

  if (simulatedState) {
    return (
      <InterfaceStateSimulation
        loadingAriaLabel="Cargando detalle del partido"
        resourceName="detalle del partido"
        skeleton={<MatchDetailsLoadingSkeleton />}
        state={simulatedState}
      />
    );
  }

  return (
    <div className="grid gap-4">
      <MatchHeader match={match} />
      <Tabs
        ariaLabel="Secciones del partido"
        items={detailTabs}
        onValueChange={(value) => {
          setActiveTab(value as MatchDetailsTab);
        }}
        value={activeTab}
      />
      <section aria-live="polite">
        {activeTab === "summary" ? <SummaryTab events={sortedEvents} match={match} /> : null}
        {activeTab === "statistics" ? <StatisticsTab match={match} /> : null}
        {activeTab === "lineups" ? <LineupsTab /> : null}
        {activeTab === "predictions" ? (
          <PredictionsTab
            match={match}
            predictionFlow={data.predictionFlow}
            predictions={predictions}
          />
        ) : null}
        {activeTab === "comments" ? <CommentsTab /> : null}
      </section>
    </div>
  );
}

function MatchDetailsLoadingSkeleton() {
  return (
    <>
      <Skeleton className="h-56 w-full rounded-xl" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-72 w-full" />
    </>
  );
}

function MatchHeader({ match }: Readonly<{ match: Match }>) {
  const latestMinute = getLatestMinute(match);
  const scoreIsVisible = hasScore(match);

  return (
    <header className="grid gap-4 rounded-xl border border-border bg-card p-4 shadow-md">
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <Badge tone="primary">{match.competition.name}</Badge>
          <p className="mt-2 truncate text-caption text-muted-foreground">{match.sport.name}</p>
        </div>
        {match.status === "LIVE" ? (
          <LiveBadge label={latestMinute ? `EN VIVO ${latestMinute.toString()}'` : "EN VIVO"} />
        ) : (
          <StatusIndicator label={statusLabels[match.status]} tone={getStatusTone(match.status)} />
        )}
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
        <TeamBlock align="left" name={match.homeTeam.name} />
        <div className="grid min-w-16 place-items-center rounded-lg border border-border bg-background px-3 py-2">
          <span className="text-h1">
            {scoreIsVisible ? `${match.score.home.toString()} - ${match.score.away.toString()}` : "vs"}
          </span>
          <span className="text-caption text-muted-foreground">{statusLabels[match.status]}</span>
        </div>
        <TeamBlock align="right" name={match.awayTeam.name} />
      </div>

      <div className="grid gap-2 border-t border-border pt-3 text-caption text-muted-foreground sm:grid-cols-2">
        <span className="inline-flex items-center gap-2">
          <CalendarDays className="size-4 text-primary" aria-hidden="true" />
          {formatDate(match.startTime)}
        </span>
        <span className="inline-flex items-center gap-2 sm:justify-end">
          <Clock className="size-4 text-primary" aria-hidden="true" />
          {formatTime(match.startTime)}
        </span>
      </div>
    </header>
  );
}

function TeamBlock({ align, name }: Readonly<{ align: "left" | "right"; name: string }>) {
  return (
    <div className={align === "right" ? "grid justify-items-end gap-2" : "grid gap-2"}>
      <span
        aria-label={`Logo de ${name}`}
        className="grid size-11 place-items-center rounded-lg bg-muted text-label font-bold text-foreground"
        role="img"
      >
        {getTeamInitials(name)}
      </span>
      <h1 className={align === "right" ? "text-right text-label" : "text-label"}>{name}</h1>
    </div>
  );
}

function SummaryTab({ events, match }: Readonly<{ events: readonly MatchEvent[]; match: Match }>) {
  if (events.length === 0) {
    return (
      <Card className="grid gap-2 p-4">
        <h2 className="text-h3">Sin eventos todavía</h2>
        <p className="text-body text-muted-foreground">
          El timeline se activará cuando comience el partido.
        </p>
      </Card>
    );
  }

  return (
    <Card className="grid gap-3 p-3 sm:p-4">
      <h2 className="text-h3">Timeline</h2>
      <ol className="grid gap-2">
        {events.map((event) => (
          <TimelineEvent
            awayTeam={match.awayTeam}
            event={event}
            homeTeam={match.homeTeam}
            key={event.id}
          />
        ))}
      </ol>
    </Card>
  );
}

function StatisticsTab({ match }: Readonly<{ match: Match }>) {
  const statistics = match.statistics;
  const yellowCards = countEvents(match.events, "YELLOW_CARD", match.homeTeam.id);
  const redCards = countEvents(match.events, "RED_CARD", match.homeTeam.id);

  if (!statistics) {
    return (
      <Card className="grid gap-2 p-4">
        <h2 className="text-h3">Estadísticas no disponibles</h2>
        <p className="text-body text-muted-foreground">
          Las estadísticas se publicarán cuando el partido esté en juego o finalice.
        </p>
      </Card>
    );
  }

  return (
    <Card className="grid gap-4 p-3 sm:p-4">
      <h2 className="text-h3">Estadísticas</h2>
      <div className="grid gap-4">
        <StatBar
          awayLabel={match.awayTeam.name}
          awayValue={statistics.possessionAwayPercent ?? 0}
          homeLabel={match.homeTeam.name}
          homeValue={statistics.possessionHomePercent ?? 0}
          label="Posesión"
          suffix="%"
        />
        <StatBar
          awayLabel={match.awayTeam.name}
          awayValue={statistics.shotsAway ?? 0}
          homeLabel={match.homeTeam.name}
          homeValue={statistics.shotsHome ?? 0}
          label="Tiros"
        />
        <StatBar
          awayLabel={match.awayTeam.name}
          awayValue={statistics.shotsOnTargetAway ?? 0}
          homeLabel={match.homeTeam.name}
          homeValue={statistics.shotsOnTargetHome ?? 0}
          label="Tiros al arco"
        />
        <StatBar
          awayLabel={match.awayTeam.name}
          awayValue={statistics.foulsAway ?? 0}
          homeLabel={match.homeTeam.name}
          homeValue={statistics.foulsHome ?? 0}
          label="Faltas"
        />
        <StatBar
          awayLabel={match.awayTeam.name}
          awayValue={statistics.cornersAway ?? 0}
          homeLabel={match.homeTeam.name}
          homeValue={statistics.cornersHome ?? 0}
          label="Corners"
        />
        <StatBar
          awayLabel={match.awayTeam.name}
          awayValue={yellowCards.away + redCards.away}
          homeLabel={match.homeTeam.name}
          homeValue={yellowCards.home + redCards.home}
          label="Tarjetas"
        />
      </div>
    </Card>
  );
}

function PredictionsTab({
  match,
  predictionFlow,
  predictions
}: Readonly<{
  match: Match;
  predictionFlow: MatchDetailsData["predictionFlow"];
  predictions: MatchDetailsData["predictions"];
}>) {
  return (
    <div className="grid gap-3">
      <FreePredictionFlow initialSnapshot={predictionFlow} match={match} />
      <PredictionsHistory predictions={predictions} />
    </div>
  );
}

function PredictionsHistory({ predictions }: Readonly<{ predictions: MatchDetailsData["predictions"] }>) {
  if (predictions.length === 0) {
    return (
      <Card className="grid gap-2 p-4">
        <h2 className="text-h3">Sin predicciones</h2>
        <p className="text-body text-muted-foreground">
          Aún no hay predicciones gratuitas registradas para este partido.
        </p>
      </Card>
    );
  }

  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3" aria-label="Predicciones del partido">
      {predictions.map((prediction) => (
        <PredictionCard key={prediction.id} prediction={prediction} />
      ))}
    </section>
  );
}

function LineupsTab() {
  return (
    <Card className="grid gap-3 p-4">
      <div className="flex items-center gap-2">
        <Users className="size-5 text-primary" aria-hidden="true" />
        <h2 className="text-h3">Alineaciones</h2>
      </div>
      <p className="text-body text-muted-foreground">
        Las alineaciones se integrarán cuando el proveedor deportivo entregue nóminas y titulares.
      </p>
    </Card>
  );
}

function CommentsTab() {
  return (
    <Card className="grid gap-3 p-4">
      <div className="flex items-center gap-2">
        <MessageCircle className="size-5 text-primary" aria-hidden="true" />
        <h2 className="text-h3">Comentarios</h2>
      </div>
      <p className="text-body text-muted-foreground">
        Los comentarios de comunidad se conectarán en una fase posterior.
      </p>
    </Card>
  );
}

function countEvents(
  events: readonly MatchEvent[],
  type: MatchEvent["type"],
  homeTeamId: Match["homeTeam"]["id"]
) {
  return events.reduce(
    (total, event) => {
      if (event.type !== type) {
        return total;
      }

      return {
        away: event.teamId === homeTeamId ? total.away : total.away + 1,
        home: event.teamId === homeTeamId ? total.home + 1 : total.home
      };
    },
    { away: 0, home: 0 }
  );
}
