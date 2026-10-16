"use client";

import { forwardRef, ButtonHTMLAttributes, ReactNode } from "react";
import { motion } from "framer-motion";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gradient" | "danger";
  size?: "sm" | "md" | "lg" | "xl";
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = "primary", size = "md", leftIcon, rightIcon, isLoading, disabled, className = "", ...props }, ref) => {

    const baseStyles = "inline-flex items-center justify-center font-black uppercase tracking-wider transition-all cursor-pointer border-2 relative";

    const variantStyles = {
      primary: "bg-bauhaus-red text-white border-bauhaus-red hover:bg-bauhaus-red/90 brutal-shadow-sm hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#D92A2A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
      secondary: "bg-bauhaus-yellow text-black border-bauhaus-yellow hover:bg-bauhaus-yellow/90 brutal-shadow-sm hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#EAB308] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
      outline: "bg-transparent text-foreground border-foreground hover:bg-foreground hover:text-background active:translate-x-[2px] active:translate-y-[2px]",
      ghost: "bg-transparent text-slate-400 border-transparent hover:text-foreground hover:border-foreground/20",
      gradient: "bg-bauhaus-red text-white border-bauhaus-red hover:bg-bauhaus-red/90 brutal-shadow-sm hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#D92A2A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
      danger: "bg-bauhaus-red text-white border-bauhaus-red hover:bg-red-700",
    };

    const sizeStyles = {
      sm: "px-3 py-1.5 text-[10px] gap-1.5",
      md: "px-5 py-2.5 text-xs gap-2",
      lg: "px-7 py-3.5 text-sm gap-2.5",
      xl: "px-10 py-4 text-base gap-3",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={!disabled && !isLoading ? { scale: 1.01 } : undefined}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        disabled={disabled || isLoading}
        {...(props as any)}
      >
        {isLoading && (
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {!isLoading && leftIcon}
        {children}
        {!isLoading && rightIcon}
      </motion.button>
    );
  }
);

Button.displayName = "Button";