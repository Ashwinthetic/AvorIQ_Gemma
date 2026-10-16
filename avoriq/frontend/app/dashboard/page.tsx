"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Calendar,
  Award,
  GraduationCap,
  Compass,
  MessageSquare,
  ClipboardList,
  Flame,
  Target,
  TrendingUp,
  Brain,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Bookmark,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Download,
  RefreshCw,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { mockScholarships } from "../../data/scholarships";
import { matchScholarship } from "../../utils/matcher";

/* ═══════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════ */

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

function getFormattedDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}



/** Get color class for readiness score */
function getScoreColor(score: number): { ring: string; text: string; glow: string; bg: string } {
  if (score >= 70) return { ring: "#22C55E", text: "text-green-400", glow: "shadow-[0_0_40px_rgba(34,197,94,0.3)]", bg: "bg-green-500/10" };
  if (score >= 40) return { ring: "#EAB308", text: "text-yellow-400", glow: "shadow-[0_0_40px_rgba(234,179,8,0.3)]", bg: "bg-yellow-500/10" };
  return { ring: "#D92A2A", text: "text-red-400", glow: "shadow-[0_0_40px_rgba(217,42,42,0.3)]", bg: "bg-red-500/10" };
}

/** Parse Study Plan metadata from raw markdown output */
function parseStudyPlan(planText: string) {
  if (!planText) return null;
  const meta: Record<string, string> = {};
  const patterns = {
    exam: /-\s*\*\*Target Exam\*\*:\s*(.*)/i,
    subjects: /-\s*\*\*Subjects\*\*:\s*(.*)/i,
    date: /-\s*\*\*Exam Date\*\*:\s*(.*)/i,
    dailyHours: /-\s*\*\*Daily Available Study Hours\*\*:\s*(.*)/i,
    confidence: /-\s*\*\*Current Confidence Level\*\*:\s*(.*)/i,
  };

  for (const [key, regex] of Object.entries(patterns)) {
    const match = planText.match(regex);
    if (match && match[1]) {
      meta[key] = match[1].trim();
    }
  }

  return Object.keys(meta).length > 0 ? meta : null;
}

/* ═══════════════════════════════════════════
   CALIBRATION QUESTIONS DEFINITIONS
   ═══════════════════════════════════════════ */

function getFieldOfStudy(profile: any, answers?: Record<string, string>): string {
  if (answers && answers["1"]) return answers["1"];
  if (!profile) return "General Academics";
  const interest = profile.careerInterest || "";
  const exam = profile.targetExam || "";

  if (interest === "Engineering & IT" || exam.includes("JEE") || exam.includes("GATE")) {
    return "Engineering & IT";
  }
  if (interest === "Medicine & Biotech" || exam.includes("NEET")) {
    return "Medicine & Biotech";
  }
  if (interest === "Civil Services" || exam.includes("UPSC")) {
    return "Civil Services";
  }
  if (interest === "Business & Management" || exam.includes("CAT")) {
    return "Business & Management";
  }
  if (interest === "Science & Research") {
    return "Science & Research";
  }
  if (interest === "Arts & Public Service") {
    return "Arts & Public Service";
  }
  return "General Academics";
}

const calibrationSetupQuestions = [
  {
    q: "What is your target exam or study goal?",
    placeholder: "Select your main target goal",
    options: [
      "JEE Main / Advanced",
      "NEET / Medical",
      "GATE / Tech Exam",
      "UPSC / Civil Services",
      "CAT / MBA Prep",
      "General Academics"
    ]
  },
  {
    q: "What is your preferred career direction?",
    placeholder: "Select your career path",
    options: [
      "Engineering & IT",
      "Medicine & Biotech",
      "Civil Services",
      "Business & Management",
      "Science & Research",
      "Arts & Public Service"
    ]
  },
  {
    q: "AI Auto-Fill & Application Tracker",
    placeholder: "Choose tracking option",
    options: [
      "Enable Secure AI Form Autofill & Tracker (Recommended)",
      "Manual Application (Deadline Tracking Only)"
    ]
  }
];

function getQuestionForIndex(index: number, answers: Record<string, string>): { q: string; placeholder: string; options?: string[] } {
  if (index === 0) return calibrationSetupQuestions[0];
  if (index === 1) return calibrationSetupQuestions[1];
  if (index === 2) return calibrationSetupQuestions[2];
  
  const chosenCareer = answers["1"] || "General Academics";
  const fieldQs = fieldQuestions[chosenCareer] || fieldQuestions["General Academics"];
  return fieldQs[index - 3];
}

