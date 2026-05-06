"use client";

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  // Check system preference for dark mode
  useEffect(() => {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(isDark);
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem("admin-theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    }
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("admin-theme", newTheme ? "dark" : "light");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Client-side validation
    if (!email || !password) {
      setError("Please enter both email and password");
      setLoading(false);
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      // Save remember me preference
      if (rememberMe) {
        localStorage.setItem("remembered-email", email);
      } else {
        localStorage.removeItem("remembered-email");
      }
      
      router.push("/admin");
    } catch (err: any) {
      // User-friendly error messages (no Firebase technical details)
      const errorMessages: Record<string, string> = {
        "auth/invalid-credential": "Invalid email or password. Please check your credentials.",
        "auth/user-not-found": "No account found with this email address.",
        "auth/wrong-password": "Incorrect password. Please try again.",
        "auth/too-many-requests": "Too many failed attempts. Please try again later.",
        "auth/network-request-failed": "Network error. Please check your connection.",
        "auth/user-disabled": "This account has been disabled. Contact the administrator.",
        "auth/invalid-email": "Please enter a valid email address.",
      };
      
      setError(errorMessages[err.code] || "Login failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Load remembered email on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("remembered-email");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className={`min-h-screen flex flex-col md:flex-row ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-gray-100'}`}>
      {/* Left Panel - Welcome/Info */}
      <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center">
        <div className="max-w-md w-full">
          {/* Logo Section */}
          <div className="mb-8 text-center">
            <div className="relative w-48 h-48 mx-auto mb-6">
              <Image
                src="/images/logo.jpeg"
                alt="Old SDA Logo"
                fill
                className="object-contain rounded-full shadow-lg"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
            <h1 className={`text-3xl md:text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2`}>
              Old SDA Organization
            </h1>
            <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Restoring the Old Adventism
            </p>
          </div>

          {/* Features List */}
          <div className={`mt-8 p-6 rounded-xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-white/50 backdrop-blur-sm'} shadow-sm`}>
            <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
              Admin Dashboard Features:
            </h2>
            <ul className="space-y-3">
              {[
               
                "Process prayer requests",
                "Create and edit blog posts",
                "Upload and edit Sabbath School lessons",
                
                "Add new administrators"
              ].map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle className={`w-5 h-5 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} />
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className={`md:w-1/2 p-6 md:p-12 flex items-center justify-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="w-full max-w-md">
          {/* Theme Toggle */}
          <div className="flex justify-end mb-6">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-100 text-gray-600'}`}
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? "🌙" : "☀️"}
            </button>
          </div>

          {/* Login Header */}
          <div className="mb-8">
            <h2 className={`text-2xl md:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2`}>
              Administrator Login
            </h2>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
              Sign in to access the admin dashboard
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full p-3.5 pl-10 rounded-lg border transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500 focus:ring-yellow-500/20' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20'
                  } focus:outline-none focus:ring-2`}
                  required
                  disabled={loading}
                />
                <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={`flex items-center gap-2 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <Lock className="w-4 h-4" />
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`text-sm ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  {showPassword ? (
                    <span className="flex items-center gap-1">
                      <EyeOff className="w-4 h-4" /> Hide
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" /> Show
                    </span>
                  )}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full p-3.5 pl-10 pr-12 rounded-lg border transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500 focus:ring-yellow-500/20' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20'
                  } focus:outline-none focus:ring-2`}
                  required
                  disabled={loading}
                />
                <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled={loading}
                />
                <span className={isDarkMode ? 'text-gray-300 text-sm' : 'text-gray-600 text-sm'}>
                  Remember me
                </span>
              </label>
              <button
                type="button"
                onClick={() => setError("Please contact the system administrator for password reset")}
                className={`text-sm font-medium ${isDarkMode ? 'text-yellow-400 hover:text-yellow-300' : 'text-blue-600 hover:text-blue-700'}`}
                disabled={loading}
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full p-3.5 rounded-lg font-semibold transition-all duration-200 ${
                loading 
                  ? 'opacity-70 cursor-not-allowed' 
                  : 'hover:shadow-lg transform hover:-translate-y-0.5'
              } ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-yellow-600 to-amber-600 text-white hover:from-yellow-700 hover:to-amber-700' 
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className={`w-5 h-5 border-2 ${isDarkMode ? 'border-white' : 'border-white'} border-t-transparent rounded-full animate-spin`}></div>
                  Signing in...
                </span>
              ) : (
                "Sign In to Dashboard"
              )}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className={`mt-6 p-4 rounded-lg border ${isDarkMode ? 'bg-red-900/20 border-red-800 text-red-300' : 'bg-red-50 border-red-200 text-red-700'}`}>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Unable to Sign In</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div className={`mt-8 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'} border text-center`}>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              🔒 Secure admin access. For assistance, contact the system administrator.
            </p>
          </div>

          {/* Footer Note */}
          <div className="mt-6 text-center">
            <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              © {new Date().getFullYear()} Old SDA Organization. All rights reserved.
              <br />
              All administrative activities are logged for security purposes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}