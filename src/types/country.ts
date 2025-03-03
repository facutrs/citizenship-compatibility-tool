export interface CountryData {
  countryId: string;
  dualCitizenship: "Yes" | "No" | "Conditional";
  residencyYears: number;
  militaryService: "Yes" | "No" | "De jure" | "Infrequent" | "Choice";
  taxTreaty: "Yes" | "No" | "Several countries";
  votingStatus: "Universal" | "Universal and Compulsory" | "Selective";
  citizenshipByBirth?: "Yes" | "No" | "Conditional";
  citizenshipByDescent?: string;
  citizenshipByMarriage?: string;
  residencyCriteriaBlurb?: string;
  taxationCriteria?: string;
  taxationType?: "Residence-based" | "Territorial" | "No personal income tax" | "Citizenship-based";
}

export const COUNTRY_DATA: Record<string, CountryData> = {
  "Anguilla": {
    "countryId": "AI",
    "dualCitizenship": "Yes",
    "residencyYears": 5,
    "militaryService": "No",
    "taxTreaty": "No",
    "votingStatus": "Universal",
    "citizenshipByBirth": "No",
    "citizenshipByDescent": "Yes",
    "citizenshipByMarriage": "5 years",
    "residencyCriteriaBlurb": "Foreign individuals are considered residents if they spent at least 45 days per year on the island for two consecutive years",
    "taxationType": "No personal income tax"
  },
  "Antigua and Barbuda": {
    "countryId": "AG",
    "dualCitizenship": "Yes",
    "residencyYears": 7,
    "militaryService": "No",
    "taxTreaty": "No",
    "votingStatus": "Universal",
    "citizenshipByBirth": "No",
    "citizenshipByDescent": "Yes",
    "citizenshipByMarriage": "3 years",
    "residencyCriteriaBlurb": "Foreign individuals become tax residents after residing in Antigua and Barbuda for at least 183 days in a calendar year",
    "taxationType": "No personal income tax"
  },
  "Argentina": {
    "countryId": "AR",
    "dualCitizenship": "Yes",
    "residencyYears": 2,
    "militaryService": "De jure",
    "taxTreaty": "No",
    "votingStatus": "Universal and Compulsory",
    "citizenshipByBirth": "Yes",
    "citizenshipByDescent": "Yes",
    "citizenshipByMarriage": "0 years",
    "residencyCriteriaBlurb": "Foreign individuals are considered tax residents if assigned to work in Argentina for more than five years, or if residing in Argentina for more than 12 months (as of the 13th month).",
    "taxationType": "Residence-based"
  },
  "Canada": {
    "countryId": "CA",
    "dualCitizenship": "Yes",
    "residencyYears": 3,
    "militaryService": "No",
    "taxTreaty": "Yes",
    "votingStatus": "Universal",
    "citizenshipByBirth": "Yes",
    "citizenshipByDescent": "Yes",
    "citizenshipByMarriage": "3 years",
    "residencyCriteriaBlurb": "Foreign individuals are considered residents if they maintain a dwelling place available for their occupation, have their spouse and dependents residing in Canada, or sojourn in Canada for 183 days or more in a calendar year.",
    "taxationType": "Residence-based"
  },
  "USA": {
    "countryId": "US",
    "dualCitizenship": "Yes",
    "residencyYears": 5,
    "militaryService": "De jure",
    "taxTreaty": "Several countries",
    "votingStatus": "Universal",
    "citizenshipByBirth": "Yes",
    "citizenshipByDescent": "Yes",
    "citizenshipByMarriage": "3 years",
    "residencyCriteriaBlurb": "Foreign individuals are considered residents if they have a green card, or if they meet the substantial presence test (physically present for at least 31 days in the current year and 183 days during a 3-year period).",
    "taxationType": "Citizenship-based"
  },
  "Japan": {
    "countryId": "JP",
    "dualCitizenship": "No",
    "residencyYears": 5,
    "militaryService": "No",
    "taxTreaty": "Yes",
    "votingStatus": "Universal",
    "citizenshipByBirth": "No",
    "citizenshipByDescent": "Yes",
    "citizenshipByMarriage": "3 years",
    "residencyCriteriaBlurb": "Foreign individuals are considered residents if they have their domicile in Japan, or have resided in Japan for a continuous period of at least 1 year.",
    "taxationType": "Residence-based"
  }
};
