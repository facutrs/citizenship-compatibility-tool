interface CountryData {
  countryId: string;
  dualCitizenship: "Yes" | "No" | "Conditional";
  residencyYears: number;
  militaryService: "Yes" | "No" | "De jure" | "Choice" | "Infrequent";
  taxTreaty: "Yes" | "No" | "Several countries";
  votingStatus: string;
  citizenshipByDescent?: string;
  citizenshipByMarriage?: string;
}

interface CategoryResult {
  score: number;
  description: string;
  implications: string[];
}

interface CompatibilityResult {
  overallScore: number;
  categories: {
    legalStatus: CategoryResult;
    residency: CategoryResult;
    militaryService: CategoryResult;
    taxObligations: CategoryResult;
    votingRights: CategoryResult;
  };
}

// Helper functions for calculating specific category compatibility
const calculateLegalStatusScore = (c1: CountryData, c2: CountryData): number => {
  // Base score on dual citizenship policies
  if (c1.dualCitizenship === "Yes" && c2.dualCitizenship === "Yes") {
    return 100;
  } else if (c1.dualCitizenship === "No" && c2.dualCitizenship === "No") {
    return 20; // Very incompatible
  } else if ((c1.dualCitizenship === "No" && c2.dualCitizenship === "Yes") || 
             (c1.dualCitizenship === "Yes" && c2.dualCitizenship === "No")) {
    return 40; // One country allows, one doesn't
  } else {
    return 70; // Conditional cases
  }
};

const calculateResidencyScore = (c1: CountryData, c2: CountryData): number => {
  // Calculate based on difference in residency years
  const yearDifference = Math.abs(c1.residencyYears - c2.residencyYears);
  
  if (yearDifference === 0) return 100;
  if (yearDifference <= 2) return 90;
  if (yearDifference <= 4) return 80;
  if (yearDifference <= 6) return 70;
  if (yearDifference <= 8) return 60;
  return 50;
};

const calculateMilitaryServiceScore = (c1: CountryData, c2: CountryData): number => {
  // Both countries don't require military service
  if (c1.militaryService === "No" && c2.militaryService === "No") {
    return 100;
  }
  
  // Both countries require military service
  if (c1.militaryService === "Yes" && c2.militaryService === "Yes") {
    return 40; // Potential conflict
  }
  
  // One requires, one doesn't
  if ((c1.militaryService === "Yes" && c2.militaryService === "No") ||
      (c1.militaryService === "No" && c2.militaryService === "Yes")) {
    return 60;
  }
  
  // At least one is De jure (on paper but not enforced)
  if (c1.militaryService === "De jure" || c2.militaryService === "De jure") {
    return 80;
  }
  
  // Other combinations
  return 70;
};

const calculateTaxScore = (c1: CountryData, c2: CountryData): number => {
  // Both have tax treaties
  if (c1.taxTreaty === "Yes" && c2.taxTreaty === "Yes") {
    return 100;
  }
  
  // Neither has tax treaties
  if (c1.taxTreaty === "No" && c2.taxTreaty === "No") {
    return 60;
  }
  
  // One has tax treaty, one doesn't
  if ((c1.taxTreaty === "Yes" && c2.taxTreaty === "No") ||
      (c1.taxTreaty === "No" && c2.taxTreaty === "Yes")) {
    return 70;
  }
  
  // Special cases with multiple treaties
  if (c1.taxTreaty === "Several countries" || c2.taxTreaty === "Several countries") {
    return 85;
  }
  
  return 75;
};

const calculateVotingScore = (c1: CountryData, c2: CountryData): number => {
  // Exact same voting system
  if (c1.votingStatus === c2.votingStatus) {
    return 100;
  }
  
  // Both universal but one is compulsory
  if ((c1.votingStatus === "Universal" && c2.votingStatus === "Universal and Compulsory") ||
      (c1.votingStatus === "Universal and Compulsory" && c2.votingStatus === "Universal")) {
    return 80;
  }
  
  // Any other combinations
  return 70;
};

const getLegalStatusDescription = (c1: CountryData, c2: CountryData): string => {
  const implications: string[] = [];

  if (c1.dualCitizenship === "Yes" && c2.dualCitizenship === "Yes") {
    return `Both ${c1.countryId} and ${c2.countryId} allow dual citizenship without restrictions.`;
  } else if (c1.dualCitizenship === "No" && c2.dualCitizenship === "No") {
    return `Neither ${c1.countryId} nor ${c2.countryId} allows dual citizenship. You would need to renounce one citizenship to acquire the other.`;
  } else if (c1.dualCitizenship === "No") {
    return `${c1.countryId} does not allow dual citizenship, while ${c2.countryId} does. You would need to renounce your ${c2.countryId} citizenship to become a citizen of ${c1.countryId}.`;
  } else if (c2.dualCitizenship === "No") {
    return `${c2.countryId} does not allow dual citizenship, while ${c1.countryId} does. You would need to renounce your ${c1.countryId} citizenship to become a citizen of ${c2.countryId}.`;
  } else {
    return `One or both countries have conditional dual citizenship policies that may require special permissions or have restrictions.`;
  }
};

const getLegalStatusImplications = (c1: CountryData, c2: CountryData): string[] => {
  const implications: string[] = [];
  
  // Add citizenship by descent information
  if (c1.citizenshipByDescent && c2.citizenshipByDescent) {
    implications.push(`Citizenship by descent: ${c1.countryId}: ${c1.citizenshipByDescent}, ${c2.countryId}: ${c2.citizenshipByDescent}`);
  }
  
  // Add citizenship by marriage information
  if (c1.citizenshipByMarriage && c2.citizenshipByMarriage) {
    implications.push(`Citizenship by marriage: ${c1.countryId}: ${c1.citizenshipByMarriage}, ${c2.countryId}: ${c2.citizenshipByMarriage}`);
  }
  
  return implications;
};

