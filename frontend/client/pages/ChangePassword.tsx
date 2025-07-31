import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "../hooks/use-toast";

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  // Get token from URL parameters
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Password validation rules
  const validatePassword = (password: string) => {
    const errors: string[] = [];
    if (password.length < 8) {
      errors.push("Le mot de passe doit contenir au moins 8 caractères");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Le mot de passe doit contenir au moins une majuscule");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Le mot de passe doit contenir au moins une minuscule");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Le mot de passe doit contenir au moins un chiffre");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Le mot de passe doit contenir au moins un caractère spécial");
    }
    return errors;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validate passwords
    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      setErrors({ password: passwordErrors[0] });
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: "Les mots de passe ne correspondent pas" });
      return;
    }
    
    if (!token) {
      toast({
        title: "Erreur",
        description: "Token manquant. Veuillez utiliser le lien envoyé par e-mail.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Make API call to change password
      // const response = await changePassword(token, formData.password);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPasswordChanged(true);
      toast({
        title: "Succès",
        description: "Votre mot de passe a été modifié avec succès.",
      });
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
      
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification du mot de passe.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Check password strength
  const getPasswordStrength = (password: string) => {
    const validationErrors = validatePassword(password);
    const strength = 5 - validationErrors.length;
    
    if (strength <= 1) return { level: "weak", color: "red", text: "Faible" };
    if (strength <= 3) return { level: "medium", color: "yellow", text: "Moyen" };
    return { level: "strong", color: "green", text: "Fort" };
  };

  const passwordStrength = formData.password ? getPasswordStrength(formData.password) : null;

  if (passwordChanged) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-boviclouds-green-light to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-poppins font-bold text-gray-900 mb-4">
              Mot de passe modifié
            </h1>
            <p className="text-gray-600 font-inter mb-6">
              Votre mot de passe a été modifié avec succès. Vous allez être redirigé vers la page de connexion.
            </p>
            <div className="animate-pulse">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-boviclouds-primary h-2 rounded-full animate-pulse" style={{ width: "100%" }}></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Redirection en cours...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-boviclouds-green-light to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F9c3f5518114a4d9c95471253796f59d3%2F53555526c6924d53896a8aecabe47366?format=webp&width=800"
            alt="Boviclouds"
            className="h-12 mx-auto mb-6"
          />
          <h1 className="text-3xl font-poppins font-bold text-gray-900 mb-2">
            Nouveau mot de passe
          </h1>
          <p className="text-gray-600 font-inter">
            Choisissez un nouveau mot de passe sécurisé pour votre compte
          </p>
          {email && (
            <p className="text-sm text-gray-500 mt-2">
              Compte : <strong>{email}</strong>
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* New Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nouveau mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={`w-full pl-11 pr-11 py-3 border rounded-lg font-inter text-sm focus:outline-none focus:ring-2 transition-colors ${
                  errors.password
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 focus:ring-boviclouds-primary"
                }`}
                placeholder="Saisissez votre nouveau mot de passe"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.password}
              </p>
            )}
            {/* Password Strength Indicator */}
            {formData.password && passwordStrength && (
              <div className="mt-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-600">Force du mot de passe :</span>
                  <span className={`text-xs font-medium text-${passwordStrength.color}-600`}>
                    {passwordStrength.text}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div
                    className={`h-1 rounded-full bg-${passwordStrength.color}-500 transition-all duration-300`}
                    style={{
                      width: passwordStrength.level === "weak" ? "33%" : 
                             passwordStrength.level === "medium" ? "66%" : "100%"
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmer le mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                className={`w-full pl-11 pr-11 py-3 border rounded-lg font-inter text-sm focus:outline-none focus:ring-2 transition-colors ${
                  errors.confirmPassword
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 focus:ring-boviclouds-primary"
                }`}
                placeholder="Confirmez votre nouveau mot de passe"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.confirmPassword}
              </p>
            )}
            {/* Password Match Indicator */}
            {formData.confirmPassword && (
              <div className="mt-1">
                {formData.password === formData.confirmPassword ? (
                  <p className="text-green-600 text-sm flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Les mots de passe correspondent
                  </p>
                ) : (
                  <p className="text-red-600 text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    Les mots de passe ne correspondent pas
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Password Requirements */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Exigences du mot de passe :
            </h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className={`flex items-center gap-2 ${formData.password.length >= 8 ? 'text-green-600' : ''}`}>
                <div className={`w-2 h-2 rounded-full ${formData.password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                Au moins 8 caractères
              </li>
              <li className={`flex items-center gap-2 ${/[A-Z]/.test(formData.password) ? 'text-green-600' : ''}`}>
                <div className={`w-2 h-2 rounded-full ${/[A-Z]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                Une lettre majuscule
              </li>
              <li className={`flex items-center gap-2 ${/[a-z]/.test(formData.password) ? 'text-green-600' : ''}`}>
                <div className={`w-2 h-2 rounded-full ${/[a-z]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                Une lettre minuscule
              </li>
              <li className={`flex items-center gap-2 ${/[0-9]/.test(formData.password) ? 'text-green-600' : ''}`}>
                <div className={`w-2 h-2 rounded-full ${/[0-9]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                Un chiffre
              </li>
              <li className={`flex items-center gap-2 ${/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'text-green-600' : ''}`}>
                <div className={`w-2 h-2 rounded-full ${/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                Un caractère spécial
              </li>
            </ul>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !formData.password || !formData.confirmPassword}
            className="w-full bg-boviclouds-primary text-white py-3 rounded-lg font-inter font-medium text-sm hover:bg-boviclouds-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Modification en cours...
              </>
            ) : (
              "Modifier le mot de passe"
            )}
          </button>

          {/* Back to Login Link */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-boviclouds-primary font-inter text-sm hover:underline"
            >
              Retour à la connexion
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
