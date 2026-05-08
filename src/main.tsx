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

const routes: Record<string, React.ComponentType> = {
  '/': LandingPage,
  '/login': LoginPage,
  '/register': RegisterPage,
  '/super-admin': AdminDashboard,
  '/super-admin/dashboard': AdminDashboard,
  '/super-admin/agences': GestionDesAgences,
  '/super-admin/utilisateurs': Utilisateures,
  '/super-admin/abonnements': Abonnements,
}

const App = routes[window.location.pathname] ?? LandingPage

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
