
import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, XCircle, ChevronDown, ChevronUp } from "lucide-react";

interface CategoryCardProps {
  title: string;
  score: number;
  description: string;
  implications: string[];
}

const CategoryCard = ({ title, score, description, implications }: CategoryCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getIcon = () => {
    if (score >= 80) return <CheckCircle2 className="text-green-500 h-6 w-6" />;
    if (score >= 50) return <AlertTriangle className="text-amber-500 h-6 w-6" />;
    return <XCircle className="text-red-500 h-6 w-6" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
    >
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left"
      >
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            {getIcon()}
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </div>
      </button>
      
      <motion.div 
        initial={false}
        animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
        className="overflow-hidden"
      >
        <div className="space-y-4">
          {implications.length > 0 && (
            <ul className="space-y-2">
              {implications.map((implication, index) => (
                <li key={index} className="text-sm text-gray-500 flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-gray-400 mt-1.5" />
                  <span>{implication}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CategoryCard;
