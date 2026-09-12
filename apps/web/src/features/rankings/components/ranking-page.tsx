"use client";

import { Medal, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, Badge, Card, Skeleton } from "@competencias-platform/ui";
import {
  EmptyState,
  ErrorState,
  InterfaceStateSimulation,
  LoadingState
} from "@components";
import { useInterfaceStateSimulation } from "@/hooks";
import { rankingService } from "../services/ranking.service";
import type {
  RankingPageData,
  RankingPageFilters,
  RankingPeriodFilter,
  RankingSportFilter,
  RankingTableEntry
} from "../types/ranking-page";

type RankingPageState =
  | Readonly<{ status: "loading" }>
  | Readonly<{ status: "loaded"; data: RankingPageData }>
  | Readonly<{ status: "empty"; data: RankingPageData }>
  | Readonly<{ status: "error"; message: string }>;

const periodFilters = [
  { label: "Diario", value: "daily" },
  { label: "Semanal", value: "weekly" },
  { label: "Mensual", value: "monthly" },
  { label: "Temporada", value: "season" }
] as const satisfies readonly { label: string; value: RankingPeriodFilter }[];

const sportFilters = [
  { label: "Todos", value: "all" },
  { label: "Fútbol", value: "football" },
  { label: "Baloncesto", value: "basketball" },
  { label: "Tenis", value: "tennis" },
  { label: "eSports", value: "esports" }
] as const satisfies readonly { label: string; value: RankingSportFilter }[];

export function RankingPage() {
  const [filters, setFilters] = useState<RankingPageFilters>({
    period: "weekly",
    sport: "all"
  });
  const [pageState, setPageState] = useState<RankingPageState>({ status: "loading" });
  const simulatedState = useInterfaceStateSimulation();

  useEffect(() => {
    let isMounted = true;

    async function loadRanking() {
      setPageState({ status: "loading" });

      try {
        const data = await rankingService.getRankingPageData(filters);

        if (!isMounted) {
          return;
        }

        setPageState(data.entries.length > 0 ? { data, status: "loaded" } : { data, status: "empty" });
      } catch {
        if (isMounted) {
          setPageState({
            message: "No pudimos cargar el ranking.",
            status: "error"
          });
        }
      }
    }

    void loadRanking();

    return () => {
      isMounted = false;
    };
  }, [filters]);

  if (simulatedState) {
    return (
      <InterfaceStateSimulation
        loadingAriaLabel="Cargando ranking"
        resourceName="ranking"
        skeleton={<RankingLoadingSkeleton />}
        state={simulatedState}
      />
    );
  }

  if (pageState.status === "loading") {
    return <RankingLoadingState />;
  }

  if (pageState.status === "error") {
    return <ErrorState description={pageState.message} title="No se pudo cargar el ranking" />;
  }

  return (
    <div className="grid gap-5">
      <RankingHeader entriesCount={pageState.data.entries.length} />
      <RankingFilters filters={filters} onFiltersChange={setFilters} />
      {pageState.status === "empty" ? (
        <EmptyState
          description="Aún no hay suficientes predicciones gratuitas para este filtro."
          title="Sin ranking disponible"
        />
      ) : (
        <>
          <RankingPodium entries={pageState.data.topEntries} />
          <RankingTable entries={pageState.data.entries} />
        </>
      )}
    </div>
  );
}

function RankingHeader({ entriesCount }: Readonly<{ entriesCount: number }>) {
  return (
    <header className="grid gap-2">
      <Badge tone="primary">Ranking</Badge>
      <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <h1 className="text-h1">Tabla de comunidad</h1>
          <p className="mt-1 text-body text-muted-foreground">
            Puntos virtuales, precisión y rachas de predicciones gratuitas.
          </p>
        </div>
        <p className="text-caption font-semibold text-muted-foreground">
          {entriesCount.toString()} competidores
        </p>
      </div>
    </header>
  );
}

type RankingFiltersProps = Readonly<{
  filters: RankingPageFilters;
  onFiltersChange: (filters: RankingPageFilters) => void;
}>;

