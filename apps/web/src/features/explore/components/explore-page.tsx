"use client";

import Link from "next/link";
import { Flame, MapPin, Search, Shield, Trophy, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, ReactNode } from "react";
import type { Match, Sport } from "@competencias-platform/contracts";
import { Badge, Card, SearchInput, Select, Skeleton } from "@competencias-platform/ui";
import {
  EmptyState,
  ErrorState,
  InterfaceStateSimulation,
  LoadingState
} from "@components";
import { useInterfaceStateSimulation } from "@/hooks";
import { searchService } from "../services/search.service";
import type { ExploreFilters, ExplorePageData, SearchEntityType, SearchResult } from "../types/explore-page";
import { useDebouncedValue } from "../hooks/use-debounced-value";

type ExplorePageState =
  | Readonly<{ status: "loading" }>
  | Readonly<{ status: "loaded"; data: ExplorePageData }>
  | Readonly<{ status: "empty"; data: ExplorePageData }>
  | Readonly<{ status: "error"; message: string }>;

const initialFilters: ExploreFilters = {
  city: "all",
  competitionSlug: "all",
  date: "",
  query: "",
  sportSlug: "all"
};

const resultTypeLabels: Record<SearchEntityType, string> = {
  competition: "Competición",
  event: "Evento",
  match: "Partido",
  player: "Jugador",
  team: "Equipo"
};

export function ExplorePage() {
  const [filters, setFilters] = useState<ExploreFilters>(initialFilters);
  const debouncedQuery = useDebouncedValue(filters.query, 350);
  const debouncedFilters = useMemo(
    () => ({ ...filters, query: debouncedQuery }),
    [debouncedQuery, filters]
  );
  const [pageState, setPageState] = useState<ExplorePageState>({ status: "loading" });
  const simulatedState = useInterfaceStateSimulation();

  useEffect(() => {
    let isMounted = true;

    async function loadResults() {
      setPageState({ status: "loading" });

      try {
        const data = await searchService.search(debouncedFilters);

        if (!isMounted) {
          return;
        }

        setPageState(data.results.length > 0 ? { data, status: "loaded" } : { data, status: "empty" });
      } catch {
        if (isMounted) {
          setPageState({
            message: "No pudimos completar la búsqueda.",
            status: "error"
          });
        }
      }
    }

    void loadResults();

    return () => {
      isMounted = false;
    };
  }, [debouncedFilters]);

  const cityOptions = useMemo(() => searchService.getCityOptions(), []);
  const competitionOptions = useMemo(
    () => searchService.getCompetitionOptions(filters.sportSlug),
    [filters.sportSlug]
  );
  const sportOptions =
    pageState.status === "loaded" || pageState.status === "empty" ? pageState.data.sports : [];

  function updateFilter<Key extends keyof ExploreFilters>(key: Key, value: ExploreFilters[Key]) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
      ...(key === "sportSlug" ? { competitionSlug: "all" } : {})
    }));
  }

  return (
    <div className="grid gap-5">
      <ExploreHeader />
      <ExploreFilters
        cityOptions={cityOptions}
        competitionOptions={competitionOptions}
        filters={filters}
        onFilterChange={updateFilter}
        sports={sportOptions}
      />
      {simulatedState ? (
        <InterfaceStateSimulation
          loadingAriaLabel="Buscando contenido"
          resourceName="resultados de exploración"
          skeleton={<ExploreLoadingSkeleton />}
          state={simulatedState}
        />
      ) : null}
      {!simulatedState && pageState.status === "loading" ? <ExploreLoadingState /> : null}
      {!simulatedState && pageState.status === "error" ? (
        <ErrorState description={pageState.message} title="No se pudo buscar" />
      ) : null}
      {!simulatedState && pageState.status === "empty" ? (
        <EmptyState
          description="Ajusta la búsqueda, el deporte, la competición, la fecha o la ciudad."
          title="Sin resultados"
        />
      ) : null}
      {!simulatedState && pageState.status === "loaded" ? <ExploreLoadedState data={pageState.data} /> : null}
    </div>
  );
}

