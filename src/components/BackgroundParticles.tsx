"use client";

import React, { useEffect, useRef } from "react";
import { useUniverse } from "@/context/UniverseContext";

interface Particle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  alpha: number;
  targetAlpha: number;
  color: string;
}

export const BackgroundParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { mode, audioZone } = useUniverse();
  const mouseRef = useRef({ x: -1000, y: -1000, vx: 0, vy: 0, px: 0, py: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];
    const maxParticles = typeof window !== "undefined" && window.innerWidth < 768 ? 40 : 120;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Particle styling based on mode and audio zone
    const getParticleConfig = () => {
      const isEmotional = mode === "emotional";
      let colors: string[] = [];

      if (audioZone === "neelo-nenu") {
        // Falling vertical raindrops
        colors = ["rgba(165, 243, 252, 0.4)", "rgba(56, 189, 248, 0.35)", "rgba(224, 242, 254, 0.3)"];
        return { colors, speedY: 3.5, speedX: -0.2, sizeMin: 0.8, sizeMax: 2.0, type: "rain" };
      } else if (audioZone === "shadow-knight") {
        // Red and dark grey rising embers
        colors = ["rgba(239, 68, 68, 0.4)", "rgba(185, 28, 28, 0.3)", "rgba(100, 116, 139, 0.25)"];
        return { colors, speedY: -0.6, speedX: 0.1, sizeMin: 1.0, sizeMax: 3.5, type: "ember" };
      } else if (audioZone === "strings-of-you") {
        // Slow warm purple/cyan floaters
        colors = ["rgba(192, 132, 252, 0.35)", "rgba(34, 211, 238, 0.35)", "rgba(232, 121, 249, 0.2)"];
        return { colors, speedY: -0.2, speedX: 0.15, sizeMin: 1.2, sizeMax: 4.0, type: "float" };
      }

      if (isEmotional) {
        // Warm gold/amber embers
        colors = ["rgba(251, 191, 36, 0.3)", "rgba(245, 158, 11, 0.25)", "rgba(253, 230, 138, 0.15)", "rgba(217, 119, 6, 0.2)"];
        return { colors, speedY: -0.3, speedX: 0.08, sizeMin: 1.0, sizeMax: 3.0, type: "glow" };
      } else {
        // Core universe futuristic cyan/crimson sparks
        colors = ["rgba(6, 182, 212, 0.35)", "rgba(225, 29, 72, 0.35)", "rgba(255, 255, 255, 0.2)"];
        return { colors, speedY: -0.15, speedX: 0.1, sizeMin: 0.8, sizeMax: 2.5, type: "orbit" };
      }
    };

    const createParticle = (init = false): Particle => {
      const config = getParticleConfig();
      const color = config.colors[Math.floor(Math.random() * config.colors.length)];
      const size = Math.random() * (config.sizeMax - config.sizeMin) + config.sizeMin;
      const x = Math.random() * canvas.width;
      const y = init ? Math.random() * canvas.height : config.speedY > 0 ? -10 : canvas.height + 10;
      
      // Speed multiplier
      const speedMult = config.type === "rain" ? 1.5 : 0.8;
      const vx = (Math.random() - 0.5) * 0.4 + config.speedX;
      const vy = (Math.random() * 0.5 + 0.5) * config.speedY * speedMult;

      return {
        x,
        y,
        size,
        vx,
        vy,
        alpha: 0,
        targetAlpha: Math.random() * 0.6 + 0.2,
        color,
      };
    };

    // Initialize particles
    for (let i = 0; i < maxParticles; i++) {
      particles.push(createParticle(true));
    }

    const handleMouseMove = (e: MouseEvent) => {
      const m = mouseRef.current;
      m.x = e.clientX;
      m.y = e.clientY;
      m.vx = m.x - m.px;
      m.vy = m.y - m.py;
      m.px = m.x;
      m.py = m.y;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    const updateAndDraw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const config = getParticleConfig();
      const m = mouseRef.current;

      // Draw background glow maps (radial lighting in background)
      const grad = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        10,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height) * 0.8
      );

      if (mode === "emotional") {
        // Deep purple to warm charcoal
        grad.addColorStop(0, "rgba(22, 10, 32, 0.3)");
        grad.addColorStop(1, "rgba(5, 5, 8, 1)");
      } else {
        // Deep space blue/cyan to deep pitch
        grad.addColorStop(0, "rgba(4, 20, 33, 0.4)");
        grad.addColorStop(1, "rgba(2, 4, 6, 1)");
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw mouse cursor radial glow map
      if (m.x > -500) {
        const mouseGrad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, 160);
        if (mode === "emotional") {
          mouseGrad.addColorStop(0, "rgba(217, 119, 6, 0.08)");
          mouseGrad.addColorStop(1, "rgba(217, 119, 6, 0)");
        } else {
          // RCU Core cyan hover glow
          mouseGrad.addColorStop(0, "rgba(6, 182, 212, 0.06)");
          mouseGrad.addColorStop(1, "rgba(6, 182, 212, 0)");
        }
        ctx.fillStyle = mouseGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      particles.forEach((p, idx) => {
        // Move particle
        p.x += p.vx;
        p.y += p.vy;

        // Mouse interaction (repulsive/attraction force)
        if (m.x > -500) {
          const dx = p.x - m.x;
          const dy = p.y - m.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 180) {
            const force = (180 - dist) / 180;
            if (config.type === "rain") {
              // Rain drops splash away slightly
              p.x += (dx / dist) * force * 1.5;
            } else {
              // Floating embers pull/push based on mouse speed
              const speed = Math.sqrt(m.vx * m.vx + m.vy * m.vy);
              p.x += (dx / dist) * force * (1.0 + Math.min(speed, 5));
              p.y += (dy / dist) * force * (1.0 + Math.min(speed, 5));
            }
          }
        }

        // Fade in
        if (p.alpha < p.targetAlpha) {
          p.alpha += 0.01;
        }

        // Draw particle
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        
        ctx.beginPath();
        if (config.type === "rain") {
          // Rain drops are lines
          ctx.strokeStyle = p.color;
          ctx.lineWidth = p.size;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.vx * 2, p.y + p.size * 4);
          ctx.stroke();
        } else {
          // Embers/Glow elements are circles
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          // Extra bloom glow for larger particles in emotional mode
          if (mode === "emotional" && p.size > 2.2) {
            ctx.shadowBlur = 12;
            ctx.shadowColor = p.color;
            ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = "#ffffff";
            ctx.fill();
          }
        }
        ctx.restore();

        // Recycle out-of-bounds particles
        const isPastBottom = config.speedY > 0 && p.y > canvas.height + 20;
        const isPastTop = config.speedY < 0 && p.y < -20;
        const isPastLeftRight = p.x < -20 || p.x > canvas.width + 20;

        if (isPastBottom || isPastTop || isPastLeftRight) {
          particles[idx] = createParticle(false);
        }
      });

      // Decay mouse velocity
      m.vx *= 0.9;
      m.vy *= 0.9;

      animationId = requestAnimationFrame(updateAndDraw);
    };

    updateAndDraw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, [mode, audioZone]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-50 pointer-events-none transition-colors duration-1000 block"
    />
  );
};
