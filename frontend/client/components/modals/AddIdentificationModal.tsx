import React, { useState, useRef } from "react";
import {
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Check,
  User,
  Users,
  Building,
  Eye,
  Calendar,
  Images,
} from "lucide-react";
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
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useToast } from "../../hooks/use-toast";
import { useIdentification } from "../../hooks/useIdentification";
import MultiImageUpload, { ImageData } from "../ui/multi-image-upload";
import {
  CreateIdentificationInput,
  Race,
  Sexe,
  TypeAnimal,
} from "@shared/identification";
import {
  CreateIdentificationValidationSchema,
  QuickValidationSchemas,
  formatValidationErrors,
} from "../../lib/identificationValidation";

interface AddIdentificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  // Subject info
  sujet_nni: string;
  sujet_date_naissance: string;
  sujet_race: Race | "";
  sujet_sexe: Sexe | "";
  sujet_type: TypeAnimal | "";
  images: ImageData[];

  // Mother info
  mere_nni: string;
  mere_date_naissance: string;
  mere_race: Race | "";

  // Maternal grandfather
  grand_pere_maternel_nni: string;
  grand_pere_maternel_date_naissance: string;
  grand_pere_maternel_race: Race | "";

  // Father
  pere_nni: string;
  pere_date_naissance: string;
  pere_race: Race | "";

  // Paternal grandfather
  grand_pere_paternel_nni: string;
  grand_pere_paternel_date_naissance: string;
  grand_pere_paternel_race: Race | "";

  // Paternal grandmother
  grand_mere_paternelle_nni: string;
  grand_mere_paternelle_date_naissance: string;
  grand_mere_paternelle_race: Race | "";

  // Complementary info
  eleveur_id: string;
  exploitation_id: string;
  responsable_local_id: string;
}

const steps = [
  {
    id: 1,
    title: "Informations du sujet",
    description: "Données principales de l'animal",
    icon: User,
  },
  {
    id: 2,
    title: "Photos de l'animal",
    description: "Images d'identification",
    icon: Images,
  },
  {
    id: 3,
    title: "Lignée maternelle",
    description: "Mère et grand-père maternel",
    icon: Users,
  },
  {
    id: 4,
    title: "Lignée paternelle",
    description: "Père et grands-parents paternels",
    icon: Users,
  },
  {
    id: 5,
    title: "Informations complémentaires",
    description: "Éleveur, exploitation et responsable",
    icon: Building,
  },
  {
    id: 6,
    title: "Vérification",
    description: "Validation des données",
    icon: Eye,
  },
];

