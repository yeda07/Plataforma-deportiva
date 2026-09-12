import Link from "next/link";
import type { Match, MatchStatus } from "@competencias-platform/contracts";
import { Badge, Card, LiveBadge, StatusIndicator } from "@competencias-platform/ui";

export type MatchCardProps = Readonly<{
  match: Match;
  communityPredictionPercent?: number;
}>;

const matchStatusLabel: Record<MatchStatus, string> = {
  SCHEDULED: "Programado",
  LIVE: "EN VIVO",
  HALFTIME: "Entretiempo",
  FINISHED: "Finalizado",
  POSTPONED: "Aplazado",
  CANCELLED: "Cancelado"
};

function formatMatchTime(value: string): string {
  return new Intl.DateTimeFormat("es-CO", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function formatMatchDate(value: string): string {
  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short"
  }).format(new Date(value));
}

function getTeamInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function hasVisibleScore(status: MatchStatus): boolean {
  return status === "LIVE" || status === "HALFTIME" || status === "FINISHED";
}

function getLatestMinute(match: Match): number | null {
  const minutes = match.events
    .map((event) => event.minute)
    .filter((minute): minute is number => typeof minute === "number");

  if (minutes.length === 0) {
    return null;
  }

  return Math.max(...minutes);
}

function getMatchPeriodLabel(match: Match): string {
  if (match.status === "HALFTIME") {
    return "Descanso";
  }

  if (match.status === "LIVE") {
    const latestMinute = getLatestMinute(match);
    return latestMinute ? `${latestMinute.toString()}'` : "En juego";
  }

  if (match.status === "FINISHED") {
    return "Resultado final";
  }

  if (match.status === "POSTPONED") {
    return "Nueva fecha pendiente";
  }

  return `${formatMatchDate(match.startTime)} · ${formatMatchTime(match.startTime)}`;
}

function getStatusTone(status: MatchStatus): "live" | "success" | "warning" | "error" | "muted" {
  if (status === "LIVE" || status === "HALFTIME") {
    return "live";
  }

  if (status === "FINISHED") {
    return "success";
  }

  if (status === "POSTPONED") {
    return "warning";
  }

  if (status === "CANCELLED") {
    return "error";
  }

  return "muted";
}

function getStatusBadge(match: Match) {
  if (match.status === "LIVE") {
    return <LiveBadge label="EN VIVO" />;
  }

  if (match.status === "HALFTIME") {
    return <Badge tone="error">Entretiempo</Badge>;
  }

  if (match.status === "FINISHED") {
    return <Badge tone="success">Finalizado</Badge>;
  }

  if (match.status === "POSTPONED") {
    return <Badge tone="warning">Aplazado</Badge>;
  }

  return <Badge tone="muted">{matchStatusLabel[match.status]}</Badge>;
}

function getMatchHref(match: Match): string {
  return `/matches/${match.id}`;
}

export function MatchCard({ communityPredictionPercent, match }: MatchCardProps) {
  const matchHref = getMatchHref(match);
  const showScore = hasVisibleScore(match.status);
  const showActions = match.status === "SCHEDULED";

  return (
    <Card className="overflow-hidden p-0 transition-colors hover:border-primary/70 hover:bg-surface">
      <article className="grid min-w-0 gap-3 p-3" aria-labelledby={`match-${match.id}-title`}>
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
          <div className="min-w-0">
            <p className="truncate text-caption font-semibold text-muted-foreground">
              {match.competition.name}
            </p>
            <h2 className="sr-only" id={`match-${match.id}-title`}>
              {match.homeTeam.name} contra {match.awayTeam.name}
            </h2>
            <p className="mt-1 truncate text-caption text-muted-foreground">
              {getMatchPeriodLabel(match)}
            </p>
          </div>
          <div className="shrink-0">{getStatusBadge(match)}</div>
        </div>

        <Link
          className="grid min-w-0 gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href={matchHref}
        >
          <TeamRow
            isScoreHighlighted={showScore}
            name={match.homeTeam.name}
            score={match.score.home}
            showScore={showScore}
          />
          <TeamRow
            isScoreHighlighted={showScore}
            name={match.awayTeam.name}
            score={match.score.away}
            showScore={showScore}
          />
        </Link>

        <div className="grid gap-2 border-t border-border pt-3">
          <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
            <StatusIndicator label={matchStatusLabel[match.status]} tone={getStatusTone(match.status)} />
            {typeof communityPredictionPercent === "number" ? (
              <span className="min-w-0 truncate text-caption font-semibold text-muted-foreground">
                Comunidad {communityPredictionPercent.toString()}%
              </span>
            ) : null}
          </div>

          {showActions ? (
            <div className="grid grid-cols-2 gap-2">
              <Link
                className="inline-flex min-h-9 items-center justify-center rounded-md bg-transparent px-3 text-caption font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                href={matchHref}
              >
                Ver partido
              </Link>
              <Link
                className="inline-flex min-h-9 items-center justify-center rounded-md bg-primary px-3 text-caption font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                href={`${matchHref}?action=predict`}
              >
                Predecir
              </Link>
            </div>
          ) : null}
        </div>
      </article>
    </Card>
  );
}

type TeamRowProps = Readonly<{
  isScoreHighlighted: boolean;
  name: string;
  score: number;
  showScore: boolean;
}>;

function TeamRow({ isScoreHighlighted, name, score, showScore }: TeamRowProps) {
  return (
    <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2">
      <span
        aria-label={`Logo de ${name}`}
        className="grid size-8 shrink-0 place-items-center rounded-md bg-muted text-[0.6875rem] font-bold text-foreground"
        role="img"
      >
        {getTeamInitials(name)}
      </span>
      <span className="min-w-0 truncate text-label">{name}</span>
      <span
        className={
          isScoreHighlighted
            ? "min-w-8 rounded-sm bg-primary/15 px-2 py-1 text-center text-h3 text-primary"
            : "min-w-8 text-center text-caption text-muted-foreground"
        }
      >
        {showScore ? score.toString() : "-"}
      </span>
    </div>
  );
}
