"use client";

import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "outline" | "red" | "yellow" | "success" | "warning" | "error";
  className?: string;
}

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  const variantStyles = {
    default: "bg-surface-2 border-2 border-[#333] text-foreground",
    outline: "bg-transparent border-2 border-foreground text-foreground",
    red: "bg-bauhaus-red/10 border-2 border-bauhaus-red text-bauhaus-red",
    yellow: "bg-bauhaus-yellow/10 border-2 border-bauhaus-yellow text-bauhaus-yellow",
    success: "bg-accent-emerald/10 border-2 border-accent-emerald text-accent-emerald",
    warning: "bg-bauhaus-yellow/10 border-2 border-bauhaus-yellow text-bauhaus-yellow",
    error: "bg-bauhaus-red/10 border-2 border-bauhaus-red text-bauhaus-red",
  };

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest",
      variantStyles[variant],
      className
    )}>
      {children}
    </span>
  );
}
