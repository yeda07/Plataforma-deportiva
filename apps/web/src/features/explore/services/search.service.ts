import type { Competition, Match, Player, Sport, Team } from "@competencias-platform/contracts";
import { mockSearchRepository } from "../repositories/mock-search.repository";
import type { SearchIndex, SearchRepository } from "../repositories/search.repository";
import type { ExploreFilters, ExplorePageData, SearchResult } from "../types/explore-page";

const defaultFilters: ExploreFilters = {
  city: "all",
  competitionSlug: "all",
  date: "",
  query: "",
  sportSlug: "all"
};

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function includesQuery(values: readonly string[], query: string): boolean {
  if (query.length === 0) {
    return true;
  }

  return values.some((value) => normalize(value).includes(query));
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function getSportById(sports: readonly Sport[], sportId: string): Sport | undefined {
  return sports.find((sport) => sport.id === sportId);
}

function getTeamById(teams: readonly Team[], teamId: string | undefined): Team | undefined {
  if (!teamId) {
    return undefined;
  }

  return teams.find((team) => team.id === teamId);
}

function matchFilters(match: Match, filters: ExploreFilters): boolean {
  const cityMatches = filters.city === "all" || normalize(match.venue?.city ?? "") === normalize(filters.city);
  const competitionMatches =
    filters.competitionSlug === "all" || match.competition.slug === filters.competitionSlug;
  const sportMatches = filters.sportSlug === "all" || match.sport.slug === filters.sportSlug;
  const dateMatches = filters.date.length === 0 || match.startTime.startsWith(filters.date);

  return cityMatches && competitionMatches && sportMatches && dateMatches;
}

function teamFilters(team: Team, filters: ExploreFilters, sports: readonly Sport[]): boolean {
  const sport = getSportById(sports, team.sportId);
  return filters.sportSlug === "all" || sport?.slug === filters.sportSlug;
}

function playerFilters(player: Player, filters: ExploreFilters, sports: readonly Sport[]): boolean {
  const sport = getSportById(sports, player.sportId);
  return filters.sportSlug === "all" || sport?.slug === filters.sportSlug;
}

function competitionFilters(competition: Competition, filters: ExploreFilters, sports: readonly Sport[]): boolean {
  const sport = getSportById(sports, competition.sportId);
  const sportMatches = filters.sportSlug === "all" || sport?.slug === filters.sportSlug;
  const competitionMatches =
    filters.competitionSlug === "all" || competition.slug === filters.competitionSlug;

  return sportMatches && competitionMatches;
}

function toMatchResult(match: Match): SearchResult {
  return {
    href: `/matches/${match.id}`,
    id: `match-${match.id}`,
    meta: `${match.status} · ${formatDate(match.startTime)}`,
    subtitle: match.competition.name,
    title: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
    type: "match"
  };
}

function toEventResult(match: Match): SearchResult {
  return {
    href: `/matches/${match.id}`,
    id: `event-${match.id}`,
    meta: `${match.venue?.city ?? "Ciudad por confirmar"} · ${formatDate(match.startTime)}`,
    subtitle: match.venue?.name ?? match.competition.name,
    title: `Evento: ${match.homeTeam.name} vs ${match.awayTeam.name}`,
    type: "event"
  };
}

function toTeamResult(team: Team, sports: readonly Sport[]): SearchResult {
  const sport = getSportById(sports, team.sportId);

  return {
    id: `team-${team.id}`,
    meta: sport?.name ?? "Deporte",
    subtitle: team.country ?? "Global",
    title: team.name,
    type: "team"
  };
}

function toPlayerResult(player: Player, index: SearchIndex): SearchResult {
  const sport = getSportById(index.sports, player.sportId);
  const team = getTeamById(index.teams, player.teamId);

  return {
    id: `player-${player.id}`,
    meta: sport?.name ?? "Deporte",
    subtitle: `${player.position ?? "Jugador"} · ${team?.name ?? "Sin equipo"}`,
    title: player.name,
    type: "player"
  };
}

function toCompetitionResult(competition: Competition, sports: readonly Sport[]): SearchResult {
  const sport = getSportById(sports, competition.sportId);

  return {
    id: `competition-${competition.id}`,
    meta: sport?.name ?? "Deporte",
    subtitle: competition.country ?? "Global",
    title: competition.name,
    type: "competition"
  };
}

function getCities(matches: readonly Match[]): readonly string[] {
  return [
    ...new Set(
      matches
        .map((match) => match.venue?.city)
        .filter((city): city is string => Boolean(city))
    )
  ].sort();
}

export class SearchService {
  constructor(private readonly repository: SearchRepository = mockSearchRepository) {}

  search(filters: Partial<ExploreFilters> = {}): Promise<ExplorePageData> {
    const index = this.repository.getSearchIndex();
    const normalizedFilters: ExploreFilters = {
      ...defaultFilters,
      ...filters
    };
    const query = normalize(normalizedFilters.query.trim());
    const matchingMatches = index.matches.filter(
      (match) =>
        matchFilters(match, normalizedFilters) &&
        includesQuery(
          [
            match.homeTeam.name,
            match.awayTeam.name,
            match.competition.name,
            match.sport.name,
            match.venue?.city ?? "",
            match.venue?.name ?? ""
          ],
          query
        )
    );
    const matchingTeams = index.teams.filter(
      (team) =>
        teamFilters(team, normalizedFilters, index.sports) &&
        includesQuery([team.name, team.shortName ?? "", team.country ?? ""], query)
    );
    const matchingPlayers = index.players.filter(
      (player) =>
        playerFilters(player, normalizedFilters, index.sports) &&
        includesQuery([player.name, player.position ?? "", player.country ?? ""], query)
    );
    const matchingCompetitions = index.competitions.filter(
      (competition) =>
        competitionFilters(competition, normalizedFilters, index.sports) &&
        includesQuery([competition.name, competition.country ?? ""], query)
    );

    return Promise.resolve({
      competitions: index.competitions,
      featuredTeams: matchingTeams.slice(0, 6),
      filters: normalizedFilters,
      nearbyEvents: matchingMatches
        .filter((match) => match.status === "SCHEDULED" || match.status === "LIVE")
        .slice(0, 5),
      results: [
        ...matchingMatches.map(toMatchResult),
        ...matchingTeams.map((team) => toTeamResult(team, index.sports)),
        ...matchingPlayers.map((player) => toPlayerResult(player, index)),
        ...matchingCompetitions.map((competition) => toCompetitionResult(competition, index.sports)),
        ...matchingMatches.slice(0, 6).map(toEventResult)
      ].slice(0, 24),
      sports: index.sports,
      trends: [
        ...index.matches.filter((match) => match.status === "LIVE").slice(0, 3).map(toMatchResult),
        ...index.competitions.slice(0, 3).map((competition) => toCompetitionResult(competition, index.sports))
      ]
    });
  }

  getCityOptions(): readonly string[] {
    return getCities(this.repository.getSearchIndex().matches);
  }

  getCompetitionOptions(sportSlug: string): readonly Competition[] {
    const index = this.repository.getSearchIndex();

    if (sportSlug === "all") {
      return index.competitions;
    }

    const sport = index.sports.find((item) => item.slug === sportSlug);

    if (!sport) {
      return [];
    }

    return index.competitions.filter((competition) => competition.sportId === sport.id);
  }
}

export const searchService = new SearchService();
