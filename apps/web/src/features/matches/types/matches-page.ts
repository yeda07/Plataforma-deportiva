import type { Competition, Match, MatchStatus, Slug, Sport } from "@competencias-platform/contracts";

export type MatchStatusFilter = "all" | "today" | "upcoming" | "live" | "finished";

export type MatchesPageFilters = Readonly<{
  competitionSlug?: Slug;
  date?: string;
  sportSlug?: Slug;
  status: MatchStatusFilter;
}>;

export type MatchFilterOption = Readonly<{
  label: string;
  value: string;
}>;

export type MatchesPageData = Readonly<{
  competitions: readonly Competition[];
  filters: MatchesPageFilters;
  matches: readonly Match[];
  sports: readonly Sport[];
  totalMatches: number;
}>;

export const matchStatusFilterOptions = [
  { label: "Todos", value: "all" },
  { label: "Hoy", value: "today" },
  { label: "Próximos", value: "upcoming" },
  { label: "En vivo", value: "live" },
  { label: "Finalizados", value: "finished" }
] as const satisfies readonly MatchFilterOption[];

export const activeMatchStatuses = ["LIVE", "HALFTIME"] as const satisfies readonly MatchStatus[];
