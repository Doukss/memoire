import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LandingPage from './page/public/LandingPage'
import LoginPage from './page/public/LoginPage'
import RegisterPage from './page/public/RegisterPage'

const routes: Record<string, React.ComponentType> = {
  '/': LandingPage,
  '/login': LoginPage,
  '/register': RegisterPage,
}

const App = routes[window.location.pathname] ?? LandingPage

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
