import { useMemo, useState } from "react";
import TenantLayout from "../../components/common/layout/TenantLayout";
import { getAgencyDashboardData } from "../../service/ofline/agencyStorage";

type PaymentTab = "historique" | "statut" | "quittances";

const tabs: Array<{ id: PaymentTab; label: string }> = [
  { id: "historique", label: "Historique" },
  { id: "statut", label: "Statut paiement" },
  { id: "quittances", label: "Télécharger quittances" },
];

const currencyFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "XOF",
  maximumFractionDigits: 0,
});

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function formatMonth(year: number, month: number) {
  const date = new Date(year, month - 1);
  return new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(date);
}

function paymentStatusLabel(status: "paid" | "pending" | "late") {
  const labels = {
    paid: "Payé",
    pending: "En attente",
    late: "Retard",
  };
  return labels[status];
}

function paymentStatusClass(status: "paid" | "pending" | "late") {
  const classes = {
    paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    pending: "bg-amber-50 text-amber-700 ring-amber-200",
    late: "bg-rose-50 text-rose-700 ring-rose-200",
  };
  return classes[status];
}

function MesPaiements() {
  const [data] = useState(() => getAgencyDashboardData());
  const [activeTab, setActiveTab] = useState<PaymentTab>("historique");

  // Simulation: on prend le premier locataire actif comme "locataire connecté"
  const tenant = useMemo(() => {
    return data.tenants.find((t) => t.active) || data.tenants[0];
  }, [data.tenants]);

  const payments = useMemo(() => {
    return [...data.payments]
      .filter((p) => p.tenantName === tenant.fullName)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [data.payments, tenant]);

  const receipts = useMemo(() => {
    return data.receipts.filter((r) => r.tenantName === tenant.fullName);
  }, [data.receipts, tenant]);

  // Calculer les paiements par mois
  const paymentsByMonth = useMemo(() => {
    const grouped: Record<string, { total: number; paid: number; pending: number; late: number }> = {};
    
    payments.forEach((payment) => {
      const date = new Date(payment.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!grouped[monthKey]) {
        grouped[monthKey] = { total: 0, paid: 0, pending: 0, late: 0 };
      }
      grouped[monthKey].total += payment.amount;
      grouped[monthKey][payment.status] += payment.amount;
    });

    return Object.entries(grouped)
      .map(([month, stats]) => ({
        month,
        ...stats,
      }))
      .sort((a, b) => b.month.localeCompare(a.month));
  }, [payments]);

  // Ajouter quittance aux paiements
  const paymentsWithReceipt = useMemo(() => {
    return payments.map((payment) => {
      const receipt = receipts.find((r) => 
        r.period.toLowerCase().includes(payment.date.substring(0, 7))
      );
      return { ...payment, receipt };
    });
  }, [payments, receipts]);

  return (
    <TenantLayout tenantName={tenant.fullName}>
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Total payé</p>
          <p className="mt-3 text-3xl font-bold text-emerald-600">
            {currencyFormatter.format(payments.filter(p => p.status === "paid").reduce((sum, p) => sum + p.amount, 0))}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">En attente</p>
          <p className="mt-3 text-3xl font-bold text-amber-600">
            {currencyFormatter.format(payments.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amount, 0))}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">En retard</p>
          <p className="mt-3 text-3xl font-bold text-rose-600">
            {currencyFormatter.format(payments.filter(p => p.status === "late").reduce((sum, p) => sum + p.amount, 0))}
          </p>
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950">Mes Paiements</h2>
              <p className="mt-1 text-sm text-slate-500">
                Consultez l'historique et les documents de vos loyers.
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                  activeTab === tab.id
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-950"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "historique" && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-bold">Mois</th>
                  <th className="px-5 py-3 font-bold">Montant</th>
                  <th className="px-5 py-3 font-bold">Date</th>
                  <th className="px-5 py-3 font-bold">Statut</th>
                  <th className="px-5 py-3 font-bold">Quittance</th>
                  <th className="px-5 py-3 font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paymentsWithReceipt.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 text-sm font-semibold text-slate-950">
                      {new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(new Date(payment.date))}
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-slate-950">
                      {currencyFormatter.format(payment.amount)}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {formatDate(payment.date)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${paymentStatusClass(
                          payment.status,
                        )}`}
                      >
                        {paymentStatusLabel(payment.status)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {payment.receipt ? (
                        <button
                          className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-indigo-700"
                        >
                          Télécharger
                        </button>
                      ) : (
                        <span className="text-sm text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {(payment.status === "late" || payment.status === "pending") && (
                        <a
                          href={`/locataire/paiement-en-ligne?amount=${payment.amount}&property=${encodeURIComponent(payment.propertyName)}&date=${payment.date}`}
                          className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-700"
                        >
                          Payer maintenant
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {payments.length === 0 && (
              <div className="p-8 text-center text-sm font-semibold text-slate-500">
                Aucun paiement enregistré.
              </div>
            )}
          </div>
        )}

        {activeTab === "statut" && (
          <div className="p-5">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-950">Statut de vos paiements</h3>
              <p className="mt-1 text-sm text-slate-500">
                Vue d'ensemble de l'état de vos loyers.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {paymentsByMonth.map((month) => (
                <div key={month.month} className="rounded-lg border border-slate-200 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="font-bold text-slate-950">
                      {formatMonth(Number(month.month.split('-')[0]), Number(month.month.split('-')[1]))}
                    </h4>
                    <span className="text-sm font-bold text-slate-700">{currencyFormatter.format(month.total)}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Payé</span>
                      <span className="font-semibold text-emerald-600">{currencyFormatter.format(month.paid)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">En attente</span>
                      <span className="font-semibold text-amber-600">{currencyFormatter.format(month.pending)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">En retard</span>
                      <span className="font-semibold text-rose-600">{currencyFormatter.format(month.late)}</span>
                    </div>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-slate-100 overflow-hidden flex">
                    {month.paid > 0 && (
                      <div className="bg-emerald-500" style={{ width: `${(month.paid / month.total) * 100}%` }} />
                    )}
                    {month.pending > 0 && (
                      <div className="bg-amber-500" style={{ width: `${(month.pending / month.total) * 100}%` }} />
                    )}
                    {month.late > 0 && (
                      <div className="bg-rose-500" style={{ width: `${(month.late / month.total) * 100}%` }} />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {paymentsByMonth.length === 0 && (
              <div className="p-8 text-center text-sm font-semibold text-slate-500">
                Aucune donnée de paiement disponible.
              </div>
            )}
          </div>
        )}

        {activeTab === "quittances" && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-bold">Période</th>
                  <th className="px-5 py-3 font-bold">Montant</th>
                  <th className="px-5 py-3 font-bold">Date émission</th>
                  <th className="px-5 py-3 font-bold">Statut</th>
                  <th className="px-5 py-3 font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {receipts.map((receipt) => (
                  <tr key={receipt.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 text-sm font-semibold text-slate-950">
                      {receipt.period}
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-slate-950">
                      {currencyFormatter.format(receipt.amount)}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {formatDate(receipt.issuedAt)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${
                          receipt.status === "sent"
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                            : receipt.status === "generated"
                            ? "bg-sky-50 text-sky-700 ring-sky-200"
                            : "bg-amber-50 text-amber-700 ring-amber-200"
                        }`}
                      >
                        {receipt.status === "sent" ? "Envoyée" : receipt.status === "generated" ? "Générée" : "En attente"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 flex items-center gap-2"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {receipts.length === 0 && (
              <div className="p-8 text-center text-sm font-semibold text-slate-500">
                Aucune quittance disponible.
              </div>
            )}
          </div>
        )}
      </section>
    </TenantLayout>
  );
}

export default MesPaiements;
