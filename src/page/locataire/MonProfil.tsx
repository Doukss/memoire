import { useState } from "react";
import TenantLayout from "../../components/common/layout/TenantLayout";
import { getAgencyDashboardData, saveAgencyDashboardData } from "../../service/ofline/agencyStorage";

type ProfileTab = "informations" | "motdepasse";

const tabs: Array<{ id: ProfileTab; label: string }> = [
  { id: "informations", label: "Informations personnelles" },
  { id: "motdepasse", label: "Changer mot de passe" },
];

function MonProfil() {
  const [data, setData] = useState(() => getAgencyDashboardData());
  const [activeTab, setActiveTab] = useState<ProfileTab>("informations");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Simulation: on prend le premier locataire actif comme "locataire connecté"
  const tenantIndex = data.tenants.findIndex((t) => t.active);
  const tenant = tenantIndex >= 0 ? data.tenants[tenantIndex] : data.tenants[0];

  function persist(nextData: typeof data) {
    setData(nextData);
    saveAgencyDashboardData(nextData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  }

  const [formData, setFormData] = useState({
    fullName: tenant.fullName,
    email: tenant.email,
    phone: tenant.phone,
  });

  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  function handleInfoSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newData = { ...data };
    newData.tenants[tenantIndex] = { ...tenant, ...formData };
    persist(newData);
  }

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Simulation: just show success
    setSaveSuccess(true);
    setPasswordData({ current: "", new: "", confirm: "" });
    setTimeout(() => setSaveSuccess(false), 3000);
  }

  return (
    <TenantLayout tenantName={tenant.fullName}>
      <section className="max-w-3xl mx-auto">
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-950">Mon Profil</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Gérez vos informations personnelles et sécurité.
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
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-950"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {activeTab === "informations" && (
            <div className="p-5">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-950">Informations personnelles</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Modifiez vos coordonnées.
                </p>
              </div>

              <form onSubmit={handleInfoSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+221 XX XXX XX XX"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
                  >
                    Enregistrer les modifications
                  </button>
                </div>
              </form>

              {saveSuccess && (
                <div className="mt-4 rounded-lg bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
                  Profil mis à jour avec succès.
                </div>
              )}
            </div>
          )}

          {activeTab === "motdepasse" && (
            <div className="p-5">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-950">Changer le mot de passe</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Mettez à jour votre mot de passe pour sécuriser votre compte.
                </p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Mot de passe actuel
                  </label>
                  <input
                    type="password"
                    value={passwordData.current}
                    onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    value={passwordData.new}
                    onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                    placeholder="Min. 8 caractères"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Confirmer le mot de passe
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    required
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
                  >
                    Mettre à jour le mot de passe
                  </button>
                </div>
              </form>

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
        </div>
      </section>
    </TenantLayout>
  );
}

export default MonProfil;
