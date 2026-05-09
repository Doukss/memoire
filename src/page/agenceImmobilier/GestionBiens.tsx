import { useMemo, useState } from "react";
import AgencyLayout from "../../components/common/layout/AgencyLayout";
import {
  getAgencyDashboardData,
  saveAgencyDashboardData,
  type AgencyDashboardData,
  type AgencyProperty,
} from "../../service/ofline/agencyStorage";

type PropertyFilter = "all" | "add" | "available" | "occupied";

type PropertyForm = {
  name: string;
  address: string;
  monthlyRent: string;
  status: AgencyProperty["status"];
};

const emptyForm: PropertyForm = {
  name: "",
  address: "",
  monthlyRent: "",
  status: "available",
};

const currencyFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "XOF",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("fr-FR");

const tabs: Array<{ id: PropertyFilter; label: string }> = [
  { id: "all", label: "Tous les biens" },
  { id: "add", label: "Ajouter un bien" },
  { id: "available", label: "Biens disponibles" },
  { id: "occupied", label: "Biens occupés" },
];

function statusLabel(status: AgencyProperty["status"]) {
  return status === "occupied" ? "Occupé" : "Disponible";
}

function statusClasses(status: AgencyProperty["status"]) {
  return status === "occupied"
    ? "bg-indigo-50 text-indigo-700 ring-indigo-200"
    : "bg-emerald-50 text-emerald-700 ring-emerald-200";
}

function GestionBiens() {
  const [data, setData] = useState<AgencyDashboardData>(() =>
    getAgencyDashboardData(),
  );
  const [activeTab, setActiveTab] = useState<PropertyFilter>("all");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<PropertyForm>(emptyForm);

  const properties = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return data.properties.filter((property) => {
      const matchesTab =
        activeTab === "all" ||
        activeTab === "add" ||
        property.status === activeTab;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        property.name.toLowerCase().includes(normalizedSearch) ||
        property.address.toLowerCase().includes(normalizedSearch);

      return matchesTab && matchesSearch;
    });
  }, [activeTab, data.properties, search]);

  const summary = useMemo(
    () => ({
      total: data.properties.length,
      occupied: data.properties.filter((property) => property.status === "occupied")
        .length,
      available: data.properties.filter(
        (property) => property.status === "available",
      ).length,
      rentPotential: data.properties.reduce(
        (total, property) => total + property.monthlyRent,
        0,
      ),
    }),
    [data.properties],
  );

  function persist(nextData: AgencyDashboardData) {
    setData(nextData);
    saveAgencyDashboardData(nextData);
  }

  function addProperty(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const monthlyRent = Number(form.monthlyRent);

    if (!form.name.trim() || !form.address.trim() || Number.isNaN(monthlyRent)) {
      return;
    }

    const nextProperty: AgencyProperty = {
      id: Date.now(),
      name: form.name.trim(),
      address: form.address.trim(),
      monthlyRent,
      status: form.status,
    };

    const nextData: AgencyDashboardData = {
      ...data,
      properties: [nextProperty, ...data.properties],
      activities: [
        {
          id: Date.now() + 1,
          title: "Nouveau bien ajouté",
          description: `${nextProperty.name} a été ajouté au portefeuille.`,
          time: "A l'instant",
          type: "contract",
        },
        ...data.activities,
      ],
    };

    persist(nextData);
    setForm(emptyForm);
    setActiveTab("all");
  }

  function togglePropertyStatus(propertyId: number) {
    const nextData: AgencyDashboardData = {
      ...data,
      properties: data.properties.map((property) =>
        property.id === propertyId
          ? {
              ...property,
              status: property.status === "occupied" ? "available" : "occupied",
            }
          : property,
      ),
    };

    persist(nextData);
  }

  return (
    <AgencyLayout agencyName={data.agency.name}>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Total biens</p>
          <p className="mt-3 text-3xl font-bold text-slate-950">
            {numberFormatter.format(summary.total)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Occupés</p>
          <p className="mt-3 text-3xl font-bold text-indigo-600">
            {numberFormatter.format(summary.occupied)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Disponibles</p>
          <p className="mt-3 text-3xl font-bold text-emerald-600">
            {numberFormatter.format(summary.available)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Potentiel loyer
          </p>
          <p className="mt-3 text-3xl font-bold text-slate-950">
            {currencyFormatter.format(summary.rentPotential)}
          </p>
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950">
                Gestion des Biens
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Consultez, ajoutez et suivez l'occupation de vos propriétés.
              </p>
            </div>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher un bien"
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
          <form onSubmit={addProperty} className="grid gap-5 p-5 lg:grid-cols-2">
            <div>
              <label
                htmlFor="propertyName"
                className="block text-sm font-bold text-slate-700"
              >
                Nom du bien
              </label>
              <input
                id="propertyName"
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
                placeholder="Appartement A12"
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>
            <div>
              <label
                htmlFor="propertyAddress"
                className="block text-sm font-bold text-slate-700"
              >
                Adresse
              </label>
              <input
                id="propertyAddress"
                value={form.address}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    address: event.target.value,
                  }))
                }
                placeholder="Dakar Plateau"
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>
            <div>
              <label
                htmlFor="monthlyRent"
                className="block text-sm font-bold text-slate-700"
              >
                Loyer mensuel
              </label>
              <input
                id="monthlyRent"
                type="number"
                value={form.monthlyRent}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    monthlyRent: event.target.value,
                  }))
                }
                placeholder="450000"
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>
            <div>
              <label
                htmlFor="propertyStatus"
                className="block text-sm font-bold text-slate-700"
              >
                Statut
              </label>
              <select
                id="propertyStatus"
                value={form.status}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    status: event.target.value as AgencyProperty["status"],
                  }))
                }
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              >
                <option value="available">Disponible</option>
                <option value="occupied">Occupé</option>
              </select>
            </div>
            <div className="lg:col-span-2">
              <button
                type="submit"
                className="rounded-lg bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
              >
                Ajouter le bien
              </button>
            </div>
          </form>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-bold">Bien</th>
                  <th className="px-5 py-3 font-bold">Adresse</th>
                  <th className="px-5 py-3 font-bold">Loyer</th>
                  <th className="px-5 py-3 font-bold">Statut</th>
                  <th className="px-5 py-3 font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {properties.map((property) => (
                  <tr key={property.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-bold text-slate-950">
                      {property.name}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {property.address}
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-slate-950">
                      {currencyFormatter.format(property.monthlyRent)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${statusClasses(
                          property.status,
                        )}`}
                      >
                        {statusLabel(property.status)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => togglePropertyStatus(property.id)}
                        className="rounded-lg bg-slate-950 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-700"
                      >
                        {property.status === "occupied"
                          ? "Rendre disponible"
                          : "Marquer occupé"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {properties.length === 0 ? (
              <div className="p-8 text-center text-sm font-semibold text-slate-500">
                Aucun bien ne correspond à cette vue.
              </div>
            ) : null}
          </div>
        )}
      </section>
    </AgencyLayout>
  );
}

export default GestionBiens;
