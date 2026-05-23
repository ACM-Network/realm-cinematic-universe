"use client";

import { useEffect } from "react";
import { useUniverse } from "@/context/UniverseContext";

export const useScrollVolume = () => {
  const { setScrollVolumeMultiplier, isAudioEnabled } = useUniverse();

  useEffect(() => {
    if (typeof window === "undefined") return;

    let active = true;

    const handleScroll = () => {
      if (!active) return;

      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        
        // Linear fade: at scrollY=0, multiplier is 1.0. 
        // As scrollY reaches 500px, it ramps down to 0.25 minimum.
        const multiplier = Math.max(0.25, 1 - scrollY / 500);
        
        setScrollVolumeMultiplier(multiplier);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Reset multiplier on unmount
    return () => {
      active = false;
      window.removeEventListener("scroll", handleScroll);
      setScrollVolumeMultiplier(1.0);
    };
  }, [setScrollVolumeMultiplier]);
};
export default useScrollVolume;
