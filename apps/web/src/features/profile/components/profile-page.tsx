"use client";

import { Activity, BarChart3, CalendarDays, Edit3, Flame, MapPin, Medal, Star } from "lucide-react";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Prediction, PredictionOption, PredictionStatus } from "@competencias-platform/contracts";
import { Avatar, Badge, Button, Card, Skeleton } from "@competencias-platform/ui";
import {
  EmptyState,
  ErrorState,
  InterfaceStateSimulation,
  LoadingState
} from "@components";
import { developmentUserId } from "@/config/session";
import { useInterfaceStateSimulation } from "@/hooks";
import { AchievementCard } from "./achievement-card";
import { EditProfileModal } from "./edit-profile-modal";
import { profileService } from "../services/profile.service";
import type { ProfileEditValues, ProfilePageData, ProfileStats } from "../types/profile-page";

type ProfilePageState =
  | Readonly<{ status: "loading" }>
  | Readonly<{ status: "loaded"; data: ProfilePageData }>
  | Readonly<{ status: "empty" }>
  | Readonly<{ status: "error"; message: string }>;

const optionLabels: Record<PredictionOption, string> = {
  AWAY_WIN: "Visitante",
  CUSTOM: "Especial",
  DRAW: "Empate",
  HOME_WIN: "Local",
  OVER: "Más puntos",
  UNDER: "Menos puntos"
};

const statusLabels: Record<PredictionStatus, string> = {
  LOCKED: "Bloqueada",
  LOST: "Incorrecta",
  PENDING: "Pendiente",
  VOID: "Anulada",
  WON: "Correcta"
};

export function ProfilePage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [pageState, setPageState] = useState<ProfilePageState>({ status: "loading" });
  const simulatedState = useInterfaceStateSimulation();

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      setPageState({ status: "loading" });

      try {
        const data = await profileService.getCurrentProfile(developmentUserId);

        if (!isMounted) {
          return;
        }

        setPageState(data ? { data, status: "loaded" } : { status: "empty" });
      } catch {
        if (isMounted) {
          setPageState({
            message: "No pudimos cargar tu perfil.",
            status: "error"
          });
        }
      }
    }

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleProfileUpdate(values: ProfileEditValues) {
    const data = await profileService.updateCurrentProfile(developmentUserId, values);
    setPageState({ data, status: "loaded" });
  }

  if (simulatedState) {
    return (
      <InterfaceStateSimulation
        loadingAriaLabel="Cargando perfil"
        resourceName="perfil"
        skeleton={<ProfileLoadingSkeleton />}
        state={simulatedState}
      />
    );
  }

  if (pageState.status === "loading") {
    return <ProfileLoadingState />;
  }

  if (pageState.status === "empty") {
    return (
      <EmptyState
        description="No encontramos información del usuario actual."
        title="Perfil no disponible"
      />
    );
  }

  if (pageState.status === "error") {
    return <ErrorState description={pageState.message} title="No se pudo cargar el perfil" />;
  }

  return (
    <div className="grid gap-5">
      <ProfileHeader
        data={pageState.data}
        onEdit={() => {
          setIsEditModalOpen(true);
        }}
      />
      <ProfileSections data={pageState.data} />
      <EditProfileModal
        data={pageState.data}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
        }}
        onSubmit={handleProfileUpdate}
      />
    </div>
  );
}

function ProfileHeader({ data, onEdit }: Readonly<{ data: ProfilePageData; onEdit: () => void }>) {
  return (
    <header className="grid gap-4 rounded-xl border border-border bg-card p-4 shadow-md md:grid-cols-[auto_1fr_auto] md:items-center">
      <Avatar
        className="size-20 text-h2"
        fallback={data.profile.displayName}
        imageAlt={`Avatar de ${data.profile.displayName}`}
        {...(data.profile.avatarUrl ? { imageSrc: data.profile.avatarUrl } : {})}
      />
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="primary">#{data.stats.rankingPosition.toString()} ranking</Badge>
          <Badge tone="warning">{data.stats.totalPoints.toLocaleString("es-CO")} puntos</Badge>
        </div>
        <h1 className="mt-3 truncate text-h1">{data.profile.displayName}</h1>
        <div className="mt-2 grid gap-2 text-caption text-muted-foreground sm:grid-cols-2">
          <span className="inline-flex items-center gap-2">
            <MapPin className="size-4 text-primary" aria-hidden="true" />
            {data.city}
          </span>
          <span className="inline-flex items-center gap-2">
            <Star className="size-4 text-primary" aria-hidden="true" />
            {data.favoriteSport.name}
          </span>
        </div>
      </div>
      <Button onClick={onEdit} variant="secondary">
        <span className="inline-flex items-center gap-2">
          <Edit3 className="size-4" aria-hidden="true" />
          Editar
        </span>
      </Button>
    </header>
  );
}

