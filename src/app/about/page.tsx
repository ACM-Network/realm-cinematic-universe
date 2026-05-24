"use client";

import React, { useEffect } from "react";
import { useUniverse } from "@/context/UniverseContext";
import { motion } from "framer-motion";
import { Award, Compass, Film, Layers, Radio, Globe } from "lucide-react";

export default function AboutPage() {
  const { mode, setAudioZone, playClickSound, playHoverSound, triggerSectionLock } = useUniverse();

  useEffect(() => {
    setAudioZone("home");
  }, []);

  const isEmotional = mode === "emotional";
  
  const accentTextClass = isEmotional ? "text-amber-400" : "text-cyan-400";
  const accentBgClass = isEmotional ? "bg-amber-500" : "bg-cyan-500";
  const accentBorderClass = isEmotional ? "border-amber-500/30" : "border-cyan-500/30";

  return (
    <div className="w-full relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20 select-none">
      {/* Page Header */}
      <div className="text-center mb-16 relative">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[150px] rounded-full mix-blend-screen opacity-20 blur-[80px] transition-colors duration-1000 ${isEmotional ? "bg-amber-500/10" : "bg-cyan-500/10"} pointer-events-none`} />
        <h1 className="text-xs font-bold uppercase tracking-[0.65em] text-slate-400 mb-3">Studio profile</h1>
        <h2 className="text-3xl md:text-5xl font-black tracking-[0.2em] text-slate-100 uppercase">
          LIMITLESS STUDIOS
        </h2>
        <div className="w-16 h-[1.5px] mx-auto mt-6 bg-slate-800" />
      </div>

      {/* Manifesto */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="glass-panel border border-white/[0.04] rounded-3xl p-6 md:p-8 flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">The Manifesto</h3>
            <p className="text-sm md:text-base text-slate-350 tracking-[0.05em] leading-relaxed">
              At Limitless Studios, we believe that stories are living energies that span beyond single screens or separate titles. The **Realm Cinematic Universe (RCU)** is our flagship interconnected movie matrix, exploring dark technology, celestial councils, parallel timelines, and the deep emotional threads that bind individuals across realities.
            </p>
            <p className="text-xs md:text-sm text-slate-450 tracking-[0.05em] leading-relaxed">
              Each release contributes to a larger overarching narrative: Phase 1 establishes characters and foundational rifts, Phase 2 forces timelines closer to physical collision, and Phase 3 orchestrates the ultimate multiversal resolution.
            </p>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="glass-panel border border-white/[0.04] rounded-3xl p-6 md:p-8 flex flex-col gap-4 relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-[3px] h-full ${accentBgClass} transition-colors duration-1000`} />
            
            <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">Universe Credit</h3>
            <div className="flex flex-col gap-3">
              <div className="text-2xl font-black uppercase tracking-[0.08em] text-white">
                Surya Gokul
              </div>
              <p className="text-[10px] font-bold text-slate-400 tracking-[0.1em] uppercase block">
                CREATOR & CHIEF ARCHITECT OF THE REALM
              </p>
              <div className="w-12 h-[1px] bg-slate-800 my-2" />
              <p className="text-xs text-slate-550 tracking-[0.05em] leading-relaxed">
                Formulated as an immersive playground of interconnected timelines, Surya Gokul's vision guides the RCU's scripts, musical visualizers, and digital platforms.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ROADMAP SECTIONS (Interactive Locking) */}
      <section className="pt-12 border-t border-white/[0.03]">
        <div className="text-center mb-16">
          <h2 className={`text-[10px] font-bold uppercase tracking-[0.3em] ${accentTextClass} mb-2 transition-colors duration-1000`}>Lore roadmap</h2>
          <h3 className="text-2xl md:text-3xl font-extrabold tracking-[0.1em] text-slate-100 uppercase">THE LORE PROGRESSION</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              phase: "Phase 1",
              title: "Origins & Rift Anchors",
              status: "Active",
              details: "Focuses on launching core timeline stories. Establishing the dark tech syndicate, Shadow Knight's vigilante rise, and the neural strings linking parallel souls.",
              impact: "Establishes the Prime Temporal Rift and links Split-Alpha dimension.",
              locked: false
            },
            {
              phase: "Phase 2",
              title: "Convergence Loops",
              status: "Nexus Syncing",
              details: "Explores the breaking of spatial boundaries. Mirror dimensions collapse, timeline bleed-throughs occur, and Reflection Girl attempts to contain the mirror rifts.",
              impact: "Triggers spatial cracks and sets off the prime timeline warning alarm.",
              locked: true
            },
            {
              phase: "Phase 3",
              title: "Multiverse War Clash",
              status: "Classified",
              details: "The final showdown. Realities converge in a physical battleground. Council Sentinels step in to synthesize a single stable timeline from the wreckage of the wars.",
              impact: "Resets the multiversal registry, establishing a unified Earth Guard domain.",
              locked: true
            }
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (item.locked) {
                  triggerSectionLock(item.phase);
                } else {
                  playClickSound();
                }
              }}
              onMouseEnter={playHoverSound}
              className="glass-panel border border-white/[0.04] rounded-2xl p-6 md:p-8 flex flex-col gap-4 relative hover:border-white/10 hover:bg-white/[0.01] transition-all duration-300 text-left cursor-pointer pointer-events-auto w-full select-none"
            >
              <div className="flex justify-between items-center w-full">
                <span className={`text-[10px] font-extrabold tracking-[0.2em] uppercase ${accentTextClass} transition-colors duration-1000`}>
                  {item.phase}
                </span>
                <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border border-white/5 bg-black/40 ${
                  item.locked ? "text-purple-400/80 border-purple-500/20" : "text-green-400/80 border-green-500/20"
                }`}>
                  {item.status}
                </span>
              </div>

              <h4 className="text-base font-extrabold uppercase tracking-[0.05em] text-white">
                {item.title}
              </h4>

              <p className="text-xs text-slate-450 tracking-[0.05em] leading-relaxed">
                {item.details}
              </p>

              <div className="mt-4 pt-4 border-t border-white/[0.03] w-full">
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Impact registry</span>
                <p className="text-xs font-semibold text-slate-350 tracking-[0.05em]">
                  {item.impact}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
