"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUniverse } from "@/context/UniverseContext";
import { X, ShieldAlert, Terminal, FileText, Lock } from "lucide-react";

interface SecretLog {
  key: string;
  title: string;
  date: string;
  author: string;
  content: string;
}

const SECRET_LOGS: SecretLog[] = [
  {
    key: "RIFT-CORE",
    title: "Project Rift Core: Security Breach",
    date: "10-24-2024",
    author: "Syndicate Archival Feed",
    content: "WARNING: Rift extraction device operated beyond safety thresholds. Localised temporal anchor materialized. Object 'Shadow Knight' intercepted prototype plating. Temporal breach registered at coordinate R-14."
  },
  {
    key: "MIRROR-LORE",
    title: "Looking Glass Splinter Diagnostics",
    date: "05-12-2026",
    author: "Rudra Temporal Log",
    content: "CRITICAL: The physical portal collapsed following reflection collision. Subjects can no longer distinguish between primary body and duplicate echo. Containment protocol failed. Spatial tears detected on wet surfaces."
  },
  {
    key: "SURYA-GOKUL",
    title: "Creation Paradigm File: Founder Note",
    date: "01-01-2026",
    author: "Surya Gokul",
    content: "The multiverse operates not on random chaos, but on emotional anchors. A space rift is locked by technology, but stabilized by human connection. All dimensions must eventually converge."
  }
];

interface LoreTerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoreTerminal = ({ isOpen, onClose }: LoreTerminalProps) => {
  const { mode, playClickSound, playHoverSound } = useUniverse();
  const [activeLog, setActiveLog] = useState<SecretLog | null>(null);

  const isEmotional = mode === "emotional";
  
  const accentTextClass = isEmotional ? "text-amber-400" : "text-cyan-400";
  const accentBgClass = isEmotional ? "bg-amber-500" : "bg-cyan-500";
  const accentBorderClass = isEmotional ? "border-amber-500/30" : "border-cyan-500/30";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md select-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl glass-panel border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col gap-6 relative shadow-2xl overflow-hidden"
          >
            {/* Holographic Scanline Overlay */}
            <div className="absolute inset-0 scanlines opacity-5 pointer-events-none" />

            {/* Top border glow */}
            <div className={`absolute top-0 left-0 w-full h-[2.5px] ${accentBgClass} transition-colors duration-1000`} />

            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-white/[0.04]">
              <div className="flex items-center gap-2.5">
                <Terminal size={16} className={accentTextClass} />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-300">
                  CLASSIFIED LORE STORAGE
                </span>
              </div>
              <button
                onClick={() => { playClickSound(); onClose(); }}
                onMouseEnter={playHoverSound}
                className="p-2 border border-white/5 hover:border-white/20 rounded-full text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[300px]">
              {/* Left Column: Encrypted Log Selection */}
              <div className="md:col-span-5 flex flex-col gap-3">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-1">Archives</span>
                <div className="flex flex-col gap-2">
                  {SECRET_LOGS.map((log) => {
                    const isActive = activeLog?.key === log.key;
                    return (
                      <button
                        key={log.key}
                        onClick={() => {
                          playClickSound();
                          setActiveLog(log);
                        }}
                        onMouseEnter={playHoverSound}
                        className={`group relative text-left p-3.5 border rounded-xl transition-all duration-300 flex items-center gap-3 cursor-pointer ${
                          isActive 
                            ? isEmotional
                              ? "border-amber-500/40 text-amber-400 bg-amber-500/5 shadow-[0_0_10px_rgba(245,158,11,0.15)]"
                              : "border-cyan-500/40 text-cyan-400 bg-cyan-500/5 shadow-[0_0_10px_rgba(6,182,212,0.15)]"
                            : "border-white/[0.02] bg-white/[0.01] text-slate-450 hover:border-white/10 hover:text-slate-300"
                        }`}
                      >
                        <FileText size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-[0.1em] truncate">
                          {log.key}
                        </span>
                      </button>
                    );
                  })}
                  {/* Fake locked node */}
                  <div className="p-3.5 border border-dashed border-slate-800/50 rounded-xl text-slate-600 flex items-center gap-3 cursor-not-allowed">
                    <Lock size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-[0.1em]">NEXUS-WAR-WARPAD</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Active Log Decrypted Content */}
              <div className="md:col-span-7 flex flex-col gap-4 p-4 rounded-2xl bg-black/45 border border-white/[0.02] relative justify-center">
                {activeLog ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-3 h-full"
                  >
                    <div>
                      <h4 className={`text-xs font-black uppercase tracking-[0.05em] text-white`}>
                        {activeLog.title}
                      </h4>
                      <div className="flex gap-4 mt-1 text-[9px] font-semibold text-slate-500 uppercase tracking-wider">
                        <span>Date: {activeLog.date}</span>
                        <span>Author: {activeLog.author}</span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-slate-400 tracking-[0.05em] leading-relaxed mt-2 p-3 bg-white/[0.01] border border-white/[0.02] rounded-lg">
                      {activeLog.content}
                    </p>

                    <div className="mt-auto flex items-center gap-1.5 text-[8px] font-bold text-slate-500 uppercase tracking-widest p-1">
                      <ShieldAlert size={12} className={accentTextClass} />
                      <span>Decrypted Registry Synapse</span>
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-center py-10 flex flex-col items-center justify-center gap-3">
                    <Lock size={20} className="text-slate-700 animate-pulse" />
                    <p className="text-[10px] uppercase tracking-[0.15em] text-slate-500">
                      Select encrypted packet to initialize timeline decryption
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
