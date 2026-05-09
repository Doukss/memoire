import { useMemo, useState } from "react";
import AgencyLayout from "../../components/common/layout/AgencyLayout";
import { getAgencyDashboardData } from "../../service/ofline/agencyStorage";

type NotificationTab = "rappels" | "alertes";

const tabs: Array<{ id: NotificationTab; label: string }> = [
  { id: "rappels", label: "Rappels" },
  { id: "alertes", label: "Alertes" },
];

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

function notificationTypeLabel(type: string) {
  const labels: Record<string, string> = {
    payment: "Paiement",
    contract: "Contrat",
    dispute: "Litige",
    tenant: "Locataire",
    maintenance: "Maintenance",
    system: "Système",
  };
  return labels[type] || type;
}

function priorityLabel(priority: string) {
  const labels: Record<string, string> = {
    low: "Faible",
    medium: "Moyenne",
    high: "Haute",
  };
  return labels[priority] || priority;
}

function priorityClasses(priority: string) {
  const classes: Record<string, string> = {
    low: "bg-slate-100 text-slate-700 ring-slate-200",
    medium: "bg-amber-50 text-amber-700 ring-amber-200",
    high: "bg-rose-50 text-rose-700 ring-rose-200",
  };
  return classes[priority] || "bg-slate-100 text-slate-700 ring-slate-200";
}

function typeBadgeClasses(type: string) {
  const classes: Record<string, string> = {
    payment: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    contract: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    dispute: "bg-amber-50 text-amber-700 ring-amber-200",
    tenant: "bg-sky-50 text-sky-700 ring-sky-200",
    maintenance: "bg-orange-50 text-orange-700 ring-orange-200",
    system: "bg-purple-50 text-purple-700 ring-purple-200",
  };
  return classes[type] || "bg-slate-100 text-slate-700 ring-slate-200";
}

function Notifications() {
  const [data] = useState(() => getAgencyDashboardData());
  const [activeTab, setActiveTab] = useState<NotificationTab>("rappels");
  const [unreadOnly, setUnreadOnly] = useState(false);

  // Mock notifications based on activities and other data
  const notifications = useMemo(() => {
    const notifs: Array<{
      id: number;
      type: string;
      title: string;
      description: string;
      priority: "low" | "medium" | "high";
      timestamp: string;
      read: boolean;
      link?: string;
    }> = [];

    // Convert activities to notifications with generated timestamps
    data.activities.forEach((activity, index) => {
      const hoursAgo = activity.time.includes("min")
        ? Math.floor(parseInt(activity.time.replace(/\D/g, "")) / 60)
        : activity.time.includes("h")
        ? parseInt(activity.time.replace(/\D/g, ""))
        : activity.time === "Hier"
        ? 24
        : 48;
      
      notifs.push({
        id: index + 1,
        type: activity.type,
        title: activity.title,
        description: activity.description,
        priority: activity.type === "dispute" ? "high" : "medium",
        timestamp: new Date(Date.now() - hoursAgo * 3600000).toISOString(),
        read: false,
      });
    });

    // Add payment reminders
    data.payments
      .filter((p) => p.status === "late")
      .forEach((payment, index) => {
        notifs.push({
          id: 100 + index,
          type: "payment",
          title: "Paiement en retard",
          description: `Le locataire ${payment.tenantName} a un paiement en retard de ${numberFormatter.format(payment.amount)} XOF pour ${payment.propertyName}.`,
          priority: "high",
          timestamp: new Date(payment.date).toISOString(),
          read: false,
          link: "/agence/loyers",
        });
      });

    // Add contract expirations
    data.contracts
      .filter((c) => {
        const endDate = new Date(c.endDate);
        const daysUntilExpiry = Math.floor((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
      })
      .forEach((contract, index) => {
        notifs.push({
          id: 200 + index,
          type: "contract",
          title: "Contrat expire bientôt",
          description: `Le contrat de ${contract.tenantName} pour ${contract.propertyName} expire le ${formatDate(contract.endDate)}.`,
          priority: "medium",
          timestamp: new Date(Date.now() - 86400000 * (index + 1)).toISOString(),
          read: index === 0 ? false : true,
          link: "/agence/contrats",
        });
      });

    // Add open disputes
    data.disputes
      .filter((d) => d.status === "ongoing")
      .forEach((dispute, index) => {
        notifs.push({
          id: 300 + index,
          type: "dispute",
          title: "Litige en cours",
          description: `Litige "${dispute.subject}" avec ${dispute.tenantName} toujours en cours.`,
          priority: "high",
          timestamp: new Date(dispute.date).toISOString(),
          read: index > 1,
          link: "/agence/litiges",
        });
      });

    return notifs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [data]);

  const filteredNotifications = useMemo(() => {
    let filtered = notifications;

    // Filter by tab
    if (activeTab === "rappels") {
      filtered = filtered.filter((n) => n.priority !== "high" || n.type === "contract" || n.type === "payment");
    } else if (activeTab === "alertes") {
      filtered = filtered.filter((n) => n.priority === "high" || n.type === "dispute" || n.type === "system");
    }

    // Filter unread
    if (unreadOnly) {
      filtered = filtered.filter((n) => !n.read);
    }

    return filtered;
  }, [notifications, activeTab, unreadOnly]);

  const stats = useMemo(() => ({
    total: notifications.length,
    unread: notifications.filter((n) => !n.read).length,
    alertes: notifications.filter((n) => n.priority === "high" || n.type === "dispute" || n.type === "system").length,
  }), [notifications]);

  return (
    <AgencyLayout agencyName={data.agency.name}>
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Total notifications</p>
          <p className="mt-3 text-3xl font-bold text-slate-950">
            {numberFormatter.format(stats.total)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Non lus</p>
          <p className="mt-3 text-3xl font-bold text-amber-600">
            {numberFormatter.format(stats.unread)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Alertes actives</p>
          <p className="mt-3 text-3xl font-bold text-rose-600">
            {numberFormatter.format(stats.alertes)}
          </p>
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950">Notifications</h2>
              <p className="mt-1 text-sm text-slate-500">
                Restez informé des événements importants.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={unreadOnly}
                  onChange={(e) => setUnreadOnly(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                Non lues seulement
              </label>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                  activeTab === tab.id
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-950"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center text-sm font-semibold text-slate-500">
              Aucune notification dans cette catégorie.
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-5 transition hover:bg-slate-50 ${
                  !notification.read ? "bg-slate-50/80" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100">
                    <span className="text-sm font-bold text-slate-600">
                      {notificationTypeLabel(notification.type).charAt(0)}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className={`font-bold ${!notification.read ? "text-slate-950" : "text-slate-700"}`}>
                          {notification.title}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {notification.description}
                        </p>
                      </div>
                      <div className="flex flex-shrink-0 flex-col items-end gap-2">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-bold ring-1 ${priorityClasses(
                            notification.priority,
                          )}`}
                        >
                          {priorityLabel(notification.priority)}
                        </span>
                        <span className="text-xs text-slate-400">
                          {formatDate(notification.timestamp)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-bold ring-1 ${typeBadgeClasses(
                          notification.type,
                        )}`}
                      >
                        {notificationTypeLabel(notification.type)}
                      </span>
                      {!notification.read && (
                        <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {filteredNotifications.length > 0 && (
          <div className="border-t border-slate-200 p-4 text-center">
            <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">
              Voir toutes les notifications
            </button>
          </div>
        )}
      </section>
    </AgencyLayout>
  );
}

export default Notifications;
