import { describe, expect, it } from "vitest";
import type { Identifier, Match, Prediction } from "@competencias-platform/contracts";
import type { PredictionRepository, SavePredictionInput } from "@/repositories";
import { PredictionLockedError, PredictionService } from "./prediction.service";

const userId = "01926000-0000-7000-8000-000000009001" as Identifier;
const matchId = "01926000-0000-7000-8000-000000009101" as Identifier;

class InMemoryPredictionRepository implements PredictionRepository {
  private predictions: Prediction[];

  constructor(initialPredictions: readonly Prediction[] = []) {
    this.predictions = [...initialPredictions];
  }

  findAll(): Promise<readonly Prediction[]> {
    return Promise.resolve(this.predictions);
  }

  findByUserId(targetUserId: Identifier): Promise<readonly Prediction[]> {
    return Promise.resolve(
      this.predictions.filter((prediction) => prediction.userId === targetUserId)
    );
  }

  findByMatchId(targetMatchId: Identifier): Promise<readonly Prediction[]> {
    return Promise.resolve(
      this.predictions.filter((prediction) => prediction.matchId === targetMatchId)
    );
  }

  save(input: SavePredictionInput): Promise<Prediction> {
    const existingIndex = this.predictions.findIndex(
      (prediction) => prediction.userId === input.userId && prediction.matchId === input.matchId
    );
    const existing = existingIndex >= 0 ? this.predictions[existingIndex] : undefined;
    const savedPrediction: Prediction = {
      id: input.id ?? existing?.id ?? (`01926000-0000-7000-8000-${(this.predictions.length + 1).toString().padStart(12, "0")}` as Identifier),
      userId: input.userId,
      matchId: input.matchId,
      selectedOption: input.selectedOption,
      possiblePoints: input.possiblePoints,
      earnedPoints: input.earnedPoints,
      status: input.status,
      createdAt: "2026-09-10T12:00:00.000Z"
    };

    if (existingIndex >= 0) {
      this.predictions = this.predictions.map((prediction, index) =>
        index === existingIndex ? savedPrediction : prediction
      );
    } else {
      this.predictions = [savedPrediction, ...this.predictions];
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

function createMatch(overrides: Partial<Match> = {}): Match {
  return {
    id: matchId,
    slug: "andes-fc-vs-caribe-sc",
    sport: {
      id: "01926000-0000-7000-8000-000000000001",
      name: "Fútbol",
      slug: "football"
    },
    competition: {
      id: "01926000-0000-7000-8000-000000000101",
      name: "Liga Andina",
      slug: "liga-andina",
      sportId: "01926000-0000-7000-8000-000000000001"
    },
    homeTeam: {
      id: "01926000-0000-7000-8000-000000000201",
      name: "Andes FC",
      slug: "andes-fc",
      sportId: "01926000-0000-7000-8000-000000000001"
    },
    awayTeam: {
      id: "01926000-0000-7000-8000-000000000202",
      name: "Caribe SC",
      slug: "caribe-sc",
      sportId: "01926000-0000-7000-8000-000000000001"
    },
    status: "SCHEDULED",
    startTime: "2026-09-12T18:00:00.000Z",
    score: { away: 0, home: 0 },
    events: [],
    ...overrides
  };
}

function createService(repository = new InMemoryPredictionRepository()) {
  return new PredictionService({
    now: () => new Date("2026-09-10T12:00:00.000Z"),
    predictionRepository: repository
  });
}

describe("PredictionService", () => {
  it("creates a free prediction before match start", async () => {
    const repository = new InMemoryPredictionRepository();
    const service = createService(repository);
    const match = createMatch();

    const prediction = await service.confirmPrediction({
      match,
      selectedOption: "HOME_WIN",
      userId
    });

    expect(prediction.selectedOption).toBe("HOME_WIN");
    expect(prediction.status).toBe("PENDING");
    expect(prediction.earnedPoints).toBe(0);
  });

  it("modifies an existing prediction before match start", async () => {
    const repository = new InMemoryPredictionRepository();
    const service = createService(repository);
    const match = createMatch();

    await service.confirmPrediction({ match, selectedOption: "HOME_WIN", userId });
    const updatedPrediction = await service.confirmPrediction({
      match,
      selectedOption: "AWAY_WIN",
      userId
    });
    const history = await service.getHistory(userId);

    expect(updatedPrediction.selectedOption).toBe("AWAY_WIN");
    expect(history).toHaveLength(1);
  });

  it("blocks changes after match start", async () => {
    const service = createService();
    const match = createMatch({ status: "LIVE" });

    await expect(
      service.confirmPrediction({ match, selectedOption: "DRAW", userId })
    ).rejects.toBeInstanceOf(PredictionLockedError);
  });

  it("calculates a correct result and assigns earned points", async () => {
    const repository = new InMemoryPredictionRepository();
    const service = createService(repository);
    const match = createMatch();
    const finishedMatch = createMatch({
      score: { away: 1, home: 3 },
      status: "FINISHED"
    });

    await service.confirmPrediction({ match, selectedOption: "HOME_WIN", userId });
    const updatedPredictions = await service.updateResultsForMatch(finishedMatch);

    expect(updatedPredictions[0]?.status).toBe("WON");
    expect(updatedPredictions[0]?.earnedPoints).toBe(updatedPredictions[0]?.possiblePoints);
  });

  it("calculates an incorrect result and clears earned points", async () => {
    const repository = new InMemoryPredictionRepository();
    const service = createService(repository);
    const match = createMatch();
    const finishedMatch = createMatch({
      score: { away: 0, home: 2 },
      status: "FINISHED"
    });

    await service.confirmPrediction({ match, selectedOption: "AWAY_WIN", userId });
    const updatedPredictions = await service.updateResultsForMatch(finishedMatch);

    expect(updatedPredictions[0]?.status).toBe("LOST");
    expect(updatedPredictions[0]?.earnedPoints).toBe(0);
  });
});
