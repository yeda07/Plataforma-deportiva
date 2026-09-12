import type {
  Competition,
  Identifier,
  Match,
  MatchEvent,
  MatchStatistics,
  MatchStatus,
  Team
} from "@competencias-platform/contracts";
import { competitions } from "./competitions";
import { createMockId } from "./ids";
import { sports } from "./sports";
import { teams } from "./teams";

type MatchFixtureInput = Readonly<{
  idNumber: number;
  competitionIndex: number;
  homeTeamIndex: number;
  awayTeamIndex: number;
  status: MatchStatus;
  startTime: string;
  scoreHome: number;
  scoreAway: number;
  venue: string;
  city: string;
}>;

function getItem<TItem>(items: readonly TItem[], index: number): TItem {
  const item = items[index];

  if (!item) {
    throw new Error(`Missing fixture item at index ${index.toString()}`);
  }

  return item;
}

function createStatistics(seed: number): MatchStatistics {
  const possessionHomePercent = 45 + (seed % 11);

  return {
    possessionHomePercent,
    possessionAwayPercent: 100 - possessionHomePercent,
    shotsHome: 8 + (seed % 8),
    shotsAway: 7 + ((seed + 3) % 8),
    shotsOnTargetHome: 3 + (seed % 5),
    shotsOnTargetAway: 2 + ((seed + 2) % 5),
    cornersHome: 2 + (seed % 6),
    cornersAway: 1 + ((seed + 1) % 6),
    foulsHome: 7 + (seed % 7),
    foulsAway: 6 + ((seed + 2) % 7)
  };
}

function createEvents(
  matchId: Identifier,
  homeTeam: Team,
  awayTeam: Team,
  status: MatchStatus,
  scoreHome: number,
  scoreAway: number,
  seed: number
): readonly MatchEvent[] {
  if (status === "SCHEDULED" || status === "POSTPONED" || status === "CANCELLED") {
    return [];
  }

  const totalGoals = scoreHome + scoreAway;
  const goalEvents = Array.from({ length: totalGoals }, (_, index) => ({
    id: createMockId(3000 + seed * 10 + index),
    matchId,
    type: "GOAL",
    minute: 12 + index * 17,
    teamId: index < scoreHome ? homeTeam.id : awayTeam.id,
    description: index < scoreHome ? `Gol de ${homeTeam.name}` : `Gol de ${awayTeam.name}`,
    occurredAt: "2026-09-10T20:00:00.000Z"
  })) satisfies readonly MatchEvent[];

  return [
    {
      id: createMockId(2900 + seed),
      matchId,
      type: "PERIOD_START",
      minute: 1,
      description: "Inicio del partido",
      occurredAt: "2026-09-10T19:00:00.000Z"
    },
    ...goalEvents
  ] satisfies readonly MatchEvent[];
}

function createMatch(input: MatchFixtureInput): Match {
  const competition = getItem<Competition>(competitions, input.competitionIndex);
  const sport = getItem(sports, sports.findIndex((item) => item.id === competition.sportId));
  const homeTeam = getItem<Team>(teams, input.homeTeamIndex);
  const awayTeam = getItem<Team>(teams, input.awayTeamIndex);
  const matchId = createMockId(input.idNumber);

  return {
    id: matchId,
    externalId: `match-${input.idNumber.toString()}`,
    provider: "mock-sports",
    slug: `${homeTeam.slug}-vs-${awayTeam.slug}-${input.idNumber.toString()}`,
    sport,
    competition,
    homeTeam,
    awayTeam,
    status: input.status,
    startTime: input.startTime,
    score: {
      home: input.scoreHome,
      away: input.scoreAway
    },
    venue: {
      name: input.venue,
      city: input.city,
      ...(competition.country ? { country: competition.country } : {})
    },
    ...(input.status === "SCHEDULED" ||
    input.status === "POSTPONED" ||
    input.status === "CANCELLED"
      ? {}
      : { statistics: createStatistics(input.idNumber) }),
    events: createEvents(
      matchId,
      homeTeam,
      awayTeam,
      input.status,
      input.scoreHome,
      input.scoreAway,
      input.idNumber
    )
  };
}

