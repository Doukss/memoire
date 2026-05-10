import LandingPage from './page/public/LandingPage'
import LoginPage from './page/public/LoginPage'
import RegisterPage from './page/public/RegisterPage'
import AdminDashboard from './page/superAdmin/AdminDashboard'
import GestionDesAgences from './page/superAdmin/Gestion_des_agences'
import Utilisateures from './page/superAdmin/Utilisateures'
import Abonnements from './page/superAdmin/Abonnements'
import Litiges from './page/superAdmin/Litiges'
import Statistiques from './page/superAdmin/Statistiques'
import Notifications from './page/superAdmin/Notifications'
import AgenceDashboard from './page/agenceImmobilier/AgenceDashboard'
import GestionBiens from './page/agenceImmobilier/GestionBiens'
import GestionLocataires from './page/agenceImmobilier/GestionLocataires'
import GestionPaiements from './page/agenceImmobilier/GestionPaiements'
import LitigesAgence from './page/agenceImmobilier/Litiges'
import StatistiquesAgence from './page/agenceImmobilier/Statistiques'
import ContratsDocuments from './page/agenceImmobilier/ContratsDocuments'
import NotificationsAgence from './page/agenceImmobilier/Notifications'
import Parametres from './page/agenceImmobilier/Parametres'
import LocataireDashboard from './page/locataire/locataireDashboard'
import MesPaiements from './page/locataire/MesPaiements'
import MonLogement from './page/locataire/MonLogement'
import MesDocuments from './page/locataire/MesDocuments'
import ContacterAgence from './page/locataire/ContacterAgence'
import MonProfil from './page/locataire/MonProfil'
import Chat from './page/locataire/Chat'
import PaiementEnLigne from './page/locataire/PaiementEnLigne'

function App() {
  const pathname = window.location.pathname;

  const routes: Record<string, React.ComponentType> = {
    '/': LandingPage,
    '/login': LoginPage,
    '/register': RegisterPage,
    '/super-admin': AdminDashboard,
    '/super-admin/dashboard': AdminDashboard,
    '/super-admin/agences': GestionDesAgences,
    '/super-admin/utilisateurs': Utilisateures,
    '/super-admin/abonnements': Abonnements,
    '/super-admin/litiges': Litiges,
    '/super-admin/statistiques': Statistiques,
    '/super-admin/notifications': Notifications,
    '/agence': AgenceDashboard,
    '/agence/dashboard': AgenceDashboard,
    '/agence/biens': GestionBiens,
    '/agence/locataires': GestionLocataires,
    '/agence/loyers': GestionPaiements,
    '/agence/litiges': LitigesAgence,
    '/agence/statistiques': StatistiquesAgence,
    '/agence/contrats': ContratsDocuments,
    '/agence/notifications': NotificationsAgence,
    '/agence/parametres': Parametres,
    '/locataire': LocataireDashboard,
    '/locataire/dashboard': LocataireDashboard,
    '/locataire/paiements': MesPaiements,
    '/locataire/logement': MonLogement,
    '/locataire/documents': MesDocuments,
    '/locataire/chat': Chat,
    '/locataire/paiement-en-ligne': PaiementEnLigne,
    '/locataire/contact': ContacterAgence,
    '/locataire/profil': MonProfil,
  };

  const Component = routes[pathname] || LandingPage;

  return <Component />;
}

export default App;
