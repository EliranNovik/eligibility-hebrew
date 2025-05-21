export interface Question {
  id: string;
  text: string;
  type: 'yesNo' | 'dropdown' | 'text' | 'date';
  options?: string[];
  section: 'german_5_entry' | 'german_116' | 'german_15' | 'german_5' | 'german_5_cat1' | 'german_5_cat2' | 'german_5_cat3' | 'german_5_cat4' | 'german_5_cat5' | 'austrian_58c' | 'general';
  required: boolean;
  categoryMatch?: string[];
}

export interface Answer {
  questionId: string;
  value: string | boolean;
}

export interface UserData {
  fullName: string;
  email: string;
  phone: string;
  comments: string;
}

export interface EligibilityResult {
  isEligible: boolean;
  eligibleSections: string[];
  explanation: string;
}

export interface FormState {
  answers: Answer[];
  currentStep: number;
  userData: UserData;
  eligibilityResult?: EligibilityResult;
} 