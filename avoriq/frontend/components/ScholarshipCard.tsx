"use client";

import { Scholarship } from "../types/scholarship";
import { Calendar, Banknote, Bookmark, BookmarkCheck, ArrowUpRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import CountUp from "./reactbits/CountUp";

interface ScholarshipCardProps {
  scholarship: Scholarship;
  isSaved: boolean;
  onToggleSave: (e: React.MouseEvent) => void;
  onOpenDetails: () => void;
  matchScore?: number;
}

export default function ScholarshipCard({
  scholarship,
  isSaved,
  onToggleSave,
  onOpenDetails,
  matchScore,
}: ScholarshipCardProps) {
  const isEndingSoon = scholarship.status === "Ending Soon";
  const isOpen = scholarship.status === "Open";

  const formattedDate = new Date(scholarship.deadline).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.2 }}
      className="h-full cursor-pointer group"
      onClick={onOpenDetails}
    >
      <div className="p-6 h-full flex flex-col justify-between bg-surface border-2 border-[#333] hover:border-bauhaus-red hover:shadow-[4px_4px_0px_0px_#D92A2A] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all relative">

        <div>
          {/* Header: Provider & Bookmark */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 border-2 border-[#333] flex items-center justify-center font-black text-bauhaus-red text-sm uppercase bg-surface-2">
                {scholarship.provider.substring(0, 2)}
              </div>
              <div>
                <span className="text-slate-500 text-xs font-bold block truncate max-w-[180px] uppercase tracking-wider">
                  {scholarship.provider}
                </span>
                <span className="px-2 py-0.5 mt-1 text-[9px] font-black tracking-widest inline-block uppercase border-2 border-[#333] text-slate-400 bg-surface-2">
                  {scholarship.category}
                </span>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(e);
              }}
              className={`p-2 border-2 transition-all ${
                isSaved
                  ? "bg-bauhaus-red/10 border-bauhaus-red text-bauhaus-red"
                  : "border-[#333] text-slate-500 hover:text-foreground hover:border-foreground"
              }`}
              title={isSaved ? "Saved" : "Save"}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>
          </div>

          {/* Title */}
          <h3 className="text-foreground font-black text-base uppercase tracking-wide leading-snug mb-3 group-hover:text-bauhaus-red transition-colors duration-150 line-clamp-2">
            {scholarship.name}
          </h3>

          {/* Match Score */}
          {matchScore !== undefined && matchScore > 0 && (
            <div className="flex items-center gap-1.5 mb-4 bg-accent-emerald/10 border-2 border-accent-emerald text-accent-emerald px-2.5 py-1 text-[10px] font-black uppercase tracking-wider w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span><CountUp to={matchScore} />% Match</span>
            </div>
          )}

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3.5 py-4 my-2 border-y-2 border-[#333] text-sm">
            <div className="flex items-center gap-2">
              <Banknote className="w-4.5 h-4.5 text-bauhaus-yellow" />
              <div>
                <span className="text-slate-600 text-[9px] block uppercase font-black tracking-wider">Value</span>
                <span className="text-foreground font-black text-sm">{scholarship.amountFormatted}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className={`w-4.5 h-4.5 ${isEndingSoon ? "text-bauhaus-yellow" : "text-slate-500"}`} />
              <div>
                <span className="text-slate-600 text-[9px] block uppercase font-black tracking-wider">Deadline</span>
                <span className={`font-bold text-sm ${isEndingSoon ? "text-bauhaus-yellow" : "text-slate-300"}`}>
                  {formattedDate}
                </span>
              </div>
            </div>
          </div>

          {/* Eligibility snippet */}
          <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 my-3">
            <strong className="text-slate-400">Eligible:</strong> {scholarship.eligibility.educationLevel.join(", ")} | Max Income: ₹{scholarship.eligibility.familyIncomeMax > 0 ? scholarship.eligibility.familyIncomeMax.toLocaleString("en-IN") : "None"}
          </p>
        </div>

        {/* Footer / Status */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t-2 border-[#333]">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest border-2
            ${
              isEndingSoon
                ? "bg-bauhaus-yellow/10 border-bauhaus-yellow text-bauhaus-yellow"
                : isOpen
                ? "bg-accent-emerald/10 border-accent-emerald text-accent-emerald"
                : "bg-bauhaus-red/10 border-bauhaus-red text-bauhaus-red"
            }`}
          >
            <span className={`w-1.5 h-1.5 ${isEndingSoon ? "bg-bauhaus-yellow" : isOpen ? "bg-accent-emerald" : "bg-bauhaus-red"}`} />
            {scholarship.status}
          </span>

          <button className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider text-bauhaus-red group-hover:text-foreground transition-all">
            Details
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
