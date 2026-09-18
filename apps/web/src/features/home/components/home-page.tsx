"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CalendarDays,
  Crown,
  Eye,
  Flame,
  Medal,
  Sparkles,
  Target,
  Trophy,
  Users,
  Zap
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Competition, Match, Team } from "@competencias-platform/contracts";
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
    <div className="grid gap-5 xl:grid-cols-[minmax(0,2.8fr)_minmax(18rem,1fr)] xl:items-start 2xl:grid-cols-[minmax(0,3fr)_minmax(21rem,1fr)]">
      <div className="grid min-w-0 gap-5">
        {data.featuredMatch ? <HeroBanner match={data.featuredMatch} /> : null}

        <section className="grid gap-3" aria-labelledby="home-matches-title">
          <div className="flex items-center justify-between gap-3">
            <div>
              <Badge tone="accent">Competencia</Badge>
              <h1 className="mt-2 text-h2" id="home-matches-title">
                Partidos para ti
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
            <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
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

        <section className="grid gap-4 lg:grid-cols-2" aria-label="Competiciones y predicciones">
          <FeaturedCompetitions competitions={data.featuredCompetitions} />
          <PopularPredictions data={data} />
        </section>

        <div className="xl:hidden">
          <HomeSidebar data={data} />
        </div>

        <LiveNowSection matches={data.liveMatches} />
      </div>

      <aside className="hidden min-w-0 xl:block" aria-label="Resumen de comunidad">
        <div className="sticky top-36 grid gap-4">
          <HomeSidebar data={data} />
        </div>
      </aside>
    </div>
  );
}

type HeroBannerProps = Readonly<{
  match: Match;
}>;

function HomeSidebar({ data }: Readonly<{ data: HomePageData }>) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
      <UserLevelCard data={data} />
      <WeeklyRankingCard data={data} />
      <GamificationBanner data={data} />
      <UpcomingEventsCard matches={data.upcomingMatches} />
      <MotivationalCard />
    </div>
  );
}

function formatHomeMatchTime(value: string): string {
  return new Intl.DateTimeFormat("es-CO", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function formatHomeMatchDate(value: string): string {
  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short"
  }).format(new Date(value));
}

function UserLevelCard({ data }: Readonly<{ data: HomePageData }>) {
  const currentEntry = data.ranking.entries[0];
  const points = currentEntry?.points ?? 0;
  const level = Math.max(Math.floor(points / 500), 1);
  const progress = Math.min(Math.round(((points % 500) / 500) * 100), 100);

  return (
    <Card className="grid gap-3 overflow-hidden bg-gradient-hero">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Badge tone="primary">Nivel</Badge>
          <h2 className="mt-2 truncate text-h3">
            {currentEntry?.profile.displayName ?? "Competidor"}
          </h2>
          <p className="text-caption text-muted-foreground">
            Sigue sumando puntos con predicciones gratuitas.
          </p>
        </div>
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-level text-label font-black text-white shadow-card">
          {level.toString()}
        </span>
      </div>
      <div className="grid gap-2">
        <div className="flex items-center justify-between text-caption font-bold text-muted-foreground">
          <span>{points.toLocaleString("es-CO")} pts</span>
          <span>{progress.toString()}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <span className="block h-full rounded-full bg-gradient-button" style={{ width: `${progress.toString()}%` }} />
        </div>
      </div>
    </Card>
  );
}

