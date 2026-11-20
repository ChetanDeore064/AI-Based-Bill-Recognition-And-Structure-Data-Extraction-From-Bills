import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { BillTable } from "@/components/BillTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, FileDown } from "lucide-react";
import { exportToExcel } from "@/services/exportService";
import type { BillStatus } from "@/data/bills";

export default function Bills() {
  const { bills, deleteBill } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");

  const statusFilter = (searchParams.get("status") as BillStatus | "All") || "All";

  const filteredBills = useMemo(() => {
    let result = bills;

    if (statusFilter !== "All") {
      result = result.filter((b) => b.status === statusFilter);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.invoiceNumber.toLowerCase().includes(q) ||
          b.vendorName.toLowerCase().includes(q) ||
          b.vendorGSTIN.toLowerCase().includes(q) ||
          b.customerName.toLowerCase().includes(q)
      );
    }

    return result;
  }, [bills, statusFilter, search]);

  const setStatus = (status: string) => {
    if (status === "All") {
      searchParams.delete("status");
    } else {
      searchParams.set("status", status);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Bills Management</h1>
          <p className="text-muted-foreground">Search, filter, and manage all your invoices</p>
        </div>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => exportToExcel(filteredBills, "Filtered_Bills")}
        >
          <FileDown className="h-4 w-4" />
          Export ({filteredBills.length})
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search invoice number, vendor, or GSTIN..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-11"
        />
      </div>

      {/* Status Tabs */}
      <Tabs value={statusFilter} onValueChange={setStatus}>
        <TabsList>
          <TabsTrigger value="All">All ({bills.length})</TabsTrigger>
          <TabsTrigger value="Verified">
            Verified ({bills.filter((b) => b.status === "Verified").length})
          </TabsTrigger>
          <TabsTrigger value="Review">
            Review ({bills.filter((b) => b.status === "Review").length})
          </TabsTrigger>
          <TabsTrigger value="Processing">
            Processing ({bills.filter((b) => b.status === "Processing").length})
          </TabsTrigger>
          <TabsTrigger value="Error">
            Error ({bills.filter((b) => b.status === "Error").length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Bills Table */}
      <BillTable bills={filteredBills} onDelete={deleteBill} />

      {/* Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground bg-muted/50 rounded-lg px-4 py-3">
        <span>Showing {filteredBills.length} of {bills.length} bills</span>
        <span className="font-medium">
          Total Value: {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(
            filteredBills.reduce((s, b) => s + b.totalAmount, 0)
          )}
        </span>
      </div>
    </div>
  );
}
