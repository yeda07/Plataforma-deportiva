import type { Identifier, Match, Slug } from "@competencias-platform/contracts";
import { liveMatches, matches } from "@/mocks";
import type { MatchFilters, MatchRepository } from "./match.repository";

function applyMatchFilters(match: Match, filters?: MatchFilters): boolean {
  if (!filters) {
    return true;
  }

  return (
    (filters.status ? match.status === filters.status : true) &&
    (filters.sportSlug ? match.sport.slug === filters.sportSlug : true) &&
    (filters.competitionSlug ? match.competition.slug === filters.competitionSlug : true)
  );
}

export class MockMatchRepository implements MatchRepository {
  findAll(filters?: MatchFilters): Promise<readonly Match[]> {
    return Promise.resolve(matches.filter((match) => applyMatchFilters(match, filters)));
  }

  findById(id: Identifier): Promise<Match | null> {
    return Promise.resolve(matches.find((match) => match.id === id) ?? null);
  }

  findBySlug(slug: Slug): Promise<Match | null> {
    return Promise.resolve(matches.find((match) => match.slug === slug) ?? null);
  }

  findLive(): Promise<readonly Match[]> {
    return Promise.resolve(liveMatches);
  }
}
