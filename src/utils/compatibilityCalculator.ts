
import { CountryData } from "@/types/country";

export interface CategoryScore {
  name: string;
  score: number;
  description: string;
  implications: string[];
}

export const calculateLegalStatusScore = (country1: CountryData, country2: CountryData): CategoryScore => {
  let score = 0;
  const implications: string[] = [];

  // Check dual citizenship compatibility
  if (country1.dualCitizenship === "Yes" && country2.dualCitizenship === "Yes") {
    score += 100;
    implications.push(`Both ${country1.countryId} and ${country2.countryId} allow dual citizenship`);
  } else if (country1.dualCitizenship === "Conditional" || country2.dualCitizenship === "Conditional") {
    score += 50;
    implications.push(`One or both countries allow dual citizenship conditionally`);
    
    if (country1.dualCitizenship === "Conditional") {
      implications.push(`${country1.countryId} allows dual citizenship under certain conditions`);
    }
    if (country2.dualCitizenship === "Conditional") {
      implications.push(`${country2.countryId} allows dual citizenship under certain conditions`);
    }
  } else {
    implications.push(`One or both countries do not allow dual citizenship`);
    if (country1.dualCitizenship === "No") {
      implications.push(`${country1.countryId} does not allow dual citizenship`);
    }
    if (country2.dualCitizenship === "No") {
      implications.push(`${country2.countryId} does not allow dual citizenship`);
    }
  }

  // Add citizenship by descent info
  if (country1.citizenshipByDescent === "Yes") {
    implications.push(`${country1.countryId} grants citizenship by descent`);
  }
  if (country2.citizenshipByDescent === "Yes") {
    implications.push(`${country2.countryId} grants citizenship by descent`);
  }

  // Add citizenship by marriage info
  implications.push(`${country1.countryId} requires ${country1.citizenshipByMarriage} of marriage for citizenship`);
  implications.push(`${country2.countryId} requires ${country2.citizenshipByMarriage} of marriage for citizenship`);

  return {
    name: "Legal Status",
    score,
    description: "Compatibility of dual citizenship laws between the two countries",
    implications
  };
};

export const calculateResidencyScore = (country1: CountryData, country2: CountryData): CategoryScore => {
  let score = 0;
  const implications: string[] = [];

  // Calculate score based on residency years required
  const maxResidencyYears = Math.max(country1.residencyYears, country2.residencyYears);
  if (maxResidencyYears <= 3) {
    score = 100;
  } else if (maxResidencyYears <= 5) {
    score = 80;
  } else if (maxResidencyYears <= 8) {
    score = 60;
  } else if (maxResidencyYears <= 10) {
    score = 40;
  } else {
    score = 20;
  }

  implications.push(`${country1.countryId} requires ${country1.residencyYears} years of residence for naturalization`);
  implications.push(`${country2.countryId} requires ${country2.residencyYears} years of residence for naturalization`);
  
  implications.push(country1.residencyCriteriaBlurb);
  implications.push(country2.residencyCriteriaBlurb);

  return {
    name: "Residency",
    score,
    description: "Residency requirements for naturalization",
    implications
  };
};

export const calculateMilitaryServiceScore = (country1: CountryData, country2: CountryData): CategoryScore => {
  let score = 0;
  const implications: string[] = [];

  // If both countries don't require military service
  if (country1.militaryService === "No" && country2.militaryService === "No") {
    score = 100;
    implications.push("Neither country requires mandatory military service");
  } 
  // If one country requires and the other doesn't
  else if (country1.militaryService === "No" || country2.militaryService === "No") {
    score = 60;
    if (country1.militaryService === "No") {
      implications.push(`${country1.countryId} does not require mandatory military service`);
      
      if (country2.militaryService === "Yes") {
        implications.push(`${country2.countryId} requires mandatory military service`);
      } else if (country2.militaryService === "De jure") {
        implications.push(`${country2.countryId} has military service laws but they are not strictly enforced`);
      } else if (country2.militaryService === "Infrequent") {
        implications.push(`${country2.countryId} has infrequent or selective military service requirements`);
      } else if (country2.militaryService === "Choice") {
        implications.push(`${country2.countryId} offers a choice of service options`);
      }
    } else {
      implications.push(`${country2.countryId} does not require mandatory military service`);
      
      if (country1.militaryService === "Yes") {
        implications.push(`${country1.countryId} requires mandatory military service`);
      } else if (country1.militaryService === "De jure") {
        implications.push(`${country1.countryId} has military service laws but they are not strictly enforced`);
      } else if (country1.militaryService === "Infrequent") {
        implications.push(`${country1.countryId} has infrequent or selective military service requirements`);
      } else if (country1.militaryService === "Choice") {
        implications.push(`${country1.countryId} offers a choice of service options`);
      }
    }
  } 
  // If both countries require some form of service
  else {
    score = 30;
    implications.push("Both countries have some form of military service requirement");
    
    implications.push(`${country1.countryId} military service: ${formatMilitaryService(country1.militaryService)}`);
    implications.push(`${country2.countryId} military service: ${formatMilitaryService(country2.militaryService)}`);
  }

  return {
    name: "Military Service",
    score,
    description: "Military service obligations in both countries",
    implications
  };
};