function RankingFilters({ filters, onFiltersChange }: RankingFiltersProps) {
  return (
    <Card className="grid gap-3 p-3">
      <div className="grid gap-3 lg:grid-cols-[auto_1fr] lg:items-center">
        <FilterGroup ariaLabel="Periodo del ranking">
          {periodFilters.map((filter) => (
            <FilterButton
              isActive={filters.period === filter.value}
              key={filter.value}
              onClick={() => {
                onFiltersChange({ ...filters, period: filter.value });
              }}
            >
              {filter.label}
            </FilterButton>
          ))}
        </FilterGroup>
        <FilterGroup ariaLabel="Deporte del ranking">
          {sportFilters.map((filter) => (
            <FilterButton
              isActive={filters.sport === filter.value}
              key={filter.value}
              onClick={() => {
                onFiltersChange({ ...filters, sport: filter.value });
              }}
            >
              {filter.label}
            </FilterButton>
          ))}
        </FilterGroup>
      </div>
    </Card>
  );
}

function FilterGroup({
  ariaLabel,
  children
}: Readonly<{ ariaLabel: string; children: React.ReactNode }>) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1" aria-label={ariaLabel}>
      {children}
    </div>
  );
}

function FilterButton({
  children,
  isActive,
  onClick
}: Readonly<{ children: React.ReactNode; isActive: boolean; onClick: () => void }>) {
  return (
    <button
      aria-pressed={isActive}
      className="inline-flex min-h-9 shrink-0 items-center rounded-md border border-border bg-surface px-3 text-caption font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground"
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function RankingPodium({ entries }: Readonly<{ entries: readonly RankingTableEntry[] }>) {
  const first = entries.find((entry) => entry.position === 1);
  const second = entries.find((entry) => entry.position === 2);
  const third = entries.find((entry) => entry.position === 3);

  return (
    <section className="grid gap-3" aria-labelledby="ranking-podium-title">
      <div className="flex items-center gap-2">
        <Trophy className="size-5 text-warning" aria-hidden="true" />
        <h2 className="text-h2" id="ranking-podium-title">
          Podio
        </h2>
      </div>
      <div className="grid gap-3 md:grid-cols-3 md:items-end">
        {second ? <PodiumCard entry={second} heightClassName="md:min-h-44" /> : null}
        {first ? <PodiumCard entry={first} heightClassName="md:min-h-52" isChampion /> : null}
        {third ? <PodiumCard entry={third} heightClassName="md:min-h-40" /> : null}
      </div>
    </section>
  );
}

function PodiumCard({
  entry,
  heightClassName,
  isChampion = false
}: Readonly<{ entry: RankingTableEntry; heightClassName: string; isChampion?: boolean }>) {
  return (
    <Card
      className={`grid gap-3 p-4 ${heightClassName} ${
        entry.isCurrentUser ? "border-primary bg-primary/10" : ""
      } ${isChampion ? "shadow-lg" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <RankingAvatar entry={entry} />
        <Badge tone={isChampion ? "warning" : "primary"}>#{entry.position.toString()}</Badge>
      </div>
      <div className="min-w-0">
        <h3 className="truncate text-h3">{entry.profile.displayName}</h3>
        <p className="text-caption text-muted-foreground">
          {entry.points.toLocaleString("es-CO")} puntos
        </p>
      </div>
      <div className="grid grid-cols-3 gap-2 text-caption">
        <Metric label="Aciertos" value={entry.hits.toString()} />
        <Metric label="Precisión" value={`${entry.accuracyPercent.toString()}%`} />
        <Metric label="Racha" value={entry.streak.toString()} />
      </div>
    </Card>
  );
}

function RankingTable({ entries }: Readonly<{ entries: readonly RankingTableEntry[] }>) {
  return (
    <Card className="grid gap-3 p-0">
      <div className="flex items-center gap-2 px-3 pt-3 sm:px-4 sm:pt-4">
        <Medal className="size-5 text-primary" aria-hidden="true" />
        <h2 className="text-h2">Ranking completo</h2>
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead className="border-y border-border bg-muted text-caption text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-semibold">Posición</th>
              <th className="px-4 py-3 font-semibold">Usuario</th>
              <th className="px-4 py-3 text-right font-semibold">Puntos</th>
              <th className="px-4 py-3 text-right font-semibold">Predicciones</th>
              <th className="px-4 py-3 text-right font-semibold">Aciertos</th>
              <th className="px-4 py-3 text-right font-semibold">Precisión</th>
              <th className="px-4 py-3 text-right font-semibold">Racha</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <RankingTableRow entry={entry} key={entry.userId} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-2 p-3 md:hidden">
        {entries.map((entry) => (
          <RankingMobileRow entry={entry} key={entry.userId} />
        ))}
      </div>
    </Card>
  );
}

function RankingTableRow({ entry }: Readonly<{ entry: RankingTableEntry }>) {
  return (
    <tr className={entry.isCurrentUser ? "bg-primary/10" : "border-b border-border last:border-b-0"}>
      <td className="px-4 py-3 text-label">#{entry.position.toString()}</td>
      <td className="px-4 py-3">
        <UserCell entry={entry} />
      </td>
      <td className="px-4 py-3 text-right text-label text-primary">
        {entry.points.toLocaleString("es-CO")}
      </td>
      <td className="px-4 py-3 text-right text-caption">{entry.predictionsCount.toString()}</td>
      <td className="px-4 py-3 text-right text-caption">{entry.hits.toString()}</td>
      <td className="px-4 py-3 text-right text-caption">{entry.accuracyPercent.toString()}%</td>
      <td className="px-4 py-3 text-right text-caption">{entry.streak.toString()}</td>
    </tr>
  );
}

function RankingMobileRow({ entry }: Readonly<{ entry: RankingTableEntry }>) {
  return (
    <article
      className={`grid gap-3 rounded-md border border-border bg-background p-3 ${
        entry.isCurrentUser ? "border-primary bg-primary/10" : ""
      }`}
    >
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
        <span className="text-label">#{entry.position.toString()}</span>
        <UserCell entry={entry} />
        <span className="text-label text-primary">{entry.points.toLocaleString("es-CO")}</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        <Metric label="Pred." value={entry.predictionsCount.toString()} />
        <Metric label="Aci." value={entry.hits.toString()} />
        <Metric label="Prec." value={`${entry.accuracyPercent.toString()}%`} />
        <Metric label="Racha" value={entry.streak.toString()} />
      </div>
    </article>
  );
}

function UserCell({ entry }: Readonly<{ entry: RankingTableEntry }>) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <RankingAvatar entry={entry} />
      <div className="min-w-0">
        <p className="truncate text-label">{entry.profile.displayName}</p>
        {entry.isCurrentUser ? (
          <p className="text-caption font-semibold text-primary">Tú</p>
        ) : (
          <p className="text-caption text-muted-foreground">
            {entry.achievementsCount.toString()} logros
          </p>
        )}
      </div>
    </div>
  );
}

function RankingAvatar({ entry }: Readonly<{ entry: RankingTableEntry }>) {
  return (
    <Avatar
      fallback={entry.profile.displayName}
      imageAlt={`Avatar de ${entry.profile.displayName}`}
      {...(entry.profile.avatarUrl ? { imageSrc: entry.profile.avatarUrl } : {})}
    />
  );
}

function Metric({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="min-w-0 rounded-md bg-muted px-1.5 py-2 sm:px-2">
      <span className="block truncate text-[0.6875rem] text-muted-foreground">{label}</span>
      <strong className="block text-caption text-foreground">{value}</strong>
    </div>
  );
}

function RankingLoadingState() {
  return (
    <LoadingState aria-label="Cargando ranking">
      <RankingLoadingSkeleton />
    </LoadingState>
  );
}

function RankingLoadingSkeleton() {
  return (
    <>
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
      <div className="grid gap-3 md:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton className="h-48 w-full" key={index} />
        ))}
      </div>
      <Skeleton className="h-96 w-full" />
    </>
  );
}
