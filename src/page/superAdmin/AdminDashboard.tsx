import { useMemo, useState, type ReactNode } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import SuperAdminLayout from "../../components/common/layout/SuperAdminLayout";
import {
  getSuperAdminData,
  saveSuperAdminData,
  type Agency,
  type SuperAdminData,
} from "../../service/ofline/superAdminStorage";

const currencyFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "XOF",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("fr-FR");

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function buildStats(data: SuperAdminData) {
  return [
    {
      label: "Total agences",
      value: numberFormatter.format(data.agencies.length),
      helper: "+7 ce mois",
      tone: "indigo",
    },
    {
      label: "Total locataires",
      value: numberFormatter.format(data.totals.tenants),
      helper: "Sur toutes les agences",
      tone: "emerald",
    },
    {
      label: "Total biens",
      value: numberFormatter.format(data.totals.properties),
      helper: "Parc supervise",
      tone: "sky",
    },
    {
      label: "Revenus generes",
      value: currencyFormatter.format(data.totals.revenue),
      helper: "Abonnements SaaS",
      tone: "amber",
    },
    {
      label: "Litiges actifs",
      value: numberFormatter.format(data.totals.activeDisputes),
      helper: "12 urgents",
      tone: "rose",
    },
  ];
}

function StatCard({
  label,
  value,
  helper,
  tone,
}: {
  label: string;
  value: string;
  helper: string;
  tone: string;
}) {
  const tones: Record<string, string> = {
    indigo: "bg-indigo-50 text-indigo-700 ring-indigo-100",
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    sky: "bg-sky-50 text-sky-700 ring-sky-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    rose: "bg-rose-50 text-rose-700 ring-rose-100",
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
            {value}
          </p>
        </div>
        <span className={`h-3 w-3 rounded-full ring-4 ${tones[tone]}`} />
      </div>
      <p className="mt-4 text-xs font-semibold text-slate-500">{helper}</p>
    </div>
  );
}

function ChartPanel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-950">{title}</h2>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
          6 mois
        </span>
      </div>
      <div className="h-72">{children}</div>
    </section>
  );
}

function statusClasses(status: Agency["status"]) {
  return status === "active"
    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
    : "bg-rose-50 text-rose-700 ring-rose-200";
}

function AdminDashboard() {
  const [data, setData] = useState<SuperAdminData>(() => getSuperAdminData());

  const stats = useMemo(() => buildStats(data), [data]);
  const recentAgencies = useMemo(
    () =>
      [...data.agencies].sort(
        (first, second) =>
          new Date(second.registeredAt).getTime() -
          new Date(first.registeredAt).getTime(),
      ),
    [data.agencies],
  );

  function toggleAgencyStatus(agencyId: number) {
    const nextData: SuperAdminData = {
      ...data,
      agencies: data.agencies.map((agency) => {
        if (agency.id !== agencyId) {
          return agency;
        }

        const status: Agency["status"] =
          agency.status === "active" ? "suspended" : "active";

        return { ...agency, status };
      }),
    };

    setData(nextData);
    saveSuperAdminData(nextData);
  }

  return (
    <SuperAdminLayout
      title="Dashboard global"
      subtitle="Vue generale de toutes les agences, revenus, litiges et activites de la plateforme."
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-3">
        <ChartPanel title="Evolution des inscriptions d'agences">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.registrations}>
              <defs>
                <linearGradient id="agencyGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="agencies"
                stroke="#4f46e5"
                strokeWidth={3}
                fill="url(#agencyGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="Revenus mensuels">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip formatter={(value) => currencyFormatter.format(Number(value))} />
              <Bar dataKey="revenue" fill="#059669" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="Taux de litiges">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.disputeRate}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} unit="%" />
              <Tooltip formatter={(value) => `${value}%`} />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#e11d48"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartPanel>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h2 className="text-base font-bold text-slate-950">
                Agences recentes
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Suivi rapide des nouveaux comptes agences.
              </p>
            </div>
            <a
              href="/super-admin/agences"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-700"
            >
              Voir tout
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-bold">Nom</th>
                  <th className="px-5 py-3 font-bold">Email</th>
                  <th className="px-5 py-3 font-bold">Statut</th>
                  <th className="px-5 py-3 font-bold">Date d'inscription</th>
                  <th className="px-5 py-3 font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentAgencies.map((agency) => (
                  <tr key={agency.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-950">
                        {agency.name}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {agency.email}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${statusClasses(
                          agency.status,
                        )}`}
                      >
                        {agency.status === "active" ? "Actif" : "Suspendu"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {formatDate(agency.registeredAt)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-700">
                          Voir
                        </button>
                        <button
                          onClick={() => toggleAgencyStatus(agency.id)}
                          className="rounded-lg bg-slate-950 px-3 py-2 text-xs font-bold text-white transition hover:bg-indigo-700"
                        >
                          {agency.status === "active" ? "Bloquer" : "Activer"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid gap-6">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-slate-950">
              Alertes systeme
            </h2>
            <div className="mt-4 space-y-3">
              {data.alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-bold text-slate-950">{alert.title}</p>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-bold ${
                        alert.level === "danger"
                          ? "bg-rose-100 text-rose-700"
                          : alert.level === "warning"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-sky-100 text-sky-700"
                      }`}
                    >
                      {alert.level}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {alert.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-slate-950">
              Activite recente
            </h2>
            <div className="mt-4 space-y-4">
              {data.activities.map((activity) => (
                <div key={activity.id} className="flex gap-3">
                  <span className="mt-1 h-3 w-3 rounded-full bg-indigo-600 ring-4 ring-indigo-100" />
                  <div>
                    <p className="font-semibold text-slate-950">
                      {activity.title}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {activity.description}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-slate-400">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </SuperAdminLayout>
  );
}

export default AdminDashboard;
