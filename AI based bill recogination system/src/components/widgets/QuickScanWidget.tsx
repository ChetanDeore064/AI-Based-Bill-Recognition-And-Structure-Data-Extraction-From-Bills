import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp } from "@/context/AppContext";
import { getOCRConfig } from "@/services/ocrConfig";
import {
  Zap,
  Upload,
  FileText,
  X,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export function QuickScanWidget() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState("client-001");
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
      sessionStorage.setItem("uploadedFile", "demo");
      sessionStorage.setItem("uploadedFileName", "sample_invoice.jpg");
      sessionStorage.setItem("uploadedFileType", "image/jpeg");
      sessionStorage.setItem("selectedDemoScenario", "scenario-printed-gst");
      navigate("/processing");
    }
  };

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-card via-card to-primary/5 shadow-sm overflow-hidden relative">
      <div className="absolute top-0 right-0 h-32 w-32 bg-primary/10 rounded-full blur-3xl -z-10" />

      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <Zap className="h-4.5 w-4.5 fill-primary/20" />
            </div>
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                Quick AI Bill Ingestion
                <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px] py-0">
                  1-Sec Scan
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs">
                Drag any Indian GST bill, cash memo, or receipt for instant extraction
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="text-[10px] hidden sm:flex items-center gap-1 font-mono">
            <Sparkles className="h-3 w-3 text-amber-500" />
            {config.preferredModel}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Client Selector inline */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">Client Account:</span>
          <Select value={selectedClient} onValueChange={(v) => setSelectedClient(v || "client-001")}>
            <SelectTrigger className="h-8 text-xs flex-1">
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((c) => (
                <SelectItem key={c.id} value={c.id} className="text-xs">
                  {c.name} ({c.gstin})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Dropzone */}
        {!file ? (
          <div
            className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-all duration-200 cursor-pointer ${
              dragActive
                ? "border-primary bg-primary/10 scale-[1.01]"
                : "border-border/80 hover:border-primary/50 hover:bg-accent/30 bg-background/50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 mb-2">
              <Upload className="h-5 w-5 text-primary" />
            </div>
            <p className="text-xs font-semibold text-foreground">Drop receipt / invoice image or PDF here</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Supports JPG, PNG, WebP, PDF up to 20MB</p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              className="hidden"
            />
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-border/80 p-3 bg-accent/20">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="h-16 w-14 rounded-md object-cover border border-border/60 shadow-xs"
              />
            ) : (
              <div className="flex h-16 w-14 items-center justify-center rounded-md bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900">
                <FileText className="h-6 w-6 text-red-500" />
              </div>
            )}
            <div className="flex-1 min-w-0 space-y-0.5">
              <p className="font-semibold text-xs text-foreground truncate">{file.name}</p>
              <p className="text-[10px] text-muted-foreground">
                {(file.size / 1024).toFixed(1)} KB • {file.type || "Document"}
              </p>
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
                <CheckCircle2 className="h-3 w-3" /> Ready for AI Vision Extraction
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
                setPreview(null);
              }}
              className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Process CTA Button */}
        <Button
          onClick={handleProcess}
          size="sm"
          className="w-full h-10 text-xs font-semibold gap-2 shadow-xs bg-primary hover:bg-primary/90"
        >
          {file ? "Execute 1-Second AI Recognition" : "Quick Scan Sample GST Invoice"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
