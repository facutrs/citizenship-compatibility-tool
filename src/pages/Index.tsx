
import React, { useState } from "react";
import CountrySelector from "@/components/CountrySelector";
import CompatibilityScore from "@/components/CompatibilityScore";
import CategoryCard from "@/components/CategoryCard";
import { motion } from "framer-motion";

const SAMPLE_COUNTRIES = ["USA", "Canada", "UK", "Australia", "France", "Germany", "Japan", "Spain"];

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

const Index = () => {
  const [country1, setCountry1] = useState("USA");
  const [country2, setCountry2] = useState("Canada");

  // Simulated compatibility calculation
  const compatibility = {
    overallScore: 85,
    categories: {
      legalStatus: { score: 90, description: "Both countries allow dual citizenship" },
      residencyRequirements: { score: 80, description: "Compatible residency requirements" },
      militaryService: { score: 70, description: "Some military service obligations may apply" },
      taxObligations: { score: 85, description: "Tax treaty in place between countries" },
      votingRights: { score: 75, description: "Similar voting rights with some restrictions" },
    },
  };

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
            countries={SAMPLE_COUNTRIES}
            value={country1}
            onChange={setCountry1}
            label="Primary Citizenship"
            otherCountry={country2}
          />
          <CountrySelector
            countries={SAMPLE_COUNTRIES}
            value={country2}
            onChange={setCountry2}
            label="Secondary Citizenship"
            otherCountry={country1}
          />
        </div>

        <div className="max-w-md mx-auto">
          <CompatibilityScore
            score={compatibility.overallScore}
            country1={country1}
            country2={country2}
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(DEFAULT_CATEGORIES).map(([key, category], index) => (
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
