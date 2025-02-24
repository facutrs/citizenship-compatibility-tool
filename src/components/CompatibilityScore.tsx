
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
      <div className="text-center space-y-4">
        <div className="text-sage-600 font-semibold">{country1}</div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-6xl font-bold text-sage-700"
        >
          {score}%
        </motion.div>
        <Progress value={score} className="w-full h-2" />
        <div className="text-sage-600 font-semibold">{country2}</div>
        <div className="text-sm text-gray-500 mt-2">Compatibility Score</div>
      </div>
    </div>
  );
};

export default CompatibilityScore;
