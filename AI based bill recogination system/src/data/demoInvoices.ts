import type { ExtractedInvoice } from "@/types/ocr";
import type { Bill } from "@/data/bills";

export interface DemoScenario {
  id: string;
  title: string;
  description: string;
  badge: string;
  type: "printed" | "handwritten" | "mixed";
  bill: Bill;
  extractedInvoice: ExtractedInvoice;
  rawText: string;
}

export const demoScenarios: DemoScenario[] = [
  {
    id: "scenario-printed-gst",
    title: "Standard GST Tax Invoice (Printed)",
    description: "High-resolution printed B2B invoice with clear tabular breakdown, GSTINs, and HSN codes.",
    badge: "98% Confidence • PaddleOCR + LayoutLMv3",
    type: "printed",
    bill: {
      id: "demo-bill-printed",
      invoiceNumber: "INV-2026/0892",
      invoiceDate: "12-09-2026",
      dueDate: "27-09-2026",
      vendorName: "Apex CloudTech Solutions Pvt Ltd",
      vendorGSTIN: "27AAACA1234A1Z5",
      vendorAddress: "Tower B, Cyber City, Phase 2, Pune, Maharashtra 411014",
      customerName: "Patil Enterprises",
      customerGSTIN: "27FGHIJ5678K1Z2",
      items: [
        { id: 1, description: "Enterprise Cloud Server Subscription - Tier 3", hsn: "998313", quantity: 1, rate: 45000, taxableAmount: 45000 },
        { id: 2, description: "SSL Certificate Multi-Domain (2 Years)", hsn: "998319", quantity: 2, rate: 6500, taxableAmount: 13000 },
        { id: 3, description: "Dedicated Technical Support SLA", hsn: "998314", quantity: 1, rate: 12000, taxableAmount: 12000 },
      ],
      taxableAmount: 70000,
      cgst: 6300,
      sgst: 6300,
      igst: 0,
      totalAmount: 82600,
      status: "Verified",
      confidence: 98,
      clientId: "client-001",
      type: "GST Invoice",
      fieldConfidence: {
        invoiceNumber: 99,
        invoiceDate: 99,
        vendorName: 98,
        vendorGSTIN: 100,
        customerName: 97,
        customerGSTIN: 99,
        taxableAmount: 98,
        cgst: 98,
        sgst: 98,
        totalAmount: 99,
      },
      ocrSource: "paddleocr",
      processingMode: "ai_backend",
      processingTimeMs: 1240,
      enginesUsed: ["OpenCV Denoise", "PaddleOCR v4", "LayoutLMv3 B2B", "Financial Validator"],
    },
    extractedInvoice: {
      invoiceNumber: { value: "INV-2026/0892", confidence: 99, source: "paddleocr", needsReview: false },
      invoiceDate: { value: "12-09-2026", confidence: 99, source: "paddleocr", needsReview: false },
      dueDate: { value: "27-09-2026", confidence: 97, source: "paddleocr", needsReview: false },
      vendorName: { value: "Apex CloudTech Solutions Pvt Ltd", confidence: 98, source: "layoutlm", needsReview: false },
      vendorGSTIN: { value: "27AAACA1234A1Z5", confidence: 100, source: "paddleocr", needsReview: false },
      vendorAddress: { value: "Tower B, Cyber City, Phase 2, Pune, Maharashtra 411014", confidence: 96, source: "paddleocr", needsReview: false },
      customerName: { value: "Patil Enterprises", confidence: 97, source: "layoutlm", needsReview: false },
      customerGSTIN: { value: "27FGHIJ5678K1Z2", confidence: 99, source: "paddleocr", needsReview: false },
      items: [
        {
          id: 1,
          description: { value: "Enterprise Cloud Server Subscription - Tier 3", confidence: 98, source: "paddleocr", needsReview: false },
          hsn: { value: "998313", confidence: 99, source: "paddleocr", needsReview: false },
          quantity: { value: 1, confidence: 99, source: "paddleocr", needsReview: false },
          rate: { value: 45000, confidence: 98, source: "paddleocr", needsReview: false },
          taxableAmount: { value: 45000, confidence: 98, source: "paddleocr", needsReview: false },
        },
        {
          id: 2,
          description: { value: "SSL Certificate Multi-Domain (2 Years)", confidence: 97, source: "paddleocr", needsReview: false },
          hsn: { value: "998319", confidence: 99, source: "paddleocr", needsReview: false },
          quantity: { value: 2, confidence: 99, source: "paddleocr", needsReview: false },
          rate: { value: 6500, confidence: 97, source: "paddleocr", needsReview: false },
          taxableAmount: { value: 13000, confidence: 98, source: "paddleocr", needsReview: false },
        },
        {
          id: 3,
          description: { value: "Dedicated Technical Support SLA", confidence: 96, source: "paddleocr", needsReview: false },
          hsn: { value: "998314", confidence: 98, source: "paddleocr", needsReview: false },
          quantity: { value: 1, confidence: 99, source: "paddleocr", needsReview: false },
          rate: { value: 12000, confidence: 97, source: "paddleocr", needsReview: false },
          taxableAmount: { value: 12000, confidence: 98, source: "paddleocr", needsReview: false },
        },
      ],
      taxableAmount: { value: 70000, confidence: 98, source: "layoutlm", needsReview: false },
      cgst: { value: 6300, confidence: 98, source: "inferred", needsReview: false },
      sgst: { value: 6300, confidence: 98, source: "inferred", needsReview: false },
      igst: { value: 0, confidence: 100, source: "inferred", needsReview: false },
      totalAmount: { value: 82600, confidence: 99, source: "layoutlm", needsReview: false },
      overallConfidence: 98,
      processingMode: "ai_backend",
      processingTimeMs: 1240,
      enginesUsed: ["OpenCV Denoise", "PaddleOCR v4", "LayoutLMv3 B2B", "Financial Validator"],
      validation: {
        gstinValid: true,
        gstinChecksumValid: true,
        taxCalculationValid: true,
        taxDifference: 0,
        isDuplicate: false,
        dateValid: true,
        customerGstinValid: true,
        fieldLevelWarnings: {},
      },
    },
    rawText: `TAX INVOICE
APEX CLOUDTECH SOLUTIONS PVT LTD
Tower B, Cyber City, Phase 2, Pune, Maharashtra 411014
GSTIN: 27AAACA1234A1Z5 | PAN: AAACA1234A
Invoice No: INV-2026/0892    Date: 12-09-2026    Due Date: 27-09-2026

Billed To:
Patil Enterprises
GSTIN: 27FGHIJ5678K1Z2
State: Maharashtra (27)

Item Description                             HSN       Qty    Rate (₹)    Amount (₹)
1. Enterprise Cloud Server Subscription T3  998313      1    45,000.00    45,000.00
2. SSL Certificate Multi-Domain (2 Years)    998319      2     6,500.00    13,000.00
3. Dedicated Technical Support SLA          998314      1    12,000.00    12,000.00

Taxable Amount: ₹70,000.00
CGST @ 9%:      ₹6,300.00
SGST @ 9%:      ₹6,300.00
Total Amount:   ₹82,600.00
Amount in words: Eighty Two Thousand Six Hundred Rupees Only.`,
  },
  {
    id: "scenario-handwritten-bill",
    title: "Handwritten Cash Memo / Local Supplier Bill",
    description: "Challenging cursive & handwritten numerals extracted via TrOCR with flagged fields for CA review.",
    badge: "74% Confidence • TrOCR Transformer",
    type: "handwritten",
    bill: {
      id: "demo-bill-handwritten",
      invoiceNumber: "HM-4402",
      invoiceDate: "10-09-2026",
      dueDate: "",
      vendorName: "Shree Ganesh Hardware & Electricals",
      vendorGSTIN: "27BCDPG9876Q1Z4",
      vendorAddress: "Station Road, Dhule, Maharashtra",
      customerName: "Patil Enterprises",
      customerGSTIN: "27FGHIJ5678K1Z2",
      items: [
        { id: 1, description: "Copper Wire 2.5 sq mm (Coil)", hsn: "8544", quantity: 3, rate: 2400, taxableAmount: 7200 },
        { id: 2, description: "Modular Switches 6A (Box)", hsn: "8536", quantity: 5, rate: 850, taxableAmount: 4250 },
        { id: 3, description: "MCB 32A Double Pole", hsn: "8536", quantity: 2, rate: 950, taxableAmount: 1900 },
      ],
      taxableAmount: 13350,
      cgst: 1201.5,
      sgst: 1201.5,
      igst: 0,
      totalAmount: 15753,
      status: "Review",
      confidence: 74,
      clientId: "client-001",
      type: "Expense Receipt",
      fieldConfidence: {
        invoiceNumber: 78,
        invoiceDate: 85,
        vendorName: 72,
        vendorGSTIN: 80,
        customerName: 65,
        customerGSTIN: 76,
        taxableAmount: 72,
        cgst: 70,
        sgst: 70,
        totalAmount: 75,
      },
      ocrSource: "trocr",
      processingMode: "ai_backend",
      processingTimeMs: 2480,
      enginesUsed: ["OpenCV Deskew", "TrOCR Handwriting Transformer", "Indian Numeral Normalizer"],
    },
    extractedInvoice: {
      invoiceNumber: { value: "HM-4402", confidence: 78, source: "trocr", needsReview: true, reviewReason: "Handwritten numeral ambiguous" },
      invoiceDate: { value: "10-09-2026", confidence: 85, source: "trocr", needsReview: false },
      vendorName: { value: "Shree Ganesh Hardware & Electricals", confidence: 72, source: "trocr", needsReview: true, reviewReason: "Handwritten header match" },
      vendorGSTIN: { value: "27BCDPG9876Q1Z4", confidence: 80, source: "trocr", needsReview: false },
      vendorAddress: { value: "Station Road, Dhule, Maharashtra", confidence: 68, source: "trocr", needsReview: true },
      customerName: { value: "Patil Enterprises", confidence: 65, source: "trocr", needsReview: true, reviewReason: "Partial cursive match" },
      customerGSTIN: { value: "27FGHIJ5678K1Z2", confidence: 76, source: "trocr", needsReview: false },
      items: [
        {
          id: 1,
          description: { value: "Copper Wire 2.5 sq mm (Coil)", confidence: 75, source: "trocr", needsReview: false },
          hsn: { value: "8544", confidence: 82, source: "trocr", needsReview: false },
          quantity: { value: 3, confidence: 79, source: "trocr", needsReview: false },
          rate: { value: 2400, confidence: 71, source: "trocr", needsReview: true },
          taxableAmount: { value: 7200, confidence: 72, source: "trocr", needsReview: false },
        },
        {
          id: 2,
          description: { value: "Modular Switches 6A (Box)", confidence: 73, source: "trocr", needsReview: false },
          hsn: { value: "8536", confidence: 80, source: "trocr", needsReview: false },
          quantity: { value: 5, confidence: 77, source: "trocr", needsReview: false },
          rate: { value: 850, confidence: 70, source: "trocr", needsReview: true },
          taxableAmount: { value: 4250, confidence: 72, source: "trocr", needsReview: false },
        },
        {
          id: 3,
          description: { value: "MCB 32A Double Pole", confidence: 74, source: "trocr", needsReview: false },
          hsn: { value: "8536", confidence: 80, source: "trocr", needsReview: false },
          quantity: { value: 2, confidence: 79, source: "trocr", needsReview: false },
          rate: { value: 950, confidence: 70, source: "trocr", needsReview: true },
          taxableAmount: { value: 1900, confidence: 72, source: "trocr", needsReview: false },
        },
      ],
      taxableAmount: { value: 13350, confidence: 72, source: "trocr", needsReview: true },
      cgst: { value: 1201.5, confidence: 70, source: "inferred", needsReview: false },
      sgst: { value: 1201.5, confidence: 70, source: "inferred", needsReview: false },
      igst: { value: 0, confidence: 100, source: "inferred", needsReview: false },
      totalAmount: { value: 15753, confidence: 75, source: "trocr", needsReview: true, reviewReason: "Handwritten total needs CA verification" },
      overallConfidence: 74,
      processingMode: "ai_backend",
      processingTimeMs: 2480,
      enginesUsed: ["OpenCV Deskew", "TrOCR Handwriting Transformer", "Indian Numeral Normalizer"],
      validation: {
        gstinValid: true,
        gstinChecksumValid: true,
        taxCalculationValid: true,
        taxDifference: 0,
        isDuplicate: false,
        dateValid: true,
        customerGstinValid: true,
        fieldLevelWarnings: {
          totalAmount: "Handwritten amount confidence < 80% — please confirm total against paper slip.",
          vendorName: "Partially cursive heading — please verify trade name.",
        },
      },
    },
    rawText: `[Handwritten Bill]
SHREE GANESH HARDWARE & ELECTRICALS
Station Road, Dhule
GSTIN: 27BCDPG9876Q1Z4
Memo No: HM-4402   Dt: 10/09/2026
M/s Patil Enterprises

1. Copper wire 2.5 mm  3 coils  @ 2400  = 7,200/-
2. Modular switch 6A   5 box    @ 850   = 4,250/-
3. MCB 32A DP          2 pcs    @ 950   = 1,900/-
Taxable: 13,350.00
GST @ 18% (CGST 9% + SGST 9%): 2,403.00
Grand Total: 15,753/-
Sign: (Authorized)`,
  },
  {
    id: "scenario-mixed-invoice",
    title: "Hybrid / Semi-Handwritten Invoice",
    description: "Pre-printed company challan with manually rubber-stamped GSTIN and pen-written quantities & prices.",
    badge: "86% Confidence • Hybrid Multi-Engine",
    type: "mixed",
    bill: {
      id: "demo-bill-mixed",
      invoiceNumber: "VR-8910-B",
      invoiceDate: "11-09-2026",
      dueDate: "26-09-2026",
      vendorName: "Varadraj Heavy Logistics & Transport",
      vendorGSTIN: "27LMNOP9012Q1Z8",
      vendorAddress: "Plot 88, Trans-Thane Creek Indl Area, Navi Mumbai 400705",
      customerName: "Patil Enterprises",
      customerGSTIN: "27FGHIJ5678K1Z2",
      items: [
        { id: 1, description: "Freight Transport Charges (Dhule to Mumbai)", hsn: "996511", quantity: 2, rate: 16500, taxableAmount: 33000 },
        { id: 2, description: "Loading & Unloading Labor Charges", hsn: "996519", quantity: 1, rate: 3500, taxableAmount: 3500 },
        { id: 3, description: "Toll & Transit Permit Clearance", hsn: "996519", quantity: 1, rate: 1800, taxableAmount: 1800 },
      ],
      taxableAmount: 38300,
      cgst: 957.5,
      sgst: 957.5,
      igst: 0,
      totalAmount: 40215,
      status: "Review",
      confidence: 86,
      clientId: "client-001",
      type: "Purchase Invoice",
      fieldConfidence: {
        invoiceNumber: 94,
        invoiceDate: 92,
        vendorName: 96,
        vendorGSTIN: 90,
        customerName: 88,
        customerGSTIN: 89,
        taxableAmount: 82,
        cgst: 80,
        sgst: 80,
        totalAmount: 84,
      },
      ocrSource: "mixed",
      processingMode: "ai_backend",
      processingTimeMs: 1820,
      enginesUsed: ["PaddleOCR (Header/Printed)", "TrOCR (Handwritten Quantities)", "LayoutLMv3", "GST 5% RCM Validator"],
    },
    extractedInvoice: {
      invoiceNumber: { value: "VR-8910-B", confidence: 94, source: "paddleocr", needsReview: false },
      invoiceDate: { value: "11-09-2026", confidence: 92, source: "paddleocr", needsReview: false },
      dueDate: { value: "26-09-2026", confidence: 90, source: "paddleocr", needsReview: false },
      vendorName: { value: "Varadraj Heavy Logistics & Transport", confidence: 96, source: "paddleocr", needsReview: false },
      vendorGSTIN: { value: "27LMNOP9012Q1Z8", confidence: 90, source: "paddleocr", needsReview: false },
      vendorAddress: { value: "Plot 88, Trans-Thane Creek Indl Area, Navi Mumbai 400705", confidence: 93, source: "paddleocr", needsReview: false },
      customerName: { value: "Patil Enterprises", confidence: 88, source: "trocr", needsReview: false },
      customerGSTIN: { value: "27FGHIJ5678K1Z2", confidence: 89, source: "paddleocr", needsReview: false },
      items: [
        {
          id: 1,
          description: { value: "Freight Transport Charges (Dhule to Mumbai)", confidence: 92, source: "paddleocr", needsReview: false },
          hsn: { value: "996511", confidence: 94, source: "paddleocr", needsReview: false },
          quantity: { value: 2, confidence: 83, source: "trocr", needsReview: false },
          rate: { value: 16500, confidence: 81, source: "trocr", needsReview: false },
          taxableAmount: { value: 33000, confidence: 82, source: "trocr", needsReview: false },
        },
        {
          id: 2,
          description: { value: "Loading & Unloading Labor Charges", confidence: 90, source: "paddleocr", needsReview: false },
          hsn: { value: "996519", confidence: 93, source: "paddleocr", needsReview: false },
          quantity: { value: 1, confidence: 88, source: "trocr", needsReview: false },
          rate: { value: 3500, confidence: 80, source: "trocr", needsReview: false },
          taxableAmount: { value: 3500, confidence: 80, source: "trocr", needsReview: false },
        },
        {
          id: 3,
          description: { value: "Toll & Transit Permit Clearance", confidence: 89, source: "paddleocr", needsReview: false },
          hsn: { value: "996519", confidence: 91, source: "paddleocr", needsReview: false },
          quantity: { value: 1, confidence: 85, source: "trocr", needsReview: false },
          rate: { value: 1800, confidence: 81, source: "trocr", needsReview: false },
          taxableAmount: { value: 1800, confidence: 81, source: "trocr", needsReview: false },
        },
      ],
      taxableAmount: { value: 38300, confidence: 82, source: "mixed", needsReview: false },
      cgst: { value: 957.5, confidence: 80, source: "inferred", needsReview: false },
      sgst: { value: 957.5, confidence: 80, source: "inferred", needsReview: false },
      igst: { value: 0, confidence: 100, source: "inferred", needsReview: false },
      totalAmount: { value: 40215, confidence: 84, source: "trocr", needsReview: false },
      overallConfidence: 86,
      processingMode: "ai_backend",
      processingTimeMs: 1820,
      enginesUsed: ["PaddleOCR (Header/Printed)", "TrOCR (Handwritten Quantities)", "LayoutLMv3", "GST 5% GTA Validator"],
      validation: {
        gstinValid: true,
        gstinChecksumValid: true,
        taxCalculationValid: true,
        taxDifference: 0,
        isDuplicate: false,
        dateValid: true,
        customerGstinValid: true,
        fieldLevelWarnings: {},
      },
    },
    rawText: `CONSIGNMENT NOTE / TAX INVOICE
VARADRAJ HEAVY LOGISTICS & TRANSPORT
Plot 88, TTC Indl Area, Navi Mumbai 400705
GSTIN: 27LMNOP9012Q1Z8 (GTA Services)
Consignment No: VR-8910-B    Date: 11-09-2026

Consignee: Patil Enterprises
GSTIN: 27FGHIJ5678K1Z2

[Handwritten Details]:
1. Freight (Dhule to Mumbai)  2 Trips @ 16,500 = 33,000/-
2. Loading / Unloading Charges        @ 3,500  = 3,500/-
3. Toll & Transit Clearance                   = 1,800/-
Subtotal: 38,300.00
GST @ 5% (CGST 2.5% + SGST 2.5%): 1,915.00
Net Total Payable: 40,215.00`,
  },
];
