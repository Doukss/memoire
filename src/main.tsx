import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-lg font-bold text-slate-950">
              Chargement...
            </div>
          </div>
        }
      >
        <App />
      </Suspense>
    </AuthProvider>
  </StrictMode>,
);
