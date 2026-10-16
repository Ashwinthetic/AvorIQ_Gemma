"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Search, Filter, SlidersHorizontal, ArrowRight, Sparkles, Loader2, CheckCircle2, MessageSquare } from "lucide-react";
import { mockScholarships } from "../../data/scholarships";
import ScholarshipCard from "../../components/ScholarshipCard";
import ScholarshipDetailModal from "../../components/ScholarshipDetailModal";
import { Scholarship } from "../../types/scholarship";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { checkBackendHealth, sendChatMessageBatch } from "../../lib/api";
import { matchScholarship } from "../../utils/matcher";

export default function ScholarshipsFinderPage() {
  const { user, userProfile } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [educationFilter, setEducationFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [savedIds, setSavedIds] = useLocalStorage<string[]>("avoriq_saved", []);
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);

  // AI Recommended Scholarship Spotlight state
  const [topMatch, setTopMatch] = useState<any | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string>("");
  const [loadingAi, setLoadingAi] = useState<boolean>(false);
  const [isBackendOnline, setIsBackendOnline] = useState<boolean>(false);

  // Helper function to parse CSV profile data
  const parseCsv = (csv: string): Record<string, string> => {
    const profile: Record<string, string> = {};
    const lines = csv.split("\n");
    lines.forEach((line) => {
      const match = line.match(/^"([^"]+)"\s*,\s*"([^"]+)"$/) || line.match(/^([^,]+),([^,]*)$/);
      if (match) {
        const key = match[1].replace(/"/g, "").trim();
        const val = match[2].replace(/"/g, "").trim();
        profile[key] = val;
      }
    });
    return profile;
  };

  // Auto-set academic level filter from user profile on load
  useEffect(() => {
    if (userProfile?.educationLevel) {
      setEducationFilter(userProfile.educationLevel);
    }
  }, [userProfile]);

  // Load profile and calculate best scholarship on mount or profile update
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Parse CSV data if it exists
    const csvContent = window.localStorage.getItem("avoriq_calibration_csv");
    let csvProfile: Record<string, string> = {};
    if (csvContent) {
      csvProfile = parseCsv(csvContent);
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

    // Only process if basic profile exists
    if (!educationLevel && !gender && !state && !caste) {
      setTopMatch(null);
      return;
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

    // Calculate match score for all scholarships
    const scored = mockScholarships.map((s) => {
      try {
        return matchScholarship(s, profile);
      } catch (err) {
        return { scholarship: s, isEligible: false, score: 0, reasons: [] };
      }
    });

    // Find top matching scholarship
    const eligibleMatches = scored.filter((r) => r.isEligible);
    if (eligibleMatches.length > 0) {
      // Sort by score descending, then by amount descending
      eligibleMatches.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return b.scholarship.amount - a.scholarship.amount;
      });
      setTopMatch(eligibleMatches[0]);
    } else {
      setTopMatch(null);
    }
  }, [userProfile]);

  // Check backend health and generate explanation
  useEffect(() => {
    if (!topMatch) {
      setAiExplanation("");
      return;
    }

    let active = true;
    checkBackendHealth().then((online) => {
      if (!active) return;
      setIsBackendOnline(online);
      
      if (online) {
        setLoadingAi(true);
        const prompt = `Explain why the student is a perfect match for this scholarship.
Student profile details:
- Gender: ${topMatch.reasons.find((r: string) => r.includes("gender")) ? "Matched" : "N/A"}
- State Domicile: ${topMatch.reasons.find((r: string) => r.includes("state")) ? "Matched" : "N/A"}
- Caste/Category: ${topMatch.reasons.find((r: string) => r.includes("caste")) ? "Matched" : "N/A"}
- Education Level: ${topMatch.reasons.find((r: string) => r.includes("education")) ? "Matched" : "N/A"}

Scholarship details:
- Name: ${topMatch.scholarship.name}
- Provider: ${topMatch.scholarship.provider}
- Benefits: ${topMatch.scholarship.benefits}

Provide a short, direct, and warm 2-sentence explanation of why they match and how it benefits them. Speak directly to the student in second person. Do not use phrases like "based on the data".`;

        sendChatMessageBatch(prompt, null).then((res) => {
          if (!active) return;
          if (res?.response) {
            setAiExplanation(res.response);
          }
          setLoadingAi(false);
        }).catch(() => {
          if (!active) return;
          setLoadingAi(false);
        });
      }
    });

    return () => {
      active = false;
    };
  }, [topMatch]);

  const handleToggleSave = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (savedIds.includes(id)) {
      setSavedIds(savedIds.filter((x) => x !== id));
    } else {
      setSavedIds([...savedIds, id]);
    }
  };

  const filteredScholarships = useMemo(() => {
    return mockScholarships.filter((s) => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.provider.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter ? s.category === categoryFilter : true;
      const matchesEducation = educationFilter
        ? (educationFilter === "High School"
            ? s.eligibility.educationLevel.some(lvl => ["Class 6–10", "Class 11–12", "Diploma", "High School", "All"].includes(lvl))
            : s.eligibility.educationLevel.some(lvl => [educationFilter, "All"].includes(lvl)))
        : true;
      
      // Auto-match profile constraints if user is logged in and profile exists
      let matchesProfile = true;
      if (userProfile) {
        const matchesGender = s.eligibility.gender === "All" || s.eligibility.gender === userProfile.gender;
        const userIncome = userProfile.familyIncomeMax !== undefined ? userProfile.familyIncomeMax : userProfile.familyIncome;
        const matchesIncome = s.eligibility.familyIncomeMax === 0 || userIncome === undefined || userIncome === null || userIncome <= s.eligibility.familyIncomeMax;
        const matchesState = s.eligibility.states.some(st => ["All", "All India", "All Regions", "Other / Global", userProfile.state].includes(st)) ||
                             s.eligibility.states.includes(userProfile.state);
        matchesProfile = matchesGender && matchesIncome && matchesState;
      }
      
      return matchesSearch && matchesCategory && matchesEducation && matchesProfile;
    });
  }, [searchQuery, categoryFilter, educationFilter, userProfile]);

  const displayedScholarships = useMemo(() => {
    if (user) {
      return filteredScholarships;
    }
    return filteredScholarships.slice(0, 3);
  }, [filteredScholarships, user]);

  const categories = [
    { label: "All Categories", value: "" },
    { label: "Government", value: "Government" },
    { label: "Private", value: "Private" },
    { label: "NGO", value: "NGO" },
    { label: "International", value: "International" },
  ];

  const educationLevels = [
    { label: "All Levels", value: "" },
    { label: "High School", value: "High School" },
    { label: "Undergraduate (UG)", value: "UG" },
    { label: "Postgraduate (PG)", value: "PG" },
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <span className="text-bauhaus-red text-[10px] font-black uppercase tracking-[0.3em] block mb-3">Match Engine</span>
          <h1 className="text-foreground text-4xl md:text-5xl font-black uppercase tracking-tight leading-[0.95]">
            FIND YOUR<br />
            <span className="text-bauhaus-red">SCHOLARSHIP</span>
          </h1>
          <div className="w-24 h-[3px] bg-bauhaus-red mt-4 mb-4" />
          <p className="text-slate-500 text-sm max-w-lg uppercase tracking-wider font-medium">
            Discover opportunities that match your profile. Filter by category, education level, and more.
          </p>
        </div>

        {/* AI Spotlight Recommendation Section */}
        {topMatch ? (
          <div className="bg-surface border-3 border-bauhaus-yellow p-6 mb-8 relative brutal-shadow-yellow hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-300">
            <div className="absolute top-0 right-0 bg-bauhaus-yellow text-background text-[10px] font-black uppercase tracking-widest px-3 py-1.5 border-l-2 border-b-2 border-background">
              AI SPOTLIGHT MATCH
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] bg-bauhaus-red text-white px-2 py-0.5 border border-bauhaus-red">
                    {topMatch.score}% MATCH
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                    Recommended For You
                  </span>
                </div>
                
                <h2 className="text-foreground text-xl md:text-2xl font-black uppercase tracking-tight leading-snug">
                  {topMatch.scholarship.name}
                </h2>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                  {topMatch.scholarship.provider}
                </p>

                {/* AI Explanation / Reasoning Box */}
                <div className="p-4 bg-background border-2 border-[#333] space-y-2 mt-4">
                  <div className="flex items-center gap-2 text-[10px] font-black text-bauhaus-yellow uppercase tracking-widest">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI MATCH ANALYSIS
                  </div>
                  {loadingAi ? (
                    <div className="flex items-center gap-2 py-2 text-xs text-slate-500 font-mono">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-bauhaus-yellow" />
                      <span>Analyzing match factors and generating advice...</span>
                    </div>
                  ) : aiExplanation ? (
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-sans font-medium">
                      {aiExplanation}
                    </p>
                  ) : (
                    <div className="space-y-1.5">
                      {topMatch.reasons.map((reason: string, i: number) => (
                        <div key={i} className="flex gap-2 items-center text-slate-300 text-xs font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-accent-emerald shrink-0" />
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col gap-3 min-w-[200px] shrink-0 justify-end h-full">
                <div className="bg-background border border-[#333] p-4 text-center">
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 block mb-1">REWARD</span>
                  <span className="text-xl font-black text-foreground">{topMatch.scholarship.amountFormatted}</span>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedScholarship(topMatch.scholarship)}
                    className="flex-1 py-3 bg-bauhaus-red border-2 border-bauhaus-red text-white text-xs font-black uppercase tracking-widest hover:bg-transparent hover:text-bauhaus-red transition-all cursor-pointer brutal-shadow-sm hover:translate-x-[-2px] hover:translate-y-[-2px] text-center"
                  >
                    Apply Now
                  </button>
                  
                  <button
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        const query = `Explain the eligibility and application process for ${topMatch.scholarship.name} in detail. What documents do I need to prepare?`;
                        window.localStorage.setItem("avoriq_pending_chat_query", query);
                        window.location.href = "/chat";
                      }
                    }}
                    className="p-3 bg-transparent border-2 border-[#333] hover:border-foreground text-slate-400 hover:text-foreground transition-all cursor-pointer flex items-center justify-center"
                    title="Ask AI Companion about this scholarship"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-surface border-2 border-dashed border-[#333] p-6 mb-8 relative flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 border-2 border-bauhaus-yellow/30 text-bauhaus-yellow">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-foreground font-black text-xs uppercase tracking-widest">
                  Want personalized AI recommendations?
                </h3>
                <p className="text-slate-500 text-[10px] uppercase tracking-wider font-bold mt-1">
                  Complete the AI Study Calibration on the dashboard to find your perfect matches.
                </p>
              </div>
            </div>
            <Link
              href="/dashboard"
              className="px-5 py-2.5 bg-bauhaus-yellow text-background font-black text-[10px] uppercase tracking-widest border-2 border-bauhaus-yellow hover:bg-transparent hover:text-bauhaus-yellow transition-all shrink-0 brutal-shadow-yellow hover:translate-x-[-2px] hover:translate-y-[-2px]"
            >
              Go to Calibration
            </Link>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-surface border-2 border-[#333] p-4 mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="SEARCH BY NAME OR PROVIDER..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-5 h-5 text-slate-500" />}
              className="h-12 text-sm"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center justify-center gap-2 h-12 px-4 bg-surface-2 border-2 border-[#333] text-slate-400 font-black text-xs uppercase tracking-widest"
          >
            <SlidersHorizontal className="w-5 h-5" />
            Filters
          </button>

          <div className={`md:flex gap-4 ${showFilters ? 'flex flex-col' : 'hidden'}`}>
            <Select options={categories} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="h-12 min-w-[200px]" />
            <Select options={educationLevels} value={educationFilter} onChange={(e) => setEducationFilter(e.target.value)} className="h-12 min-w-[200px]" />
          </div>
        </div>

        {/* Results */}
        <div className="mb-6 flex items-center justify-between text-[10px] text-slate-500 font-black uppercase tracking-widest">
          <p>
            Showing <span className="text-foreground">{displayedScholarships.length}</span> of <span className="text-foreground">{filteredScholarships.length}</span> results
          </p>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <span>By Deadline</span>
          </div>
        </div>

        {displayedScholarships.length > 0 ? (
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
              <AnimatePresence>
                {/* 1. First 3 normal cards */}
                {displayedScholarships.slice(0, 3).map((scholarship) => (
                  <ScholarshipCard
                    key={scholarship.id}
                    scholarship={scholarship}
                    isSaved={savedIds.includes(scholarship.id)}
                    onToggleSave={(e) => handleToggleSave(e, scholarship.id)}
                    onOpenDetails={() => setSelectedScholarship(scholarship)}
                  />
                ))}

                {/* 2. Next cards, rendered as blurred if user is not logged in */}
                {!user && filteredScholarships.length > 3 && (
                  filteredScholarships.slice(3, 6).map((scholarship) => (
                    <div key={scholarship.id} className="blur-[4px] opacity-65 pointer-events-none select-none">
                      <ScholarshipCard
                        scholarship={scholarship}
                        isSaved={false}
                        onToggleSave={() => { }}
                        onOpenDetails={() => { }}
                      />
                    </div>
                  ))
                )}

                {/* 3. If user is logged in, render the rest normally */}
                {user && displayedScholarships.slice(3).map((scholarship) => (
                  <ScholarshipCard
                    key={scholarship.id}
                    scholarship={scholarship}
                    isSaved={savedIds.includes(scholarship.id)}
                    onToggleSave={(e) => handleToggleSave(e, scholarship.id)}
                    onOpenDetails={() => setSelectedScholarship(scholarship)}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* 4. Overlay Box for Anonymous Users */}
            {!user && filteredScholarships.length > 3 && (
              <div className="absolute bottom-0 left-0 right-0 top-[33.3%] md:top-[50%] bg-background/40 backdrop-blur-[1px] flex flex-col items-center justify-center pb-8 pt-12 px-4 z-20">
                <div className="bg-surface border-3 border-foreground p-8 sm:p-10 text-center max-w-lg brutal-shadow-lg relative flex flex-col items-center">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-bauhaus-red/5 -mr-8 -mt-8 rounded-full" />

                  <div className="w-12 h-12 bg-bauhaus-yellow text-white flex items-center justify-center mb-5 brutal-border border-foreground">
                    <Sparkles className="w-6 h-6 text-black" />
                  </div>

                  <h3 className="text-foreground font-black text-lg sm:text-xl uppercase tracking-wider mb-3 leading-tight">
                    VIEW All {filteredScholarships.length} Opportunities
                  </h3>

                  <p className="text-slate-500 text-xs uppercase tracking-wider font-bold max-w-xs mb-6">
                    Sign in with your email or Google account to view the full matching list and apply.
                  </p>

                  <Link href="/login">
                    <button className="px-6 py-3.5 bg-bauhaus-red text-white text-xs font-black uppercase tracking-widest border-2 border-bauhaus-red hover:bg-transparent hover:text-bauhaus-red transition-all flex items-center gap-2 cursor-pointer brutal-shadow-sm hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#D92A2A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
                      Login to View More
                      <ArrowRight className="w-4.5 h-4.5" />
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-20 text-center bg-surface border-2 border-[#333] flex flex-col items-center">
            <Search className="w-10 h-10 text-slate-600 mb-4" />
            <h3 className="text-lg font-black uppercase tracking-wider text-foreground mb-2">No Results</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto uppercase tracking-wider">
              Try adjusting your filters.
            </p>
            <button
              onClick={() => { setSearchQuery(""); setCategoryFilter(""); setEducationFilter(""); }}
              className="mt-6 px-6 py-2.5 bg-foreground text-background font-black text-xs uppercase tracking-widest border-2 border-foreground hover:bg-transparent hover:text-foreground transition-all cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedScholarship && (
          <ScholarshipDetailModal
            scholarship={selectedScholarship}
            isOpen={!!selectedScholarship}
            onClose={() => setSelectedScholarship(null)}
            isSaved={savedIds.includes(selectedScholarship.id)}
            onToggleSave={() => handleToggleSave({} as React.MouseEvent, selectedScholarship.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
