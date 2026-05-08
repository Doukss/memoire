import { useState } from "react";
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

export const activity = [
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-500 font-bold text-white shadow-lg">
                K
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
                KerManager
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-indigo-600 transition-colors font-medium"
              >
                Fonctionnalités
              </a>
              <a
                href="#pricing"
                className="text-gray-600 hover:text-indigo-600 transition-colors font-medium"
              >
                Tarifs
              </a>
              <a
                href="#testimonials"
                className="text-gray-600 hover:text-indigo-600 transition-colors font-medium"
              >
                Témoignages
              </a>
              <a
                href="/contact"
                className="text-gray-600 hover:text-indigo-600 transition-colors font-medium"
              >
                Contact
              </a>
              <a
                href="/login"
                className="text-gray-700 hover:text-indigo-600 transition-colors font-medium"
              >
                Connexion
              </a>
              <a
                href="/register"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition-all hover:shadow-lg hover:shadow-indigo-600/30 hover:scale-105"
              >
                Essai gratuit
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 animate-fade-in-up">
              <div className="flex flex-col gap-3">
                <a
                  href="#features"
                  className="text-gray-600 hover:text-indigo-600 transition-colors font-medium py-2"
                >
                  Fonctionnalités
                </a>
                <a
                  href="#pricing"
                  className="text-gray-600 hover:text-indigo-600 transition-colors font-medium py-2"
                >
                  Tarifs
                </a>
                <a
                  href="#testimonials"
                  className="text-gray-600 hover:text-indigo-600 transition-colors font-medium py-2"
                >
                  Témoignages
                </a>
                <a
                  href="/contact"
                  className="text-gray-600 hover:text-indigo-600 transition-colors font-medium py-2"
                >
                  Contact
                </a>
                <div className="flex gap-3 pt-2">
                  <a
                    href="/login"
                    className="flex-1 text-center rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Connexion
                  </a>
                  <a
                    href="/register"
                    className="flex-1 text-center rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-md"
                  >
                    Essai gratuit
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section with Background Image */}
      <section className="relative min-h-screen overflow-hidden pt-16">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-indigo-900/80" />
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-r from-indigo-400/20 to-indigo-500/20 blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-r from-indigo-400/20 to-indigo-500/20 blur-3xl animate-pulse animation-delay-1000" />
        </div>

        {/* Hero Content */}
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left content - Text */}
            <div className="space-y-8 animate-fade-in-up">
              {/* Badge */}
              <div className="inline-flex">
                <div className="relative group">
                  <div className="absolute inset-0 rounded-full bg-indigo-500 blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                  <div className="relative inline-flex items-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 text-sm font-semibold text-white shadow-lg">
                    <span className="mr-2 text-xl">🚀</span>
                    La solution SaaS n°1 au Sénégal
                    <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  </div>
                </div>
              </div>

              {/* Main heading */}
              <h1>
                <span className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white block">
                  Transformez la gestion de votre
                </span>
                <span className="mt-2 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 via-indigo-300 to-white bg-clip-text text-transparent block">
                  parc immobilier
                </span>
              </h1>

              {/* Description */}
              <p className="text-pretty text-lg leading-relaxed text-gray-200 max-w-lg">
                KerManager est la plateforme tout-en-un qui permet aux agences
                immobilières de centraliser leurs opérations, d'automatiser les
                tâches répétitives et d'offrir un service exceptionnel à leurs
                clients.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/register"
                  className="group relative inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-600/40 hover:scale-105 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    Commencer gratuitement
                    <svg
                      className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
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
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-[#d5bdaf] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </a>

                <a
                  href="#features"
                  className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 backdrop-blur-sm px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/20 hover:scale-105"
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Découvrir les fonctionnalités
                </a>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-3">
                  {[
                    { name: "Amadou", color: "from-indigo-400 to-indigo-600" },
                    { name: "Fatou", color: "from-emerald-400 to-emerald-600" },
                    { name: "Ousmane", color: "from-purple-400 to-purple-600" },
                    { name: "Mariama", color: "from-rose-400 to-rose-600" },
                  ].map((person, i) => (
                    <div key={i} className="relative group/avatar">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-lg transition-transform duration-300 group-hover/avatar:scale-110">
                        {person.name[0]}
                      </div>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                        {person.name}
                      </div>
                    </div>
                  ))}
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-500 to-gray-600 border-2 border-white flex items-center justify-center text-xs font-bold text-white">
                    +
                  </div>
                </div>
                <div className="text-sm text-gray-200">
                  <span className="font-semibold text-white">+500 agences</span>
                  <span className="mx-1">•</span>
                  <span className="text-indigo-300 font-semibold">
                    98% satisfaites
                  </span>
                </div>
              </div>
            </div>

            {/* Right content - Empty for minimal design (image is background) */}
            <div className="hidden lg:block" />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center gap-2 text-white/60">
            <span className="text-xs font-medium">Découvrir plus</span>
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
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
        </div>
      </section>

      {/* Rest of your sections remain the same */}
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

      {/* Add id="testimonials" to your testimonials section */}
      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="relative py-20 overflow-hidden bg-gradient-to-b from-white to-indigo-50/30"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-r from-indigo-200/30 to-indigo-300/30 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-r from-indigo-200/20 to-indigo-300/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-semibold text-indigo-800 mb-4">
              <span className="mr-2">💬</span>
              Témoignages
            </div>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Ce que nos clients disent de{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
                KerManager
              </span>
            </h2>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-gray-600 max-w-2xl mx-auto">
              Des agences immobilières qui ont transformé leur activité avec
              notre plateforme
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Testimonial 1 */}
            <div className="group relative rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-gray-100">
              {/* Quote icon */}
              <div className="absolute top-6 right-6 text-6xl text-indigo-100 font-serif opacity-50 group-hover:opacity-100 transition-opacity">
                "
              </div>

              {/* Stars */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>

              {/* Quote text */}
              <blockquote className="relative z-10">
                <p className="text-gray-700 leading-relaxed mb-6 text-base">
                  "KerManager a réduit notre temps de gestion de 40% et amélioré
                  significativement notre taux de recouvrement. Nous pouvons
                  enfin nous concentrer sur le développement de notre activité
                  plutôt que sur la paperasse administrative."
                </p>
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  AD
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Amadou Diop</h4>
                  <p className="text-sm text-gray-500">
                    Dirigeant, Agence Immobilière Dakar Prestige
                  </p>
                </div>
              </div>

              {/* Verification badge */}
              <div className="absolute bottom-6 right-6">
                <div className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  <svg
                    className="h-3 w-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Client vérifié</span>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="group relative rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-gray-100">
              <div className="absolute top-6 right-6 text-6xl text-indigo-100 font-serif opacity-50 group-hover:opacity-100 transition-opacity">
                "
              </div>

              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>

              <blockquote>
                <p className="text-gray-700 leading-relaxed mb-6 text-base">
                  "La gestion des litiges est devenue transparente et nos
                  clients sont plus satisfaits grâce au suivi en temps réel.
                  Nous avons réduit les délais de résolution de 60% tout en
                  améliorant notre réputation sur le marché."
                </p>
              </blockquote>

              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  FN
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Fatou Ndiaye</h4>
                  <p className="text-sm text-gray-500">
                    Responsable, Gestion Locative Sénégal
                  </p>
                </div>
              </div>

              <div className="absolute bottom-6 right-6">
                <div className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  <svg
                    className="h-3 w-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Client vérifié</span>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="group relative rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-gray-100">
              <div className="absolute top-6 right-6 text-6xl text-indigo-100 font-serif opacity-50 group-hover:opacity-100 transition-opacity">
                "
              </div>

              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>

              <blockquote>
                <p className="text-gray-700 leading-relaxed mb-6 text-base">
                  "L'interface intuitive permet à toute notre équipe de
                  travailler efficacement sans formation lourde. L'adoption a
                  été immédiate et le ROI s'est fait sentir dès le premier mois
                  d'utilisation."
                </p>
              </blockquote>

              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  OS
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Ousmane Sow</h4>
                  <p className="text-sm text-gray-500">
                    CTO, Réseau Agences Ouest
                  </p>
                </div>
              </div>

              <div className="absolute bottom-6 right-6">
                <div className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  <svg
                    className="h-3 w-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Client vérifié</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Stats Bar */}

          {/* Trust indicators */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500 mb-4">
              Ils nous font confiance
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {[
                "Agence Prestige",
                "Gestion Locative Pro",
                "Immobilier Plus",
                "Réseau Ouest",
                "Dakar Habitation",
              ].map((company, i) => (
                <span
                  key={i}
                  className="text-gray-600 font-medium text-sm hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  {company}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />
      </section>

      {/* Pricing Section */}
      <section
        className="bg-gradient-to-br from-gray-50 to-indigo-50/30 py-20"
        id="pricing"
      >
        {/* Your existing pricing content */}
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">
              Tarifs
            </span>
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
                  <h3 className="text-xl font-bold text-gray-900">
                    {plan.name}
                  </h3>
                </div>

                <div className="mt-4">
                  {plan.price === "Sur devis" ? (
                    <span className="text-2xl font-bold text-gray-900">
                      Sur devis
                    </span>
                  ) : (
                    <>
                      <span className="text-4xl font-bold text-gray-900">
                        {plan.price}{" "}
                        <span className="text-base font-normal text-gray-500">
                          {plan.currency}
                        </span>
                      </span>
                      <span className="text-base text-gray-500">
                        {plan.period}
                      </span>
                    </>
                  )}
                </div>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <svg
                        className="h-4 w-4 text-indigo-600 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
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
                    {plan.price === "Sur devis"
                      ? "Obtenir un devis"
                      : "Commencer l'essai gratuit"}
                  </a>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-gray-600">
            🎁 Tous les plans incluent un essai gratuit de 14 jours. Pas de
            carte bancaire requise pour démarrer.
          </p>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800 py-20">
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
              <svg
                className="ml-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
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
            🔒 Essai gratuit de 14 jours • Aucune carte bancaire requise •
            Annulation à tout moment
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 font-bold text-white shadow-lg">
                  K
                </div>
                <span className="text-xl font-semibold">KerManager</span>
              </div>
              <p className="mt-4 text-sm text-gray-400">
                Plateforme de gestion immobilière SaaS.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white">Produit</h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <a
                    href="#features"
                    className="text-gray-400 hover:text-indigo-400"
                  >
                    Fonctionnalités
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="text-gray-400 hover:text-indigo-400"
                  >
                    Tarifs
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white">Ressources</h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-400 hover:text-indigo-400">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-indigo-400">
                    Support
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white">Entreprise</h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-400 hover:text-indigo-400">
                    À propos
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-indigo-400">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-800 pt-8 text-center">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} KerManager. Tous droits
              réservés.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default LandingPage;
