
import React from "react";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

interface CompatibilityScoreProps {
  score: number;
  country1: string;
  country2: string;
  country1Id?: string;
  country2Id?: string;
}

const CompatibilityScore = ({ score, country1, country2, country1Id, country2Id }: CompatibilityScoreProps) => {
  const getGradientColor = (score: number) => {
    if (score >= 80) return "from-green-500 to-green-600";
    if (score >= 60) return "from-yellow-500 to-yellow-600";
    return "from-red-500 to-red-600";
  };

  const getFlag = (countryId?: string) => {
    if (!countryId) return "";
    const codePoints = countryId
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg animate-fadeIn">
      <div className="flex items-center justify-between space-x-4">
        <div className="flex items-center gap-2 flex-1">
          <span className="text-7xl">{getFlag(country1Id)}</span>
          <span className="text-sage-600 font-semibold">{country1}</span>
        </div>
        <div className="flex-1">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className={`text-6xl font-bold text-center bg-gradient-to-r ${getGradientColor(score)} bg-clip-text text-transparent`}
          >
            {score}%
          </motion.div>
          <Progress 
            value={score} 
            className={`w-full h-2 mt-2 bg-gray-200 rounded-full overflow-hidden`}
            style={{
              background: 'rgb(229 231 235)',
            }}
          >
            <div
              className={`h-full transition-all bg-gradient-to-r ${getGradientColor(score)}`}
              style={{ width: `${score}%` }}
            />
          </Progress>
          <div className="text-sm text-gray-500 mt-2 text-center">Citizenship Compatibility Score</div>
        </div>
        <div className="flex items-center gap-2 flex-1 justify-end">
          <span className="text-sage-600 font-semibold">{country2}</span>
          <span className="text-7xl">{getFlag(country2Id)}</span>
        </div>
      </div>
    </div>
  );
};

export default CompatibilityScore;
