import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/use-toast";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RegistrationFormData {
  // Step 1: Personal Information
  cin: string;
  prenom: string;
  nomFamille: string;
  nomArabe: string;
  prenomArabe: string;
  civilite: string;
  telephone: string;

  // Step 2: Address Information
  adresse: string;
  region: string;
  province: string;

  // Step 3: Account Information
  email: string;
  motDePasse: string;
  confirmerMotDePasse: string;
}

interface RegistrationFormProps {
  onBack: () => void;
  onComplete: (status: boolean) => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onBack,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [formData, setFormData] = useState<RegistrationFormData>({
    cin: "",
    prenom: "",
    nomFamille: "",
    nomArabe: "",
    prenomArabe: "",
    telephone: "",
    civilite: "",
    adresse: "",
    region: "",
    province: "",
    email: "",
    motDePasse: "",
    confirmerMotDePasse: "",
  });

  const [errors, setErrors] = useState<Partial<RegistrationFormData>>({});
  const { register } = useAuth();

  const { toast } = useToast();

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<RegistrationFormData> = {};

    if (step === 1) {
      if (!formData.cin.trim()) newErrors.cin = "CIN est requis";
      if (!formData.prenom.trim()) newErrors.prenom = "Prénom est requis";
      if (!formData.nomFamille.trim())
        newErrors.nomFamille = "Nom de famille est requis";
      if (!formData.nomArabe.trim()) newErrors.nomArabe = "الا��م الشخصي مطلوب";
      if (!formData.prenomArabe.trim())
        newErrors.prenomArabe = "الاسم العائلي مطلوب";
      if (!formData.civilite.trim())
        newErrors.civilite = "Civilité est requise";
    } else if (step === 2) {
      if (!formData.adresse.trim()) newErrors.adresse = "Adresse est requise";
      if (!formData.region.trim()) newErrors.region = "Région est requise";
      if (!formData.province.trim())
        newErrors.province = "Province est requise";
    } else if (step === 3) {
      if (!formData.email.trim()) newErrors.email = "Email est requis";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Email invalide";
      }
      if (!formData.motDePasse.trim())
        newErrors.motDePasse = "Mot de passe est requis";
      else if (formData.motDePasse.length < 6) {
        newErrors.motDePasse =
          "Le mot de passe doit contenir au moins 6 caractères";
      }
      if (!formData.confirmerMotDePasse.trim()) {
        newErrors.confirmerMotDePasse =
          "Confirmation du mot de passe est requise";
      } else if (formData.motDePasse !== formData.confirmerMotDePasse) {
        newErrors.confirmerMotDePasse =
          "Les mots de passe ne correspondent pas";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentStep(currentStep + 1);
          setIsTransitioning(false);
        }, 200);
      } else {
        setIsCreatingAccount(true);
        const res = await register(formData);
        const result = Boolean(res);
        if (result) {
          onComplete(Boolean(res));
        } else {
          toast({
            title: "Error",
            description: "Error while sending request",
          });
        }

        setIsCreatingAccount(false); // Simulate API call
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsTransitioning(false);
      }, 200);
    } else {
      onBack();
    }
  };

  const handleInputChange = (
    field: keyof RegistrationFormData,
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const renderFormField = (
    field: keyof RegistrationFormData,
    label: string,
    type: string = "text",
    placeholder?: string,
    isArabic: boolean = false,
  ) => {
    const hasValue = formData[field].trim() !== "";
    const borderColor = errors[field]
      ? "border-red-500 focus:border-red-500"
      : hasValue
        ? "border-boviclouds-primary focus:border-boviclouds-primary"
        : "border-[#D9D9D9] focus:border-boviclouds-primary";

    return (
      <div className="relative">
        <div className="relative">
          <input
            type={type}
            value={formData[field]}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className={`w-full px-4 py-3 border-[1.5px] rounded-lg body-base text-[#232323] focus:outline-none transition-colors ${
              borderColor
            } ${isArabic ? "text-right" : ""}`}
            placeholder={placeholder}
            dir={isArabic ? "rtl" : "ltr"}
            required
          />
          <div
            className={`absolute -top-2.5 ${isArabic ? "right-4" : "left-4"} bg-white px-1`}
          >
            <span
              className={`label-base ${
                errors[field]
                  ? "text-red-500"
                  : hasValue
                    ? "text-boviclouds-primary"
                    : "text-gray-400"
              }`}
            >
              {label}
            </span>
          </div>
        </div>
        {errors[field] && (
          <p
            className={`text-red-500 text-sm font-inter mt-1 ${isArabic ? "mr-1" : "ml-1"}`}
          >
            {errors[field]}
          </p>
        )}
      </div>
    );
  };

  const renderSelectField = (
    field: keyof RegistrationFormData,
    label: string,
    options: { value: string; label: string }[],
  ) => {
    const hasValue = formData[field].trim() !== "";
    const borderColor = errors[field]
      ? "border-red-500 focus:border-red-500"
      : hasValue
        ? "border-boviclouds-primary focus:border-boviclouds-primary"
        : "border-[#D9D9D9] focus:border-boviclouds-primary";

    return (
      <div className="relative">
        <div className="relative">
          <Select
            value={formData[field]}
            onValueChange={(value) => handleInputChange(field, value)}
          >
            <SelectTrigger className={`w-full border-[1.5px] ${borderColor}`}>
              <SelectValue
                placeholder={`Sélectionner ${label.toLowerCase()}`}
              />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="absolute -top-2.5 left-4 bg-white px-1">
            <span
              className={`label-base ${
                errors[field]
                  ? "text-red-500"
                  : hasValue
                    ? "text-boviclouds-primary"
                    : "text-gray-400"
              }`}
            >
              {label}
            </span>
          </div>
        </div>
        {errors[field] && (
          <p className="text-red-500 text-sm font-inter mt-1 ml-1">
            {errors[field]}
          </p>
        )}
      </div>
    );
  };

  const civiliteOptions = [
    { value: "M", label: "Monsieur" },
    { value: "Mme", label: "Madame" },
    { value: "Mlle", label: "Mademoiselle" },
  ];

  const regionOptions = [
    { value: "casablanca-settat", label: "Casablanca-Settat" },
    { value: "rabat-sale-kenitra", label: "Rabat-Salé-Kénitra" },
    { value: "fes-meknes", label: "Fès-Meknès" },
    { value: "marrakech-safi", label: "Marrakech-Safi" },
    { value: "oriental", label: "Oriental" },
    { value: "tanger-tetouan-al-hoceima", label: "Tanger-Tétouan-Al Hoceïma" },
    { value: "souss-massa", label: "Souss-Massa" },
    { value: "draa-tafilalet", label: "Drâa-Tafilalet" },
    { value: "beni-mellal-khenifra", label: "Béni Mellal-Khénifra" },
    { value: "grand-casablanca", label: "Grand Casablanca" },
    { value: "laayoune-sakia-el-hamra", label: "Laâyoune-Sakia El Hamra" },
    { value: "dakhla-oued-ed-dahab", label: "Dakhla-Oued Ed-Dahab" },
  ];

  const provinceOptions = [
    { value: "casablanca", label: "Casablanca" },
    { value: "rabat", label: "Rabat" },
    { value: "fes", label: "Fès" },
    { value: "marrakech", label: "Marrakech" },
    { value: "agadir", label: "Agadir" },
    { value: "tanger", label: "Tanger" },
    { value: "meknes", label: "Meknès" },
    { value: "oujda", label: "Oujda" },
    { value: "kenitra", label: "Kénitra" },
    { value: "tetouan", label: "Tétouan" },
  ];

  const renderStep = () => {
    const stepContent = (() => {
      switch (currentStep) {
        case 1:
          return (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="heading-2 mb-2">Informations personnelles</h2>
                <p className="body-base text-[#969696]">
                  Étape 1 sur 3 - Vos informations de base
                </p>
              </div>
              {renderFormField("cin", "CIN", "text", "Numéro de CIN")}
              {renderFormField("prenom", "Prénom", "text", "Votre prénom")}
              {renderFormField(
                "nomFamille",
                "Nom de famille",
                "text",
                "Votre nom de famille",
              )}
              {renderFormField(
                "prenomArabe",
                "الاسم الشخصي",
                "text",
                "اسمك الشخصي",
                true,
              )}
              {renderFormField(
                "nomArabe",
                "الاسم العائلي",
                "text",
                "اسمك العائلي",
                true,
              )}
              {renderSelectField("civilite", "Civilité", civiliteOptions)}
              {renderFormField(
                "telephone",
                "Numéro de télephone",
                "text",
                "Numéro de télephone",
              )}
            </div>
          );
        case 2:
          return (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="heading-2 mb-2">Informations d'adresse</h2>
                <p className="body-base text-[#969696]">
                  Étape 2 sur 3 - Votre localisation
                </p>
              </div>
              {renderFormField(
                "adresse",
                "Adresse",
                "text",
                "Votre adresse complète",
              )}
              {renderSelectField("region", "Région", regionOptions)}
              {renderSelectField("province", "Province", provinceOptions)}
            </div>
          );
        case 3:
          return (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="heading-2 mb-2">Informations de compte</h2>
                <p className="body-base text-[#969696]">
                  Étape 3 sur 3 - Création de votre compte
                </p>
              </div>
              {renderFormField(
                "email",
                "Email",
                "email",
                "votre.email@exemple.com",
              )}
              {renderFormField(
                "motDePasse",
                "Mot de passe",
                "password",
                "Votre mot de passe",
              )}
              {renderFormField(
                "confirmerMotDePasse",
                "Confirmer le mot de passe",
                "password",
                "Confirmez votre mot de passe",
              )}
            </div>
          );
        default:
          return null;
      }
    })();

    return (
      <div
        className={`transform transition-all duration-500 ease-in-out ${
          isTransitioning
            ? "opacity-0 translate-x-4"
            : "opacity-100 translate-x-0"
        }`}
      >
        {stepContent}
      </div>
    );
  };

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col min-h-full py-4">
      {/* Progress indicator */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                step <= currentStep
                  ? "bg-boviclouds-primary text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {step}
            </div>
            {step < 3 && (
              <div
                className={`w-12 h-1 mx-2 transition-colors ${
                  step < currentStep ? "bg-boviclouds-primary" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Form content */}
      <div className="flex-1">{renderStep()}</div>

      {/* Navigation buttons */}
      <div className="flex gap-3 mt-6 pt-4">
        <button
          type="button"
          onClick={handlePrevious}
          className="flex-1 px-4 py-3 text-gray-600 border border-gray-300 rounded-lg button-base hover:bg-gray-50 transition-colors font-medium"
        >
          {currentStep === 1 ? "Retour" : "Précédent"}
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={isTransitioning || isCreatingAccount}
          className="flex-1 px-4 py-3 bg-boviclouds-primary text-white rounded-lg button-base hover:bg-boviclouds-primary/90 transition-colors font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isTransitioning ? (
            <div className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Suivant...</span>
            </div>
          ) : isCreatingAccount ? (
            <div className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Création du compte...</span>
            </div>
          ) : currentStep === 3 ? (
            "Créer le compte"
          ) : (
            "Suivant"
          )}
        </button>
      </div>
    </div>
  );
};

export default RegistrationForm;
