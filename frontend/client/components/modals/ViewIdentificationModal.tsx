import React from "react";
import { X, Calendar, User, Building, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogOverlay,
  DialogPortal,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { IdentificationRecord } from "@shared/identification";

interface ViewIdentificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  identification: IdentificationRecord;
}

const ViewIdentificationModal: React.FC<ViewIdentificationModalProps> = ({
  isOpen,
  onClose,
  identification,
}) => {
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

  const InfoCard: React.FC<{
    title: string;
    children: React.ReactNode;
    icon?: React.ReactNode;
  }> = ({ title, children, icon }) => (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );

  const InfoRow: React.FC<{
    label: string;
    value: string;
    badge?: boolean;
    color?: string;
  }> = ({ label, value, badge = false, color }) => (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-600">{label}:</span>
      {badge ? (
        <Badge className={`${color} font-medium`}>{value}</Badge>
      ) : (
        <span className="text-sm font-medium text-gray-900">{value}</span>
      )}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay className="bg-black/20" />
        <DialogContent className="w-[95vw] max-w-6xl max-h-[90vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg font-medium text-black flex items-center gap-2">
              <User className="w-5 h-5" />
              Identification - {identification.infos_sujet.nni}
            </DialogTitle>
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Subject Information */}
            <InfoCard
              title="Informations du sujet"
              icon={<User className="w-4 h-4" />}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow label="NNI" value={identification.infos_sujet.nni} />
                <InfoRow
                  label="Date de naissance"
                  value={formatDate(identification.infos_sujet.date_naissance)}
                />
                <InfoRow
                  label="Type"
                  value={identification.infos_sujet.type}
                  badge
                  color={getTypeColor(identification.infos_sujet.type)}
                />
                <InfoRow
                  label="Sexe"
                  value={identification.infos_sujet.sexe}
                  badge
                  color={getSexeColor(identification.infos_sujet.sexe)}
                />
                <InfoRow label="Race" value={identification.infos_sujet.race} />
              </div>
            </InfoCard>

            <Separator />

            {/* Genealogy Tree */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Arbre généalogique
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Maternal Side */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-700 border-b pb-2">
                    Côté maternel
                  </h4>

                  {/* Mother */}
                  <InfoCard title="Mère">
                    <InfoRow
                      label="NNI"
                      value={identification.infos_mere.nni}
                    />
                    <InfoRow
                      label="Date de naissance"
                      value={formatDate(
                        identification.infos_mere.date_naissance,
                      )}
                    />
                    <InfoRow
                      label="Race"
                      value={identification.infos_mere.race}
                    />
                  </InfoCard>

                  {/* Maternal Grandfather */}
                  <InfoCard title="Grand-père maternel">
                    <InfoRow
                      label="NNI"
                      value={identification.grand_pere_maternel.nni}
                    />
                    <InfoRow
                      label="Date de naissance"
                      value={formatDate(
                        identification.grand_pere_maternel.date_naissance,
                      )}
                    />
                    <InfoRow
                      label="Race"
                      value={identification.grand_pere_maternel.race}
                    />
                  </InfoCard>
                </div>

                {/* Paternal Side */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-700 border-b pb-2">
                    Côté paternel
                  </h4>

                  {/* Father */}
                  <InfoCard title="Père">
                    <InfoRow label="NNI" value={identification.pere.nni} />
                    <InfoRow
                      label="Date de naissance"
                      value={formatDate(identification.pere.date_naissance)}
                    />
                    <InfoRow label="Race" value={identification.pere.race} />
                  </InfoCard>

                  {/* Paternal Grandparents */}
                  <div className="grid grid-cols-1 gap-4">
                    <InfoCard title="Grand-père paternel">
                      <InfoRow
                        label="NNI"
                        value={identification.grand_pere_paternel.nni}
                      />
                      <InfoRow
                        label="Date de naissance"
                        value={formatDate(
                          identification.grand_pere_paternel.date_naissance,
                        )}
                      />
                      <InfoRow
                        label="Race"
                        value={identification.grand_pere_paternel.race}
                      />
                    </InfoCard>

                    <InfoCard title="Grand-mère paternelle">
                      <InfoRow
                        label="NNI"
                        value={identification.grand_mere_paternelle.nni}
                      />
                      <InfoRow
                        label="Date de naissance"
                        value={formatDate(
                          identification.grand_mere_paternelle.date_naissance,
                        )}
                      />
                      <InfoRow
                        label="Race"
                        value={identification.grand_mere_paternelle.race}
                      />
                    </InfoCard>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Complementary Information */}
            <InfoCard
              title="Informations complémentaires"
              icon={<Building className="w-4 h-4" />}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InfoRow
                  label="ID Éleveur"
                  value={identification.complem.eleveur_id}
                />
                <InfoRow
                  label="ID Exploitation"
                  value={identification.complem.exploitation_id}
                />
                <InfoRow
                  label="ID Responsable local"
                  value={identification.complem.responsable_local_id}
                />
              </div>
            </InfoCard>

            <Separator />

            {/* Metadata */}
            <InfoCard
              title="Métadonnées"
              icon={<Calendar className="w-4 h-4" />}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InfoRow label="Créé par" value={identification.createdBy} />
                <InfoRow
                  label="Date de création"
                  value={formatDateTime(identification.createdAt)}
                />
                <InfoRow
                  label="Dernière modification"
                  value={formatDateTime(identification.updatedAt)}
                />
              </div>
            </InfoCard>
          </div>

          <DialogFooter className="flex justify-end pt-4 border-t border-boviclouds-gray-50">
            <Button
              type="button"
              onClick={onClose}
              className="w-full sm:w-32 h-10 rounded-lg text-sm font-normal bg-boviclouds-primary hover:bg-boviclouds-primary/90 text-white"
            >
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default ViewIdentificationModal;
