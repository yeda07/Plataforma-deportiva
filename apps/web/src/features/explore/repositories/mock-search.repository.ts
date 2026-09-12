import { competitions, matches, players, sports, teams } from "@/mocks";
import type { SearchIndex, SearchRepository } from "./search.repository";

export class MockSearchRepository implements SearchRepository {
  getSearchIndex(): SearchIndex {
    return {
      competitions,
      matches,
      players,
      sports,
      teams
    };
  }
}

export const mockSearchRepository = new MockSearchRepository();
