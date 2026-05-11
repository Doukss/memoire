import { useMemo, useState } from "react";
import SuperAdminLayout from "../../components/common/layout/SuperAdminLayout";
import {
  getSuperAdminData,
  saveSuperAdminData,
  type Agency,
  type SuperAdminData,
} from "../../service/ofline/superAdminStorage";

function syncAgencyUser(agency: Agency) {
  const users = JSON.parse(localStorage.getItem("kermanager.users") || "[]");
  const existingUserIndex = users.findIndex((u: { email: string }) => u.email === agency.email);
  
  const agencyUser = {
    id: existingUserIndex >= 0 ? users[existingUserIndex].id : Date.now().toString(),
    email: agency.email,
    name: agency.name,
    role: "agency",
    password: existingUserIndex >= 0 ? users[existingUserIndex].password : "Agence2024!",
  };
  
  if (existingUserIndex >= 0) {
    users[existingUserIndex] = agencyUser;
  } else {
    users.push(agencyUser);
  }
  
  localStorage.setItem("kermanager.users", JSON.stringify(users));
}

type AgencyForm = {
  name: string;
  email: string;
};

const emptyForm: AgencyForm = {
  name: "",
  email: "",
};

const numberFormatter = new Intl.NumberFormat("fr-FR");

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function getAgencyMetrics(agency: Agency) {
  return {
    properties: 24 + agency.id * 7,
    tenants: 58 + agency.id * 13,
    disputes: agency.status === "suspended" ? 5 : agency.id % 4,
    revenue: 15000 + agency.id * 6500,
  };
}

function statusLabel(status: Agency["status"]) {
  return status === "active" ? "Actif" : "Suspendu";
}

function statusClasses(status: Agency["status"]) {
  return status === "active"
    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
    : "bg-rose-50 text-rose-700 ring-rose-200";
}

