
import React from 'react';
import { CountryData } from "@/types/country";
import { calculateCompatibility } from "@/utils/compatibilityCalculator";

interface CompatibilityDetailsProps {
  country1: string;
  country2: string;
  country1Data: CountryData;
  country2Data: CountryData;
}

const CompatibilityDetails: React.FC<CompatibilityDetailsProps> = ({
  country1,
  country2,
  country1Data,
  country2Data
}) => {
  const result = calculateCompatibility(country1Data, country2Data);
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Compatibility Details</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Legal Status</h3>
          <p>Score: {result.categories.legalStatus}%</p>
          <p>{country1} dual citizenship: {country1Data.dualCitizenship}</p>
          <p>{country2} dual citizenship: {country2Data.dualCitizenship}</p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold">Residency</h3>
          <p>Score: {result.categories.residency}%</p>
          <p>{country1} residency requirement: {country1Data.residencyYears} years</p>
          <p>{country2} residency requirement: {country2Data.residencyYears} years</p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold">Military Service</h3>
          <p>Score: {result.categories.militaryService}%</p>
          <p>{country1} military service: {country1Data.militaryService}</p>
          <p>{country2} military service: {country2Data.militaryService}</p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold">Tax Obligations</h3>
          <p>Score: {result.categories.taxObligations}%</p>
          <p>{country1} tax treaties: {country1Data.taxTreaty}</p>
          <p>{country2} tax treaties: {country2Data.taxTreaty}</p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold">Voting Rights</h3>
          <p>Score: {result.categories.votingRights}%</p>
          <p>{country1} voting: {country1Data.votingStatus}</p>
          <p>{country2} voting: {country2Data.votingStatus}</p>
        </div>
      </div>
    </div>
  );
};

export default CompatibilityDetails;
