
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
  const country1 = c1.countryId === "US" ? "USA" : 
                  c1.countryId === "GB" ? "UK" : 
                  c1.countryId === "AE" ? "UAE" : 
                  getCountryName(c1.countryId);

  const country2 = c2.countryId === "US" ? "USA" : 
                  c2.countryId === "GB" ? "UK" : 
                  c2.countryId === "AE" ? "UAE" : 
                  getCountryName(c2.countryId);

  if (c1.dualCitizenship === "Yes" && c2.dualCitizenship === "Yes") {
    return `Both ${country1} and ${country2} allow dual citizenship without restrictions.`;
  } else if (c1.dualCitizenship === "No" && c2.dualCitizenship === "No") {
    return `Neither ${country1} nor ${country2} allows dual citizenship. You would need to renounce one citizenship to acquire the other.`;
  } else if (c1.dualCitizenship === "No") {
    return `${country1} does not allow dual citizenship, while ${country2} does. You would need to renounce your ${country2} citizenship to become a citizen of ${country1}.`;
  } else if (c2.dualCitizenship === "No") {
    return `${country2} does not allow dual citizenship, while ${country1} does. You would need to renounce your ${country1} citizenship to become a citizen of ${country2}.`;
  } else {
    return `One or both countries have conditional dual citizenship policies that may require special permissions or have restrictions.`;
  }
};

const getCountryName = (countryId: string): string => {
  // This is a simplified function, in real implementation 
  // we would have a complete mapping of country IDs to names
  return countryId;
};

const getLegalStatusImplications = (c1: CountryData, c2: CountryData): string[] => {
  const implications: string[] = [];
  const country1 = c1.countryId === "US" ? "USA" : 
                  c1.countryId === "GB" ? "UK" : 
                  c1.countryId === "AE" ? "UAE" : 
                  getCountryName(c1.countryId);

  const country2 = c2.countryId === "US" ? "USA" : 
                  c2.countryId === "GB" ? "UK" : 
                  c2.countryId === "AE" ? "UAE" : 
                  getCountryName(c2.countryId);
  
  // Add citizenship by descent information
  if (c1.citizenshipByDescent && c2.citizenshipByDescent) {
    implications.push(`${country1} grants citizenship by descent ${c1.citizenshipByDescent.toLowerCase()}, while ${country2} grants it ${c2.citizenshipByDescent.toLowerCase()}.`);
  }
  
  // Add citizenship by marriage information
  if (c1.citizenshipByMarriage && c2.citizenshipByMarriage) {
    implications.push(`${country1} allows citizenship through marriage ${c1.citizenshipByMarriage.toLowerCase()}, while ${country2} allows it ${c2.citizenshipByMarriage.toLowerCase()}.`);
  }
  
  return implications;
};

const getResidencyDescription = (c1: CountryData, c2: CountryData): string => {
  const country1 = c1.countryId === "US" ? "USA" : 
                  c1.countryId === "GB" ? "UK" : 
                  c1.countryId === "AE" ? "UAE" : 
                  getCountryName(c1.countryId);

  const country2 = c2.countryId === "US" ? "USA" : 
                  c2.countryId === "GB" ? "UK" : 
                  c2.countryId === "AE" ? "UAE" : 
                  getCountryName(c2.countryId);
  
  const yearDifference = Math.abs(c1.residencyYears - c2.residencyYears);
  
  if (yearDifference === 0) {
    return `Both countries require ${c1.residencyYears} years of legal residence before applying for naturalization.`;
  } else {
    return `Both countries allow naturalization after a period of legal residence. ${country1} requires ${c1.residencyYears} years of residency, while ${country2} requires ${c2.residencyYears} years.`;
  }
};

const getMilitaryServiceDescription = (c1: CountryData, c2: CountryData): string => {
  const country1 = c1.countryId === "US" ? "USA" : 
                  c1.countryId === "GB" ? "UK" : 
                  c1.countryId === "AE" ? "UAE" : 
                  getCountryName(c1.countryId);

  const country2 = c2.countryId === "US" ? "USA" : 
                  c2.countryId === "GB" ? "UK" : 
                  c2.countryId === "AE" ? "UAE" : 
                  getCountryName(c2.countryId);

  if (c1.militaryService === "No" && c2.militaryService === "No") {
    return `Neither ${country1} nor ${country2} has mandatory military service requirements.`;
  } else if (c1.militaryService === "Yes" && c2.militaryService === "Yes") {
    return `Both ${country1} and ${country2} have mandatory military service requirements, which could create conflicts for dual citizens.`;
  } else if (c1.militaryService === "Yes") {
    return `${country1} has mandatory military service while ${country2} does not. This could create obligations for dual citizens.`;
  } else if (c2.militaryService === "Yes") {
    return `${country2} has mandatory military service while ${country1} does not. This could create obligations for dual citizens.`;
  } else if (c1.militaryService === "De jure" && c2.militaryService === "De jure") {
    return `Both ${country1} and ${country2} have military service laws on the books but don't actively enforce them in practice.`;
  } else if (c1.militaryService === "De jure") {
    return `${country1} has military service laws but doesn't actively enforce them, while ${country2} has ${c2.militaryService.toLowerCase()} military service.`;
  } else if (c2.militaryService === "De jure") {
    return `${country2} has military service laws but doesn't actively enforce them, while ${country1} has ${c1.militaryService.toLowerCase()} military service.`;
  } else if (c1.militaryService === "Choice") {
    return `${country1} offers citizens a choice regarding military service, while ${country2} has ${c2.militaryService.toLowerCase()} military service.`;
  } else if (c2.militaryService === "Choice") {
    return `${country2} offers citizens a choice regarding military service, while ${country1} has ${c1.militaryService.toLowerCase()} military service.`;
  } else {
    return `Military service requirements differ between ${country1} (${c1.militaryService.toLowerCase()}) and ${country2} (${c2.militaryService.toLowerCase()}).`;
  }
};

