import { useState } from "react";
import TenantLayout from "../../components/common/layout/TenantLayout";

function ContacterAgence() {
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    priority: "normal",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    // Reset after 3 seconds
    setTimeout(() => setSubmitted(false), 3000);
  }

  return (
    <TenantLayout tenantName="Locataire">
      <div className="max-w-3xl mx-auto">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Contacter l'agence</h2>
          <p className="mt-1 text-sm text-slate-500">
            Envoyez un message à votre agence pour toute question ou demande.
          </p>

          {submitted ? (
            <div className="mt-6 rounded-lg bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
              ✅ Message envoyé avec succès. L'agence vous répondra dans les plus brefs délais.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Sujet
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  required
                >
                  <option value="">Sélectionnez un sujet</option>
                  <option value="maintenance">Problème technique / Maintenance</option>
                  <option value="payment">Question sur le paiement</option>
                  <option value="contract">Contrat / Documents</option>
                  <option value="noise">Nuisances sonores</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Priorité
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="priority"
                      value="low"
                      checked={formData.priority === "low"}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="h-4 w-4 text-indigo-600"
                    />
                    <span className="text-sm text-slate-700">Faible</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="priority"
                      value="normal"
                      checked={formData.priority === "normal"}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="h-4 w-4 text-indigo-600"
                    />
                    <span className="text-sm text-slate-700">Normal</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="priority"
                      value="urgent"
                      checked={formData.priority === "urgent"}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="h-4 w-4 text-indigo-600"
                    />
                    <span className="text-sm text-slate-700">Urgent</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Message
                </label>
                <textarea
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Décrivez votre demande en détail..."
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
                >
                  Envoyer le message
                </button>
              </div>
            </form>
          )}
        </section>

        {/* Infos contact */}
        <section className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-bold text-slate-950">Téléphone</h3>
            <p className="mt-1 text-sm text-slate-600">+221 33 123 45 67</p>
            <p className="text-xs text-slate-500">Lun-Ven 8h-18h</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-bold text-slate-950">Email</h3>
            <p className="mt-1 text-sm text-slate-600">contact@dakarprestige.sn</p>
            <p className="text-xs text-slate-500">Réponse sous 24h</p>
          </div>
        </section>
      </div>
    </TenantLayout>
  );
}

export default ContacterAgence;
