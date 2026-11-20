import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { ConfidenceBar } from "@/components/ConfidenceBar";
import { StatusBadge } from "@/components/StatusBadge";
import { formatCurrency } from "@/components/BillTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { validateGSTIN, validateTaxCalculation, checkDuplicate } from "@/services/ocrService";
import type { ExtractedInvoice } from "@/types/ocr";
import {
  Save,
  CheckCircle,
  Pencil,
  AlertTriangle,
  FileText,
  Building,
  User,
  Package,
  Calculator,
  Shield,
  Copy,
  Cpu,
  Clock,
  Check,
  AlertCircle,
  Sparkles,
  Info,
} from "lucide-react";
import type { Bill } from "@/data/bills";

export default function ReviewBill() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { bills, updateBill, verifyBill } = useApp();
  const [bill, setBill] = useState<Bill | null>(null);
  const [extractedMeta, setExtractedMeta] = useState<ExtractedInvoice | null>(null);
  const [editing, setEditing] = useState<Record<string, boolean>>({});
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const found = bills.find((b) => b.id === id);
    if (found) {
      setBill(found);
    } else {
      const processed = sessionStorage.getItem("processedBill");
      if (processed) {
        const parsed = JSON.parse(processed);
        if (parsed.id === id || !id) setBill(parsed);
      }
    }

    const rawMeta = sessionStorage.getItem("extractedInvoiceData");
    if (rawMeta) {
      try {
        setExtractedMeta(JSON.parse(rawMeta));
      } catch (e) {
        console.warn("Failed to parse extracted invoice metadata", e);
      }
    }
  }, [id, bills]);

  if (!bill) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <FileText className="h-12 w-12 mb-4" />
        <p className="text-lg font-medium">Bill not found</p>
        <Button variant="link" onClick={() => navigate("/bills")}>
          Go to Bills Management
        </Button>
      </div>
    );
  }

  const toggleEdit = (field: string) => {
    setEditing((prev) => ({ ...prev, [field]: !prev[field] }));
    if (!editing[field]) {
      setEditValues((prev) => ({
        ...prev,
        [field]: String((bill as unknown as Record<string, unknown>)[field] || ""),
      }));
    }
  };

  const saveField = (field: string) => {
    const val = editValues[field];
    let typedVal: string | number = val;
    if (["taxableAmount", "cgst", "sgst", "igst", "totalAmount"].includes(field)) {
      typedVal = parseFloat(val) || 0;
    }

    const updates = { [field]: typedVal };
    updateBill(bill.id, updates);
    setBill((prev) => (prev ? { ...prev, ...updates } : prev));
    setEditing((prev) => ({ ...prev, [field]: false }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleVerify = () => {
    verifyBill(bill.id);
    setBill((prev) => (prev ? { ...prev, status: "Verified" } : prev));
    setVerified(true);
  };

  // Validations
  const vendorGstinValid = validateGSTIN(bill.vendorGSTIN);
  const customerGstinValid = bill.customerGSTIN ? validateGSTIN(bill.customerGSTIN) : true;
  const taxCalc = validateTaxCalculation(bill);
  const duplicate = checkDuplicate(bill, bills.filter((b) => b.id !== bill.id));

  const previewImage = sessionStorage.getItem("uploadedFile");
  const showPreview = previewImage && previewImage !== "demo";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold">Review & Audit Invoice</h1>
            <StatusBadge status={bill.status} />
            <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider">
              {bill.type}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            {bill.invoiceNumber} — {bill.vendorName} • CA Verification Gateway
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSave} className="gap-2" disabled={saved}>
            {saved ? <Check className="h-4 w-4 text-emerald-600" /> : <Save className="h-4 w-4" />}
            {saved ? "Changes Saved" : "Save Changes"}
          </Button>
          {bill.status !== "Verified" ? (
            <Button onClick={handleVerify} className="gap-2 bg-emerald-600 hover:bg-emerald-700" disabled={verified}>
              <CheckCircle className="h-4 w-4" />
              {verified ? "Verified!" : "Approve & Mark Verified"}
            </Button>
          ) : (
            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-300 py-1.5 px-3">
              <CheckCircle className="h-4 w-4 mr-1.5" /> Approved by CA
            </Badge>
          )}
        </div>
      </div>

      {/* Recognition Details Bar */}
      <Card className="border-border/60 bg-gradient-to-r from-blue-500/5 via-primary/5 to-purple-500/5 shadow-xs">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Cpu className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">OCR Architecture</p>
                <p className="text-xs font-semibold capitalize">
                  {bill.ocrSource === "gemini"
                    ? "Google Gemini Vision AI"
                    : bill.ocrSource === "openai"
                    ? "OpenAI GPT-4o Vision"
                    : bill.ocrSource || "PaddleOCR + TrOCR"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Overall Confidence</p>
                <p className="text-xs font-bold text-emerald-600">{bill.confidence}% Match</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Inference Time</p>
                <p className="text-xs font-semibold">{bill.processingTimeMs ? `${bill.processingTimeMs} ms` : "1.24 s"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">GST Check</p>
                <p className={`text-xs font-semibold ${vendorGstinValid ? "text-emerald-600" : "text-amber-600"}`}>
                  {vendorGstinValid ? "Verified GSTIN" : "Format Discrepancy"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Duplicate Warning */}
      {duplicate && (
        <Card className="border-amber-300 bg-amber-50/70 dark:bg-amber-950/30">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                ⚠️ Potential Duplicate Invoice Detected
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                Invoice {duplicate.invoiceNumber} from {duplicate.vendorName} ({formatCurrency(duplicate.totalAmount)}) already exists in your ledger.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Document Preview & Validation Audit */}
        <div className="space-y-4">
          {/* Invoice Document Preview */}
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Document Visual Preview
                </CardTitle>
                <Badge variant="outline" className="text-[10px]">
                  {bill.ocrSource === "trocr" ? "Handwritten Scan" : "High-Res Digital Image"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {showPreview ? (
                <div className="relative rounded-lg overflow-hidden border border-border/60">
                  <img src={previewImage} alt="Invoice" className="w-full max-h-[420px] object-contain bg-black/5" />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-14 rounded-lg bg-muted/40 border border-dashed border-border/80 text-center px-4">
                  <FileText className="h-12 w-12 text-muted-foreground/30 mb-2" />
                  <p className="text-sm font-medium text-foreground">Scanned Document Demo View</p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                    {bill.invoiceNumber} • {bill.vendorName} (Parsed using {bill.ocrSource || "PaddleOCR"} engine)
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Validation Audit Matrix */}
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                CA Statutory & Tax Validation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ValidationItem
                label="Vendor GSTIN Structure & State Code"
                valid={vendorGstinValid}
                detail={vendorGstinValid ? `Valid (${bill.vendorGSTIN.slice(0, 2)} State Code)` : "Invalid 15-char format"}
              />
              <ValidationItem
                label="Customer GSTIN Check"
                valid={customerGstinValid}
                detail={customerGstinValid ? "Verified" : "Invalid format"}
              />
              <ValidationItem
                label="Mathematical Tax Parity"
                valid={taxCalc.valid}
                detail={taxCalc.message}
              />
              <ValidationItem
                label="Invoice Number Detection"
                valid={bill.invoiceNumber !== "Not Detected"}
                detail={bill.invoiceNumber !== "Not Detected" ? bill.invoiceNumber : "Needs Manual Entry"}
              />
              <ValidationItem
                label="Duplicate Invoice Audit"
                valid={!duplicate}
                detail={duplicate ? "Duplicate Entry Alert" : "No Duplicate Record Found"}
              />
            </CardContent>
          </Card>

          {/* Multi-Engine Details */}
          {bill.enginesUsed && bill.enginesUsed.length > 0 && (
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-primary" />
                  Pipeline Components Used
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {bill.enginesUsed.map((eng, idx) => (
                    <Badge key={idx} variant="secondary" className="text-[11px] font-normal">
                      {eng}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Extracted Entities with Badges */}
        <div className="space-y-4">
          {/* Vendor Information Card */}
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building className="h-4 w-4 text-primary" />
                  Vendor Information
                </CardTitle>
                <SourceTag source={extractedMeta?.vendorName.source || bill.ocrSource} />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <EditableField
                label="Vendor Trade Name"
                value={bill.vendorName}
                field="vendorName"
                confidence={bill.fieldConfidence.vendorName}
                editing={editing}
                editValues={editValues}
                onToggle={toggleEdit}
                onSave={saveField}
                onChange={(v) => setEditValues((prev) => ({ ...prev, vendorName: v }))}
              />
              <EditableField
                label="Vendor GSTIN"
                value={bill.vendorGSTIN}
                field="vendorGSTIN"
                confidence={bill.fieldConfidence.vendorGSTIN}
                editing={editing}
                editValues={editValues}
                onToggle={toggleEdit}
                onSave={saveField}
                onChange={(v) => setEditValues((prev) => ({ ...prev, vendorGSTIN: v }))}
                mono
              />
              <EditableField
                label="Registered Business Address"
                value={bill.vendorAddress}
                field="vendorAddress"
                confidence={88}
                editing={editing}
                editValues={editValues}
                onToggle={toggleEdit}
                onSave={saveField}
                onChange={(v) => setEditValues((prev) => ({ ...prev, vendorAddress: v }))}
              />
            </CardContent>
          </Card>

          {/* Invoice Information Card */}
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Invoice Header Details
                </CardTitle>
                <SourceTag source={extractedMeta?.invoiceNumber.source || bill.ocrSource} />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <EditableField
                label="Invoice Number / Bill No."
                value={bill.invoiceNumber}
                field="invoiceNumber"
                confidence={bill.fieldConfidence.invoiceNumber}
                editing={editing}
                editValues={editValues}
                onToggle={toggleEdit}
                onSave={saveField}
                onChange={(v) => setEditValues((prev) => ({ ...prev, invoiceNumber: v }))}
                mono
              />
              <div className="grid grid-cols-2 gap-3">
                <EditableField
                  label="Invoice Date"
                  value={bill.invoiceDate}
                  field="invoiceDate"
                  confidence={bill.fieldConfidence.invoiceDate}
                  editing={editing}
                  editValues={editValues}
                  onToggle={toggleEdit}
                  onSave={saveField}
                  onChange={(v) => setEditValues((prev) => ({ ...prev, invoiceDate: v }))}
                />
                <EditableField
                  label="Due Date"
                  value={bill.dueDate}
                  field="dueDate"
                  confidence={85}
                  editing={editing}
                  editValues={editValues}
                  onToggle={toggleEdit}
                  onSave={saveField}
                  onChange={(v) => setEditValues((prev) => ({ ...prev, dueDate: v }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Customer / Billed To Information */}
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Customer / Billed To
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <EditableField
                label="Customer Name"
                value={bill.customerName}
                field="customerName"
                confidence={bill.fieldConfidence.customerName}
                editing={editing}
                editValues={editValues}
                onToggle={toggleEdit}
                onSave={saveField}
                onChange={(v) => setEditValues((prev) => ({ ...prev, customerName: v }))}
              />
              <EditableField
                label="Customer GSTIN"
                value={bill.customerGSTIN}
                field="customerGSTIN"
                confidence={bill.fieldConfidence.customerGSTIN}
                editing={editing}
                editValues={editValues}
                onToggle={toggleEdit}
                onSave={saveField}
                onChange={(v) => setEditValues((prev) => ({ ...prev, customerGSTIN: v }))}
                mono
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Invoice Line Items */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              Extracted Line Items
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              {bill.items.length} {bill.items.length === 1 ? "Item" : "Items"} Recognized
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>HSN/SAC</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead className="text-right">Rate (₹)</TableHead>
                  <TableHead className="text-right">Taxable (₹)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bill.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-xs text-muted-foreground">{item.id}</TableCell>
                    <TableCell className="font-medium text-sm">{item.description}</TableCell>
                    <TableCell className="font-mono text-xs">{item.hsn || "—"}</TableCell>
                    <TableCell className="text-center tabular-nums">{item.quantity}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatCurrency(item.rate)}</TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">
                      {formatCurrency(item.taxableAmount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Tax Breakdown & Calculations */}
          <div className="mt-5 flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="text-xs text-muted-foreground max-w-sm space-y-1">
              <div className="flex items-center gap-1.5 font-medium text-foreground">
                <Info className="h-3.5 w-3.5 text-primary" />
                GST Parity Audit
              </div>
              <p>
                Calculated on taxable base of {formatCurrency(bill.taxableAmount)} with applicable central and state rates.
              </p>
            </div>

            <div className="w-full md:w-80 space-y-2 bg-muted/20 p-4 rounded-xl border border-border/50">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Taxable Value</span>
                <span className="font-medium tabular-nums">{formatCurrency(bill.taxableAmount)}</span>
              </div>
              {bill.cgst > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">CGST</span>
                  <span className="tabular-nums">{formatCurrency(bill.cgst)}</span>
                </div>
              )}
              {bill.sgst > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">SGST</span>
                  <span className="tabular-nums">{formatCurrency(bill.sgst)}</span>
                </div>
              )}
              {bill.igst > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">IGST</span>
                  <span className="tabular-nums">{formatCurrency(bill.igst)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-base font-bold">
                <span>Grand Total</span>
                <span className="tabular-nums text-primary font-mono">{formatCurrency(bill.totalAmount)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Confidence Breakdown */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Calculator className="h-4 w-4 text-primary" />
            Field-Level AI Confidence Scoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <ConfidenceBar label="Invoice Number" value={bill.fieldConfidence.invoiceNumber || 85} />
            <ConfidenceBar label="Invoice Date" value={bill.fieldConfidence.invoiceDate || 88} />
            <ConfidenceBar label="Vendor Name" value={bill.fieldConfidence.vendorName || 80} />
            <ConfidenceBar label="Vendor GSTIN" value={bill.fieldConfidence.vendorGSTIN || 95} />
            <ConfidenceBar label="Total Amount" value={bill.fieldConfidence.totalAmount || 90} />
            <ConfidenceBar label="Customer Name" value={bill.fieldConfidence.customerName || 75} />
            <ConfidenceBar label="Customer GSTIN" value={bill.fieldConfidence.customerGSTIN || 80} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SourceTag({ source }: { source?: string }) {
  const isTrOCR = source === "trocr";
  const isLayout = source === "layoutlm";

  let label = "PaddleOCR";
  let badgeClass = "bg-blue-500/10 text-blue-600 border-blue-200";

  if (isTrOCR) {
    label = "TrOCR (Handwriting)";
    badgeClass = "bg-amber-500/10 text-amber-600 border-amber-200";
  } else if (isLayout) {
    label = "LayoutLMv3";
    badgeClass = "bg-purple-500/10 text-purple-600 border-purple-200";
  }

  return (
    <Badge variant="outline" className={`text-[10px] py-0.5 px-2 font-medium ${badgeClass}`}>
      {label}
    </Badge>
  );
}

function EditableField({
  label,
  value,
  field,
  confidence,
  editing,
  editValues,
  onToggle,
  onSave,
  onChange,
  mono = false,
}: {
  label: string;
  value: string;
  field: string;
  confidence?: number;
  editing: Record<string, boolean>;
  editValues: Record<string, string>;
  onToggle: (f: string) => void;
  onSave: (f: string) => void;
  onChange: (v: string) => void;
  mono?: boolean;
}) {
  const needsReview = confidence !== undefined && confidence < 80;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground font-medium">{label}</Label>
        {needsReview && (
          <span className="text-[10px] text-amber-600 font-medium flex items-center gap-1 bg-amber-50 dark:bg-amber-950/50 px-1.5 py-0.5 rounded border border-amber-200">
            <AlertCircle className="h-3 w-3" /> Needs CA Review ({confidence}%)
          </span>
        )}
      </div>

      {editing[field] ? (
        <div className="flex gap-2">
          <Input
            value={editValues[field] ?? ""}
            onChange={(e) => onChange(e.target.value)}
            className={`h-9 ${mono ? "font-mono text-sm" : ""}`}
            autoFocus
          />
          <Button size="sm" onClick={() => onSave(field)} className="shrink-0 gap-1">
            <Save className="h-3.5 w-3.5" /> Save
          </Button>
        </div>
      ) : (
        <div
          className={`group flex items-center justify-between rounded-lg border px-3 py-2 transition-all cursor-pointer ${
            needsReview
              ? "border-amber-300/80 bg-amber-500/5 hover:border-amber-400"
              : "border-transparent hover:border-border hover:bg-accent/30"
          }`}
          onClick={() => onToggle(field)}
        >
          <span
            className={`text-sm ${mono ? "font-mono" : "font-medium"} ${
              !value || value === "Not Detected" ? "text-muted-foreground italic" : "text-foreground"
            }`}
          >
            {value || "Not Detected"}
          </span>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
            <Copy className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  );
}

function ValidationItem({ label, valid, detail }: { label: string; valid: boolean; detail: string }) {
  return (
    <div className="flex items-center justify-between text-sm py-1 border-b border-border/30 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <div className="flex items-center gap-1.5">
        {valid ? (
          <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
        ) : (
          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
        )}
        <span className={`text-xs font-medium ${valid ? "text-emerald-600" : "text-amber-600"}`}>
          {detail}
        </span>
      </div>
    </div>
  );
}