const getTaxDescription = (c1: CountryData, c2: CountryData): string => {
  const country1 = c1.countryId === "US" ? "USA" : 
                  c1.countryId === "GB" ? "UK" : 
                  c1.countryId === "AE" ? "UAE" : 
                  getCountryName(c1.countryId);

  const country2 = c2.countryId === "US" ? "USA" : 
                  c2.countryId === "GB" ? "UK" : 
                  c2.countryId === "AE" ? "UAE" : 
                  getCountryName(c2.countryId);

  // Check USA specific tax treaties
  let usaTaxInfo = "";
  if (country1 === "USA" && c2.taxTreaty === "Yes") {
    usaTaxInfo = ` USA has a tax treaty with ${country2}, which helps prevent double taxation.`;
  } else if (country2 === "USA" && c1.taxTreaty === "Yes") {
    usaTaxInfo = ` USA has a tax treaty with ${country1}, which helps prevent double taxation.`;
  }

  if (c1.taxTreaty === "Yes" && c2.taxTreaty === "Yes") {
    return `A tax treaty exists between ${country1} and ${country2}, reducing the risk of double taxation.${usaTaxInfo}`;
  } else if (c1.taxTreaty === "No" && c2.taxTreaty === "No") {
    return `Neither ${country1} nor ${country2} has extensive tax treaties, which could lead to more complex tax situations for dual citizens.`;
  } else if (c1.taxTreaty === "Several countries" && c2.taxTreaty === "Several countries") {
    return `Both ${country1} and ${country2} have tax treaties with multiple countries, which might provide some tax benefits depending on your specific situation.${usaTaxInfo}`;
  } else if (c1.taxTreaty === "Several countries") {
    return `${country1} has tax treaties with multiple countries, while ${country2}'s tax treaty status is more limited. This could affect your tax obligations as a dual citizen.${usaTaxInfo}`;
  } else if (c2.taxTreaty === "Several countries") {
    return `${country2} has tax treaties with multiple countries, while ${country1}'s tax treaty status is more limited. This could affect your tax obligations as a dual citizen.${usaTaxInfo}`;
  } else if (c1.taxTreaty === "Yes") {
    return `${country1} has tax treaties that could benefit citizens, while ${country2} does not have extensive tax treaties.${usaTaxInfo}`;
  } else if (c2.taxTreaty === "Yes") {
    return `${country2} has tax treaties that could benefit citizens, while ${country1} does not have extensive tax treaties.${usaTaxInfo}`;
  } else {
    return `Tax treaty status differs between ${country1} and ${country2}, potentially creating complexities in tax obligations for dual citizens.${usaTaxInfo}`;
  }
};

const getVotingDescription = (c1: CountryData, c2: CountryData): string => {
  const country1 = c1.countryId === "US" ? "USA" : 
                  c1.countryId === "GB" ? "UK" : 
                  c1.countryId === "AE" ? "UAE" : 
                  getCountryName(c1.countryId);

  const country2 = c2.countryId === "US" ? "USA" : 
                  c2.countryId === "GB" ? "UK" : 
                  c2.countryId === "AE" ? "UAE" : 
                  getCountryName(c2.countryId);

  if (c1.votingStatus === c2.votingStatus) {
    if (c1.votingStatus === "Universal and Compulsory") {
      return `Both ${country1} and ${country2} have universal and compulsory voting systems, requiring eligible citizens to vote.`;
    } else {
      return `Both ${country1} and ${country2} have similar ${c1.votingStatus.toLowerCase()} voting systems.`;
    }
  } else if ((c1.votingStatus === "Universal" && c2.votingStatus === "Universal and Compulsory") ||
             (c1.votingStatus === "Universal and Compulsory" && c2.votingStatus === "Universal")) {
    const compulsory = c1.votingStatus === "Universal and Compulsory" ? country1 : country2;
    const nonCompulsory = c1.votingStatus === "Universal" ? country1 : country2;
    return `${compulsory} has compulsory voting, requiring eligible citizens to participate in elections, while ${nonCompulsory} has voluntary voting where citizens can choose whether to vote.`;
  } else {
    return `${country1} has a ${c1.votingStatus.toLowerCase()} voting system, while ${country2} has a ${c2.votingStatus.toLowerCase()} system. This creates different expectations and requirements for citizens.`;
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
