import type { Competition, Match, Sport } from "@competencias-platform/contracts";

export type LiveMatchGroup = Readonly<{
  sport: Sport;
  competitions: readonly LiveCompetitionGroup[];
}>;

export type LiveCompetitionGroup = Readonly<{
  competition: Competition;
  matches: readonly Match[];
}>;

export type LiveFeedState =
  | Readonly<{ status: "loading" }>
  | Readonly<{ status: "loaded"; groups: readonly LiveMatchGroup[]; matches: readonly Match[] }>
  | Readonly<{ status: "empty" }>
  | Readonly<{ status: "error"; message: string }>
  | Readonly<{ status: "offline"; matches: readonly Match[] }>;
