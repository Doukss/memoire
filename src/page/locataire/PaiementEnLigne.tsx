import { useState } from "react";
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

type PaymentMethod = "wave" | "orange" | "";

function PaiementEnLigne() {
  const [data] = useState(() => getAgencyDashboardData());
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("");
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<"select" | "confirm" | "success">("select");
  const [processing, setProcessing] = useState(false);

  // Simulation: premier locataire actif
  const tenant = data.tenants.find((t) => t.active) || data.tenants[0];

  // Montants pré définis
  const presetAmounts = [
    25000,
    50000,
    100000,
    150000,
    200000,
    300000,
  ];

  // Paiements en retard
  const overduePayments = data.payments.filter(
    (p) => p.tenantName === tenant.fullName && p.status === "late"
  );

  function handleAmountSelect(amount: number) {
    setSelectedAmount(amount);
    setCustomAmount("");
  }

  function handleCustomAmount(e: React.ChangeEvent<HTMLInputElement>) {
    const value = parseInt(e.target.value.replace(/\D/g, "")) || 0;
    setSelectedAmount(value);
    setCustomAmount(e.target.value);
  }

  function handlePayment() {
    if (!paymentMethod || !phone || selectedAmount <= 0) return;

    setProcessing(true);
    // Simulation du paiement
    setTimeout(() => {
      setProcessing(false);
      setStep("success");
    }, 3000);
  }

  return (
    <TenantLayout tenantName={tenant.fullName}>
      <div className="max-w-3xl mx-auto">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Paiement en ligne</h2>
          <p className="mt-1 text-sm text-slate-500">
            Payez votre loyer via Wave ou Orange Money.
          </p>

          {step === "success" ? (
            <div className="mt-6 rounded-lg bg-emerald-50 p-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                <svg className="h-8 w-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-emerald-700">Paiement réussi !</h3>
              <p className="mt-2 text-sm text-slate-600">
                {currencyFormatter.format(selectedAmount)} ont été envoyés via {paymentMethod === "wave" ? "Wave" : "Orange Money"}.
              </p>
              <button
                onClick={() => {
                  setStep("select");
                  setPaymentMethod("");
                  setPhone("");
                  setSelectedAmount(0);
                }}
                className="mt-4 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
              >
                Nouveau paiement
              </button>
            </div>
          ) : step === "confirm" ? (
            <div className="mt-6">
              <div className="rounded-lg border border-slate-200 p-4 mb-4">
                <h3 className="font-bold text-slate-950">Récapitulatif</h3>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Montant</span>
                    <span className="font-bold text-slate-950">{currencyFormatter.format(selectedAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Méthode</span>
                    <span className="font-bold text-slate-950">
                      {paymentMethod === "wave" ? "Wave" : "Orange Money"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Numéro</span>
                    <span className="font-bold text-slate-950">{phone}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("select")}
                  className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handlePayment}
                  disabled={processing}
                  className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:opacity-50"
                >
                  {processing ? "Traitement..." : "Confirmer"}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Paiements en retard */}
              {overduePayments.length > 0 && (
                <div className="mt-6 rounded-lg bg-rose-50 border border-rose-200 p-4">
                  <h3 className="font-bold text-rose-700">⚠️ Paiements en retard</h3>
                  <p className="mt-1 text-sm text-rose-600">
                    Vous avez {overduePayments.length} paiement(s) en retard. Veuillez régulariser votre situation.
                  </p>
                  <div className="mt-3 space-y-2">
                    {overduePayments.map((payment) => (
                      <div key={payment.id} className="flex justify-between items-center bg-white rounded p-3">
                        <div>
                          <p className="font-semibold text-slate-950">
                            {formatDate(payment.date)} - {payment.propertyName}
                          </p>
                          <p className="text-sm text-slate-500">{currencyFormatter.format(payment.amount)}</p>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedAmount(payment.amount);
                            setStep("confirm");
                          }}
                          className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-bold text-white hover:bg-rose-700"
                        >
                          Payer
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sélection montant */}
              <div className="mt-6">
                <h3 className="font-semibold text-slate-950 mb-3">Choisir un montant (FCFA)</h3>
                <div className="grid grid-cols-3 gap-2">
                  {presetAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleAmountSelect(amount)}
                      className={`rounded-lg border p-3 text-center transition ${
                        selectedAmount === amount
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                          : "border-slate-300 hover:border-indigo-300"
                      }`}
                    >
                      {currencyFormatter.format(amount)}
                    </button>
                  ))}
                </div>
                <div className="mt-3">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Ou saisir un montant personnalisé
                  </label>
                  <input
                    type="text"
                    value={customAmount}
                    onChange={handleCustomAmount}
                    placeholder="Ex: 125000"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
                {selectedAmount > 0 && (
                  <p className="mt-2 text-sm text-slate-600">
                    Montant sélectionné : <strong>{currencyFormatter.format(selectedAmount)}</strong>
                  </p>
                )}
              </div>

              {/* Méthode de paiement */}
              <div className="mt-6">
                <h3 className="font-semibold text-slate-950 mb-3">Méthode de paiement</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setPaymentMethod("wave")}
                    className={`rounded-lg border-2 p-4 text-center transition ${
                      paymentMethod === "wave"
                        ? "border-green-600 bg-green-50"
                        : "border-slate-300 hover:border-green-300"
                    }`}
                  >
                    <div className="text-2xl mb-2">📱</div>
                    <p className="font-bold text-slate-950">Wave</p>
                    <p className="text-xs text-slate-500">Paiement mobile</p>
                  </button>
                  <button
                    onClick={() => setPaymentMethod("orange")}
                    className={`rounded-lg border-2 p-4 text-center transition ${
                      paymentMethod === "orange"
                        ? "border-orange-600 bg-orange-50"
                        : "border-slate-300 hover:border-orange-300"
                    }`}
                  >
                    <div className="text-2xl mb-2">🟠</div>
                    <p className="font-bold text-slate-950">Orange Money</p>
                    <p className="text-xs text-slate-500">Paiement mobile</p>
                  </button>
                </div>
              </div>

              {/* Numéro de téléphone */}
              {paymentMethod && (
                <div className="mt-6">
                  <h3 className="font-semibold text-slate-950 mb-3">
                    Numéro {paymentMethod === "wave" ? "Wave" : "Orange Money"}
                  </h3>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    placeholder={paymentMethod === "wave" ? "77 123 45 67" : "70 987 65 43"}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Entrez le numéro de votre compte {paymentMethod === "wave" ? "Wave" : "Orange Money"}
                  </p>
                </div>
              )}

              {/* Bouton de confirmation */}
              {paymentMethod && phone && selectedAmount > 0 && (
                <div className="mt-6">
                  <button
                    onClick={handlePayment}
                    disabled={processing}
                    className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {processing ? (
                      <>
                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Traitement en cours...
                      </>
                    ) : (
                      `Payer ${currencyFormatter.format(selectedAmount)}`
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* Info sécurité */}
        <section className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-5">
          <h3 className="font-bold text-slate-950">🔒 Sécurité</h3>
          <p className="mt-1 text-sm text-slate-600">
            Vos paiements sont sécurisés par cryptage SSL. Vos données bancaires ne sont jamais stockées sur nos serveurs.
          </p>
        </section>
      </div>
    </TenantLayout>
  );
}

export default PaiementEnLigne;
