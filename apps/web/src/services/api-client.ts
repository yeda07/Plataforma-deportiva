export type ApiClientRequest = Readonly<{
  path: string;
  init?: RequestInit;
}>;

export type ApiClient = Readonly<{
  request: (request: ApiClientRequest) => Promise<Response>;
}>;

export function createApiClient(baseUrl: string): ApiClient {
  return {
    request: ({ path, init }) => fetch(new URL(path, baseUrl), init)
  };
}
