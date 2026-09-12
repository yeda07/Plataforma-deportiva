import type { Competition, Match, Prediction, Ranking } from "@competencias-platform/contracts";

export type HomeTab = "featured" | "upcoming" | "live" | "finished";

export type PopularPrediction = Readonly<{
  id: Prediction["id"];
  match: Match;
  label: string;
  possiblePoints: number;
  communityPercent: number;
}>;

export type FeaturedCompetition = Readonly<{
  competition: Competition;
  matchesCount: number;
  liveMatchesCount: number;
}>;

export type HomePageData = Readonly<{
  featuredMatch: Match | null;
  featuredMatches: readonly Match[];
  upcomingMatches: readonly Match[];
  liveMatches: readonly Match[];
  finishedMatches: readonly Match[];
  popularPredictions: readonly PopularPrediction[];
  featuredCompetitions: readonly FeaturedCompetition[];
  ranking: Ranking;
}>;
