import type { RankingEntry } from "@competencias-platform/contracts";
import { developmentUserId } from "@/config/session";
import { MockRankingRepository } from "@/repositories";
import type { RankingRepository } from "@/repositories";
import type {
  RankingPageData,
  RankingPageFilters,
  RankingPeriodFilter,
  RankingSportFilter,
  RankingTableEntry
} from "../types/ranking-page";

const periodPointFactors = {
  daily: 0.12,
  weekly: 1,
  monthly: 3.4,
  season: 8.5
} as const satisfies Record<RankingPeriodFilter, number>;

const sportPointModifiers = {
  all: 1,
  football: 0.92,
  basketball: 0.84,
  tennis: 0.76,
  esports: 0.69
} as const satisfies Record<RankingSportFilter, number>;

export type RankingServiceDependencies = Readonly<{
  rankingRepository?: RankingRepository;
}>;

export class RankingService {
  private readonly rankingRepository: RankingRepository;

  constructor(dependencies: RankingServiceDependencies = {}) {
    this.rankingRepository = dependencies.rankingRepository ?? new MockRankingRepository();
  }

  async getRankingPageData(filters: RankingPageFilters): Promise<RankingPageData> {
    const ranking = await this.rankingRepository.findCurrent();
    const entries = ranking.entries
      .map((entry, index) => this.toTableEntry(entry, filters, index))
      .sort((firstEntry, secondEntry) => secondEntry.points - firstEntry.points)
      .map((entry, index) => ({
        ...entry,
        position: index + 1
      }));

    return {
      entries,
      filters,
      ranking,
      topEntries: entries.slice(0, 3)
    };
  }

  private toTableEntry(
    entry: RankingEntry,
    filters: RankingPageFilters,
    index: number
  ): RankingTableEntry {
    const sportModifier = sportPointModifiers[filters.sport];
    const periodFactor = periodPointFactors[filters.period];
    const seed = index + filters.period.length + filters.sport.length;
    const predictionsCount = Math.max(3, Math.round(entry.predictionsCount * periodFactor * 0.42));
    const misses = seed % 5;
    const hits = Math.max(0, predictionsCount - misses);
    const accuracyPercent = predictionsCount > 0 ? Math.round((hits / predictionsCount) * 100) : 0;
    const points = Math.round(entry.points * periodFactor * sportModifier * (1 - index * 0.015));

    return {
      accuracyPercent,
      achievementsCount: entry.achievementsCount,
      hits,
      isCurrentUser: entry.userId === developmentUserId,
      points,
      position: entry.position,
      predictionsCount,
      profile: entry.profile,
      streak: Math.max(0, hits - misses - index),
      userId: entry.userId
    };
  }
}

export const rankingService = new RankingService();
