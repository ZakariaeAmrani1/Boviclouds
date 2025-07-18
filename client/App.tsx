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
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Rebouclage from "./pages/Rebouclage";
import Utilisateurs from "./pages/Utilisateurs";
import CCTV from "./pages/CCTV";
import EditProfile from "./pages/EditProfile";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";

// Suppress Recharts defaultProps deprecation warnings
const originalWarn = console.warn;
console.warn = (...args: any[]) => {
  // Check for the specific recharts defaultProps warning pattern
  if (args.length >= 2 && typeof args[0] === "string") {
    const message = args[0];
    const componentName = args[1];

    if (
      message.includes(
        "Support for defaultProps will be removed from function components",
      ) &&
      (componentName === "XAxis" ||
        componentName === "YAxis" ||
        componentName === "Tooltip" ||
        componentName === "Legend" ||
        componentName === "CartesianGrid" ||
        componentName === "Bar" ||
        componentName === "ResponsiveContainer")
    ) {
      return; // Suppress recharts component warnings
    }
  }

  // Also suppress if the warning contains recharts-related text
  if (
    typeof args[0] === "string" &&
    args[0].includes("Support for defaultProps will be removed") &&
    (args[0].includes("recharts") ||
      args.some(
        (arg: any) =>
          typeof arg === "string" &&
          (arg.includes("XAxis") ||
            arg.includes("YAxis") ||
            arg.includes("Tooltip")),
      ))
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
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
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
              <Route path="utilisateurs" element={<Utilisateurs />} />
              <Route path="cctv" element={<CCTV />} />
              <Route path="profile" element={<EditProfile />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
