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
    text: 'Was your ancestor persecuted by the Nazi regime?',
    type: 'yesNo',
    section: 'german_116',
    required: true
  },
  {
    id: 'german_116_5',
    text: 'Did your ancestor lose German citizenship between 1933–1945?',
    type: 'yesNo',
    section: 'german_116',
    required: true
  },
  {
    id: 'german_116_6',
    text: 'Did your ancestor or close relatives emigrate due to persecution after 1933?',
    type: 'yesNo',
    section: 'german_116',
    required: true
  },
  {
    id: 'german_116_7',
    text: 'What is your relation to that ancestor?',
    type: 'dropdown',
    options: ['Child', 'Grandchild', 'Great-grandchild'],
    section: 'german_116',
    required: true
  },

  // German Citizenship - §15 StAG
  {
    id: 'german_15_1',
    text: 'Did your ancestor live in Germany before 1933?',
    type: 'yesNo',
    section: 'german_15',
    required: true
  },
  {
    id: 'german_15_2',
    text: 'Was your ancestor not a German citizen?',
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

  // German Citizenship - §5 StAG
  {
    id: 'german_5_simple_1',
    text: 'Was your mother or grandmother ever a German citizen?',
    type: 'yesNo',
    section: 'german_5',
    required: true,
    categoryMatch: ['1', '3']
  },
  {
    id: 'german_5_simple_2',
    text: 'Did your mother or grandmother lose her German citizenship because she married a foreign man?',
    type: 'yesNo',
    section: 'german_5',
    required: true,
    categoryMatch: ['3', '4']
  },
  {
    id: 'german_5_simple_3',
    text: 'Was your father a German citizen, but your parents were not married at the time of your birth?',
    type: 'yesNo',
    section: 'german_5',
    required: true,
    categoryMatch: ['2', '4']
  },
  {
    id: 'german_5_simple_4',
    text: 'Were you or your parent unable to receive German citizenship because of the way the law treated women differently?',
    type: 'yesNo',
    section: 'german_5',
    required: true,
    categoryMatch: ['1', '2', '3', '4']
  },
  {
    id: 'german_5_simple_5',
    text: 'Did your mother or grandmother lose her citizenship when she married — even though your father was not German?',
    type: 'yesNo',
    section: 'german_5',
    required: true,
    categoryMatch: ['3']
  },
  {
    id: 'german_5_simple_6',
    text: 'Are you the child of someone affected by one of these situations?',
    type: 'yesNo',
    section: 'german_5',
    required: true,
    categoryMatch: ['5']
  },
  {
    id: 'german_5_simple_7',
    text: 'Were you born between 1949 and 1974?',
    type: 'yesNo',
    section: 'german_5',
    required: true,
    categoryMatch: ['1']
  },
  {
    id: 'german_5_simple_8',
    text: 'Were you born after 1974?',
    type: 'yesNo',
    section: 'german_5',
    required: true,
    categoryMatch: ['2']
  },
  {
    id: 'german_5_simple_9',
    text: 'Were your parents married at the time of your birth?',
    type: 'yesNo',
    section: 'german_5',
    required: true,
    categoryMatch: ['1', '2', '3', '4', '5']
  },
  {
    id: 'german_5_simple_10',
    text: 'If your parents were not married at your birth, did they marry after your birth?',
    type: 'yesNo',
    section: 'german_5',
    required: false,
    categoryMatch: ['1', '2', '3', '4', '5']
  },
  {
    id: 'german_5_simple_11',
    text: 'Was your mother or grandmother married before April 1953?',
    type: 'yesNo',
    section: 'german_5',
    required: true,
    categoryMatch: ['3']
  },

  // Austrian Citizenship - §58c
  {
    id: 'austrian_58c_1',
    text: 'Did your ancestor live in Austria before 15 May 1955?',
    type: 'yesNo',
    section: 'austrian_58c',
    required: true
  },
  {
    id: 'austrian_58c_2',
    text: 'Was your ancestor Jewish or otherwise persecuted by the Nazis?',
    type: 'yesNo',
    section: 'austrian_58c',
    required: true
  },
  {
    id: 'austrian_58c_3',
    text: 'Did your ancestor flee Austria between 1933 and 1955?',
    type: 'yesNo',
    section: 'austrian_58c',
    required: true
  },
  {
    id: 'austrian_58c_4',
    text: 'Did your ancestor lose or miss the opportunity to gain Austrian citizenship due to persecution?',
    type: 'yesNo',
    section: 'austrian_58c',
    required: true
  },
  {
    id: 'austrian_58c_6',
    text: 'Was your ancestor subject to citizenship of one of the countries on the following list?',
    type: 'yesNo',
    section: 'austrian_58c',
    required: true
  },
  {
    id: 'austrian_58c_5',
    text: 'What is your relation to that ancestor?',
    type: 'dropdown',
    options: ['Child', 'Grandchild', 'Great-grandchild', 'Further descendant'],
    section: 'austrian_58c',
    required: true
  },
]; 