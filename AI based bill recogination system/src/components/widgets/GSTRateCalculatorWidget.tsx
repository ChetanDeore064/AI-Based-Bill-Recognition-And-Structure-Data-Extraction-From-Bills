import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator, Check, Copy } from "lucide-react";
import { formatCurrency } from "@/components/BillTable";

const GST_SLABS = [0, 5, 12, 18, 28];

export function GSTRateCalculatorWidget() {
  const [baseAmount, setBaseAmount] = useState<number>(10000);
  const [selectedRate, setSelectedRate] = useState<number>(18);
  const [isInterState, setIsInterState] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const taxAmount = (baseAmount * selectedRate) / 100;
  const totalAmount = baseAmount + taxAmount;
  const cgst = isInterState ? 0 : taxAmount / 2;
  const sgst = isInterState ? 0 : taxAmount / 2;
  const igst = isInterState ? taxAmount : 0;

  const handleCopy = () => {
    const text = `Taxable: ₹${baseAmount} | GST (${selectedRate}%): ₹${taxAmount} (${isInterState ? `IGST: ₹${igst}` : `CGST: ₹${cgst} + SGST: ₹${sgst}`}) | Total: ₹${totalAmount}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="border-border/60 bg-card shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600 border border-indigo-500/20">
              <Calculator className="h-4.5 w-4.5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">Interactive GST & HSN Estimator</CardTitle>
              <CardDescription className="text-xs">
                Instant statutory tax computation & tariff slabs
              </CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 text-xs gap-1">
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy Split"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Input & Slabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-muted-foreground font-medium">Taxable Base Amount (₹)</Label>
            <Input
              type="number"
              value={baseAmount || ""}
              onChange={(e) => setBaseAmount(parseFloat(e.target.value) || 0)}
              className="h-9 mt-1 font-mono text-sm"
              placeholder="e.g. 25000"
            />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground font-medium mb-1 block">GST Rate Slab</Label>
            <div className="flex gap-1.5 pt-1">
              {GST_SLABS.map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => setSelectedRate(rate)}
                  className={`flex-1 py-1 rounded-md text-xs font-semibold border transition-all ${
                    selectedRate === rate
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "bg-muted/40 hover:bg-muted text-muted-foreground border-border/60"
                  }`}
                >
                  {rate}%
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* State Supply toggle */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border/40 text-xs">
          <span className="text-muted-foreground font-medium">Supply Type:</span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setIsInterState(false)}
              className={`px-2.5 py-1 rounded-md font-medium text-xs transition-all ${
                !isInterState ? "bg-primary/10 text-primary font-bold border border-primary/30" : "text-muted-foreground"
              }`}
            >
              Intrastate (CGST + SGST)
            </button>
            <button
              type="button"
              onClick={() => setIsInterState(true)}
              className={`px-2.5 py-1 rounded-md font-medium text-xs transition-all ${
                isInterState ? "bg-primary/10 text-primary font-bold border border-primary/30" : "text-muted-foreground"
              }`}
            >
              Interstate (IGST)
            </button>
          </div>
        </div>

        {/* Calculated Breakdown Display */}
        <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-gradient-to-r from-primary/5 via-indigo-500/5 to-purple-500/5 border border-primary/20">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Taxable Base</p>
            <p className="text-sm font-bold text-foreground mt-0.5">{formatCurrency(baseAmount)}</p>
          </div>

          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
              Tax ({selectedRate}%)
            </p>
            <p className="text-sm font-bold text-primary mt-0.5">{formatCurrency(taxAmount)}</p>
            <p className="text-[9px] text-muted-foreground">
              {isInterState ? `IGST: ${formatCurrency(igst)}` : `C: ${formatCurrency(cgst)} | S: ${formatCurrency(sgst)}`}
            </p>
          </div>

          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Grand Total</p>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{formatCurrency(totalAmount)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
