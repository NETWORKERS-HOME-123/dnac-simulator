import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CiscoLayout } from "@/components/layout/CiscoLayout";
import { AuthGuard } from "@/components/layout/AuthGuard";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Topology from "@/pages/Topology";
import Inventory from "@/pages/Inventory";
import Assurance from "@/pages/Assurance";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<AuthGuard><CiscoLayout /></AuthGuard>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/provision/topology" element={<Topology />} />
            <Route path="/provision/inventory" element={<Inventory />} />
            <Route path="/assurance" element={<Assurance />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
