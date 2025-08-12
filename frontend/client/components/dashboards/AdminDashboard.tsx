import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Calendar,
  Filter,
  Download,
  MoreHorizontal,
  AlertTriangle,
  CheckCircle,
  Clock,
  PawPrint,
  Droplets,
  Heart,
  Users,
  Building2,
  Activity,
  FileSearch,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
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

const AdminDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<DashboardFilters>({
    period: "month",
    exploitation: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await DashboardService.getDashboardData(filters);
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="heading-1">Dashboard Administrateur</h1>
          <p className="body-base text-muted-foreground mt-1">
            Vue d'ensemble complète de toutes les exploitations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={filters.period} onValueChange={(value) => setFilters(prev => ({ ...prev, period: value }))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">7 jours</SelectItem>
              <SelectItem value="month">30 jours</SelectItem>
              <SelectItem value="year">1 an</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="body-small text-muted-foreground">Total Bovins</p>
              <p className="heading-2 text-primary">{dashboardData?.metrics.totalCattle || 0}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-xl">
              <PawPrint className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="body-small text-green-600">+12% vs mois dernier</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="body-small text-muted-foreground">Exploitations</p>
              <p className="heading-2 text-blue-600">{dashboardData ? 12 : 0}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="body-small text-green-600">Toutes actives</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="body-small text-muted-foreground">Production Totale</p>
              <p className="heading-2 text-purple-600">{dashboardData?.metrics.milkProduction || 0}L</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl">
              <Droplets className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="body-small text-green-600">+8% vs mois dernier</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="body-small text-muted-foreground">Utilisateurs Actifs</p>
              <p className="heading-2 text-orange-600">{dashboardData?.activeUsers || 0}</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-xl">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Activity className="w-4 h-4 text-green-600" />
            <span className="body-small text-green-600">Dernière connexion: maintenant</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="heading-3">Production par Exploitation</h3>
            <MoreHorizontal className="w-5 h-5 text-gray-400 cursor-pointer" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData?.productionByExploitation || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="production" fill="#21DB69" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="heading-3">Évolution Mensuelle</h3>
            <MoreHorizontal className="w-5 h-5 text-gray-400 cursor-pointer" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dashboardData?.monthlyEvolution || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="animals" 
                stroke="#21DB69" 
                strokeWidth={3}
                dot={{ fill: "#21DB69", strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="production" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="heading-3 mb-4">Actions Rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { icon: FileSearch, label: "Nouvelle Identification", color: "bg-green-50 text-green-600" },
            { icon: Activity, label: "Rebouclage", color: "bg-blue-50 text-blue-600" },
            { icon: Users, label: "Gérer Utilisateurs", color: "bg-purple-50 text-purple-600" },
            { icon: Building2, label: "Exploitations", color: "bg-orange-50 text-orange-600" },
            { icon: Download, label: "Exporter Données", color: "bg-gray-50 text-gray-600" },
          ].map((action, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-4 rounded-xl border border-gray-100 hover:border-gray-200 cursor-pointer transition-all hover:shadow-sm"
            >
              <div className={`p-3 rounded-xl ${action.color} mb-3`}>
                <action.icon className="w-6 h-6" />
              </div>
              <span className="body-small text-center font-medium">{action.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
