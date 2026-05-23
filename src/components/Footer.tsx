"use client";

import React from "react";
import Link from "next/link";
import { useUniverse } from "@/context/UniverseContext";
import { Film, Shield, Globe, Award } from "lucide-react";

export const Footer = () => {
  const { mode, playClickSound, playHoverSound } = useUniverse();
  const isEmotional = mode === "emotional";

  const glowColor = isEmotional
    ? "text-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]"
    : "text-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.4)]";

  return (
    <footer className="w-full bg-[#030303] border-t border-white/[0.04] py-12 md:py-16 mt-auto relative z-10 transition-colors duration-1000">
      {/* Dynamic ambient bottom lighting */}
      <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] ${isEmotional ? "bg-gradient-to-r from-transparent via-amber-500/20 to-transparent shadow-[0_0_20px_rgba(245,158,11,0.15)]" : "bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent shadow-[0_0_20px_rgba(6,182,212,0.15)]"} transition-all duration-1000`} />

      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6">
        {/* Brand column */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-[0.4em] text-slate-100 uppercase text-lg">
              LIMITLESS <span className="font-light text-slate-400 text-xs tracking-[0.1em]">STUDIOS</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 tracking-[0.05em] leading-relaxed max-w-sm">
            Stories Connected Beyond Worlds. LIMITLESS STUDIOS produces cinematic experiences exploring the depths of the multiverse, human emotions, and celestial realms.
          </p>
        </div>

        {/* Quick Links Column */}
        <div className="flex flex-col gap-4">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">Navigation</h4>
          <ul className="flex flex-col gap-2.5">
            {[
              { name: "Home", href: "/" },
              { name: "Movies", href: "/movies" },
              { name: "Characters", href: "/characters" },
              { name: "Timeline", href: "/timeline" },
              { name: "Gallery", href: "/gallery" },
            ].map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  onClick={playClickSound}
                  onMouseEnter={playHoverSound}
                  className="text-xs text-slate-500 hover:text-slate-200 transition-colors tracking-[0.08em]"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Credit details */}
        <div className="flex flex-col gap-4">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">Creation</h4>
          <div className="flex flex-col gap-1.5">
            <p className="text-xs text-slate-500 tracking-[0.08em]">
              Realm Cinematic Universe
            </p>
            <div className="text-xs font-semibold tracking-[0.12em] text-slate-300">
              Created by{" "}
              <span className={`font-bold transition-all duration-1000 ${isEmotional ? "text-amber-400 hover:text-amber-300" : "text-cyan-400 hover:text-cyan-300"}`}>
                Surya Gokul
              </span>
            </div>
            <div className="flex gap-4 mt-4 text-slate-600">
              <Film size={14} className="hover:text-slate-400 transition-colors" />
              <Shield size={14} className="hover:text-slate-400 transition-colors" />
              <Globe size={14} className="hover:text-slate-400 transition-colors" />
              <Award size={14} className="hover:text-slate-400 transition-colors" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12 pt-8 border-t border-white/[0.03] flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-600 tracking-[0.15em] uppercase">
        <p>© 2026 LIMITLESS STUDIOS. ALL RIGHTS RESERVED.</p>
        <p>PHASE 1 - 3 ACTIVE IN THE REALM</p>
      </div>
    </footer>
  );
};
