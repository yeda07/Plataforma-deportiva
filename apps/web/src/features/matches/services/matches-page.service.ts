import type { Competition, Match, Slug, Sport } from "@competencias-platform/contracts";
import { MockMatchRepository } from "@/repositories";
import type { MatchesPageData, MatchesPageFilters, MatchStatusFilter } from "../types/matches-page";

const matchRepository = new MockMatchRepository();

const knownStatusFilters = new Set<MatchStatusFilter>([
  "all",
  "today",
  "upcoming",
  "live",
  "finished"
]);

function isMatchStatusFilter(value: string | null): value is MatchStatusFilter {
  return value !== null && knownStatusFilters.has(value as MatchStatusFilter);
}

export function parseMatchesPageFilters(params: URLSearchParams): MatchesPageFilters {
  const statusParam = params.get("status");
  const sportSlug = params.get("sport") ?? undefined;
  const competitionSlug = params.get("competition") ?? undefined;
  const date = params.get("date") ?? undefined;

  return {
    status: isMatchStatusFilter(statusParam) ? statusParam : "all",
    ...(sportSlug ? { sportSlug } : {}),
    ...(competitionSlug ? { competitionSlug } : {}),
    ...(date ? { date } : {})
  };
}

function byStartTimeAscending(firstMatch: Match, secondMatch: Match): number {
  return new Date(firstMatch.startTime).getTime() - new Date(secondMatch.startTime).getTime();
}

function isSameUtcDate(value: string, date: string): boolean {
  return value.slice(0, 10) === date;
}

function getTodayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function matchesStatusFilter(match: Match, filters: MatchesPageFilters): boolean {
  if (filters.status === "all") {
    return true;
  }

  if (filters.status === "today") {
    return isSameUtcDate(match.startTime, filters.date ?? getTodayDate());
  }

  if (filters.status === "upcoming") {
    return match.status === "SCHEDULED" || match.status === "POSTPONED";
  }

  if (filters.status === "live") {
    return match.status === "LIVE" || match.status === "HALFTIME";
  }

  return match.status === "FINISHED";
}

function matchesSecondaryFilters(match: Match, filters: MatchesPageFilters): boolean {
  return (
    (filters.sportSlug ? match.sport.slug === filters.sportSlug : true) &&
    (filters.competitionSlug ? match.competition.slug === filters.competitionSlug : true) &&
    (filters.date ? isSameUtcDate(match.startTime, filters.date) : true)
  );
}

function uniqueBySlug<TItem extends { slug: Slug }>(items: readonly TItem[]): readonly TItem[] {
  const itemsBySlug = new Map<Slug, TItem>();

  for (const item of items) {
    itemsBySlug.set(item.slug, item);
  }

  return [...itemsBySlug.values()];
}

export async function getMatchesPageData(filters: MatchesPageFilters): Promise<MatchesPageData> {
  const allMatches = await matchRepository.findAll();
  const matches = allMatches
    .filter((match) => matchesStatusFilter(match, filters))
    .filter((match) => matchesSecondaryFilters(match, filters))
    .sort(byStartTimeAscending);

  return {
    competitions: uniqueBySlug<Competition>(allMatches.map((match) => match.competition)),
    filters,
    matches,
    sports: uniqueBySlug<Sport>(allMatches.map((match) => match.sport)),
    totalMatches: allMatches.length
  };
}
