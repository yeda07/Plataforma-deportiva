"use client";

import { Radio, Signal } from "lucide-react";
import type { Match } from "@competencias-platform/contracts";
import { Badge, Card, LiveBadge, Skeleton, StatusIndicator } from "@competencias-platform/ui";
import { EmptyState, ErrorState, InterfaceStateSimulation, LoadingState, OfflineState } from "@components";
import { MatchCard } from "@features/matches";
import { getCommunityPredictionPercent } from "@features/matches/utils/community-prediction";
import { useInterfaceStateSimulation } from "@/hooks";
import { useLiveMatchesFeed } from "../hooks/use-live-matches-feed";
import type { LiveCompetitionGroup, LiveMatchGroup } from "../types/live-page-data";

export function LivePage() {
  const feedState = useLiveMatchesFeed();
  const simulatedState = useInterfaceStateSimulation();

  if (simulatedState) {
    return (
      <InterfaceStateSimulation
        loadingAriaLabel="Cargando partidos en vivo"
        resourceName="partidos en vivo"
        skeleton={<LiveLoadingSkeleton />}
        state={simulatedState}
      />
    );
  }

  if (feedState.status === "loading") {
    return <LiveLoadingState />;
  }

  if (feedState.status === "empty") {
    return (
      <EmptyState
        description="Vuelve más tarde para seguir marcadores, periodos y actividad de comunidad."
        title="No hay partidos en vivo"
      />
    );
  }

  if (feedState.status === "error") {
    return <ErrorState description={feedState.message} title="No se pudo cargar en vivo" />;
  }

  if (feedState.status === "offline") {
    return <LiveOfflineState matches={feedState.matches} />;
  }

  return <LiveLoadedState groups={feedState.groups} matches={feedState.matches} />;
}

type LiveLoadedStateProps = Readonly<{
  groups: readonly LiveMatchGroup[];
  matches: readonly Match[];
}>;

function LiveLoadedState({ groups, matches }: LiveLoadedStateProps) {
  return (
    <div className="grid gap-5">
      <LiveHeader activeEventsCount={matches.length} />

      <section className="grid gap-4" aria-label="Partidos en vivo agrupados">
        {groups.map((sportGroup) => (
          <SportLiveGroup group={sportGroup} key={sportGroup.sport.id} />
        ))}
      </section>
    </div>
  );
}

function LiveHeader({ activeEventsCount }: Readonly<{ activeEventsCount: number }>) {
  return (
    <section className="grid gap-3 rounded-xl border border-border bg-card p-4 shadow-md sm:grid-cols-[1fr_auto] sm:items-center">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <LiveBadge label="LIVE" />
          <Badge tone="primary">{activeEventsCount.toString()} eventos activos</Badge>
        </div>
        <h1 className="mt-3 text-h1">En vivo</h1>
        <p className="mt-1 max-w-2xl text-body text-muted-foreground">
          Marcadores simulados en tiempo real para desarrollar el prototipo.
        </p>
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-label text-live">
        <Signal className="size-4" aria-hidden="true" />
        <span>Actualizando</span>
      </div>
    </section>
  );
}

function SportLiveGroup({ group }: Readonly<{ group: LiveMatchGroup }>) {
  const activeMatchesCount = group.competitions.reduce(
    (total, competitionGroup) => total + competitionGroup.matches.length,
    0
  );

  return (
    <section className="grid gap-3" aria-labelledby={`live-sport-${group.sport.id}`}>
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <Radio className="size-5 shrink-0 text-live" aria-hidden="true" />
          <h2 className="truncate text-h2" id={`live-sport-${group.sport.id}`}>
            {group.sport.name}
          </h2>
        </div>
        <Badge tone="error">{activeMatchesCount.toString()} activos</Badge>
      </div>

      <div className="grid gap-3">
        {group.competitions.map((competitionGroup) => (
          <CompetitionLiveGroup group={competitionGroup} key={competitionGroup.competition.id} />
        ))}
      </div>
    </section>
  );
}

function CompetitionLiveGroup({ group }: Readonly<{ group: LiveCompetitionGroup }>) {
  return (
    <Card className="grid gap-3 p-3 sm:p-4">
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-h3">{group.competition.name}</h3>
          <p className="truncate text-caption text-muted-foreground">
            {group.competition.country ?? "Global"} · {group.matches.length.toString()} en juego
          </p>
        </div>
        <StatusIndicator label="En vivo" tone="live" />
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {group.matches.map((match) => (
          <MatchCard
            communityPredictionPercent={getCommunityPredictionPercent(match)}
            key={match.id}
            match={match}
          />
        ))}
      </div>
    </Card>
  );
}

function LiveLoadingState() {
  return (
    <LoadingState aria-label="Cargando partidos en vivo">
      <LiveLoadingSkeleton />
    </LoadingState>
  );
}

function LiveLoadingSkeleton() {
  return (
    <>
      <Skeleton className="h-40 w-full rounded-xl" />
      <div className="grid gap-3">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton className="h-44 w-full" key={index} />
        ))}
      </div>
    </>
  );
}

function LiveOfflineState({ matches }: Readonly<{ matches: readonly Match[] }>) {
  return (
    <div className="grid gap-4">
      <OfflineState
        description="Estás viendo la última información disponible. La simulación se reanudará al recuperar conexión."
        title="Sin conexión"
      />

      {matches.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {matches.map((match) => (
            <MatchCard
              communityPredictionPercent={getCommunityPredictionPercent(match)}
              key={match.id}
              match={match}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
