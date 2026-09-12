import type { Prediction, PredictionOption, PredictionStatus } from "@competencias-platform/contracts";
import { Badge, Card } from "@competencias-platform/ui";

export type PredictionCardProps = Readonly<{
  prediction: Prediction;
}>;

const optionLabels: Record<PredictionOption, string> = {
  HOME_WIN: "Local gana",
  DRAW: "Empate",
  AWAY_WIN: "Visitante gana",
  OVER: "Más puntos",
  UNDER: "Menos puntos",
  CUSTOM: "Especial"
};

const statusLabels: Record<PredictionStatus, string> = {
  PENDING: "Pendiente",
  LOCKED: "Bloqueada",
  WON: "Acertada",
  LOST: "Fallada",
  VOID: "Anulada"
};

function getStatusTone(status: PredictionStatus): "primary" | "success" | "warning" | "error" | "muted" {
  if (status === "WON") {
    return "success";
  }

  if (status === "LOST") {
    return "error";
  }

  if (status === "LOCKED") {
    return "warning";
  }

  if (status === "PENDING") {
    return "primary";
  }

  return "muted";
}

export function PredictionCard({ prediction }: PredictionCardProps) {
  return (
    <Card className="grid gap-3 p-3">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-label">{optionLabels[prediction.selectedOption]}</h3>
          <p className="mt-1 text-caption text-muted-foreground">
            {prediction.possiblePoints.toString()} puntos posibles
          </p>
        </div>
        <Badge tone={getStatusTone(prediction.status)}>{statusLabels[prediction.status]}</Badge>
      </div>
      <div className="grid grid-cols-2 gap-2 text-caption">
        <div className="rounded-md bg-muted p-2">
          <span className="block text-muted-foreground">Obtenidos</span>
          <strong className="text-foreground">{prediction.earnedPoints.toString()} pts</strong>
        </div>
        <div className="rounded-md bg-muted p-2">
          <span className="block text-muted-foreground">Creada</span>
          <strong className="text-foreground">
            {new Intl.DateTimeFormat("es-CO", {
              day: "2-digit",
              month: "short"
            }).format(new Date(prediction.createdAt))}
          </strong>
        </div>
      </div>
    </Card>
  );
}
