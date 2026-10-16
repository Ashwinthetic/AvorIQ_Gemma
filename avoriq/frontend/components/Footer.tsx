"use client";

import Link from "next/link";
import { Mail, Code, Briefcase, Globe } from "lucide-react";
import { usePathname } from "next/navigation";
import { siteContent } from "../data/siteContent";
import { motion } from "framer-motion";

export default function Footer() {
  const pathname = usePathname();
  
  if (pathname?.startsWith("/chat") || pathname?.startsWith("/dashboard") || pathname === "/login" || pathname === "/questionnaire") {
    return null;
  }

  return (
    <footer className="sticky bottom-0 left-0 right-0 z-0 bg-surface border-t-2 border-foreground/20 pt-20 pb-0 flex flex-col items-center justify-center overflow-hidden">
      {/* Decorative background grid/lines */}
      <div className="absolute inset-0 geo-dot-grid opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[1px] h-full bg-foreground/5 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[1px] h-full bg-foreground/5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Logo & Info */}
          <div className="space-y-6 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 64 64"
                className="w-9 h-9 shrink-0"
              >
                <polygon points="32,6 6,58 22,58 28,44 36,44 42,58 58,58" fill="#D92A2A"/>
                <polygon points="32,22 26,40 38,40" fill="#0A0A0A"/>
                <circle cx="50" cy="14" r="10" fill="#EAB308"/>
                <circle cx="50" cy="14" r="4" fill="#0A0A0A"/>
              </svg>
              <span className="font-black text-xl uppercase tracking-wider text-foreground">
                AVOR<span className="text-bauhaus-red">IQ</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">
              {siteContent.footer.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-foreground font-black text-xs uppercase tracking-widest mb-6 border-b-2 border-bauhaus-red pb-2 inline-block">Navigation</h3>
            <ul className="space-y-3">
              {siteContent.navLinks.map(link => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-400 hover:text-bauhaus-red text-sm font-bold uppercase tracking-wider transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-foreground font-black text-xs uppercase tracking-widest mb-6 border-b-2 border-bauhaus-red pb-2 inline-block">Contact</h3>
            <ul className="space-y-3">
              <li className="text-slate-400 text-sm flex items-center gap-2 font-semibold">
                <Mail className="w-4 h-4 text-bauhaus-red" />
                <span>{siteContent.footer.email}</span>
              </li>
              <li className="text-slate-400 text-sm font-semibold">
                {siteContent.footer.location}
              </li>
            </ul>
            <div className="flex space-x-2 mt-6">
              <a href="#" className="p-2.5 border-2 border-foreground/20 text-slate-400 hover:text-foreground hover:border-foreground transition-all brutal-shadow-sm hover:translate-x-[-1px] hover:translate-y-[-1px] bg-background" aria-label="Website">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 border-2 border-foreground/20 text-slate-400 hover:text-foreground hover:border-foreground transition-all brutal-shadow-sm hover:translate-x-[-1px] hover:translate-y-[-1px] bg-background" aria-label="LinkedIn">
                <Briefcase className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 border-2 border-foreground/20 text-slate-400 hover:text-foreground hover:border-foreground transition-all brutal-shadow-sm hover:translate-x-[-1px] hover:translate-y-[-1px] bg-background" aria-label="GitHub">
                <Code className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Newsletter / Waitlist */}
          <div className="space-y-6">
            <h3 className="text-foreground font-black text-xs uppercase tracking-widest mb-4 border-b-2 border-bauhaus-yellow pb-2 inline-block">Waitlist</h3>
            <p className="text-slate-400 text-xs leading-relaxed font-medium">
              {siteContent.footer.newsletterDesc}
            </p>
            <div className="flex gap-0">
              <input
                type="email"
                placeholder="EMAIL"
                className="w-full px-4 py-3 text-sm font-bold uppercase tracking-wider bg-background border-2 border-foreground/20 border-r-0 text-foreground focus:outline-none focus:border-bauhaus-red placeholder:text-slate-600 focus:ring-0"
              />
              <button className="px-5 py-3 bg-bauhaus-red text-white font-black text-xs uppercase tracking-widest border-2 border-bauhaus-red hover:bg-transparent hover:text-bauhaus-red transition-all cursor-pointer whitespace-nowrap brutal-shadow-red hover:translate-x-[-2px] hover:translate-y-[-2px]">
                Join
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Huge Brutalist Centered Background Header in Moonshift style */}
      <div className="w-full text-center mt-10 pointer-events-none select-none overflow-hidden relative pt-4 leading-none z-10">
        <motion.h2 
          initial={{ y: "45%", opacity: 0, filter: "blur(20px)" }}
          whileInView={{ y: "12%", opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: false, amount: 0.01 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 inline-block text-[21vw] font-black leading-none uppercase tracking-tighter text-transparent bg-clip-text select-none"
          style={{ backgroundImage: 'linear-gradient(to bottom, rgba(240, 240, 240, 0.35) 0%, rgba(240, 240, 240, 0.1) 60%, rgba(240, 240, 240, 0) 88%, rgba(240, 240, 240, 0) 100%)' }}
        >
          AVORIQ
        </motion.h2>
      </div>
    </footer>
  );
}
