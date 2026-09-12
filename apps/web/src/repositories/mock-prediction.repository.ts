import type { Identifier, Prediction } from "@competencias-platform/contracts";
import { predictions } from "@/mocks";
import type { PredictionRepository, SavePredictionInput } from "./prediction.repository";

let predictionStore: Prediction[] = [...predictions];

function createPredictionId(): Identifier {
  return crypto.randomUUID() as Identifier;
}

function createSavedPrediction(input: SavePredictionInput): Prediction {
  return {
    id: input.id ?? createPredictionId(),
    userId: input.userId,
    matchId: input.matchId,
    selectedOption: input.selectedOption,
    possiblePoints: input.possiblePoints,
    earnedPoints: input.earnedPoints,
    status: input.status,
    createdAt: new Date().toISOString()
  };
}

export class MockPredictionRepository implements PredictionRepository {
  findAll(): Promise<readonly Prediction[]> {
    return Promise.resolve(predictionStore);
  }

  findByUserId(userId: Identifier): Promise<readonly Prediction[]> {
    return Promise.resolve(predictionStore.filter((prediction) => prediction.userId === userId));
  }

  findByMatchId(matchId: Identifier): Promise<readonly Prediction[]> {
    return Promise.resolve(predictionStore.filter((prediction) => prediction.matchId === matchId));
  }

  save(input: SavePredictionInput): Promise<Prediction> {
    const existingIndex = predictionStore.findIndex(
      (prediction) => prediction.userId === input.userId && prediction.matchId === input.matchId
    );
    const existing = existingIndex >= 0 ? predictionStore[existingIndex] : undefined;
    const savedPrediction = createSavedPrediction({
      ...input,
      ...(existing ? { id: existing.id } : {})
    });

    if (existingIndex >= 0) {
      predictionStore = predictionStore.map((prediction, index) =>
        index === existingIndex ? savedPrediction : prediction
      );
    } else {
      predictionStore = [savedPrediction, ...predictionStore];
    }

    return Promise.resolve(savedPrediction);
  }

  async saveMany(inputs: readonly SavePredictionInput[]): Promise<readonly Prediction[]> {
    const savedPredictions: Prediction[] = [];

    for (const input of inputs) {
      savedPredictions.push(await this.save(input));
    }

    return savedPredictions;
  }
}
