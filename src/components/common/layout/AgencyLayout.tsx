import type { ReactNode } from "react";
import { useAuth } from "../../../context/AuthContext";
import AgencySuspended from "../../../page/agenceImmobilier/AgencySuspended";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Building2,
  Users,
  DollarSign,
  Scale,
  BarChart3,
  CreditCard,
  FileText,
  Bell,
  Settings,
  LogOut,
  Search,
  CircleAlert,
  SlidersHorizontal
} from "lucide-react";

type AgencyLayoutProps = {
  children: ReactNode;
  agencyName: string;
  allowWhenSuspended?: boolean;
};

const navItems = [
  { label: "Dashboard", href: "/agence", icon: LayoutDashboard },
  { label: "Biens", href: "/agence/biens", icon: Building2 },
  { label: "Locataires", href: "/agence/locataires", icon: Users },
  { label: "Loyers", href: "/agence/loyers", icon: DollarSign },
  { label: "Litiges", href: "/agence/litiges", icon: Scale },
  { label: "Statistiques", href: "/agence/statistiques", icon: BarChart3 },
  { label: "Abonnement", href: "/agence/abonnement", icon: CreditCard },
  { label: "Contrats & Documents", href: "/agence/contrats", icon: FileText },
  { label: "Notifications", href: "/agence/notifications", icon: Bell },
  { label: "Paramètres", href: "/agence/parametres", icon: Settings },
];

function AgencyLayout({
  children,
  agencyName,
  allowWhenSuspended = false,
}: AgencyLayoutProps) {
  const { user, logout } = useAuth();

  // Mettre à jour le statut d'agence en temps réel
  useEffect(() => {
    function handleAgencyStatusChange(event: CustomEvent<{ email: string; status: string }>) {
      if (user?.email === event.detail.email && user.role === "agency") {
        const users = JSON.parse(localStorage.getItem("kermanager.auth") || "null");
        if (users) {
          users.agencyStatus = event.detail.status;
          localStorage.setItem("kermanager.auth", JSON.stringify(users));
        }
      }
    }
    
    window.addEventListener("agencyStatusChanged" as never, handleAgencyStatusChange as never);
    return () => window.removeEventListener("agencyStatusChanged" as never, handleAgencyStatusChange as never);
  }, [user?.email, user?.role]);

  if (user?.agencyStatus === "suspended" && !allowWhenSuspended) {
    return <AgencySuspended />;
  }

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
            
            const Icon = item.icon;

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
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </div>
                {active ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
              </a>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-4">
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
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  placeholder="Rechercher un bien, locataire, paiement..."
                  className="w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 md:w-80"
                />
              </div>
              <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700">
                <Bell className="h-4 w-4" />
                Notifications
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700">
                <SlidersHorizontal className="h-4 w-4" />
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