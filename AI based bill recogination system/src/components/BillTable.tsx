import { useNavigate } from "react-router-dom";
import type { Bill } from "@/data/bills";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Eye, Pencil, Trash2 } from "lucide-react";

interface BillTableProps {
  bills: Bill[];
  onDelete?: (id: string) => void;
  compact?: boolean;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function BillTable({ bills, onDelete, compact = false }: BillTableProps) {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl border border-border/50 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="font-semibold">Invoice No</TableHead>
            <TableHead className="font-semibold">Vendor</TableHead>
            <TableHead className="font-semibold hidden md:table-cell">Date</TableHead>
            {!compact && <TableHead className="font-semibold hidden lg:table-cell">GSTIN</TableHead>}
            <TableHead className="font-semibold text-right">Amount</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bills.map((bill) => (
            <TableRow
              key={bill.id}
              className="cursor-pointer transition-colors hover:bg-accent/50"
              onClick={() => navigate(`/review/${bill.id}`)}
            >
              <TableCell className="font-medium text-primary">{bill.invoiceNumber}</TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{bill.vendorName}</p>
                  <p className="text-xs text-muted-foreground hidden sm:block">{bill.type}</p>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground">{bill.invoiceDate}</TableCell>
              {!compact && (
                <TableCell className="hidden lg:table-cell font-mono text-xs text-muted-foreground">
                  {bill.vendorGSTIN}
                </TableCell>
              )}
              <TableCell className="text-right font-semibold tabular-nums">
                {formatCurrency(bill.totalAmount)}
              </TableCell>
              <TableCell>
                <StatusBadge status={bill.status} size="sm" />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => navigate(`/review/${bill.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => navigate(`/review/${bill.id}`)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => onDelete(bill.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
          {bills.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                No bills found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export { formatCurrency };
