import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import ErrorBoundary from "./components/ErrorBoundary";
import Login from "./pages/Login";
import ChangePassword from "./pages/ChangePassword";
import Dashboard from "./pages/Dashboard";
import Rebouclage from "./pages/Rebouclage";
import Utilisateurs from "./pages/Utilisateurs";
import CCTV from "./pages/CCTV";
import Traitement from "./pages/Traitement";
import Identification from "./pages/Identification";
import Insemination from "./pages/Insemination";
import Semences from "./pages/Semences";
import Lactations from "./pages/Lactations";
import Exploitations from "./pages/Exploitations";
import EditProfile from "./pages/EditProfile";
import CowDetails from "./pages/CowDetails";
import Morphology from "./pages/Morphology";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";

// Suppress Recharts defaultProps deprecation warnings
const originalWarn = console.warn;
console.warn = (...args: any[]) => {
  // Convert all arguments to string for easier checking
  const fullMessage = args.join(" ");

  // Check if this is a recharts defaultProps warning
  if (
    fullMessage.includes(
      "Support for defaultProps will be removed from function components",
    ) &&
    (fullMessage.includes("XAxis") ||
      fullMessage.includes("YAxis") ||
      fullMessage.includes("Tooltip") ||
      fullMessage.includes("Legend") ||
      fullMessage.includes("CartesianGrid") ||
      fullMessage.includes("Bar") ||
      fullMessage.includes("ResponsiveContainer"))
  ) {
    return; // Suppress recharts component warnings
  }

  // Also check for the formatted warning pattern with %s
  if (
    typeof args[0] === "string" &&
    args[0].includes("Support for defaultProps will be removed") &&
    args.some(
      (arg: any) =>
        typeof arg === "string" &&
        (arg.includes("XAxis") ||
          arg.includes("YAxis") ||
          arg.includes("Tooltip") ||
          arg.includes("Legend") ||
          arg.includes("CartesianGrid") ||
          arg.includes("Bar") ||
          arg.includes("ResponsiveContainer")),
    )
  ) {
    return;
  }

  originalWarn.apply(console, args);
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ErrorBoundary>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/changePassword" element={<ChangePassword />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                {/* Nested routes that will render within the Layout */}
                <Route index element={<Dashboard />} />
                <Route path="rebouclage" element={<Rebouclage />} />
                <Route path="identification" element={<Identification />} />
                <Route path="insemination" element={<Insemination />} />
                <Route path="semences" element={<Semences />} />
                <Route path="lactations" element={<Lactations />} />
                <Route path="exploitations" element={<Exploitations />} />
                <Route path="morphology" element={<Morphology />} />
                <Route path="utilisateurs" element={<Utilisateurs />} />
                <Route path="cctv" element={<CCTV />} />
                <Route path="traitement" element={<Traitement />} />
                <Route path="profile" element={<EditProfile />} />
                <Route path="identification/:id/details" element={<CowDetails />} />
              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
