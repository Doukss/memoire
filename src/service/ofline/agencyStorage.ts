export type RentPaymentStatus = "paid" | "pending" | "late";
export type AgencyDisputeStatus = "ongoing" | "resolved";
export type ContractStatus = "active" | "expired" | "terminated";
export type ReceiptStatus = "pending" | "generated" | "sent";

export type AgencyProperty = {
  id: number;
  name: string;
  address: string;
  status: "occupied" | "available";
  monthlyRent: number;
};

export type AgencyTenant = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  propertyName: string;
  active: boolean;
  joinedAt: string;
  contractStatus: "active" | "ended";
};

export type RentPayment = {
  id: number;
  tenantName: string;
  propertyName: string;
  amount: number;
  date: string;
  status: RentPaymentStatus;
};

export type AgencyDispute = {
  id: number;
  tenantName: string;
  subject: string;
  date: string;
  status: AgencyDisputeStatus;
};

export type AgencyContract = {
  id: number;
  tenantName: string;
  propertyName: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  status: ContractStatus;
  signed: boolean;
};

export type AgencyReceipt = {
  id: number;
  tenantName: string;
  propertyName: string;
  period: string;
  amount: number;
  issuedAt: string;
  status: ReceiptStatus;
};

export type AgencyActivity = {
  id: number;
  title: string;
  description: string;
  time: string;
  type: "tenant" | "payment" | "contract" | "dispute";
};

export type AgencyDashboardData = {
  agency: {
    name: string;
    email: string;
    plan: string;
  };
  properties: AgencyProperty[];
  tenants: AgencyTenant[];
  payments: RentPayment[];
  disputes: AgencyDispute[];
  contracts: AgencyContract[];
  receipts: AgencyReceipt[];
  activities: AgencyActivity[];
  monthlyRevenue: Array<{ month: string; revenue: number }>;
};

const STORAGE_KEY = "kermanager.agency.dashboard";

