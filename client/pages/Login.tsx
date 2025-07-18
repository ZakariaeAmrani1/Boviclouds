import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

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
  const navigate = useNavigate();
  const { login, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return "Email is required";
    }
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) {
      return "Password is required";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters";
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
        setError("Invalid email or password. Please try again.");
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.");
    }
  };

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
  };

  const handleForgotPassword = async () => {
    if (!forgotPasswordEmail || !validateEmail(forgotPasswordEmail)) {
      return;
    }

    setTimeout(() => {
      setForgotPasswordSent(true);
    }, 1000);
  };

  const resetForgotPasswordModal = () => {
    setShowForgotPassword(false);
    setForgotPasswordEmail("");
    setForgotPasswordSent(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      {/* Compact Split Card */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl h-[600px] flex overflow-hidden">
        {/* Left Panel - Login Form */}
        <div className="flex-1 p-8 flex flex-col justify-center">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-boviclouds-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="text-2xl font-poppins font-semibold text-gray-900">
                boviclouds
              </span>
            </div>
          </div>

          {/* Form Container */}
          <div className="w-full max-w-sm mx-auto">
            {/* Header Text */}
            <div className="text-center mb-6">
              <h1 className="heading-2 mb-2">Welcome back</h1>
              <p className="body-base text-[#969696]">
                Please sign in to your account
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
                        emailError ? "text-red-500" : "text-boviclouds-primary"
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
                    placeholder="Password"
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    onBlur={() => setPasswordError(validatePassword(password))}
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
                  Keep me logged in
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
                {isLoading ? "Signing in..." : "Sign in"}
              </button>

              {/* Divider */}
              <div className="flex items-center justify-center py-4">
                <div className="flex-1 h-px bg-[#D9D9D9]"></div>
                <span className="px-4 body-small text-[#6E6E6E]">or</span>
                <div className="flex-1 h-px bg-[#D9D9D9]"></div>
              </div>

              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full bg-white border border-[#E6E8E7] text-[#232323] py-3 px-4 rounded-lg button-base hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-3"
              >
                <span>Sign in with Google</span>
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M20.16 12.1932C20.16 11.5905 20.1059 11.011 20.0055 10.4546H12V13.7425H16.5746C16.3775 14.8051 15.7786 15.7053 14.8784 16.308V18.4407H17.6255C19.2327 16.961 20.16 14.7819 20.16 12.1932Z"
                    fill="#4285F4"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 20.5C14.295 20.5 16.2191 19.7389 17.6254 18.4407L14.8784 16.3079C14.1173 16.8179 13.1436 17.1193 12 17.1193C9.78611 17.1193 7.91224 15.6241 7.24383 13.615H4.40405V15.8173C5.80269 18.5952 8.67724 20.5 12 20.5Z"
                    fill="#34A853"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.24387 13.615C7.07387 13.105 6.97728 12.5602 6.97728 12C6.97728 11.4398 7.07387 10.895 7.24387 10.385V8.18274H4.40409C3.82841 9.33024 3.5 10.6284 3.5 12C3.5 13.3716 3.82841 14.6698 4.40409 15.8173L7.24387 13.615Z"
                    fill="#FBBC05"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 6.88069C13.2479 6.88069 14.3684 7.30955 15.2493 8.15183L17.6873 5.71387C16.2152 4.34227 14.2911 3.5 12 3.5C8.67724 3.5 5.80269 5.40478 4.40405 8.18273L7.24383 10.385C7.91224 8.37592 9.78611 6.88069 12 6.88069Z"
                    fill="#EA4335"
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
                Forgot your password?
              </button>
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
                Reset Password
              </h3>
              {!forgotPasswordSent ? (
                <>
                  <p className="text-gray-600 font-inter text-sm mb-4">
                    Enter your email address and we'll send you a link to reset
                    your password.
                  </p>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg font-inter text-sm focus:outline-none focus:border-boviclouds-primary mb-4"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={resetForgotPasswordModal}
                      className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg font-inter text-sm hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleForgotPassword}
                      disabled={!forgotPasswordEmail}
                      className="flex-1 px-4 py-2 bg-boviclouds-primary text-white rounded-lg font-inter text-sm hover:bg-boviclouds-primary/90 transition-colors disabled:opacity-50"
                    >
                      Send Reset Link
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
                  <p className="text-gray-600 font-inter text-sm mb-4">
                    Reset link sent to <strong>{forgotPasswordEmail}</strong>
                  </p>
                  <button
                    onClick={resetForgotPasswordModal}
                    className="w-full px-4 py-2 bg-boviclouds-primary text-white rounded-lg font-inter text-sm hover:bg-boviclouds-primary/90 transition-colors"
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
