import { AlertTriangle } from "lucide-react";

interface ConfidenceBarProps {
  label: string;
  value: number;
  showWarning?: boolean;
}

export function ConfidenceBar({ label, value, showWarning = true }: ConfidenceBarProps) {
  const getColor = (v: number) => {
    if (v >= 90) return "bg-emerald-500";
    if (v >= 75) return "bg-amber-500";
    return "bg-red-500";
  };

  const getTextColor = (v: number) => {
    if (v >= 90) return "text-emerald-600";
    if (v >= 75) return "text-amber-600";
    return "text-red-500";
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className="flex items-center gap-1.5">
          {showWarning && value < 80 && value > 0 && (
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
          )}
          <span className={`text-sm font-semibold tabular-nums ${getTextColor(value)}`}>
            {value > 0 ? `${value}%` : "N/A"}
          </span>
        </div>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full ${getColor(value)} transition-all duration-1000 ease-out`}
          style={{ width: `${value}%` }}
        />
      </div>
      {showWarning && value > 0 && value < 80 && (
        <p className="text-xs text-amber-600">⚠ Low confidence — please verify this field</p>
      )}
    </div>
  );
}
