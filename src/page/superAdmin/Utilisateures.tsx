import { useMemo, useState } from "react";
import SuperAdminLayout from "../../components/common/layout/SuperAdminLayout";
import {
  getSuperAdminData,
  type PlatformUser,
  type PlatformUserType,
} from "../../service/ofline/superAdminStorage";

const numberFormatter = new Intl.NumberFormat("fr-FR");

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function typeLabel(type: PlatformUserType) {
  return type === "agence" ? "Agence" : "Locataire";
}

function typeClasses(type: PlatformUserType) {
  return type === "agence"
    ? "bg-indigo-50 text-indigo-700 ring-indigo-200"
    : "bg-sky-50 text-sky-700 ring-sky-200";
}

function statusClasses(status: PlatformUser["status"]) {
  return status === "active"
    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
    : "bg-rose-50 text-rose-700 ring-rose-200";
}

function getInitials(fullName: string) {
  return fullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function Utilisateures() {
  const [data] = useState(() => getSuperAdminData());
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | PlatformUserType>(
    "all",
  );
  const [selectedUserId, setSelectedUserId] = useState<number | null>(
    data.users[0]?.id ?? null,
  );

  const users = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return [...data.users]
      .sort(
        (first, second) =>
          new Date(second.joinedAt).getTime() -
          new Date(first.joinedAt).getTime(),
      )
      .filter((user) => {
        const matchesType = typeFilter === "all" || user.type === typeFilter;
        const matchesSearch =
          normalizedSearch.length === 0 ||
          user.fullName.toLowerCase().includes(normalizedSearch) ||
          user.email.toLowerCase().includes(normalizedSearch) ||
          user.agencyName.toLowerCase().includes(normalizedSearch);

        return matchesType && matchesSearch;
      });
  }, [data.users, search, typeFilter]);

  const selectedUser = useMemo(
    () =>
      data.users.find((user) => user.id === selectedUserId) ??
      data.users[0] ??
      null,
    [data.users, selectedUserId],
  );

  const summary = useMemo(
    () => ({
      total: data.users.length,
      agency: data.users.filter((user) => user.type === "agence").length,
      tenant: data.users.filter((user) => user.type === "locataire").length,
    }),
    [data.users],
  );

  return (
    <SuperAdminLayout
      title="Utilisateurs"
      subtitle="Consultez tous les utilisateurs de la plateforme et filtrez par agence ou locataire."
    >
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Tous les utilisateurs
          </p>
          <p className="mt-3 text-3xl font-bold text-slate-950">
            {numberFormatter.format(summary.total)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Comptes agence
          </p>
          <p className="mt-3 text-3xl font-bold text-indigo-600">
            {numberFormatter.format(summary.agency)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Locataires</p>
          <p className="mt-3 text-3xl font-bold text-sky-600">
            {numberFormatter.format(summary.tenant)}
          </p>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_0.9fr]">
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-950">
                  Tous les utilisateurs
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Profils agences et locataires inscrits sur KerManager.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Rechercher un utilisateur"
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 sm:w-72"
                />
                <select
                  value={typeFilter}
                  onChange={(event) =>
                    setTypeFilter(event.target.value as "all" | PlatformUserType)
                  }
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                >
                  <option value="all">Tous les types</option>
                  <option value="agence">Agence</option>
                  <option value="locataire">Locataire</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-bold">Utilisateur</th>
                  <th className="px-5 py-3 font-bold">Type</th>
                  <th className="px-5 py-3 font-bold">Agence liee</th>
                  <th className="px-5 py-3 font-bold">Statut</th>
                  <th className="px-5 py-3 font-bold">Inscription</th>
                  <th className="px-5 py-3 font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-sm font-bold text-white">
                          {getInitials(user.fullName)}
                        </div>
                        <div>
                          <button
                            onClick={() => setSelectedUserId(user.id)}
                            className="text-left font-bold text-slate-950 transition hover:text-indigo-700"
                          >
                            {user.fullName}
                          </button>
                          <p className="text-sm text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${typeClasses(
                          user.type,
                        )}`}
                      >
                        {typeLabel(user.type)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                      {user.agencyName}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${statusClasses(
                          user.status,
                        )}`}
                      >
                        {user.status === "active" ? "Actif" : "Suspendu"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {formatDate(user.joinedAt)}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => setSelectedUserId(user.id)}
                        className="rounded-lg bg-slate-950 px-3 py-2 text-xs font-bold text-white transition hover:bg-indigo-700"
                      >
                        Voir profil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {users.length === 0 ? (
              <div className="p-8 text-center text-sm font-semibold text-slate-500">
                Aucun utilisateur ne correspond a votre recherche.
              </div>
            ) : null}
          </div>
        </div>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Profil</h2>

          {selectedUser ? (
            <div className="mt-5">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-indigo-600 text-xl font-bold text-white shadow-lg shadow-indigo-600/20">
                  {getInitials(selectedUser.fullName)}
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-950">
                    {selectedUser.fullName}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {selectedUser.email}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${typeClasses(
                    selectedUser.type,
                  )}`}
                >
                  {typeLabel(selectedUser.type)}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${statusClasses(
                    selectedUser.status,
                  )}`}
                >
                  {selectedUser.status === "active" ? "Actif" : "Suspendu"}
                </span>
              </div>

              <div className="mt-6 space-y-3">
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Telephone
                  </p>
                  <p className="mt-1 font-semibold text-slate-950">
                    {selectedUser.phone}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Agence
                  </p>
                  <p className="mt-1 font-semibold text-slate-950">
                    {selectedUser.agencyName}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Date d'inscription
                  </p>
                  <p className="mt-1 font-semibold text-slate-950">
                    {formatDate(selectedUser.joinedAt)}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Derniere activite
                  </p>
                  <p className="mt-1 font-semibold text-slate-950">
                    {selectedUser.lastActivity}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">
              Selectionnez un utilisateur pour afficher son profil.
            </p>
          )}
        </section>
      </section>
    </SuperAdminLayout>
  );
}

export default Utilisateures;
