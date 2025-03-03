
import React, { useState } from 'react';
import { CountryData } from "@/types/country";
import { calculateCompatibility } from "@/utils/compatibilityCalculator";

// Create an interface for our component props
interface CitizenshipCalculatorProps {
  country1Data: CountryData;
  country2Data: CountryData;
}

const CitizenshipCalculator: React.FC<CitizenshipCalculatorProps> = ({ country1Data, country2Data }) => {
  // Calculate compatibility and scores
  const compatibility = calculateCompatibility(country1Data, country2Data);
  
  const { 
    totalScore,
    categories: {
      legalStatus,
      residency,
      militaryService,
      taxObligations,
      votingRights
    }
  } = compatibility;

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Compatibility Score: {totalScore}%</h2>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Legal Status:</span>
          <span>{legalStatus}%</span>
        </div>
        <div className="flex justify-between">
          <span>Residency:</span>
          <span>{residency}%</span>
        </div>
        <div className="flex justify-between">
          <span>Military Service:</span>
          <span>{militaryService}%</span>
        </div>
        <div className="flex justify-between">
          <span>Tax Obligations:</span>
          <span>{taxObligations}%</span>
        </div>
        <div className="flex justify-between">
          <span>Voting Rights:</span>
          <span>{votingRights}%</span>
        </div>
      </div>
    </div>
  );
};

export default CitizenshipCalculator;