const getResidencyDescription = (c1: CountryData, c2: CountryData): string => {
  const yearDifference = Math.abs(c1.residencyYears - c2.residencyYears);
  
  if (yearDifference === 0) {
    return `Both countries require ${c1.residencyYears} years of residence for naturalization.`;
  } else {
    return `${c1.countryId} requires ${c1.residencyYears} years of residence for naturalization, while ${c2.countryId} requires ${c2.residencyYears} years.`;
  }
};

const getMilitaryServiceDescription = (c1: CountryData, c2: CountryData): string => {
  if (c1.militaryService === "No" && c2.militaryService === "No") {
    return `Neither country has mandatory military service requirements.`;
  } else if (c1.militaryService === "Yes" && c2.militaryService === "Yes") {
    return `Both ${c1.countryId} and ${c2.countryId} have mandatory military service requirements, which could create conflicts.`;
  } else if (c1.militaryService === "Yes") {
    return `${c1.countryId} has mandatory military service while ${c2.countryId} does not.`;
  } else if (c2.militaryService === "Yes") {
    return `${c2.countryId} has mandatory military service while ${c1.countryId} does not.`;
  } else if (c1.militaryService === "De jure" && c2.militaryService === "De jure") {
    return `Both countries have military service laws on the books but don't actively enforce them.`;
  } else if (c1.militaryService === "De jure") {
    return `${c1.countryId} has military service laws but doesn't actively enforce them.`;
  } else if (c2.militaryService === "De jure") {
    return `${c2.countryId} has military service laws but doesn't actively enforce them.`;
  } else {
    return `Military service requirements vary between the two countries.`;
  }
};

const getTaxDescription = (c1: CountryData, c2: CountryData): string => {
  if (c1.taxTreaty === "Yes" && c2.taxTreaty === "Yes") {
    return `A tax treaty exists between ${c1.countryId} and ${c2.countryId}, reducing the risk of double taxation.`;
  } else if (c1.taxTreaty === "No" && c2.taxTreaty === "No") {
    return `Neither country has extensive tax treaties, which could lead to more complex tax situations.`;
  } else if (c1.taxTreaty === "Several countries" || c2.taxTreaty === "Several countries") {
    const country = c1.taxTreaty === "Several countries" ? c1.countryId : c2.countryId;
    return `${country} has tax treaties with multiple countries, which might provide some tax benefits.`;
  } else {
    return `Tax treaty status differs between the countries, potentially creating complexities in tax obligations.`;
  }
};

const getVotingDescription = (c1: CountryData, c2: CountryData): string => {
  if (c1.votingStatus === c2.votingStatus) {
    if (c1.votingStatus === "Universal and Compulsory") {
      return `Both countries have universal and compulsory voting systems.`;
    } else {
      return `Both countries have similar ${c1.votingStatus.toLowerCase()} voting systems.`;
    }
  } else if ((c1.votingStatus === "Universal" && c2.votingStatus === "Universal and Compulsory") ||
             (c1.votingStatus === "Universal and Compulsory" && c2.votingStatus === "Universal")) {
    const compulsory = c1.votingStatus === "Universal and Compulsory" ? c1.countryId : c2.countryId;
    const nonCompulsory = c1.votingStatus === "Universal" ? c1.countryId : c2.countryId;
    return `${compulsory} has compulsory voting, while ${nonCompulsory} has voluntary voting.`;
  } else {
    return `${c1.countryId} has a ${c1.votingStatus.toLowerCase()} voting system, while ${c2.countryId} has a ${c2.votingStatus.toLowerCase()} system.`;
  }
};

export const calculateCompatibility = (
  country1: string,
  country2: string,
  countryData: Record<string, CountryData>
): CompatibilityResult | null => {
  const c1 = countryData[country1];
  const c2 = countryData[country2];

  if (!c1 || !c2) return null;

  // Calculate scores for each category
  const legalStatusScore = calculateLegalStatusScore(c1, c2);
  const residencyScore = calculateResidencyScore(c1, c2);
  const militaryServiceScore = calculateMilitaryServiceScore(c1, c2);
  const taxScore = calculateTaxScore(c1, c2);
  const votingScore = calculateVotingScore(c1, c2);

  // Get descriptions for each category
  const legalStatusDescription = getLegalStatusDescription(c1, c2);
  const residencyDescription = getResidencyDescription(c1, c2);
  const militaryServiceDescription = getMilitaryServiceDescription(c1, c2);
  const taxDescription = getTaxDescription(c1, c2);
  const votingDescription = getVotingDescription(c1, c2);

  // Get implications for each category
  const legalStatusImplications = getLegalStatusImplications(c1, c2);

  // Calculate overall score (average of all category scores)
  const overallScore = Math.round(
    (legalStatusScore + residencyScore + militaryServiceScore + taxScore + votingScore) / 5
  );

  return {
    overallScore,
    categories: {
      legalStatus: {
        score: legalStatusScore,
        description: legalStatusDescription,
        implications: legalStatusImplications
      },
      residency: {
        score: residencyScore,
        description: residencyDescription,
        implications: []
      },
      militaryService: {
        score: militaryServiceScore,
        description: militaryServiceDescription,
        implications: []
      },
      taxObligations: {
        score: taxScore,
        description: taxDescription,
        implications: []
      },
      votingRights: {
        score: votingScore,
        description: votingDescription,
        implications: []
      }
    }
  };
};
