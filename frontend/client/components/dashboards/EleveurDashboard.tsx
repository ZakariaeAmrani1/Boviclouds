import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  PawPrint,
  Heart,
  AlertTriangle,
  Camera,
  Thermometer,
  Activity,
  Shield,
  Clock,
  Eye,
  CheckCircle,
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

const EleveurDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Mock data for farm overview
  const healthData = [
    { status: "Excellente", count: 45, color: "#21DB69" },
    { status: "Bonne", count: 28, color: "#3B82F6" },
    { status: "Surveillance", count: 8, color: "#F59E0B" },
    { status: "Attention", count: 3, color: "#EF4444" },
  ];

  const dailyActivity = [
    { time: "06:00", feeding: 84, movement: 92 },
    { time: "09:00", feeding: 76, movement: 88 },
    { time: "12:00", feeding: 45, movement: 72 },
    { time: "15:00", feeding: 38, movement: 68 },
    { time: "18:00", feeding: 89, movement: 95 },
    { time: "21:00", feeding: 67, movement: 45 },
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
          <h1 className="heading-1">Mon Exploitation</h1>
          <p className="body-base text-muted-foreground mt-1">
            Vue d'ensemble de votre élevage en temps réel
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
          <CheckCircle className="w-4 h-4" />
          <span>Tout va bien</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="body-small text-muted-foreground">Total Bovins</p>
              <p className="heading-2 text-green-600">84</p>
            </div>
            <div className="p-3 bg-green-50 rounded-xl">
              <PawPrint className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="body-small text-green-600">+2 naissances cette semaine</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="body-small text-muted-foreground">État de Santé</p>
              <p className="heading-2 text-blue-600">96.4%</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <Heart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Shield className="w-4 h-4 text-green-600" />
            <span className="body-small text-green-600">Excellent niveau</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="body-small text-muted-foreground">Caméras Actives</p>
              <p className="heading-2 text-purple-600">12/12</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl">
              <Camera className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Eye className="w-4 h-4 text-green-600" />
            <span className="body-small text-green-600">Surveillance 24h/24</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="body-small text-muted-foreground">Alertes</p>
              <p className="heading-2 text-orange-600">3</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Clock className="w-4 h-4 text-orange-600" />
            <span className="body-small text-orange-600">Depuis 2h</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="heading-3 mb-6">État de Santé du Cheptel</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={healthData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="count"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {healthData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="heading-3 mb-6">Activité Quotidienne</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="feeding" fill="#21DB69" radius={[2, 2, 0, 0]} />
              <Bar dataKey="movement" fill="#3B82F6" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Live Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="heading-3 mb-4">Surveillance en Temps Réel</h3>
          <div className="space-y-4">
            {[
              { 
                zone: "Étable Nord", 
                status: "normal", 
                animals: 28, 
                temp: "18°C",
                activity: "Repos"
              },
              { 
                zone: "Étable Sud", 
                status: "normal", 
                animals: 32, 
                temp: "19°C",
                activity: "Alimentation"
              },
              { 
                zone: "Pâturage Est", 
                status: "attention", 
                animals: 15, 
                temp: "22°C",
                activity: "Mouvement agité"
              },
              { 
                zone: "Pâturage Ouest", 
                status: "normal", 
                animals: 9, 
                temp: "21°C",
                activity: "Pâturage"
              },
            ].map((zone, index) => (
              <div key={index} className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg">
                <div className={`w-4 h-4 rounded-full ${
                  zone.status === 'normal' ? 'bg-green-500' :
                  zone.status === 'attention' ? 'bg-orange-500' : 'bg-red-500'
                }`}></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="body-small font-medium">{zone.zone}</span>
                    <span className="body-small text-muted-foreground">{zone.animals} bovins</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="body-small text-muted-foreground">{zone.activity}</span>
                    <div className="flex items-center gap-1">
                      <Thermometer className="w-3 h-3 text-gray-400" />
                      <span className="body-small text-muted-foreground">{zone.temp}</span>
                    </div>
                  </div>
                </div>
                <Camera className="w-5 h-5 text-gray-400 cursor-pointer hover:text-blue-600" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="heading-3 mb-4">Dernières Alertes</h3>
          <div className="space-y-3">
            {[
              { 
                type: "warning", 
                message: "Mouvement inhabituel détecté", 
                location: "Pâturage Est",
                time: "Il y a 2h",
                details: "Activité élevée des bovins #1234, #5678"
              },
              { 
                type: "info", 
                message: "Nouvelle naissance détectée", 
                location: "Étable Nord",
                time: "Il y a 6h",
                details: "Vache #9101 a donné naissance"
              },
              { 
                type: "success", 
                message: "Problème résolu", 
                location: "Système d'abreuvement",
                time: "Hier",
                details: "Réparation du système automatique terminée"
              },
              { 
                type: "warning", 
                message: "Maintenance programmée", 
                location: "Caméra #7",
                time: "Avant-hier",
                details: "Nettoyage de l'objectif requis"
              },
            ].map((alert, index) => (
              <div key={index} className="p-3 border border-gray-100 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    alert.type === 'warning' ? 'bg-orange-500' :
                    alert.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="body-small font-medium">{alert.message}</p>
                      <p className="caption text-muted-foreground">{alert.time}</p>
                    </div>
                    <p className="body-small text-muted-foreground">{alert.location}</p>
                    <p className="caption text-muted-foreground mt-1">{alert.details}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="heading-3 mb-4">Actions Rapides</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Camera, label: "Voir Caméras", color: "bg-blue-50 text-blue-600" },
            { icon: AlertTriangle, label: "Voir Alertes", color: "bg-orange-50 text-orange-600" },
            { icon: Heart, label: "État Santé", color: "bg-red-50 text-red-600" },
            { icon: Activity, label: "Rapport Activité", color: "bg-purple-50 text-purple-600" },
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

export default EleveurDashboard;
