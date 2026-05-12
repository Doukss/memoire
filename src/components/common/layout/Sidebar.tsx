import { useAuth } from "../../../context/AuthContext";
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  Scale,
  BarChart3,
  Bell,
  Settings,
  LogOut
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/super-admin", icon: LayoutDashboard },
  { label: "Agences", href: "/super-admin/agences", icon: Building2 },
  { label: "Utilisateurs", href: "/super-admin/utilisateurs", icon: Users },
  { label: "Abonnements", href: "/super-admin/abonnements", icon: CreditCard },
  { label: "Litiges", href: "/super-admin/litiges", icon: Scale },
  { label: "Statistiques", href: "/super-admin/statistiques", icon: BarChart3 },
  { label: "Notifications", href: "/super-admin/notifications", icon: Bell },
  { label: "Parametres", href: "/super-admin/parametres", icon: Settings },
];

function isActiveRoute(href: string) {
  const pathname = window.location.pathname;

  if (href === "/super-admin") {
    return pathname === "/super-admin" || pathname === "/super-admin/dashboard";
  }

  return pathname.startsWith(href);
}

function Sidebar() {
  const { logout } = useAuth();

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
        {navItems.map((item) => {
          const active = isActiveRoute(item.href);
          const Icon = item.icon;

          return (
            <a
              key={item.label}
              href={item.href}
              className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm font-semibold transition ${
                active
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-950/25"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </div>
              {active ? (
                <span className="h-2 w-2 rounded-full bg-white" />
              ) : null}
            </a>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4 space-y-3">
        <div className="rounded-lg bg-white/10 p-4">
          <p className="text-sm font-bold">Super Admin</p>
          <p className="mt-1 text-xs leading-5 text-slate-300">
            Vue globale de la plateforme, agences, revenus et incidents.
          </p>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-5 w-5" />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;