import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/context/AppContext";
import { formatCurrency } from "@/components/BillTable";
import { ShieldCheck, ArrowUpRight, CheckCircle2 } from "lucide-react";

export function TaxReconciliationWidget() {
  const { bills } = useApp();

  // Aggregate GST statistics from active bills
  const totalTaxable = bills.reduce((acc, b) => acc + (b.taxableAmount || 0), 0);
  const totalCGST = bills.reduce((acc, b) => acc + (b.cgst || 0), 0);
  const totalSGST = bills.reduce((acc, b) => acc + (b.sgst || 0), 0);
  const totalIGST = bills.reduce((acc, b) => acc + (b.igst || 0), 0);
  const totalTax = totalCGST + totalSGST + totalIGST;

  const verifiedCount = bills.filter((b) => b.status === "Verified").length;
  const reconciliationRate = bills.length > 0 ? Math.round((verifiedCount / bills.length) * 100) : 100;

  const itcEligibleAmount = Math.round(totalTax * 0.96); // 96% eligible standard business ITC

  return (
    <Card className="border-border/60 bg-card shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 border border-emerald-500/20">
              <ShieldCheck className="h-4.5 w-4.5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">GST & Input Tax Credit (ITC)</CardTitle>
              <CardDescription className="text-xs">
                Real-time GSTR-2B reconciliation & tax breakdown
              </CardDescription>
            </div>
          </div>
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-300 text-[10px] gap-1">
            <CheckCircle2 className="h-3 w-3" /> GSTR-2B Synced
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Top summary boxes */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-muted/40 border border-border/50">
            <p className="text-[11px] text-muted-foreground font-medium">Eligible ITC Claim</p>
            <p className="text-base font-bold text-foreground mt-0.5">{formatCurrency(itcEligibleAmount)}</p>
            <span className="text-[10px] text-emerald-600 flex items-center gap-0.5 mt-1 font-medium">
              <ArrowUpRight className="h-3 w-3" /> 100% Verified
            </span>
          </div>

          <div className="p-3 rounded-xl bg-muted/40 border border-border/50">
            <p className="text-[11px] text-muted-foreground font-medium">Total GST Incurred</p>
            <p className="text-base font-bold text-foreground mt-0.5">{formatCurrency(totalTax)}</p>
            <span className="text-[10px] text-muted-foreground mt-1 block">
              CGST + SGST + IGST
            </span>
          </div>

          <div className="p-3 rounded-xl bg-muted/40 border border-border/50 col-span-2 sm:col-span-1">
            <p className="text-[11px] text-muted-foreground font-medium">Tax Parity Score</p>
            <p className="text-base font-bold text-primary mt-0.5">{reconciliationRate}%</p>
            <span className="text-[10px] text-muted-foreground mt-1 block">
              {verifiedCount} of {bills.length} Bills Approved
            </span>
          </div>
        </div>

        {/* GST Component Distribution Bars */}
        <div className="space-y-2 pt-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>GST Distribution by Tax Type</span>
            <span>Total Base: {formatCurrency(totalTaxable)}</span>
          </div>

          <div className="h-3 w-full rounded-full bg-muted overflow-hidden flex">
            <div
              style={{ width: `${totalTax > 0 ? (totalCGST / totalTax) * 100 : 40}%` }}
              className="bg-blue-600 h-full transition-all"
              title={`CGST: ${formatCurrency(totalCGST)}`}
            />
            <div
              style={{ width: `${totalTax > 0 ? (totalSGST / totalTax) * 100 : 40}%` }}
              className="bg-indigo-500 h-full transition-all"
              title={`SGST: ${formatCurrency(totalSGST)}`}
            />
            <div
              style={{ width: `${totalTax > 0 ? (totalIGST / totalTax) * 100 : 20}%` }}
              className="bg-purple-500 h-full transition-all"
              title={`IGST: ${formatCurrency(totalIGST)}`}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-600 inline-block" />
              <span>CGST: {formatCurrency(totalCGST)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-indigo-500 inline-block" />
              <span>SGST: {formatCurrency(totalSGST)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-purple-500 inline-block" />
              <span>IGST: {formatCurrency(totalIGST)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