function GestionDesAgences() {
  const [data, setData] = useState<SuperAdminData>(() => getSuperAdminData());
  const [form, setForm] = useState<AgencyForm>(emptyForm);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Agency["status"]>(
    "all",
  );
  const [selectedAgencyId, setSelectedAgencyId] = useState<number | null>(
    data.agencies[0]?.id ?? null,
  );

  const agencies = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return [...data.agencies]
      .sort(
        (first, second) =>
          new Date(second.registeredAt).getTime() -
          new Date(first.registeredAt).getTime(),
      )
      .filter((agency) => {
        const matchesStatus =
          statusFilter === "all" || agency.status === statusFilter;
        const matchesSearch =
          normalizedSearch.length === 0 ||
          agency.name.toLowerCase().includes(normalizedSearch) ||
          agency.email.toLowerCase().includes(normalizedSearch);

        return matchesStatus && matchesSearch;
      });
  }, [data.agencies, search, statusFilter]);

  const selectedAgency = useMemo(
    () =>
      data.agencies.find((agency) => agency.id === selectedAgencyId) ??
      data.agencies[0] ??
      null,
    [data.agencies, selectedAgencyId],
  );

  const summary = useMemo(
    () => ({
      total: data.agencies.length,
      active: data.agencies.filter((agency) => agency.status === "active")
        .length,
      suspended: data.agencies.filter(
        (agency) => agency.status === "suspended",
      ).length,
    }),
    [data.agencies],
  );

  function persist(nextData: SuperAdminData) {
    setData(nextData);
    saveSuperAdminData(nextData);
  }

  function addAgency(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();

    if (!name || !email) {
      return;
    }

    const nextAgency: Agency = {
      id: Date.now(),
      name,
      email,
      status: "active",
      registeredAt: new Date().toISOString().slice(0, 10),
    };

    const nextData: SuperAdminData = {
      ...data,
      agencies: [nextAgency, ...data.agencies],
      activities: [
        {
          id: Date.now() + 1,
          title: "Nouvelle agence creee",
          description: `${name} a ete ajoutee par le Super Admin.`,
          time: "A l'instant",
          type: "agency",
        },
        ...data.activities,
      ],
    };

    syncAgencyUser(nextAgency);
    persist(nextData);
    setForm(emptyForm);
    setSelectedAgencyId(nextAgency.id);
  }

  function toggleAgencyStatus(agencyId: number) {
    const target = data.agencies.find((agency) => agency.id === agencyId);

    if (!target) {
      return;
    }

    const nextStatus: Agency["status"] =
      target.status === "active" ? "suspended" : "active";

    const nextData: SuperAdminData = {
      ...data,
      agencies: data.agencies.map((agency) =>
        agency.id === agencyId ? { ...agency, status: nextStatus } : agency,
      ),
      activities: [
        {
          id: Date.now(),
          title:
            nextStatus === "active" ? "Agence activee" : "Agence suspendue",
          description: `${target.name} est maintenant ${statusLabel(
            nextStatus,
          ).toLowerCase()}.`,
          time: "A l'instant",
          type: "agency",
        },
        ...data.activities,
      ],
    };

    syncAgencyUser({ ...target, status: nextStatus });
    persist(nextData);
    
    // Notifier les autres onglets/instances de la mise à jour
    window.dispatchEvent(new CustomEvent("agencyStatusChanged", { detail: { email: target.email, status: nextStatus } }));
  }

  return (
    <SuperAdminLayout
      title="Gestion des agences"
      subtitle="Ajoutez, consultez, activez ou suspendez les agences de la plateforme."
    >
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Agences</p>
          <p className="mt-3 text-3xl font-bold text-slate-950">
            {numberFormatter.format(summary.total)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Actives</p>
          <p className="mt-3 text-3xl font-bold text-emerald-600">
            {numberFormatter.format(summary.active)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Suspendues</p>
          <p className="mt-3 text-3xl font-bold text-rose-600">
            {numberFormatter.format(summary.suspended)}
          </p>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_0.9fr]">
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-950">
                  Liste des agences
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Toutes les agences inscrites sur KerManager.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Rechercher une agence"
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 sm:w-64"
                />
                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(
                      event.target.value as "all" | Agency["status"],
                    )
                  }
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="active">Actif</option>
                  <option value="suspended">Suspendu</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-bold">Nom</th>
                  <th className="px-5 py-3 font-bold">Email</th>
                  <th className="px-5 py-3 font-bold">Statut</th>
                  <th className="px-5 py-3 font-bold">Date d'inscription</th>
                  <th className="px-5 py-3 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {agencies.map((agency) => (
                  <tr key={agency.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <button
                        onClick={() => setSelectedAgencyId(agency.id)}
                        className="text-left font-bold text-slate-950 transition hover:text-indigo-700"
                      >
                        {agency.name}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {agency.email}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${statusClasses(
                          agency.status,
                        )}`}
                      >
                        {statusLabel(agency.status)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {formatDate(agency.registeredAt)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedAgencyId(agency.id)}
                          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-700"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => toggleAgencyStatus(agency.id)}
                          className="rounded-lg bg-slate-950 px-3 py-2 text-xs font-bold text-white transition hover:bg-indigo-700"
                        >
                          {agency.status === "active" ? "Suspendre" : "Activer"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {agencies.length === 0 ? (
              <div className="p-8 text-center text-sm font-semibold text-slate-500">
                Aucune agence ne correspond a votre recherche.
              </div>
            ) : null}
          </div>
        </div>

        <div className="grid gap-6">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">
              Ajouter une agence
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              L'agence sera active par defaut.
            </p>

            <form onSubmit={addAgency} className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="agencyName"
                  className="block text-sm font-bold text-slate-700"
                >
                  Nom de l'agence
                </label>
                <input
                  id="agencyName"
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Agence Dakar Prestige"
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label
                  htmlFor="agencyEmail"
                  className="block text-sm font-bold text-slate-700"
                >
                  Email
                </label>
                <input
                  id="agencyEmail"
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  placeholder="contact@agence.sn"
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
              >
                Ajouter l'agence
              </button>
            </form>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">
              Details d'une agence
            </h2>

            {selectedAgency ? (
              <div className="mt-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xl font-bold text-slate-950">
                      {selectedAgency.name}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {selectedAgency.email}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${statusClasses(
                      selectedAgency.status,
                    )}`}
                  >
                    {statusLabel(selectedAgency.status)}
                  </span>
                </div>

                <div className="mt-5 rounded-lg bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-500">
                    Date d'inscription
                  </p>
                  <p className="mt-1 font-bold text-slate-950">
                    {formatDate(selectedAgency.registeredAt)}
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  {Object.entries(getAgencyMetrics(selectedAgency)).map(
                    ([label, value]) => (
                      <div
                        key={label}
                        className="rounded-lg border border-slate-200 p-4"
                      >
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                          {label}
                        </p>
                        <p className="mt-2 text-xl font-bold text-slate-950">
                          {numberFormatter.format(value)}
                        </p>
                      </div>
                    ),
                  )}
                </div>

                <button
                  onClick={() => toggleAgencyStatus(selectedAgency.id)}
                  className="mt-5 w-full rounded-lg bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
                >
                  {selectedAgency.status === "active"
                    ? "Suspendre cette agence"
                    : "Activer cette agence"}
                </button>
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-500">
                Selectionnez une agence pour afficher ses details.
              </p>
            )}
          </section>
        </div>
      </section>
    </SuperAdminLayout>
  );
}

export default GestionDesAgences;
