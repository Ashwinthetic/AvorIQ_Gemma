"use client";

import { SelectHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: { label: string; value: string }[];
  label?: string;
}

export function Select({ options, label, className = "", ...props }: SelectProps) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="text-foreground text-[10px] font-black uppercase tracking-widest block">
          {label}
        </label>
      )}
      <select
        className={cn(
          "w-full bg-surface border-2 border-[#333] text-foreground text-sm font-medium px-4 py-3 appearance-none cursor-pointer",
          "focus:border-bauhaus-red focus:shadow-[3px_3px_0px_0px_#D92A2A] focus:outline-none",
          "transition-all duration-100",
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}