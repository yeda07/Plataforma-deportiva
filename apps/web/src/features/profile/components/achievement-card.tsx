import { Award } from "lucide-react";
import type { Achievement } from "@competencias-platform/contracts";
import { Badge, Card } from "@competencias-platform/ui";

export type AchievementCardProps = Readonly<{
  achievement: Achievement;
}>;

export function AchievementCard({ achievement }: AchievementCardProps) {
  return (
    <Card className="grid gap-3 p-3">
      <div className="flex items-start justify-between gap-3">
        <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
          <Award className="size-5" aria-hidden="true" />
        </span>
        <Badge tone={achievement.unlockedAt ? "success" : "muted"}>
          {achievement.unlockedAt ? "Desbloqueado" : "Pendiente"}
        </Badge>
      </div>
      <div className="min-w-0">
        <h3 className="truncate text-h3">{achievement.name}</h3>
        <p className="mt-1 text-caption text-muted-foreground">{achievement.description}</p>
      </div>
      <p className="text-caption font-semibold text-warning">
        {achievement.pointsReward.toString()} puntos
      </p>
    </Card>
  );
}
