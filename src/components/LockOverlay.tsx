"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUniverse } from "@/context/UniverseContext";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Compass, X } from "lucide-react";

export const LockOverlay = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { mode, lockedSection, closeSectionLock } = useUniverse();

  const handleClose = () => {
    closeSectionLock();
    // If the user accessed a restricted page directly, return them to Home on click
    if (pathname === "/timeline" || pathname === "/characters") {
      router.push("/");
    }
  };

  const isEmotional = mode === "emotional";
  
  const accentTextClass = isEmotional ? "text-amber-400" : "text-cyan-400";
  const accentBgClass = isEmotional ? "bg-amber-500" : "bg-cyan-500";
  const borderGlowClass = isEmotional 
    ? "border-amber-500/40 shadow-[0_0_25px_rgba(245,158,11,0.2)]" 
    : "border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.2)]";

  return (
    <AnimatePresence>
      {lockedSection && (
        <div className="fixed inset-0 z-[11000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-[3px] select-none">
          {/* Backdrop click returns to active reality */}
          <div className="absolute inset-0" onClick={handleClose} />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className={`w-full max-w-md mirror-glass border rounded-3xl p-6 md:p-8 flex flex-col gap-6 relative shadow-2xl overflow-hidden ${borderGlowClass}`}
          >
            {/* Holographic scanning overlay */}
            <div className="absolute inset-0 scanlines opacity-5 pointer-events-none" />

            {/* Glowing top line */}
            <div className={`absolute top-0 left-0 w-full h-[3px] ${accentBgClass} opacity-60 transition-colors duration-1000`} />

            {/* Warning symbol header */}
            <div className="flex justify-between items-start">
              <div className={`flex items-center gap-2 font-extrabold text-[10px] tracking-[0.25em] uppercase ${accentTextClass}`}>
                <ShieldAlert size={14} className="animate-pulse" />
                <span>NEXUS SYNC LOCK ACTIVE</span>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 border border-white/5 hover:border-white/20 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={12} />
              </button>
            </div>

            {/* Title Copy */}
            <div className="flex flex-col gap-1.5">
              <h3 className="text-lg md:text-xl font-black uppercase tracking-[0.08em] text-white">
                ARCHIVE UNDER CONSTRUCTION
              </h3>
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block">
                Temporal Sector: {lockedSection} File
              </span>
            </div>

            {/* Body Copy */}
            <p className="text-xs text-slate-400 tracking-[0.05em] leading-relaxed p-3 bg-white/[0.01] border border-white/[0.02] rounded-xl select-text">
              This section of the Realm Cinematic Universe is currently being reconstructed through active Nexus synchronization. 
              <span className="block mt-2.5">
                Dimensional files remain unstable. Access will be restored once timeline calibration is complete.
              </span>
            </p>

            {/* Bottom details */}
            <div className="flex items-center gap-2 pt-2 border-t border-white/[0.03] text-[9px] font-bold text-slate-500 uppercase tracking-widest">
              <Compass size={12} className="animate-[spin_6s_linear_infinite]" />
              <span>Calibrating dimensional anchors...</span>
            </div>

            {/* Return Button */}
            <button
              onClick={handleClose}
              className={`w-full py-3 bg-white text-black font-bold tracking-[0.2em] text-[10px] rounded-full uppercase hover:opacity-90 active:scale-98 transition-all cursor-pointer shadow-md`}
            >
              Return to Active Reality
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default LockOverlay;
