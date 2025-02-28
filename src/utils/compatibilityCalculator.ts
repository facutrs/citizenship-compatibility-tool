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
  const dualCitizenshipStatus = `${country2.name} ${country2.dualCitizenship === "Yes" ? "allows" : country2.dualCitizenship === "Conditional" ? "conditionally allows" : "does not allow"} dual citizenship.`;
  const descentInfo = `Citizenship by descent: ${country2.citizenshipByDescent === "Yes" ? "Available" : "Not available"}`;
  const marriageInfo = `Citizenship by marriage: ${country2.citizenshipByMarriage === "0 years" ? "Immediate" : country2.citizenshipByMarriage === "No" ? "Not available" : `After ${country2.citizenshipByMarriage}`}`;
  
  return `${dualCitizenshipStatus} ${descentInfo}. ${marriageInfo}.`;
};

const getResidencyDescription = (country1: any, country2: any): string => {
  return `${country2.name} requires ${country2.residencyYears} years of residency before being eligible for naturalization. ${country2.residencyCriteriaBlurb}`;
};

const getMilitaryServiceDescription = (country1: any, country2: any): string => {
  const militaryStatus = {
    "Yes": "has mandatory military service",
    "No": "does not have mandatory military service",
    "De jure": "has military service requirements but they are not strictly enforced",
    "Choice": "offers voluntary military service",
    "Infrequent": "rarely enforces military service requirements"
  }[country2.militaryService];
  
  return `${country2.name} ${militaryStatus}.`;
};

const getTaxDescription = (country1: any, country2: any): string => {
  let description = `${country2.name} has a ${country2.taxationType.toLowerCase()} tax system.`;
  
  if (country1.countryId === "US" || country2.countryId === "US") {
    const otherCountry = country1.countryId === "US" ? country2 : country1;
    description += ` ${otherCountry.taxTreaty === "Yes" ? "There is" : "There is no"} tax treaty with the United States.`;
  }
  
  return description;
};

const getVotingDescription = (country1: any, country2: any): string => {
  const votingType = country2.votingStatus === "Universal and Compulsory" 
    ? "Voting is mandatory"
    : country2.votingStatus === "Universal" 
    ? "Voting is optional"
    : "Voting is restricted";
    
  return `${votingType} in ${country2.name}.`;
};

// Keep the existing calculation functions but remove the implications arrays if they're not providing unique information
const getLegalStatusImplications = (country1: any, country2: any): string[] => {
  const implications: string[] = [];
  
  if (country2.dualCitizenship === "Conditional") {
    implications.push("Dual citizenship is allowed under specific conditions - consult local authorities for details");
  }
  
  if (country2.citizenshipByMarriage !== "No" && country2.citizenshipByMarriage !== "0 years") {
    implications.push(`Marriage to a citizen requires ${country2.citizenshipByMarriage} of residence before citizenship eligibility`);
  }
  
  return implications;
};

const getResidencyImplications = (country1: any, country2: any): string[] => {
  return [];  // Residency information is now fully contained in the description
};

const getMilitaryServiceImplications = (country1: any, country2: any): string[] => {
  return [];  // Military service information is now fully contained in the description
};

const getTaxImplications = (country1: any, country2: any): string[] => {
  const implications: string[] = [];
  
  if (country2.taxationType === "No personal income tax") {
    implications.push("No personal income tax applies to residents");
  } else if (country2.taxationType === "Territorial") {
    implications.push("Only income earned within the country is taxed");
  }
  
  return implications;
};

const getVotingImplications = (country1: any, country2: any): string[] => {
  return [];  // Voting information is now fully contained in the description
};

const calculateLegalStatusScore = (country1: any, country2: any): number => {
  // Base score starts at 100
  let score = 100;
  
  // If dual citizenship is not allowed, reduce score significantly
  if (country2.dualCitizenship === "No") {
    score -= 70;
  } else if (country2.dualCitizenship === "Conditional") {
    score -= 30;
  }
  
  // If renunciation is required, reduce score
  if (country2.renunciationRequired === "Yes") {
    score -= 50;
  }
  
  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, score));
};

const calculateResidencyScore = (country1: any, country2: any): number => {
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

const calculateMilitaryServiceScore = (country1: any, country2: any): number => {
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
