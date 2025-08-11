import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  Activity,
  CheckCircle,
  AlertTriangle,
  Clock,
  Target,
  Calendar,
  BarChart3,
  PieChart,
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
  PieChart as RechartsP,
  Pie,
  Cell,
} from "recharts";

const ResponsableLocalDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Mock data for operational metrics
  const operationalData = [
    { month: "Jan", completed: 145, pending: 25, delayed: 8 },
    { month: "Fév", completed: 162, pending: 18, delayed: 5 },
    { month: "Mar", completed: 138, pending: 32, delayed: 12 },
    { month: "Avr", completed: 175, pending: 22, delayed: 7 },
    { month: "Mai", completed: 189, pending: 15, delayed: 4 },
    { month: "Jun", completed: 156, pending: 28, delayed: 9 },
  ];

  const teamPerformance = [
    { name: "Insémination", performance: 92, color: "#21DB69" },
    { name: "Identification", performance: 88, color: "#3B82F6" },
    { name: "Contrôle Laitier", performance: 95, color: "#F59E0B" },
    { name: "Traitement", performance: 90, color: "#EF4444" },
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
          <h1 className="heading-1">Dashboard Responsable Local</h1>
          <p className="body-base text-muted-foreground mt-1">
            Supervision opérationnelle et gestion d'équipe
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
          <CheckCircle className="w-4 h-4" />
          <span>Équipe opérationnelle</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="body-small text-muted-foreground">Tâches Complétées</p>
              <p className="heading-2 text-green-600">156</p>
            </div>
            <div className="p-3 bg-green-50 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
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
              <p className="body-small text-muted-foreground">Équipe Active</p>
              <p className="heading-2 text-blue-600">12</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Activity className="w-4 h-4 text-green-600" />
            <span className="body-small text-green-600">Tous présents</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="body-small text-muted-foreground">Performance Équipe</p>
              <p className="heading-2 text-purple-600">91.3%</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="body-small text-green-600">+2.1% vs objectif</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="body-small text-muted-foreground">Tâches en Retard</p>
              <p className="heading-2 text-orange-600">9</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-xl">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="body-small text-red-600">3 critiques</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="heading-3 mb-6">Activité Opérationnelle</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={operationalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="completed" fill="#21DB69" radius={[2, 2, 0, 0]} />
              <Bar dataKey="pending" fill="#F59E0B" radius={[2, 2, 0, 0]} />
              <Bar dataKey="delayed" fill="#EF4444" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="heading-3 mb-6">Performance par Service</h3>
          <div className="space-y-4">
            {teamPerformance.map((service, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="body-small font-medium">{service.name}</span>
                  <span className="body-small text-muted-foreground">{service.performance}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${service.performance}%`,
                      backgroundColor: service.color
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Status and Planning */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="heading-3 mb-4">État de l'Équipe</h3>
          <div className="space-y-3">
            {[
              { 
                name: "Jean Martin", 
                role: "Insémateur", 
                status: "active", 
                tasks: 8, 
                location: "Exploitation Dupont"
              },
              { 
                name: "Marie Dubois", 
                role: "Identificatrice", 
                status: "active", 
                tasks: 12, 
                location: "Exploitation Bernard"
              },
              { 
                name: "Pierre Rousseau", 
                role: "Contrôleur Laitier", 
                status: "break", 
                tasks: 6, 
                location: "Bureau"
              },
              { 
                name: "Sophie Laurent", 
                role: "Vétérinaire", 
                status: "active", 
                tasks: 4, 
                location: "Exploitation Martin"
              },
            ].map((member, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className={`w-3 h-3 rounded-full ${
                  member.status === 'active' ? 'bg-green-500' :
                  member.status === 'break' ? 'bg-orange-500' : 'bg-red-500'
                }`}></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="body-small font-medium">{member.name}</span>
                    <span className="body-small text-muted-foreground">{member.tasks} tâches</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="body-small text-muted-foreground">{member.role}</span>
                    <span className="body-small text-muted-foreground">{member.location}</span>
                  </div>
                </div>
                <Activity className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="heading-3 mb-4">Planning de la Semaine</h3>
          <div className="space-y-3">
            {[
              { 
                day: "Lundi", 
                priority: "high", 
                tasks: "Formation équipe - Nouvelles procédures",
                assigned: "Toute l'équipe"
              },
              { 
                day: "Mardi", 
                priority: "medium", 
                tasks: "Contrôles hebdomadaires - 5 exploitations",
                assigned: "Marie, Pierre"
              },
              { 
                day: "Mercredi", 
                priority: "high", 
                tasks: "Campagne insémination - Pic de chaleurs",
                assigned: "Jean, Sophie"
              },
              { 
                day: "Jeudi", 
                priority: "low", 
                tasks: "Maintenance équipements",
                assigned: "Équipe technique"
              },
              { 
                day: "Vendredi", 
                priority: "medium", 
                tasks: "Réunion bilan + rapport mensuel",
                assigned: "Responsables"
              },
            ].map((plan, index) => (
              <div key={index} className="p-3 border border-gray-100 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-2 h-2 rounded-full ${
                    plan.priority === 'high' ? 'bg-red-500' :
                    plan.priority === 'medium' ? 'bg-orange-500' : 'bg-green-500'
                  }`}></div>
                  <span className="body-small font-medium">{plan.day}</span>
                </div>
                <p className="body-small text-muted-foreground mb-1">{plan.tasks}</p>
                <p className="caption text-muted-foreground">Assigné à: {plan.assigned}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Management Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="heading-3 mb-4">Actions de Gestion</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { icon: Users, label: "Gérer Équipe", color: "bg-blue-50 text-blue-600" },
            { icon: Calendar, label: "Planning", color: "bg-green-50 text-green-600" },
            { icon: BarChart3, label: "Rapports", color: "bg-purple-50 text-purple-600" },
            { icon: Building2, label: "Exploitations", color: "bg-orange-50 text-orange-600" },
            { icon: Target, label: "Objectifs", color: "bg-red-50 text-red-600" },
            { icon: AlertTriangle, label: "Alertes", color: "bg-yellow-50 text-yellow-600" },
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

export default ResponsableLocalDashboard;
