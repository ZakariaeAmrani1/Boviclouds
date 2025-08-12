import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  FileSearch,
  Activity,
  CheckCircle,
  Clock,
  AlertTriangle,
  QrCode,
  Tag,
  Camera,
  MapPin,
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

const IdentificateurDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Mock data for identification metrics
  const identificationData = [
    { month: "Jan", identifications: 45, rebouclages: 12 },
    { month: "Fév", identifications: 52, rebouclages: 8 },
    { month: "Mar", identifications: 38, rebouclages: 15 },
    { month: "Avr", identifications: 61, rebouclages: 10 },
    { month: "Mai", identifications: 55, rebouclages: 7 },
    { month: "Jun", identifications: 48, rebouclages: 9 },
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
          <h1 className="heading-1">Dashboard Identification</h1>
          <p className="body-base text-muted-foreground mt-1">
            Suivi des identifications et rebouclages des bovins
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
          <CheckCircle className="w-4 h-4" />
          <span>Équipement opérationnel</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="body-small text-muted-foreground">Identifications ce mois</p>
              <p className="heading-2 text-green-600">48</p>
            </div>
            <div className="p-3 bg-green-50 rounded-xl">
              <FileSearch className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <TrendingDown className="w-4 h-4 text-red-600" />
            <span className="body-small text-red-600">-12% vs mois dernier</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="body-small text-muted-foreground">Rebouclages</p>
              <p className="heading-2 text-blue-600">9</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="body-small text-green-600">+28% vs mois dernier</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="body-small text-muted-foreground">Taux de Conformité</p>
              <p className="heading-2 text-purple-600">96.8%</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="body-small text-green-600">+1.2% vs moyenne</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="body-small text-muted-foreground">En Attente</p>
              <p className="heading-2 text-orange-600">12</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-xl">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="body-small text-red-600">5 urgent(es)</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="heading-3 mb-6">Évolution des Activités</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={identificationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="identifications" 
                stroke="#21DB69" 
                strokeWidth={3}
                dot={{ fill: "#21DB69", strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="rebouclages" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="heading-3 mb-6">Répartition par Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { type: "Naissances", count: 32, color: "#21DB69" },
              { type: "Achats", count: 12, color: "#3B82F6" },
              { type: "Rebouclages", count: 9, color: "#F59E0B" },
              { type: "Corrections", count: 4, color: "#EF4444" },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="type" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#21DB69" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tasks and Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="heading-3 mb-4">Tâches d'Aujourd'hui</h3>
          <div className="space-y-3">
            {[
              { 
                time: "09:00", 
                task: "Identification veau - Exploitation Martin", 
                type: "identification",
                status: "pending",
                details: "Veau né hier, mère #FR1234567890"
              },
              { 
                time: "11:00", 
                task: "Rebouclage bovin - Exploitation Dupont", 
                type: "rebouclage",
                status: "in-progress",
                details: "Boucle #FR9876543210 endommagée"
              },
              { 
                time: "14:30", 
                task: "Contrôle conformité - Exploitation Bernard", 
                type: "control",
                status: "completed",
                details: "Vérification lot de 15 bovins"
              },
              { 
                time: "16:00", 
                task: "Photo identification - Exploitation Rousseau", 
                type: "photo",
                status: "pending",
                details: "Mise à jour photos pour 8 bovins"
              },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-blue-600 min-w-[60px]">{item.time}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {item.type === 'identification' && <FileSearch className="w-4 h-4 text-green-600" />}
                    {item.type === 'rebouclage' && <Activity className="w-4 h-4 text-blue-600" />}
                    {item.type === 'control' && <CheckCircle className="w-4 h-4 text-purple-600" />}
                    {item.type === 'photo' && <Camera className="w-4 h-4 text-orange-600" />}
                    <p className="body-small font-medium">{item.task}</p>
                  </div>
                  <p className="body-small text-muted-foreground">{item.details}</p>
                </div>
                <div className="text-right">
                  <div className={`w-3 h-3 rounded-full ${
                    item.status === 'completed' ? 'bg-green-500' :
                    item.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-400'
                  }`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="heading-3 mb-4">État du Matériel</h3>
          <div className="space-y-4">
            {[
              { 
                item: "Lecteur RFID Principal", 
                status: "operational", 
                battery: 85, 
                lastSync: "Il y a 5 min"
              },
              { 
                item: "Applicateur de Boucles", 
                status: "operational", 
                battery: 92, 
                lastSync: "Il y a 2 min"
              },
              { 
                item: "Appareil Photo Numérique", 
                status: "warning", 
                battery: 25, 
                lastSync: "Il y a 1h"
              },
              { 
                item: "Tablette de Terrain", 
                status: "operational", 
                battery: 78, 
                lastSync: "Il y a 1 min"
              },
            ].map((equipment, index) => (
              <div key={index} className="p-4 border border-gray-100 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      equipment.status === 'operational' ? 'bg-green-500' :
                      equipment.status === 'warning' ? 'bg-orange-500' : 'bg-red-500'
                    }`}></div>
                    <span className="body-small font-medium">{equipment.item}</span>
                  </div>
                  <span className="body-small text-muted-foreground">{equipment.battery}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className={`h-2 rounded-full ${
                      equipment.battery > 50 ? 'bg-green-500' :
                      equipment.battery > 25 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${equipment.battery}%` }}
                  ></div>
                </div>
                <p className="caption text-muted-foreground">Dernière sync: {equipment.lastSync}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdentificateurDashboard;
