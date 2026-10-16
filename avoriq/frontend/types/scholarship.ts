export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  amount: number; // Numeric value for sorting and filtering
  amountFormatted: string; // e.g., "₹12,000/year" or "₹1,50,000/year"
  deadline: string; // Date string (YYYY-MM-DD) or format (e.g. "31 Oct 2026")
  eligibility: {
    educationLevel: string[]; // "Class 6–10", "Class 11–12", "Diploma", "UG", "PG"
    gender: string; // "Male" | "Female" | "Other" | "All"
    familyIncomeMax: number; // e.g., 250000 (0 means no limit)
    states: string[]; // ["All"] or specific states e.g. ["Madhya Pradesh", "Maharashtra"]
    castes: string[]; // ["General", "OBC", "SC", "ST", "EWS"]
    fieldsOfStudy: string[]; // ["Science", "Commerce", "Arts", "Engineering", "Medical", "Law", "Management", "Others", "All"]
  };
  category: "Government" | "Private" | "NGO" | "International";
  description: string;
  documents: string[];
  officialLink: string;
  status: "Open" | "Closed" | "Ending Soon";
  coverage: string; // e.g., "Tuition Fee", "Monthly Stipend", "Full Ride"
  selectionProcess: string;
  benefits: string;
  faqs: {
    question: string;
    answer: string;
  }[];
}

export interface StudentProfile {
  name: string;
  educationLevel: string; // "High School" | "UG" | "PG"
  gender: string; // "Male" | "Female" | "Other"
  familyIncome: number; // Numeric income (derived from selections: e.g. below 1L = 100000)
  familyIncomeCategory: string; // "Below ₹1 Lakh" | "₹1–2.5 Lakhs" | "₹2.5–5 Lakhs" | "₹5–8 Lakhs" | "Above ₹8 Lakhs"
  state: string; // Searchable dropdown
  disabilityStatus: boolean;
  minorityStatus: boolean;
  caste: string; // "General" | "OBC" | "SC" | "ST" | "EWS"
  fieldOfStudy: string; // "Science" | "Commerce" | "Arts" | "Engineering" | "Medical" | "Law" | "Management" | "Others"
  interestCategory: string; // "Government" | "Private" | "NGO" | "International" | "All"
}
