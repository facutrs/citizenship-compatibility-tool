import { CountryData } from "@/types/country";

/**
 * Calculate the compatibility score between two countries for dual citizenship.
 * 
 * @param country1 - Data for the first country
 * @param country2 - Data for the second country
 * @returns A number between 0 and 100 representing compatibility percentage
 */
export const calculateCompatibility = (
  country1: CountryData | null,
  country2: CountryData | null
): {
  totalScore: number;
  categories: {
    legalStatus: number;
    residency: number;
    militaryService: number;
    taxObligations: number;
    votingRights: number;
  };
} => {
  if (!country1 || !country2) {
    return {
      totalScore: 0,
      categories: {
        legalStatus: 0,
        residency: 0,
        militaryService: 0,
        taxObligations: 0,
        votingRights: 0,
      },
    };
  }

  // Legal Status score - Updated logic
  let legalStatusScore = 0;
  if (country1.dualCitizenship === "Yes" && country2.dualCitizenship === "Yes") {
    legalStatusScore = 100; // If both countries allow dual citizenship, score is 100%
  } else if (
    (country1.dualCitizenship === "Yes" && country2.dualCitizenship === "Conditional") ||
    (country1.dualCitizenship === "Conditional" && country2.dualCitizenship === "Yes")
  ) {
    legalStatusScore = 70;
  } else if (country1.dualCitizenship === "Conditional" && country2.dualCitizenship === "Conditional") {
    legalStatusScore = 50;
  } else if (
    (country1.dualCitizenship === "Yes" && country2.dualCitizenship === "No") ||
    (country1.dualCitizenship === "No" && country2.dualCitizenship === "Yes")
  ) {
    legalStatusScore = 25;
  } else if (
    (country1.dualCitizenship === "Conditional" && country2.dualCitizenship === "No") ||
    (country1.dualCitizenship === "No" && country2.dualCitizenship === "Conditional")
  ) {
    legalStatusScore = 15;
  } else {
    legalStatusScore = 0;
  }

  // Residency Requirements score - Updated logic
  const residencyDiff = Math.abs(country1.residencyYears - country2.residencyYears);
  let residencyScore = 0;
  if (residencyDiff === 0) {
    residencyScore = 100;
  } else if (residencyDiff <= 2) {
    residencyScore = 100; // Similar residency requirements now get 100%
  } else if (residencyDiff <= 5) {
    residencyScore = 70;
  } else if (residencyDiff <= 10) {
    residencyScore = 50;
  } else {
    residencyScore = 30;
  }

  // Military Service score
  let militaryServiceScore = 0;
  if (country1.militaryService === "No" && country2.militaryService === "No") {
    militaryServiceScore = 100;
  } else if (country1.militaryService === "De jure" && country2.militaryService === "De jure") {
    militaryServiceScore = 100; // Both countries have de jure service = 100% match (green)
  } else if (
    (country1.militaryService === "No" && country2.militaryService === "De jure") ||
    (country1.militaryService === "De jure" && country2.militaryService === "No")
  ) {
    militaryServiceScore = 80; // When one has no service and the other has de jure service = 80% match (green)
  } else if (
    (country1.militaryService === "No" && country2.militaryService === "Choice") ||
    (country1.militaryService === "Choice" && country2.militaryService === "No")
  ) {
    militaryServiceScore = 90;
  } else if (
    (country1.militaryService === "No" && country2.militaryService === "Infrequent") ||
    (country1.militaryService === "Infrequent" && country2.militaryService === "No")
  ) {
    militaryServiceScore = 85;
  } else if (
    (country1.militaryService === "Infrequent" && country2.militaryService === "De jure") ||
    (country1.militaryService === "De jure" && country2.militaryService === "Infrequent")
  ) {
    militaryServiceScore = 80; // Updated: Both have either de jure or infrequent service = 80% match (green)
  } else if (
    (country1.militaryService === "Choice" && country2.militaryService === "De jure") ||
    (country1.militaryService === "De jure" && country2.militaryService === "Choice")
  ) {
    militaryServiceScore = 75;
  } else if (
    (country1.militaryService === "No" && country2.militaryService === "Yes") ||
    (country1.militaryService === "Yes" && country2.militaryService === "No")
  ) {
    militaryServiceScore = 40;
  } else if (
    (country1.militaryService === "De jure" && country2.militaryService === "Yes") ||
    (country1.militaryService === "Yes" && country2.militaryService === "De jure")
  ) {
    militaryServiceScore = 30;
  } else if (
    (country1.militaryService === "Infrequent" && country2.militaryService === "Yes") ||
    (country1.militaryService === "Yes" && country2.militaryService === "Infrequent")
  ) {
    militaryServiceScore = 35;
  } else if (
    (country1.militaryService === "Choice" && country2.militaryService === "Yes") ||
    (country1.militaryService === "Yes" && country2.militaryService === "Choice")
  ) {
    militaryServiceScore = 45;
  } else if (country1.militaryService === "Yes" && country2.militaryService === "Yes") {
    militaryServiceScore = 20;
  } else {
    militaryServiceScore = 50;
  }

  // Tax Obligations score
  let taxObligationsScore = 0;
  if (country1.taxTreaty === "Yes" && country2.taxTreaty === "Yes") {
    taxObligationsScore = 100;
  } else if (
    (country1.taxTreaty === "Yes" && country2.taxTreaty === "No") ||
    (country1.taxTreaty === "No" && country2.taxTreaty === "Yes")
  ) {
    taxObligationsScore = 60;
  } else if (country1.taxTreaty === "No" && country2.taxTreaty === "No") {
    taxObligationsScore = 40;
  } else if (
    country1.taxTreaty === "Several countries" || 
    country2.taxTreaty === "Several countries"
  ) {
    taxObligationsScore = 80;
  } else {
    taxObligationsScore = 50;
  }

  // Voting Rights score - Updated logic
  let votingRightsScore = 0;
  if (
    country1.votingStatus === country2.votingStatus
  ) {
    votingRightsScore = 100;
  } else if (
    (country1.votingStatus === "Universal" && country2.votingStatus === "Universal and Compulsory") ||
    (country1.votingStatus === "Universal and Compulsory" && country2.votingStatus === "Universal")
  ) {
    votingRightsScore = 70; // If one is compulsory and one is voluntary, it's not a perfect match (yellow)
  } else {
    votingRightsScore = 50;
  }

  // Calculate the total score (equal weighting for all categories)
  const totalScore = Math.round(
    (legalStatusScore + residencyScore + militaryServiceScore + taxObligationsScore + votingRightsScore) / 5
  );

  return {
    totalScore,
    categories: {
      legalStatus: legalStatusScore,
      residency: residencyScore,
      militaryService: militaryServiceScore,
      taxObligations: taxObligationsScore,
      votingRights: votingRightsScore,
    },
  };
};

