import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Droplets,
  Milk,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
  Thermometer,
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
  AreaChart,
  Area,
} from "recharts";

const ControleurLaitierDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Mock data for lactation metrics
  const productionData = [
    { month: "Jan", production: 2150, quality: 95 },
    { month: "Fév", production: 2280, quality: 97 },
    { month: "Mar", production: 2340, quality: 94 },
    { month: "Avr", production: 2420, quality: 96 },
    { month: "Mai", production: 2380, quality: 98 },
    { month: "Jun", production: 2450, quality: 95 },
  ];

  const dailyProduction = [
    { day: "Lun", morning: 15, evening: 18 },
    { day: "Mar", morning: 16, evening: 19 },
    { day: "Mer", morning: 14, evening: 17 },
    { day: "Jeu", morning: 17, evening: 20 },
    { day: "Ven", morning: 16, evening: 18 },
    { day: "Sam", morning: 15, evening: 17 },
    { day: "Dim", morning: 14, evening: 16 },
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
          <h1 className="heading-1">Dashboard Contrôle Laitier</h1>
          <p className="body-base text-muted-foreground mt-1">
            Suivi de la production et qualité du lait
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
          <Droplets className="w-4 h-4" />
          <span>Contrôle en cours</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="body-small text-muted-foreground">Production Mensuelle</p>
              <p className="heading-2 text-blue-600">2,450L</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <Milk className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="body-small text-green-600">+3% vs mois dernier</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="body-small text-muted-foreground">Qualité Moyenne</p>
              <p className="heading-2 text-green-600">95.2%</p>
            </div>
            <div className="p-3 bg-green-50 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <TrendingDown className="w-4 h-4 text-red-600" />
            <span className="body-small text-red-600">-1.1% vs moyenne</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="body-small text-muted-foreground">Vaches en Lactation</p>
              <p className="heading-2 text-purple-600">78</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="body-small text-green-600">Toutes suivies</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="body-small text-muted-foreground">Prochains Contrôles</p>
              <p className="heading-2 text-orange-600">23</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-xl">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Clock className="w-4 h-4 text-orange-600" />
            <span className="body-small text-orange-600">Cette semaine</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="heading-3 mb-6">Production & Qualité Mensuelles</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={productionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="production" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="quality" 
                stroke="#21DB69" 
                strokeWidth={3}
                dot={{ fill: "#21DB69", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="heading-3 mb-6">Production Quotidienne</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dailyProduction}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="evening" 
                stackId="1"
                stroke="#3B82F6" 
                fill="#3B82F6"
                fillOpacity={0.6}
              />
              <Area 
                type="monotone" 
                dataKey="morning" 
                stackId="1"
                stroke="#21DB69" 
                fill="#21DB69"
                fillOpacity={0.8}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Control Schedule and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="heading-3 mb-4">Programme de Contrôles</h3>
          <div className="space-y-3">
            {[
              { 
                date: "Aujourd'hui", 
                time: "08:00", 
                farm: "Exploitation Martin", 
                cows: 15, 
                type: "Contrôle mensuel",
                status: "scheduled"
              },
              { 
                date: "Aujourd'hui", 
                time: "14:00", 
                farm: "Exploitation Dupont", 
                cows: 22, 
                type: "Contrôle qualité",
                status: "scheduled"
              },
              { 
                date: "Demain", 
                time: "09:30", 
                farm: "Exploitation Bernard", 
                cows: 18, 
                type: "Contrôle mensuel",
                status: "pending"
              },
              { 
                date: "Jeudi", 
                time: "10:00", 
                farm: "Exploitation Rousseau", 
                cows: 25, 
                type: "Contrôle spécial",
                status: "pending"
              },
            ].map((control, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-blue-600 min-w-[80px]">
                  <div>{control.date}</div>
                  <div className="text-xs text-gray-500">{control.time}</div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Milk className="w-4 h-4 text-blue-600" />
                    <p className="body-small font-medium">{control.farm}</p>
                  </div>
                  <p className="body-small text-muted-foreground">
                    {control.cows} vaches - {control.type}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`w-3 h-3 rounded-full ${
                    control.status === 'completed' ? 'bg-green-500' :
                    control.status === 'scheduled' ? 'bg-blue-500' : 'bg-gray-400'
                  }`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="heading-3 mb-4">Alertes Qualité</h3>
          <div className="space-y-3">
            {[
              { 
                type: "warning", 
                message: "Baisse qualité détectée - Exploitation Martin", 
                details: "Vaches #1234, #5678: taux protéique < 3.2%",
                time: "Il y a 2h" 
              },
              { 
                type: "info", 
                message: "Pic de production - Exploitation Dupont", 
                details: "Production journalière: +15% vs moyenne",
                time: "Il y a 4h" 
              },
              { 
                type: "success", 
                message: "Objectif qualité atteint", 
                details: "Exploitation Bernard: 98% de qualité moyenne",
                time: "Hier" 
              },
              { 
                type: "warning", 
                message: "Contrôle en retard", 
                details: "Exploitation Rousseau: dernier contrôle il y a 35 jours",
                time: "Avant-hier" 
              },
            ].map((alert, index) => (
              <div key={index} className="p-3 border border-gray-100 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    alert.type === 'warning' ? 'bg-orange-500' :
                    alert.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="body-small font-medium">{alert.message}</p>
                    <p className="body-small text-muted-foreground mt-1">{alert.details}</p>
                    <p className="caption text-muted-foreground mt-2">{alert.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControleurLaitierDashboard;
