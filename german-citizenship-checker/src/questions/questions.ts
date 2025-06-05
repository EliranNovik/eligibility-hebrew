import type { Question } from '../types';

export const questions: Question[] = [
  // Initial country selection
  {
    id: 'country_selection',
    text: 'Which country\'s citizenship eligibility would you like to check?',
    type: 'dropdown',
    options: ['Germany', 'Austria'],
    section: 'general',
    required: true
  },

  // German Citizenship - §116 StAG
  {
    id: 'german_116_1',
    text: 'Was your ancestor of Jewish descent?',
    type: 'yesNo',
    section: 'german_116',
    required: true
  },
  {
    id: 'german_116_2',
    text: 'Did your ancestor hold German citizenship before 1933?',
    type: 'yesNo',
    section: 'german_116',
    required: true
  },
  {
    id: 'german_116_3',
    text: 'Did your ancestor live in Germany before 1933?',
    type: 'yesNo',
    section: 'german_116',
    required: true
  },
  {
    id: 'german_116_4',
    text: 'Did your ancestor have their center of life in Germany (e.g., work, school, permanent residence)?',
    type: 'yesNo',
    section: 'german_116',
    required: true
  },
  {
    id: 'german_116_5',
    text: 'Did your ancestor or close relatives emigrate due to persecution after 1933?',
    type: 'yesNo',
    section: 'german_116',
    required: true
  },
  {
    id: 'german_116_6',
    text: 'What is your relation to that ancestor?',
    type: 'dropdown',
    options: ['Child', 'Grandchild', 'Great-grandchild', 'Further descendant'],
    section: 'german_116',
    required: true
  },

  // German Citizenship - §15 StAG
  {
    id: 'german_15_1',
    text: 'Was your ancestor NOT a German citizen before 1933?',
    type: 'yesNo',
    section: 'german_15',
    required: true
  },
  
  {
    id: 'german_15_3',
    text: 'Did your ancestor have their center of life in Germany (e.g., work, school, permanent residence)?',
    type: 'yesNo',
    section: 'german_15',
    required: true
  },
  {
    id: 'german_15_4',
    text: 'Did your ancestor emigrate after 30 January 1933 due to Nazi persecution?',
    type: 'yesNo',
    section: 'german_15',
    required: true
  },
  {
    id: 'german_15_5',
    text: 'What is your relation to that person?',
    type: 'dropdown',
    options: ['Child', 'Grandchild', 'Great-grandchild'],
    section: 'german_15',
    required: true
  },

  // Section 5 - German Citizenship Eligibility Questions (Simplified)
  {
    id: 'german_5_q1',
    text: 'Was your mother ever a German citizen?',
    type: 'yesNo',
    section: 'german_5',
    required: true,
    categoryMatch: ['1']
  },
  {
    id: 'german_5_q2',
    text: 'Were you born before January 1, 1975?',
    type: 'yesNo',
    section: 'german_5',
    required: true,
    categoryMatch: ['1']
  },
  {
    id: 'german_5_q3',
    text: 'Did you not receive German citizenship at birth?',
    type: 'yesNo',
    section: 'german_5',
    required: true,
    categoryMatch: ['1']
  },
  {
    id: 'german_5_q4',
    text: 'Was your father a German citizen?',
    type: 'yesNo',
    section: 'german_5',
    required: true,
    categoryMatch: ['2']
  },
  {
    id: 'german_5_q5',
    text: 'Did your parents marry after your birth?',
    type: 'yesNo',
    section: 'german_5',
    required: true,
    categoryMatch: ['2']
  },
  {
    id: 'german_5_q7',
    text: 'Was your grandmother ever a German citizen?',
    type: 'yesNo',
    section: 'german_5',
    required: true,
    categoryMatch: ['3']
  },
  {
    id: 'german_5_q8',
    text: 'Did your grandmother lose her German citizenship because she married a foreign man?',
    type: 'yesNo',
    section: 'german_5',
    required: true,
    categoryMatch: ['3']
  },
  {
    id: 'german_5_q9',
    text: 'Did your mother marry before April 1, 1953?',
    type: 'yesNo',
    section: 'german_5',
    required: true,
    categoryMatch: ['3']
  },
  {
    id: 'german_5_q10',
    text: 'Are you the child of someone affected by any of these situations?',
    type: 'yesNo',
    section: 'german_5',
    required: true,
    categoryMatch: ['5']
  },
  {
    id: 'german_5_q11',
    text: 'Was your parent or grandparent ever denied German citizenship?',
    type: 'yesNo',
    section: 'german_5',
    required: false,
    categoryMatch: ['5']
  },

  // Austrian Citizenship - §58c
  {
    id: 'austrian_58c_1',
    text: 'Did any of your ancestors live in Austria (as it is today) before 1955?',
    type: 'yesNo',
    section: 'austrian_58c',
    required: true
  },
  {
    id: 'austrian_58c_2',
    text: 'Was that ancestor one of the following?',
    type: 'yesNo',
    section: 'austrian_58c',
    required: true
  },
  {
    id: 'austrian_58c_3',
    text: 'Was your ancestor ever in danger from the Nazis?',
    type: 'yesNo',
    section: 'austrian_58c',
    required: true
  },
  //{
   // id: 'austrian_58c_3',
    //text: 'Did your ancestor flee Austria between 1933 and 1955?',
    //type: 'yesNo',
    //section: 'austrian_58c',
    //required: true
  //},
  
  {
    id: 'austrian_58c_4',
    text: 'What is your relation to that ancestor?',
    type: 'dropdown',
    options: ['Child', 'Grandchild', 'Great-grandchild', 'Further descendant'],
    section: 'austrian_58c',
    required: true
  },
]; 