"use client";

import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

export interface TabItem {
  value: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  children?: ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function Tabs({ tabs, defaultValue, onChange, className = "" }: TabsProps) {
  const [active, setActive] = useState(defaultValue || tabs[0]?.value);

  const handleChange = (value: string) => {
    setActive(value);
    onChange?.(value);
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Tab Headers */}
      <div className="flex border-b-2 border-[#333] overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => !tab.disabled && handleChange(tab.value)}
            disabled={tab.disabled}
            className={cn(
              "flex items-center gap-2 px-5 py-3 text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all border-b-3 -mb-[2px] cursor-pointer",
              active === tab.value
                ? "border-bauhaus-red text-bauhaus-red bg-bauhaus-red/5"
                : "border-transparent text-slate-500 hover:text-foreground hover:border-foreground/30",
              tab.disabled && "opacity-30 cursor-not-allowed"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <AnimatePresence mode="wait">
        {tabs.map((tab) => (
          tab.value === active && (
            <motion.div
              key={tab.value}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="pt-5"
              role="tabpanel"
              tabIndex={0}
            >
              {tab.children}
            </motion.div>
          )
        ))}
      </AnimatePresence>
    </div>
  );
}