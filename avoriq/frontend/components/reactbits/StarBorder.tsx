"use client";

import { ReactNode } from "react";

interface StarBorderProps {
  as?: React.ElementType;
  className?: string;
  children: ReactNode;
  color?: string;
  speed?: string;
  [key: string]: any;
}

export default function StarBorder({
  as: Component = "button",
  className = "",
  color = "white",
  speed = "6s",
  children,
  ...rest
}: StarBorderProps) {
  return (
    <Component className={`relative inline-block py-[1px] overflow-hidden rounded-[20px] ${className}`} {...rest}>
      <div
        className="absolute w-[300%] h-[50%] opacity-70 bottom-[-11px] right-[-250%] rounded-full animate-star-movement-bottom z-0"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      ></div>
      <div
        className="absolute w-[300%] h-[50%] opacity-70 top-[-10px] left-[-250%] rounded-full animate-star-movement-top z-0"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
      ></div>
      <div className="relative z-1 bg-surface border-2 border-[#333]">
        {children}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes star-movement-bottom {
          0% { transform: translate(0%, 0%); opacity: 1; }
          100% { transform: translate(-100%, 0%); opacity: 0; }
        }
        @keyframes star-movement-top {
          0% { transform: translate(0%, 0%); opacity: 1; }
          100% { transform: translate(100%, 0%); opacity: 0; }
        }
        .animate-star-movement-bottom {
          animation: star-movement-bottom linear infinite;
        }
        .animate-star-movement-top {
          animation: star-movement-top linear infinite;
        }
      `}} />
    </Component>
  );
}
