"use client";

import { useRef, ReactNode } from "react";
import { motion, useInView, Variants } from "framer-motion";

interface AnimatedContentProps {
  children: ReactNode;
  distance?: number;
  direction?: "vertical" | "horizontal";
  reverse?: boolean;
  config?: { tension: number; friction: number };
  initialOpacity?: number;
  animateOpacity?: number;
  scale?: number;
  threshold?: number;
  delay?: number;
  className?: string;
}

export default function AnimatedContent({
  children,
  distance = 40,
  direction = "vertical",
  reverse = false,
  config = { tension: 50, friction: 25 },
  initialOpacity = 0,
  animateOpacity = 1,
  scale = 1,
  threshold = 0.1,
  delay = 0,
  className = "",
}: AnimatedContentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: `-${threshold * 100}% 0px` as any });

  const dirModifier = reverse ? -1 : 1;
  const axis = direction === "vertical" ? "y" : "x";

  const variants: Variants = {
    hidden: {
      opacity: initialOpacity,
      [axis]: distance * dirModifier,
      scale: scale,
    },
    visible: {
      opacity: animateOpacity,
      [axis]: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: config.tension,
        damping: config.friction,
        delay: delay,
      },
    },
  } as any;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
