import type { Identifier } from "@competencias-platform/contracts";
import { developmentUserId } from "@/config/session";
import { MockMatchRepository, MockPredictionRepository } from "@/repositories";
import { PredictionService } from "@features/predictions";
import type { MatchDetailsData } from "../types/match-details";

const matchRepository = new MockMatchRepository();
const predictionRepository = new MockPredictionRepository();
const predictionService = new PredictionService({ predictionRepository });

export async function getMatchDetails(matchId: Identifier): Promise<MatchDetailsData | null> {
  const match = await matchRepository.findById(matchId);

  if (!match) {
    return null;
  }

  const predictions =
    match.status === "FINISHED"
      ? await predictionService.updateResultsForMatch(match)
      : await predictionRepository.findByMatchId(match.id);
  const predictionFlow = await predictionService.getPredictionFlow(match, developmentUserId);

  return {
    match,
    predictionFlow,
    predictions
  };
}
