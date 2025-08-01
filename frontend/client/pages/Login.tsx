import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import RegistrationForm from "../components/RegistrationForm";
import { useToast } from "../hooks/use-toast";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("jhondoe@gmail.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);
  const [forgotPasswordEmailError, setForgotPasswordEmailError] = useState("");
  const [showRegistration, setShowRegistration] = useState(false);
  const [accountRequestSent, setAccountRequestSent] = useState(false);
  const navigate = useNavigate();
  const { login, isLoading, isAuthenticated, register } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return "L'email est requis";
    }
    if (!emailRegex.test(email)) {
      return "Veuillez saisir une adresse email valide";
    }
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) {
      return "Le mot de passe est requis";
    }
    if (password.length < 6) {
      return "Le mot de passe doit contenir au moins 6 caractères";
    }
    return "";
  };

  const validateForm = () => {
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);

    setEmailError(emailErr);
    setPasswordError(passwordErr);

    const isValid = !emailErr && !passwordErr;
    return isValid;
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setError("");
    if (emailError) {
      setEmailError(validateEmail(value));
    }
  };
  const handleCloseSuccessMessage = () => {
    setAccountRequestSent(false);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setError("");
    if (passwordError) {
      setPasswordError(validatePassword(value));
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      const success = await login(email, password, keepLoggedIn);
      if (success) {
        navigate("/", { replace: true });
      } else {
        setError("Email ou mot de passe invalide. Veuillez réessayer.");
      }
    } catch (err) {
      setError(
        "Une erreur s'est produite lors de la connexion. Veuillez réessayer.",
      );
    }
  };

  const handleRequestAccount = () => {
    setShowRegistration(true);
  };

  const handleRegistrationBack = () => {
    setShowRegistration(false);
  };

  const handleRegistrationComplete = (status: boolean) => {
    // Here you would typically send the data to your API
    // For now, just show a success message and go back to login
    if (status) {
      setAccountRequestSent(true);
      setShowRegistration(false);
      setError("");
    } else {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'envoi de la demande",
      });
      setError("Erreur lors de l'envoi de la demande");
    }
    // You could show a success message here
  };

  const handleForgotPassword = async () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const emailValidationError = validateEmail(forgotPasswordEmail);
    if (emailValidationError) {
      setForgotPasswordEmailError(emailValidationError);
      return;
    }

    // Clear any previous errors
    setForgotPasswordEmailError("");

    const res = await axios.post(`${apiUrl}users/forgot-password`, {
      email: forgotPasswordEmail,
    });
    setForgotPasswordSent(true);
  };

  const handleForgotPasswordEmailChange = (value: string) => {
    setForgotPasswordEmail(value);
    if (forgotPasswordEmailError) {
      setForgotPasswordEmailError(validateEmail(value));
    }
  };

  const resetForgotPasswordModal = () => {
    setShowForgotPassword(false);
    setForgotPasswordEmail("");
    setForgotPasswordSent(false);
    setForgotPasswordEmailError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      {/* Compact Split Card */}
      <div
        className={`bg-white rounded-2xl shadow-xl w-full max-w-4xl flex overflow-hidden ${
          showRegistration ? "max-h-[90vh] min-h-[600px]" : "h-[700px]"
        }`}
      >
        {/* Left Panel - Login/Registration Form */}
        <div
          className={`flex-1 p-8 flex flex-col relative ${
            showRegistration
              ? "overflow-y-auto justify-start pt-6"
              : "overflow-hidden justify-center"
          }`}
        >
          {/* Logo */}
          <div className={`text-center ${showRegistration ? "mb-6" : "mb-8"}`}>
            <div className="inline-flex items-center justify-center mb-4">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fef086fb3af634f3aac577b85a6876642%2Fac45bd6de4fb4237917d13b8b391636c?format=webp&width=800"
                alt="BoviClouds Logo"
                className="h-12 object-contain"
              />
            </div>
          </div>

          {/* Form Container */}
          <div className="w-full max-w-sm mx-auto relative">
            {/* Login Form */}
            <div
              className={`transform transition-all duration-500 ease-in-out ${
                showRegistration
                  ? "-translate-x-full opacity-0 pointer-events-none absolute inset-0"
                  : "translate-x-0 opacity-100"
              }`}
            >
              {/* Header Text */}
              <div className="text-center mb-6">
                <h1 className="heading-2 mb-2">Bienvenue</h1>
                <p className="body-base text-[#969696]">
                  Veuillez vous connecter à votre compte
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                  <p className="message-error">{error}</p>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email Input */}
                <div className="relative">
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      onBlur={() => setEmailError(validateEmail(email))}
                      className={`w-full px-4 py-3 border-[1.5px] rounded-lg body-base text-[#232323] focus:outline-none transition-colors ${
                        emailError
                          ? "border-red-500 focus:border-red-500"
                          : "border-boviclouds-primary focus:border-boviclouds-primary"
                      }`}
                      required
                    />
                    <div className="absolute -top-2.5 left-4 bg-white px-1">
                      <span
                        className={`label-base ${
                          emailError
                            ? "text-red-500"
                            : "text-boviclouds-primary"
                        }`}
                      >
                        Email
                      </span>
                    </div>
                  </div>
                  {emailError && (
                    <p className="text-red-500 text-sm font-inter mt-1 ml-1">
                      {emailError}
                    </p>
                  )}
                </div>

                {/* Password Input */}
                <div className="relative">
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Mot de passe"
                      value={password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      onBlur={() =>
                        setPasswordError(validatePassword(password))
                      }
                      className={`w-full px-4 py-3 pr-11 border rounded-lg body-base text-[#232323] placeholder-[#9A9A9A] focus:outline-none transition-colors ${
                        passwordError
                          ? "border-red-500 focus:border-red-500"
                          : "border-[#D9D9D9] focus:border-boviclouds-primary"
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#9A9A9A] hover:text-boviclouds-primary transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {showPassword ? (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        ) : (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                          />
                        )}
                      </svg>
                    </button>
                  </div>
                  {passwordError && (
                    <p className="text-red-500 text-sm font-inter mt-1 ml-1">
                      {passwordError}
                    </p>
                  )}
                </div>

                {/* Keep Logged In */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setKeepLoggedIn(!keepLoggedIn)}
                    className="flex items-center justify-center w-5 h-5 border-2 border-black rounded-sm hover:border-boviclouds-primary transition-all duration-200 transform hover:scale-105"
                  >
                    {keepLoggedIn && (
                      <svg
                        className="w-3 h-3 text-boviclouds-primary"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                  <label className="label-base text-[#232323]">
                    Rester connecté
                  </label>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-boviclouds-primary text-white py-3 px-4 rounded-lg button-base hover:bg-boviclouds-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading && (
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  )}
                  {isLoading ? "Connexion en cours..." : "Se connecter"}
                </button>

                {/* Divider */}
                <div className="flex items-center justify-center py-4">
                  <div className="flex-1 h-px bg-[#D9D9D9]"></div>
                  <span className="px-4 body-small text-[#6E6E6E]">ou</span>
                  <div className="flex-1 h-px bg-[#D9D9D9]"></div>
                </div>

                {/* Request Account Button */}
                <button
                  type="button"
                  onClick={handleRequestAccount}
                  className="w-full bg-white border border-[#E6E8E7] text-[#232323] py-3 px-4 rounded-lg button-base hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-3"
                >
                  <span>Demander un compte</span>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                </button>
              </form>

              {/* Forgot Password Link */}
              <div className="text-center mt-6">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="body-base text-boviclouds-primary font-medium hover:underline transition-colors"
                >
                  Mot de passe oublié ?
                </button>
              </div>
            </div>

            {/* Registration Form */}
            <div
              className={`transform transition-all duration-500 ease-in-out ${
                showRegistration
                  ? "translate-x-0 opacity-100"
                  : "translate-x-full opacity-0 pointer-events-none absolute inset-0"
              }`}
            >
              {showRegistration && (
                <RegistrationForm
                  onBack={handleRegistrationBack}
                  onComplete={handleRegistrationComplete}
                />
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Image */}
        <div className="hidden md:block md:w-1/2 relative">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F2f6168451509403aaa6b0174d42daa8e%2Fd688b20a6f55463cad20c4fa572b2583?format=webp&width=800"
            alt="Pastoral farm scene with cows grazing"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/5"></div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 transform animate-slideUp">
            <div className="text-center">
              <h3 className="text-xl font-poppins font-semibold text-gray-900 mb-2">
                Réinitialiser le mot de passe
              </h3>
              {!forgotPasswordSent ? (
                <>
                  <p className="text-gray-600 font-inter text-sm mb-4">
                    Saisissez votre adresse e-mail et nous vous enverrons un
                    lien pour réinitialiser votre mot de passe.
                  </p>
                  <input
                    type="email"
                    placeholder="Saisissez votre e-mail"
                    value={forgotPasswordEmail}
                    onChange={(e) =>
                      handleForgotPasswordEmailChange(e.target.value)
                    }
                    className={`w-full px-4 py-3 border rounded-lg font-inter text-sm focus:outline-none transition-colors ${
                      forgotPasswordEmailError
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-300 focus:border-boviclouds-primary"
                    } ${forgotPasswordEmailError ? "mb-2" : "mb-4"}`}
                  />
                  {forgotPasswordEmailError && (
                    <p className="text-red-600 text-sm mb-4 flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {forgotPasswordEmailError}
                    </p>
                  )}
                  <div className="flex gap-3">
                    <button
                      onClick={resetForgotPasswordModal}
                      className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg font-inter text-sm hover:bg-gray-50 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleForgotPassword}
                      disabled={
                        !forgotPasswordEmail || !!forgotPasswordEmailError
                      }
                      className="flex-1 px-4 py-2 bg-boviclouds-primary text-white rounded-lg font-inter text-sm hover:bg-boviclouds-primary/90 transition-colors disabled:opacity-50"
                    >
                      Envoyer le lien
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    E-mail envoyé avec succès !
                  </h4>
                  <p className="text-gray-600 font-inter text-sm mb-4">
                    Un lien de réinitialisation a été envoyé à{" "}
                    <strong>{forgotPasswordEmail}</strong>. Vérifiez votre boîte
                    de réception et suivez les instructions pour créer un
                    nouveau mot de passe.
                  </p>
                  <p className="text-gray-500 font-inter text-xs mb-4">
                    Si vous ne recevez pas l'e-mail dans les prochaines minutes,
                    vérifiez votre dossier spam.
                  </p>
                  <button
                    onClick={resetForgotPasswordModal}
                    className="w-full px-4 py-2 bg-boviclouds-primary text-white rounded-lg font-inter text-sm hover:bg-boviclouds-primary/90 transition-colors"
                  >
                    Fermer
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {accountRequestSent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 transform animate-slideUp">
            <div className="text-center">
              {/* Success Icon */}
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              {/* Title */}
              <h3 className="text-xl font-poppins font-semibold text-gray-900 mb-3">
                Demande de compte envoyée
              </h3>

              {/* Message */}
              <div className="text-gray-600 font-inter text-sm mb-6 space-y-2">
                <p className="leading-relaxed">
                  Votre demande de compte a été envoyée avec succès à
                  l'administration.
                </p>
                <p className="leading-relaxed">
                  Vous devrez attendre l'approbation de votre compte.
                  <strong className="text-gray-800">
                    {" "}
                    Veuillez vérifier votre email
                  </strong>{" "}
                  pour les mises à jour sur le statut de votre demande.
                </p>
                <p className="text-sm text-gray-500 mt-3">
                  Vous recevrez une notification par email une fois votre compte
                  approuvé.
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={handleCloseSuccessMessage}
                className="w-full px-4 py-3 bg-boviclouds-primary text-white rounded-lg font-inter text-sm font-medium hover:bg-boviclouds-primary/90 transition-colors"
              >
                Compris
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
