import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type UserRole = "super_admin" | "agency" | "tenant";

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  agencyId?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  agencyId?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "kermanager.auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialiser des utilisateurs de test si aucun utilisateur n'existe
    const users = JSON.parse(localStorage.getItem("kermanager.users") || "[]");
    if (users.length === 0) {
      const defaultUsers = [
        {
          id: "1",
          email: "superadmin@kermanager.sn",
          password: "SuperAdmin2024!",
          name: "Super Admin",
          role: "super_admin" as UserRole,
        },
        {
          id: "2",
          email: "agence@dakarprestige.sn",
          password: "Agence2024!",
          name: "Dakar Prestige Immobilier",
          role: "agency" as UserRole,
        },
        {
          id: "3",
          email: "locataire@email.sn",
          password: "Locataire2024!",
          name: "Mamadou Fall",
          role: "tenant" as UserRole,
        },
      ];
      localStorage.setItem("kermanager.users", JSON.stringify(defaultUsers));
    }

    // Charger l'utilisateur connecté
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const users = JSON.parse(localStorage.getItem("kermanager.users") || "[]");
    const foundUser = users.find((u: { email: string; password: string }) => u.email === email && u.password === password);

    if (!foundUser) {
      return { success: false, error: "Email ou mot de passe incorrect" };
    }

    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword));
    return { success: true };
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    const users = JSON.parse(localStorage.getItem("kermanager.users") || "[]");

    // Vérifier si l'email existe déjà
    if (users.some((u: { email: string }) => u.email === data.email)) {
      return { success: false, error: "Cet email est déjà utilisé" };
    }

    const newUser = {
      id: Date.now().toString(),
      ...data,
    };

    users.push(newUser);
    localStorage.setItem("kermanager.users", JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
