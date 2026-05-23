"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";

type UniverseMode = "core" | "emotional";
type AudioZone = "home" | "shadow-knight" | "strings-of-you" | "neelo-nenu";

interface UniverseContextType {
  mode: UniverseMode;
  setMode: (mode: UniverseMode) => void;
  isAudioEnabled: boolean;
  toggleAudio: () => void;
  audioZone: AudioZone;
  setAudioZone: (zone: AudioZone) => void;
  playHoverSound: () => void;
  playClickSound: () => void;
  volume: number; // Master volume slider (0 to 1)
  setVolume: (vol: number) => void;
  scrollVolumeMultiplier: number; // Volume adaptation on scroll (0 to 1)
  setScrollVolumeMultiplier: (mult: number) => void;
}

const UniverseContext = createContext<UniverseContextType | undefined>(undefined);

export const useUniverse = () => {
  const context = useContext(UniverseContext);
  if (!context) {
    throw new Error("useUniverse must be used within a UniverseProvider");
  }
  return context;
};

export const UniverseProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setModeState] = useState<UniverseMode>("core");
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [audioZone, setAudioZoneState] = useState<AudioZone>("home");
  const [volume, setVolumeState] = useState(0.35); // Master volume slider
  const [scrollVolumeMultiplier, setScrollVolumeMultiplier] = useState(1.0); // Modulated on scroll

  // Audio refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const activeZonesRef = useRef<{ [key: string]: { oscillators: any[]; gainNode: GainNode } }>({});
  
  // Timers refs
  const rainIntervalRef = useRef<any>(null);
  const pianoTimeoutRef = useRef<any>(null);

  // Sync state with HTML data attribute for CSS styling
  const setMode = (newMode: UniverseMode) => {
    setModeState(newMode);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-universe-mode", newMode);
    }
  };

  // 1. Local Storage Persistence & Mount Configurations
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedAudioEnabled = localStorage.getItem("rcu-audio-enabled") === "true";
      const savedVolume = localStorage.getItem("rcu-audio-volume");
      
      if (savedAudioEnabled) {
        setIsAudioEnabled(true);
      }
      if (savedVolume !== null) {
        setVolumeState(parseFloat(savedVolume));
      }
    }
    
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-universe-mode", mode);
    }
    
    return () => {
      stopAllAmbience(0.2);
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  // 2. Volume Modulation (Master * ScrollMultiplier)
  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      const ctx = audioCtxRef.current;
      const targetVolume = isAudioEnabled ? volume * scrollVolumeMultiplier : 0;
      
      try {
        masterGainRef.current.gain.setValueAtTime(masterGainRef.current.gain.value, ctx.currentTime);
        // Smooth transition over 0.2s to prevent pops on scroll/volume drag
        masterGainRef.current.gain.linearRampToValueAtTime(targetVolume, ctx.currentTime + 0.2);
      } catch (e) {
        // ignore Web Audio state conflicts
      }
    }
  }, [volume, scrollVolumeMultiplier, isAudioEnabled]);

  const setVolume = (vol: number) => {
    setVolumeState(vol);
    if (typeof window !== "undefined") {
      localStorage.setItem("rcu-audio-volume", vol.toString());
    }
  };

  // Initialize Web Audio Context
  const initAudio = () => {
    if (!audioCtxRef.current && typeof window !== "undefined") {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
    }
    
    if (audioCtxRef.current && !masterGainRef.current) {
      const ctx = audioCtxRef.current;
      const masterGain = ctx.createGain();
      // Set to target volume or soft zero for custom fade-in
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;
    }
    
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  };

  const toggleAudio = () => {
    initAudio();
    setIsAudioEnabled((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("rcu-audio-enabled", next.toString());
      }
      
      if (next) {
        // Soft fade-in on startup
        if (masterGainRef.current && audioCtxRef.current) {
          const ctx = audioCtxRef.current;
          masterGainRef.current.gain.setValueAtTime(0, ctx.currentTime);
          masterGainRef.current.gain.linearRampToValueAtTime(volume * scrollVolumeMultiplier, ctx.currentTime + 1.2);
        }
        startAmbience(audioZone, mode);
      } else {
        // Soft fade-out
        if (masterGainRef.current && audioCtxRef.current) {
          const ctx = audioCtxRef.current;
          masterGainRef.current.gain.setValueAtTime(masterGainRef.current.gain.value, ctx.currentTime);
          masterGainRef.current.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.5);
          setTimeout(() => {
            stopAllAmbience(0.1);
          }, 600);
        }
      }
      return next;
    });
  };

  const setAudioZone = (zone: AudioZone) => {
    setAudioZoneState(zone);
    if (isAudioEnabled) {
      startAmbience(zone, mode);
    }
  };

  // Play ambient audio when mode changes
  useEffect(() => {
    if (isAudioEnabled) {
      startAmbience(audioZone, mode);
    }
  }, [mode]);

  // Clean up all running synths in a specific zone with a smooth fade-out
  const fadeOutZone = (zoneName: string, fadeTime = 0.8) => {
    const active = activeZonesRef.current[zoneName];
    if (!active || !audioCtxRef.current) return;
    
    const ctx = audioCtxRef.current;
    
    try {
      active.gainNode.gain.setValueAtTime(active.gainNode.gain.value, ctx.currentTime);
      active.gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + fadeTime);
    } catch (e) {
      // ignore
    }
    
    // Stop after fade finishes
    setTimeout(() => {
      active.oscillators.forEach((node) => {
        try {
          node.stop();
          node.disconnect();
        } catch (e) {}
      });
      try {
        active.gainNode.disconnect();
      } catch (e) {}
      delete activeZonesRef.current[zoneName];
    }, fadeTime * 1000 + 100);
  };

  const stopAllAmbience = (fadeTime = 0.6) => {
    if (rainIntervalRef.current) {
      clearInterval(rainIntervalRef.current);
      rainIntervalRef.current = null;
    }
    if (pianoTimeoutRef.current) {
      clearTimeout(pianoTimeoutRef.current);
      pianoTimeoutRef.current = null;
    }
    
    Object.keys(activeZonesRef.current).forEach((zoneName) => {
      fadeOutZone(zoneName, fadeTime);
    });
  };

  // 3. Positional Crossfading Soundtrack System
  const startAmbience = (zone: AudioZone, currentMode: UniverseMode) => {
    initAudio();
    const ctx = audioCtxRef.current;
    const masterGain = masterGainRef.current;
    if (!ctx || !masterGain) return;

    // Crossfade: Fade out all other active zones
    const targetKey = `${zone}-${currentMode}`;
    Object.keys(activeZonesRef.current).forEach((key) => {
      if (key !== targetKey) {
        fadeOutZone(key, 0.8);
      }
    });

    // Clean up generative loops if exiting Neelo Nenu
    if (zone !== "neelo-nenu") {
      if (rainIntervalRef.current) {
        clearInterval(rainIntervalRef.current);
        rainIntervalRef.current = null;
      }
      if (pianoTimeoutRef.current) {
        clearTimeout(pianoTimeoutRef.current);
        pianoTimeoutRef.current = null;
      }
    }

    // If already playing this configuration, do not duplicate
    if (activeZonesRef.current[targetKey]) return;

    // Create unique sub-gain node for crossfading
    const zoneGain = ctx.createGain();
    zoneGain.gain.setValueAtTime(0, ctx.currentTime);
    zoneGain.connect(masterGain);
    
    // Smooth crossfade fade-in ramp
    zoneGain.gain.linearRampToValueAtTime(1.0, ctx.currentTime + 1.2);

    const activeNodes: any[] = [];

    // Synthesizer recipes based on mode and movie
    if (currentMode === "emotional") {
      // Warm emotional universe drone (Warm Chord pad: Bb Major / F Major colors)
      // F2 (87.3Hz), C3 (130.8Hz), F3 (174.6Hz), A3 (220.0Hz), D4 (293.7Hz)
      const freqs = [87.3, 130.8, 174.6, 220.0, 293.7];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();

        // slow LFO for filter/volume modulation
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(0.08 + idx * 0.02, ctx.currentTime);
        lfoGain.gain.setValueAtTime(0.03, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(oscGain.gain);

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq + (Math.random() - 0.5) * 0.4, ctx.currentTime);
        
        oscGain.gain.setValueAtTime(0.05 / freqs.length, ctx.currentTime);

        osc.connect(oscGain);
        oscGain.connect(zoneGain);

        osc.start();
        lfo.start();
        activeNodes.push(osc, lfo);
      });
    } else {
      // Standard Core Universe drone (Deep Sci-Fi Rumble: detuned C1 (32.7Hz) + C2 (65.4Hz))
      const freqs = [32.7, 65.4, 98.0, 130.8];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = idx % 2 === 0 ? "sawtooth" : "sine";
        osc.frequency.setValueAtTime(freq + (Math.random() - 0.5) * 0.2, ctx.currentTime);

        // Lowpass filter to keep it extremely sub-bass and non-intrusive
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(120 - idx * 10, ctx.currentTime);
        filter.Q.setValueAtTime(1, ctx.currentTime);

        oscGain.gain.setValueAtTime(0.04 / freqs.length, ctx.currentTime);

        osc.connect(filter);
        filter.connect(oscGain);
        oscGain.connect(zoneGain);

        osc.start();
        activeNodes.push(osc);
      });
    }

    // Zone-specific overlays
    if (zone === "shadow-knight") {
      // Dark Industrial Pulsating Synth Overlay
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      
      osc.type = "triangle";
      osc.frequency.setValueAtTime(73.42, ctx.currentTime); // D2

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(150, ctx.currentTime);

      // Tremolo LFO (heartbeat)
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(1.8, ctx.currentTime); // slow pulse
      lfoGain.gain.setValueAtTime(0.06, ctx.currentTime);
      
      lfo.connect(lfoGain);
      lfoGain.connect(oscGain.gain);

      oscGain.gain.setValueAtTime(0.1, ctx.currentTime);

      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(zoneGain);

      osc.start();
      lfo.start();
      activeNodes.push(osc, lfo);

    } else if (zone === "strings-of-you") {
      // Soft Ethereal Sci-Fi Hum with High Chime Drones
      const freqs = [329.63, 440.0, 523.25]; // E4, A4, C5
      freqs.forEach((freq) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Slow vibrato LFO
        lfo.frequency.setValueAtTime(0.12, ctx.currentTime);
        lfoGain.gain.setValueAtTime(0.3, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);

        oscGain.gain.setValueAtTime(0.012, ctx.currentTime);

        osc.connect(oscGain);
        oscGain.connect(zoneGain);

        osc.start();
        lfo.start();
        activeNodes.push(osc, lfo);
      });

    } else if (zone === "neelo-nenu") {
      // Melancholic Rain + Slow Piano Ambient System (Subtle, Restrained)
      
      // 1. Rain Synthesizer (White noise with low pass - very quiet and ambient)
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;

      const rainFilter = ctx.createBiquadFilter();
      rainFilter.type = "bandpass";
      rainFilter.frequency.setValueAtTime(450, ctx.currentTime); // Lower cut for softer, darker rain
      rainFilter.Q.setValueAtTime(0.4, ctx.currentTime);

      const rainGain = ctx.createGain();
      // Keep it extremely low and atmospheric (0.012)
      rainGain.gain.setValueAtTime(0.012, ctx.currentTime);

      // Rain drop crackles (random pulses)
      const rainModulator = () => {
        if (!isAudioEnabled || audioZone !== "neelo-nenu") return;
        try {
          const t = ctx.currentTime;
          rainFilter.frequency.setValueAtTime(400 + Math.random() * 250, t);
          rainGain.gain.setValueAtTime(0.008 + Math.random() * 0.008, t);
        } catch (e) {}
      };
      
      rainIntervalRef.current = setInterval(rainModulator, 200);

      noise.connect(rainFilter);
      rainFilter.connect(rainGain);
      rainGain.connect(zoneGain);
      noise.start();
      activeNodes.push(noise);

      // 2. Slow Ethereal Melancholic Piano Notes
      const pianoNotes = [196.00, 220.00, 246.94, 261.63, 293.66, 329.63, 392.00]; // G3, A3, B3, C4, D4, E4, G4
      
      const triggerPianoNote = () => {
        if (!isAudioEnabled || audioZone !== "neelo-nenu" || !audioCtxRef.current) return;
        
        const now = audioCtxRef.current.currentTime;
        const noteOsc = audioCtxRef.current.createOscillator();
        const noteGain = audioCtxRef.current.createGain();
        const noteFilter = audioCtxRef.current.createBiquadFilter();

        const randomNote = pianoNotes[Math.floor(Math.random() * pianoNotes.length)];
        
        noteOsc.type = "sine";
        noteOsc.frequency.setValueAtTime(randomNote, now);

        noteFilter.type = "lowpass";
        noteFilter.frequency.setValueAtTime(800, now); // Softer transient cut

        noteGain.gain.setValueAtTime(0, now);
        // Piano-like envelope: soft attack, long decaying release
        noteGain.gain.linearRampToValueAtTime(0.035, now + 0.05); // Lower peak volume
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

        noteOsc.connect(noteFilter);
        noteFilter.connect(noteGain);
        noteGain.connect(zoneGain);

        noteOsc.start(now);
        noteOsc.stop(now + 5);

        // Schedule next random note - long pauses (5 to 10 seconds) for intimate loneliness
        const nextTime = 5000 + Math.random() * 5000;
        pianoTimeoutRef.current = setTimeout(triggerPianoNote, nextTime);
      };

      // Trigger first note after 3 seconds
      pianoTimeoutRef.current = setTimeout(triggerPianoNote, 3000);
    }

    activeZonesRef.current[targetKey] = {
      oscillators: activeNodes,
      gainNode: zoneGain
    };
  };

  // Sleek click sound sweep (metallic ping)
  const playClickSound = () => {
    if (!isAudioEnabled || !audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(650, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch (e) {
      // ignore
    }
  };

  // Sleek hover sound (futuristic digital chirp with filter sweep)
  const playHoverSound = () => {
    if (!isAudioEnabled || !audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.08);

      filter.type = "bandpass";
      filter.frequency.setValueAtTime(350, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.08);
      filter.Q.setValueAtTime(3.0, ctx.currentTime); // Resonance filter sweep

      gain.gain.setValueAtTime(0.008, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      // ignore
    }
  };

  return (
    <UniverseContext.Provider
      value={{
        mode,
        setMode,
        isAudioEnabled,
        toggleAudio,
        audioZone,
        setAudioZone,
        playHoverSound,
        playClickSound,
        volume,
        setVolume,
        scrollVolumeMultiplier,
        setScrollVolumeMultiplier
      }}
    >
      {children}
    </UniverseContext.Provider>
  );
};
