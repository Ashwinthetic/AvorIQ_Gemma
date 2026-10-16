"use client";

import { motion } from "framer-motion";

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
  activeColor?: string;
  inactiveColor?: string;
}

export default function Stepper({
  currentStep,
  totalSteps,
  className = "",
  activeColor = "#2563EB", // accent-blue
  inactiveColor = "rgba(255, 255, 255, 0.1)",
}: StepperProps) {
  return (
    <div className={`flex items-center justify-between w-full ${className}`}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isActive = index <= currentStep;
        return (
          <div key={index} className="flex-1 flex items-center">
            <div className="relative">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isActive ? activeColor : inactiveColor,
                  scale: index === currentStep ? 1.2 : 1,
                }}
                className="w-3 h-3 rounded-full z-10 relative"
              />
              {isActive && (
                <motion.div
                  layoutId="active-step-glow"
                  className="absolute inset-0 rounded-full blur-sm"
                  style={{ backgroundColor: activeColor }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </div>
            
            {index < totalSteps - 1 && (
              <div className="flex-1 h-0.5 mx-2 relative overflow-hidden bg-white/10 rounded-full">
                <motion.div
                  initial={false}
                  animate={{
                    x: index < currentStep ? "0%" : "-100%",
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0 h-full rounded-full"
                  style={{ backgroundColor: activeColor }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
