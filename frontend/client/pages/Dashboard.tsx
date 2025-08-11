import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { UtilisateurRole } from "@shared/utilisateur";
import AdminDashboard from "../components/dashboards/AdminDashboard";
import EleveurDashboard from "../components/dashboards/EleveurDashboard";
import InseminateurDashboard from "../components/dashboards/InseminateurDashboard";
import { AlertTriangle } from "lucide-react";

// Custom tooltip component for the chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-xl">
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-sm text-gray-600">
              {entry.dataKey === "milk" ? "Réel" : "Objectif"}:
            </span>
            <span className="font-medium text-gray-900">
              {entry.value.toLocaleString()}L
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("Ce Mois");
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
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
        setError("Erreur lors du chargement des données du tableau de bord");
        console.error("Dashboard data loading error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [selectedPeriod]);

  // Convert French period to API key
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

  // Handle export
  const handleExport = async () => {
    try {
      const blob = await DashboardService.exportDashboard({
        format: "csv",
        filters: { period: getPeriodKey(selectedPeriod) },
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tableau-de-bord-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Export error:", err);
    }
  };

  const getMetricsData = () => {
    if (!dashboardData) return [];

    return [
      {
        title: "Total Bovins",
        value: dashboardData.metrics.totalCattle.toLocaleString(),
        change: `+${dashboardData.metrics.cattleChange}%`,
        changeText: "En hausse depuis hier",
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
        value: dashboardData.metrics.milkProduction.toString(),
        change: `+${dashboardData.metrics.milkChange}%`,
        changeText: "En hausse depuis la semaine passée",
        changeType: "positive" as const,
        icon: (
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
            <Droplets className="w-5 h-5 text-white" />
          </div>
        ),
        bgColor: "bg-emerald-50",
      },
      {
        title: "Taux de Mortalité",
        value: `${dashboardData.metrics.mortalityRate}%`,
        change: `${dashboardData.metrics.mortalityChange}%`,
        changeText: "En baisse depuis hier",
        changeType: "positive" as const,
        icon: (
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
            <Heart className="w-5 h-5 text-white" />
          </div>
        ),
        bgColor: "bg-red-50",
      },
      {
        title: "Naissances Gémellaires",
        value: dashboardData.metrics.twinBirths.toString(),
        change: `+${dashboardData.metrics.twinBirthsChange}%`,
        changeText: "En hausse depuis le mois dernier",
        changeType: "positive" as const,
        icon: (
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Users className="w-5 h-5 text-white" />
          </div>
        ),
        bgColor: "bg-purple-50",
      },
    ];
  };

  const metricsData = getMetricsData();
  const alertsData = dashboardData?.alerts || [];
  const productionData = dashboardData?.production || [];
  const cattleBreeds = dashboardData?.cattleBreeds || [];

  const maxProduction =
    productionData.length > 0
      ? Math.max(...productionData.map((d) => Math.max(d.milk, d.target)))
      : 1;

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "medium":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "low":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-gray-500 text-sm">Accueil</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 text-sm font-medium">
            Tableau de bord
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="heading-2 mb-1">Vue d'ensemble de la ferme</h1>
            <p className="body-base">
              Surveillez les performances de votre élevage bovin et les
              métriques clés
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
            <p className="text-gray-600">Chargement des données...</p>
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

      {/* Metrics Cards */}
      {!loading && !error && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6">
          {metricsData.map((metric, index) => (
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
      )}

      {/* Main Content Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6 mb-6">
          {/* Alerts Table */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="heading-3">Alertes Système</h2>
                  <span className="body-small text-gray-500">
                    {alertsData.filter((a) => a.status !== "resolved").length}{" "}
                    active
                    {alertsData.filter((a) => a.status !== "resolved").length >
                    1
                      ? "s"
                      : ""}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 lg:px-4 py-3 text-left table-header">
                        Alerte
                      </th>
                      <th className="px-3 lg:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">
                        Emplacement
                      </th>
                      <th className="px-3 lg:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">
                        Responsable
                      </th>
                      <th className="px-3 lg:px-4 py-3 text-left table-header">
                        Statut
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {alertsData.map((alert) => (
                      <tr
                        key={alert.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-3 lg:px-4 py-3">
                          <div className="flex items-start gap-3">
                            {getSeverityIcon(alert.severity)}
                            <div className="min-w-0">
                              <p className="table-cell font-medium text-gray-900 truncate">
                                {alert.module}
                              </p>
                              <p className="table-meta text-gray-600 truncate">
                                {alert.description}
                              </p>
                              <div className="lg:hidden mt-1">
                                <p className="text-xs text-gray-500">
                                  {alert.location}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {alert.responsible}
                                </p>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {alert.id} • {alert.time}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <p className="text-sm text-gray-900">
                            {alert.location}
                          </p>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <p className="text-sm text-gray-900">
                            {alert.responsible}
                          </p>
                        </td>
                        <td className="px-3 lg:px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}
                          >
                            {alert.status === "open"
                              ? "Ouvert"
                              : alert.status === "in_progress"
                                ? "En cours"
                                : "Résolu"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Cattle Distribution */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="heading-3 mb-4">Distribution du Cheptel</h2>

            <div className="flex flex-col items-center mb-4">
              <div className="relative w-28 lg:w-32 h-28 lg:h-32 mb-4">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full transform -rotate-90"
                >
                  {cattleBreeds.map((breed, index) => {
                    const total = cattleBreeds.reduce(
                      (sum, curr) => sum + curr.percentage,
                      0,
                    );
                    const percentage = (breed.percentage / total) * 100;
                    const circumference = 2 * Math.PI * 30;
                    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
                    const strokeDashoffset = -cattleBreeds
                      .slice(0, index)
                      .reduce(
                        (sum, curr) =>
                          sum + (curr.percentage / total) * circumference,
                        0,
                      );

                    return (
                      <circle
                        key={index}
                        cx="50"
                        cy="50"
                        r="30"
                        fill="none"
                        stroke={breed.color}
                        strokeWidth="8"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        className="hover:opacity-80 transition-opacity cursor-pointer"
                      />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-lg lg:text-xl font-bold text-gray-900">
                      {cattleBreeds
                        .reduce((sum, breed) => sum + breed.count, 0)
                        .toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">Total</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {cattleBreeds.map((breed, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: breed.color }}
                    ></div>
                    <span className="text-sm text-gray-900 font-medium">
                      {breed.breed}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {breed.percentage}%
                    </p>
                    <p className="text-xs text-gray-500">{breed.count}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Production Chart */}
      {!loading && !error && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="heading-3">Production Mensuelle</h2>
              <p className="body-small">
                Production laitière vs objectifs (litres)
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="w-3 h-3 rounded-sm bg-gradient-to-b from-emerald-400 to-emerald-600"></div>
                <span className="text-sm font-medium text-emerald-700">
                  Réel
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
                <div className="w-3 h-3 rounded-sm bg-gradient-to-b from-gray-300 to-gray-500"></div>
                <span className="text-sm font-medium text-gray-700">
                  Objectif
                </span>
              </div>
            </div>
          </div>

          <div className="h-64 lg:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={productionData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 20,
                }}
                barCategoryGap="20%"
              >
                <defs>
                  <linearGradient id="milkGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={1} />
                    <stop offset="100%" stopColor="#059669" stopOpacity={1} />
                  </linearGradient>
                  <linearGradient
                    id="targetGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#E5E7EB" stopOpacity={1} />
                    <stop offset="100%" stopColor="#D1D5DB" stopOpacity={1} />
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
                  dy={10}
                  type="category"
                  allowDuplicatedCategory={false}
                  interval={0}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  type="number"
                  domain={[0, "dataMax"]}
                  allowDataOverflow={false}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(16, 185, 129, 0.1)", radius: 8 }}
                />
                <Bar
                  dataKey="target"
                  fill="url(#targetGradient)"
                  radius={[4, 4, 0, 0]}
                  name="Objectif"
                />
                <Bar
                  dataKey="milk"
                  fill="url(#milkGradient)"
                  radius={[4, 4, 0, 0]}
                  name="Réel"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
