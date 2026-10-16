"use client";

import { User, Sparkles, Bell, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../ui";
import Link from "next/link";

const steps = [
  {
    num: "01",
    title: "Tell Us About Yourself",
    description: "Fill a 2-minute profile: class level, state, income, category, field of study.",
    icon: User,
    details: ["Class level (6 to PG)", "State & domicile", "Family income bracket", "Category (Gen/OBC/SC/ST)", "Field of study"],
  },
  {
    num: "02",
    title: "Discover Matches",
    description: "Our engine matches your profile against 1000+ verified scholarships.",
    icon: Sparkles,
    details: ["Real-time scoring", "Ranked by match %", "Filter by category", "Save favorites", "Export results"],
  },
  {
    num: "03",
    title: "Never Miss a Deadline",
    description: "Track deadlines, manage documents, get reminded before dates pass.",
    icon: Bell,
    details: ["Deadline countdown", "Document checklist", "Progress tracker", "Saved dashboard", "Weekly digest"],
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mb-16"
        >
          <span className="text-bauhaus-red text-[10px] font-black uppercase tracking-[0.3em] block mb-4">
            How It Works
          </span>
          <h2 className="text-foreground text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-[0.95]">
            THREE STEPS TO YOUR<br />
            <span className="text-bauhaus-red">SCHOLARSHIPS</span>
          </h2>
          <div className="w-24 h-[3px] bg-bauhaus-red mt-6" />
          <p className="text-slate-400 text-sm mt-6 uppercase tracking-wider font-medium max-w-lg">
            From profile to payout — intelligent matching and deadline tracking.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="p-8 border-2 border-[#333] relative group hover:border-bauhaus-red hover:shadow-[4px_4px_0px_0px_#D92A2A] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
              >
                {/* Number */}
                <div className="w-12 h-12 bg-bauhaus-red text-white flex items-center justify-center font-black text-lg mb-6">
                  {step.num}
                </div>

                {/* Icon */}
                <div className="w-14 h-14 border-2 border-[#333] flex items-center justify-center mb-6 group-hover:bg-bauhaus-red group-hover:border-bauhaus-red group-hover:text-white text-slate-500 transition-all">
                  <Icon className="w-7 h-7" />
                </div>

                {/* Content */}
                <h3 className="text-foreground text-sm font-black uppercase tracking-wider mb-3">{step.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-6">{step.description}</p>

                {/* Details */}
                <ul className="space-y-2.5">
                  {step.details.map((detail, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-400 text-xs font-bold uppercase tracking-wider">
                      <div className="w-4 h-4 bg-bauhaus-red/15 border border-bauhaus-red/30 flex items-center justify-center text-bauhaus-red">
                        <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Link href="/scholarships">
            <Button variant="primary" size="xl" rightIcon={<ArrowRight className="w-5 h-5" />}>
              Start Finding
            </Button>
          </Link>
          <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest mt-4">
            2 minutes. No account. 1000+ indexed.
          </p>
        </motion.div>
      </div>
    </section>
  );
}