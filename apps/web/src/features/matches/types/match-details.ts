import type { Match, Prediction } from "@competencias-platform/contracts";
import type { PredictionFlowSnapshot } from "@features/predictions";

export type MatchDetailsData = Readonly<{
  match: Match;
  predictionFlow: PredictionFlowSnapshot;
  predictions: readonly Prediction[];
}>;

export type MatchDetailsTab = "summary" | "statistics" | "lineups" | "predictions" | "comments";
