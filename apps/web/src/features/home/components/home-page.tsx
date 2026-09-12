"use client";

import { Flame, Medal, Sparkles, Trophy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Match } from "@competencias-platform/contracts";
import { Badge, Card, LiveBadge, Skeleton, Tabs } from "@competencias-platform/ui";
import { EmptyState, ErrorState, InterfaceStateSimulation, LoadingState } from "@components";
import { MatchCard } from "@features/matches";
import { useInterfaceStateSimulation } from "@/hooks";
import { getHomePageData } from "../services/home-page.service";
import type { FeaturedCompetition, HomePageData, HomeTab } from "../types/home-page-data";

type HomeState =
  | Readonly<{ status: "loading" }>
  | Readonly<{ status: "loaded"; data: HomePageData }>
  | Readonly<{ status: "empty" }>
  | Readonly<{ status: "error"; message: string }>;

const homeTabs = [
  { label: "Destacados", value: "featured" },
  { label: "Próximos", value: "upcoming" },
  { label: "En vivo", value: "live" },
  { label: "Finalizados", value: "finished" }
] as const;

export function HomePage() {
  const [activeTab, setActiveTab] = useState<HomeTab>("featured");
  const [homeState, setHomeState] = useState<HomeState>({ status: "loading" });
  const simulatedState = useInterfaceStateSimulation();

  useEffect(() => {
    let isMounted = true;

    async function loadHomeData() {
      setHomeState({ status: "loading" });

      try {
        const data = await getHomePageData();

        if (!isMounted) {
          return;
        }

        if (
          data.featuredMatches.length === 0 &&
          data.liveMatches.length === 0 &&
          data.upcomingMatches.length === 0
        ) {
          setHomeState({ status: "empty" });
          return;
        }

        setHomeState({ status: "loaded", data });
      } catch {
        if (isMounted) {
          setHomeState({
            status: "error",
            message: "No pudimos cargar la informacion deportiva."
          });
        }
      }
    }

    void loadHomeData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (simulatedState) {
    return (
      <InterfaceStateSimulation
        loadingAriaLabel="Cargando inicio"
        resourceName="contenido deportivo"
        skeleton={<HomeLoadingSkeleton />}
        state={simulatedState}
      />
    );
  }

  if (homeState.status === "loading") {
    return <HomeLoadingState />;
  }

  if (homeState.status === "empty") {
    return (
      <EmptyState
        description="Aún no hay partidos, predicciones o rankings disponibles."
        title="Sin contenido deportivo"
      />
    );
  }

  if (homeState.status === "error") {
    return (
      <ErrorState
        description={homeState.message}
        title="No se pudo cargar el inicio"
      />
    );
  }

  return (
    <HomeLoadedState activeTab={activeTab} data={homeState.data} onTabChange={setActiveTab} />
  );
}

type HomeLoadedStateProps = Readonly<{
  activeTab: HomeTab;
  data: HomePageData;
  onTabChange: (value: HomeTab) => void;
}>;

function HomeLoadedState({ activeTab, data, onTabChange }: HomeLoadedStateProps) {
  const tabMatches = useMemo(() => {
    const matchesByTab: Record<HomeTab, readonly Match[]> = {
      featured: data.featuredMatches,
      upcoming: data.upcomingMatches,
      live: data.liveMatches,
      finished: data.finishedMatches
    };

    return matchesByTab[activeTab];
  }, [activeTab, data]);

  return (
    <div className="grid gap-5">
      {data.featuredMatch ? <HeroBanner match={data.featuredMatch} /> : null}

      <section className="grid gap-3" aria-labelledby="home-matches-title">
        <div className="flex items-center justify-between gap-3">
          <div>
            <Badge tone="accent">Competencia</Badge>
            <h1 className="mt-2 text-h2" id="home-matches-title">
              Partidos para predecir
            </h1>
          </div>
        </div>
        <Tabs
          ariaLabel="Filtro de partidos"
          items={homeTabs}
          onValueChange={(value) => {
            onTabChange(value as HomeTab);
          }}
          value={activeTab}
        />
        {tabMatches.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {tabMatches.map((match) => (
              <MatchCard
                communityPredictionPercent={getCommunityPercent(match)}
                key={match.id}
                match={match}
              />
            ))}
          </div>
        ) : (
          <InlineEmptyState title="Sin partidos" description="No hay partidos para este filtro." />
        )}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]" aria-label="Resumen deportivo">
        <LiveNowSection matches={data.liveMatches} />
        <RankingSummary data={data} />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_1fr]" aria-label="Predicciones y competiciones">
        <PopularPredictions data={data} />
        <FeaturedCompetitions competitions={data.featuredCompetitions} />
      </section>
    </div>
  );
}

type HeroBannerProps = Readonly<{
  match: Match;
}>;