export const getLegalStatusImplications = (country1: string, country2: string, country1Data: CountryData, country2Data: CountryData): string[] => {
  const implications = [];

  // Basic dual citizenship status
  if (country1Data.dualCitizenship === "Yes" && country2Data.dualCitizenship === "Yes") {
    implications.push(`Both ${country1} and ${country2} permit dual citizenship.`);
  } else if (country1Data.dualCitizenship === "No" && country2Data.dualCitizenship === "No") {
    implications.push(`Neither ${country1} nor ${country2} permit dual citizenship. You would have to renounce one citizenship to acquire the other.`);
  } else if (country1Data.dualCitizenship === "No") {
    implications.push(`${country1} does not permit dual citizenship. You would need to renounce your ${country2} citizenship to become a citizen of ${country1}.`);
  } else if (country2Data.dualCitizenship === "No") {
    implications.push(`${country2} does not permit dual citizenship. You would need to renounce your ${country1} citizenship to become a citizen of ${country2}.`);
  } else if (country1Data.dualCitizenship === "Conditional" && country2Data.dualCitizenship === "Conditional") {
    implications.push(`Both ${country1} and ${country2} allow dual citizenship under certain conditions. Consult with immigration attorneys in both countries.`);
  } else if (country1Data.dualCitizenship === "Conditional") {
    implications.push(`${country1} allows dual citizenship only under certain conditions, while ${country2} ${country2Data.dualCitizenship === "Yes" ? "fully permits" : "does not permit"} dual citizenship.`);
  } else if (country2Data.dualCitizenship === "Conditional") {
    implications.push(`${country2} allows dual citizenship only under certain conditions, while ${country1} ${country1Data.dualCitizenship === "Yes" ? "fully permits" : "does not permit"} dual citizenship.`);
  }

  // Citizenship by descent
  if (country1Data.citizenshipByDescent && country2Data.citizenshipByDescent) {
    if (country1Data.citizenshipByDescent === country2Data.citizenshipByDescent) {
      implications.push(`Both ${country1} and ${country2} recognize citizenship by descent.`);
    } else {
      implications.push(`Citizenship by descent: ${country1} - ${country1Data.citizenshipByDescent}. ${country2} - ${country2Data.citizenshipByDescent}.`);
    }
  }

  // Citizenship by marriage
  if (country1Data.citizenshipByMarriage && country2Data.citizenshipByMarriage) {
    if (country1Data.citizenshipByMarriage === country2Data.citizenshipByMarriage) {
      implications.push(`Both ${country1} and ${country2} allow citizenship by marriage after ${country1Data.citizenshipByMarriage.toLowerCase()} of marriage.`);
    } else {
      implications.push(`Citizenship by marriage: In ${country1}, citizenship can be obtained after ${country1Data.citizenshipByMarriage.toLowerCase()} of marriage. In ${country2}, citizenship can be obtained after ${country2Data.citizenshipByMarriage.toLowerCase()} of marriage.`);
    }
  }

  return implications;
};

