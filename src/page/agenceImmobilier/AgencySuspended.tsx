import { useAuth } from "../../context/AuthContext";

function AgencySuspended() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-rose-100 mb-4">
            <svg
              className="h-10 w-10 text-rose-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Compte suspendu
          </h1>
          <p className="text-gray-600">
            Votre agence a été suspendue par l'administrateur. Vous ne pouvez
            pas accéder à votre espace pour le moment.
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Que faire ?
          </h2>
          <ul className="text-left text-sm text-gray-600 space-y-2">
            <li className="flex items-start gap-2">
              <svg
                className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zm14 5H2v5a2 2 0 002 2h12a2 2 0 002-2V9zm-4 3a1 1 0 100 2h1a1 1 0 100-2h-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                Reglez votre abonnement pour reactiver automatiquement votre
                espace
              </span>
            </li>
            <li className="flex items-start gap-2">
              <svg
                className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                Contactez le super admin pour qu'il réactive votre agence
              </span>
            </li>
            <li className="flex items-start gap-2">
              <svg
                className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                Rassemblez les informations demandées pour réactiver votre
                compte
              </span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <a
            href="/super-admin"
            className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 border border-gray-300 hover:bg-gray-50 transition"
          >
            Contacter le super admin
          </a>
          <a
            href="/agence/abonnement"
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition"
          >
            Payer mon abonnement
          </a>
          <button
            onClick={logout}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}

export default AgencySuspended;
