"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUniverse } from "@/context/UniverseContext";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Menu, X, Compass, Radio, Terminal } from "lucide-react";

export const Navbar = () => {
  const pathname = usePathname();
  const {
    mode,
    setMode,
    isAudioEnabled,
    toggleAudio,
    playHoverSound,
    playClickSound,
    volume,
    setVolume,
    triggerSectionLock
  } = useUniverse();

  const [isOpen, setIsOpen] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Movies", href: "/movies" },
    { name: "Characters", href: "/characters" },
    { name: "Timeline", href: "/timeline" },
    { name: "Gallery", href: "/gallery" },
    { name: "About", href: "/about" },
  ];

  // Intercept links to locked sections
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, name: string) => {
    playClickSound();
    setIsOpen(false);
    
    if (href === "/timeline" || href === "/characters") {
      e.preventDefault();
      triggerSectionLock(name);
    }
  };

  const toggleUniverseMode = () => {
    playClickSound();
    setMode(mode === "core" ? "emotional" : "core");
  };

  const triggerLoreTerminal = () => {
    // Intercepted by temporary section lock system
    triggerSectionLock("Classified Archive Console");
  };

  const isEmotional = mode === "emotional";
  
  const accentTextClass = isEmotional ? "text-amber-400" : "text-cyan-400";
  const borderGlowClass = isEmotional ? "border-amber-500/40 text-amber-400 bg-amber-500/5" : "border-cyan-500/40 text-cyan-400 bg-cyan-500/5";

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/35 border-b border-white/[0.04] transition-colors duration-1000">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        
        {/* Studio Logo */}
        <Link
          href="/"
          onClick={(e) => handleLinkClick(e, "/", "Home")}
          onMouseEnter={playHoverSound}
          className="flex items-center gap-2.5 group"
        >
          <div className="relative">
            <div className={`w-3.5 h-3.5 rounded-full ${isEmotional ? "bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.8)]" : "bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.8)]"} transition-all duration-1000 group-hover:scale-125`} />
            <div className={`absolute inset-0 rounded-full ${isEmotional ? "bg-amber-500/30" : "bg-cyan-500/30"} blur-[3px] animate-ping`} />
          </div>
          <span className="font-extrabold tracking-[0.4em] text-sm md:text-base text-slate-100 uppercase transition-all duration-300 group-hover:text-white">
            LIMITLESS <span className="font-normal text-slate-400 text-xs tracking-[0.2em] lowercase">studios</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href, link.name)}
                onMouseEnter={playHoverSound}
                className="relative py-2 text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300 text-slate-400 hover:text-slate-100"
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="navActiveLine"
                    className={`absolute bottom-0 left-0 w-full h-[2px] ${isEmotional ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" : "bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]"} transition-all duration-1000`}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Controls */}
        <div className="hidden md:flex items-center gap-5">
          
          {/* Temporal Anomaly (Glitch Trigger) locked */}
          <button
            onClick={triggerLoreTerminal}
            onMouseEnter={playHoverSound}
            className="p-2 border border-dashed border-white/5 hover:border-white/20 rounded-full text-slate-655 hover:text-slate-350 transition-colors duration-300 cursor-pointer relative group"
            title="Temporal anomaly detected"
          >
            <Terminal size={12} className="group-hover:animate-pulse" />
            <div className={`absolute top-0 right-0 w-1.5 h-1.5 rounded-full ${isEmotional ? "bg-amber-400" : "bg-cyan-400"} animate-ping`} style={{ animationDuration: "3s" }} />
          </button>

          {/* Audio controls */}
          <div
            onMouseEnter={() => setShowVolumeSlider(true)}
            onMouseLeave={() => setShowVolumeSlider(false)}
            className={`flex items-center gap-3 px-4 py-2 border rounded-full text-[10px] font-bold tracking-[0.15em] uppercase transition-all duration-300 ${
              isAudioEnabled ? borderGlowClass : "border-slate-800 text-slate-500 hover:border-slate-700"
            }`}
          >
            <button
              onClick={() => {
                playClickSound();
                toggleAudio();
              }}
              className="flex items-center gap-1.5 cursor-pointer hover:opacity-90"
            >
              {isAudioEnabled ? (
                <Volume2 size={12} className="animate-pulse" />
              ) : (
                <VolumeX size={12} />
              )}
              <span>{isAudioEnabled ? "Audio On" : "Audio Off"}</span>
            </button>

            <AnimatePresence>
              {isAudioEnabled && showVolumeSlider && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 64, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden flex items-center h-4"
                >
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-16 h-[2px] bg-slate-850 rounded-lg appearance-none cursor-pointer accent-current outline-none"
                    style={{ color: isEmotional ? "#f59e0b" : "#06b6d4" }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Universe switcher */}
          <button
            onClick={toggleUniverseMode}
            onMouseEnter={playHoverSound}
            className="relative flex items-center h-9 w-[170px] bg-slate-900/80 border border-white/[0.05] rounded-full p-1 cursor-pointer overflow-hidden group shadow-inner"
          >
            <div
              className={`absolute top-1 bottom-1 rounded-full transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                isEmotional
                  ? "left-[83px] right-1 bg-amber-500/20 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                  : "left-1 right-[83px] bg-cyan-500/20 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
              }`}
              style={{ width: "82px" }}
            />
            
            <div className="relative z-10 flex w-full h-full text-[9px] font-extrabold uppercase tracking-[0.15em] text-center select-none">
              <span className={`w-1/2 flex items-center justify-center transition-colors duration-500 ${isEmotional ? "text-slate-500" : "text-cyan-300"}`}>
                Core
              </span>
              <span className={`w-1/2 flex items-center justify-center transition-colors duration-500 ${isEmotional ? "text-amber-300" : "text-slate-500"}`}>
                Emotional
              </span>
            </div>
          </button>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={triggerLoreTerminal}
            className="p-2 border border-slate-800 rounded-full text-slate-500 hover:text-slate-350"
          >
            <Terminal size={14} />
          </button>

          <button
            onClick={() => {
              playClickSound();
              toggleAudio();
            }}
            className={`p-2 border rounded-full transition-colors duration-300 ${
              isAudioEnabled ? (isEmotional ? "border-amber-500/40 text-amber-400" : "border-cyan-500/40 text-cyan-400") : "border-slate-800 text-slate-500"
            }`}
          >
            {isAudioEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>

          <button
            onClick={toggleUniverseMode}
            className={`p-2 border rounded-full transition-colors duration-300 ${
              isEmotional ? "border-amber-500/40 text-amber-400" : "border-cyan-500/40 text-cyan-400"
            }`}
          >
            {isEmotional ? <Radio size={14} /> : <Compass size={14} />}
          </button>

          <button
            onClick={() => {
              playClickSound();
              setIsOpen(!isOpen);
            }}
            className="p-2 border border-slate-800 rounded-full text-slate-300"
          >
            {isOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            className="lg:hidden absolute top-20 left-0 w-full bg-black/95 border-b border-white/[0.05] overflow-hidden backdrop-blur-lg"
          >
            <nav className="flex flex-col px-6 py-8 gap-5">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href, link.name)}
                    className={`text-xs font-semibold uppercase tracking-[0.2em] py-2 transition-colors ${
                      isActive
                        ? isEmotional
                          ? "text-amber-400 border-l-2 border-amber-500 pl-3"
                          : "text-cyan-400 border-l-2 border-cyan-500 pl-3"
                        : "text-slate-400 pl-0"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
export default Navbar;
