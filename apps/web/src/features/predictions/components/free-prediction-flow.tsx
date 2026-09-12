"use client";

import { CheckCircle2, Lock, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import type { Match } from "@competencias-platform/contracts";
import { Badge, Button, Card, StatusIndicator } from "@competencias-platform/ui";
import { developmentUserId } from "@/config/session";
import { PredictionLockedError, predictionService } from "../services/prediction.service";
import type {
  FreePredictionOption,
  PredictionConfirmation,
  PredictionFlowSnapshot
} from "../types/prediction-flow";

export type FreePredictionFlowProps = Readonly<{
  initialSnapshot: PredictionFlowSnapshot;
  match: Match;
}>;

const stateLabels = {
  AVAILABLE: "Disponible",
  LOCKED: "Bloqueada",
  PENDING: "Registrada",
  CORRECT: "Correcta",
  INCORRECT: "Incorrecta"
} as const satisfies Record<PredictionFlowSnapshot["state"], string>;

function getInitialSelection(snapshot: PredictionFlowSnapshot): FreePredictionOption | null {
  const selectedOption = snapshot.currentPrediction?.selectedOption;

  if (selectedOption === "HOME_WIN" || selectedOption === "DRAW" || selectedOption === "AWAY_WIN") {
    return selectedOption;
  }

  return null;
}

function isTerminalState(state: PredictionFlowSnapshot["state"]): boolean {
  return state === "LOCKED" || state === "CORRECT" || state === "INCORRECT";
}

export function FreePredictionFlow({ initialSnapshot, match }: FreePredictionFlowProps) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [selectedOption, setSelectedOption] = useState<FreePredictionOption | null>(
    getInitialSelection(initialSnapshot)
  );
  const [confirmation, setConfirmation] = useState<PredictionConfirmation | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isLocked = isTerminalState(snapshot.state);
  const selectedSummary = useMemo(
    () => snapshot.options.find((option) => option.option === selectedOption),
    [selectedOption, snapshot.options]
  );

  function handleSelect(option: FreePredictionOption) {
    if (isLocked) {
      return;
    }

    setErrorMessage(null);
    setSelectedOption(option);
    const optionSummary = snapshot.options.find((item) => item.option === option);

    if (optionSummary) {
      setConfirmation({
        communityPercent: optionSummary.communityPercent,
        label: optionSummary.label,
        matchId: match.id,
        potentialPoints: optionSummary.potentialPoints,
        selectedOption: option
      });
    }
  }

  async function handleConfirm() {
    if (!selectedOption) {
      return;
    }

    try {
      await predictionService.confirmPrediction({
        match,
        selectedOption,
        userId: developmentUserId
      });
      const nextSnapshot = await predictionService.getPredictionFlow(match, developmentUserId);
      setSnapshot(nextSnapshot);
      setConfirmation(null);
      setErrorMessage(null);
    } catch (error) {
      if (error instanceof PredictionLockedError) {
        setErrorMessage("El partido ya comenzó. Los cambios están bloqueados.");
        const nextSnapshot = await predictionService.getPredictionFlow(match, developmentUserId);
        setSnapshot(nextSnapshot);
        return;
      }

      setErrorMessage("No pudimos registrar la predicción.");
    }
  }

  return (
    <Card className="grid gap-3 p-3 sm:p-4">
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-primary" aria-hidden="true" />
          <h2 className="text-h3">Predicción gratuita</h2>
        </div>
        <StatusIndicator label={stateLabels[snapshot.state]} tone={isLocked ? "warning" : "success"} />
      </div>

      <div className="grid gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Opciones de predicción">
        {snapshot.options.map((option) => (
          <button
            aria-checked={selectedOption === option.option}
            className="grid min-h-24 gap-2 rounded-lg border border-border bg-background p-3 text-left transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-checked:border-primary aria-checked:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isLocked}
            key={option.option}
            onClick={() => {
              handleSelect(option.option);
            }}
            role="radio"
            type="button"
          >
            <span className="text-label">{option.label}</span>
            <span className="text-caption text-muted-foreground">
              Comunidad {option.communityPercent.toString()}%
            </span>
            <span className="text-caption font-semibold text-warning">
              {option.potentialPoints.toString()} puntos potenciales
            </span>
          </button>
        ))}
      </div>

      {snapshot.currentPrediction ? (
        <div className="flex items-center gap-2 rounded-md border border-success/30 bg-success/10 p-3 text-caption text-foreground">
          <CheckCircle2 className="size-4 text-success" aria-hidden="true" />
          Selección actual: {selectedSummary?.label ?? "Registrada"}
        </div>
      ) : null}

      {isLocked ? (
        <div className="flex items-center gap-2 rounded-md border border-warning/30 bg-warning/10 p-3 text-caption text-foreground">
          <Lock className="size-4 text-warning" aria-hidden="true" />
          Los cambios se bloquean cuando el partido comienza.
        </div>
      ) : null}

      {confirmation ? (
        <div className="grid gap-3 rounded-lg border border-primary/30 bg-primary/10 p-3">
          <div>
            <Badge tone="primary">Confirmación</Badge>
            <p className="mt-2 text-body">
              Confirmar selección: <strong>{confirmation.label}</strong>
            </p>
            <p className="text-caption text-muted-foreground">
              Comunidad {confirmation.communityPercent.toString()}% ·{" "}
              {confirmation.potentialPoints.toString()} puntos potenciales
            </p>
          </div>
          <Button onClick={() => void handleConfirm()}>Confirmar predicción</Button>
        </div>
      ) : null}

      {errorMessage ? <p className="text-caption font-semibold text-error">{errorMessage}</p> : null}
    </Card>
  );
}
