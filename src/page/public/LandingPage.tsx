import heroImage from "../../assets/hero.png";

const metrics = [
  { value: "2.4k+", label: "biens supervisés" },
  { value: "98%", label: "loyers rapprochés" },
  { value: "35%", label: "temps gagné" },
];

const modules = [
  {
    title: "Gestion des biens",
    text: "Centralisez appartements, maisons, documents, disponibilités et états locatifs par agence.",
    icon: "B",
  },
  {
    title: "Locataires",
    text: "Suivez les dossiers, contrats, garanties, historiques et interactions avec chaque occupant.",
    icon: "L",
  },
  {
    title: "Paiements",
    text: "Visualisez les loyers attendus, les retards, les relances et les quittances dans un tableau clair.",
    icon: "P",
  },
  {
    title: "Litiges",
    text: "Pilotez les réclamations, preuves, statuts et résolutions sans perdre le fil.",
    icon: "R",
  },
];

const activity = [
  {
    label: "Loyer reçu",
    detail: "Appartement A12 - Dakar Plateau",
    amount: "+450 000 XOF",
  },
  {
    label: "Relance envoyée",
    detail: "Villa C7 - 8 jours de retard",
    amount: "En attente",
  },
  {
    label: "Litige ouvert",
    detail: "Dégât plomberie - Studio B4",
    amount: "Priorité",
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
      <section className="relative overflow-hidden bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h1 className="text-balance text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                Transformez la gestion de votre parc immobilier
              </h1>
              <p className="mt-4 text-pretty text-lg leading-relaxed text-slate-600">
                KerManager est la plateforme tout-en-un qui permet aux agences
                immobilières de centraliser leurs opérations, d'automatiser les
                tâches répétitives et d'offrir un service exceptionnel à leurs
                clients.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="/register"
                  className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Commencer gratuitement
                </a>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Découvrir les fonctionnalités
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
                <img
                  src={heroImage}
                  alt="Interface moderne de KerManager montrant la gestion immobilière"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="pointer-events-none absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-indigo-600/10 blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <div className="max-w-2xl">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Pourquoi choisir KerManager ?
            </h2>
            <p className="mt-3 text-pretty text-lg leading-relaxed text-slate-600">
              Une plateforme conçue spécifiquement pour les défis uniques de la
              gestion immobilière moderne.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {modules.map((module) => (
              <div
                key={module.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-700">
                  <span className="text-xl font-semibold">{module.icon}</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  {module.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {module.text}
                </p>
              </div>
            ))}

            {/* Additional feature cards */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-700">
                <span className="text-xl">📊</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                Analytics avancés
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Obtenez des insights précieux sur votre activité avec des
                rapports personnalisables et des tableaux de bord en temps réel.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-700">
                <span className="text-xl">🔒</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                Sécurité renforcée
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Vos données sont protégées avec le chiffrement de pointe, des
                sauvegardes automatiques et une conformité RGPD.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <div className="max-w-2xl">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Des résultats qui parlent d'eux-mêmes
            </h2>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
              >
                <div className="text-3xl font-bold text-slate-900">
                  {metric.value}
                </div>
                <div className="mt-2 text-sm font-medium text-slate-600">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <div className="max-w-2xl">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Comment ça fonctionne ?
            </h2>
            <p className="mt-3 text-pretty text-lg leading-relaxed text-slate-600">
              En 3 étapes simples, transformez votre gestion immobilière en un
              processus fluide et efficace.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold text-indigo-600">01</div>
              <h3 className="mt-3 text-lg font-semibold text-slate-900">
                Configurez votre agence
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Personnalisez votre espace de travail selon vos besoins
                spécifiques : propriétés, tarifs, équipes et flux de travail.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold text-indigo-600">02</div>
              <h3 className="mt-3 text-lg font-semibold text-slate-900">
                Centralisez vos données
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Importez ou saisissez vos biens, locataires, contrats et
                documents. Tout est synchronisé en temps réel.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold text-indigo-600">03</div>
              <h3 className="mt-3 text-lg font-semibold text-slate-900">
                Automatisez et développez
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Laissez KerManager gérer les tâches répétitives : rappels de
                loyers, génération de quittances, suivi des maintenances.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="bg-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <div className="max-w-2xl">
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Aperçu de votre tableau de bord
            </h2>
            <p className="mt-3 text-pretty text-lg leading-relaxed text-slate-300">
              Visualisez en un coup d'œil les indicateurs clés de votre activité
              immobilière.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-8">
                    <div>
                      <div className="text-3xl font-bold">12.8M</div>
                      <div className="mt-1 text-sm text-slate-300">
                        Revenus mensuels
                      </div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold">+18%</div>
                      <div className="mt-1 text-sm text-slate-300">
                        Croissance
                      </div>
                    </div>
                  </div>
                  <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm text-slate-200">
                    Mai 2026
                  </span>
                </div>

                <div className="mt-6 flex items-end gap-2">
                  <div className="h-12 w-3 rounded bg-indigo-500/80" />
                  <div className="h-16 w-3 rounded bg-indigo-500/80" />
                  <div className="h-22 w-3 rounded bg-indigo-500/80" />
                  <div className="h-28 w-3 rounded bg-indigo-400" />
                  <div className="h-18 w-3 rounded bg-indigo-500/80" />
                  <div className="h-24 w-3 rounded bg-indigo-500/40" />
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20">
                    <img
                      src={heroImage}
                      alt="Vue d'une propriété gérée dans KerManager"
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="text-lg font-semibold">
                      Résidence Almadies
                    </div>
                    <div className="mt-1 text-sm text-slate-300">
                      24 unités • 3 loyers en retard
                    </div>
                    <div className="mt-4 text-sm text-slate-300">
                      Suivi en temps réel, alertes et automatisations pour
                      garder le contrôle.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h4 className="text-lg font-semibold">Activité récente</h4>
                <div className="mt-4 space-y-3">
                  {activity.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-black/10 p-3"
                    >
                      <div>
                        <div className="text-sm font-medium">{item.label}</div>
                        <div className="text-xs text-slate-300">
                          {item.detail}
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-indigo-200">
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
       <section className="bg-slate-50">
         <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
           <div className="max-w-2xl">
             <h2 className="text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
               Ce que nos clients disent
             </h2>
             <p className="mt-3 text-pretty text-lg leading-relaxed text-slate-600">
               Des agences immobilières qui ont transformé leur activité avec
               KerManager
             </p>
           </div>

           <div className="mt-10 grid gap-6 md:grid-cols-3">
             <blockquote className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
               <p className="text-sm leading-relaxed text-slate-600">
                 « KerManager a réduit notre temps de gestion de 40% et amélioré
                 significativement notre taux de recouvrement. Nous pouvons enfin
                 nous concentrer sur le développement de notre activité plutôt que
                 sur la paperasse. »
               </p>
               <div className="mt-4">
                 <h4 className="font-semibold text-slate-900">Amadou Diop</h4>
                 <p className="text-sm text-slate-500">Dirigeant, Agence Immobilière Dakar Prestige</p>
               </div>
             </blockquote>

             <blockquote className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
               <p className="text-sm leading-relaxed text-slate-600">
                 « La gestion des litiges est devenue transparente et nos clients
                 sont plus satisfaits grâce au suivi en temps réel. Nous avons
                 réduit les délais de résolution de 60% tout en améliorant notre
                 réputation. »
               </p>
               <div className="mt-4">
                 <h4 className="font-semibold text-slate-900">Fatou Ndiaye</h4>
                 <p className="text-sm text-slate-500">Responsable, Gestion Locative Sénégal</p>
               </div>
             </blockquote>

             <blockquote className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
               <p className="text-sm leading-relaxed text-slate-600">
                 « L'interface intuitive permet à toute notre équipe de travailler
                 efficacement sans formation lourde. L'adoption a été immédiate et
                 le ROI s'est fait sentir dès le premier mois. »
               </p>
               <div className="mt-4">
                 <h4 className="font-semibold text-slate-900">Ousmane Sow</h4>
                 <p className="text-sm text-slate-500">CTO, Réseau Agences Ouest</p>
               </div>
             </blockquote>
           </div>
         </div>
       </section>

{/* Pricing Section */}
       <section className="bg-white" id="pricing">
         <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
           <div className="max-w-2xl">
             <h2 className="text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
               Tarifs simples et transparents
             </h2>
             <p className="mt-3 text-pretty text-lg leading-relaxed text-slate-600">
               Choisissez le plan qui correspond à vos besoins. Pas de frais
               cachés, pas d'engagement à long terme.
             </p>
           </div>

           <div className="mt-10 grid gap-6 md:grid-cols-3">
             {pricingPlans.map((plan) => (
               <div
                 key={plan.name}
                 className={`rounded-2xl border ${plan.popular ? "border-indigo-600 shadow-lg" : "border-slate-200 shadow-sm"} bg-white p-6`}
               >
                 <div className="flex items-center justify-between">
                   <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
                   {plan.popular && (
                     <span className="rounded-full bg-indigo-600 px-2 py-1 text-xs font-medium text-white">
                       Populaire
                     </span>
                   )}
                 </div>

                 <div className="mt-4">
                   <span className="text-3xl font-bold text-slate-900">{plan.price === "Sur devis" ? "Sur devis" : `${plan.price} ${plan.currency}`}</span>
                   {plan.period && <span className="text-slate-600">{plan.period}</span>}
                 </div>

                 <ul className="mt-6 space-y-3">
                   {plan.features.map((feature, idx) => (
                     <li key={idx} className="text-sm text-slate-600">
                       ✓ {feature}
                     </li>
                   ))}
                 </ul>

                 <div className="mt-8">
                   <a
                     href="/register"
                     className={`inline-flex w-full items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition ${plan.popular ? "bg-indigo-600 text-white hover:bg-indigo-500" : "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50"}`}
                   >
                     {plan.price === "Sur devis" ? "Obtenir un devis" : "Commencer l'essai"}
                   </a>
                 </div>
               </div>
             ))}
           </div>

           <p className="mt-8 text-center text-sm text-slate-600">
             Tous les plans incluent un essai gratuit de 14 jours. Pas de carte
             bancaire requise pour démarrer.
           </p>
         </div>
       </section>

{/* Call to Action Section */}
       <section className="bg-indigo-600">
         <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
           <div className="text-center">
             <h2 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
               Prêt à révolutionner votre gestion immobilière ?
             </h2>
             <p className="mt-4 text-lg text-indigo-100">
               Rejoignez les centaines d'agences qui ont déjà transformé leur
               activité avec KerManager.
             </p>
             <a
               href="/register"
               className="mt-8 inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-slate-50"
             >
               Commencer l'essai gratuit
             </a>
           </div>
         </div>
       </section>

       {/* Footer */}
       <footer className="bg-slate-900 text-white">
         <div className="mx-auto max-w-6xl px-4 py-12">
           <div className="flex items-center gap-2">
             <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold">K</span>
             <span className="text-xl font-semibold">KerManager</span>
           </div>
           <p className="mt-4 max-w-md text-sm text-slate-300">
             La plateforme de gestion immobilière SaaS qui simplifie vos
             opérations quotidiennes et vous permet de vous concentrer sur ce qui
             compte vraiment : développer votre activité.
           </p>
           <div className="mt-8 grid gap-8 md:grid-cols-3">
             <div>
               <h4 className="font-semibold">Produit</h4>
               <ul className="mt-4 space-y-2 text-sm">
                 <li><a href="#features" className="text-slate-300 hover:text-white">Fonctionnalités</a></li>
                 <li><a href="#pricing" className="text-slate-300 hover:text-white">Tarifs</a></li>
                 <li><a href="#workflow" className="text-slate-300 hover:text-white">Comment ça marche</a></li>
               </ul>
             </div>
             <div>
               <h4 className="font-semibold">Ressources</h4>
               <ul className="mt-4 space-y-2 text-sm">
                 <li><a href="/blog" className="text-slate-300 hover:text-white">Blog</a></li>
                 <li><a href="/docs" className="text-slate-300 hover:text-white">Documentation</a></li>
                 <li><a href="/support" className="text-slate-300 hover:text-white">Support</a></li>
               </ul>
             </div>
             <div>
               <h4 className="font-semibold">Entreprise</h4>
               <ul className="mt-4 space-y-2 text-sm">
                 <li><a href="/about" className="text-slate-300 hover:text-white">À propos</a></li>
                 <li><a href="/contact" className="text-slate-300 hover:text-white">Contact</a></li>
                 <li><a href="/legal" className="text-slate-300 hover:text-white">Mentions légales</a></li>
               </ul>
             </div>
           </div>
           <div className="mt-8 border-t border-white/10 pt-8 flex items-center justify-between">
             <p className="text-sm text-slate-300">
               &copy; {new Date().getFullYear()} KerManager. Tous droits
               réservés.
             </p>
             <div className="flex gap-4">
               <a href="#" className="text-slate-300 hover:text-white" aria-label="LinkedIn">in</a>
               <a href="#" className="text-slate-300 hover:text-white" aria-label="Twitter">t</a>
               <a href="#" className="text-slate-300 hover:text-white" aria-label="Facebook">f</a>
             </div>
           </div>
         </div>
       </footer>
    </>
  );
}

export default LandingPage;
