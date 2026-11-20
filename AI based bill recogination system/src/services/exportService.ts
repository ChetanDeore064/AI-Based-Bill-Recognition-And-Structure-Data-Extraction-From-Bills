import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import type { Bill } from "@/data/bills";

export function exportToExcel(bills: Bill[], filename: string = "CA_BillMate_Export") {
  const worksheetData = bills.map((bill, index) => ({
    "Sr. No.": index + 1,
    "Invoice Number": bill.invoiceNumber,
    "Invoice Date": bill.invoiceDate,
    "Due Date": bill.dueDate,
    "Vendor Name": bill.vendorName,
    "Vendor GSTIN": bill.vendorGSTIN,
    "Vendor Address": bill.vendorAddress,
    "Customer Name": bill.customerName,
    "Customer GSTIN": bill.customerGSTIN,
    "Invoice Type": bill.type,
    "Taxable Amount (₹)": bill.taxableAmount,
    "CGST (₹)": bill.cgst,
    "SGST (₹)": bill.sgst,
    "IGST (₹)": bill.igst,
    "Total Amount (₹)": bill.totalAmount,
    "Status": bill.status,
    "AI Confidence (%)": bill.confidence,
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);

  // Set column widths
  worksheet["!cols"] = [
    { wch: 8 },  // Sr. No.
    { wch: 16 }, // Invoice Number
    { wch: 14 }, // Invoice Date
    { wch: 14 }, // Due Date
    { wch: 25 }, // Vendor Name
    { wch: 18 }, // Vendor GSTIN
    { wch: 35 }, // Vendor Address
    { wch: 25 }, // Customer Name
    { wch: 18 }, // Customer GSTIN
    { wch: 18 }, // Invoice Type
    { wch: 18 }, // Taxable Amount
    { wch: 12 }, // CGST
    { wch: 12 }, // SGST
    { wch: 12 }, // IGST
    { wch: 18 }, // Total Amount
    { wch: 12 }, // Status
    { wch: 18 }, // AI Confidence
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Bills");

  // Add GST summary sheet
  const gstSummary = computeGSTSummary(bills);
  const summaryData = [
    { "Description": "Total Taxable Amount", "Amount (₹)": gstSummary.totalTaxable },
    { "Description": "Total CGST", "Amount (₹)": gstSummary.totalCGST },
    { "Description": "Total SGST", "Amount (₹)": gstSummary.totalSGST },
    { "Description": "Total IGST", "Amount (₹)": gstSummary.totalIGST },
    { "Description": "Total GST", "Amount (₹)": gstSummary.totalGST },
    { "Description": "Total Invoice Value", "Amount (₹)": gstSummary.totalInvoiceValue },
    { "Description": "", "Amount (₹)": "" },
    { "Description": "Total Bills", "Amount (₹)": bills.length },
    { "Description": "Verified Bills", "Amount (₹)": bills.filter(b => b.status === "Verified").length },
    { "Description": "Pending Review", "Amount (₹)": bills.filter(b => b.status === "Review").length },
  ];

  const summarySheet = XLSX.utils.json_to_sheet(summaryData);
  summarySheet["!cols"] = [{ wch: 25 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(workbook, summarySheet, "GST Summary");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  saveAs(blob, `${filename}_${new Date().toISOString().split("T")[0]}.xlsx`);
}

export function exportToCSV(bills: Bill[], filename: string = "CA_BillMate_Export") {
  const headers = [
    "Sr. No.", "Invoice Number", "Invoice Date", "Due Date",
    "Vendor Name", "Vendor GSTIN", "Customer Name", "Customer GSTIN",
    "Invoice Type", "Taxable Amount", "CGST", "SGST", "IGST",
    "Total Amount", "Status", "AI Confidence %"
  ];

  const rows = bills.map((bill, index) => [
    index + 1, bill.invoiceNumber, bill.invoiceDate, bill.dueDate,
    `"${bill.vendorName}"`, bill.vendorGSTIN, `"${bill.customerName}"`, bill.customerGSTIN,
    bill.type, bill.taxableAmount, bill.cgst, bill.sgst, bill.igst,
    bill.totalAmount, bill.status, bill.confidence
  ]);

  const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, `${filename}_${new Date().toISOString().split("T")[0]}.csv`);
}

export function computeGSTSummary(bills: Bill[]) {
  const totalTaxable = bills.reduce((sum, b) => sum + b.taxableAmount, 0);
  const totalCGST = bills.reduce((sum, b) => sum + b.cgst, 0);
  const totalSGST = bills.reduce((sum, b) => sum + b.sgst, 0);
  const totalIGST = bills.reduce((sum, b) => sum + b.igst, 0);
  const totalGST = totalCGST + totalSGST + totalIGST;
  const totalInvoiceValue = bills.reduce((sum, b) => sum + b.totalAmount, 0);

  return { totalTaxable, totalCGST, totalSGST, totalIGST, totalGST, totalInvoiceValue };
}
