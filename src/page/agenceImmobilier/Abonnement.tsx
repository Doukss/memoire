import { useMemo, useState } from "react";
import AgencyLayout from "../../components/common/layout/AgencyLayout";
import { useAuth } from "../../context/AuthContext";
import {
  getSuperAdminData,
  saveSuperAdminData,
  type Payment,
  type PaymentStatus,
  type SubscriptionStatus,
  type SuperAdminData,
} from "../../service/ofline/superAdminStorage";

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

function addOneMonth(value: string) {
  const nextDate = new Date(value);
  nextDate.setMonth(nextDate.getMonth() + 1);
  return nextDate.toISOString().slice(0, 10);
}

function subscriptionLabel(status: SubscriptionStatus) {
  const labels: Record<SubscriptionStatus, string> = {
    active: "Actif",
    trial: "Essai",
    expired: "Expire",
    suspended: "Suspendu",
  };

  return labels[status];
}

function paymentLabel(status: PaymentStatus) {
  const labels: Record<PaymentStatus, string> = {
    paid: "Paye",
    pending: "En attente",
    failed: "Echoue",
  };

  return labels[status];
}

function subscriptionClasses(status: SubscriptionStatus) {
  const classes: Record<SubscriptionStatus, string> = {
    active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    trial: "bg-sky-50 text-sky-700 ring-sky-200",
    expired: "bg-amber-50 text-amber-700 ring-amber-200",
    suspended: "bg-rose-50 text-rose-700 ring-rose-200",
  };

  return classes[status];
}

function paymentClasses(status: PaymentStatus) {
  const classes: Record<PaymentStatus, string> = {
    paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    pending: "bg-amber-50 text-amber-700 ring-amber-200",
    failed: "bg-rose-50 text-rose-700 ring-rose-200",
  };

  return classes[status];
}

function updateCurrentAgencyStatus(status: "active" | "suspended") {
  const storedUser = localStorage.getItem("kermanager.auth");

  if (storedUser) {
    const parsedUser = JSON.parse(storedUser);
    localStorage.setItem(
      "kermanager.auth",
      JSON.stringify({ ...parsedUser, agencyStatus: status }),
    );
  }
}

