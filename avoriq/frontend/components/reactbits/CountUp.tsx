"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

interface CountUpProps {
  to: number;
  from?: number;
  direction?: "up" | "down";
  delay?: number;
  className?: string;
  startWhen?: boolean;
  separator?: string;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

export default function CountUp({
  to,
  from = 0,
  direction = "up",
  delay = 0,
  className = "",
  startWhen = true,
  separator = "",
  decimals = 0,
  prefix = "",
  suffix = "",
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? to : from);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "0px" });
  const [displayValue, setDisplayValue] = useState<string>(
    direction === "down" ? to.toString() : from.toString()
  );

  useEffect(() => {
    if (isInView && startWhen) {
      setTimeout(() => {
        motionValue.set(direction === "down" ? from : to);
      }, delay * 1000);
    }
  }, [isInView, startWhen, motionValue, direction, from, to, delay]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      let formattedValue = Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(latest);

      if (separator) {
        formattedValue = formattedValue.replace(/,/g, separator);
      } else {
        formattedValue = formattedValue.replace(/,/g, "");
      }

      setDisplayValue(formattedValue);
    });

    return () => unsubscribe();
  }, [springValue, decimals, separator]);

  return (
    <span className={className} ref={ref}>
      {prefix}{displayValue}{suffix}
    </span>
  );
}
