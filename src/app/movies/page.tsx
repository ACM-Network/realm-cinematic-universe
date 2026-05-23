"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUniverse } from "@/context/UniverseContext";
import { RCU_MOVIES } from "@/app/page";
import { motion } from "framer-motion";
import { Film, Calendar, Compass, ArrowRight } from "lucide-react";

export default function MoviesPage() {
  const { mode, setAudioZone, playClickSound, playHoverSound } = useUniverse();

  // Reset zone to general list view audio zone
  useEffect(() => {
    setAudioZone("home");
  }, []);

  const isEmotional = mode === "emotional";
  const accentTextClass = isEmotional ? "text-amber-400" : "text-cyan-400";
  const glowTextClass = isEmotional ? "cinematic-glow-text-emotional text-amber-400" : "cinematic-glow-text-core text-cyan-400";

  return (
    <div className="w-full relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
      {/* Page Header */}
      <div className="text-center mb-16 md:mb-24 relative select-none">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[150px] rounded-full mix-blend-screen opacity-20 blur-[80px] transition-colors duration-1000 ${isEmotional ? "bg-amber-500/10" : "bg-cyan-500/10"} pointer-events-none`} />
        <h1 className="text-xs font-bold uppercase tracking-[0.65em] text-slate-400 mb-3">Realm Cinematic Universe</h1>
        <h2 className="text-3xl md:text-5xl font-black tracking-[0.28em] text-slate-100 uppercase select-none">
          THE REALM ARCHIVE
        </h2>
        <div className="w-16 h-[1.5px] mx-auto mt-6 bg-gradient-to-r from-transparent via-slate-600 to-transparent" />
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
        {RCU_MOVIES.map((movie, index) => {
          // Dynamic glow highlights matching movie themes
          const isNeelo = movie.id === "neelo-nenu";
          const isStrings = movie.id === "strings-of-you";
          const itemGlowColor = isNeelo
            ? "group-hover:shadow-[0_0_22px_rgba(125,211,252,0.28)] border-sky-400/30"
            : isStrings
            ? "group-hover:shadow-[0_0_22px_rgba(6,182,212,0.3)] border-cyan-500/30"
            : "group-hover:shadow-[0_0_22px_rgba(225,29,72,0.3)] border-red-500/30";

          const hoverBgColor = isNeelo
            ? "rgba(125, 211, 252, 0.06)"
            : isStrings
            ? "rgba(6, 182, 212, 0.05)"
            : "rgba(225, 29, 72, 0.05)";

          return (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group flex flex-col transition-transform duration-500 hover:-translate-y-2"
            >
              {/* Card wrapper */}
              <Link
                href={`/movies/${movie.id}`}
                onClick={playClickSound}
                onMouseEnter={() => {
                  playHoverSound();
                  // Pre-load current audio zone when hovering card
                  setAudioZone(movie.soundZone);
                }}
                className={`relative aspect-[2/3] w-full rounded-2xl overflow-hidden glass-panel border border-white/[0.04] bg-white/[0.025] backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.45)] transition-all duration-500 group-hover:-translate-y-[2px] ease-[cubic-bezier(0.16,1,0.3,1)] ${itemGlowColor} hover:border-white/20 block`}
              >
                {/* Poster graphic */}
                <Image
                  src={movie.poster}
                  alt={movie.title}
                  fill
                  sizes="(max-w-768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035] filter brightness-[0.78] group-hover:brightness-[0.9]"
                />

                {/* Layered cinematic gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20 pointer-events-none" />

                {/* Custom glowing sweep overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.05] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

                {/* Floating tags */}
                <div className="absolute top-4 left-4 z-10 flex gap-2">
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] bg-black/60 backdrop-blur-md px-2.5 py-1 border border-white/10 rounded text-slate-300">
                    {movie.timelinePlacement.split(" - ")[0]}
                  </span>
                </div>

                {/* Info summary overlay inside card */}
                <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col gap-2.5 z-20 backdrop-blur-sm bg-black/10">
                  <span className={`text-[9px] font-black uppercase tracking-[0.2em] block ${
                    movie.id === "neelo-nenu" ? "text-sky-300" : movie.id === "strings-of-you" ? "text-cyan-400" : "text-red-400"
                  }`}>
                    {movie.releaseStatus}
                  </span>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-t from-transparent via-white/[0.03] to-transparent" />
                  <h3 className="text-[1.35rem] font-black uppercase tracking-[0.08em] text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.18)] transition-all duration-500 group-hover:drop-shadow-[0_0_18px_rgba(255,255,255,0.24)]">
                    {movie.title}
                  </h3>
                  <p className="text-[11px] italic text-slate-200/80 drop-shadow-[0_0_8px_rgba(255,255,255,0.08)] tracking-[0.04em] line-clamp-2">
                    {movie.tagline}
                  </p>
                </div>
              </Link>

              {/* Text links underneath card */}
              <div className="mt-4 flex items-center justify-between px-2">
                <span className="text-[10px] font-semibold text-slate-300/70 tracking-[0.1em]">{movie.genre}</span>
                <Link
                  href={`/movies/${movie.id}`}
                  onClick={playClickSound}
                  onMouseEnter={playHoverSound}
                  className={`text-[10px] font-bold uppercase tracking-[0.15em] flex items-center gap-1.5 transition-all duration-300 text-slate-300 hover:text-white ${
  isEmotional ? "hover:text-amber-400" : "hover:text-cyan-400"
}`}
                >
                  Enter Realm
                  <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* RCU connectivity badge */}
      <div className="mt-24 glass-panel border border-white/[0.04] rounded-2xl p-8 max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-6 select-none relative overflow-hidden">
        <div className={`absolute top-0 bottom-0 left-0 w-1 ${isEmotional ? "bg-amber-500" : "bg-cyan-500"} transition-colors duration-1000`} />
        
        <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
          <Compass size={22} className={accentTextClass} />
        </div>
        <div className="flex-grow text-center md:text-left">
          <h4 className="text-sm font-bold uppercase tracking-[0.1em] text-slate-200 mb-1">
            Multiverse Synchronization
          </h4>
          <p className="text-xs text-slate-400/80 tracking-[0.05em] leading-relaxed">
            All stories within the Realm Cinematic Universe remain interconnected through dimensional fractures, emotional anomalies, and Nexus events. Every archive entry contains hidden connections influencing the future of the timeline.
          </p>
        </div>
      </div>
    </div>
  );
}
