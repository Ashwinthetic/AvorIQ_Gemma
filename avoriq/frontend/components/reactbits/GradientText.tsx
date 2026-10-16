"use client";

import { ReactNode, useEffect, useRef } from "react";

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
  showBorder?: boolean;
}

export default function GradientText({
  children,
  className = "",
  colors = ["#D92A2A", "#EAB308", "#D92A2A", "#EAB308", "#D92A2A"],
  animationSpeed = 8,
  showBorder = false,
}: GradientTextProps) {
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (textRef.current) {
      textRef.current.style.setProperty("--gradient-speed", `${animationSpeed}s`);
    }
  }, [animationSpeed]);

  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
    animationDuration: `${animationSpeed}s`,
  };

  return (
    <span
      ref={textRef}
      className={`inline-block relative text-transparent bg-clip-text bg-[length:300%_100%] animate-gradient ${
        showBorder ? "border-2 border-foreground px-2" : ""
      } ${className}`}
      style={gradientStyle}
    >
      {children}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient linear infinite;
        }
      `}} />
    </span>
  );
}
