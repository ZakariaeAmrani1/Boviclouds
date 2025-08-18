import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  User,
  Building,
  MapPin,
  Images,
  Eye,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  BarChart3,
  FileText,
  Camera,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useToast } from "../hooks/use-toast";
import {
  DetailedCowData,
  MorphologicalDetection,
  GrowthDataPoint,
  MorphologicalStats,
} from "@shared/cow-details";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";

const CowDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // State management
  const [cowData, setCowData] = useState<DetailedCowData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // Fetch detailed cow data
  useEffect(() => {
    const fetchCowDetails = async () => {
      if (!id) {
        setError("ID de l'animal non fourni");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/identification/${id}/details`);
        
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.success && data.data) {
          setCowData(data.data);
        } else {
          setError(data.message || "Données non trouvées");
        }
      } catch (err) {
        console.error("Error fetching cow details:", err);
        setError(err instanceof Error ? err.message : "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchCowDetails();
  }, [id]);

  // Calculate growth data points for charts
  const growthData = useMemo((): GrowthDataPoint[] => {
    if (!cowData?.detections_morphologiques) return [];

    const birthDate = new Date(cowData.infos_sujet.date_naissance);
    
    return cowData.detections_morphologiques
      .map((detection) => {
        const detectionDate = new Date(detection.timestamp);
        const ageDays = Math.floor((detectionDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
        
        const measurements = detection.donnees_morphologiques;
        const confidenceAvg = (
          measurements.hauteur_au_garrot.confiance +
          measurements.largeur_du_corps.confiance +
          measurements.longueur_du_corps.confiance
        ) / 3;

        return {
          date: detectionDate.toLocaleDateString("fr-FR"),
          timestamp: detection.timestamp,
          hauteur_au_garrot: measurements.hauteur_au_garrot.valeur,
          largeur_du_corps: measurements.largeur_du_corps.valeur,
          longueur_du_corps: measurements.longueur_du_corps.valeur,
          age_days: ageDays,
          confiance_moyenne: confidenceAvg,
        };
      })
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [cowData]);

  // Calculate morphological statistics
  const morphologicalStats = useMemo((): MorphologicalStats | null => {
    if (!growthData.length) return null;

    const first = growthData[0];
    const latest = growthData[growthData.length - 1];
    const spanDays = latest.age_days - first.age_days;

    return {
      latest: {
        hauteur_au_garrot: {
          valeur: latest.hauteur_au_garrot,
          unite: "cm",
          confiance: 0.9,
          etat: "stable",
          notes: "Dernière mesure",
        },
        largeur_du_corps: {
          valeur: latest.largeur_du_corps,
          unite: "cm",
          confiance: 0.9,
          etat: "stable",
          notes: "Dernière mesure",
        },
        longueur_du_corps: {
          valeur: latest.longueur_du_corps,
          unite: "cm",
          confiance: 0.9,
          etat: "stable",
          notes: "Dernière mesure",
        },
      },
      first: {
        hauteur_au_garrot: {
          valeur: first.hauteur_au_garrot,
          unite: "cm",
          confiance: 0.9,
          etat: "stable",
          notes: "Première mesure",
        },
        largeur_du_corps: {
          valeur: first.largeur_du_corps,
          unite: "cm",
          confiance: 0.9,
          etat: "stable",
          notes: "Première mesure",
        },
        longueur_du_corps: {
          valeur: first.longueur_du_corps,
          unite: "cm",
          confiance: 0.9,
          etat: "stable",
          notes: "Première mesure",
        },
      },
      growth_rates: {
        hauteur_au_garrot: spanDays > 0 ? (latest.hauteur_au_garrot - first.hauteur_au_garrot) / spanDays : 0,
        largeur_du_corps: spanDays > 0 ? (latest.largeur_du_corps - first.largeur_du_corps) / spanDays : 0,
        longueur_du_corps: spanDays > 0 ? (latest.longueur_du_corps - first.longueur_du_corps) / spanDays : 0,
      },
      total_measurements: growthData.length,
      measurement_span_days: spanDays,
    };
  }, [growthData]);

  // Utility functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Bovin":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Ovin":
        return "bg-green-100 text-green-800 border-green-200";
      case "Caprin":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSexeColor = (sexe: string) => {
    switch (sexe) {
      case "Mâle":
        return "bg-cyan-100 text-cyan-800 border-cyan-200";
      case "Femelle":
        return "bg-pink-100 text-pink-800 border-pink-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-600";
    if (confidence >= 0.6) return "text-yellow-600";
    return "text-red-600";
  };

  // Image gallery functions
  const openImageModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImageIndex(null);
  };

  const nextImage = () => {
    if (cowData?.infos_sujet.photos && selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % cowData.infos_sujet.photos.length);
    }
  };

  const prevImage = () => {
    if (cowData?.infos_sujet.photos && selectedImageIndex !== null) {
      setSelectedImageIndex(
        selectedImageIndex === 0 ? cowData.infos_sujet.photos.length - 1 : selectedImageIndex - 1
      );
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-boviclouds-primary" />
          <p className="text-gray-600">Chargement des détails...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !cowData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erreur</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <div className="space-x-3">
            <Button onClick={() => navigate(-1)} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <Button onClick={() => window.location.reload()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Réessayer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const InfoCard: React.FC<{
    title: string;
    children: React.ReactNode;
    icon?: React.ReactNode;
  }> = ({ title, children, icon }) => (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );

  const InfoRow: React.FC<{
    label: string;
    value: string;
    badge?: boolean;
    color?: string;
  }> = ({ label, value, badge = false, color }) => (
    <div className="flex justify-between items-center py-1">
      <span className="text-sm text-gray-600">{label}:</span>
      {badge ? (
        <Badge className={`${color} font-medium`}>{value}</Badge>
      ) : (
        <span className="text-sm font-medium text-gray-900">{value}</span>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Détails - {cowData.infos_sujet.nni}
              </h1>
              <p className="text-sm text-gray-600">
                {cowData.infos_sujet.type} {cowData.infos_sujet.sexe} - {cowData.infos_sujet.race}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getTypeColor(cowData.infos_sujet.type)}>
              {cowData.infos_sujet.type}
            </Badge>
            <Badge className={getSexeColor(cowData.infos_sujet.sexe)}>
              {cowData.infos_sujet.sexe}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="genealogy">Généalogie</TabsTrigger>
            <TabsTrigger value="morphology">Morphologie</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Subject Information */}
              <InfoCard
                title="Informations du sujet"
                icon={<User className="w-4 h-4" />}
              >
                <div className="space-y-3">
                  <InfoRow label="NNI" value={cowData.infos_sujet.nni} />
                  <InfoRow
                    label="Date de naissance"
                    value={formatDate(cowData.infos_sujet.date_naissance)}
                  />
                  <InfoRow
                    label="Type"
                    value={cowData.infos_sujet.type}
                    badge
                    color={getTypeColor(cowData.infos_sujet.type)}
                  />
                  <InfoRow
                    label="Sexe"
                    value={cowData.infos_sujet.sexe}
                    badge
                    color={getSexeColor(cowData.infos_sujet.sexe)}
                  />
                  <InfoRow label="Race" value={cowData.infos_sujet.race} />
                </div>
              </InfoCard>

              {/* Complementary Information */}
              <InfoCard
                title="Informations complémentaires"
                icon={<Building className="w-4 h-4" />}
              >
                <div className="space-y-3">
                  <InfoRow
                    label="ID Éleveur"
                    value={cowData.complem.eleveur_id}
                  />
                  <InfoRow
                    label="ID Exploitation"
                    value={cowData.complem.exploitation_id}
                  />
                  <InfoRow
                    label="ID Responsable local"
                    value={cowData.complem.responsable_local_id}
                  />
                </div>
              </InfoCard>
            </div>

            {/* Quick Stats */}
            {morphologicalStats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Mesures totales</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {morphologicalStats.total_measurements}
                        </p>
                      </div>
                      <BarChart3 className="w-8 h-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Hauteur actuelle</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {morphologicalStats.latest.hauteur_au_garrot.valeur} cm
                        </p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Période de mesure</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {morphologicalStats.measurement_span_days} jours
                        </p>
                      </div>
                      <Calendar className="w-8 h-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Genealogy Tab */}
          <TabsContent value="genealogy" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Maternal Side */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Côté maternel
                </h3>

                {/* Mother */}
                <InfoCard title="Mère">
                  <div className="space-y-3">
                    <InfoRow label="NNI" value={cowData.infos_mere.nni} />
                    <InfoRow
                      label="Date de naissance"
                      value={formatDate(cowData.infos_mere.date_naissance)}
                    />
                    <InfoRow label="Race" value={cowData.infos_mere.race} />
                  </div>
                </InfoCard>

                {/* Maternal Grandfather */}
                <InfoCard title="Grand-père maternel">
                  <div className="space-y-3">
                    <InfoRow label="NNI" value={cowData.grand_pere_maternel.nni} />
                    {cowData.grand_pere_maternel.nom && (
                      <InfoRow label="Nom" value={cowData.grand_pere_maternel.nom} />
                    )}
                    <InfoRow
                      label="Date de naissance"
                      value={formatDate(cowData.grand_pere_maternel.date_naissance)}
                    />
                    <InfoRow label="Race" value={cowData.grand_pere_maternel.race} />
                  </div>
                </InfoCard>
              </div>

              {/* Paternal Side */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Côté paternel
                </h3>

                {/* Father */}
                <InfoCard title="Père">
                  <div className="space-y-3">
                    <InfoRow label="NNI" value={cowData.pere.nni} />
                    {cowData.pere.nom && (
                      <InfoRow label="Nom" value={cowData.pere.nom} />
                    )}
                    <InfoRow
                      label="Date de naissance"
                      value={formatDate(cowData.pere.date_naissance)}
                    />
                    <InfoRow label="Race" value={cowData.pere.race} />
                  </div>
                </InfoCard>

                {/* Paternal Grandparents */}
                <div className="grid grid-cols-1 gap-4">
                  <InfoCard title="Grand-père paternel">
                    <div className="space-y-3">
                      <InfoRow label="NNI" value={cowData.grand_pere_paternel.nni} />
                      {cowData.grand_pere_paternel.nom && (
                        <InfoRow label="Nom" value={cowData.grand_pere_paternel.nom} />
                      )}
                      <InfoRow
                        label="Date de naissance"
                        value={formatDate(cowData.grand_pere_paternel.date_naissance)}
                      />
                      <InfoRow label="Race" value={cowData.grand_pere_paternel.race} />
                    </div>
                  </InfoCard>

                  <InfoCard title="Grand-mère paternelle">
                    <div className="space-y-3">
                      <InfoRow label="NNI" value={cowData.grand_mere_paternelle.nni} />
                      <InfoRow
                        label="Date de naissance"
                        value={formatDate(cowData.grand_mere_paternelle.date_naissance)}
                      />
                      <InfoRow label="Race" value={cowData.grand_mere_paternelle.race} />
                    </div>
                  </InfoCard>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Morphology Tab */}
          <TabsContent value="morphology" className="space-y-6">
            {cowData.detections_morphologiques.length > 0 ? (
              <>
                {/* Growth Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Height Growth Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Évolution de la hauteur au garrot</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={growthData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="date"
                            fontSize={12}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                          />
                          <YAxis fontSize={12} />
                          <Tooltip
                            labelFormatter={(label) => `Date: ${label}`}
                            formatter={(value) => [`${value} cm`, "Hauteur"]}
                          />
                          <Line
                            type="monotone"
                            dataKey="hauteur_au_garrot"
                            stroke="#21DB69"
                            strokeWidth={2}
                            dot={{ fill: "#21DB69", strokeWidth: 2, r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Combined Growth Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Évolution comparative</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={growthData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="date"
                            fontSize={12}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                          />
                          <YAxis fontSize={12} />
                          <Tooltip
                            labelFormatter={(label) => `Date: ${label}`}
                            formatter={(value, name) => [
                              `${value} cm`,
                              name === "hauteur_au_garrot" ? "Hauteur" :
                              name === "largeur_du_corps" ? "Largeur" : "Longueur"
                            ]}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="hauteur_au_garrot"
                            stroke="#21DB69"
                            name="Hauteur au garrot"
                            strokeWidth={2}
                          />
                          <Line
                            type="monotone"
                            dataKey="largeur_du_corps"
                            stroke="#3B82F6"
                            name="Largeur du corps"
                            strokeWidth={2}
                          />
                          <Line
                            type="monotone"
                            dataKey="longueur_du_corps"
                            stroke="#8B5CF6"
                            name="Longueur du corps"
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Morphological Data Table */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Historique des mesures morphologiques
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Source</TableHead>
                            <TableHead>Hauteur au garrot</TableHead>
                            <TableHead>Largeur du corps</TableHead>
                            <TableHead>Longueur du corps</TableHead>
                            <TableHead>Confiance</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {cowData.detections_morphologiques
                            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                            .map((detection) => {
                              const measurements = detection.donnees_morphologiques;
                              const avgConfidence = (
                                measurements.hauteur_au_garrot.confiance +
                                measurements.largeur_du_corps.confiance +
                                measurements.longueur_du_corps.confiance
                              ) / 3;

                              return (
                                <TableRow key={detection._id}>
                                  <TableCell>
                                    {formatDateTime(detection.timestamp)}
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="outline">
                                      {detection.source_detection}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <span className="font-medium">
                                      {measurements.hauteur_au_garrot.valeur} {measurements.hauteur_au_garrot.unite}
                                    </span>
                                    <div className={`text-xs ${getConfidenceColor(measurements.hauteur_au_garrot.confiance)}`}>
                                      {Math.round(measurements.hauteur_au_garrot.confiance * 100)}% confiance
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <span className="font-medium">
                                      {measurements.largeur_du_corps.valeur} {measurements.largeur_du_corps.unite}
                                    </span>
                                    <div className={`text-xs ${getConfidenceColor(measurements.largeur_du_corps.confiance)}`}>
                                      {Math.round(measurements.largeur_du_corps.confiance * 100)}% confiance
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <span className="font-medium">
                                      {measurements.longueur_du_corps.valeur} {measurements.longueur_du_corps.unite}
                                    </span>
                                    <div className={`text-xs ${getConfidenceColor(measurements.longueur_du_corps.confiance)}`}>
                                      {Math.round(measurements.longueur_du_corps.confiance * 100)}% confiance
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className={`font-medium ${getConfidenceColor(avgConfidence)}`}>
                                      {Math.round(avgConfidence * 100)}%
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    {detection.image_url && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => window.open(detection.image_url, '_blank')}
                                      >
                                        <Camera className="w-4 h-4" />
                                      </Button>
                                    )}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucune donnée morphologique
                  </h3>
                  <p className="text-gray-600">
                    Les données morphologiques apparaîtront ici une fois les mesures effectuées.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Photos Tab */}
          <TabsContent value="photos" className="space-y-6">
            {cowData.infos_sujet.photos && cowData.infos_sujet.photos.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Images className="w-4 h-4" />
                    Photos de l'animal ({cowData.infos_sujet.photos.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {cowData.infos_sujet.photos.map((imageUrl, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50 cursor-pointer hover:border-boviclouds-primary transition-colors group"
                        onClick={() => openImageModal(index)}
                      >
                        <img
                          src={imageUrl}
                          alt={`Photo ${index + 1} de ${cowData.infos_sujet.nni}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.svg';
                          }}
                        />

                        {/* Overlay with view icon */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                          <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        {/* Image number badge */}
                        <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Images className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucune photo disponible
                  </h3>
                  <p className="text-gray-600">
                    Les photos de l'animal apparaîtront ici une fois ajoutées.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Full-screen image modal */}
      {isImageModalOpen && selectedImageIndex !== null && cowData.infos_sujet.photos && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center p-4">
            {/* Close button */}
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75 transition-all"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>

            {/* Navigation arrows */}
            {cowData.infos_sujet.photos.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75 transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75 transition-all"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Image */}
            <img
              src={cowData.infos_sujet.photos[selectedImageIndex]}
              alt={`Photo ${selectedImageIndex + 1} de ${cowData.infos_sujet.nni}`}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg';
              }}
            />

            {/* Image counter */}
            {cowData.infos_sujet.photos.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-sm">
                {selectedImageIndex + 1} / {cowData.infos_sujet.photos.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CowDetails;
