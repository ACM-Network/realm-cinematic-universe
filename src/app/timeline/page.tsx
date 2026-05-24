"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useUniverse } from "@/context/UniverseContext";
import { useScrollVolume } from "@/hooks/useScrollVolume";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Compass, Layers, AlertCircle, Play, Square, ZoomIn, ZoomOut, X } from "lucide-react";

interface TimelineNode {
  id: string;
  year: string;
  title: string;
  phase: string;
  type: "movie" | "nexus";
  description: string;
  chronologicalOrder: number;
  releaseOrder: number;
  branch: "core" | "split-alpha" | "split-beta";
  anomalySeverity: "low" | "medium" | "critical";
  connectedFilmId?: string;
}

const TIMELINE_NODES: TimelineNode[] = [
  {
    id: "dark-tech-awakening",
    year: "2024",
    title: "The Dark Tech Awakening",
    phase: "Phase 1: Origins",
    type: "nexus",
    description: "An industrialist weaponizes rift energy from illegal corporate experiments. This creates a stable anchoring rift in the core timeline, alerting celestial council sentinels to Earth.",
    chronologicalOrder: 1,
    releaseOrder: 1,
    branch: "core",
    anomalySeverity: "low",
    connectedFilmId: "shadow-knight"
  },
  {
    id: "shadow-knight-release",
    year: "2024",
    title: "Shadow Knight (Theatrical Release)",
    phase: "Phase 1: Origins",
    type: "movie",
    description: "Shadow Knight exposes the corporate dark tech syndicate, solidifying the rift's stability and drawing Rudra's attention to protect the timeline.",
    chronologicalOrder: 2,
    releaseOrder: 2,
    branch: "core",
    anomalySeverity: "low",
    connectedFilmId: "shadow-knight"
  },
  {
    id: "astral-convergence",
    year: "2025",
    title: "The Astral Convergence",
    phase: "Phase 1: Origins",
    type: "nexus",
    description: "A digital neural project creates a telepathic coupling between parallel astrophysicists, establishing a temporary gateway bridge between two parallel timeline branches.",
    chronologicalOrder: 3,
    releaseOrder: 3,
    branch: "split-alpha",
    anomalySeverity: "medium",
    connectedFilmId: "strings-of-you"
  },
  {
    id: "strings-of-you-release",
    year: "2025",
    title: "Strings of You (Theatrical Release)",
    phase: "Phase 1: Origins",
    type: "movie",
    description: "Astrophysicists stabilize the temporal bridge using cyber-neural nodes, preventing a major collision between the core timeline and Split-Alpha.",
    chronologicalOrder: 4,
    releaseOrder: 4,
    branch: "split-alpha",
    anomalySeverity: "medium",
    connectedFilmId: "strings-of-you"
  },
  {
    id: "shattered-mirrors",
    year: "2026",
    title: "Shattered Mirrors Paradox",
    phase: "Phase 2: Convergence",
    type: "nexus",
    description: "Reflection Girl shatters the prime looking glass portal. This dissolves spatial containment barriers, causing reflection portals to remain permanently open across cities.",
    chronologicalOrder: 5,
    releaseOrder: 5,
    branch: "split-beta",
    anomalySeverity: "critical",
    connectedFilmId: "neelo-nenu"
  },
  {
    id: "neelo-nenu-release",
    year: "2026",
    title: "Neelo Nenu (Upcoming Theatrical)",
    phase: "Phase 2: Convergence",
    type: "movie",
    description: "Reflection Girl uncovers a multiversal conspiracy to purge mirror portals, leading to massive timeline collapse and physical bleed-through of alternate versions.",
    chronologicalOrder: 6,
    releaseOrder: 6,
    branch: "split-beta",
    anomalySeverity: "critical",
    connectedFilmId: "neelo-nenu"
  },
  {
    id: "multiverse-war-nexus",
    year: "Concept",
    title: "Multiverse War Nexus Event",
    phase: "Phase 3: Multiverse War",
    type: "nexus",
    description: "All parallel branches collapse into a single space-time warzone. Realities merge and fight for dominance to determine the prime universe.",
    chronologicalOrder: 7,
    releaseOrder: 7,
    branch: "core",
    anomalySeverity: "critical"
  }
];

