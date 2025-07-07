import type { Question } from '../types';

export const questions: Question[] = [
  // Initial country selection
  {
    id: 'country_selection',
    text: 'איזרות של איזו מדינה תרצה לבדוק?',
    type: 'dropdown',
    options: ['גרמניה', 'אוסטריה'],
    section: 'general',
    required: true
  },

  // German Citizenship - §116 StAG
  {
    id: 'german_116_1',
    text: 'האם אבותיך היו ממוצא יהודי או נרדפו על ידי המשטר הנאצי (1933–1945)?',
    type: 'yesNo',
    section: 'german_116',
    required: true
  },
  {
    id: 'german_116_2',
    text: 'האם אבותיך היו אזרחים גרמנים — לפני או במהלך תקופת הנאצים?',
    type: 'yesNo',
    section: 'german_116',
    required: true
  },
  {
    id: 'german_116_3',
    text: 'האם אבותיך התגוררו בגרמניה (בתוך גבולותיה כיום) או בשטח שהיה בשליטת הנאצים — גם אם היו בעלי אזרחות זרה?',
    type: 'yesNo',
    section: 'german_116',
    required: true
  },
  {
    id: 'german_116_4',
    text: 'האם אבותיך ברחו בשל רדיפה בין השנים 1933 ל-1945?',
    type: 'yesNo',
    section: 'german_116',
    required: true
  },
  {
    id: 'german_116_4a',
    text: 'האם אבותיך עזבו את גרמניה (או שטח בשליטת הנאצים) בין 1926 ל-1933?',
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
    text: 'מהי הקרבה שלך לאותו אדם?',
    type: 'dropdown',
    options: ['ילד/ה', 'נכד/ה', 'נין/ה', 'צאצא רחוק יותר', 'לא קרוב משפחה ישיר'],
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
    text: 'מיהו האב הקדום ביותר שלך שנולד בגרמניה?',
    type: 'dropdown',
    options: ['אמא', 'אבא', 'סבא/סבתא'],
    section: 'german_5',
    required: true
  },

  // Section 5 - Mother Path
  {
    id: 'german_5_mother_q1',
    text: 'האם אמך הייתה אי פעם אזרחית גרמניה?\nלדוגמה: האם היה לה דרכון גרמני, תעודת זהות גרמנית, או שגדלה בגרמניה?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_mother_q2',
    text: 'האם נולדת אחרי 23 במאי 1949?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_mother_q3',
    text: 'האם אביך היה אזרח מדינה אחרת בזמן לידתך?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_mother_q4',
    text: 'האם הוריך היו נשואים לפני שנולדת?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_mother_q5',
    text: 'האם אמך נישאה לגבר שאינו גרמני לפני 1 באפריל 1953?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_mother_q6',
    text: 'האם נולדת לאחר נישואין אלו?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_mother_q7',
    text: 'האם ידוע לך אם הוריך היו נשואים כבר כשנולדת?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },

  // Section 5 - Father Path
  {
    id: 'german_5_father_q1',
    text: 'האם אביך היה אי פעם אזרח גרמני?\nלדוגמה: האם היה לו דרכון גרמני, תעודת זהות גרמנית, או שגר בגרמניה?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_father_q2',
    text: 'האם נולדת אחרי 23 במאי 1949 ולפני 1 ביולי 1993?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_father_q3',
    text: 'האם אמך לא הייתה אזרחית גרמניה בזמן לידתך?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_father_q4',
    text: 'האם הוריך לא היו נשואים בזמן לידתך?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_father_q5',
    text: 'האם אביך הוכר רשמית כאביך לפני שמלאו לך 23? (למשל: הופיע בתעודת הלידה שלך, תמך בך, או חתם על מסמכים רשמיים)',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },

  // Section 5 - Grandparent Path
  {
    id: 'german_5_grandparent_q1',
    text: 'האם הסבא/סבתא הגרמני/ה שלך הוא סבא או סבתא?',
    type: 'dropdown',
    options: ['סבתא', 'סבא'],
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_grandparent_q2',
    text: 'האם סבא/סבתא זה הוא הורה של אמא שלך או של אבא שלך?',
    type: 'dropdown',
    options: ['הורה של אמא שלי', 'הורה של אבא שלי'],
    section: 'german_5',
    required: true
  },

  // Grandfather = Mother's Father (Mother under father path)
  {
    id: 'german_5_grandfather_mother_father_q1',
    text: 'האם סבך (אבא של אמא) היה אי פעם אזרח גרמני?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_grandfather_mother_father_q2',
    text: 'האם אמך נולדה אחרי 23 במאי 1949 ולפני 1 ביולי 1993?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_grandfather_mother_father_q3',
    text: 'האם נולדת אחרי 23 במאי 1949?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_grandfather_mother_father_q4',
    text: 'האם סבתך (אמא של אמא) לא הייתה אזרחית גרמניה?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_grandfather_mother_father_q5',
    text: 'האם סבך וסבתך היו לא נשואים כשאמך נולדה?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_grandfather_mother_father_q6',
    text: 'האם סבך הוכר רשמית כאביה של אמך לפני שמלאו לה 23? (למשל: הופיע בתעודת הלידה, חתם על מסמכים, הוכר חוקית)',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },

  // Grandfather = Father's Father (Father under father path)
  {
    id: 'german_5_grandfather_father_father_q1',
    text: 'האם סבך (אבא של אבא) היה אי פעם אזרח גרמני?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_grandfather_father_father_q2',
    text: 'האם אביך נולד אחרי 23 במאי 1949 ולפני 1 ביולי 1993?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_grandfather_father_father_q3',
    text: 'האם נולדת אחרי 23 במאי 1949?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_grandfather_father_father_q4',
    text: 'האם סבתך (אמא של אבא) לא הייתה אזרחית גרמניה?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_grandfather_father_father_q5',
    text: 'האם סבך וסבתך היו לא נשואים כשאביך נולד?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_grandfather_father_father_q6',
    text: 'האם סבך הוכר רשמית כאביו של אביך לפני שמלאו לו 23?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },

  // Grandmother = Mother's Mother (Mother under mother path)
  {
    id: 'german_5_grandmother_mother_mother_q1',
    text: 'האם סבתך (אמא של אמא) הייתה אי פעם אזרחית גרמניה?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_grandmother_mother_mother_q2',
    text: 'האם אמך נולדה אחרי 23 במאי 1949?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_grandmother_mother_mother_q3',
    text: 'האם נולדת אחרי 23 במאי 1949?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_grandmother_mother_mother_q4',
    text: 'האם סבך היה אזרח גרמני?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_grandmother_mother_mother_q5',
    text: 'האם סבך וסבתך לא היו נשואים לפני לידת אמך?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_grandmother_mother_mother_q6',
    text: 'האם סבתך נישאה לגבר שאינו גרמני לפני 1 באפריל 1953?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_grandmother_mother_mother_q7',
    text: 'האם אמך נולדה לאחר נישואין אלו?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_grandmother_mother_mother_q8',
    text: 'האם ידוע לך אם סבתך הייתה נשואה כבר כשאמך נולדה?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },

  // Grandmother = Father's Mother (Father under mother path)
  {
    id: 'german_5_grandmother_father_mother_q1',
    text: 'האם סבתך (אמא של אבא) הייתה אי פעם אזרחית גרמניה?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_grandmother_father_mother_q2',
    text: 'האם אביך נולד אחרי 23 במאי 1949?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_grandmother_father_mother_q3',
    text: 'האם נולדת אחרי 23 במאי 1949?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_grandmother_father_mother_q4',
    text: 'האם סבך היה אזרח גרמני?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_grandmother_father_mother_q5',
    text: 'האם סבך וסבתך לא היו נשואים לפני לידת אביך?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_grandmother_father_mother_q6',
    text: 'האם סבתך נישאה לגבר שאינו גרמני לפני 1 באפריל 1953?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_grandmother_father_mother_q7',
    text: 'האם אביך נולד לאחר נישואין אלו?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_grandmother_father_mother_q8',
    text: 'האם ידוע לך אם סבתך הייתה נשואה כבר כשאביך נולד?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },

  // Section 5 - Great-grandparent Path (Basic Template)
  {
    id: 'german_5_greatgrandparent_q1',
    text: 'האם הסבא/סבתא רבא שלך היה/הייתה אי פעם אזרח/ית גרמניה?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  {
    id: 'german_5_greatgrandparent_q2',
    text: 'האם ידוע לך אם הסבא/סבתא רבא העביר זכאות לאזרחות לגרמניה לסבא/סבתא או להורה שלך?',
    type: 'yesNo',
    section: 'german_5',
    required: true
  },
  // Add more questions here as needed for the great-grandparent path

  // Austrian Citizenship - §58c
  {
    id: 'austrian_58c_1',
    text: 'האם אחד מאבותיך התגורר באוסטריה (כפי שהיא כיום) לפני 1955?',
    type: 'yesNo',
    section: 'austrian_58c',
    required: true
  },
  {
    id: 'austrian_58c_2',
    text: 'האם אותו אב היה אחד מהבאים?',
    type: 'yesNo',
    section: 'austrian_58c',
    required: true
  },
  {
    id: 'austrian_58c_3',
    text: 'האם אבותיך היו בסכנה מהנאצים?',
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
    text: 'מהי הקרבה שלך לאותו אב?',
    type: 'dropdown',
    options: ['ילד/ה', 'נכד/ה', 'נין/ה', 'צאצא רחוק יותר'],
    section: 'austrian_58c',
    required: true
  },
]; 