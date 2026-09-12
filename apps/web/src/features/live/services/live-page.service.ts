import type { Competition, Match, Sport } from "@competencias-platform/contracts";
import type { LiveCompetitionGroup, LiveMatchGroup } from "../types/live-page-data";

export function groupLiveMatches(matches: readonly Match[]): readonly LiveMatchGroup[] {
  const sportGroups = new Map<Sport["id"], { sport: Sport; matches: Match[] }>();

  for (const match of matches) {
    const existing = sportGroups.get(match.sport.id);

    if (existing) {
      existing.matches.push(match);
    } else {
      sportGroups.set(match.sport.id, { sport: match.sport, matches: [match] });
    }
  }

  return [...sportGroups.values()].map((sportGroup) => ({
    sport: sportGroup.sport,
    competitions: groupByCompetition(sportGroup.matches)
  }));
}

function groupByCompetition(matches: readonly Match[]): readonly LiveCompetitionGroup[] {
  const competitionGroups = new Map<Competition["id"], LiveCompetitionGroup>();

  for (const match of matches) {
    const existing = competitionGroups.get(match.competition.id);

    competitionGroups.set(match.competition.id, {
      competition: match.competition,
      matches: existing ? [...existing.matches, match] : [match]
    });
  }

  return [...competitionGroups.values()];
}
