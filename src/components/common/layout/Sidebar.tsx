const navItems = [
  { label: "Dashboard", href: "/super-admin", active: true },
  { label: "Agences", href: "/super-admin/agences", active: false },
  { label: "Utilisateurs", href: "/super-admin/utilisateurs", active: false },
  { label: "Abonnements", href: "/super-admin/abonnements", active: false },
  { label: "Litiges", href: "/super-admin/litiges", active: false },
  { label: "Statistiques", href: "/super-admin/statistiques", active: false },
  { label: "Notifications", href: "/super-admin/notifications", active: false },
  { label: "Parametres", href: "/super-admin/parametres", active: false },
];

function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200 bg-slate-950 text-white lg:flex lg:flex-col">
      <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-600 text-lg font-bold shadow-lg shadow-indigo-950/30">
          K
        </div>
        <div>
          <p className="text-lg font-bold leading-none">KerManager</p>
          <p className="mt-1 text-xs text-slate-400">Console SaaS</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-6">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm font-semibold transition ${
              item.active
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-950/25"
                : "text-slate-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span>{item.label}</span>
            {item.active ? (
              <span className="h-2 w-2 rounded-full bg-white" />
            ) : null}
          </a>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="rounded-lg bg-white/10 p-4">
          <p className="text-sm font-bold">Super Admin</p>
          <p className="mt-1 text-xs leading-5 text-slate-300">
            Vue globale de la plateforme, agences, revenus et incidents.
          </p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
