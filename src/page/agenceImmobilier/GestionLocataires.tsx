import { useMemo, useState } from "react";
import AgencyLayout from "../../components/common/layout/AgencyLayout";
import {
  getAgencyDashboardData,
  saveAgencyDashboardData,
  type AgencyDashboardData,
  type AgencyTenant,
} from "../../service/ofline/agencyStorage";

type TenantTab = "all" | "add" | "history";

type TenantForm = {
  fullName: string;
  email: string;
  phone: string;
  propertyName: string;
};

const emptyForm: TenantForm = {
  fullName: "",
  email: "",
  phone: "",
  propertyName: "",
};

const tabs: Array<{ id: TenantTab; label: string }> = [
  { id: "all", label: "Tous les locataires" },
  { id: "add", label: "Ajouter locataire" },
  { id: "history", label: "Historique" },
];

const numberFormatter = new Intl.NumberFormat("fr-FR");
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

function statusClasses(active: boolean) {
  return active
    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
    : "bg-slate-100 text-slate-700 ring-slate-200";
}

function GestionLocataires() {
  const [data, setData] = useState<AgencyDashboardData>(() =>
    getAgencyDashboardData(),
  );
  const [activeTab, setActiveTab] = useState<TenantTab>("all");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<TenantForm>(emptyForm);

  const tenants = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return data.tenants.filter(
      (tenant) =>
        normalizedSearch.length === 0 ||
        tenant.fullName.toLowerCase().includes(normalizedSearch) ||
        tenant.email.toLowerCase().includes(normalizedSearch) ||
        tenant.propertyName.toLowerCase().includes(normalizedSearch),
    );
  }, [data.tenants, search]);

  const history = useMemo(() => {
    const paymentHistory = data.payments.map((payment) => ({
      id: `payment-${payment.id}`,
      tenantName: payment.tenantName,
      label: "Paiement loyer",
      detail: `${currencyFormatter.format(payment.amount)} - ${payment.propertyName}`,
      date: payment.date,
      status:
        payment.status === "paid"
          ? "Payé"
          : payment.status === "late"
            ? "Retard"
            : "En attente",
    }));

    const disputeHistory = data.disputes.map((dispute) => ({
      id: `dispute-${dispute.id}`,
      tenantName: dispute.tenantName,
      label: "Litige",
      detail: dispute.subject,
      date: dispute.date,
      status: dispute.status === "ongoing" ? "En cours" : "Résolu",
    }));

    const contractHistory = data.tenants.map((tenant) => ({
      id: `tenant-${tenant.id}`,
      tenantName: tenant.fullName,
      label: "Contrat",
      detail: tenant.propertyName,
      date: tenant.joinedAt,
      status: tenant.contractStatus === "active" ? "Actif" : "Terminé",
    }));

    return [...paymentHistory, ...disputeHistory, ...contractHistory].sort(
      (first, second) =>
        new Date(second.date).getTime() - new Date(first.date).getTime(),
    );
  }, [data.disputes, data.payments, data.tenants]);

  const summary = useMemo(
    () => ({
      total: data.tenants.length,
      active: data.tenants.filter((tenant) => tenant.active).length,
      ended: data.tenants.filter((tenant) => !tenant.active).length,
      availableProperties: data.properties.filter(
        (property) => property.status === "available",
      ).length,
    }),
    [data.properties, data.tenants],
  );

  function persist(nextData: AgencyDashboardData) {
    setData(nextData);
    saveAgencyDashboardData(nextData);
  }

  function addTenant(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !form.fullName.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.propertyName
    ) {
      return;
    }

    const nextTenant: AgencyTenant = {
      id: Date.now(),
      fullName: form.fullName.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      propertyName: form.propertyName,
      active: true,
      joinedAt: new Date().toISOString().slice(0, 10),
      contractStatus: "active",
    };

    const nextData: AgencyDashboardData = {
      ...data,
      tenants: [nextTenant, ...data.tenants],
      properties: data.properties.map((property) =>
        property.name === form.propertyName
          ? { ...property, status: "occupied" }
          : property,
      ),
      activities: [
        {
          id: Date.now() + 1,
          title: "Nouveau locataire ajouté",
          description: `${nextTenant.fullName} a été ajouté sur ${nextTenant.propertyName}.`,
          time: "A l'instant",
          type: "tenant",
        },
        ...data.activities,
      ],
    };

    persist(nextData);
    setForm(emptyForm);
    setActiveTab("all");
  }

  function toggleTenant(tenantId: number) {
    const nextData: AgencyDashboardData = {
      ...data,
      tenants: data.tenants.map((tenant) =>
        tenant.id === tenantId
          ? {
              ...tenant,
              active: !tenant.active,
              contractStatus: tenant.active ? "ended" : "active",
            }
          : tenant,
      ),
    };

    persist(nextData);
  }

  return (
    <AgencyLayout agencyName={data.agency.name}>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Locataires</p>
          <p className="mt-3 text-3xl font-bold text-slate-950">
            {numberFormatter.format(summary.total)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Actifs</p>
          <p className="mt-3 text-3xl font-bold text-emerald-600">
            {numberFormatter.format(summary.active)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Inactifs</p>
          <p className="mt-3 text-3xl font-bold text-slate-700">
            {numberFormatter.format(summary.ended)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Biens disponibles
          </p>
          <p className="mt-3 text-3xl font-bold text-indigo-600">
            {numberFormatter.format(summary.availableProperties)}
          </p>
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950">Locataires</h2>
              <p className="mt-1 text-sm text-slate-500">
                Gérez les profils locataires, les contrats et leur historique.
              </p>
            </div>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher un locataire"
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

        {activeTab === "add" ? (
          <form onSubmit={addTenant} className="grid gap-5 p-5 lg:grid-cols-2">
            <div>
              <label className="block text-sm font-bold text-slate-700">
                Nom complet
              </label>
              <input
                value={form.fullName}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    fullName: event.target.value,
                  }))
                }
                placeholder="Mamadou Fall"
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm((current) => ({ ...current, email: event.target.value }))
                }
                placeholder="locataire@email.sn"
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700">
                Téléphone
              </label>
              <input
                value={form.phone}
                onChange={(event) =>
                  setForm((current) => ({ ...current, phone: event.target.value }))
                }
                placeholder="+221 77 000 00 00"
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700">
                Bien associé
              </label>
              <select
                value={form.propertyName}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    propertyName: event.target.value,
                  }))
                }
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              >
                <option value="">Sélectionner un bien</option>
                {data.properties.map((property) => (
                  <option key={property.id} value={property.name}>
                    {property.name} - {property.address}
                  </option>
                ))}
              </select>
            </div>
            <div className="lg:col-span-2">
              <button
                type="submit"
                className="rounded-lg bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
              >
                Ajouter le locataire
              </button>
            </div>
          </form>
        ) : activeTab === "history" ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-bold">Locataire</th>
                  <th className="px-5 py-3 font-bold">Événement</th>
                  <th className="px-5 py-3 font-bold">Détail</th>
                  <th className="px-5 py-3 font-bold">Date</th>
                  <th className="px-5 py-3 font-bold">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-bold text-slate-950">
                      {item.tenantName}
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                      {item.label}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {item.detail}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {formatDate(item.date)}
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-slate-950">
                      {item.status}
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
                  <th className="px-5 py-3 font-bold">Contact</th>
                  <th className="px-5 py-3 font-bold">Bien</th>
                  <th className="px-5 py-3 font-bold">Entrée</th>
                  <th className="px-5 py-3 font-bold">Statut</th>
                  <th className="px-5 py-3 font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tenants.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-bold text-slate-950">
                      {tenant.fullName}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      <p>{tenant.email}</p>
                      <p className="mt-1">{tenant.phone}</p>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                      {tenant.propertyName}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {formatDate(tenant.joinedAt)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${statusClasses(
                          tenant.active,
                        )}`}
                      >
                        {tenant.active ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => toggleTenant(tenant.id)}
                        className="rounded-lg bg-slate-950 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-700"
                      >
                        {tenant.active ? "Clôturer contrat" : "Réactiver"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {tenants.length === 0 ? (
              <div className="p-8 text-center text-sm font-semibold text-slate-500">
                Aucun locataire ne correspond à votre recherche.
              </div>
            ) : null}
          </div>
        )}
      </section>
    </AgencyLayout>
  );
}

export default GestionLocataires;