export const getResidencyImplications = (country1: string, country2: string, country1Data: CountryData, country2Data: CountryData): string[] => {
  const implications = [];
  
  // Check if residency requirements are the same first
  if (country1Data.residencyYears === country2Data.residencyYears) {
    implications.push(`Both countries allow naturalization after ${country1Data.residencyYears} years of residency.`);
  } else {
    if (Math.abs(country1Data.residencyYears - country2Data.residencyYears) <= 2) {
      implications.push(`The residency requirements are similar between the two countries.`);
    }
    
    implications.push(`${country1} requires ${country1Data.residencyYears} years of residency for naturalization, while ${country2} requires ${country2Data.residencyYears} years.`);
  }
  
  // Include residency criteria if available
  if (country1Data.residencyCriteriaBlurb) {
    implications.push(`${country1} residency criteria: ${country1Data.residencyCriteriaBlurb}`);
  }
  
  if (country2Data.residencyCriteriaBlurb) {
    implications.push(`${country2} residency criteria: ${country2Data.residencyCriteriaBlurb}`);
  }

  return implications;
};

export const getMilitaryServiceImplications = (country1: string, country2: string, country1Data: CountryData, country2Data: CountryData): string[] => {
  const implications = [];

  const getMilitaryDescription = (country: string, status: string) => {
    switch (status) {
      case "Yes":
        return `${country} has mandatory military service for citizens.`;
      case "No":
        return `${country} does not require military service.`;
      case "De jure":
        return `${country} has military service requirements on paper but rarely enforces them in practice.`;
      case "Choice":
        return `${country} offers a choice between military and alternative service.`;
      case "Infrequent":
        return `${country} has infrequent or limited conscription.`;
      default:
        return `${country}'s military service requirements are unclear.`;
    }
  };

  implications.push(getMilitaryDescription(country1, country1Data.militaryService));
  implications.push(getMilitaryDescription(country2, country2Data.militaryService));

  if (country1Data.militaryService === "Yes" && country2Data.militaryService === "Yes") {
    implications.push(`As both countries require military service, you may face competing obligations. This could create significant legal complications.`);
  } else if (country1Data.militaryService === "Yes" || country2Data.militaryService === "Yes") {
    const requiringCountry = country1Data.militaryService === "Yes" ? country1 : country2;
    implications.push(`Your obligations to serve in ${requiringCountry}'s military may be affected by your dual citizenship status.`);
  }

  return implications;
};

