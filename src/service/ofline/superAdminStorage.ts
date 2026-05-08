export type AgencyStatus = "active" | "suspended";

export type Agency = {
  id: number;
  name: string;
  email: string;
  status: AgencyStatus;
  registeredAt: string;
};

export type PlatformUserType = "agence" | "locataire";
export type PlatformUserStatus = "active" | "suspended";

export type PlatformUser = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  type: PlatformUserType;
  status: PlatformUserStatus;
  agencyName: string;
  joinedAt: string;
  lastActivity: string;
};

export type SubscriptionStatus = "active" | "trial" | "expired" | "suspended";
export type PaymentStatus = "paid" | "pending" | "failed";

export type Subscription = {
  id: number;
  agencyName: string;
  plan: "Starter" | "Professionnel" | "Enterprise";
  status: SubscriptionStatus;
  monthlyPrice: number;
  startedAt: string;
  nextBillingAt: string;
};

export type Payment = {
  id: number;
  agencyName: string;
  reference: string;
  amount: number;
  status: PaymentStatus;
  method: "Carte" | "Wave" | "Orange Money" | "Virement";
  paidAt: string;
};

export type SuperAdminData = {
  agencies: Agency[];
  users: PlatformUser[];
  subscriptions: Subscription[];
  payments: Payment[];
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
  users: [
    {
      id: 101,
      fullName: "Awa Diop",
      email: "awa.diop@dakarprestige.sn",
      phone: "+221 77 123 45 67",
      type: "agence",
      status: "active",
      agencyName: "Dakar Prestige Immobilier",
      joinedAt: "2026-05-02",
      lastActivity: "Il y a 12 min",
    },
    {
      id: 102,
      fullName: "Mamadou Fall",
      email: "mamadou.fall@email.sn",
      phone: "+221 76 220 19 88",
      type: "locataire",
      status: "active",
      agencyName: "Teranga Homes",
      joinedAt: "2026-04-30",
      lastActivity: "Il y a 1 h",
    },
    {
      id: 103,
      fullName: "Fatou Ndiaye",
      email: "fatou.ndiaye@terangahomes.sn",
      phone: "+221 78 409 34 21",
      type: "agence",
      status: "active",
      agencyName: "Teranga Homes",
      joinedAt: "2026-04-28",
      lastActivity: "Hier",
    },
    {
      id: 104,
      fullName: "Cheikh Ba",
      email: "cheikh.ba@email.sn",
      phone: "+221 70 998 12 44",
      type: "locataire",
      status: "suspended",
      agencyName: "Sen Immo Gestion",
      joinedAt: "2026-04-24",
      lastActivity: "Il y a 3 j",
    },
    {
      id: 105,
      fullName: "Mariama Sow",
      email: "mariama.sow@email.sn",
      phone: "+221 77 410 23 90",
      type: "locataire",
      status: "active",
      agencyName: "Plateau Location Pro",
      joinedAt: "2026-04-19",
      lastActivity: "Il y a 5 h",
    },
    {
      id: 106,
      fullName: "Ousmane Sarr",
      email: "ousmane.sarr@ouesthabitat.sn",
      phone: "+221 76 341 88 12",
      type: "agence",
      status: "active",
      agencyName: "Ouest Habitat",
      joinedAt: "2026-04-08",
      lastActivity: "Aujourd'hui",
    },
  ],
  subscriptions: [
    {
      id: 201,
      agencyName: "Dakar Prestige Immobilier",
      plan: "Professionnel",
      status: "active",
      monthlyPrice: 15000,
      startedAt: "2026-05-02",
      nextBillingAt: "2026-06-02",
    },
    {
      id: 202,
      agencyName: "Teranga Homes",
      plan: "Enterprise",
      status: "active",
      monthlyPrice: 45000,
      startedAt: "2026-04-28",
      nextBillingAt: "2026-05-28",
    },
    {
      id: 203,
      agencyName: "Sen Immo Gestion",
      plan: "Starter",
      status: "suspended",
      monthlyPrice: 0,
      startedAt: "2026-04-22",
      nextBillingAt: "2026-05-22",
    },
    {
      id: 204,
      agencyName: "Plateau Location Pro",
      plan: "Professionnel",
      status: "trial",
      monthlyPrice: 15000,
      startedAt: "2026-04-14",
      nextBillingAt: "2026-05-14",
    },
    {
      id: 205,
      agencyName: "Ouest Habitat",
      plan: "Professionnel",
      status: "active",
      monthlyPrice: 15000,
      startedAt: "2026-04-08",
      nextBillingAt: "2026-06-08",
    },
  ],
  payments: [
    {
      id: 301,
      agencyName: "Teranga Homes",
      reference: "PAY-2026-0008",
      amount: 45000,
      status: "paid",
      method: "Virement",
      paidAt: "2026-05-07",
    },
    {
      id: 302,
      agencyName: "Dakar Prestige Immobilier",
      reference: "PAY-2026-0007",
      amount: 15000,
      status: "paid",
      method: "Wave",
      paidAt: "2026-05-05",
    },
    {
      id: 303,
      agencyName: "Plateau Location Pro",
      reference: "PAY-2026-0006",
      amount: 15000,
      status: "pending",
      method: "Orange Money",
      paidAt: "2026-05-03",
    },
    {
      id: 304,
      agencyName: "Ouest Habitat",
      reference: "PAY-2026-0005",
      amount: 15000,
      status: "paid",
      method: "Carte",
      paidAt: "2026-04-29",
    },
    {
      id: 305,
      agencyName: "Sen Immo Gestion",
      reference: "PAY-2026-0004",
      amount: 15000,
      status: "failed",
      method: "Carte",
      paidAt: "2026-04-22",
    },
    {
      id: 306,
      agencyName: "Teranga Homes",
      reference: "PAY-2026-0003",
      amount: 45000,
      status: "paid",
      method: "Virement",
      paidAt: "2026-04-15",
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
    const parsed = JSON.parse(stored) as Partial<SuperAdminData>;

    return {
      ...initialData,
      ...parsed,
      agencies: parsed.agencies ?? initialData.agencies,
      users: parsed.users ?? initialData.users,
      subscriptions: parsed.subscriptions ?? initialData.subscriptions,
      payments: parsed.payments ?? initialData.payments,
      totals: {
        ...initialData.totals,
        ...parsed.totals,
      },
      registrations: parsed.registrations ?? initialData.registrations,
      monthlyRevenue: parsed.monthlyRevenue ?? initialData.monthlyRevenue,
      disputeRate: parsed.disputeRate ?? initialData.disputeRate,
      alerts: parsed.alerts ?? initialData.alerts,
      activities: parsed.activities ?? initialData.activities,
    };
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  }
}

export function saveSuperAdminData(data: SuperAdminData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
