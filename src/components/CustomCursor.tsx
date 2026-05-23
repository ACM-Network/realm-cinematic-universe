"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useUniverse } from "@/context/UniverseContext";

export const CustomCursor = () => {
  const { mode } = useUniverse();
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth out cursor movement with springs
  const springConfig = { damping: 30, stiffness: 250, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Disable custom cursor on touch devices or small screens
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice || window.innerWidth < 768) {
      return;
    }

    setIsVisible(true);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Expand cursor on links, buttons, interactive tabs, cards, or custom hover attributes
      const isInteractive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[role='button']") ||
        target.closest(".interactive-hover");
      
      setIsHovered(!!isInteractive);
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  const isEmotional = mode === "emotional";
  
  // Custom glowing cursor theme colors
  const glowColor = isEmotional
    ? "border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]"
    : "border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]";

  const dotColor = isEmotional ? "bg-amber-400" : "bg-cyan-400";

  return (
    <>
      {/* Spring loaded outer ring */}
      <motion.div
        className={`fixed top-0 left-0 w-8 h-8 rounded-full border pointer-events-none z-[10000] -translate-x-1/2 -translate-y-1/2 ${glowColor}`}
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
        animate={{
          scale: isHovered ? 1.6 : 1,
          backgroundColor: isHovered
            ? isEmotional
              ? "rgba(245, 158, 11, 0.1)"
              : "rgba(6, 182, 212, 0.1)"
            : "rgba(0, 0, 0, 0)",
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.2 }}
      />
      {/* Immediate center pointer dot */}
      <motion.div
        className={`fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none z-[10000] -translate-x-1/2 -translate-y-1/2 ${dotColor}`}
        style={{
          x: cursorX,
          y: cursorY,
        }}
      />
    </>
  );
};
