"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useUniverse } from "@/context/UniverseContext";

interface CinematicTransitionProps {
  children: React.ReactNode;
}

export const CinematicTransition = ({ children }: CinematicTransitionProps) => {
  const pathname = usePathname();
  const { mode } = useUniverse();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [triggerTransition, setTriggerTransition] = useState(false);

  useEffect(() => {
    // When the path changes, trigger our lens-flare/blur overlay transition
    setTriggerTransition(true);
    const timeout = setTimeout(() => {
      setDisplayChildren(children);
      setTriggerTransition(false);
    }, 450); // Sync with animation durations

    return () => clearTimeout(timeout);
  }, [pathname, children]);

  const isEmotional = mode === "emotional";
  
  // Transition flare coloring
  const flareGradient = isEmotional
    ? "from-transparent via-amber-400 to-transparent shadow-[0_0_40px_rgba(245,158,11,0.8)]"
    : "from-transparent via-cyan-400 to-transparent shadow-[0_0_40px_rgba(6,182,212,0.8)]";

  return (
    <div className="relative w-full min-h-screen">
      {/* Cinematic Blur Page Content Wrapper */}
      <motion.div
        key={pathname}
        initial={{ filter: "blur(18px)", scale: 0.98, opacity: 0 }}
        animate={{ filter: "blur(0px)", scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full min-h-screen flex flex-col"
      >
        {displayChildren}
      </motion.div>

      {/* Screen Sweep Lens Flare Overlay */}
      <AnimatePresence>
        {triggerTransition && (
          <motion.div
            initial={{ left: "-100%", opacity: 0 }}
            animate={{ left: "100%", opacity: [0, 1, 1, 0] }}
            exit={{ left: "200%", opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={`absolute top-0 w-[50%] h-full bg-gradient-to-r ${flareGradient} mix-blend-screen z-[9998] pointer-events-none`}
            style={{ transform: "skewX(-25deg)" }}
          />
        )}
      </AnimatePresence>

      {/* Fade overlay on morph */}
      <AnimatePresence>
        {triggerTransition && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.25 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black z-[9997] pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
};
