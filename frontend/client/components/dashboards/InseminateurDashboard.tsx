import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Zap,
  FlaskConical,
  Clock,
  Target,
  CheckCircle,
  AlertTriangle,
  Heart,
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

const InseminateurDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Mock data for insemination metrics
  const inseminationData = [
    { month: "Jan", success: 85, total: 100 },
    { month: "Fév", success: 92, total: 110 },
    { month: "Mar", success: 78, total: 95 },
    { month: "Avr", success: 88, total: 105 },
    { month: "Mai", success: 95, total: 112 },
    { month: "Jun", success: 90, total: 108 },
  ];

  const breedingData = [
    { name: "Holstein", value: 45, color: "#21DB69" },
    { name: "Montbéliarde", value: 25, color: "#3B82F6" },
    { name: "Normande", value: 20, color: "#F59E0B" },
    { name: "Autres", value: 10, color: "#EF4444" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="heading-1">Dashboard Insémination</h1>
          <p className="body-base text-muted-foreground mt-1">
            Suivi de vos activités d'insémination artificielle
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
          <CheckCircle className="w-4 h-4" />
          <span>Actif aujourd'hui</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="body-small text-muted-foreground">Inséminations ce mois</p>
              <p className="heading-2 text-blue-600">108</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="body-small text-green-600">+15% vs mois dernier</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="body-small text-muted-foreground">Taux de Réussite</p>
              <p className="heading-2 text-green-600">83.3%</p>
            </div>
            <div className="p-3 bg-green-50 rounded-xl">
              <Target className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="body-small text-green-600">+2.1% vs moyenne</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="body-small text-muted-foreground">Semences Utilisées</p>
              <p className="heading-2 text-purple-600">324</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl">
              <FlaskConical className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Clock className="w-4 h-4 text-orange-600" />
            <span className="body-small text-orange-600">12 en stock faible</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="body-small text-muted-foreground">Prochaines Interventions</p>
              <p className="heading-2 text-orange-600">17</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-xl">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="body-small text-red-600">3 urgentes</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="heading-3 mb-6">Évolution des Inséminations</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={inseminationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="total" fill="#E5E7EB" radius={[4, 4, 0, 0]} />
              <Bar dataKey="success" fill="#21DB69" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="heading-3 mb-6">Répartition par Race</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={breedingData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {breedingData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Planning and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="heading-3 mb-4">Planning d'Aujourd'hui</h3>
          <div className="space-y-3">
            {[
              { time: "09:00", location: "Exploitation Martin", animal: "Vache #1234", type: "Insémination" },
              { time: "11:30", location: "Exploitation Dupont", animal: "Vache #5678", type: "Contrôle" },
              { time: "14:00", location: "Exploitation Bernard", animal: "Vache #9101", type: "Insémination" },
              { time: "16:30", location: "Exploitation Rousseau", animal: "Vache #1121", type: "Suivi" },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-blue-600 min-w-[60px]">{item.time}</div>
                <div className="flex-1">
                  <p className="body-small font-medium">{item.location}</p>
                  <p className="body-small text-muted-foreground">{item.animal} - {item.type}</p>
                </div>
                <div className="text-right">
                  <Heart className="w-4 h-4 text-red-500" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="heading-3 mb-4">Alertes & Notifications</h3>
          <div className="space-y-3">
            {[
              { type: "warning", message: "Stock de semences Holstein faible (< 5 doses)", time: "Il y a 2h" },
              { type: "success", message: "Insémination réussie - Vache #1234", time: "Il y a 4h" },
              { type: "info", message: "Nouveau lot de semences Montbéliarde reçu", time: "Hier" },
              { type: "warning", message: "Rendez-vous reporté - Exploitation Martin", time: "Hier" },
            ].map((alert, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  alert.type === 'warning' ? 'bg-orange-500' :
                  alert.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <p className="body-small">{alert.message}</p>
                  <p className="caption text-muted-foreground">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InseminateurDashboard;
