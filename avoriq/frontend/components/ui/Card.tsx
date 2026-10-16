"use client";

import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "glass" | "elevated" | "brutal";
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  onClick?: () => void;
}

export function Card({
  children,
  className = "",
  variant = "default",
  hover = false,
  padding = "none",
  onClick,
}: CardProps) {
  const variantStyles = {
    default: "bg-surface border-2 border-[#333333]",
    glass: "bg-surface border-2 border-[#333333]",
    elevated: "bg-surface-2 border-2 border-[#444444]",
    brutal: "bg-surface border-3 border-foreground brutal-shadow",
  };

  const paddingStyles = {
    none: "",
    sm: "p-3",
    md: "p-5",
    lg: "p-7",
  };

  const hoverStyles = hover
    ? "hover:border-bauhaus-red hover:shadow-[4px_4px_0px_0px_#D92A2A] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-150 cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
    : "";

  return (
    <div
      className={cn(variantStyles[variant], paddingStyles[padding], hoverStyles, className)}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={cn("border-b-2 border-[#333333] p-5", className)}>{children}</div>;
}

export function CardContent({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={cn("p-5", className)}>{children}</div>;
}

export function CardFooter({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={cn("border-t-2 border-[#333333] p-5", className)}>{children}</div>;
}
