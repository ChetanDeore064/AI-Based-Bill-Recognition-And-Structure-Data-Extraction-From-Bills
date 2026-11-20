import { Bell, LogOut, Receipt, Menu, Sun, Moon, Monitor } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, FileText, Upload, Users, BarChart3, FileDown, Settings } from "lucide-react";

const mobileNavItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/bills", label: "All Bills", icon: FileText },
  { path: "/upload", label: "Upload Bills", icon: Upload },
  { path: "/clients", label: "Clients", icon: Users },
  { path: "/reports", label: "Reports", icon: BarChart3 },
  { path: "/export", label: "Export", icon: FileDown },
  { path: "/settings", label: "Settings", icon: Settings },
];

export function Navbar() {
  const { currentUser, notifications, logout, theme, resolvedTheme, setTheme } = useApp();

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        {/* Left: Logo + Mobile Menu */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="lg:hidden" />}>
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <div className="flex items-center gap-2.5 border-b border-border/50 p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25">
                  <Receipt className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-lg font-bold tracking-tight text-foreground">CA BillMate</span>
                </div>
              </div>
              <nav className="space-y-1 p-3">
                {mobileNavItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent"
                      }`
                    }
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <NavLink to="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25">
              <Receipt className="h-5 w-5" />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold tracking-tight text-foreground">
                CA BillMate
              </span>
              <span className="ml-2 hidden md:inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                AI Powered
              </span>
            </div>
          </NavLink>
        </div>

        {/* Right: Theme Switcher + Notifications + User */}
        <div className="flex items-center gap-2">
          {/* Theme Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-foreground/80 hover:text-foreground transition-transform hover:scale-105"
                  title="Toggle light / dark theme"
                />
              }
            >
              {resolvedTheme === "dark" ? (
                <Moon className="h-4.5 w-4.5 text-blue-400 transition-all" />
              ) : (
                <Sun className="h-4.5 w-4.5 text-amber-500 transition-all" />
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem
                onClick={() => setTheme("light")}
                className={`flex items-center gap-2 ${theme === "light" ? "font-semibold text-primary" : ""}`}
              >
                <Sun className="h-4 w-4 text-amber-500" />
                <span>Light</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("dark")}
                className={`flex items-center gap-2 ${theme === "dark" ? "font-semibold text-primary" : ""}`}
              >
                <Moon className="h-4 w-4 text-blue-400" />
                <span>Dark</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("system")}
                className={`flex items-center gap-2 ${theme === "system" ? "font-semibold text-primary" : ""}`}
              >
                <Monitor className="h-4 w-4 text-muted-foreground" />
                <span>System</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notification bell */}
          <Button variant="ghost" size="icon" className="relative rounded-full">
            <Bell className="h-4.5 w-4.5" />
            {notifications > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-lg animate-pulse">
                {notifications}
              </span>
            )}
          </Button>

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" className="gap-2 px-2 rounded-full" />}>
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-semibold">
                  {currentUser.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline text-sm font-medium">{currentUser.name}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">{currentUser.name}</p>
                  <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
                {resolvedTheme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                Switch to {resolvedTheme === "dark" ? "Light" : "Dark"} Mode
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
