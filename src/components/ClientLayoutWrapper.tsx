"use client";

import React, { useState, useEffect } from "react";
import { UniverseProvider } from "@/context/UniverseContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackgroundParticles } from "@/components/BackgroundParticles";
import { CustomCursor } from "@/components/CustomCursor";
import { CinematicTransition } from "@/components/CinematicTransition";
import { CinematicIntro } from "@/components/CinematicIntro";
import { LoreTerminal } from "@/components/LoreTerminal";

interface ClientLayoutWrapperProps {
  children: React.ReactNode;
}

export const ClientLayoutWrapper = ({ children }: ClientLayoutWrapperProps) => {
  const [showMainLayout, setShowMainLayout] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOpenTerminal = () => {
      setIsTerminalOpen(true);
    };

    window.addEventListener("open-lore-terminal", handleOpenTerminal);
    return () => {
      window.removeEventListener("open-lore-terminal", handleOpenTerminal);
    };
  }, []);

  return (
    <UniverseProvider>
      {/* Cinematic Intro Splash Screen */}
      <CinematicIntro onEnter={() => setShowMainLayout(true)} />

      {/* Background Particles System */}
      <BackgroundParticles />

      {/* Floating Cursor Glow */}
      <CustomCursor />

      {/* Secret Encrypted Lore Archives */}
      <LoreTerminal isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />

      {showMainLayout ? (
        <div className="relative min-h-screen flex flex-col z-10">
          <Navbar />
          <main className="flex-grow pt-20">
            <CinematicTransition>{children}</CinematicTransition>
          </main>
          <Footer />
        </div>
      ) : (
        // Render simple fallback container to prevent hydration mismatches
        <div className="fixed inset-0 bg-black z-0 pointer-events-none" />
      )}
    </UniverseProvider>
  );
};
export default ClientLayoutWrapper;
