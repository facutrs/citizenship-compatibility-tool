
import React, { useState, useEffect } from "react";
import CountrySelector from "@/components/CountrySelector";
import CompatibilityScore from "@/components/CompatibilityScore";
import CategoryCard from "@/components/CategoryCard";
import { motion } from "framer-motion";

const COUNTRIES = [
  "Anguilla", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", 
  "Austria", "Bahamas", "Belize", "Bermuda", "Brazil", "Cambodia", "Canada", 
  "Cayman Islands", "Chile", "Colombia", "Costa Rica", "Croatia", "Cyprus", 
  "Czech Republic", "Denmark", "Dominica", "Dominican Republic", "Ecuador", 
  "Egypt", "El Salvador", "Estonia", "Finland", "France", "Georgia", "Germany", 
  "Ghana", "Gibraltar", "Greece", "Grenada", "Honduras", "Hong Kong", "Hungary", 
  "Iceland", "India", "Indonesia", "Ireland", "Italy", "Japan", "Latvia", 
  "Lithuania", "Luxembourg", "Malaysia", "Malta", "Mauritius", "Mexico", 
  "Montenegro", "Netherlands", "New Zealand", "Norway", "Palau", "Panama", 
  "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Romania", "San Marino", 
  "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", 
  "South Africa", "South Korea", "Spain", "St. Kitts & Nevis", "St. Lucia", 
  "Sweden", "Switzerland", "Taiwan", "Thailand", "Turkey", "UAE", "UK", "Uruguay", 
  "USA", "Vietnam"
];

const DEFAULT_CATEGORIES = {
  legalStatus: {
    title: "Legal Status",
    implications: [
      "Valid passport from both countries required",
      "Must declare dual citizenship status",
      "No restrictions on holding public office",
    ],
  },
  residencyRequirements: {
    title: "Residency Requirements",
    implications: [
      "Minimum 183 days per year in primary country",
      "Physical presence test applies for tax purposes",
      "Must maintain valid address in both countries",
    ],
  },
  militaryService: {
    title: "Military Service",
    implications: [
      "Selective service registration required in US",
      "May impact security clearance eligibility",
      "Special permissions needed for military service",
    ],
  },
  taxObligations: {
    title: "Tax Obligations",
    implications: [
      "Annual tax returns required in both countries",
      "Foreign tax credits available",
      "FBAR reporting requirements apply",
    ],
  },
  votingRights: {
    title: "Voting Rights",
    implications: [
      "Cannot vote in certain local elections",
      "Must declare primary voting jurisdiction",
      "Special registration requirements apply",
    ],
  },
};

// Add country data
const COUNTRY_DATA: Record<string, {
  dualCitizenship: string;
  residencyYears: number;
  militaryService: string;
  taxTreaty: string;
  votingStatus: string;
}> = {
  USA: {
    dualCitizenship: "Yes",
    residencyYears: 5,
    militaryService: "De jure",
    taxTreaty: "Yes",
    votingStatus: "Universal"
  },
  Canada: {
    dualCitizenship: "Yes",
    residencyYears: 3,
    militaryService: "No",
    taxTreaty: "Yes",
    votingStatus: "Universal"
  },
  // Add more countries as needed
};

const calculateCompatibility = (country1: string, country2: string) => {
  const c1 = COUNTRY_DATA[country1];
  const c2 = COUNTRY_DATA[country2];

  if (!c1 || !c2) return null;

  const scores = {
    legalStatus: c1.dualCitizenship === "Yes" && c2.dualCitizenship === "Yes" ? 100 : 50,
    residencyRequirements: Math.max(0, 100 - Math.abs(c1.residencyYears - c2.residencyYears) * 10),
    militaryService: c1.militaryService === "No" && c2.militaryService === "No" ? 100 : 60,
    taxObligations: c1.taxTreaty === "Yes" && c2.taxTreaty === "Yes" ? 100 : 70,
    votingRights: c1.votingStatus === c2.votingStatus ? 100 : 75
  };

  const descriptions = {
    legalStatus: scores.legalStatus === 100 ? "Both countries allow dual citizenship" : "Some restrictions on dual citizenship",
    residencyRequirements: `Residency requirements differ by ${Math.abs(c1.residencyYears - c2.residencyYears)} years`,
    militaryService: scores.militaryService === 100 ? "No mandatory military service" : "Military service obligations may apply",
    taxObligations: scores.taxObligations === 100 ? "Tax treaty in place between countries" : "Limited tax agreements",
    votingRights: scores.votingRights === 100 ? "Similar voting rights" : "Different voting regulations"
  };

  const overallScore = Math.round(
    Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.keys(scores).length
  );

  return { overallScore, scores, descriptions };
};

const Index = () => {
  const [country1, setCountry1] = useState("USA");
  const [country2, setCountry2] = useState("Canada");
  const [compatibility, setCompatibility] = useState<{
    overallScore: number;
    scores: Record<string, number>;
    descriptions: Record<string, string>;
  } | null>(null);

  useEffect(() => {
    const result = calculateCompatibility(country1, country2);
    if (result) {
      setCompatibility({
        overallScore: result.overallScore,
        categories: Object.keys(DEFAULT_CATEGORIES).reduce((acc, key) => ({
          ...acc,
          [key]: {
            score: result.scores[key],
            description: result.descriptions[key]
          }
        }), {})
      });
    }
  }, [country1, country2]);

  if (!compatibility) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sage-50 to-sage-100">
      <div className="container mx-auto py-12 px-4 space-y-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold text-gray-900">Citizenship Compatibility Tool</h1>
          <p className="text-lg text-gray-600">Compare citizenship requirements and benefits between countries</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <CountrySelector
            countries={COUNTRIES}
            value={country1}
            onChange={setCountry1}
            label="Primary Citizenship"
            otherCountry={country2}
            type="primary"
          />
          <CountrySelector
            countries={COUNTRIES}
            value={country2}
            onChange={setCountry2}
            label="Secondary Citizenship"
            otherCountry={country1}
            type="secondary"
          />
        </div>

        <div className="max-w-2xl mx-auto">
          <CompatibilityScore
            score={compatibility.overallScore}
            country1={country1}
            country2={country2}
          />
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {Object.entries(DEFAULT_CATEGORIES).map(([key, category]) => (
            <CategoryCard
              key={key}
              title={category.title}
              score={compatibility.categories[key as keyof typeof compatibility.categories].score}
              description={compatibility.categories[key as keyof typeof compatibility.categories].description}
              implications={category.implications}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