function ExploreHeader() {
  return (
    <header className="grid gap-2">
      <Badge tone="primary">Explorar</Badge>
      <div>
        <h1 className="text-h1">Buscar en la plataforma</h1>
        <p className="mt-1 text-body text-muted-foreground">
          Encuentra partidos, equipos, jugadores, competiciones y eventos deportivos.
        </p>
      </div>
    </header>
  );
}

type ExploreFiltersProps = Readonly<{
  cityOptions: readonly string[];
  competitionOptions: ExplorePageData["competitions"];
  filters: ExploreFilters;
  onFilterChange: <Key extends keyof ExploreFilters>(key: Key, value: ExploreFilters[Key]) => void;
  sports: readonly Sport[];
}>;

function ExploreFilters({
  cityOptions,
  competitionOptions,
  filters,
  onFilterChange,
  sports
}: ExploreFiltersProps) {
  return (
    <Card className="grid gap-3 p-3">
      <SearchInput
        label="Buscar"
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onFilterChange("query", event.target.value);
        }}
        placeholder="Equipo, jugador, ciudad o competición"
        value={filters.query}
      />
      <div className="grid gap-3 md:grid-cols-4">
        <Select
          label="Deporte"
          onChange={(event: ChangeEvent<HTMLSelectElement>) => {
            onFilterChange("sportSlug", event.target.value);
          }}
          options={[
            { label: "Todos", value: "all" },
            ...sports.map((sport) => ({ label: sport.name, value: sport.slug })),
            { label: "eSports", value: "esports" }
          ]}
          value={filters.sportSlug}
        />
        <Select
          label="Competición"
          onChange={(event: ChangeEvent<HTMLSelectElement>) => {
            onFilterChange("competitionSlug", event.target.value);
          }}
          options={[
            { label: "Todas", value: "all" },
            ...competitionOptions.map((competition) => ({
              label: competition.name,
              value: competition.slug
            }))
          ]}
          value={filters.competitionSlug}
        />
        <Select
          label="Ciudad"
          onChange={(event: ChangeEvent<HTMLSelectElement>) => {
            onFilterChange("city", event.target.value);
          }}
          options={[
            { label: "Todas", value: "all" },
            ...cityOptions.map((city) => ({ label: city, value: city }))
          ]}
          value={filters.city}
        />
        <label className="grid gap-2 text-label text-foreground">
          <span>Fecha</span>
          <input
            className="min-h-11 w-full rounded-md border border-input bg-surface px-3 text-body text-foreground outline-none transition-colors hover:border-primary/60 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              onFilterChange("date", event.target.value);
            }}
            type="date"
            value={filters.date}
          />
        </label>
      </div>
    </Card>
  );
}

function ExploreLoadedState({ data }: Readonly<{ data: ExplorePageData }>) {
  return (
    <div className="grid gap-5">
      <Section title="Resultados" icon={<Search className="size-5 text-primary" aria-hidden="true" />}>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {data.results.map((result) => (
            <SearchResultCard key={result.id} result={result} />
          ))}
        </div>
      </Section>
      <Section title="Tendencias" icon={<Flame className="size-5 text-live" aria-hidden="true" />}>
        <CompactResultGrid results={data.trends} />
      </Section>
      <Section title="Deportes" icon={<Shield className="size-5 text-primary" aria-hidden="true" />}>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {data.sports.map((sport) => (
            <SportCard key={sport.id} sport={sport} />
          ))}
        </div>
      </Section>
      <Section title="Competiciones" icon={<Trophy className="size-5 text-warning" aria-hidden="true" />}>
        <CompactResultGrid results={data.competitions.slice(0, 8).map((competition) => ({
          id: competition.id,
          meta: competition.country ?? "Global",
          subtitle: "Competición",
          title: competition.name,
          type: "competition"
        }))} />
      </Section>
      <Section title="Eventos cercanos" icon={<MapPin className="size-5 text-info" aria-hidden="true" />}>
        <NearbyEvents matches={data.nearbyEvents} />
      </Section>
      <Section title="Equipos destacados" icon={<Users className="size-5 text-primary" aria-hidden="true" />}>
        <CompactResultGrid results={data.featuredTeams.map((team) => ({
          id: team.id,
          meta: team.country ?? "Global",
          subtitle: team.shortName ?? "Equipo",
          title: team.name,
          type: "team"
        }))} />
      </Section>
    </div>
  );
}

