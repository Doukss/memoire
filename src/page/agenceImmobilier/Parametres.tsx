import { useMemo, useState } from "react";
import AgencyLayout from "../../components/common/layout/AgencyLayout";
import { getAgencyDashboardData, saveAgencyDashboardData } from "../../service/ofline/agencyStorage";

type SettingsTab = "profil" | "securite" | "motdepasse";

const tabs: Array<{ id: SettingsTab; label: string }> = [
  { id: "profil", label: "Profil agence" },
  { id: "securite", label: "Sécurité" },
  { id: "motdepasse", label: "Mot de passe" },
];

function Parametres() {
  const [data, setData] = useState(() => getAgencyDashboardData());
  const [activeTab, setActiveTab] = useState<SettingsTab>("profil");
  const [saveSuccess, setSaveSuccess] = useState(false);

  function persist(nextData: typeof data) {
    setData(nextData);
    saveAgencyDashboardData(nextData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  }

  const stats = useMemo(() => ({
    properties: data.properties.length,
    tenants: data.tenants.filter((t) => t.active).length,
    contracts: data.contracts?.filter((c) => c.status === "active").length || 0,
    disputes: data.disputes?.filter((d) => d.status === "ongoing").length || 0,
  }), [data]);

  return (
    <AgencyLayout agencyName={data.agency.name}>
      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Biens</p>
          <p className="mt-3 text-3xl font-bold text-slate-950">{stats.properties}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Locataires actifs</p>
          <p className="mt-3 text-3xl font-bold text-emerald-600">{stats.tenants}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Contrats actifs</p>
          <p className="mt-3 text-3xl font-bold text-indigo-600">{stats.contracts}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Litiges en cours</p>
          <p className="mt-3 text-3xl font-bold text-amber-600">{stats.disputes}</p>
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950">Paramètres</h2>
              <p className="mt-1 text-sm text-slate-500">
                Gérez les informations de votre agence et la sécurité du compte.
              </p>
            </div>
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

        {activeTab === "profil" && (
          <div className="p-5">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-950">Informations de l'agence</h3>
              <p className="mt-1 text-sm text-slate-500">
                Modifiez les informations publiques de votre profil.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Nom de l'agence
                </label>
                <input
                  type="text"
                  defaultValue={data.agency.name}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue={data.agency.email}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Téléphone
                </label>
                <input
                  type="tel"
                  placeholder="+221 XX XXX XX XX"
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Adresse
                </label>
                <input
                  type="text"
                  placeholder="Dakar, Sénégal"
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Description de votre agence..."
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  const newData = { ...data };
                  // Update would be handled here with form state
                  persist(newData);
                }}
                className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
              >
                Enregistrer les modifications
              </button>
            </div>

            {saveSuccess && (
              <div className="mt-4 rounded-lg bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
                Profil mis à jour avec succès.
              </div>
            )}
          </div>
        )}

        {activeTab === "securite" && (
          <div className="p-5">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-950">Sécurité du compte</h3>
              <p className="mt-1 text-sm text-slate-500">
                Gérez les paramètres de sécurité de votre compte.
              </p>
            </div>

            <div className="space-y-6">
              <div className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-950">Authentification à deux facteurs</h4>
                    <p className="mt-1 text-sm text-slate-500">
                      Ajoute une couche de sécurité supplémentaire à votre compte.
                    </p>
                  </div>
                  <button className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200">
                    Activer
                  </button>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-950">Sessions actives</h4>
                    <p className="mt-1 text-sm text-slate-500">
                      Voir et gérer les appareils connectés à votre compte.
                    </p>
                  </div>
                  <button className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200">
                    Gérer
                  </button>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-950">Historique de connexion</h4>
                    <p className="mt-1 text-sm text-slate-500">
                      Consultez l'historique des connexions à votre compte.
                    </p>
                  </div>
                  <button className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200">
                    Voir
                  </button>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-950">Notifications de sécurité</h4>
                    <p className="mt-1 text-sm text-slate-500">
                      Recevez des alertes pour les activités suspectes.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "motdepasse" && (
          <div className="p-5">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-950">Changer le mot de passe</h3>
              <p className="mt-1 text-sm text-slate-500">
                Mettez à jour votre mot de passe régulièrement pour sécuriser votre compte.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Mot de passe actuel
                </label>
                <input
                  type="password"
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  placeholder="Min. 8 caractères"
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setSaveSuccess(true);
                  setTimeout(() => setSaveSuccess(false), 3000);
                }}
                className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
              >
                Mettre à jour le mot de passe
              </button>
            </div>

            {saveSuccess && (
              <div className="mt-4 rounded-lg bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
                Mot de passe mis à jour avec succès.
              </div>
            )}

            <div className="mt-6">
              <h4 className="font-bold text-slate-950">Exigences du mot de passe</h4>
              <ul className="mt-2 space-y-1 text-sm text-slate-600">
                <li>• Minimum 8 caractères</li>
                <li>• Au moins une majuscule</li>
                <li>• Au moins une minuscule</li>
                <li>• Au moins un chiffre</li>
                <li>• Au moins un caractère spécial</li>
              </ul>
            </div>
          </div>
        )}
      </section>
    </AgencyLayout>
  );
}

export default Parametres;
