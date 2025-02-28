export interface CategoryScore {
  name: string;
  score: number;
  description: string;
  implications: string[];
}

export const calculateCompatibility = (country1: any, country2: any): { 
  totalScore: number;
  categories: CategoryScore[];
} => {
  const categories: CategoryScore[] = [
    {
      name: "Legal Status",
      score: calculateLegalStatusScore(country1, country2),
      description: getLegalStatusDescription(country1, country2),
      implications: getLegalStatusImplications(country1, country2)
    },
    {
      name: "Residency",
      score: calculateResidencyScore(country1, country2),
      description: getResidencyDescription(country1, country2),
      implications: getResidencyImplications(country1, country2)
    },
    {
      name: "Military Service",
      score: calculateMilitaryServiceScore(country1, country2),
      description: getMilitaryServiceDescription(country1, country2),
      implications: getMilitaryServiceImplications(country1, country2)
    },
    {
      name: "Tax Obligations",
      score: calculateTaxScore(country1, country2),
      description: getTaxDescription(country1, country2),
      implications: getTaxImplications(country1, country2)
    },
    {
      name: "Voting Rights",
      score: calculateVotingScore(country1, country2),
      description: getVotingDescription(country1, country2),
      implications: getVotingImplications(country1, country2)
    }
  ];

  const totalScore = Math.round(
    categories.reduce((sum, category) => sum + category.score, 0) / categories.length
  );

  return { totalScore, categories };
};

const getLegalStatusDescription = (country1: any, country2: any): string => {
  const dualCitizenshipStatus = country2.dualCitizenship === "Yes" 
    ? `${country2.name} allows dual citizenship.` 
    : country2.dualCitizenship === "Conditional" 
    ? `${country2.name} conditionally allows dual citizenship.`
    : `${country2.name} does not allow dual citizenship.`;
  
  const descentInfo = country2.citizenshipByDescent === "Yes" 
    ? `Citizenship by descent is available.` 
    : `Citizenship by descent is not available.`;
  
  const marriageInfo = country2.citizenshipByMarriage === "0 years" 
    ? `Citizenship by marriage is available immediately.` 
    : country2.citizenshipByMarriage === "No" 
    ? `Citizenship by marriage is not available.` 
    : `Citizenship by marriage requires ${country2.citizenshipByMarriage} of residence.`;
  
  return `${dualCitizenshipStatus} ${descentInfo} ${marriageInfo}`;
};

const getResidencyDescription = (country1: any, country2: any): string => {
  const yearsComparison = parseInt(country1.residencyYears) !== parseInt(country2.residencyYears)
    ? `While ${country1.name} requires ${country1.residencyYears} years, ${country2.name} requires ${country2.residencyYears} years of residency before naturalization eligibility.`
    : `${country2.name} requires ${country2.residencyYears} years of residency before naturalization eligibility.`;
  
  return `${yearsComparison} ${country2.residencyCriteriaBlurb}`;
};

const getMilitaryServiceDescription = (country1: any, country2: any): string => {
  const militaryStatusMap: {[key: string]: string} = {
    "Yes": "has mandatory military service",
    "No": "does not have mandatory military service",
    "De jure": "has military service requirements but they are not strictly enforced",
    "Choice": "offers voluntary military service",
    "Infrequent": "rarely enforces military service requirements"
  };
  
  const country1Status = militaryStatusMap[country1.militaryService] || country1.militaryService;
  const country2Status = militaryStatusMap[country2.militaryService] || country2.militaryService;
  
  if (country1.militaryService !== country2.militaryService) {
    return `${country1.name} ${country1Status}, while ${country2.name} ${country2Status}. This difference could affect your citizenship obligations.`;
  }
  
  return `${country2.name} ${country2Status}.`;
};

