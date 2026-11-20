export const dashboardStats = {
  totalBills: 1248,
  totalBillsTrend: 12.5,
  processed: 1102,
  processedPercent: 88.3,
  pendingReview: 86,
  pendingReviewTrend: -8.2,
  totalInvoiceValue: 4285620,
};

export const billsPerDay = [
  { day: "Mon", bills: 42 },
  { day: "Tue", bills: 68 },
  { day: "Wed", bills: 85 },
  { day: "Thu", bills: 56 },
  { day: "Fri", bills: 94 },
  { day: "Sat", bills: 32 },
  { day: "Sun", bills: 12 },
];

export const monthlyTrend = [
  { month: "Apr", value: 1820000 },
  { month: "May", value: 2150000 },
  { month: "Jun", value: 1980000 },
  { month: "Jul", value: 2450000 },
  { month: "Aug", value: 2890000 },
  { month: "Sep", value: 3250000 },
];

export const gstSummary = {
  cgst: 82500,
  sgst: 82500,
  igst: 124000,
  total: 289000,
};

export const invoiceStatusDistribution = [
  { name: "Verified", value: 88, fill: "#10B981" },
  { name: "Pending", value: 7, fill: "#F59E0B" },
  { name: "Errors", value: 5, fill: "#EF4444" },
];

export const recentActivity = [
  { id: 1, action: "Bill Verified", detail: "INV-1024 from ABC Traders", time: "2 minutes ago" },
  { id: 2, action: "New Bill Uploaded", detail: "INV-1040 from Sawant Packaging", time: "15 minutes ago" },
  { id: 3, action: "Export Completed", detail: "248 bills exported to Excel", time: "1 hour ago" },
  { id: 4, action: "Client Added", detail: "Joshi Metals - Kolhapur", time: "2 hours ago" },
  { id: 5, action: "Bill Flagged", detail: "INV-1035 - Low confidence GSTIN", time: "3 hours ago" },
];
