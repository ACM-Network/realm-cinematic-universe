"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUniverse } from "@/context/UniverseContext";
import { Play } from "lucide-react";

interface CinematicIntroProps {
  onEnter: () => void;
}

export const CinematicIntro = ({ onEnter }: CinematicIntroProps) => {
  const [isEntered, setIsEntered] = useState(false);
  const { toggleAudio, playClickSound } = useUniverse();

  const handleEnterRealm = () => {
    setIsEntered(true);
    // Initialize global audio
    toggleAudio();
    playClickSound();

    // Trigger parent callback after transition finishes
    setTimeout(() => {
      onEnter();
    }, 1500);
  };

  return (
    <AnimatePresence>
      {!isEntered && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: "-100%" }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black select-none overflow-hidden"
        >
          {/* Anamorphic aspect ratio letterbox bars */}
          <div className="absolute top-0 left-0 w-full h-[10vh] bg-[#030303] border-b border-white/[0.03] z-10 hidden md:block" />
          <div className="absolute bottom-0 left-0 w-full h-[10vh] bg-[#030303] border-t border-white/[0.03] z-10 hidden md:block" />

          {/* Futuristic Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)] pointer-events-none" />

          {/* Volumetric center light */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-500/10 blur-[140px] rounded-full mix-blend-screen pointer-events-none" />

          <div className="relative text-center px-4 max-w-4xl z-20 flex flex-col items-center">
            {/* Studio logo animation */}
            <motion.div
              initial={{ letterSpacing: "0.2em", opacity: 0, filter: "blur(10px)" }}
              animate={{ letterSpacing: "0.6em", opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 2.2, ease: "easeOut" }}
              className="text-2xl md:text-3xl text-slate-300 font-extrabold tracking-[0.6em] mb-2 uppercase select-none relative"
            >
              LIMITLESS
              {/* Sweeping lens flare line */}
              <motion.div
                initial={{ left: "-20%", opacity: 0 }}
                animate={{ left: "120%", opacity: [0, 1, 1, 0] }}
                transition={{ duration: 2.0, delay: 0.8, ease: "easeInOut" }}
                className="absolute top-1/2 -translate-y-1/2 h-[2px] w-[60px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent blur-[1px] mix-blend-screen"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.8, delay: 0.6 }}
              className="text-xs md:text-sm text-cyan-400 font-semibold tracking-[0.4em] uppercase mb-16 select-none"
            >
              REALM CINEMATIC UNIVERSE
            </motion.div>

            {/* Click to enter trigger button */}
            <motion.button
              onClick={handleEnterRealm}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 1.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="group relative flex items-center gap-4 px-8 py-4 bg-transparent border border-cyan-500/30 text-cyan-400 rounded-full font-bold tracking-[0.2em] text-xs uppercase cursor-pointer hover:border-cyan-400/80 hover:text-cyan-300 transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]"
            >
              {/* Ambient button glow sweep */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <Play size={12} className="fill-current text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
              ENTER THE REALM
            </motion.button>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ duration: 1.5, delay: 2.0 }}
              className="mt-8 text-[10px] text-slate-500 uppercase tracking-[0.15em] hidden md:block"
            >
              Headphones Recommended for Cinematic Ambience
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
