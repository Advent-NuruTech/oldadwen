// app/components/admin/EditProfile.tsx
"use client";
import { useState } from "react";
import { auth } from "../../lib/firebase";
import {
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

export default function EditProfile() {
  const [email, setEmail] = useState(auth.currentUser?.email || "");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!auth.currentUser) {
      setError("No user is currently logged in.");
      return;
    }

    if (!currentPassword) {
      setError("Please enter your current password to confirm changes.");
      return;
    }

    try {
      // Re-authenticate user with current password
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email!,
        currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);

      // Update email if it has changed
      if (email !== auth.currentUser.email) {
        await updateEmail(auth.currentUser, email);
      }

      // Update password if provided
      if (newPassword) {
        await updatePassword(auth.currentUser, newPassword);
      }

      setMessage("Profile updated successfully!");
      setNewPassword("");
      setCurrentPassword("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form
      onSubmit={handleUpdate}
      className="flex flex-col gap-3 w-80"
    >
      <h2 className="text-xl font-bold">Edit Profile</h2>

      <label>Email</label>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-2 border rounded"
      />

      <label>New Password</label>
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="p-2 border rounded"
      />

      <label>Current Password (required)</label>
      <input
        type="password"
        placeholder="Enter current password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        className="p-2 border rounded"
        required
      />

      <button
        type="submit"
        className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
      >
        Update Profile
      </button>

      {message && <p className="text-green-600">{message}</p>}
      {error && <p className="text-red-600">{error}</p>}
    </form>
  );
}
