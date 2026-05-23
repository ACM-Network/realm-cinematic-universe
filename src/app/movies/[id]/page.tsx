"use client";

import React, { use, useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUniverse } from "@/context/UniverseContext";
import { useScrollVolume } from "@/hooks/useScrollVolume";
import { RCU_MOVIES } from "@/app/page";
import { motion, AnimatePresence } from "framer-motion";
import { Film, Calendar, Compass, ArrowLeft, Play, Pause, Layers, HelpCircle } from "lucide-react";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

interface Drop {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
}

export default function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { mode, setAudioZone, playClickSound, playHoverSound } = useUniverse();
  
  const [isPlayingSoundtrack, setIsPlayingSoundtrack] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [mirrorHovered, setMirrorHovered] = useState(false);
  const [mirrorCoords, setMirrorCoords] = useState({ x: 0, y: 0 });
  const [showIntroCurtain, setShowIntroCurtain] = useState(true);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  
  const mirrorRef = useRef<HTMLDivElement | null>(null);
  const rainCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const movie = RCU_MOVIES.find((m) => m.id === id);

  // Bind scroll volume adaptation
  useScrollVolume();

  useEffect(() => {
    if (movie) {
      setAudioZone(movie.soundZone);
      
      // Auto fade out curtain after 1.5 seconds
      const timer = setTimeout(() => {
        setShowIntroCurtain(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [movie]);

  // Rain particle loop inside the mirror (Specific to Neelo Nenu, restrained)
  useEffect(() => {
    if (movie?.id !== "neelo-nenu" || showIntroCurtain) return;
    const canvas = rainCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let drops: Drop[] = [];
    const maxDrops = 25; // Quiet, restrained rain counts (no clutter)

    const resize = () => {
      if (canvas) {
        canvas.width = canvas.parentElement?.clientWidth || 600;
        canvas.height = canvas.parentElement?.clientHeight || 350;
      }
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < maxDrops; i++) {
      drops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: Math.random() * 12 + 8,
        speed: Math.random() * 2 + 1.5, // Slow, calm drops
        opacity: Math.random() * 0.2 + 0.05 // Soft, quiet visual weight
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      drops.forEach((d) => {
        ctx.strokeStyle = `rgba(165, 243, 252, ${d.opacity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x, d.y + d.length);
        ctx.stroke();

        d.y += d.speed;
        if (d.y > canvas.height) {
          d.y = -d.length;
          d.x = Math.random() * canvas.width;
        }
      });
      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, [movie, showIntroCurtain]);

  if (!movie) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-2xl font-bold uppercase tracking-widest text-slate-400">File Not Found</h1>
        <Link href="/movies" className="mt-8 px-6 py-2.5 bg-slate-800 rounded-full text-xs font-semibold uppercase tracking-wider">
          Return to Catalog
        </Link>
      </div>
    );
  }

  // Neelo Nenu Water Ripple clicks
  const handleMirrorClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (movie.id !== "neelo-nenu") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = {
      id: Date.now(),
      x,
      y
    };

    setRipples((prev) => [...prev, newRipple]);
    playClickSound();

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 2800);
  };

  const handleMirrorMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mirrorRef.current) return;
    const rect = mirrorRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMirrorCoords({ x, y });
  };

  const isEmotional = mode === "emotional";
  const isNeelo = movie.id === "neelo-nenu";
  const isStrings = movie.id === "strings-of-you";
  
  const movieThemeColor = isNeelo ? "rgba(168, 85, 247, 1)" : isStrings ? "rgba(6, 182, 212, 1)" : "rgba(225, 29, 72, 1)";
  const movieGlowText = isNeelo ? "text-purple-400" : isStrings ? "text-cyan-400" : "text-red-400";
  const movieGlowBorder = isNeelo ? "border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]" : isStrings ? "border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]" : "border-red-500/30 shadow-[0_0_15px_rgba(225,29,72,0.15)]";
  const movieBgClass = isNeelo ? "from-purple-950/20 via-black/80 to-black" : isStrings ? "from-cyan-950/20 via-black/80 to-black" : "from-red-950/20 via-black/80 to-black";

  // Lore quotes selection matching cinema rule
  const movieQuote = isNeelo
    ? "“Every mirror is a door to a duplicate waiting to take my place.” — Reflection Girl"
    : isStrings
    ? "“Our timelines are colliding, but in this dream, we are stable.” — Reflection Girl"
    : "“I built the suit to lock the rift, but I became the anchor.” — Shadow Knight";

  const trackName = isNeelo ? "Through the Looking Glass" : isStrings ? "Parallel Synapses" : "Rift Protocol (Main Theme)";

  return (
    <div className={`w-full min-h-screen bg-gradient-to-b ${movieBgClass} relative z-10 transition-colors duration-1000 pb-20`}>
      
      {/* Dynamic Intro Curtain Wipe */}
      <AnimatePresence>
        {showIntroCurtain && (
          <motion.div
            initial={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[9999] bg-[#020406] flex items-center justify-center pointer-events-none"
          >
            <div className="text-center px-4">
              <motion.h2
                initial={{ letterSpacing: "0.2em", opacity: 0 }}
                animate={{ letterSpacing: "0.5em", opacity: [0, 1, 1] }}
                transition={{ duration: 1.2 }}
                className="text-lg md:text-xl font-extrabold uppercase tracking-[0.4em] text-slate-300"
              >
                {movie.title}
              </motion.h2>
              <span className={`text-[8px] font-bold uppercase tracking-widest block mt-2 ${movieGlowText}`}>
                Opening Archival Records...
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[200px] rounded-full mix-blend-screen opacity-15 blur-[120px] pointer-events-none"
        style={{ backgroundColor: movieThemeColor }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8">
        
        {/* Navigation */}
        <Link
          href="/movies"
          onClick={playClickSound}
          onMouseEnter={playHoverSound}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 hover:text-slate-200 transition-colors duration-300 mb-10 group"
        >
          <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
          Return to Registry
        </Link>

        {/* Billboard Banner */}
        <div className="relative w-full h-[55vh] md:h-[65vh] rounded-3xl overflow-hidden border border-white/[0.04] mb-4 shadow-2xl flex items-end">
          <div className="absolute inset-0 z-0">
            <Image
              src={movie.poster}
              alt={movie.title}
              fill
              className="object-cover object-top scale-105 select-none"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020406] via-[#020406]/55 to-black/35 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#020406] via-transparent to-transparent pointer-events-none" />
          </div>

          <div className="relative z-10 p-6 md:p-12 max-w-3xl flex flex-col gap-3 select-none">
            <div className="flex items-center gap-3">
              <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded border ${movieGlowBorder} bg-black/60`}>
                {movie.releaseStatus}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 tracking-[0.1em]">{movie.genre}</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-[0.08em] text-white">
              {movie.title}
            </h1>

            <p className={`text-xs md:text-sm font-medium tracking-[0.05em] uppercase italic ${movieGlowText}`}>
              "{movie.tagline}"
            </p>
          </div>
        </div>

        {/* Refined Mirrored Title Reflection */}
        <div className="hidden md:block w-full h-16 overflow-hidden select-none mb-12">
          <h2 className="text-5xl lg:text-6xl font-black uppercase tracking-[0.08em] text-center text-white/10 mirrored-text-reflection">
            {movie.title}
          </h2>
        </div>

        {/* Core Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Synopsis, Soundtrack, Reflections */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Synopsis */}
            <div className="glass-panel border border-white/[0.04] rounded-2xl p-6 md:p-8 flex flex-col gap-4">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">Logline & Synopsis</h2>
              <p className="text-sm md:text-base text-slate-350 tracking-[0.05em] leading-relaxed">
                {movie.synopsis}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-white/[0.04]">
                <div>
                  <h5 className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-1">Release Date</h5>
                  <p className="text-xs font-semibold text-slate-350 tracking-[0.05em]">{movie.releaseDate}</p>
                </div>
                <div>
                  <h5 className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-1">Director</h5>
                  <p className="text-xs font-semibold text-slate-350 tracking-[0.05em]">Surya Gokul</p>
                </div>
                <div>
                  <h5 className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-1">Producer</h5>
                  <p className="text-xs font-semibold text-slate-350 tracking-[0.05em]">Limitless Studios</p>
                </div>
              </div>
            </div>

            {/* Custom Interactive Quote Banner (NEW) */}
            <div className="relative p-8 rounded-2xl border border-white/[0.02] bg-white/[0.01] overflow-hidden select-none shadow-sm">
              <div className="absolute top-0 left-0 w-[2px] h-full bg-slate-800" />
              <p className="text-xs md:text-sm font-semibold tracking-[0.1em] text-slate-300 italic uppercase">
                {movieQuote}
              </p>
            </div>

            {/* Soundtrack Section */}
            <div className="glass-panel border border-white/[0.04] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 justify-between">
              <div className="flex items-center gap-4 text-center md:text-left">
                <button
                  onClick={() => {
                    playClickSound();
                    setIsPlayingSoundtrack(!isPlayingSoundtrack);
                  }}
                  className={`w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-white/5 cursor-pointer hover:scale-105 transition-transform ${
                    isPlayingSoundtrack ? (isNeelo ? "shadow-[0_0_15px_rgba(168,85,247,0.3)] border-purple-500" : isStrings ? "shadow-[0_0_15px_rgba(6,182,212,0.3)] border-cyan-500" : "shadow-[0_0_15px_rgba(225,29,72,0.3)] border-red-500") : ""
                  }`}
                >
                  {isPlayingSoundtrack ? <Pause size={14} className="text-white" /> : <Play size={14} className="text-white ml-0.5" />}
                </button>
                <div>
                  <h4 className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">Soundtrack feed</h4>
                  <p className="text-xs font-bold text-slate-200 tracking-[0.05em]">{trackName}</p>
                  <p className="text-[9px] text-slate-550 tracking-[0.05em] uppercase">Original Score synthesis</p>
                </div>
              </div>
              
              <div className="flex gap-0.5 items-end h-8 w-40 justify-center">
                {Array.from({ length: 20 }).map((_, idx) => {
                  const animDuration = 0.4 + (idx % 4) * 0.15;
                  return (
                    <div
                      key={idx}
                      className={`w-[2.5px] rounded-full transition-all duration-300 ${
                        isPlayingSoundtrack 
                          ? isNeelo 
                            ? "bg-purple-500 animate-[eq_0.6s_ease-in-out_infinite_alternate]" 
                            : isStrings 
                            ? "bg-cyan-500 animate-[eq_0.6s_ease-in-out_infinite_alternate]" 
                            : "bg-red-500 animate-[eq_0.6s_ease-in-out_infinite_alternate]"
                          : "bg-slate-800 h-1.5"
                      }`}
                      style={{
                        animationDuration: `${animDuration}s`,
                        animationDelay: `${idx * 0.05}s`
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* NEELO NENU REFLECTION EXPERIENCE */}
            {isNeelo && (
              <div className="flex flex-col gap-4">
                <h3 className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-slate-550">Active Reflection Interface</h3>
                <div
                  ref={mirrorRef}
                  onClick={handleMirrorClick}
                  onMouseMove={handleMirrorMouseMove}
                  onMouseEnter={() => setMirrorHovered(true)}
                  onMouseLeave={() => { setMirrorHovered(false); setShowEasterEgg(false); }}
                  className="relative h-[320px] md:h-[400px] w-full rounded-2xl mirror-glass overflow-hidden cursor-crosshair flex flex-col items-center justify-center border border-white/10 select-none group"
                >
                  {/* Subtle water ripple background loop */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02)_0%,transparent_70%)]" />

                  {/* Restrained Canvas Rain Drizzle overlay inside the mirror */}
                  <canvas ref={rainCanvasRef} className="absolute inset-0 pointer-events-none z-0" />

                  {/* Click-triggered water ripples */}
                  {ripples.map((ripple) => (
                    <div
                      key={ripple.id}
                      className="ripple-circle"
                      style={{
                        left: `${ripple.x}px`,
                        top: `${ripple.y}px`,
                        width: "80px",
                        height: "80px",
                        marginLeft: "-40px",
                        marginTop: "-40px"
                      }}
                    />
                  ))}

                  {/* Hidden reflection anomaly trigger point */}
                  <button
                    onMouseEnter={() => {
                      playHoverSound();
                      setShowEasterEgg(true);
                    }}
                    className="absolute top-4 right-4 w-2 h-2 rounded-full bg-purple-500/30 hover:bg-purple-400 animate-ping z-25 cursor-help pointer-events-auto"
                    title="Anomalous glitch node"
                  />

                  {/* Faint holographic reflection silhouette */}
                  <motion.div
                    className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none mix-blend-screen opacity-[0.04] group-hover:opacity-[0.1] transition-opacity duration-1000"
                    style={{
                      x: mirrorHovered ? (mirrorCoords.x - (mirrorRef.current?.clientWidth || 0) / 2) * -0.05 : 0,
                      y: mirrorHovered ? (mirrorCoords.y - (mirrorRef.current?.clientHeight || 0) / 2) * -0.05 : 0,
                    }}
                  >
                    <div className="relative w-[180px] md:w-[220px] h-[180px] md:h-[220px]">
                      <Image
                        src="/images/reflection-girl.png"
                        alt="Reflection silhouette"
                        fill
                        className="object-contain filter grayscale brightness-[2.2] blur-[1.5px] select-none pointer-events-none"
                      />
                    </div>
                  </motion.div>

                  {/* Dynamic Instructions or Glitched Easter Egg Text */}
                  <div className="relative z-10 text-center px-4 max-w-sm pointer-events-none flex flex-col items-center gap-2">
                    <AnimatePresence mode="wait">
                      {showEasterEgg ? (
                        <motion.div
                          key="easteregg"
                          initial={{ opacity: 0, filter: "blur(4px)" }}
                          animate={{ opacity: 1, filter: "blur(0px)" }}
                          exit={{ opacity: 0, filter: "blur(4px)" }}
                          className="flex flex-col items-center gap-1.5"
                        >
                          <HelpCircle className="text-purple-400" size={16} />
                          <p className="text-[10px] uppercase tracking-[0.25em] font-black text-purple-300">SYSTEM DISCREPANCY</p>
                          <p className="text-[9px] uppercase tracking-[0.15em] text-slate-400 italic">"Is it me or my echo looking back?"</p>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="instructions"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col items-center gap-1.5"
                        >
                          <Layers className="text-purple-400/40 group-hover:text-purple-400 group-hover:scale-110 transition-all duration-700 mb-1" size={18} />
                          <p className="text-[9px] uppercase tracking-[0.2em] font-extrabold text-slate-450">MIRROR SURFACE STABLE</p>
                          <p className="text-[8px] uppercase tracking-[0.15em] text-slate-550">Touch glass to distort surface ripples. Hover to align echo.</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Connected Universe Info */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="glass-panel border border-white/[0.04] rounded-2xl p-6 flex flex-col gap-4 select-none">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">Universe Reference</h3>
              
              <div className="flex flex-col gap-3">
                <div>
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Timeline Placement</span>
                  <div className="text-xs font-bold text-slate-200 tracking-wider uppercase">
                    {movie.timelinePlacement}
                  </div>
                </div>
                <div className="w-full h-[1px] bg-white/[0.03]" />
                <div>
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Nexus Influence</span>
                  <div className="text-xs text-slate-450 tracking-wide leading-relaxed">
                    {movie.nexusInfluence}
                  </div>
                </div>
                <div className="w-full h-[1px] bg-white/[0.03]" />
                <div>
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Future references</span>
                  <div className="text-xs text-slate-450 tracking-wide leading-relaxed">
                    {movie.futureReferences}
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel border border-white/[0.04] rounded-2xl p-6 flex flex-col gap-4">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">Connected Films</h3>
              <div className="flex flex-col gap-3">
                {movie.connectedFilms.map((filmName) => {
                  const connFilm = RCU_MOVIES.find((f) => f.title === filmName);
                  if (!connFilm) return null;
                  return (
                    <Link
                      key={connFilm.id}
                      href={`/movies/${connFilm.id}`}
                      onClick={playClickSound}
                      onMouseEnter={playHoverSound}
                      className="group/item flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.02] border border-transparent hover:border-white/[0.03] transition-all duration-300"
                    >
                      <div className="relative w-10 h-14 rounded-lg overflow-hidden flex-shrink-0">
                        <Image src={connFilm.poster} alt={connFilm.title} fill className="object-cover" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-xs font-bold text-slate-350 group-hover/item:text-white transition-colors uppercase tracking-[0.05em]">{connFilm.title}</h4>
                        <span className="text-[8px] font-bold text-slate-550 uppercase tracking-wider">{connFilm.timelinePlacement.split(" - ")[0]}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="glass-panel border border-white/[0.04] rounded-2xl p-6 flex flex-col gap-4">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">Key characters</h3>
              <div className="flex flex-col gap-3">
                {movie.relatedCharacters.map((charName) => {
                  const charId = charName.toLowerCase().replace(" ", "-");
                  const charImg = charId === "rudra" ? "/images/rudra.png" : charId === "reflection-girl" ? "/images/reflection-girl.png" : "/images/shadow-knight-char.png";
                  return (
                    <Link
                      key={charName}
                      href="/characters"
                      onClick={playClickSound}
                      onMouseEnter={playHoverSound}
                      className="group/item flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.02] border border-transparent hover:border-white/[0.03] transition-all duration-300"
                    >
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10 flex-shrink-0">
                        <Image src={charImg} alt={charName} fill className="object-cover" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-xs font-bold text-slate-350 group-hover/item:text-white transition-colors uppercase tracking-[0.05em]">{charName}</h4>
                        <span className="text-[8px] font-bold text-slate-550 uppercase tracking-wider">RCU Protagonist</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
