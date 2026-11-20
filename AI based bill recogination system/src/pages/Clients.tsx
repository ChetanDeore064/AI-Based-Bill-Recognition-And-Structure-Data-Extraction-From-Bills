import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Users, Plus, FileText, Clock, IndianRupee, ArrowRight } from "lucide-react";
import type { Client } from "@/data/clients";

export default function Clients() {
  const { clients, addClient, getBillsByClient } = useApp();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [newClient, setNewClient] = useState({ name: "", contact: "", email: "", gstin: "", address: "" });

  const handleAddClient = () => {
    if (!newClient.name) return;
    const client: Client = {
      id: `client-${Date.now()}`,
      ...newClient,
      billCount: 0,
      pendingCount: 0,
      totalValue: 0,
    };
    addClient(client);
    setNewClient({ name: "", contact: "", email: "", gstin: "", address: "" });
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Clients
          </h1>
          <p className="text-muted-foreground">Manage your client portfolio and their invoices</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button className="gap-2" />}>
            <Plus className="h-4 w-4" />
            Add Client
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Company Name *</Label>
                <Input
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  placeholder="e.g. Sharma Industries Pvt. Ltd."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Contact Person</Label>
                  <Input
                    value={newClient.contact}
                    onChange={(e) => setNewClient({ ...newClient, contact: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>GSTIN</Label>
                <Input
                  value={newClient.gstin}
                  onChange={(e) => setNewClient({ ...newClient, gstin: e.target.value })}
                  placeholder="e.g. 27XXXXX1234X1Z5"
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input
                  value={newClient.address}
                  onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                />
              </div>
              <Button onClick={handleAddClient} className="w-full">Add Client</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.map((client) => {
          const clientBills = getBillsByClient(client.id);
          const billCount = clientBills.length > 0 ? clientBills.length : client.billCount;
          const pendingCount = clientBills.filter((b) => b.status === "Review").length || client.pendingCount;
          const totalValue = clientBills.length > 0
            ? clientBills.reduce((s, b) => s + b.totalAmount, 0)
            : client.totalValue;

          return (
            <Card
              key={client.id}
              className="border-border/50 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5 group"
              onClick={() => navigate(`/bills?client=${client.id}`)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-lg">
                    {client.name.charAt(0)}
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{client.name}</h3>
                <p className="text-xs text-muted-foreground mb-4">{client.contact} • {client.email}</p>

                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border/50">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground mb-0.5">
                      <FileText className="h-3 w-3" />
                    </div>
                    <p className="text-lg font-bold">{billCount}</p>
                    <p className="text-[10px] text-muted-foreground">Bills</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-amber-500 mb-0.5">
                      <Clock className="h-3 w-3" />
                    </div>
                    <p className="text-lg font-bold text-amber-600">{pendingCount}</p>
                    <p className="text-[10px] text-muted-foreground">Pending</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-emerald-500 mb-0.5">
                      <IndianRupee className="h-3 w-3" />
                    </div>
                    <p className="text-sm font-bold text-emerald-600">{(totalValue / 100000).toFixed(1)}L</p>
                    <p className="text-[10px] text-muted-foreground">Value</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