export const calculateTaxObligationsScore = (country1: CountryData, country2: CountryData): CategoryScore => {
  let score = 0;
  const implications: string[] = [];

  // Check tax treaty
  const hasUsa = country1.countryId === "US" || country2.countryId === "US";
  
  if (hasUsa) {
    const nonUsaCountry = country1.countryId === "US" ? country2 : country1;
    
    if (nonUsaCountry.taxTreaty === "Yes") {
      score += 40;
      implications.push(`${nonUsaCountry.countryId} has a tax treaty with the USA`);
    } else {
      implications.push(`${nonUsaCountry.countryId} does not have a tax treaty with the USA`);
    }
  } else if (country1.taxTreaty === "Yes" && country2.taxTreaty === "Yes") {
    score += 30;
    implications.push("Both countries likely have tax treaties with many nations");
  } else {
    implications.push("Limited tax treaty coverage may increase your tax burden");
  }

  // Check taxation type
  if (country1.taxationType === "No personal income tax" || country2.taxationType === "No personal income tax") {
    score += 30;
    if (country1.taxationType === "No personal income tax") {
      implications.push(`${country1.countryId} has no personal income tax`);
    }
    if (country2.taxationType === "No personal income tax") {
      implications.push(`${country2.countryId} has no personal income tax`);
    }
  }

  if (country1.taxationType === "Territorial" || country2.taxationType === "Territorial") {
    score += 20;
    if (country1.taxationType === "Territorial") {
      implications.push(`${country1.countryId} only taxes income earned within its borders`);
    }
    if (country2.taxationType === "Territorial") {
      implications.push(`${country2.countryId} only taxes income earned within its borders`);
    }
  }

  // Penalize citizenship-based taxation
  if (country1.taxationType === "Citizenship-based" || country2.taxationType === "Citizenship-based") {
    score -= 10;
    implications.push("Citizenship-based taxation means you'll be taxed regardless of where you live");
  }

  implications.push(`${country1.countryId} taxation: ${country1.taxationType}`);
  implications.push(`${country2.countryId} taxation: ${country2.taxationType}`);

  // Add residency criteria
  implications.push(country1.residencyCriteriaBlurb);
  implications.push(country2.residencyCriteriaBlurb);

  // Normalize score between 0-100
  score = Math.max(0, Math.min(100, score));

  return {
    name: "Tax Obligations",
    score,
    description: "Tax implications of holding both citizenships",
    implications
  };
};

export const calculateVotingRightsScore = (country1: CountryData, country2: CountryData): CategoryScore => {
  let score = 100;
  const implications: string[] = [];

  // Check voting status
  if (country1.votingStatus.includes("Compulsory") || country2.votingStatus.includes("Compulsory")) {
    score -= 20;
    
    if (country1.votingStatus.includes("Compulsory")) {
      implications.push(`${country1.countryId} has compulsory voting`);
    }
    if (country2.votingStatus.includes("Compulsory")) {
      implications.push(`${country2.countryId} has compulsory voting`);
    }
  }

  if (country1.votingStatus === "Selective" || country2.votingStatus === "Selective") {
    score -= 40;
    
    if (country1.votingStatus === "Selective") {
      implications.push(`${country1.countryId} has selective voting rights`);
    }
    if (country2.votingStatus === "Selective") {
      implications.push(`${country2.countryId} has selective voting rights`);
    }
  }

  implications.push(`${country1.countryId} voting: ${formatVotingStatus(country1.votingStatus)}`);
  implications.push(`${country2.countryId} voting: ${formatVotingStatus(country2.votingStatus)}`);

  return {
    name: "Voting Rights",
    score,
    description: "Voting requirements and obligations in both countries",
    implications
  };
};

export const calculateOverallCompatibility = (country1: CountryData, country2: CountryData): number => {
  const legalScore = calculateLegalStatusScore(country1, country2).score;
  const residencyScore = calculateResidencyScore(country1, country2).score;
  const militaryScore = calculateMilitaryServiceScore(country1, country2).score;
  const taxScore = calculateTaxObligationsScore(country1, country2).score;
  const votingScore = calculateVotingRightsScore(country1, country2).score;

  // Weight the scores - dual citizenship is most important
  const weightedScore = (
    legalScore * 0.35 + 
    residencyScore * 0.2 + 
    militaryScore * 0.15 + 
    taxScore * 0.2 + 
    votingScore * 0.1
  );

  return Math.round(weightedScore);
};

// Helper formatting functions
const formatMilitaryService = (service: string): string => {
  switch(service) {
    case "Yes": return "Mandatory";
    case "No": return "Not required";
    case "De jure": return "Legally required but not enforced";
    case "Infrequent": return "Selective or infrequent";
    case "Choice": return "Optional or alternative service available";
    default: return service;
  }
};

const formatVotingStatus = (status: string): string => {
  switch(status) {
    case "Universal": return "Universal suffrage";
    case "Universal and Compulsory": return "Universal and mandatory voting";
    case "Selective": return "Limited or selective voting rights";
    default: return status;
  }
};
