import type { Metadata } from "next";
import { Orbitron, Roboto_Condensed } from "next/font/google";
import "./globals.css";

import Messages from "./components/Messages";
import NavBar from "./components/navBar";
import ThemeSelection from "./components/ThemeSelection";
import HeaderControls from "./components/HeaderControls";
import { AuthProvider } from "./context/AuthContext";

const orbitronSans = Orbitron({
  variable: "--font-orbitron-sans",
  subsets: ["latin"],
});

const roboto_Condensed = Roboto_Condensed({
  variable: "--font-Roboto-Condensed",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolio | Mechatronics & Software Engineer",
  description: "Modern web interfaces, full-stack systems, and autonomous robotics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${orbitronSans.variable} ${roboto_Condensed.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative w-full text-[var(--text-color-primary)] overflow-x-hidden bg-[linear-gradient(135deg,#000000_0%,#05070D_40%,#0B0F1A_75%,#000000_100%)]">
        <AuthProvider>
          {/* 1. COMPOSITE BACKGROUND LAYER (Persists across all pages) */}
          <div className="layer absolute w-full h-full inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,#0A0F1F_0%,#000000_100%)] opacity-100" />

          {/* 2. GLOBAL HEADER */}
          <header className="relative w-full h-1/16 top-px left-0 z-40 px-8 pt-6 flex items-center justify-between pointer-events-auto">
            <div className="relative flex items-center gap-4">
              <Messages />
            </div>

            <NavBar />

            <div className="flex relative items-center gap-6 z-50">
              <HeaderControls />
              <ThemeSelection />
            </div>
          </header>

          {/* 3. DYNAMIC PAGE CONTENT */}
          <main className="relative z-10 flex-1">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}