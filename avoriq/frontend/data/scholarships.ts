import { Scholarship } from "../types/scholarship";

export const mockScholarships: Scholarship[] = [
  {
    "id": "gov-nmms",
    "name": "National Means-cum-Merit Scholarship (NMMS)",
    "provider": "Ministry of Education, Government of India",
    "amount": 12000,
    "amountFormatted": "\u20b912,000/year",
    "deadline": "2026-10-31",
    "eligibility": {
      "educationLevel": [
        "Class 6\u201310",
        "Class 11\u201312"
      ],
      "gender": "All",
      "familyIncomeMax": 350000,
      "states": [
        "All"
      ],
      "castes": [
        "General",
        "OBC",
        "SC",
        "ST",
        "EWS"
      ],
      "fieldsOfStudy": [
        "All"
      ]
    },
    "category": "Government",
    "description": "A central government initiative to award scholarships to meritorious students of economically weaker sections to arrest their drop-out at class VIII and encourage them to continue study at secondary stage.",
    "documents": [
      "Income Certificate of parents",
      "Class 7 & 8 Marksheets",
      "Caste Certificate (if applicable)",
      "Disability Certificate (if applicable)",
      "Bank Account Details linked with Aadhaar"
    ],
    "officialLink": "https://scholarships.gov.in",
    "status": "Open",
    "coverage": "Monthly Stipend of \u20b91,00,000",
    "selectionProcess": "State-level NMMS Examination consisting of Mental Ability Test (MAT) and Scholastic Aptitude Test (SAT).",
    "benefits": "Provides \u20b91,000 per month (totaling \u20b912,000 per annum) from Class 9 to Class 12 in government or government-aided schools.",
    "faqs": [
      {
        "question": "Can private school students apply?",
        "answer": "No, NMMS is only for students studying in State Government, Government-aided, and Local Body schools."
      },
      {
        "question": "What is the minimum score required in previous classes?",
        "answer": "Students must secure at least 55% marks (50% for SC/ST) in Class 7 and Class 8 examinations."
      }
    ]
  },
  {
    "id": "gov-csss",
    "name": "Central Sector Scheme of Scholarship for College and University Students",
    "provider": "Department of Higher Education, Government of India",
    "amount": 20000,
    "amountFormatted": "\u20b920,000/year",
    "deadline": "2026-11-15",
    "eligibility": {
      "educationLevel": [
        "UG",
        "PG"
      ],
      "gender": "All",
      "familyIncomeMax": 450000,
      "states": [
        "All"
      ],
      "castes": [
        "General",
        "OBC",
        "SC",
        "ST",
        "EWS"
      ],
      "fieldsOfStudy": [
        "Science",
        "Commerce",
        "Arts",
        "Engineering",
        "Medical",
        "Law",
        "Management"
      ]
    },
    "category": "Government",
    "description": "To provide financial assistance to meritorious students from economically weaker sections to meet a part of their day-to-day expenses while pursuing higher studies.",
    "documents": [
      "Class 12 Marksheet showing >80th percentile",
      "Income Certificate (Family income below \u20b94.5 Lakhs)",
      "Aadhaar Card",
      "College Admission/Fee Receipt",
      "Bank Passbook"
    ],
    "officialLink": "https://scholarships.gov.in",
    "status": "Open",
    "coverage": "Direct Benefit Transfer (DBT)",
    "selectionProcess": "Based on Board Exam results (above 80th percentile of successful candidates in Class 12).",
    "benefits": "\u20b912,000 per annum for the first three years of undergraduate study, and \u20b920,000 per annum for post-graduate study or professional courses (4th/5th year).",
    "faqs": [
      {
        "question": "Is there a merit cutoff?",
        "answer": "Yes, students must be in the top 20th percentile of their respective board's Class 12 results."
      },
      {
        "question": "Is it renewable?",
        "answer": "Yes, renewal is based on maintaining at least 50% marks in university exams and 75% attendance."
      }
    ]
  },
  {
    "id": "pvt-hdfc",
    "name": "HDFC Bank Parivartan's ECS Scholarship",
    "provider": "HDFC Bank Ltd.",
    "amount": 75000,
    "amountFormatted": "\u20b975,000/year",
    "deadline": "2026-09-30",
    "eligibility": {
      "educationLevel": [
        "Class 6\u201310",
        "Class 11\u201312",
        "Diploma",
        "UG",
        "PG"
      ],
      "gender": "All",
      "familyIncomeMax": 600000,
      "states": [
        "All"
      ],
      "castes": [
        "General",
        "OBC",
        "SC",
        "ST",
        "EWS"
      ],
      "fieldsOfStudy": [
        "All",
        "Science",
        "Commerce",
        "Arts",
        "Engineering",
        "Medical",
        "Law",
        "Management"
      ]
    },
    "category": "Private",
    "description": "HDFC Bank Parivartan's Educational Crisis Scholarship (ECS) aims to support meritorious and needy students belonging to underprivileged sections of society.",
    "documents": [
      "Previous year's marksheet",
      "Identity proof (Aadhaar/Voter ID)",
      "Current year admission proof",
      "Family Income proof (Salary slips, ITR, or Govt certificate)",
      "Proof of personal/family crisis (if applicable)"
    ],
    "officialLink": "https://www.buddy4study.com",
    "status": "Open",
    "coverage": "School/College Fees and Expenses",
    "selectionProcess": "Initial screening based on academic merit and financial background, followed by a telephonic interview.",
    "benefits": "Up to \u20b935,000 for school students (Class 6-12) and up to \u20b975,000 for undergraduate, postgraduate, or diploma programs.",
    "faqs": [
      {
        "question": "What is an 'Educational Crisis' in this context?",
        "answer": "It covers students facing financial issues due to sudden job loss, medical emergency, death of a breadwinner, or general financial distress."
      }
    ]
  },
  {
    "id": "pvt-loreal",
    "name": "L'Or\u00e9al India For Young Women in Science Scholarship",
    "provider": "L'Or\u00e9al India",
    "amount": 250000,
    "amountFormatted": "\u20b92,50,000/course",
    "deadline": "2026-10-15",
    "eligibility": {
      "educationLevel": [
        "UG"
      ],
      "gender": "Female",
      "familyIncomeMax": 600000,
      "states": [
        "All"
      ],
      "castes": [
        "General",
        "OBC",
        "SC",
        "ST",
        "EWS"
      ],
      "fieldsOfStudy": [
        "Science",
        "Engineering",
        "Medical"
      ]
    },
    "category": "Private",
    "description": "An exclusive scholarship that helps young women from economically disadvantaged backgrounds pursue tertiary education in any scientific field.",
    "documents": [
      "Class 10 & 12 Marksheets (min 85% in PCB/PCM in Class 12)",
      "Income certificate of family",
      "Aadhaar Card",
      "Admission letter in a science-related UG course"
    ],
    "officialLink": "https://www.loreal.com/en/india/",
    "status": "Ending Soon",
    "coverage": "Full/Partial Tuition Fee support",
    "selectionProcess": "Screening of application details, an essay submission, followed by a personal interview round with the L'Or\u00e9al jury.",
    "benefits": "Total scholarship of \u20b92,50,000 distributed over the years of a science undergraduate course.",
    "faqs": [
      {
        "question": "Is this scholarship open to boys?",
        "answer": "No, this is exclusively designed to promote women's representation in STEM fields."
      },
      {
        "question": "Can a student pursuing B.A. or B.Com apply?",
        "answer": "No, it is strictly restricted to science fields (B.Sc., B.Tech, MBBS, B.Pharm, etc.)."
      }
    ]
  },
  {
    "id": "ngo-tata-pankh",
    "name": "Tata Capital Pankh Scholarship",
    "provider": "Tata Capital Limited",
    "amount": 50000,
    "amountFormatted": "\u20b950,000/year",
    "deadline": "2026-09-15",
    "eligibility": {
      "educationLevel": [
        "Class 11\u201312",
        "Diploma",
        "UG"
      ],
      "gender": "All",
      "familyIncomeMax": 400000,
      "states": [
        "All"
      ],
      "castes": [
        "General",
        "OBC",
        "SC",
        "ST",
        "EWS"
      ],
      "fieldsOfStudy": [
        "All",
        "Science",
        "Commerce",
        "Arts",
        "Engineering",
        "Medical"
      ]
    },
    "category": "NGO",
    "description": "Tata Capital Pankh Scholarship aims to support the higher education of students who belong to low-income families by providing financial assistance.",
    "documents": [
      "Marksheet of previous class (min 60% marks)",
      "Aadhaar Card",
      "Income Certificate",
      "Admission letter or Fee Receipt"
    ],
    "officialLink": "https://www.tatacapital.com",
    "status": "Open",
    "coverage": "Up to 80% of tuition fees paid",
    "selectionProcess": "Merit-cum-income screening followed by verification and telephonic round.",
    "benefits": "Scholarship support ranging from \u20b910,000 to \u20b950,000 depending on the level of course and tuition fees.",
    "faqs": [
      {
        "question": "What is the minimum percentage required in the previous class?",
        "answer": "Applicants must score at least 60% marks in their preceding annual examination."
      }
    ]
  },
  {
    "id": "gov-pragati",
    "name": "Pragati Scholarship Scheme for Girl Students (Technical Degree)",
    "provider": "AICTE, Government of India",
    "amount": 50000,
    "amountFormatted": "\u20b950,000/year",
    "deadline": "2026-11-30",
    "eligibility": {
      "educationLevel": [
        "UG",
        "Diploma"
      ],
      "gender": "Female",
      "familyIncomeMax": 800000,
      "states": [
        "All"
      ],
      "castes": [
        "General",
        "OBC",
        "SC",
        "ST",
        "EWS"
      ],
      "fieldsOfStudy": [
        "Engineering",
        "Others"
      ]
    },
    "category": "Government",
    "description": "An AICTE scheme that encourages and supports girl students to pursue technical education. Maximum two girls per family can apply.",
    "documents": [
      "Class 10 & 12 Marksheets",
      "AICTE approval letter of the college",
      "Income Certificate (Family income below \u20b98 Lakhs)",
      "Tuition Fee Receipt",
      "Aadhaar Card & Bank Details"
    ],
    "officialLink": "https://www.aicte-india.org",
    "status": "Open",
    "coverage": "\u20b950,000 per annum for tuition fees, computers, books, equipment, etc.",
    "selectionProcess": "Based on merit in the qualifying exam (JEE Mains / Class 12 board marks for degree admission).",
    "benefits": "\u20b950,000 per annum for every year of study (max 4 years for degree, 3 years for diploma). No separate document charges.",
    "faqs": [
      {
        "question": "Can a student pursuing B.Sc. apply?",
        "answer": "No, it is only for AICTE-approved technical courses like B.Tech, B.E., B.Arch, B.Pharm, or Diploma in engineering."
      }
    ]
  },
  {
    "id": "gov-mp-postmatric",
    "name": "Post Matric Scholarship Scheme for SC/ST/OBC Students - MP",
    "provider": "Government of Madhya Pradesh",
    "amount": 35000,
    "amountFormatted": "\u20b935,000/year",
    "deadline": "2026-12-31",
    "eligibility": {
      "educationLevel": [
        "Class 11\u201312",
        "Diploma",
        "UG",
        "PG"
      ],
      "gender": "All",
      "familyIncomeMax": 300000,
      "states": [
        "Madhya Pradesh"
      ],
      "castes": [
        "OBC",
        "SC",
        "ST"
      ],
      "fieldsOfStudy": [
        "All",
        "Science",
        "Commerce",
        "Arts",
        "Engineering",
        "Medical",
        "Law",
        "Management"
      ]
    },
    "category": "Government",
    "description": "Provides financial aid to SC, ST, and OBC students residing in Madhya Pradesh who are pursuing post-matric courses (11th standard onwards) in recognized colleges.",
    "documents": [
      "MP Samagra ID & Domicile Certificate",
      "Caste Certificate issued by SDM",
      "Income Certificate (Self-attested/Govt)",
      "College Admission Letter & Fee Structure",
      "High School Marksheet"
    ],
    "officialLink": "https://www.scholarshipportal.mp.nic.in",
    "status": "Open",
    "coverage": "100% Tuition Fee waiver + Monthly maintenance allowance",
    "selectionProcess": "Automatic approval for verified domicile students with valid category certificates admitted in recognized institutions.",
    "benefits": "Full tuition reimbursement up to government limits, along with hosteller/day scholar monthly stipends.",
    "faqs": [
      {
        "question": "Is this applicable to MP students studying outside MP?",
        "answer": "Yes, under specific guidelines if the outside college is approved by the Madhya Pradesh Higher Education Board."
      }
    ]
  },
  {
    "id": "gov-mahadbt",
    "name": "Rajarshi Chhatrapati Shahu Maharaj Fee Reimbursement Scheme - Maharashtra",
    "provider": "Directorate of Higher Education, Government of Maharashtra",
    "amount": 100000,
    "amountFormatted": "\u20b91,00,000/year",
    "deadline": "2026-12-15",
    "eligibility": {
      "educationLevel": [
        "UG",
        "PG"
      ],
      "gender": "All",
      "familyIncomeMax": 800000,
      "states": [
        "Maharashtra"
      ],
      "castes": [
        "General",
        "OBC",
        "EWS"
      ],
      "fieldsOfStudy": [
        "Science",
        "Commerce",
        "Arts",
        "Engineering",
        "Medical",
        "Law",
        "Management"
      ]
    },
    "category": "Government",
    "description": "Commonly known as EBC scholarship in Maharashtra, this scheme offers 50% to 100% tuition fee reimbursement to students belonging to open/EWS category.",
    "documents": [
      "Maharashtra Domicile Certificate",
      "Family Income Certificate (below \u20b98 Lakhs)",
      "CAP Round Allotment Letter (for professional courses)",
      "Previous Class Marksheet",
      "Aadhaar card linked with Bank Account"
    ],
    "officialLink": "https://mahadbt.maharashtra.gov.in",
    "status": "Open",
    "coverage": "50% to 100% of Tuition & Exam Fees",
    "selectionProcess": "Direct verification of state domicile, family income, and admission through central admission process (CAP).",
    "benefits": "Covers 50% tuition fees for Engineering/Medical in private colleges, and up to 100% in government colleges.",
    "faqs": [
      {
        "question": "Is it applicable for management quota admission?",
        "answer": "No, students admitted through management quota or institutional rounds are not eligible."
      }
    ]
  },
  {
    "id": "pvt-colgate",
    "name": "Keep India Smiling Foundational Scholarship",
    "provider": "Colgate-Palmolive (India) Ltd.",
    "amount": 30000,
    "amountFormatted": "\u20b930,000/year",
    "deadline": "2026-10-31",
    "eligibility": {
      "educationLevel": [
        "Class 11\u201312",
        "UG",
        "Diploma"
      ],
      "gender": "All",
      "familyIncomeMax": 500000,
      "states": [
        "All"
      ],
      "castes": [
        "General",
        "OBC",
        "SC",
        "ST",
        "EWS"
      ],
      "fieldsOfStudy": [
        "All",
        "Science",
        "Commerce",
        "Arts",
        "Engineering",
        "Medical"
      ]
    },
    "category": "Private",
    "description": "Designed to provide financial aid to deserving students who want to continue their education but face financial constraints.",
    "documents": [
      "Class 10/12 marksheet (min 60% for XI, min 60% for UG)",
      "Income Proof",
      "Aadhaar Card",
      "Admission letter/Fee Receipt",
      "Disability certificate (if applicable)"
    ],
    "officialLink": "https://www.buddy4study.com/page/keep-india-smiling-foundational-scholarship-programme",
    "status": "Open",
    "coverage": "Academic fees, accommodation, and educational materials",
    "selectionProcess": "Academic merit vetting, application evaluation, and phone screening.",
    "benefits": "\u20b920,000/year for 2 years (Class 11-12) or \u20b930,000/year for 3 years (UG General) or \u20b950,000/year for professional courses.",
    "faqs": [
      {
        "question": "Is there a specific dental or medical scholarship variant?",
        "answer": "Yes, this program has separate high-value tracks for BDS and MBBS students."
      }
    ]
  },
  {
    "id": "ngo-sahu-jain",
    "name": "Sahu Jain Trust Loan Scholarship",
    "provider": "Sahu Jain Trust",
    "amount": 25000,
    "amountFormatted": "\u20b925,000/year",
    "deadline": "2026-08-30",
    "eligibility": {
      "educationLevel": [
        "UG",
        "PG"
      ],
      "gender": "All",
      "familyIncomeMax": 300000,
      "states": [
        "All"
      ],
      "castes": [
        "General",
        "OBC",
        "SC",
        "ST",
        "EWS"
      ],
      "fieldsOfStudy": [
        "Science",
        "Commerce",
        "Arts",
        "Engineering",
        "Medical",
        "Management"
      ]
    },
    "category": "NGO",
    "description": "Interest-free loan scholarships for students pursuing professional courses in technical, scientific, or management fields in India.",
    "documents": [
      "High academic marks certificate",
      "Income proof of parent",
      "Recommendation letter from college dean/principal",
      "Aadhaar Card"
    ],
    "officialLink": "http://www.sahujaintrust.timesofindia.com",
    "status": "Closed",
    "coverage": "Interest-free Loan (Repayable after course completion)",
    "selectionProcess": "Strict evaluation of family economic conditions and academic track record.",
    "benefits": "Provides an interest-free loan of up to \u20b925,000/year which is repayable in easy installments after the student graduates and finds employment.",
    "faqs": [
      {
        "question": "When do I need to repay the loan?",
        "answer": "The repayment starts one year after course completion or immediately upon securing a job, whichever is earlier."
      }
    ]
  },
  {
    "id": "pvt-lic",
    "name": "LIC Golden Jubilee Scholarship",
    "provider": "Life Insurance Corporation of India (LIC)",
    "amount": 20000,
    "amountFormatted": "\u20b920,000/year",
    "deadline": "2026-11-20",
    "eligibility": {
      "educationLevel": [
        "Diploma",
        "UG"
      ],
      "gender": "All",
      "familyIncomeMax": 250000,
      "states": [
        "All"
      ],
      "castes": [
        "General",
        "OBC",
        "SC",
        "ST",
        "EWS"
      ],
      "fieldsOfStudy": [
        "Science",
        "Commerce",
        "Arts",
        "Engineering",
        "Medical",
        "Others"
      ]
    },
    "category": "Private",
    "description": "LIC Golden Jubilee Foundation awards scholarships to meritorious students from economically weaker sections to pursue vocational/higher studies in government or private colleges.",
    "documents": [
      "Class 12 Marksheet (min 60% marks or equivalent)",
      "Income Certificate (below \u20b92.5 Lakhs)",
      "Admission Receipt & College ID",
      "Caste Certificate (if applicable)"
    ],
    "officialLink": "https://www.licindia.in",
    "status": "Open",
    "coverage": "Direct disbursement to bank account in 10 monthly installments",
    "selectionProcess": "Shortlisting based on merit list and income rankings across divisions.",
    "benefits": "\u20b920,000 per annum for regular degree courses (paid as \u20b92,000/month), and \u20b910,000/year for special vocational courses.",
    "faqs": [
      {
        "question": "Can a student pursuing distance education apply?",
        "answer": "No, this scholarship is only applicable to students enrolled in full-time regular courses."
      }
    ]
  },
  {
    "id": "pvt-aditya",
    "name": "Aditya Birla Capital Scholarship",
    "provider": "Aditya Birla Capital Foundation",
    "amount": 60000,
    "amountFormatted": "\u20b960,000/year",
    "deadline": "2026-10-10",
    "eligibility": {
      "educationLevel": [
        "Class 6\u201310",
        "Class 11\u201312",
        "UG"
      ],
      "gender": "All",
      "familyIncomeMax": 600000,
      "states": [
        "All"
      ],
      "castes": [
        "General",
        "OBC",
        "SC",
        "ST",
        "EWS"
      ],
      "fieldsOfStudy": [
        "All",
        "Science",
        "Commerce",
        "Arts",
        "Engineering",
        "Medical",
        "Law",
        "Management"
      ]
    },
    "category": "Private",
    "description": "A CSR initiative by Aditya Birla Capital Group to support school and college students who are in danger of dropping out due to economic crisis.",
    "documents": [
      "Marksheet of previous class (min 60% marks)",
      "Aadhaar Card",
      "Current year admission proof",
      "Family income certificate",
      "Self-declaration of crisis situation"
    ],
    "officialLink": "https://www.adityabirlacapital.com",
    "status": "Open",
    "coverage": "School/College tuition fee cover",
    "selectionProcess": "Academic shortlisting, review of family distress, followed by a final interview call.",
    "benefits": "School students (Class 6-12) receive up to \u20b924,000, and college students receive up to \u20b960,000 to cover college fees.",
    "faqs": [
      {
        "question": "Is there preference given to single-parent households?",
        "answer": "Yes, special preference is given to students who have lost one or both parents, or whose families have serious medical issues."
      }
    ]
  },
  {
    "id": "pvt-ongc",
    "name": "ONGC Merit Scholarship for SC/ST Students",
    "provider": "ONGC Foundation",
    "amount": 48000,
    "amountFormatted": "\u20b948,000/year",
    "deadline": "2026-10-30",
    "eligibility": {
      "educationLevel": [
        "UG",
        "PG"
      ],
      "gender": "All",
      "familyIncomeMax": 450000,
      "states": [
        "All"
      ],
      "castes": [
        "SC",
        "ST"
      ],
      "fieldsOfStudy": [
        "Engineering",
        "Medical",
        "Management"
      ]
    },
    "category": "Private",
    "description": "A CSR program by Oil and Natural Gas Corporation (ONGC) to support underprivileged SC/ST students pursuing professional courses like Engineering, MBBS, MBA, or Master's in Geophysics/Geology.",
    "documents": [
      "Caste Certificate",
      "Marksheet of qualifying exam (min 60% marks)",
      "Family Income Certificate",
      "Admission Letter & Fee Receipt"
    ],
    "officialLink": "https://ongcfoundation.org",
    "status": "Open",
    "coverage": "\u20b94,000 per month maintenance allowance",
    "selectionProcess": "Purely merit-based within the SC/ST zone across different zones of ONGC.",
    "benefits": "Provides a monthly stipend of \u20b94,000 (totaling \u20b948,000 per year) to cover professional education expenses.",
    "faqs": [
      {
        "question": "Are OBC students eligible for this specific scholarship?",
        "answer": "ONGC has a separate OBC merit scholarship scheme with identical benefits. SC/ST has this separate portal."
      }
    ]
  },
  {
    "id": "pvt-kotak",
    "name": "Kotak Kanya Scholarship",
    "provider": "Kotak Education Foundation",
    "amount": 150000,
    "amountFormatted": "\u20b91,50,000/year",
    "deadline": "2026-09-15",
    "eligibility": {
      "educationLevel": [
        "UG"
      ],
      "gender": "Female",
      "familyIncomeMax": 600000,
      "states": [
        "All"
      ],
      "castes": [
        "General",
        "OBC",
        "SC",
        "ST",
        "EWS"
      ],
      "fieldsOfStudy": [
        "Engineering",
        "Medical",
        "Law",
        "Management"
      ]
    },
    "category": "Private",
    "description": "Under the Kotak Kanya Scholarship program, meritorious girl students from underprivileged sections are provided financial assistance to pursue professional graduation courses.",
    "documents": [
      "Class 12 Marksheet (min 85% marks)",
      "Admission proof (JEE/NEET/CLAT allotment letter)",
      "Family Income Certificate",
      "Two reference letters"
    ],
    "officialLink": "https://kotakeducation.org",
    "status": "Ending Soon",
    "coverage": "Tuition, hostel, books, and living expenses",
    "selectionProcess": "Strict academic evaluation, income assessment, aptitude test, and personal interview rounds.",
    "benefits": "Financial assistance of \u20b91,50,000 per year for the entire duration of the professional UG course (B.Tech, MBBS, LL.B., etc.).",
    "faqs": [
      {
        "question": "Is this open to students studying general B.Sc. or B.A.?",
        "answer": "No, this is strictly for girl students admitted to professional degree courses from recognized institutes."
      }
    ]
  },
  {
    "id": "pvt-reliance",
    "name": "Reliance Foundation Undergraduate Scholarships",
    "provider": "Reliance Foundation",
    "amount": 200000,
    "amountFormatted": "\u20b92,00,000/course",
    "deadline": "2026-10-15",
    "eligibility": {
      "educationLevel": [
        "UG"
      ],
      "gender": "All",
      "familyIncomeMax": 1500000,
      "states": [
        "All"
      ],
      "castes": [
        "General",
        "OBC",
        "SC",
        "ST",
        "EWS"
      ],
      "fieldsOfStudy": [
        "All",
        "Science",
        "Commerce",
        "Arts",
        "Engineering",
        "Medical",
        "Law",
        "Management"
      ]
    },
    "category": "Private",
    "description": "Aims to support meritorious students from all fields of study in India to execute their higher education dreams and become future leaders.",
    "documents": [
      "Class 12 board marksheet",
      "Family Income Proof",
      "Aadhaar Card",
      "Academic reference contacts"
    ],
    "officialLink": "https://www.scholarships.reliancefoundation.org",
    "status": "Open",
    "coverage": "Lump sum grant over course duration",
    "selectionProcess": "Aptitude test (mandatory, online), followed by academic evaluation and background verification.",
    "benefits": "Up to \u20b92,00,000 for the duration of the degree, along with access to a vibrant alumni network and workshops.",
    "faqs": [
      {
        "question": "What does the online aptitude test cover?",
        "answer": "It consists of verbal ability, analytical reasoning, and numerical ability questions (60 minutes)."
      }
    ]
  },
  {
    "id": "ngo-sbi-mdf",
    "name": "SBI Youth for India & MDF Scholarship",
    "provider": "SBI Foundation & MDF Partners",
    "amount": 36000,
    "amountFormatted": "\u20b936,000/year",
    "deadline": "2026-08-15",
    "eligibility": {
      "educationLevel": [
        "Class 6\u201310",
        "Class 11\u201312",
        "UG"
      ],
      "gender": "All",
      "familyIncomeMax": 300000,
      "states": [
        "All"
      ],
      "castes": [
        "General",
        "OBC",
        "SC",
        "ST",
        "EWS"
      ],
      "fieldsOfStudy": [
        "All"
      ]
    },
    "category": "NGO",
    "description": "Designed for children of rural artisans, agricultural laborers, and marginal farmers to offset school fee structures and basic stationeries.",
    "documents": [
      "Parent's occupation certificate / Farmer card",
      "Previous class marksheet (min 50%)",
      "Aadhaar Card",
      "School recommendation letter"
    ],
    "officialLink": "https://www.sbifoundation.in",
    "status": "Closed",
    "coverage": "Stationery, uniform, and school fees coverage",
    "selectionProcess": "Local NGO partners verify rural families and forward recommendation logs.",
    "benefits": "\u20b93,000/month stipend to ensure students stay in school and do not engage in child labor.",
    "faqs": [
      {
        "question": "Is this open to students in urban areas?",
        "answer": "No, this is highly targeted to rural villages, rural schools, and agricultural communities."
      }
    ]
  },
  {
    "id": "int-commonwealth",
    "name": "Commonwealth Scholarship & Fellowship Plan (CSFP)",
    "provider": "Commonwealth Scholarship Commission, UK",
    "amount": 1500000,
    "amountFormatted": "\u20b915,00,000+/year",
    "deadline": "2026-09-08",
    "eligibility": {
      "educationLevel": [
        "PG"
      ],
      "gender": "All",
      "familyIncomeMax": 0,
      "states": [
        "All"
      ],
      "castes": [
        "General",
        "OBC",
        "SC",
        "ST",
        "EWS"
      ],
      "fieldsOfStudy": [
        "Science",
        "Engineering",
        "Medical",
        "Law",
        "Management",
        "Others"
      ]
    },
    "category": "International",
    "description": "Enables talented and motivated individuals to gain the knowledge and skills required for sustainable development, by studying for a postgraduate degree in the UK.",
    "documents": [
      "Undergraduate Degree certificate (First class honors)",
      "Two academic references",
      "Admission Offer from UK university",
      "English Proficiency (IELTS) result",
      "Detailed research proposal / Study plan"
    ],
    "officialLink": "https://cscuk.fcdo.gov.uk",
    "status": "Open",
    "coverage": "Full Tuition Fees, Airfare, Monthly Stipend, and Warm Clothing Allowance",
    "selectionProcess": "National nomination by the Ministry of Education (India), followed by evaluation by the UK CSC panel.",
    "benefits": "Provides complete funding for 1-year Master's or 3-year PhD programs in the UK, including return airfare and living allowances (~\u00a31,300/month).",
    "faqs": [
      {
        "question": "Is any age limit?",
        "answer": "There is no official age limit, but candidates must hold a bachelor's degree by the time the scholarship starts."
      }
    ]
  },
  {
    "id": "gov-pm-yasasvi",
    "name": "PM Young Achievers Scholarship Award Scheme (PM-YASASVI)",
    "provider": "Ministry of Social Justice and Empowerment, Government of India",
    "amount": 125000,
    "amountFormatted": "\u20b91,25,000/year",
    "deadline": "2026-10-15",
    "eligibility": {
      "educationLevel": [
        "Class 11\u201312",
        "UG"
      ],
      "gender": "All",
      "familyIncomeMax": 250000,
      "states": [
        "All"
      ],
      "castes": [
        "OBC",
        "EWS"
      ],
      "fieldsOfStudy": [
        "All",
        "Science",
        "Commerce",
        "Arts",
        "Engineering",
        "Medical"
      ]
    },
    "category": "Government",
    "description": "A high-prestige scholarship scheme for OBC, EBC, and DNT students studying in Top Class Schools and Colleges identified by the Ministry.",
    "documents": [
      "OBC/EBC Certificate",
      "Income Certificate (below \u20b92.5 Lakhs)",
      "Class 10 Marksheet",
      "Aadhaar Card linked to Bank Account"
    ],
    "officialLink": "https://yet.nta.ac.in",
    "status": "Open",
    "coverage": "School fees, Hostel fees, and learning materials",
    "selectionProcess": "Through YASASVI Entrance Test (YET) conducted by the National Testing Agency (NTA).",
    "benefits": "Up to \u20b975,000 per year for school education (Class 9 to 12) and up to \u20b91,25,000 per year for higher education/UG in designated top colleges.",
    "faqs": [
      {
        "question": "Is there an exam?",
        "answer": "Yes, NTA conducts a computer-based test with MCQ questions on Mathematics, Science, Social Science, and General Awareness."
      }
    ]
  },
  {
    "id": "pvt-tata-medical",
    "name": "Tata Trust Medical and Healthcare Scholarship",
    "provider": "Tata Trusts",
    "amount": 100000,
    "amountFormatted": "\u20b91,00,000/year",
    "deadline": "2026-11-10",
    "eligibility": {
      "educationLevel": [
        "UG",
        "PG"
      ],
      "gender": "All",
      "familyIncomeMax": 500000,
      "states": [
        "All"
      ],
      "castes": [
        "General",
        "OBC",
        "SC",
        "ST",
        "EWS"
      ],
      "fieldsOfStudy": [
        "Medical"
      ]
    },
    "category": "Private",
    "description": "Supports students pursuing undergraduate or postgraduate studies in medical sciences and healthcare streams in India.",
    "documents": [
      "Marksheet of previous year (min 60% in MBBS/BDS/BAMS)",
      "Family Income Proof",
      "Fee receipt of the current semester",
      "Letter of recommendation"
    ],
    "officialLink": "https://www.tatatrusts.org",
    "status": "Open",
    "coverage": "Covers 30% to 80% of actual tuition fee structures",
    "selectionProcess": "Application review, academic screening, and potential interview.",
    "benefits": "Direct financial assistance based on course fees, up to \u20b91,00,000 per annum for tuition support.",
    "faqs": [
      {
        "question": "Can nursing students apply?",
        "answer": "Yes, BSc Nursing and MSc Nursing students are eligible for a separate category under the healthcare scheme."
      }
    ]
  },
  {
    "id": "gov-mhrd-gate",
    "name": "MHRD PG Scholarship for GATE Qualified Candidates",
    "provider": "AICTE / Ministry of Education, Government of India",
    "amount": 148800,
    "amountFormatted": "\u20b91,24,000/year",
    "deadline": "2026-11-30",
    "eligibility": {
      "educationLevel": [
        "PG"
      ],
      "gender": "All",
      "familyIncomeMax": 0,
      "states": [
        "All"
      ],
      "castes": [
        "General",
        "OBC",
        "SC",
        "ST",
        "EWS"
      ],
      "fieldsOfStudy": [
        "Engineering"
      ]
    },
    "category": "Government",
    "description": "Financial assistance provided to GATE-qualified students admitted in M.Tech/M.E./M.Arch programs in AICTE approved institutions.",
    "documents": [
      "GATE Score Card",
      "Aadhaar Card & Bank Account",
      "Admission Receipt (M.Tech)",
      "Category certificate (if applicable)"
    ],
    "officialLink": "https://www.aicte-india.org",
    "status": "Open",
    "coverage": "Monthly stipend of \u20b912,400",
    "selectionProcess": "Direct approval upon verifying valid GATE score card and college enrollment status in approved PG program.",
    "benefits": "Stipend of \u20b912,400 per month for a maximum of 24 months or till the completion of the course, whichever is earlier.",
    "faqs": [
      {
        "question": "Do I get scholarship during summer vacation?",
        "answer": "Yes, the scholarship is paid monthly for the full 2 years, including vacation periods, subject to satisfactory progress."
      }
    ]
  },
  {
    "id": "ind-mock-1",
    "name": "India Scholarship Scheme 1",
    "provider": "Education Foundation 11",
    "amount": 21606,
    "amountFormatted": "\u20b921,606",
    "deadline": "2026-10-26",
    "eligibility": {
      "educationLevel": [
        "Class 11\u201312"
      ],
      "gender": "Male",
      "familyIncomeMax": 500000,
      "states": [
        "Madhya Pradesh"
      ],
      "castes": [
        "SC"
      ],
      "fieldsOfStudy": [
        "Law"
      ]
    },
    "category": "Government",
    "description": "Mock Indian scholarship program focused on sc/st support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-1.in",
    "status": "Open",
    "coverage": "Tuition + Hostel",
    "selectionProcess": "Interview + Merit",
    "benefits": "Hostel Assistance",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 1?",
        "answer": "It is open to Male students studying Class 12 courses. Family income should be less than \u20b9500000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Hostel Assistance covering Tuition + Hostel."
      }
    ]
  },
  {
    "id": "ind-mock-2",
    "name": "India Scholarship Scheme 2",
    "provider": "Education Foundation 11",
    "amount": 138172,
    "amountFormatted": "\u20b9138,172",
    "deadline": "2026-07-08",
    "eligibility": {
      "educationLevel": [
        "Diploma"
      ],
      "gender": "Female",
      "familyIncomeMax": 1000000,
      "states": [
        "Uttar Pradesh"
      ],
      "castes": [
        "SC"
      ],
      "fieldsOfStudy": [
        "Management"
      ]
    },
    "category": "Government",
    "description": "Mock Indian scholarship program focused on need-based support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-2.in",
    "status": "Open",
    "coverage": "Tuition + Hostel",
    "selectionProcess": "Need + Merit",
    "benefits": "Annual Stipend",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 2?",
        "answer": "It is open to Female students studying Diploma courses. Family income should be less than \u20b91000000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Annual Stipend covering Tuition + Hostel."
      }
    ]
  },
  {
    "id": "ind-mock-3",
    "name": "India Scholarship Scheme 3",
    "provider": "Education Foundation 2",
    "amount": 14758,
    "amountFormatted": "\u20b914,758",
    "deadline": "2026-10-15",
    "eligibility": {
      "educationLevel": [
        "Diploma"
      ],
      "gender": "Female",
      "familyIncomeMax": 500000,
      "states": [
        "Rajasthan"
      ],
      "castes": [
        "EWS"
      ],
      "fieldsOfStudy": [
        "Engineering"
      ]
    },
    "category": "Government",
    "description": "Mock Indian scholarship program focused on research support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-3.in",
    "status": "Open",
    "coverage": "Full Academic Support",
    "selectionProcess": "Entrance Test",
    "benefits": "Laptop Support",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 3?",
        "answer": "It is open to Female students studying Diploma courses. Family income should be less than \u20b9500000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Laptop Support covering Full Academic Support."
      }
    ]
  },
  {
    "id": "ind-mock-4",
    "name": "India Scholarship Scheme 4",
    "provider": "Education Foundation 23",
    "amount": 42608,
    "amountFormatted": "\u20b942,608",
    "deadline": "2026-07-16",
    "eligibility": {
      "educationLevel": [
        "Class 6\u201310"
      ],
      "gender": "Male",
      "familyIncomeMax": 800000,
      "states": [
        "Bihar"
      ],
      "castes": [
        "General",
        "OBC",
        "SC",
        "ST",
        "EWS"
      ],
      "fieldsOfStudy": [
        "Law"
      ]
    },
    "category": "Government",
    "description": "Mock Indian scholarship program focused on need-based support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-4.in",
    "status": "Open",
    "coverage": "Tuition Fee",
    "selectionProcess": "Need + Merit",
    "benefits": "Annual Stipend",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 4?",
        "answer": "It is open to Male students studying Class 10 courses. Family income should be less than \u20b9800000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Annual Stipend covering Tuition Fee."
      }
    ]
  },
  {
    "id": "ind-mock-5",
    "name": "India Scholarship Scheme 5",
    "provider": "Education Foundation 17",
    "amount": 170234,
    "amountFormatted": "\u20b9170,234",
    "deadline": "2026-10-13",
    "eligibility": {
      "educationLevel": [
        "Diploma"
      ],
      "gender": "Female",
      "familyIncomeMax": 800000,
      "states": [
        "Odisha"
      ],
      "castes": [
        "General"
      ],
      "fieldsOfStudy": [
        "Science"
      ]
    },
    "category": "Government",
    "description": "Mock Indian scholarship program focused on sc/st support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-5.in",
    "status": "Open",
    "coverage": "Books and Tuition",
    "selectionProcess": "Entrance Test",
    "benefits": "Research Grant",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 5?",
        "answer": "It is open to Female students studying Diploma courses. Family income should be less than \u20b9800000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Research Grant covering Books and Tuition."
      }
    ]
  },
  {
    "id": "ind-mock-6",
    "name": "India Scholarship Scheme 6",
    "provider": "Education Foundation 3",
    "amount": 15572,
    "amountFormatted": "\u20b915,572",
    "deadline": "2026-10-05",
    "eligibility": {
      "educationLevel": [
        "PG"
      ],
      "gender": "All",
      "familyIncomeMax": 200000,
      "states": [
        "Chhattisgarh"
      ],
      "castes": [
        "General",
        "OBC",
        "SC",
        "ST",
        "EWS"
      ],
      "fieldsOfStudy": [
        "Law"
      ]
    },
    "category": "Private",
    "description": "Mock Indian scholarship program focused on merit support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-6.in",
    "status": "Open",
    "coverage": "Full Academic Support",
    "selectionProcess": "Entrance Test",
    "benefits": "Research Grant",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 6?",
        "answer": "It is open to Any students studying PG courses. Family income should be less than \u20b9200000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Research Grant covering Full Academic Support."
      }
    ]
  },
  {
    "id": "ind-mock-7",
    "name": "India Scholarship Scheme 7",
    "provider": "Education Foundation 14",
    "amount": 20871,
    "amountFormatted": "\u20b920,871",
    "deadline": "2026-10-27",
    "eligibility": {
      "educationLevel": [
        "Class 6\u201310"
      ],
      "gender": "Female",
      "familyIncomeMax": 500000,
      "states": [
        "Maharashtra"
      ],
      "castes": [
        "General"
      ],
      "fieldsOfStudy": [
        "Agriculture"
      ]
    },
    "category": "Government",
    "description": "Mock Indian scholarship program focused on need-based support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-7.in",
    "status": "Open",
    "coverage": "Tuition + Hostel",
    "selectionProcess": "Merit Based",
    "benefits": "Annual Stipend",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 7?",
        "answer": "It is open to Female students studying Class 10 courses. Family income should be less than \u20b9500000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Annual Stipend covering Tuition + Hostel."
      }
    ]
  },
  {
    "id": "ind-mock-8",
    "name": "India Scholarship Scheme 8",
    "provider": "Education Foundation 19",
    "amount": 115132,
    "amountFormatted": "\u20b9115,132",
    "deadline": "2026-12-04",
    "eligibility": {
      "educationLevel": [
        "UG"
      ],
      "gender": "Female",
      "familyIncomeMax": 1000000,
      "states": [
        "Uttar Pradesh"
      ],
      "castes": [
        "General"
      ],
      "fieldsOfStudy": [
        "Agriculture"
      ]
    },
    "category": "NGO",
    "description": "Mock Indian scholarship program focused on minority support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-8.in",
    "status": "Open",
    "coverage": "Tuition Fee",
    "selectionProcess": "Entrance Test",
    "benefits": "Annual Stipend",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 8?",
        "answer": "It is open to Female students studying UG courses. Family income should be less than \u20b91000000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Annual Stipend covering Tuition Fee."
      }
    ]
  },
  {
    "id": "ind-mock-9",
    "name": "India Scholarship Scheme 9",
    "provider": "Education Foundation 3",
    "amount": 199592,
    "amountFormatted": "\u20b9199,592",
    "deadline": "2026-11-10",
    "eligibility": {
      "educationLevel": [
        "UG"
      ],
      "gender": "All",
      "familyIncomeMax": 1000000,
      "states": [
        "Telangana"
      ],
      "castes": [
        "ST"
      ],
      "fieldsOfStudy": [
        "Agriculture"
      ]
    },
    "category": "Private",
    "description": "Mock Indian scholarship program focused on girls education support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-9.in",
    "status": "Open",
    "coverage": "Full Academic Support",
    "selectionProcess": "Need + Merit",
    "benefits": "Laptop Support",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 9?",
        "answer": "It is open to Any students studying UG courses. Family income should be less than \u20b91000000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Laptop Support covering Full Academic Support."
      }
    ]
  },
  {
    "id": "ind-mock-10",
    "name": "India Scholarship Scheme 10",
    "provider": "Education Foundation 4",
    "amount": 24338,
    "amountFormatted": "\u20b924,338",
    "deadline": "2026-09-14",
    "eligibility": {
      "educationLevel": [
        "UG"
      ],
      "gender": "Female",
      "familyIncomeMax": 500000,
      "states": [
        "Assam"
      ],
      "castes": [
        "EWS"
      ],
      "fieldsOfStudy": [
        "Law"
      ]
    },
    "category": "NGO",
    "description": "Mock Indian scholarship program focused on research support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-10.in",
    "status": "Open",
    "coverage": "Books and Tuition",
    "selectionProcess": "Entrance Test",
    "benefits": "Hostel Assistance",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 10?",
        "answer": "It is open to Female students studying UG courses. Family income should be less than \u20b9500000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Hostel Assistance covering Books and Tuition."
      }
    ]
  },
  {
    "id": "ind-mock-11",
    "name": "India Scholarship Scheme 11",
    "provider": "Education Foundation 23",
    "amount": 31621,
    "amountFormatted": "\u20b931,621",
    "deadline": "2026-12-04",
    "eligibility": {
      "educationLevel": [
        "Class 6\u201310"
      ],
      "gender": "All",
      "familyIncomeMax": 300000,
      "states": [
        "Jharkhand"
      ],
      "castes": [
        "EWS"
      ],
      "fieldsOfStudy": [
        "Engineering"
      ]
    },
    "category": "Government",
    "description": "Mock Indian scholarship program focused on minority support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-11.in",
    "status": "Open",
    "coverage": "Tuition Fee",
    "selectionProcess": "Entrance Test",
    "benefits": "Laptop Support",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 11?",
        "answer": "It is open to Any students studying Class 10 courses. Family income should be less than \u20b9300000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Laptop Support covering Tuition Fee."
      }
    ]
  },
  {
    "id": "ind-mock-12",
    "name": "India Scholarship Scheme 12",
    "provider": "Education Foundation 3",
    "amount": 86066,
    "amountFormatted": "\u20b986,066",
    "deadline": "2026-09-11",
    "eligibility": {
      "educationLevel": [
        "PG"
      ],
      "gender": "Male",
      "familyIncomeMax": 1000000,
      "states": [
        "Tamil Nadu"
      ],
      "castes": [
        "ST"
      ],
      "fieldsOfStudy": [
        "Agriculture"
      ]
    },
    "category": "Private",
    "description": "Mock Indian scholarship program focused on technical education support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-12.in",
    "status": "Open",
    "coverage": "Tuition + Hostel",
    "selectionProcess": "Interview + Merit",
    "benefits": "Laptop Support",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 12?",
        "answer": "It is open to Male students studying PG courses. Family income should be less than \u20b91000000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Laptop Support covering Tuition + Hostel."
      }
    ]
  },
  {
    "id": "ind-mock-13",
    "name": "India Scholarship Scheme 13",
    "provider": "Education Foundation 21",
    "amount": 72396,
    "amountFormatted": "\u20b972,396",
    "deadline": "2026-10-18",
    "eligibility": {
      "educationLevel": [
        "UG"
      ],
      "gender": "Female",
      "familyIncomeMax": 800000,
      "states": [
        "Punjab"
      ],
      "castes": [
        "General",
        "OBC",
        "SC",
        "ST",
        "EWS"
      ],
      "fieldsOfStudy": [
        "Management"
      ]
    },
    "category": "Private",
    "description": "Mock Indian scholarship program focused on merit support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-13.in",
    "status": "Open",
    "coverage": "Full Academic Support",
    "selectionProcess": "Merit Based",
    "benefits": "Annual Stipend",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 13?",
        "answer": "It is open to Female students studying UG courses. Family income should be less than \u20b9800000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Annual Stipend covering Full Academic Support."
      }
    ]
  },
  {
    "id": "ind-mock-14",
    "name": "India Scholarship Scheme 14",
    "provider": "Education Foundation 23",
    "amount": 69086,
    "amountFormatted": "\u20b969,086",
    "deadline": "2026-12-14",
    "eligibility": {
      "educationLevel": [
        "UG"
      ],
      "gender": "Male",
      "familyIncomeMax": 800000,
      "states": [
        "Madhya Pradesh"
      ],
      "castes": [
        "General",
        "OBC",
        "SC",
        "ST",
        "EWS"
      ],
      "fieldsOfStudy": [
        "Management"
      ]
    },
    "category": "Government",
    "description": "Mock Indian scholarship program focused on minority support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-14.in",
    "status": "Open",
    "coverage": "Tuition + Hostel",
    "selectionProcess": "Need + Merit",
    "benefits": "Laptop Support",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 14?",
        "answer": "It is open to Male students studying UG courses. Family income should be less than \u20b9800000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Laptop Support covering Tuition + Hostel."
      }
    ]
  },
  {
    "id": "ind-mock-15",
    "name": "India Scholarship Scheme 15",
    "provider": "Education Foundation 5",
    "amount": 21579,
    "amountFormatted": "\u20b921,579",
    "deadline": "2026-11-03",
    "eligibility": {
      "educationLevel": [
        "Diploma"
      ],
      "gender": "All",
      "familyIncomeMax": 300000,
      "states": [
        "Haryana"
      ],
      "castes": [
        "General",
        "OBC",
        "SC",
        "ST",
        "EWS"
      ],
      "fieldsOfStudy": [
        "Medical"
      ]
    },
    "category": "Government",
    "description": "Mock Indian scholarship program focused on merit support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-15.in",
    "status": "Open",
    "coverage": "Tuition + Hostel",
    "selectionProcess": "Interview + Merit",
    "benefits": "Laptop Support",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 15?",
        "answer": "It is open to Any students studying Diploma courses. Family income should be less than \u20b9300000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Laptop Support covering Tuition + Hostel."
      }
    ]
  },
  {
    "id": "ind-mock-16",
    "name": "India Scholarship Scheme 16",
    "provider": "Education Foundation 14",
    "amount": 162118,
    "amountFormatted": "\u20b9162,118",
    "deadline": "2026-10-11",
    "eligibility": {
      "educationLevel": [
        "Class 6\u201310"
      ],
      "gender": "Female",
      "familyIncomeMax": 500000,
      "states": [
        "Maharashtra"
      ],
      "castes": [
        "EWS"
      ],
      "fieldsOfStudy": [
        "Commerce"
      ]
    },
    "category": "Government",
    "description": "Mock Indian scholarship program focused on sports support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-16.in",
    "status": "Open",
    "coverage": "Tuition Fee",
    "selectionProcess": "Interview + Merit",
    "benefits": "Laptop Support",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 16?",
        "answer": "It is open to Female students studying Class 10 courses. Family income should be less than \u20b9500000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Laptop Support covering Tuition Fee."
      }
    ]
  },
  {
    "id": "ind-mock-17",
    "name": "India Scholarship Scheme 17",
    "provider": "Education Foundation 4",
    "amount": 48315,
    "amountFormatted": "\u20b948,315",
    "deadline": "2026-12-27",
    "eligibility": {
      "educationLevel": [
        "Diploma"
      ],
      "gender": "Male",
      "familyIncomeMax": 200000,
      "states": [
        "Bihar"
      ],
      "castes": [
        "General",
        "OBC",
        "SC",
        "ST",
        "EWS"
      ],
      "fieldsOfStudy": [
        "Agriculture"
      ]
    },
    "category": "NGO",
    "description": "Mock Indian scholarship program focused on merit support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-17.in",
    "status": "Open",
    "coverage": "Books and Tuition",
    "selectionProcess": "Need + Merit",
    "benefits": "Hostel Assistance",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 17?",
        "answer": "It is open to Male students studying Diploma courses. Family income should be less than \u20b9200000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Hostel Assistance covering Books and Tuition."
      }
    ]
  },
  {
    "id": "ind-mock-18",
    "name": "India Scholarship Scheme 18",
    "provider": "Education Foundation 1",
    "amount": 92843,
    "amountFormatted": "\u20b992,843",
    "deadline": "2026-07-21",
    "eligibility": {
      "educationLevel": [
        "Diploma"
      ],
      "gender": "Female",
      "familyIncomeMax": 300000,
      "states": [
        "Maharashtra"
      ],
      "castes": [
        "General",
        "OBC",
        "SC",
        "ST",
        "EWS"
      ],
      "fieldsOfStudy": [
        "Agriculture"
      ]
    },
    "category": "NGO",
    "description": "Mock Indian scholarship program focused on sports support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-18.in",
    "status": "Open",
    "coverage": "Books and Tuition",
    "selectionProcess": "Need + Merit",
    "benefits": "Laptop Support",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 18?",
        "answer": "It is open to Female students studying Diploma courses. Family income should be less than \u20b9300000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Laptop Support covering Books and Tuition."
      }
    ]
  },
  {
    "id": "ind-mock-19",
    "name": "India Scholarship Scheme 19",
    "provider": "Education Foundation 17",
    "amount": 146139,
    "amountFormatted": "\u20b9146,139",
    "deadline": "2026-10-14",
    "eligibility": {
      "educationLevel": [
        "UG"
      ],
      "gender": "All",
      "familyIncomeMax": 500000,
      "states": [
        "Bihar"
      ],
      "castes": [
        "SC"
      ],
      "fieldsOfStudy": [
        "Arts"
      ]
    },
    "category": "Government",
    "description": "Mock Indian scholarship program focused on research support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-19.in",
    "status": "Open",
    "coverage": "Tuition Fee",
    "selectionProcess": "Entrance Test",
    "benefits": "Laptop Support",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 19?",
        "answer": "It is open to Any students studying UG courses. Family income should be less than \u20b9500000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Laptop Support covering Tuition Fee."
      }
    ]
  },
  {
    "id": "ind-mock-20",
    "name": "India Scholarship Scheme 20",
    "provider": "Education Foundation 21",
    "amount": 110969,
    "amountFormatted": "\u20b9110,969",
    "deadline": "2026-11-24",
    "eligibility": {
      "educationLevel": [
        "Class 6\u201310"
      ],
      "gender": "Female",
      "familyIncomeMax": 500000,
      "states": [
        "Madhya Pradesh"
      ],
      "castes": [
        "EWS"
      ],
      "fieldsOfStudy": [
        "Law"
      ]
    },
    "category": "Private",
    "description": "Mock Indian scholarship program focused on technical education support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-20.in",
    "status": "Open",
    "coverage": "Tuition Fee",
    "selectionProcess": "Interview + Merit",
    "benefits": "Research Grant",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 20?",
        "answer": "It is open to Female students studying Class 10 courses. Family income should be less than \u20b9500000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Research Grant covering Tuition Fee."
      }
    ]
  },
  {
    "id": "ind-mock-21",
    "name": "India Scholarship Scheme 21",
    "provider": "Education Foundation 2",
    "amount": 165099,
    "amountFormatted": "\u20b9165,099",
    "deadline": "2026-09-03",
    "eligibility": {
      "educationLevel": [
        "Class 6\u201310"
      ],
      "gender": "All",
      "familyIncomeMax": 500000,
      "states": [
        "Kerala"
      ],
      "castes": [
        "General"
      ],
      "fieldsOfStudy": [
        "Science"
      ]
    },
    "category": "Government",
    "description": "Mock Indian scholarship program focused on need-based support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-21.in",
    "status": "Open",
    "coverage": "Tuition Fee",
    "selectionProcess": "Merit Based",
    "benefits": "Research Grant",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 21?",
        "answer": "It is open to Any students studying Class 10 courses. Family income should be less than \u20b9500000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Research Grant covering Tuition Fee."
      }
    ]
  },
  {
    "id": "ind-mock-22",
    "name": "India Scholarship Scheme 22",
    "provider": "Education Foundation 23",
    "amount": 11640,
    "amountFormatted": "\u20b911,640",
    "deadline": "2026-09-09",
    "eligibility": {
      "educationLevel": [
        "PG"
      ],
      "gender": "All",
      "familyIncomeMax": 200000,
      "states": [
        "Gujarat"
      ],
      "castes": [
        "ST"
      ],
      "fieldsOfStudy": [
        "All"
      ]
    },
    "category": "Government",
    "description": "Mock Indian scholarship program focused on girls education support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-22.in",
    "status": "Open",
    "coverage": "Books and Tuition",
    "selectionProcess": "Merit Based",
    "benefits": "Hostel Assistance",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 22?",
        "answer": "It is open to Any students studying PhD courses. Family income should be less than \u20b9200000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Hostel Assistance covering Books and Tuition."
      }
    ]
  },
  {
    "id": "ind-mock-23",
    "name": "India Scholarship Scheme 23",
    "provider": "Education Foundation 22",
    "amount": 65944,
    "amountFormatted": "\u20b965,944",
    "deadline": "2026-07-16",
    "eligibility": {
      "educationLevel": [
        "PG"
      ],
      "gender": "All",
      "familyIncomeMax": 200000,
      "states": [
        "Gujarat"
      ],
      "castes": [
        "ST"
      ],
      "fieldsOfStudy": [
        "Management"
      ]
    },
    "category": "NGO",
    "description": "Mock Indian scholarship program focused on sc/st support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-23.in",
    "status": "Open",
    "coverage": "Full Academic Support",
    "selectionProcess": "Merit Based",
    "benefits": "Hostel Assistance",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 23?",
        "answer": "It is open to Any students studying PhD courses. Family income should be less than \u20b9200000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Hostel Assistance covering Full Academic Support."
      }
    ]
  },
  {
    "id": "ind-mock-24",
    "name": "India Scholarship Scheme 24",
    "provider": "Education Foundation 11",
    "amount": 133973,
    "amountFormatted": "\u20b9133,973",
    "deadline": "2026-09-26",
    "eligibility": {
      "educationLevel": [
        "PG"
      ],
      "gender": "Male",
      "familyIncomeMax": 800000,
      "states": [
        "Uttar Pradesh"
      ],
      "castes": [
        "SC"
      ],
      "fieldsOfStudy": [
        "All"
      ]
    },
    "category": "Government",
    "description": "Mock Indian scholarship program focused on need-based support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-24.in",
    "status": "Open",
    "coverage": "Full Academic Support",
    "selectionProcess": "Merit Based",
    "benefits": "Laptop Support",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 24?",
        "answer": "It is open to Male students studying PG courses. Family income should be less than \u20b9800000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Laptop Support covering Full Academic Support."
      }
    ]
  },
  {
    "id": "ind-mock-25",
    "name": "India Scholarship Scheme 25",
    "provider": "Education Foundation 25",
    "amount": 81959,
    "amountFormatted": "\u20b981,959",
    "deadline": "2026-12-08",
    "eligibility": {
      "educationLevel": [
        "UG"
      ],
      "gender": "Female",
      "familyIncomeMax": 300000,
      "states": [
        "Maharashtra"
      ],
      "castes": [
        "OBC"
      ],
      "fieldsOfStudy": [
        "Engineering"
      ]
    },
    "category": "NGO",
    "description": "Mock Indian scholarship program focused on sc/st support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-25.in",
    "status": "Open",
    "coverage": "Tuition Fee",
    "selectionProcess": "Need + Merit",
    "benefits": "Annual Stipend",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 25?",
        "answer": "It is open to Female students studying UG courses. Family income should be less than \u20b9300000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Annual Stipend covering Tuition Fee."
      }
    ]
  },
  {
    "id": "ind-mock-26",
    "name": "India Scholarship Scheme 26",
    "provider": "Education Foundation 1",
    "amount": 112899,
    "amountFormatted": "\u20b9112,899",
    "deadline": "2026-07-20",
    "eligibility": {
      "educationLevel": [
        "Class 11\u201312"
      ],
      "gender": "All",
      "familyIncomeMax": 300000,
      "states": [
        "Jharkhand"
      ],
      "castes": [
        "EWS"
      ],
      "fieldsOfStudy": [
        "Management"
      ]
    },
    "category": "NGO",
    "description": "Mock Indian scholarship program focused on sc/st support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-26.in",
    "status": "Open",
    "coverage": "Books and Tuition",
    "selectionProcess": "Merit Based",
    "benefits": "Annual Stipend",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 26?",
        "answer": "It is open to Any students studying Class 12 courses. Family income should be less than \u20b9300000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Annual Stipend covering Books and Tuition."
      }
    ]
  },
  {
    "id": "ind-mock-27",
    "name": "India Scholarship Scheme 27",
    "provider": "Education Foundation 9",
    "amount": 11191,
    "amountFormatted": "\u20b911,191",
    "deadline": "2026-11-13",
    "eligibility": {
      "educationLevel": [
        "Class 6\u201310"
      ],
      "gender": "All",
      "familyIncomeMax": 1000000,
      "states": [
        "Maharashtra"
      ],
      "castes": [
        "EWS"
      ],
      "fieldsOfStudy": [
        "All"
      ]
    },
    "category": "Private",
    "description": "Mock Indian scholarship program focused on need-based support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-27.in",
    "status": "Open",
    "coverage": "Tuition + Hostel",
    "selectionProcess": "Entrance Test",
    "benefits": "Research Grant",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 27?",
        "answer": "It is open to Any students studying Class 10 courses. Family income should be less than \u20b91000000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Research Grant covering Tuition + Hostel."
      }
    ]
  },
  {
    "id": "ind-mock-28",
    "name": "India Scholarship Scheme 28",
    "provider": "Education Foundation 8",
    "amount": 35063,
    "amountFormatted": "\u20b935,063",
    "deadline": "2026-10-05",
    "eligibility": {
      "educationLevel": [
        "UG"
      ],
      "gender": "Male",
      "familyIncomeMax": 500000,
      "states": [
        "Gujarat"
      ],
      "castes": [
        "EWS"
      ],
      "fieldsOfStudy": [
        "Science"
      ]
    },
    "category": "Government",
    "description": "Mock Indian scholarship program focused on research support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-28.in",
    "status": "Open",
    "coverage": "Books and Tuition",
    "selectionProcess": "Interview + Merit",
    "benefits": "Laptop Support",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 28?",
        "answer": "It is open to Male students studying UG courses. Family income should be less than \u20b9500000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Laptop Support covering Books and Tuition."
      }
    ]
  },
  {
    "id": "ind-mock-29",
    "name": "India Scholarship Scheme 29",
    "provider": "Education Foundation 1",
    "amount": 98104,
    "amountFormatted": "\u20b998,104",
    "deadline": "2026-12-20",
    "eligibility": {
      "educationLevel": [
        "Class 6\u201310"
      ],
      "gender": "Female",
      "familyIncomeMax": 200000,
      "states": [
        "Haryana"
      ],
      "castes": [
        "ST"
      ],
      "fieldsOfStudy": [
        "Agriculture"
      ]
    },
    "category": "NGO",
    "description": "Mock Indian scholarship program focused on minority support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-29.in",
    "status": "Open",
    "coverage": "Full Academic Support",
    "selectionProcess": "Interview + Merit",
    "benefits": "Hostel Assistance",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 29?",
        "answer": "It is open to Female students studying Class 10 courses. Family income should be less than \u20b9200000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Hostel Assistance covering Full Academic Support."
      }
    ]
  },
  {
    "id": "ind-mock-30",
    "name": "India Scholarship Scheme 30",
    "provider": "Education Foundation 24",
    "amount": 93119,
    "amountFormatted": "\u20b993,119",
    "deadline": "2026-11-28",
    "eligibility": {
      "educationLevel": [
        "Diploma"
      ],
      "gender": "Female",
      "familyIncomeMax": 300000,
      "states": [
        "West Bengal"
      ],
      "castes": [
        "SC"
      ],
      "fieldsOfStudy": [
        "Management"
      ]
    },
    "category": "Private",
    "description": "Mock Indian scholarship program focused on sports support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-30.in",
    "status": "Open",
    "coverage": "Tuition Fee",
    "selectionProcess": "Interview + Merit",
    "benefits": "Research Grant",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 30?",
        "answer": "It is open to Female students studying Diploma courses. Family income should be less than \u20b9300000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Research Grant covering Tuition Fee."
      }
    ]
  },
  {
    "id": "ind-mock-31",
    "name": "India Scholarship Scheme 31",
    "provider": "Education Foundation 8",
    "amount": 169328,
    "amountFormatted": "\u20b9169,328",
    "deadline": "2026-07-13",
    "eligibility": {
      "educationLevel": [
        "PG"
      ],
      "gender": "Female",
      "familyIncomeMax": 800000,
      "states": [
        "Maharashtra"
      ],
      "castes": [
        "SC"
      ],
      "fieldsOfStudy": [
        "Management"
      ]
    },
    "category": "Government",
    "description": "Mock Indian scholarship program focused on sports support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-31.in",
    "status": "Open",
    "coverage": "Tuition Fee",
    "selectionProcess": "Entrance Test",
    "benefits": "Research Grant",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 31?",
        "answer": "It is open to Female students studying PG courses. Family income should be less than \u20b9800000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Research Grant covering Tuition Fee."
      }
    ]
  },
  {
    "id": "ind-mock-32",
    "name": "India Scholarship Scheme 32",
    "provider": "Education Foundation 24",
    "amount": 84142,
    "amountFormatted": "\u20b984,142",
    "deadline": "2026-09-05",
    "eligibility": {
      "educationLevel": [
        "Class 11\u201312"
      ],
      "gender": "All",
      "familyIncomeMax": 800000,
      "states": [
        "Rajasthan"
      ],
      "castes": [
        "EWS"
      ],
      "fieldsOfStudy": [
        "Medical"
      ]
    },
    "category": "Private",
    "description": "Mock Indian scholarship program focused on minority support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-32.in",
    "status": "Open",
    "coverage": "Tuition Fee",
    "selectionProcess": "Interview + Merit",
    "benefits": "Laptop Support",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 32?",
        "answer": "It is open to Any students studying Class 12 courses. Family income should be less than \u20b9800000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Laptop Support covering Tuition Fee."
      }
    ]
  },
  {
    "id": "ind-mock-33",
    "name": "India Scholarship Scheme 33",
    "provider": "Education Foundation 2",
    "amount": 181686,
    "amountFormatted": "\u20b9181,686",
    "deadline": "2026-12-11",
    "eligibility": {
      "educationLevel": [
        "PG"
      ],
      "gender": "Male",
      "familyIncomeMax": 800000,
      "states": [
        "Punjab"
      ],
      "castes": [
        "EWS"
      ],
      "fieldsOfStudy": [
        "Management"
      ]
    },
    "category": "Government",
    "description": "Mock Indian scholarship program focused on minority support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-33.in",
    "status": "Open",
    "coverage": "Tuition Fee",
    "selectionProcess": "Entrance Test",
    "benefits": "Laptop Support",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 33?",
        "answer": "It is open to Male students studying PG courses. Family income should be less than \u20b9800000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Laptop Support covering Tuition Fee."
      }
    ]
  },
  {
    "id": "ind-mock-34",
    "name": "India Scholarship Scheme 34",
    "provider": "Education Foundation 19",
    "amount": 154895,
    "amountFormatted": "\u20b9154,895",
    "deadline": "2026-07-25",
    "eligibility": {
      "educationLevel": [
        "Diploma"
      ],
      "gender": "Male",
      "familyIncomeMax": 200000,
      "states": [
        "Telangana"
      ],
      "castes": [
        "ST"
      ],
      "fieldsOfStudy": [
        "Management"
      ]
    },
    "category": "NGO",
    "description": "Mock Indian scholarship program focused on merit support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-34.in",
    "status": "Open",
    "coverage": "Full Academic Support",
    "selectionProcess": "Entrance Test",
    "benefits": "Laptop Support",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 34?",
        "answer": "It is open to Male students studying Diploma courses. Family income should be less than \u20b9200000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Laptop Support covering Full Academic Support."
      }
    ]
  },
  {
    "id": "ind-mock-35",
    "name": "India Scholarship Scheme 35",
    "provider": "Education Foundation 7",
    "amount": 79151,
    "amountFormatted": "\u20b979,151",
    "deadline": "2026-09-20",
    "eligibility": {
      "educationLevel": [
        "UG"
      ],
      "gender": "All",
      "familyIncomeMax": 300000,
      "states": [
        "Chhattisgarh"
      ],
      "castes": [
        "General",
        "OBC",
        "SC",
        "ST",
        "EWS"
      ],
      "fieldsOfStudy": [
        "Arts"
      ]
    },
    "category": "NGO",
    "description": "Mock Indian scholarship program focused on sports support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-35.in",
    "status": "Open",
    "coverage": "Books and Tuition",
    "selectionProcess": "Merit Based",
    "benefits": "Research Grant",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 35?",
        "answer": "It is open to Any students studying UG courses. Family income should be less than \u20b9300000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Research Grant covering Books and Tuition."
      }
    ]
  },
  {
    "id": "ind-mock-36",
    "name": "India Scholarship Scheme 36",
    "provider": "Education Foundation 19",
    "amount": 156497,
    "amountFormatted": "\u20b9156,497",
    "deadline": "2026-09-08",
    "eligibility": {
      "educationLevel": [
        "PG"
      ],
      "gender": "All",
      "familyIncomeMax": 800000,
      "states": [
        "Telangana"
      ],
      "castes": [
        "General"
      ],
      "fieldsOfStudy": [
        "Arts"
      ]
    },
    "category": "NGO",
    "description": "Mock Indian scholarship program focused on sc/st support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-36.in",
    "status": "Open",
    "coverage": "Tuition + Hostel",
    "selectionProcess": "Merit Based",
    "benefits": "Annual Stipend",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 36?",
        "answer": "It is open to Any students studying PhD courses. Family income should be less than \u20b9800000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Annual Stipend covering Tuition + Hostel."
      }
    ]
  },
  {
    "id": "ind-mock-37",
    "name": "India Scholarship Scheme 37",
    "provider": "Education Foundation 6",
    "amount": 38051,
    "amountFormatted": "\u20b938,051",
    "deadline": "2026-09-13",
    "eligibility": {
      "educationLevel": [
        "PG"
      ],
      "gender": "Male",
      "familyIncomeMax": 1000000,
      "states": [
        "Gujarat"
      ],
      "castes": [
        "ST"
      ],
      "fieldsOfStudy": [
        "Commerce"
      ]
    },
    "category": "Private",
    "description": "Mock Indian scholarship program focused on minority support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-37.in",
    "status": "Open",
    "coverage": "Full Academic Support",
    "selectionProcess": "Need + Merit",
    "benefits": "Hostel Assistance",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 37?",
        "answer": "It is open to Male students studying PG courses. Family income should be less than \u20b91000000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Hostel Assistance covering Full Academic Support."
      }
    ]
  },
  {
    "id": "ind-mock-38",
    "name": "India Scholarship Scheme 38",
    "provider": "Education Foundation 13",
    "amount": 129871,
    "amountFormatted": "\u20b9129,871",
    "deadline": "2026-07-11",
    "eligibility": {
      "educationLevel": [
        "Class 6\u201310"
      ],
      "gender": "Male",
      "familyIncomeMax": 800000,
      "states": [
        "Punjab"
      ],
      "castes": [
        "General",
        "OBC",
        "SC",
        "ST",
        "EWS"
      ],
      "fieldsOfStudy": [
        "Science"
      ]
    },
    "category": "NGO",
    "description": "Mock Indian scholarship program focused on merit support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-38.in",
    "status": "Open",
    "coverage": "Tuition + Hostel",
    "selectionProcess": "Need + Merit",
    "benefits": "Research Grant",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 38?",
        "answer": "It is open to Male students studying Class 10 courses. Family income should be less than \u20b9800000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Research Grant covering Tuition + Hostel."
      }
    ]
  },
  {
    "id": "ind-mock-39",
    "name": "India Scholarship Scheme 39",
    "provider": "Education Foundation 21",
    "amount": 34906,
    "amountFormatted": "\u20b934,906",
    "deadline": "2026-11-11",
    "eligibility": {
      "educationLevel": [
        "PG"
      ],
      "gender": "All",
      "familyIncomeMax": 300000,
      "states": [
        "Telangana"
      ],
      "castes": [
        "EWS"
      ],
      "fieldsOfStudy": [
        "Law"
      ]
    },
    "category": "Private",
    "description": "Mock Indian scholarship program focused on need-based support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-39.in",
    "status": "Open",
    "coverage": "Full Academic Support",
    "selectionProcess": "Entrance Test",
    "benefits": "Laptop Support",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 39?",
        "answer": "It is open to Any students studying PG courses. Family income should be less than \u20b9300000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Laptop Support covering Full Academic Support."
      }
    ]
  },
  {
    "id": "ind-mock-40",
    "name": "India Scholarship Scheme 40",
    "provider": "Education Foundation 14",
    "amount": 125790,
    "amountFormatted": "\u20b9125,790",
    "deadline": "2026-10-15",
    "eligibility": {
      "educationLevel": [
        "PG"
      ],
      "gender": "All",
      "familyIncomeMax": 300000,
      "states": [
        "West Bengal"
      ],
      "castes": [
        "General",
        "OBC",
        "SC",
        "ST",
        "EWS"
      ],
      "fieldsOfStudy": [
        "Medical"
      ]
    },
    "category": "Government",
    "description": "Mock Indian scholarship program focused on minority support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-40.in",
    "status": "Open",
    "coverage": "Tuition Fee",
    "selectionProcess": "Need + Merit",
    "benefits": "Research Grant",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 40?",
        "answer": "It is open to Any students studying PhD courses. Family income should be less than \u20b9300000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Research Grant covering Tuition Fee."
      }
    ]
  },
  {
    "id": "ind-mock-41",
    "name": "India Scholarship Scheme 41",
    "provider": "Education Foundation 17",
    "amount": 129161,
    "amountFormatted": "\u20b9129,161",
    "deadline": "2026-09-09",
    "eligibility": {
      "educationLevel": [
        "UG"
      ],
      "gender": "Female",
      "familyIncomeMax": 200000,
      "states": [
        "Madhya Pradesh"
      ],
      "castes": [
        "General",
        "OBC",
        "SC",
        "ST",
        "EWS"
      ],
      "fieldsOfStudy": [
        "Management"
      ]
    },
    "category": "Government",
    "description": "Mock Indian scholarship program focused on research support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-41.in",
    "status": "Open",
    "coverage": "Tuition + Hostel",
    "selectionProcess": "Entrance Test",
    "benefits": "Annual Stipend",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 41?",
        "answer": "It is open to Female students studying UG courses. Family income should be less than \u20b9200000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Annual Stipend covering Tuition + Hostel."
      }
    ]
  },
  {
    "id": "ind-mock-42",
    "name": "India Scholarship Scheme 42",
    "provider": "Education Foundation 10",
    "amount": 29719,
    "amountFormatted": "\u20b929,719",
    "deadline": "2026-11-12",
    "eligibility": {
      "educationLevel": [
        "Diploma"
      ],
      "gender": "All",
      "familyIncomeMax": 300000,
      "states": [
        "Maharashtra"
      ],
      "castes": [
        "SC"
      ],
      "fieldsOfStudy": [
        "Medical"
      ]
    },
    "category": "NGO",
    "description": "Mock Indian scholarship program focused on sc/st support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-42.in",
    "status": "Open",
    "coverage": "Full Academic Support",
    "selectionProcess": "Interview + Merit",
    "benefits": "Annual Stipend",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 42?",
        "answer": "It is open to Any students studying Diploma courses. Family income should be less than \u20b9300000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Annual Stipend covering Full Academic Support."
      }
    ]
  },
  {
    "id": "ind-mock-43",
    "name": "India Scholarship Scheme 43",
    "provider": "Education Foundation 24",
    "amount": 163731,
    "amountFormatted": "\u20b9163,731",
    "deadline": "2026-10-05",
    "eligibility": {
      "educationLevel": [
        "Class 6\u201310"
      ],
      "gender": "All",
      "familyIncomeMax": 200000,
      "states": [
        "Telangana"
      ],
      "castes": [
        "General",
        "OBC",
        "SC",
        "ST",
        "EWS"
      ],
      "fieldsOfStudy": [
        "Commerce"
      ]
    },
    "category": "Private",
    "description": "Mock Indian scholarship program focused on merit support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-43.in",
    "status": "Open",
    "coverage": "Tuition + Hostel",
    "selectionProcess": "Merit Based",
    "benefits": "Annual Stipend",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 43?",
        "answer": "It is open to Any students studying Class 10 courses. Family income should be less than \u20b9200000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Annual Stipend covering Tuition + Hostel."
      }
    ]
  },
  {
    "id": "ind-mock-44",
    "name": "India Scholarship Scheme 44",
    "provider": "Education Foundation 20",
    "amount": 113787,
    "amountFormatted": "\u20b9113,787",
    "deadline": "2026-09-09",
    "eligibility": {
      "educationLevel": [
        "Class 6\u201310"
      ],
      "gender": "Male",
      "familyIncomeMax": 200000,
      "states": [
        "Haryana"
      ],
      "castes": [
        "General",
        "OBC",
        "SC",
        "ST",
        "EWS"
      ],
      "fieldsOfStudy": [
        "Arts"
      ]
    },
    "category": "Government",
    "description": "Mock Indian scholarship program focused on sports support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-44.in",
    "status": "Open",
    "coverage": "Tuition Fee",
    "selectionProcess": "Interview + Merit",
    "benefits": "Annual Stipend",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 44?",
        "answer": "It is open to Male students studying Class 10 courses. Family income should be less than \u20b9200000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Annual Stipend covering Tuition Fee."
      }
    ]
  },
  {
    "id": "ind-mock-45",
    "name": "India Scholarship Scheme 45",
    "provider": "Education Foundation 1",
    "amount": 104997,
    "amountFormatted": "\u20b9104,997",
    "deadline": "2026-12-17",
    "eligibility": {
      "educationLevel": [
        "Class 11\u201312"
      ],
      "gender": "Female",
      "familyIncomeMax": 300000,
      "states": [
        "Gujarat"
      ],
      "castes": [
        "General",
        "OBC",
        "SC",
        "ST",
        "EWS"
      ],
      "fieldsOfStudy": [
        "Science"
      ]
    },
    "category": "NGO",
    "description": "Mock Indian scholarship program focused on merit support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-45.in",
    "status": "Open",
    "coverage": "Full Academic Support",
    "selectionProcess": "Need + Merit",
    "benefits": "Laptop Support",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 45?",
        "answer": "It is open to Female students studying Class 12 courses. Family income should be less than \u20b9300000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Laptop Support covering Full Academic Support."
      }
    ]
  },
  {
    "id": "ind-mock-46",
    "name": "India Scholarship Scheme 46",
    "provider": "Education Foundation 13",
    "amount": 55621,
    "amountFormatted": "\u20b955,621",
    "deadline": "2026-12-07",
    "eligibility": {
      "educationLevel": [
        "Class 11\u201312"
      ],
      "gender": "Male",
      "familyIncomeMax": 1000000,
      "states": [
        "Assam"
      ],
      "castes": [
        "OBC"
      ],
      "fieldsOfStudy": [
        "Science"
      ]
    },
    "category": "NGO",
    "description": "Mock Indian scholarship program focused on sc/st support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-46.in",
    "status": "Open",
    "coverage": "Full Academic Support",
    "selectionProcess": "Interview + Merit",
    "benefits": "Laptop Support",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 46?",
        "answer": "It is open to Male students studying Class 12 courses. Family income should be less than \u20b91000000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Laptop Support covering Full Academic Support."
      }
    ]
  },
  {
    "id": "ind-mock-47",
    "name": "India Scholarship Scheme 47",
    "provider": "Education Foundation 12",
    "amount": 67563,
    "amountFormatted": "\u20b967,563",
    "deadline": "2026-10-14",
    "eligibility": {
      "educationLevel": [
        "PG"
      ],
      "gender": "All",
      "familyIncomeMax": 800000,
      "states": [
        "Madhya Pradesh"
      ],
      "castes": [
        "General",
        "OBC",
        "SC",
        "ST",
        "EWS"
      ],
      "fieldsOfStudy": [
        "Science"
      ]
    },
    "category": "Private",
    "description": "Mock Indian scholarship program focused on minority support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-47.in",
    "status": "Open",
    "coverage": "Full Academic Support",
    "selectionProcess": "Need + Merit",
    "benefits": "Hostel Assistance",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 47?",
        "answer": "It is open to Any students studying PhD courses. Family income should be less than \u20b9800000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Hostel Assistance covering Full Academic Support."
      }
    ]
  },
  {
    "id": "ind-mock-48",
    "name": "India Scholarship Scheme 48",
    "provider": "Education Foundation 6",
    "amount": 198117,
    "amountFormatted": "\u20b9198,117",
    "deadline": "2026-08-04",
    "eligibility": {
      "educationLevel": [
        "Diploma"
      ],
      "gender": "All",
      "familyIncomeMax": 300000,
      "states": [
        "Madhya Pradesh"
      ],
      "castes": [
        "EWS"
      ],
      "fieldsOfStudy": [
        "Engineering"
      ]
    },
    "category": "Private",
    "description": "Mock Indian scholarship program focused on need-based support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-48.in",
    "status": "Open",
    "coverage": "Tuition Fee",
    "selectionProcess": "Need + Merit",
    "benefits": "Annual Stipend",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 48?",
        "answer": "It is open to Any students studying Diploma courses. Family income should be less than \u20b9300000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Annual Stipend covering Tuition Fee."
      }
    ]
  },
  {
    "id": "ind-mock-49",
    "name": "India Scholarship Scheme 49",
    "provider": "Education Foundation 1",
    "amount": 64094,
    "amountFormatted": "\u20b964,094",
    "deadline": "2026-10-09",
    "eligibility": {
      "educationLevel": [
        "Class 6\u201310"
      ],
      "gender": "Male",
      "familyIncomeMax": 500000,
      "states": [
        "Kerala"
      ],
      "castes": [
        "EWS"
      ],
      "fieldsOfStudy": [
        "Commerce"
      ]
    },
    "category": "NGO",
    "description": "Mock Indian scholarship program focused on need-based support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-49.in",
    "status": "Open",
    "coverage": "Tuition Fee",
    "selectionProcess": "Merit Based",
    "benefits": "Hostel Assistance",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 49?",
        "answer": "It is open to Male students studying Class 10 courses. Family income should be less than \u20b9500000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Hostel Assistance covering Tuition Fee."
      }
    ]
  },
  {
    "id": "ind-mock-50",
    "name": "India Scholarship Scheme 50",
    "provider": "Education Foundation 18",
    "amount": 97834,
    "amountFormatted": "\u20b997,834",
    "deadline": "2026-07-28",
    "eligibility": {
      "educationLevel": [
        "PG"
      ],
      "gender": "All",
      "familyIncomeMax": 500000,
      "states": [
        "Rajasthan"
      ],
      "castes": [
        "SC"
      ],
      "fieldsOfStudy": [
        "Agriculture"
      ]
    },
    "category": "Private",
    "description": "Mock Indian scholarship program focused on sc/st support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-50.in",
    "status": "Open",
    "coverage": "Tuition + Hostel",
    "selectionProcess": "Need + Merit",
    "benefits": "Hostel Assistance",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 50?",
        "answer": "It is open to Any students studying PhD courses. Family income should be less than \u20b9500000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Hostel Assistance covering Tuition + Hostel."
      }
    ]
  },
  {
    "id": "ind-mock-51",
    "name": "India Scholarship Scheme 51",
    "provider": "Education Foundation 16",
    "amount": 37178,
    "amountFormatted": "\u20b937,178",
    "deadline": "2026-07-06",
    "eligibility": {
      "educationLevel": [
        "Class 6\u201310"
      ],
      "gender": "Male",
      "familyIncomeMax": 500000,
      "states": [
        "Madhya Pradesh"
      ],
      "castes": [
        "ST"
      ],
      "fieldsOfStudy": [
        "Arts"
      ]
    },
    "category": "NGO",
    "description": "Mock Indian scholarship program focused on merit support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-51.in",
    "status": "Open",
    "coverage": "Books and Tuition",
    "selectionProcess": "Interview + Merit",
    "benefits": "Annual Stipend",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 51?",
        "answer": "It is open to Male students studying Class 10 courses. Family income should be less than \u20b9500000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Annual Stipend covering Books and Tuition."
      }
    ]
  },
  {
    "id": "ind-mock-52",
    "name": "India Scholarship Scheme 52",
    "provider": "Education Foundation 14",
    "amount": 114107,
    "amountFormatted": "\u20b9114,107",
    "deadline": "2026-09-21",
    "eligibility": {
      "educationLevel": [
        "Class 11\u201312"
      ],
      "gender": "All",
      "familyIncomeMax": 1000000,
      "states": [
        "Telangana"
      ],
      "castes": [
        "ST"
      ],
      "fieldsOfStudy": [
        "Engineering"
      ]
    },
    "category": "Government",
    "description": "Mock Indian scholarship program focused on research support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-52.in",
    "status": "Open",
    "coverage": "Full Academic Support",
    "selectionProcess": "Interview + Merit",
    "benefits": "Research Grant",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 52?",
        "answer": "It is open to Any students studying Class 12 courses. Family income should be less than \u20b91000000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Research Grant covering Full Academic Support."
      }
    ]
  },
  {
    "id": "ind-mock-53",
    "name": "India Scholarship Scheme 53",
    "provider": "Education Foundation 12",
    "amount": 167109,
    "amountFormatted": "\u20b9167,109",
    "deadline": "2026-12-07",
    "eligibility": {
      "educationLevel": [
        "Class 6\u201310"
      ],
      "gender": "Female",
      "familyIncomeMax": 500000,
      "states": [
        "Haryana"
      ],
      "castes": [
        "General"
      ],
      "fieldsOfStudy": [
        "Management"
      ]
    },
    "category": "Private",
    "description": "Mock Indian scholarship program focused on merit support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-53.in",
    "status": "Open",
    "coverage": "Tuition Fee",
    "selectionProcess": "Need + Merit",
    "benefits": "Hostel Assistance",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 53?",
        "answer": "It is open to Female students studying Class 10 courses. Family income should be less than \u20b9500000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Hostel Assistance covering Tuition Fee."
      }
    ]
  },
  {
    "id": "ind-mock-54",
    "name": "India Scholarship Scheme 54",
    "provider": "Education Foundation 15",
    "amount": 171005,
    "amountFormatted": "\u20b9171,005",
    "deadline": "2026-07-17",
    "eligibility": {
      "educationLevel": [
        "Diploma"
      ],
      "gender": "Female",
      "familyIncomeMax": 800000,
      "states": [
        "Gujarat"
      ],
      "castes": [
        "SC"
      ],
      "fieldsOfStudy": [
        "Science"
      ]
    },
    "category": "Private",
    "description": "Mock Indian scholarship program focused on minority support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-54.in",
    "status": "Open",
    "coverage": "Full Academic Support",
    "selectionProcess": "Interview + Merit",
    "benefits": "Annual Stipend",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 54?",
        "answer": "It is open to Female students studying Diploma courses. Family income should be less than \u20b9800000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Annual Stipend covering Full Academic Support."
      }
    ]
  },
  {
    "id": "ind-mock-55",
    "name": "India Scholarship Scheme 55",
    "provider": "Education Foundation 4",
    "amount": 178087,
    "amountFormatted": "\u20b9178,087",
    "deadline": "2026-08-21",
    "eligibility": {
      "educationLevel": [
        "Diploma"
      ],
      "gender": "Female",
      "familyIncomeMax": 800000,
      "states": [
        "Andhra Pradesh"
      ],
      "castes": [
        "General",
        "OBC",
        "SC",
        "ST",
        "EWS"
      ],
      "fieldsOfStudy": [
        "Agriculture"
      ]
    },
    "category": "NGO",
    "description": "Mock Indian scholarship program focused on minority support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-55.in",
    "status": "Open",
    "coverage": "Full Academic Support",
    "selectionProcess": "Interview + Merit",
    "benefits": "Laptop Support",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 55?",
        "answer": "It is open to Female students studying Diploma courses. Family income should be less than \u20b9800000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Laptop Support covering Full Academic Support."
      }
    ]
  },
  {
    "id": "ind-mock-56",
    "name": "India Scholarship Scheme 56",
    "provider": "Education Foundation 8",
    "amount": 34245,
    "amountFormatted": "\u20b934,245",
    "deadline": "2026-09-06",
    "eligibility": {
      "educationLevel": [
        "PG"
      ],
      "gender": "Male",
      "familyIncomeMax": 1000000,
      "states": [
        "West Bengal"
      ],
      "castes": [
        "OBC"
      ],
      "fieldsOfStudy": [
        "Medical"
      ]
    },
    "category": "Government",
    "description": "Mock Indian scholarship program focused on need-based support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-56.in",
    "status": "Open",
    "coverage": "Full Academic Support",
    "selectionProcess": "Entrance Test",
    "benefits": "Laptop Support",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 56?",
        "answer": "It is open to Male students studying PhD courses. Family income should be less than \u20b91000000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Laptop Support covering Full Academic Support."
      }
    ]
  },
  {
    "id": "ind-mock-57",
    "name": "India Scholarship Scheme 57",
    "provider": "Education Foundation 4",
    "amount": 133449,
    "amountFormatted": "\u20b9133,449",
    "deadline": "2026-07-15",
    "eligibility": {
      "educationLevel": [
        "Diploma"
      ],
      "gender": "Female",
      "familyIncomeMax": 300000,
      "states": [
        "Haryana"
      ],
      "castes": [
        "OBC"
      ],
      "fieldsOfStudy": [
        "Science"
      ]
    },
    "category": "NGO",
    "description": "Mock Indian scholarship program focused on girls education support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-57.in",
    "status": "Open",
    "coverage": "Books and Tuition",
    "selectionProcess": "Merit Based",
    "benefits": "Laptop Support",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 57?",
        "answer": "It is open to Female students studying Diploma courses. Family income should be less than \u20b9300000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Laptop Support covering Books and Tuition."
      }
    ]
  },
  {
    "id": "ind-mock-58",
    "name": "India Scholarship Scheme 58",
    "provider": "Education Foundation 24",
    "amount": 46443,
    "amountFormatted": "\u20b946,443",
    "deadline": "2026-07-02",
    "eligibility": {
      "educationLevel": [
        "Diploma"
      ],
      "gender": "Female",
      "familyIncomeMax": 800000,
      "states": [
        "Punjab"
      ],
      "castes": [
        "SC"
      ],
      "fieldsOfStudy": [
        "Engineering"
      ]
    },
    "category": "Private",
    "description": "Mock Indian scholarship program focused on merit support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-58.in",
    "status": "Open",
    "coverage": "Tuition + Hostel",
    "selectionProcess": "Merit Based",
    "benefits": "Hostel Assistance",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 58?",
        "answer": "It is open to Female students studying Diploma courses. Family income should be less than \u20b9800000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Hostel Assistance covering Tuition + Hostel."
      }
    ]
  },
  {
    "id": "ind-mock-59",
    "name": "India Scholarship Scheme 59",
    "provider": "Education Foundation 21",
    "amount": 131816,
    "amountFormatted": "\u20b9131,816",
    "deadline": "2026-07-03",
    "eligibility": {
      "educationLevel": [
        "Class 6\u201310"
      ],
      "gender": "All",
      "familyIncomeMax": 200000,
      "states": [
        "Karnataka"
      ],
      "castes": [
        "OBC"
      ],
      "fieldsOfStudy": [
        "Law"
      ]
    },
    "category": "Private",
    "description": "Mock Indian scholarship program focused on minority support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-59.in",
    "status": "Open",
    "coverage": "Full Academic Support",
    "selectionProcess": "Merit Based",
    "benefits": "Hostel Assistance",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 59?",
        "answer": "It is open to Any students studying Class 10 courses. Family income should be less than \u20b9200000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Hostel Assistance covering Full Academic Support."
      }
    ]
  },
  {
    "id": "ind-mock-60",
    "name": "India Scholarship Scheme 60",
    "provider": "Education Foundation 12",
    "amount": 71189,
    "amountFormatted": "\u20b971,189",
    "deadline": "2026-11-21",
    "eligibility": {
      "educationLevel": [
        "UG"
      ],
      "gender": "All",
      "familyIncomeMax": 1000000,
      "states": [
        "Bihar"
      ],
      "castes": [
        "EWS"
      ],
      "fieldsOfStudy": [
        "All"
      ]
    },
    "category": "Private",
    "description": "Mock Indian scholarship program focused on need-based support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-60.in",
    "status": "Open",
    "coverage": "Books and Tuition",
    "selectionProcess": "Merit Based",
    "benefits": "Research Grant",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 60?",
        "answer": "It is open to Any students studying UG courses. Family income should be less than \u20b91000000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Research Grant covering Books and Tuition."
      }
    ]
  },
  {
    "id": "ind-mock-61",
    "name": "India Scholarship Scheme 61",
    "provider": "Education Foundation 1",
    "amount": 175095,
    "amountFormatted": "\u20b9175,095",
    "deadline": "2026-09-25",
    "eligibility": {
      "educationLevel": [
        "UG"
      ],
      "gender": "Female",
      "familyIncomeMax": 200000,
      "states": [
        "Andhra Pradesh"
      ],
      "castes": [
        "OBC"
      ],
      "fieldsOfStudy": [
        "Law"
      ]
    },
    "category": "NGO",
    "description": "Mock Indian scholarship program focused on technical education support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-61.in",
    "status": "Open",
    "coverage": "Tuition + Hostel",
    "selectionProcess": "Entrance Test",
    "benefits": "Research Grant",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 61?",
        "answer": "It is open to Female students studying UG courses. Family income should be less than \u20b9200000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Research Grant covering Tuition + Hostel."
      }
    ]
  },
  {
    "id": "ind-mock-62",
    "name": "India Scholarship Scheme 62",
    "provider": "Education Foundation 21",
    "amount": 160018,
    "amountFormatted": "\u20b9160,018",
    "deadline": "2026-07-28",
    "eligibility": {
      "educationLevel": [
        "PG"
      ],
      "gender": "All",
      "familyIncomeMax": 300000,
      "states": [
        "Punjab"
      ],
      "castes": [
        "SC"
      ],
      "fieldsOfStudy": [
        "Science"
      ]
    },
    "category": "Private",
    "description": "Mock Indian scholarship program focused on sports support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-62.in",
    "status": "Open",
    "coverage": "Tuition Fee",
    "selectionProcess": "Entrance Test",
    "benefits": "Hostel Assistance",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 62?",
        "answer": "It is open to Any students studying PG courses. Family income should be less than \u20b9300000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Hostel Assistance covering Tuition Fee."
      }
    ]
  },
  {
    "id": "ind-mock-63",
    "name": "India Scholarship Scheme 63",
    "provider": "Education Foundation 17",
    "amount": 69105,
    "amountFormatted": "\u20b969,105",
    "deadline": "2026-09-03",
    "eligibility": {
      "educationLevel": [
        "PG"
      ],
      "gender": "Male",
      "familyIncomeMax": 800000,
      "states": [
        "Kerala"
      ],
      "castes": [
        "General",
        "OBC",
        "SC",
        "ST",
        "EWS"
      ],
      "fieldsOfStudy": [
        "Management"
      ]
    },
    "category": "Government",
    "description": "Mock Indian scholarship program focused on merit support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-63.in",
    "status": "Open",
    "coverage": "Full Academic Support",
    "selectionProcess": "Interview + Merit",
    "benefits": "Hostel Assistance",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 63?",
        "answer": "It is open to Male students studying PhD courses. Family income should be less than \u20b9800000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Hostel Assistance covering Full Academic Support."
      }
    ]
  },
  {
    "id": "ind-mock-64",
    "name": "India Scholarship Scheme 64",
    "provider": "Education Foundation 4",
    "amount": 192846,
    "amountFormatted": "\u20b9192,846",
    "deadline": "2026-10-08",
    "eligibility": {
      "educationLevel": [
        "Class 6\u201310"
      ],
      "gender": "All",
      "familyIncomeMax": 1000000,
      "states": [
        "Bihar"
      ],
      "castes": [
        "General",
        "OBC",
        "SC",
        "ST",
        "EWS"
      ],
      "fieldsOfStudy": [
        "Science"
      ]
    },
    "category": "NGO",
    "description": "Mock Indian scholarship program focused on research support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-64.in",
    "status": "Open",
    "coverage": "Books and Tuition",
    "selectionProcess": "Entrance Test",
    "benefits": "Annual Stipend",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 64?",
        "answer": "It is open to Any students studying Class 10 courses. Family income should be less than \u20b91000000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Annual Stipend covering Books and Tuition."
      }
    ]
  },
  {
    "id": "ind-mock-65",
    "name": "India Scholarship Scheme 65",
    "provider": "Education Foundation 7",
    "amount": 10287,
    "amountFormatted": "\u20b910,287",
    "deadline": "2026-12-18",
    "eligibility": {
      "educationLevel": [
        "Diploma"
      ],
      "gender": "Male",
      "familyIncomeMax": 300000,
      "states": [
        "Jharkhand"
      ],
      "castes": [
        "General"
      ],
      "fieldsOfStudy": [
        "Law"
      ]
    },
    "category": "NGO",
    "description": "Mock Indian scholarship program focused on girls education support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-65.in",
    "status": "Open",
    "coverage": "Full Academic Support",
    "selectionProcess": "Entrance Test",
    "benefits": "Annual Stipend",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 65?",
        "answer": "It is open to Male students studying Diploma courses. Family income should be less than \u20b9300000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Annual Stipend covering Full Academic Support."
      }
    ]
  },
  {
    "id": "ind-mock-66",
    "name": "India Scholarship Scheme 66",
    "provider": "Education Foundation 18",
    "amount": 175146,
    "amountFormatted": "\u20b9175,146",
    "deadline": "2026-07-05",
    "eligibility": {
      "educationLevel": [
        "Class 6\u201310"
      ],
      "gender": "All",
      "familyIncomeMax": 1000000,
      "states": [
        "Odisha"
      ],
      "castes": [
        "General",
        "OBC",
        "SC",
        "ST",
        "EWS"
      ],
      "fieldsOfStudy": [
        "Law"
      ]
    },
    "category": "Private",
    "description": "Mock Indian scholarship program focused on sc/st support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-66.in",
    "status": "Open",
    "coverage": "Tuition + Hostel",
    "selectionProcess": "Interview + Merit",
    "benefits": "Annual Stipend",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 66?",
        "answer": "It is open to Any students studying Class 10 courses. Family income should be less than \u20b91000000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Annual Stipend covering Tuition + Hostel."
      }
    ]
  },
  {
    "id": "ind-mock-67",
    "name": "India Scholarship Scheme 67",
    "provider": "Education Foundation 2",
    "amount": 196165,
    "amountFormatted": "\u20b9196,165",
    "deadline": "2026-09-20",
    "eligibility": {
      "educationLevel": [
        "UG"
      ],
      "gender": "Male",
      "familyIncomeMax": 800000,
      "states": [
        "Jharkhand"
      ],
      "castes": [
        "OBC"
      ],
      "fieldsOfStudy": [
        "Science"
      ]
    },
    "category": "Government",
    "description": "Mock Indian scholarship program focused on technical education support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-67.in",
    "status": "Open",
    "coverage": "Full Academic Support",
    "selectionProcess": "Need + Merit",
    "benefits": "Laptop Support",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 67?",
        "answer": "It is open to Male students studying UG courses. Family income should be less than \u20b9800000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Laptop Support covering Full Academic Support."
      }
    ]
  },
  {
    "id": "ind-mock-68",
    "name": "India Scholarship Scheme 68",
    "provider": "Education Foundation 1",
    "amount": 52813,
    "amountFormatted": "\u20b952,813",
    "deadline": "2026-10-13",
    "eligibility": {
      "educationLevel": [
        "PG"
      ],
      "gender": "Female",
      "familyIncomeMax": 800000,
      "states": [
        "Chhattisgarh"
      ],
      "castes": [
        "ST"
      ],
      "fieldsOfStudy": [
        "Medical"
      ]
    },
    "category": "NGO",
    "description": "Mock Indian scholarship program focused on merit support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-68.in",
    "status": "Open",
    "coverage": "Tuition + Hostel",
    "selectionProcess": "Need + Merit",
    "benefits": "Laptop Support",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 68?",
        "answer": "It is open to Female students studying PhD courses. Family income should be less than \u20b9800000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Laptop Support covering Tuition + Hostel."
      }
    ]
  },
  {
    "id": "ind-mock-69",
    "name": "India Scholarship Scheme 69",
    "provider": "Education Foundation 13",
    "amount": 127597,
    "amountFormatted": "\u20b9127,597",
    "deadline": "2026-07-10",
    "eligibility": {
      "educationLevel": [
        "Class 11\u201312"
      ],
      "gender": "Male",
      "familyIncomeMax": 500000,
      "states": [
        "Punjab"
      ],
      "castes": [
        "General"
      ],
      "fieldsOfStudy": [
        "Agriculture"
      ]
    },
    "category": "NGO",
    "description": "Mock Indian scholarship program focused on technical education support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-69.in",
    "status": "Open",
    "coverage": "Tuition + Hostel",
    "selectionProcess": "Need + Merit",
    "benefits": "Research Grant",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 69?",
        "answer": "It is open to Male students studying Class 12 courses. Family income should be less than \u20b9500000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Research Grant covering Tuition + Hostel."
      }
    ]
  },
  {
    "id": "ind-mock-70",
    "name": "India Scholarship Scheme 70",
    "provider": "Education Foundation 13",
    "amount": 54652,
    "amountFormatted": "\u20b954,652",
    "deadline": "2026-12-23",
    "eligibility": {
      "educationLevel": [
        "Diploma"
      ],
      "gender": "Male",
      "familyIncomeMax": 800000,
      "states": [
        "Assam"
      ],
      "castes": [
        "ST"
      ],
      "fieldsOfStudy": [
        "Engineering"
      ]
    },
    "category": "NGO",
    "description": "Mock Indian scholarship program focused on minority support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-70.in",
    "status": "Open",
    "coverage": "Tuition Fee",
    "selectionProcess": "Entrance Test",
    "benefits": "Research Grant",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 70?",
        "answer": "It is open to Male students studying Diploma courses. Family income should be less than \u20b9800000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Research Grant covering Tuition Fee."
      }
    ]
  },
  {
    "id": "ind-mock-71",
    "name": "India Scholarship Scheme 71",
    "provider": "Education Foundation 10",
    "amount": 27073,
    "amountFormatted": "\u20b927,073",
    "deadline": "2026-07-16",
    "eligibility": {
      "educationLevel": [
        "Class 11\u201312"
      ],
      "gender": "Male",
      "familyIncomeMax": 500000,
      "states": [
        "Bihar"
      ],
      "castes": [
        "EWS"
      ],
      "fieldsOfStudy": [
        "Commerce"
      ]
    },
    "category": "NGO",
    "description": "Mock Indian scholarship program focused on technical education support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-71.in",
    "status": "Open",
    "coverage": "Full Academic Support",
    "selectionProcess": "Entrance Test",
    "benefits": "Annual Stipend",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 71?",
        "answer": "It is open to Male students studying Class 12 courses. Family income should be less than \u20b9500000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Annual Stipend covering Full Academic Support."
      }
    ]
  },
  {
    "id": "ind-mock-72",
    "name": "India Scholarship Scheme 72",
    "provider": "Education Foundation 17",
    "amount": 128571,
    "amountFormatted": "\u20b9128,571",
    "deadline": "2026-07-12",
    "eligibility": {
      "educationLevel": [
        "Class 6\u201310"
      ],
      "gender": "Female",
      "familyIncomeMax": 200000,
      "states": [
        "Gujarat"
      ],
      "castes": [
        "OBC"
      ],
      "fieldsOfStudy": [
        "Commerce"
      ]
    },
    "category": "Government",
    "description": "Mock Indian scholarship program focused on merit support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-72.in",
    "status": "Open",
    "coverage": "Full Academic Support",
    "selectionProcess": "Interview + Merit",
    "benefits": "Hostel Assistance",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 72?",
        "answer": "It is open to Female students studying Class 10 courses. Family income should be less than \u20b9200000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Hostel Assistance covering Full Academic Support."
      }
    ]
  },
  {
    "id": "ind-mock-73",
    "name": "India Scholarship Scheme 73",
    "provider": "Education Foundation 13",
    "amount": 165169,
    "amountFormatted": "\u20b9165,169",
    "deadline": "2026-12-11",
    "eligibility": {
      "educationLevel": [
        "Class 6\u201310"
      ],
      "gender": "Female",
      "familyIncomeMax": 200000,
      "states": [
        "Telangana"
      ],
      "castes": [
        "General"
      ],
      "fieldsOfStudy": [
        "All"
      ]
    },
    "category": "NGO",
    "description": "Mock Indian scholarship program focused on sc/st support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-73.in",
    "status": "Open",
    "coverage": "Tuition Fee",
    "selectionProcess": "Need + Merit",
    "benefits": "Hostel Assistance",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 73?",
        "answer": "It is open to Female students studying Class 10 courses. Family income should be less than \u20b9200000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Hostel Assistance covering Tuition Fee."
      }
    ]
  },
  {
    "id": "ind-mock-74",
    "name": "India Scholarship Scheme 74",
    "provider": "Education Foundation 18",
    "amount": 132049,
    "amountFormatted": "\u20b9132,049",
    "deadline": "2026-07-05",
    "eligibility": {
      "educationLevel": [
        "PG"
      ],
      "gender": "All",
      "familyIncomeMax": 800000,
      "states": [
        "Haryana"
      ],
      "castes": [
        "OBC"
      ],
      "fieldsOfStudy": [
        "Agriculture"
      ]
    },
    "category": "Private",
    "description": "Mock Indian scholarship program focused on technical education support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-74.in",
    "status": "Open",
    "coverage": "Full Academic Support",
    "selectionProcess": "Entrance Test",
    "benefits": "Hostel Assistance",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 74?",
        "answer": "It is open to Any students studying PG courses. Family income should be less than \u20b9800000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Hostel Assistance covering Full Academic Support."
      }
    ]
  },
  {
    "id": "ind-mock-75",
    "name": "India Scholarship Scheme 75",
    "provider": "Education Foundation 9",
    "amount": 166519,
    "amountFormatted": "\u20b9166,519",
    "deadline": "2026-07-09",
    "eligibility": {
      "educationLevel": [
        "PG"
      ],
      "gender": "Male",
      "familyIncomeMax": 800000,
      "states": [
        "Uttar Pradesh"
      ],
      "castes": [
        "ST"
      ],
      "fieldsOfStudy": [
        "Science"
      ]
    },
    "category": "Private",
    "description": "Mock Indian scholarship program focused on technical education support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-75.in",
    "status": "Open",
    "coverage": "Full Academic Support",
    "selectionProcess": "Entrance Test",
    "benefits": "Annual Stipend",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 75?",
        "answer": "It is open to Male students studying PG courses. Family income should be less than \u20b9800000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Annual Stipend covering Full Academic Support."
      }
    ]
  },
  {
    "id": "ind-mock-76",
    "name": "India Scholarship Scheme 76",
    "provider": "Education Foundation 24",
    "amount": 181335,
    "amountFormatted": "\u20b9181,335",
    "deadline": "2026-09-16",
    "eligibility": {
      "educationLevel": [
        "Class 6\u201310"
      ],
      "gender": "Male",
      "familyIncomeMax": 500000,
      "states": [
        "Maharashtra"
      ],
      "castes": [
        "General",
        "OBC",
        "SC",
        "ST",
        "EWS"
      ],
      "fieldsOfStudy": [
        "Commerce"
      ]
    },
    "category": "Private",
    "description": "Mock Indian scholarship program focused on sports support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-76.in",
    "status": "Open",
    "coverage": "Books and Tuition",
    "selectionProcess": "Need + Merit",
    "benefits": "Annual Stipend",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 76?",
        "answer": "It is open to Male students studying Class 10 courses. Family income should be less than \u20b9500000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Annual Stipend covering Books and Tuition."
      }
    ]
  },
  {
    "id": "ind-mock-77",
    "name": "India Scholarship Scheme 77",
    "provider": "Education Foundation 9",
    "amount": 45133,
    "amountFormatted": "\u20b945,133",
    "deadline": "2026-08-16",
    "eligibility": {
      "educationLevel": [
        "UG"
      ],
      "gender": "Female",
      "familyIncomeMax": 500000,
      "states": [
        "Haryana"
      ],
      "castes": [
        "OBC"
      ],
      "fieldsOfStudy": [
        "Arts"
      ]
    },
    "category": "Private",
    "description": "Mock Indian scholarship program focused on research support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-77.in",
    "status": "Open",
    "coverage": "Books and Tuition",
    "selectionProcess": "Interview + Merit",
    "benefits": "Laptop Support",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 77?",
        "answer": "It is open to Female students studying UG courses. Family income should be less than \u20b9500000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Laptop Support covering Books and Tuition."
      }
    ]
  },
  {
    "id": "ind-mock-78",
    "name": "India Scholarship Scheme 78",
    "provider": "Education Foundation 2",
    "amount": 125573,
    "amountFormatted": "\u20b9125,573",
    "deadline": "2026-08-04",
    "eligibility": {
      "educationLevel": [
        "Diploma"
      ],
      "gender": "All",
      "familyIncomeMax": 1000000,
      "states": [
        "Karnataka"
      ],
      "castes": [
        "General"
      ],
      "fieldsOfStudy": [
        "Management"
      ]
    },
    "category": "Government",
    "description": "Mock Indian scholarship program focused on research support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-78.in",
    "status": "Open",
    "coverage": "Books and Tuition",
    "selectionProcess": "Interview + Merit",
    "benefits": "Annual Stipend",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 78?",
        "answer": "It is open to Any students studying Diploma courses. Family income should be less than \u20b91000000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Annual Stipend covering Books and Tuition."
      }
    ]
  },
  {
    "id": "ind-mock-79",
    "name": "India Scholarship Scheme 79",
    "provider": "Education Foundation 8",
    "amount": 83413,
    "amountFormatted": "\u20b983,413",
    "deadline": "2026-08-16",
    "eligibility": {
      "educationLevel": [
        "Diploma"
      ],
      "gender": "All",
      "familyIncomeMax": 1000000,
      "states": [
        "Maharashtra"
      ],
      "castes": [
        "General",
        "OBC",
        "SC",
        "ST",
        "EWS"
      ],
      "fieldsOfStudy": [
        "Agriculture"
      ]
    },
    "category": "Government",
    "description": "Mock Indian scholarship program focused on sports support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-79.in",
    "status": "Open",
    "coverage": "Full Academic Support",
    "selectionProcess": "Interview + Merit",
    "benefits": "Hostel Assistance",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 79?",
        "answer": "It is open to Any students studying Diploma courses. Family income should be less than \u20b91000000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Hostel Assistance covering Full Academic Support."
      }
    ]
  },
  {
    "id": "ind-mock-80",
    "name": "India Scholarship Scheme 80",
    "provider": "Education Foundation 4",
    "amount": 81364,
    "amountFormatted": "\u20b981,364",
    "deadline": "2026-07-22",
    "eligibility": {
      "educationLevel": [
        "PG"
      ],
      "gender": "All",
      "familyIncomeMax": 1000000,
      "states": [
        "West Bengal"
      ],
      "castes": [
        "OBC"
      ],
      "fieldsOfStudy": [
        "All"
      ]
    },
    "category": "NGO",
    "description": "Mock Indian scholarship program focused on research support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-80.in",
    "status": "Open",
    "coverage": "Tuition Fee",
    "selectionProcess": "Merit Based",
    "benefits": "Annual Stipend",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 80?",
        "answer": "It is open to Any students studying PhD courses. Family income should be less than \u20b91000000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Annual Stipend covering Tuition Fee."
      }
    ]
  },
  {
    "id": "ind-mock-81",
    "name": "India Scholarship Scheme 81",
    "provider": "Education Foundation 18",
    "amount": 168104,
    "amountFormatted": "\u20b9168,104",
    "deadline": "2026-09-28",
    "eligibility": {
      "educationLevel": [
        "Diploma"
      ],
      "gender": "All",
      "familyIncomeMax": 200000,
      "states": [
        "Chhattisgarh"
      ],
      "castes": [
        "General"
      ],
      "fieldsOfStudy": [
        "Agriculture"
      ]
    },
    "category": "Private",
    "description": "Mock Indian scholarship program focused on girls education support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-81.in",
    "status": "Open",
    "coverage": "Tuition Fee",
    "selectionProcess": "Merit Based",
    "benefits": "Hostel Assistance",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 81?",
        "answer": "It is open to Any students studying Diploma courses. Family income should be less than \u20b9200000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Hostel Assistance covering Tuition Fee."
      }
    ]
  },
  {
    "id": "ind-mock-82",
    "name": "India Scholarship Scheme 82",
    "provider": "Education Foundation 6",
    "amount": 84949,
    "amountFormatted": "\u20b984,949",
    "deadline": "2026-10-27",
    "eligibility": {
      "educationLevel": [
        "UG"
      ],
      "gender": "All",
      "familyIncomeMax": 300000,
      "states": [
        "Bihar"
      ],
      "castes": [
        "SC"
      ],
      "fieldsOfStudy": [
        "Medical"
      ]
    },
    "category": "Private",
    "description": "Mock Indian scholarship program focused on research support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-82.in",
    "status": "Open",
    "coverage": "Books and Tuition",
    "selectionProcess": "Entrance Test",
    "benefits": "Hostel Assistance",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 82?",
        "answer": "It is open to Any students studying UG courses. Family income should be less than \u20b9300000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Hostel Assistance covering Books and Tuition."
      }
    ]
  },
  {
    "id": "ind-mock-83",
    "name": "India Scholarship Scheme 83",
    "provider": "Education Foundation 17",
    "amount": 95424,
    "amountFormatted": "\u20b995,424",
    "deadline": "2026-11-20",
    "eligibility": {
      "educationLevel": [
        "PG"
      ],
      "gender": "All",
      "familyIncomeMax": 200000,
      "states": [
        "Karnataka"
      ],
      "castes": [
        "ST"
      ],
      "fieldsOfStudy": [
        "Arts"
      ]
    },
    "category": "Government",
    "description": "Mock Indian scholarship program focused on research support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-83.in",
    "status": "Open",
    "coverage": "Tuition + Hostel",
    "selectionProcess": "Merit Based",
    "benefits": "Research Grant",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 83?",
        "answer": "It is open to Any students studying PhD courses. Family income should be less than \u20b9200000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Research Grant covering Tuition + Hostel."
      }
    ]
  },
  {
    "id": "ind-mock-84",
    "name": "India Scholarship Scheme 84",
    "provider": "Education Foundation 4",
    "amount": 149039,
    "amountFormatted": "\u20b9149,039",
    "deadline": "2026-09-28",
    "eligibility": {
      "educationLevel": [
        "Class 11\u201312"
      ],
      "gender": "Male",
      "familyIncomeMax": 800000,
      "states": [
        "Tamil Nadu"
      ],
      "castes": [
        "General",
        "OBC",
        "SC",
        "ST",
        "EWS"
      ],
      "fieldsOfStudy": [
        "Commerce"
      ]
    },
    "category": "NGO",
    "description": "Mock Indian scholarship program focused on girls education support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-84.in",
    "status": "Open",
    "coverage": "Books and Tuition",
    "selectionProcess": "Entrance Test",
    "benefits": "Annual Stipend",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 84?",
        "answer": "It is open to Male students studying Class 12 courses. Family income should be less than \u20b9800000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Annual Stipend covering Books and Tuition."
      }
    ]
  },
  {
    "id": "ind-mock-85",
    "name": "India Scholarship Scheme 85",
    "provider": "Education Foundation 16",
    "amount": 103767,
    "amountFormatted": "\u20b9103,767",
    "deadline": "2026-07-08",
    "eligibility": {
      "educationLevel": [
        "Class 11\u201312"
      ],
      "gender": "Female",
      "familyIncomeMax": 300000,
      "states": [
        "Uttar Pradesh"
      ],
      "castes": [
        "EWS"
      ],
      "fieldsOfStudy": [
        "Agriculture"
      ]
    },
    "category": "NGO",
    "description": "Mock Indian scholarship program focused on technical education support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-85.in",
    "status": "Open",
    "coverage": "Full Academic Support",
    "selectionProcess": "Need + Merit",
    "benefits": "Annual Stipend",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 85?",
        "answer": "It is open to Female students studying Class 12 courses. Family income should be less than \u20b9300000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Annual Stipend covering Full Academic Support."
      }
    ]
  },
  {
    "id": "ind-mock-86",
    "name": "India Scholarship Scheme 86",
    "provider": "Education Foundation 19",
    "amount": 131599,
    "amountFormatted": "\u20b9131,599",
    "deadline": "2026-12-22",
    "eligibility": {
      "educationLevel": [
        "Diploma"
      ],
      "gender": "Male",
      "familyIncomeMax": 500000,
      "states": [
        "Uttar Pradesh"
      ],
      "castes": [
        "ST"
      ],
      "fieldsOfStudy": [
        "Engineering"
      ]
    },
    "category": "NGO",
    "description": "Mock Indian scholarship program focused on technical education support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-86.in",
    "status": "Open",
    "coverage": "Tuition Fee",
    "selectionProcess": "Interview + Merit",
    "benefits": "Hostel Assistance",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 86?",
        "answer": "It is open to Male students studying Diploma courses. Family income should be less than \u20b9500000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Hostel Assistance covering Tuition Fee."
      }
    ]
  },
  {
    "id": "ind-mock-87",
    "name": "India Scholarship Scheme 87",
    "provider": "Education Foundation 12",
    "amount": 123164,
    "amountFormatted": "\u20b9123,164",
    "deadline": "2026-08-11",
    "eligibility": {
      "educationLevel": [
        "UG"
      ],
      "gender": "Female",
      "familyIncomeMax": 1000000,
      "states": [
        "Bihar"
      ],
      "castes": [
        "General",
        "OBC",
        "SC",
        "ST",
        "EWS"
      ],
      "fieldsOfStudy": [
        "Commerce"
      ]
    },
    "category": "Private",
    "description": "Mock Indian scholarship program focused on minority support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-87.in",
    "status": "Open",
    "coverage": "Tuition + Hostel",
    "selectionProcess": "Merit Based",
    "benefits": "Laptop Support",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 87?",
        "answer": "It is open to Female students studying UG courses. Family income should be less than \u20b91000000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Laptop Support covering Tuition + Hostel."
      }
    ]
  },
  {
    "id": "ind-mock-88",
    "name": "India Scholarship Scheme 88",
    "provider": "Education Foundation 3",
    "amount": 152275,
    "amountFormatted": "\u20b9152,275",
    "deadline": "2026-09-23",
    "eligibility": {
      "educationLevel": [
        "Diploma"
      ],
      "gender": "Female",
      "familyIncomeMax": 1000000,
      "states": [
        "Jharkhand"
      ],
      "castes": [
        "General"
      ],
      "fieldsOfStudy": [
        "Engineering"
      ]
    },
    "category": "Private",
    "description": "Mock Indian scholarship program focused on research support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-88.in",
    "status": "Open",
    "coverage": "Books and Tuition",
    "selectionProcess": "Entrance Test",
    "benefits": "Laptop Support",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 88?",
        "answer": "It is open to Female students studying Diploma courses. Family income should be less than \u20b91000000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Laptop Support covering Books and Tuition."
      }
    ]
  },
  {
    "id": "ind-mock-89",
    "name": "India Scholarship Scheme 89",
    "provider": "Education Foundation 4",
    "amount": 26899,
    "amountFormatted": "\u20b926,899",
    "deadline": "2026-07-12",
    "eligibility": {
      "educationLevel": [
        "PG"
      ],
      "gender": "Male",
      "familyIncomeMax": 800000,
      "states": [
        "Haryana"
      ],
      "castes": [
        "ST"
      ],
      "fieldsOfStudy": [
        "Science"
      ]
    },
    "category": "NGO",
    "description": "Mock Indian scholarship program focused on sc/st support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-89.in",
    "status": "Open",
    "coverage": "Tuition + Hostel",
    "selectionProcess": "Merit Based",
    "benefits": "Hostel Assistance",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 89?",
        "answer": "It is open to Male students studying PG courses. Family income should be less than \u20b9800000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Hostel Assistance covering Tuition + Hostel."
      }
    ]
  },
  {
    "id": "ind-mock-90",
    "name": "India Scholarship Scheme 90",
    "provider": "Education Foundation 15",
    "amount": 64941,
    "amountFormatted": "\u20b964,941",
    "deadline": "2026-08-18",
    "eligibility": {
      "educationLevel": [
        "UG"
      ],
      "gender": "All",
      "familyIncomeMax": 300000,
      "states": [
        "Kerala"
      ],
      "castes": [
        "General"
      ],
      "fieldsOfStudy": [
        "Law"
      ]
    },
    "category": "Private",
    "description": "Mock Indian scholarship program focused on technical education support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-90.in",
    "status": "Open",
    "coverage": "Tuition + Hostel",
    "selectionProcess": "Interview + Merit",
    "benefits": "Laptop Support",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 90?",
        "answer": "It is open to Any students studying UG courses. Family income should be less than \u20b9300000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Laptop Support covering Tuition + Hostel."
      }
    ]
  },
  {
    "id": "ind-mock-91",
    "name": "India Scholarship Scheme 91",
    "provider": "Education Foundation 8",
    "amount": 181450,
    "amountFormatted": "\u20b9181,450",
    "deadline": "2026-11-11",
    "eligibility": {
      "educationLevel": [
        "PG"
      ],
      "gender": "Male",
      "familyIncomeMax": 200000,
      "states": [
        "Karnataka"
      ],
      "castes": [
        "ST"
      ],
      "fieldsOfStudy": [
        "All"
      ]
    },
    "category": "Government",
    "description": "Mock Indian scholarship program focused on sc/st support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-91.in",
    "status": "Open",
    "coverage": "Books and Tuition",
    "selectionProcess": "Need + Merit",
    "benefits": "Laptop Support",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 91?",
        "answer": "It is open to Male students studying PG courses. Family income should be less than \u20b9200000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Laptop Support covering Books and Tuition."
      }
    ]
  },
  {
    "id": "ind-mock-92",
    "name": "India Scholarship Scheme 92",
    "provider": "Education Foundation 1",
    "amount": 150596,
    "amountFormatted": "\u20b9150,596",
    "deadline": "2026-10-10",
    "eligibility": {
      "educationLevel": [
        "PG"
      ],
      "gender": "Female",
      "familyIncomeMax": 500000,
      "states": [
        "Tamil Nadu"
      ],
      "castes": [
        "ST"
      ],
      "fieldsOfStudy": [
        "Science"
      ]
    },
    "category": "NGO",
    "description": "Mock Indian scholarship program focused on need-based support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-92.in",
    "status": "Open",
    "coverage": "Tuition Fee",
    "selectionProcess": "Entrance Test",
    "benefits": "Research Grant",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 92?",
        "answer": "It is open to Female students studying PhD courses. Family income should be less than \u20b9500000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Research Grant covering Tuition Fee."
      }
    ]
  },
  {
    "id": "ind-mock-93",
    "name": "India Scholarship Scheme 93",
    "provider": "Education Foundation 11",
    "amount": 15759,
    "amountFormatted": "\u20b915,759",
    "deadline": "2026-08-16",
    "eligibility": {
      "educationLevel": [
        "PG"
      ],
      "gender": "Female",
      "familyIncomeMax": 500000,
      "states": [
        "Chhattisgarh"
      ],
      "castes": [
        "OBC"
      ],
      "fieldsOfStudy": [
        "Law"
      ]
    },
    "category": "Government",
    "description": "Mock Indian scholarship program focused on sports support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-93.in",
    "status": "Open",
    "coverage": "Tuition + Hostel",
    "selectionProcess": "Entrance Test",
    "benefits": "Research Grant",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 93?",
        "answer": "It is open to Female students studying PhD courses. Family income should be less than \u20b9500000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Research Grant covering Tuition + Hostel."
      }
    ]
  },
  {
    "id": "ind-mock-94",
    "name": "India Scholarship Scheme 94",
    "provider": "Education Foundation 5",
    "amount": 197267,
    "amountFormatted": "\u20b9197,267",
    "deadline": "2026-07-18",
    "eligibility": {
      "educationLevel": [
        "PG"
      ],
      "gender": "Male",
      "familyIncomeMax": 1000000,
      "states": [
        "Jharkhand"
      ],
      "castes": [
        "General"
      ],
      "fieldsOfStudy": [
        "Medical"
      ]
    },
    "category": "Government",
    "description": "Mock Indian scholarship program focused on need-based support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-94.in",
    "status": "Open",
    "coverage": "Full Academic Support",
    "selectionProcess": "Entrance Test",
    "benefits": "Research Grant",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 94?",
        "answer": "It is open to Male students studying PhD courses. Family income should be less than \u20b91000000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Research Grant covering Full Academic Support."
      }
    ]
  },
  {
    "id": "ind-mock-95",
    "name": "India Scholarship Scheme 95",
    "provider": "Education Foundation 10",
    "amount": 69412,
    "amountFormatted": "\u20b969,412",
    "deadline": "2026-10-08",
    "eligibility": {
      "educationLevel": [
        "Class 6\u201310"
      ],
      "gender": "Female",
      "familyIncomeMax": 800000,
      "states": [
        "Punjab"
      ],
      "castes": [
        "General",
        "OBC",
        "SC",
        "ST",
        "EWS"
      ],
      "fieldsOfStudy": [
        "Law"
      ]
    },
    "category": "NGO",
    "description": "Mock Indian scholarship program focused on girls education support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-95.in",
    "status": "Open",
    "coverage": "Full Academic Support",
    "selectionProcess": "Need + Merit",
    "benefits": "Annual Stipend",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 95?",
        "answer": "It is open to Female students studying Class 10 courses. Family income should be less than \u20b9800000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Annual Stipend covering Full Academic Support."
      }
    ]
  },
  {
    "id": "ind-mock-96",
    "name": "India Scholarship Scheme 96",
    "provider": "Education Foundation 15",
    "amount": 121846,
    "amountFormatted": "\u20b9121,846",
    "deadline": "2026-11-26",
    "eligibility": {
      "educationLevel": [
        "Class 11\u201312"
      ],
      "gender": "Male",
      "familyIncomeMax": 500000,
      "states": [
        "Bihar"
      ],
      "castes": [
        "General"
      ],
      "fieldsOfStudy": [
        "Agriculture"
      ]
    },
    "category": "Private",
    "description": "Mock Indian scholarship program focused on minority support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-96.in",
    "status": "Open",
    "coverage": "Books and Tuition",
    "selectionProcess": "Entrance Test",
    "benefits": "Research Grant",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 96?",
        "answer": "It is open to Male students studying Class 12 courses. Family income should be less than \u20b9500000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Research Grant covering Books and Tuition."
      }
    ]
  },
  {
    "id": "ind-mock-97",
    "name": "India Scholarship Scheme 97",
    "provider": "Education Foundation 25",
    "amount": 135409,
    "amountFormatted": "\u20b9135,409",
    "deadline": "2026-08-21",
    "eligibility": {
      "educationLevel": [
        "PG"
      ],
      "gender": "Female",
      "familyIncomeMax": 200000,
      "states": [
        "Tamil Nadu"
      ],
      "castes": [
        "General",
        "OBC",
        "SC",
        "ST",
        "EWS"
      ],
      "fieldsOfStudy": [
        "Science"
      ]
    },
    "category": "NGO",
    "description": "Mock Indian scholarship program focused on sc/st support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-97.in",
    "status": "Open",
    "coverage": "Books and Tuition",
    "selectionProcess": "Entrance Test",
    "benefits": "Annual Stipend",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 97?",
        "answer": "It is open to Female students studying PhD courses. Family income should be less than \u20b9200000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Annual Stipend covering Books and Tuition."
      }
    ]
  },
  {
    "id": "ind-mock-98",
    "name": "India Scholarship Scheme 98",
    "provider": "Education Foundation 4",
    "amount": 21957,
    "amountFormatted": "\u20b921,957",
    "deadline": "2026-07-18",
    "eligibility": {
      "educationLevel": [
        "PG"
      ],
      "gender": "All",
      "familyIncomeMax": 200000,
      "states": [
        "Andhra Pradesh"
      ],
      "castes": [
        "EWS"
      ],
      "fieldsOfStudy": [
        "Agriculture"
      ]
    },
    "category": "NGO",
    "description": "Mock Indian scholarship program focused on need-based support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-98.in",
    "status": "Open",
    "coverage": "Tuition + Hostel",
    "selectionProcess": "Interview + Merit",
    "benefits": "Hostel Assistance",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 98?",
        "answer": "It is open to Any students studying PhD courses. Family income should be less than \u20b9200000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Hostel Assistance covering Tuition + Hostel."
      }
    ]
  },
  {
    "id": "ind-mock-99",
    "name": "India Scholarship Scheme 99",
    "provider": "Education Foundation 15",
    "amount": 108625,
    "amountFormatted": "\u20b9108,625",
    "deadline": "2026-12-16",
    "eligibility": {
      "educationLevel": [
        "UG"
      ],
      "gender": "Female",
      "familyIncomeMax": 200000,
      "states": [
        "Bihar"
      ],
      "castes": [
        "OBC"
      ],
      "fieldsOfStudy": [
        "Commerce"
      ]
    },
    "category": "Private",
    "description": "Mock Indian scholarship program focused on need-based support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-99.in",
    "status": "Open",
    "coverage": "Full Academic Support",
    "selectionProcess": "Entrance Test",
    "benefits": "Laptop Support",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 99?",
        "answer": "It is open to Female students studying UG courses. Family income should be less than \u20b9200000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Laptop Support covering Full Academic Support."
      }
    ]
  },
  {
    "id": "ind-mock-100",
    "name": "India Scholarship Scheme 100",
    "provider": "Education Foundation 18",
    "amount": 48163,
    "amountFormatted": "\u20b948,163",
    "deadline": "2026-11-23",
    "eligibility": {
      "educationLevel": [
        "PG"
      ],
      "gender": "All",
      "familyIncomeMax": 500000,
      "states": [
        "West Bengal"
      ],
      "castes": [
        "General"
      ],
      "fieldsOfStudy": [
        "Commerce"
      ]
    },
    "category": "Private",
    "description": "Mock Indian scholarship program focused on girls education support.",
    "documents": [
      "Aadhaar",
      "Income Certificate",
      "Marksheet",
      "Bank Passbook"
    ],
    "officialLink": "https://example-scholarship-100.in",
    "status": "Open",
    "coverage": "Full Academic Support",
    "selectionProcess": "Interview + Merit",
    "benefits": "Hostel Assistance",
    "faqs": [
      {
        "question": "What is the eligibility criteria for India Scholarship Scheme 100?",
        "answer": "It is open to Any students studying PG courses. Family income should be less than \u20b9500000/year."
      },
      {
        "question": "What benefits does this scholarship offer?",
        "answer": "Selected scholars will receive Hostel Assistance covering Full Academic Support."
      }
    ]
  },
  {
    "id": "sc-real-214bb5fba4bcfd3a",
    "name": "Scholarship Data 2024 25",
    "provider": "Corporate Trust / Partner",
    "amount": 50000,
    "amountFormatted": "Variable Support",
    "deadline": "2026-12-31",
    "eligibility": {
      "educationLevel": [
        "UG"
      ],
      "gender": "All",
      "familyIncomeMax": 0,
      "states": [
        "All"
      ],
      "castes": [
        "General",
        "OBC",
        "SC",
        "ST",
        "EWS"
      ],
      "fieldsOfStudy": [
        "All"
      ]
    },
    "category": "Private",
    "description": "Open Government Data Platform (OGD) India is a single-point of access to Resources in an open format published by Ministries/Departments/Organizations of GoI. Get details of Open Data Events, Visualizations, Blogs, and Infographics.",
    "documents": [
      "Aadhaar Card",
      "Income Certificate",
      "Marksheet",
      "College Fee Receipt"
    ],
    "officialLink": "https://www.data.gov.in/resource/scholarship-data-2024-25",
    "status": "Open",
    "coverage": "Direct Financial Award",
    "selectionProcess": "Varies by provider. Typically involves academic merit, document verification, and potential interview.",
    "benefits": "Financial support for education.",
    "faqs": [
      {
        "question": "Who can apply for the Scholarship Data 2024 25?",
        "answer": "Please check the official page link for detailed eligibility requirements."
      },
      {
        "question": "What documents are required for application?",
        "answer": "Aadhaar Card, Income Certificate, Marksheet, College Fee Receipt"
      }
    ]
  },
  {
    "id": "sc-real-cd5a03161aec6679",
    "name": "Scholarships Students Community Districts 2016 17 Shb 2018",
    "provider": "Corporate Trust / Partner",
    "amount": 50000,
    "amountFormatted": "Variable Support",
    "deadline": "2026-12-31",
    "eligibility": {
      "educationLevel": [
        "UG"
      ],
      "gender": "All",
      "familyIncomeMax": 0,
      "states": [
        "All"
      ],
      "castes": [
        "General",
        "OBC",
        "SC",
        "ST",
        "EWS"
      ],
      "fieldsOfStudy": [
        "All"
      ]
    },
    "category": "Private",
    "description": "Open Government Data Platform (OGD) India is a single-point of access to Resources in an open format published by Ministries/Departments/Organizations of GoI. Get details of Open Data Events, Visualizations, Blogs, and Infographics.",
    "documents": [
      "Aadhaar Card",
      "Income Certificate",
      "Marksheet",
      "College Fee Receipt"
    ],
    "officialLink": "https://www.data.gov.in/resource/scholarships-students-community-districts-2016-17-shb-2018",
    "status": "Open",
    "coverage": "Direct Financial Award",
    "selectionProcess": "Varies by provider. Typically involves academic merit, document verification, and potential interview.",
    "benefits": "Financial support for education.",
    "faqs": [
      {
        "question": "Who can apply for the Scholarships Students Community Districts 2016 17 Shb 2018?",
        "answer": "Please check the official page link for detailed eligibility requirements."
      },
      {
        "question": "What documents are required for application?",
        "answer": "Aadhaar Card, Income Certificate, Marksheet, College Fee Receipt"
      }
    ]
  },
  {
    "id": "sc-real-7693437905ab7cb2",
    "name": "Kind Circle Scholarship for Meritorious Students 2026-27",
    "provider": "Corporates, alumni, institutions, individuals",
    "amount": 60000,
    "amountFormatted": "Variable awards",
    "deadline": "2027-03-31",
    "eligibility": {
      "educationLevel": [
        "Class 6\u201310",
        "Class 11\u201312",
        "Diploma",
        "UG",
        "PG"
      ],
      "gender": "All",
      "familyIncomeMax": 600000,
      "states": [
        "All"
      ],
      "castes": [
        "ST",
        "SC"
      ],
      "fieldsOfStudy": [
        "All"
      ]
    },
    "category": "Private",
    "description": "Kind Circle Scholarship for Meritorious Students 2026-27 is an initiative to support academically meritorious students coming from under-privileged section of society to build a foundation for their bright future.",
    "documents": [
      "Aadhaar Card",
      "Income Certificate",
      "Marksheet",
      "College Fee Receipt"
    ],
    "officialLink": "https://www.buddy4study.com/page/kind-circle-scholarship-for-meritorious-students-2026-27",
    "status": "Open",
    "coverage": "Variable awards",
    "selectionProcess": "Varies by provider. Typically involves academic merit, document verification, and potential interview.",
    "benefits": "Variable awards",
    "faqs": [
      {
        "question": "Who can apply for the Kind Circle Scholarship for Meritorious Students 2026-27?",
        "answer": "Students from Class 1 to postgraduate level enrolled in any Indian school or college Annual family income below INR 6 lakh At least 60% marks in the previous academic year"
      },
      {
        "question": "What documents are required for application?",
        "answer": "Aadhaar Card, Income Certificate, Marksheet, College Fee Receipt"
      }
    ]
  },
  {
    "id": "sc-real-e1d91fc588318818",
    "name": "Intuit Rise Girl Child Empowerment Program 25-26 (NIT-IITs)",
    "provider": "Intuit India",
    "amount": 48620,
    "amountFormatted": "Scholarship up to INR 48,620",
    "deadline": "2026-03-26",
    "eligibility": {
      "educationLevel": [
        "UG"
      ],
      "gender": "Female",
      "familyIncomeMax": 350000,
      "states": [
        "All"
      ],
      "castes": [
        "ST",
        "SC",
        "General"
      ],
      "fieldsOfStudy": [
        "All"
      ]
    },
    "category": "Private",
    "description": "Intuit Rise Girl Child Education Program 2025-26 aims to empower underprivileged girl students from Class 8 to graduation through comprehensive educational support.",
    "documents": [
      "Aadhaar Card",
      "Income Certificate",
      "Marksheet",
      "College Fee Receipt"
    ],
    "officialLink": "https://www.buddy4study.com/page/intuit-rise-girl-child-empowerment-program-25-26-nit-iits",
    "status": "Closed",
    "coverage": "Scholarship up to INR 48,620",
    "selectionProcess": "Varies by provider. Typically involves academic merit, document verification, and potential interview.",
    "benefits": "Scholarship up to INR 48,620",
    "faqs": [
      {
        "question": "Who can apply for the Intuit Rise Girl Child Empowerment Program 25-26 (NIT-IITs)?",
        "answer": "Open to female students across India who are pursuing any year of graduation at IITs and NITs Applicants must have a minimum of 90% score in their previous academic year Family income must be below INR 3.5 lakh annually Children of employees at Intuit India and Buddy4Study are not eligible to apply"
      },
      {
        "question": "What documents are required for application?",
        "answer": "Aadhaar Card, Income Certificate, Marksheet, College Fee Receipt"
      }
    ]
  },
  {
    "id": "sc-real-6703a4772d20c092",
    "name": "Free Coaching for DNT Students under SEED Scheme",
    "provider": "Development and Welfare Board for the De-notified, Nomadic, and Semi-Nomadic Communities and Ministry of Social Justice and Empowerment, Government of India",
    "amount": 120000,
    "amountFormatted": "Coaching fees of up to \u20b9 120,000",
    "deadline": "2024-12-10",
    "eligibility": {
      "educationLevel": [
        "Class 11\u201312"
      ],
      "gender": "All",
      "familyIncomeMax": 250000,
      "states": [
        "All"
      ],
      "castes": [
        "ST",
        "SC",
        "General"
      ],
      "fieldsOfStudy": [
        "Engineering",
        "Medical",
        "Law"
      ]
    },
    "category": "Private",
    "description": "Free Coaching for DNT Students under SEED scheme aims to provide good-quality coaching to students belonging to De-notified Tribes (DNT), Nomadic Tribes (NT), and Semi-Nomadic Tribes (SNT).",
    "documents": [
      "Aadhaar Card",
      "Income Certificate",
      "Marksheet",
      "College Fee Receipt"
    ],
    "officialLink": "https://www.buddy4study.com/page/free-coaching-for-dnt-students-under-seed",
    "status": "Closed",
    "coverage": "Coaching fees of up to \u20b9 120,000",
    "selectionProcess": "Varies by provider. Typically involves academic merit, document verification, and potential interview.",
    "benefits": "Coaching fees of up to \u20b9 120,000",
    "faqs": [
      {
        "question": "Who can apply for the Free Coaching for DNT Students under SEED Scheme?",
        "answer": "Open for students belonging to De-notified, Nomadic, and Semi-Nomadic Tribes. Applicants must be willing to pursue coaching for competitive examinations such as: Engineering (e.g., JEE) Medical (e.g., NEET) Law (e.g., CLAT) NDA (National Defence Academy) Non-Commissioned Military Ranks CA-CPT (Common Proficiency Test) SSC (Staff Selection Commission) RRB (Railway Recruitment Board) Bank/Insurance Company Recruitments PSU (Public Sector Undertakings) Recruitments State Police (Non-Gazetted Ranks, including Havaldar and Home Guard) Central Police (Non-Gazetted Ranks, including Assam Rifles (AR), Border Security Force (BSF), Central Industrial Security Force (CISF), Central Reserve Police Force (CRPF), Indo-Tibetan Border Police (ITBP), National Security Guard (NSG), and Sahastra Seema Bal (SSB)) etc. The applicants should be either in Class 12th or have passed Class 12th. The applicants must meet the following minimum qualifying marks criteria: For Class 12th pass students: Must have secured minimum qualifying marks in Class 12 required for competitive exams (depending on the competitive exam for which the candidate wishes to appear) For students currently in Class 12: Must have secured a minimum of 50% marks in Class 10. Annual family income of the applicants must be less than or equal to \u20b92,50,000. Applicants should not be availing of similar benefits (waiver for coaching classes) from any other Central Government or State Government Scheme. NOTE: To read the details about this scheme in Hindi, click here ."
      },
      {
        "question": "What documents are required for application?",
        "answer": "Aadhaar Card, Income Certificate, Marksheet, College Fee Receipt"
      }
    ]
  },
  {
    "id": "sc-real-61b53d14c19a9571",
    "name": "Bharti Airtel Scholarship Program 2025-26",
    "provider": "Bharti Airtel Foundation",
    "amount": 100,
    "amountFormatted": "100% of annual fee (over course duration)",
    "deadline": "2026-03-31",
    "eligibility": {
      "educationLevel": [
        "UG"
      ],
      "gender": "Female",
      "familyIncomeMax": 850000,
      "states": [
        "All"
      ],
      "castes": [
        "ST",
        "SC"
      ],
      "fieldsOfStudy": [
        "Engineering",
        "Science"
      ]
    },
    "category": "Private",
    "description": "Bharti Airtel Scholarship Program 2025-26 offers scholarship covering 100% of annual fee (over course duration) to students enrolled in engineering UG courses and integrated programs in the top 50 NIRF Engineering institutes.",
    "documents": [
      "Aadhaar Card",
      "Income Certificate",
      "Marksheet",
      "College Fee Receipt"
    ],
    "officialLink": "https://www.buddy4study.com/page/bharti-airtel-scholarship",
    "status": "Closed",
    "coverage": "100% of annual fee (over course duration)",
    "selectionProcess": "Varies by provider. Typically involves academic merit, document verification, and potential interview.",
    "benefits": "100% of annual fee (over course duration)",
    "faqs": [
      {
        "question": "Who can apply for the Bharti Airtel Scholarship Program 2025-26?",
        "answer": "Confirmed admission or enrollment in the first year (academic year 2025-2026) of the undergraduate/5 year integrated courses in fields of Electronics & Communication, Telecom, Information Technology, Computer Sciences, Data Sciences, Aerospace and Emerging Technologies (AI, IoT, AR/VR, Machine Learning, Robotics) at the top 50 NIRF ranked Engineering universities/institutes. ( Basis the 2024 list available ). Must be a citizen and resident of India. Parents\u2019/guardians\u2019 annual income from all sources should not exceed INR 8.5 lakhs. Preference shall be given to students who are girls, persons with disabilities, have single /no parents and transgender. Applicants should not be recipients of any other scholarships/ grants for the same purposes as being supported by the Bharti Airtel Foundation."
      },
      {
        "question": "What documents are required for application?",
        "answer": "Aadhaar Card, Income Certificate, Marksheet, College Fee Receipt"
      }
    ]
  },
  {
    "id": "sc-real-19e08f98273c7c7f",
    "name": "DXC Progressing Minds Scholarship for Graduation Students in STEM 2025-26",
    "provider": "DXC Technology",
    "amount": 50000,
    "amountFormatted": "\u20b950,000 (Fixed Amount)",
    "deadline": "2025-09-30",
    "eligibility": {
      "educationLevel": [
        "UG"
      ],
      "gender": "Female",
      "familyIncomeMax": 400000,
      "states": [
        "All"
      ],
      "castes": [
        "ST",
        "SC"
      ],
      "fieldsOfStudy": [
        "Science"
      ]
    },
    "category": "Private",
    "description": "DXC Progressing Minds Scholarship for Graduation Students in STEM 2025-26 aims to support the educational expenses of students who belong to marginalized groups.",
    "documents": [
      "Aadhaar Card",
      "Income Certificate",
      "Marksheet",
      "College Fee Receipt"
    ],
    "officialLink": "https://www.buddy4study.com/page/dxc-progressing-minds-scholarship-for-graduation-students-in-stem-2025-26",
    "status": "Closed",
    "coverage": "\u20b950,000 (Fixed Amount)",
    "selectionProcess": "Varies by provider. Typically involves academic merit, document verification, and potential interview.",
    "benefits": "\u20b950,000 (Fixed Amount)",
    "faqs": [
      {
        "question": "Who can apply for the DXC Progressing Minds Scholarship for Graduation Students in STEM 2025-26?",
        "answer": "Women and transgender students pursuing graduation in any year of a STEM-related field are eligible. Applicants must have obtained a minimum of 60% marks in their previous class/semester. Applicants\u2019 annual family income must be less than or equal to INR 4,00,000. Students from PAN India are eligible to apply. Children of employees of DXC Technology and Buddy4Study are not eligible to apply. Students with disabilities will be given preference."
      },
      {
        "question": "What documents are required for application?",
        "answer": "Aadhaar Card, Income Certificate, Marksheet, College Fee Receipt"
      }
    ]
  },
  {
    "id": "sc-real-2b1970ac6a68dd42",
    "name": "SBI Platinum Jubilee Asha Scholarship for Medical Students 2025-26",
    "provider": "SBI Foundation",
    "amount": 50000,
    "amountFormatted": "Monetary award",
    "deadline": "2025-11-30",
    "eligibility": {
      "educationLevel": [
        "UG"
      ],
      "gender": "Female",
      "familyIncomeMax": 600000,
      "states": [
        "All"
      ],
      "castes": [
        "ST",
        "SC",
        "General"
      ],
      "fieldsOfStudy": [
        "Medical"
      ]
    },
    "category": "Private",
    "description": "SBIF Asha Scholarship Program 2025 is open to students from Class 6 to 12 and for those who are pursuing undergraduate and postgraduate courses from the top 100 NIRF universities/colleges and IITs or MBA/PGDM courses from IIMs.",
    "documents": [
      "Aadhaar Card",
      "Income Certificate",
      "Marksheet",
      "College Fee Receipt"
    ],
    "officialLink": "https://www.buddy4study.com/page/sbi-platinum-jubilee-asha-scholarship-for-medical-students",
    "status": "Closed",
    "coverage": "Monetary award",
    "selectionProcess": "Varies by provider. Typically involves academic merit, document verification, and potential interview.",
    "benefits": "Monetary award",
    "faqs": [
      {
        "question": "Who can apply for the SBI Platinum Jubilee Asha Scholarship for Medical Students 2025-26?",
        "answer": "Students from Pan India. Students pursuing medical degrees (any year) from a premier university/college in India, as listed in the Top 300 Institutes according to the latest NIRF rankings. Applicants must have secured 7 CGPA/75% marks or above in their previous academic year. The gross annual family income of the applicants must be up to INR 6,00,000. Note: There is a provision of 10% relaxation for students belonging to SC/ST (Percentage of marks \u2013 67.50%, CGPA \u2013 6.30). 50% of slots are reserved for females. 50% reserved for SC/ST (25% SC, 25% ST). Please upload your SBI Bank account passbook in the application form. If you do not have an SBI Bank account, kindly open one before proceeding with the application (having an SBI Bank account is mandatory for shortlisting)."
      },
      {
        "question": "What documents are required for application?",
        "answer": "Aadhaar Card, Income Certificate, Marksheet, College Fee Receipt"
      }
    ]
  },
  {
    "id": "sc-real-a2393b805886d514",
    "name": "SBI Platinum Jubilee Asha Scholarship for IIM Students 2025-26",
    "provider": "SBI FOUNDATION",
    "amount": 500000,
    "amountFormatted": "Up to INR 5,00,000 for one year",
    "deadline": "2025-11-30",
    "eligibility": {
      "educationLevel": [
        "PG"
      ],
      "gender": "Female",
      "familyIncomeMax": 600000,
      "states": [
        "All"
      ],
      "castes": [
        "ST",
        "SC",
        "General"
      ],
      "fieldsOfStudy": [
        "Management"
      ]
    },
    "category": "Private",
    "description": "SBIF Asha Scholarship Program 2025 is open to students from Class 6 to 12 and for those who are pursuing undergraduate and postgraduate courses from the top 100 NIRF universities/colleges and IITs or MBA/PGDM courses from IIMs.",
    "documents": [
      "Aadhaar Card",
      "Income Certificate",
      "Marksheet",
      "College Fee Receipt"
    ],
    "officialLink": "https://www.buddy4study.com/page/SBI-Platinum-Jubilee-Asha-Scholarship-for-iim-students",
    "status": "Closed",
    "coverage": "Up to INR 5,00,000 for one year",
    "selectionProcess": "Varies by provider. Typically involves academic merit, document verification, and potential interview.",
    "benefits": "Up to INR 5,00,000 for one year",
    "faqs": [
      {
        "question": "Who can apply for the SBI Platinum Jubilee Asha Scholarship for IIM Students 2025-26?",
        "answer": "Applicants should be Indian nationals. Applicants must be pursuing MBA/PGDM courses (any year) from an Indian Institute of Management (IIM) in India. Students must have secured 7 CGPA/75% marks or above in their previous academic year. The gross annual family income of the applicants must be up to INR 6,00,000. Note: There is a provision of 10% relaxation for students belonging to SC/ST (Percentage of marks \u2013 67.50%, CGPA \u2013 6.30). 50% of slots are reserved for females. 50% reserved for SC/ST (25% SC, 25% ST). Please upload your SBI Bank account passbook in the application form. If you do not have an SBI Bank account, kindly open one before proceeding with the application (having an SBI Bank account is mandatory for shortlisting)."
      },
      {
        "question": "What documents are required for application?",
        "answer": "Aadhaar Card, Income Certificate, Marksheet, College Fee Receipt"
      }
    ]
  },
  {
    "id": "sc-real-d59203780ab9e69e",
    "name": "SBI Platinum Jubilee Asha Scholarship for IIT Students 2025-26",
    "provider": "SBI Foundation",
    "amount": 200000,
    "amountFormatted": "Up to INR 2,00,000 for one year",
    "deadline": "2025-11-30",
    "eligibility": {
      "educationLevel": [
        "UG"
      ],
      "gender": "Female",
      "familyIncomeMax": 600000,
      "states": [
        "All"
      ],
      "castes": [
        "ST",
        "SC"
      ],
      "fieldsOfStudy": [
        "All"
      ]
    },
    "category": "Private",
    "description": "SBIF Asha Scholarship Program 2025 is open to students from Class 6 to 12 and for those who are pursuing undergraduate and postgraduate courses from the top 100 NIRF universities/colleges and IITs or MBA/PGDM courses from IIMs.",
    "documents": [
      "Aadhaar Card",
      "Income Certificate",
      "Marksheet",
      "College Fee Receipt"
    ],
    "officialLink": "https://www.buddy4study.com/page/sbi-platinum-jubilee-asha-scholarship-for-iit-students",
    "status": "Closed",
    "coverage": "Up to INR 2,00,000 for one year",
    "selectionProcess": "Varies by provider. Typically involves academic merit, document verification, and potential interview.",
    "benefits": "Up to INR 2,00,000 for one year",
    "faqs": [
      {
        "question": "Who can apply for the SBI Platinum Jubilee Asha Scholarship for IIT Students 2025-26?",
        "answer": "Applicants should be Indian nationals. Applicants must be pursuing an undergraduate course (any year) from an Indian Institute of Technology (IIT) in India. Students must have secured 7 CGPA/75% marks or above in their previous academic year. The gross annual family income of the applicants must be up to INR 6,00,000. Note: There is a provision of 10% relaxation for students belonging to SC/ST (Percentage of marks \u2013 67.50%, CGPA \u2013 6.30). 50% of slots are reserved for females. 50% reserved for SC/ST (25% SC, 25% ST)."
      },
      {
        "question": "What documents are required for application?",
        "answer": "Aadhaar Card, Income Certificate, Marksheet, College Fee Receipt"
      }
    ]
  },
  {
    "id": "sc-real-514d202476bfa293",
    "name": "Mahindra Saarthi Abhiyaan 2025-26",
    "provider": "Mahindra & Mahindra Ltd.- Commercial Vehicles",
    "amount": 10000,
    "amountFormatted": "INR 10,000",
    "deadline": "2026-03-02",
    "eligibility": {
      "educationLevel": [
        "Class 11\u201312",
        "Diploma",
        "UG",
        "PG"
      ],
      "gender": "Female",
      "familyIncomeMax": 0,
      "states": [
        "All"
      ],
      "castes": [
        "ST",
        "SC"
      ],
      "fieldsOfStudy": [
        "All"
      ]
    },
    "category": "Private",
    "description": "Mahindra Saarthi Abhiyaan Scholarship Program 2025-26 provides opportunity to win \u20b910,000 scholarship to girl children of truck drivers in Class 11/12, vocational courses, polytechnic, diploma, ITI, or UG/PG",
    "documents": [
      "Aadhaar Card",
      "Income Certificate",
      "Marksheet",
      "College Fee Receipt"
    ],
    "officialLink": "https://www.buddy4study.com/page/mahindra-saarthi-abhiyaan-2025-26",
    "status": "Closed",
    "coverage": "INR 10,000",
    "selectionProcess": "Varies by provider. Typically involves academic merit, document verification, and potential interview.",
    "benefits": "INR 10,000",
    "faqs": [
      {
        "question": "Who can apply for the Mahindra Saarthi Abhiyaan 2025-26?",
        "answer": "Girl students studying in Class 11, Class 12, vocational courses, polytechnic programs, diploma courses, or ITI , as well as those pursuing graduation or post-graduation (in any year) , are eligible to apply. Applicants must be the children/wards of truck drivers only Students from PAN India are eligible to apply for the scholarship program Children of employees of Mahindra & Mahindra Limited and Buddy4Study are ineligible. Note: Students awaiting their latest results can apply with marks from their previous year/semester."
      },
      {
        "question": "What documents are required for application?",
        "answer": "Aadhaar Card, Income Certificate, Marksheet, College Fee Receipt"
      }
    ]
  },
  {
    "id": "sc-real-85231033abc78f78",
    "name": "Tata AIA PARAS Scholarship Program 2025-26",
    "provider": "TATA AIA Life Insurance Company Limited",
    "amount": 15000,
    "amountFormatted": "INR 15,000",
    "deadline": "2025-12-31",
    "eligibility": {
      "educationLevel": [
        "UG"
      ],
      "gender": "Female",
      "familyIncomeMax": 500000,
      "states": [
        "All"
      ],
      "castes": [
        "ST",
        "SC",
        "General"
      ],
      "fieldsOfStudy": [
        "Management",
        "Science",
        "Commerce"
      ]
    },
    "category": "Private",
    "description": "Tata AIA PARAS Scholarship Program 2025-26 aims to support transgender students, persons with disabilities, females and students belonging to SC/ST communities enrolled in undergraduate courses.",
    "documents": [
      "Aadhaar Card",
      "Income Certificate",
      "Marksheet",
      "College Fee Receipt"
    ],
    "officialLink": "https://www.buddy4study.com/page/tata-aia-paras-scholarship-program-2025-26",
    "status": "Closed",
    "coverage": "INR 15,000",
    "selectionProcess": "Varies by provider. Typically involves academic merit, document verification, and potential interview.",
    "benefits": "INR 15,000",
    "faqs": [
      {
        "question": "Who can apply for the Tata AIA PARAS Scholarship Program 2025-26?",
        "answer": "Applicants must be enrolled in an undergraduate program in professional fields such as Commerce, Economics, Accounting & Finance, Banking, Insurance, Management, Data Science, Statistics, Risk Management, B.Com, B.Sc., BBA, BBI, BA, etc. Open to transgender students, persons with disabilities, females and students belonging to SC/ST communities . The family income of students (from all sources) should not be more than INR 5,00,000 per annum . Students from PAN India are eligible to apply for the scholarship program. Children of employees of Buddy4Study and Tata AIA are not eligible to participate."
      },
      {
        "question": "What documents are required for application?",
        "answer": "Aadhaar Card, Income Certificate, Marksheet, College Fee Receipt"
      }
    ]
  },
  {
    "id": "sc-real-762dcc2d9d6330e5",
    "name": "ZS Scholarship Program for Professional Undergraduate Courses 2025-26",
    "provider": "ZS Associate India Pvt. Ltd.",
    "amount": 50000,
    "amountFormatted": "INR 50,000 per year",
    "deadline": "2025-11-28",
    "eligibility": {
      "educationLevel": [
        "UG"
      ],
      "gender": "All",
      "familyIncomeMax": 0,
      "states": [
        "All"
      ],
      "castes": [
        "ST",
        "SC"
      ],
      "fieldsOfStudy": [
        "Engineering",
        "Medical",
        "Science",
        "Arts"
      ]
    },
    "category": "Private",
    "description": "ZScholars Program 2025-26 is an initiative of ZS Associate India Pvt. Ltd. to provide financial assistance to meritorious students from low-income families to help them pursue their higher education.",
    "documents": [
      "Aadhaar Card",
      "Income Certificate",
      "Marksheet",
      "College Fee Receipt"
    ],
    "officialLink": "https://www.buddy4study.com/page/zs-scholarship-program-for-general-undergraduate-courses-2025-26",
    "status": "Closed",
    "coverage": "INR 50,000 per year",
    "selectionProcess": "Varies by provider. Typically involves academic merit, document verification, and potential interview.",
    "benefits": "INR 50,000 per year",
    "faqs": [
      {
        "question": "Who can apply for the ZS Scholarship Program for Professional Undergraduate Courses 2025-26?",
        "answer": "Students domiciled across India in their first year of professional undergraduate courses at institutions located in Pune, New Delhi (NCR), or Bengaluru can apply. Eligible courses are B.Tech/B.E., B.Arch, B.A. LLB, LLB, MBBS, BDS, B.Sc. Nursing, B.Tech+M.Tech Integrated (5 Years). Applicants should have secured at least 60% marks in their Class 12 board examination. Applicants' annual family income from all sources must be less than INR 8 lakh. Children of employees of Buddy4Study and ZS Associates are not eligible to apply for the ZScholars Program 2025-26. Note - Students must be residing in Pune, New Delhi (NCR) or Bengaluru."
      },
      {
        "question": "What documents are required for application?",
        "answer": "Aadhaar Card, Income Certificate, Marksheet, College Fee Receipt"
      }
    ]
  },
  {
    "id": "sc-real-c18d5c8f9d73ac68",
    "name": "ZS Scholarship Program for General Undergraduate Courses 2025-26",
    "provider": "ZS Associate India Pvt. Ltd.",
    "amount": 20000,
    "amountFormatted": "INR 20,000 per year",
    "deadline": "2025-11-28",
    "eligibility": {
      "educationLevel": [
        "UG"
      ],
      "gender": "All",
      "familyIncomeMax": 0,
      "states": [
        "All"
      ],
      "castes": [
        "ST",
        "SC",
        "General"
      ],
      "fieldsOfStudy": [
        "Management",
        "Science",
        "Commerce",
        "Arts"
      ]
    },
    "category": "Private",
    "description": "ZScholars Program 2025-26 is an initiative of ZS Associate India Pvt. Ltd. to provide financial assistance to meritorious students from low-income families to help them pursue their higher education.",
    "documents": [
      "Aadhaar Card",
      "Income Certificate",
      "Marksheet",
      "College Fee Receipt"
    ],
    "officialLink": "https://www.buddy4study.com/page/zs-scholarship-program-2025-26",
    "status": "Closed",
    "coverage": "INR 20,000 per year",
    "selectionProcess": "Varies by provider. Typically involves academic merit, document verification, and potential interview.",
    "benefits": "INR 20,000 per year",
    "faqs": [
      {
        "question": "Who can apply for the ZS Scholarship Program for General Undergraduate Courses 2025-26?",
        "answer": "Students domiciled across India in their first year of general undergraduate courses at institutions located in Pune, New Delhi (NCR) or Bengaluru can apply. Eligible courses are B.Sc., B.Sc. (Statistics), BCA, BBA/BBM/BBS, B.Ed, B.Pharm, BMC, BSW, B.Sc. (IT), B.A., B.Com. Applicants should have secured at least 60% marks in their Class 12 board examination. Applicants annual family income from all sources must be less than INR 8 lakh. Children of employees of Buddy4Study and ZS Associates are not eligible to apply for the ZScholars Program 2025-26. Note - Students must be residing in Pune, New Delhi (NCR) or Bengaluru."
      },
      {
        "question": "What documents are required for application?",
        "answer": "Aadhaar Card, Income Certificate, Marksheet, College Fee Receipt"
      }
    ]
  }
];

export const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu & Kashmir",
  "Ladakh",
  "Puducherry",
  "Other Union Territories"
];
