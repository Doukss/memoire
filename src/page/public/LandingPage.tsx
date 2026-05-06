import heroImage from '../../assets/hero.png'

const metrics = [
  { value: '2.4k+', label: 'biens supervises' },
  { value: '98%', label: 'loyers rapproches' },
  { value: '35%', label: 'temps gagne' },
]

const modules = [
  {
    title: 'Gestion des biens',
    text: 'Centralisez appartements, maisons, documents, disponibilites et etats locatifs par agence.',
    icon: 'B',
  },
  {
    title: 'Locataires',
    text: 'Suivez les dossiers, contrats, garanties, historiques et interactions avec chaque occupant.',
    icon: 'L',
  },
  {
    title: 'Paiements',
    text: 'Visualisez les loyers attendus, retards, relances et quittances dans un tableau clair.',
    icon: 'P',
  },
  {
    title: 'Litiges',
    text: 'Pilotez les reclamations, preuves, statuts et resolutions sans perdre le fil.',
    icon: 'R',
  },
]

const activity = [
  { label: 'Loyer recu', detail: 'Appartement A12 - Dakar Plateau', amount: '+450 000 XOF' },
  { label: 'Relance envoyee', detail: 'Villa C7 - 8 jours de retard', amount: 'En attente' },
  { label: 'Litige ouvert', detail: 'Degat plomberie - Studio B4', amount: 'Priorite' },
]

function LandingPage() {
  return (
    <main className="landing-page">
      <nav className="site-nav" aria-label="Navigation principale">
        <a className="brand" href="#">
          <span className="brand-mark">K</span>
          <span>KerManager</span>
        </a>

        <div className="nav-links">
          <a href="#modules">Modules</a>
          <a href="#workflow">Workflow</a>
          <a href="#pricing">Tarifs</a>
        </div>

        <div className="nav-actions">
          <a className="ghost-link" href="/login">Connexion</a>
          <a className="primary-button compact" href="/register">Demarrer</a>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">Plateforme SaaS multi-agences</span>
          <h1>Gerez votre parc immobilier, vos loyers et vos litiges depuis un seul cockpit.</h1>
          <p>
            KerManager aide les agences immobilieres a organiser leurs biens, suivre les locataires,
            automatiser les paiements et traiter les reclamations avec une vision claire par agence.
          </p>

          <div className="hero-actions">
            <a className="primary-button" href="/register">Creer une agence</a>
            <a className="secondary-button" href="#workflow">Voir le tableau de bord</a>
          </div>

          <div className="metrics-row" aria-label="Indicateurs de performance">
            {metrics.map((metric) => (
              <div className="metric" key={metric.label}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-visual" aria-label="Apercu du produit">
          <div className="dashboard-preview">
            <div className="preview-header">
              <div>
                <span>Revenus mensuels</span>
                <strong>12.8M XOF</strong>
              </div>
              <span className="status-pill">+18%</span>
            </div>

            <div className="chart-bars" aria-hidden="true">
              <span className="bar small" />
              <span className="bar medium" />
              <span className="bar tall" />
              <span className="bar active" />
              <span className="bar medium" />
              <span className="bar tall muted" />
            </div>

            <div className="property-card">
              <img src={heroImage} alt="" />
              <div>
                <strong>Residence Almadies</strong>
                <span>24 unites - 3 loyers en retard</span>
              </div>
            </div>

            <div className="activity-list">
              {activity.map((item) => (
                <div className="activity-item" key={item.detail}>
                  <div>
                    <strong>{item.label}</strong>
                    <span>{item.detail}</span>
                  </div>
                  <small>{item.amount}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="logo-strip" aria-label="Types d'utilisateurs">
        <span>Agences independantes</span>
        <span>Reseaux multi-sites</span>
        <span>Gestionnaires locatifs</span>
        <span>Bailleurs professionnels</span>
      </section>

      <section className="section-shell" id="modules">
        <div className="section-heading">
          <span className="eyebrow">Modules essentiels</span>
          <h2>Tout ce qu'une agence doit suivre, sans tableurs disperses.</h2>
        </div>

        <div className="module-grid">
          {modules.map((module) => (
            <article className="module-card" key={module.title}>
              <span className="module-icon">{module.icon}</span>
              <h3>{module.title}</h3>
              <p>{module.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="workflow-section" id="workflow">
        <div className="workflow-copy">
          <span className="eyebrow">Operations quotidiennes</span>
          <h2>Une lecture rapide des priorites de chaque agence.</h2>
          <p>
            Les equipes voient les loyers a encaisser, les biens vacants, les dossiers incomplets
            et les litiges urgents avant qu'ils ne deviennent des pertes.
          </p>
        </div>

        <div className="workflow-panel">
          <div className="panel-top">
            <strong>Tableau agence</strong>
            <span>Mai 2026</span>
          </div>
          <div className="task-row done">
            <span />
            <div>
              <strong>12 quittances generees</strong>
              <small>Automatiquement apres confirmation de paiement</small>
            </div>
          </div>
          <div className="task-row warning">
            <span />
            <div>
              <strong>5 retards a relancer</strong>
              <small>Messages prets pour SMS ou email</small>
            </div>
          </div>
          <div className="task-row danger">
            <span />
            <div>
              <strong>2 litiges critiques</strong>
              <small>Documents et historique regroupes</small>
            </div>
          </div>
        </div>
      </section>

      <section className="pricing-section" id="pricing">
        <div>
          <span className="eyebrow">Lancement</span>
          <h2>Commencez avec une agence, evoluez vers un reseau.</h2>
          <p>
            Une base concue pour ajouter ensuite roles, abonnements, facturation SaaS,
            portail locataire et administration super-admin.
          </p>
        </div>
        <a className="primary-button" href="/register">Demander un acces</a>
      </section>
    </main>
  )
}

export default LandingPage
