import heroImage from "../../assets/register.jpg";

function RegisterPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="relative hidden overflow-hidden bg-slate-900 lg:block">
          <img
            src={heroImage}
            alt="Equipe immobiliere utilisant KerManager"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/85 via-slate-950/60 to-indigo-950/70" />
          <div className="relative flex h-full flex-col justify-between p-12 text-white">
            <a href="/" className="flex w-fit items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-600 text-lg font-bold shadow-lg shadow-indigo-900/30">
                K
              </span>
              <span className="text-2xl font-bold">KerManager</span>
            </a>

            <div className="max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-200">
                Essai gratuit
              </p>
              <h1 className="mt-4 text-4xl font-bold leading-tight">
                Lancez votre agence sur une plateforme moderne en quelques
                minutes.
              </h1>
              <p className="mt-5 max-w-md text-base leading-7 text-slate-200">
                Centralisez vos biens, automatisez le suivi des loyers et
                donnez plus de visibilite a votre equipe.
              </p>
            </div>

            <div className="rounded-lg border border-white/15 bg-white/10 p-5 backdrop-blur">
              <p className="text-sm leading-6 text-slate-100">
                "KerManager nous a aide a mieux suivre nos proprietaires,
                locataires et paiements sans multiplier les fichiers."
              </p>
              <p className="mt-4 text-sm font-bold text-white">
                Fatou Ndiaye
              </p>
              <p className="text-xs text-slate-300">Gestion Locative Senegal</p>
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
                Inscription
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                Creez votre espace agence
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Commencez gratuitement et configurez votre compte en moins de
                deux minutes.
              </p>
            </div>

            <form className="mt-8 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Prenom
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    placeholder="Awa"
                    className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Nom
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    placeholder="Diop"
                    className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="agency"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Nom de l'agence
                </label>
                <input
                  id="agency"
                  name="agency"
                  type="text"
                  autoComplete="organization"
                  placeholder="Agence Dakar Prestige"
                  className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Adresse email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="vous@agence.com"
                  className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Mot de passe
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Minimum 8 caracteres"
                  className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              <label className="flex items-start gap-3 text-sm leading-6 text-slate-600">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                J'accepte les conditions d'utilisation et la politique de
                confidentialite.
              </label>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
              >
                Creer mon compte
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-600">
              Deja inscrit ?{" "}
              <a
                href="/login"
                className="font-bold text-indigo-600 transition hover:text-indigo-700"
              >
                Se connecter
              </a>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default RegisterPage;
