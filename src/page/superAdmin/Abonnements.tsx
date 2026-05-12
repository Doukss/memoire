import { useMemo, useState } from "react";
import SuperAdminLayout from "../../components/common/layout/SuperAdminLayout";
import Pagination from "../../components/common/ui/Pagination";
import {
  getSuperAdminData,
  saveSuperAdminData,
  type Payment,
  type PaymentStatus,
  type Subscription,
  type SubscriptionStatus,
  type SuperAdminData,
} from "../../service/ofline/superAdminStorage";

function syncAgencyUser(email: string, status: "active" | "suspended") {
  const users = JSON.parse(localStorage.getItem("kermanager.users") || "[]");
  const existingUserIndex = users.findIndex((u: { email: string }) => u.email === email);
  if (existingUserIndex >= 0) {
    // L'utilisateur existe déjà, pas besoin de créer
  }
  // Synchroniser via l'événement
  window.dispatchEvent(new CustomEvent("agencyStatusChanged", { detail: { email, status } }));
}

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
    paid: "Payé",
    pending: "En attente",
    failed: "Échoué",
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

function Abonnements() {
  const [data, setData] = useState<SuperAdminData>(() => getSuperAdminData());
  const [paymentFilter, setPaymentFilter] = useState<"all" | PaymentStatus>(
    "all",
  );
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<
    number | null
  >(data.subscriptions[0]?.id ?? null);
  const [paymentsPage, setPaymentsPage] = useState(1);
  const itemsPerPage = 10;

  const persist = (nextData: SuperAdminData) => {
    setData(nextData);
    saveSuperAdminData(nextData);
  };

  const toggleSubscriptionStatus = (subscriptionId: number) => {
    const target = data.subscriptions.find((s) => s.id === subscriptionId);
    if (!target) return;

    const nextStatus: SubscriptionStatus = target.status === "suspended" ? "active" : "suspended";
    const activityId = Date.now();

    const nextData: SuperAdminData = {
      ...data,
      subscriptions: data.subscriptions.map((sub) =>
        sub.id === subscriptionId ? { ...sub, status: nextStatus } : sub,
      ),
      agencies: data.agencies.map((agency) =>
        agency.name === target.agencyName 
          ? { ...agency, status: nextStatus === "active" ? "active" : "suspended" } 
          : agency,
      ),
      activities: [
        {
          id: activityId,
          title: nextStatus === "active" ? "Abonnement réactivé" : "Abonnement suspendu",
          description: `L'abonnement de ${target.agencyName} est maintenant ${nextStatus === "active" ? "actif" : "suspendu"}.`,
          time: "A l'instant",
          type: "agency",
        },
        ...data.activities,
      ],
    };

    const agency = data.agencies.find((a) => a.name === target.agencyName);
    if (agency) {
      syncAgencyUser(agency.email, nextStatus === "active" ? "active" : "suspended");
    }

    persist(nextData);
  };

  const selectedSubscription = useMemo(
    () =>
      data.subscriptions.find(
        (subscription) => subscription.id === selectedSubscriptionId,
      ) ??
      data.subscriptions[0] ??
      null,
    [data.subscriptions, selectedSubscriptionId],
  );

  const filteredPayments = useMemo(
    () =>
      [...data.payments]
        .sort(
          (first, second) =>
            new Date(second.paidAt).getTime() - new Date(first.paidAt).getTime(),
        )
        .filter(
          (payment) =>
            paymentFilter === "all" || payment.status === paymentFilter,
        ),
    [data.payments, paymentFilter],
  );

  const paymentsTotalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = useMemo(() => {
    const startIndex = (paymentsPage - 1) * itemsPerPage;
    return filteredPayments.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPayments, paymentsPage, itemsPerPage]);

  const recentPayments = filteredPayments.slice(0, 4);

  const summary = useMemo(() => {
    const paidRevenue = data.payments
      .filter((payment) => payment.status === "paid")
      .reduce((total, payment) => total + payment.amount, 0);
    const monthlyRecurringRevenue = data.subscriptions
      .filter((subscription) => subscription.status === "active")
      .reduce((total, subscription) => total + subscription.monthlyPrice, 0);

    return {
      activeSubscriptions: data.subscriptions.filter(
        (subscription) => subscription.status === "active",
      ).length,
      trialSubscriptions: data.subscriptions.filter(
        (subscription) => subscription.status === "trial",
      ).length,
      monthlyRecurringRevenue,
      paidRevenue,
    };
  }, [data.payments, data.subscriptions]);

  return (
    <SuperAdminLayout
      title="Abonnements et paiements"
      subtitle="Suivez les plans SaaS, paiements et historiques de facturation des agences."
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Abonnements actifs
          </p>
          <p className="mt-3 text-3xl font-bold text-emerald-600">
            {numberFormatter.format(summary.activeSubscriptions)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Essais en cours
          </p>
          <p className="mt-3 text-3xl font-bold text-sky-600">
            {numberFormatter.format(summary.trialSubscriptions)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">MRR estimé</p>
          <p className="mt-3 text-3xl font-bold text-slate-950">
            {currencyFormatter.format(summary.monthlyRecurringRevenue)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Paiements encaissés
          </p>
          <p className="mt-3 text-3xl font-bold text-indigo-600">
            {currencyFormatter.format(summary.paidRevenue)}
          </p>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_0.9fr]">
        <div className="grid gap-6">
          <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5">
              <h2 className="text-lg font-bold text-slate-950">
                Abonnements
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Plans actifs, essais et agences suspendées.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-bold">Agence</th>
                    <th className="px-5 py-3 font-bold">Plan</th>
                    <th className="px-5 py-3 font-bold">Statut</th>
                    <th className="px-5 py-3 font-bold">Prix mensuel</th>
                    <th className="px-5 py-3 font-bold">Prochaine facture</th>
                    <th className="px-5 py-3 font-bold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.subscriptions.map((subscription: Subscription) => (
                    <tr key={subscription.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4 font-bold text-slate-950">
                        {subscription.agencyName}
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                        {subscription.plan}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${subscriptionClasses(
                            subscription.status,
                          )}`}
                        >
                          {subscriptionLabel(subscription.status)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {currencyFormatter.format(subscription.monthlyPrice)}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {formatDate(subscription.nextBillingAt)}
                      </td>
<td className="px-5 py-4">
                         <div className="flex gap-2">
                           <button
                             onClick={() =>
                               setSelectedSubscriptionId(subscription.id)
                             }
                             className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-700"
                           >
                             Détails
                           </button>
                           <button
                             onClick={() => toggleSubscriptionStatus(subscription.id)}
                             className={`rounded-lg px-3 py-2 text-xs font-bold text-white transition ${
                               subscription.status === "active" 
                                 ? "bg-rose-600 hover:bg-rose-700" 
                                 : "bg-emerald-600 hover:bg-emerald-700"
                             }`}
                           >
                             {subscription.status === "active" ? "Suspendre" : "Activer"}
                           </button>
                         </div>
                       </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-950">
                  Historique des paiements
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Tous les paiements, réussis ou en attente.
                </p>
              </div>
              <select
                value={paymentFilter}
                onChange={(event) => {
                  setPaymentFilter(event.target.value as "all" | PaymentStatus);
                  setPaymentsPage(1);
                }}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              >
                <option value="all">Tous les paiements</option>
                <option value="paid">Payés</option>
                <option value="pending">En attente</option>
                <option value="failed">Échoués</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-bold">Référence</th>
                    <th className="px-5 py-3 font-bold">Agence</th>
                    <th className="px-5 py-3 font-bold">Montant</th>
                    <th className="px-5 py-3 font-bold">Méthode</th>
                    <th className="px-5 py-3 font-bold">Statut</th>
                    <th className="px-5 py-3 font-bold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedPayments.map((payment: Payment) => (
                    <tr key={payment.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4 font-bold text-slate-950">
                        {payment.reference}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {payment.agencyName}
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
                </tbody>
              </table>

              {filteredPayments.length === 0 ? (
                <div className="p-8 text-center text-sm font-semibold text-slate-500">
                  Aucun paiement ne correspond aux filtres.
                </div>
              ) : null}
            </div>
            
            <Pagination
              currentPage={paymentsPage}
              totalPages={paymentsTotalPages}
              onPageChange={setPaymentsPage}
            />
          </div>
        </div>

        <div className="grid gap-6">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">
              Paiements récents
            </h2>
            <div className="mt-4 space-y-3">
              {recentPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-slate-950">
                        {payment.agencyName}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {payment.reference} • {payment.method}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-bold ring-1 ${paymentClasses(
                        payment.status,
                      )}`}
                    >
                      {paymentLabel(payment.status)}
                    </span>
                  </div>
                  <p className="mt-3 text-lg font-bold text-slate-950">
                    {currencyFormatter.format(payment.amount)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">
              Détail abonnement
            </h2>

            {selectedSubscription ? (
              <div className="mt-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xl font-bold text-slate-950">
                      {selectedSubscription.agencyName}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Plan {selectedSubscription.plan}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${subscriptionClasses(
                      selectedSubscription.status,
                    )}`}
                  >
                    {subscriptionLabel(selectedSubscription.status)}
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Prix mensuel
                    </p>
                    <p className="mt-1 font-bold text-slate-950">
                      {currencyFormatter.format(
                        selectedSubscription.monthlyPrice,
                      )}
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Date de début
                    </p>
                    <p className="mt-1 font-bold text-slate-950">
                      {formatDate(selectedSubscription.startedAt)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Prochaine facturation
                    </p>
                    <p className="mt-1 font-bold text-slate-950">
                      {formatDate(selectedSubscription.nextBillingAt)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-500">
                Sélectionnez un abonnement pour afficher ses détails.
              </p>
            )}
          </section>
        </div>
      </section>
    </SuperAdminLayout>
  );
}

export default Abonnements;