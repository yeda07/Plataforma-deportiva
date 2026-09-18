import Image from "next/image";
import Link from "next/link";
import type { Match, MatchStatus } from "@competencias-platform/contracts";
import { Clock3, Eye, Sparkles, Trophy, Users } from "lucide-react";
import { Badge, Card, LiveBadge } from "@competencias-platform/ui";

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
    .slice(0, 3)
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

  if (match.status === "CANCELLED") {
    return "Cancelado";
  }

  return `${formatMatchDate(match.startTime)} · ${formatMatchTime(match.startTime)}`;
}

function getHeaderMetaLabel(match: Match): string {
  if (match.status === "LIVE" || match.status === "HALFTIME") {
    return match.sport.name;
  }

  return getMatchPeriodLabel(match);
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

  if (match.status === "CANCELLED") {
    return <Badge tone="error">Cancelado</Badge>;
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
  const communityPrediction = getCommunityPrediction(communityPredictionPercent);
  const predictionsCount = getPredictionsCount(match);

  return (
    <Card className="group h-full overflow-hidden p-0 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-200 hover:bg-card-hover hover:shadow-card-hover">
      <article className="grid h-full min-w-0 gap-3 p-3" aria-labelledby={`match-${match.id}-title`}>
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
          <div className="min-w-0 space-y-1">
            <p className="flex min-w-0 items-center gap-1.5 text-caption font-extrabold text-foreground">
              <Trophy className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
              <span className="truncate">{match.competition.name}</span>
            </p>
            <h2 className="sr-only" id={`match-${match.id}-title`}>
              {match.homeTeam.name} contra {match.awayTeam.name}
            </h2>
            <p className="flex min-w-0 items-center gap-1.5 text-caption font-semibold text-muted-foreground">
              <Clock3 className="size-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{getHeaderMetaLabel(match)}</span>
            </p>
          </div>
          <div className="grid shrink-0 justify-items-end gap-1">
            {getStatusBadge(match)}
            {match.status === "LIVE" || match.status === "HALFTIME" ? (
              <span className="text-caption font-black text-live">{getMatchPeriodLabel(match)}</span>
            ) : null}
          </div>
        </div>

        <Link
          className="grid min-w-0 gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          href={matchHref}
        >
          <TeamRow
            logoUrl={match.homeTeam.logoUrl}
            name={match.homeTeam.name}
            score={match.score.home}
            shortName={match.homeTeam.shortName}
            showScore={showScore}
          />
          <TeamRow
            logoUrl={match.awayTeam.logoUrl}
            name={match.awayTeam.name}
            score={match.score.away}
            shortName={match.awayTeam.shortName}
            showScore={showScore}
          />
        </Link>

        {communityPrediction ? (
          <div className="grid gap-2 rounded-lg border border-border/80 bg-surface-subtle/70 p-2.5">
            <div className="flex min-w-0 items-center justify-between gap-2">
              <p className="truncate text-caption font-extrabold text-foreground">
                Predicción de la comunidad
              </p>
              <span className="inline-flex shrink-0 items-center gap-1 text-caption font-bold text-muted-foreground">
                <Users className="size-3.5" aria-hidden="true" />
                {predictionsCount} predicciones
              </span>
              <span className="sr-only">Comunidad {communityPrediction.home.toString()}%</span>
            </div>
            <div
              aria-label={`Predicción de la comunidad: Local ${communityPrediction.home.toString()}%, Empate ${communityPrediction.draw.toString()}%, Visitante ${communityPrediction.away.toString()}%`}
              className="flex h-2 overflow-hidden rounded-full bg-muted"
              role="img"
            >
              <span className="bg-primary" style={{ width: `${communityPrediction.home.toString()}%` }} />
              <span className="bg-gold" style={{ width: `${communityPrediction.draw.toString()}%` }} />
              <span className="bg-live" style={{ width: `${communityPrediction.away.toString()}%` }} />
            </div>
            <div className="grid grid-cols-3 gap-2 text-[0.68rem] font-bold text-muted-foreground">
              <PredictionShare label="Local" value={communityPrediction.home} />
              <PredictionShare label="Empate" value={communityPrediction.draw} />
              <PredictionShare label="Visitante" value={communityPrediction.away} />
            </div>
          </div>
        ) : null}

        <div className="mt-auto grid gap-2 border-t border-border/80 pt-3">
          <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
            <span className={getStatusSummaryClass(match.status)}>{matchStatusLabel[match.status]}</span>
            <span className="truncate text-caption font-semibold text-muted-foreground">{match.sport.name}</span>
          </div>

          {showActions ? (
            <div className="grid grid-cols-2 gap-2">
              <Link
                className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-caption font-extrabold text-foreground transition-all duration-200 hover:border-primary-200 hover:bg-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                href={matchHref}
              >
                <Eye className="size-3.5" aria-hidden="true" />
                Ver partido
              </Link>
              <Link
                className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg bg-gradient-button px-3 text-caption font-extrabold text-white shadow-sm transition-all duration-200 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                href={`${matchHref}?action=predict`}
              >
                <Sparkles className="size-3.5" aria-hidden="true" />
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
  logoUrl: string | undefined;
  name: string;
  score: number;
  shortName: string | undefined;
  showScore: boolean;
}>;

function TeamRow({ logoUrl, name, score, shortName, showScore }: TeamRowProps) {
  return (
    <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-lg px-1 py-0.5 transition-colors duration-200 group-hover:bg-white/35 dark:group-hover:bg-white/5">
      <TeamLogo logoUrl={logoUrl} name={name} shortName={shortName} />
      <span className="min-w-0 truncate text-label font-extrabold text-foreground">{name}</span>
      <span className="min-w-8 text-right text-score font-black leading-none text-foreground">
        {showScore ? score.toString() : "-"}
      </span>
    </div>
  );
}

function TeamLogo({
  logoUrl,
  name,
  shortName
}: Readonly<{ logoUrl: string | undefined; name: string; shortName: string | undefined }>) {
  if (logoUrl) {
    return (
      <Image
        alt={`Logo de ${name}`}
        className="size-8 shrink-0 rounded-lg border border-border bg-surface object-contain p-1 shadow-xs"
        height={32}
        src={logoUrl}
        unoptimized
        width={32}
      />
    );
  }

  return (
    <span
      aria-label={`Logo de ${name}`}
      className="relative grid size-8 shrink-0 place-items-center overflow-hidden rounded-lg border border-primary-200 bg-primary-50 text-[0.66rem] font-black text-primary shadow-xs dark:bg-primary-100/35 dark:text-primary-300"
      role="img"
    >
      <span className="absolute -left-2 top-1 h-8 w-3 rotate-12 bg-primary/20 blur-sm" />
      <span className="relative">{getTeamInitials(shortName ?? name)}</span>
    </span>
  );
}

type CommunityPrediction = Readonly<{
  away: number;
  draw: number;
  home: number;
}>;

function getCommunityPrediction(communityPredictionPercent: number | undefined): CommunityPrediction | null {
  if (typeof communityPredictionPercent !== "number") {
    return null;
  }

  const home = Math.min(Math.max(Math.round(communityPredictionPercent), 1), 98);
  const remaining = 100 - home;
  const draw = Math.max(Math.round(remaining * 0.48), 1);
  const away = Math.max(100 - home - draw, 1);

  return { away, draw, home };
}

function PredictionShare({ label, value }: Readonly<{ label: string; value: number }>) {
  return (
    <span className="grid gap-0.5">
      <span className="text-foreground">{value.toString()}%</span>
      <span>{label}</span>
    </span>
  );
}

function getPredictionsCount(match: Match): string {
  const seed = match.id
    .replaceAll("-", "")
    .slice(-5)
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0);
  const predictions = 900 + seed * 17;

  if (predictions >= 1000) {
    return `${(predictions / 1000).toFixed(1)}K`;
  }

  return predictions.toLocaleString("es-CO");
}

function getStatusSummaryClass(status: MatchStatus): string {
  const baseClass = "inline-flex items-center rounded-full px-2 py-1 text-[0.68rem] font-black uppercase leading-none";

  if (status === "LIVE" || status === "HALFTIME") {
    return `${baseClass} bg-live/12 text-live`;
  }

  if (status === "FINISHED") {
    return `${baseClass} bg-success/12 text-success`;
  }

  if (status === "POSTPONED") {
    return `${baseClass} bg-warning/16 text-warning-foreground`;
  }

  if (status === "CANCELLED") {
    return `${baseClass} bg-error/12 text-error`;
  }

  return `${baseClass} bg-primary-50 text-primary dark:bg-primary-100/35 dark:text-primary-300`;
}
