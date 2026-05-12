import type { ReactNode } from "react";
import { useAuth } from "../../../context/AuthContext";
import {
  LayoutDashboard,
  Home,
  Building2,
  CreditCard,
  FileText,
  User,
  Phone,
  LogOut,
  Bell,
  Mail,
  Settings,
  Menu
} from "lucide-react";

type TenantLayoutProps = {
  children: ReactNode;
  tenantName: string;
};

const navItems = [
  { label: "Dashboard", href: "/locataire", icon: LayoutDashboard },
  { label: "Mon Logement", href: "/locataire/logement", icon: Home },
  { label: "Biens disponibles", href: "/locataire/biens", icon: Building2 },
  { label: "Mes Paiements", href: "/locataire/paiements", icon: CreditCard },
  { label: "Documents", href: "/locataire/documents", icon: FileText },
  { label: "Mon Profil", href: "/locataire/profil", icon: User },
  { label: "Contacter l'Agence", href: "/locataire/contact", icon: Phone },
];

function TenantLayout({ children, tenantName }: TenantLayoutProps) {
  const { logout } = useAuth();

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
            
            const Icon = item.icon;

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
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </div>
                {active ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
              </a>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-4 space-y-3">
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
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-red-100 hover:text-red-600"
          >
            <LogOut className="h-5 w-5" />
            <span>Déconnexion</span>
          </button>
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
              <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-700">
                <Bell className="h-4 w-4" />
                Notifications
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-700">
                <Mail className="h-4 w-4" />
                Messages
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-700">
                <Settings className="h-4 w-4" />
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