function WeeklyRankingCard({ data }: Readonly<{ data: HomePageData }>) {
  return (
    <Card className="grid gap-3">
      <div className="flex items-center gap-2">
        <Medal className="size-5 text-accent" aria-hidden="true" />
        <h2 className="text-h3">Ranking semanal</h2>
      </div>
      <div className="grid gap-2">
        {data.ranking.entries.slice(0, 5).map((entry) => (
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3" key={entry.id}>
            <span className="grid size-8 place-items-center rounded-lg bg-muted text-caption font-black">
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

function GamificationBanner({ data }: Readonly<{ data: HomePageData }>) {
  const currentEntry = data.ranking.entries[0];
  const achievementsCount = currentEntry?.achievementsCount ?? 0;

  return (
    <Card className="grid gap-3 border-primary-200 bg-primary-50/70 dark:bg-primary-100/20">
      <div className="flex items-center gap-2">
        <Crown className="size-5 text-primary" aria-hidden="true" />
        <h2 className="text-h3">Reto de la semana</h2>
      </div>
      <p className="text-body-small text-muted-foreground">
        Completa 5 predicciones antes del próximo partido en vivo y mantén tu avance en la tabla.
      </p>
      <div className="flex flex-wrap gap-2">
        <Badge tone="primary">{achievementsCount.toString()} logros</Badge>
        <Badge tone="accent">+120 pts</Badge>
      </div>
    </Card>
  );
}

function UpcomingEventsCard({ matches }: Readonly<{ matches: readonly Match[] }>) {
  return (
    <Card className="grid gap-3">
      <div className="flex items-center gap-2">
        <CalendarDays className="size-5 text-info" aria-hidden="true" />
        <h2 className="text-h3">Próximos eventos</h2>
      </div>
      <div className="grid gap-2">
        {matches.slice(0, 3).map((match) => (
          <Link
            className="grid gap-1 rounded-lg border border-border bg-surface-subtle p-3 transition-all duration-200 hover:border-primary-200 hover:bg-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            href={`/matches/${match.id}`}
            key={match.id}
          >
            <span className="truncate text-label">
              {match.homeTeam.name} vs {match.awayTeam.name}
            </span>
            <span className="truncate text-caption text-muted-foreground">
              {match.competition.name} · {formatHomeMatchDate(match.startTime)} · {formatHomeMatchTime(match.startTime)}
            </span>
          </Link>
        ))}
      </div>
    </Card>
  );
}

function MotivationalCard() {
  return (
    <Card className="grid gap-3">
      <div className="flex items-center gap-2">
        <Target className="size-5 text-success" aria-hidden="true" />
        <h2 className="text-h3">Impulsa tu ranking</h2>
      </div>
      <div className="flex items-start gap-2 text-body-small text-muted-foreground">
        <Zap className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden="true" />
        <p>Predice temprano, sigue los partidos en vivo y vuelve por tus resultados.</p>
      </div>
    </Card>
  );
}

function HeroBanner({ match }: HeroBannerProps) {
  const communityPercent = getCommunityPercent(match);
  const followersCount = getFollowersCount(match);
  const matchMinute = getMatchMinute(match);
  const homeHeroImage = getOptionalMediaSlot(match.homeTeam, "heroImage");
  const awayHeroImage = getOptionalMediaSlot(match.awayTeam, "heroImage");
  const competitionBackgroundImage = getOptionalMediaSlot(match.competition, "backgroundImage");
  const homeAttacks = getAttackMetric(match, "home");
  const awayAttacks = getAttackMetric(match, "away");

  return (
    <section className="group relative isolate min-h-[390px] overflow-hidden rounded-2xl border border-primary-200/30 bg-slate-950 text-white shadow-hero lg:min-h-[400px]">
      {competitionBackgroundImage ? (
        <Image
          alt=""
          aria-hidden="true"
          fill
          className="absolute inset-0 -z-30 size-full object-cover opacity-25"
          src={competitionBackgroundImage}
          unoptimized
        />
      ) : null}
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_12%_20%,rgba(139,92,246,0.48),transparent_30%),radial-gradient(circle_at_88%_18%,rgba(255,70,85,0.24),transparent_26%),linear-gradient(135deg,#16112b_0%,#0f172a_48%,#070711_100%)]" />
      <div className="absolute inset-0 -z-10 opacity-[0.18] [background-image:linear-gradient(115deg,transparent_0%,transparent_42%,rgba(255,255,255,0.24)_42.4%,transparent_43%),linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:100%_100%,42px_42px,42px_42px]" />
      <div className="absolute -left-20 top-16 -z-10 size-64 rounded-full bg-primary/35 blur-3xl transition-transform duration-200 group-hover:scale-105" />
      <div className="absolute -right-16 bottom-10 -z-10 size-72 rounded-full bg-live/20 blur-3xl transition-transform duration-200 group-hover:scale-105" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-44 bg-gradient-to-t from-black/55 to-transparent" />
      {homeHeroImage ? (
        <Image
          alt=""
          aria-hidden="true"
          height={288}
          className="absolute bottom-16 left-4 -z-10 hidden h-72 max-w-[30%] object-contain opacity-20 xl:block"
          src={homeHeroImage}
          unoptimized
          width={288}
        />
      ) : null}
      {awayHeroImage ? (
        <Image
          alt=""
          aria-hidden="true"
          height={288}
          className="absolute bottom-16 right-4 -z-10 hidden h-72 max-w-[30%] object-contain opacity-20 xl:block"
          src={awayHeroImage}
          unoptimized
          width={288}
        />
      ) : null}

      <div className="flex min-h-[390px] flex-col justify-between p-4 sm:p-5 lg:min-h-[400px] lg:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <LiveBadge label={match.status === "LIVE" ? "En vivo" : getMatchStatusLabel(match.status)} />
            <span className="max-w-full truncate rounded-full border border-white/12 bg-white/10 px-3 py-1 text-caption font-extrabold uppercase tracking-[0.12em] text-white/85 backdrop-blur">
              {match.competition.name}
            </span>
          </div>
          <span className="rounded-full border border-white/12 bg-white/10 px-3 py-1 text-caption font-bold text-white/80 backdrop-blur">
            {match.sport.name}
          </span>
        </div>

        <div className="grid items-center gap-4 py-5 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-5 lg:py-6">
          <HeroTeam team={match.homeTeam} align="left" />

          <div className="grid justify-items-center gap-3">
            <div className="rounded-2xl border border-white/15 bg-black/24 px-4 py-3 text-center shadow-floating backdrop-blur-md sm:px-6">
              <div className="font-mono text-[2.8rem] font-black leading-none tracking-normal text-white drop-shadow sm:text-[4rem] lg:text-[4.8rem]">
                {match.score.home.toString()}
                <span className="mx-3 text-white/45">:</span>
                {match.score.away.toString()}
              </div>
              <div className="mt-2 flex items-center justify-center gap-2 text-label font-extrabold text-white">
                <span className="rounded-full bg-live px-2 py-0.5 text-[0.68rem] uppercase leading-none text-white">
                  {match.status === "LIVE" ? "En vivo" : getMatchStatusLabel(match.status)}
                </span>
                {matchMinute ? <span>{matchMinute.toString()}&apos;</span> : null}
              </div>
            </div>
            <div className="flex items-center gap-2 text-body-small font-semibold text-white/78">
              <Users className="size-4 text-primary-300" aria-hidden="true" />
              <span>{followersCount} personas siguiendo este partido</span>
            </div>
            <div className="grid w-full grid-cols-1 gap-2 min-[420px]:grid-cols-2 md:w-auto">
              <Link
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/14 bg-white/10 px-4 text-label font-extrabold text-white shadow-sm backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                href={`/matches/${match.id}`}
              >
                <Eye className="size-4" aria-hidden="true" />
                Ver partido
              </Link>
              <Link
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-button px-4 text-label font-extrabold text-white shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                href={`/matches/${match.id}`}
              >
                <Sparkles className="size-4" aria-hidden="true" />
                Hacer predicción
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <HeroTeam team={match.awayTeam} align="right" />
        </div>

        <div className="grid gap-3 rounded-2xl border border-white/12 bg-black/24 p-3 shadow-floating backdrop-blur-md md:grid-cols-3">
          <HeroStat
            awayValue={match.statistics?.possessionAwayPercent ?? 100 - communityPercent}
            homeValue={match.statistics?.possessionHomePercent ?? communityPercent}
            label="Posesión"
            suffix="%"
          />
          <HeroStat
            awayValue={match.statistics?.shotsAway ?? Math.max(match.score.away + 5, 6)}
            homeValue={match.statistics?.shotsHome ?? Math.max(match.score.home + 6, 8)}
            label="Tiros"
          />
          <HeroStat awayValue={awayAttacks} homeValue={homeAttacks} label="Ataques" />
        </div>
      </div>
    </section>
  );
}

function HeroTeam({ align, team }: Readonly<{ align: "left" | "right"; team: Team }>) {
  const alignmentClass = align === "right" ? "md:justify-items-end md:text-right" : "md:justify-items-start";

  return (
    <div className={`grid min-w-0 justify-items-center gap-3 text-center ${alignmentClass}`}>
      <TeamLogo team={team} />
      <div className="min-w-0">
        <p className="truncate text-title font-black text-white sm:text-h3">{team.name}</p>
        <p className="mt-1 text-caption font-bold uppercase tracking-[0.16em] text-white/55">
          {team.shortName ?? team.country ?? "Equipo"}
        </p>
      </div>
    </div>
  );
}

function TeamLogo({ team }: Readonly<{ team: Team }>) {
  if (team.logoUrl) {
    return (
      <Image
        alt={`Escudo de ${team.name}`}
        className="size-16 rounded-2xl border border-white/18 bg-white/12 object-contain p-2.5 shadow-floating backdrop-blur sm:size-20 lg:size-24"
        height={112}
        src={team.logoUrl}
        unoptimized
        width={112}
      />
    );
  }

  return <TeamLogoFallback name={team.name} shortName={team.shortName} />;
}

function TeamLogoFallback({
  name,
  shortName
}: Readonly<{ name: string; shortName: string | undefined }>) {
  return (
    <div
      aria-label={`Escudo de ${name}`}
      className="relative grid size-16 place-items-center overflow-hidden rounded-2xl border border-white/18 bg-white/12 shadow-floating backdrop-blur sm:size-20 lg:size-24"
      role="img"
    >
      <span className="absolute inset-2 rounded-xl border border-white/10" />
      <span className="absolute -left-6 top-2 h-24 w-12 rotate-12 bg-primary/35 blur-xl" />
      <span className="absolute -right-5 bottom-2 h-20 w-10 rotate-12 bg-live/25 blur-lg" />
      <span className="relative rounded-xl bg-white/10 px-2.5 py-1.5 text-title font-black text-white sm:text-h3">
        {(shortName ?? name).slice(0, 3).toUpperCase()}
      </span>
    </div>
  );
}

function HeroStat({
  awayValue,
  homeValue,
  label,
  suffix = ""
}: Readonly<{
  awayValue: number;
  homeValue: number;
  label: string;
  suffix?: string;
}>) {
  const total = Math.max(homeValue + awayValue, 1);
  const homePercent = Math.round((homeValue / total) * 100);
  const awayPercent = 100 - homePercent;

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between gap-3 text-caption font-bold text-white/70">
        <span>{label}</span>
        <span className="text-white">
          {homeValue.toString()}
          {suffix}
          <span className="px-1 text-white/35">·</span>
          {awayValue.toString()}
          {suffix}
        </span>
      </div>
      <div
        aria-label={`${label}: local ${homeValue.toString()}${suffix}, visitante ${awayValue.toString()}${suffix}`}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={homePercent}
        className="grid h-2 overflow-hidden rounded-full bg-white/12"
        role="meter"
      >
        <span
          className="rounded-full bg-gradient-to-r from-primary-300 via-primary-500 to-live shadow-[0_0_16px_rgba(139,92,246,0.55)]"
          style={{ width: `${homePercent.toString()}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-[0.68rem] font-bold text-white/45">
        <span>{homePercent.toString()}%</span>
        <span>{awayPercent.toString()}%</span>
      </div>
    </div>
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
        <h2 className="text-h3">Competiciones populares</h2>
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

function getCommunityPercent(match: Match): number {
  const seed = match.id
    .replaceAll("-", "")
    .slice(-4)
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0);

  return 52 + (seed % 39);
}

function getFollowersCount(match: Match): string {
  const seed = match.id
    .replaceAll("-", "")
    .slice(-5)
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0);
  const followers = 1800 + seed * 19;

  if (followers >= 1000) {
    return `${(followers / 1000).toFixed(1)}K`;
  }

  return followers.toLocaleString("es-CO");
}

function getMatchMinute(match: Match): number | null {
  if (match.status === "HALFTIME") {
    return 45;
  }

  if (match.status !== "LIVE") {
    return null;
  }

  const eventMinutes = match.events.flatMap((event) =>
    typeof event.minute === "number" ? [event.minute] : []
  );

  if (eventMinutes.length === 0) {
    return 29;
  }

  return Math.min(Math.max(...eventMinutes), 90);
}

function getAttackMetric(match: Match, side: "home" | "away"): number {
  const seed = match.id
    .replaceAll("-", "")
    .slice(-4)
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0);
  const base = side === "home" ? 38 : 34;
  const scoreBoost = side === "home" ? match.score.home : match.score.away;

  return base + (seed % 9) + scoreBoost * 3;
}

function getMatchStatusLabel(status: Match["status"]): string {
  const labels: Record<Match["status"], string> = {
    CANCELLED: "Cancelado",
    FINISHED: "Finalizado",
    HALFTIME: "Descanso",
    LIVE: "En vivo",
    POSTPONED: "Aplazado",
    SCHEDULED: "Programado"
  };

  return labels[status];
}

function getOptionalMediaSlot(entity: Team | Competition, key: "backgroundImage" | "heroImage"): string | undefined {
  const value = (entity as Readonly<Record<string, unknown>>)[key];

  return typeof value === "string" && value.length > 0 ? value : undefined;
}
