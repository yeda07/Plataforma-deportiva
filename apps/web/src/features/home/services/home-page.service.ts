import type {
  Competition,
  Match,
  MatchStatus,
  Prediction,
  PredictionOption
} from "@competencias-platform/contracts";
import {
  MockMatchRepository,
  MockPredictionRepository,
  MockRankingRepository
} from "@/repositories";
import type { FeaturedCompetition, HomePageData, PopularPrediction } from "../types/home-page-data";

const matchRepository = new MockMatchRepository();
const predictionRepository = new MockPredictionRepository();
const rankingRepository = new MockRankingRepository();

const statusPriority: Record<MatchStatus, number> = {
  LIVE: 0,
  HALFTIME: 1,
  SCHEDULED: 2,
  FINISHED: 3,
  POSTPONED: 4,
  CANCELLED: 5
};

const predictionOptionLabel: Record<PredictionOption, string> = {
  HOME_WIN: "Gana local",
  DRAW: "Empate",
  AWAY_WIN: "Gana visitante",
  OVER: "Marcador alto",
  UNDER: "Marcador bajo",
  CUSTOM: "Predicción especial"
};

function byStartTimeAscending(firstMatch: Match, secondMatch: Match): number {
  return new Date(firstMatch.startTime).getTime() - new Date(secondMatch.startTime).getTime();
}

function byStatusPriority(firstMatch: Match, secondMatch: Match): number {
  return statusPriority[firstMatch.status] - statusPriority[secondMatch.status];
}

function isActiveMatch(match: Match): boolean {
  return match.status === "LIVE" || match.status === "HALFTIME";
}

function getCommunityPercent(match: Match): number {
  const seed = match.id
    .replaceAll("-", "")
    .slice(-4)
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0);

  return 52 + (seed % 39);
}

function getFeaturedCompetitions(matches: readonly Match[]): readonly FeaturedCompetition[] {
  const competitionsById = new Map<Competition["id"], FeaturedCompetition>();

  for (const match of matches) {
    const existing = competitionsById.get(match.competition.id);

    competitionsById.set(match.competition.id, {
      competition: match.competition,
      matchesCount: (existing?.matchesCount ?? 0) + 1,
      liveMatchesCount: (existing?.liveMatchesCount ?? 0) + (isActiveMatch(match) ? 1 : 0)
    });
  }

  return [...competitionsById.values()]
    .sort((first, second) => second.matchesCount - first.matchesCount)
    .slice(0, 6);
}

function getPopularPredictions(
  matches: readonly Match[],
  predictions: readonly Prediction[],
  predictionsCount: number
): readonly PopularPrediction[] {
  return predictions.slice(0, predictionsCount).flatMap((prediction, index) => {
    const match = matches.find((item) => item.id === prediction.matchId);

    if (!match) {
      return [];
    }

    const options = Object.keys(predictionOptionLabel) as PredictionOption[];
    const selectedOption = options[index % options.length] ?? prediction.selectedOption;

    return {
      id: prediction.id,
      match,
      label: predictionOptionLabel[selectedOption],
      possiblePoints: prediction.possiblePoints,
      communityPercent: getCommunityPercent(match)
    };
  });
}

export async function getHomePageData(): Promise<HomePageData> {
  const [allMatches, liveMatches, predictions, ranking] = await Promise.all([
    matchRepository.findAll(),
    matchRepository.findLive(),
    predictionRepository.findAll(),
    rankingRepository.findCurrent()
  ]);

  const sortedMatches = [...allMatches].sort(
    (first, second) => byStatusPriority(first, second) || byStartTimeAscending(first, second)
  );
  const upcomingMatches = allMatches
    .filter((match) => match.status === "SCHEDULED")
    .sort(byStartTimeAscending)
    .slice(0, 10);
  const finishedMatches = allMatches
    .filter((match) => match.status === "FINISHED")
    .sort((first, second) => byStartTimeAscending(second, first))
    .slice(0, 10);
  const featuredMatches = sortedMatches.slice(0, 10);
  return {
    featuredMatch: liveMatches[0] ?? featuredMatches[0] ?? null,
    featuredMatches,
    upcomingMatches,
    liveMatches,
    finishedMatches,
    popularPredictions: getPopularPredictions(allMatches, predictions, 6),
    featuredCompetitions: getFeaturedCompetitions(allMatches),
    ranking: {
      ...ranking,
      entries: ranking.entries.slice(0, 5)
    }
  };
}
