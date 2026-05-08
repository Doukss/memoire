export type AgencyStatus = "active" | "suspended";

export type Agency = {
  id: number;
  name: string;
  email: string;
  status: AgencyStatus;
  registeredAt: string;
};

export type SuperAdminData = {
  agencies: Agency[];
  totals: {
    tenants: number;
    properties: number;
    revenue: number;
    activeDisputes: number;
  };
  registrations: Array<{ month: string; agencies: number }>;
  monthlyRevenue: Array<{ month: string; revenue: number }>;
  disputeRate: Array<{ month: string; rate: number }>;
  alerts: Array<{
    id: number;
    title: string;
    description: string;
    level: "warning" | "danger" | "info";
  }>;
  activities: Array<{
    id: number;
    title: string;
    description: string;
    time: string;
    type: "agency" | "payment" | "dispute";
  }>;
};

const STORAGE_KEY = "kermanager.superAdmin.dashboard";

const initialData: SuperAdminData = {
  agencies: [
    {
      id: 1,
      name: "Dakar Prestige Immobilier",
      email: "contact@dakarprestige.sn",
      status: "active",
      registeredAt: "2026-05-02",
    },
    {
      id: 2,
      name: "Teranga Homes",
      email: "hello@terangahomes.sn",
      status: "active",
      registeredAt: "2026-04-28",
    },
    {
      id: 3,
      name: "Sen Immo Gestion",
      email: "admin@senimmo.sn",
      status: "suspended",
      registeredAt: "2026-04-22",
    },
    {
      id: 4,
      name: "Plateau Location Pro",
      email: "support@plateaulocation.sn",
      status: "active",
      registeredAt: "2026-04-14",
    },
    {
      id: 5,
      name: "Ouest Habitat",
      email: "team@ouesthabitat.sn",
      status: "active",
      registeredAt: "2026-04-08",
    },
  ],
  totals: {
    tenants: 1847,
    properties: 642,
    revenue: 3825000,
    activeDisputes: 37,
  },
  registrations: [
    { month: "Dec", agencies: 8 },
    { month: "Jan", agencies: 14 },
    { month: "Fev", agencies: 18 },
    { month: "Mar", agencies: 23 },
    { month: "Avr", agencies: 31 },
    { month: "Mai", agencies: 38 },
  ],
  monthlyRevenue: [
    { month: "Dec", revenue: 1200000 },
    { month: "Jan", revenue: 1650000 },
    { month: "Fev", revenue: 2180000 },
    { month: "Mar", revenue: 2760000 },
    { month: "Avr", revenue: 3310000 },
    { month: "Mai", revenue: 3825000 },
  ],
  disputeRate: [
    { month: "Dec", rate: 7.8 },
    { month: "Jan", rate: 6.9 },
    { month: "Fev", rate: 7.2 },
    { month: "Mar", rate: 5.8 },
    { month: "Avr", rate: 5.1 },
    { month: "Mai", rate: 4.6 },
  ],
  alerts: [
    {
      id: 1,
      title: "Agences suspendues",
      description: "1 agence est actuellement suspendue et attend une revue.",
      level: "warning",
    },
    {
      id: 2,
      title: "Litiges non resolus",
      description: "12 litiges depassent le delai recommande de traitement.",
      level: "danger",
    },
    {
      id: 3,
      title: "Problemes techniques",
      description: "Aucune anomalie critique detectee sur les services.",
      level: "info",
    },
  ],
  activities: [
    {
      id: 1,
      title: "Nouvelle agence creee",
      description: "Ouest Habitat a rejoint la plateforme.",
      time: "Il y a 18 min",
      type: "agency",
    },
    {
      id: 2,
      title: "Paiement effectue",
      description: "Abonnement Pro regle par Teranga Homes.",
      time: "Il y a 42 min",
      type: "payment",
    },
    {
      id: 3,
      title: "Litige ouvert",
      description: "Nouveau litige declare sur Sen Immo Gestion.",
      time: "Il y a 1 h",
      type: "dispute",
    },
  ],
};

export function getSuperAdminData(): SuperAdminData {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  }

  try {
    return JSON.parse(stored) as SuperAdminData;
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  }
}

export function saveSuperAdminData(data: SuperAdminData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
