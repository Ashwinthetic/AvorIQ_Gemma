"use client";

import { Award, Compass, ShieldCheck, Heart, Users, GraduationCap, ArrowRight } from "lucide-react";
import Link from "next/link";
import AnimatedContent from "../../components/reactbits/AnimatedContent";

export default function AboutPage() {
  const values = [
    { title: "Accessibility", desc: "Equal opportunity for students in rural villages and metro cities alike.", icon: Users },
    { title: "Trust", desc: "Only verified sources. Direct links to official application portals.", icon: ShieldCheck },
    { title: "Equity", desc: "Specialized matching for low-income, minority, and girl students.", icon: Heart },
    { title: "Empowerment", desc: "Removing financial barriers from secondary school to postgrad.", icon: Award },
    { title: "Innovation", desc: "Cutting-edge AI matching across fragmented scholarship data.", icon: Compass },
  ];

  return (
    <div className="min-h-screen pt-28 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        <AnimatedContent distance={40} direction="vertical">
          <section className="max-w-3xl space-y-6">
            <span className="text-bauhaus-red text-[10px] font-black uppercase tracking-[0.3em] block">Who We Are</span>
            <h1 className="text-foreground text-4xl sm:text-5xl font-black uppercase tracking-tight leading-[0.95]">
              ABOUT AVOR<span className="text-bauhaus-red">IQ</span>
            </h1>
            <div className="w-24 h-[3px] bg-bauhaus-red" />
            <p className="text-slate-400 text-base leading-relaxed">
              AvorIQ stands for <strong className="text-foreground">Adaptive Vision for Opportunity and Resources Intelligence Quotient</strong>. 
              We are an AI-powered education companion designed for High School, Undergraduate (UG), and Postgraduate (PG) students.
            </p>
          </section>
        </AnimatedContent>

        <AnimatedContent distance={40} direction="vertical" delay={0.1}>
          <section className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="p-8 bg-surface border-2 border-[#333] space-y-4">
              <h2 className="text-foreground text-sm font-black uppercase tracking-wider flex items-center gap-2">
                <span className="w-4 h-4 bg-bauhaus-red inline-block" />
                Mission
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                To ensure no deserving student misses educational opportunities because of lack of information. 
                We democratize access to financial support.
              </p>
            </div>
            <div className="p-8 bg-surface border-2 border-[#333] border-l-0 md:border-l-0 space-y-4">
              <h2 className="text-foreground text-sm font-black uppercase tracking-wider flex items-center gap-2">
                <span className="w-4 h-4 bg-bauhaus-yellow inline-block" />
                Vision
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                To serve as an AI companion for every student. Today: scholarships. 
                Tomorrow: career roadmaps, adaptive learning plans, and more.
              </p>
            </div>
          </section>
        </AnimatedContent>

        <AnimatedContent distance={40} direction="vertical" delay={0.2}>
          <section className="space-y-8">
            <div>
              <span className="text-bauhaus-red text-[10px] font-black uppercase tracking-[0.3em] block mb-3">Principles</span>
              <h2 className="text-foreground text-2xl sm:text-3xl font-black uppercase tracking-tight">
                CORE <span className="text-bauhaus-red">VALUES</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
              {values.map((v, i) => {
                const ValueIcon = v.icon;
                return (
                  <div key={i} className="p-6 border-2 border-[#333] space-y-4 group hover:border-bauhaus-red hover:shadow-[4px_4px_0px_0px_#D92A2A] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-default">
                    <div className="w-10 h-10 border-2 border-[#333] flex items-center justify-center text-slate-500 group-hover:bg-bauhaus-red group-hover:border-bauhaus-red group-hover:text-white transition-all">
                      <ValueIcon className="w-5 h-5" />
                    </div>
                    <h3 className="text-foreground font-black text-xs uppercase tracking-wider">{v.title}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">{v.desc}</p>
                  </div>
                );
              })}
            </div>
          </section>
        </AnimatedContent>

        <AnimatedContent distance={40} direction="vertical" delay={0.3}>
          <section className="p-8 md:p-12 bg-surface border-2 border-foreground brutal-shadow text-center space-y-6 max-w-4xl mx-auto">
            <GraduationCap className="w-10 h-10 text-bauhaus-red mx-auto" />
            <h2 className="text-foreground text-xl md:text-2xl font-black uppercase tracking-tight max-w-lg mx-auto">
              Ready to find your scholarships?
            </h2>
            <Link href="/scholarships">
              <button className="px-8 py-3.5 bg-bauhaus-red text-white text-xs font-black uppercase tracking-widest border-2 border-bauhaus-red hover:bg-transparent hover:text-bauhaus-red transition-all flex items-center gap-2 mx-auto cursor-pointer mt-4">
                Start Match Engine
                <ArrowRight className="w-4.5 h-4.5" />
              </button>
            </Link>
          </section>
        </AnimatedContent>
      </div>
    </div>
  );
}
