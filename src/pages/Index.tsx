
import React, { useState, useEffect } from "react";
import CountrySelector from "@/components/CountrySelector";
import CompatibilityScore from "@/components/CompatibilityScore";
import CategoryCard from "@/components/CategoryCard";
import { motion } from "framer-motion";
import { 
  calculateCompatibility, 
  getLegalStatusImplications, 
  getResidencyImplications, 
  getMilitaryServiceImplications, 
  getTaxObligationsImplications, 
  getVotingRightsImplications 
} from "@/utils/compatibilityCalculator";
import { CountryData, COUNTRY_DATA } from "@/types/country";

// Get all country names from the COUNTRY_DATA object
const COUNTRIES = Object.keys(COUNTRY_DATA).sort();

const DEFAULT_CATEGORIES = {
  legalStatus: {
    title: "Legal Status",
    implications: [],
  },
  residency: {
    title: "Residency",
    implications: [],
  },
  militaryService: {
    title: "Military Service",
    implications: [],
  },
  taxObligations: {
    title: "Tax Obligations",
    implications: [],
  },
  votingRights: {
    title: "Voting Rights",
    implications: [],
  },
};

const Index = () => {
  const [originCountry, setOriginCountry] = useState<string>("USA");
  const [destinationCountry, setDestinationCountry] = useState<string>("");
  const [compatibilityScore, setCompatibilityScore] = useState<number | null>(null);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    if (originCountry && destinationCountry) {
      setIsCalculating(true);
      
      // Simulate a calculation delay for better UX
      const timer = setTimeout(() => {
        // Get country data
        const originCountryData = COUNTRY_DATA[originCountry];
        const destinationCountryData = COUNTRY_DATA[destinationCountry];
        
        if (originCountryData && destinationCountryData) {
          // Calculate compatibility score
          const compatibility = calculateCompatibility(originCountryData, destinationCountryData);
          setCompatibilityScore(compatibility.totalScore);

          // Calculate implications for each category
          const legalImplications = getLegalStatusImplications(originCountry, destinationCountry, originCountryData, destinationCountryData);
          const residencyImplications = getResidencyImplications(originCountry, destinationCountry, originCountryData, destinationCountryData);
          const militaryImplications = getMilitaryServiceImplications(originCountry, destinationCountry, originCountryData, destinationCountryData);
          const taxImplications = getTaxObligationsImplications(originCountry, destinationCountry, originCountryData, destinationCountryData);
          const votingImplications = getVotingRightsImplications(originCountry, destinationCountry, originCountryData, destinationCountryData);

          // Update categories with implications
          setCategories({
            legalStatus: {
              title: "Legal Status",
              implications: legalImplications,
            },
            residency: {
              title: "Residency",
              implications: residencyImplications,
            },
            militaryService: {
              title: "Military Service",
              implications: militaryImplications,
            },
            taxObligations: {
              title: "Tax Obligations",
              implications: taxImplications,
            },
            votingRights: {
              title: "Voting Rights",
              implications: votingImplications,
            },
          });
        }

        setIsCalculating(false);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setCompatibilityScore(null);
      setCategories(DEFAULT_CATEGORIES);
    }
  }, [originCountry, destinationCountry]);

  const handleOriginChange = (country: string) => {
    setOriginCountry(country);
  };

  const handleDestinationChange = (country: string) => {
    setDestinationCountry(country);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Dual Citizenship Compatibility Calculator</h1>
          <p className="text-xl text-gray-600">
            Evaluate the compatibility between your origin country and potential second citizenship
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <CountrySelector
              label="Origin Country"
              countries={COUNTRIES}
              value={originCountry}
              onChange={handleOriginChange}
              type="primary"
            />
            <CountrySelector
              label="Destination Country"
              countries={COUNTRIES}
              value={destinationCountry}
              onChange={handleDestinationChange}
              otherCountry={originCountry}
              type="secondary"
            />
          </div>

          {compatibilityScore !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <CompatibilityScore 
                score={compatibilityScore}
                country1={originCountry}
                country2={destinationCountry}
                country1Id={originCountry ? COUNTRY_DATA[originCountry].countryId : undefined}
                country2Id={destinationCountry ? COUNTRY_DATA[destinationCountry].countryId : undefined}
              />
            </motion.div>
          )}
        </div>

        {compatibilityScore !== null && !isCalculating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Compatibility Implications Between Countries</h2>
            <div className="space-y-6">
              {Object.values(categories).map((category) => (
                <CategoryCard
                  key={category.title}
                  title={category.title}
                  score={compatibilityScore}
                  description=""
                  implications={category.implications}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Index;
