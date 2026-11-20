import type { BillStatus } from "@/data/bills";
import { Badge } from "@/components/ui/badge";

const statusConfig: Record<BillStatus, { label: string; className: string; dot: string }> = {
  Verified: {
    label: "Verified",
    className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20",
    dot: "bg-emerald-500",
  },
  Review: {
    label: "Review Required",
    className: "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20",
    dot: "bg-amber-500",
  },
  Processing: {
    label: "Processing",
    className: "bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20",
    dot: "bg-blue-500 animate-pulse",
  },
  Error: {
    label: "Error",
    className: "bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20",
    dot: "bg-red-500",
  },
};

interface StatusBadgeProps {
  status: BillStatus;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge
      variant="outline"
      className={`${config.className} ${size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-2.5 py-1"} gap-1.5 font-medium`}
    >
      <span className={`inline-block w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </Badge>
  );
}
