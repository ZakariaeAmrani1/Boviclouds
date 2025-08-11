import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  FlaskConical,
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
  PieChart,
  Pie,
  Cell,
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

const InseminateurDashboard = () => {
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
        setError("Erreur lors du chargement des données d'insémination");
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
      a.download = `rapport-insemination-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Export error:", err);
    }
  };

  const getInseminationMetrics = () => {
    if (!dashboardData) return [];

    return [
      {
        title: "Inséminations Réalisées",
        value: "124",
        change: "+12%",
        changeText: "Ce mois",
        changeType: "positive" as const,
        icon: (
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
        ),
        bgColor: "bg-blue-50",
      },
      {
        title: "Taux de Réussite",
        value: "87%",
        change: "+5%",
        changeText: "Amélioration",
        changeType: "positive" as const,
        icon: (
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
            <Target className="w-5 h-5 text-white" />
          </div>
        ),
        bgColor: "bg-emerald-50",
      },
      {
        title: "Semences Utilisées",
        value: "89",
        change: "+8%",
        changeText: "Ce mois",
        changeType: "positive" as const,
        icon: (
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
            <FlaskConical className="w-5 h-5 text-white" />
          </div>
        ),
        bgColor: "bg-purple-50",
      },
      {
        title: "Interventions Planifiées",
        value: "15",
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

  const inseminationMetrics = getInseminationMetrics();

  // Mock data for insemination success rates
  const successData = [
    { name: "Réussies", value: 87, color: "#10B981" },
    { name: "Échecs", value: 13, color: "#EF4444" },
  ];

  // Mock scheduled inseminations
  const scheduledInseminations = [
    {
      id: 1,
      animalId: "BV-001",
      exploitation: "Ferme Martin",
      date: "2024-01-15",
      time: "09:00",
      status: "planned",
    },
    {
      id: 2,
      animalId: "BV-045",
      exploitation: "Ferme Dubois",
      date: "2024-01-15",
      time: "14:30",
      status: "planned",
    },
    {
      id: 3,
      animalId: "BV-078",
      exploitation: "Ferme Leclerc",
      date: "2024-01-16",
      time: "10:15",
      status: "planned",
    },
  ];

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-gray-500 text-sm">Insémination</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 text-sm font-medium">
            Tableau de bord
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="heading-2 mb-1">Tableau de Bord - Inséminateur</h1>
            <p className="body-base">
              Suivez vos interventions et performances d'insémination
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
            <p className="text-gray-600">Chargement des données d'insémination...</p>
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
          {/* Insemination Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6">
            {inseminationMetrics.map((metric, index) => (
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
            {/* Scheduled Inseminations */}
            <div className="xl:col-span-2">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="heading-3">Interventions Planifiées</h2>
                    <span className="body-small text-gray-500">
                      {scheduledInseminations.length} intervention{scheduledInseminations.length > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 lg:px-4 py-3 text-left table-header">
                          Animal
                        </th>
                        <th className="px-3 lg:px-4 py-3 text-left table-header">
                          Exploitation
                        </th>
                        <th className="px-3 lg:px-4 py-3 text-left table-header">
                          Date & Heure
                        </th>
                        <th className="px-3 lg:px-4 py-3 text-left table-header">
                          Statut
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {scheduledInseminations.map((intervention) => (
                        <tr
                          key={intervention.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-3 lg:px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Zap className="w-4 h-4 text-blue-600" />
                              </div>
                              <span className="font-medium text-gray-900">
                                {intervention.animalId}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 lg:px-4 py-3">
                            <p className="text-sm text-gray-900">{intervention.exploitation}</p>
                          </td>
                          <td className="px-3 lg:px-4 py-3">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {new Date(intervention.date).toLocaleDateString('fr-FR')}
                              </p>
                              <p className="text-xs text-gray-500">{intervention.time}</p>
                            </div>
                          </td>
                          <td className="px-3 lg:px-4 py-3">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Planifiée
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Success Rate Chart */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="heading-3 mb-4">Taux de Réussite</h2>

              <div className="flex flex-col items-center mb-4">
                <div className="relative w-32 h-32 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={successData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        dataKey="value"
                        startAngle={90}
                        endAngle={450}
                      >
                        {successData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">87%</p>
                      <p className="text-xs text-gray-500">Réussite</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {successData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm text-gray-900 font-medium">
                        {item.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {item.value}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-700">
                    Performance Excellent
                  </span>
                </div>
                <p className="text-xs text-emerald-600">
                  Votre taux de réussite dépasse l'objectif de 80%
                </p>
              </div>
            </div>
          </div>

          {/* Monthly Performance Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="heading-3">Performance Mensuelle</h2>
                <p className="body-small">
                  Nombre d'inséminations réalisées par mois
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-200">
                <div className="w-3 h-3 rounded-sm bg-gradient-to-b from-blue-400 to-blue-600"></div>
                <span className="text-sm font-medium text-blue-700">
                  Inséminations
                </span>
              </div>
            </div>

            <div className="h-64 lg:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dashboardData?.production || []}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 20,
                  }}
                  barCategoryGap="20%"
                >
                  <defs>
                    <linearGradient id="inseminationGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity={1} />
                      <stop offset="100%" stopColor="#1E40AF" stopOpacity={1} />
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
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    }}
                    formatter={(value: any) => [`${value}`, "Inséminations"]}
                  />
                  <Bar
                    dataKey="milk"
                    fill="url(#inseminationGradient)"
                    radius={[4, 4, 0, 0]}
                    name="Inséminations"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default InseminateurDashboard;
