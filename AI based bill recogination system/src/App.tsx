import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import UploadBill from "@/pages/UploadBill";
import Processing from "@/pages/Processing";
import ReviewBill from "@/pages/ReviewBill";
import Bills from "@/pages/Bills";
import Clients from "@/pages/Clients";
import Reports from "@/pages/Reports";
import Export from "@/pages/Export";
import Settings from "@/pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <TooltipProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/upload" element={<UploadBill />} />
              <Route path="/processing" element={<Processing />} />
              <Route path="/review/:id" element={<ReviewBill />} />
              <Route path="/bills" element={<Bills />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/export" element={<Export />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </TooltipProvider>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
