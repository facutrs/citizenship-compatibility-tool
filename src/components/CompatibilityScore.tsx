
import React from "react";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

interface CompatibilityScoreProps {
  score: number;
  country1: string;
  country2: string;
}

const CompatibilityScore = ({ score, country1, country2 }: CompatibilityScoreProps) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg animate-fadeIn">
      <div className="flex items-center justify-between space-x-4">
        <div className="text-sage-600 font-semibold text-right flex-1">{country1}</div>
        <div className="flex-1">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-6xl font-bold text-sage-700 text-center"
          >
            {score}%
          </motion.div>
          <Progress value={score} className="w-full h-2 mt-2" />
          <div className="text-sm text-gray-500 mt-2 text-center">Compatibility Score</div>
        </div>
        <div className="text-sage-600 font-semibold flex-1">{country2}</div>
      </div>
    </div>
  );
};

export default CompatibilityScore;
