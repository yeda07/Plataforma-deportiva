import type { Match, Prediction } from "@competencias-platform/contracts";
import { MockPredictionRepository } from "@/repositories";
import type { PredictionRepository } from "@/repositories";
import type {
  ConfirmPredictionInput,
  FreePredictionOption,
  FreePredictionOptionSummary,
  FreePredictionState,
  PredictionConfirmation,
  PredictionFlowSnapshot
} from "../types/prediction-flow";

const freePredictionOptions = [
  { label: "Local", option: "HOME_WIN" },
  { label: "Empate", option: "DRAW" },
  { label: "Visitante", option: "AWAY_WIN" }
] as const satisfies readonly { label: string; option: FreePredictionOption }[];

export class PredictionLockedError extends Error {
  constructor() {
    super("Prediction changes are locked for this match.");
    this.name = "PredictionLockedError";
  }
}

export type PredictionServiceDependencies = Readonly<{
  now?: () => Date;
  predictionRepository?: PredictionRepository;
}>;

export class PredictionService {
  private readonly now: () => Date;
  private readonly predictionRepository: PredictionRepository;

  constructor(dependencies: PredictionServiceDependencies = {}) {
    this.now = dependencies.now ?? (() => new Date());
    this.predictionRepository = dependencies.predictionRepository ?? new MockPredictionRepository();
  }

  async getPredictionFlow(
    match: Match,
    userId: Prediction["userId"]
  ): Promise<PredictionFlowSnapshot> {
    const matchPredictions = await this.predictionRepository.findByMatchId(match.id);
    const currentPrediction = matchPredictions.find((prediction) => prediction.userId === userId);
    const options = this.buildOptions(matchPredictions);

    return {
      ...(currentPrediction ? { currentPrediction } : {}),
      match,
      options,
      state: this.getState(match, currentPrediction)
    };
  }

  prepareConfirmation(
    match: Match,
    selectedOption: FreePredictionOption,
    matchPredictions: readonly Prediction[] = []
  ): PredictionConfirmation {
    const options = this.buildOptions(matchPredictions);
    const selectedSummary = options.find((option) => option.option === selectedOption);

    if (!selectedSummary) {
      throw new Error("Invalid prediction option.");
    }

    return {
      communityPercent: selectedSummary.communityPercent,
      label: selectedSummary.label,
      matchId: match.id,
      potentialPoints: selectedSummary.potentialPoints,
      selectedOption
    };
  }

  async confirmPrediction(input: ConfirmPredictionInput): Promise<Prediction> {
    if (this.isLocked(input.match)) {
      throw new PredictionLockedError();
    }

    const matchPredictions = await this.predictionRepository.findByMatchId(input.match.id);
    const confirmation = this.prepareConfirmation(
      input.match,
      input.selectedOption,
      matchPredictions
    );

    return this.predictionRepository.save({
      earnedPoints: 0,
      matchId: input.match.id,
      possiblePoints: confirmation.potentialPoints,
      selectedOption: input.selectedOption,
      status: "PENDING",
      userId: input.userId
    });
  }

  async getHistory(userId: Prediction["userId"]): Promise<readonly Prediction[]> {
    return this.predictionRepository.findByUserId(userId);
  }

  async updateResultsForMatch(match: Match): Promise<readonly Prediction[]> {
    if (match.status !== "FINISHED") {
      return this.predictionRepository.findByMatchId(match.id);
    }

    const predictions = await this.predictionRepository.findByMatchId(match.id);

    return this.predictionRepository.saveMany(
      predictions.map((prediction) => {
        const isCorrect = this.isCorrectPrediction(match, prediction.selectedOption);

        return {
          earnedPoints: isCorrect ? prediction.possiblePoints : 0,
          id: prediction.id,
          matchId: prediction.matchId,
          possiblePoints: prediction.possiblePoints,
          selectedOption: prediction.selectedOption,
          status: isCorrect ? "WON" : "LOST",
          userId: prediction.userId
        };
      })
    );
  }

  isCorrectPrediction(match: Match, selectedOption: Prediction["selectedOption"]): boolean {
    if (match.status !== "FINISHED") {
      return false;
    }

    if (selectedOption === "HOME_WIN") {
      return match.score.home > match.score.away;
    }

    if (selectedOption === "DRAW") {
      return match.score.home === match.score.away;
    }

    if (selectedOption === "AWAY_WIN") {
      return match.score.away > match.score.home;
    }

    return false;
  }

  private getState(match: Match, currentPrediction: Prediction | undefined): FreePredictionState {
    if (!currentPrediction) {
      return this.isLocked(match) ? "LOCKED" : "AVAILABLE";
    }

    if (match.status === "FINISHED") {
      return this.isCorrectPrediction(match, currentPrediction.selectedOption)
        ? "CORRECT"
        : "INCORRECT";
    }

    return this.isLocked(match) ? "LOCKED" : "PENDING";
  }

  private isLocked(match: Match): boolean {
    return match.status !== "SCHEDULED" || new Date(match.startTime) <= this.now();
  }

  private buildOptions(predictions: readonly Prediction[]): readonly FreePredictionOptionSummary[] {
    const freePredictions = predictions.filter((prediction) =>
      freePredictionOptions.some((option) => option.option === prediction.selectedOption)
    );

    return freePredictionOptions.map(({ label, option }) => {
      const votes = freePredictions.filter((prediction) => prediction.selectedOption === option).length;
      const communityPercent =
        freePredictions.length > 0 ? Math.round((votes / freePredictions.length) * 100) : 0;

      return {
        communityPercent,
        label,
        option,
        potentialPoints: 80 + (100 - communityPercent)
      };
    });
  }
}

export const predictionService = new PredictionService();
