"use client";

import { Filter } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { Badge, Card, Input, Select, Skeleton } from "@competencias-platform/ui";
import {
  ErrorState,
  InterfaceStateSimulation,
  LoadingState,
  NoResultsState
} from "@components";
import { useInterfaceStateSimulation } from "@/hooks";
import { getCommunityPredictionPercent } from "../utils/community-prediction";
import { MatchCard } from "./match-card";
import { getMatchesPageData, parseMatchesPageFilters } from "../services/matches-page.service";
import type { MatchesPageData, MatchStatusFilter } from "../types/matches-page";
import { matchStatusFilterOptions } from "../types/matches-page";

type MatchesPageState =
  | Readonly<{ status: "loading" }>
  | Readonly<{ status: "loaded"; data: MatchesPageData }>
  | Readonly<{ status: "empty"; data: MatchesPageData }>
  | Readonly<{ status: "error"; message: string }>;

export function MatchesPage() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = useMemo(
    () => parseMatchesPageFilters(new URLSearchParams(searchParams.toString())),
    [searchParams]
  );
  const [pageState, setPageState] = useState<MatchesPageState>({ status: "loading" });
  const simulatedState = useInterfaceStateSimulation();

  useEffect(() => {
    let isMounted = true;

    async function loadMatches() {
      setPageState({ status: "loading" });

      try {
        const data = await getMatchesPageData(filters);

        if (!isMounted) {
          return;
        }

        setPageState(data.matches.length > 0 ? { status: "loaded", data } : { status: "empty", data });
      } catch {
        if (isMounted) {
          setPageState({
            status: "error",
            message: "No pudimos cargar los partidos."
          });
        }
      }
    }

    void loadMatches();

    return () => {
      isMounted = false;
    };
  }, [filters]);

  const updateQueryParam = useCallback(
    (key: string, value: string) => {
      const nextParams = new URLSearchParams(searchParams.toString());

      if (value.length === 0 || value === "all") {
        nextParams.delete(key);
      } else {
        nextParams.set(key, value);
      }

      const query = nextParams.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
    },
    [pathname, router, searchParams]
  );

  const handleStatusChange = useCallback(
    (status: MatchStatusFilter) => {
      updateQueryParam("status", status);
    },
    [updateQueryParam]
  );

  const handleSportChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      updateQueryParam("sport", event.target.value);
    },
    [updateQueryParam]
  );

  const handleCompetitionChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      updateQueryParam("competition", event.target.value);
    },
    [updateQueryParam]
  );

  const handleDateChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      updateQueryParam("date", event.target.value);
    },
    [updateQueryParam]
  );

  if (simulatedState) {
    return (
      <InterfaceStateSimulation
        loadingAriaLabel="Cargando partidos"
        resourceName="partidos"
        skeleton={<MatchesLoadingSkeleton />}
        state={simulatedState}
      />
    );
  }

  if (pageState.status === "loading") {
    return <MatchesLoadingState />;
  }

  if (pageState.status === "error") {
    return (
      <ErrorState
        description={pageState.message}
        title="No se pudieron cargar los partidos"
      />
    );
  }

  return (
    <div className="grid gap-4">
      <MatchesHeader totalMatches={pageState.data.totalMatches} visibleMatches={pageState.data.matches.length} />
      <MatchesFilters
        data={pageState.data}
        onCompetitionChange={handleCompetitionChange}
        onDateChange={handleDateChange}
        onSportChange={handleSportChange}
        onStatusChange={handleStatusChange}
      />

      {pageState.status === "empty" ? (
        <MatchesEmptyState />
      ) : (
        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3" aria-label="Listado de partidos">
          {pageState.data.matches.map((match) => (
            <MatchCard
              communityPredictionPercent={getCommunityPredictionPercent(match)}
              key={match.id}
              match={match}
            />
          ))}
        </section>
      )}
    </div>
  );
}

type MatchesHeaderProps = Readonly<{
  totalMatches: number;
  visibleMatches: number;
}>;

function MatchesHeader({ totalMatches, visibleMatches }: MatchesHeaderProps) {
  return (
    <header className="grid gap-2">
      <Badge tone="primary">Partidos</Badge>
      <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <h1 className="text-h1">Calendario deportivo</h1>
          <p className="mt-1 text-body text-muted-foreground">
            Explora partidos, estados en vivo y oportunidades de predicción gratuita.
          </p>
        </div>
        <p className="text-caption font-semibold text-muted-foreground">
          {visibleMatches.toString()} de {totalMatches.toString()} partidos
        </p>
      </div>
    </header>
  );
}

type MatchesFiltersProps = Readonly<{
  data: MatchesPageData;
  onCompetitionChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  onDateChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSportChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  onStatusChange: (status: MatchStatusFilter) => void;
}>;

function MatchesFilters({
  data,
  onCompetitionChange,
  onDateChange,
  onSportChange,
  onStatusChange
}: MatchesFiltersProps) {
  return (
    <Card className="grid gap-3 p-3">
      <div className="flex items-center gap-2 text-label">
        <Filter className="size-4 text-primary" aria-hidden="true" />
        Filtros
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Estado de partidos">
        {matchStatusFilterOptions.map((option) => (
          <button
            aria-pressed={data.filters.status === option.value}
            className="inline-flex min-h-9 shrink-0 items-center rounded-md border border-border bg-surface px-3 text-caption font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground"
            key={option.value}
            onClick={() => {
              onStatusChange(option.value);
            }}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <Select
          label="Deporte"
          onChange={onSportChange}
          options={[
            { label: "Todos", value: "all" },
            ...data.sports.map((sport) => ({ label: sport.name, value: sport.slug }))
          ]}
          value={data.filters.sportSlug ?? "all"}
        />
        <Select
          label="Competición"
          onChange={onCompetitionChange}
          options={[
            { label: "Todas", value: "all" },
            ...data.competitions.map((competition) => ({
              label: competition.name,
              value: competition.slug
            }))
          ]}
          value={data.filters.competitionSlug ?? "all"}
        />
        <Input
          label="Fecha"
          onChange={onDateChange}
          type="date"
          value={data.filters.date ?? ""}
        />
      </div>
    </Card>
  );
}

function MatchesLoadingState() {
  return (
    <LoadingState aria-label="Cargando partidos">
      <MatchesLoadingSkeleton />
    </LoadingState>
  );
}

function MatchesLoadingSkeleton() {
  return (
    <>
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-36 w-full" />
      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 9 }, (_, index) => (
          <Skeleton className="h-44 w-full" key={index} />
        ))}
      </section>
    </>
  );
}

function MatchesEmptyState() {
  return (
    <NoResultsState
      description="Ajusta el deporte, la competición, la fecha o el estado para ver más partidos."
      title="Sin partidos para estos filtros"
    />
  );
}
