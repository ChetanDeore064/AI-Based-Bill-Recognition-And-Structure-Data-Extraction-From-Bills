import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { mockBills, type Bill, type BillStatus } from "@/data/bills";
import { mockClients, type Client } from "@/data/clients";

export type Theme = "light" | "dark" | "system";

interface AppState {
  bills: Bill[];
  clients: Client[];
  isAuthenticated: boolean;
  currentUser: { name: string; email: string; role: string };
  notifications: number;
  theme: Theme;
  resolvedTheme: "light" | "dark";
}

interface AppContextType extends AppState {
  login: (email: string, password: string) => boolean;
  logout: () => void;
  addBill: (bill: Bill) => void;
  updateBill: (id: string, updates: Partial<Bill>) => void;
  deleteBill: (id: string) => void;
  verifyBill: (id: string) => void;
  addClient: (client: Client) => void;
  getBillsByClient: (clientId: string) => Bill[];
  getBillsByStatus: (status: BillStatus) => Bill[];
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "ca_billmate_theme";

export function AppProvider({ children }: { children: ReactNode }) {
  const [bills, setBills] = useState<Bill[]>(mockBills);
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notifications, setNotifications] = useState(5);
  const currentUser = { name: "Pranav", email: "demo@cabillmate.com", role: "Chartered Accountant" };

  // Theme state
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
      if (saved === "light" || saved === "dark" || saved === "system") {
        return saved;
      }
    } catch {
      // ignore
    }
    return "light";
  });

  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  // Sync theme with DOM documentElement
  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      let isDark = false;
      if (theme === "dark") {
        isDark = true;
      } else if (theme === "system") {
        isDark = mediaQuery.matches;
      } else {
        isDark = false;
      }

      if (isDark) {
        root.classList.add("dark");
        setResolvedTheme("dark");
      } else {
        root.classList.remove("dark");
        setResolvedTheme("light");
      }
    };

    applyTheme();

    const listener = () => {
      if (theme === "system") {
        applyTheme();
      }
    };

    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch {
      // ignore
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const login = useCallback((email: string, password: string) => {
    if (email === "demo@cabillmate.com" && password === "demo123") {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
  }, []);

  const addBill = useCallback((bill: Bill) => {
    setBills((prev) => [bill, ...prev]);
    setNotifications((prev) => prev + 1);
  }, []);

  const updateBill = useCallback((id: string, updates: Partial<Bill>) => {
    setBills((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  }, []);

  const deleteBill = useCallback((id: string) => {
    setBills((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const verifyBill = useCallback((id: string) => {
    setBills((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "Verified" as BillStatus } : b))
    );
    setNotifications((prev) => Math.max(0, prev - 1));
  }, []);

  const addClient = useCallback((client: Client) => {
    setClients((prev) => [...prev, client]);
  }, []);

  const getBillsByClient = useCallback(
    (clientId: string) => bills.filter((b) => b.clientId === clientId),
    [bills]
  );

  const getBillsByStatus = useCallback(
    (status: BillStatus) => bills.filter((b) => b.status === status),
    [bills]
  );

  return (
    <AppContext.Provider
      value={{
        bills,
        clients,
        isAuthenticated,
        currentUser,
        notifications,
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme,
        login,
        logout,
        addBill,
        updateBill,
        deleteBill,
        verifyBill,
        addClient,
        getBillsByClient,
        getBillsByStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}

