export interface HealthArticle {
  id: string;
  category: 'General Health' | 'Nutrition' | 'Mental Health' | 'Women’s Health' | 'Men’s Health' | 'Children’s Health' | 'First Aid' | 'Medication Safety' | 'Chronic Diseases' | 'Infectious Diseases';
  title: string;
  summary: string;
  content: string;
  readTimeMin: number;
  localKeywords: string[];
  isEmergencyRelated?: boolean;
}

export const HEALTH_ARTICLES: HealthArticle[] = [
  {
    id: 'art-bp-01',
    category: 'Chronic Diseases',
    title: 'Understanding High Blood Pressure (Hypertension) in Daily Life',
    summary: 'What blood pressure numbers mean, common symptoms like morning headaches, dietary salt reduction, and the vital role of consistent medication.',
    readTimeMin: 4,
    localKeywords: ['bp', 'high blood pressure', 'hypertension', 'mutupo', 'salt', 'headache', 'stroke'],
    content: `
### What is High Blood Pressure?
Blood pressure is the force of your blood pushing against the walls of your blood vessels. 
- **Normal Blood Pressure:** Less than 120 / 80 mmHg.
- **Elevated / Pre-hypertension:** 120–129 / < 80 mmHg.
- **Stage 1 Hypertension:** 130–139 / 80–89 mmHg.
- **Stage 2 Hypertension:** 140/90 mmHg or higher.

### Why Hypertension is Called the "Silent Killer"
In most cases, hypertension produces NO early symptoms. You cannot tell your blood pressure is high simply by how you feel. Leaving it untreated over months and years damages the heart, kidneys, and brain blood vessels, drastically increasing the risk of strokes and heart attacks.

### Managing High Blood Pressure:
1. **Reduce Dietary Sodium:** Cook with less salt, avoid salted snacks and stock cubes high in sodium. Season food with lemon, herbs, garlic, and onions.
2. **Take Prescribed Medication Every Single Day:** Do not stop taking Amlodipine, Enalapril, Losartan, or Hydrochlorothiazide just because you feel well.
3. **Daily Physical Activity:** Aim for at least 30 minutes of brisk walking 5 days a week.
4. **Regular Monitoring:** Record your readings in the Comfort Medi+ Vitals Tracker at the same time each day (e.g. morning before breakfast).
5. **Manage Stress & Sleep:** 7 to 8 hours of restful sleep daily helps lower cardiovascular strain.
`
  },
  {
    id: 'art-diabetes-01',
    category: 'Chronic Diseases',
    title: 'Living Well with Diabetes: Glucose Management & Meal Planning',
    summary: 'Guide to blood sugar targets, traditional Zimbabwean meals (Sadza rezviyo/sorghum, leafy greens/muriwo), recognizing hypoglycemia, and foot care.',
    readTimeMin: 5,
    localKeywords: ['diabetes', 'shuga', 'blood sugar', 'sadza', 'hypoglycemia', 'insulin', 'metformin'],
    content: `
### Understanding Blood Glucose Ranges
- **Fasting Blood Sugar (before breakfast):** 4.0 – 7.0 mmol/L (72 – 126 mg/dL)
- **Post-Meal Blood Sugar (2 hours after eating):** Under 8.5 – 10.0 mmol/L

### Healthy Meal Choices:
- Prefer whole-grain staples like **Sadza rezviyo** (finger millet), **Sadza remapfunde** (sorghum), or unrefined maize meal (mugayiwa) over super-refined white mealie meal.
- Half your plate should always consist of fresh leafy greens (**muriwo unembambaira, covo, rape, spinach, tsunga**).
- Include lean protein: boiled beans, nyimo (round nuts), fish, or lean chicken.
- Avoid sugar-sweetened beverages, commercial fruit juice blends, and energy drinks.

### Warning Signs of Hypoglycemia (Low Blood Sugar < 4.0 mmol/L):
- Sudden shaking, cold sweating, dizziness, confusion, extreme hunger, or heart palpitations.
- **Immediate Action:** Take 3 teaspoons of sugar dissolved in water, 1/2 cup of sweet soda, or fruit juice immediately. Wait 15 minutes, recheck sugar, then eat a meal.

### Daily Diabetic Foot Care:
Wash feet daily in lukewarm water, dry carefully between the toes, inspect for any cuts, blisters or cracks, and never walk barefoot outdoors.
`
  },
  {
    id: 'art-firstaid-ors',
    category: 'First Aid',
    title: 'Emergency Dehydration & Cholera Care: Sugar-Salt Solution (SSS)',
    summary: 'Life-saving oral rehydration formulation for diarrhea, cholera, and vomiting when clean water and clinic access are critical.',
    readTimeMin: 3,
    isEmergencyRelated: true,
    localKeywords: ['cholera', 'dehydration', 'diarrhea', 'ors', 'salt sugar solution', 'chururuka', 'emergency'],
    content: `
### Urgent Dehydration Warning
Acute watery diarrhea (such as in cholera outbreaks) can cause life-threatening dehydration within hours. Oral rehydration must begin IMMEDIATELY at home while travelling to the nearest health clinic.

### How to Prepare Sugar-Salt Solution (SSS):
1. **Wash your hands** thoroughly with soap and clean running water.
2. Measure **1 Liter of clean boiled water** (or water treated with WaterGuard/Aquatabs) and let it cool.
3. Add **6 level teaspoons of clean white or brown sugar**.
4. Add **1/2 level teaspoon of salt**.
5. Stir well until all the sugar and salt have completely dissolved.
6. Taste it: It should not taste saltier than human tears.

### Administration Dosage:
- **Adults & Older Children:** Drink at least 1 cup after every loose watery stool.
- **Infants & Toddlers:** Give small sips using a clean teaspoon or cup (not a bottle) every 2–3 minutes.
- If vomiting occurs, wait 10 minutes, then continue giving small sips slowly.
- **Immediately seek professional medical care** at your nearest clinic or cholera treatment center if there is extreme weakness, sunken eyes, inability to drink, or blood in stool.
`
  },
  {
    id: 'art-med-safety',
    category: 'Medication Safety',
    title: 'Safe Medication Practices: Avoiding Interactions & Missed Doses',
    summary: 'Why you should never share prescriptions, how to store pills in warm weather, understanding food interactions, and what to do if you miss a dose.',
    readTimeMin: 4,
    localKeywords: ['medication', 'pills', 'safety', 'missed dose', 'antibiotics', 'art', 'side effects'],
    content: `
### Golden Rules for Medication Safety
1. **Take Doses at Consistent Hours:** Medication works best when a steady concentration remains in your bloodstream. Use the Comfort Medi+ reminder alarms.
2. **What to Do When You Miss a Dose:**
   - Take it as soon as you remember, unless it is already almost time for your next scheduled dose.
   - **NEVER take a double dose** to make up for a forgotten pill.
3. **Finish the Full Course of Antibiotics:** Even if symptoms disappear after 3 days, stopping early causes bacterial resistance to develop.
4. **Food & Water Instructions:**
   - NSAIDs (like Ibuprofen, Diclofenac) should ALWAYS be taken with food to protect the stomach lining.
   - Drink a full glass of clean water with tablets to prevent them sticking in the esophagus.
5. **Proper Storage:**
   - Store medications in a cool, dry place away from direct sunlight.
   - Avoid damp bathroom cabinets or keeping pill bottles in hot vehicles.
   - Keep all medicines out of reach of young children.
`
  },
  {
    id: 'art-malaria-01',
    category: 'Infectious Diseases',
    title: 'Malaria Prevention, Symptoms, and Rapid Diagnosis',
    summary: 'Recognizing malaria fevers, using insecticide-treated mosquito nets, understanding Rapid Diagnostic Tests (RDTs), and Coartem treatment.',
    readTimeMin: 4,
    localKeywords: ['malaria', 'fever', 'chando', 'chikwekwe', 'mosquito', 'coartem', 'rdt'],
    content: `
### Symptoms of Malaria:
- High fever and severe shaking chills (rigors)
- Profuse sweating as the fever breaks
- Severe headache and body/muscle aches
- Nausea, vomiting, and loss of appetite
- Fatigue and weakness

### Prevention in High-Risk Zones (e.g. Zambezi Valley, Lowveld, Border regions):
- Sleep under **Insecticide-Treated Mosquito Nets (ITNs)** every single night.
- Wear long sleeves and trousers at dusk and evening hours.
- Apply mosquito repellent and close window mesh screens before sunset.

### Testing Before Treatment:
- Always visit a clinic for a **Malaria Rapid Diagnostic Test (RDT)** or blood smear before starting medication.
- Avoid guessing or presumptively treating without confirmation.
- If positive for Falciparum malaria, complete the full prescribed Artemisinin-based Combination Therapy (**Artemether-Lumefantrine / Coartem**) taken with a meal containing a little fat (milk or food) for optimal absorption.
`
  },
  {
    id: 'art-maternal-child',
    category: 'Children’s Health',
    title: 'Essential Child Immunization & Growth Milestones',
    summary: 'Zimbabwe Expanded Programme on Immunization (ZEPI) schedule from birth to 5 years, BCG, Rotavirus, Measles-Rubella, and Vitamin A.',
    readTimeMin: 5,
    localKeywords: ['immunization', 'vaccine', 'baby', 'child health', 'bambanani', 'polio', 'measles'],
    content: `
### Routine Immunization Schedule (ZEPI):
- **At Birth:** BCG (Tuberculosis) and Oral Polio Vaccine (OPV 0).
- **6 Weeks:** Pentavalent 1 (DTP-HepB-Hib), OPV 1, PCV 1 (Pneumococcal), Rotavirus 1.
- **10 Weeks:** Pentavalent 2, OPV 2, PCV 2, Rotavirus 2.
- **14 Weeks:** Pentavalent 3, OPV 3, PCV 3, Inactivated Polio Vaccine (IPV).
- **9 Months:** Measles-Rubella 1 (MR 1), Vitamin A supplementation.
- **18 Months:** Measles-Rubella 2 (MR 2), Vitamin A, Deworming.

### Red Flags in Infants Requiring Immediate Hospital Casualty:
- Inability to breastfeed or drink fluids
- Convulsions or fits
- Vomiting everything
- Abnormally high fever or very low body temperature
- Rapid breathing with chest in-drawing
`
  },
  {
    id: 'art-firstaid-cpr',
    category: 'First Aid',
    title: 'Hands-Only CPR and Choking First Aid',
    summary: 'Clear step-by-step guidance for an unresponsive person or choking adult/child while waiting for emergency ambulance dispatch.',
    readTimeMin: 3,
    isEmergencyRelated: true,
    localKeywords: ['cpr', 'choking', 'unresponsive', 'heart attack', 'first aid', 'emergency'],
    content: `
### Hands-Only CPR for Adults (Unresponsive and Not Breathing Normally)
1. **Check Safety:** Ensure the surrounding area is safe for you and the patient.
2. **Check Response:** Shake the shoulders firmly and shout: "Are you okay?"
3. **Call for Help:** Immediately assign someone to call emergency (999, 112, or local ambulance).
4. **Position Hands:** Place the heel of one hand in the center of the chest (between nipples). Place your other hand on top and interlock your fingers.
5. **Compress Hard and Fast:**
   - Push down at least 5 cm (2 inches) deep.
   - Maintain a rate of **100 to 120 compressions per minute** (the tempo of the song "Stayin' Alive").
   - Allow the chest to fully recoil between each compression.
   - Continue without pausing until professional medical help arrives or an automated external defibrillator (AED) is ready.

### Choking (Conscious Adult or Child > 1 Year):
- Encourage the person to cough hard.
- If unable to breathe, cough, or speak: Deliver **5 firm back blows** between the shoulder blades with the heel of your hand.
- If still choking: Deliver **5 abdominal thrusts (Heimlich maneuver)** by standing behind the person, placing a fist just above the navel, and pulling sharply inward and upward.
`
  }
];