export default function TimelinePage() {
  const { mode, setAudioZone, playClickSound, playHoverSound, triggerSectionLock, lockedSection } = useUniverse();
  const [viewOrder, setViewOrder] = useState<"chronological" | "release">("chronological");
  const [activeNexus, setActiveNexus] = useState<TimelineNode | null>(null);
  
  // Timeline 2.0 states
  const [zoomScale, setZoomScale] = useState(1.0);
  const [isPlaybackActive, setIsPlaybackActive] = useState(false);
  const [playbackIndex, setPlaybackIndex] = useState(-1);
  const playbackIntervalRef = useRef<any>(null);

  // Bind scroll volume adaptation
  useScrollVolume();

  useEffect(() => {
    setAudioZone("home");
    // Trigger RCU system lock immediately on mount for direct page URL visitors
    triggerSectionLock("Timeline");

    return () => {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
    };
  }, []);

  const sortedNodes = [...TIMELINE_NODES].sort((a, b) => {
    if (viewOrder === "chronological") {
      return a.chronologicalOrder - b.chronologicalOrder;
    }
    return a.releaseOrder - b.releaseOrder;
  });

  useEffect(() => {
    if (isPlaybackActive) {
      setPlaybackIndex(0);
      playbackIntervalRef.current = setInterval(() => {
        setPlaybackIndex((prev) => {
          const next = prev + 1;
          if (next >= sortedNodes.length) {
            setIsPlaybackActive(false);
            clearInterval(playbackIntervalRef.current);
            return -1;
          }
          return next;
        });
      }, 3500);
    } else {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
        playbackIntervalRef.current = null;
      }
      setPlaybackIndex(-1);
    }

    return () => {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
    };
  }, [isPlaybackActive]);

  useEffect(() => {
    if (playbackIndex >= 0 && playbackIndex < sortedNodes.length) {
      const activeNode = sortedNodes[playbackIndex];
      const element = document.getElementById(activeNode.id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        playClickSound();
      }
    }
  }, [playbackIndex]);

  const togglePlayback = () => {
    playClickSound();
    setIsPlaybackActive(!isPlaybackActive);
  };

  const adjustZoom = (type: "in" | "out") => {
    playClickSound();
    if (type === "in") {
      setZoomScale((prev) => Math.min(1.0, prev + 0.15));
    } else {
      setZoomScale((prev) => Math.max(0.7, prev - 0.15));
    }
  };

  const isEmotional = mode === "emotional";
  
  const accentTextClass = isEmotional ? "text-amber-400" : "text-cyan-400";
  const borderGlowClass = isEmotional ? "border-amber-500/40 text-amber-400 bg-amber-500/5 shadow-[0_0_10px_rgba(245,158,11,0.15)]" : "border-cyan-500/40 text-cyan-400 bg-cyan-500/5 shadow-[0_0_10px_rgba(6,182,212,0.15)]";

  return (
    <div className={`w-full transition-all duration-1000 ${lockedSection ? "brightness-[0.22] opacity-45 blur-[2px] pointer-events-none" : ""}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20 select-none">
        
        {/* Page Header */}
        <div className="text-center mb-12 relative">
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[150px] rounded-full mix-blend-screen opacity-20 blur-[80px] transition-colors duration-1000 ${isEmotional ? "bg-amber-500/10" : "bg-cyan-500/10"} pointer-events-none`} />
          <h1 className="text-xs font-bold uppercase tracking-[0.65em] text-slate-400 mb-3">Temporal progression</h1>
          <h2 className="text-3xl md:text-5xl font-black tracking-[0.2em] text-slate-100 uppercase">
            RCU CHRONOLOGY
          </h2>
          <div className="w-16 h-[1.5px] mx-auto mt-6 bg-slate-800" />
        </div>

        {/* Control Console */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between max-w-4xl mx-auto mb-16 border border-white/[0.03] bg-black/35 rounded-2xl p-4 backdrop-blur-md">
          
          <div className="relative flex items-center h-9 w-[240px] bg-slate-950 border border-white/[0.04] rounded-full p-1 shadow-inner">
            <div
              className={`absolute top-1 bottom-1 rounded-full transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                viewOrder === "release"
                  ? "left-[118px] right-1 bg-white/5 border border-white/10"
                  : "left-1 right-[118px] bg-white/5 border border-white/10"
              }`}
              style={{ width: "116px" }}
            />
            <button
              onClick={() => { playClickSound(); setViewOrder("chronological"); }}
              onMouseEnter={playHoverSound}
              className={`relative z-10 w-1/2 h-full text-[9px] font-bold uppercase tracking-[0.1em] text-center cursor-pointer transition-colors duration-300 ${
                viewOrder === "chronological" ? "text-white" : "text-slate-500"
              }`}
            >
              Chronological
            </button>
            <button
              onClick={() => { playClickSound(); setViewOrder("release"); }}
              onMouseEnter={playHoverSound}
              className={`relative z-10 w-1/2 h-full text-[9px] font-bold uppercase tracking-[0.1em] text-center cursor-pointer transition-colors duration-300 ${
                viewOrder === "release" ? "text-white" : "text-slate-500"
              }`}
            >
              Release Order
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex border border-white/5 bg-slate-950 rounded-full overflow-hidden select-none">
              <button
                onClick={() => adjustZoom("out")}
                className="p-2.5 text-slate-500 hover:text-white transition-colors cursor-pointer border-r border-white/5"
              >
                <ZoomOut size={12} />
              </button>
              <button
                onClick={() => adjustZoom("in")}
                className="p-2.5 text-slate-500 hover:text-white transition-colors cursor-pointer"
              >
                <ZoomIn size={12} />
              </button>
            </div>

            <button
              onClick={togglePlayback}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[9px] font-bold uppercase tracking-[0.15em] border transition-all duration-300 cursor-pointer ${
                isPlaybackActive 
                  ? borderGlowClass 
                  : "border-slate-800 text-slate-455 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              {isPlaybackActive ? (
                <>
                  <Square size={10} className="fill-current" />
                  <span>Stop cycle</span>
                </>
              ) : (
                <>
                  <Play size={10} className="fill-current" />
                  <span>Play history</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Chronology Tree */}
        <motion.div
          animate={{ scale: zoomScale }}
          transition={{ type: "spring", damping: 25 }}
          className="relative max-w-4xl mx-auto pl-8 md:pl-0 origin-top"
        >
          <div className="absolute left-[8px] md:left-1/2 top-0 bottom-0 w-[40px] md:-translate-x-1/2 z-0 hidden md:block">
            <svg className="w-full h-full stroke-current" style={{ color: isEmotional ? "rgba(245,158,11,0.06)" : "rgba(6,182,212,0.06)" }}>
              <path d="M20,0 L20,150 Q10,180 5,230 Q0,280 20,330 L20,500 Q30,550 35,600 Q40,650 20,700 L20,1000" fill="none" strokeWidth="1.5" />
              <path d="M20,150 Q30,180 35,230 Q40,280 20,330" fill="none" strokeWidth="1.5" strokeDasharray="3,3" />
            </svg>
          </div>

          <div className="absolute left-[8px] md:left-1/2 top-0 bottom-0 w-[1.5px] bg-slate-900 md:-translate-x-1/2 z-0" />
          
          <div className="flex flex-col gap-16 relative z-10">
            {sortedNodes.map((node, index) => {
              const isLeft = index % 2 === 0;
              const isNexus = node.type === "nexus";
              const isNodeActive = index === playbackIndex;
              
              const severityColor = node.anomalySeverity === "critical"
                ? "text-red-400 border-red-500/30 bg-red-500/5 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                : node.anomalySeverity === "medium"
                ? "text-cyan-400 border-cyan-500/30 bg-cyan-500/5 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                : "text-amber-400 border-amber-500/30 bg-amber-500/5 shadow-[0_0_15px_rgba(245,158,11,0.2)]";

              const activeCardBorder = isNodeActive
                ? isEmotional 
                  ? "border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.25)]" 
                  : "border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.25)]"
                : "border-white/[0.04]";

              return (
                <motion.div
                  key={node.id}
                  id={node.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className={`relative flex flex-col md:flex-row w-full ${isLeft ? "md:justify-start" : "md:justify-end"}`}
                >
                  <div className={`absolute left-[-24px] md:left-1/2 top-6 w-3.5 h-3.5 rounded-full bg-[#020406] border-2 md:-translate-x-1/2 z-20 transition-all duration-300 ${
                    isNodeActive
                      ? isEmotional ? "border-amber-500 scale-125" : "border-cyan-500 scale-125"
                      : "border-slate-700"
                  }`} />

                  <div className={`w-full md:w-[45%] ${isLeft ? "md:pr-8" : "md:pl-8"}`}>
                    <div
                      onClick={() => {
                        if (isNexus) {
                          playClickSound();
                          setActiveNexus(node);
                        }
                      }}
                      onMouseEnter={playHoverSound}
                      className={`p-6 rounded-2xl glass-panel border transition-all duration-500 hover:border-white/10 hover:bg-white/[0.01] relative overflow-hidden flex flex-col gap-2.5 ${activeCardBorder} ${
                        isNexus ? "cursor-pointer active:scale-99" : ""
                      }`}
                    >
                      {isNexus && (
                        <div className={`absolute top-0 right-0 w-1.5 h-1.5 rounded-full m-3 ${
                          node.anomalySeverity === "critical" ? "bg-red-500 animate-ping" : node.anomalySeverity === "medium" ? "bg-cyan-500 animate-ping" : "bg-amber-500 animate-ping"
                        }`} />
                      )}

                      <div className="flex items-center gap-3">
                        <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded border border-white/5 bg-black/40 ${accentTextClass} transition-colors duration-1000`}>
                          {node.year}
                        </span>
                        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{node.phase}</span>
                      </div>

                      <h4 className="text-base font-extrabold uppercase tracking-[0.05em] text-white">
                        {node.title}
                      </h4>

                      <p className="text-xs text-slate-400 tracking-[0.05em] leading-relaxed line-clamp-3">
                        {node.description}
                      </p>

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.03]">
                        <div className="flex items-center gap-1.5">
                          <Compass size={11} className="text-slate-655" />
                          <span className="text-[9px] font-bold text-slate-555 uppercase tracking-wider">Branch: {node.branch}</span>
                        </div>
                        
                        {isNexus ? (
                          <span className={`text-[8px] font-black uppercase tracking-[0.15em] px-2 py-0.5 rounded border ${severityColor}`}>
                            Nexus Anomalous
                          </span>
                        ) : (
                          node.connectedFilmId && (
                            <Link
                              href={`/movies/${node.connectedFilmId}`}
                              onClick={playClickSound}
                              onMouseEnter={playHoverSound}
                              className={`text-[8px] font-black uppercase tracking-[0.15em] flex items-center gap-1 text-slate-500 hover:${accentTextClass} transition-colors`}
                            >
                              <Layers size={10} />
                              View movie logs
                            </Link>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* NEXUS INTERACTIVE DIALOG MODAL */}
      <AnimatePresence>
        {activeNexus && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25 }}
              className="w-full max-w-lg glass-panel border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col gap-6 relative shadow-2xl overflow-hidden"
            >
              <div className="absolute inset-0 scanlines opacity-5 pointer-events-none" />
              <div className={`absolute top-0 left-0 w-full h-[3px] ${
                activeNexus.anomalySeverity === "critical" ? "bg-red-500" : activeNexus.anomalySeverity === "medium" ? "bg-cyan-500" : "bg-amber-500"
              }`} />

              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 text-red-400 font-extrabold text-[10px] tracking-[0.25em] uppercase">
                  <AlertCircle size={14} />
                  <span>NEXUS RECORD CLASSIFIED</span>
                </div>
                <button
                  onClick={() => { playClickSound(); setActiveNexus(null); }}
                  className="p-1 border border-white/10 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              <div>
                <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded border border-white/5 bg-black/40 ${accentTextClass} block w-fit mb-2`}>
                  Year: {activeNexus.year}
                </span>
                <h3 className="text-xl font-extrabold uppercase tracking-[0.05em] text-white">
                  {activeNexus.title}
                </h3>
                <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest mt-1 block">
                  Anomaly Level: <span className={
                    activeNexus.anomalySeverity === "critical" ? "text-red-400" : activeNexus.anomalySeverity === "medium" ? "text-cyan-400" : "text-amber-400"
                  }>{activeNexus.anomalySeverity}</span>
                </span>
              </div>

              <p className="text-xs md:text-sm text-slate-400 tracking-[0.05em] leading-relaxed">
                {activeNexus.description}
              </p>

              <div className="flex flex-col gap-2 pt-4 border-t border-white/[0.03]">
                <h5 className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.15em]">Timeline branch index</h5>
                <p className="text-xs font-semibold text-slate-300 tracking-[0.05em]">
                  Branch Path: {activeNexus.branch} (Dimension Coordinates T-0{activeNexus.chronologicalOrder})
                </p>
              </div>

              <button
                onClick={() => { playClickSound(); setActiveNexus(null); }}
                className={`w-full py-3 bg-white text-black font-bold tracking-[0.2em] text-[10px] rounded-full uppercase hover:opacity-90 transition-opacity`}
              >
                Acknowledge File
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
