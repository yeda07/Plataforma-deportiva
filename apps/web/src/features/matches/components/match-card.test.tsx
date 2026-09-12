import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Match, MatchStatus } from "@competencias-platform/contracts";
import { MatchCard } from "./match-card";

const baseMatch = {
  id: "01926000-0000-7000-8000-000000009001",
  externalId: "match-test",
  provider: "mock-sports",
  slug: "capital-fc-vs-norte-unido",
  sport: {
    id: "01926000-0000-7000-8000-000000009101",
    slug: "football",
    name: "Futbol"
  },
  competition: {
    id: "01926000-0000-7000-8000-000000009201",
    slug: "liga-andina",
    sportId: "01926000-0000-7000-8000-000000009101",
    name: "Liga Andina"
  },
  homeTeam: {
    id: "01926000-0000-7000-8000-000000009301",
    slug: "capital-fc",
    sportId: "01926000-0000-7000-8000-000000009101",
    name: "Capital FC",
    shortName: "CAP"
  },
  awayTeam: {
    id: "01926000-0000-7000-8000-000000009302",
    slug: "norte-unido",
    sportId: "01926000-0000-7000-8000-000000009101",
    name: "Norte Unido",
    shortName: "NOR"
  },
  status: "SCHEDULED",
  startTime: "2026-09-12T19:00:00.000Z",
  score: {
    home: 0,
    away: 0
  },
  events: []
} as const satisfies Match;

function createMatch(status: MatchStatus, overrides: Partial<Match> = {}): Match {
  return {
    ...baseMatch,
    status,
    ...overrides
  };
}

describe("MatchCard", () => {
  it("renders scheduled match metadata and actions", () => {
    render(<MatchCard communityPredictionPercent={64} match={createMatch("SCHEDULED")} />);

    expect(screen.getByText("Liga Andina")).toBeInTheDocument();
    expect(screen.getByText("Capital FC")).toBeInTheDocument();
    expect(screen.getByText("Norte Unido")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ver partido" })).toHaveAttribute(
      "href",
      `/matches/${baseMatch.id}`
    );
    expect(screen.getByRole("link", { name: "Predecir" })).toHaveAttribute(
      "href",
      `/matches/${baseMatch.id}?action=predict`
    );
    expect(screen.getByText("Comunidad 64%")).toBeInTheDocument();
  });

  it("renders live state with highlighted score and minute", () => {
    render(
      <MatchCard
        match={createMatch("LIVE", {
          score: { home: 2, away: 1 },
          events: [
            {
              id: "01926000-0000-7000-8000-000000009401",
              matchId: baseMatch.id,
              type: "GOAL",
              minute: 63,
              teamId: baseMatch.homeTeam.id,
              occurredAt: "2026-09-12T20:03:00.000Z"
            }
          ]
        })}
      />
    );

    expect(screen.getAllByText("EN VIVO").length).toBeGreaterThan(0);
    expect(screen.getByText("63'")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Predecir" })).not.toBeInTheDocument();
  });

  it("renders halftime period", () => {
    render(<MatchCard match={createMatch("HALFTIME", { score: { home: 1, away: 1 } })} />);

    expect(screen.getAllByText("Entretiempo").length).toBeGreaterThan(0);
    expect(screen.getByText("Descanso")).toBeInTheDocument();
  });

  it("renders finished result", () => {
    render(<MatchCard match={createMatch("FINISHED", { score: { home: 3, away: 0 } })} />);

    expect(screen.getAllByText("Finalizado").length).toBeGreaterThan(0);
    expect(screen.getByText("Resultado final")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("renders postponed state without prediction actions", () => {
    render(<MatchCard communityPredictionPercent={51} match={createMatch("POSTPONED")} />);

    expect(screen.getAllByText("Aplazado").length).toBeGreaterThan(0);
    expect(screen.getByText("Nueva fecha pendiente")).toBeInTheDocument();
    expect(screen.getByText("Comunidad 51%")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Predecir" })).not.toBeInTheDocument();
  });
});
