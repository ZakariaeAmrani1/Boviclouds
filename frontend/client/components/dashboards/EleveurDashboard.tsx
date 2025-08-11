import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  PawPrint,
  Droplets,
  Heart,
  Users,
  Camera,
  MapPin,
  Calendar,
  Eye,
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

const EleveurDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("Ce Mois");
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load dashboard data
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
        setError("Erreur lors du chargement des données de votre exploitation");
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
      a.download = `rapport-exploitation-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Export error:", err);
    }
  };

  const getFarmMetrics = () => {
    if (!dashboardData) return [];

    return [
      {
        title: "Mes Bovins",
        value: dashboardData.metrics.totalCattle.toLocaleString(),
        change: `+${dashboardData.metrics.cattleChange}%`,
        changeText: "Évolution cette semaine",
        changeType: "positive" as const,
        icon: (
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
            <PawPrint className="w-5 h-5 text-white" />
          </div>
        ),
        bgColor: "bg-blue-50",
      },
      {
        title: "Production Laitière",
        value: `${dashboardData.metrics.milkProduction}L`,
        change: `+${dashboardData.metrics.milkChange}%`,
        changeText: "Évolution cette semaine",
        changeType: "positive" as const,
        icon: (
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
            <Droplets className="w-5 h-5 text-white" />
          </div>
        ),
        bgColor: "bg-emerald-50",
      },
      {
        title: "Santé du Cheptel",
        value: `${100 - dashboardData.metrics.mortalityRate}%`,
        change: `+${Math.abs(dashboardData.metrics.mortalityChange)}%`,
        changeText: "Animaux en bonne santé",
        changeType: "positive" as const,
        icon: (
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
            <Heart className="w-5 h-5 text-white" />
          </div>
        ),
        bgColor: "bg-green-50",
      },
      {
        title: "Caméras Actives",
        value: "8/12",
        change: "Surveillance 24/7",
        changeText: "Fonctionnement normal",
        changeType: "positive" as const,
        icon: (
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Camera className="w-5 h-5 text-white" />
          </div>
        ),
        bgColor: "bg-purple-50",
      },
    ];
  };

  const farmMetrics = getFarmMetrics();
  const farmAlerts = dashboardData?.alerts?.filter(alert => 
    alert.severity !== "low" && alert.status !== "resolved"
  ) || [];

  // Mock CCTV data for the farmer
  const cctvCameras = [
    { id: 1, name: "Étable Principal", status: "active", location: "Bâtiment A" },
    { id: 2, name: "Zone d'Abreuvement", status: "active", location: "Extérieur" },
    { id: 3, name: "Salle de Traite", status: "active", location: "Bâtiment B" },
    { id: 4, name: "Pâturage Nord", status: "maintenance", location: "Extérieur" },
  ];

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-gray-500 text-sm">Mon Exploitation</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 text-sm font-medium">
            Tableau de bord
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="heading-2 mb-1">Ma Ferme - Vue d'ensemble</h1>
            <p className="body-base">
              Suivez l'état de votre exploitation et surveillez vos animaux
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
              <span className="hidden sm:inline">Rapport</span>
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Chargement des données de votre exploitation...</p>
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
          {/* Farm Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6">
            {farmMetrics.map((metric, index) => (
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
                        : "text-red-500"
                    }`}
                  >
                    {metric.changeType === "positive" ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
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
            {/* Urgent Alerts */}
            <div className="xl:col-span-2">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="heading-3">Alertes Importantes</h2>
                    <span className="body-small text-gray-500">
                      {farmAlerts.length} alerte{farmAlerts.length > 1 ? "s" : ""} active{farmAlerts.length > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                {farmAlerts.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 lg:px-4 py-3 text-left table-header">
                            Alerte
                          </th>
                          <th className="px-3 lg:px-4 py-3 text-left table-header">
                            Localisation
                          </th>
                          <th className="px-3 lg:px-4 py-3 text-left table-header">
                            Statut
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {farmAlerts.map((alert) => (
                          <tr
                            key={alert.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-3 lg:px-4 py-3">
                              <div className="flex items-start gap-3">
                                {alert.severity === "high" ? (
                                  <AlertTriangle className="w-4 h-4 text-red-500" />
                                ) : (
                                  <Clock className="w-4 h-4 text-yellow-500" />
                                )}
                                <div className="min-w-0">
                                  <p className="table-cell font-medium text-gray-900 truncate">
                                    {alert.module}
                                  </p>
                                  <p className="table-meta text-gray-600 truncate">
                                    {alert.description}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {alert.time}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 lg:px-4 py-3">
                              <p className="text-sm text-gray-900">{alert.location}</p>
                            </td>
                            <td className="px-3 lg:px-4 py-3">
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  alert.status === "open"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {alert.status === "open" ? "À traiter" : "En cours"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <p className="text-gray-900 font-medium mb-1">Tout va bien !</p>
                    <p className="text-gray-500 text-sm">Aucune alerte importante à signaler</p>
                  </div>
                )}
              </div>
            </div>

            {/* CCTV Quick View */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="heading-3">Surveillance CCTV</h2>
                <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                  Voir tout
                </button>
              </div>

              <div className="space-y-3">
                {cctvCameras.map((camera) => (
                  <div
                    key={camera.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          camera.status === "active"
                            ? "bg-green-100 text-green-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        <Camera className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {camera.name}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {camera.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          camera.status === "active" ? "bg-green-500" : "bg-yellow-500"
                        }`}
                      ></span>
                      <Eye className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-700">
                    Surveillance Active
                  </span>
                </div>
                <p className="text-xs text-emerald-600">
                  8 caméras fonctionnent normalement
                </p>
              </div>
            </div>
          </div>

          {/* Production Trends for Farmer */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="heading-3">Évolution de ma Production</h2>
                <p className="body-small">
                  Suivi de votre production laitière quotidienne
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="w-3 h-3 rounded-sm bg-gradient-to-b from-emerald-400 to-emerald-600"></div>
                <span className="text-sm font-medium text-emerald-700">
                  Production (L)
                </span>
              </div>
            </div>

            <div className="h-64 lg:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dashboardData?.production || []}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 20,
                  }}
                >
                  <defs>
                    <linearGradient id="productionGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#10B981" stopOpacity={0.1} />
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
                  <Line
                    type="monotone"
                    dataKey="milk"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#10B981", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default EleveurDashboard;
