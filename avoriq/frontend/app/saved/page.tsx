"use client";

import { useState, useEffect } from "react";
import { mockScholarships } from "../../data/scholarships";
import { Scholarship } from "../../types/scholarship";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import ScholarshipCard from "../../components/ScholarshipCard";
import ScholarshipDetailModal from "../../components/ScholarshipDetailModal";
import { Bookmark, Sparkles, LayoutDashboard, ArrowRight, Trash2, CheckCircle2, Hourglass } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";

interface ProgressState {
  [key: string]: "saved" | "vetted" | "applied" | "approved" | "disbursed";
}

export default function SavedScholarshipsPage() {
  const [savedIds, setSavedIds] = useLocalStorage<string[]>("avoriq_saved", []);
  const [progressState, setProgressState] = useLocalStorage<ProgressState>("avoriq_progress", {});
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);

  const savedScholarships = mockScholarships.filter((s) => savedIds.includes(s.id));

  useEffect(() => {
    const list = mockScholarships.filter((s) => savedIds.includes(s.id));
    let changed = false;
    const updatedProgress = { ...progressState };
    list.forEach((s) => {
      if (!updatedProgress[s.id]) { updatedProgress[s.id] = "saved"; changed = true; }
    });
    if (changed) {
      const timer = setTimeout(() => setProgressState(updatedProgress), 0);
      return () => clearTimeout(timer);
    }
  }, [savedIds, progressState, setProgressState]);

  const handleRemove = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedIds(savedIds.filter((x) => x !== id));
  };

  const handleUpdateProgress = (id: string, stage: "saved" | "vetted" | "applied" | "approved" | "disbursed") => {
    setProgressState({ ...progressState, [id]: stage });
    if (stage === "disbursed") confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
  };

  const stages = [
    { key: "saved", label: "Saved" },
    { key: "vetted", label: "Checked" },
    { key: "applied", label: "Applied" },
    { key: "approved", label: "Approved" },
    { key: "disbursed", label: "Funds" },
  ];

  return (
    <div className="min-h-screen pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10 space-y-2">
          <span className="text-bauhaus-red text-[10px] font-black uppercase tracking-[0.3em] block">Dashboard</span>
          <h1 className="text-foreground text-3xl md:text-4xl font-black uppercase tracking-tight leading-[0.95]">
            SAVED <span className="text-bauhaus-red">OPPORTUNITIES</span>
          </h1>
          <div className="w-24 h-[3px] bg-bauhaus-red mt-2" />
          <p className="text-slate-500 text-sm uppercase tracking-wider font-medium">
            Track progress from saved to funds received.
          </p>
        </div>

        {savedScholarships.length === 0 ? (
          <div className="p-12 max-w-xl mx-auto text-center bg-surface border-2 border-foreground brutal-shadow space-y-6 mt-10">
            <Bookmark className="w-10 h-10 text-bauhaus-red mx-auto" />
            <h3 className="text-foreground font-black text-lg uppercase tracking-wider">No Saved Items</h3>
            <p className="text-slate-500 text-sm uppercase tracking-wider">
              Explore the Match Finder to bookmark opportunities.
            </p>
            <Link href="/scholarships">
              <button className="px-6 py-3 bg-bauhaus-red text-white text-xs font-black uppercase tracking-widest border-2 border-bauhaus-red hover:bg-transparent hover:text-bauhaus-red transition-all flex items-center gap-2 mx-auto cursor-pointer mt-4">
                Browse
                <ArrowRight className="w-4.5 h-4.5" />
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-0">
              {savedScholarships.map((s) => (
                <div key={s.id} className="relative group">
                  <ScholarshipCard
                    scholarship={s}
                    isSaved={true}
                    onToggleSave={(e) => handleRemove(s.id, e)}
                    onOpenDetails={() => setSelectedScholarship(s)}
                  />
                  <button
                    onClick={() => handleRemove(s.id)}
                    className="absolute top-4 right-14 p-2 border-2 border-transparent hover:border-bauhaus-red text-slate-500 hover:text-bauhaus-red transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1 bg-surface border-2 border-[#333] p-6 space-y-6 sticky top-24">
              <div>
                <h3 className="text-foreground text-xs font-black uppercase tracking-wider flex items-center gap-2">
                  <LayoutDashboard className="w-5 h-5 text-bauhaus-red" />
                  Pipeline
                </h3>
                <p className="text-slate-600 text-[10px] uppercase tracking-wider mt-1 font-bold">
                  Track application milestones
                </p>
              </div>

              <div className="space-y-6">
                {savedScholarships.map((s) => {
                  const currentStage = progressState[s.id] || "saved";
                  return (
                    <div key={s.id} className="p-4 bg-surface-2 border-2 border-[#333] space-y-3.5">
                      <span className="text-foreground text-[10px] font-black block truncate uppercase tracking-wider" title={s.name}>
                        {s.name}
                      </span>

                      <div className="flex items-center justify-between gap-1 text-[8px] font-black uppercase text-slate-600">
                        {stages.map((stage, idx) => {
                          const isCompleted = stages.findIndex((st) => st.key === currentStage) >= idx;
                          const isCurrent = stage.key === currentStage;
                          return (
                            <button
                              key={stage.key}
                              onClick={() => handleUpdateProgress(s.id, stage.key as any)}
                              className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
                                isCurrent ? "text-bauhaus-red" : isCompleted ? "text-accent-emerald" : "text-slate-700 hover:text-slate-400"
                              }`}
                            >
                              <div className={`w-4 h-4 flex items-center justify-center border-2 text-[8px] font-black transition-all ${
                                isCurrent
                                  ? "bg-bauhaus-red border-bauhaus-red text-white"
                                  : isCompleted
                                  ? "bg-accent-emerald/15 border-accent-emerald text-accent-emerald"
                                  : "bg-transparent border-[#333]"
                              }`}>
                                {isCompleted && !isCurrent ? "✔" : ""}
                              </div>
                              <span className="hidden md:inline">{stage.label}</span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="p-2.5 text-[10px] leading-relaxed flex items-center gap-2 bg-surface border-2 border-[#333] text-slate-500 font-bold uppercase tracking-wider">
                        {currentStage === "saved" && <><Hourglass className="w-3.5 h-3.5 text-bauhaus-red shrink-0" /><span>Organize documents.</span></>}
                        {currentStage === "vetted" && <><CheckCircle2 className="w-3.5 h-3.5 text-accent-emerald shrink-0" /><span>Documents verified. Ready to apply.</span></>}
                        {currentStage === "applied" && <><CheckCircle2 className="w-3.5 h-3.5 text-accent-emerald shrink-0" /><span>Submitted. Pending verification.</span></>}
                        {currentStage === "approved" && <><Sparkles className="w-3.5 h-3.5 text-bauhaus-yellow shrink-0" /><span>Approved! Awaiting disbursement.</span></>}
                        {currentStage === "disbursed" && <><Sparkles className="w-3.5 h-3.5 text-accent-emerald shrink-0" /><span className="text-accent-emerald">Funds received! 🎉</span></>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedScholarship && (
        <ScholarshipDetailModal
          scholarship={selectedScholarship}
          isOpen={true}
          onClose={() => setSelectedScholarship(null)}
          isSaved={savedIds.includes(selectedScholarship.id)}
          onToggleSave={() => handleRemove(selectedScholarship.id)}
        />
      )}
    </div>
  );
}
