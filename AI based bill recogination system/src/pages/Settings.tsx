import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getOCRConfig,
  saveOCRConfig,
  checkBackendHealth,
  type OCRConfig,
} from "@/services/ocrConfig";
import type { OCRMode } from "@/types/ocr";
import {
  Settings as SettingsIcon,
  User,
  Cpu,
  Server,
  Zap,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Sparkles,
  Sliders,
  Check,
  Key,
  ExternalLink,
  Eye,
  EyeOff,
  BrainCircuit,
  Sun,
  Moon,
  Monitor,
  Palette,
} from "lucide-react";

export default function Settings() {
  const { currentUser, theme, setTheme } = useApp();
  const [config, setConfig] = useState<OCRConfig>(getOCRConfig());
  const [saved, setSaved] = useState(false);
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);

  // Health tests
  const [testingHealth, setTestingHealth] = useState(false);
  const [backendStatus, setBackendStatus] = useState<{
    tested: boolean;
    available: boolean;
    latencyMs?: number;
    error?: string;
  }>({ tested: false, available: false });

  // Gemini Test status
  const [testingGemini, setTestingGemini] = useState(false);
  const [geminiStatus, setGeminiStatus] = useState<{
    tested: boolean;
    valid: boolean;
    latencyMs?: number;
    error?: string;
  }>({ tested: false, valid: false });

  const runHealthTest = async () => {
    setTestingHealth(true);
    const res = await checkBackendHealth(config.backendUrl);
    setBackendStatus({
      tested: true,
      available: res.available,
      latencyMs: res.latencyMs,
      error: res.details?.error as string | undefined,
    });
    setTestingHealth(false);
  };

  useEffect(() => {
    runHealthTest();
  }, []);

  const testGeminiApiKey = async () => {
    if (!config.geminiApiKey) {
      setGeminiStatus({
        tested: true,
        valid: false,
        error: "Please enter a Gemini API Key first.",
      });
      return;
    }

    setTestingGemini(true);
    const start = performance.now();
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${config.preferredModel || "gemini-1.5-flash"}:generateContent?key=${config.geminiApiKey}`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Hello! Confirm API key readiness for CA BillMate in 2 words." }] }],
        }),
      });

      const latencyMs = Math.round(performance.now() - start);

      if (res.ok) {
        setGeminiStatus({
          tested: true,
          valid: true,
          latencyMs,
        });
      } else {
        const errText = await res.text();
        setGeminiStatus({
          tested: true,
          valid: false,
          latencyMs,
          error: `API Error ${res.status}: ${errText.slice(0, 120)}`,
        });
      }
    } catch (e: unknown) {
      const latencyMs = Math.round(performance.now() - start);
      setGeminiStatus({
        tested: true,
        valid: false,
        latencyMs,
        error: e instanceof Error ? e.message : "Connection failed",
      });
    } finally {
      setTestingGemini(false);
    }
  };

  const handleModeChange = (mode: OCRMode) => {
    const updated = saveOCRConfig({ ocrMode: mode });
    setConfig(updated);
    triggerSaved();
  };

  const handleToggle = (key: keyof OCRConfig) => {
    const updated = saveOCRConfig({ [key]: !config[key] });
    setConfig(updated);
    triggerSaved();
  };

  const handleInputChange = (key: keyof OCRConfig, value: string | number) => {
    const updated = saveOCRConfig({ [key]: value });
    setConfig(updated);
  };

  const triggerSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <SettingsIcon className="h-6 w-6 text-primary" />
            System Preferences & AI Settings
          </h1>
          <p className="text-muted-foreground text-sm">
            Configure Vision LLM API Keys (Gemini/GPT-4o), OCR engines, and CA verification rules
          </p>
        </div>

        {saved && (
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-300 gap-1.5 py-1 px-3">
            <Check className="h-3.5 w-3.5" /> Settings Saved
          </Badge>
        )}
      </div>

      {/* User Profile Card */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            CA User Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-xl font-bold">
                {currentUser.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{currentUser.name}</h3>
                <Badge variant="secondary" className="text-xs">
                  {currentUser.role}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{currentUser.email}</p>
              <p className="text-xs text-muted-foreground">Firm: Sharma & Associates (Dhule Practice)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance & Theme Selector Card */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Palette className="h-4 w-4 text-primary" />
                Appearance & Workspace Theme
              </CardTitle>
              <CardDescription>
                Choose your preferred interface theme for low-light audit work or high-clarity daylight review
              </CardDescription>
            </div>
            <Badge variant="outline" className="capitalize text-xs font-semibold">
              Current: {theme}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Light Mode */}
            <div
              onClick={() => {
                setTheme("light");
                triggerSaved();
              }}
              className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-3 ${
                theme === "light"
                  ? "border-primary bg-primary/5 shadow-xs"
                  : "border-border/60 hover:border-primary/40 bg-card"
              }`}
            >
              <div className="h-9 w-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 shrink-0">
                <Sun className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Light Mode</p>
                <p className="text-[11px] text-muted-foreground">Crisp clean daytime fintech</p>
              </div>
              {theme === "light" && <Check className="h-4 w-4 text-primary shrink-0" />}
            </div>

            {/* Dark Mode */}
            <div
              onClick={() => {
                setTheme("dark");
                triggerSaved();
              }}
              className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-3 ${
                theme === "dark"
                  ? "border-primary bg-primary/5 shadow-xs"
                  : "border-border/60 hover:border-primary/40 bg-card"
              }`}
            >
              <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 shrink-0">
                <Moon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Dark Mode</p>
                <p className="text-[11px] text-muted-foreground">High-contrast midnight slate</p>
              </div>
              {theme === "dark" && <Check className="h-4 w-4 text-primary shrink-0" />}
            </div>

            {/* System Sync */}
            <div
              onClick={() => {
                setTheme("system");
                triggerSaved();
              }}
              className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-3 ${
                theme === "system"
                  ? "border-primary bg-primary/5 shadow-xs"
                  : "border-border/60 hover:border-primary/40 bg-card"
              }`}
            >
              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground border border-border shrink-0">
                <Monitor className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">System Default</p>
                <p className="text-[11px] text-muted-foreground">Matches OS preferences</p>
              </div>
              {theme === "system" && <Check className="h-4 w-4 text-primary shrink-0" />}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ⚡ GOOGLE GEMINI & OPENAI VISION INTEGRATION */}
      <Card className="border-primary/40 bg-gradient-to-br from-primary/5 via-background to-indigo-500/5 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <Zap className="h-5 w-5 fill-primary/20" />
              </div>
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  Google Gemini Vision AI (1-Second Ultra Fast)
                  <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px]">
                    99%+ Accuracy
                  </Badge>
                </CardTitle>
                <CardDescription className="text-xs">
                  Direct multimodal document recognition. Scans Indian GST bills, line items, and taxes in ~1-2 seconds.
                </CardDescription>
              </div>
            </div>

            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-primary hover:underline flex items-center gap-1 font-medium bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20 w-fit"
            >
              Get Free Gemini API Key <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Gemini API Key Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Key className="h-3.5 w-3.5 text-primary" />
                Google Gemini API Key
              </Label>
              {geminiStatus.tested && (
                <div className="text-xs">
                  {geminiStatus.valid ? (
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-300">
                      <CheckCircle2 className="h-3 w-3" /> Verified ({geminiStatus.latencyMs}ms)
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-rose-600 font-semibold bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-300" title={geminiStatus.error}>
                      <XCircle className="h-3 w-3" /> Error: {geminiStatus.error?.slice(0, 30)}
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type={showGeminiKey ? "text" : "password"}
                  value={config.geminiApiKey || ""}
                  onChange={(e) => {
                    handleInputChange("geminiApiKey", e.target.value);
                    triggerSaved();
                  }}
                  placeholder="AIzaSy..."
                  className="pr-10 font-mono text-xs h-10 border-primary/30 focus-visible:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowGeminiKey(!showGeminiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showGeminiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={testGeminiApiKey}
                disabled={testingGemini}
                className="gap-1.5 h-10 text-xs px-4 border-primary/30"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${testingGemini ? "animate-spin" : ""}`} />
                Test Key
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Stored securely in your local browser session. You get 1,500 free requests per day on Google AI Studio.
            </p>
          </div>

          {/* Model Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div
              onClick={() => {
                handleInputChange("preferredModel", "gemini-3.5-flash-lite");
                triggerSaved();
              }}
              className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                config.preferredModel === "gemini-3.5-flash-lite"
                  ? "border-primary bg-primary/10 font-semibold text-primary shadow-xs"
                  : "border-border/60 hover:border-primary/40 bg-card"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span>gemini-3.5-flash-lite</span>
                <Badge className="bg-emerald-500/10 text-emerald-600 text-[9px] px-1 py-0">Fastest (1.7s)</Badge>
              </div>
              <p className="text-[10px] text-muted-foreground font-normal">Ultra-low latency Indian bill parser</p>
            </div>

            <div
              onClick={() => {
                handleInputChange("preferredModel", "gemini-3.6-flash");
                triggerSaved();
              }}
              className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                config.preferredModel === "gemini-3.6-flash"
                  ? "border-primary bg-primary/10 font-semibold text-primary shadow-xs"
                  : "border-border/60 hover:border-primary/40 bg-card"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span>gemini-3.6-flash</span>
                <Badge variant="outline" className="text-[9px] px-1 py-0">Next-Gen</Badge>
              </div>
              <p className="text-[10px] text-muted-foreground font-normal">Highest accuracy for complex tables</p>
            </div>

            <div
              onClick={() => {
                handleInputChange("preferredModel", "gpt-4o-mini");
                triggerSaved();
              }}
              className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                config.preferredModel === "gpt-4o-mini"
                  ? "border-primary bg-primary/10 font-semibold text-primary shadow-xs"
                  : "border-border/60 hover:border-primary/40 bg-card"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span>gpt-4o-mini</span>
                <Badge variant="outline" className="text-[9px] px-1 py-0">OpenAI</Badge>
              </div>
              <p className="text-[10px] text-muted-foreground font-normal">Requires OpenAI API Key below</p>
            </div>
          </div>

          <Separator className="my-2" />

          {/* OpenAI API Key Input */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 text-muted-foreground">
              <BrainCircuit className="h-3.5 w-3.5" />
              OpenAI API Key (Optional Alternative)
            </Label>
            <div className="relative">
              <Input
                type={showOpenaiKey ? "text" : "password"}
                value={config.openaiApiKey || ""}
                onChange={(e) => {
                  handleInputChange("openaiApiKey", e.target.value);
                  triggerSaved();
                }}
                placeholder="sk-proj-..."
                className="pr-10 font-mono text-xs h-9"
              />
              <button
                type="button"
                onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showOpenaiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI OCR Engine Architecture Selector */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Cpu className="h-4 w-4 text-primary" />
                OCR Engine Pipeline Strategy
              </CardTitle>
              <CardDescription>
                Select how documents are parsed during upload & batch ingestion
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs capitalize font-semibold">
              Active: {config.ocrMode}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Gemini Mode */}
            <div
              onClick={() => handleModeChange("gemini")}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer space-y-2 ${
                config.ocrMode === "gemini"
                  ? "border-primary bg-primary/5 shadow-xs"
                  : "border-border/60 hover:border-primary/40 bg-card"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="font-bold text-sm">Google Gemini Vision</span>
                </div>
                <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px]">
                  1-2s Fast
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Direct Multimodal Vision LLM. Extracts 100% of GST fields, items, and tax breakdown in 1 second.
              </p>
            </div>

            {/* Auto Smart Pipeline */}
            <div
              onClick={() => handleModeChange("auto")}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer space-y-2 ${
                config.ocrMode === "auto"
                  ? "border-primary bg-primary/5 shadow-xs"
                  : "border-border/60 hover:border-primary/40 bg-card"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span className="font-bold text-sm">Auto Smart Pipeline</span>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200 text-[10px]">
                  Auto-Fallback
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Uses Gemini if key available → AI Backend (PaddleOCR + LayoutLM) if up → Browser OCR fallback.
              </p>
            </div>

            {/* OpenAI Mode */}
            <div
              onClick={() => handleModeChange("openai")}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer space-y-2 ${
                config.ocrMode === "openai"
                  ? "border-primary bg-primary/5 shadow-xs"
                  : "border-border/60 hover:border-primary/40 bg-card"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="h-4 w-4 text-indigo-500" />
                  <span className="font-bold text-sm">OpenAI GPT-4o Vision</span>
                </div>
                <Badge variant="outline" className="text-[10px]">
                  GPT-4o Mini
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Multimodal extraction using OpenAI's high-speed vision model with structured JSON enforcement.
              </p>
            </div>

            {/* AI Backend Mode */}
            <div
              onClick={() => handleModeChange("ai_backend")}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer space-y-2 ${
                config.ocrMode === "ai_backend"
                  ? "border-primary bg-primary/5 shadow-xs"
                  : "border-border/60 hover:border-primary/40 bg-card"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="h-4 w-4 text-primary" />
                  <span className="font-bold text-sm">AI Backend Server</span>
                </div>
                <Badge variant="outline" className="text-[10px]">
                  FastAPI
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                PaddleOCR v4 + TrOCR Transformer + LayoutLMv3 microservice running on local Python server.
              </p>
            </div>

            {/* Browser Only Mode */}
            <div
              onClick={() => handleModeChange("browser")}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer space-y-2 ${
                config.ocrMode === "browser"
                  ? "border-primary bg-primary/5 shadow-xs"
                  : "border-border/60 hover:border-primary/40 bg-card"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-slate-500" />
                  <span className="font-bold text-sm">Browser Client OCR</span>
                </div>
                <Badge variant="outline" className="text-[10px]">
                  Tesseract.js
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                100% in-browser WebAssembly recognition. Zero cloud dependency; offline capable.
              </p>
            </div>
          </div>

          {/* Backend Connection Diagnostic */}
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-foreground uppercase tracking-wider">FastAPI Server URL</p>
                <p className="text-xs text-muted-foreground">Endpoint for optional local Python OCR microservice</p>
              </div>

              <div className="flex items-center gap-2">
                {backendStatus.tested && (
                  <div className="flex items-center gap-1.5 text-xs font-medium">
                    {backendStatus.available ? (
                      <span className="flex items-center gap-1 text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-300">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Connected ({backendStatus.latencyMs}ms)
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-600 bg-amber-500/10 px-2 py-1 rounded-md border border-amber-300">
                        <XCircle className="h-3.5 w-3.5" /> Offline (Using Gemini/Browser)
                      </span>
                    )}
                  </div>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={runHealthTest}
                  disabled={testingHealth}
                  className="gap-1.5 h-8 text-xs"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${testingHealth ? "animate-spin" : ""}`} />
                  Test Connection
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Input
                value={config.backendUrl}
                onChange={(e) => {
                  handleInputChange("backendUrl", e.target.value);
                  triggerSaved();
                }}
                placeholder="http://localhost:8000"
                className="h-9 font-mono text-xs"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Threshold & Fine-Tuning */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Sliders className="h-4 w-4 text-primary" />
            Accuracy & CA Verification Controls
          </CardTitle>
          <CardDescription>
            Configure confidence thresholds and statutory validation rules
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Threshold Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <Label className="text-sm font-medium">Auto-Verification Confidence Threshold</Label>
                <p className="text-xs text-muted-foreground">
                  Invoices with confidence score above this percentage can be auto-approved
                </p>
              </div>
              <Badge variant="outline" className="text-sm font-bold font-mono">
                {config.confidenceThreshold}%
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="60"
                max="95"
                step="5"
                value={config.confidenceThreshold}
                onChange={(e) => {
                  handleInputChange("confidenceThreshold", parseInt(e.target.value, 10));
                  triggerSaved();
                }}
                className="w-full accent-primary h-2 bg-muted rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <Separator />

          {/* Handwriting Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Handwritten Document Extraction</p>
              <p className="text-xs text-muted-foreground">
                Enable deep recognition for cursive handwriting and handwritten cash memos
              </p>
            </div>
            <Button
              size="sm"
              variant={config.enableHandwriting ? "default" : "outline"}
              onClick={() => handleToggle("enableHandwriting")}
              className="h-8 text-xs font-semibold"
            >
              {config.enableHandwriting ? "Enabled" : "Disabled"}
            </Button>
          </div>

          <Separator />

          {/* Financial Validation Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Indian GST Statutory & Parity Rules</p>
              <p className="text-xs text-muted-foreground">
                Automatically verify GSTIN format, state code, and math parity (Taxable + CGST + SGST ≈ Total)
              </p>
            </div>
            <Button
              size="sm"
              variant={config.enableFinancialValidation ? "default" : "outline"}
              onClick={() => handleToggle("enableFinancialValidation")}
              className="h-8 text-xs font-semibold"
            >
              {config.enableFinancialValidation ? "Enabled" : "Disabled"}
            </Button>
          </div>

          <Separator />

          {/* Duplicate Detection */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Duplicate Invoice Protection</p>
              <p className="text-xs text-muted-foreground">
                Alert on matching invoice number, vendor GSTIN, and gross amounts across the firm ledger
              </p>
            </div>
            <Button
              size="sm"
              variant={config.enableDuplicateDetection ? "default" : "outline"}
              onClick={() => handleToggle("enableDuplicateDetection")}
              className="h-8 text-xs font-semibold"
            >
              {config.enableDuplicateDetection ? "Enabled" : "Disabled"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
