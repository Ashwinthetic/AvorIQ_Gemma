"use client";

import { ArrowRight, Sparkles, Award, Layers, Users, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../ui";
import Link from "next/link";
import CountUp from "../reactbits/CountUp";

const stats = [
  { value: 1000, suffix: "+", label: "Scholarships", icon: Award },
  { value: 50, suffix: "+", label: "Categories", icon: Layers },
  { value: 3, suffix: " levels", label: "HS / UG / PG", icon: Users },
  { value: 24, suffix: "×7", label: "AI Support", icon: Clock },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          {/* Badge */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-bauhaus-red/10 border-2 border-bauhaus-red text-bauhaus-red text-[10px] font-black uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              Version 1.0 — Scholarship Intelligence
            </span>
          </motion.div>
 
          {/* Headline */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h1 className="text-foreground font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl uppercase leading-[0.9] tracking-tight mt-8">
              FIND
            </h1>
            <h1 className="text-bauhaus-red font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl uppercase leading-[0.9] tracking-tight">
              SCHOLARSHIPS
            </h1>
            <h1 className="text-foreground font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl uppercase leading-[0.9] tracking-tight">
              MEANT FOR YOU.
            </h1>
          </motion.div>
 
          {/* Divider */}
          <div className="w-full h-[3px] bg-foreground my-8" />
 
          {/* Subheadline */}
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="text-slate-400 text-lg sm:text-xl leading-relaxed max-w-3xl mb-10"
          >
            AvorIQ helps students discover scholarships they actually qualify for before deadlines pass.
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-start gap-4"
          >
            <Link href="/scholarships">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Explore System
              </Button>
            </Link>
            <Link href="/#how-it-works">
              <Button variant="outline" size="lg">
                How It Works
              </Button>
            </Link>
          </motion.div>

          {/* Trust */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center gap-6 mt-8 text-slate-500 text-xs font-black uppercase tracking-widest"
          >
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-accent-emerald" />
              Verified Sources
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-accent-emerald" />
              Government Portals
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-accent-emerald" />
              No Account Needed
            </span>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-0 mt-16 border-2 border-[#333]"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className={`text-center p-8 ${index < 3 ? "border-r-2 border-[#333]" : ""}`}>
                  <Icon className="w-6 h-6 text-bauhaus-red mx-auto mb-3" />
                  <div className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                    <CountUp to={stat.value} />{stat.suffix}
                  </div>
                  <div className="text-slate-600 text-[10px] uppercase tracking-widest mt-2 font-black">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}