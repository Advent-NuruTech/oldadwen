"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Mail, Lock, Shield, AlertCircle, Eye, EyeOff } from "lucide-react";

export default function AdminSignup() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [setupKey, setSetupKey] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Change this to your secret key (important)
  const ADMIN_SETUP_KEY = "GOSPEL_ADMIN_2026";

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!email || !password || !confirmPassword || !setupKey) {
        throw new Error("All fields are required");
      }

      if (setupKey !== ADMIN_SETUP_KEY) {
        throw new Error("Invalid setup key");
      }

      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      // 1. Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // 2. Save admin role in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email,
        role: "admin",
        createdAt: new Date(),
      });

      // 3. Redirect to admin dashboard
      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-6">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">

        <h1 className="text-2xl font-bold text-center mb-2">
          Create First Admin
        </h1>
        <p className="text-gray-500 text-center mb-6">
          Secure setup for system administrator
        </p>

        <form onSubmit={handleSignup} className="space-y-4">

          {/* Email */}
          <div>
            <label className="text-sm flex items-center gap-2 mb-1">
              <Mail className="w-4 h-4" /> Email
            </label>
            <input
              type="email"
              className="w-full border p-3 rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm flex items-center gap-2 mb-1">
              <Lock className="w-4 h-4" /> Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full border p-3 rounded-lg pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full border p-3 rounded-lg"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {/* Setup Key */}
          <div>
            <label className="text-sm flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4" /> Setup Key
            </label>
            <input
              type="text"
              placeholder="Enter admin setup key"
              className="w-full border p-3 rounded-lg"
              value={setupKey}
              onChange={(e) => setSetupKey(e.target.value)}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold"
          >
            {loading ? "Creating Admin..." : "Create Admin"}
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-6">
          This page should be removed after first setup.
        </p>
      </div>
    </div>
  );
}