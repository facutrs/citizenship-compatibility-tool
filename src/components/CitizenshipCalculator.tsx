
import React, { useState, useEffect } from "react";
import CountrySelector from "./CountrySelector";
import CompatibilityScore from "./CompatibilityScore";
import CompatibilityDetails from "./CompatibilityDetails";
import { COUNTRY_DATA } from "@/types/country";
import { 
  calculateLegalStatusScore, 
  calculateResidencyScore, 
  calculateMilitaryServiceScore, 
  calculateTaxObligationsScore,
  calculateVotingRightsScore,
  calculateOverallCompatibility,
  CategoryScore
} from "@/utils/compatibilityCalculator";

const CitizenshipCalculator = () => {
  const countryList = Object.keys(COUNTRY_DATA);
  const [country1, setCountry1] = useState(countryList[0]);
  const [country2, setCountry2] = useState(countryList[1]);
  const [compatibilityScore, setCompatibilityScore] = useState(0);
  const [categories, setCategories] = useState<CategoryScore[]>([]);

  useEffect(() => {
    // Get the country data
    const country1Data = COUNTRY_DATA[country1];
    const country2Data = COUNTRY_DATA[country2];

    if (country1Data && country2Data) {
      // Calculate compatibility scores for each category
      const legalStatusScore = calculateLegalStatusScore(country1Data, country2Data);
      const residencyScore = calculateResidencyScore(country1Data, country2Data);
      const militaryServiceScore = calculateMilitaryServiceScore(country1Data, country2Data);
      const taxObligationsScore = calculateTaxObligationsScore(country1Data, country2Data);
      const votingRightsScore = calculateVotingRightsScore(country1Data, country2Data);

      // Set the categories
      setCategories([
        {
          name: "Legal Status",
          score: legalStatusScore,
          description: `${country2Data.dualCitizenship === "Yes" 
            ? `${country2} allows dual citizenship.` 
            : country2Data.dualCitizenship === "Conditional" 
            ? `${country2} conditionally allows dual citizenship.`
            : `${country2} does not allow dual citizenship.`} 
            Citizenship by descent: ${country2Data.citizenshipByDescent === "Yes" ? "Available" : "Not available"}. 
            Citizenship by marriage: ${country2Data.citizenshipByMarriage === "0 years" 
            ? "Immediate" 
            : country2Data.citizenshipByMarriage === "No" 
            ? "Not available" 
            : `After ${country2Data.citizenshipByMarriage}`}.`,
          implications: getLegalStatusImplications(country1Data, country2Data)
        },
        {
          name: "Residency",
          score: residencyScore,
          description: `${country2} requires ${country2Data.residencyYears} years of residency before being eligible for naturalization. ${country2Data.residencyCriteriaBlurb}`,
          implications: getResidencyImplications(country1Data, country2Data)
        },
        {
          name: "Military Service",
          score: militaryServiceScore,
          description: getMilitaryServiceDescription(country1Data, country2Data),
          implications: getMilitaryServiceImplications(country1Data, country2Data)
        },
        {
          name: "Tax Obligations",
          score: taxObligationsScore,
          description: getTaxDescription(country1Data, country2Data),
          implications: getTaxImplications(country1Data, country2Data)
        },
        {
          name: "Voting Rights",
          score: votingRightsScore,
          description: getVotingDescription(country1Data, country2Data),
          implications: getVotingImplications(country1Data, country2Data)
        }
      ]);

      // Calculate overall compatibility
      const score = calculateOverallCompatibility(country1Data, country2Data);
      setCompatibilityScore(score);
    }
  }, [country1, country2]);

  // Helper functions for detailed descriptions
  const getLegalStatusImplications = (country1Data: any, country2Data: any): string[] => {
    const implications: string[] = [];
    
    if (country1Data.dualCitizenship !== country2Data.dualCitizenship) {
      if (country2Data.dualCitizenship === "Conditional") {
        implications.push(`Unlike ${country1}, ${country2} allows dual citizenship only under specific conditions`);
      } else if (country2Data.dualCitizenship === "No" && country1Data.dualCitizenship !== "No") {
        implications.push(`You may need to renounce your ${country1} citizenship to become a citizen of ${country2}`);
      }
    }
    
    if (country1Data.citizenshipByDescent !== country2Data.citizenshipByDescent) {
      implications.push(`${country2} ${country2Data.citizenshipByDescent === "Yes" ? "recognizes" : "does not recognize"} citizenship by descent, unlike ${country1}`);
    }
    
    if (country1Data.citizenshipByMarriage !== country2Data.citizenshipByMarriage) {
      implications.push(`Marriage to a ${country2} citizen provides a ${country2Data.citizenshipByMarriage === "No" ? "different" : "different timeline for"} path to citizenship than in ${country1}`);
    }
    
    return implications;
  };

  const getResidencyImplications = (country1Data: any, country2Data: any): string[] => {
    const implications: string[] = [];
    
    const year1 = parseInt(country1Data.residencyYears);
    const year2 = parseInt(country2Data.residencyYears);
    
    if (!isNaN(year1) && !isNaN(year2) && Math.abs(year1 - year2) > 2) {
      implications.push(`${country2}'s ${year2 > year1 ? "longer" : "shorter"} residency requirement (${Math.abs(year2 - year1)} years ${year2 > year1 ? "more" : "less"} than ${country1}) could impact your naturalization timeline`);
    }
    
    return implications;
  };

  const getMilitaryServiceDescription = (country1Data: any, country2Data: any): string => {
    const militaryStatusMap: {[key: string]: string} = {
      "Yes": "has mandatory military service",
      "No": "does not have mandatory military service",
      "De jure": "has military service requirements but they are not strictly enforced",
      "Choice": "offers voluntary military service",
      "Infrequent": "rarely enforces military service requirements"
    };
    
    const country1Status = militaryStatusMap[country1Data.militaryService] || country1Data.militaryService;
    const country2Status = militaryStatusMap[country2Data.militaryService] || country2Data.militaryService;
    
    if (country1Data.militaryService !== country2Data.militaryService) {
      return `${country1} ${country1Status}, while ${country2} ${country2Status}. This difference could affect your citizenship obligations.`;
    }
    
    return `${country2} ${country2Status}.`;
  };

  const getMilitaryServiceImplications = (country1Data: any, country2Data: any): string[] => {
    const implications: string[] = [];
    
    if (country1Data.militaryService === "No" && ["Yes", "De jure"].includes(country2Data.militaryService)) {
      implications.push(`Becoming a citizen of ${country2} may subject you to military service obligations not present in ${country1}`);
    }
    
    if (country2Data.militaryService === "Yes" && country1Data.militaryService !== "Yes") {
      implications.push(`Military service in ${country2} is a significant citizenship obligation to consider`);
    }
    
    return implications;
  };

  const getTaxDescription = (country1Data: any, country2Data: any): string => {
    const taxCompare = country1Data.taxationType !== country2Data.taxationType
      ? `${country1} has a ${country1Data.taxationType.toLowerCase()} tax system, while ${country2} has a ${country2Data.taxationType.toLowerCase()} tax system.`
      : `${country2} has a ${country2Data.taxationType.toLowerCase()} tax system.`;
    
    let treatyInfo = "";
    if (country1Data.countryId === "US" || country2Data.countryId === "US") {
      const otherCountry = country1Data.countryId === "US" ? country2 : country1;
      const otherCountryData = country1Data.countryId === "US" ? country2Data : country1Data;
      treatyInfo = ` ${otherCountryData.taxTreaty === "Yes" ? "There is" : "There is no"} tax treaty with the United States.`;
    }
    
    return `${taxCompare}${treatyInfo}`;
  };

  const getTaxImplications = (country1Data: any, country2Data: any): string[] => {
    const implications: string[] = [];
    
    if (country1Data.taxationType !== country2Data.taxationType) {
      if (country2Data.taxationType === "No personal income tax" && country1Data.taxationType !== "No personal income tax") {
        implications.push(`Moving to ${country2} could significantly reduce your personal tax burden`);
      } else if (country1Data.taxationType === "Territorial" && country2Data.taxationType === "Residence-based") {
        implications.push(`${country2} may tax your worldwide income, unlike ${country1} which only taxes territorial income`);
      } else if (country1Data.taxationType === "Residence-based" && country2Data.taxationType === "Territorial") {
        implications.push(`${country2} only taxes local income, which could be advantageous compared to ${country1}`);
      }
    }
    
    if ((country1Data.countryId === "US" || country2Data.countryId === "US") && country1Data.taxTreaty !== country2Data.taxTreaty) {
      implications.push(`The difference in tax treaty status with the US could impact your tax situation`);
    }
    
    return implications;
  };

  const getVotingDescription = (country1Data: any, country2Data: any): string => {
    const votingTypeMap: {[key: string]: string} = {
      "Universal and Compulsory": "Voting is mandatory",
      "Universal": "Voting is optional",
      "Selective": "Voting is restricted to certain citizens",
      "Restricted": "Voting is restricted"
    };
    
    const country1Voting = votingTypeMap[country1Data.votingStatus] || country1Data.votingStatus;
    const country2Voting = votingTypeMap[country2Data.votingStatus] || country2Data.votingStatus;
    
    if (country1Data.votingStatus !== country2Data.votingStatus) {
      return `${country1Voting} in ${country1}, while ${country2Voting} in ${country2}.`;
    }
    
    return `${country2Voting} in ${country2}.`;
  };

  const getVotingImplications = (country1Data: any, country2Data: any): string[] => {
    const implications: string[] = [];
    
    if (country1Data.votingStatus !== country2Data.votingStatus) {
      if (country2Data.votingStatus.includes("Compulsory") && !country1Data.votingStatus.includes("Compulsory")) {
        implications.push(`As a citizen of ${country2}, you would be legally required to vote, unlike in ${country1}`);
      } else if (country2Data.votingStatus === "Restricted" || country2Data.votingStatus === "Selective") {
        implications.push(`Voting rights in ${country2} are more limited than in ${country1}`);
      }
    }
    
    return implications;
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">Citizenship Compatibility Calculator</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CountrySelector
          countries={countryList}
          value={country1}
          onChange={setCountry1}
          label="First Country"
          otherCountry={country2}
          type="primary"
        />
        
        <CountrySelector
          countries={countryList}
          value={country2}
          onChange={setCountry2}
          label="Second Country"
          otherCountry={country1}
          type="secondary"
        />
      </div>

      <CompatibilityScore
        score={compatibilityScore}
        country1={country1}
        country2={country2}
        country1Id={COUNTRY_DATA[country1]?.countryId}
        country2Id={COUNTRY_DATA[country2]?.countryId}
      />

      <CompatibilityDetails categories={categories} />
    </div>
  );
};

export default CitizenshipCalculator;