function ProfileSections({ data }: Readonly<{ data: ProfilePageData }>) {
  return (
    <div className="grid gap-5">
      <section className="grid gap-3" aria-labelledby="profile-stats-title">
        <SectionTitle icon={<BarChart3 className="size-5 text-primary" aria-hidden="true" />} id="profile-stats-title">
          Estadísticas
        </SectionTitle>
        <StatsGrid stats={data.stats} />
      </section>

      <section className="grid gap-3" aria-labelledby="profile-achievements-title">
        <SectionTitle icon={<Medal className="size-5 text-warning" aria-hidden="true" />} id="profile-achievements-title">
          Logros
        </SectionTitle>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {data.achievements.map((achievement) => (
            <AchievementCard achievement={achievement} key={achievement.id} />
          ))}
        </div>
      </section>

      <section className="grid gap-3 lg:grid-cols-[0.9fr_1.1fr]" aria-label="Actividad y predicciones">
        <ActivityPanel data={data} />
        <PredictionsPanel history={data.history} />
      </section>
    </div>
  );
}

function StatsGrid({ stats }: Readonly<{ stats: ProfileStats }>) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Predicciones realizadas" value={stats.predictionsCount.toString()} />
      <StatCard label="Predicciones correctas" value={stats.correctPredictions.toString()} />
      <StatCard label="Precisión" value={`${stats.accuracyPercent.toString()}%`} />
      <StatCard label="Racha máxima" value={stats.bestStreak.toString()} />
    </div>
  );
}

function StatCard({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <Card className="grid gap-2 p-3">
      <p className="text-caption text-muted-foreground">{label}</p>
      <strong className="text-h2 text-primary">{value}</strong>
    </Card>
  );
}

function ActivityPanel({ data }: Readonly<{ data: ProfilePageData }>) {
  return (
    <Card className="grid gap-3 p-3">
      <SectionTitle icon={<Activity className="size-5 text-primary" aria-hidden="true" />} id="profile-activity-title">
        Actividad reciente
      </SectionTitle>
      <div className="grid gap-2">
        {data.activity.map((item) => (
          <div className="grid grid-cols-[auto_1fr] gap-3 rounded-md bg-muted p-3" key={item.id}>
            <span className="grid size-8 place-items-center rounded-md bg-surface text-primary">
              {item.type === "achievement" ? <Medal className="size-4" aria-hidden="true" /> : <Flame className="size-4" aria-hidden="true" />}
            </span>
            <div className="min-w-0">
              <p className="truncate text-label">{item.title}</p>
              <p className="truncate text-caption text-muted-foreground">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function PredictionsPanel({ history }: Readonly<{ history: readonly Prediction[] }>) {
  return (
    <Card className="grid gap-3 p-3">
      <SectionTitle icon={<CalendarDays className="size-5 text-primary" aria-hidden="true" />} id="profile-history-title">
        Predicciones e historial
      </SectionTitle>
      {history.length > 0 ? (
        <div className="grid gap-2">
          {history.map((prediction) => (
            <div className="grid gap-2 rounded-md border border-border bg-background p-3 sm:grid-cols-[1fr_auto] sm:items-center" key={prediction.id}>
              <div className="min-w-0">
                <p className="truncate text-label">{optionLabels[prediction.selectedOption]}</p>
                <p className="text-caption text-muted-foreground">
                  {prediction.possiblePoints.toString()} puntos posibles
                </p>
              </div>
              <Badge tone={prediction.status === "WON" ? "success" : prediction.status === "LOST" ? "error" : "muted"}>
                {statusLabels[prediction.status]}
              </Badge>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-body text-muted-foreground">Aún no tienes predicciones registradas.</p>
      )}
    </Card>
  );
}

function SectionTitle({
  children,
  icon,
  id
}: Readonly<{ children: string; icon: ReactNode; id: string }>) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <h2 className="text-h2" id={id}>
        {children}
      </h2>
    </div>
  );
}

function ProfileLoadingState() {
  return (
    <LoadingState aria-label="Cargando perfil">
      <ProfileLoadingSkeleton />
    </LoadingState>
  );
}

function ProfileLoadingSkeleton() {
  return (
    <>
      <Skeleton className="h-44 w-full" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton className="h-28 w-full" key={index} />
        ))}
      </div>
      <Skeleton className="h-96 w-full" />
    </>
  );
}