const initialData: AgencyDashboardData = {
  agency: {
    name: "Dakar Prestige Immobilier",
    email: "contact@dakarprestige.sn",
    plan: "Professionnel",
  },
  properties: [
    {
      id: 1,
      name: "Appartement A12",
      address: "Dakar Plateau",
      status: "occupied",
      monthlyRent: 450000,
    },
    {
      id: 2,
      name: "Studio B4",
      address: "Almadies",
      status: "occupied",
      monthlyRent: 300000,
    },
    {
      id: 3,
      name: "Villa C7",
      address: "Mermoz",
      status: "available",
      monthlyRent: 850000,
    },
    {
      id: 4,
      name: "Bureau P3",
      address: "Plateau",
      status: "occupied",
      monthlyRent: 600000,
    },
    {
      id: 5,
      name: "Maison R2",
      address: "Ouakam",
      status: "available",
      monthlyRent: 500000,
    },
  ],
  tenants: [
    {
      id: 1,
      fullName: "Mamadou Fall",
      email: "mamadou.fall@email.sn",
      phone: "+221 76 220 19 88",
      propertyName: "Appartement A12",
      active: true,
      joinedAt: "2026-02-12",
      contractStatus: "active",
    },
    {
      id: 2,
      fullName: "Mariama Sow",
      email: "mariama.sow@email.sn",
      phone: "+221 77 410 23 90",
      propertyName: "Studio B4",
      active: true,
      joinedAt: "2026-03-01",
      contractStatus: "active",
    },
    {
      id: 3,
      fullName: "Aminata Gueye",
      email: "aminata.gueye@email.sn",
      phone: "+221 78 552 10 33",
      propertyName: "Bureau P3",
      active: true,
      joinedAt: "2026-01-20",
      contractStatus: "active",
    },
    {
      id: 4,
      fullName: "Cheikh Ba",
      email: "cheikh.ba@email.sn",
      phone: "+221 70 998 12 44",
      propertyName: "Villa C7",
      active: false,
      joinedAt: "2025-11-10",
      contractStatus: "ended",
    },
  ],
  payments: [
    {
      id: 1,
      tenantName: "Mamadou Fall",
      propertyName: "Appartement A12",
      amount: 450000,
      date: "2026-05-08",
      status: "late",
    },
    {
      id: 2,
      tenantName: "Mariama Sow",
      propertyName: "Studio B4",
      amount: 300000,
      date: "2026-05-06",
      status: "paid",
    },
    {
      id: 3,
      tenantName: "Aminata Gueye",
      propertyName: "Bureau P3",
      amount: 600000,
      date: "2026-05-04",
      status: "paid",
    },
    {
      id: 4,
      tenantName: "Ousmane Sarr",
      propertyName: "Maison R2",
      amount: 500000,
      date: "2026-05-02",
      status: "pending",
    },
  ],
   disputes: [
     {
       id: 1,
       tenantName: "Mamadou Fall",
       subject: "Retard de paiement loyer",
       date: "2026-05-08",
       status: "ongoing",
     },
     {
       id: 2,
       tenantName: "Mariama Sow",
       subject: "Degat plomberie",
       date: "2026-05-07",
       status: "ongoing",
     },
     {
       id: 3,
       tenantName: "Aminata Gueye",
       subject: "Quittance manquante",
       date: "2026-04-25",
       status: "resolved",
     },
   ],
   contracts: [
     {
       id: 1,
       tenantName: "Mamadou Fall",
       propertyName: "Appartement A12",
       startDate: "2026-02-01",
       endDate: "2027-01-31",
       monthlyRent: 450000,
       status: "active",
       signed: true,
     },
     {
       id: 2,
       tenantName: "Mariama Sow",
       propertyName: "Studio B4",
       startDate: "2026-03-01",
       endDate: "2027-02-28",
       monthlyRent: 300000,
       status: "active",
       signed: true,
     },
     {
       id: 3,
       tenantName: "Aminata Gueye",
       propertyName: "Bureau P3",
       startDate: "2026-01-01",
       endDate: "2026-12-31",
       monthlyRent: 600000,
       status: "active",
       signed: true,
     },
   ],
   receipts: [
     {
       id: 1,
       tenantName: "Mamadou Fall",
       propertyName: "Appartement A12",
       period: "Mai 2026",
       amount: 450000,
       issuedAt: "2026-05-01",
       status: "generated",
     },
     {
       id: 2,
       tenantName: "Mariama Sow",
       propertyName: "Studio B4",
       period: "Mai 2026",
       amount: 300000,
       issuedAt: "2026-05-01",
       status: "sent",
     },
     {
       id: 3,
       tenantName: "Aminata Gueye",
       propertyName: "Bureau P3",
       period: "Mai 2026",
       amount: 600000,
       issuedAt: "2026-05-01",
       status: "generated",
     },
   ],
   activities: [
    {
      id: 1,
      title: "Nouveau locataire ajouté",
      description: "Mamadou Fall a été ajouté sur Appartement A12.",
      time: "Il y a 20 min",
      type: "tenant",
    },
    {
      id: 2,
      title: "Paiement reçu",
      description: "600 000 XOF encaissés pour Bureau P3.",
      time: "Il y a 1 h",
      type: "payment",
    },
    {
      id: 3,
      title: "Contrat généré",
      description: "Contrat de location préparé pour Studio B4.",
      time: "Hier",
      type: "contract",
    },
    {
      id: 4,
      title: "Litige ouvert",
      description: "Retard de paiement signalé sur Appartement A12.",
      time: "Hier",
      type: "dispute",
    },
  ],
  monthlyRevenue: [
    { month: "Jan", revenue: 2000000 },
    { month: "Fev", revenue: 2500000 },
    { month: "Mar", revenue: 2300000 },
    { month: "Avr", revenue: 2800000 },
    { month: "Mai", revenue: 3150000 },
  ],
};

export function getAgencyDashboardData(): AgencyDashboardData {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  }

  try {
    const parsed = JSON.parse(stored) as Partial<AgencyDashboardData>;

    return {
      ...initialData,
      ...parsed,
      properties: parsed.properties ?? initialData.properties,
      tenants: (parsed.tenants ?? initialData.tenants).map((tenant, index) => ({
        ...initialData.tenants[index % initialData.tenants.length],
        ...tenant,
      })),
      payments: parsed.payments ?? initialData.payments,
      disputes: parsed.disputes ?? initialData.disputes,
      contracts: parsed.contracts ?? initialData.contracts,
      receipts: parsed.receipts ?? initialData.receipts,
      activities: parsed.activities ?? initialData.activities,
      monthlyRevenue: parsed.monthlyRevenue ?? initialData.monthlyRevenue,
    };
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  }
}

export function saveAgencyDashboardData(data: AgencyDashboardData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
