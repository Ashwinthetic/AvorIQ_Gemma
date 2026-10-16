"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { ArrowRight, ArrowLeft, Sparkles, Check, School, Award, MapPin, IndianRupee, ShieldAlert } from "lucide-react";

export default function QuestionnairePage() {
  const router = useRouter();
  const { completeQuestionnaire, userProfile } = useAuth();
  
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [education, setEducation] = useState("");
  const [gender, setGender] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [enrollmentNumber, setEnrollmentNumber] = useState("");
  const [familyIncome, setFamilyIncome] = useState("");
  const [state, setState] = useState("");
  const [caste, setCaste] = useState("");
  const [error, setError] = useState<string | null>(null);

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", 
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", 
    "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry", "All Regions", "Other / Global"
  ];

  const isCollegeStudent = education === "UG" || education === "PG";

  // Pre-populate input values if the user has an existing profile (Edit Mode)
  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || "");
      setEducation(userProfile.educationLevel || "");
      setGender(userProfile.gender || "");
      setCollegeName(userProfile.collegeName || "");
      setEnrollmentNumber(userProfile.enrollmentNumber || "");
      setFamilyIncome(userProfile.familyIncomeMax ? String(userProfile.familyIncomeMax) : "");
      setState(userProfile.state || "");
      setCaste(userProfile.caste || "");
    }
  }, [userProfile]);

  const handleNext = () => {
    setError(null);
    if (step === 1) {
      if (!name.trim()) {
        setError("Please enter your full name.");
        return;
      }
      if (!education) {
        setError("Please select your academic level.");
        return;
      }
      if (!gender) {
        setError("Please select your gender.");
        return;
      }
      if (isCollegeStudent) {
        if (!collegeName.trim()) {
          setError("Please enter your college name.");
          return;
        }
        if (!enrollmentNumber.trim()) {
          setError("Please enter your enrollment number.");
          return;
        }
      }
      setStep(2);
    } else if (step === 2) {
      if (!familyIncome || isNaN(Number(familyIncome)) || Number(familyIncome) < 2500) {
        setError("Please enter your full annual family income (minimum ₹2,500).");
        return;
      }
      if (!state) {
        setError("Please select your region / state of domicile.");
        return;
      }
      setStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!caste) {
      setError("Please select your caste/category.");
      return;
    }

    try {
      const profileData = {
        name: name.trim(),
        educationLevel: education,
        gender,
        familyIncomeMax: Number(familyIncome),
        state,
        caste,
        ...(isCollegeStudent ? { collegeName: collegeName.toUpperCase(), enrollmentNumber: enrollmentNumber.toUpperCase() } : {}),
      };
      
      await completeQuestionnaire(profileData);
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError("Failed to save your profile. Please try again.");
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center pt-24 pb-12 px-4">
      <div className="relative z-10 w-full max-w-xl">
        <div className="bg-surface border-2 border-foreground brutal-shadow-lg p-8 sm:p-10 relative">
          
          {/* Progress Bar */}
          <div className="w-full bg-surface-2 border-2 border-foreground h-4 mb-8 relative">
            <div 
              className="bg-bauhaus-red h-full border-r-2 border-foreground transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          {/* Step Counter */}
          <div className="flex items-center justify-between mb-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <span>Profile Setup</span>
            <span className="text-bauhaus-red">Step {step} of 3</span>
          </div>

          {/* Title Header */}
          <div className="mb-8">
            <h1 className="text-foreground text-2xl font-black uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-bauhaus-yellow" />
              {userProfile ? "Edit Your Profile" : "Build Your Profile"}
            </h1>
            <p className="text-slate-500 text-xs uppercase tracking-wider mt-2 font-bold leading-relaxed">
              We use this information to customize your AI student suite dashboard and find matched opportunities.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 bg-bauhaus-red/10 border-2 border-bauhaus-red text-bauhaus-red text-xs font-bold uppercase tracking-wider">
              <span>{error}</span>
            </div>
          )}

          {/* Form Wizard */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Step 1: Academic & Gender */}
            {step === 1 && (
              <div className="space-y-6">
                {/* Full Name */}
                <div className="space-y-3">
                  <label className="text-foreground text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ENTER YOUR FULL NAME"
                    className="w-full px-4 py-3.5 bg-surface-2 border-2 border-[#333] text-foreground text-sm font-bold uppercase tracking-wider focus:border-bauhaus-red focus:shadow-[3px_3px_0px_0px_#D92A2A] transition-all outline-none placeholder:text-slate-600"
                  />
                </div>

                {/* Academic Level */}
                <div className="space-y-3">
                  <label className="text-foreground text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                    <School className="w-4 h-4 text-bauhaus-red" />
                    Academic / Education Level
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { value: "High School", label: "High School" },
                      { value: "UG", label: "Undergraduate (UG)" },
                      { value: "PG", label: "Postgraduate (PG)" }
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setEducation(opt.value);
                          setError(null);
                        }}
                        className={`p-3.5 text-center border-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                          education === opt.value
                            ? "bg-bauhaus-red/10 border-bauhaus-red text-bauhaus-red brutal-shadow-sm"
                            : "bg-surface-2 border-[#333] text-slate-400 hover:border-foreground hover:text-foreground"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gender */}
                <div className="space-y-3">
                  <label className="text-foreground text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-bauhaus-red" />
                    Gender
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "Male", label: "Male" },
                      { value: "Female", label: "Female" },
                      { value: "All", label: "Other" }
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setGender(opt.value)}
                        className={`p-3.5 text-center border-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                          gender === opt.value
                            ? "bg-bauhaus-red/10 border-bauhaus-red text-bauhaus-red brutal-shadow-sm"
                            : "bg-surface-2 border-[#333] text-slate-400 hover:border-foreground hover:text-foreground"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* College Info (Conditional on UG or PG selection) */}
                {isCollegeStudent && (
                  <div className="space-y-4 pt-4 border-t-2 border-[#333]">
                    <div className="space-y-1.5">
                      <label className="text-foreground text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                        College / University Name
                      </label>
                      <input
                        type="text"
                        required
                        value={collegeName}
                        onChange={(e) => setCollegeName(e.target.value)}
                        placeholder="ENTER YOUR COLLEGE NAME"
                        className="w-full px-4 py-3 bg-surface-2 border-2 border-[#333] text-foreground text-sm font-bold uppercase tracking-wider focus:border-bauhaus-red focus:shadow-[3px_3px_0px_0px_#D92A2A] transition-all outline-none placeholder:text-slate-600"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-foreground text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                        Enrollment / Registration Number
                      </label>
                      <input
                        type="text"
                        required
                        value={enrollmentNumber}
                        onChange={(e) => setEnrollmentNumber(e.target.value)}
                        placeholder="ENTER ENROLLMENT NUMBER"
                        className="w-full px-4 py-3 bg-surface-2 border-2 border-[#333] text-foreground text-sm font-bold uppercase tracking-wider focus:border-bauhaus-red focus:shadow-[3px_3px_0px_0px_#D92A2A] transition-all outline-none placeholder:text-slate-600"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Income & Domicile */}
            {step === 2 && (
              <div className="space-y-6">
                {/* Annual Family Income */}
                <div className="space-y-2">
                  <label className="text-foreground text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                    <IndianRupee className="w-4 h-4 text-bauhaus-red" />
                    Annual Family Income (INR)
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-3.5 text-slate-500 font-bold text-sm">₹</div>
                    <input
                      type="number"
                      required
                      value={familyIncome}
                      onChange={(e) => setFamilyIncome(e.target.value)}
                      placeholder="e.g. 250000"
                      className="w-full pl-8 pr-4 py-3 bg-surface-2 border-2 border-[#333] text-foreground text-sm font-bold focus:border-bauhaus-red focus:shadow-[3px_3px_0px_0px_#D92A2A] transition-all outline-none"
                    />
                  </div>
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                    Enter the total gross annual income of your family from all sources.
                  </span>
                </div>

                {/* Region / State of Domicile */}
                <div className="space-y-2">
                  <label className="text-foreground text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-bauhaus-red" />
                    Region / State of Domicile
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-4 py-3.5 bg-surface-2 border-2 border-[#333] text-foreground text-xs font-black uppercase tracking-widest focus:border-bauhaus-red transition-all outline-none"
                  >
                    <option value="">Select Region / State</option>
                    {indianStates.map((st) => (
                      <option key={st} value={st}>{st.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Step 3: Caste/Category */}
            {step === 3 && (
              <div className="space-y-6">
                {/* Caste/Category */}
                <div className="space-y-3">
                  <label className="text-foreground text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-bauhaus-red" />
                    Caste / Social Category
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["General", "OBC", "SC", "ST"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setCaste(opt)}
                        className={`p-4 text-center border-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                          caste === opt
                            ? "bg-bauhaus-red/10 border-bauhaus-red text-bauhaus-red brutal-shadow-sm"
                            : "bg-surface-2 border-[#333] text-slate-400 hover:border-foreground hover:text-foreground"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-bauhaus-yellow/5 border-2 border-bauhaus-yellow text-slate-400 text-[10px] font-bold leading-relaxed uppercase tracking-wider">
                  ⚠️ DOUBLE CHECK YOUR ENTRIES. THESE PARAMETERS DETERMINE YOUR SCHOLARSHIP MATCHING AND ELIGIBILITY FILTERS.
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center gap-3 mt-8 pt-4 border-t-2 border-[#333]">
              {step === 1 && userProfile && (
                <button
                  type="button"
                  onClick={() => router.push("/scholarships")}
                  className="px-5 py-3.5 border-2 border-[#333] text-slate-400 hover:border-foreground hover:text-foreground text-xs font-black uppercase tracking-widest transition-all cursor-pointer"
                >
                  Cancel
                </button>
              )}

              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex items-center justify-center gap-2 px-5 py-3.5 bg-surface-2 border-2 border-[#333] text-slate-400 text-xs font-black uppercase tracking-widest hover:border-foreground hover:text-foreground transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              )}
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-foreground text-background border-2 border-foreground hover:bg-transparent hover:text-foreground transition-all text-xs font-black uppercase tracking-widest cursor-pointer brutal-shadow-sm hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[3px_3px_0px_0px_#F0F0F0]"
                >
                  Next Step
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-bauhaus-red text-white border-2 border-bauhaus-red hover:bg-transparent hover:text-bauhaus-red transition-all text-xs font-black uppercase tracking-widest cursor-pointer brutal-shadow-sm hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#D92A2A] active:translate-x-[2px] active:translate-y-[2px]"
                >
                  Complete Setup
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}
