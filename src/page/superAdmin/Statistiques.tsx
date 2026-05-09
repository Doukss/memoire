import { useMemo, type ReactNode } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import SuperAdminLayout from "../../components/common/layout/SuperAdminLayout";
import { getSuperAdminData } from "../../service/ofline/superAdminStorage";

const currencyFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "XOF",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("fr-FR");

const chartColors = ["#4f46e5", "#059669", "#0284c7", "#f59e0b", "#e11d48"];

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-950">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      <div className="h-80">{children}</div>
    </section>
  );
}

function Statistiques() {
  const data = useMemo(() => getSuperAdminData(), []);

  const subscriptionDistribution = useMemo(() => {
    const counts = data.subscriptions.reduce<Record<string, number>>(
      (accumulator, subscription) => {
        accumulator[subscription.plan] = (accumulator[subscription.plan] ?? 0) + 1;
        return accumulator;
      },
      {},
    );

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [data.subscriptions]);

  const usersByType = useMemo(
    () => [
      {
        name: "Agences",
        value: data.users.filter((user) => user.type === "agence").length,
      },
      {
        name: "Locataires",
        value: data.users.filter((user) => user.type === "locataire").length,
      },
    ],
    [data.users],
  );

  const disputesByAgency = useMemo(() => {
    const grouped = data.disputes.reduce<Record<string, number>>(
      (accumulator, dispute) => {
        accumulator[dispute.agencyName] =
          (accumulator[dispute.agencyName] ?? 0) + 1;
        return accumulator;
      },
      {},
    );

    return Object.entries(grouped).map(([agency, disputes]) => ({
      agency,
      disputes,
    }));
  }, [data.disputes]);

  const paymentStatusData = useMemo(
    () => [
      {
        status: "Payés",
        value: data.payments.filter((payment) => payment.status === "paid")
          .length,
      },
      {
        status: "En attente",
        value: data.payments.filter((payment) => payment.status === "pending")
          .length,
      },
      {
        status: "Échoués",
        value: data.payments.filter((payment) => payment.status === "failed")
          .length,
      },
    ],
    [data.payments],
  );

  const reports = useMemo(() => {
    const paidRevenue = data.payments
      .filter((payment) => payment.status === "paid")
      .reduce((total, payment) => total + payment.amount, 0);
    const activeSubscriptions = data.subscriptions.filter(
      (subscription) => subscription.status === "active",
    ).length;
    const resolvedDisputes = data.disputes.filter(
      (dispute) => dispute.status === "resolved",
    ).length;
    const resolutionRate =
      data.disputes.length > 0
        ? Math.round((resolvedDisputes / data.disputes.length) * 100)
        : 0;

    return [
      {
        title: "Rapport financier",
        value: currencyFormatter.format(paidRevenue),
        description: "Total encaissé sur les paiements validés.",
      },
      {
        title: "Rapport abonnements",
        value: `${activeSubscriptions}/${data.subscriptions.length}`,
        description: "Abonnements actifs sur le total des plans.",
      },
      {
        title: "Rapport litiges",
        value: `${resolutionRate}%`,
        description: "Taux de résolution des litiges enregistrés.",
      },
    ];
  }, [data.disputes, data.payments, data.subscriptions]);

  return (
    <SuperAdminLayout
      title="Statistiques"
      subtitle="Graphiques détaillés et rapports de performance de la plateforme SaaS."
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Agences</p>
          <p className="mt-3 text-3xl font-bold text-slate-950">
            {numberFormatter.format(data.agencies.length)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Utilisateurs</p>
          <p className="mt-3 text-3xl font-bold text-indigo-600">
            {numberFormatter.format(data.users.length)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Paiements</p>
          <p className="mt-3 text-3xl font-bold text-emerald-600">
            {numberFormatter.format(data.payments.length)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Litiges</p>
          <p className="mt-3 text-3xl font-bold text-rose-600">
            {numberFormatter.format(data.disputes.length)}
          </p>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <ChartCard
          title="Revenus mensuels"
          subtitle="Évolution du revenu SaaS sur les six derniers mois."
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.monthlyRevenue}>
              <defs>
                <linearGradient id="revenueFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip
                formatter={(value) => currencyFormatter.format(Number(value))}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#059669"
                strokeWidth={3}
                fill="url(#revenueFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Inscriptions d'agences"
          subtitle="Progression du nombre d'agences inscrites."
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.registrations}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="agencies" fill="#4f46e5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Taux de litiges"
          subtitle="Suivi du taux de litiges sur la période."
        >
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
        </ChartCard>

        <ChartCard
          title="Litiges par agence"
          subtitle="Volume de litiges enregistrés par agence."
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={disputesByAgency} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tickLine={false} axisLine={false} />
              <YAxis
                dataKey="agency"
                type="category"
                width={150}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip />
              <Bar dataKey="disputes" fill="#f59e0b" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr_1fr]">
        <ChartCard
          title="Répartition abonnements"
          subtitle="Distribution des plans SaaS."
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={subscriptionDistribution}
                dataKey="value"
                nameKey="name"
                outerRadius={105}
                label
              >
                {subscriptionDistribution.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={chartColors[index % chartColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Types utilisateurs"
          subtitle="Comptes agence et profils locataires."
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={usersByType} dataKey="value" nameKey="name" label>
                {usersByType.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={chartColors[index % chartColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Statut paiements"
          subtitle="Paiements payés, en attente et échoués."
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={paymentStatusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="status" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {paymentStatusData.map((entry, index) => (
                  <Cell
                    key={entry.status}
                    fill={chartColors[index % chartColors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-950">Rapports</h2>
            <p className="mt-1 text-sm text-slate-500">
              Synthèse exploitable pour le pilotage de la plateforme.
            </p>
          </div>
          <button className="rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700">
            Exporter le rapport
          </button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {reports.map((report) => (
            <div
              key={report.title}
              className="rounded-lg border border-slate-200 bg-slate-50 p-5"
            >
              <p className="text-sm font-bold text-slate-600">
                {report.title}
              </p>
              <p className="mt-3 text-2xl font-bold text-slate-950">
                {report.value}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {report.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </SuperAdminLayout>
  );
}

export default Statistiques;
