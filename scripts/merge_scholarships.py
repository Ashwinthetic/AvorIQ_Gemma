import csv
import json
import re
import os

# Paths
MOCK_100_PATH = r"e:\AvorIQ-Lab\datasets\india_scholarships_mock_100.csv"
NORMALIZED_PATH = r"e:\AvorIQ-Lab\datasets\scholarships\normalized_scholarships.csv"
OUTPUT_TS_PATH = r"e:\AvorIQ-Lab\avoriq\frontend\data\scholarships.ts"

# 1. Existing 18 scholarships from data/scholarships.ts (we hardcode them so we don't lose their high-quality structure)
existing_scholarships = [
  {
    "id": "gov-nmms",
    "name": "National Means-cum-Merit Scholarship (NMMS)",
    "provider": "Ministry of Education, Government of India",
    "amount": 12000,
    "amountFormatted": "₹12,000/year",
    "deadline": "2026-10-31",
    "eligibility": {
      "educationLevel": ["Class 6–10", "Class 11–12"],
      "gender": "All",
      "familyIncomeMax": 350000,
      "states": ["All"],
      "castes": ["General", "OBC", "SC", "ST", "EWS"],
      "fieldsOfStudy": ["All"]
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
    "coverage": "Monthly Stipend of ₹1,00,000",
    "selectionProcess": "State-level NMMS Examination consisting of Mental Ability Test (MAT) and Scholastic Aptitude Test (SAT).",
    "benefits": "Provides ₹1,000 per month (totaling ₹12,000 per annum) from Class 9 to Class 12 in government or government-aided schools.",
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
    "amountFormatted": "₹20,000/year",
    "deadline": "2026-11-15",
    "eligibility": {
      "educationLevel": ["UG", "PG"],
      "gender": "All",
      "familyIncomeMax": 450000,
      "states": ["All"],
      "castes": ["General", "OBC", "SC", "ST", "EWS"],
      "fieldsOfStudy": ["Science", "Commerce", "Arts", "Engineering", "Medical", "Law", "Management"]
    },
    "category": "Government",
    "description": "To provide financial assistance to meritorious students from economically weaker sections to meet a part of their day-to-day expenses while pursuing higher studies.",
    "documents": [
      "Class 12 Marksheet showing >80th percentile",
      "Income Certificate (Family income below ₹4.5 Lakhs)",
      "Aadhaar Card",
      "College Admission/Fee Receipt",
      "Bank Passbook"
    ],
    "officialLink": "https://scholarships.gov.in",
    "status": "Open",
    "coverage": "Direct Benefit Transfer (DBT)",
    "selectionProcess": "Based on Board Exam results (above 80th percentile of successful candidates in Class 12).",
    "benefits": "₹12,000 per annum for the first three years of undergraduate study, and ₹20,000 per annum for post-graduate study or professional courses (4th/5th year).",
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
    "amountFormatted": "₹75,000/year",
    "deadline": "2026-09-30",
    "eligibility": {
      "educationLevel": ["Class 6–10", "Class 11–12", "Diploma", "UG", "PG"],
      "gender": "All",
      "familyIncomeMax": 600000,
      "states": ["All"],
      "castes": ["General", "OBC", "SC", "ST", "EWS"],
      "fieldsOfStudy": ["All", "Science", "Commerce", "Arts", "Engineering", "Medical", "Law", "Management"]
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
    "benefits": "Up to ₹35,000 for school students (Class 6-12) and up to ₹75,000 for undergraduate, postgraduate, or diploma programs.",
    "faqs": [
      {
        "question": "What is an 'Educational Crisis' in this context?",
        "answer": "It covers students facing financial issues due to sudden job loss, medical emergency, death of a breadwinner, or general financial distress."
      }
    ]
  },
  {
    "id": "pvt-loreal",
    "name": "L'Oréal India For Young Women in Science Scholarship",
    "provider": "L'Oréal India",
    "amount": 250000,
    "amountFormatted": "₹2,50,000/course",
    "deadline": "2026-10-15",
    "eligibility": {
      "educationLevel": ["UG"],
      "gender": "Female",
      "familyIncomeMax": 600000,
      "states": ["All"],
      "castes": ["General", "OBC", "SC", "ST", "EWS"],
      "fieldsOfStudy": ["Science", "Engineering", "Medical"]
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
    "selectionProcess": "Screening of application details, an essay submission, followed by a personal interview round with the L'Oréal jury.",
    "benefits": "Total scholarship of ₹2,50,000 distributed over the years of a science undergraduate course.",
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
    "amountFormatted": "₹50,000/year",
    "deadline": "2026-09-15",
    "eligibility": {
      "educationLevel": ["Class 11–12", "Diploma", "UG"],
      "gender": "All",
      "familyIncomeMax": 400000,
      "states": ["All"],
      "castes": ["General", "OBC", "SC", "ST", "EWS"],
      "fieldsOfStudy": ["All", "Science", "Commerce", "Arts", "Engineering", "Medical"]
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
    "benefits": "Scholarship support ranging from ₹10,000 to ₹50,000 depending on the level of course and tuition fees.",
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
    "amountFormatted": "₹50,000/year",
    "deadline": "2026-11-30",
    "eligibility": {
      "educationLevel": ["UG", "Diploma"],
      "gender": "Female",
      "familyIncomeMax": 800000,
      "states": ["All"],
      "castes": ["General", "OBC", "SC", "ST", "EWS"],
      "fieldsOfStudy": ["Engineering", "Others"]
    },
    "category": "Government",
    "description": "An AICTE scheme that encourages and supports girl students to pursue technical education. Maximum two girls per family can apply.",
    "documents": [
      "Class 10 & 12 Marksheets",
      "AICTE approval letter of the college",
      "Income Certificate (Family income below ₹8 Lakhs)",
      "Tuition Fee Receipt",
      "Aadhaar Card & Bank Details"
    ],
    "officialLink": "https://www.aicte-india.org",
    "status": "Open",
    "coverage": "₹50,000 per annum for tuition fees, computers, books, equipment, etc.",
    "selectionProcess": "Based on merit in the qualifying exam (JEE Mains / Class 12 board marks for degree admission).",
    "benefits": "₹50,000 per annum for every year of study (max 4 years for degree, 3 years for diploma). No separate document charges.",
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
    "amountFormatted": "₹35,000/year",
    "deadline": "2026-12-31",
    "eligibility": {
      "educationLevel": ["Class 11–12", "Diploma", "UG", "PG"],
      "gender": "All",
      "familyIncomeMax": 300000,
      "states": ["Madhya Pradesh"],
      "castes": ["OBC", "SC", "ST"],
      "fieldsOfStudy": ["All", "Science", "Commerce", "Arts", "Engineering", "Medical", "Law", "Management"]
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
    "amountFormatted": "₹1,00,000/year",
    "deadline": "2026-12-15",
    "eligibility": {
      "educationLevel": ["UG", "PG"],
      "gender": "All",
      "familyIncomeMax": 800000,
      "states": ["Maharashtra"],
      "castes": ["General", "OBC", "EWS"],
      "fieldsOfStudy": ["Science", "Commerce", "Arts", "Engineering", "Medical", "Law", "Management"]
    },
    "category": "Government",
    "description": "Commonly known as EBC scholarship in Maharashtra, this scheme offers 50% to 100% tuition fee reimbursement to students belonging to open/EWS category.",
    "documents": [
      "Maharashtra Domicile Certificate",
      "Family Income Certificate (below ₹8 Lakhs)",
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
    "amountFormatted": "₹30,000/year",
    "deadline": "2026-10-31",
    "eligibility": {
      "educationLevel": ["Class 11–12", "UG", "Diploma"],
      "gender": "All",
      "familyIncomeMax": 500000,
      "states": ["All"],
      "castes": ["General", "OBC", "SC", "ST", "EWS"],
      "fieldsOfStudy": ["All", "Science", "Commerce", "Arts", "Engineering", "Medical"]
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
    "benefits": "₹20,000/year for 2 years (Class 11-12) or ₹30,000/year for 3 years (UG General) or ₹50,000/year for professional courses.",
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
    "amountFormatted": "₹25,000/year",
    "deadline": "2026-08-30",
    "eligibility": {
      "educationLevel": ["UG", "PG"],
      "gender": "All",
      "familyIncomeMax": 300000,
      "states": ["All"],
      "castes": ["General", "OBC", "SC", "ST", "EWS"],
      "fieldsOfStudy": ["Science", "Commerce", "Arts", "Engineering", "Medical", "Management"]
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
    "benefits": "Provides an interest-free loan of up to ₹25,000/year which is repayable in easy installments after the student graduates and finds employment.",
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
    "amountFormatted": "₹20,000/year",
    "deadline": "2026-11-20",
    "eligibility": {
      "educationLevel": ["Diploma", "UG"],
      "gender": "All",
      "familyIncomeMax": 250000,
      "states": ["All"],
      "castes": ["General", "OBC", "SC", "ST", "EWS"],
      "fieldsOfStudy": ["Science", "Commerce", "Arts", "Engineering", "Medical", "Others"]
    },
    "category": "Private",
    "description": "LIC Golden Jubilee Foundation awards scholarships to meritorious students from economically weaker sections to pursue vocational/higher studies in government or private colleges.",
    "documents": [
      "Class 12 Marksheet (min 60% marks or equivalent)",
      "Income Certificate (below ₹2.5 Lakhs)",
      "Admission Receipt & College ID",
      "Caste Certificate (if applicable)"
    ],
    "officialLink": "https://www.licindia.in",
    "status": "Open",
    "coverage": "Direct disbursement to bank account in 10 monthly installments",
    "selectionProcess": "Shortlisting based on merit list and income rankings across divisions.",
    "benefits": "₹20,000 per annum for regular degree courses (paid as ₹2,000/month), and ₹10,000/year for special vocational courses.",
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
    "amountFormatted": "₹60,000/year",
    "deadline": "2026-10-10",
    "eligibility": {
      "educationLevel": ["Class 6–10", "Class 11–12", "UG"],
      "gender": "All",
      "familyIncomeMax": 600000,
      "states": ["All"],
      "castes": ["General", "OBC", "SC", "ST", "EWS"],
      "fieldsOfStudy": ["All", "Science", "Commerce", "Arts", "Engineering", "Medical", "Law", "Management"]
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
    "benefits": "School students (Class 6-12) receive up to ₹24,000, and college students receive up to ₹60,000 to cover college fees.",
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
    "amountFormatted": "₹48,000/year",
    "deadline": "2026-10-30",
    "eligibility": {
      "educationLevel": ["UG", "PG"],
      "gender": "All",
      "familyIncomeMax": 450000,
      "states": ["All"],
      "castes": ["SC", "ST"],
      "fieldsOfStudy": ["Engineering", "Medical", "Management"]
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
    "coverage": "₹4,000 per month maintenance allowance",
    "selectionProcess": "Purely merit-based within the SC/ST zone across different zones of ONGC.",
    "benefits": "Provides a monthly stipend of ₹4,000 (totaling ₹48,000 per year) to cover professional education expenses.",
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
    "amountFormatted": "₹1,50,000/year",
    "deadline": "2026-09-15",
    "eligibility": {
      "educationLevel": ["UG"],
      "gender": "Female",
      "familyIncomeMax": 600000,
      "states": ["All"],
      "castes": ["General", "OBC", "SC", "ST", "EWS"],
      "fieldsOfStudy": ["Engineering", "Medical", "Law", "Management"]
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
    "benefits": "Financial assistance of ₹1,50,000 per year for the entire duration of the professional UG course (B.Tech, MBBS, LL.B., etc.).",
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
    "amountFormatted": "₹2,00,000/course",
    "deadline": "2026-10-15",
    "eligibility": {
      "educationLevel": ["UG"],
      "gender": "All",
      "familyIncomeMax": 1500000,
      "states": ["All"],
      "castes": ["General", "OBC", "SC", "ST", "EWS"],
      "fieldsOfStudy": ["All", "Science", "Commerce", "Arts", "Engineering", "Medical", "Law", "Management"]
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
    "benefits": "Up to ₹2,00,000 for the duration of the degree, along with access to a vibrant alumni network and workshops.",
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
    "amountFormatted": "₹36,000/year",
    "deadline": "2026-08-15",
    "eligibility": {
      "educationLevel": ["Class 6–10", "Class 11–12", "UG"],
      "gender": "All",
      "familyIncomeMax": 300000,
      "states": ["All"],
      "castes": ["General", "OBC", "SC", "ST", "EWS"],
      "fieldsOfStudy": ["All"]
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
    "benefits": "₹3,000/month stipend to ensure students stay in school and do not engage in child labor.",
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
    "amountFormatted": "₹15,00,000+/year",
    "deadline": "2026-09-08",
    "eligibility": {
      "educationLevel": ["PG"],
      "gender": "All",
      "familyIncomeMax": 0,
      "states": ["All"],
      "castes": ["General", "OBC", "SC", "ST", "EWS"],
      "fieldsOfStudy": ["Science", "Engineering", "Medical", "Law", "Management", "Others"]
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
    "benefits": "Provides complete funding for 1-year Master's or 3-year PhD programs in the UK, including return airfare and living allowances (~£1,300/month).",
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
    "amountFormatted": "₹1,25,000/year",
    "deadline": "2026-10-15",
    "eligibility": {
      "educationLevel": ["Class 11–12", "UG"],
      "gender": "All",
      "familyIncomeMax": 250000,
      "states": ["All"],
      "castes": ["OBC", "EWS"],
      "fieldsOfStudy": ["All", "Science", "Commerce", "Arts", "Engineering", "Medical"]
    },
    "category": "Government",
    "description": "A high-prestige scholarship scheme for OBC, EBC, and DNT students studying in Top Class Schools and Colleges identified by the Ministry.",
    "documents": [
      "OBC/EBC Certificate",
      "Income Certificate (below ₹2.5 Lakhs)",
      "Class 10 Marksheet",
      "Aadhaar Card linked to Bank Account"
    ],
    "officialLink": "https://yet.nta.ac.in",
    "status": "Open",
    "coverage": "School fees, Hostel fees, and learning materials",
    "selectionProcess": "Through YASASVI Entrance Test (YET) conducted by the National Testing Agency (NTA).",
    "benefits": "Up to ₹75,000 per year for school education (Class 9 to 12) and up to ₹1,25,000 per year for higher education/UG in designated top colleges.",
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
    "amountFormatted": "₹1,00,000/year",
    "deadline": "2026-11-10",
    "eligibility": {
      "educationLevel": ["UG", "PG"],
      "gender": "All",
      "familyIncomeMax": 500000,
      "states": ["All"],
      "castes": ["General", "OBC", "SC", "ST", "EWS"],
      "fieldsOfStudy": ["Medical"]
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
    "benefits": "Direct financial assistance based on course fees, up to ₹1,00,000 per annum for tuition support.",
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
    "amountFormatted": "₹1,24,000/year",
    "deadline": "2026-11-30",
    "eligibility": {
      "educationLevel": ["PG"],
      "gender": "All",
      "familyIncomeMax": 0,
      "states": ["All"],
      "castes": ["General", "OBC", "SC", "ST", "EWS"],
      "fieldsOfStudy": ["Engineering"]
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
    "coverage": "Monthly stipend of ₹12,400",
    "selectionProcess": "Direct approval upon verifying valid GATE score card and college enrollment status in approved PG program.",
    "benefits": "Stipend of ₹12,400 per month for a maximum of 24 months or till the completion of the course, whichever is earlier.",
    "faqs": [
      {
        "question": "Do I get scholarship during summer vacation?",
        "answer": "Yes, the scholarship is paid monthly for the full 2 years, including vacation periods, subject to satisfactory progress."
      }
    ]
  }
]

# Helper mapping functions for Mock 100
def map_mock_education(lvl):
    lvl = lvl.strip()
    if lvl == "Class 10":
        return ["Class 6–10"]
    elif lvl == "Class 12":
        return ["Class 11–12"]
    elif lvl == "Diploma":
        return ["Diploma"]
    elif lvl == "UG":
        return ["UG"]
    elif lvl == "PG":
        return ["PG"]
    elif lvl == "PhD":
        return ["PG"]
    return ["UG"]

def map_mock_caste(caste):
    caste = caste.strip()
    if caste in ["All", "Any"]:
        return ["General", "OBC", "SC", "ST", "EWS"]
    elif caste == "Minority":
        return ["General", "OBC", "SC", "ST", "EWS"] # we keep all castes, but filter details handle minority
    elif caste in ["General", "OBC", "SC", "ST", "EWS"]:
        return [caste]
    return ["General", "OBC", "SC", "ST", "EWS"]

# Helper mapping functions for Normalized
def parse_normalized_amount(amt_str):
    if not amt_str:
        return 50000
    cleaned = re.sub(r"[^\d]", "", amt_str)
    if cleaned:
        try:
            return int(cleaned)
        except:
            pass
    # fallback values for common text terms
    lower_amt = amt_str.lower()
    if "variable" in lower_amt:
        return 60000
    if "monetary" in lower_amt:
        return 50000
    if "100%" in lower_amt or "full" in lower_amt:
        return 120000
    return 50000

def parse_normalized_education(edu_str):
    lower_edu = edu_str.lower()
    levels = []
    if "class 1 to pg" in lower_edu or "class 6 to pg" in lower_edu:
        return ["Class 6–10", "Class 11–12", "Diploma", "UG", "PG"]
    if "class 11 and above" in lower_edu:
        return ["Class 11–12", "Diploma", "UG", "PG"]
    if "class 8 to graduation" in lower_edu:
        return ["Class 6–10", "Class 11–12", "Diploma", "UG"]
    if "class 11" in lower_edu:
        levels.append("Class 11–12")
    if "class 12" in lower_edu:
        if "Class 11–12" not in levels:
            levels.append("Class 11–12")
    if "diploma" in lower_edu or "polytechnic" in lower_edu:
        levels.append("Diploma")
    if "graduation" in lower_edu or "ug" in lower_edu or "undergraduate" in lower_edu or "iit" in lower_edu or "nit" in lower_edu or "b.tech" in lower_edu or "mbbs" in lower_edu:
        levels.append("UG")
    if "post-graduation" in lower_edu or "pg" in lower_edu or "postgraduate" in lower_edu or "iim" in lower_edu or "mba" in lower_edu:
        levels.append("PG")
    if not levels:
        levels.append("UG")
    return levels

def parse_normalized_income(elig_str):
    lower_elig = elig_str.lower()
    # Search for income limits
    match = re.search(r"(?:below|up to|equal to|more than|exceed)\s*(?:inr|rs\.?|₹)?\s*([\d,.]+)\s*(?:lakh|lakhs)?", lower_elig)
    if match:
        val_str = match.group(1).replace(",", "")
        try:
            val = float(val_str)
            # If it's single digit like 6 or 3.5, it represents Lakhs
            if val < 50:
                return int(val * 100000)
            return int(val)
        except:
            pass
    if "income below" in lower_elig or "income must be below" in lower_elig:
        # check specific terms
        if "3.5 lakh" in lower_elig:
            return 350000
        if "6 lakh" in lower_elig or "6,00,000" in lower_elig:
            return 600000
        if "4,00,000" in lower_elig or "4 lakh" in lower_elig:
            return 400000
        if "8.5 lakh" in lower_elig:
            return 850000
        if "8 lakh" in lower_elig or "8,00,000" in lower_elig:
            return 800000
        if "2.5 lakh" in lower_elig or "2,50,000" in lower_elig:
            return 250000
        if "5,00,000" in lower_elig or "5 lakh" in lower_elig:
            return 500000
    return 0

def parse_normalized_gender(elig_str):
    lower_elig = elig_str.lower()
    if "female" in lower_elig or "girl" in lower_elig or "women" in lower_elig:
        return "Female"
    return "All"

def parse_normalized_castes(elig_str):
    lower_elig = elig_str.lower()
    castes = []
    if "sc/st" in lower_elig or "sc" in lower_elig or "st" in lower_elig:
        castes.extend(["SC", "ST"])
    if "obc" in lower_elig:
        castes.append("OBC")
    if "ews" in lower_elig:
        castes.append("EWS")
    if not castes:
        return ["General", "OBC", "SC", "ST", "EWS"]
    # If castes are found, add General/EWS depending on context, or just return the list
    if "general" in lower_elig or "open" in lower_elig:
        castes.append("General")
    return list(set(castes))

def parse_normalized_fields(elig_str):
    lower_elig = elig_str.lower()
    fields = []
    if "engineering" in lower_elig or "b.tech" in lower_elig or "b.e." in lower_elig or "electronics" in lower_elig or "telecom" in lower_elig or "computer sciences" in lower_elig:
        fields.append("Engineering")
    if "medical" in lower_elig or "mbbs" in lower_elig or "bds" in lower_elig or "nursing" in lower_elig:
        fields.append("Medical")
    if "management" in lower_elig or "mba" in lower_elig or "pgdm" in lower_elig or "bba" in lower_elig:
        fields.append("Management")
    if "law" in lower_elig or "ll.b" in lower_elig or "l.l.b" in lower_elig:
        fields.append("Law")
    if "science" in lower_elig or "b.sc" in lower_elig or "stem" in lower_elig:
        fields.append("Science")
    if "commerce" in lower_elig or "b.com" in lower_elig or "accounting" in lower_elig or "finance" in lower_elig:
        fields.append("Commerce")
    if "arts" in lower_elig or "b.a." in lower_elig:
        fields.append("Arts")
    
    if not fields:
        return ["All"]
    return fields

# Process Mock 100
mock_100_list = []
with open(MOCK_100_PATH, mode='r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        prov_id_match = re.search(r"\d+", row["provider"])
        prov_id = int(prov_id_match.group(0)) if prov_id_match else 1
        
        # Category assignment (Government vs Private vs NGO)
        # 100 mock scholarships: map them to various categories
        if prov_id % 3 == 0:
            category = "Private"
        elif prov_id % 3 == 1:
            category = "NGO"
        else:
            category = "Government"
            
        amt = int(row["amount"]) if row["amount"].isdigit() else 25000
        
        edu_list = map_mock_education(row["educationLevel"])
        caste_list = map_mock_caste(row["castes"])
        
        state_val = row["states"].strip()
        states_list = ["All"] if state_val in ["All", "Any"] else [state_val]
        
        field_val = row["fieldsOfStudy"].strip()
        fields_list = ["All"] if field_val in ["All", "Any"] else [field_val]
        
        docs_list = [d.strip() for d in row["documents"].split(";")] if row["documents"] else []
        
        sc_id = f"ind-mock-{row['id']}"
        
        # Create mock FAQs
        faqs = [
            {
                "question": f"What is the eligibility criteria for {row['name']}?",
                "answer": f"It is open to {row['gender']} students studying {row['educationLevel']} courses. Family income should be less than ₹{row['familyIncomeMax']}/year."
            },
            {
                "question": f"What benefits does this scholarship offer?",
                "answer": f"Selected scholars will receive {row['benefits']} covering {row['coverage']}."
            }
        ]
        
        item = {
            "id": sc_id,
            "name": row["name"],
            "provider": row["provider"],
            "amount": amt,
            "amountFormatted": row["amountFormatted"],
            "deadline": row["deadline"],
            "eligibility": {
                "educationLevel": edu_list,
                "gender": "All" if row["gender"] == "Any" else row["gender"],
                "familyIncomeMax": int(row["familyIncomeMax"]),
                "states": states_list,
                "castes": caste_list,
                "fieldsOfStudy": fields_list
            },
            "category": category,
            "description": row["description"],
            "documents": docs_list,
            "officialLink": row["officialLink"],
            "status": "Open",
            "coverage": row["coverage"],
            "selectionProcess": row["selectionProcess"],
            "benefits": row["benefits"],
            "faqs": faqs
        }
        mock_100_list.append(item)

# Process Normalized Scholarships
normalized_list = []
with open(NORMALIZED_PATH, mode='r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        # Ignore metadata-only records that don't have enough fields
        if not row["title"] or "open government data" in row["title"].lower():
            continue
            
        category = row["category"] if row["category"] in ["Government", "Private", "NGO", "International"] else "Private"
        amt = parse_normalized_amount(row["amount"])
        edu_list = parse_normalized_education(row["education_level"])
        inc_max = parse_normalized_income(row["eligibility"])
        gender_val = parse_normalized_gender(row["eligibility"])
        caste_list = parse_normalized_castes(row["eligibility"])
        fields_list = parse_normalized_fields(row["eligibility"])
        
        # State mapping
        state_str = row["location"].strip()
        states_list = ["All"]
        if state_str and state_str != "India" and state_str != "PAN India" and state_str != "Pan India":
            states_list = [state_str]
        
        docs_list = [d.strip() for d in row["documents"].split(";")] if row["documents"] else [
            "Aadhaar Card", "Income Certificate", "Marksheet", "College Fee Receipt"
        ]
        
        # Check deadline date vs today
        status = "Open"
        dl = row["deadline"].strip()
        if dl:
            # check if closed
            if dl < "2026-06-01":
                status = "Closed"
            elif dl < "2026-07-01":
                status = "Ending Soon"
        
        faqs = [
            {
                "question": f"Who can apply for the {row['title']}?",
                "answer": row["eligibility"] if row["eligibility"] else "Please check the official page link for detailed eligibility requirements."
            },
            {
                "question": "What documents are required for application?",
                "answer": ", ".join(docs_list)
            }
        ]
        
        item = {
            "id": f"sc-real-{row['id']}",
            "name": row["title"],
            "provider": row["provider"] if row["provider"] else "Corporate Trust / Partner",
            "amount": amt,
            "amountFormatted": row["amount"] if row["amount"] else "Variable Support",
            "deadline": row["deadline"] if row["deadline"] else "2026-12-31",
            "eligibility": {
                "educationLevel": edu_list,
                "gender": gender_val,
                "familyIncomeMax": inc_max,
                "states": states_list,
                "castes": caste_list,
                "fieldsOfStudy": fields_list
            },
            "category": category,
            "description": row["description"] if row["description"] else row["title"],
            "documents": docs_list,
            "officialLink": row["source_url"] if row["source_url"] else (row["application_url"] if row["application_url"] else "https://www.buddy4study.com"),
            "status": status,
            "coverage": row["benefits"] if row["benefits"] else "Direct Financial Award",
            "selectionProcess": "Varies by provider. Typically involves academic merit, document verification, and potential interview.",
            "benefits": row["benefits"] if row["benefits"] else "Financial support for education.",
            "faqs": faqs
        }
        normalized_list.append(item)

# Combine all
combined = existing_scholarships + mock_100_list + normalized_list
print(f"Total Scholarships: {len(combined)} (Existing: {len(existing_scholarships)}, Mock 100: {len(mock_100_list)}, Real Normalized: {len(normalized_list)})")

# Write out TS file
states_array = [
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
]

ts_content = f"""import {{ Scholarship }} from "../types/scholarship";

export const mockScholarships: Scholarship[] = {json.dumps(combined, indent=2)};

export const indianStates = {json.dumps(states_array, indent=2)};
"""

with open(OUTPUT_TS_PATH, "w", encoding="utf-8") as f:
    f.write(ts_content)

print("Successfully wrote combined scholarships data to avoriq/frontend/data/scholarships.ts!")

# Also write to backend/app/scholarships.json
BACKEND_JSON_PATH = r"e:\AvorIQ-Lab\avoriq\backend\app\scholarships.json"
with open(BACKEND_JSON_PATH, "w", encoding="utf-8") as f:
    json.dump(combined, f, indent=2, ensure_ascii=False)

print("Successfully wrote combined scholarships data to avoriq/backend/app/scholarships.json!")
