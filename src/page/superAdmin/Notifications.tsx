import { useMemo, useState } from "react";
import SuperAdminLayout from "../../components/common/layout/SuperAdminLayout";
import {
  getSuperAdminData,
  saveSuperAdminData,
  type NotificationPriority,
  type NotificationType,
  type PlatformNotification,
  type SuperAdminData,
} from "../../service/ofline/superAdminStorage";

const numberFormatter = new Intl.NumberFormat("fr-FR");

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function typeLabel(type: NotificationType) {
  const labels: Record<NotificationType, string> = {
    agency: "Agence",
    payment: "Paiement",
    dispute: "Litige",
    system: "Système",
  };

  return labels[type];
}

function priorityLabel(priority: NotificationPriority) {
  const labels: Record<NotificationPriority, string> = {
    low: "Faible",
    medium: "Moyenne",
    high: "Haute",
  };

  return labels[priority];
}

function typeClasses(type: NotificationType) {
  const classes: Record<NotificationType, string> = {
    agency: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    payment: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dispute: "bg-rose-50 text-rose-700 ring-rose-200",
    system: "bg-slate-100 text-slate-700 ring-slate-200",
  };

  return classes[type];
}

function priorityClasses(priority: NotificationPriority) {
  const classes: Record<NotificationPriority, string> = {
    low: "bg-slate-100 text-slate-700 ring-slate-200",
    medium: "bg-amber-50 text-amber-700 ring-amber-200",
    high: "bg-rose-50 text-rose-700 ring-rose-200",
  };

  return classes[priority];
}

