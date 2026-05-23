"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUniverse } from "@/context/UniverseContext";
import { useScrollVolume } from "@/hooks/useScrollVolume";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { Play, Calendar, Film, ArrowRight, Activity, Award } from "lucide-react";

// Central RCU Movie data
export const RCU_MOVIES = [
  {
    id: "shadow-knight",
    title: "Shadow Knight",
    tagline: "The darkness is his only shield.",
    synopsis: "In a city rotting with corruption and dark technological experiments, an industrialist becomes the vigilante Shadow Knight to expose a shadowy syndicate. But as he digs deeper, he realizes the syndicate's experiments tie into an ancient cosmic rift that threatens the fabric of his reality.",
    genre: "Action / Sci-Fi / Cyberpunk",
    releaseStatus: "Released (2024)",
    releaseDate: "November 14, 2024",
    poster: "/images/shadow-knight.png",
    accentColor: "rgba(225, 29, 72, 1)", // Crimson Red
    glowColor: "shadow-[0_0_30px_rgba(225,29,72,0.35)]",
    soundZone: "shadow-knight" as const,
    connectedFilms: ["Strings of You", "Neelo Nenu"],
    relatedCharacters: ["Shadow Knight", "Rudra"],
    timelinePlacement: "Phase 1 - Origin",
    nexusInfluence: "Unlocks the Dark Tech Rift which triggers the cosmic search in Strings of You.",
    futureReferences: "Leads directly to RCU Phase 2: Convergence."
  },
  {
    id: "strings-of-you",
    title: "Strings of You",
    tagline: "Two souls, connected across dimensions.",
    synopsis: "An astrophysicist and a neural programmer find themselves sharing telepathic dreams and neural synapses. When they discover they are from parallel timeline branches moving closer to collision, they must find a way to stabilize their connection before their universes tear each other apart.",
    genre: "Sci-Fi / Drama / Romance",
    releaseStatus: "Released (2025)",
    releaseDate: "May 2, 2025",
    poster: "/images/strings-of-you.png",
    accentColor: "rgba(6, 182, 212, 1)", // Cyan
    glowColor: "shadow-[0_0_30px_rgba(6,182,212,0.35)]",
    soundZone: "strings-of-you" as const,
    connectedFilms: ["Shadow Knight", "Neelo Nenu"],
    relatedCharacters: ["Reflection Girl", "Rudra"],
    timelinePlacement: "Phase 1 - Expansion",
    nexusInfluence: "Establishes the neural bridge that lets Reflection Girl perceive alternate mirrors.",
    futureReferences: "Foreshadows the Multiverse War in Phase 3."
  },
  {
    id: "neelo-nenu",
    title: "Neelo Nenu",
    tagline: "The mirror holds the ultimate truth.",
    synopsis: "A young woman traumatized by a mysterious event discovers that her reflection behaves independently. Soon, she learns she is interacting with her own alternate-universe duplicates through reflective surfaces, uncovering a dark multiverse conspiracy to erase her from existence.",
    genre: "Psychological / Sci-Fi / Mystery",
    releaseStatus: "Upcoming (2026)",
    releaseDate: "December 18, 2026",
    poster: "/images/neelo-nenu.png",
    accentColor: "rgba(168, 85, 247, 1)", // Purple / Silver
    glowColor: "shadow-[0_0_30px_rgba(168,85,247,0.35)]",
    soundZone: "neelo-nenu" as const,
    connectedFilms: ["Strings of You", "Shadow Knight"],
    relatedCharacters: ["Reflection Girl", "Rudra"],
    timelinePlacement: "Phase 2 - Convergence",
    nexusInfluence: "A massive Nexus Event occurs when she breaks the main reflection mirror, triggering timeline collapse.",
    futureReferences: "Direct precursor to RCU Phase 3: Multiverse War."
  }
];