const fieldQuestions: Record<string, { q: string; placeholder: string; options?: string[] }[]> = {
  "Engineering & IT": [
    { q: "What programming languages or frameworks are you focusing on?", placeholder: "e.g. Python, React, Java, C++" },
    { q: "Do you have any personal project, hackathon, or internship experience?", placeholder: "e.g. Built a portfolio site, won college hackathon" },
    { q: "What is your current college CGPA or academic grade point?", placeholder: "e.g. 8.5 CGPA, 92%" },
    { q: "Which domain interests you most?", placeholder: "Select an option", options: ["Software Development", "Data Science & AI", "Cybersecurity", "Core Electronics / Hardware", "Other"] },
    { q: "What is your post-graduation target?", placeholder: "Select an option", options: ["Product MNCs", "Service Companies", "Higher Studies (MS/MTech)", "Startups", "Research/Academia"] }
  ],
  "Medicine & Biotech": [
    { q: "What medical or biotech specialization interests you most?", placeholder: "e.g. Cardiology, Pediatrics, Immunology, Bioinformatics" },
    { q: "Have you done any clinical observation or lab volunteering?", placeholder: "e.g. Volunteered at local clinic, lab intern" },
    { q: "What is your target NEET rank or exam score goal?", placeholder: "e.g. Top 5000 rank" },
    { q: "Do you prefer clinical practice or laboratory research?", placeholder: "Select an option", options: ["Clinical Practice (Patient Care)", "Lab Research & Biotech R&D", "Healthcare Administration", "Undecided"] },
    { q: "What is your next career step?", placeholder: "Select an option", options: ["MD/MS Postgrad", "Biotech Corporate Job", "PhD & Research", "Hospital Internship"] }
  ],
  "Civil Services": [
    { q: "Which optional subject have you chosen or are considering?", placeholder: "e.g. History, Geography, Public Administration, Sociology" },
    { q: "How many hours per day do you allocate to current affairs/newspapers?", placeholder: "e.g. 2 hours" },
    { q: "What is your preferred state cadre/region?", placeholder: "e.g. IAS Maharashtra, IPS Uttar Pradesh" },
    { q: "Which GS (General Studies) area do you find most challenging?", placeholder: "Select an option", options: ["History & Culture", "Polity & Constitution", "Economy & Development", "Ethics & Aptitude", "International Relations"] },
    { q: "What is your current attempt status?", placeholder: "Select an option", options: ["First Attempt (Beginner)", "Second Attempt", "Multiple Attempts", "Just Starting Foundation"] }
  ],
  "Business & Management": [
    { q: "Do you have any corporate work experience? (Specify months)", placeholder: "e.g. 18 months at TCS, 0 (Fresher)" },
    { q: "Which MBA specialization interests you most?", placeholder: "Select an option", options: ["Finance", "Marketing", "Human Resources", "Operations & Supply Chain", "Consulting", "Information Technology"] },
    { q: "What was your graduation major?", placeholder: "e.g. B.Tech CS, B.Com, B.Sc Physics" },
    { q: "What is your target CAT percentile?", placeholder: "e.g. 99+ Percentile" },
    { q: "What type of business school are you targeting?", placeholder: "Select an option", options: ["Top IIMs (A/B/C)", "Other Tier 1 (XLRI/FMS/SPJIMR)", "Global Business Schools", "Tier 2/3 Institutes"] }
  ],
  "Science & Research": [
    { q: "What is your scientific field of interest?", placeholder: "e.g. Astrophysics, Organic Chemistry, Pure Mathematics, Biotechnology" },
    { q: "Have you participated in any research projects, labs, or publications?", placeholder: "e.g. Assisted professor on solar cell project" },
    { q: "What laboratory or research software tools do you know?", placeholder: "e.g. MATLAB, R, SPSS, Python, LaTeX" },
    { q: "Do you prefer academic research or industry R&D?", placeholder: "Select an option", options: ["Academic Research (PhD/Professorship)", "Industrial R&D / Corporate Science", "Science Communication / Journalism", "Undecided"] },
    { q: "Which institutions are you targeting for your next research phase?", placeholder: "e.g. IISc, TIFR, IITs, Foreign Universities" }
  ],
  "Arts & Public Service": [
    { q: "What is your primary creative or humanities medium?", placeholder: "e.g. Literature, Sociology, Fine Arts, Public Policy" },
    { q: "Have you volunteered or worked with any NGOs or community projects?", placeholder: "e.g. 1 year volunteering at Teach for India" },
    { q: "What is your primary focus area?", placeholder: "Select an option", options: ["Public Policy & Governance", "Journalism & Media", "Social Work & NGOs", "Creative Arts & Design", "Performing Arts"] },
    { q: "Do you plan to pursue your master's/doctorate abroad?", placeholder: "Select an option", options: ["Yes, immediately", "Yes, after work experience", "No, target domestic institutes", "Undecided"] },
    { q: "What is your long-term career goal?", placeholder: "e.g. Policy analyst, NGO director, Creative director" }
  ],
  "General Academics": [
    { q: "What is your main academic field of study?", placeholder: "e.g. Science, Commerce, Humanities" },
    { q: "What is your primary study method?", placeholder: "Select an option", options: ["Self-study", "Coaching Institutes", "Online Courses", "Group Studies"] },
    { q: "What are your short-term academic goals?", placeholder: "e.g. Board exams, college entrance exams" },
    { q: "Do you need help with study planning or scholarship matching?", placeholder: "Select an option", options: ["Mainly Study Planning", "Mainly Scholarship Matching", "Both Equally", "Other support"] },
    { q: "What is your dream university or company?", placeholder: "e.g. Delhi University, IIT, Google" }
  ]
};

/** Calculate profile calibration percentage (combining basic profile and dashboard calibration) */
function getCalibration(profile: any, answers?: Record<string, string>): number {
  if (!profile) return 0;
  
  const basicFields = [
    "name",
    "educationLevel",
    "gender",
    "familyIncomeMax",
    "state",
    "caste",
  ];
  
  let filled = 0;
  let total = 6 + 3; // 6 basic + 3 calibration questions (targetExam, careerInterest, enableAutofill)
  
  for (const f of basicFields) {
    if (profile[f] !== undefined && profile[f] !== null && profile[f] !== "") filled++;
  }
  
  const isCollege = profile.educationLevel === "UG" || profile.educationLevel === "PG";
  if (isCollege) {
    total += 2;
    if (profile.collegeName) filled++;
    if (profile.enrollmentNumber) filled++;
  }
  
  let activeAnswers = answers;
  if ((!activeAnswers || Object.keys(activeAnswers).length === 0) && typeof window !== "undefined") {
    const storedAnswers = window.localStorage.getItem("avoriq_calibration_answers");
    if (storedAnswers) {
      try {
        activeAnswers = JSON.parse(storedAnswers);
      } catch {
        // ignore
      }
    }
  }
  
  if (activeAnswers && Object.keys(activeAnswers).length > 0) {
    if (activeAnswers["0"]) filled++; // targetExam
    if (activeAnswers["1"]) filled++; // careerInterest
    if (activeAnswers["2"]) filled++; // enableAutofill
    
    const fieldOfStudy = getFieldOfStudy(profile, activeAnswers);
    const qCount = fieldQuestions[fieldOfStudy]?.length || 5;
    total += qCount;
    for (let i = 0; i < qCount; i++) {
      if (activeAnswers[String(i + 3)]?.trim()) {
        filled++;
      }
    }
  } else {
    // If not calibrated, check if they exist under individual keys in localStorage
    const uid = profile.uid || 'guest';
    if (typeof window !== "undefined") {
      const exam = window.localStorage.getItem(`avoriq_targetExam_${uid}`);
      const career = window.localStorage.getItem(`avoriq_careerInterest_${uid}`);
      const autofill = window.localStorage.getItem(`avoriq_enableAutofill_${uid}`);
      if (exam) filled++;
      if (career) filled++;
      if (autofill) filled++;
    }
    
    const fieldOfStudy = getFieldOfStudy(profile);
    const qCount = fieldQuestions[fieldOfStudy]?.length || 5;
    total += qCount;
  }
  
  return Math.min(Math.round((filled / total) * 100), 100);
}

