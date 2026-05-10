import { useMemo, useState } from "react";
import TenantLayout from "../../components/common/layout/TenantLayout";
import SignatureCanvas from "../../components/common/ui/SignatureCanvas";
import { getAgencyDashboardData, saveAgencyDashboardData } from "../../service/ofline/agencyStorage";

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

function MesDocuments() {
  const [data, setData] = useState(() => getAgencyDashboardData());
  const [signingContractId, setSigningContractId] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  // Simulation: on prend le premier locataire actif comme "locataire connecté"
  const tenant = useMemo(() => {
    return data.tenants.find((t) => t.active) || data.tenants[0];
  }, [data.tenants]);

  function persist(nextData: typeof data) {
    setData(nextData);
    saveAgencyDashboardData(nextData);
  }

  function handleSignatureSave(contractId: number, _dataUrl: string) {
    setSaved(true);
    // Marquer le contrat comme signé
    const newData = { ...data };
    const contractIndex = newData.contracts.findIndex((c) => c.id === contractId);
    if (contractIndex >= 0) {
      newData.contracts[contractIndex] = { ...newData.contracts[contractIndex], signed: true };
      persist(newData);
    }
    setTimeout(() => {
      closeSignatureModal();
    }, 1500);
  }

  function closeSignatureModal() {
    setSigningContractId(null);
    setSaved(false);
  }

  const contracts = useMemo(() => {
    return data.contracts.filter((c) => c.tenantName === tenant.fullName);
  }, [data.contracts, tenant]);

  const receipts = useMemo(() => {
    return data.receipts.filter((r) => r.tenantName === tenant.fullName);
  }, [data.receipts, tenant]);

  return (
    <TenantLayout tenantName={tenant.fullName}>
      <section className="space-y-6">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Mes Contrats</h2>
          <p className="mt-1 text-sm text-slate-500">
            Tous vos contrats de location.
          </p>
          <div className="mt-5 space-y-3">
            {contracts.map((contract) => (
              <div key={contract.id} className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-slate-950">
                      Contrat #{contract.id.toString().padStart(4, '0')}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {contract.propertyName} - {currencyFormatter.format(contract.monthlyRent)}/mois
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {formatDate(contract.startDate)} - {formatDate(contract.endDate)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${
                      contract.status === "active"
                        ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                        : contract.status === "expired"
                        ? "bg-rose-50 text-rose-700 ring-rose-200"
                        : "bg-slate-100 text-slate-700 ring-slate-200"
                    }`}>
                      {contract.status === "active" ? "Actif" : contract.status === "expired" ? "Expiré" : "Résilié"}
                    </span>
                    {contract.signed ? (
                      <button
                        disabled
                        className="rounded-lg bg-emerald-100 px-3 py-2 text-xs font-bold text-emerald-700 cursor-default"
                      >
                        ✅ Signé
                      </button>
                    ) : (
                      <button
                        onClick={() => setSigningContractId(contract.id)}
                        className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-indigo-700"
                      >
                        Signer
                      </button>
                    )}
                    <button className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">
                      Voir PDF
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {contracts.length === 0 && (
              <p className="p-4 text-sm font-semibold text-slate-500">Aucun contrat enregistré.</p>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Mes Quittances</h2>
          <p className="mt-1 text-sm text-slate-500">
            Reçus de paiement de loyer.
          </p>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[600px] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-bold">Période</th>
                  <th className="px-5 py-3 font-bold">Montant</th>
                  <th className="px-5 py-3 font-bold">Date émission</th>
                  <th className="px-5 py-3 font-bold">Statut</th>
                  <th className="px-5 py-3 font-bold">Télécharger</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {receipts.map((receipt) => (
                  <tr key={receipt.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 text-sm font-semibold text-slate-950">{receipt.period}</td>
                    <td className="px-5 py-4 text-sm font-bold text-slate-950">{currencyFormatter.format(receipt.amount)}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{formatDate(receipt.issuedAt)}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${
                        receipt.status === "sent"
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                          : receipt.status === "generated"
                          ? "bg-sky-50 text-sky-700 ring-sky-200"
                          : "bg-amber-50 text-amber-700 ring-amber-200"
                      }`}>
                        {receipt.status === "sent" ? "Envoyée" : receipt.status === "generated" ? "Générée" : "En attente"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 flex items-center gap-2">
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
              <div className="p-8 text-center text-sm font-semibold text-slate-500">Aucune quittance disponible.</div>
            )}
          </div>
        </div>

        {/* Modal de signature électronique */}
        {signingContractId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
              <h3 className="text-lg font-bold text-slate-950">Signer le contrat</h3>
              <p className="mt-1 text-sm text-slate-500">
                Dessinez votre signature ci-dessous.
              </p>
              <div className="mt-4">
                <SignatureCanvas
                  width={500}
                  height={200}
                  onSave={(dataUrl) => handleSignatureSave(signingContractId, dataUrl)}
                  onClear={() => {}}
                />
              </div>
              {saved && (
                <div className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">
                  ✅ Contrat signé avec succès !
                </div>
              )}
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={closeSignatureModal}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </TenantLayout>
  );
}

export default MesDocuments;
