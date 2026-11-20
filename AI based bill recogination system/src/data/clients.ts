export interface Client {
  id: string;
  name: string;
  contact: string;
  email: string;
  gstin: string;
  address: string;
  billCount: number;
  pendingCount: number;
  totalValue: number;
}

export const mockClients: Client[] = [
  {
    id: "client-001",
    name: "ABC Enterprises",
    contact: "Rajesh Patil",
    email: "rajesh@abcenterprises.in",
    gstin: "27ABCDE1234F1Z5",
    address: "123 MG Road, Pune, Maharashtra 411001",
    billCount: 245,
    pendingCount: 12,
    totalValue: 1240000,
  },
  {
    id: "client-002",
    name: "Patil Industries",
    contact: "Suresh Patil",
    email: "suresh@patilindustries.com",
    gstin: "27HIJKL0123M1Z1",
    address: "MIDC Phase 2, Nashik, Maharashtra 422009",
    billCount: 382,
    pendingCount: 24,
    totalValue: 2480000,
  },
  {
    id: "client-003",
    name: "Deshmukh Trading Co.",
    contact: "Anil Deshmukh",
    email: "anil@deshmukhtrading.in",
    gstin: "27GHIJK8901L1Z4",
    address: "Market Yard, Solapur, Maharashtra 413001",
    billCount: 156,
    pendingCount: 8,
    totalValue: 980000,
  },
  {
    id: "client-004",
    name: "Sharma & Associates",
    contact: "Vikram Sharma",
    email: "vikram@sharmaassociates.com",
    gstin: "27KLMNO3456P1Z8",
    address: "FC Road, Pune, Maharashtra 411004",
    billCount: 198,
    pendingCount: 15,
    totalValue: 1850000,
  },
  {
    id: "client-005",
    name: "Joshi Metals",
    contact: "Pradeep Joshi",
    email: "pradeep@joshimetals.in",
    gstin: "27VWXYZ2345A1Z7",
    address: "Industrial Area, Kolhapur, Maharashtra 416001",
    billCount: 267,
    pendingCount: 27,
    totalValue: 3200000,
  },
];
