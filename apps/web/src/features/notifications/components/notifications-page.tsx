"use client";

import {
  Check,
  CircleDot,
  Medal,
  Megaphone,
  ShieldCheck,
  Trophy,
  Zap
} from "lucide-react";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Identifier, Notification, NotificationType } from "@competencias-platform/contracts";
import { Badge, Button, Card, IconButton, Skeleton } from "@competencias-platform/ui";
import {
  EmptyState,
  ErrorState,
  InterfaceStateSimulation,
  LoadingState
} from "@components";
import { developmentUserId } from "@/config/session";
import { useInterfaceStateSimulation } from "@/hooks";
import { notificationService } from "../services/notification.service";
import type { NotificationsPageData } from "../types/notifications-page";

type NotificationsPageState =
  | Readonly<{ status: "loading" }>
  | Readonly<{ status: "loaded"; data: NotificationsPageData }>
  | Readonly<{ status: "empty"; data: NotificationsPageData }>
  | Readonly<{ status: "error"; message: string }>;

const notificationTypeLabels: Record<NotificationType, string> = {
  ACHIEVEMENT_UNLOCKED: "Logro",
  MATCH_STARTED: "Partido",
  PREDICTION_RESULT: "Predicción",
  RANKING_CHANGED: "Ranking",
  SCORE_CHANGED: "Marcador",
  SYSTEM: "Sistema"
};

