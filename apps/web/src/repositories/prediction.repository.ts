import type { Identifier, Prediction } from "@competencias-platform/contracts";

export type SavePredictionInput = Readonly<{
  earnedPoints: number;
  id?: Identifier;
  matchId: Identifier;
  possiblePoints: number;
  selectedOption: Prediction["selectedOption"];
  status: Prediction["status"];
  userId: Identifier;
}>;

export type PredictionRepository = Readonly<{
  findAll: () => Promise<readonly Prediction[]>;
  findByUserId: (userId: Identifier) => Promise<readonly Prediction[]>;
  findByMatchId: (matchId: Identifier) => Promise<readonly Prediction[]>;
  save: (prediction: SavePredictionInput) => Promise<Prediction>;
  saveMany: (predictions: readonly SavePredictionInput[]) => Promise<readonly Prediction[]>;
}>;
