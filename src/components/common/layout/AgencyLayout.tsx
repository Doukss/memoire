import type { ReactNode } from "react";

type AgencyLayoutProps = {
  children: ReactNode;
  agencyName: string;
};

const navItems = [
  { label: "Dashboard", href: "/agence" },
  { label: "Biens", href: "/agence/biens" },
  { label: "Locataires", href: "/agence/locataires" },
  { label: "Loyers", href: "/agence/loyers" },
  { label: "Litiges", href: "/agence/litiges" },
  { label: "Revenus", href: "/agence/revenus" },
];

function AgencyLayout({ children, agencyName }: AgencyLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200 bg-white lg:flex lg:flex-col">
        <div className="flex h-20 items-center gap-3 border-b border-slate-200 px-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-600 text-lg font-bold text-white">
            K
          </div>
          <div>
            <p className="text-lg font-bold leading-none">KerManager</p>
            <p className="mt-1 text-xs text-slate-500">Espace agence</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-6">
          {navItems.map((item) => {
            const active =
              item.href === "/agence"
                ? window.location.pathname === "/agence" ||
                  window.location.pathname === "/agence/dashboard"
                : window.location.pathname.startsWith(item.href);

            return (
              <a
                key={item.label}
                href={item.href}
                className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm font-semibold transition ${
                  active
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                <span>{item.label}</span>
                {active ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
              </a>
            );
          })}
        </nav>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex min-h-20 flex-col gap-4 px-5 py-4 sm:px-6 xl:flex-row xl:items-center xl:justify-between xl:px-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
                Dashboard agence
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
                {agencyName}
              </h1>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <input
                type="search"
                placeholder="Rechercher un bien, locataire, paiement..."
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 md:w-80"
              />
              <button className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700">
                Notifications
              </button>
              <button className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700">
                Paramètres rapides
              </button>
              <div className="flex items-center gap-3 rounded-lg bg-slate-950 px-3 py-2 text-white">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-sm font-bold">
                  AG
                </div>
                <div>
                  <p className="text-sm font-bold leading-none">Profil agence</p>
                  <p className="mt-1 text-xs text-slate-300">Professionnel</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="px-5 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

export default AgencyLayout;
