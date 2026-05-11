import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export function useRedirectIfAuthenticated() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      const redirectPaths: Record<string, string> = {
        super_admin: "/super-admin",
        agency: "/agence",
        tenant: "/locataire",
      };
      const path = redirectPaths[user.role] || "/login";
      if (window.location.pathname !== path) {
        window.location.href = path;
      }
    }
  }, [user, isLoading]);

  return { isAuthenticated: !!user, isLoading };
}
