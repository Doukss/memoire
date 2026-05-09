import { useMemo, useState } from "react";
import TenantLayout from "../../components/common/layout/TenantLayout";
import { getAgencyDashboardData } from "../../service/ofline/agencyStorage";

const currencyFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "XOF",
  maximumFractionDigits: 0,
});

function MonLogement() {
  const [data] = useState(() => getAgencyDashboardData());
  
  // Simulation: on prend le premier locataire actif comme "locataire connecté"
  const tenant = useMemo(() => {
    return data.tenants.find((t) => t.active) || data.tenants[0];
  }, [data.tenants]);

  const property = useMemo(() => {
    return data.properties.find((p) => p.name === tenant.propertyName);
  }, [data.properties, tenant]);

  const contract = useMemo(() => {
    return data.contracts.find((c) => c.tenantName === tenant.fullName && c.status === "active");
  }, [data.contracts, tenant]);

  return (
    <TenantLayout tenantName={tenant.fullName}>
      <section className="grid gap-6 xl:grid-cols-3">
        {/* Galerie photos */}
        <div className="xl:col-span-2">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">Photos du logement</h2>
            <p className="mt-1 text-sm text-slate-500">
              Vue de votre logement.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="aspect-video rounded-lg bg-slate-100 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"
                  alt="Salon"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="aspect-video rounded-lg bg-slate-100 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800"
                  alt="Chambre"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="aspect-video rounded-lg bg-slate-100 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800"
                  alt="Cuisine"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="aspect-video rounded-lg bg-slate-100 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"
                  alt="Salle de bain"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Informations principales */}
        <div className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">Informations du bien</h2>
            <p className="mt-1 text-sm text-slate-500">
              Détails de votre logement.
            </p>
            <div className="mt-4 space-y-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Adresse</p>
                <p className="mt-1 font-bold text-slate-950">{property?.address || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Type de bien</p>
                <p className="mt-1 font-bold text-slate-950">{property?.name || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Loyer mensuel</p>
                <p className="mt-1 font-bold text-slate-950">{currencyFormatter.format(property?.monthlyRent || 0)}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Statut</p>
                <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${
                  property?.status === "occupied"
                    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                    : "bg-slate-100 text-slate-700 ring-slate-200"
                }`}>
                  {property?.status === "occupied" ? "Occupé" : "Disponible"}
                </span>
              </div>
            </div>
          </div>

          {/* Détails contrat */}
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">Détails du contrat</h2>
            <p className="mt-1 text-sm text-slate-500">
              Informations contractuelles.
            </p>
            {contract ? (
              <div className="mt-4 space-y-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Numéro de contrat</p>
                  <p className="mt-1 font-bold text-slate-950">#{contract.id.toString().padStart(4, '0')}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Date de début</p>
                  <p className="mt-1 font-bold text-slate-950">
                    {new Intl.DateTimeFormat("fr-FR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }).format(new Date(contract.startDate))}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Date de fin</p>
                  <p className="mt-1 font-bold text-slate-950">
                    {new Intl.DateTimeFormat("fr-FR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }).format(new Date(contract.endDate))}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Statut</p>
                  <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${
                    contract.status === "active"
                      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                      : contract.status === "expired"
                      ? "bg-rose-50 text-rose-700 ring-rose-200"
                      : "bg-slate-100 text-slate-700 ring-slate-200"
                  }`}>
                    {contract.status === "active" ? "Actif" : contract.status === "expired" ? "Expiré" : "Résilié"}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Signature</p>
                  <p className="mt-1 font-bold text-slate-950">
                    {contract.signed ? "✅ Signé électroniquement" : "⏳ En attente de signature"}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm font-semibold text-slate-500">Aucun contrat actif.</p>
            )}
          </div>
        </div>
      </section>

      {/* Section équipements / détails supplémentaires */}
      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-950">Équipements & Commodités</h2>
        <p className="mt-1 text-sm text-slate-500">
          Équipements inclus dans le logement.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {[
            { name: "Climatisation", icon: "❄️" },
            { name: "Internet fibre", icon: "📶" },
            { name: "Parking", icon: "🚗" },
            { name: "Sécurité 24h", icon: "🔒" },
            { name: "Générateur", icon: "⚡" },
            { name: "Piscine", icon: "🏊" },
            { name: "Gymnase", icon: "🏋️" },
            { name: "Concierge", icon: "👮" },
          ].map((equipment) => (
            <div key={equipment.name} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
              <span className="text-xl">{equipment.icon}</span>
              <span className="text-sm font-semibold text-slate-700">{equipment.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Section contacts urgents */}
      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-950">Contacts urgents</h2>
        <p className="mt-1 text-sm text-slate-500">
          En cas de problème, contactez-nous.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Agence</p>
            <p className="mt-1 font-bold text-slate-950">Dakar Prestige Immobilier</p>
            <p className="mt-1 text-sm text-slate-600">+221 33 123 45 67</p>
            <p className="text-sm text-slate-600">contact@dakarprestige.sn</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Gestionnaire</p>
            <p className="mt-1 font-bold text-slate-950">M. Diop</p>
            <p className="mt-1 text-sm text-slate-600">+221 77 123 45 67</p>
            <p className="text-sm text-slate-600">gestionnaire@dpi.sn</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Dépannage (24/7)</p>
            <p className="mt-1 font-bold text-slate-950">Maintenance</p>
            <p className="mt-1 text-sm text-slate-600">+221 78 987 65 43</p>
            <p className="text-sm text-slate-600">urgence@dpi.sn</p>
          </div>
        </div>
      </section>
    </TenantLayout>
  );
}

export default MonLogement;
