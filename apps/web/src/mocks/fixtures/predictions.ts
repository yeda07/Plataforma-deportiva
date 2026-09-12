import type { Prediction, PredictionOption, PredictionStatus } from "@competencias-platform/contracts";
import { createMockId } from "./ids";
import { matches } from "./matches";
import { users } from "./users";

type PredictionInput = Readonly<{
  idNumber: number;
  userIndex: number;
  matchIndex: number;
  selectedOption: PredictionOption;
  possiblePoints: number;
  earnedPoints: number;
  status: PredictionStatus;
  createdAt: string;
}>;

function createPrediction(input: PredictionInput): Prediction {
  const user = users[input.userIndex];
  const match = matches[input.matchIndex];

  if (!user || !match) {
    throw new Error("Prediction fixture references a missing user or match");
  }

  return {
    id: createMockId(input.idNumber),
    userId: user.id,
    matchId: match.id,
    selectedOption: input.selectedOption,
    possiblePoints: input.possiblePoints,
    earnedPoints: input.earnedPoints,
    status: input.status,
    createdAt: input.createdAt
  };
}

export const predictions = ([
  { idNumber: 801, userIndex: 0, matchIndex: 0, selectedOption: "DRAW", possiblePoints: 120, earnedPoints: 0, status: "LOCKED", createdAt: "2026-09-10T16:20:00.000Z" },
  { idNumber: 802, userIndex: 1, matchIndex: 0, selectedOption: "HOME_WIN", possiblePoints: 110, earnedPoints: 0, status: "LOCKED", createdAt: "2026-09-10T16:25:00.000Z" },
  { idNumber: 803, userIndex: 2, matchIndex: 1, selectedOption: "HOME_WIN", possiblePoints: 95, earnedPoints: 0, status: "LOCKED", createdAt: "2026-09-10T17:10:00.000Z" },
  { idNumber: 804, userIndex: 3, matchIndex: 2, selectedOption: "OVER", possiblePoints: 140, earnedPoints: 0, status: "LOCKED", createdAt: "2026-09-10T17:20:00.000Z" },
  { idNumber: 805, userIndex: 4, matchIndex: 3, selectedOption: "AWAY_WIN", possiblePoints: 130, earnedPoints: 0, status: "LOCKED", createdAt: "2026-09-10T17:30:00.000Z" },
  { idNumber: 806, userIndex: 5, matchIndex: 5, selectedOption: "HOME_WIN", possiblePoints: 100, earnedPoints: 0, status: "PENDING", createdAt: "2026-09-10T12:00:00.000Z" },
  { idNumber: 807, userIndex: 6, matchIndex: 6, selectedOption: "DRAW", possiblePoints: 160, earnedPoints: 0, status: "PENDING", createdAt: "2026-09-10T12:10:00.000Z" },
  { idNumber: 808, userIndex: 7, matchIndex: 7, selectedOption: "AWAY_WIN", possiblePoints: 115, earnedPoints: 0, status: "PENDING", createdAt: "2026-09-10T12:20:00.000Z" },
  { idNumber: 809, userIndex: 8, matchIndex: 8, selectedOption: "HOME_WIN", possiblePoints: 90, earnedPoints: 0, status: "PENDING", createdAt: "2026-09-10T12:30:00.000Z" },
  { idNumber: 810, userIndex: 9, matchIndex: 9, selectedOption: "CUSTOM", possiblePoints: 180, earnedPoints: 0, status: "PENDING", createdAt: "2026-09-10T12:40:00.000Z" },
  { idNumber: 811, userIndex: 0, matchIndex: 15, selectedOption: "HOME_WIN", possiblePoints: 120, earnedPoints: 120, status: "WON", createdAt: "2026-09-08T14:00:00.000Z" },
  { idNumber: 812, userIndex: 1, matchIndex: 15, selectedOption: "AWAY_WIN", possiblePoints: 135, earnedPoints: 0, status: "LOST", createdAt: "2026-09-08T14:05:00.000Z" },
  { idNumber: 813, userIndex: 2, matchIndex: 16, selectedOption: "DRAW", possiblePoints: 150, earnedPoints: 150, status: "WON", createdAt: "2026-09-08T15:00:00.000Z" },
  { idNumber: 814, userIndex: 3, matchIndex: 17, selectedOption: "DRAW", possiblePoints: 150, earnedPoints: 150, status: "WON", createdAt: "2026-09-07T16:00:00.000Z" },
  { idNumber: 815, userIndex: 4, matchIndex: 18, selectedOption: "HOME_WIN", possiblePoints: 100, earnedPoints: 100, status: "WON", createdAt: "2026-09-07T18:00:00.000Z" },
  { idNumber: 816, userIndex: 5, matchIndex: 19, selectedOption: "HOME_WIN", possiblePoints: 110, earnedPoints: 0, status: "LOST", createdAt: "2026-09-06T18:00:00.000Z" },
  { idNumber: 817, userIndex: 6, matchIndex: 20, selectedOption: "HOME_WIN", possiblePoints: 105, earnedPoints: 105, status: "WON", createdAt: "2026-09-06T12:00:00.000Z" },
  { idNumber: 818, userIndex: 7, matchIndex: 21, selectedOption: "HOME_WIN", possiblePoints: 115, earnedPoints: 115, status: "WON", createdAt: "2026-09-05T12:00:00.000Z" },
  { idNumber: 819, userIndex: 8, matchIndex: 22, selectedOption: "OVER", possiblePoints: 125, earnedPoints: 125, status: "WON", createdAt: "2026-09-05T16:00:00.000Z" },
  { idNumber: 820, userIndex: 9, matchIndex: 23, selectedOption: "CUSTOM", possiblePoints: 200, earnedPoints: 0, status: "VOID", createdAt: "2026-09-04T10:00:00.000Z" }
] as const satisfies readonly PredictionInput[]).map(createPrediction) satisfies readonly Prediction[];
