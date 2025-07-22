import {
  DashboardData,
  DashboardAlert,
  ProductionData,
  CattleBreed,
  DashboardFilters,
  DashboardStats,
  DashboardExportOptions,
} from "@shared/dashboard";

// Mock data for dashboard
const mockDashboardData: DashboardData = {
  metrics: {
    totalCattle: 40689,
    milkProduction: 193,
    mortalityRate: 2.1,
    twinBirths: 247,
    cattleChange: 8.5,
    milkChange: 1.3,
    mortalityChange: -0.3,
    twinBirthsChange: 12.8,
  },
  alerts: [
    {
      id: "ALT-001",
      module: "Système de traite",
      description: "Maintenance préventive requise",
      location: "Étable A - Box 15-20",
      responsible: "Jean Dupont",
      severity: "high",
      status: "open",
      time: "il y a 2h",
      progress: 65,
    },
    {
      id: "ALT-002",
      module: "Système d'alimentation",
      description: "Contrôle de qualité",
      location: "Zone de distribution B",
      responsible: "Marie Claire",
      severity: "medium",
      status: "in_progress",
      time: "il y a 4h",
      progress: 80,
    },
    {
      id: "ALT-003",
      module: "Reproduction",
      description: "Suivi de gestation",
      location: "Secteur C - Logement",
      responsible: "Pierre Martin",
      severity: "low",
      status: "resolved",
      time: "il y a 1j",
      progress: 100,
    },
    {
      id: "ALT-004",
      module: "Santé animale",
      description: "Programme de vaccination",
      location: "Infirmerie - Zone D",
      responsible: "Dr. Sophie Laurent",
      severity: "medium",
      status: "open",
      time: "il y a 6h",
      progress: 45,
    },
  ],
  production: [
    { month: "Jan", milk: 4500, target: 4200 },
    { month: "Fév", milk: 4800, target: 4300 },
    { month: "Mar", milk: 4600, target: 4400 },
    { month: "Avr", milk: 5200, target: 4500 },
    { month: "Mai", milk: 5400, target: 4600 },
    { month: "Juin", milk: 5100, target: 4700 },
    { month: "Juil", milk: 5600, target: 4800 },
    { month: "Août", milk: 5300, target: 4900 },
  ],
  cattleBreeds: [
    {
      breed: "Holstein",
      count: 2085,
      percentage: 52.1,
      color: "#3B82F6",
    },
    {
      breed: "Charolaise",
      count: 912,
      percentage: 22.8,
      color: "#EF4444",
    },
    {
      breed: "Montbéliarde",
      count: 556,
      percentage: 13.9,
      color: "#10B981",
    },
    {
      breed: "Brune Suisse",
      count: 448,
      percentage: 11.2,
      color: "#8B5CF6",
    },
  ],
};

// Utility function to format date to French format
const formatDateToFrench = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR");
};

