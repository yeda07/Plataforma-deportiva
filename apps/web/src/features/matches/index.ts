export const matchesFeature = {
  key: "matches",
  label: "Partidos"
} as const;

export { MatchCard } from "./components/match-card";
export type { MatchCardProps } from "./components/match-card";
export { MatchDetailsPage } from "./components/match-details-page";
export type { MatchDetailsPageProps } from "./components/match-details-page";
export { MatchesPage } from "./components/matches-page";
export { getMatchDetails } from "./services/match.service";
