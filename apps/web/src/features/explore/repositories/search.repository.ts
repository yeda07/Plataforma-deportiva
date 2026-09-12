import type { Competition, Match, Player, Sport, Team } from "@competencias-platform/contracts";

export type SearchIndex = Readonly<{
  competitions: readonly Competition[];
  matches: readonly Match[];
  players: readonly Player[];
  sports: readonly Sport[];
  teams: readonly Team[];
}>;

export interface SearchRepository {
  getSearchIndex(): SearchIndex;
}
