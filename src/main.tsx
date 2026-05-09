import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
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
}

const App = routes[window.location.pathname] ?? LandingPage

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
