export const exploreFeature = {
  key: "explore",
  label: "Explorar"
} as const;

export { ExplorePage } from "./components/explore-page";
export { SearchService, searchService } from "./services/search.service";
export { MockSearchRepository, mockSearchRepository } from "./repositories/mock-search.repository";
export type { SearchIndex, SearchRepository } from "./repositories/search.repository";
export type { ExploreFilters, ExplorePageData, SearchEntityType, SearchResult } from "./types/explore-page";