function Abonnement() {
  const { user } = useAuth();
  const [data, setData] = useState<SuperAdminData>(() => getSuperAdminData());
  const [method, setMethod] = useState<Payment["method"]>("Wave");
  const [notice, setNotice] = useState<string | null>(null);

  const agency = useMemo(
    () =>
      data.agencies.find((item) => item.email === user?.email) ??
      data.agencies.find((item) => item.name === user?.name) ??
      null,
    [data.agencies, user?.email, user?.name],
  );

  const subscription = useMemo(
    () =>
      data.subscriptions.find((item) => item.agencyName === agency?.name) ??
      data.subscriptions.find((item) => item.agencyName === user?.name) ??
      null,
    [agency?.name, data.subscriptions, user?.name],
  );

  const agencyName = agency?.name ?? user?.name ?? "Agence";

  const payments = useMemo(
    () =>
      data.payments
        .filter((payment) => payment.agencyName === agencyName)
        .sort(
          (first, second) =>
            new Date(second.paidAt).getTime() - new Date(first.paidAt).getTime(),
        ),
    [agencyName, data.payments],
  );

  const payableAmount = subscription?.monthlyPrice ?? 15000;

  const handlePayment = () => {
    if (!subscription || !agency) {
      setNotice("Aucun abonnement n'est encore rattache a cette agence.");
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    const nextPayment: Payment = {
      id: Date.now(),
      agencyName: agency.name,
      reference: `PAY-${new Date().getFullYear()}-${String(data.payments.length + 1).padStart(4, "0")}`,
      amount: payableAmount,
      status: "paid",
      method,
      paidAt: today,
    };

    const nextData: SuperAdminData = {
      ...data,
      agencies: data.agencies.map((item) =>
        item.id === agency.id ? { ...item, status: "active" } : item,
      ),
      subscriptions: data.subscriptions.map((item) =>
        item.id === subscription.id
          ? {
              ...item,
              status: "active",
              nextBillingAt: addOneMonth(today),
            }
          : item,
      ),
      payments: [nextPayment, ...data.payments],
      activities: [
        {
          id: Date.now() + 1,
          title: "Paiement abonnement recu",
          description: `${agency.name} a paye son abonnement ${subscription.plan}.`,
          time: "A l'instant",
          type: "payment",
        },
        ...data.activities,
      ],
      notifications: [
        {
          id: Date.now() + 2,
          title: "Abonnement paye",
          message: `${agency.name} a regle ${currencyFormatter.format(payableAmount)} via ${method}.`,
          type: "payment",
          priority: "medium",
          read: false,
          createdAt: new Date().toISOString(),
          target: agency.name,
        },
        ...data.notifications,
      ],
    };

    setData(nextData);
    saveSuperAdminData(nextData);
    updateCurrentAgencyStatus("active");
    window.dispatchEvent(
      new CustomEvent("agencyStatusChanged", {
        detail: { email: agency.email, status: "active" },
      }),
    );
    setNotice("Paiement enregistre. Votre abonnement est maintenant actif.");
  };

  return (
    <AgencyLayout agencyName={agencyName} allowWhenSuspended>
      <section className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
        <div className="grid gap-6">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
                  Abonnement agence
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-950">
                  Gerer et payer votre plan
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-slate-500">
                  Consultez votre plan SaaS, la prochaine facture et reglez
                  votre abonnement depuis l'espace agence.
                </p>
              </div>
              {subscription ? (
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${subscriptionClasses(
                    subscription.status,
                  )}`}
                >
                  {subscriptionLabel(subscription.status)}
                </span>
              ) : null}
            </div>

            {subscription ? (
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Plan actuel
                  </p>
                  <p className="mt-2 text-xl font-bold text-slate-950">
                    {subscription.plan}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Prix mensuel
                  </p>
                  <p className="mt-2 text-xl font-bold text-slate-950">
                    {currencyFormatter.format(subscription.monthlyPrice)}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Prochaine facture
                  </p>
                  <p className="mt-2 text-xl font-bold text-slate-950">
                    {formatDate(subscription.nextBillingAt)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
                Aucun abonnement n'est rattache a votre agence. Contactez le
                super-admin pour initialiser votre plan.
              </div>
            )}
          </div>

          <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5">
              <h2 className="text-lg font-bold text-slate-950">
                Historique de facturation
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Paiements d'abonnement enregistres pour votre agence.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-bold">Reference</th>
                    <th className="px-5 py-3 font-bold">Montant</th>
                    <th className="px-5 py-3 font-bold">Methode</th>
                    <th className="px-5 py-3 font-bold">Statut</th>
                    <th className="px-5 py-3 font-bold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4 font-bold text-slate-950">
                        {payment.reference}
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-slate-950">
                        {currencyFormatter.format(payment.amount)}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {payment.method}
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
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {formatDate(payment.paidAt)}
                      </td>
                    </tr>
                  ))}
                  {payments.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-8 text-center text-sm font-semibold text-slate-500"
                      >
                        Aucun paiement d'abonnement pour le moment.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">
            Payer l'abonnement
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Le paiement active automatiquement l'agence et actualise la
            prochaine facturation.
          </p>

          <div className="mt-5 rounded-lg bg-emerald-50 p-4 ring-1 ring-emerald-100">
            <p className="text-sm font-semibold text-emerald-700">
              Montant a payer
            </p>
            <p className="mt-2 text-3xl font-bold text-emerald-700">
              {currencyFormatter.format(payableAmount)}
            </p>
          </div>

          <label className="mt-5 block text-sm font-bold text-slate-700">
            Methode de paiement
          </label>
          <select
            value={method}
            onChange={(event) =>
              setMethod(event.target.value as Payment["method"])
            }
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          >
            <option value="Wave">Wave</option>
            <option value="Orange Money">Orange Money</option>
            <option value="Carte">Carte</option>
            <option value="Virement">Virement</option>
          </select>

          <button
            onClick={handlePayment}
            disabled={!subscription || !agency}
            className="mt-5 w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Payer maintenant
          </button>

          {notice ? (
            <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">
              {notice}
            </div>
          ) : null}
        </aside>
      </section>
    </AgencyLayout>
  );
}

export default Abonnement;
