import { useMemo, useState } from "react";
import SuperAdminLayout from "../../components/common/layout/SuperAdminLayout";
import Pagination from "../../components/common/ui/Pagination";
import {
  getSuperAdminData,
  type Dispute,
  type DisputePriority,
  type DisputeStatus,
} from "../../service/ofline/superAdminStorage";

const numberFormatter = new Intl.NumberFormat("fr-FR");

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function statusLabel(status: DisputeStatus) {
  return status === "ongoing" ? "En cours" : "Résolu";
}

function priorityLabel(priority: DisputePriority) {
  const labels: Record<DisputePriority, string> = {
    low: "Faible",
    medium: "Moyenne",
    high: "Haute",
  };

  return labels[priority];
}

function statusClasses(status: DisputeStatus) {
  return status === "ongoing"
    ? "bg-amber-50 text-amber-700 ring-amber-200"
    : "bg-emerald-50 text-emerald-700 ring-emerald-200";
}

function priorityClasses(priority: DisputePriority) {
  const classes: Record<DisputePriority, string> = {
    low: "bg-slate-100 text-slate-700 ring-slate-200",
    medium: "bg-sky-50 text-sky-700 ring-sky-200",
    high: "bg-rose-50 text-rose-700 ring-rose-200",
  };

  return classes[priority];
}

