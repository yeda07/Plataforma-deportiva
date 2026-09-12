import type { Ranking, Slug } from "@competencias-platform/contracts";
import { ranking } from "@/mocks";
import type { RankingRepository } from "./ranking.repository";

export class MockRankingRepository implements RankingRepository {
  findCurrent(): Promise<Ranking> {
    return Promise.resolve(ranking);
  }

  findBySlug(slug: Slug): Promise<Ranking | null> {
    return Promise.resolve(ranking.slug === slug ? ranking : null);
  }
}
