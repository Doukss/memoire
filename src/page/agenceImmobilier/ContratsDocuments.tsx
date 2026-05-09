import { useMemo, useState } from "react";
import AgencyLayout from "../../components/common/layout/AgencyLayout";
import {
  getAgencyDashboardData,
  type AgencyContract,
  type AgencyReceipt,
  type ContractStatus,
  type ReceiptStatus,
} from "../../service/ofline/agencyStorage";

type TabType = "contrats" | "quittances" | "generer";

const tabs: Array<{ id: TabType; label: string }> = [
  { id: "contrats", label: "Contrats" },
  { id: "quittances", label: "Quittances" },
  { id: "generer", label: "Générer PDF" },
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

function contractStatusLabel(status: ContractStatus) {
  const labels: Record<ContractStatus, string> = {
    active: "Actif",
    expired: "Expiré",
    terminated: "Résilié",
  };
  return labels[status];
}

function receiptStatusLabel(status: ReceiptStatus) {
  const labels: Record<ReceiptStatus, string> = {
    pending: "En attente",
    generated: "Générée",
    sent: "Envoyée",
  };
  return labels[status];
}

function contractStatusClasses(status: ContractStatus) {
  const classes: Record<ContractStatus, string> = {
    active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    expired: "bg-rose-50 text-rose-700 ring-rose-200",
    terminated: "bg-slate-100 text-slate-700 ring-slate-200",
  };
  return classes[status];
}

function receiptStatusClasses(status: ReceiptStatus) {
  const classes: Record<ReceiptStatus, string> = {
    pending: "bg-amber-50 text-amber-700 ring-amber-200",
    generated: "bg-sky-50 text-sky-700 ring-sky-200",
    sent: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  };
  return classes[status];
}

function ContratsDocuments() {
  const [data] = useState(() => getAgencyDashboardData());
  const [activeTab, setActiveTab] = useState<TabType>("contrats");

  const contracts = useMemo(() => {
    return [...data.contracts].sort((a, b) =>
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
    );
  }, [data.contracts]);

  const receipts = useMemo(() => {
    return [...data.receipts].sort((a, b) =>
      new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime(),
    );
  }, [data.receipts]);

  const contractStats = useMemo(() => ({
    total: data.contracts.length,
    active: data.contracts.filter((c) => c.status === "active").length,
    signed: data.contracts.filter((c) => c.signed).length,
  }), [data.contracts]);

  const receiptStats = useMemo(() => ({
    total: data.receipts.length,
    generated: data.receipts.filter((r) => r.status === "generated" || r.status === "sent").length,
    pending: data.receipts.filter((r) => r.status === "pending").length,
  }), [data.receipts]);

  return (
    <AgencyLayout agencyName={data.agency.name}>
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Contrats actifs</p>
          <p className="mt-3 text-3xl font-bold text-slate-950">
            {numberFormatter.format(contractStats.active)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Quittances émises</p>
          <p className="mt-3 text-3xl font-bold text-emerald-600">
            {numberFormatter.format(receiptStats.generated)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">En attente</p>
          <p className="mt-3 text-3xl font-bold text-amber-600">
            {numberFormatter.format(receiptStats.pending)}
          </p>
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950">Contrats & Documents</h2>
              <p className="mt-1 text-sm text-slate-500">
                Gérez les contrats et quittances de.Location.
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
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-950"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "contrats" && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-bold">Locataire</th>
                  <th className="px-5 py-3 font-bold">Bien</th>
                  <th className="px-5 py-3 font-bold">Période</th>
                  <th className="px-5 py-3 font-bold">Loyer mensuel</th>
                  <th className="px-5 py-3 font-bold">Statut</th>
                  <th className="px-5 py-3 font-bold">Signature</th>
                  <th className="px-5 py-3 font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {contracts.map((contract: AgencyContract) => (
                  <tr key={contract.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-bold text-slate-950">
                      {contract.tenantName}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {contract.propertyName}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {formatDate(contract.startDate)} - {formatDate(contract.endDate)}
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-slate-950">
                      {currencyFormatter.format(contract.monthlyRent)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${contractStatusClasses(
                          contract.status,
                        )}`}
                      >
                        {contractStatusLabel(contract.status)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${
                          contract.signed
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                            : "bg-amber-50 text-amber-700 ring-amber-200"
                        }`}
                      >
                        {contract.signed ? "Signé" : "En attente"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-indigo-700"
                      >
                        Voir contrat
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {contracts.length === 0 && (
              <div className="p-8 text-center text-sm font-semibold text-slate-500">
                Aucun contrat enregistré.
              </div>
            )}
          </div>
        )}

        {activeTab === "quittances" && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-bold">Locataire</th>
                  <th className="px-5 py-3 font-bold">Bien</th>
                  <th className="px-5 py-3 font-bold">Période</th>
                  <th className="px-5 py-3 font-bold">Montant</th>
                  <th className="px-5 py-3 font-bold">Date d'émission</th>
                  <th className="px-5 py-3 font-bold">Statut</th>
                  <th className="px-5 py-3 font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {receipts.map((receipt: AgencyReceipt) => (
                  <tr key={receipt.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-bold text-slate-950">
                      {receipt.tenantName}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {receipt.propertyName}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
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
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${receiptStatusClasses(
                          receipt.status,
                        )}`}
                      >
                        {receiptStatusLabel(receipt.status)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-indigo-700"
                      >
                        Télécharger
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {receipts.length === 0 && (
              <div className="p-8 text-center text-sm font-semibold text-slate-500">
                Aucune quittance générée.
              </div>
            )}
          </div>
        )}

        {activeTab === "generer" && (
          <div className="p-5">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-950">
                Générer un document PDF
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Sélectionnez un type de document à générer.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-slate-200 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-950">Contrat de location</h4>
                    <p className="text-sm text-slate-500">Générer un nouveau contrat</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Locataire
                  </label>
                  <select className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100">
                    {data.tenants.map((tenant) => (
                      <option key={tenant.id} value={tenant.id}>
                        {tenant.fullName}
                      </option>
                    ))}
                  </select>
                </div>
                <button className="mt-4 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700">
                  Générer contrat
                </button>
              </div>

              <div className="rounded-lg border border-slate-200 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-950">Quittance de loyer</h4>
                    <p className="text-sm text-slate-500">Générer une quittance</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Locataire
                  </label>
                  <select className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100">
                    {data.tenants.map((tenant) => (
                      <option key={tenant.id} value={tenant.id}>
                        {tenant.fullName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-4 space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Période
                  </label>
                  <input
                    type="month"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>
                <button className="mt-4 w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700">
                  Générer quittance
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </AgencyLayout>
  );
}

export default ContratsDocuments;