export default function HomePage() {
  const { mode, setAudioZone, playClickSound, playHoverSound } = useUniverse();
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [activeVisualizer, setActiveVisualizer] = useState<number[]>([]);

  // 1. Activate scroll volume coupling
  useScrollVolume();

  // 2. Parallax camera effect calculations
  const parallaxX = useMotionValue(0);
  const parallaxY = useMotionValue(0);
  const springX = useSpring(parallaxX, { stiffness: 45, damping: 20 });
  const springY = useSpring(parallaxY, { stiffness: 45, damping: 20 });

  useEffect(() => {
    setAudioZone("home");

    const handleMouseMove = (e: MouseEvent) => {
      // Don't calculate on mobile screens to save battery/performance
      if (window.innerWidth < 768) return;

      const { innerWidth, innerHeight } = window;
      const offsetX = (e.clientX - innerWidth / 2) / (innerWidth / 2); // -1 to 1
      const offsetY = (e.clientY - innerHeight / 2) / (innerHeight / 2); // -1 to 1
      parallaxX.set(offsetX * 14); // Sleek, restrained 14px maximum offset
      parallaxY.set(offsetY * 14);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleCarouselChange = (index: number) => {
    playClickSound();
    setActiveCarouselIndex(index);
    setAudioZone(RCU_MOVIES[index].soundZone);
  };

  useEffect(() => {
    let interval: any;
    if (isVideoPlaying) {
      interval = setInterval(() => {
        const heights = Array.from({ length: 28 }, () => Math.floor(Math.random() * 24) + 4);
        setActiveVisualizer(heights);
      }, 95);
    } else {
      setActiveVisualizer([]);
    }
    return () => clearInterval(interval);
  }, [isVideoPlaying]);

  const activeMovie = RCU_MOVIES[activeCarouselIndex];
  const isEmotional = mode === "emotional";

  const glowTextClass = isEmotional ? "cinematic-glow-text-emotional text-amber-400" : "cinematic-glow-text-core text-cyan-400";
  const accentBgClass = isEmotional ? "bg-amber-500" : "bg-cyan-500";
  const accentBorderClass = isEmotional ? "border-amber-500/30 hover:border-amber-500/80" : "border-cyan-500/30 hover:border-cyan-500/80";
  
  // Fog colors adapting to universe mode
  const fogColor1 = isEmotional ? "bg-amber-950/3" : "bg-cyan-950/3";
  const fogColor2 = isEmotional ? "bg-purple-950/3" : "bg-red-950/3";

  return (
    <div className="w-full relative z-10">
      
      {/* 1. HERO SECTION (Evolved with Parallax & Volumetric Fog) */}
      <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center text-center overflow-hidden px-4 select-none">
        
        {/* Layered slow-moving volumetric fog */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className={`absolute top-[15%] left-[5%] w-[450px] md:w-[650px] h-[450px] md:h-[650px] rounded-full blur-[100px] volumetric-fog-layer-1 transition-colors duration-1000 ${fogColor1}`} />
          <div className={`absolute bottom-[15%] right-[5%] w-[550px] md:w-[750px] h-[550px] md:h-[750px] rounded-full blur-[100px] volumetric-fog-layer-2 transition-colors duration-1000 ${fogColor2}`} />
        </div>

        {/* Backdrop Glow Map */}
        <div className={`absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full mix-blend-screen opacity-45 blur-[130px] transition-colors duration-1000 ${isEmotional ? "bg-amber-500/10" : "bg-cyan-500/10"} pointer-events-none`} />

        {/* Spring Camera Parallax Frame Wrapper */}
        <motion.div
          style={{ x: springX, y: springY }}
          className="max-w-4xl relative z-10 flex flex-col items-center"
        >
          <div className="text-[10px] md:text-xs font-bold tracking-[0.6em] text-slate-400 uppercase mb-4">
            LIMITLESS STUDIOS PRESENTS
          </div>

          <h1 className="text-4xl md:text-7xl font-black tracking-[0.4em] mb-4 text-white uppercase select-none relative">
            REALM
            <span className="block text-2xl md:text-4xl font-light tracking-[0.8em] text-slate-300 mt-2">
              CINEMATIC UNIVERSE
            </span>
          </h1>

          <div className={`w-36 h-[1.5px] my-6 ${accentBgClass} opacity-30 transition-colors duration-1000`} />

          <p className={`text-sm md:text-lg tracking-[0.3em] font-semibold uppercase ${glowTextClass} transition-all duration-1000`}>
            “Stories Connected Beyond Worlds.”
          </p>
          
          <div className="mt-12 flex gap-4 md:gap-6 flex-wrap justify-center">
            <Link
              href="/movies"
              onClick={playClickSound}
              onMouseEnter={playHoverSound}
              className="px-8 py-3 bg-white text-black font-bold tracking-[0.25em] text-[10px] rounded-full uppercase hover:scale-105 transition-all duration-300 shadow-lg flex items-center gap-2"
            >
              Explore Films
              <ArrowRight size={12} />
            </Link>
            <a
              href="#trailer-section"
              onClick={(e) => {
                playClickSound();
                e.preventDefault();
                document.getElementById("trailer-section")?.scrollIntoView({ behavior: "smooth" });
              }}
              onMouseEnter={playHoverSound}
              className={`px-8 py-3 bg-transparent border ${accentBorderClass} text-slate-200 hover:text-white font-bold tracking-[0.25em] text-[10px] rounded-full uppercase transition-all duration-300`}
            >
              Watch Teaser
            </a>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 flex flex-col items-center gap-1.5 opacity-40 animate-pulse">
          <span className="text-[8px] tracking-[0.3em] uppercase text-slate-500">Scroll down</span>
          <div className="w-[1px] h-6 bg-slate-500" />
        </div>
      </section>

      {/* 2. FEATURED CAROUSEL SECTION */}
      <section className="py-20 md:py-28 px-4 md:px-8 max-w-7xl mx-auto border-t border-white/[0.03]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-550 mb-2">Featured releases</h2>
            <h3 className="text-2xl md:text-4xl font-extrabold tracking-[0.1em] text-slate-100 uppercase">The RCU Trilogy</h3>
          </div>
          <Link
            href="/movies"
            onClick={playClickSound}
            onMouseEnter={playHoverSound}
            className={`text-[10px] font-semibold tracking-[0.2em] uppercase flex items-center gap-2 text-slate-450 hover:${isEmotional ? "text-amber-400" : "text-cyan-400"} transition-colors duration-300`}
          >
            View all movies
            <ArrowRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Active poster */}
          <div className="lg:col-span-5 flex justify-center relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMovie.id}
                initial={{ opacity: 0, x: -30, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 30, scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-[280px] md:w-[350px] aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl group cursor-pointer"
              >
                <Image
                  src={activeMovie.poster}
                  alt={activeMovie.title}
                  fill
                  className="object-cover group-hover:scale-103 transition-transform duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 pointer-events-none" />
                <div className={`absolute -inset-1 opacity-0 group-hover:opacity-100 rounded-2xl blur-lg transition-opacity duration-500 pointer-events-none -z-10 bg-gradient-to-t ${activeMovie.accentColor}`} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Selector details */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex gap-3 border-b border-white/[0.04] pb-4 overflow-x-auto">
              {RCU_MOVIES.map((movie, idx) => (
                <button
                  key={movie.id}
                  onClick={() => handleCarouselChange(idx)}
                  onMouseEnter={playHoverSound}
                  className={`text-[10px] font-bold tracking-[0.2em] uppercase py-2 px-4 rounded-lg transition-all duration-355 border ${
                    idx === activeCarouselIndex
                      ? isEmotional
                        ? "border-amber-500/40 text-amber-400 bg-amber-500/5 shadow-[0_0_10px_rgba(245,158,11,0.15)]"
                        : "border-cyan-500/40 text-cyan-400 bg-cyan-500/5 shadow-[0_0_10px_rgba(6,182,212,0.15)]"
                      : "border-transparent text-slate-500 hover:text-slate-350"
                  }`}
                >
                  {movie.title}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeMovie.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col gap-4"
              >
                <div className="flex items-center gap-3">
                  <span className={`text-[8px] font-black uppercase tracking-[0.15em] px-3 py-1 rounded border border-white/5 bg-black/40`}>
                    {activeMovie.releaseStatus}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 tracking-[0.1em]">{activeMovie.genre}</span>
                </div>

                <h3 className="text-3xl md:text-4xl font-extrabold tracking-[0.05em] text-white uppercase">
                  {activeMovie.title}
                </h3>
                
                <p className={`text-sm italic font-medium tracking-[0.05em] ${isEmotional ? "text-amber-400" : "text-cyan-400"} transition-colors duration-1000`}>
                  "{activeMovie.tagline}"
                </p>

                <p className="text-xs md:text-sm text-slate-400 tracking-[0.06em] leading-relaxed">
                  {activeMovie.synopsis}
                </p>

                <div className="grid grid-cols-2 gap-4 mt-4 pt-6 border-t border-white/[0.04]">
                  <div>
                    <h5 className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-1">Timeline position</h5>
                    <p className="text-xs font-semibold text-slate-300 tracking-[0.08em]">{activeMovie.timelinePlacement}</p>
                  </div>
                  <div>
                    <h5 className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-1">Nexus Influence</h5>
                    <p className="text-xs font-semibold text-slate-300 tracking-[0.08em] truncate">{activeMovie.nexusInfluence}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    href={`/movies/${activeMovie.id}`}
                    onClick={playClickSound}
                    onMouseEnter={playHoverSound}
                    className={`px-6.5 py-3 ${accentBgClass} hover:opacity-90 text-black font-bold tracking-[0.2em] text-[10px] rounded-full uppercase transition-all duration-300 inline-block`}
                  >
                    View Details
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 3. MOCK VIDEO TEASER SECTION */}
      <section id="trailer-section" className="py-20 md:py-28 bg-[#030303]/40 border-t border-b border-white/[0.03] relative overflow-hidden">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] rounded-full mix-blend-screen opacity-20 blur-[150px] transition-colors duration-1000 ${isEmotional ? "bg-amber-500/10" : "bg-cyan-500/10"} pointer-events-none`} />

        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-[10px] font-bold uppercase tracking-[0.3em] ${isEmotional ? "text-amber-400" : "text-cyan-400"} mb-2 transition-colors duration-1000`}>Cinematic trailer</h2>
            <h3 className="text-2xl md:text-3xl font-extrabold tracking-[0.1em] text-slate-100 uppercase">Teaser: Nexus Beyond</h3>
          </div>

          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden glass-panel border border-white/[0.06] shadow-2xl flex items-center justify-center group">
            {isVideoPlaying ? (
              <div className="absolute inset-0 bg-black flex flex-col items-center justify-center">
                <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" />

                <div className="text-center px-4 max-w-lg z-10 flex flex-col items-center">
                  <motion.div
                    animate={{ scale: [1, 1.03, 1] }}
                    transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                    className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center mb-6"
                  >
                    <Activity className={`w-6 h-6 animate-pulse ${isEmotional ? "text-amber-400" : "text-cyan-400"}`} />
                  </motion.div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400 font-extrabold mb-1">RCU STREAM ACTIVE</p>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-slate-500">Transmitting holographic trailer sequence...</p>
                  
                  <div className="flex gap-1 items-end h-8 mt-12">
                    {activeVisualizer.map((height, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: `${height}px` }}
                        transition={{ type: "spring", damping: 15 }}
                        className={`w-[3px] rounded-full ${isEmotional ? "bg-amber-500" : "bg-cyan-500"} opacity-70`}
                      />
                    ))}
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between z-20">
                  <button
                    onClick={() => { playClickSound(); setIsVideoPlaying(false); }}
                    className="px-4 py-2 border border-white/20 hover:border-white/60 text-slate-350 hover:text-white rounded-full text-[9px] font-bold tracking-[0.15em] uppercase cursor-pointer transition-colors duration-300"
                  >
                    Stop stream
                  </button>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-650 animate-ping" />
                    <span className="text-[9px] font-semibold text-slate-400 tracking-[0.1em] uppercase">LIVE SYNAPSE FEED</span>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="absolute inset-0 bg-cover bg-center filter brightness-[0.25] blur-[1px] transition-all duration-700 group-hover:scale-101" style={{ backgroundImage: "url('/images/strings-of-you.png')" }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black pointer-events-none" />

                <div className="relative text-center px-4 z-10 flex flex-col items-center">
                  <button
                    onClick={() => { playClickSound(); setIsVideoPlaying(true); }}
                    onMouseEnter={playHoverSound}
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-full border border-white/20 hover:border-white/50 bg-black/60 flex items-center justify-center cursor-pointer transition-all duration-300 ${isEmotional ? "hover:shadow-[0_0_30px_rgba(245,158,11,0.25)]" : "hover:shadow-[0_0_30px_rgba(6,182,212,0.25)]"} group-hover:scale-105 relative`}
                  >
                    <Play size={20} className="fill-current ml-1 text-white" />
                  </button>
                  <p className="mt-6 text-xs font-bold uppercase tracking-[0.25em] text-slate-300">Play Cinematic Broadcast</p>
                  <p className="mt-1 text-[9px] uppercase tracking-[0.15em] text-slate-500">Phase 1 & 2 Synthesis</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 4. TIMELINE PREVIEW SECTION */}
      <section className="py-20 md:py-28 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className={`text-[10px] font-bold uppercase tracking-[0.3em] ${isEmotional ? "text-amber-400" : "text-cyan-400"} mb-2 transition-colors duration-1000`}>Universe progression</h2>
          <h3 className="text-2xl md:text-3xl font-extrabold tracking-[0.1em] text-slate-100 uppercase">Chronological Alignment</h3>
        </div>

        <div className="relative w-full py-10 flex flex-col md:flex-row gap-6 md:gap-4 justify-between items-stretch">
          <div className="absolute left-[24px] md:left-0 md:top-[68px] bottom-0 md:bottom-auto w-[1.5px] md:w-full md:h-[1.5px] bg-slate-800 z-0" />
          
          {[
            { phase: "PHASE 1", title: "Origins", desc: "Foundational cosmic rifts & dark tech awakenings.", release: "Shadow Knight", status: "Active" },
            { phase: "PHASE 2", title: "Convergence", desc: "Interconnected branches collide & reflection loops collapse.", release: "Neelo Nenu", status: "Active" },
            { phase: "PHASE 3", title: "Multiverse War", desc: "Total timeline collision & reality collapse events.", release: "Nexus Beyond", status: "Concept" }
          ].map((node, i) => (
            <div key={i} className="relative z-10 flex md:flex-col gap-6 md:gap-4 md:w-1/3 items-start pl-6 md:pl-0 pr-4">
              <div className={`w-12 h-12 rounded-full border border-slate-800 bg-[#020406] flex items-center justify-center font-bold text-[9px] tracking-widest text-slate-400 select-none shadow-md ${accentBorderClass} transition-colors duration-500`}>
                0{i + 1}
              </div>

              <div className="md:mt-4 flex-grow">
                <span className={`text-[9px] font-extrabold tracking-[0.2em] ${isEmotional ? "text-amber-400" : "text-cyan-400"} uppercase block mb-1 transition-colors duration-1000`}>
                  {node.phase}
                </span>
                <h4 className="text-base font-bold text-slate-200 uppercase tracking-[0.05em] mb-2">{node.title}</h4>
                <p className="text-xs text-slate-500 tracking-[0.05em] leading-relaxed mb-3 max-w-xs">{node.desc}</p>
                <div className="flex items-center gap-2">
                  <Film size={10} className="text-slate-650" />
                  <span className="text-[10px] font-semibold text-slate-405 tracking-[0.05em]">{node.release}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/timeline"
            onClick={playClickSound}
            onMouseEnter={playHoverSound}
            className={`px-8 py-3 bg-transparent border border-white/10 hover:border-white/30 text-slate-350 hover:text-slate-100 font-bold tracking-[0.2em] text-[10px] rounded-full uppercase transition-all duration-300 inline-flex items-center gap-2`}
          >
            Enter Interactive Timeline
            <ArrowRight size={12} />
          </Link>
        </div>
      </section>
    </div>
  );
}
