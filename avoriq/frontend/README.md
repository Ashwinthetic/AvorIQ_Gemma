# AvorIQ Frontend (Next.js client)

This folder contains the Next.js App Router client application for the **AvorIQ (Adaptive Vision for Opportunity and Resources Intelligence Quotient)** platform. It implements Version 1: **Scholarship Intelligence Module**.

---

## 🎨 Visual Identity & Styling
- **Base Background**: Deep Navy (`#0B1120`)
- **Accent Theme**: Radiant Indigo Blue (`#2563EB`) and Purple (`#7C3AED`) text and background gradients
- **Design Token System**: Custom `@theme` settings declared inside [`app/globals.css`](file:///e:/AvorIQ-Lab/avoriq/frontend/app/globals.css)
- **Premium Components**: Powered by **React Bits**, featuring Animated Aurora backgrounds, mouse-tracking Spotlight Cards, and Glowing Star Borders.
- **Glassmorphism**: Backdrop blur filter with low-opacity borders (`glass-panel` & `glass-panel-hover`)
- **Animations**: Fluid spring entries, scaling buttons, and backdrop fades built using Framer Motion

> **Note**: For the full project roadmap, vision, and architectural details across all modules, please see the [Root README](../../README.md).

---

## 🛠 Directory Layout

```
frontend/
├── app/
│   ├── layout.tsx             # Root layout with fonts, layout structure, and SEO tags
│   ├── page.tsx               # Landing Page with Hero, Steps, Stats, and Demo Walkthrough
│   ├── scholarships/
│   │   └── page.tsx           # Match Finder main dashboard console
│   ├── saved/
│   │   └── page.tsx           # Bookmarked wishlist with interactive milestones
│   ├── coming-soon/
│   │   └── page.tsx           # Roadmap Grid showcasing V2 features + beta form
│   └── about/
│       └── page.tsx           # Company story, values, and vision
├── components/
│   ├── Navbar.tsx             # Responsive sticky navigation bar with hamburger menu
│   ├── Footer.tsx             # Semantic footer block with mock quick links
│   ├── ScholarshipCard.tsx    # Details card displaying amounts, badges, and match %
│   ├── ScholarshipDetailModal.tsx # Full criteria, FAQs, benefits list and apply simulator
│   ├── ScholarshipFinderForm.tsx # Student profiling inputs (income, caste, domicile)
│   ├── AiAssistant.tsx        # Simulated chat assistant widget with typing states
│   └── ComingSoonCard.tsx     # Reusable future module roadmap card
├── data/
│   └── scholarships.ts        # Database of 20 realistic Indian scholarships
├── hooks/
│   └── useLocalStorage.ts     # Saved bookmarks and student profile sync hook
├── lib/
│   └── utils.ts               # Conditional tailwind class merge utility
├── types/
│   └── scholarship.ts         # TypeScript definitions for Scholarship & StudentProfile
└── utils/
    └── matcher.ts             # Profile match calculator and sidebar filtering logic
```

---

## 💻 Tech Stack & Dependencies

- **Framework**: Next.js App Router (React 19, TypeScript)
- **Styling**: Tailwind CSS v4, PostCSS
- **Animations**: Framer Motion
- **UI Components**: React Bits (Aurora, SpotlightCard, GradientText, CountUp, etc.)
- **Icons**: Lucide Icons
- **Effects**: Canvas Confetti (triggers on match success, milestone progress disbursement, and waitlist registration)

---

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js (v18+) and npm installed.

### Installation
1. Install project dependencies:
   ```bash
   npm install
   ```
2. Start the local hot-reloaded development server:
   ```bash
   npm run dev
   ```
3. Compile a production-ready optimized build:
   ```bash
   npm run build
   ```
4. Start the production build server:
   ```bash
   npm run start
   ```

---

## ⚖ State Synchronization
All student profiling values submitted via the **Match Finder** and all bookmarked scholarships with their respective **Application Milestones** (Saved, Papers Vetted, Applied, Approved, Funds Sent) are saved directly in browser `localStorage`. Refreshing or navigating pages does not reset your matched results!
