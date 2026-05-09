import { useMemo, useState } from "react";
import AgencyLayout from "../../components/common/layout/AgencyLayout";
import {
  getAgencyDashboardData,
  type AgencyDispute,
  type AgencyDisputeStatus,
} from "../../service/ofline/agencyStorage";

type DisputeTab = "all" | "ongoing" | "resolved";

const tabs: Array<{ id: DisputeTab; label: string }> = [
  { id: "all", label: "Tous les litiges" },
  { id: "ongoing", label: "Litiges ouverts" },
  { id: "resolved", label: "Résolus" },
];

const numberFormatter = new Intl.NumberFormat("fr-FR");

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function statusLabel(status: AgencyDisputeStatus) {
  return status === "ongoing" ? "En cours" : "Résolu";
}

function statusClasses(status: AgencyDisputeStatus) {
  return status === "ongoing"
    ? "bg-amber-50 text-amber-700 ring-amber-200"
    : "bg-emerald-50 text-emerald-700 ring-emerald-200";
}

function Litiges() {
  const [data] = useState(() => getAgencyDashboardData());
  const [activeTab, setActiveTab] = useState<DisputeTab>("all");
  const [search, setSearch] = useState("");
  const [selectedDisputeId, setSelectedDisputeId] = useState<number | null>(
    data.disputes[0]?.id ?? null,
  );

  const disputes = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return [...data.disputes]
      .sort(
        (first, second) =>
          new Date(second.date).getTime() - new Date(first.date).getTime(),
      )
      .filter((dispute) => {
        const matchesTab =
          activeTab === "all" || dispute.status === activeTab;
        const matchesSearch =
          normalizedSearch.length === 0 ||
          dispute.subject.toLowerCase().includes(normalizedSearch) ||
          dispute.tenantName.toLowerCase().includes(normalizedSearch);

        return matchesTab && matchesSearch;
      });
  }, [activeTab, data.disputes, search]);

  const selectedDispute = useMemo(
    () =>
      data.disputes.find((dispute) => dispute.id === selectedDisputeId) ??
      data.disputes[0] ??
      null,
    [data.disputes, selectedDisputeId],
  );

  const summary = useMemo(() => ({
    total: data.disputes.length,
    ongoing: data.disputes.filter((dispute) => dispute.status === "ongoing").length,
    resolved: data.disputes.filter((dispute) => dispute.status === "resolved").length,
  }), [data.disputes]);

  return (
    <AgencyLayout agencyName={data.agency.name}>
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Tous les litiges</p>
          <p className="mt-3 text-3xl font-bold text-slate-950">
            {numberFormatter.format(summary.total)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Litiges ouverts</p>
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
      </section>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950">Litiges</h2>
              <p className="mt-1 text-sm text-slate-500">
                Gérez les conflits et suivis avec vos locataires.
              </p>
            </div>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher un locataire ou sujet"
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

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-bold">Locataire</th>
                <th className="px-5 py-3 font-bold">Sujet</th>
                <th className="px-5 py-3 font-bold">Date</th>
                <th className="px-5 py-3 font-bold">Statut</th>
                <th className="px-5 py-3 font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {disputes.map((dispute: AgencyDispute) => (
                <tr key={dispute.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-bold text-slate-950">
                    {dispute.tenantName}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {dispute.subject}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {formatDate(dispute.date)}
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
                    <button
                      onClick={() => setSelectedDisputeId(dispute.id)}
                      className="rounded-lg bg-slate-950 px-3 py-2 text-xs font-bold text-white transition hover:bg-indigo-700"
                    >
                      Détails
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
      </section>

      {selectedDispute && (
        <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Détail du litige</h2>
          <div className="mt-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-indigo-600">
                  #{selectedDispute.id.toString().padStart(4, "0")}
                </p>
                <p className="mt-2 text-xl font-bold text-slate-950">
                  {selectedDispute.subject}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Locataire : {selectedDispute.tenantName}
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
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Date d'ouverture
                </p>
                <p className="mt-1 font-bold text-slate-950">
                  {formatDate(selectedDispute.date)}
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Statut actuel
                </p>
                <span
                  className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${statusClasses(
                    selectedDispute.status,
                  )}`}
                >
                  {statusLabel(selectedDispute.status)}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}
    </AgencyLayout>
  );
}

export default Litiges;
