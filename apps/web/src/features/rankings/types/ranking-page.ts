import type { Profile, Ranking } from "@competencias-platform/contracts";

export type RankingPeriodFilter = "daily" | "weekly" | "monthly" | "season";
export type RankingSportFilter = "all" | "football" | "basketball" | "tennis" | "esports";

export type RankingPageFilters = Readonly<{
  period: RankingPeriodFilter;
  sport: RankingSportFilter;
}>;

export type RankingTableEntry = Readonly<{
  accuracyPercent: number;
  achievementsCount: number;
  hits: number;
  isCurrentUser: boolean;
  points: number;
  position: number;
  predictionsCount: number;
  profile: Profile;
  streak: number;
  userId: string;
}>;

export type RankingPageData = Readonly<{
  entries: readonly RankingTableEntry[];
  filters: RankingPageFilters;
  ranking: Ranking;
  topEntries: readonly RankingTableEntry[];
}>;
