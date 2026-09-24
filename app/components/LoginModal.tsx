"use client";

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { verifyPassword } from "@/app/actions/auth";

export default function LoginModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { login } = useAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const isValid = await verifyPassword(password);

    if (isValid) {
      login(); // Updates global AuthContext state to true
      setPassword("");
      onClose();
    } else {
      setError(true);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-sm p-6 bg-black/90 border border-[var(--primary-color)] rounded-2xl shadow-2xl flex flex-col gap-4">
        <h2 className="text-xl font-bold text-white tracking-wide">
          Admin Authentication
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <input
              type="password"
              placeholder="Enter Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-black/50 border border-white/20 rounded-xl text-white font-mono focus:outline-none focus:border-[var(--primary-color)]"
              required
            />
            {error && (
              <p className="text-red-400 text-xs mt-1">
                Incorrect password. Access denied.
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm font-bold bg-[var(--primary-color)] text-black rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}