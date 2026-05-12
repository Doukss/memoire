import { useMemo, useState } from "react";
import TenantLayout from "../../components/common/layout/TenantLayout";
import { getAgencyDashboardData } from "../../service/ofline/agencyStorage";

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

function LocataireDashboard() {
  const [data] = useState(() => getAgencyDashboardData());
  
  // Simulation: on prend le premier locataire actif comme "locataire connecté"
  const tenant = useMemo(() => {
    return data.tenants.find((t) => t.active) || data.tenants[0];
  }, [data.tenants]);

  const payments = useMemo(() => {
    return data.payments.filter((p) => p.tenantName === tenant.fullName);
  }, [data.payments, tenant]);

  const contracts = useMemo(() => {
    return data.contracts.filter((c) => c.tenantName === tenant.fullName);
  }, [data.contracts, tenant]);

  const disputes = useMemo(() => {
    return data.disputes.filter((d) => d.tenantName === tenant.fullName);
  }, [data.disputes, tenant]);

  // Prochain loyer (le plus proche dans le futur)
  const nextRent = useMemo(() => {
    const unpaidPayments = payments.filter((p) => p.status !== "paid");
    if (unpaidPayments.length > 0) {
      const sorted = [...unpaidPayments].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      return sorted[0];
    }
    return null;
  }, [payments]);

  // Statut du paiement le plus récent
  const latestPaymentStatus = useMemo(() => {
    if (payments.length === 0) return null;
    const sorted = [...payments].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return sorted[0].status;
  }, [payments]);

  // Contrat actif
  const activeContract = useMemo(() => {
    return contracts.find((c) => c.status === "active" && c.signed);
  }, [contracts]);

  // Litiges actifs
  const activeDisputes = useMemo(() => {
    return disputes.filter((d) => d.status === "ongoing");
  }, [disputes]);

  return (
    <TenantLayout tenantName={tenant.fullName}>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {/* Carte Prochain Loyer */}
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">Prochain loyer</p>
              <p className="mt-2 text-2xl font-bold text-slate-950">
                {nextRent ? currencyFormatter.format(nextRent.amount) : "Aucun"}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {nextRent ? `Échéance : ${formatDate(nextRent.date)}` : "Tous les loyers sont payés"}
              </p>
            </div>
            <div className="rounded-lg bg-indigo-50 p-2">
              <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Carte Statut Paiement */}
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">Statut paiement</p>
              <p className="mt-2 text-2xl font-bold text-slate-950">
                {latestPaymentStatus ? paymentStatusLabel(latestPaymentStatus) : "N/A"}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Dernier paiement
              </p>
            </div>
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${
              latestPaymentStatus === "paid"
                ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                : latestPaymentStatus === "pending"
                ? "bg-amber-50 text-amber-700 ring-amber-200"
                : "bg-rose-50 text-rose-700 ring-rose-200"
            }`}>
              {latestPaymentStatus ? paymentStatusLabel(latestPaymentStatus) : "N/A"}
            </span>
          </div>
        </div>

        {/* Carte Contrat Actif */}
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">Contrat actif</p>
              <p className="mt-2 text-lg font-bold text-slate-950">
                {activeContract ? `#${activeContract.id.toString().padStart(4, '0')}` : "Aucun"}
              </p>
              {activeContract && (
                <p className="mt-1 text-xs text-slate-600">
                  {formatDate(activeContract.startDate)} - {formatDate(activeContract.endDate)}
                </p>
              )}
            </div>
            <div className="rounded-lg bg-slate-50 p-2">
              <svg className="h-6 w-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Carte Litiges Actifs */}
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">Litiges actifs</p>
              <p className="mt-2 text-2xl font-bold text-slate-950">
                {activeDisputes.length}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                demandes en cours
              </p>
            </div>
            <div className="rounded-lg bg-amber-50 p-2">
              <svg className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        {/* Derniers paiements */}
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <h2 className="text-lg font-bold text-slate-950">Historique des paiements</h2>
            <p className="mt-1 text-sm text-slate-500">
              Vos 5 derniers paiements.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-bold">Date</th>
                  <th className="px-5 py-3 font-bold">Montant</th>
                  <th className="px-5 py-3 font-bold">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.slice(0, 5).map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {formatDate(payment.date)}
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-slate-950">
                      {currencyFormatter.format(payment.amount)}
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Contrat en cours */}
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <h2 className="text-lg font-bold text-slate-950">Mon contrat</h2>
            <p className="mt-1 text-sm text-slate-500">
              Détails de votre contrat de location.
            </p>
          </div>
          <div className="p-5">
            {activeContract ? (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-slate-200 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Numéro de contrat
                    </p>
                    <p className="mt-1 font-bold text-slate-950">
                      #{activeContract.id.toString().padStart(4, '0')}
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-200 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Loyer mensuel
                    </p>
                    <p className="mt-1 font-bold text-slate-950">
                      {currencyFormatter.format(activeContract.monthlyRent)}
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-200 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Date de début
                    </p>
                    <p className="mt-1 font-bold text-slate-950">
                      {formatDate(activeContract.startDate)}
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-200 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Date de fin
                    </p>
                    <p className="mt-1 font-bold text-slate-950">
                      {formatDate(activeContract.endDate)}
                    </p>
                  </div>
                </div>
                <div className="rounded-lg border border-slate-200 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Statut
                  </p>
                  <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 bg-emerald-50 text-emerald-700 ring-emerald-200`}>
                    Actif - Signé
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm font-semibold text-slate-500">
                Aucun contrat actif trouvé.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-950">Actions rapides</h2>
        <p className="mt-1 text-sm text-slate-500">
          Accédez rapidement aux fonctionnalités les plus utilisées.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <a href="/locataire/documents" className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-left transition hover:bg-slate-100 hover:border-indigo-200">
            <div className="rounded-lg bg-indigo-50 p-2">
              <svg className="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-slate-950">Mes documents</p>
              <p className="text-xs text-slate-500">Contrats et quittances</p>
            </div>
          </a>
          <a href="/locataire/paiement-en-ligne" className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-left transition hover:bg-slate-100 hover:border-emerald-200">
            <div className="rounded-lg bg-emerald-50 p-2">
              <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-slate-950">Payer mon loyer</p>
              <p className="text-xs text-slate-500">Effectuer un paiement</p>
            </div>
          </a>
          <a href="/locataire/contact" className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-left transition hover:bg-slate-100 hover:border-amber-200">
            <div className="rounded-lg bg-amber-50 p-2">
              <svg className="h-5 w-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-slate-950">Signaler un problème</p>
              <p className="text-xs text-slate-500">Décrire un incident</p>
            </div>
          </a>
          <a href="/locataire/contact" className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-left transition hover:bg-slate-100 hover:border-sky-200">
            <div className="rounded-lg bg-sky-50 p-2">
              <svg className="h-5 w-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-slate-950">Mes messages</p>
              <p className="text-xs text-slate-500">Communication agence</p>
            </div>
          </a>
          <a href="/locataire/biens" className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-left transition hover:bg-slate-100 hover:border-emerald-200">
            <div className="rounded-lg bg-emerald-50 p-2">
              <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-slate-950">Biens disponibles</p>
              <p className="text-xs text-slate-500">Voir tous les biens</p>
            </div>
          </a>
        </div>
      </section>

      {activeDisputes.length > 0 && (
        <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Litiges en cours</h2>
          <p className="mt-1 text-sm text-slate-500">
            Vos demandes actuellement ouvertes.
          </p>
          <div className="mt-5 divide-y divide-slate-100">
            {activeDisputes.map((dispute) => (
              <div key={dispute.id} className="py-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-slate-950">{dispute.subject}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Ouvert le {formatDate(dispute.date)}
                    </p>
                  </div>
                  <span className="inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 bg-amber-50 text-amber-700 ring-amber-200">
                    En cours
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </TenantLayout>
  );
}

export default LocataireDashboard;
