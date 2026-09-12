export const rankingsFeature = {
  key: "rankings",
  label: "Rankings"
} as const;

export { RankingPage } from "./components/ranking-page";
export { RankingService, rankingService } from "./services/ranking.service";
export type {
  RankingPageData,
  RankingPageFilters,
  RankingPeriodFilter,
  RankingSportFilter,
  RankingTableEntry
} from "./types/ranking-page";
