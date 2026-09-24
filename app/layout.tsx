import type { Metadata } from "next";
import { Orbitron, Roboto_Condensed } from "next/font/google";
import "./globals.css";

import Messages from "./components/Messages";
import NavBar from "./components/navBar";
import ThemeSelection from "./components/ThemeSelection";
import HeaderControls from "./components/HeaderControls";
import MobileMenuToggle from "./components/Mobilemenutoggle";
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
          <header className="relative w-full z-40 px-4 sm:px-8 py-4 pointer-events-auto">
            {/* Desktop / tablet — original 3-column row, untouched */}
            <div className="hidden md:flex items-center justify-between">
              <div className="relative flex items-center gap-4">
                <Messages />
              </div>

              <NavBar />

              <div className="flex relative items-center gap-6 z-50">
                <HeaderControls />
                <ThemeSelection />
              </div>
            </div>

            {/* Mobile — compact row + hamburger drop-down */}
            <div className="flex md:hidden items-center justify-between">
              <Messages />

              <MobileMenuToggle>
                <NavBar />
                {/* Login + Theme share one row so the panel doesn't stack
                    into a tall, crowded column. justify-between keeps them
                    apart if the panel is narrow. */}
                <div className="flex items-center justify-between gap-4">
                  <HeaderControls />
                  <ThemeSelection />
                </div>
              </MobileMenuToggle>
            </div>
          </header>

          {/* 3. DYNAMIC PAGE CONTENT */}
          <main className="relative z-10 flex-1">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}