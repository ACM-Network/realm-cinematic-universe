"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useUniverse } from "@/context/UniverseContext";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Shield, Layers, HelpCircle, Activity } from "lucide-react";

interface Character {
  id: string;
  name: string;
  title: string;
  bio: string;
  powers: string[];
  connectedFilms: string[];
  stats: { label: string; value: number }[];
  portrait: string;
  glowColor: string;
  lineColor: string;
  alliance: string;
}

const RCU_CHARACTERS: Character[] = [
  {
    id: "rudra",
    name: "Rudra",
    title: "The Cosmic Nexus",
    bio: "Born from a solar singularity during a synchronization loop, Rudra is the protector of temporal gateways. He harnesses celestial fire and manipulates tachyon particles to lock down multiversal anomalies before they collapse.",
    powers: ["Tachyon Manipulation", "Solar Pyrokinesis", "Spatial Phasing"],
    connectedFilms: ["Shadow Knight", "Strings of You", "Neelo Nenu"],
    stats: [
      { label: "Cosmic Power", value: 95 },
      { label: "Agility", value: 85 },
      { label: "Intelligence", value: 90 },
      { label: "Combat", value: 82 }
    ],
    portrait: "/images/rudra.png",
    glowColor: "shadow-[0_0_30px_rgba(245,158,11,0.35)] border-amber-500/35",
    lineColor: "#f59e0b",
    alliance: "Sentinel Council"
  },
  {
    id: "shadow-knight",
    name: "Shadow Knight",
    title: "Vigilante of the Rift",
    bio: "A billionaire tech industrialist who weaponized rift energy leaking from an ancient syndicate laboratory. Operating in the shadows of the core timeline, he fights technical corruption and secures the Rift anchor.",
    powers: ["Dark Energy Blasts", "Tactical Stealth Suit", "Tech Intuition"],
    connectedFilms: ["Shadow Knight", "Strings of You"],
    stats: [
      { label: "Cosmic Power", value: 40 },
      { label: "Agility", value: 90 },
      { label: "Intelligence", value: 95 },
      { label: "Combat", value: 95 }
    ],
    portrait: "/images/shadow-knight-char.png",
    glowColor: "shadow-[0_0_30px_rgba(225,29,72,0.35)] border-red-500/35",
    lineColor: "#e11d48",
    alliance: "Earth Guard"
  },
  {
    id: "reflection-girl",
    name: "Reflection Girl",
    title: "The Mirror Wanderer",
    bio: "A survivor of the neural bridge project. She discovered she can perceive and walk through reflective surfaces to travel across parallel universe branches, pulling objects and echoes of reality across mirrors.",
    powers: ["Mirror Portal Conjuring", "Dimensional Sight", "Echo Duplication"],
    connectedFilms: ["Strings of You", "Neelo Nenu"],
    stats: [
      { label: "Cosmic Power", value: 88 },
      { label: "Agility", value: 80 },
      { label: "Intelligence", value: 92 },
      { label: "Combat", value: 68 }
    ],
    portrait: "/images/reflection-girl.png",
    glowColor: "shadow-[0_0_30px_rgba(6,182,212,0.35)] border-cyan-500/35",
    lineColor: "#06b6d4",
    alliance: "Dimensional Wanderers"
  }
];

