import { useApp } from "@/context/AppContext";
import { StatCard } from "@/components/StatCard";
import { BillTable, formatCurrency } from "@/components/BillTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardStats, billsPerDay, recentActivity } from "@/data/dashboard";
import { useNavigate } from "react-router-dom";
import { FileText, CheckCircle, Clock, IndianRupee, Upload, FileDown, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { QuickScanWidget } from "@/components/widgets/QuickScanWidget";
import { TaxReconciliationWidget } from "@/components/widgets/TaxReconciliationWidget";
import { GSTRateCalculatorWidget } from "@/components/widgets/GSTRateCalculatorWidget";
import { AISpeedMeterWidget } from "@/components/widgets/AISpeedMeterWidget";

export default function Dashboard() {
  const { bills } = useApp();
  const navigate = useNavigate();
  const recentBills = bills.slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            Dashboard
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              Live AI Active
            </span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Welcome back, Pranav. Here is your CA document recognition & GST audit ledger.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate("/upload")} className="gap-2">
            <Upload className="h-4 w-4" />
            Upload Bill
          </Button>
          <Button variant="outline" onClick={() => navigate("/export")} className="gap-2">
            <FileDown className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Bills"
          value={dashboardStats.totalBills.toLocaleString("en-IN")}
          trend={dashboardStats.totalBillsTrend}
          subtitle="vs last month"
          icon={<FileText className="h-6 w-6 text-blue-600" />}
          iconBg="bg-blue-500/10"
        />
        <StatCard
          title="Processed & Verified"
          value={dashboardStats.processed.toLocaleString("en-IN")}
          subtitle={`${dashboardStats.processedPercent}% complete`}
          icon={<CheckCircle className="h-6 w-6 text-emerald-600" />}
          iconBg="bg-emerald-500/10"
        />
        <StatCard
          title="Pending CA Review"
          value={dashboardStats.pendingReview.toString()}
          trend={dashboardStats.pendingReviewTrend}
          subtitle="vs last month"
          icon={<Clock className="h-6 w-6 text-amber-600" />}
          iconBg="bg-amber-500/10"
        />
        <StatCard
          title="Total Invoice Value"
          value={formatCurrency(dashboardStats.totalInvoiceValue)}
          icon={<IndianRupee className="h-6 w-6 text-purple-600" />}
          iconBg="bg-purple-500/10"
        />
      </div>

      {/* Spotlight Row: Quick Ingestion Widget + AI Speed Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7">
          <QuickScanWidget />
        </div>
        <div className="lg:col-span-5">
          <AISpeedMeterWidget />
        </div>
      </div>

      {/* Financial Widgets Row: Tax Reconciliation + GST Estimator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TaxReconciliationWidget />
        <GSTRateCalculatorWidget />
      </div>

      {/* Charts + Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bills per day chart */}
        <Card className="lg:col-span-2 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Bills Processed This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={billsPerDay} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid hsl(var(--border))",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar dataKey="bills" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium leading-tight">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.detail}</p>
                    <p className="text-[10px] text-muted-foreground/60">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bills */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Recent Bills & Invoices</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate("/bills")}>
            View All
          </Button>
        </div>
        <BillTable bills={recentBills} compact />
      </div>
    </div>
  );
}

