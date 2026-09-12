export type AppEnvironment = "development" | "staging" | "production";

function getAppEnvironment(value: string | undefined): AppEnvironment {
  if (value === "staging" || value === "production") {
    return value;
  }

  return "development";
}

export const appConfig = {
  environment: getAppEnvironment(process.env.NEXT_PUBLIC_APP_ENV),
  name: process.env.NEXT_PUBLIC_APP_NAME ?? "Competencias Platform",
  webUrl: process.env.NEXT_PUBLIC_WEB_URL ?? "http://localhost:3000"
} as const;
