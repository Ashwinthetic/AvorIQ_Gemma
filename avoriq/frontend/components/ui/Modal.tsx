"use client";

import { ReactNode } from "react";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  size = "md",
  closeOnBackdrop = true,
  closeOnEscape = true,
}: ModalProps) {
  const sizeStyles = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
    full: "max-w-6xl",
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && closeOnEscape) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onKeyDown={handleKeyDown}
      >
        {/* Backdrop — solid black, no blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/85"
          onClick={closeOnBackdrop ? onClose : undefined}
        />

        {/* Modal Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.15 }}
          className={`relative ${sizeStyles[size]} w-full bg-surface border-2 border-foreground brutal-shadow-lg z-10 max-h-[90vh] overflow-y-auto`}
        >
          {title && (
            <div className="flex items-center justify-between p-5 border-b-2 border-[#333]">
              <h2 className="text-foreground text-lg font-black uppercase tracking-wider">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-foreground border-2 border-transparent hover:border-foreground transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}