/**
 * lib/mock-candidates.ts
 * Sample candidate data for the Ballot Preview feature.
 * Representative of Indian constituencies.
 */

export interface Candidate {
  id: number;
  name: string;
  nameHi: string;
  party: string;
  symbol: string; // Lucide icon name or emoji for now
}

export const MOCK_CANDIDATES: Candidate[] = [
  { id: 1, name: "Anita Sharma", nameHi: "अनीता शर्मा", party: "Bhartiya Jan Dal", symbol: "Flower2" },
  { id: 2, name: "Rahul Deshmukh", nameHi: "राहुल देशमुख", party: "National Progress Party", symbol: "Hand" },
  { id: 3, name: "Siddharth Rao", nameHi: "सिद्धार्थ राव", party: "People's United Front", symbol: "Zap" },
  { id: 4, name: "Meena Kumari", nameHi: "मीना कुमारी", party: "Social Justice League", symbol: "Scale" },
  { id: 5, name: "Vikram Singh", nameHi: "विक्रम सिंह", party: "Modern India Party", symbol: "Laptop" },
  { id: 6, name: "Dr. Arvind Iyer", nameHi: "डॉ. अरविंद अय्यर", party: "Education First Party", symbol: "GraduationCap" },
  { id: 7, name: "Suresh G. Patil", nameHi: "सुरेश जी. पाटिल", party: "Farmers Unity Union", symbol: "Sprout" },
  { id: 8, name: "Kavita Reddy", nameHi: "कविता रेड्डी", party: "Women Empowerment Group", symbol: "Heart" },
  { id: 9, name: "Independent", nameHi: "निर्दलीय", party: "Independent", symbol: "User" },
  { id: 10, name: "Independent", nameHi: "निर्दलीय", party: "Independent", symbol: "Bike" },
];

export const NOTA_CANDIDATE: Candidate = {
  id: 16,
  name: "NOTA (None of the Above)",
  nameHi: "नोटा (इनमें से कोई भी नहीं)",
  party: "Election Commission of India",
  symbol: "Ban",
};
