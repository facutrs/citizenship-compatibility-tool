
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, MapPin } from "lucide-react";

interface CountrySelectorProps {
  countries: string[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  otherCountry?: string;
  type: "primary" | "secondary";
}

const CountrySelector = ({ countries, value, onChange, label, otherCountry, type }: CountrySelectorProps) => {
  const availableCountries = otherCountry
    ? countries.filter(country => country !== otherCountry)
    : countries;

  return (
    <div className="space-y-2 animate-fadeIn bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        {type === "primary" ? <Globe className="h-5 w-5 text-sage-500" /> : <MapPin className="h-5 w-5 text-sage-500" />}
        {label}
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full bg-white/50 backdrop-blur-sm border-sage-200 hover:border-sage-300 transition-colors">
          <SelectValue placeholder="Select a country" />
        </SelectTrigger>
        <SelectContent>
          {availableCountries.map((country) => (
            <SelectItem key={country} value={country}>
              {country}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CountrySelector;
