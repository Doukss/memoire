import { useMemo, useState } from "react";
import AgencyLayout from "../../components/common/layout/AgencyLayout";
import {
  getAgencyDashboardData,
  saveAgencyDashboardData,
  type AgencyDashboardData,
  type RentPayment,
  type RentPaymentStatus,
} from "../../service/ofline/agencyStorage";

type PaymentTab = "all" | "late" | "history";

const tabs: Array<{ id: PaymentTab; label: string }> = [
  { id: "all", label: "Tous les paiements" },
  { id: "late", label: "Loyers en retard" },
  { id: "history", label: "Historique" },
];

const currencyFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "XOF",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("fr-FR");

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function statusLabel(status: RentPaymentStatus) {
  const labels: Record<RentPaymentStatus, string> = {
    paid: "Payé",
    pending: "En attente",
    late: "Retard",
  };

  return labels[status];
}

function statusClasses(status: RentPaymentStatus) {
  const classes: Record<RentPaymentStatus, string> = {
    paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    pending: "bg-amber-50 text-amber-700 ring-amber-200",
    late: "bg-rose-50 text-rose-700 ring-rose-200",
  };

  return classes[status];
}

function GestionPaiements() {
  const [data, setData] = useState<AgencyDashboardData>(() =>
    getAgencyDashboardData(),
  );
  const [activeTab, setActiveTab] = useState<PaymentTab>("all");
  const [search, setSearch] = useState("");

  const payments = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return [...data.payments]
      .sort(
        (first, second) =>
          new Date(second.date).getTime() - new Date(first.date).getTime(),
      )
      .filter((payment) => {
        const matchesTab = activeTab !== "late" || payment.status === "late";
        const matchesSearch =
          normalizedSearch.length === 0 ||
          payment.tenantName.toLowerCase().includes(normalizedSearch) ||
          payment.propertyName.toLowerCase().includes(normalizedSearch);

        return matchesTab && matchesSearch;
      });
  }, [activeTab, data.payments, search]);

  const history = useMemo(
    () =>
      [...data.payments]
        .sort(
          (first, second) =>
            new Date(second.date).getTime() - new Date(first.date).getTime(),
        )
        .map((payment) => ({
          ...payment,
          event:
            payment.status === "paid"
              ? "Paiement encaissé"
              : payment.status === "late"
                ? "Relance nécessaire"
                : "Paiement en attente",
        })),
    [data.payments],
  );

  const summary = useMemo(() => {
    const paid = data.payments.filter((payment) => payment.status === "paid");
    const late = data.payments.filter((payment) => payment.status === "late");
    const pending = data.payments.filter(
      (payment) => payment.status === "pending",
    );

    return {
      total: data.payments.length,
      paidAmount: paid.reduce((total, payment) => total + payment.amount, 0),
      lateAmount: late.reduce((total, payment) => total + payment.amount, 0),
      pendingCount: pending.length,
    };
  }, [data.payments]);

  function persist(nextData: AgencyDashboardData) {
    setData(nextData);
    saveAgencyDashboardData(nextData);
  }

  function updatePaymentStatus(paymentId: number, status: RentPaymentStatus) {
    const target = data.payments.find((payment) => payment.id === paymentId);

    const nextData: AgencyDashboardData = {
      ...data,
      payments: data.payments.map((payment) =>
        payment.id === paymentId ? { ...payment, status } : payment,
      ),
      activities: target
        ? [
            {
              id: Date.now(),
              title: status === "paid" ? "Paiement reçu" : "Paiement mis à jour",
              description: `${target.tenantName} - ${currencyFormatter.format(
                target.amount,
              )} (${statusLabel(status).toLowerCase()}).`,
              time: "A l'instant",
              type: "payment",
            },
            ...data.activities,
          ]
        : data.activities,
    };

    persist(nextData);
  }

  function PaymentActions({ payment }: { payment: RentPayment }) {
    return (
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => updatePaymentStatus(payment.id, "paid")}
          className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-700"
        >
          Payé
        </button>
        <button
          onClick={() => updatePaymentStatus(payment.id, "pending")}
          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-amber-200 hover:text-amber-700"
        >
          Attente
        </button>
        <button
          onClick={() => updatePaymentStatus(payment.id, "late")}
          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-rose-200 hover:text-rose-700"
        >
          Retard
        </button>
      </div>
    );
  }

  return (
    <AgencyLayout agencyName={data.agency.name}>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Paiements</p>
          <p className="mt-3 text-3xl font-bold text-slate-950">
            {numberFormatter.format(summary.total)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Encaissé</p>
          <p className="mt-3 text-3xl font-bold text-emerald-600">
            {currencyFormatter.format(summary.paidAmount)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">En retard</p>
          <p className="mt-3 text-3xl font-bold text-rose-600">
            {currencyFormatter.format(summary.lateAmount)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">En attente</p>
          <p className="mt-3 text-3xl font-bold text-amber-600">
            {numberFormatter.format(summary.pendingCount)}
          </p>
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950">Paiements</h2>
              <p className="mt-1 text-sm text-slate-500">
                Suivez les loyers payés, en attente ou en retard.
              </p>
            </div>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher locataire ou bien"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 xl:w-80"
            />
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

        {activeTab === "history" ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-bold">Date</th>
                  <th className="px-5 py-3 font-bold">Événement</th>
                  <th className="px-5 py-3 font-bold">Locataire</th>
                  <th className="px-5 py-3 font-bold">Bien</th>
                  <th className="px-5 py-3 font-bold">Montant</th>
                  <th className="px-5 py-3 font-bold">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {formatDate(payment.date)}
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-950">
                      {payment.event}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {payment.tenantName}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {payment.propertyName}
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-slate-950">
                      {currencyFormatter.format(payment.amount)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${statusClasses(
                          payment.status,
                        )}`}
                      >
                        {statusLabel(payment.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-bold">Locataire</th>
                  <th className="px-5 py-3 font-bold">Bien</th>
                  <th className="px-5 py-3 font-bold">Montant</th>
                  <th className="px-5 py-3 font-bold">Date</th>
                  <th className="px-5 py-3 font-bold">Statut</th>
                  <th className="px-5 py-3 font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((payment) => (
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
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${statusClasses(
                          payment.status,
                        )}`}
                      >
                        {statusLabel(payment.status)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <PaymentActions payment={payment} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {payments.length === 0 ? (
              <div className="p-8 text-center text-sm font-semibold text-slate-500">
                Aucun paiement ne correspond à cette vue.
              </div>
            ) : null}
          </div>
        )}
      </section>
    </AgencyLayout>
  );
}

export default GestionPaiements;