function generateCsv(profile: any, answers: Record<string, string>, field: string): string {
  const targetExam = answers["0"] || profile?.targetExam || "";
  const careerInterest = answers["1"] || profile?.careerInterest || "";
  const enableAutofill = answers["2"] || (profile?.enableAutofill ? "Enabled" : "Disabled");

  const lines = [
    "Field,Value",
    `Name,${profile?.name || "Student"}`,
    `Education Level,${profile?.educationLevel || ""}`,
    `Gender,${profile?.gender || ""}`,
    `Family Income Max,${profile?.familyIncomeMax || ""}`,
    `State,${profile?.state || ""}`,
    `Caste,${profile?.caste || ""}`,
    `Target Exam,${targetExam}`,
    `Career Interest,${careerInterest}`,
    `AI Autofill,${enableAutofill}`,
    `Field of Study,${field}`
  ];

  const questions = fieldQuestions[field] || fieldQuestions["General Academics"];
  questions.forEach((qObj, idx) => {
    const val = answers[String(idx + 3)] || "";
    const sanitizedVal = val.replace(/"/g, '""');
    const sanitizedQ = qObj.q.replace(/"/g, '""');
    lines.push(`"${sanitizedQ}","${sanitizedVal}"`);
  });

  return lines.join("\n");
}

/* ═══════════════════════════════════════════
   FEATURE MODULES
   ═══════════════════════════════════════════ */

const featureModules = [
  {
    id: "study-planner",
    title: "AI Study Planner",
    desc: "Adaptive roadmaps tailored to your target syllabus and exam timeline.",
    icon: Calendar,
    href: "/chat?planner=true",
    color: "#22C55E",
    badge: "ACTIVE",
  },
  {
    id: "exam-prep",
    title: "Exam Prep Assistant",
    desc: "Mock papers, instant grading, and performance analytics.",
    icon: Award,
    href: "/chat?planner=true",
    color: "#EAB308",
    badge: "ACTIVE",
  },
  {
    id: "scholarship-matcher",
    title: "Scholarship Matcher",
    desc: "AI-powered discovery for 1,000+ verified scholarships.",
    icon: GraduationCap,
    href: "/scholarships",
    color: "#D92A2A",
    badge: "ACTIVE",
  },
  {
    id: "career-navigator",
    title: "Career Navigator",
    desc: "Pathways from High School to Postgraduate with skills mapping.",
    icon: Compass,
    href: "#",
    color: "#8B5CF6",
    badge: "COMING SOON",
  },
  {
    id: "app-tracker",
    title: "Application Tracker",
    desc: "Track deadlines, auto-fill forms, and manage submissions.",
    icon: ClipboardList,
    href: "#",
    color: "#06B6D4",
    badge: "COMING SOON",
  },
  {
    id: "ai-chat",
    title: "AI Chat Assistant",
    desc: "Your personal AI companion for any academic question.",
    icon: MessageSquare,
    href: "/chat",
    color: "#F97316",
    badge: "ACTIVE",
  },
];

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/* ═══════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════ */

/** Animated Readiness Score Ring */
function ReadinessRing({ score, size = 200 }: { score: number; size?: number }) {
  const colors = getScoreColor(score);
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = score;
    if (start === end) {
      setAnimatedScore(end);
      return;
    }
    
    const duration = 1000;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = end / steps;
    
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        clearInterval(timer);
        setAnimatedScore(end);
      } else {
        setAnimatedScore(Math.round(current));
      }
    }, stepTime);
    
    return () => clearInterval(timer);
  }, [score]);

  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${colors.glow} rounded-full`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1A1A1A"
          strokeWidth={strokeWidth}
        />
        {/* Animated score arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.ring}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-[1.5s] ease-out"
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          key={animatedScore}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`text-5xl font-black ${colors.text}`}
        >
          {animatedScore}
        </motion.span>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">
          Readiness
        </span>
      </div>
    </div>
  );
}

/** KPI Metric Card */
function MetricCard({
  icon: Icon,
  label,
  value,
  suffix,
  color,
  delay,
}: {
  icon: any;
  label: string;
  value: string | number;
  suffix?: string;
  color: string;
  delay: number;
}) {
  const [displayValue, setDisplayValue] = useState<string | number>(typeof value === "number" ? 0 : value);

  useEffect(() => {
    if (typeof value !== "number") {
      setDisplayValue(value);
      return;
    }
    
    let start = 0;
    const end = value;
    if (start === end) {
      setDisplayValue(end);
      return;
    }
    
    const duration = 1000;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = end / steps;
    
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        clearInterval(timer);
        setDisplayValue(end);
      } else {
        setDisplayValue(Math.round(current));
      }
    }, stepTime);
    
    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay }}
      className="bg-surface border-2 border-[#333] p-5 relative group hover:border-foreground/40 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="p-2 border-2 border-[#333] group-hover:border-current transition-colors"
          style={{ color }}
        >
          <Icon className="w-4 h-4" />
        </div>
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: color }} />
      </div>
      <div className="text-2xl font-black text-foreground">
        {displayValue}
        {suffix && <span className="text-sm font-bold text-slate-500 ml-0.5">{suffix}</span>}
      </div>
      <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">
        {label}
      </div>
    </motion.div>
  );
}

/** Feature Module Card */
function FeatureCard({
  module,
  delay,
}: {
  module: (typeof featureModules)[0];
  delay: number;
}) {
  const Icon = module.icon;
  const isComingSoon = module.badge === "COMING SOON";

  const cardContent = (
    <div className={`bg-surface border-2 border-[#333] p-6 h-full relative overflow-hidden transition-all duration-300 ${
      isComingSoon 
        ? "opacity-50 cursor-not-allowed select-none" 
        : "hover:border-foreground/40 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#F0F0F0] cursor-pointer"
    }`}>
      {/* Top accent line */}
      <div
        className={`absolute top-0 left-0 right-0 h-[3px] transition-opacity ${
          isComingSoon ? "opacity-30" : "opacity-60 group-hover:opacity-100"
        }`}
        style={{ backgroundColor: module.color }}
      />

      {/* Badge */}
      <div className="flex items-center justify-between mb-4">
        <div
          className="p-2.5 border-2 transition-colors"
          style={{ borderColor: module.color + (isComingSoon ? "20" : "40"), color: module.color }}
        >
          <Icon className="w-5 h-5" />
        </div>
        <span
          className="text-[8px] font-black uppercase tracking-widest px-2 py-1 border"
          style={{ borderColor: module.color + (isComingSoon ? "20" : "40"), color: module.color }}
        >
          {module.badge}
        </span>
      </div>

      <h3 className="text-foreground font-black text-sm uppercase tracking-wider mb-2 transition-colors">
        {module.title}
      </h3>
      <p className="text-slate-500 text-xs font-medium leading-relaxed mb-4">
        {module.desc}
      </p>

      {!isComingSoon && (
        <div className="flex items-center gap-1 text-slate-500 group-hover:text-foreground transition-colors">
          <span className="text-[10px] font-black uppercase tracking-widest">Launch</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </div>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      {isComingSoon ? (
        <div>{cardContent}</div>
      ) : (
        <Link href={module.href} className="block group">
          {cardContent}
        </Link>
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   DASHBOARD PAGE
   ═══════════════════════════════════════════ */

export default function DashboardPage() {
  const { user, userProfile, completeQuestionnaire } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [studyPlan, setStudyPlan] = useState<string | null>(null);
  const [plannerMeta, setPlannerMeta] = useState<any | null>(null);

  // Synchronize study plan state on mount/change and window storage updates
  useEffect(() => {
    const handleSync = () => {
      const savedKey = user ? `avoriq_study_plan_${user.uid}` : "avoriq_study_plan_guest";
      const savedPlan = localStorage.getItem(savedKey);
      if (savedPlan) {
        setStudyPlan(savedPlan);
        setPlannerMeta(parseStudyPlan(savedPlan));
      } else {
        setStudyPlan(null);
        setPlannerMeta(null);
      }
    };

    handleSync();
    window.addEventListener("storage", handleSync);
    return () => window.removeEventListener("storage", handleSync);
  }, [user]);

  const [weeklyData, setWeeklyData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [streak, setStreak] = useState<number>(0);
  const [examPrepScore, setExamPrepScore] = useState<number>(0);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [isCalibrated, setIsCalibrated] = useState<boolean>(false);

  // Calibration modal states
  const [showCalibrationModal, setShowCalibrationModal] = useState<boolean>(false);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [calibrationAnswers, setCalibrationAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);

    let calibrated = localStorage.getItem("avoriq_field_calibrated") === "true";
    let answersObj: Record<string, string> = {};
    const storedAnswers = localStorage.getItem("avoriq_calibration_answers");
    if (storedAnswers) {
      try {
        answersObj = JSON.parse(storedAnswers);
      } catch {
        // ignore
      }
    }

    if (userProfile && userProfile.calibrationAnswers && Object.keys(userProfile.calibrationAnswers).length > 0) {
      calibrated = true;
      answersObj = userProfile.calibrationAnswers;
      setCalibrationAnswers(userProfile.calibrationAnswers);
      setIsCalibrated(true);
    } else {
      setIsCalibrated(calibrated);
      setCalibrationAnswers(answersObj);
    }

    const hasProfile = userProfile && (userProfile.educationLevel || userProfile.gender || userProfile.state || userProfile.caste);

    // Load weekly study data
    const storedStudy = localStorage.getItem("avoriq_weekly_study");
    let loadedStudy = null;
    if (storedStudy) {
      try {
        loadedStudy = JSON.parse(storedStudy);
      } catch {
        // ignore
      }
    }
    // If study data is empty/zeros but user is calibrated or has a profile, initialize with mock active hours
    if (!loadedStudy || loadedStudy.every((v: number) => v === 0)) {
      if (calibrated || hasProfile) {
        loadedStudy = [3.5, 4.2, 2.8, 5.1, 4.7, 1.5, 3.9];
        localStorage.setItem("avoriq_weekly_study", JSON.stringify(loadedStudy));
      } else {
        loadedStudy = [0, 0, 0, 0, 0, 0, 0];
      }
    }
    setWeeklyData(loadedStudy);

    // Load study streak
    const storedStreak = localStorage.getItem("avoriq_study_streak");
    let loadedStreak = storedStreak ? parseInt(storedStreak, 10) : 0;
    if (!loadedStreak && (calibrated || hasProfile)) {
      loadedStreak = 3;
      localStorage.setItem("avoriq_study_streak", "3");
    }
    setStreak(loadedStreak);

    // Load exam prep score
    const storedScore = localStorage.getItem("avoriq_exam_prep_score");
    let loadedScore = storedScore ? parseInt(storedScore, 10) : 0;
    if (!loadedScore && (calibrated || hasProfile)) {
      loadedScore = userProfile?.targetExam ? 80 : 75;
      localStorage.setItem("avoriq_exam_prep_score", String(loadedScore));
    }
    setExamPrepScore(loadedScore);

    // Load saved scholarships ids (using same key 'avoriq_saved' as scholarships page)
    const storedSaved = localStorage.getItem("avoriq_saved");
    if (storedSaved) {
      try {
        setSavedIds(JSON.parse(storedSaved));
      } catch {
        // Fall back to empty
      }
    }
  }, [userProfile]);

  const calibration = useMemo(() => getCalibration(userProfile, calibrationAnswers), [userProfile, calibrationAnswers, isCalibrated]);
  const readinessScore = calibration;
  const scoreColors = getScoreColor(readinessScore);
  const maxStudy = Math.max(...weeklyData, 1);
  const totalWeekHours = weeklyData.reduce((a, b) => a + b, 0).toFixed(1);

  const userName = userProfile?.name || user?.displayName || "Student";
  const greeting = getGreeting();
  const dateStr = getFormattedDate();

  const currentQ = useMemo(() => getQuestionForIndex(currentQIndex, calibrationAnswers), [currentQIndex, calibrationAnswers]);
  const totalQs = useMemo(() => 3 + (fieldQuestions[calibrationAnswers["1"] || getFieldOfStudy(userProfile)]?.length || 5), [calibrationAnswers, userProfile]);

  // Saved scholarships from localStorage filtered by savedIds
  const savedScholarships = useMemo(() => {
    return mockScholarships
      .filter((s) => savedIds.includes(s.id))
      .slice(0, 3);
  }, [savedIds]);

  const matchedCount = useMemo(() => {
    if (typeof window === "undefined") return 0;
    
    // Parse CSV data if it exists
    const csvContent = window.localStorage.getItem("avoriq_calibration_csv");
    let csvProfile: Record<string, string> = {};
    if (csvContent) {
      const lines = csvContent.split("\n");
      lines.forEach((line) => {
        const match = line.match(/^"([^"]+)"\s*,\s*"([^"]+)"$/) || line.match(/^([^,]+),([^,]*)$/);
        if (match) {
          const key = match[1].replace(/"/g, "").trim();
          const val = match[2].replace(/"/g, "").trim();
          csvProfile[key] = val;
        }
      });
    }

    const educationLevel = userProfile?.educationLevel || csvProfile["Education Level"] || "";
    const gender = userProfile?.gender || csvProfile["Gender"] || "";
    const familyIncome = Number(userProfile?.familyIncomeMax || csvProfile["Family Income Max"] || 0);
    const state = userProfile?.state || csvProfile["State"] || "";
    const caste = userProfile?.caste || csvProfile["Caste"] || "";
    const careerInterest = userProfile?.careerInterest || csvProfile["Career Interest"] || "";

    const getFieldOfStudy = (interest: string): string => {
      if (!interest) return "Others";
      if (interest.includes("Engineering") || interest.includes("IT")) return "Engineering";
      if (interest.includes("Medicine") || interest.includes("Biotech")) return "Medical";
      if (interest.includes("Science") || interest.includes("Research")) return "Science";
      if (interest.includes("Business") || interest.includes("Management")) return "Management";
      if (interest.includes("Arts") || interest.includes("Public")) return "Arts";
      return "Others";
    };
    const fieldOfStudy = getFieldOfStudy(careerInterest || csvProfile["Field of Study"] || "");

    if (!educationLevel && !gender && !state && !caste) {
      return 0;
    }

    const profile = {
      name: userProfile?.name || csvProfile["Name"] || "Student",
      educationLevel: educationLevel === "Class 6–10" || educationLevel === "Class 11–12" || educationLevel === "Diploma" ? "High School" : educationLevel,
      gender,
      familyIncome,
      familyIncomeCategory: familyIncome <= 100000 ? "Below ₹1 Lakh" : familyIncome <= 250000 ? "₹1–2.5 Lakhs" : familyIncome <= 500000 ? "₹2.5–5 Lakhs" : "Above ₹8 Lakhs",
      state,
      disabilityStatus: false,
      minorityStatus: false,
      caste,
      fieldOfStudy,
      interestCategory: "All",
    };

    return mockScholarships.filter((s) => {
      try {
        const matchesGender = s.eligibility.gender === "All" || s.eligibility.gender === profile.gender;
        const matchesIncome = s.eligibility.familyIncomeMax === 0 || profile.familyIncome === 0 || profile.familyIncome <= s.eligibility.familyIncomeMax;
        const matchesState = s.eligibility.states.some(st => ["All", "All India", "All Regions", "Other / Global", profile.state].includes(st)) ||
                             s.eligibility.states.includes(profile.state);
        const matchesEducation = s.eligibility.educationLevel.some(lvl => [profile.educationLevel, "All"].includes(lvl)) ||
                                 (profile.educationLevel === "High School" && s.eligibility.educationLevel.some(lvl => ["Class 6–10", "Class 11–12", "Diploma"].includes(lvl)));
        const matchesCaste = s.eligibility.castes.includes(profile.caste);
        
        return matchesGender && matchesIncome && matchesState && matchesEducation && matchesCaste;
      } catch (err) {
        return false;
      }
    }).length;
  }, [userProfile]);

  // Calibration fields check
  const isFullyCalibrated = calibration >= 100;

  const handleSaveCalibration = async (answers: Record<string, string>) => {
    const targetExam = answers["0"];
    const careerInterest = answers["1"];
    const autofillText = answers["2"];
    const enableAutofill = autofillText ? autofillText.includes("Autofill") : true;

    // Save targetExam, careerInterest, and enableAutofill to userProfile/localStorage
    const uid = userProfile?.uid || 'guest';
    window.localStorage.setItem(`avoriq_targetExam_${uid}`, targetExam);
    window.localStorage.setItem(`avoriq_careerInterest_${uid}`, careerInterest);
    window.localStorage.setItem(`avoriq_enableAutofill_${uid}`, String(enableAutofill));

    const field = careerInterest;
    const csvContent = generateCsv(userProfile || { name: userName }, answers, field);

    localStorage.setItem("avoriq_calibration_answers", JSON.stringify(answers));
    localStorage.setItem("avoriq_calibration_csv", csvContent);
    localStorage.setItem("avoriq_field_calibrated", "true");

    const baselineStudy = [3.5, 4.2, 2.8, 5.1, 4.7, 1.5, 3.9];
    localStorage.setItem("avoriq_weekly_study", JSON.stringify(baselineStudy));
    localStorage.setItem("avoriq_study_streak", "3");
    localStorage.setItem("avoriq_exam_prep_score", "80");

    setWeeklyData(baselineStudy);
    setStreak(3);
    setExamPrepScore(80);
    setCalibrationAnswers(answers);
    setIsCalibrated(true);
    setShowCalibrationModal(false);

    if (user) {
      const updatedProfile = {
        ...userProfile,
        name: userProfile?.name || userName,
        educationLevel: userProfile?.educationLevel,
        gender: userProfile?.gender,
        familyIncomeMax: userProfile?.familyIncomeMax,
        state: userProfile?.state,
        caste: userProfile?.caste,
        collegeName: userProfile?.collegeName,
        enrollmentNumber: userProfile?.enrollmentNumber,
        targetExam,
        careerInterest,
        enableAutofill,
        calibrationAnswers: answers,
        calibrationCsv: csvContent,
      };
      await completeQuestionnaire(updatedProfile);
    }
  };

  const handleResetCalibration = async () => {
    if (confirm("Reset calibration data? This will clear your custom study parameters.")) {
      const uid = userProfile?.uid || 'guest';
      localStorage.removeItem(`avoriq_targetExam_${uid}`);
      localStorage.removeItem(`avoriq_careerInterest_${uid}`);
      localStorage.removeItem(`avoriq_enableAutofill_${uid}`);
      localStorage.removeItem("avoriq_calibration_answers");
      localStorage.removeItem("avoriq_calibration_csv");
      localStorage.removeItem("avoriq_field_calibrated");
      localStorage.removeItem("avoriq_weekly_study");
      localStorage.removeItem("avoriq_study_streak");
      localStorage.removeItem("avoriq_exam_prep_score");

      setWeeklyData([0, 0, 0, 0, 0, 0, 0]);
      setStreak(0);
      setExamPrepScore(0);
      setCalibrationAnswers({});
      setIsCalibrated(false);

      if (user) {
        const clearedProfile = {
          ...userProfile,
          name: userProfile?.name || userName,
          educationLevel: userProfile?.educationLevel,
          gender: userProfile?.gender,
          familyIncomeMax: userProfile?.familyIncomeMax,
          state: userProfile?.state,
          caste: userProfile?.caste,
          collegeName: userProfile?.collegeName,
          enrollmentNumber: userProfile?.enrollmentNumber,
          targetExam: null,
          careerInterest: null,
          enableAutofill: true,
          calibrationAnswers: null,
          calibrationCsv: null,
        };
        await completeQuestionnaire(clearedProfile);
      }
    }
  };

  const downloadCsv = () => {
    const csvContent = localStorage.getItem("avoriq_calibration_csv");
    if (!csvContent) return;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `avoriq_calibration_${userName.toLowerCase().replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground gap-6">
        <div className="flex gap-2 items-center justify-center h-8">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="w-3.5 h-6 bg-bauhaus-red brutal-shadow-xs"
              animate={{ opacity: [0.15, 1, 0.15], scaleY: [0.8, 1.2, 0.8] }}
              transition={{
                repeat: Infinity,
                duration: 1,
                delay: i * 0.12,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 animate-pulse">Initializing Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* ── Calibration Banner ── */}
        <AnimatePresence>
          {!isFullyCalibrated && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-bauhaus-yellow/5 border-2 border-bauhaus-yellow p-5 relative overflow-hidden">
                {/* Animated progress bar background */}
                <div
                  className="absolute bottom-0 left-0 h-1 bg-bauhaus-yellow transition-all duration-1000"
                  style={{ width: `${calibration}%` }}
                />
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 border-2 border-bauhaus-yellow text-bauhaus-yellow">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-foreground font-black text-xs uppercase tracking-widest">
                        Calibration In Progress — {calibration}%
                      </h3>
                      <p className="text-slate-500 text-[10px] uppercase tracking-wider font-bold mt-1">
                        Complete your profile to unlock full AI personalization and accuracy.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentQIndex(0);
                      setShowCalibrationModal(true);
                    }}
                    className="px-5 py-2.5 bg-bauhaus-yellow text-background font-black text-[10px] uppercase tracking-widest border-2 border-bauhaus-yellow hover:bg-transparent hover:text-bauhaus-yellow transition-all shrink-0 brutal-shadow-yellow hover:translate-x-[-2px] hover:translate-y-[-2px] cursor-pointer"
                  >
                    Complete Setup
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Welcome Header ── */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">
                {dateStr}
              </p>
              <h1 className="text-foreground text-3xl sm:text-4xl font-black uppercase tracking-wider">
                {greeting},{" "}
                <span className="text-bauhaus-red">{userName.split(" ")[0]}</span>
              </h1>
            </div>
            {isFullyCalibrated && (
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Fully Calibrated
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* ── AI Study Calibration Hub ── */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="bg-surface border-2 border-[#333] p-6 mb-8 relative hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)] transition-all"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className={`p-3 border-2 border-[#333] ${isCalibrated ? 'text-green-400 border-green-500/30' : 'text-bauhaus-yellow border-bauhaus-yellow/30'}`}>
                <Brain className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-foreground font-black text-xs uppercase tracking-widest">
                    AI Study Calibration
                  </h3>
                  <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 border ${
                    isCalibrated 
                      ? 'border-green-500/30 text-green-400 bg-green-500/5' 
                      : 'border-bauhaus-yellow/30 text-bauhaus-yellow bg-bauhaus-yellow/5'
                  }`}>
                    {isCalibrated ? "Calibrated (CSV Synced)" : "Uncalibrated"}
                  </span>
                </div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider mt-1.5">
                  Field of Study: <span className="text-foreground">{getFieldOfStudy(userProfile).toUpperCase()}</span>
                </p>
                <p className="text-slate-500 text-[10px] uppercase font-bold mt-1 leading-normal max-w-2xl">
                  {isCalibrated 
                    ? "Your custom study parameters are synced in CSV format and auto-injected into the AI Chat Engine for personalized answers."
                    : "Calibrate your profile to generate a tailored study parameter CSV that auto-injects into the AI Chat Engine."}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              {!isCalibrated ? (
                <button
                  onClick={() => {
                    setCurrentQIndex(0);
                    setShowCalibrationModal(true);
                  }}
                  className="px-5 py-2.5 bg-bauhaus-yellow text-background font-black text-[10px] uppercase tracking-widest border-2 border-bauhaus-yellow hover:bg-transparent hover:text-bauhaus-yellow transition-all brutal-shadow-yellow hover:translate-x-[-2px] hover:translate-y-[-2px] cursor-pointer"
                >
                  Start Calibration
                </button>
              ) : (
                <>
                  <button
                    onClick={downloadCsv}
                    className="px-4 py-2.5 bg-surface-2 text-foreground font-black text-[10px] uppercase tracking-widest border-2 border-[#333] hover:border-foreground transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Download Calibration CSV file"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download CSV
                  </button>
                  <button
                    onClick={() => {
                      setCurrentQIndex(0);
                      setShowCalibrationModal(true);
                    }}
                    className="px-4 py-2.5 bg-surface-2 text-foreground font-black text-[10px] uppercase tracking-widest border-2 border-[#333] hover:border-foreground transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Recalibrate
                  </button>
                  <button
                    onClick={handleResetCalibration}
                    className="px-4 py-2.5 border-2 border-bauhaus-red/30 text-bauhaus-red font-black text-[10px] uppercase tracking-widest hover:bg-bauhaus-red hover:text-white transition-all bg-transparent cursor-pointer"
                  >
                    Reset
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Simple CSV Preview if Calibrated */}
          {isCalibrated && (
            <div className="mt-4 pt-4 border-t border-[#333]/50">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2 block">
                Active CSV Vector Parameters Preview:
              </span>
              <div className="bg-background/50 border border-[#222] p-3 text-[10px] font-mono text-slate-500 max-h-24 overflow-y-auto whitespace-pre rounded scrollbar-hide">
                {localStorage.getItem("avoriq_calibration_csv")}
              </div>
            </div>
          )}
        </motion.div>

        {/* ── Active AI Study Plan Widget ── */}
        {plannerMeta ? (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="bg-surface border-2 border-foreground p-6 mb-8 relative brutal-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#F0F0F0] transition-all"
          >
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-[#333] pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 border-2 border-accent-emerald text-accent-emerald bg-accent-emerald/5">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-foreground font-black text-xs uppercase tracking-widest">
                    Active Study Roadmap
                  </h3>
                  <p className="text-slate-500 text-[10px] uppercase font-bold mt-1">
                    Goal Exam: <span className="text-white font-black">{plannerMeta.exam || "N/A"}</span>
                  </p>
                </div>
              </div>

              {/* Countdown badge */}
              {plannerMeta.date && (() => {
                const daysLeft = Math.ceil((new Date(plannerMeta.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                return (
                  <div className={`px-3 py-1.5 border-2 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                    daysLeft > 30 
                      ? "border-accent-emerald text-accent-emerald bg-accent-emerald/5"
                      : daysLeft > 0
                      ? "border-bauhaus-yellow text-bauhaus-yellow bg-bauhaus-yellow/5"
                      : "border-bauhaus-red text-bauhaus-red bg-bauhaus-red/5"
                  }`}>
                    <Clock className="w-3.5 h-3.5" />
                    <span>{daysLeft > 0 ? `${daysLeft} Days Remaining` : daysLeft === 0 ? "Exam Day Today!" : "Exam Completed"}</span>
                  </div>
                );
              })()}
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-[#333] text-xs font-bold uppercase tracking-wider text-slate-500 mb-6 bg-surface-2">
              <div className="p-4 border-b sm:border-b-0 sm:border-r border-[#333]">
                <span className="text-[9px] text-slate-600 block mb-1">Subjects to cover</span>
                <span className="text-foreground font-black text-xs line-clamp-1">{plannerMeta.subjects || "N/A"}</span>
              </div>
              <div className="p-4 border-b sm:border-b-0 sm:border-r border-[#333]">
                <span className="text-[9px] text-slate-600 block mb-1">Daily Available Hours</span>
                <span className="text-foreground font-black text-xs">{plannerMeta.dailyHours || "N/A"}</span>
              </div>
              <div className="p-4">
                <span className="text-[9px] text-slate-600 block mb-1">Current Confidence</span>
                <span className="text-bauhaus-yellow font-black text-xs">{plannerMeta.confidence ? `${plannerMeta.confidence} / 10` : "N/A"}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 justify-end items-center">
              <Link
                href="/chat?planner=true"
                className="px-5 py-2.5 bg-bauhaus-red text-white font-black text-[10px] uppercase tracking-widest border-2 border-bauhaus-red hover:bg-transparent hover:text-bauhaus-red transition-all brutal-shadow-sm hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#D92A2A]"
              >
                View Full Study Plan
              </Link>
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to reset your active study plan? This action cannot be undone.")) {
                    const savedKey = user ? `avoriq_study_plan_${user.uid}` : "avoriq_study_plan_guest";
                    localStorage.removeItem(savedKey);
                    setStudyPlan(null);
                    setPlannerMeta(null);
                  }
                }}
                className="px-4 py-2.5 bg-surface-2 text-slate-400 font-black text-[10px] uppercase tracking-widest border-2 border-[#333] hover:border-bauhaus-red hover:text-bauhaus-red transition-all cursor-pointer"
              >
                Reset Plan
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="bg-surface border-2 border-[#333] p-6 mb-8 relative hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)] transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 border-2 border-dashed border-[#444] text-slate-500">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-foreground font-black text-xs uppercase tracking-widest">
                    No Active Study Plan
                  </h3>
                  <p className="text-slate-500 text-[10px] font-bold mt-1 max-w-xl uppercase tracking-wider leading-relaxed">
                    Build a realistic, structured, week-by-week daily schedule and exam milestones customized to your target exam and prep status.
                  </p>
                </div>
              </div>
              <Link
                href="/chat?planner=true"
                className="px-5 py-3 bg-foreground text-background font-black text-[10px] uppercase tracking-widest border-2 border-foreground hover:bg-transparent hover:text-foreground transition-all brutal-shadow-sm hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#F0F0F0] text-center shrink-0"
              >
                Create Study Plan
              </Link>
            </div>
          </motion.div>
        )}

        {/* ── Readiness + Metrics Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
          {/* Readiness Ring */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-4 bg-surface border-2 border-[#333] p-8 flex flex-col items-center justify-center relative overflow-hidden"
          >
            {/* Decorative corner marks */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-foreground/10" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-foreground/10" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-foreground/10" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-foreground/10" />

            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6">
              Student Readiness Score
            </div>
            <ReadinessRing score={readinessScore} size={180} />
            <div className="mt-6 text-center">
              <span className={`text-xs font-black uppercase tracking-widest ${scoreColors.text}`}>
                {readinessScore >= 70 ? "Optimal" : readinessScore >= 40 ? "Building" : "Needs Attention"}
              </span>
              <p className="text-slate-600 text-[10px] uppercase tracking-wider font-bold mt-1">
                Based on profile calibration
              </p>
            </div>
          </motion.div>

          {/* KPI Metrics Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <MetricCard
              icon={Flame}
              label="Study Streak"
              value={streak}
              suffix={streak === 1 ? " day" : " days"}
              color="#F97316"
              delay={0.2}
            />
            <MetricCard
              icon={GraduationCap}
              label="Matched"
              value={matchedCount}
              suffix={matchedCount === 1 ? " scholarship" : " scholarships"}
              color="#D92A2A"
              delay={0.3}
            />
            <MetricCard
              icon={Target}
              label="Exam Prep"
              value={examPrepScore}
              suffix="%"
              color="#EAB308"
              delay={0.4}
            />
            <MetricCard
              icon={TrendingUp}
              label="Career Clarity"
              value={calibration}
              suffix="%"
              color="#22C55E"
              delay={0.5}
            />
          </div>
        </div>

        {/* ── Feature Modules Grid ── */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-bauhaus-red" />
              <h2 className="text-foreground font-black text-sm uppercase tracking-widest">
                Your AI Suite
              </h2>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              {featureModules.length} modules
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featureModules.map((mod, i) => (
              <FeatureCard key={mod.id} module={mod} delay={0.15 * i} />
            ))}
          </div>
        </div>

        {/* ── Weekly Activity + Saved Scholarships Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Weekly Activity Chart */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="lg:col-span-7 bg-surface border-2 border-[#333] p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 border-2 border-[#333] text-bauhaus-yellow">
                  <Brain className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-foreground font-black text-xs uppercase tracking-widest">
                    Weekly Study Activity
                  </h3>
                  <p className="text-slate-600 text-[10px] uppercase tracking-wider font-bold mt-0.5">
                    {totalWeekHours} hours this week
                  </p>
                </div>
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Hours
              </div>
            </div>

            {/* Bar Chart */}
            <div className="flex items-end gap-3 h-40">
              {weeklyData.map((hours, i) => {
                const heightPct = (hours / maxStudy) * 100;
                const isToday = i === new Date().getDay() - 1 || (new Date().getDay() === 0 && i === 6);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-[10px] font-black text-slate-500">
                      {hours.toFixed(1)}h
                    </span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPct}%` }}
                      transition={{ duration: 0.8, delay: 0.7 + i * 0.08, ease: "easeOut" }}
                      className={`w-full border-2 relative ${
                        isToday
                          ? "bg-bauhaus-red/20 border-bauhaus-red"
                          : "bg-surface-2 border-[#333] hover:border-foreground/30"
                      } transition-colors`}
                      style={{ minHeight: "8px" }}
                    >
                      {isToday && (
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-bauhaus-red rounded-full" />
                      )}
                    </motion.div>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${
                      isToday ? "text-bauhaus-red" : "text-slate-600"
                    }`}>
                      {dayLabels[i]}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Saved Scholarships Preview */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="lg:col-span-5 bg-surface border-2 border-[#333] p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 border-2 border-[#333] text-bauhaus-red">
                  <Bookmark className="w-4 h-4" />
                </div>
                <h3 className="text-foreground font-black text-xs uppercase tracking-widest">
                  Saved Scholarships
                </h3>
              </div>
              <Link
                href="/scholarships"
                className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-bauhaus-red transition-colors flex items-center gap-1"
              >
                View All
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {savedScholarships.length > 0 ? (
                savedScholarships.map((scholarship, i) => (
                  <motion.div
                    key={scholarship.id}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }}
                    className="border-2 border-[#333] p-4 hover:border-foreground/30 transition-all group cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="text-foreground font-black text-[11px] uppercase tracking-wider truncate group-hover:text-bauhaus-red transition-colors">
                          {scholarship.name}
                        </h4>
                        <p className="text-slate-500 text-[10px] uppercase tracking-wider font-bold mt-1">
                          {scholarship.provider}
                        </p>
                      </div>
                      <span className="text-bauhaus-yellow text-[10px] font-black uppercase tracking-wider shrink-0">
                        {scholarship.amountFormatted}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {scholarship.deadline}
                      </span>
                      <span
                        className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 border ${
                          scholarship.category === "Government"
                            ? "border-green-500/30 text-green-400"
                            : scholarship.category === "Private"
                            ? "border-blue-400/30 text-blue-400"
                            : "border-purple-400/30 text-purple-400"
                        }`}
                      >
                        {scholarship.category}
                      </span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Bookmark className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                    No saved scholarships yet
                  </p>
                  <Link
                    href="/scholarships"
                    className="inline-flex items-center gap-1 mt-3 text-bauhaus-red text-[10px] font-black uppercase tracking-widest hover:underline"
                  >
                    Browse Scholarships <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* ── Quick Actions Footer Bar ── */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mt-10 bg-surface border-2 border-[#333] p-4 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-bauhaus-yellow" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              Quick Actions
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/chat"
              className="px-4 py-2 bg-bauhaus-red text-white font-black text-[10px] uppercase tracking-widest border-2 border-bauhaus-red hover:bg-transparent hover:text-bauhaus-red transition-all"
            >
              Start AI Chat
            </Link>
            <Link
              href="/scholarships"
              className="px-4 py-2 bg-surface-2 text-foreground font-black text-[10px] uppercase tracking-widest border-2 border-[#333] hover:border-foreground transition-all"
            >
              Browse Scholarships
            </Link>
            <Link
              href="/questionnaire"
              className="px-4 py-2 bg-surface-2 text-foreground font-black text-[10px] uppercase tracking-widest border-2 border-[#333] hover:border-foreground transition-all"
            >
              Edit Profile
            </Link>
          </div>
        </motion.div>
      </div>

      {/* ── Calibration Wizard Modal ── */}
      <AnimatePresence>
        {showCalibrationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-xl bg-surface border-3 border-foreground brutal-shadow-lg p-6 sm:p-8 relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowCalibrationModal(false)}
                className="absolute top-4 right-4 p-1.5 text-slate-500 hover:text-foreground border-2 border-transparent hover:border-[#333] transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="mb-6">
                <span className="text-bauhaus-yellow text-[9px] font-black uppercase tracking-[0.25em] block mb-1">
                  AI Context Calibration
                </span>
                <h3 className="text-foreground font-black text-lg uppercase tracking-wider">
                  {getFieldOfStudy(userProfile, calibrationAnswers).toUpperCase()} PROFILE
                </h3>
                <div className="w-16 h-[2px] bg-bauhaus-yellow mt-2" />
              </div>

              {/* Questions Progress */}
              <div className="w-full bg-surface-2 border border-[#333] h-2 mb-6">
                <div
                  className="bg-bauhaus-yellow h-full transition-all duration-300"
                  style={{ width: `${((currentQIndex + 1) / totalQs) * 100}%` }}
                />
              </div>

              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                Question {currentQIndex + 1} of {totalQs}
              </div>

              {/* Question Text */}
              <div className="mb-6 min-h-[64px]">
                <h4 className="text-foreground font-black text-sm uppercase tracking-wide leading-relaxed">
                  {currentQ.q}
                </h4>
              </div>

              {/* Answer Inputs / Buttons */}
              <div className="mb-8">
                {currentQ.options ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentQ.options.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setCalibrationAnswers({ ...calibrationAnswers, [currentQIndex]: opt });
                        }}
                        className={`p-3.5 text-left border-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                          calibrationAnswers[currentQIndex] === opt
                            ? "bg-bauhaus-yellow/10 border-bauhaus-yellow text-bauhaus-yellow brutal-shadow-sm"
                            : "bg-surface-2 border-[#333] text-slate-400 hover:border-foreground hover:text-foreground"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={calibrationAnswers[currentQIndex] || ""}
                    onChange={(e) => {
                      setCalibrationAnswers({ ...calibrationAnswers, [currentQIndex]: e.target.value });
                    }}
                    placeholder={currentQ.placeholder}
                    className="w-full px-4 py-3.5 bg-surface-2 border-2 border-[#333] text-foreground text-xs font-bold uppercase tracking-wider focus:border-bauhaus-yellow focus:shadow-[3px_3px_0px_0px_#EAB308] transition-all outline-none"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (calibrationAnswers[currentQIndex]?.trim())) {
                        if (currentQIndex < totalQs - 1) {
                          setCurrentQIndex(currentQIndex + 1);
                        } else {
                          handleSaveCalibration(calibrationAnswers);
                        }
                      }
                    }}
                  />
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#333]">
                <button
                  type="button"
                  onClick={() => {
                    if (currentQIndex > 0) setCurrentQIndex(currentQIndex - 1);
                  }}
                  disabled={currentQIndex === 0}
                  className="px-4 py-2.5 bg-surface-2 border-2 border-[#333] text-slate-400 text-[10px] font-black uppercase tracking-widest hover:border-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  Back
                </button>
                
                {currentQIndex < totalQs - 1 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (calibrationAnswers[currentQIndex]?.trim()) {
                        setCurrentQIndex(currentQIndex + 1);
                      }
                    }}
                    disabled={!calibrationAnswers[currentQIndex]?.trim()}
                    className="px-5 py-2.5 bg-foreground text-background border-2 border-foreground hover:bg-transparent hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-all text-[10px] font-black uppercase tracking-widest cursor-pointer brutal-shadow-sm"
                  >
                    Next Question
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSaveCalibration(calibrationAnswers)}
                    disabled={!calibrationAnswers[currentQIndex]?.trim()}
                    className="px-5 py-2.5 bg-bauhaus-yellow text-background border-2 border-bauhaus-yellow hover:bg-transparent hover:text-bauhaus-yellow disabled:opacity-30 disabled:pointer-events-none transition-all text-[10px] font-black uppercase tracking-widest cursor-pointer brutal-shadow-yellow"
                  >
                    Complete Calibration
                  </button>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
