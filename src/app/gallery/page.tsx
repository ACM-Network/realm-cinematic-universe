"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useUniverse } from "@/context/UniverseContext";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn, Download, X, Film, Image as ImageIcon } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  category: "Poster" | "Concept Art" | "Wallpaper" | "Cinematic Still";
  src: string;
  dimensions: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "shadow-knight-poster",
    title: "Shadow Knight: Official Teaser Poster",
    category: "Poster",
    src: "/images/shadow-knight.png",
    dimensions: "2000 x 3000"
  },
  {
    id: "strings-of-you-poster",
    title: "Strings of You: Teaser Artwork",
    category: "Poster",
    src: "/images/strings-of-you.png",
    dimensions: "2000 x 3000"
  },
  {
    id: "neelo-nenu-poster",
    title: "Neelo Nenu: Prime Dimension Poster",
    category: "Poster",
    src: "/images/neelo-nenu.png",
    dimensions: "2000 x 3000"
  },
  {
    id: "rudra-concept",
    title: "Rudra: Nexus Warrior Concept Art",
    category: "Concept Art",
    src: "/images/rudra.png",
    dimensions: "1920 x 1080"
  },
  {
    id: "reflection-concept",
    title: "Reflection Girl: Looking Glass Keyframe",
    category: "Concept Art",
    src: "/images/reflection-girl.png",
    dimensions: "1920 x 1080"
  },
  {
    id: "shadow-suit-blueprint",
    title: "Vigilante Rift Suit Armour Detail",
    category: "Concept Art",
    src: "/images/shadow-knight-char.png",
    dimensions: "1280 x 1280"
  }
];

export default function GalleryPage() {
  const { mode, setAudioZone, playClickSound, playHoverSound } = useUniverse();
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    setAudioZone("home");
  }, []);

  const categories = ["All", "Poster", "Concept Art"];

  const filteredItems = activeCategory === "All"
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === activeCategory);

  const isEmotional = mode === "emotional";
  
  const accentTextClass = isEmotional ? "text-amber-400" : "text-cyan-400";
  const accentBgClass = isEmotional ? "bg-amber-500" : "bg-cyan-500";
  const accentBorderClass = isEmotional ? "border-amber-500/30" : "border-cyan-500/30";

  return (
    <div className="w-full relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20 select-none">
      {/* Page Header */}
      <div className="text-center mb-12 relative">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[150px] rounded-full mix-blend-screen opacity-20 blur-[80px] transition-colors duration-1000 ${isEmotional ? "bg-amber-500/10" : "bg-cyan-500/10"} pointer-events-none`} />
        <h1 className="text-xs font-bold uppercase tracking-[0.65em] text-slate-400 mb-3">Asset vault</h1>
        <h2 className="text-3xl md:text-5xl font-black tracking-[0.2em] text-slate-100 uppercase">
          RCU GALLERY
        </h2>
        <div className="w-16 h-[1.5px] mx-auto mt-6 bg-slate-800" />
      </div>

      {/* Category selector */}
      <div className="flex justify-center gap-4 mb-16 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => { playClickSound(); setActiveCategory(cat); }}
            onMouseEnter={playHoverSound}
            className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] border transition-all duration-300 ${
              activeCategory === cat
                ? isEmotional
                  ? "border-amber-500/40 text-amber-400 bg-amber-500/5 shadow-[0_0_12px_rgba(245,158,11,0.15)]"
                  : "border-cyan-500/40 text-cyan-400 bg-cyan-500/5 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                : "border-transparent text-slate-500 hover:text-slate-350"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid view */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              onClick={() => { playClickSound(); setSelectedItem(item); }}
              onMouseEnter={playHoverSound}
              className="group relative rounded-2xl overflow-hidden glass-panel border border-white/[0.04] cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.03)] hover:border-white/10 aspect-[3/4] flex items-center justify-center"
            >
              {/* Asset image */}
              <Image
                src={item.src}
                alt={item.title}
                fill
                sizes="(max-w-768px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-104 filter brightness-[0.8] group-hover:brightness-[0.95]"
              />

              {/* Inside vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none z-10" />

              {/* Hover overlay layout */}
              <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded border ${accentBorderClass} bg-black/60 w-fit mb-2 block`}>
                  {item.category}
                </span>
                <h4 className="text-sm font-extrabold uppercase tracking-[0.05em] text-white line-clamp-1">
                  {item.title}
                </h4>
                <div className="flex items-center gap-1.5 mt-2.5 text-[9px] font-bold text-slate-400 tracking-[0.1em]">
                  <ZoomIn size={11} className={accentTextClass} />
                  <span>Tap to expand</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* LIGHTBOX OVERLAY */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-4 bg-black/95 backdrop-blur-md select-none">
            {/* Top Close Control */}
            <div className="absolute top-6 right-6 z-30 flex gap-4">
              <button
                onClick={() => { playClickSound(); setSelectedItem(null); }}
                className="p-3 border border-white/10 rounded-full hover:bg-white/5 text-slate-350 hover:text-white transition-all cursor-pointer shadow-lg"
              >
                <X size={16} />
              </button>
            </div>

            {/* Expander graphic */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="relative w-full max-w-4xl aspect-[2/3] md:aspect-[3/2] max-h-[70vh] rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center bg-black"
            >
              <Image
                src={selectedItem.src}
                alt={selectedItem.title}
                fill
                className="object-contain"
                priority
              />
            </motion.div>

            {/* Bottom Metadata */}
            <div className="max-w-4xl w-full mt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left px-4">
              <div>
                <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded border border-white/10 bg-black/40 ${accentTextClass} w-fit mb-1.5 block`}>
                  {selectedItem.category}
                </span>
                <h3 className="text-base font-extrabold uppercase tracking-[0.05em] text-white">
                  {selectedItem.title}
                </h3>
                <p className="text-[10px] text-slate-500 tracking-[0.1em] mt-0.5">
                  Dimensions: {selectedItem.dimensions} pixels
                </p>
              </div>

              <a
                href={selectedItem.src}
                download
                onClick={playClickSound}
                onMouseEnter={playHoverSound}
                className={`flex items-center gap-2 px-6 py-3 bg-white text-black font-bold tracking-[0.2em] text-[10px] rounded-full uppercase hover:scale-105 transition-all duration-300 cursor-pointer shadow-md`}
              >
                <Download size={11} />
                Download high-res
              </a>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
