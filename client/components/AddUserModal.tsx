import React, { useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogOverlay,
  DialogPortal,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  tabType: "eleveurs" | "utilisateurs" | "exploitations";
}

interface FormData {
  nom: string;
  prenom: string;
  compteUtilisateur: string;
  pieceIdentification: string;
  telephone: string;
  dateRecrutement: string;
  dateDelivrance: string;
  codePays: string;
  role: string;
  email: string;
}

const AddUserModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  tabType,
}) => {
  const [formData, setFormData] = useState<FormData>({
    nom: "",
    prenom: "",
    compteUtilisateur: "",
    pieceIdentification: "",
    telephone: "",
    dateRecrutement: "2022-06-21T14:30",
    dateDelivrance: "2022-06-21T14:30",
    codePays: "CMR",
    role: "",
    email: "",
  });

  const getModalTitle = () => {
    switch (tabType) {
      case "eleveurs":
        return "Ajouter un Éleveur";
      case "exploitations":
        return "Ajouter une Exploitation";
      default:
        return "Ajouter un Utilisateur";
    }
  };

  const getFormFields = () => {
    switch (tabType) {
      case "eleveurs":
        return {
          leftColumn: [
            {
              key: "nom",
              label: "Nom",
              placeholder: "Entrez le nom",
              required: true,
            },
            { key: "prenom", label: "Prénom", placeholder: "Entrez le prénom" },
            {
              key: "compteUtilisateur",
              label: "Compte utilisateur associé",
              placeholder: "Nom d'utilisateur",
            },
            {
              key: "pieceIdentification",
              label: "N° Pièce d'identification",
              placeholder: "Numéro d'identification",
            },
            {
              key: "telephone",
              label: "Numéro de téléphone*",
              placeholder: "Numéro de téléphone",
              required: true,
            },
          ],
          rightColumn: [
            {
              key: "dateRecrutement",
              label: "Date de début d'activité",
              type: "datetime-local",
            },
            {
              key: "dateDelivrance",
              label: "Date d'enregistrement",
              type: "datetime-local",
            },
            {
              key: "codePays",
              label: "Région",
              type: "select",
              options: ["CMR", "AUTRES"],
            },
            {
              key: "role",
              label: "Type d'élevage",
              type: "select",
              options: ["Bovin", "Ovin", "Caprin", "Porcin"],
            },
            {
              key: "email",
              label: "Adresse E-mail",
              placeholder: "email@exemple.com",
            },
          ],
        };
      case "exploitations":
        return {
          leftColumn: [
            {
              key: "nom",
              label: "Nom de l'exploitation",
              placeholder: "Nom de l'exploitation",
              required: true,
            },
            {
              key: "prenom",
              label: "Propriétaire",
              placeholder: "Nom du propriétaire",
            },
            {
              key: "compteUtilisateur",
              label: "Gestionnaire",
              placeholder: "Gestionnaire responsable",
            },
            {
              key: "pieceIdentification",
              label: "Code d'exploitation",
              placeholder: "Code unique",
            },
            {
              key: "telephone",
              label: "Téléphone de contact*",
              placeholder: "Numéro de contact",
              required: true,
            },
          ],
          rightColumn: [
            {
              key: "dateRecrutement",
              label: "Date de création",
              type: "datetime-local",
            },
            {
              key: "dateDelivrance",
              label: "Date d'enregistrement",
              type: "datetime-local",
            },
            {
              key: "codePays",
              label: "Région",
              type: "select",
              options: ["CMR", "AUTRES"],
            },
            {
              key: "role",
              label: "Type d'exploitation",
              type: "select",
              options: ["Ferme", "Ranch", "Coopérative"],
            },
            {
              key: "email",
              label: "Email de contact",
              placeholder: "contact@exploitation.com",
            },
          ],
        };
      default:
        return {
          leftColumn: [
            {
              key: "nom",
              label: "Nom",
              placeholder: "Entrez le nom",
              required: true,
            },
            {
              key: "prenom",
              label: "Prénom",
              placeholder: "Entrez votre prénom",
            },
            {
              key: "compteUtilisateur",
              label: "Compte utilisateur associé",
              placeholder: "Achraf",
            },
            {
              key: "pieceIdentification",
              label: "N° Pièce d'identification",
              placeholder: ".",
            },
            {
              key: "telephone",
              label: "Numéro de téléphone*",
              placeholder: ".",
              required: true,
            },
          ],
          rightColumn: [
            {
              key: "dateRecrutement",
              label: "Date de recrutement",
              type: "datetime-local",
            },
            {
              key: "dateDelivrance",
              label: "Date de délivrance",
              type: "datetime-local",
            },
            {
              key: "codePays",
              label: "Code du Pays",
              type: "select",
              options: ["CMR", "AUTRES"],
            },
            {
              key: "role",
              label: "Role",
              type: "select",
              options: ["Administrateur", "Gestionnaire", "Utilisateur"],
            },
            { key: "email", label: "Adresse E-mail", placeholder: "." },
          ],
        };
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    // Handle form submission logic here
    console.log("Form data:", formData);
    onClose();
  };

  const handleCancel = () => {
    // Reset form data
    setFormData({
      nom: "",
      prenom: "",
      compteUtilisateur: "",
      pieceIdentification: "",
      telephone: "",
      dateRecrutement: "2022-06-21T14:30",
      dateDelivrance: "2022-06-21T14:30",
      codePays: "CMR",
      role: "",
      email: "",
    });
    onClose();
  };

  const formFields = getFormFields();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay className="bg-black/30" />
        <DialogContent className="w-[95vw] max-w-[1104px] max-h-[90vh] overflow-y-auto mx-4 p-0 rounded-xl">
          {/* Modal Content */}
          <div className="flex flex-col bg-white rounded-xl">
            {/* Header */}
            <div className="flex flex-col px-8 pt-8 pb-0">
              <DialogHeader>
                <DialogTitle className="text-lg font-medium text-black font-poppins">
                  {getModalTitle()}
                </DialogTitle>
              </DialogHeader>
            </div>

            {/* Form Content */}
            <div className="flex-1 px-8 py-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 w-full">
                {/* Left Column */}
                <div className="flex flex-col gap-4">
                  {formFields.leftColumn.map((field) => (
                    <div key={field.key} className="flex flex-col gap-2">
                      <Label
                        htmlFor={field.key}
                        className="text-sm font-normal text-black font-poppins"
                      >
                        {field.label}
                      </Label>
                      <Input
                        id={field.key}
                        value={formData[field.key as keyof FormData]}
                        onChange={(e) =>
                          handleInputChange(field.key, e.target.value)
                        }
                        className="h-[42px] px-3 text-xs border-gray-100 rounded-xl font-poppins"
                        placeholder={field.placeholder}
                        style={{
                          borderColor:
                            field.key === "nom" ? "#21DB69" : "#F4F4F5",
                          borderWidth: "1px",
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-4">
                  {formFields.rightColumn.map((field) => (
                    <div key={field.key} className="flex flex-col gap-2">
                      <Label
                        htmlFor={field.key}
                        className="text-sm font-normal text-black font-poppins"
                      >
                        {field.label}
                      </Label>
                      {field.type === "datetime-local" ? (
                        <div className="relative">
                          <Input
                            id={field.key}
                            type="datetime-local"
                            value={formData[field.key as keyof FormData]}
                            onChange={(e) =>
                              handleInputChange(field.key, e.target.value)
                            }
                            className="h-[42px] px-3 text-xs border-gray-100 rounded-xl pr-10 font-poppins"
                            style={{
                              borderColor: "#F4F4F5",
                              borderWidth: "1px",
                            }}
                          />
                          <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-black pointer-events-none" />
                        </div>
                      ) : field.type === "select" ? (
                        <Select
                          value={
                            formData[field.key as keyof FormData] as string
                          }
                          onValueChange={(value) =>
                            handleInputChange(field.key, value)
                          }
                        >
                          <SelectTrigger className="h-[42px] text-xs font-poppins border-boviclouds-gray-100 rounded-xl">
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          id={field.key}
                          value={formData[field.key as keyof FormData]}
                          onChange={(e) =>
                            handleInputChange(field.key, e.target.value)
                          }
                          className="h-[42px] px-3 text-xs border-gray-100 rounded-xl font-poppins"
                          placeholder={field.placeholder}
                          style={{ borderColor: "#F4F4F5", borderWidth: "1px" }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col border-t border-gray-50">
              <DialogFooter className="flex flex-col sm:flex-row justify-end gap-2 p-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="w-full sm:w-[180px] h-[46px] rounded-lg text-sm font-normal border-gray-300 text-gray-800 hover:bg-gray-50 font-inter"
                >
                  Annuler
                </Button>
                <Button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full sm:w-[180px] h-[46px] rounded-lg text-sm font-medium bg-boviclouds-primary hover:bg-boviclouds-primary/90 text-white font-poppins"
                >
                  Ajouter
                </Button>
              </DialogFooter>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default AddUserModal;