function Section({
  children,
  icon,
  title
}: Readonly<{ children: ReactNode; icon: ReactNode; title: string }>) {
  return (
    <section className="grid gap-3" aria-labelledby={`explore-${title.toLowerCase().replaceAll(" ", "-")}`}>
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-h2" id={`explore-${title.toLowerCase().replaceAll(" ", "-")}`}>
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function CompactResultGrid({ results }: Readonly<{ results: readonly SearchResult[] }>) {
  if (results.length === 0) {
    return <InlineEmptyState message="No hay elementos para mostrar con estos filtros." />;
  }

  return (
    <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
      {results.map((result) => (
        <SearchResultCard isCompact key={result.id} result={result} />
      ))}
    </div>
  );
}

function SearchResultCard({
  isCompact = false,
  result
}: Readonly<{ isCompact?: boolean; result: SearchResult }>) {
  const content = (
    <article className={`grid gap-2 rounded-lg border border-border bg-card p-3 shadow-sm transition-colors hover:border-primary ${isCompact ? "min-h-28" : "min-h-36"}`}>
      <div className="flex items-start justify-between gap-3">
        <Badge tone={result.type === "event" || result.type === "match" ? "primary" : "muted"}>
          {resultTypeLabels[result.type]}
        </Badge>
        <span className="text-caption text-muted-foreground">{result.meta}</span>
      </div>
      <div className="min-w-0">
        <h3 className="truncate text-h3">{result.title}</h3>
        <p className="mt-1 truncate text-caption text-muted-foreground">{result.subtitle}</p>
      </div>
    </article>
  );

  if (result.href) {
    return (
      <Link className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" href={result.href}>
        {content}
      </Link>
    );
  }

  return content;
}

function SportCard({ sport }: Readonly<{ sport: Sport }>) {
  return (
    <article className="grid gap-2 rounded-lg border border-border bg-card p-3 shadow-sm">
      <Badge tone="primary">{sport.slug}</Badge>
      <h3 className="text-h3">{sport.name}</h3>
      <p className="text-caption text-muted-foreground">Deporte disponible para explorar</p>
    </article>
  );
}

function NearbyEvents({ matches }: Readonly<{ matches: readonly Match[] }>) {
  if (matches.length === 0) {
    return <InlineEmptyState message="No hay eventos cercanos para estos filtros." />;
  }

  return (
    <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
      {matches.map((match) => (
        <Link
          className="grid gap-2 rounded-lg border border-border bg-card p-3 shadow-sm transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href={`/matches/${match.id}`}
          key={match.id}
        >
          <div className="flex items-center justify-between gap-3">
            <Badge tone={match.status === "LIVE" ? "error" : "primary"}>{match.status === "LIVE" ? "En vivo" : "Evento"}</Badge>
            <span className="text-caption text-muted-foreground">{formatShortDate(match.startTime)}</span>
          </div>
          <h3 className="truncate text-label">
            {match.homeTeam.name} vs {match.awayTeam.name}
          </h3>
          <p className="inline-flex items-center gap-1 text-caption text-muted-foreground">
            <MapPin className="size-3" aria-hidden="true" />
            {match.venue?.city ?? "Ciudad por confirmar"}
          </p>
        </Link>
      ))}
    </div>
  );
}

function formatShortDate(value: string): string {
  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short"
  }).format(new Date(value));
}

function ExploreLoadingState() {
  return (
    <LoadingState aria-label="Buscando contenido">
      <ExploreLoadingSkeleton />
    </LoadingState>
  );
}

function ExploreLoadingSkeleton() {
  return (
    <>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton className="h-36 w-full" key={index} />
        ))}
      </div>
      <Skeleton className="h-48 w-full" />
    </>
  );
}

function InlineEmptyState({ message }: Readonly<{ message: string }>) {
  return (
    <Card className="p-3">
      <p className="text-caption text-muted-foreground">{message}</p>
    </Card>
  );
}
