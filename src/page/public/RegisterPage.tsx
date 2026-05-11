import { useState } from "react";
import { useAuth, type UserRole } from "../../context/AuthContext";

function RegisterPage() {
  const { register } = useAuth();
  const [step, setStep] = useState<"role" | "form" | "success">("role");
  const [selectedRole, setSelectedRole] = useState<UserRole | "">("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  function validate() {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Minimum 2 caractères";
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Le téléphone est requis";
    } else if (!/^\+?[0-9\s-]{8,}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Numéro de téléphone invalide";
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 8) {
      newErrors.password = "Minimum 8 caractères";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(formData.password)) {
      newErrors.password = "Majuscule, minuscule, chiffre et spécial requis";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Vous devez accepter les conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError("");

    if (!validate()) return;

    setIsSubmitting(true);
    const result = await register({
      email: formData.email,
      password: formData.password,
      name: formData.name,
      role: selectedRole as UserRole,
    });
    setIsSubmitting(false);

    if (!result.success) {
      setApiError(result.error || "Erreur d'inscription");
    } else {
      setStep("success");
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="relative hidden overflow-hidden bg-slate-900 lg:block">
          <img
            src="https://i.pinimg.com/1200x/54/58/d7/5458d72fb8b2ae4d7b632ae6298818fd.jpg"
            alt="KerManager gestion immobiliere"
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
                Rejoignez-nous
              </p>
              <h1 className="mt-4 text-4xl font-bold leading-tight">
                Simplifiez la gestion de vos biens immobiliers.
              </h1>
              <p className="mt-5 max-w-md text-base leading-7 text-slate-200">
                Créez votre compte et accédez à un tableau de bord complet pour
                suivre vos loyers, contrats et locataires.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur">
                <strong className="block text-2xl">Gratuit</strong>
                <span className="text-slate-200">14 jours d'essai</span>
              </div>
              <div className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur">
                <strong className="block text-2xl">24/7</strong>
                <span className="text-slate-200">Support client</span>
              </div>
              <div className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur">
                <strong className="block text-2xl">100%</strong>
                <span className="text-slate-200">Securise</span>
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
                href="/login"
                className="ml-auto text-sm font-semibold text-slate-500 transition hover:text-indigo-600"
              >
                Deja un compte ?
              </a>
            </div>

            {step === "role" && (
              <div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
                    Inscription - Etape 1
                  </p>
                  <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                    Vous êtes ?
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Sélectionnez votre type de compte pour continuer.
                  </p>
                </div>

                <div className="mt-8 grid gap-4">
                  <button
                    onClick={() => {
                      setSelectedRole("agency");
                      setStep("form");
                    }}
                    className="flex items-center gap-4 rounded-lg border-2 border-slate-200 p-5 text-left transition hover:border-indigo-500 hover:bg-indigo-50"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-slate-950">Agence immobiliere</p>
                      <p className="text-sm text-slate-600">Gérer plusieurs biens et locataires</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedRole("tenant");
                      setStep("form");
                    }}
                    className="flex items-center gap-4 rounded-lg border-2 border-slate-200 p-5 text-left transition hover:border-emerald-500 hover:bg-emerald-50"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-slate-950">Locataire</p>
                      <p className="text-sm text-slate-600">Suivre mes loyers et documents</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedRole("super_admin");
                      setStep("form");
                    }}
                    className="flex items-center gap-4 rounded-lg border-2 border-slate-200 p-5 text-left transition hover:border-amber-500 hover:bg-amber-50"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-slate-950">Super Admin</p>
                      <p className="text-sm text-slate-600">Administrer la plateforme</p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {step === "form" && selectedRole && (
              <div>
                <div className="mb-6">
                  <button
                    onClick={() => setStep("role")}
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-2"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Retour
                  </button>
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
                    Inscription - Etape 2
                  </p>
                  <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                    Vos informations
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Complétez votre profil pour créer votre compte.
                  </p>
                </div>

                {apiError && (
                  <div className="mt-4 rounded-lg bg-rose-50 p-4 text-sm font-semibold text-rose-700">
                    {apiError}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-slate-700">
                      Nom complet
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jean Dupont"
                      className={`mt-2 block w-full rounded-lg border bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:ring-4 ${
                        errors.name
                          ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100"
                          : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"
                      }`}
                    />
                    {errors.name && <p className="mt-1 text-sm text-rose-600">{errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                      Adresse email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="vous@exemple.com"
                      className={`mt-2 block w-full rounded-lg border bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:ring-4 ${
                        errors.email
                          ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100"
                          : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"
                      }`}
                    />
                    {errors.email && <p className="mt-1 text-sm text-rose-600">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-slate-700">
                      Téléphone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+221 77 123 45 67"
                      className={`mt-2 block w-full rounded-lg border bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:ring-4 ${
                        errors.phone
                          ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100"
                          : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"
                      }`}
                    />
                    {errors.phone && <p className="mt-1 text-sm text-rose-600">{errors.phone}</p>}
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                      Mot de passe
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="8 caractères minimum"
                      className={`mt-2 block w-full rounded-lg border bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:ring-4 ${
                        errors.password
                          ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100"
                          : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"
                      }`}
                    />
                    {errors.password && <p className="mt-1 text-sm text-rose-600">{errors.password}</p>}
                    <p className="mt-1 text-xs text-slate-500">
                      Min. 8 caractères, une majuscule, une minuscule, un chiffre, un spécial (!@#$%^&*)
                    </p>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700">
                      Confirmer le mot de passe
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirmez votre mot de passe"
                      className={`mt-2 block w-full rounded-lg border bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:ring-4 ${
                        errors.confirmPassword
                          ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100"
                          : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"
                      }`}
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-rose-600">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <label className={`flex items-start gap-3 text-sm ${errors.acceptTerms ? "text-rose-600" : "text-slate-600"}`}>
                    <input
                      type="checkbox"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>
                      J'accepte les{" "}
                      <a href="/terms" className="text-indigo-600 hover:underline">
                        conditions d'utilisation
                      </a>{" "}
                      et la{" "}
                      <a href="/privacy" className="text-indigo-600 hover:underline">
                        politique de confidentialité
                      </a>
                    </span>
                  </label>
                  {errors.acceptTerms && <p className="mt-1 text-sm text-rose-600">{errors.acceptTerms}</p>}

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
                        Création en cours...
                      </>
                    ) : (
                      "Créer mon compte"
                    )}
                  </button>
                </form>
              </div>
            )}

            {step === "success" && (
              <div className="text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                  <svg className="h-10 w-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-slate-950">Compte créé avec succès !</h2>
                <p className="mt-4 text-slate-600">
                  Votre compte a été créé. Vous allez être redirigé vers votre espace.
                </p>
                <div className="mt-8">
                  <a
                    href={
                      selectedRole === "super_admin"
                        ? "/super-admin"
                        : selectedRole === "agency"
                        ? "/agence"
                        : "/locataire"
                    }
                    className="inline-flex rounded-lg bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700"
                  >
                    Accéder à mon espace
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default RegisterPage;
