import type { ReactNode } from "react";
import { Circle, Flag, RotateCcw, ShieldAlert, Target } from "lucide-react";
import type { MatchEvent, MatchEventType, Team } from "@competencias-platform/contracts";
import { Badge } from "@competencias-platform/ui";

export type TimelineEventProps = Readonly<{
  event: MatchEvent;
  homeTeam: Team;
  awayTeam: Team;
}>;

const eventLabels: Record<MatchEventType, string> = {
  GOAL: "Gol",
  YELLOW_CARD: "Amarilla",
  RED_CARD: "Roja",
  SUBSTITUTION: "Cambio",
  PERIOD_START: "Inicio",
  PERIOD_END: "Fin",
  OTHER: "Evento"
};

function renderEventIcon(type: MatchEventType): ReactNode {
  if (type === "GOAL") {
    return <Target className="size-4" aria-hidden="true" />;
  }

  if (type === "YELLOW_CARD" || type === "RED_CARD") {
    return <ShieldAlert className="size-4" aria-hidden="true" />;
  }

  if (type === "SUBSTITUTION") {
    return <RotateCcw className="size-4" aria-hidden="true" />;
  }

  if (type === "PERIOD_START" || type === "PERIOD_END") {
    return <Flag className="size-4" aria-hidden="true" />;
  }

  return <Circle className="size-4" aria-hidden="true" />;
}

function getTeamName(event: MatchEvent, homeTeam: Team, awayTeam: Team): string | null {
  if (event.teamId === homeTeam.id) {
    return homeTeam.name;
  }

  if (event.teamId === awayTeam.id) {
    return awayTeam.name;
  }

  return null;
}

export function TimelineEvent({ awayTeam, event, homeTeam }: TimelineEventProps) {
  const teamName = getTeamName(event, homeTeam, awayTeam);

  return (
    <li className="grid grid-cols-[auto_1fr] gap-3 rounded-md border border-border bg-background p-3">
      <div className="grid size-9 place-items-center rounded-md bg-muted text-primary">
        {renderEventIcon(event.type)}
      </div>
      <div className="min-w-0">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <Badge tone={event.type === "GOAL" ? "primary" : "muted"}>
            {event.minute ? `${event.minute.toString()}'` : eventLabels[event.type]}
          </Badge>
          <span className="text-label">{event.description ?? eventLabels[event.type]}</span>
        </div>
        {teamName ? <p className="mt-1 truncate text-caption text-muted-foreground">{teamName}</p> : null}
      </div>
    </li>
  );
}
