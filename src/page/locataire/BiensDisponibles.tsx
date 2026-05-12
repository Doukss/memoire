import { useMemo } from "react";
import TenantLayout from "../../components/common/layout/TenantLayout";
import { getAgencyDashboardData } from "../../service/ofline/agencyStorage";

const currencyFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "XOF",
  maximumFractionDigits: 0,
});

function BiensDisponibles() {
  const data = getAgencyDashboardData();

  const availableProperties = useMemo(() => {
    return data.properties.filter((p) => p.status === "available");
  }, [data.properties]);

  const tenant = useMemo(() => {
    return data.tenants.find((t) => t.active) || data.tenants[0];
  }, [data.tenants]);

  return (
    <TenantLayout tenantName={tenant.fullName}>
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-950">Biens disponibles</h2>
          <p className="mt-1 text-sm text-slate-500">
            Découvrez tous les biens disponibles dans votre agence.
          </p>
        </div>

        {availableProperties.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-950">Aucun bien disponible</h3>
            <p className="mt-2 text-sm text-slate-500">
              Il n'y a actuellement aucun bien disponible dans votre agence.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {availableProperties.map((property) => (
              <div key={property.id} className="rounded-lg border border-slate-200 bg-slate-50 overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                  <svg className="h-16 w-16 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-950">{property.name}</h3>
                  <p className="mt-1 text-sm text-slate-600">{property.address}</p>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Loyer mensuel</span>
                      <span className="font-bold text-slate-950">{currencyFormatter.format(property.monthlyRent)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Statut</span>
                      <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
                        Disponible
                      </span>
                    </div>
                  </div>

                  <button className="mt-4 w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-indigo-700">
                    Contacter l'agence
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </TenantLayout>
  );
}

export default BiensDisponibles;