"use client";
import { useState } from "react";
import { auth } from "../../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Copy, Check, UserPlus, AlertCircle, Mail, Key, Shield, X } from "lucide-react";

export default function AddAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const firstName = email.split("@")[0] || "Admin";

      const loginUrl = `${window.location.origin}/auth/admin/login`;

      // HTML formatted email message
      const htmlMessage = `
<p><strong>Congratulations ${firstName}!</strong></p>
<p>You have been added as an administrator for <strong>Gospel Sounders Publications and Missions</strong>.</p>
<p>Your administrator account has been created successfully.</p>
<br/>
<p><strong>Login Details:</strong></p>
<p>🔗 <strong>Login URL:</strong> <a href="${loginUrl}" style="color: #2563eb; text-decoration: underline;">${loginUrl}</a></p>
<p>📧 <strong>Email:</strong> ${email}</p>
<p>🔑 <strong>Password:</strong> ${password}</p>
<br/>
<p><strong>Important Notes:</strong></p>
<ul>
  <li>Please change your password after first login</li>
  <li>Keep your login credentials secure</li>
  <li>Contact the system administrator if you encounter any issues</li>
</ul>
<p>Welcome to the team!</p>
`;

      setMessage(htmlMessage);
      setSuccess(true);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      const errorMessages: Record<string, string> = {
        "auth/email-already-in-use": "This email is already registered",
        "auth/invalid-email": "Please enter a valid email address",
        "auth/operation-not-allowed": "Email/password accounts are not enabled",
        "auth/weak-password": "Password is too weak",
        "auth/network-request-failed": "Network error. Please check your connection",
      };
      
      setMessage(errorMessages[err.code] || "An error occurred. Please try again.");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    // Convert HTML to plain text for email clients
    const plainText = message
      .replace(/<strong>/g, "**")
      .replace(/<\/strong>/g, "**")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<ul>/gi, "")
      .replace(/<\/ul>/gi, "")
      .replace(/<li>/gi, "• ")
      .replace(/<\/li>/gi, "\n")
      .replace(/<[^>]+>/gi, "")
      .replace(/🔗/g, "→")
      .replace(/📧/g, "✉️")
      .replace(/🔑/g, "🔐");

    try {
      await navigator.clipboard.writeText(plainText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const temp = document.createElement("textarea");
      temp.value = plainText;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand("copy");
      document.body.removeChild(temp);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const generateRandomPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(password);
    setConfirmPassword(password);
  };

  const resetForm = () => {
    setSuccess(false);
    setMessage("");
    setCopied(false);
    setShowPassword(false);
  };

  return (
    <div className="max-w-md w-full mx-auto p-2">
      {!success ? (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserPlus className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Add New Admin</h2>
                <p className="text-gray-600 text-sm">Create administrator account for Gospel Sounders</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleAddAdmin} className="space-y-5">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Key className="w-4 h-4" />
                  Password
                </label>
                <button
                  type="button"
                  onClick={generateRandomPassword}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Generate Strong Password
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full p-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900 transition-colors px-2 py-1 text-sm font-medium"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full p-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
              />
            </div>

            {password && confirmPassword && password !== confirmPassword && (
              <div className="flex items-center gap-3 p-3.5 text-red-700 bg-red-50 rounded-lg border border-red-200">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">Passwords do not match</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3.5 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </span>
              ) : (
                "Add Admin Account"
              )}
            </button>

            {message && !success && (
              <div className="flex items-start gap-3 p-3.5 text-red-700 bg-red-50 rounded-lg border border-red-200">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm font-medium">{message}</span>
              </div>
            )}
          </form>
        </div>
      ) : (
        <div className="relative bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl shadow-lg p-6 border border-emerald-200">
          {/* Close tab button */}
          <button
            onClick={resetForm}
            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close success message"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-6 pr-8">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Shield className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Admin Added Successfully! 🎉</h2>
              <p className="text-gray-600 text-sm">Credentials ready to send to the new admin</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 mb-6 border border-emerald-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">Email Template (Ready to Copy)</h3>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                Copy & Paste into Email
              </span>
            </div>
            <div className="whitespace-pre-line bg-gray-50 p-4 rounded-lg border border-gray-200 font-mono text-sm text-gray-700 leading-relaxed">
              {message.replace(/<[^>]+>/g, "")}
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleCopy}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white p-3.5 rounded-lg font-semibold hover:from-emerald-600 hover:to-green-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-3 shadow-sm hover:shadow"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  Copied to Clipboard!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copy Email Template
                </>
              )}
            </button>

            <button
              onClick={resetForm}
              className="w-full bg-white text-gray-700 p-3.5 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 hover:border-gray-400 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
            >
              Add Another Admin
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
              <span className="text-lg">📋</span>
              Pro Tip
            </h4>
            <p className="text-sm text-blue-700 leading-relaxed">
              Paste the copied content directly into Gmail, Outlook, or any email client. 
              The template includes proper formatting with emojis and bullet points for easy readability.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}