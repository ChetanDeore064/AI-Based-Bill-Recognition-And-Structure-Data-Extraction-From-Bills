import type { OCRMode } from "@/types/ocr";

export interface OCRConfig {
  ocrMode: OCRMode;
  backendUrl: string;
  geminiApiKey?: string;
  openaiApiKey?: string;
  preferredModel: "gemini-3.5-flash-lite" | "gemini-3.6-flash" | "gpt-4o-mini";
  confidenceThreshold: number;
  enableHandwriting: boolean;
  enableFinancialValidation: boolean;
  enableDuplicateDetection: boolean;
  autoRotate: boolean;
  denoiseImage: boolean;
}

const STORAGE_KEY = "ca_billmate_ocr_config";

const DEFAULT_CONFIG: OCRConfig = {
  ocrMode: "gemini", // Default to ultra-fast Gemini Vision
  backendUrl: "http://localhost:8000",
  geminiApiKey: "",
  openaiApiKey: "",
  preferredModel: "gemini-3.5-flash-lite",
  confidenceThreshold: 80,
  enableHandwriting: true,
  enableFinancialValidation: true,
  enableDuplicateDetection: true,
  autoRotate: true,
  denoiseImage: true,
};

export function getOCRConfig(): OCRConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.warn("Failed to load OCR config from localStorage", e);
  }
  return DEFAULT_CONFIG;
}

export function saveOCRConfig(config: Partial<OCRConfig>): OCRConfig {
  const current = getOCRConfig();
  const updated = { ...current, ...config };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn("Failed to save OCR config to localStorage", e);
  }
  return updated;
}

export async function checkBackendHealth(backendUrl?: string): Promise<{ available: boolean; latencyMs: number; details?: Record<string, unknown> }> {
  const url = backendUrl || getOCRConfig().backendUrl;
  const start = performance.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(`${url}/api/health`, {
      method: "GET",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const latencyMs = Math.round(performance.now() - start);
    if (res.ok) {
      const data = await res.json();
      return { available: true, latencyMs, details: data };
    }
    return { available: false, latencyMs, details: { error: `HTTP ${res.status}` } };
  } catch (err: unknown) {
    const latencyMs = Math.round(performance.now() - start);
    const errorMessage = err instanceof Error ? err.message : "Connection failed";
    return { available: false, latencyMs, details: { error: errorMessage } };
  }
}
