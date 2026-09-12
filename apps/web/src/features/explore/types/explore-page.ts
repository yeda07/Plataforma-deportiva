import type { Competition, Match, Sport, Team } from "@competencias-platform/contracts";

export type SearchEntityType = "match" | "team" | "player" | "competition" | "event";

export type ExploreFilters = Readonly<{
  city: string;
  competitionSlug: string;
  date: string;
  query: string;
  sportSlug: string;
}>;

export type SearchResult = Readonly<{
  href?: string;
  id: string;
  meta: string;
  subtitle: string;
  title: string;
  type: SearchEntityType;
}>;

export type ExplorePageData = Readonly<{
  competitions: readonly Competition[];
  featuredTeams: readonly Team[];
  filters: ExploreFilters;
  nearbyEvents: readonly Match[];
  results: readonly SearchResult[];
  sports: readonly Sport[];
  trends: readonly SearchResult[];
}>;
