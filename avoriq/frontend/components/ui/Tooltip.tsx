"use client";

import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
}

export function Tooltip({ children, content, position = "top" }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionStyles = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className={`absolute z-50 ${positionStyles[position]} pointer-events-none`}
          >
            <div className="px-3 py-1.5 bg-foreground text-background text-[10px] font-black uppercase tracking-wider whitespace-nowrap border-2 border-foreground">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}