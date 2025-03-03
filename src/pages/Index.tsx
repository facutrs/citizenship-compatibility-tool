<lov-code>
import React, { useState, useEffect } from "react";
import CountrySelector from "@/components/CountrySelector";
import CompatibilityScore from "@/components/CompatibilityScore";
import CategoryCard from "@/components/CategoryCard";
import { motion } from "framer-motion";
import { 
  calculateCompatibility, 
  getLegalStatusImplications, 
  getResidencyImplications, 
  getMilitaryServiceImplications, 
  getTaxObligationsImplications, 
  getVotingRightsImplications 
} from "@/utils/compatibilityCalculator";

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
    implications: [],
  },
  residency: {
    title: "Residency",
    implications: [],
  },
  militaryService: {
    title: "Military Service",
    implications: [],
  },
  taxObligations: {
    title: "Tax Obligations",
    implications: [],
  },
  votingRights: {
    title: "Voting Rights",
    implications: [],
  },
};

interface CountryData {
  countryId: string;
  dualCitizenship: "Yes" | "No" | "Conditional";
  residencyYears: number;
  militaryService: "Yes" | "No" | "De jure" | "Choice" | "Infrequent";
  taxTreaty: "Yes" | "No" | "Several countries";
  votingStatus: string;
  citizenshipByDescent?: string;
  citizenshipByMarriage?: string;
}