export function NotificationsPage() {
  const [pageState, setPageState] = useState<NotificationsPageState>({ status: "loading" });
  const simulatedState = useInterfaceStateSimulation();

  useEffect(() => {
    let isMounted = true;

    async function loadNotifications() {
      setPageState({ status: "loading" });

      try {
        const data = await notificationService.getNotifications(developmentUserId);

        if (!isMounted) {
          return;
        }

        setPageState(
          data.notifications.length > 0 ? { data, status: "loaded" } : { data, status: "empty" }
        );
      } catch {
        if (isMounted) {
          setPageState({
            message: "No pudimos cargar tus notificaciones.",
            status: "error"
          });
        }
      }
    }

    void loadNotifications();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const subscription = notificationService.subscribe((snapshot) => {
      void notificationService.saveIncomingNotification(snapshot.notification).then(() =>
        notificationService.getNotifications(developmentUserId).then((data) => {
          setPageState({ data, status: "loaded" });
        })
      );
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleMarkAsRead(notificationId: Identifier) {
    const data = await notificationService.markAsRead(notificationId, developmentUserId);
    setPageState(data.notifications.length > 0 ? { data, status: "loaded" } : { data, status: "empty" });
  }

  async function handleMarkAllAsRead() {
    const data = await notificationService.markAllAsRead(developmentUserId);
    setPageState(data.notifications.length > 0 ? { data, status: "loaded" } : { data, status: "empty" });
  }

  if (simulatedState) {
    return (
      <InterfaceStateSimulation
        loadingAriaLabel="Cargando notificaciones"
        resourceName="notificaciones"
        skeleton={<NotificationsLoadingSkeleton />}
        state={simulatedState}
      />
    );
  }

  if (pageState.status === "loading") {
    return <NotificationsLoadingState />;
  }

  if (pageState.status === "error") {
    return (
      <ErrorState
        description={pageState.message}
        title="No se pudieron cargar las notificaciones"
      />
    );
  }

  return (
    <div className="grid gap-5">
      <NotificationsHeader data={pageState.data} onMarkAllAsRead={() => void handleMarkAllAsRead()} />
      {pageState.status === "empty" ? (
        <EmptyState
          description="Aquí aparecerán alertas de partidos, ranking, logros y predicciones gratuitas."
          title="Sin notificaciones"
        />
      ) : (
        <NotificationsList
          notifications={pageState.data.notifications}
          onMarkAsRead={(notificationId) => void handleMarkAsRead(notificationId)}
        />
      )}
    </div>
  );
}

function NotificationsHeader({
  data,
  onMarkAllAsRead
}: Readonly<{ data: NotificationsPageData; onMarkAllAsRead: () => void }>) {
  return (
    <header className="grid gap-3 rounded-xl border border-border bg-card p-4 shadow-md sm:grid-cols-[1fr_auto] sm:items-center">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="primary">Notificaciones</Badge>
          <Badge tone={data.unreadCount > 0 ? "error" : "muted"}>
            {data.unreadCount.toString()} sin leer
          </Badge>
        </div>
        <h1 className="mt-3 text-h1">Centro de actividad</h1>
        <p className="mt-1 text-body text-muted-foreground">
          Alertas de partidos, marcadores, predicciones gratuitas, ranking y logros.
        </p>
      </div>
      <Button disabled={data.unreadCount === 0} onClick={onMarkAllAsRead} variant="secondary">
        Marcar todas como leídas
      </Button>
    </header>
  );
}

function NotificationsList({
  notifications,
  onMarkAsRead
}: Readonly<{
  notifications: readonly Notification[];
  onMarkAsRead: (notificationId: Identifier) => void;
}>) {
  return (
    <section className="grid gap-3" aria-label="Listado de notificaciones">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMarkAsRead={onMarkAsRead}
        />
      ))}
    </section>
  );
}

function NotificationItem({
  notification,
  onMarkAsRead
}: Readonly<{
  notification: Notification;
  onMarkAsRead: (notificationId: Identifier) => void;
}>) {
  return (
    <Card
      className={`grid gap-3 p-3 transition-colors sm:grid-cols-[auto_1fr_auto] sm:items-center ${
        notification.isRead ? "bg-card" : "border-primary bg-primary/10"
      }`}
    >
      <span className="grid size-10 place-items-center rounded-lg bg-surface text-primary">
        {renderNotificationIcon(notification.type)}
      </span>
      <div className="min-w-0">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <Badge tone={notification.isRead ? "muted" : "primary"}>
            {notificationTypeLabels[notification.type]}
          </Badge>
          <Badge tone={notification.isRead ? "muted" : "error"}>
            {notification.isRead ? "Leída" : "No leída"}
          </Badge>
        </div>
        <h2 className="mt-2 truncate text-h3">{notification.title}</h2>
        <p className="mt-1 text-body text-muted-foreground">{notification.message}</p>
        <time className="mt-2 block text-caption text-muted-foreground" dateTime={notification.createdAt}>
          {formatNotificationDate(notification.createdAt)}
        </time>
      </div>
      <IconButton
        disabled={notification.isRead}
        icon={<Check className="size-4" aria-hidden="true" />}
        label={notification.isRead ? "Notificación leída" : "Marcar como leída"}
        onClick={() => {
          onMarkAsRead(notification.id);
        }}
      />
    </Card>
  );
}

function renderNotificationIcon(type: NotificationType): ReactNode {
  if (type === "MATCH_STARTED") {
    return <Zap className="size-5" aria-hidden="true" />;
  }

  if (type === "SCORE_CHANGED") {
    return <CircleDot className="size-5" aria-hidden="true" />;
  }

  if (type === "PREDICTION_RESULT") {
    return <ShieldCheck className="size-5" aria-hidden="true" />;
  }

  if (type === "RANKING_CHANGED") {
    return <Trophy className="size-5" aria-hidden="true" />;
  }

  if (type === "ACHIEVEMENT_UNLOCKED") {
    return <Medal className="size-5" aria-hidden="true" />;
  }

  return <Megaphone className="size-5" aria-hidden="true" />;
}

function formatNotificationDate(value: string): string {
  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "short"
  }).format(new Date(value));
}

function NotificationsLoadingState() {
  return (
    <LoadingState aria-label="Cargando notificaciones">
      <NotificationsLoadingSkeleton />
    </LoadingState>
  );
}

function NotificationsLoadingSkeleton() {
  return (
    <>
      <Skeleton className="h-36 w-full" />
      <div className="grid gap-3">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton className="h-28 w-full" key={index} />
        ))}
      </div>
    </>
  );
}
