import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: number;
  icon: ReactNode;
  iconBg?: string;
}

export function StatCard({ title, value, subtitle, trend, icon, iconBg = "bg-blue-500/10" }: StatCardProps) {
  return (
    <Card className="group relative overflow-hidden border-border/50 bg-card transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
            {(trend !== undefined || subtitle) && (
              <div className="flex items-center gap-2">
                {trend !== undefined && (
                  <span
                    className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
                      trend >= 0 ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    {trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {Math.abs(trend)}%
                  </span>
                )}
                {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
              </div>
            )}
          </div>
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg} transition-transform duration-300 group-hover:scale-110`}>
            {icon}
          </div>
        </div>
      </CardContent>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/50 to-primary/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </Card>
  );
}
