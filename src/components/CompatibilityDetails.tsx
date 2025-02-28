
import React from "react";
import { CategoryScore } from "@/utils/compatibilityCalculator";
import CategoryCard from "./CategoryCard";

interface CompatibilityDetailsProps {
  categories: CategoryScore[];
}

const CompatibilityDetails = ({ categories }: CompatibilityDetailsProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Detailed Compatibility Analysis</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => (
          <CategoryCard
            key={category.name}
            title={category.name}
            score={category.score}
            description={category.description}
            implications={category.implications}
          />
        ))}
      </div>
    </div>
  );
};

export default CompatibilityDetails;
