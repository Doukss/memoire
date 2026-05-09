import { useMemo, type ReactNode } from "react";
import {
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
import {
  getAgencyDashboardData,
  type AgencyDisputeStatus,
  type RentPaymentStatus,
} from "../../service/ofline/agencyStorage";

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

function paymentLabel(status: RentPaymentStatus) {
  const labels: Record<RentPaymentStatus, string> = {
    paid: "Payé",
    pending: "En attente",
    late: "Retard",
  };

  return labels[status];
}

function disputeLabel(status: AgencyDisputeStatus) {
  return status === "ongoing" ? "En cours" : "Résolu";
}

function paymentClasses(status: RentPaymentStatus) {
  const classes: Record<RentPaymentStatus, string> = {
    paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    pending: "bg-amber-50 text-amber-700 ring-amber-200",
    late: "bg-rose-50 text-rose-700 ring-rose-200",
  };

  return classes[status];
}

function disputeClasses(status: AgencyDisputeStatus) {
  return status === "ongoing"
    ? "bg-amber-50 text-amber-700 ring-amber-200"
    : "bg-emerald-50 text-emerald-700 ring-emerald-200";
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
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    indigo: "bg-indigo-50 text-indigo-700 ring-indigo-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    rose: "bg-rose-50 text-rose-700 ring-rose-100",
    sky: "bg-sky-50 text-sky-700 ring-sky-100",
    slate: "bg-slate-100 text-slate-700 ring-slate-200",
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

function AgenceDashboard() {
  const data = useMemo(() => getAgencyDashboardData(), []);

  const stats = useMemo(() => {
    const activeTenants = data.tenants.filter((tenant) => tenant.active).length;
    const monthlyRevenue = data.payments
      .filter((payment) => payment.status === "paid")
      .reduce((total, payment) => total + payment.amount, 0);
    const latePayments = data.payments.filter(
      (payment) => payment.status === "late",
    ).length;
    const activeContracts = data.properties.filter(
      (property) => property.status === "occupied",
    ).length;
    const activeDisputes = data.disputes.filter(
      (dispute) => dispute.status === "ongoing",
    ).length;

    return [
      {
        label: "Total Biens",
        value: numberFormatter.format(data.properties.length),
        helper: "Nombre total de propriétés",
        tone: "emerald",
      },
      {
        label: "Total Locataires",
        value: numberFormatter.format(activeTenants),
        helper: "Locataires actifs",
        tone: "indigo",
      },
      {
        label: "Revenus Mensuels",
        value: currencyFormatter.format(monthlyRevenue),
        helper: "Loyers encaissés ce mois",
        tone: "sky",
      },
      {
        label: "Loyers en Retard",
        value: numberFormatter.format(latePayments),
        helper: "Paiements à relancer",
        tone: "rose",
      },
      {
        label: "Contrats Actifs",
        value: numberFormatter.format(activeContracts),
        helper: "Contrats actuellement actifs",
        tone: "slate",
      },
      {
        label: "Litiges Actifs",
        value: numberFormatter.format(activeDisputes),
        helper: "Conflits non résolus",
        tone: "amber",
      },
    ];
  }, [data]);

  const paidVsLate = useMemo(
    () => [
      {
        name: "Payés",
        value: data.payments.filter((payment) => payment.status === "paid")
          .length,
      },
      {
        name: "En attente",
        value: data.payments.filter((payment) => payment.status === "pending")
          .length,
      },
      {
        name: "Retard",
        value: data.payments.filter((payment) => payment.status === "late")
          .length,
      },
    ],
    [data.payments],
  );

  const occupancy = useMemo(
    () => [
      {
        name: "Occupés",
        value: data.properties.filter((property) => property.status === "occupied")
          .length,
      },
      {
        name: "Disponibles",
        value: data.properties.filter(
          (property) => property.status === "available",
        ).length,
      },
    ],
    [data.properties],
  );

  return (
    <AgencyLayout agencyName={data.agency.name}>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.8fr_0.8fr]">
        <ChartCard
          title="Revenus Mensuels"
          subtitle="Évolution des loyers encaissés par mois."
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip
                formatter={(value) => currencyFormatter.format(Number(value))}
              />
              <Bar dataKey="revenue" fill="#059669" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Loyers Payés vs Retards"
          subtitle="Répartition des statuts de paiement."
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={paidVsLate} dataKey="value" nameKey="name" label>
                {paidVsLate.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={["#059669", "#f59e0b", "#e11d48"][index]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Occupation des Biens"
          subtitle="Biens occupés et disponibles."
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={occupancy} dataKey="value" nameKey="name" label>
                {occupancy.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={["#4f46e5", "#0284c7"][index]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.9fr]">
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <h2 className="text-lg font-bold text-slate-950">
              Paiements récents
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Derniers loyers enregistrés par l'agence.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-bold">Locataire</th>
                  <th className="px-5 py-3 font-bold">Bien</th>
                  <th className="px-5 py-3 font-bold">Montant</th>
                  <th className="px-5 py-3 font-bold">Date</th>
                  <th className="px-5 py-3 font-bold">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-bold text-slate-950">
                      {payment.tenantName}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {payment.propertyName}
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-slate-950">
                      {currencyFormatter.format(payment.amount)}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {formatDate(payment.date)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${paymentClasses(
                          payment.status,
                        )}`}
                      >
                        {paymentLabel(payment.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <h2 className="text-lg font-bold text-slate-950">
              Litiges récents
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Conflits non résolus et dossiers clôturés.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-bold">Locataire</th>
                  <th className="px-5 py-3 font-bold">Sujet</th>
                  <th className="px-5 py-3 font-bold">Date</th>
                  <th className="px-5 py-3 font-bold">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.disputes.map((dispute) => (
                  <tr key={dispute.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-bold text-slate-950">
                      {dispute.tenantName}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {dispute.subject}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {formatDate(dispute.date)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${disputeClasses(
                          dispute.status,
                        )}`}
                      >
                        {disputeLabel(dispute.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-950">Activité récente</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {data.activities.map((activity) => (
            <div
              key={activity.id}
              className="rounded-lg border border-slate-200 bg-slate-50 p-4"
            >
              <p className="font-bold text-slate-950">{activity.title}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {activity.description}
              </p>
              <p className="mt-3 text-xs font-bold text-slate-400">
                {activity.time}
              </p>
            </div>
          ))}
        </div>
      </section>
    </AgencyLayout>
  );
}

export default AgenceDashboard;