const getTaxDescription = (country1: any, country2: any): string => {
  const taxCompare = country1.taxationType !== country2.taxationType
    ? `${country1.name} has a ${country1.taxationType.toLowerCase()} tax system, while ${country2.name} has a ${country2.taxationType.toLowerCase()} tax system.`
    : `${country2.name} has a ${country2.taxationType.toLowerCase()} tax system.`;
  
  let treatyInfo = "";
  if (country1.countryId === "US" || country2.countryId === "US") {
    const otherCountry = country1.countryId === "US" ? country2 : country1;
    treatyInfo = ` ${otherCountry.taxTreaty === "Yes" ? "There is" : "There is no"} tax treaty with the United States.`;
  }
  
  return `${taxCompare}${treatyInfo}`;
};

const getVotingDescription = (country1: any, country2: any): string => {
  const votingTypeMap: {[key: string]: string} = {
    "Universal and Compulsory": "Voting is mandatory",
    "Universal": "Voting is optional",
    "Selective": "Voting is restricted to certain citizens",
    "Restricted": "Voting is restricted"
  };
  
  const country1Voting = votingTypeMap[country1.votingStatus] || country1.votingStatus;
  const country2Voting = votingTypeMap[country2.votingStatus] || country2.votingStatus;
  
  if (country1.votingStatus !== country2.votingStatus) {
    return `${country1Voting} in ${country1.name}, while ${country2Voting} in ${country2.name}.`;
  }
  
  return `${country2Voting} in ${country2.name}.`;
};

const getLegalStatusImplications = (country1: any, country2: any): string[] => {
  const implications: string[] = [];
  
  if (country1.dualCitizenship !== country2.dualCitizenship) {
    if (country2.dualCitizenship === "Conditional") {
      implications.push(`Unlike ${country1.name}, ${country2.name} allows dual citizenship only under specific conditions`);
    } else if (country2.dualCitizenship === "No" && country1.dualCitizenship !== "No") {
      implications.push(`You may need to renounce your ${country1.name} citizenship to become a citizen of ${country2.name}`);
    }
  }
  
  if (country1.citizenshipByDescent !== country2.citizenshipByDescent) {
    implications.push(`${country2.name} ${country2.citizenshipByDescent === "Yes" ? "recognizes" : "does not recognize"} citizenship by descent, unlike ${country1.name}`);
  }
  
  if (country1.citizenshipByMarriage !== country2.citizenshipByMarriage) {
    implications.push(`Marriage to a ${country2.name} citizen provides a ${country2.citizenshipByMarriage === "No" ? "different" : "different timeline for"} path to citizenship than in ${country1.name}`);
  }
  
  return implications;
};

const getResidencyImplications = (country1: any, country2: any): string[] => {
  const implications: string[] = [];
  
  const year1 = parseInt(country1.residencyYears);
  const year2 = parseInt(country2.residencyYears);
  
  if (!isNaN(year1) && !isNaN(year2) && Math.abs(year1 - year2) > 2) {
    implications.push(`${country2.name}'s ${year2 > year1 ? "longer" : "shorter"} residency requirement (${Math.abs(year2 - year1)} years ${year2 > year1 ? "more" : "less"} than ${country1.name}) could impact your naturalization timeline`);
  }
  
  return implications;
};

const getMilitaryServiceImplications = (country1: any, country2: any): string[] => {
  const implications: string[] = [];
  
  if (country1.militaryService === "No" && ["Yes", "De jure"].includes(country2.militaryService)) {
    implications.push(`Becoming a citizen of ${country2.name} may subject you to military service obligations not present in ${country1.name}`);
  }
  
  if (country2.militaryService === "Yes" && country1.militaryService !== "Yes") {
    implications.push(`Military service in ${country2.name} is a significant citizenship obligation to consider`);
  }
  
  return implications;
};

const getTaxImplications = (country1: any, country2: any): string[] => {
  const implications: string[] = [];
  
  if (country1.taxationType !== country2.taxationType) {
    if (country2.taxationType === "No personal income tax" && country1.taxationType !== "No personal income tax") {
      implications.push(`Moving to ${country2.name} could significantly reduce your personal tax burden`);
    } else if (country1.taxationType === "Territorial" && country2.taxationType === "Residence-based") {
      implications.push(`${country2.name} may tax your worldwide income, unlike ${country1.name} which only taxes territorial income`);
    } else if (country1.taxationType === "Residence-based" && country2.taxationType === "Territorial") {
      implications.push(`${country2.name} only taxes local income, which could be advantageous compared to ${country1.name}`);
    }
  }
  
  if ((country1.countryId === "US" || country2.countryId === "US") && country1.taxTreaty !== country2.taxTreaty) {
    implications.push(`The difference in tax treaty status with the US could impact your tax situation`);
  }
  
  return implications;
};

