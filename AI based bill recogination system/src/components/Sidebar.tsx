import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, FileText, Upload, Users, BarChart3,
  FileDown, Settings, ChevronDown, ChevronRight, Receipt
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  {
    label: "Bills",
    icon: FileText,
    children: [
      { path: "/bills", label: "All Bills" },
      { path: "/bills?status=Review", label: "Pending Review" },
      { path: "/bills?status=Verified", label: "Verified Bills" },
    ],
  },
  { path: "/upload", label: "Upload Bills", icon: Upload },
  { path: "/clients", label: "Clients", icon: Users },
  { path: "/reports", label: "Reports", icon: BarChart3 },
  { path: "/export", label: "Export", icon: FileDown },
  { path: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const [billsOpen, setBillsOpen] = useState(location.pathname.startsWith("/bills"));

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-border/50 bg-card/50 backdrop-blur-sm h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          if ("children" in item) {
            return (
              <div key={item.label}>
                <button
                  onClick={() => setBillsOpen(!billsOpen)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <item.icon className="h-4.5 w-4.5" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {billsOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                {billsOpen && (
                  <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-border/50 pl-3">
                    {item.children?.map((child) => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        className={({ isActive }) =>
                          `flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                            isActive
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                          }`
                        }
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`
              }
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom brand */}
      <div className="border-t border-border/50 p-4">
        <div className="flex items-center gap-3 rounded-lg bg-primary/5 p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Receipt className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">CA BillMate</p>
            <p className="text-[10px] text-muted-foreground">v1.0 — AI Powered</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