function Litiges() {
  const [data] = useState(() => getSuperAdminData());
  const [agencyFilter, setAgencyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | DisputeStatus>(
    "all",
  );
  const [search, setSearch] = useState("");
  const [selectedDisputeId, setSelectedDisputeId] = useState<number | null>(
    data.disputes[0]?.id ?? null,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const agencies = useMemo(
    () => [...new Set(data.disputes.map((dispute) => dispute.agencyName))],
    [data.disputes],
  );

  const disputes = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return [...data.disputes]
      .sort(
        (first, second) =>
          new Date(second.updatedAt).getTime() -
          new Date(first.updatedAt).getTime(),
      )
      .filter((dispute) => {
        const matchesAgency =
          agencyFilter === "all" || dispute.agencyName === agencyFilter;
        const matchesStatus =
          statusFilter === "all" || dispute.status === statusFilter;
        const matchesSearch =
          normalizedSearch.length === 0 ||
          dispute.reference.toLowerCase().includes(normalizedSearch) ||
          dispute.title.toLowerCase().includes(normalizedSearch) ||
          dispute.tenantName.toLowerCase().includes(normalizedSearch) ||
          dispute.property.toLowerCase().includes(normalizedSearch);

        return matchesAgency && matchesStatus && matchesSearch;
      });
  }, [agencyFilter, data.disputes, search, statusFilter]);

  const totalPages = Math.ceil(disputes.length / itemsPerPage);
  const paginatedDisputes = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return disputes.slice(startIndex, startIndex + itemsPerPage);
  }, [disputes, currentPage, itemsPerPage]);

  const selectedDispute = useMemo(
    () =>
      data.disputes.find((dispute) => dispute.id === selectedDisputeId) ??
      data.disputes[0] ??
      null,
    [data.disputes, selectedDisputeId],
  );

  const summary = useMemo(
    () => ({
      total: data.disputes.length,
      ongoing: data.disputes.filter((dispute) => dispute.status === "ongoing")
        .length,
      resolved: data.disputes.filter((dispute) => dispute.status === "resolved")
        .length,
      high: data.disputes.filter((dispute) => dispute.priority === "high")
        .length,
    }),
    [data.disputes],
  );

  return (
    <SuperAdminLayout
      title="Litiges globaux"
      subtitle="Suivez tous les litiges ouverts ou résolus sur l'ensemble des agences."
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Tous les litiges</p>
          <p className="mt-3 text-3xl font-bold text-slate-950">
            {numberFormatter.format(summary.total)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">En cours</p>
          <p className="mt-3 text-3xl font-bold text-amber-600">
            {numberFormatter.format(summary.ongoing)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Résolus</p>
          <p className="mt-3 text-3xl font-bold text-emerald-600">
            {numberFormatter.format(summary.resolved)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Priorité haute</p>
          <p className="mt-3 text-3xl font-bold text-rose-600">
            {numberFormatter.format(summary.high)}
          </p>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_0.9fr]">
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-950">
                  Tous les litiges
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Filtrez les dossiers par agence ou par statut.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Rechercher"
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />
                <select
                  value={agencyFilter}
                  onChange={(event) => {
                    setAgencyFilter(event.target.value);
                    setCurrentPage(1);
                  }}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                >
                  <option value="all">Toutes les agences</option>
                  {agencies.map((agency) => (
                    <option key={agency} value={agency}>
                      {agency}
                    </option>
                  ))}
                </select>
                <select
                  value={statusFilter}
                  onChange={(event) => {
                    setStatusFilter(event.target.value as "all" | DisputeStatus);
                    setCurrentPage(1);
                  }}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="ongoing">En cours</option>
                  <option value="resolved">Résolu</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-bold">Référence</th>
                  <th className="px-5 py-3 font-bold">Litige</th>
                  <th className="px-5 py-3 font-bold">Agence</th>
                  <th className="px-5 py-3 font-bold">Locataire</th>
                  <th className="px-5 py-3 font-bold">Statut</th>
                  <th className="px-5 py-3 font-bold">Priorité</th>
                  <th className="px-5 py-3 font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedDisputes.map((dispute: Dispute) => (
                  <tr key={dispute.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-bold text-slate-950">
                      {dispute.reference}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => setSelectedDisputeId(dispute.id)}
                        className="text-left font-bold text-slate-950 transition hover:text-indigo-700"
                      >
                        {dispute.title}
                      </button>
                      <p className="mt-1 text-sm text-slate-500">
                        {dispute.property}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                      {dispute.agencyName}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {dispute.tenantName}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${statusClasses(
                          dispute.status,
                        )}`}
                      >
                        {statusLabel(dispute.status)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${priorityClasses(
                          dispute.priority,
                        )}`}
                      >
                        {priorityLabel(dispute.priority)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => setSelectedDisputeId(dispute.id)}
                        className="rounded-lg bg-slate-950 px-3 py-2 text-xs font-bold text-white transition hover:bg-indigo-700"
                      >
                        Voir détail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {disputes.length === 0 ? (
              <div className="p-8 text-center text-sm font-semibold text-slate-500">
                Aucun litige ne correspond aux filtres.
              </div>
            ) : null}
          </div>
          
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">
            Détail du litige
          </h2>

          {selectedDispute ? (
            <div className="mt-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-indigo-600">
                    {selectedDispute.reference}
                  </p>
                  <p className="mt-2 text-xl font-bold text-slate-950">
                    {selectedDispute.title}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {selectedDispute.agencyName}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${statusClasses(
                    selectedDispute.status,
                  )}`}
                >
                  {statusLabel(selectedDispute.status)}
                </span>
              </div>

              <p className="mt-5 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                {selectedDispute.description}
              </p>

              <div className="mt-5 grid gap-3">
                <div className="rounded-lg border border-slate-200 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Locataire
                  </p>
                  <p className="mt-1 font-bold text-slate-950">
                    {selectedDispute.tenantName}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Bien concerné
                  </p>
                  <p className="mt-1 font-bold text-slate-950">
                    {selectedDispute.property}
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-slate-200 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Ouvert le
                    </p>
                    <p className="mt-1 font-bold text-slate-950">
                      {formatDate(selectedDispute.openedAt)}
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-200 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Mis à jour
                    </p>
                    <p className="mt-1 font-bold text-slate-950">
                      {formatDate(selectedDispute.updatedAt)}
                    </p>
                  </div>
                </div>
                <div className="rounded-lg border border-slate-200 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Priorité
                  </p>
                  <span
                    className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${priorityClasses(
                      selectedDispute.priority,
                    )}`}
                  >
                    {priorityLabel(selectedDispute.priority)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">
              Sélectionnez un litige pour afficher ses détails.
            </p>
          )}
        </section>
      </section>
    </SuperAdminLayout>
  );
}

export default Litiges;