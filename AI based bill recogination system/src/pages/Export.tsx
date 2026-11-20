import { useState, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { formatCurrency } from "@/components/BillTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { exportToExcel, exportToCSV, computeGSTSummary } from "@/services/exportService";
import { FileSpreadsheet, FileText, CheckCircle, Download, IndianRupee, FileDown } from "lucide-react";

export default function Export() {
  const { bills, clients } = useApp();
  const [selectedClient, setSelectedClient] = useState("all");
  const [dateFrom, setDateFrom] = useState("2026-08-01");
  const [dateTo, setDateTo] = useState("2026-09-12");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [exported, setExported] = useState("");

  const filteredBills = useMemo(() => {
    let result = bills;

    if (selectedClient !== "all") {
      result = result.filter((b) => b.clientId === selectedClient);
    }

    if (statusFilter !== "all") {
      result = result.filter((b) => b.status === statusFilter);
    }

    return result;
  }, [bills, selectedClient, statusFilter]);

  const summary = useMemo(() => computeGSTSummary(filteredBills), [filteredBills]);

  const handleExportExcel = () => {
    const clientName = selectedClient === "all" ? "All_Clients" : clients.find((c) => c.id === selectedClient)?.name || "Export";
    exportToExcel(filteredBills, `CA_BillMate_${clientName}`);
    setExported("excel");
    setTimeout(() => setExported(""), 3000);
  };

  const handleExportCSV = () => {
    const clientName = selectedClient === "all" ? "All_Clients" : clients.find((c) => c.id === selectedClient)?.name || "Export";
    exportToCSV(filteredBills, `CA_BillMate_${clientName}`);
    setExported("csv");
    setTimeout(() => setExported(""), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileDown className="h-6 w-6 text-primary" />
          Export Bills
        </h1>
        <p className="text-muted-foreground">Export your invoice data to Excel or CSV format</p>
      </div>

      {/* Filters */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Export Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Client</Label>
              <Select value={selectedClient} onValueChange={(v) => setSelectedClient(v || "all")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v || "all")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Verified">Verified</SelectItem>
                  <SelectItem value="Review">Pending Review</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date From</Label>
              <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Date To</Label>
              <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <p className="text-3xl font-bold text-primary">{filteredBills.length}</p>
            <p className="text-sm text-muted-foreground">bills selected for export</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Taxable Value</p>
              <p className="text-sm font-bold tabular-nums">{formatCurrency(summary.totalTaxable)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Total GST</p>
              <p className="text-sm font-bold tabular-nums">{formatCurrency(summary.totalGST)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">CGST + SGST</p>
              <p className="text-sm font-bold tabular-nums">{formatCurrency(summary.totalCGST + summary.totalSGST)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Invoice Value</p>
              <p className="text-sm font-bold tabular-nums text-primary">{formatCurrency(summary.totalInvoiceValue)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card
          className={`border-border/50 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5 ${
            exported === "excel" ? "border-emerald-300 bg-emerald-50/50" : ""
          }`}
          onClick={handleExportExcel}
        >
          <CardContent className="p-6 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500/10">
              <FileSpreadsheet className="h-7 w-7 text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">Export to Excel</p>
              <p className="text-xs text-muted-foreground">.xlsx with GST Summary sheet</p>
            </div>
            {exported === "excel" ? (
              <CheckCircle className="h-5 w-5 text-emerald-500" />
            ) : (
              <Download className="h-5 w-5 text-muted-foreground" />
            )}
          </CardContent>
        </Card>

        <Card
          className={`border-border/50 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5 ${
            exported === "csv" ? "border-blue-300 bg-blue-50/50" : ""
          }`}
          onClick={handleExportCSV}
        >
          <CardContent className="p-6 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-500/10">
              <FileText className="h-7 w-7 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">Export to CSV</p>
              <p className="text-xs text-muted-foreground">.csv for Google Sheets / any tool</p>
            </div>
            {exported === "csv" ? (
              <CheckCircle className="h-5 w-5 text-blue-500" />
            ) : (
              <Download className="h-5 w-5 text-muted-foreground" />
            )}
          </CardContent>
        </Card>
      </div>

      {/* GST Detail */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <IndianRupee className="h-4 w-4 text-primary" />
            GST Breakup
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">CGST</span>
              <span className="font-medium tabular-nums">{formatCurrency(summary.totalCGST)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">SGST</span>
              <span className="font-medium tabular-nums">{formatCurrency(summary.totalSGST)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">IGST</span>
              <span className="font-medium tabular-nums">{formatCurrency(summary.totalIGST)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-base font-bold">
              <span>Total GST</span>
              <span className="text-primary tabular-nums">{formatCurrency(summary.totalGST)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
