import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  Droplets,
  BarChart3,
  Calendar,
  Target,
  Activity,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import { DashboardService } from "../../services/dashboardService";
import { DashboardData, DashboardFilters } from "@shared/dashboard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const ControleurDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("Ce Mois");
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const filters: DashboardFilters = {
          period: getPeriodKey(selectedPeriod),
        };
        const data = await DashboardService.getDashboardData(filters);
        setDashboardData(data);
        setError(null);
      } catch (err) {
        setError("Erreur lors du chargement des données de contrôle laitier");
        console.error("Dashboard data loading error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [selectedPeriod]);

  const getPeriodKey = (
    frenchPeriod: string,
  ): "today" | "week" | "month" | "year" => {
    switch (frenchPeriod) {
      case "Aujourd'hui":
        return "today";
      case "Cette Semaine":
        return "week";
      case "Ce Mois":
        return "month";
      case "Cette Année":
        return "year";
      default:
        return "month";
    }
  };

  const handleExport = async () => {
    try {
      const blob = await DashboardService.exportDashboard({
        format: "csv",
        filters: { period: getPeriodKey(selectedPeriod) },
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `rapport-controle-laitier-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Export error:", err);
    }
  };

  const getMilkControlMetrics = () => {
    if (!dashboardData) return [];

    return [
      {
        title: "Contrôles Réalisés",
        value: "45",
        change: "+8%",
        changeText: "Ce mois",
        changeType: "positive" as const,
        icon: (
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
        ),
        bgColor: "bg-blue-50",
      },
      {
        title: "Production Moyenne",
        value: `${dashboardData.metrics.milkProduction / 30}L/jour`,
        change: `+${dashboardData.metrics.milkChange}%`,
        changeText: "Par vache",
        changeType: "positive" as const,
        icon: (
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
            <Droplets className="w-5 h-5 text-white" />
          </div>
        ),
        bgColor: "bg-emerald-50",
      },
      {
        title: "Taux Protéique Moyen",
        value: "3.2%",
        change: "+0.1%",
        changeText: "Amélioration qualité",
        changeType: "positive" as const,
        icon: (
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Target className="w-5 h-5 text-white" />
          </div>
        ),
        bgColor: "bg-purple-50",
      },
      {
        title: "Contrôles Planifiés",
        value: "12",
        change: "Cette semaine",
        changeText: "À réaliser",
        changeType: "neutral" as const,
        icon: (
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
            <Calendar className="w-5 h-5 text-white" />
          </div>
        ),
        bgColor: "bg-orange-50",
      },
    ];
  };

  const milkControlMetrics = getMilkControlMetrics();

  // Mock scheduled milk controls
  const scheduledControls = [
    {
      id: 1,
      exploitation: "Ferme Martin",
      date: "2024-01-15",
      time: "07:00",
      animalsCount: 25,
      status: "planned",
    },
    {
      id: 2,
      exploitation: "Ferme Dubois",
      date: "2024-01-15",
      time: "15:00",
      animalsCount: 18,
      status: "planned",
    },
    {
      id: 3,
      exploitation: "Ferme Leclerc",
      date: "2024-01-16",
      time: "08:30",
      animalsCount: 32,
      status: "planned",
    },
  ];

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-gray-500 text-sm">Contrôle Laitier</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 text-sm font-medium">
            Tableau de bord
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="heading-2 mb-1">Tableau de Bord - Contrôleur Laitier</h1>
            <p className="body-base">
              Suivez les contrôles laitiers et la qualité de production
            </p>
          </div>

          <div className="flex items-center gap-2 lg:gap-3">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[180px] text-xs lg:text-sm">
                <SelectValue placeholder="Sélectionner une période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Aujourd'hui">Aujourd'hui</SelectItem>
                <SelectItem value="Cette Semaine">Cette Semaine</SelectItem>
                <SelectItem value="Ce Mois">Ce Mois</SelectItem>
                <SelectItem value="Cette Année">Cette Année</SelectItem>
              </SelectContent>
            </Select>
            <button
              onClick={handleExport}
              className="flex items-center gap-1 lg:gap-2 px-2 lg:px-3 py-2 bg-emerald-600 text-white rounded-lg text-xs lg:text-sm font-medium hover:bg-emerald-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exporter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Chargement des données de contrôle...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span className="text-red-700 font-medium">Erreur</span>
          </div>
          <p className="text-red-600 mt-1">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Milk Control Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6">
            {milkControlMetrics.map((metric, index) => (
              <div
                key={index}
                className={`${metric.bgColor} border border-gray-200 rounded-lg p-3 lg:p-4 hover:shadow-md transition-shadow`}
              >
                <div className="flex justify-between items-start mb-2 lg:mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-600 body-small font-medium mb-1 truncate">
                      {metric.title}
                    </p>
                    <p className="heading-3 lg:heading-2 font-bold text-gray-900">
                      {metric.value}
                    </p>
                  </div>
                  <div className="flex-shrink-0">{metric.icon}</div>
                </div>

                <div className="flex items-center gap-1 lg:gap-2">
                  <div
                    className={`flex items-center gap-1 badge-text ${
                      metric.changeType === "positive"
                        ? "text-green-600"
                        : metric.changeType === "negative"
                          ? "text-red-500"
                          : "text-blue-600"
                    }`}
                  >
                    {metric.changeType === "positive" && <TrendingUp className="w-3 h-3" />}
                    {metric.changeType === "negative" && <TrendingDown className="w-3 h-3" />}
                    {metric.changeType === "neutral" && <Activity className="w-3 h-3" />}
                    <span>{metric.change}</span>
                  </div>
                  <span className="text-gray-500 caption hidden lg:inline">
                    {metric.changeText}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6 mb-6">
            {/* Scheduled Controls */}
            <div className="xl:col-span-2">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="heading-3">Contrôles Planifiés</h2>
                    <span className="body-small text-gray-500">
                      {scheduledControls.length} contrôle{scheduledControls.length > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 lg:px-4 py-3 text-left table-header">
                          Exploitation
                        </th>
                        <th className="px-3 lg:px-4 py-3 text-left table-header">
                          Date & Heure
                        </th>
                        <th className="px-3 lg:px-4 py-3 text-left table-header">
                          Animaux
                        </th>
                        <th className="px-3 lg:px-4 py-3 text-left table-header">
                          Statut
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {scheduledControls.map((control) => (
                        <tr
                          key={control.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-3 lg:px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <Droplets className="w-4 h-4 text-emerald-600" />
                              </div>
                              <span className="font-medium text-gray-900">
                                {control.exploitation}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 lg:px-4 py-3">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {new Date(control.date).toLocaleDateString('fr-FR')}
                              </p>
                              <p className="text-xs text-gray-500">{control.time}</p>
                            </div>
                          </td>
                          <td className="px-3 lg:px-4 py-3">
                            <span className="text-sm text-gray-900">
                              {control.animalsCount} vaches
                            </span>
                          </td>
                          <td className="px-3 lg:px-4 py-3">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Planifié
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Quality Metrics */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="heading-3 mb-4">Métriques Qualité</h2>

              <div className="space-y-4">
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-emerald-700">
                      Taux Protéique
                    </span>
                    <span className="text-lg font-bold text-emerald-900">3.2%</span>
                  </div>
                  <div className="w-full bg-emerald-200 rounded-full h-2">
                    <div className="bg-emerald-600 h-2 rounded-full" style={{ width: "80%" }}></div>
                  </div>
                  <p className="text-xs text-emerald-600 mt-1">Objectif: 3.0%</p>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-700">
                      Taux Matière Grasse
                    </span>
                    <span className="text-lg font-bold text-blue-900">4.1%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: "85%" }}></div>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">Objectif: 3.8%</p>
                </div>

                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-purple-700">
                      Cellules Somatiques
                    </span>
                    <span className="text-lg font-bold text-purple-900">185k</span>
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: "70%" }}></div>
                  </div>
                  <p className="text-xs text-purple-600 mt-1">Limite: 400k</p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    Qualité Excellente
                  </span>
                </div>
                <p className="text-xs text-green-600">
                  Tous les indicateurs dépassent les standards
                </p>
              </div>
            </div>
          </div>

          {/* Production Trends Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="heading-3">Évolution de la Production</h2>
                <p className="body-small">
                  Tendances de production et qualité du lait
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="w-3 h-3 rounded-sm bg-gradient-to-b from-emerald-400 to-emerald-600"></div>
                  <span className="text-sm font-medium text-emerald-700">
                    Production
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="w-3 h-3 rounded-sm bg-gradient-to-b from-blue-400 to-blue-600"></div>
                  <span className="text-sm font-medium text-blue-700">
                    Qualité
                  </span>
                </div>
              </div>
            </div>

            <div className="h-64 lg:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={dashboardData?.production || []}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 20,
                  }}
                >
                  <defs>
                    <linearGradient id="productionAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#10B981" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#F3F4F6"
                    strokeWidth={1}
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    }}
                    formatter={(value: any) => [`${value.toLocaleString()}L`, "Production"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="milk"
                    stroke="#10B981"
                    strokeWidth={2}
                    fill="url(#productionAreaGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ControleurDashboard;
