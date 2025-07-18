// Dashboard shared types and interfaces

export interface DashboardMetric {
  title: string;
  value: string;
  change: string;
  changeText: string;
  changeType: "positive" | "negative";
  icon: React.ReactNode;
  bgColor: string;
}

export interface DashboardAlert {
  id: string;
  module: string;
  description: string;
  location: string;
  responsible: string;
  severity: "high" | "medium" | "low";
  status: "open" | "in_progress" | "resolved";
  time: string;
  progress: number;
}

export interface ProductionData {
  month: string;
  milk: number;
  target: number;
}

export interface CattleBreed {
  breed: string;
  count: number;
  percentage: number;
  color: string;
}

export interface DashboardData {
  metrics: {
    totalCattle: number;
    milkProduction: number;
    mortalityRate: number;
    twinBirths: number;
    cattleChange: number;
    milkChange: number;
    mortalityChange: number;
    twinBirthsChange: number;
  };
  alerts: DashboardAlert[];
  production: ProductionData[];
  cattleBreeds: CattleBreed[];
}

export interface DashboardFilters {
  period?: "today" | "week" | "month" | "year";
  startDate?: string;
  endDate?: string;
}

export interface DashboardStats {
  totalAlerts: number;
  activeAlerts: number;
  resolvedAlerts: number;
  averageProductivity: number;
  totalCattleCount: number;
}

// Export types for the service
export interface DashboardExportOptions {
  format: "csv" | "excel" | "pdf";
  sections?: ("metrics" | "alerts" | "production" | "breeds")[];
  filters?: DashboardFilters;
}

// API Response types
export interface GetDashboardDataResponse {
  success: boolean;
  data: DashboardData;
  timestamp: string;
}

export interface GetDashboardStatsResponse {
  success: boolean;
  data: DashboardStats;
  timestamp: string;
}

export interface ExportDashboardResponse {
  success: boolean;
  downloadUrl: string;
  filename: string;
}
