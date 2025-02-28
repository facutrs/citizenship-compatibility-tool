
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
        legalStatusScore,
        residencyScore,
        militaryServiceScore,
        taxObligationsScore,
        votingRightsScore
      ]);

      // Calculate overall compatibility
      const score = calculateOverallCompatibility(country1Data, country2Data);
      setCompatibilityScore(score);
    }
  }, [country1, country2]);

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
