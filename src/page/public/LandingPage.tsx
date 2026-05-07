import heroImage from "../../assets/hero.jpg";

const metrics = [
  { value: "2.4k+", label: "biens supervisés" },
  { value: "98%", label: "loyers rapprochés" },
  { value: "35%", label: "temps gagné" },
];

const modules = [
  {
    title: "Gestion des biens",
    text: "Centralisez appartements, maisons, documents, disponibilités et états locatifs par agence.",
    icon: "🏠",
  },
  {
    title: "Locataires",
    text: "Suivez les dossiers, contrats, garanties, historiques et interactions avec chaque occupant.",
    icon: "👥",
  },
  {
    title: "Paiements",
    text: "Visualisez les loyers attendus, les retards, les relances et les quittances dans un tableau clair.",
    icon: "💰",
  },
  {
    title: "Litiges",
    text: "Pilotez les réclamations, preuves, statuts et résolutions sans perdre le fil.",
    icon: "⚖️",
  },
];

const activity = [
  {
    label: "Loyer reçu",
    detail: "Appartement A12 - Dakar Plateau",
    amount: "+450 000 XOF",
    type: "success",
  },
  {
    label: "Relance envoyée",
    detail: "Villa C7 - 8 jours de retard",
    amount: "En attente",
    type: "warning",
  },
  {
    label: "Litige ouvert",
    detail: "Dégât plomberie - Studio B4",
    amount: "Priorité",
    type: "danger",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "0",
    currency: "XOF",
    period: "/mois",
    features: [
      "1 agence",
      "Jusqu'à 50 biens",
      "Gestion de base",
      "Support email",
      "Tableau de bord essentiel",
    ],
    popular: false,
  },
  {
    name: "Professionnel",
    price: "15000",
    currency: "XOF",
    period: "/mois",
    features: [
      "Agences illimitées",
      "Biens illimités",
      "Automatisation avancée",
      "Support prioritaire",
      "Tableau de bord complet",
      "API accès",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Sur devis",
    currency: "XOF",
    period: "",
    features: [
      "Tout inclus",
      "Personnalisation complète",
      "Gestionnaire dédié",
      "Formation incluse",
      "SLA garanti",
      "Intégrations sur mesure",
    ],
    popular: false,
  },
];

function LandingPage() {
  return (
    <>
      {/* Schema.org structured data for SEO */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "KerManager",
          description:
            "Plateforme SaaS multi-agences pour gérer votre parc immobilier, vos loyers et vos litiges depuis un seul cockpit.",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          offers: {
            "@type": "Offer",
            price: "0.00",
            priceCurrency: "XOF",
            availability: "https://schema.org/InStock",
          },
        })}
      </script>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
        <div className="absolute inset-0 opacity-20" aria-hidden="true" />
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20 relative">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-semibold text-indigo-800 mb-4">
                🚀 La solution SaaS n°1 au Sénégal
              </div>
              <h1 className="text-balance text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Transformez la gestion de votre{" "}
                <span className="bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
                  parc immobilier
                </span>
              </h1>
              <p className="mt-4 text-pretty text-lg leading-relaxed text-gray-600">
                KerManager est la plateforme tout-en-un qui permet aux agences
                immobilières de centraliser leurs opérations, d'automatiser les
                tâches répétitives et d'offrir un service exceptionnel à leurs
                clients.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="/register"
                  className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500 hover:shadow-xl hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Commencer gratuitement
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white/80 backdrop-blur-sm px-6 py-3.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:border-indigo-300 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Découvrir les fonctionnalités
                </a>
              </div>

              <div className="mt-8 flex items-center gap-4 text-sm text-gray-500">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 border-2 border-white flex items-center justify-center text-xs font-bold text-white"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <span className="font-semibold text-gray-900">
                    +500 agences
                  </span>{" "}
                  nous font confiance
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-2xl blur-2xl opacity-20 animate-pulse" />
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
                <img
                  src={heroImage}
                  alt="Interface moderne de KerManager montrant la gestion immobilière"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="pointer-events-none absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-indigo-600/20 blur-3xl" />
              <div className="pointer-events-none absolute -top-6 -right-6 h-32 w-32 rounded-full bg-indigo-400/20 blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">
              Fonctionnalités
            </span>
            <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Pourquoi choisir KerManager ?
            </h2>
            <p className="mt-3 text-pretty text-lg leading-relaxed text-gray-600">
              Une plateforme conçue spécifiquement pour les défis uniques de la
              gestion immobilière moderne.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {modules.map((module) => (
              <div
                key={module.title}
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:border-indigo-200 hover:-translate-y-1"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-200 text-2xl">
                  {module.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {module.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {module.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:border-indigo-200 hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-200 text-2xl">
                📊
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Analytics avancés
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Obtenez des insights précieux sur votre activité avec des
                rapports personnalisables et des tableaux de bord en temps réel.
              </p>
            </div>

            <div className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:border-indigo-200 hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-200 text-2xl">
                🔒
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Sécurité renforcée
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Vos données sont protégées avec le chiffrement de pointe, des
                sauvegardes automatiques et une conformité RGPD.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-indigo-50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Des résultats qui parlent d'eux-mêmes
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1"
              >
                <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-br from-indigo-500/10 to-indigo-600/10 rounded-full blur-3xl group-hover:scale-150 transition-transform" />
                <div className="relative">
                  <div className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
                    {metric.value}
                  </div>
                  <div className="mt-2 text-base font-medium text-gray-600">
                    {metric.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Comment ça fonctionne ?
            </h2>
            <p className="mt-3 text-pretty text-lg leading-relaxed text-gray-600">
              En 3 étapes simples, transformez votre gestion immobilière en un
              processus fluide et efficace.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Configurez votre agence",
                desc: "Personnalisez votre espace de travail selon vos besoins spécifiques : propriétés, tarifs, équipes et flux de travail.",
                icon: "⚙️",
              },
              {
                step: "02",
                title: "Centralisez vos données",
                desc: "Importez ou saisissez vos biens, locataires, contrats et documents. Tout est synchronisé en temps réel.",
                icon: "📁",
              },
              {
                step: "03",
                title: "Automatisez et développez",
                desc: "Laissez KerManager gérer les tâches répétitives : rappels de loyers, génération de quittances, suivi des maintenances.",
                icon: "🚀",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-xl hover:border-indigo-200 hover:-translate-y-0"
              >
                <div className="absolute -top-4 -left-4 h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-400 flex items-center justify-center text-2xl shadow-lg">
                  {item.icon}
                </div>
                <div className="mt-8">
                  <div className="text-sm font-semibold text-indigo-600">
                    {item.step}
                  </div>
                  <h3 className="mt-3 text-xl font-semibold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-base leading-relaxed text-gray-600">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Aperçu de votre tableau de bord
            </h2>
            <p className="mt-3 text-pretty text-lg leading-relaxed text-gray-300">
              Visualisez en un coup d'œil les indicateurs clés de votre activité
              immobilière.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-gray-700 bg-gray-800/50 backdrop-blur-sm p-6 shadow-xl">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-8">
                    <div>
                      <div className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-300 bg-clip-text text-transparent">
                        12.8M
                      </div>
                      <div className="mt-1 text-sm text-gray-400">
                        Revenus mensuels
                      </div>
                    </div>
                    <div>
                      <div className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                        +18%
                      </div>
                      <div className="mt-1 text-sm text-gray-400">
                        Croissance
                      </div>
                    </div>
                  </div>
                  <span className="rounded-full border border-gray-600 bg-gray-700/50 px-3 py-1 text-sm text-gray-300">
                    Mai 2026
                  </span>
                </div>

                <div className="mt-6 flex items-end gap-2 h-32">
                  <div className="h-12 w-3 rounded bg-indigo-500/80 hover:h-14 transition-all" />
                  <div className="h-16 w-3 rounded bg-indigo-500/80 hover:h-20 transition-all" />
                  <div className="h-22 w-3 rounded bg-indigo-500/80 hover:h-28 transition-all" />
                  <div className="h-28 w-3 rounded bg-indigo-400 hover:h-32 transition-all" />
                  <div className="h-18 w-3 rounded bg-indigo-500/80 hover:h-24 transition-all" />
                  <div className="h-24 w-3 rounded bg-indigo-500/40 hover:h-28 transition-all" />
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="overflow-hidden rounded-xl border border-gray-700 bg-gray-900/50">
                    <img
                      src={heroImage}
                      alt="Vue d'une propriété gérée dans KerManager"
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="text-xl font-semibold">Résidence Almadies</div>
                    <div className="mt-1 text-sm text-gray-400">
                      24 unités • 3 loyers en retard
                    </div>
                    <div className="mt-4 text-sm text-gray-300">
                      Suivi en temps réel, alertes et automatisations pour
                      garder le contrôle.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="rounded-2xl border border-gray-700 bg-gray-800/50 backdrop-blur-sm p-6 shadow-xl">
                <h4 className="text-xl font-semibold">Activité récente</h4>
                <div className="mt-4 space-y-3">
                  {activity.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between gap-4 rounded-xl border border-gray-700 bg-gray-900/50 p-3 transition-all hover:bg-gray-800/50"
                    >
                      <div>
                        <div className="text-sm font-medium">{item.label}</div>
                        <div className="text-xs text-gray-400">{item.detail}</div>
                      </div>
                      <div
                        className={`text-sm font-semibold ${
                          item.type === "success"
                            ? "text-emerald-400"
                            : item.type === "warning"
                              ? "text-amber-400"
                              : "text-red-400"
                        }`}
                      >
                        {item.amount}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">
              Témoignages
            </span>
            <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Ce que nos clients disent
            </h2>
            <p className="mt-3 text-pretty text-lg leading-relaxed text-gray-600">
              Des agences immobilières qui ont transformé leur activité avec
              KerManager
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <blockquote className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm transition-all hover:shadow-xl">
              <div className="flex items-center gap-1 text-indigo-500 mb-4">
                {"★★★★★".split("").map((_, i) => (
                  <svg key={i} className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-base leading-relaxed text-gray-700">
                « KerManager a réduit notre temps de gestion de 40% et amélioré
                significativement notre taux de recouvrement. Nous pouvons enfin
                nous concentrer sur le développement de notre activité plutôt
                que sur la paperasse. »
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h4 className="font-semibold text-gray-900">Amadou Diop</h4>
                <p className="text-sm text-gray-500">
                  Dirigeant, Agence Immobilière Dakar Prestige
                </p>
              </div>
            </blockquote>

            <blockquote className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm transition-all hover:shadow-xl">
              <div className="flex items-center gap-1 text-indigo-500 mb-4">
                {"★★★★★".split("").map((_, i) => (
                  <svg key={i} className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-base leading-relaxed text-gray-700">
                « La gestion des litiges est devenue transparente et nos clients
                sont plus satisfaits grâce au suivi en temps réel. Nous avons
                réduit les délais de résolution de 60% tout en améliorant notre
                réputation. »
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h4 className="font-semibold text-gray-900">Fatou Ndiaye</h4>
                <p className="text-sm text-gray-500">
                  Responsable, Gestion Locative Sénégal
                </p>
              </div>
            </blockquote>

            <blockquote className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm transition-all hover:shadow-xl">
              <div className="flex items-center gap-1 text-indigo-500 mb-4">
                {"★★★★★".split("").map((_, i) => (
                  <svg key={i} className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-base leading-relaxed text-gray-700">
                « L'interface intuitive permet à toute notre équipe de
                travailler efficacement sans formation lourde. L'adoption a été
                immédiate et le ROI s'est fait sentir dès le premier mois. »
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h4 className="font-semibold text-gray-900">Ousmane Sow</h4>
                <p className="text-sm text-gray-500">
                  CTO, Réseau Agences Ouest
                </p>
              </div>
            </blockquote>
          </div>
        </div>
      </section>

            {/* Pricing Section */}
      <section className="bg-gradient-to-br from-gray-50 to-indigo-50/30 py-20" id="pricing">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">Tarifs</span>
            <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Tarifs simples et transparents
            </h2>
            <p className="mt-3 text-pretty text-lg leading-relaxed text-gray-600">
              Choisissez le plan qui correspond à vos besoins. Pas de frais
              cachés, pas d'engagement à long terme.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`group relative rounded-2xl border bg-white p-8 transition-all hover:-translate-y-2 ${
                  plan.popular 
                    ? "border-indigo-500 shadow-xl shadow-indigo-200" 
                    : "border-gray-200 shadow-sm hover:shadow-xl"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-1 text-xs font-semibold text-white shadow-lg">
                    ✨ Le plus populaire
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                </div>

                <div className="mt-4">
                  {plan.price === "Sur devis" ? (
                    <span className="text-2xl font-bold text-gray-900">Sur devis</span>
                  ) : (
                    <>
                      <span className="text-4xl font-bold text-gray-900">
                        {plan.price} <span className="text-base font-normal text-gray-500">{plan.currency}</span>
                      </span>
                      <span className="text-base text-gray-500">{plan.period}</span>
                    </>
                  )}
                </div>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="h-4 w-4 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <a
                    href="/register"
                    className={`inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                      plan.popular 
                        ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-200 hover:shadow-xl hover:scale-105" 
                        : "border border-gray-300 bg-white text-gray-700 hover:border-indigo-300 hover:bg-indigo-50"
                    }`}
                  >
                    {plan.price === "Sur devis" ? "Obtenir un devis" : "Commencer l'essai gratuit"}
                  </a>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-gray-600">
            🎁 Tous les plans incluent un essai gratuit de 14 jours. Pas de carte
            bancaire requise pour démarrer.
          </p>
        </div>{/* Fermeture de la div mx-auto */}
      </section>{/* Fermeture de la section Pricing */}

           {/* Call to Action Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800 py-20">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Prêt à révolutionner votre gestion immobilière ?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-indigo-100">
            Rejoignez les centaines d'agences qui ont déjà transformé leur
            activité avec KerManager.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-base font-semibold text-indigo-600 shadow-lg transition-all hover:bg-gray-50 hover:scale-105 hover:shadow-xl"
            >
              Commencer l'essai gratuit
              <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl border-2 border-white/30 bg-white/10 backdrop-blur-sm px-8 py-4 text-base font-semibold text-white transition-all hover:bg-white/20 hover:scale-105"
            >
              Contacter les ventes
            </a>
          </div>
          <p className="mt-6 text-sm text-indigo-200">
            🔒 Essai gratuit de 14 jours • Aucune carte bancaire requise • Annulation à tout moment
          </p>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 font-bold text-white shadow-lg">K</div>
                <span className="text-xl font-semibold">KerManager</span>
              </div>
              <p className="mt-4 text-sm text-gray-400">Plateforme de gestion immobilière SaaS.</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white">Produit</h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li><a href="#features" className="text-gray-400 hover:text-indigo-400">Fonctionnalités</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-indigo-400">Tarifs</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white">Ressources</h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-indigo-400">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-indigo-400">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white">Entreprise</h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-indigo-400">À propos</a></li>
                <li><a href="#" className="text-gray-400 hover:text-indigo-400">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 border-t border-gray-800 pt-8 text-center">
            <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} KerManager. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default LandingPage;