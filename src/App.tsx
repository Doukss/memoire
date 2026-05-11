import { useAuth } from "./context/AuthContext";
import type { ComponentType } from "react";

import LandingPage from "./page/public/LandingPage";
import LoginPage from "./page/public/LoginPage";
import RegisterPage from "./page/public/RegisterPage";
import AdminDashboard from "./page/superAdmin/AdminDashboard";
import GestionDesAgences from "./page/superAdmin/Gestion_des_agences";
import Utilisateures from "./page/superAdmin/Utilisateures";
import Abonnements from "./page/superAdmin/Abonnements";
import Litiges from "./page/superAdmin/Litiges";
import Statistiques from "./page/superAdmin/Statistiques";
import Notifications from "./page/superAdmin/Notifications";
import AgenceDashboard from "./page/agenceImmobilier/AgenceDashboard";
import GestionBiens from "./page/agenceImmobilier/GestionBiens";
import GestionLocataires from "./page/agenceImmobilier/GestionLocataires";
import GestionPaiements from "./page/agenceImmobilier/GestionPaiements";
import LitigesAgence from "./page/agenceImmobilier/Litiges";
import StatistiquesAgence from "./page/agenceImmobilier/Statistiques";
import ContratsDocuments from "./page/agenceImmobilier/ContratsDocuments";
import NotificationsAgence from "./page/agenceImmobilier/Notifications";
import Parametres from "./page/agenceImmobilier/Parametres";
import LocataireDashboard from "./page/locataire/locataireDashboard";
import MesPaiements from "./page/locataire/MesPaiements";
import MonLogement from "./page/locataire/MonLogement";
import MesDocuments from "./page/locataire/MesDocuments";
import ContacterAgence from "./page/locataire/ContacterAgence";
import MonProfil from "./page/locataire/MonProfil";
import Chat from "./page/locataire/Chat";
import PaiementEnLigne from "./page/locataire/PaiementEnLigne";

function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
          <p className="text-sm font-semibold text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Routes publiques (sans authentification)
  const publicRoutes: Record<string, ComponentType> = {
    "/": LandingPage,
    "/login": LoginPage,
    "/register": RegisterPage,
  };

  // Routes protégées par rôle
  const protectedRoutes: Record<string, ComponentType> = {
    // Super Admin
    "/super-admin": AdminDashboard,
    "/super-admin/dashboard": AdminDashboard,
    "/super-admin/agences": GestionDesAgences,
    "/super-admin/utilisateurs": Utilisateures,
    "/super-admin/abonnements": Abonnements,
    "/super-admin/litiges": Litiges,
    "/super-admin/statistiques": Statistiques,
    "/super-admin/notifications": Notifications,
    // Super Admin - Parametres page will be created later, using AdminDashboard temporarily
    "/super-admin/parametres": AdminDashboard,

    // Agence
    "/agence": AgenceDashboard,
    "/agence/dashboard": AgenceDashboard,
    "/agence/biens": GestionBiens,
    "/agence/locataires": GestionLocataires,
    "/agence/loyers": GestionPaiements,
    "/agence/litiges": LitigesAgence,
    "/agence/statistiques": StatistiquesAgence,
    "/agence/contrats": ContratsDocuments,
    "/agence/notifications": NotificationsAgence,
    "/agence/parametres": Parametres,

    // Locataire
    "/locataire": LocataireDashboard,
    "/locataire/dashboard": LocataireDashboard,
    "/locataire/paiements": MesPaiements,
    "/locataire/logement": MonLogement,
    "/locataire/documents": MesDocuments,
    "/locataire/contact": ContacterAgence,
    "/locataire/profil": MonProfil,
    "/locataire/chat": Chat,
    "/locataire/paiement-en-ligne": PaiementEnLigne,
  };

  // Si l'utilisateur n'est pas connecté
  if (!user) {
    // Routes publiques autorisées sans connexion
    const publicPaths = ["/", "/login", "/register"];
    const currentPath = window.location.pathname;

    if (publicPaths.includes(currentPath)) {
      const Component = publicRoutes[currentPath] || LandingPage;
      return <Component />;
    } else {
      // Rediriger vers login si tentative d'accès à une route protégée
      window.location.href = "/login";
      return null;
    }
  }

  // Si l'utilisateur est connecté, vérifier les routes protégées
  const pathname = window.location.pathname;

  // Vérifier que la route correspond au rôle de l'utilisateur
  const rolePrefix: Record<string, string> = {
    super_admin: "/super-admin",
    agency: "/agence",
    tenant: "/locataire",
  };

  const userPrefix = rolePrefix[user.role];
  if (!pathname.startsWith(userPrefix)) {
    // Rediriger vers le dashboard de son rôle
    window.location.href = userPrefix;
    return null;
  }

  const Component = protectedRoutes[pathname];

  if (!Component) {
    // Route inconnue mais dans le bon préfixe : rediriger vers le dashboard
    window.location.href = userPrefix;
    return null;
  }

  return <Component />;
}

export default App;
