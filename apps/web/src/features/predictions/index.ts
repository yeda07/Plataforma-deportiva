export const predictionsFeature = {
  key: "predictions",
  label: "Predicciones"
} as const;

export { FreePredictionFlow } from "./components/free-prediction-flow";
export type { FreePredictionFlowProps } from "./components/free-prediction-flow";
export { PredictionLockedError, PredictionService, predictionService } from "./services/prediction.service";
export type {
  FreePredictionOption,
  FreePredictionOptionSummary,
  FreePredictionState,
  PredictionConfirmation,
  PredictionFlowSnapshot
} from "./types/prediction-flow";
