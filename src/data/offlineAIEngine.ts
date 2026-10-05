export interface OfflineAIResponse {
  reply: string;
  isEmergencyAlert: boolean;
  suggestedArticles?: string[];
  suggestedActions?: string[];
}

export function processOfflineHealthQuery(prompt: string, language: 'en' | 'sn' | 'nd' = 'en'): OfflineAIResponse {
  const lower = prompt.toLowerCase();

  // EMERGENCY DETECTIONS
  const emergencyKeywords = [
    'chest pain', 'heart attack', 'cant breathe', "can't breathe", 'shortness of breath', 'difficulty breathing',
    'stroke', 'face drooping', 'slurred speech', 'arm weakness', 'unconscious', 'fainted', 'convulsion', 'seizure',
    'severe bleeding', 'poison', 'swallowed battery', 'overdose', 'coughing blood',
    'kurwadziwa pachipfuva', 'kutadza kufema', 'kurutsa ropa', 'chadzungu chakanyanya',
    'ubuhlungu esifubeni', 'ukwehluleka ukuphefumula', 'ukugodola okumangalisayo'
  ];

  const hasEmergency = emergencyKeywords.some(kw => lower.includes(kw));

  if (hasEmergency) {
    if (language === 'sn') {
      return {
        reply: `⚠️ **YAMBIRO YECHIMBICHIMBI YEKURAPWA**
Zviratidzo zvamataura zvinoda rubatsiro rwechimbi-chimbi rwechiremba pachipatara chiripedyo!

1. Endai kuCasualty / Emergency pachipatara chiri pedyo (Parirenyatwa, Sally Mugabe, Mpilo, kana Provincial Hospital).
2. Ridzai runhare rwezvinetso: **999** kana **112**.
3. Musatyaira motokari muri mega kana muchirwadziwa pachipfuva kana kupera simba.
4. Garai pasi makagadzikana makarereka muviri.

*Disclaimer: Comfort Medi+ AI haisi chiremba. Zviratidzo izvi zvinoda rubatsiro rwechimbichimbi chekurapa zvino izvi.*`,
        isEmergencyAlert: true,
        suggestedActions: ['Fona Chimbichimbi 999/112', 'Ona Zvipatara Zviripedyo'],
      };
    } else if (language === 'nd') {
      return {
        reply: `⚠️ **ISIXWAYISO SESIPHUTHUMAYO SEZEMPILO**
Izimpawu ozibalulileyo zifuna uncedo oluphuthumayo lodokotela esibhedlela esiseduze khathesi!

1. Hamba ku-Casualty / Emergency esibhedlela esiseduze (Mpilo, UBH, Parirenyatwa, kumbe esibhedlela sesabelo).
2. Shayela ucingo lwesiphuthumayo: **999** kumbe **112**.
3. Ungatshayeli imota uwedwa nxa ulubuhlungu esifubeni kumbe uphelelwe ngamandla.
4. Hlala phansi ngokuthula unyakaze kancane.

*Disclaimer: I-Comfort Medi+ AI kayisuye udokotela. Lezi zimpawu zidinga ukwelashwa okuphuthumayo masinyane.*`,
        isEmergencyAlert: true,
        suggestedActions: ['Shayela Isiphuthumayo 999/112', 'Buka Izibhedlela Eziseduze'],
      };
    } else {
      return {
        reply: `⚠️ **URGENT MEDICAL EMERGENCY ALERT**
The symptoms described (such as acute chest pain, severe breathlessness, suspected stroke, or sudden weakness) indicate a potential medical emergency.

**Immediate Recommended Actions:**
1. **Seek Emergency Care Immediately:** Go directly to the nearest hospital emergency casualty unit (e.g., Parirenyatwa, Sally Mugabe, Mpilo, UBH, or Provincial Hospital).
2. **Call Emergency Services:** Dial **999** / **112** or your local ambulance provider (MARS, ACE, St John).
3. **Do not drive yourself** if experiencing chest tightness, lightheadedness, or sudden numbness.
4. Rest in a comfortable seated or semi-reclined position while help arrives.

*Disclaimer: Comfort Medi+ AI provides health education only and cannot diagnose or treat emergencies. Please consult a qualified medical professional immediately.*`,
        isEmergencyAlert: true,
        suggestedActions: ['Call Emergency (999)', 'Find Nearest Hospital Casualty', 'Notify Emergency Contacts'],
      };
    }
  }

  // HYPERTENSION / BLOOD PRESSURE
  if (lower.includes('blood pressure') || lower.includes('bp') || lower.includes('hypertension') || lower.includes('kumanikidza kweropa')) {
    return {
      reply: `### Understanding High Blood Pressure (Hypertension)
Blood pressure measures the force of blood pumped by your heart through your arteries.

- **Normal Reading:** Below 120/80 mmHg.
- **High Reading:** Consistently 140/90 mmHg or above.

**Key Management Guidance:**
1. **Never Skip Doses:** Medications like Amlodipine, Enalapril, or Losartan should be taken at the exact same hour every day.
2. **Lower Salt Intake:** Reduce table salt, seasoned salt, and bouillon stock cubes.
3. **Daily Physical Activity:** 30 minutes of walking or gentle exercise daily helps relax blood vessels.
4. **Log Regularly:** Track your readings in the Comfort Medi+ Vitals Tracker so your healthcare provider can review trends.

*Disclaimer: Comfort Medi+ AI provides educational health information only and is not a substitute for professional clinical medical advice.*`,
      isEmergencyAlert: false,
      suggestedArticles: ['art-bp-01'],
      suggestedActions: ['Log Blood Pressure Reading', 'Review Medication Reminders'],
    };
  }

  // DIABETES / BLOOD SUGAR
  if (lower.includes('diabetes') || lower.includes('sugar') || lower.includes('shuga') || lower.includes('glucose') || lower.includes('metformin')) {
    return {
      reply: `### Diabetes Management & Blood Sugar Control
Managing diabetes requires a balanced combination of consistent medication, mindful nutrition, and regular glucose monitoring.

- **Fasting Target Range:** 4.0 – 7.0 mmol/L.
- **Post-Meal Target Range (2 hrs):** Under 8.5 – 10.0 mmol/L.

**Nutritional Recommendations:**
- Choose unrefined traditional grains like **Sadza rezviyo** (finger millet) or **mugayiwa** over super-refined white mealie meal.
- Ensure half of your plate consists of dark leafy greens (**muriwo**).
- Avoid sugary beverages, commercial sodas, and excess cooking oils.

**Watch for Low Sugar (Hypoglycemia < 4.0 mmol/L):**
If you experience sudden shakiness, cold sweat, hunger, or dizziness, immediately take 3 teaspoons of sugar in water or half a cup of sweet juice, rest 15 minutes, and recheck.

*Disclaimer: Comfort Medi+ AI provides educational health information only and does not replace medical advice.*`,
      isEmergencyAlert: false,
      suggestedArticles: ['art-diabetes-01'],
      suggestedActions: ['Log Blood Sugar Reading', 'Review Meal Plan'],
    };
  }

  // CHOLERA / DEHYDRATION / DIARRHEA
  if (lower.includes('cholera') || lower.includes('diarrhea') || lower.includes('ors') || lower.includes('water') || lower.includes('sugar-salt') || lower.includes('kurukisa')) {
    return {
      reply: `### Managing Dehydration & Waterborne Illness (Cholera Care)
Frequent watery diarrhea can quickly cause severe dehydration, especially in warm weather.

**Life-Saving Sugar-Salt Solution (SSS) Recipe:**
1. Boil **1 liter of clean water** and let it cool.
2. Add **6 level teaspoons of sugar**.
3. Add **1/2 level teaspoon of salt**.
4. Mix well until dissolved. Drink 1 cup after every loose stool.

**Safe Water & Hygiene Habits:**
- Always treat tap or well water with chlorine/WaterGuard or boil vigorously for 1 minute.
- Wash hands thoroughly with soap before preparing food and after using the toilet.
- If vomiting persists or eyes appear sunken, proceed to the nearest clinic or cholera treatment unit immediately.

*Disclaimer: Comfort Medi+ AI provides educational information. For persistent vomiting or severe diarrhea, seek clinic care immediately.*`,
      isEmergencyAlert: false,
      suggestedArticles: ['art-firstaid-ors'],
      suggestedActions: ['Prepare SSS Solution', 'Find Nearest Clinic'],
    };
  }

  // ASTHMA / INHALER
  if (lower.includes('asthma') || lower.includes('inhaler') || lower.includes('salbutamol') || lower.includes('wheezing')) {
    return {
      reply: `### Asthma & Respiratory Care
Asthma causes temporary narrowing and inflammation of the airways, leading to coughing, chest tightness, or wheezing.

**Common Asthma Triggers:**
- Wood smoke from open cooking fires, dust, pollen, cold morning air, strong perfumes, and respiratory infections.

**Inhaler Technique:**
- **Reliever (Blue / Salbutamol):** Use for sudden tightness or shortness of breath. Shake well, exhale fully, place mouthpiece in mouth, press down while breathing in slowly and deeply, and hold your breath for 10 seconds.
- **Preventer (Brown/Beclomethasone):** Taken daily as prescribed, even when feeling well. Rinse mouth with water after use to prevent oral thrush.

*Disclaimer: If breathing difficulty does not improve within 5 minutes after 4 puffs of your reliever inhaler, seek emergency casualty immediately.*`,
      isEmergencyAlert: false,
      suggestedArticles: ['art-med-safety'],
      suggestedActions: ['Check Medication Schedule', 'Record Respiratory Rate'],
    };
  }

  // MISSED DOSE / MEDICATION ADVICE
  if (lower.includes('missed') || lower.includes('forget') || lower.includes('take medication') || lower.includes('side effect') || lower.includes('kunwa mushonga')) {
    return {
      reply: `### Safe Medication Guidelines & Missed Doses
Maintaining a steady schedule is critical for medications to be effective.

**General Missed Dose Rule:**
- Take the missed dose as soon as you remember.
- If it is already close to the time for your next regular dose, **skip the forgotten dose** and resume your normal schedule.
- **NEVER take a double dose** to compensate for a missed pill.

**Best Practices:**
- Take oral tablets with a full glass of clean water.
- Take pain medicines (NSAIDs like Ibuprofen/Diclofenac) with food to protect your stomach lining.
- Use Comfort Medi+ alarms to stay on track.

*Disclaimer: Comfort Medi+ AI provides general medication guidelines. Always verify specific dosing with your pharmacist or doctor.*`,
      isEmergencyAlert: false,
      suggestedArticles: ['art-med-safety'],
      suggestedActions: ['View Medication Schedule', 'Set Reminder Alarm'],
    };
  }

  // DEFAULT / GENERAL HEALTH GUIDANCE
  return {
    reply: `### General Health & Wellness Advice
Thank you for your question. Maintaining good health involves balanced daily habits:

1. **Hydration & Nutrition:** Drink 2 to 3 liters of clean, safe water daily. Prioritize whole grains, fresh vegetables, lean proteins, and reduce refined sugars and excess salt.
2. **Routine Health Checks:** Regularly monitor your blood pressure, blood glucose, and weight.
3. **Consistent Medication:** Follow your prescribed medication regimen without skipping doses.
4. **Restful Sleep:** Aim for 7 to 8 hours of sleep per night to support immune function and mental well-being.

Feel free to ask about specific topics like blood pressure, diabetes, medications, nutrition, first aid, or local clinic facilities!

*Disclaimer: Comfort Medi+ AI provides educational health information only and is not a substitute for professional clinical medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional.*`,
    isEmergencyAlert: false,
    suggestedArticles: ['art-bp-01', 'art-diabetes-01', 'art-med-safety'],
  };
}
