import { useMemo, type ReactNode } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AgencyLayout from "../../components/common/layout/AgencyLayout";
import { getAgencyDashboardData } from "../../service/ofline/agencyStorage";

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
  const data = useMemo(() => getAgencyDashboardData(), []);

  const propertyOccupancy = useMemo(() => {
    const occupied = data.properties.filter((p) => p.status === "occupied").length;
    const available = data.properties.filter((p) => p.status === "available").length;
    return [
      { name: "Occupés", value: occupied },
      { name: "Disponibles", value: available },
    ];
  }, [data.properties]);

  const paymentStatusData = useMemo(() => {
    const paid = data.payments.filter((p) => p.status === "paid").length;
    const pending = data.payments.filter((p) => p.status === "pending").length;
    const late = data.payments.filter((p) => p.status === "late").length;
    return [
      { status: "Payés", value: paid },
      { status: "En attente", value: pending },
      { status: "Retard", value: late },
    ];
  }, [data.payments]);

  const reports = useMemo(() => {
    const paidRevenue = data.payments
      .filter((payment) => payment.status === "paid")
      .reduce((total, payment) => total + payment.amount, 0);
    const occupiedProperties = data.properties.filter((p) => p.status === "occupied").length;
    const latePayments = data.payments.filter((p) => p.status === "late").length;
    const paymentCount = data.payments.length;
    const lateRate = paymentCount > 0 ? Math.round((latePayments / paymentCount) * 100) : 0;

    return [
      {
        title: "Revenus encaissés",
        value: currencyFormatter.format(paidRevenue),
        description: "Total des loyers perçus.",
      },
      {
        title: "Taux d'occupation",
        value: `${occupiedProperties}/${data.properties.length}`,
        description: "Biens occupés sur le total.",
      },
      {
        title: "Loyers en retard",
        value: `${lateRate}%`,
        description: "Pourcentage de paiements en retard.",
      },
    ];
  }, [data]);

  return (
    <AgencyLayout agencyName={data.agency.name}>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Revenus totaux</p>
          <p className="mt-3 text-3xl font-bold text-slate-950">
            {currencyFormatter.format(
              data.payments
                .filter((p) => p.status === "paid")
                .reduce((total, p) => total + p.amount, 0),
            )}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Biens occupés</p>
          <p className="mt-3 text-3xl font-bold text-emerald-600">
            {numberFormatter.format(
              data.properties.filter((p) => p.status === "occupied").length,
            )}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Paiements totaux</p>
          <p className="mt-3 text-3xl font-bold text-indigo-600">
            {numberFormatter.format(data.payments.length)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Litiges actifs</p>
          <p className="mt-3 text-3xl font-bold text-amber-600">
            {numberFormatter.format(
              data.disputes.filter((d) => d.status === "ongoing").length,
            )}
          </p>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <ChartCard
          title="Revenus mensuels"
          subtitle="Évolution des loyers encaissés par mois."
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
          title="Occupation des biens"
          subtitle="Répartition des biens occupés et disponibles."
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={propertyOccupancy}
                dataKey="value"
                nameKey="name"
                outerRadius={105}
                label
              >
                {propertyOccupancy.map((entry, index) => (
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
          title="Statut des paiements"
          subtitle="Répartition des loyers par statut."
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

        <ChartCard
          title="Évolution des loyers"
          subtitle="Montant moyen des loyers par bien."
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.properties.map((p) => ({
                name: p.name,
                loyer: p.monthlyRent,
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip
                formatter={(value) => currencyFormatter.format(Number(value))}
              />
              <Bar dataKey="loyer" fill="#4f46e5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-950">Rapports</h2>
            <p className="mt-1 text-sm text-slate-500">Synthèse des indicateurs clés.</p>
          </div>
          <button className="rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700">
            Générer le rapport
          </button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {reports.map((report) => (
            <div
              key={report.title}
              className="rounded-lg border border-slate-200 bg-slate-50 p-5"
            >
              <p className="text-sm font-bold text-slate-600">{report.title}</p>
              <p className="mt-3 text-2xl font-bold text-slate-950">{report.value}</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {report.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </AgencyLayout>
  );
}

export default Statistiques;
