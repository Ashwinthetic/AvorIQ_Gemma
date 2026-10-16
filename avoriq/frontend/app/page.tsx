"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useMemo } from "react";
import {
  ArrowRight,
  Sparkles,
  Award,
  GraduationCap,
  Zap,
  CheckCircle2,
  HelpCircle,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Calendar,
  Play,
  Compass,
  Users,
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import AnimatedContent from "../components/reactbits/AnimatedContent";
import CountUp from "../components/reactbits/CountUp";
import { Badge } from "../components/ui/Badge";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { mockScholarships } from "../data/scholarships";

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */

const stats = [
  { value: 1000, suffix: "+", label: "Scholarships", icon: Award },
  { value: 50, suffix: "Cr+", label: "Total Funding", icon: Zap },
  { value: 3, suffix: " levels", label: "HS / UG / PG", icon: GraduationCap },
  { value: 24, suffix: "×7", label: "AI Support", icon: MessageSquare },
];

const steps = [
  {
    num: "01",
    title: "Setup Profile",
    desc: "Answer rapid profile questions about your academic level, target exams, and category to initialize your workspace.",
    badge: "Dashboard",
    highlight: "Instantly Ready",
  },
  {
    num: "02",
    title: "Match & Plan",
    desc: "Our AI scans 1,000+ scholarships for eligibility, and maps customized study roadmaps tailored to your target syllabus.",
    badge: "Planner",
    highlight: "Adaptive Maps",
  },
  {
    num: "03",
    title: "Learn & Prep",
    desc: "Simulate real tests using the Exam Assistant with instant grading, and study with distraction-free YouTube companions.",
    badge: "Prep",
    highlight: "Mock Papers",
  },
  {
    num: "04",
    title: "Chart & Track",
    desc: "Map career pathways from High School to Postgraduate, track application deadlines, and draft motivation essays with AI.",
    badge: "Success",
    highlight: "End-to-End Tracker",
  },
];

const faqs = [
  {
    q: "Is AvorIQ free to use?",
    a: "Yes — 100% free for students. Our mission is to democratize access to financial aid for every student from High School through Postgraduation.",
  },
  {
    q: "How does the AI eligibility matching work?",
    a: "We analyze your profile parameters — state, category, income, gender, and academic level — and score them against the eligibility guidelines of thousands of verified scholarships in real time.",
  },
  {
    q: "What types of scholarships are listed?",
    a: "Central and state government schemes, private corporate CSR programs, NGO/trust-backed aids, and international scholarships for study abroad.",
  },
  {
    q: "Do I need to sign up to browse?",
    a: "You need to log in to access the full matching engine, save scholarships, track deadlines, and use the AI assistant.",
  },
  {
    q: "Can AvorIQ help me write my application?",
    a: "Absolutely. Our AI assistant can draft motivation letters, summarize eligibility rules, and even translate documents. Open the Chat section after saving a scholarship.",
  },
];

const educationalModules = [
  {
    title: "AI STUDY PLANNER",
    desc: "Custom adaptive study roadmaps based on your target syllabus.",
    phase: "LIVE",
    badge: "ACTIVE",
    icon: Calendar,
    active: true,
    href: "/chat",
  },
  {
    title: "EXAM PREP ASSISTANT",
    desc: "Mock papers, instant grading, and performance metrics.",
    phase: "LIVE",
    badge: "ACTIVE",
    icon: Award,
    active: true,
    href: "/chat",
  },
  {
    title: "YOUTUBE COMPANION",
    desc: "Curated noise-free learning from verified channels.",
    phase: "LIVE",
    badge: "ACTIVE",
    icon: Play,
    active: true,
    href: "/chat",
  },
  {
    title: "CAREER NAVIGATOR",
    desc: "Pathways from High School to Postgraduate with skills mapping.",
    phase: "COMING SOON",
    badge: "COMING SOON",
    icon: Compass,
    active: false,
    href: "#",
  },
  {
    title: "SCHOLARSHIP MATCHER",
    desc: "AI-powered discovery and eligibility matching for 1,000+ schemes. Real-time tracking and documents prep.",
    phase: "LIVE",
    badge: "ACTIVE",
    icon: GraduationCap,
    active: true,
    href: "/scholarships",
  },
  {
    title: "COMMUNITY FORUMS",
    desc: "Connect with peers and alumni in moderated forums.",
    phase: "LIVE",
    badge: "ACTIVE",
    icon: Users,
    active: true,
    href: "#",
  },
];

/* ═══════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════ */

export default function LandingPage() {
  const { user, loading, isQuestionnaireCompleted } = useAuth();
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("All");

  const previewScholarships = useMemo(() => {
    const selected = mockScholarships.filter(s => 
      s.id === "gov-nmms" || 
      s.id === "pvt-hdfc" || 
      s.id === "gov-csss" || 
      s.id === "pvt-loreal" ||
      s.id === "ngo-tata-pankh" ||
      s.id === "int-commonwealth"
    );
    const list = selected.length >= 3 ? selected : mockScholarships.slice(0, 6);
    
    return list.map((s, index) => {
      const matchScores = [98, 94, 91, 88, 85, 82];
      return {
        id: s.id,
        name: s.name,
        provider: s.provider,
        reward: s.amountFormatted,
        match: matchScores[index % matchScores.length],
        deadline: s.deadline,
        category: s.category
      };
    });
  }, []);

  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    if (previewScholarships.length > 0) {
      setSavedIds([previewScholarships[0].id]);
    }
  }, [previewScholarships]);

  // Parallax scroll refs
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  useEffect(() => {
    if (!loading && user) {
      if (isQuestionnaireCompleted) {
        router.replace("/scholarships");
      } else {
        router.replace("/questionnaire");
      }
    }
  }, [user, loading, isQuestionnaireCompleted, router]);

  const toggleFaq = (i: number) => setOpenFaq(openFaq === i ? null : i);
  const toggleSave = (id: string) =>
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const filtered = previewScholarships.filter(
    (s) => activeTab === "All" || s.category === activeTab
  );

  /* ── Stagger animation helpers ── */
  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] as const },
  });

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* ═══════════════════════════════════════
          HERO — parallax scroll-linked
         ═══════════════════════════════════════ */}
      <motion.section
        ref={heroRef}
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative z-10 min-h-[95vh] flex items-center"
      >
        {/* Hero local floating accents */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Large red rectangle floating */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.06, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute top-[10%] right-[5%] w-[300px] h-[200px] border-[3px] border-bauhaus-red rotate-12"
          />
          {/* Yellow circle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.05 }}
            transition={{ duration: 2, delay: 0.4 }}
            className="absolute bottom-[20%] left-[8%] w-[250px] h-[250px] rounded-full border-[3px] border-bauhaus-yellow -rotate-6"
          />
          {/* Diagonal line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.6 }}
            className="absolute top-[45%] left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/5 to-transparent origin-left"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* ── Text ── */}
            <motion.div className="lg:col-span-7" {...fadeUp()}>
              <Badge
                variant="red"
                className="mb-6 text-[10px] font-black uppercase tracking-widest"
              >
                <Sparkles className="w-3.5 h-3.5 text-bauhaus-yellow" />
                <span>All-In-One AI Student Ecosystem</span>
              </Badge>

              <h1 className="text-foreground font-black text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] uppercase leading-[0.88] tracking-tight">
                YOUR AI
              </h1>
              <h1 className="text-bauhaus-red font-black text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] uppercase leading-[0.88] tracking-tight">
                SECOND BRAIN
              </h1>
              <h1 className="text-foreground font-black text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] uppercase leading-[0.88] tracking-tight">
                FOR HIGHER
              </h1>
              <h1 className="text-bauhaus-yellow font-black text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] uppercase leading-[0.88] tracking-tight">
                STUDIES.
              </h1>

              <div className="w-full h-[3px] bg-gradient-to-r from-foreground via-bauhaus-red to-transparent my-8" />

              <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-xl mb-8">
                AvorIQ is the ultimate brutalist companion for High School, Undergraduate (UG), and Postgraduate (PG) students. 
                Match verified scholarships, plan your target syllabus, master exams, and navigate your 
                career path — all in one AI-powered dashboard.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-4">
                <Link href="/login">
                  <button className="w-full sm:w-auto px-8 py-4 bg-bauhaus-red text-white font-black text-sm uppercase tracking-widest border-2 border-bauhaus-red brutal-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#D92A2A] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-3">
                    Start Matching
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
                <Link href="/login">
                  <button className="w-full sm:w-auto px-8 py-4 bg-transparent text-foreground font-black text-sm uppercase tracking-widest border-2 border-foreground/40 hover:border-foreground hover:bg-foreground hover:text-background transition-all cursor-pointer flex items-center justify-center">
                    Try AI Chat
                  </button>
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-6 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent-emerald" />
                  100% Free
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent-emerald" />
                  1,000+ Verified
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent-emerald" />
                  High School to PG
                </span>
              </div>
            </motion.div>

            {/* ── Hero Visual: Floating badge card composition ── */}
            <motion.div
              className="lg:col-span-5 relative hidden lg:block"
              {...fadeUp(0.2)}
            >
              <div className="relative w-full aspect-square max-w-md mx-auto">
                {/* Outer rotating dashed circle */}
                <div className="absolute inset-[-10%] border-2 border-dashed border-foreground/8 rounded-full animate-spin-slow" />

                {/* Main card */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-[10%] bg-surface border-2 border-foreground/20 backdrop-blur-sm flex flex-col justify-between p-6 z-10"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] bg-bauhaus-red text-white px-2 py-0.5">
                        LIVE MATCH
                      </span>
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                        SYS_V1.0
                      </span>
                    </div>

                    <h3 className="text-sm font-black uppercase tracking-tight text-foreground mb-1">
                      NSP Pre-Matric Scholarship
                    </h3>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                      Ministry of Minority Affairs
                    </span>

                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                        <span>Eligibility:</span>
                        <span className="text-foreground">98%</span>
                      </div>
                      <div className="w-full h-2 bg-background border border-foreground/20 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "98%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, delay: 0.8 }}
                          className="h-full bg-bauhaus-red"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-foreground/10 flex justify-between text-[10px] font-black uppercase">
                    <span className="text-bauhaus-red">12 days left</span>
                    <span className="text-bauhaus-yellow">₹10,000/yr</span>
                  </div>
                </motion.div>

                {/* Secondary floating card — offset */}
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                  className="absolute top-[5%] right-[-5%] w-[60%] bg-surface-2 border-2 border-bauhaus-yellow/30 p-4 z-20 rotate-[3deg]"
                >
                  <div className="text-[9px] font-black uppercase tracking-widest text-bauhaus-yellow mb-1">
                    AI INSIGHT
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    You match <span className="text-foreground font-black">47 scholarships</span> in your state. 3 close in under 2 weeks.
                  </p>
                </motion.div>

                {/* Bauhaus accent blocks */}
                <div className="absolute bottom-[2%] left-[-3%] w-12 h-12 bg-bauhaus-red border-2 border-foreground z-0" />
                <div className="absolute top-[2%] left-[5%] w-8 h-8 bg-bauhaus-yellow border-2 border-foreground z-0 rotate-45" />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════
          STATS
         ═══════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <AnimatedContent distance={40} direction="vertical">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-2 border-foreground/20 bg-surface/60 backdrop-blur-sm">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  {...fadeUp(index * 0.1)}
                  className={`text-center p-6 sm:p-8 group relative overflow-hidden ${
                    index < 3
                      ? "border-r-2 border-foreground/20"
                      : ""
                  } ${index < 2 ? "border-b-2 md:border-b-0 border-foreground/20" : ""}`}
                >
                  <Icon className="w-6 h-6 text-bauhaus-red mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-none">
                    <CountUp to={stat.value} />
                    {stat.suffix}
                  </div>
                  <div className="text-slate-500 text-[10px] uppercase tracking-widest mt-2 font-black">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatedContent>
      </section>

      {/* ═══════════════════════════════════════
          EDUCATIONAL SUITE SECTION
         ═══════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <AnimatedContent distance={40} direction="vertical">
          <div className="mb-12 text-center max-w-3xl mx-auto">
            <span className="text-bauhaus-red text-[10px] font-black uppercase tracking-[0.3em] block mb-3">
              Modular Suite
            </span>
            <h2 className="text-foreground text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-none">
              ALL-IN-ONE <span className="text-bauhaus-yellow">STUDENT SUITE</span>
            </h2>
            <p className="text-slate-400 text-sm mt-4 max-w-lg mx-auto uppercase tracking-wider font-semibold">
              AvorIQ is expanding beyond scholarship matching into a complete AI educational ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {educationalModules.map((mod, idx) => {
              const Icon = mod.icon;
              const targetHref = user ? mod.href : "/login";
              const isEven = idx % 2 === 0;
              const hoverColorClass = isEven
                ? "hover:border-bauhaus-red hover:shadow-[4px_4px_0px_0px_#D92A2A]"
                : "hover:border-bauhaus-yellow hover:shadow-[4px_4px_0px_0px_#EAB308]";
              const badgeClass = isEven
                ? "bg-bauhaus-red/10 border-bauhaus-red text-bauhaus-red"
                : "bg-bauhaus-yellow/10 border-bauhaus-yellow text-bauhaus-yellow";
              const hoverIconClass = isEven
                ? "group-hover:bg-bauhaus-red group-hover:border-bauhaus-red group-hover:text-white"
                : "group-hover:bg-bauhaus-yellow group-hover:border-bauhaus-yellow group-hover:text-black";
              const hoverTitleClass = isEven
                ? "group-hover:text-bauhaus-red"
                : "group-hover:text-bauhaus-yellow";
              return (
                <Link key={mod.title} href={targetHref} className="flex w-full">
                  <motion.div
                    {...fadeUp(idx * 0.08)}
                    className={`w-full p-6 sm:p-8 flex flex-col justify-between min-h-[280px] group transition-all duration-200 bg-surface/40 backdrop-blur-sm border-2 border-foreground/20 relative overflow-hidden active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer ${hoverColorClass} hover:translate-x-[-2px] hover:translate-y-[-2px]`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-tr pointer-events-none ${isEven ? "from-bauhaus-red/5" : "from-bauhaus-yellow/5"} to-transparent`} />
                    
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className={`w-12 h-12 border-2 border-foreground/20 text-slate-500 flex items-center justify-center transition-all ${hoverIconClass}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        
                        <span className={`px-2.5 py-1 text-[9px] font-black tracking-widest uppercase border-2 ${badgeClass}`}>
                          {mod.badge}
                        </span>
                      </div>

                      <h3 className={`text-base font-black uppercase tracking-wide mb-3 leading-snug transition-colors text-foreground ${hoverTitleClass}`}>
                        {mod.title}
                      </h3>
                      <p className="text-slate-400 text-xs leading-relaxed">
                        {mod.desc}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-foreground/10 flex items-center justify-between text-[9px] text-slate-500 font-black uppercase tracking-widest">
                      <span>Module</span>
                      <span className={isEven ? "text-bauhaus-red" : "text-bauhaus-yellow"}>{mod.phase}</span>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </AnimatedContent>
      </section>

      {/* ═══════════════════════════════════════
          INTERACTIVE DASHBOARD PREVIEW
         ═══════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <AnimatedContent distance={40} direction="vertical">
          <div className="mb-12 text-center max-w-3xl mx-auto">
            <span className="text-bauhaus-yellow text-[10px] font-black uppercase tracking-[0.3em] block mb-3">
              Live Preview
            </span>
            <h2 className="text-foreground text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-none">
              YOUR <span className="text-bauhaus-red">MATCH ENGINE</span> IN ACTION
            </h2>
            <p className="text-slate-400 text-sm mt-4 max-w-lg mx-auto">
              See how AvorIQ surfaces scholarships tailored to your profile in
              real time.
            </p>
          </div>

          <div className="border-2 border-foreground/20 bg-surface/50 backdrop-blur-sm overflow-hidden">
            {/* Mock header */}
            <div className="border-b-2 border-foreground/20 bg-background/80 px-4 py-3 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-bauhaus-red border border-foreground/30" />
                <div className="w-3 h-3 rounded-full bg-bauhaus-yellow border border-foreground/30" />
                <div className="w-3 h-3 rounded-full bg-slate-600 border border-foreground/30" />
                <span className="ml-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  avoriq://match-engine
                </span>
              </div>
              <div className="flex gap-1.5">
                {["All", "Government", "Private", "NGO", "International"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 border text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                      activeTab === tab
                        ? "bg-bauhaus-yellow text-black border-bauhaus-yellow"
                        : "bg-transparent text-slate-400 border-foreground/20 hover:text-foreground hover:border-foreground/40"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-0">
              {filtered.map((s) => {
                const isSaved = savedIds.includes(s.id);
                return (
                  <div
                    key={s.id}
                    className="p-5 border-r border-b border-foreground/10 hover:bg-surface-2/50 transition-colors group relative"
                  >
                    <button
                      onClick={() => toggleSave(s.id)}
                      className="absolute top-4 right-4 p-1.5 border border-foreground/20 hover:border-foreground hover:bg-foreground hover:text-background transition-all cursor-pointer bg-background"
                    >
                      <Bookmark
                        className={`w-3.5 h-3.5 ${
                          isSaved
                            ? "fill-bauhaus-yellow text-bauhaus-yellow"
                            : "text-slate-500"
                        }`}
                      />
                    </button>

                    <span
                      className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 border inline-block mb-3 ${
                        s.category === "Government"
                          ? "bg-bauhaus-yellow/10 text-bauhaus-yellow border-bauhaus-yellow/30"
                          : "bg-bauhaus-red/10 text-bauhaus-red border-bauhaus-red/30"
                      }`}
                    >
                      {s.category}
                    </span>

                    <h3 className="text-xs font-black uppercase tracking-tight text-foreground line-clamp-2 leading-snug group-hover:text-bauhaus-red transition-colors">
                      {s.name}
                    </h3>
                    <span className="text-[9px] font-bold text-slate-500 block mt-1">
                      {s.provider}
                    </span>

                    <div className="mt-4 pt-3 border-t border-foreground/10 space-y-2">
                      <div className="flex justify-between text-[10px] uppercase font-black">
                        <span className="text-slate-400">Reward:</span>
                        <span className="text-foreground">{s.reward}</span>
                      </div>
                      <div className="flex justify-between text-[10px] uppercase font-black">
                        <span className="text-slate-400">Deadline:</span>
                        <span className="text-bauhaus-red">{s.deadline}</span>
                      </div>
                      <div>
                        <div className="flex justify-between text-[9px] font-black uppercase text-slate-500 mb-1">
                          <span>Match:</span>
                          <span className="text-foreground">{s.match}%</span>
                        </div>
                        <div className="w-full h-2 bg-background border border-foreground/15 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${s.match}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="h-full bg-bauhaus-red"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer CTA */}
            <div className="p-4 border-t-2 border-foreground/15 bg-background/60 flex flex-wrap items-center justify-between gap-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                * Log in to unlock full database and AI assistant
              </span>
              <Link href="/login">
                <button className="px-5 py-2.5 bg-bauhaus-red text-white text-[10px] font-black uppercase tracking-widest border-2 border-bauhaus-red hover:bg-transparent hover:text-bauhaus-red transition-all cursor-pointer">
                  Access Full Database
                </button>
              </Link>
            </div>
          </div>
        </AnimatedContent>
      </section>

      {/* ═══════════════════════════════════════
          SOURCE TRUST BAR
         ═══════════════════════════════════════ */}
      <section className="border-y border-foreground/10 bg-surface/30 backdrop-blur-sm py-6 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.25em] text-center block mb-4">
            Verified from Trusted Academic Sources
          </span>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
            {[
              "Central Portal (NSP)",
              "UGC Grants",
              "AICTE Schemes",
              "State Portals",
              "Private CSR Trusts",
            ].map((source) => (
              <span
                key={source}
                className="text-slate-400 font-black text-xs tracking-widest border border-foreground/10 px-4 py-2 bg-background/50 uppercase hover:border-foreground/30 hover:text-foreground transition-all"
              >
                // {source}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          HOW IT WORKS
         ═══════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        <AnimatedContent distance={40} direction="vertical">
          <div className="mb-16 text-center">
            <span className="text-bauhaus-red text-[10px] font-black uppercase tracking-[0.3em] block mb-3">
              Simple Process
            </span>
            <h2 className="text-foreground text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-none">
              HOW <span className="text-bauhaus-red">AVORIQ</span> WORKS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-2 border-foreground/20 bg-surface/40 backdrop-blur-sm">
            {steps.map((step, idx) => (
              <motion.div
                key={step.num}
                {...fadeUp(idx * 0.1)}
                className={`p-6 sm:p-8 flex flex-col justify-between min-h-[280px] group transition-all duration-200 ${
                  idx < 3 ? "border-r border-foreground/10" : ""
                } ${
                  idx < 2
                    ? "border-b md:border-b-0 border-foreground/10"
                    : idx === 2
                    ? "border-b lg:border-b-0 border-foreground/10"
                    : ""
                } hover:bg-surface-2/50`}
              >
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-3xl font-black text-bauhaus-red tracking-tight leading-none">
                      {step.num}
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border border-foreground/20 bg-background/50 text-slate-400">
                      {step.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-black uppercase tracking-wide text-foreground mb-3 leading-snug group-hover:text-bauhaus-yellow transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-foreground/10 text-[8px] font-black uppercase tracking-widest text-bauhaus-yellow">
                  {step.highlight}
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatedContent>
      </section>

      {/* ═══════════════════════════════════════
          FAQ
         ═══════════════════════════════════════ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <AnimatedContent distance={40} direction="vertical">
          <div className="mb-12 text-center">
            <span className="text-bauhaus-yellow text-[10px] font-black uppercase tracking-[0.3em] block mb-3">
              FAQ
            </span>
            <h2 className="text-foreground text-3xl sm:text-4xl font-black uppercase tracking-tight leading-none">
              FREQUENTLY ASKED{" "}
              <span className="text-bauhaus-red">QUESTIONS</span>
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="border border-foreground/15 bg-surface/40 backdrop-blur-sm transition-all hover:border-foreground/30"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left font-black uppercase text-xs sm:text-sm tracking-wider text-foreground hover:bg-surface-2/30 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-3">
                      <HelpCircle className="w-4 h-4 text-bauhaus-yellow shrink-0" />
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-bauhaus-red shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden border-t border-foreground/10"
                      >
                        <div className="px-6 py-5 text-slate-400 text-xs sm:text-sm leading-relaxed">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </AnimatedContent>
      </section>

      {/* ═══════════════════════════════════════
          BOTTOM CTA BANNER
         ═══════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <AnimatedContent distance={40} direction="vertical">
          <div className="relative overflow-hidden bg-surface/60 backdrop-blur-sm border-2 border-foreground/20 p-8 sm:p-12 text-center">
            {/* Accent corners */}
            <div className="absolute top-0 left-0 w-16 h-16 border-r-2 border-b-2 border-bauhaus-red/20" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-l-2 border-t-2 border-bauhaus-yellow/20" />

            <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
              <div className="w-12 h-12 bg-bauhaus-yellow border-2 border-foreground flex items-center justify-center mb-6 rotate-[4deg]">
                <Sparkles className="w-6 h-6 text-black" />
              </div>

              <h2 className="text-foreground text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-none mb-4">
                READY TO ACCELERATE YOUR EDUCATION?
              </h2>

              <p className="text-slate-400 text-sm max-w-md mb-8 leading-relaxed">
                Join thousands of students matching scholarships, planning syllabus roadmaps, and mastering exams. Free forever.
              </p>

              <Link href="/login">
                <button className="px-8 py-4 bg-bauhaus-red text-white font-black text-sm uppercase tracking-widest border-2 border-bauhaus-red brutal-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#D92A2A] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center gap-3 cursor-pointer">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>
        </AnimatedContent>
      </section>
    </div>
  );
}
