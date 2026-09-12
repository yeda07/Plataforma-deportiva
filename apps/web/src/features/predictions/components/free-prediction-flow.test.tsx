import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Identifier, Match } from "@competencias-platform/contracts";
import { FreePredictionFlow } from "./free-prediction-flow";
import type { PredictionFlowSnapshot } from "../types/prediction-flow";

const sportId: Identifier = "01926000-0000-7000-8000-000000000001";
const competitionId: Identifier = "01926000-0000-7000-8000-000000000101";
const matchId: Identifier = "01926000-0000-7000-8000-000000000706";
const homeTeamId: Identifier = "01926000-0000-7000-8000-000000000205";
const awayTeamId: Identifier = "01926000-0000-7000-8000-000000000206";

function createMatch(status: Match["status"] = "SCHEDULED"): Match {
  return {
    id: matchId,
    slug: "puerto-real-vs-montana-verde",
    sport: {
      id: sportId,
      name: "Fútbol",
      slug: "football"
    },
    competition: {
      id: competitionId,
      name: "Liga Andina",
      slug: "liga-andina",
      sportId
    },
    homeTeam: {
      id: homeTeamId,
      name: "Puerto Real",
      slug: "puerto-real",
      sportId
    },
    awayTeam: {
      id: awayTeamId,
      name: "Montaña Verde",
      slug: "montana-verde",
      sportId
    },
    status,
    startTime: "2026-09-11T23:00:00.000Z",
    score: { away: 0, home: 0 },
    events: []
  };
}

function createSnapshot(match: Match, state: PredictionFlowSnapshot["state"]): PredictionFlowSnapshot {
  return {
    match,
    options: [
      { communityPercent: 25, label: "Local", option: "HOME_WIN", potentialPoints: 155 },
      { communityPercent: 35, label: "Empate", option: "DRAW", potentialPoints: 145 },
      { communityPercent: 40, label: "Visitante", option: "AWAY_WIN", potentialPoints: 140 }
    ],
    state
  };
}

describe("FreePredictionFlow", () => {
  it("shows confirmation after selecting an available option", () => {
    const match = createMatch();

    render(<FreePredictionFlow initialSnapshot={createSnapshot(match, "AVAILABLE")} match={match} />);

    fireEvent.click(screen.getByRole("radio", { name: /empate/i }));

    expect(screen.getByText("Confirmación")).toBeInTheDocument();
    expect(screen.getByText(/Confirmar selección:/i)).toHaveTextContent("Empate");
    expect(screen.getByRole("button", { name: "Confirmar predicción" })).toBeEnabled();
  });

  it("blocks selection when the match has already started", () => {
    const match = createMatch("LIVE");

    render(<FreePredictionFlow initialSnapshot={createSnapshot(match, "LOCKED")} match={match} />);

    expect(screen.getByText("Bloqueada")).toBeInTheDocument();
    expect(screen.getByText("Los cambios se bloquean cuando el partido comienza.")).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /local/i })).toBeDisabled();
    expect(screen.getByRole("radio", { name: /empate/i })).toBeDisabled();
    expect(screen.getByRole("radio", { name: /visitante/i })).toBeDisabled();
  });
});