const AddIdentificationModal: React.FC<AddIdentificationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { toast } = useToast();
  const { loading, error, createRecord } = useIdentification();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    sujet_nni: "",
    sujet_date_naissance: "",
    sujet_race: "",
    sujet_sexe: "",
    sujet_type: "",
    images: [],
    mere_nni: "",
    mere_date_naissance: "",
    mere_race: "",
    grand_pere_maternel_nni: "",
    grand_pere_maternel_date_naissance: "",
    grand_pere_maternel_race: "",
    pere_nni: "",
    pere_date_naissance: "",
    pere_race: "",
    grand_pere_paternel_nni: "",
    grand_pere_paternel_date_naissance: "",
    grand_pere_paternel_race: "",
    grand_mere_paternelle_nni: "",
    grand_mere_paternelle_date_naissance: "",
    grand_mere_paternelle_race: "",
    eleveur_id: "",
    exploitation_id: "",
    responsable_local_id: "",
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const handleFormChange = (field: keyof FormData, value: string | ImageData[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleImagesChange = (images: ImageData[]) => {
    handleFormChange('images', images);
  };

  const resetForm = () => {
    setFormData({
      sujet_nni: "",
      sujet_date_naissance: "",
      sujet_race: "",
      sujet_sexe: "",
      sujet_type: "",
      images: [],
      mere_nni: "",
      mere_date_naissance: "",
      mere_race: "",
      grand_pere_maternel_nni: "",
      grand_pere_maternel_date_naissance: "",
      grand_pere_maternel_race: "",
      pere_nni: "",
      pere_date_naissance: "",
      pere_race: "",
      grand_pere_paternel_nni: "",
      grand_pere_paternel_date_naissance: "",
      grand_pere_paternel_race: "",
      grand_mere_paternelle_nni: "",
      grand_mere_paternelle_date_naissance: "",
      grand_mere_paternelle_race: "",
      eleveur_id: "",
      exploitation_id: "",
      responsable_local_id: "",
    });
    setValidationErrors({});
    setCurrentStep(1);
    setCompletedSteps(new Set());
  };

  const validateCurrentStep = (): boolean => {
    setValidationErrors({});

    try {
      switch (currentStep) {
        case 1: {
          const stepData = {
            nni: formData.sujet_nni.trim().toUpperCase(),
            date_naissance: formData.sujet_date_naissance,
            race: formData.sujet_race as Race,
            sexe: formData.sujet_sexe as Sexe,
            type: formData.sujet_type as TypeAnimal,
          };
          QuickValidationSchemas.sujet.parse(stepData);
          return true;
        }
        case 2: {
          // Image step - no validation required, images are optional
          return true;
        }
        case 3: {
          const mereData = {
            nni: formData.mere_nni.trim().toUpperCase(),
            date_naissance: formData.mere_date_naissance,
            race: formData.mere_race as Race,
          };
          const grandPereMData = {
            nni: formData.grand_pere_maternel_nni.trim().toUpperCase(),
            date_naissance: formData.grand_pere_maternel_date_naissance,
            race: formData.grand_pere_maternel_race as Race,
          };
          QuickValidationSchemas.mere.parse(mereData);
          QuickValidationSchemas.grandPereMaternel.parse(grandPereMData);
          return true;
        }
        case 4: {
          const pereData = {
            nni: formData.pere_nni.trim().toUpperCase(),
            date_naissance: formData.pere_date_naissance,
            race: formData.pere_race as Race,
          };
          const grandPerePData = {
            nni: formData.grand_pere_paternel_nni.trim().toUpperCase(),
            date_naissance: formData.grand_pere_paternel_date_naissance,
            race: formData.grand_pere_paternel_race as Race,
          };
          const grandMerePData = {
            nni: formData.grand_mere_paternelle_nni.trim().toUpperCase(),
            date_naissance: formData.grand_mere_paternelle_date_naissance,
            race: formData.grand_mere_paternelle_race as Race,
          };
          QuickValidationSchemas.pere.parse(pereData);
          QuickValidationSchemas.grandPerePaternal.parse(grandPerePData);
          QuickValidationSchemas.grandMerePaternelle.parse(grandMerePData);
          return true;
        }
        case 5: {
          const complemData = {
            eleveur_id: formData.eleveur_id.trim(),
            exploitation_id: formData.exploitation_id.trim(),
            responsable_local_id: formData.responsable_local_id.trim(),
          };
          QuickValidationSchemas.complem.parse(complemData);
          return true;
        }
        default:
          return true;
      }
    } catch (error: any) {
      if (error.errors) {
        const errors = formatValidationErrors(error);
        setValidationErrors(errors);

        // Show first validation error as toast
        const firstError = Object.values(errors)[0];
        if (firstError) {
          toast({
            title: "Erreur de validation",
            description: firstError,
            variant: "destructive",
          });
        }
      }
      return false;
    }
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepNumber: number) => {
    if (stepNumber <= currentStep || completedSteps.has(stepNumber)) {
      setCurrentStep(stepNumber);
    }
  };

  const handleSubmit = async () => {
    // Validate all steps first
    const originalStep = currentStep;
    let allValid = true;

    for (let step = 1; step <= 5; step++) {
      setCurrentStep(step);
      if (!validateCurrentStep()) {
        allValid = false;
        return;
      }
    }

    setCurrentStep(originalStep);

    try {
      const input: CreateIdentificationInput = {
        infos_sujet: {
          nni: formData.sujet_nni.trim().toUpperCase(),
          date_naissance: formData.sujet_date_naissance,
          race: formData.sujet_race as Race,
          sexe: formData.sujet_sexe as Sexe,
          type: formData.sujet_type as TypeAnimal,
        },
        infos_mere: {
          nni: formData.mere_nni.trim().toUpperCase(),
          date_naissance: formData.mere_date_naissance,
          race: formData.mere_race as Race,
        },
        grand_pere_maternel: {
          nni: formData.grand_pere_maternel_nni.trim().toUpperCase(),
          date_naissance: formData.grand_pere_maternel_date_naissance,
          race: formData.grand_pere_maternel_race as Race,
        },
        pere: {
          nni: formData.pere_nni.trim().toUpperCase(),
          date_naissance: formData.pere_date_naissance,
          race: formData.pere_race as Race,
        },
        grand_pere_paternel: {
          nni: formData.grand_pere_paternel_nni.trim().toUpperCase(),
          date_naissance: formData.grand_pere_paternel_date_naissance,
          race: formData.grand_pere_paternel_race as Race,
        },
        grand_mere_paternelle: {
          nni: formData.grand_mere_paternelle_nni.trim().toUpperCase(),
          date_naissance: formData.grand_mere_paternelle_date_naissance,
          race: formData.grand_mere_paternelle_race as Race,
        },
        complem: {
          eleveur_id: formData.eleveur_id.trim(),
          exploitation_id: formData.exploitation_id.trim(),
          responsable_local_id: formData.responsable_local_id.trim(),
        },
        createdBy: "ZAKARIAE AMRANI",
      };

      const result = await createRecord(input, formData.images);
      if (result) {
        toast({
          title: "Succès",
          description: "L'identification a été créée avec succès.",
        });
        resetForm();
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création.",
        variant: "destructive",
      });
    }
  };

  const handleModalClose = () => {
    resetForm();
    onClose();
  };

  const getRaceOptions = () => {
    return Object.values(Race).map((race) => (
      <SelectItem key={race} value={race}>
        {race}
      </SelectItem>
    ));
  };

  const isStepCompleted = (stepNumber: number) => {
    return completedSteps.has(stepNumber) || stepNumber < currentStep;
  };

  const canNavigateToStep = (stepNumber: number) => {
    return stepNumber <= currentStep || completedSteps.has(stepNumber);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogPortal>
        <DialogOverlay className="bg-black/20" />
        <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg font-medium text-black">
              Ajouter une identification
            </DialogTitle>
          </DialogHeader>

          {/* Step Progress Indicator */}
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = isStepCompleted(step.id);
                const canNavigate = canNavigateToStep(step.id);

                return (
                  <div key={step.id} className="flex items-center">
                    <button
                      onClick={() => canNavigate && handleStepClick(step.id)}
                      disabled={!canNavigate}
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                        isActive
                          ? "bg-boviclouds-primary border-boviclouds-primary text-white shadow-lg"
                          : isCompleted
                            ? "bg-green-500 border-green-500 text-white"
                            : canNavigate
                              ? "border-gray-300 text-gray-400 hover:border-boviclouds-primary hover:text-boviclouds-primary cursor-pointer"
                              : "border-gray-200 text-gray-300 cursor-not-allowed"
                      }`}
                    >
                      {isCompleted && !isActive ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <StepIcon className="w-5 h-5" />
                      )}
                    </button>

                    {index < steps.length - 1 && (
                      <div
                        className={`w-16 h-0.5 mx-2 transition-colors duration-200 ${
                          isCompleted ? "bg-green-500" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 text-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {steps[currentStep - 1].title}
              </h3>
              <p className="text-sm text-gray-600">
                {steps[currentStep - 1].description}
              </p>
            </div>
          </div>

          <Separator />

          {/* Step Content */}
          <div className="px-6 py-4 min-h-[400px]">
            {/* Step 1: Subject Information */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="sujet_nni"
                      className="text-sm font-normal text-black"
                    >
                      NNI *
                    </Label>
                    <Input
                      id="sujet_nni"
                      value={formData.sujet_nni}
                      onChange={(e) =>
                        handleFormChange("sujet_nni", e.target.value)
                      }
                      className="h-12 px-4 text-sm rounded-xl border-boviclouds-gray-100"
                      placeholder="Ex: FR1234567890"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="sujet_date_naissance"
                      className="text-sm font-normal text-black"
                    >
                      Date de naissance *
                    </Label>
                    <div className="relative">
                      <Input
                        id="sujet_date_naissance"
                        type="date"
                        value={formData.sujet_date_naissance}
                        onChange={(e) =>
                          handleFormChange(
                            "sujet_date_naissance",
                            e.target.value,
                          )
                        }
                        className="h-12 px-4 text-sm rounded-xl pr-12 border-boviclouds-gray-100"
                        disabled={loading}
                      />
                      <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="sujet_type"
                      className="text-sm font-normal text-black"
                    >
                      Type d'animal *
                    </Label>
                    <Select
                      value={formData.sujet_type}
                      onValueChange={(value) =>
                        handleFormChange("sujet_type", value)
                      }
                    >
                      <SelectTrigger className="h-12 text-sm">
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={TypeAnimal.BOVIN}>Bovin</SelectItem>
                        <SelectItem value={TypeAnimal.OVIN}>Ovin</SelectItem>
                        <SelectItem value={TypeAnimal.CAPRIN}>
                          Caprin
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="sujet_sexe"
                      className="text-sm font-normal text-black"
                    >
                      Sexe *
                    </Label>
                    <Select
                      value={formData.sujet_sexe}
                      onValueChange={(value) =>
                        handleFormChange("sujet_sexe", value)
                      }
                    >
                      <SelectTrigger className="h-12 text-sm">
                        <SelectValue placeholder="Sélectionner un sexe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={Sexe.MALE}>Mâle</SelectItem>
                        <SelectItem value={Sexe.FEMELLE}>Femelle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label
                      htmlFor="sujet_race"
                      className="text-sm font-normal text-black"
                    >
                      Race *
                    </Label>
                    <Select
                      value={formData.sujet_race}
                      onValueChange={(value) =>
                        handleFormChange("sujet_race", value)
                      }
                    >
                      <SelectTrigger className="h-12 text-sm">
                        <SelectValue placeholder="Sélectionner une race" />
                      </SelectTrigger>
                      <SelectContent>{getRaceOptions()}</SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Image Upload */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="text-center mb-6">
                  <Images className="w-12 h-12 mx-auto text-boviclouds-primary mb-2" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Photos de l'animal
                  </h3>
                  <p className="text-gray-600">
                    Ajoutez des photos pour l'identification de l'animal (optionnel)
                  </p>
                </div>

                <MultiImageUpload
                  images={formData.images}
                  onImagesChange={handleImagesChange}
                  maxImages={5}
                  maxFileSize={5}
                  disabled={loading}
                  className="w-full"
                />

                <div className="text-xs text-gray-500 text-center bg-blue-50 p-3 rounded-lg">
                  📝 <strong>Conseil:</strong> Prenez des photos claires du museau, des flancs et de la face de l'animal pour une meilleure identification.
                </div>
              </div>
            )}

            {/* Step 3: Maternal Line */}
            {currentStep === 3 && (
              <div className="space-y-8 animate-fadeIn">
                {/* Mother */}
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Informations de la mère
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="mere_nni"
                        className="text-sm font-normal text-black"
                      >
                        NNI *
                      </Label>
                      <Input
                        id="mere_nni"
                        value={formData.mere_nni}
                        onChange={(e) =>
                          handleFormChange("mere_nni", e.target.value)
                        }
                        className="h-12 px-4 text-sm rounded-xl border-boviclouds-gray-100"
                        placeholder="Ex: FR1234567890"
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="mere_date_naissance"
                        className="text-sm font-normal text-black"
                      >
                        Date de naissance *
                      </Label>
                      <div className="relative">
                        <Input
                          id="mere_date_naissance"
                          type="date"
                          value={formData.mere_date_naissance}
                          onChange={(e) =>
                            handleFormChange(
                              "mere_date_naissance",
                              e.target.value,
                            )
                          }
                          className="h-12 px-4 text-sm rounded-xl pr-12 border-boviclouds-gray-100"
                          disabled={loading}
                        />
                        <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="mere_race"
                        className="text-sm font-normal text-black"
                      >
                        Race *
                      </Label>
                      <Select
                        value={formData.mere_race}
                        onValueChange={(value) =>
                          handleFormChange("mere_race", value)
                        }
                      >
                        <SelectTrigger className="h-12 text-sm">
                          <SelectValue placeholder="Sélectionner une race" />
                        </SelectTrigger>
                        <SelectContent>{getRaceOptions()}</SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Maternal Grandfather */}
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Grand-père maternel
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="grand_pere_maternel_nni"
                        className="text-sm font-normal text-black"
                      >
                        NNI *
                      </Label>
                      <Input
                        id="grand_pere_maternel_nni"
                        value={formData.grand_pere_maternel_nni}
                        onChange={(e) =>
                          handleFormChange(
                            "grand_pere_maternel_nni",
                            e.target.value,
                          )
                        }
                        className="h-12 px-4 text-sm rounded-xl border-boviclouds-gray-100"
                        placeholder="Ex: FR1234567890"
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="grand_pere_maternel_date_naissance"
                        className="text-sm font-normal text-black"
                      >
                        Date de naissance *
                      </Label>
                      <div className="relative">
                        <Input
                          id="grand_pere_maternel_date_naissance"
                          type="date"
                          value={formData.grand_pere_maternel_date_naissance}
                          onChange={(e) =>
                            handleFormChange(
                              "grand_pere_maternel_date_naissance",
                              e.target.value,
                            )
                          }
                          className="h-12 px-4 text-sm rounded-xl pr-12 border-boviclouds-gray-100"
                          disabled={loading}
                        />
                        <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="grand_pere_maternel_race"
                        className="text-sm font-normal text-black"
                      >
                        Race *
                      </Label>
                      <Select
                        value={formData.grand_pere_maternel_race}
                        onValueChange={(value) =>
                          handleFormChange("grand_pere_maternel_race", value)
                        }
                      >
                        <SelectTrigger className="h-12 text-sm">
                          <SelectValue placeholder="Sélectionner une race" />
                        </SelectTrigger>
                        <SelectContent>{getRaceOptions()}</SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Paternal Line */}
            {currentStep === 4 && (
              <div className="space-y-8 animate-fadeIn">
                {/* Father */}
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Informations du père
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="pere_nni"
                        className="text-sm font-normal text-black"
                      >
                        NNI *
                      </Label>
                      <Input
                        id="pere_nni"
                        value={formData.pere_nni}
                        onChange={(e) =>
                          handleFormChange("pere_nni", e.target.value)
                        }
                        className="h-12 px-4 text-sm rounded-xl border-boviclouds-gray-100"
                        placeholder="Ex: FR1234567890"
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="pere_date_naissance"
                        className="text-sm font-normal text-black"
                      >
                        Date de naissance *
                      </Label>
                      <div className="relative">
                        <Input
                          id="pere_date_naissance"
                          type="date"
                          value={formData.pere_date_naissance}
                          onChange={(e) =>
                            handleFormChange(
                              "pere_date_naissance",
                              e.target.value,
                            )
                          }
                          className="h-12 px-4 text-sm rounded-xl pr-12 border-boviclouds-gray-100"
                          disabled={loading}
                        />
                        <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="pere_race"
                        className="text-sm font-normal text-black"
                      >
                        Race *
                      </Label>
                      <Select
                        value={formData.pere_race}
                        onValueChange={(value) =>
                          handleFormChange("pere_race", value)
                        }
                      >
                        <SelectTrigger className="h-12 text-sm">
                          <SelectValue placeholder="Sélectionner une race" />
                        </SelectTrigger>
                        <SelectContent>{getRaceOptions()}</SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Paternal Grandparents */}
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Grands-parents paternels
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Paternal Grandfather */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
                        Grand-père paternel
                      </h4>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="grand_pere_paternel_nni"
                            className="text-sm font-normal text-black"
                          >
                            NNI *
                          </Label>
                          <Input
                            id="grand_pere_paternel_nni"
                            value={formData.grand_pere_paternel_nni}
                            onChange={(e) =>
                              handleFormChange(
                                "grand_pere_paternel_nni",
                                e.target.value,
                              )
                            }
                            className="h-12 px-4 text-sm rounded-xl border-boviclouds-gray-100"
                            placeholder="Ex: FR1234567890"
                            disabled={loading}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="grand_pere_paternel_date_naissance"
                            className="text-sm font-normal text-black"
                          >
                            Date de naissance *
                          </Label>
                          <div className="relative">
                            <Input
                              id="grand_pere_paternel_date_naissance"
                              type="date"
                              value={
                                formData.grand_pere_paternel_date_naissance
                              }
                              onChange={(e) =>
                                handleFormChange(
                                  "grand_pere_paternel_date_naissance",
                                  e.target.value,
                                )
                              }
                              className="h-12 px-4 text-sm rounded-xl pr-12 border-boviclouds-gray-100"
                              disabled={loading}
                            />
                            <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="grand_pere_paternel_race"
                            className="text-sm font-normal text-black"
                          >
                            Race *
                          </Label>
                          <Select
                            value={formData.grand_pere_paternel_race}
                            onValueChange={(value) =>
                              handleFormChange(
                                "grand_pere_paternel_race",
                                value,
                              )
                            }
                          >
                            <SelectTrigger className="h-12 text-sm">
                              <SelectValue placeholder="Sélectionner une race" />
                            </SelectTrigger>
                            <SelectContent>{getRaceOptions()}</SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Paternal Grandmother */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
                        Grand-mère paternelle
                      </h4>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="grand_mere_paternelle_nni"
                            className="text-sm font-normal text-black"
                          >
                            NNI *
                          </Label>
                          <Input
                            id="grand_mere_paternelle_nni"
                            value={formData.grand_mere_paternelle_nni}
                            onChange={(e) =>
                              handleFormChange(
                                "grand_mere_paternelle_nni",
                                e.target.value,
                              )
                            }
                            className="h-12 px-4 text-sm rounded-xl border-boviclouds-gray-100"
                            placeholder="Ex: FR1234567890"
                            disabled={loading}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="grand_mere_paternelle_date_naissance"
                            className="text-sm font-normal text-black"
                          >
                            Date de naissance *
                          </Label>
                          <div className="relative">
                            <Input
                              id="grand_mere_paternelle_date_naissance"
                              type="date"
                              value={
                                formData.grand_mere_paternelle_date_naissance
                              }
                              onChange={(e) =>
                                handleFormChange(
                                  "grand_mere_paternelle_date_naissance",
                                  e.target.value,
                                )
                              }
                              className="h-12 px-4 text-sm rounded-xl pr-12 border-boviclouds-gray-100"
                              disabled={loading}
                            />
                            <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="grand_mere_paternelle_race"
                            className="text-sm font-normal text-black"
                          >
                            Race *
                          </Label>
                          <Select
                            value={formData.grand_mere_paternelle_race}
                            onValueChange={(value) =>
                              handleFormChange(
                                "grand_mere_paternelle_race",
                                value,
                              )
                            }
                          >
                            <SelectTrigger className="h-12 text-sm">
                              <SelectValue placeholder="Sélectionner une race" />
                            </SelectTrigger>
                            <SelectContent>{getRaceOptions()}</SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Complementary Information */}
            {currentStep === 5 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="text-center mb-6">
                  <Building className="w-12 h-12 mx-auto text-boviclouds-primary mb-2" />
                  <p className="text-gray-600">
                    Renseignez les informations administratives liées à cette
                    identification
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="eleveur_id"
                      className="text-sm font-normal text-black"
                    >
                      ID Éleveur *
                    </Label>
                    <Input
                      id="eleveur_id"
                      value={formData.eleveur_id}
                      onChange={(e) =>
                        handleFormChange("eleveur_id", e.target.value)
                      }
                      className="h-12 px-4 text-sm rounded-xl border-boviclouds-gray-100"
                      placeholder="Ex: eleveur-001"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="exploitation_id"
                      className="text-sm font-normal text-black"
                    >
                      ID Exploitation *
                    </Label>
                    <Input
                      id="exploitation_id"
                      value={formData.exploitation_id}
                      onChange={(e) =>
                        handleFormChange("exploitation_id", e.target.value)
                      }
                      className="h-12 px-4 text-sm rounded-xl border-boviclouds-gray-100"
                      placeholder="Ex: exploit-001"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="responsable_local_id"
                      className="text-sm font-normal text-black"
                    >
                      ID Responsable local *
                    </Label>
                    <Input
                      id="responsable_local_id"
                      value={formData.responsable_local_id}
                      onChange={(e) =>
                        handleFormChange("responsable_local_id", e.target.value)
                      }
                      className="h-12 px-4 text-sm rounded-xl border-boviclouds-gray-100"
                      placeholder="Ex: resp-001"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Review */}
            {currentStep === 6 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="text-center mb-6">
                  <Eye className="w-12 h-12 mx-auto text-boviclouds-primary mb-2" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Vérification des données
                  </h3>
                  <p className="text-gray-600">
                    Veuillez vérifier les informations saisies avant de créer
                    l'identification
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Subject Summary */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-3">Sujet</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-700">NNI:</span>
                        <span className="font-medium">
                          {formData.sujet_nni}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Type:</span>
                        <Badge variant="outline">{formData.sujet_type}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Sexe:</span>
                        <Badge variant="outline">{formData.sujet_sexe}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Race:</span>
                        <span className="font-medium">
                          {formData.sujet_race}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Images:</span>
                        <span className="font-medium">
                          {formData.images.length} photo(s)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Genealogy Summary */}
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-3">
                      Généalogie
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-green-700">Mère:</span>
                        <span className="font-medium">{formData.mere_nni}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Père:</span>
                        <span className="font-medium">{formData.pere_nni}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Grand-père M:</span>
                        <span className="font-medium">
                          {formData.grand_pere_maternel_nni}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Grand-père P:</span>
                        <span className="font-medium">
                          {formData.grand_pere_paternel_nni}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Administrative Summary */}
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 lg:col-span-2">
                    <h4 className="font-semibold text-purple-900 mb-3">
                      Informations administratives
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-purple-700">Éleveur:</span>
                        <span className="font-medium">
                          {formData.eleveur_id}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-700">Exploitation:</span>
                        <span className="font-medium">
                          {formData.exploitation_id}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-700">Responsable:</span>
                        <span className="font-medium">
                          {formData.responsable_local_id}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="mx-6 mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row justify-between gap-2 pt-4 border-t border-boviclouds-gray-50 px-6">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleModalClose}
                className="w-full sm:w-32 h-10 rounded-lg text-sm font-normal border-boviclouds-gray-300 text-boviclouds-gray-800 hover:bg-boviclouds-gray-50"
                disabled={loading}
              >
                Annuler
              </Button>

              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={loading}
                  className="w-full sm:w-32 h-10 rounded-lg text-sm font-normal border-boviclouds-gray-300 text-boviclouds-gray-800 hover:bg-boviclouds-gray-50"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Précédent
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              {currentStep < steps.length && (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={loading}
                  className="w-full sm:w-32 h-10 rounded-lg text-sm font-semibold bg-boviclouds-primary hover:bg-boviclouds-primary/90 text-white disabled:opacity-50"
                >
                  Suivant
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}

              {currentStep === steps.length && (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full sm:w-40 h-10 rounded-lg text-sm font-semibold bg-boviclouds-primary hover:bg-boviclouds-primary/90 text-white disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Check className="w-4 h-4 mr-2" />
                  )}
                  {loading ? "Création..." : "Créer l'identification"}
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default AddIdentificationModal;
