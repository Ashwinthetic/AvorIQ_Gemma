"use client";

import { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  error?: string;
  label?: string;
}

export function Input({ leftIcon, rightIcon, error, label, className = "", ...props }: InputProps) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="text-foreground text-[10px] font-black uppercase tracking-widest block">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
            {leftIcon}
          </div>
        )}
        <input
          className={cn(
            "w-full bg-surface border-2 border-[#333] text-foreground text-sm font-medium px-4 py-3",
            "focus:border-bauhaus-red focus:shadow-[3px_3px_0px_0px_#D92A2A] focus:outline-none",
            "placeholder:text-slate-600 placeholder:uppercase placeholder:text-xs placeholder:tracking-wider",
            "transition-all duration-100",
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            error && "border-bauhaus-red",
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="text-bauhaus-red text-xs font-bold uppercase">{error}</p>}
    </div>
  );
}