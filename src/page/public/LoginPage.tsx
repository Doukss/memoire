import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

function LoginPage() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  function validate() {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 6) {
      newErrors.password = "Minimum 6 caractères";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError("");

    if (!validate()) return;

    setIsSubmitting(true);
    const result = await login(formData.email, formData.password);
    setIsSubmitting(false);

    if (!result.success) {
      setApiError(result.error || "Erreur de connexion");
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="relative hidden overflow-hidden bg-slate-900 lg:block">
          <img
            src="https://i.pinimg.com/736x/3a/8b/70/3a8b700e6bd6a39cc50f4f9314834e60.jpg"
            alt="Immeubles modernes geres avec KerManager"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/65" />
          <div className="relative flex h-full flex-col justify-between p-12 text-white">
            <a href="/" className="flex w-fit items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-600 text-lg font-bold shadow-lg shadow-indigo-900/30">
                K
              </span>
              <span className="text-2xl font-bold">KerManager</span>
            </a>

            <div className="max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-200">
                Gestion immobiliere
              </p>
              <h1 className="mt-4 text-4xl font-bold leading-tight">
                Reprenez le controle de vos biens, loyers et dossiers clients.
              </h1>
              <p className="mt-5 max-w-md text-base leading-7 text-slate-200">
                Connectez-vous pour suivre vos paiements, vos locataires et vos
                litiges depuis un tableau de bord clair.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur">
                <strong className="block text-2xl">98%</strong>
                <span className="text-slate-200">loyers suivis</span>
              </div>
              <div className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur">
                <strong className="block text-2xl">2.4k+</strong>
                <span className="text-slate-200">biens geres</span>
              </div>
              <div className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur">
                <strong className="block text-2xl">35%</strong>
                <span className="text-slate-200">temps gagne</span>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center justify-between">
              <a href="/" className="flex items-center gap-3 lg:hidden">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white">
                  K
                </span>
                <span className="text-xl font-bold text-slate-900">
                  KerManager
                </span>
              </a>
              <a
                href="/"
                className="ml-auto text-sm font-semibold text-slate-500 transition hover:text-indigo-600"
              >
                Accueil
              </a>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
                Connexion
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                Bon retour parmi nous
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Entrez vos identifiants pour acceder a votre espace de gestion.
              </p>
            </div>

            {apiError && (
              <div className="mt-4 rounded-lg bg-rose-50 p-4 text-sm font-semibold text-rose-700">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                  Adresse email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="vous@agence.com"
                  className={`mt-2 block w-full rounded-lg border bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:ring-4 ${
                    errors.email
                      ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100"
                      : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-rose-600">{errors.email}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                    Mot de passe
                  </label>
                  <a
                    href="/forgot-password"
                    className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
                  >
                    Mot de passe oublie ?
                  </a>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Votre mot de passe"
                  className={`mt-2 block w-full rounded-lg border bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:ring-4 ${
                    errors.password
                      ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100"
                      : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"
                  }`}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-rose-600">{errors.password}</p>
                )}
              </div>

              <label className="flex items-center gap-3 text-sm text-slate-600">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                Se souvenir de moi
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connexion...
                  </>
                ) : (
                  "Se connecter"
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-600">
              Pas encore de compte ?{" "}
              <a
                href="/register"
                className="font-bold text-indigo-600 transition hover:text-indigo-700"
              >
                Creer un compte
              </a>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default LoginPage;