const getVotingImplications = (country1: any, country2: any): string[] => {
  const implications: string[] = [];
  
  if (country1.votingStatus !== country2.votingStatus) {
    if (country2.votingStatus.includes("Compulsory") && !country1.votingStatus.includes("Compulsory")) {
      implications.push(`As a citizen of ${country2.name}, you would be legally required to vote, unlike in ${country1.name}`);
    } else if (country2.votingStatus === "Restricted" || country2.votingStatus === "Selective") {
      implications.push(`Voting rights in ${country2.name} are more limited than in ${country1.name}`);
    }
  }
  
  return implications;
};

export const calculateLegalStatusScore = (country1: any, country2: any): number => {
  // Base score starts at 100
  let score = 100;
  
  // If dual citizenship is not allowed, reduce score significantly
  if (country2.dualCitizenship === "No") {
    score -= 70;
  } else if (country2.dualCitizenship === "Conditional") {
    score -= 30;
  }
  
  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, score));
};

export const calculateResidencyScore = (country1: any, country2: any): number => {
  // Base score starts at 100
  let score = 100;
  
  // Reduce score based on years required (more years = lower score)
  const yearsRequired = parseInt(country2.residencyYears, 10);
  if (!isNaN(yearsRequired)) {
    if (yearsRequired <= 3) {
      score -= 0; // No reduction for 3 years or less
    } else if (yearsRequired <= 5) {
      score -= 10; // Small reduction for 4-5 years
    } else if (yearsRequired <= 8) {
      score -= 30; // Moderate reduction for 6-8 years
    } else if (yearsRequired <= 10) {
      score -= 50; // Larger reduction for 9-10 years
    } else {
      score -= 70; // Significant reduction for more than 10 years
    }
  }
  
  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, score));
};

export const calculateMilitaryServiceScore = (country1: any, country2: any): number => {
  // Base score starts at 100
  let score = 100;
  
  // Reduce score based on military service requirements
  if (country2.militaryService === "Yes") {
    score -= 70; // Significant reduction for mandatory service
  } else if (country2.militaryService === "De jure") {
    score -= 40; // Moderate reduction for de jure but not enforced
  } else if (country2.militaryService === "Infrequent") {
    score -= 20; // Small reduction for infrequent enforcement
  }
  
  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, score));
};

export const calculateTaxObligationsScore = calculateTaxScore;
export const calculateVotingRightsScore = calculateVotingScore;
export const calculateOverallCompatibility = (country1: any, country2: any): number => {
  const { totalScore } = calculateCompatibility(country1, country2);
  return totalScore;
};

const calculateTaxScore = (country1: any, country2: any): number => {
  // Base score starts at 100
  let score = 100;
  
  // Adjust score based on taxation type
  if (country2.taxationType === "Worldwide") {
    score -= 40; // Reduction for worldwide taxation
  } else if (country2.taxationType === "Territorial") {
    score -= 10; // Small reduction for territorial taxation
  }
  
  // If one country is the US and there's no tax treaty, reduce score
  if ((country1.countryId === "US" || country2.countryId === "US") && 
      (country1.taxTreaty === "No" || country2.taxTreaty === "No")) {
    score -= 30;
  }
  
  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, score));
};

const calculateVotingScore = (country1: any, country2: any): number => {
  // Base score starts at 100
  let score = 100;
  
  // Adjust score based on voting status
  if (country2.votingStatus === "Universal and Compulsory") {
    score -= 20; // Reduction for compulsory voting
  } else if (country2.votingStatus === "Restricted") {
    score -= 40; // Larger reduction for restricted voting
  }
  
  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, score));
};
