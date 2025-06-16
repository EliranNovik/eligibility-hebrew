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
    text: 'Was your ancestor of Jewish descent or otherwise persecuted by the Nazi regime (1933–1945)?',
    type: 'yesNo',
    section: 'german_116',
    required: true
  },
  {
    id: 'german_116_2',
    text: 'Was your ancestor a German citizen — either before or during the Nazi era?',
    type: 'yesNo',
    section: 'german_116',
    required: true
  },
  {
    id: 'german_116_3',
    text: 'Was your ancestor a resident of Germany (within current borders) or of a territory under Nazi control at the time — even if they held foreign citizenship?',
    type: 'yesNo',
    section: 'german_116',
    required: true
  },
  {
    id: 'german_116_4',
    text: 'Did your ancestor flee due to persecution between 1933 and 1945?',
    type: 'yesNo',
    section: 'german_116',
    required: true
  },
  {
    id: 'german_116_4a',
    text: 'Did your ancestor leave Germany (or Nazi-controlled territory) between 1926 and 1933?',
    type: 'yesNo',
    section: 'german_116',
    required: true
  },
  //{
    //id: 'german_116_6',
    //text: 'What is your relation to that ancestor?',
    //type: 'dropdown',
   // options: ['Child', 'Grandchild', 'Great-grandchild', 'Further descendant'],
   // section: 'german_116',
   // required: true
  //},

  // German Citizenship - §15 StAG
  //{
   // id: 'german_15_1',
    //text: 'Was your ancestor NOT a German citizen before 1933?',
    //type: 'yesNo',
    //section: 'german_15',
    //required: true
 // },
  
  //{
  //  id: 'german_15_3',
    //text: 'Did your ancestor have their center of life in Germany (e.g., work, school, permanent residence)?',
    //type: 'yesNo',
    //section: 'german_15',
    //required: true
  //},
  //{
    //id: 'german_15_4',
    //text: 'Did your ancestor emigrate after 30 January 1933 due to Nazi persecution?',
    //type: 'yesNo',
    //section: 'german_15',
    //required: true
  //},
  {
    id: 'german_15_5',
    text: 'What is your relation to that person?',
    type: 'dropdown',
    options: ['Child', 'Grandchild', 'Great-grandchild', 'Further descendant', 'Not directly related'],
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

  // Section 5 - Earliest Known Ancestor Selection
  {
    id: 'german_5_earliest_ancestor',
    text: 'Who is your earliest known German ancestor?',
    type: 'dropdown',
    options: ['Mother', 'Father', 'Grandparent',],
    section: 'german_5',
    required: true
  },

  // Section 5 - Mother Path
  {
    id: 'german_5_mother_q1',
    text: 'Has your mother ever been a German citizen?\nExample: Did she ever have a German passport, ID, or grow up in Germany?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_mother_q2',
    text: 'Were you born after 23 May 1949?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_mother_q3',
    text: 'Was your father a citizen of a country other than Germany when you were born?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_mother_q4',
    text: 'Were your parents married before you were born?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_mother_q5',
    text: 'Did your mother marry a non-German man before 1 April 1953?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_mother_q6',
    text: 'Were you born after that marriage?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_mother_q7',
    text: 'Do you know if your parents were already married when you were born?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },

  // Section 5 - Father Path
  {
    id: 'german_5_father_q1',
    text: 'Was your father ever a German citizen?\nExample: Had a German passport, German ID, lived in Germany?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_father_q2',
    text: 'Were you born after 23 May 1949 and before 1 July 1993?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_father_q3',
    text: 'Was your mother not a German citizen when you were born?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_father_q4',
    text: 'Were your parents unmarried at the time of your birth?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_father_q5',
    text: 'Was your father officially recognized as your father before you turned 23? (For example: listed on your birth certificate, supported you, or signed any official papers?)',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },

  // Section 5 - Grandparent Path
  {
    id: 'german_5_grandparent_q1',
    text: 'Was your German grandparent your grandmother or your grandfather?',
    type: 'dropdown',
    options: ['Grandmother', 'Grandfather'],
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_grandparent_q2',
    text: 'Was this grandparent your mom\'s parent or your dad\'s parent?',
    type: 'dropdown',
    options: ["My mom's parent", "My dad's parent"],
    section: 'german_5',
    required: true
  },

  // Grandfather = Mother's Father (Mother under father path)
  {
    id: 'german_5_grandfather_mother_father_q1',
    text: 'Was your grandfather ever a German citizen?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_grandfather_mother_father_q2',
    text: 'Was your mother born after 23 May 1949 and before 1 July 1993?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_grandfather_mother_father_q3',
    text: 'Were you born after 23 May 1949?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_grandfather_mother_father_q4',
    text: "Was your grandmother (your mother's mother) not a German citizen?",
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_grandfather_mother_father_q5',
    text: 'Were your grandparents unmarried when your mother was born?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_grandfather_mother_father_q6',
    text: "Was your grandfather officially recognized as your mother's father before she turned 23? (Example: listed on birth certificate, signed papers, acknowledged legally)",
    type: 'yesNo',
    section: 'german_5',
    required: true
  },

  // Grandfather = Father's Father (Father under father path)
  {
    id: 'german_5_grandfather_father_father_q1',
    text: "Was your grandfather (your father's father) ever a German citizen?",
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_grandfather_father_father_q2',
    text: 'Was your father born after 23 May 1949 and before 1 July 1993?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_grandfather_father_father_q3',
    text: 'Were you born after 23 May 1949?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_grandfather_father_father_q4',
    text: "Was your grandmother (your father's mother) not a German citizen?",
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_grandfather_father_father_q5',
    text: 'Were your grandparents unmarried when your father was born?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_grandfather_father_father_q6',
    text: "Was your grandfather officially recognized as your father's father before he turned 23?",
    type: 'yesNo',
    section: 'german_5',
    required: true
  },

  // Grandmother = Mother's Mother (Mother under mother path)
  {
    id: 'german_5_grandmother_mother_mother_q1',
    text: 'Was your grandmother ever a German citizen?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_grandmother_mother_mother_q2',
    text: 'Was your mother born after 23 May 1949?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_grandmother_mother_mother_q3',
    text: 'Were you born after 23 May 1949?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_grandmother_mother_mother_q4',
    text: 'Was your grandfather not a German citizen?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_grandmother_mother_mother_q5',
    text: 'Were your grandparents married before your mother was born?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_grandmother_mother_mother_q6',
    text: 'Did your grandmother marry a non-German man before 1 April 1953?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_grandmother_mother_mother_q7',
    text: 'Was your mother born after that marriage?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_grandmother_mother_mother_q8',
    text: 'Do you know if your grandmother was already married when your mother was born?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },

  // Grandmother = Father's Mother (Father under mother path)
  {
    id: 'german_5_grandmother_father_mother_q1',
    text: 'Was your grandmother ever a German citizen?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_grandmother_father_mother_q2',
    text: 'Was your father born after 23 May 1949?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_grandmother_father_mother_q3',
    text: 'Were you born after 23 May 1949?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_grandmother_father_mother_q4',
    text: 'Was your grandfather not a German citizen?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_grandmother_father_mother_q5',
    text: 'Were your grandparents married before your father was born?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_grandmother_father_mother_q6',
    text: 'Did your grandmother marry a non-German man before 1 April 1953?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_grandmother_father_mother_q7',
    text: 'Was your father born after that marriage?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_grandmother_father_mother_q8',
    text: 'Do you know if your grandmother was already married when your father was born?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },

  // Section 5 - Great-grandparent Path (Basic Template)
  {
    id: 'german_5_greatgrandparent_q1',
    text: 'Was your great-grandparent ever a German citizen?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_greatgrandparent_q2',
    text: 'Do you know if your grandparent or parent was eligible for German citizenship through this great-grandparent?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  // Add more questions here as needed for the great-grandparent path

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