function Notifications() {
  const [data, setData] = useState<SuperAdminData>(() => getSuperAdminData());
  const [typeFilter, setTypeFilter] = useState<"all" | NotificationType>("all");
  const [readFilter, setReadFilter] = useState<"all" | "unread" | "read">(
    "all",
  );
  const [selectedNotificationId, setSelectedNotificationId] = useState<
    number | null
  >(data.notifications[0]?.id ?? null);

  const notifications = useMemo(
    () =>
      [...data.notifications]
        .sort(
          (first, second) =>
            new Date(second.createdAt).getTime() -
            new Date(first.createdAt).getTime(),
        )
        .filter((notification) => {
          const matchesType =
            typeFilter === "all" || notification.type === typeFilter;
          const matchesRead =
            readFilter === "all" ||
            (readFilter === "read" && notification.read) ||
            (readFilter === "unread" && !notification.read);

          return matchesType && matchesRead;
        }),
    [data.notifications, readFilter, typeFilter],
  );

  const selectedNotification = useMemo(
    () =>
      data.notifications.find(
        (notification) => notification.id === selectedNotificationId,
      ) ??
      data.notifications[0] ??
      null,
    [data.notifications, selectedNotificationId],
  );

  const summary = useMemo(
    () => ({
      total: data.notifications.length,
      unread: data.notifications.filter((notification) => !notification.read)
        .length,
      high: data.notifications.filter(
        (notification) => notification.priority === "high",
      ).length,
      system: data.notifications.filter(
        (notification) => notification.type === "system",
      ).length,
    }),
    [data.notifications],
  );

  function persist(nextData: SuperAdminData) {
    setData(nextData);
    saveSuperAdminData(nextData);
  }

  function markAsRead(notificationId: number) {
    const nextData: SuperAdminData = {
      ...data,
      notifications: data.notifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification,
      ),
    };

    persist(nextData);
  }

  function markAllAsRead() {
    const nextData: SuperAdminData = {
      ...data,
      notifications: data.notifications.map((notification) => ({
        ...notification,
        read: true,
      })),
    };

    persist(nextData);
  }

  return (
    <SuperAdminLayout
      title="Notifications"
      subtitle="Centre de notifications pour les agences, paiements, litiges et alertes système."
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Total</p>
          <p className="mt-3 text-3xl font-bold text-slate-950">
            {numberFormatter.format(summary.total)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Non lues</p>
          <p className="mt-3 text-3xl font-bold text-indigo-600">
            {numberFormatter.format(summary.unread)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Priorité haute</p>
          <p className="mt-3 text-3xl font-bold text-rose-600">
            {numberFormatter.format(summary.high)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Système</p>
          <p className="mt-3 text-3xl font-bold text-slate-950">
            {numberFormatter.format(summary.system)}
          </p>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-950">
                Toutes les notifications
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Filtrez les événements et consultez les alertes importantes.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <select
                value={typeFilter}
                onChange={(event) =>
                  setTypeFilter(event.target.value as "all" | NotificationType)
                }
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              >
                <option value="all">Tous les types</option>
                <option value="agency">Agence</option>
                <option value="payment">Paiement</option>
                <option value="dispute">Litige</option>
                <option value="system">Système</option>
              </select>
              <select
                value={readFilter}
                onChange={(event) =>
                  setReadFilter(event.target.value as "all" | "unread" | "read")
                }
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              >
                <option value="all">Toutes</option>
                <option value="unread">Non lues</option>
                <option value="read">Lues</option>
              </select>
              <button
                onClick={markAllAsRead}
                className="rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
              >
                Tout marquer lu
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {notifications.map((notification: PlatformNotification) => (
              <button
                key={notification.id}
                onClick={() => setSelectedNotificationId(notification.id)}
                className={`block w-full px-5 py-4 text-left transition hover:bg-slate-50 ${
                  notification.read ? "bg-white" : "bg-indigo-50/40"
                }`}
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      {!notification.read ? (
                        <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
                      ) : null}
                      <p className="font-bold text-slate-950">
                        {notification.title}
                      </p>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-bold ring-1 ${typeClasses(
                          notification.type,
                        )}`}
                      >
                        {typeLabel(notification.type)}
                      </span>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-bold ring-1 ${priorityClasses(
                          notification.priority,
                        )}`}
                      >
                        {priorityLabel(notification.priority)}
                      </span>
                    </div>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                      {notification.message}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-slate-400">
                    {formatDate(notification.createdAt)}
                  </p>
                </div>
              </button>
            ))}

            {notifications.length === 0 ? (
              <div className="p-8 text-center text-sm font-semibold text-slate-500">
                Aucune notification ne correspond aux filtres.
              </div>
            ) : null}
          </div>
        </div>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Détail</h2>

          {selectedNotification ? (
            <div className="mt-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xl font-bold text-slate-950">
                    {selectedNotification.title}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {formatDate(selectedNotification.createdAt)}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    selectedNotification.read
                      ? "bg-slate-100 text-slate-700"
                      : "bg-indigo-100 text-indigo-700"
                  }`}
                >
                  {selectedNotification.read ? "Lue" : "Non lue"}
                </span>
              </div>

              <p className="mt-5 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                {selectedNotification.message}
              </p>

              <div className="mt-5 space-y-3">
                <div className="rounded-lg border border-slate-200 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Cible
                  </p>
                  <p className="mt-1 font-bold text-slate-950">
                    {selectedNotification.target}
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-slate-200 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Type
                    </p>
                    <span
                      className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${typeClasses(
                        selectedNotification.type,
                      )}`}
                    >
                      {typeLabel(selectedNotification.type)}
                    </span>
                  </div>
                  <div className="rounded-lg border border-slate-200 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Priorité
                    </p>
                    <span
                      className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${priorityClasses(
                        selectedNotification.priority,
                      )}`}
                    >
                      {priorityLabel(selectedNotification.priority)}
                    </span>
                  </div>
                </div>
              </div>

              {!selectedNotification.read ? (
                <button
                  onClick={() => markAsRead(selectedNotification.id)}
                  className="mt-5 w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
                >
                  Marquer comme lue
                </button>
              ) : null}
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">
              Sélectionnez une notification pour afficher ses détails.
            </p>
          )}
        </section>
      </section>
    </SuperAdminLayout>
  );
}

export default Notifications;
