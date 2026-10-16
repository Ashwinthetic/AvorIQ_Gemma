"use client";

import { useState, useEffect } from "react";
import { Scholarship } from "../types/scholarship";
import { X, Calendar, Banknote, ShieldAlert, Award, FileText, CheckCircle2, Bookmark, BookmarkCheck, ExternalLink, Sparkles, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ScholarshipDetailModalProps {
  scholarship: Scholarship;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: () => void;
}

export default function ScholarshipDetailModal({
  scholarship,
  isOpen,
  onClose,
  isSaved,
  onToggleSave,
}: ScholarshipDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "eligibility" | "documents" | "steps" | "faqs">("overview");
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApply = () => {
    setApplying(true);
    setTimeout(() => {
      setApplying(false);
      setApplied(true);
    }, 2000);
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Award },
    { id: "eligibility", label: "Eligibility", icon: ShieldAlert },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "steps", label: "Steps", icon: CheckCircle2 },
    { id: "faqs", label: "FAQs", icon: HelpCircle },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.15 }}
          className="relative w-full max-w-3xl max-h-[85vh] bg-surface border-2 border-foreground brutal-shadow-lg flex flex-col overflow-hidden z-10"
        >
          {/* Header */}
          <div className="p-6 border-b-2 border-[#333] flex items-start justify-between">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 text-[9px] font-black tracking-widest inline-block uppercase bg-bauhaus-red/10 border-2 border-bauhaus-red text-bauhaus-red">
                {scholarship.category}
              </span>
              <h2 className="text-foreground text-xl md:text-2xl font-black uppercase tracking-wide leading-snug mt-2">
                {scholarship.name}
              </h2>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{scholarship.provider}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-foreground border-2 border-transparent hover:border-foreground transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-0 border-b-2 border-[#333] text-sm">
            <div className="flex items-center gap-2.5 p-4 border-r-2 border-[#333]">
              <Banknote className="w-5 h-5 text-bauhaus-yellow" />
              <div>
                <span className="text-slate-600 text-[9px] uppercase block font-black tracking-wider">Value</span>
                <span className="text-foreground font-black">{scholarship.amountFormatted}</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-4 md:border-r-2 border-[#333]">
              <Calendar className="w-5 h-5 text-bauhaus-red" />
              <div>
                <span className="text-slate-600 text-[9px] uppercase block font-black tracking-wider">Deadline</span>
                <span className="text-foreground font-bold">
                  {new Date(scholarship.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-4 col-span-2 md:col-span-1">
              <Sparkles className="w-5 h-5 text-accent-emerald" />
              <div>
                <span className="text-slate-600 text-[9px] uppercase block font-black tracking-wider">Status</span>
                <span className="text-foreground font-bold">{scholarship.status}</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-0 overflow-x-auto border-b-2 border-[#333]">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all cursor-pointer border-b-3 -mb-[2px] ${
                    activeTab === tab.id
                      ? "border-bauhaus-red text-bauhaus-red bg-bauhaus-red/5"
                      : "border-transparent text-slate-500 hover:text-foreground"
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-foreground font-black text-sm uppercase tracking-wider">About</h3>
                  <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line">{scholarship.description}</p>
                </div>
                <div className="p-5 bg-surface-2 border-2 border-[#333] space-y-3">
                  <h4 className="text-bauhaus-yellow font-black text-xs uppercase tracking-wider flex items-center gap-2">
                    <Award className="w-4.5 h-4.5" />
                    Coverage & Benefits
                  </h4>
                  <p className="text-slate-400 text-sm leading-relaxed">{scholarship.benefits || scholarship.coverage}</p>
                </div>
              </div>
            )}

            {activeTab === "eligibility" && (
              <div className="space-y-6">
                <h3 className="text-foreground font-black text-sm uppercase tracking-wider">Who Can Apply?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                  {[
                    { label: "Academic Level", value: scholarship.eligibility.educationLevel.join(", ") },
                    { label: "Gender", value: scholarship.eligibility.gender === "All" ? "Open to all" : `${scholarship.eligibility.gender} only` },
                    { label: "Family Income", value: scholarship.eligibility.familyIncomeMax > 0 ? `Below ₹${scholarship.eligibility.familyIncomeMax.toLocaleString("en-IN")}` : "No limit" },
                    { label: "States", value: scholarship.eligibility.states.includes("All") ? "All India" : scholarship.eligibility.states.join(", ") },
                    { label: "Category", value: scholarship.eligibility.castes.join(", ") },
                    { label: "Field of Study", value: scholarship.eligibility.fieldsOfStudy.includes("All") ? "All streams" : scholarship.eligibility.fieldsOfStudy.join(", ") },
                  ].map((item, i) => (
                    <div key={i} className="p-4 border-2 border-[#333] space-y-1">
                      <span className="text-slate-600 text-[9px] uppercase font-black tracking-wider block">{item.label}</span>
                      <span className="text-slate-300 text-sm font-bold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "documents" && (
              <div className="space-y-4">
                <h3 className="text-foreground font-black text-sm uppercase tracking-wider">Required Documents</h3>
                <div className="space-y-0">
                  {scholarship.documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3.5 border-2 border-[#333] text-sm text-slate-400">
                      <div className="w-6 h-6 bg-bauhaus-red text-white flex items-center justify-center font-black text-[10px]">
                        {idx + 1}
                      </div>
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "steps" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-foreground font-black text-sm uppercase tracking-wider mb-2">Selection Process</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{scholarship.selectionProcess}</p>
                </div>
                <div className="space-y-0">
                  <h3 className="text-foreground font-black text-sm uppercase tracking-wider mb-4">Application Steps</h3>
                  {["Check Eligibility", "Scan Official Papers", "Click Apply Online"].map((step, i) => (
                    <div key={i} className="flex gap-4 p-4 border-2 border-[#333]">
                      <div className="w-8 h-8 bg-bauhaus-red text-white flex items-center justify-center font-black text-sm shrink-0">
                        {i + 1}
                      </div>
                      <div>
                        <h4 className="text-foreground font-black text-xs uppercase tracking-wider">{step}</h4>
                        <p className="text-slate-500 text-xs mt-1">
                          {i === 0 && "Review criteria under the Eligibility tab."}
                          {i === 1 && "Prepare PDF copies of marksheet, income proof, Aadhaar."}
                          {i === 2 && "Navigate to the official board site via AvorIQ."}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "faqs" && (
              <div className="space-y-4">
                <h3 className="text-foreground font-black text-sm uppercase tracking-wider">FAQs</h3>
                {scholarship.faqs && scholarship.faqs.length > 0 ? (
                  <div className="space-y-0">
                    {scholarship.faqs.map((faq, idx) => (
                      <div key={idx} className="p-4 border-2 border-[#333] space-y-2">
                        <h4 className="text-foreground font-black text-xs uppercase tracking-wider flex items-start gap-2">
                          <span className="text-bauhaus-red font-mono">Q.</span>
                          {faq.question}
                        </h4>
                        <p className="text-slate-400 text-sm leading-relaxed pl-5">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm uppercase tracking-wider">No FAQs available.</p>
                )}
              </div>
            )}
          </div>

          {/* Actions Bar */}
          <div className="p-6 border-t-2 border-[#333] flex items-center justify-between gap-4">
            <button
              onClick={onToggleSave}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-black uppercase tracking-widest transition-all cursor-pointer border-2 ${
                isSaved
                  ? "bg-bauhaus-red/10 border-bauhaus-red text-bauhaus-red"
                  : "bg-transparent border-[#333] text-slate-400 hover:border-foreground hover:text-foreground"
              }`}
            >
              {isSaved ? <BookmarkCheck className="w-4.5 h-4.5" /> : <Bookmark className="w-4.5 h-4.5" />}
              <span>{isSaved ? "Saved" : "Save"}</span>
            </button>

            <div className="flex items-center gap-3">
              <a
                href={scholarship.officialLink}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-2 px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-400 border-2 border-[#333] hover:border-foreground hover:text-foreground transition-all"
              >
                Official Link
                <ExternalLink className="w-4 h-4" />
              </a>

              {applied ? (
                <button className="flex items-center gap-2 px-6 py-3 text-xs font-black uppercase tracking-widest text-white bg-accent-emerald border-2 border-accent-emerald cursor-default">
                  <CheckCircle2 className="w-4.5 h-4.5" />
                  Simulated!
                </button>
              ) : (
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="flex items-center gap-2 px-6 py-3 text-xs font-black uppercase tracking-widest text-white bg-bauhaus-red border-2 border-bauhaus-red hover:bg-transparent hover:text-bauhaus-red transition-all cursor-pointer disabled:opacity-50"
                >
                  {applying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin" />
                      Opening...
                    </>
                  ) : (
                    <>
                      Apply Online
                      <ExternalLink className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
