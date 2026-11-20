import { useApp } from "@/context/AppContext";
import { formatCurrency } from "@/components/BillTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { billsPerDay, monthlyTrend, gstSummary } from "@/data/dashboard";
import { BarChart3, IndianRupee } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";

export default function Reports() {
  const { bills } = useApp();

  const statusCounts = {
    Verified: bills.filter((b) => b.status === "Verified").length,
    Review: bills.filter((b) => b.status === "Review").length,
    Processing: bills.filter((b) => b.status === "Processing").length,
    Error: bills.filter((b) => b.status === "Error").length,
  };

  const pieData = [
    { name: "Verified", value: statusCounts.Verified, fill: "#10B981" },
    { name: "Review", value: statusCounts.Review, fill: "#F59E0B" },
    { name: "Processing", value: statusCounts.Processing, fill: "#3B82F6" },
    { name: "Error", value: statusCounts.Error, fill: "#EF4444" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          Reports & Analytics
        </h1>
        <p className="text-muted-foreground">Accounting analytics and billing insights</p>
      </div>

      {/* GST Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "CGST", value: gstSummary.cgst, color: "text-blue-600" },
          { label: "SGST", value: gstSummary.sgst, color: "text-indigo-600" },
          { label: "IGST", value: gstSummary.igst, color: "text-purple-600" },
          { label: "Total GST", value: gstSummary.total, color: "text-primary" },
        ].map((item) => (
          <Card key={item.label} className="border-border/50">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
              <p className={`text-lg font-bold tabular-nums ${item.color}`}>{formatCurrency(item.value)}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bills per day */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Bills Processed Per Day</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={billsPerDay} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))" }} />
                <Bar dataKey="bills" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Invoice Status Pie */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Invoice Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }: { name?: string; percent?: number }) => `${name || ""} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))" }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <IndianRupee className="h-4 w-4 text-primary" />
            Monthly Invoice Value Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`}
              />
              <Tooltip
                contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))" }}
                formatter={(value) => [formatCurrency(Number(value) || 0), "Invoice Value"]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ r: 5, strokeWidth: 2 }}
                activeDot={{ r: 7 }}
                name="Invoice Value"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
