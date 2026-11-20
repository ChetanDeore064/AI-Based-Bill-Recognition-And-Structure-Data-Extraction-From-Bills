import {
  validateGSTIN,
  correctOcrGSTIN,
  parseIndianMoney,
  normalizeDateString,
  validateTaxCalculation,
  checkDuplicate,
  parseExtractedText,
} from "../ocrService";
import type { Bill } from "@/data/bills";

describe("CA BillMate OCR & Validation Suite", () => {
  describe("validateGSTIN", () => {
    it("should validate standard 15-char Indian GSTIN correctly", () => {
      expect(validateGSTIN("27AAACA1234A1Z5")).toBe(true);
      expect(validateGSTIN("27FGHIJ5678K1Z2")).toBe(true);
      expect(validateGSTIN("07ABCDE1234F1Z5")).toBe(true);
    });

    it("should reject invalid GSTIN patterns", () => {
      expect(validateGSTIN("")).toBe(false);
      expect(validateGSTIN("INVALID123")).toBe(false);
      expect(validateGSTIN("27AAACA1234A15")).toBe(false); // only 14 chars
      expect(validateGSTIN("99AAACA1234A1Z5")).toBe(false); // invalid state code 99
    });
  });

  describe("correctOcrGSTIN", () => {
    it("should fix common OCR optical confusions in numbers and letters", () => {
      // 'O' in state code should become '0', '0' in PAN entity name should become 'O'
      const corrupted = "2OAA0CA1234A125";
      const fixed = correctOcrGSTIN(corrupted);
      expect(fixed.slice(0, 2)).toBe("20"); // State code fixed to numbers
      expect(fixed.slice(2, 7)).toBe("AAOCA"); // PAN entity name fixed to letters
    });
  });

  describe("parseIndianMoney", () => {
    it("should parse Indian formatted currency numbers with commas and symbols", () => {
      expect(parseIndianMoney("₹ 1,25,500.00")).toBe(125500);
      expect(parseIndianMoney("Rs. 45,000/-")).toBe(45000);
      expect(parseIndianMoney("INR 12,345.50")).toBe(12345.5);
      expect(parseIndianMoney("82600")).toBe(82600);
      expect(parseIndianMoney("")).toBe(0);
    });
  });

  describe("normalizeDateString", () => {
    it("should standardize slash and dot dates to DD-MM-YYYY", () => {
      expect(normalizeDateString("12/09/2026")).toBe("12-09-2026");
      expect(normalizeDateString("12.09.2026")).toBe("12-09-2026");
      expect(normalizeDateString("5/9/26")).toBe("05-09-2026");
      expect(normalizeDateString("12-Sep-2026")).toBe("12-09-2026");
    });
  });

  describe("validateTaxCalculation", () => {
    it("should pass when taxable + cgst + sgst matches total within tolerance", () => {
      const bill: Partial<Bill> = {
        taxableAmount: 70000,
        cgst: 6300,
        sgst: 6300,
        igst: 0,
        totalAmount: 82600,
      };
      const result = validateTaxCalculation(bill);
      expect(result.valid).toBe(true);
      expect(result.difference).toBe(0);
    });

    it("should flag mismatch when numbers don't add up", () => {
      const bill: Partial<Bill> = {
        taxableAmount: 50000,
        cgst: 4500,
        sgst: 4500,
        igst: 0,
        totalAmount: 65000, // Should be 59000
      };
      const result = validateTaxCalculation(bill);
      expect(result.valid).toBe(false);
      expect(result.difference).toBe(6000);
    });
  });

  describe("checkDuplicate", () => {
    const existingBills: Bill[] = [
      {
        id: "bill-1",
        invoiceNumber: "INV-1024",
        invoiceDate: "12-09-2026",
        dueDate: "27-09-2026",
        vendorName: "ABC Traders",
        vendorGSTIN: "27ABCDE1234F1Z5",
        vendorAddress: "Dhule",
        customerName: "Patil Enterprises",
        customerGSTIN: "27FGHIJ5678K1Z2",
        items: [],
        taxableAmount: 15000,
        cgst: 1350,
        sgst: 1350,
        igst: 0,
        totalAmount: 17700,
        status: "Verified",
        confidence: 97,
        clientId: "client-001",
        type: "Purchase Invoice",
        fieldConfidence: {},
      },
    ];

    it("should detect duplicate invoice when invoiceNumber and vendor match", () => {
      const newBill: Partial<Bill> = {
        invoiceNumber: "INV-1024",
        vendorName: "ABC Traders",
        totalAmount: 17700,
      };
      const dup = checkDuplicate(newBill, existingBills);
      expect(dup).not.toBeNull();
      expect(dup?.id).toBe("bill-1");
    });

    it("should return null for new non-duplicate invoice", () => {
      const newBill: Partial<Bill> = {
        invoiceNumber: "INV-9999",
        vendorName: "Different Vendor",
        totalAmount: 20000,
      };
      expect(checkDuplicate(newBill, existingBills)).toBeNull();
    });
  });

  describe("parseExtractedText", () => {
    it("should extract fields and tax breakdown from sample invoice text", () => {
      const sampleText = `TAX INVOICE
ABC TRADERS
GSTIN: 27ABCDE1234F1Z5
Invoice No: INV-1024
Date: 12-09-2026
Total Amount: ₹17,700.00`;

      const result = parseExtractedText(sampleText);
      expect(result.extractedFields.invoiceNumber).toBe("INV-1024");
      expect(result.extractedFields.vendorGSTIN).toBe("27ABCDE1234F1Z5");
      expect(result.extractedFields.totalAmount).toBe(17700);
      expect(result.validation.gstinValid).toBe(true);
    });
  });
});
