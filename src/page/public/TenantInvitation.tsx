import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

function TenantInvitation() {
  const { login } = useAuth();
  const [invitation, setInvitation] = useState<{
    tenantName: string;
    propertyName: string;
    email: string;
  } | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      const storedInvitations = JSON.parse(
        localStorage.getItem("kermanager.invitations") || "[]",
      );
      const invite = storedInvitations.find((i: { token: string }) => i.token === token);
      if (invite) {
        setInvitation(invite);
      } else {
        setApiError("Lien d'invitation invalide ou expiré");
      }
    } else {
      setApiError("Aucun lien d'invitation fourni");
    }
  }, []);

  function validate() {
    const newErrors: Record<string, string> = {};

    if (!password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (password.length < 8) {
      newErrors.password = "Minimum 8 caractères";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(password)) {
      newErrors.password = "Majuscule, minuscule, chiffre et spécial requis";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError("");

    if (!validate() || !invitation) return;

    setIsSubmitting(true);

    const users = JSON.parse(localStorage.getItem("kermanager.users") || "[]");
    const storedInvitations = JSON.parse(
      localStorage.getItem("kermanager.invitations") || "[]",
    );

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    const inviteIndex = storedInvitations.findIndex(
      (i: { token: string }) => i.token === token,
    );

    if (inviteIndex === -1) {
      setApiError("Invitation introuvable");
      setIsSubmitting(false);
      return;
    }

    const invite = storedInvitations[inviteIndex];

    if (users.some((u: { email: string }) => u.email === invite.email)) {
      setApiError("Ce locataire a déjà un compte");
      setIsSubmitting(false);
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      email: invite.email,
      password,
      name: invite.tenantName,
      role: "tenant" as const,
    };

    users.push(newUser);
    localStorage.setItem("kermanager.users", JSON.stringify(users));

    storedInvitations[inviteIndex] = {
      ...invite,
      isRegistered: true,
      passwordSetAt: new Date().toISOString(),
    };
    localStorage.setItem(
      "kermanager.invitations",
      JSON.stringify(storedInvitations),
    );

    const result = await login(invite.email, password);
    setIsSubmitting(false);

    if (result.success) {
      setIsSuccess(true);
    } else {
      setApiError(result.error || "Erreur lors de la connexion");
    }
  }

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <svg className="h-10 w-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-slate-950">Compte activé !</h2>
          <p className="mt-4 text-slate-600">
            Votre mot de passe a été défini avec succès. Vous allez être redirigé vers votre espace locataire.
          </p>
          <div className="mt-8">
            <a
              href="/locataire"
              className="inline-flex rounded-lg bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700"
            >
              Accéder à mon espace
            </a>
          </div>
        </div>
      </main>
    );
  }

  if (!invitation) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-rose-100">
            <svg className="h-10 w-10 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-slate-950">Erreur</h2>
          <p className="mt-4 text-slate-600">{apiError || "Lien d'invitation invalide"}</p>
          <div className="mt-8">
            <a href="/login" className="inline-flex rounded-lg bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700">
              Retour à la connexion
            </a>
          </div>
        </div>
      </main>
    );
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
                Invitation locataire
              </p>
              <h1 className="mt-4 text-4xl font-bold leading-tight">
                Activez votre compte locataire
              </h1>
              <p className="mt-5 max-w-md text-base leading-7 text-slate-200">
                Votre agence vous a invité à rejoindre KerManager.
                Définissez votre mot de passe pour accéder à vos documents et loyers.
              </p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center justify-between lg:hidden">
              <a href="/" className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white">
                  K
                </span>
                <span className="text-xl font-bold text-slate-900">KerManager</span>
              </a>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
                Activation du compte
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                Bienvenue, {invitation.tenantName}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Vous êtes invité(e) sur <strong>{invitation.propertyName}</strong>.
                Définissez votre mot de passe pour activer votre compte.
              </p>
            </div>

            {apiError && (
              <div className="mt-4 rounded-lg bg-rose-50 p-4 text-sm font-semibold text-rose-700">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                  Mot de passe
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                    Activation en cours...
                  </>
                ) : (
                  "Activer mon compte"
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-600">
              Déjà un compte ?{" "}
              <a href="/login" className="font-bold text-indigo-600 transition hover:text-indigo-700">
                Connectez-vous
              </a>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default TenantInvitation;