function HeroBanner({ match }: HeroBannerProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card shadow-lg">
      <div className="grid gap-4 p-4 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <LiveBadge label={match.status === "LIVE" ? "En vivo" : "Destacado"} />
            <Badge tone="primary">{match.competition.name}</Badge>
          </div>
          <h2 className="mt-4 text-h1">
            {match.homeTeam.name} vs {match.awayTeam.name}
          </h2>
          <p className="mt-2 text-body text-muted-foreground">
            Predicciones gratuitas de comunidad, puntos virtuales y ranking semanal.
          </p>
        </div>
        <div className="grid min-w-48 gap-3 rounded-lg border border-border bg-background p-4">
          <ScoreLine name={match.homeTeam.name} score={match.score.home} />
          <ScoreLine name={match.awayTeam.name} score={match.score.away} />
          <div className="border-t border-border pt-3 text-caption text-muted-foreground">
            Comunidad {getCommunityPercent(match).toString()}%
          </div>
        </div>
      </div>
    </section>
  );
}

function LiveNowSection({ matches }: Readonly<{ matches: readonly Match[] }>) {
  return (
    <section className="grid gap-3" aria-labelledby="live-now-title">
      <div className="flex items-center gap-2">
        <Flame className="size-5 text-live" aria-hidden="true" />
        <h2 className="text-h3" id="live-now-title">
          En vivo ahora
        </h2>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {matches.slice(0, 4).map((match) => (
          <MatchCard
            communityPredictionPercent={getCommunityPercent(match)}
            key={match.id}
            match={match}
          />
        ))}
      </div>
    </section>
  );
}

function PopularPredictions({ data }: Readonly<{ data: HomePageData }>) {
  return (
    <Card className="grid gap-3">
      <div className="flex items-center gap-2">
        <Sparkles className="size-5 text-accent" aria-hidden="true" />
        <h2 className="text-h3">Predicciones populares</h2>
      </div>
      <div className="grid gap-2">
        {data.popularPredictions.map((prediction) => (
          <div
            className="grid gap-2 rounded-md border border-border bg-background p-3 sm:grid-cols-[1fr_auto] sm:items-center"
            key={prediction.id}
          >
            <div className="min-w-0">
              <p className="truncate text-label">
                {prediction.match.homeTeam.name} vs {prediction.match.awayTeam.name}
              </p>
              <p className="text-caption text-muted-foreground">{prediction.label}</p>
            </div>
            <div className="flex items-center gap-2 text-caption font-semibold text-muted-foreground">
              <span>{prediction.possiblePoints.toString()} puntos</span>
              <Badge tone="primary">{prediction.communityPercent.toString()}%</Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function FeaturedCompetitions({
  competitions
}: Readonly<{ competitions: readonly FeaturedCompetition[] }>) {
  return (
    <Card className="grid gap-3">
      <div className="flex items-center gap-2">
        <Trophy className="size-5 text-primary" aria-hidden="true" />
        <h2 className="text-h3">Competiciones destacadas</h2>
      </div>
      <div className="grid gap-2">
        {competitions.map((item) => (
          <div
            className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-md border border-border bg-background p-3"
            key={item.competition.id}
          >
            <span className="grid size-9 place-items-center rounded-md bg-muted text-label">
              {item.competition.name.slice(0, 2).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="truncate text-label">{item.competition.name}</p>
              <p className="text-caption text-muted-foreground">
                {item.matchesCount.toString()} partidos
              </p>
            </div>
            {item.liveMatchesCount > 0 ? (
              <Badge tone="error">{item.liveMatchesCount.toString()} vivo</Badge>
            ) : (
              <Badge tone="muted">{item.competition.country ?? "Global"}</Badge>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

function RankingSummary({ data }: Readonly<{ data: HomePageData }>) {
  return (
    <Card className="grid gap-3">
      <div className="flex items-center gap-2">
        <Medal className="size-5 text-accent" aria-hidden="true" />
        <h2 className="text-h3">Ranking resumido</h2>
      </div>
      <div className="grid gap-2">
        {data.ranking.entries.map((entry) => (
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3" key={entry.id}>
            <span className="grid size-8 place-items-center rounded-md bg-muted text-caption font-bold">
              {entry.position.toString()}
            </span>
            <div className="min-w-0">
              <p className="truncate text-label">{entry.profile.displayName}</p>
              <p className="text-caption text-muted-foreground">
                {entry.predictionsCount.toString()} predicciones
              </p>
            </div>
            <span className="text-label text-primary">{entry.points.toLocaleString("es-CO")}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function HomeLoadingState() {
  return (
    <LoadingState aria-label="Cargando inicio">
      <HomeLoadingSkeleton />
    </LoadingState>
  );
}

function HomeLoadingSkeleton() {
  return (
    <>
      <Skeleton className="h-56 w-full rounded-xl" />
      <Skeleton className="h-10 w-full" />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton className="h-40 w-full" key={index} />
        ))}
      </div>
    </>
  );
}

function InlineEmptyState({
  description,
  title
}: Readonly<{ description: string; title: string }>) {
  return (
    <Card className="grid gap-2">
      <h2 className="text-h3">{title}</h2>
      <p className="text-body text-muted-foreground">{description}</p>
    </Card>
  );
}

function ScoreLine({ name, score }: Readonly<{ name: string; score: number }>) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-4">
      <span className="truncate text-label">{name}</span>
      <span className="text-h2">{score.toString()}</span>
    </div>
  );
}

function getCommunityPercent(match: Match): number {
  const seed = match.id
    .replaceAll("-", "")
    .slice(-4)
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0);

  return 52 + (seed % 39);
}
