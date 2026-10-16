import { Scholarship, StudentProfile } from "../types/scholarship";

export interface MatchResult {
  scholarship: Scholarship;
  isEligible: boolean;
  score: number; // 0-100 matching relevance score
  reasons: string[];
}

export function matchScholarship(
  scholarship: Scholarship,
  profile: StudentProfile
): MatchResult {
  const reasons: string[] = [];
  let score = 100;
  let isEligible = true;

  // 1. Education Level Check
  const elMatch = scholarship.eligibility.educationLevel.some((lvl) => {
    if (lvl === "All") return true;
    if (profile.educationLevel === "High School") {
      return ["Class 6–10", "Class 11–12", "Diploma", "High School"].includes(lvl);
    }
    return lvl === profile.educationLevel;
  });
  if (!elMatch) {
    isEligible = false;
    reasons.push(`Course level does not match (Scholarship is for: ${scholarship.eligibility.educationLevel.join(", ")})`);
  } else {
    reasons.push(`Matches your education level (${profile.educationLevel})`);
  }

  // 2. Gender Check
  if (scholarship.eligibility.gender !== "All") {
    if (scholarship.eligibility.gender !== profile.gender) {
      isEligible = false;
      reasons.push(`Restricted to ${scholarship.eligibility.gender} applicants`);
    } else {
      reasons.push(`Matches gender preference (${profile.gender})`);
    }
  }

  // 3. Family Income Check
  if (scholarship.eligibility.familyIncomeMax > 0) {
    if (profile.familyIncome > scholarship.eligibility.familyIncomeMax) {
      isEligible = false;
      reasons.push(
        `Income exceeds limit (Max: ₹${scholarship.eligibility.familyIncomeMax.toLocaleString()} vs Your: ₹${profile.familyIncome.toLocaleString()})`
      );
    } else {
      reasons.push(`Income lies within limit (Max: ₹${scholarship.eligibility.familyIncomeMax.toLocaleString()})`);
      // Lower income relative to max gets slightly higher priority score
      const incomeRatio = profile.familyIncome / scholarship.eligibility.familyIncomeMax;
      score += (1 - incomeRatio) * 10;
    }
  } else {
    reasons.push("No income limit restriction");
  }

  // 4. State Domicile Check
  const hasStateRestriction =
    scholarship.eligibility.states.length > 0 &&
    !scholarship.eligibility.states.includes("All");

  if (hasStateRestriction) {
    const stateMatch = scholarship.eligibility.states.includes(profile.state);
    if (!stateMatch) {
      isEligible = false;
      reasons.push(
        `Domicile restriction (Only for: ${scholarship.eligibility.states.join(", ")})`
      );
    } else {
      reasons.push(`Matches state domicile (${profile.state})`);
      score += 15;
    }
  } else {
    reasons.push("Available to students from all states/regions");
  }

  // 5. Caste Category Check
  const casteMatch = scholarship.eligibility.castes.includes(profile.caste);
  if (!casteMatch) {
    isEligible = false;
    reasons.push(
      `Caste category mismatch (Scholarship open to: ${scholarship.eligibility.castes.join(", ")})`
    );
  } else {
    reasons.push(`Matches caste eligibility category (${profile.caste})`);
  }

  // 6. Field of Study Check
  const hasFieldRestriction =
    scholarship.eligibility.fieldsOfStudy.length > 0 &&
    !scholarship.eligibility.fieldsOfStudy.includes("All");

  if (hasFieldRestriction) {
    const fieldMatch = scholarship.eligibility.fieldsOfStudy.some(
      (fld) => fld === "All" || fld === profile.fieldOfStudy
    );
    if (!fieldMatch) {
      isEligible = false;
      reasons.push(
        `Field of study mismatch (Scholarship is for: ${scholarship.eligibility.fieldsOfStudy.join(", ")})`
      );
    } else {
      reasons.push(`Matches field of study (${profile.fieldOfStudy})`);
      score += 10;
    }
  } else {
    reasons.push("Open to all fields of study");
  }

  // Calculate final score
  let finalScore = isEligible ? Math.min(Math.round(score), 100) : 0;

  // Add category specific boosts
  if (isEligible) {
    if (scholarship.category === profile.interestCategory) {
      finalScore = Math.min(finalScore + 5, 100);
    }
  }

  return {
    scholarship,
    isEligible,
    score: finalScore,
    reasons
  };
}

export function filterAndSearchScholarships(
  scholarships: Scholarship[],
  profile: StudentProfile | null,
  searchQuery: string,
  minAmount: number,
  categoryFilter: string,
  providerFilter: string,
  sortBy: string
): MatchResult[] {
  const results: MatchResult[] = [];

  scholarships.forEach((s) => {
    let result: MatchResult;
    if (profile) {
      result = matchScholarship(s, profile);
    } else {
      // Default match if no profile is submitted yet
      result = {
        scholarship: s,
        isEligible: true,
        score: 70, // neutral baseline score
        reasons: ["Complete your profile finder to see match details"]
      };
    }

    // Apply Search Query
    const query = searchQuery.toLowerCase().trim();
    if (query) {
      const matchesSearch =
        s.name.toLowerCase().includes(query) ||
        s.provider.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query);
      if (!matchesSearch) {
        result.isEligible = false;
      }
    }

    // Apply Min Amount Filter
    if (s.amount < minAmount) {
      result.isEligible = false;
    }

    // Apply Category Filter
    if (categoryFilter !== "All" && s.category !== categoryFilter) {
      result.isEligible = false;
    }

    // Apply Provider Filter
    if (providerFilter !== "All") {
      const isGovt = s.provider.toLowerCase().includes("government") || s.provider.toLowerCase().includes("ministry") || s.provider.toLowerCase().includes("state") || s.officialLink.includes(".gov.in");
      if (providerFilter === "Government" && !isGovt) {
        result.isEligible = false;
      } else if (providerFilter === "Private" && (isGovt || s.category !== "Private")) {
        result.isEligible = false;
      } else if (providerFilter === "NGO" && s.category !== "NGO") {
        result.isEligible = false;
      } else if (providerFilter === "International" && s.category !== "International") {
        result.isEligible = false;
      }
    }

    results.push(result);
  });

  // Filter out ineligible ones only if profile exists, otherwise just show all search/filter matches
  // Actually, let's keep all matching, but sort by eligibility or score.
  // We can show all matching results (where isEligible = true or matches filters).
  const filteredResults = results.filter((r) => r.isEligible);

  // Sorting
  if (sortBy === "Highest Amount") {
    filteredResults.sort((a, b) => b.scholarship.amount - a.scholarship.amount);
  } else if (sortBy === "Nearest Deadline") {
    filteredResults.sort(
      (a, b) =>
        new Date(a.scholarship.deadline).getTime() -
        new Date(b.scholarship.deadline).getTime()
    );
  } else if (sortBy === "Most Popular") {
    filteredResults.sort((a, b) => b.score - a.score);
  } else if (sortBy === "Newest") {
    // Just sort by ID descending or mock it
    filteredResults.sort((a, b) => b.scholarship.id.localeCompare(a.scholarship.id));
  }

  return filteredResults;
}