// Utility function to generate time ranges based on period
const getDateRange = (period: string) => {
  const now = new Date();
  let startDate: Date;

  switch (period) {
    case "today":
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "week":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "month":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "year":
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  return { startDate, endDate: now };
};

// Apply filters to data based on period/date range
const applyFilters = (
  data: DashboardData,
  filters: DashboardFilters,
): DashboardData => {
  if (!filters.period && !filters.startDate) {
    return data;
  }

  // For demo purposes, we'll just return the data as-is
  // In a real implementation, you would filter the data based on the date range
  const { startDate, endDate } = filters.period
    ? getDateRange(filters.period)
    : {
        startDate: new Date(filters.startDate!),
        endDate: new Date(filters.endDate!),
      };

  // Apply period-based modifications to simulate filtering
  const periodMultiplier =
    filters.period === "today"
      ? 0.3
      : filters.period === "week"
        ? 0.7
        : filters.period === "year"
          ? 1.5
          : 1;

  return {
    ...data,
    metrics: {
      ...data.metrics,
      totalCattle: Math.floor(data.metrics.totalCattle * periodMultiplier),
      milkProduction: Math.floor(
        data.metrics.milkProduction * periodMultiplier,
      ),
      twinBirths: Math.floor(data.metrics.twinBirths * periodMultiplier),
    },
  };
};

export class DashboardService {
  /**
   * Get all dashboard data with optional filtering
   */
  static async getDashboardData(
    filters: DashboardFilters = { period: "month" },
  ): Promise<DashboardData> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 150));

    const filteredData = applyFilters(mockDashboardData, filters);
    return filteredData;
  }

  /**
   * Get dashboard metrics only
   */
  static async getMetrics(
    filters: DashboardFilters = {},
  ): Promise<DashboardData["metrics"]> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const data = applyFilters(mockDashboardData, filters);
    return data.metrics;
  }

  /**
   * Get all alerts with optional filtering by status or severity
   */
  static async getAlerts(
    statusFilter?: string,
    severityFilter?: string,
  ): Promise<DashboardAlert[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    let alerts = mockDashboardData.alerts;

    if (statusFilter) {
      alerts = alerts.filter((alert) => alert.status === statusFilter);
    }

    if (severityFilter) {
      alerts = alerts.filter((alert) => alert.severity === severityFilter);
    }

    return alerts;
  }

  /**
   * Get production data for charts
   */
  static async getProductionData(
    filters: DashboardFilters = {},
  ): Promise<ProductionData[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    return mockDashboardData.production;
  }

  /**
   * Get cattle breed distribution
   */
  static async getCattleBreeds(): Promise<CattleBreed[]> {
    await new Promise((resolve) => setTimeout(resolve, 50));

    return mockDashboardData.cattleBreeds;
  }

  /**
   * Get dashboard statistics
   */
  static async getStats(): Promise<DashboardStats> {
    await new Promise((resolve) => setTimeout(resolve, 50));

    const activeAlerts = mockDashboardData.alerts.filter(
      (alert) => alert.status !== "resolved",
    ).length;

    const totalProduction = mockDashboardData.production.reduce(
      (sum, month) => sum + month.milk,
      0,
    );
    const totalTargets = mockDashboardData.production.reduce(
      (sum, month) => sum + month.target,
      0,
    );
    const averageProductivity = (totalProduction / totalTargets) * 100;

    const totalCattleCount = mockDashboardData.cattleBreeds.reduce(
      (sum, breed) => sum + breed.count,
      0,
    );

    return {
      totalAlerts: mockDashboardData.alerts.length,
      activeAlerts,
      resolvedAlerts: mockDashboardData.alerts.length - activeAlerts,
      averageProductivity: Math.round(averageProductivity * 100) / 100,
      totalCattleCount,
    };
  }

  /**
   * Update alert status
   */
  static async updateAlertStatus(
    alertId: string,
    status: "open" | "in_progress" | "resolved",
    progress?: number,
  ): Promise<DashboardAlert | null> {
    await new Promise((resolve) => setTimeout(resolve, 150));

    const alertIndex = mockDashboardData.alerts.findIndex(
      (alert) => alert.id === alertId,
    );

    if (alertIndex === -1) {
      return null;
    }

    mockDashboardData.alerts[alertIndex] = {
      ...mockDashboardData.alerts[alertIndex],
      status,
      progress: progress ?? mockDashboardData.alerts[alertIndex].progress,
    };

    return mockDashboardData.alerts[alertIndex];
  }

  /**
   * Create a new alert
   */
  static async createAlert(
    alertData: Omit<DashboardAlert, "id" | "time">,
  ): Promise<DashboardAlert> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const newAlert: DashboardAlert = {
      ...alertData,
      id: `ALT-${String(mockDashboardData.alerts.length + 1).padStart(3, "0")}`,
      time: "à l'instant",
    };

    mockDashboardData.alerts.unshift(newAlert);
    return newAlert;
  }

  /**
   * Delete an alert
   */
  static async deleteAlert(alertId: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const initialLength = mockDashboardData.alerts.length;
    mockDashboardData.alerts = mockDashboardData.alerts.filter(
      (alert) => alert.id !== alertId,
    );

    return mockDashboardData.alerts.length < initialLength;
  }

  /**
   * Export dashboard data
   */
  static async exportDashboard(options: DashboardExportOptions): Promise<Blob> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const data = await this.getDashboardData(options.filters);
    const sections = options.sections || [
      "metrics",
      "alerts",
      "production",
      "breeds",
    ];

    if (options.format === "csv") {
      let csvContent =
        "Export Tableau de Bord - " +
        formatDateToFrench(new Date().toISOString()) +
        "\n\n";

      // Metrics section
      if (sections.includes("metrics")) {
        csvContent += "MÉTRIQUES\n";
        csvContent += "Métrique,Valeur,Variation\n";
        csvContent += `Total Bovins,${data.metrics.totalCattle.toLocaleString()},+${data.metrics.cattleChange}%\n`;
        csvContent += `Production Lait,${data.metrics.milkProduction},+${data.metrics.milkChange}%\n`;
        csvContent += `Taux Mortalité,${data.metrics.mortalityRate}%,${data.metrics.mortalityChange}%\n`;
        csvContent += `Naissances Gémellaires,${data.metrics.twinBirths},+${data.metrics.twinBirthsChange}%\n\n`;
      }

      // Alerts section
      if (sections.includes("alerts")) {
        csvContent += "ALERTES\n";
        csvContent +=
          "ID,Module,Description,Emplacement,Responsable,Gravité,Statut,Temps,Progrès\n";
        data.alerts.forEach((alert) => {
          csvContent += `${alert.id},${alert.module},"${alert.description}",${alert.location},${alert.responsible},${alert.severity},${alert.status},${alert.time},${alert.progress}%\n`;
        });
        csvContent += "\n";
      }

      // Production section
      if (sections.includes("production")) {
        csvContent += "PRODUCTION MENSUELLE\n";
        csvContent += "Mois,Production Réelle,Objectif\n";
        data.production.forEach((month) => {
          csvContent += `${month.month},${month.milk},${month.target}\n`;
        });
        csvContent += "\n";
      }

      // Breeds section
      if (sections.includes("breeds")) {
        csvContent += "DISTRIBUTION DES RACES\n";
        csvContent += "Race,Nombre,Pourcentage\n";
        data.cattleBreeds.forEach((breed) => {
          csvContent += `${breed.breed},${breed.count},${breed.percentage}%\n`;
        });
      }

      return new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    }

    // For Excel and PDF formats, return CSV for now
    // In a real implementation, you would generate proper Excel/PDF files
    const csvData = await this.exportDashboard({ ...options, format: "csv" });
    return new Blob([await csvData.text()], {
      type:
        options.format === "excel"
          ? "application/vnd.ms-excel"
          : "application/pdf",
    });
  }

  /**
   * Search alerts by keyword
   */
  static async searchAlerts(keyword: string): Promise<DashboardAlert[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    if (!keyword.trim()) {
      return mockDashboardData.alerts;
    }

    const searchTerm = keyword.toLowerCase();
    return mockDashboardData.alerts.filter(
      (alert) =>
        alert.module.toLowerCase().includes(searchTerm) ||
        alert.description.toLowerCase().includes(searchTerm) ||
        alert.location.toLowerCase().includes(searchTerm) ||
        alert.responsible.toLowerCase().includes(searchTerm) ||
        alert.id.toLowerCase().includes(searchTerm),
    );
  }

  /**
   * Get alerts by priority (high priority alerts for notifications)
   */
  static async getHighPriorityAlerts(): Promise<DashboardAlert[]> {
    await new Promise((resolve) => setTimeout(resolve, 50));

    return mockDashboardData.alerts.filter(
      (alert) => alert.severity === "high" && alert.status !== "resolved",
    );
  }

  /**
   * Get production trends (percentage changes)
   */
  static async getProductionTrends(): Promise<{
    milkTrend: number;
    efficiencyTrend: number;
    monthlyGrowth: number;
  }> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const production = mockDashboardData.production;
    const lastMonth = production[production.length - 1];
    const previousMonth = production[production.length - 2];

    const milkTrend =
      ((lastMonth.milk - previousMonth.milk) / previousMonth.milk) * 100;
    const lastMonthEfficiency = (lastMonth.milk / lastMonth.target) * 100;
    const previousMonthEfficiency =
      (previousMonth.milk / previousMonth.target) * 100;
    const efficiencyTrend = lastMonthEfficiency - previousMonthEfficiency;

    const totalCurrentYear = production.reduce(
      (sum, month) => sum + month.milk,
      0,
    );
    const averageMonthly = totalCurrentYear / production.length;
    const monthlyGrowth = (lastMonth.milk / averageMonthly - 1) * 100;

    return {
      milkTrend: Math.round(milkTrend * 100) / 100,
      efficiencyTrend: Math.round(efficiencyTrend * 100) / 100,
      monthlyGrowth: Math.round(monthlyGrowth * 100) / 100,
    };
  }

  /**
   * Reset mock data to initial state (useful for testing)
   */
  static resetMockData(): void {
    // Reset alerts to initial state
    mockDashboardData.alerts = [
      {
        id: "ALT-001",
        module: "Système de traite",
        description: "Maintenance préventive requise",
        location: "Étable A - Box 15-20",
        responsible: "Jean Dupont",
        severity: "high",
        status: "open",
        time: "il y a 2h",
        progress: 65,
      },
      {
        id: "ALT-002",
        module: "Système d'alimentation",
        description: "Contrôle de qualité",
        location: "Zone de distribution B",
        responsible: "Marie Claire",
        severity: "medium",
        status: "in_progress",
        time: "il y a 4h",
        progress: 80,
      },
      {
        id: "ALT-003",
        module: "Reproduction",
        description: "Suivi de gestation",
        location: "Secteur C - Logement",
        responsible: "Pierre Martin",
        severity: "low",
        status: "resolved",
        time: "il y a 1j",
        progress: 100,
      },
      {
        id: "ALT-004",
        module: "Santé animale",
        description: "Programme de vaccination",
        location: "Infirmerie - Zone D",
        responsible: "Dr. Sophie Laurent",
        severity: "medium",
        status: "open",
        time: "il y a 6h",
        progress: 45,
      },
    ];
  }
}