export const getTaxObligationsImplications = (country1: string, country2: string, country1Data: CountryData, country2Data: CountryData): string[] => {
  const implications = [];

  // Check if USA is one of the countries
  const isUSAInvolved = country1 === "USA" || country2 === "USA";
  const nonUSACountry = country1 === "USA" ? country2 : country1;
  const nonUSACountryData = country1 === "USA" ? country2Data : country1Data;

  if (isUSAInvolved) {
    implications.push(`USA taxes citizens on worldwide income regardless of residence, while ${nonUSACountry} generally taxes based on residence and/or source of income.`);
    
    if (nonUSACountryData.taxTreaty === "Yes") {
      implications.push(`USA and ${nonUSACountry} have a tax treaty that may help prevent double taxation and provide certain tax benefits.`);
    } else {
      implications.push(`USA and ${nonUSACountry} do not have a comprehensive tax treaty, which may increase the risk of double taxation.`);
    }
    
    implications.push(`US citizens must file annual tax returns regardless of where they live, and may need to report foreign bank accounts through FBAR and FATCA.`);
  } else {
    // Add tax type information for non-USA comparisons
    if (country1Data.taxationType && country2Data.taxationType) {
      if (country1Data.taxationType === country2Data.taxationType) {
        implications.push(`Both ${country1} and ${country2} have ${country1Data.taxationType.toLowerCase()} taxation systems.`);
      } else {
        implications.push(`${country1} has a ${country1Data.taxationType.toLowerCase()} taxation system, while ${country2} has a ${country2Data.taxationType.toLowerCase()} taxation system.`);
      }
    }
    
    // Neither country is USA
    if (country1Data.taxTreaty === "Yes" && country2Data.taxTreaty === "Yes") {
      implications.push(`Both ${country1} and ${country2} have tax treaties with multiple countries, which may help prevent double taxation.`);
    } else if (country1Data.taxTreaty === "Yes" || country2Data.taxTreaty === "Yes") {
      const treatyCountry = country1Data.taxTreaty === "Yes" ? country1 : country2;
      const nonTreatyCountry = country1Data.taxTreaty === "Yes" ? country2 : country1;
      implications.push(`${treatyCountry} has more extensive tax treaties than ${nonTreatyCountry}, which may impact your overall tax situation.`);
    } else {
      implications.push(`Neither ${country1} nor ${country2} have extensive tax treaties, which may complicate your tax situation if you have income from multiple sources.`);
    }
  }

  implications.push(`Consult with tax professionals in both ${country1} and ${country2} to understand your specific tax obligations and available relief from double taxation.`);

  return implications;
};

export const getVotingRightsImplications = (country1: string, country2: string, country1Data: CountryData, country2Data: CountryData): string[] => {
  const implications = [];

  if (country1Data.votingStatus === "Universal and Compulsory" && country2Data.votingStatus === "Universal and Compulsory") {
    implications.push(`Both countries require compulsory voting. You may need to fulfill voting obligations in both nations.`);
  } else if (country1Data.votingStatus === "Universal and Compulsory" || country2Data.votingStatus === "Universal and Compulsory") {
    const compulsoryCountry = country1Data.votingStatus === "Universal and Compulsory" ? country1 : country2;
    const voluntaryCountry = country1Data.votingStatus === "Universal and Compulsory" ? country2 : country1;
    implications.push(`${compulsoryCountry} requires compulsory voting, while voting in ${voluntaryCountry} is voluntary. This may create conflicting obligations.`);
  } else if (country1Data.votingStatus === "Universal" && country2Data.votingStatus === "Universal") {
    implications.push(`Both countries have voluntary voting systems.`);
  } else {
    implications.push(`Voting rights may vary between ${country1} and ${country2}.`);
  }

  return implications;
};
