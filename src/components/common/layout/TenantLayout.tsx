import type { ReactNode } from "react";

type TenantLayoutProps = {
  children: ReactNode;
  tenantName: string;
};

const navItems = [
  { label: "Dashboard", href: "/locataire" },
  { label: "Mon Logement", href: "/locataire/logement" },
  { label: "Mes Paiements", href: "/locataire/paiements" },
  { label: "Documents", href: "/locataire/documents" },
  { label: "Mon Profil", href: "/locataire/profil" },
  { label: "Contacter l'Agence", href: "/locataire/contact" },
];

function TenantLayout({ children, tenantName }: TenantLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200 bg-white lg:flex lg:flex-col">
        <div className="flex h-20 items-center gap-3 border-b border-slate-200 px-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-600 text-lg font-bold text-white">
            KM
          </div>
          <div>
            <p className="text-lg font-bold leading-none">KerManager</p>
            <p className="mt-1 text-xs text-slate-500">Espace locataire</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-6">
          {navItems.map((item) => {
            const active =
              item.href === "/locataire"
                ? window.location.pathname === "/locataire" ||
                  window.location.pathname === "/locataire/dashboard"
                : window.location.pathname.startsWith(item.href);

            return (
              <a
                key={item.label}
                href={item.href}
                className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm font-semibold transition ${
                  active
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                <span>{item.label}</span>
                {active ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
              </a>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-4">
          <div className="rounded-lg bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
                {tenantName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-950">{tenantName}</p>
                <p className="text-xs text-slate-500">Locataire</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex min-h-16 flex-col gap-3 px-5 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
                Espace Locataire
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
                {tenantName}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-700 flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Notifications
              </button>
              <button className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-700 flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Messages
              </button>
              <button className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-700 flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Paramètres
              </button>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
                {tenantName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <main className="px-5 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

export default TenantLayout;
