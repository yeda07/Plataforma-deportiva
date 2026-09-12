import type { Match, Prediction, PredictionOption } from "@competencias-platform/contracts";

export type FreePredictionState = "AVAILABLE" | "LOCKED" | "PENDING" | "CORRECT" | "INCORRECT";

export type FreePredictionOption = Extract<PredictionOption, "HOME_WIN" | "DRAW" | "AWAY_WIN">;

export type FreePredictionOptionSummary = Readonly<{
  communityPercent: number;
  label: string;
  option: FreePredictionOption;
  potentialPoints: number;
}>;

export type PredictionFlowSnapshot = Readonly<{
  currentPrediction?: Prediction;
  match: Match;
  options: readonly FreePredictionOptionSummary[];
  state: FreePredictionState;
}>;

export type PredictionConfirmation = Readonly<{
  communityPercent: number;
  label: string;
  matchId: Match["id"];
  potentialPoints: number;
  selectedOption: FreePredictionOption;
}>;

export type ConfirmPredictionInput = Readonly<{
  match: Match;
  selectedOption: FreePredictionOption;
  userId: Prediction["userId"];
}>;
