
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PrawoAsystent from "./pages/PrawoAsystent";
import LegalMonitoring from "./components/LegalMonitoring";
import ContractAnalyzer from "./components/ContractAnalyzer";
import KnowledgeBasePage from "./pages/KnowledgeBasePage";
import ClientDashboardPage from "./pages/ClientDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/prawo-asystent" element={<PrawoAsystent />} />
            <Route path="/legal-monitoring" element={<LegalMonitoring />} />
            <Route path="/contract-analyzer" element={<ContractAnalyzer />} />
            <Route path="/knowledge-base" element={<KnowledgeBasePage />} />
            <Route path="/client-dashboard" element={<ClientDashboardPage />} />
            <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
