import React from "react";
import { Milk, User, Hash, Calendar, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { LactationRecord } from "@shared/lactation";
import { useUsers, useIdentifications } from "../../hooks/useLactation";
import { formatDateForDisplay } from "../../lib/lactationValidation";

interface ViewLactationModalProps {
  isOpen: boolean;
  onClose: () => void;
  lactation: LactationRecord;
}

const ViewLactationModal: React.FC<ViewLactationModalProps> = ({
  isOpen,
  onClose,
  lactation,
}) => {
  const { getUserName } = useUsers();
  const { getIdentificationName } = useIdentifications();

  const formatDate = (dateString: string) => {
    return formatDateForDisplay(dateString);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("fr-FR");
  };

  const calculateMgFromPercentage = (milkKg: number, mgPct: number): number => {
    return (milkKg * mgPct) / 100;
  };

  const isFirstLactation = lactation.n_lactation === 1;
  const isHighProduction = lactation.lait_kg > 50;
  const isLowProduction = lactation.lait_kg < 20;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Milk className="w-5 h-5 text-boviclouds-primary" />
            Détails de la lactation
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-sm text-gray-600">Sujet</div>
              <div className="font-semibold text-lg">
                {getIdentificationName(lactation.sujet_id)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Lactation N°</div>
              <div className="font-semibold text-lg">
                <Badge 
                  className={`text-lg px-3 py-1 ${
                    isFirstLactation 
                      ? "bg-blue-100 text-blue-800 border-blue-200" 
                      : "bg-green-100 text-green-800 border-green-200"
                  }`}
                >
                  {lactation.n_lactation}
                  {isFirstLactation && " (Première)"}
                </Badge>
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Production Lait</div>
              <div className="font-semibold text-lg">
                <Badge 
                  className={`text-lg px-3 py-1 ${
                    isHighProduction 
                      ? "bg-green-100 text-green-800 border-green-200" 
                      : isLowProduction
                      ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                      : "bg-blue-100 text-blue-800 border-blue-200"
                  }`}
                >
                  {lactation.lait_kg} kg
                </Badge>
              </div>
            </div>
          </div>

          {/* Main Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Info className="w-5 h-5" />
                Informations générales
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Date de vêlage:</span>
                  <span className="font-medium flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(lactation.date_velage)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Contrôleur laitier:</span>
                  <span className="font-medium flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {getUserName(lactation.controleur_laitier_id)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Créé le:</span>
                  <span className="text-sm text-gray-500">
                    {formatDateTime(lactation.createdAt)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Modifié le:</span>
                  <span className="text-sm text-gray-500">
                    {formatDateTime(lactation.updatedAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Production Data */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Milk className="w-5 h-5" />
                Données de production
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantité de lait:</span>
                  <span className="font-medium">{lactation.lait_kg} kg</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Matière grasse (kg):</span>
                  <span className="font-medium">{lactation.kg_mg} kg</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Pourcentage MG:</span>
                  <span className="font-medium">{lactation.pct_mg}%</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Pourcentage protéine:</span>
                  <span className="font-medium">{lactation.pct_proteine}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quality Indicators */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Indicateurs de qualité</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
                <div className="text-sm text-blue-600 font-medium">Ratio MG/Lait</div>
                <div className="text-lg font-semibold text-blue-800">
                  {((lactation.kg_mg / lactation.lait_kg) * 100).toFixed(2)}%
                </div>
              </div>
              
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                <div className="text-sm text-green-600 font-medium">Protéine</div>
                <div className="text-lg font-semibold text-green-800">
                  {lactation.pct_proteine}%
                </div>
                <div className="text-xs text-green-600">
                  {lactation.pct_proteine >= 3.0 && lactation.pct_proteine <= 4.5 
                    ? "Normal" 
                    : "Hors norme"}
                </div>
              </div>
              
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                <div className="text-sm text-yellow-600 font-medium">Matière Grasse</div>
                <div className="text-lg font-semibold text-yellow-800">
                  {lactation.pct_mg}%
                </div>
                <div className="text-xs text-yellow-600">
                  {lactation.pct_mg >= 3.0 && lactation.pct_mg <= 5.5 
                    ? "Normal" 
                    : "Hors norme"}
                </div>
              </div>
              
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-center">
                <div className="text-sm text-purple-600 font-medium">Production</div>
                <div className="text-lg font-semibold text-purple-800">
                  {lactation.lait_kg} kg
                </div>
                <div className="text-xs text-purple-600">
                  {isHighProduction 
                    ? "Élevée" 
                    : isLowProduction 
                    ? "Faible" 
                    : "Normale"}
                </div>
              </div>
            </div>
          </div>

          {/* Calculated Values */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Valeurs calculées</h3>
            
            <div className="p-4 bg-gray-50 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">MG calculé à partir du %:</span>
                <span className="font-medium">
                  {calculateMgFromPercentage(lactation.lait_kg, lactation.pct_mg).toFixed(2)} kg
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Différence MG:</span>
                <span className={`font-medium ${
                  Math.abs(lactation.kg_mg - calculateMgFromPercentage(lactation.lait_kg, lactation.pct_mg)) < 0.1
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}>
                  {(lactation.kg_mg - calculateMgFromPercentage(lactation.lait_kg, lactation.pct_mg)).toFixed(2)} kg
                </span>
              </div>
              
              <div className="text-xs text-gray-500 mt-2">
                * Une différence inférieure à 0.1 kg indique une cohérence des données
              </div>
            </div>
          </div>

          {/* Warnings */}
          {(isFirstLactation && isHighProduction) && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-md">
              <p className="text-sm text-orange-800 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Production élevée pour une première lactation - vérifiez les données
              </p>
            </div>
          )}
          
          {(lactation.pct_proteine < 2.5 || lactation.pct_proteine > 5.0) && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Pourcentage de protéine hors norme (attendu: 2.5-5.0%)
              </p>
            </div>
          )}
          
          {(lactation.pct_mg < 2.5 || lactation.pct_mg > 6.0) && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Pourcentage de matière grasse hors norme (attendu: 2.5-6.0%)
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewLactationModal;
