import type { Ranking, Slug } from "@competencias-platform/contracts";

export type RankingRepository = Readonly<{
  findCurrent: () => Promise<Ranking>;
  findBySlug: (slug: Slug) => Promise<Ranking | null>;
}>;
