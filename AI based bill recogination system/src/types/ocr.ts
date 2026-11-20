export type OCRSource = "gemini" | "openai" | "tesseract" | "paddleocr" | "trocr" | "layoutlm" | "inferred" | "mixed";
export type OCRMode = "gemini" | "openai" | "browser" | "ai_backend" | "auto";

export interface BoundingBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  page?: number;
}

export interface ExtractedField<T = string> {
  value: T;
  confidence: number;
  source: OCRSource;
  needsReview: boolean;
  boundingBox?: BoundingBox;
  rawText?: string;
  reviewReason?: string;
}

export interface ExtractedItem {
  id: number;
  description: ExtractedField<string>;
  hsn: ExtractedField<string>;
  quantity: ExtractedField<number>;
  rate: ExtractedField<number>;
  taxableAmount: ExtractedField<number>;
  gstRate?: ExtractedField<number>;
  cgst?: ExtractedField<number>;
  sgst?: ExtractedField<number>;
  igst?: ExtractedField<number>;
  total?: ExtractedField<number>;
}

export interface InvoiceValidation {
  gstinValid: boolean;
  gstinChecksumValid?: boolean;
  taxCalculationValid: boolean;
  taxDifference: number;
  taxMismatchMessage?: string;
  isDuplicate: boolean;
  duplicateBillId?: string;
  dateValid: boolean;
  customerGstinValid?: boolean;
  fieldLevelWarnings: Record<string, string>;
}

export interface ExtractedInvoice {
  invoiceNumber: ExtractedField<string>;
  invoiceDate: ExtractedField<string>;
  dueDate?: ExtractedField<string>;
  vendorName: ExtractedField<string>;
  vendorGSTIN: ExtractedField<string>;
  vendorAddress: ExtractedField<string>;
  customerName: ExtractedField<string>;
  customerGSTIN: ExtractedField<string>;
  customerAddress?: ExtractedField<string>;
  items: ExtractedItem[];
  subtotal?: ExtractedField<number>;
  taxableAmount: ExtractedField<number>;
  cgst: ExtractedField<number>;
  sgst: ExtractedField<number>;
  igst: ExtractedField<number>;
  cess?: ExtractedField<number>;
  roundOff?: ExtractedField<number>;
  totalAmount: ExtractedField<number>;
  overallConfidence: number;
  processingMode: OCRMode;
  processingTimeMs: number;
  enginesUsed: string[];
  validation: InvoiceValidation;
  rawText?: string;
}

export interface ProcessingProgress {
  step: number;
  totalSteps: number;
  stepName: string;
  progressPercent: number;
  engine?: string;
  status: "pending" | "running" | "completed" | "failed";
}

export interface OCRApiResponse {
  success: boolean;
  data?: ExtractedInvoice;
  error?: string;
  metadata?: {
    processingTimeMs: number;
    engines: string[];
    imageDimensions?: { width: number; height: number };
  };
}