export default function CharactersPage() {
  const { mode, setAudioZone, playClickSound, playHoverSound } = useUniverse();
  const [activeCharId, setActiveCharId] = useState("rudra");

  // Keep audio zone set to home on this page
  useEffect(() => {
    setAudioZone("home");
  }, []);

  const activeChar = RCU_CHARACTERS.find((c) => c.id === activeCharId) || RCU_CHARACTERS[0];
  const isEmotional = mode === "emotional";

  const accentTextClass = isEmotional ? "text-amber-400" : "text-cyan-400";
  const accentBgClass = isEmotional ? "bg-amber-500" : "bg-cyan-500";
  const accentBorderClass = isEmotional ? "border-amber-500/30" : "border-cyan-500/30";

  return (
    <div className="w-full relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20 select-none">
      {/* Page Header */}
      <div className="text-center mb-16 relative">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[150px] rounded-full mix-blend-screen opacity-20 blur-[80px] transition-colors duration-1000 ${isEmotional ? "bg-amber-500/10" : "bg-cyan-500/10"} pointer-events-none`} />
        <h1 className="text-xs font-bold uppercase tracking-[0.65em] text-slate-400 mb-3">Database files</h1>
        <h2 className="text-3xl md:text-5xl font-black tracking-[0.2em] text-slate-100 uppercase">
          RCU PROTAGONISTS
        </h2>
        <div className="w-16 h-[1.5px] mx-auto mt-6 bg-slate-800" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Holographic character selector cards */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500 px-2">Active Profiles</h3>
          <div className="flex flex-col gap-4">
            {RCU_CHARACTERS.map((char) => {
              const isActive = char.id === activeCharId;
              return (
                <button
                  key={char.id}
                  onClick={() => {
                    playClickSound();
                    setActiveCharId(char.id);
                  }}
                  onMouseEnter={playHoverSound}
                  className={`group relative text-left p-4 rounded-2xl glass-panel border overflow-hidden transition-all duration-500 flex items-center gap-5 cursor-pointer ${
                    isActive 
                      ? char.glowColor 
                      : "border-white/[0.03] hover:border-white/10 hover:bg-white/[0.01]"
                  }`}
                >
                  {/* Scanline overlay for holographic feel */}
                  <div className="absolute inset-0 scanlines opacity-5 pointer-events-none" />

                  {/* Character mini thumbnail */}
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border border-white/10 flex-shrink-0">
                    <Image src={char.portrait} alt={char.name} fill className="object-cover" />
                  </div>

                  <div className="flex-grow">
                    <h4 className="text-base font-extrabold uppercase tracking-[0.05em] text-white">
                      {char.name}
                    </h4>
                    <span className="text-[9px] font-bold text-slate-400 tracking-[0.1em] uppercase block mt-0.5">
                      {char.title}
                    </span>
                  </div>

                  {/* Indicators */}
                  <div className="flex flex-col items-end">
                    <span className={`text-[8px] font-bold tracking-[0.1em] uppercase px-2 py-0.5 rounded border border-white/5 bg-black/40 ${
                      isActive ? accentTextClass : "text-slate-500"
                    }`}>
                      {char.alliance.split(" ")[0]}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Holographic detailed folder view */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500 px-2">Holographic Folder</h3>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeChar.id}
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              transition={{ duration: 0.4 }}
              className="glass-panel border border-white/[0.04] rounded-3xl p-6 md:p-8 flex flex-col gap-6 relative overflow-hidden"
            >
              {/* Scanline overlay */}
              <div className="absolute inset-0 scanlines opacity-10 pointer-events-none animate-pulse-glow" />

              {/* Header profile details */}
              <div className="flex flex-col md:flex-row items-center gap-6 pb-6 border-b border-white/[0.04]">
                <div className="relative w-28 h-28 rounded-2xl overflow-hidden border border-white/10 flex-shrink-0 shadow-2xl">
                  <Image src={activeChar.portrait} alt={activeChar.name} fill className="object-cover" />
                </div>
                <div className="text-center md:text-left flex-grow">
                  <h3 className="text-2xl md:text-3xl font-extrabold uppercase tracking-[0.05em] text-white">
                    {activeChar.name}
                  </h3>
                  <p className={`text-xs font-semibold tracking-[0.1em] uppercase mt-1 ${accentTextClass}`}>
                    {activeChar.title}
                  </p>
                  
                  <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                    {activeChar.powers.map((pow) => (
                      <span key={pow} className="text-[9px] font-bold text-slate-400 tracking-[0.05em] uppercase px-2.5 py-1 bg-white/[0.02] border border-white/5 rounded-full">
                        {pow}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Biography */}
              <div className="flex flex-col gap-2">
                <h5 className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">Historical Log</h5>
                <p className="text-xs md:text-sm text-slate-450 tracking-[0.05em] leading-relaxed">
                  {activeChar.bio}
                </p>
              </div>

              {/* Power stats gauges */}
              <div className="flex flex-col gap-4">
                <h5 className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">Combat Attributes</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeChar.stats.map((st) => (
                    <div key={st.label} className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-[10px] tracking-[0.08em] font-semibold text-slate-400">
                        <span>{st.label}</span>
                        <span className={accentTextClass}>{st.value}%</span>
                      </div>
                      {/* Stat progress bar */}
                      <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/[0.02]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${st.value}%` }}
                          transition={{ duration: 1.0, ease: "easeOut" }}
                          className={`h-full rounded-full ${accentBgClass} transition-colors duration-1000`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connected Movies list */}
              <div className="pt-4 border-t border-white/[0.04] flex flex-col gap-2">
                <h5 className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">Recorded Occurrences</h5>
                <div className="flex flex-wrap gap-3 mt-1">
                  {activeChar.connectedFilms.map((film) => (
                    <span
                      key={film}
                      className="text-[9px] font-bold text-slate-400 tracking-[0.08em] uppercase px-3 py-1.5 border border-slate-800 rounded bg-[#030303]"
                    >
                      {film}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* INTERACTIVE RELATIONSHIP MAP */}
      <section className="mt-24 pt-16 border-t border-white/[0.03]">
        <div className="text-center mb-12">
          <h2 className={`text-[10px] font-bold uppercase tracking-[0.3em] ${accentTextClass} mb-2 transition-colors duration-1000`}>Network Analysis</h2>
          <h3 className="text-2xl font-extrabold tracking-[0.1em] text-slate-100 uppercase">Synchronicity Relationship Map</h3>
          <p className="text-[10px] uppercase tracking-[0.15em] text-slate-500 mt-2">Interactive SVG Link Matrix. Click node names to select folder files.</p>
        </div>

        {/* SVG Node Graph */}
        <div className="relative w-full h-[320px] md:h-[420px] rounded-3xl glass-panel border border-white/[0.04] bg-[#020406]/65 flex items-center justify-center p-4">
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
            {/* Glowing filter definition */}
            <defs>
              <filter id="glow-rudra" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Glowing lines linking characters */}
            {/* Line: Rudra <-> Shadow Knight */}
            <line
              x1="400" y1="90" x2="220" y2="280"
              stroke="#ef4444" strokeWidth="2.5" strokeOpacity="0.45"
              strokeDasharray={activeCharId === "rudra" || activeCharId === "shadow-knight" ? "none" : "4,4"}
              className="transition-all duration-500"
            />
            {/* Line: Rudra <-> Reflection Girl */}
            <line
              x1="400" y1="90" x2="580" y2="280"
              stroke="#06b6d4" strokeWidth="2.5" strokeOpacity="0.45"
              strokeDasharray={activeCharId === "rudra" || activeCharId === "reflection-girl" ? "none" : "4,4"}
              className="transition-all duration-500"
            />
            {/* Line: Shadow Knight <-> Reflection Girl */}
            <line
              x1="220" y1="280" x2="580" y2="280"
              stroke="#f59e0b" strokeWidth="2" strokeOpacity="0.3"
              className="transition-all duration-500"
            />
          </svg>

          {/* HTML Overlay Nodes for easy clicks */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Node 1: Rudra (Top center) */}
            <button
              onClick={() => { playClickSound(); setActiveCharId("rudra"); }}
              onMouseEnter={playHoverSound}
              className={`absolute top-[40px] md:top-[60px] left-[50%] -translate-x-1/2 p-3 bg-black border rounded-full pointer-events-auto cursor-pointer flex flex-col items-center gap-1.5 transition-all duration-300 ${
                activeCharId === "rudra" 
                  ? "border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.5)] scale-110" 
                  : "border-slate-800 hover:border-slate-500"
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Sparkles size={12} className="text-amber-400 animate-pulse" />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-350">RUDRA</span>
            </button>

            {/* Node 2: Shadow Knight (Bottom Left) */}
            <button
              onClick={() => { playClickSound(); setActiveCharId("shadow-knight"); }}
              onMouseEnter={playHoverSound}
              className={`absolute bottom-[40px] md:bottom-[60px] left-[15%] md:left-[25%] p-3 bg-black border rounded-full pointer-events-auto cursor-pointer flex flex-col items-center gap-1.5 transition-all duration-300 ${
                activeCharId === "shadow-knight" 
                  ? "border-red-500 shadow-[0_0_20px_rgba(225,29,72,0.5)] scale-110" 
                  : "border-slate-800 hover:border-slate-500"
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                <Shield size={12} className="text-red-400" />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-350">SHADOW KNIGHT</span>
            </button>

            {/* Node 3: Reflection Girl (Bottom Right) */}
            <button
              onClick={() => { playClickSound(); setActiveCharId("reflection-girl"); }}
              onMouseEnter={playHoverSound}
              className={`absolute bottom-[40px] md:bottom-[60px] right-[15%] md:right-[25%] p-3 bg-black border rounded-full pointer-events-auto cursor-pointer flex flex-col items-center gap-1.5 transition-all duration-300 ${
                activeCharId === "reflection-girl" 
                  ? "border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.5)] scale-110" 
                  : "border-slate-800 hover:border-slate-500"
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <Layers size={12} className="text-cyan-400" />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-350">REFLECTION GIRL</span>
            </button>

            {/* Middle matrix indicator label */}
            <div className="absolute text-center select-none bg-black/80 px-4 py-1.5 border border-white/5 rounded-lg text-[9px] font-bold tracking-[0.1em] text-slate-500 uppercase flex items-center gap-1">
              <Activity size={10} className="text-slate-650" />
              SYNAPSE COUPLING STABLE
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
