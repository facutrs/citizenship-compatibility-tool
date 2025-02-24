
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CountrySelectorProps {
  countries: string[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  otherCountry?: string;
}

const CountrySelector = ({ countries, value, onChange, label, otherCountry }: CountrySelectorProps) => {
  const availableCountries = otherCountry
    ? countries.filter(country => country !== otherCountry)
    : countries;

  return (
    <div className="space-y-2 animate-fadeIn">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
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
