import { type ReactNode } from "react";
import { useAuth } from "../../../context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

export function ProtectedRoute({ children, allowedRoles, redirectTo }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg font-bold text-slate-950">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    window.location.href = "/login";
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Rediriger selon le rôle de l'utilisateur
    const defaultPaths: Record<string, string> = {
      super_admin: "/super-admin",
      agency: "/agence",
      tenant: "/locataire",
    };
    window.location.href = redirectTo || defaultPaths[user.role] || "/login";
    return null;
  }

  return <>{children}</>;
}
