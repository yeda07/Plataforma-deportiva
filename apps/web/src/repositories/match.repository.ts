import type { Identifier, Match, MatchStatus, Slug } from "@competencias-platform/contracts";

export type MatchFilters = Readonly<{
  status?: MatchStatus;
  sportSlug?: Slug;
  competitionSlug?: Slug;
}>;

export type MatchRepository = Readonly<{
  findAll: (filters?: MatchFilters) => Promise<readonly Match[]>;
  findById: (id: Identifier) => Promise<Match | null>;
  findBySlug: (slug: Slug) => Promise<Match | null>;
  findLive: () => Promise<readonly Match[]>;
}>;
