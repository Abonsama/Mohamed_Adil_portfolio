"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function MobileMenuToggle({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Auto-close the panel whenever the route changes, so navigating
  // to Home/Skills/Projects doesn't leave the menu hanging open.
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        className="flex items-center justify-center w-10 h-10 rounded-full border border-[var(--primary-color)] text-[var(--primary-color)] transition-transform active:scale-95"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {isOpen && (
        <div className="fixed inset-x-4 top-20 z-40 flex flex-col gap-5 p-5 bg-black/95 backdrop-blur-md border border-[var(--primary-color)] rounded-2xl shadow-2xl animate-[fade-in-down_0.3s_ease-out]">
          {children}
        </div>
      )}
    </div>
  );
}