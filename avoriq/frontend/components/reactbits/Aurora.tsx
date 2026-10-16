"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface AuroraProps {
  colorStops?: string[];
  amplitude?: number;
}

export default function Aurora({
  colorStops = ["#3b82f6", "#8b5cf6", "#10b981"],
  amplitude = 1.0,
}: AuroraProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resize);
    resize();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.005;

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      colorStops.forEach((color, i) => {
        gradient.addColorStop(i / (colorStops.length - 1), color);
      });

      ctx.fillStyle = gradient;
      
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);

      for (let x = 0; x <= canvas.width; x += 10) {
        // Complex wave function for aurora effect
        const y = 
          canvas.height * 0.5 +
          Math.sin(x * 0.003 + time) * 100 * amplitude +
          Math.sin(x * 0.008 - time * 0.5) * 50 * amplitude +
          Math.cos(x * 0.002 + time * 0.2) * 80 * amplitude;
        
        ctx.lineTo(x, y);
      }

      ctx.lineTo(canvas.width, canvas.height);
      ctx.closePath();
      
      // Use globalCompositeOperation for a glowing effect
      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = 0.4;
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1.0;

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [colorStops, amplitude]);

  return (
    <motion.canvas
      ref={canvasRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      className="absolute inset-0 pointer-events-none -z-10 w-full h-full object-cover"
      style={{ filter: "blur(40px)" }}
    />
  );
}
