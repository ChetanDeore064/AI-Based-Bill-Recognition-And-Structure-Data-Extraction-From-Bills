import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/context/AppContext";
import { demoScenarios } from "@/data/demoInvoices";
import { getOCRConfig } from "@/services/ocrConfig";
import {
  Upload,
  FileImage,
  Camera,
  X,
  FileText,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Cpu,
  Zap,
} from "lucide-react";

export default function UploadBill() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState("client-001");
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("scenario-printed-gst");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { clients } = useApp();
  const navigate = useNavigate();
  const config = getOCRConfig();

  const handleFile = useCallback((f: File) => {
    if (f && (f.type.startsWith("image/") || f.type === "application/pdf")) {
      setFile(f);
      if (f.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result as string);
        reader.readAsDataURL(f);
      } else {
        setPreview(null);
      }
    }
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
    },
    [handleFile]
  );

  const handleProcess = () => {
    sessionStorage.setItem("selectedClient", selectedClient || "client-001");

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        sessionStorage.setItem("uploadedFile", reader.result as string);
        sessionStorage.setItem("uploadedFileName", file.name);
        sessionStorage.setItem("uploadedFileType", file.type);
        sessionStorage.removeItem("selectedDemoScenario");
        navigate("/processing");
      };
      reader.readAsDataURL(file);
    } else {
      // Use selected demo scenario
      sessionStorage.setItem("uploadedFile", "demo");
      sessionStorage.setItem("uploadedFileName", "sample_invoice.jpg");
      sessionStorage.setItem("uploadedFileType", "image/jpeg");
      sessionStorage.setItem("selectedDemoScenario", selectedScenarioId);
      navigate("/processing");
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Upload className="h-6 w-6 text-primary" />
            Upload Bill & Invoice
          </h1>
          <p className="text-muted-foreground text-sm">
            High-accuracy OCR recognition with Gemini Vision, PaddleOCR & LayoutLM pipeline
          </p>
        </div>

        <Badge variant="outline" className="text-xs py-1 px-3 self-start sm:self-auto gap-1.5 font-medium">
          <Cpu className="h-3.5 w-3.5 text-primary" />
          Active Engine: <span className="font-bold capitalize text-foreground">{config.ocrMode}</span>
        </Badge>
      </div>

      {/* Gemini Vision High-Speed Alert / Quick Key Prompt */}
      {!config.geminiApiKey ? (
        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0 border border-amber-500/20">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">
                  Enable 1-Second 99% Accurate Gemini Vision Scanning
                </h4>
                <p className="text-xs text-muted-foreground">
                  Add your free Google Gemini API Key to unlock instant multimodal invoice extraction.
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/settings")}
              className="border-amber-500/30 text-xs font-semibold gap-1.5 shrink-0 self-start sm:self-auto"
            >
              Add Key in Settings
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="flex items-center justify-between p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 text-xs text-emerald-800 dark:text-emerald-300">
          <span className="flex items-center gap-2 font-medium">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            <span>
              <strong>Gemini 1.5 Flash Vision Active:</strong> High-speed multimodal Indian bill parsing enabled (~1.2s).
            </span>
          </span>
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-300 text-[10px]">
            Ready
          </Badge>
        </div>
      )}

      {/* Client Selection */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">1. Select CA Client Account</CardTitle>
          <CardDescription>Associate this invoice with a specific taxpayer client in your ledger</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedClient} onValueChange={(v) => setSelectedClient(v || "client-001")}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Choose a client for this bill" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name} — {client.gstin}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Upload Zone */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">2. Document Ingestion</CardTitle>
          <CardDescription>Drag & drop scanned invoice, camera photo, or PDF bill</CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          {!file ? (
            <div
              className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-all duration-300 ${
                dragActive
                  ? "border-primary bg-primary/5 scale-[1.01]"
                  : "border-border/80 hover:border-primary/50 hover:bg-accent/20"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-3">
                <Upload className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">Drag & Drop Bill / Invoice Here</h3>
              <p className="text-xs text-muted-foreground mb-5">Supports printed invoices, handwritten memos, and PDF receipts</p>

              <div className="flex flex-wrap justify-center gap-3">
                <Button onClick={() => fileInputRef.current?.click()} className="gap-2">
                  <FileImage className="h-4 w-4" />
                  Browse Files
                </Button>
                <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="gap-2">
                  <Camera className="h-4 w-4" />
                  Capture Photo
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                className="hidden"
              />

              <div className="flex items-center gap-4 mt-5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <FileImage className="h-3 w-3" /> JPG / PNG
                </span>
                <span className="flex items-center gap-1">
                  <FileText className="h-3 w-3" /> PDF Documents
                </span>
                <span>• Up to 20MB</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-4 rounded-xl border border-border/60 p-4 bg-accent/20">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-28 w-24 rounded-lg object-cover border border-border/60 shadow-xs"
                  />
                ) : (
                  <div className="flex h-28 w-24 items-center justify-center rounded-lg bg-red-50 border border-red-200">
                    <FileText className="h-8 w-8 text-red-500" />
                  </div>
                )}
                <div className="flex-1 space-y-1">
                  <p className="font-semibold text-foreground">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB • {file.type || "Document"}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="h-2 flex-1 rounded-full bg-emerald-100">
                      <div className="h-full w-full rounded-full bg-emerald-500" />
                    </div>
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Ready for AI Pipeline
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={removeFile} className="shrink-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Demo Showcase Scenarios Picker */}
      {!file && (
        <Card className="border-border/60 bg-muted/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                Or Select a Showcase Demo Scenario
              </CardTitle>
              <Badge variant="secondary" className="text-[10px]">
                Instant Demo Mode
              </Badge>
            </div>
            <CardDescription>
              Test different real-world CA invoice formats without needing sample image files
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {demoScenarios.map((scenario) => {
                const isSelected = selectedScenarioId === scenario.id;
                return (
                  <div
                    key={scenario.id}
                    onClick={() => setSelectedScenarioId(scenario.id)}
                    className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-xs"
                        : "border-border/60 hover:border-primary/40 bg-card"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm line-clamp-1">{scenario.title}</span>
                      {isSelected && <CheckCircle2 className="h-4 w-4 text-primary shrink-0 ml-1" />}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {scenario.description}
                    </p>
                    <Badge variant="outline" className="text-[10px] w-full justify-center">
                      {scenario.badge}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Process CTA Button */}
      <Button
        onClick={handleProcess}
        size="lg"
        className="w-full h-12 text-base font-semibold gap-2 shadow-md"
      >
        {file ? "Execute Multi-Engine AI Recognition" : "Run Selected Demo Showcase Pipeline"}
        <ArrowRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
