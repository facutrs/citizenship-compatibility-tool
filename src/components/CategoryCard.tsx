
import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

interface CategoryCardProps {
  title: string;
  score: number;
  description: string;
  implications: string[];
}

const CategoryCard = ({ title, score, description, implications }: CategoryCardProps) => {
  const getIcon = () => {
    if (score >= 80) return <CheckCircle2 className="text-sage-500 h-6 w-6" />;
    if (score >= 50) return <AlertTriangle className="text-amber-500 h-6 w-6" />;
    return <XCircle className="text-red-500 h-6 w-6" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center gap-3 mb-4">
        {getIcon()}
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="space-y-4">
        <p className="text-gray-600">{description}</p>
        <ul className="space-y-2">
          {implications.map((implication, index) => (
            <li key={index} className="text-sm text-gray-500 flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-sage-400" />
              {implication}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default CategoryCard;
