"use client";

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import LoginModal from "./LoginModal";

export default function HeaderControls() {
  const { isLoggedIn, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <span
        onClick={isLoggedIn ? logout : () => setIsModalOpen(true)}
        className="cursor-pointer hover:text-[var(--primary-color)] transition-colors"
      >
        {isLoggedIn ? "Logout (Admin)" : "Login"}
      </span>

      <LoginModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}