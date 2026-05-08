import type { ReactNode } from "react";
import Sidebar from "./Sidebar";

type SuperAdminLayoutProps = {
  children: ReactNode;
  title: string;
  subtitle?: string;
};

function SuperAdminLayout({ children, title, subtitle }: SuperAdminLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <Sidebar />

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="flex min-h-16 flex-col justify-center gap-3 px-5 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
                Super Admin
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
                {title}
              </h1>
              {subtitle ? (
                <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
              ) : null}
            </div>

            <div className="flex items-center gap-3">
              <button className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-700">
                Exporter
              </button>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-sm font-bold text-white">
                SA
              </div>
            </div>
          </div>
        </header>

        <main className="px-5 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

export default SuperAdminLayout;