const matchInputs = [
  { idNumber: 701, competitionIndex: 0, homeTeamIndex: 0, awayTeamIndex: 1, status: "LIVE", startTime: "2026-09-10T19:00:00.000Z", scoreHome: 1, scoreAway: 1, venue: "Estadio Central", city: "Bogota" },
  { idNumber: 702, competitionIndex: 0, homeTeamIndex: 2, awayTeamIndex: 3, status: "LIVE", startTime: "2026-09-10T19:30:00.000Z", scoreHome: 2, scoreAway: 0, venue: "Arena Titan", city: "Medellin" },
  { idNumber: 703, competitionIndex: 2, homeTeamIndex: 6, awayTeamIndex: 7, status: "LIVE", startTime: "2026-09-10T20:00:00.000Z", scoreHome: 64, scoreAway: 61, venue: "Coliseo Norte", city: "Monterrey" },
  { idNumber: 704, competitionIndex: 4, homeTeamIndex: 12, awayTeamIndex: 13, status: "HALFTIME", startTime: "2026-09-10T18:45:00.000Z", scoreHome: 1, scoreAway: 1, venue: "Domo Pacifico", city: "Lima" },
  { idNumber: 705, competitionIndex: 5, homeTeamIndex: 14, awayTeamIndex: 15, status: "LIVE", startTime: "2026-09-10T21:00:00.000Z", scoreHome: 3, scoreAway: 2, venue: "Parque Caribe", city: "Santo Domingo" },
  { idNumber: 706, competitionIndex: 0, homeTeamIndex: 4, awayTeamIndex: 5, status: "SCHEDULED", startTime: "2026-09-11T18:00:00.000Z", scoreHome: 0, scoreAway: 0, venue: "Estadio del Puerto", city: "Callao" },
  { idNumber: 707, competitionIndex: 1, homeTeamIndex: 18, awayTeamIndex: 19, status: "SCHEDULED", startTime: "2026-09-11T20:00:00.000Z", scoreHome: 0, scoreAway: 0, venue: "Estadio Llanos", city: "Villavicencio" },
  { idNumber: 708, competitionIndex: 2, homeTeamIndex: 8, awayTeamIndex: 9, status: "SCHEDULED", startTime: "2026-09-12T01:00:00.000Z", scoreHome: 0, scoreAway: 0, venue: "Arena Metropolitana", city: "Bogota" },
  { idNumber: 709, competitionIndex: 3, homeTeamIndex: 10, awayTeamIndex: 11, status: "SCHEDULED", startTime: "2026-09-12T16:00:00.000Z", scoreHome: 0, scoreAway: 0, venue: "Court Pacifico", city: "Valparaiso" },
  { idNumber: 710, competitionIndex: 6, homeTeamIndex: 16, awayTeamIndex: 17, status: "SCHEDULED", startTime: "2026-09-12T14:00:00.000Z", scoreHome: 0, scoreAway: 0, venue: "Ruta Alto del Sol", city: "Manizales" },
  { idNumber: 711, competitionIndex: 7, homeTeamIndex: 0, awayTeamIndex: 19, status: "SCHEDULED", startTime: "2026-09-13T22:00:00.000Z", scoreHome: 0, scoreAway: 0, venue: "Arena Atlantica", city: "Rio de Janeiro" },
  { idNumber: 712, competitionIndex: 0, homeTeamIndex: 1, awayTeamIndex: 2, status: "SCHEDULED", startTime: "2026-09-14T19:00:00.000Z", scoreHome: 0, scoreAway: 0, venue: "Estadio Norte", city: "Barranquilla" },
  { idNumber: 713, competitionIndex: 1, homeTeamIndex: 3, awayTeamIndex: 4, status: "SCHEDULED", startTime: "2026-09-15T19:30:00.000Z", scoreHome: 0, scoreAway: 0, venue: "Estadio Aurora", city: "Quito" },
  { idNumber: 714, competitionIndex: 2, homeTeamIndex: 7, awayTeamIndex: 8, status: "SCHEDULED", startTime: "2026-09-15T23:00:00.000Z", scoreHome: 0, scoreAway: 0, venue: "Coliseo Sur", city: "Ciudad de Mexico" },
  { idNumber: 715, competitionIndex: 3, homeTeamIndex: 11, awayTeamIndex: 10, status: "SCHEDULED", startTime: "2026-09-16T15:00:00.000Z", scoreHome: 0, scoreAway: 0, venue: "Cancha Costera", city: "Montevideo" },
  { idNumber: 716, competitionIndex: 0, homeTeamIndex: 0, awayTeamIndex: 2, status: "FINISHED", startTime: "2026-09-08T19:00:00.000Z", scoreHome: 3, scoreAway: 1, venue: "Estadio Central", city: "Bogota" },
  { idNumber: 717, competitionIndex: 0, homeTeamIndex: 3, awayTeamIndex: 5, status: "FINISHED", startTime: "2026-09-08T21:00:00.000Z", scoreHome: 0, scoreAway: 0, venue: "Estadio Aurora", city: "Quito" },
  { idNumber: 718, competitionIndex: 1, homeTeamIndex: 18, awayTeamIndex: 4, status: "FINISHED", startTime: "2026-09-07T20:00:00.000Z", scoreHome: 2, scoreAway: 2, venue: "Estadio Llanos", city: "Villavicencio" },
  { idNumber: 719, competitionIndex: 2, homeTeamIndex: 6, awayTeamIndex: 9, status: "FINISHED", startTime: "2026-09-07T23:00:00.000Z", scoreHome: 88, scoreAway: 79, venue: "Coliseo Norte", city: "Monterrey" },
  { idNumber: 720, competitionIndex: 2, homeTeamIndex: 8, awayTeamIndex: 7, status: "FINISHED", startTime: "2026-09-06T23:30:00.000Z", scoreHome: 72, scoreAway: 76, venue: "Arena Metropolitana", city: "Bogota" },
  { idNumber: 721, competitionIndex: 3, homeTeamIndex: 10, awayTeamIndex: 11, status: "FINISHED", startTime: "2026-09-06T15:00:00.000Z", scoreHome: 2, scoreAway: 1, venue: "Court Pacifico", city: "Valparaiso" },
  { idNumber: 722, competitionIndex: 4, homeTeamIndex: 12, awayTeamIndex: 13, status: "FINISHED", startTime: "2026-09-05T18:00:00.000Z", scoreHome: 3, scoreAway: 2, venue: "Domo Pacifico", city: "Lima" },
  { idNumber: 723, competitionIndex: 5, homeTeamIndex: 14, awayTeamIndex: 15, status: "FINISHED", startTime: "2026-09-05T21:00:00.000Z", scoreHome: 5, scoreAway: 4, venue: "Parque Caribe", city: "Santo Domingo" },
  { idNumber: 724, competitionIndex: 6, homeTeamIndex: 16, awayTeamIndex: 17, status: "FINISHED", startTime: "2026-09-04T14:00:00.000Z", scoreHome: 1, scoreAway: 0, venue: "Ruta Alto del Sol", city: "Manizales" },
  { idNumber: 725, competitionIndex: 7, homeTeamIndex: 19, awayTeamIndex: 1, status: "FINISHED", startTime: "2026-09-04T22:00:00.000Z", scoreHome: 1, scoreAway: 2, venue: "Arena Atlantica", city: "Rio de Janeiro" },
  { idNumber: 726, competitionIndex: 0, homeTeamIndex: 5, awayTeamIndex: 0, status: "POSTPONED", startTime: "2026-09-17T19:00:00.000Z", scoreHome: 0, scoreAway: 0, venue: "Estadio Montana", city: "Santiago" },
  { idNumber: 727, competitionIndex: 1, homeTeamIndex: 2, awayTeamIndex: 18, status: "CANCELLED", startTime: "2026-09-18T20:00:00.000Z", scoreHome: 0, scoreAway: 0, venue: "Arena Titan", city: "Medellin" },
  { idNumber: 728, competitionIndex: 2, homeTeamIndex: 9, awayTeamIndex: 6, status: "SCHEDULED", startTime: "2026-09-18T23:00:00.000Z", scoreHome: 0, scoreAway: 0, venue: "Coliseo Austral", city: "Buenos Aires" },
  { idNumber: 729, competitionIndex: 4, homeTeamIndex: 13, awayTeamIndex: 12, status: "SCHEDULED", startTime: "2026-09-19T18:00:00.000Z", scoreHome: 0, scoreAway: 0, venue: "Arena Playa", city: "Cartagena" },
  { idNumber: 730, competitionIndex: 5, homeTeamIndex: 15, awayTeamIndex: 14, status: "SCHEDULED", startTime: "2026-09-19T21:00:00.000Z", scoreHome: 0, scoreAway: 0, venue: "Diamante Central", city: "Caracas" }
] as const satisfies readonly MatchFixtureInput[];

export const matches = matchInputs.map(createMatch) satisfies readonly Match[];
export const liveMatches = matches.filter(
  (match) => match.status === "LIVE" || match.status === "HALFTIME"
) satisfies readonly Match[];