const COUNTRY_DATA: Record<string, CountryData> = {
  "Anguilla": {
    "countryId": "AI",
    "dualCitizenship": "Yes",
    "residencyYears": 5,
    "militaryService": "No",
    "taxTreaty": "No",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 3 years"
  },
  "Antigua and Barbuda": {
    "countryId": "AG",
    "dualCitizenship": "Yes",
    "residencyYears": 7,
    "militaryService": "No",
    "taxTreaty": "No",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 3 years"
  },
  "Argentina": {
    "countryId": "AR",
    "dualCitizenship": "Yes",
    "residencyYears": 2,
    "militaryService": "De jure",
    "taxTreaty": "No",
    "votingStatus": "Universal and Compulsory",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 2 years"
  },
  "Armenia": {
    "countryId": "AM",
    "dualCitizenship": "Yes",
    "residencyYears": 3,
    "militaryService": "Yes",
    "taxTreaty": "No",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 2 years"
  },
  "Australia": {
    "countryId": "AU",
    "dualCitizenship": "Yes",
    "residencyYears": 4,
    "militaryService": "No",
    "taxTreaty": "Yes",
    "votingStatus": "Universal and Compulsory",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 4 years"
  },
  "Austria": {
    "countryId": "AT",
    "dualCitizenship": "Conditional",
    "residencyYears": 10,
    "militaryService": "Yes",
    "taxTreaty": "Yes",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 6 years"
  },
  "Bahamas": {
    "countryId": "BS",
    "dualCitizenship": "No",
    "residencyYears": 6,
    "militaryService": "No",
    "taxTreaty": "No",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Belize": {
    "countryId": "BZ",
    "dualCitizenship": "Yes",
    "residencyYears": 5,
    "militaryService": "De jure",
    "taxTreaty": "No",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 1 year"
  },
  "Bermuda": {
    "countryId": "BM",
    "dualCitizenship": "Yes",
    "residencyYears": 10,
    "militaryService": "No",
    "taxTreaty": "No",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 10 years"
  },
  "Brazil": {
    "countryId": "BR",
    "dualCitizenship": "Yes",
    "residencyYears": 4,
    "militaryService": "Yes",
    "taxTreaty": "Yes",
    "votingStatus": "Universal and Compulsory",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 1 year"
  },
  "Cambodia": {
    "countryId": "KH",
    "dualCitizenship": "Yes",
    "residencyYears": 7,
    "militaryService": "Yes",
    "taxTreaty": "No",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 3 years"
  },
  "Canada": {
    "countryId": "CA",
    "dualCitizenship": "Yes",
    "residencyYears": 3,
    "militaryService": "No",
    "taxTreaty": "Yes",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 3 years"
  },
  "Cayman Islands": {
    "countryId": "KY",
    "dualCitizenship": "Yes",
    "residencyYears": 5,
    "militaryService": "No",
    "taxTreaty": "No",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Chile": {
    "countryId": "CL",
    "dualCitizenship": "Yes",
    "residencyYears": 5,
    "militaryService": "Infrequent",
    "taxTreaty": "Yes",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Colombia": {
    "countryId": "CO",
    "dualCitizenship": "Yes",
    "residencyYears": 5,
    "militaryService": "Yes",
    "taxTreaty": "No",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Costa Rica": {
    "countryId": "CR",
    "dualCitizenship": "Yes",
    "residencyYears": 7,
    "militaryService": "No",
    "taxTreaty": "No",
    "votingStatus": "Universal and Compulsory",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Croatia": {
    "countryId": "HR",
    "dualCitizenship": "Yes",
    "residencyYears": 8,
    "militaryService": "No",
    "taxTreaty": "Yes",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Cyprus": {
    "countryId": "CY",
    "dualCitizenship": "Yes",
    "residencyYears": 7,
    "militaryService": "Yes",
    "taxTreaty": "Yes",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Czech Republic": {
    "countryId": "CZ",
    "dualCitizenship": "Yes",
    "residencyYears": 5,
    "militaryService": "No",
    "taxTreaty": "Yes",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Denmark": {
    "countryId": "DK",
    "dualCitizenship": "Yes",
    "residencyYears": 7,
    "militaryService": "Yes",
    "taxTreaty": "Yes",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Dominica": {
    "countryId": "DM",
    "dualCitizenship": "Yes",
    "residencyYears": 5,
    "militaryService": "No",
    "taxTreaty": "No",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Dominican Republic": {
    "countryId": "DO",
    "dualCitizenship": "Yes",
    "residencyYears": 2,
    "militaryService": "No",
    "taxTreaty": "No",
    "votingStatus": "Universal and Compulsory",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Ecuador": {
    "countryId": "EC",
    "dualCitizenship": "Yes",
    "residencyYears": 3,
    "militaryService": "No",
    "taxTreaty": "No",
    "votingStatus": "Universal and Compulsory",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Egypt": {
    "countryId": "EG",
    "dualCitizenship": "Conditional",
    "residencyYears": 10,
    "militaryService": "Yes",
    "taxTreaty": "No",
    "votingStatus": "Universal and Compulsory",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "El Salvador": {
    "countryId": "SV",
    "dualCitizenship": "Yes",
    "residencyYears": 5,
    "militaryService": "Yes",
    "taxTreaty": "No",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Estonia": {
    "countryId": "EE",
    "dualCitizenship": "Conditional",
    "residencyYears": 8,
    "militaryService": "Yes",
    "taxTreaty": "Yes",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Finland": {
    "countryId": "FI",
    "dualCitizenship": "Yes",
    "residencyYears": 5,
    "militaryService": "Yes",
    "taxTreaty": "Yes",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "France": {
    "countryId": "FR",
    "dualCitizenship": "Yes",
    "residencyYears": 5,
    "militaryService": "No",
    "taxTreaty": "Yes",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Georgia": {
    "countryId": "GE",
    "dualCitizenship": "No",
    "residencyYears": 10,
    "militaryService": "Yes",
    "taxTreaty": "Yes",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Germany": {
    "countryId": "DE",
    "dualCitizenship": "Conditional",
    "residencyYears": 8,
    "militaryService": "No",
    "taxTreaty": "Yes",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Ghana": {
    "countryId": "GH",
    "dualCitizenship": "Conditional",
    "residencyYears": 5,
    "militaryService": "No",
    "taxTreaty": "Yes",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Gibraltar": {
    "countryId": "GI",
    "dualCitizenship": "Yes",
    "residencyYears": 5,
    "militaryService": "No",
    "taxTreaty": "No",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Greece": {
    "countryId": "GR",
    "dualCitizenship": "Yes",
    "residencyYears": 7,
    "militaryService": "Yes",
    "taxTreaty": "Yes",
    "votingStatus": "Universal and Compulsory",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Grenada": {
    "countryId": "GD",
    "dualCitizenship": "Yes",
    "residencyYears": 7,
    "militaryService": "No",
    "taxTreaty": "No",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Honduras": {
    "countryId": "HN",
    "dualCitizenship": "Conditional",
    "residencyYears": 3,
    "militaryService": "No",
    "taxTreaty": "No",
    "votingStatus": "Universal and Compulsory",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Hong Kong": {
    "countryId": "HK",
    "dualCitizenship": "No",
    "residencyYears": 7,
    "militaryService": "No",
    "taxTreaty": "Yes",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Hungary": {
    "countryId": "HU",
    "dualCitizenship": "Yes",
    "residencyYears": 8,
    "militaryService": "No",
    "taxTreaty": "Yes",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Iceland": {
    "countryId": "IS",
    "dualCitizenship": "Yes",
    "residencyYears": 7,
    "militaryService": "No",
    "taxTreaty": "Yes",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "India": {
    "countryId": "IN",
    "dualCitizenship": "Conditional",
    "residencyYears": 5,
    "militaryService": "No",
    "taxTreaty": "Yes",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Indonesia": {
    "countryId": "ID",
    "dualCitizenship": "Conditional",
    "residencyYears": 5,
    "militaryService": "De jure",
    "taxTreaty": "Yes",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Ireland": {
    "countryId": "IE",
    "dualCitizenship": "Yes",
    "residencyYears": 5,
    "militaryService": "No",
    "taxTreaty": "Yes",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Italy": {
    "countryId": "IT",
    "dualCitizenship": "Yes",
    "residencyYears": 10,
    "militaryService": "No",
    "taxTreaty": "Yes",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Japan": {
    "countryId": "JP",
    "dualCitizenship": "No",
    "residencyYears": 5,
    "militaryService": "No",
    "taxTreaty": "Yes",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Latvia": {
    "countryId": "LV",
    "dualCitizenship": "Conditional",
    "residencyYears": 5,
    "militaryService": "No",
    "taxTreaty": "Yes",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Lithuania": {
    "countryId": "LT",
    "dualCitizenship": "Conditional",
    "residencyYears": 10,
    "militaryService": "Yes",
    "taxTreaty": "Yes",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Luxembourg": {
    "countryId": "LU",
    "dualCitizenship": "Yes",
    "residencyYears": 7,
    "militaryService": "No",
    "taxTreaty": "Yes",
    "votingStatus": "Universal and Compulsory",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Malaysia": {
    "countryId": "MY",
    "dualCitizenship": "No",
    "residencyYears": 10,
    "militaryService": "No",
    "taxTreaty": "Yes",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Malta": {
    "countryId": "MT",
    "dualCitizenship": "Yes",
    "residencyYears": 5,
    "militaryService": "No",
    "taxTreaty": "Yes",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Mauritius": {
    "countryId": "MU",
    "dualCitizenship": "Yes",
    "residencyYears": 5,
    "militaryService": "No",
    "taxTreaty": "Yes",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Mexico": {
    "countryId": "MX",
    "dualCitizenship": "Yes",
    "residencyYears": 5,
    "militaryService": "Yes",
    "taxTreaty": "Yes",
    "votingStatus": "Universal and Compulsory",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Montenegro": {
    "countryId": "ME",
    "dualCitizenship": "Yes",
    "residencyYears": 10,
    "militaryService": "No",
    "taxTreaty": "No",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Netherlands": {
    "countryId": "NL",
    "dualCitizenship": "Conditional",
    "residencyYears": 5,
    "militaryService": "No",
    "taxTreaty": "Yes",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "New Zealand": {
    "countryId": "NZ",
    "dualCitizenship": "Yes",
    "residencyYears": 5,
    "militaryService": "No",
    "taxTreaty": "Yes",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Norway": {
    "countryId": "NO",
    "dualCitizenship": "Yes",
    "residencyYears": 7,
    "militaryService": "Yes",
    "taxTreaty": "Yes",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Palau": {
    "countryId": "PW",
    "dualCitizenship": "No",
    "residencyYears": 5,
    "militaryService": "No",
    "taxTreaty": "No",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Panama": {
    "countryId": "PA",
    "dualCitizenship": "Conditional",
    "residencyYears": 5,
    "militaryService": "No",
    "taxTreaty": "No",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Paraguay": {
    "countryId": "PY",
    "dualCitizenship": "Yes",
    "residencyYears": 3,
    "militaryService": "Yes",
    "taxTreaty": "No",
    "votingStatus": "Universal and Compulsory",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Peru": {
    "countryId": "PE",
    "dualCitizenship": "Yes",
    "residencyYears": 2,
    "militaryService": "No",
    "taxTreaty": "Yes",
    "votingStatus": "Universal and Compulsory",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Philippines": {
    "countryId": "PH",
    "dualCitizenship": "Conditional",
    "residencyYears": 10,
    "militaryService": "No",
    "taxTreaty": "Yes",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Poland": {
    "countryId": "PL",
    "dualCitizenship": "Yes",
    "residencyYears": 3,
    "militaryService": "De jure",
    "taxTreaty": "Yes",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Portugal": {
    "countryId": "PT",
    "dualCitizenship": "Yes",
    "residencyYears": 5,
    "militaryService": "De jure",
    "taxTreaty": "Yes",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Romania": {
    "countryId": "RO",
    "dualCitizenship": "Yes",
    "residencyYears": 5,
    "militaryService": "No",
    "taxTreaty": "Yes",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "San Marino": {
    "countryId": "SM",
    "dualCitizenship": "No",
    "residencyYears": 30,
    "militaryService": "De jure",
    "taxTreaty": "No",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Seychelles": {
    "countryId": "SC",
    "dualCitizenship": "Yes",
    "residencyYears": 5,
    "militaryService": "No",
    "taxTreaty": "Yes",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Sierra Leone": {
    "countryId": "SL",
    "dualCitizenship": "No",
    "residencyYears": 5,
    "militaryService": "No",
    "taxTreaty": "No",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Singapore": {
    "countryId": "SG",
    "dualCitizenship": "No",
    "residencyYears": 2,
    "militaryService": "Yes",
    "taxTreaty": "Yes",
    "votingStatus": "Universal and Compulsory",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Slovakia": {
    "countryId": "SK",
    "dualCitizenship": "Conditional",
    "residencyYears": 8,
    "militaryService": "De jure",
    "taxTreaty": "Yes",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Slovenia": {
    "countryId": "SI",
    "dualCitizenship": "Conditional",
    "residencyYears": 10,
    "militaryService": "No",
    "taxTreaty": "Yes",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "South Africa": {
    "countryId": "ZA",
    "dualCitizenship": "Conditional",
    "residencyYears": 5,
    "militaryService": "No",
    "taxTreaty": "Yes",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "South Korea": {
    "countryId": "KR",
    "dualCitizenship": "Conditional",
    "residencyYears": 5,
    "militaryService": "Yes",
    "taxTreaty": "Yes",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Spain": {
    "countryId": "ES",
    "dualCitizenship": "Conditional",
    "residencyYears": 10,
    "militaryService": "De jure",
    "taxTreaty": "Yes",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "St. Kitts & Nevis": {
    "countryId": "KN",
    "dualCitizenship": "Yes",
    "residencyYears": 5,
    "militaryService": "No",
    "taxTreaty": "No",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "St. Lucia": {
    "countryId": "LC",
    "dualCitizenship": "Yes",
    "residencyYears": 5,
    "militaryService": "No",
    "taxTreaty": "No",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Sweden": {
    "countryId": "SE",
    "dualCitizenship": "Yes",
    "residencyYears": 5,
    "militaryService": "Yes",
    "taxTreaty": "Yes",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Switzerland": {
    "countryId": "CH",
    "dualCitizenship": "Yes",
    "residencyYears": 10,
    "militaryService": "Choice",
    "taxTreaty": "Yes",
    "votingStatus": "Universal",
    "citizenshipByDescent": "Yes, if born to citizens",
    "citizenshipByMarriage": "After 5 years"
  },
  "Taiwan": {
    "countryId": "TW",
    "dualCitizenship": "Conditional",
    "residencyYears": 5,
    "militaryService": "Yes",
    "taxTreaty": "No",
    
