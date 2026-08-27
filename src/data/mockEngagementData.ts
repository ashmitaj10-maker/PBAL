import { 
  BodyMeasurementsRecord, 
  ProgressPhoto, 
  PatientReminderConfig, 
  ChatMessage, 
  ChatConversationSummary, 
  FoodSwapSuggestion, 
  NutrientGapAnalysis, 
  GoalDistributionStat, 
  WeightUpdateDueItem, 
  ExpiringPlanItem 
} from '../types/clinic';

// -------------------------------------------------------------
// 1. BODY CIRCUMFERENCE & MEASUREMENTS HISTORY (WAIST, HIP, CHEST, ARM)
// -------------------------------------------------------------

export const INITIAL_BODY_MEASUREMENTS: BodyMeasurementsRecord[] = [
  // Ananya Sharma (pat-1) - 3 Month Transformation
  {
    id: 'meas-1-1',
    patientId: 'pat-1',
    date: '2026-05-15',
    weightKg: 78.5,
    bmi: 29.5,
    waistInches: 36.5,
    hipInches: 42.0,
    chestInches: 38.0,
    armInches: 13.8,
    thighInches: 24.5,
    bodyFatPercentage: 34.2,
    notes: 'Initial clinical baseline measurements at enrollment. Elevated visceral fat noted.',
    loggedBy: 'doctor'
  },
  {
    id: 'meas-1-2',
    patientId: 'pat-1',
    date: '2026-06-15',
    weightKg: 74.8,
    bmi: 28.1,
    waistInches: 34.2,
    hipInches: 40.5,
    chestInches: 37.0,
    armInches: 13.2,
    thighInches: 23.8,
    bodyFatPercentage: 31.8,
    notes: 'Month 1 checkup. Substantial 2.3 inch reduction in abdominal waistline. High diet adherence.',
    loggedBy: 'doctor'
  },
  {
    id: 'meas-1-3',
    patientId: 'pat-1',
    date: '2026-07-15',
    weightKg: 71.2,
    bmi: 26.7,
    waistInches: 32.0,
    hipInches: 39.0,
    chestInches: 35.8,
    armInches: 12.6,
    thighInches: 22.9,
    bodyFatPercentage: 29.0,
    notes: 'Month 2 checkup. Fasting insulin levels improving, noticeable posture and core tightening.',
    loggedBy: 'dietitian'
  },
  {
    id: 'meas-1-4',
    patientId: 'pat-1',
    date: '2026-08-18',
    weightKg: 68.4,
    bmi: 25.7,
    waistInches: 30.2,
    hipInches: 37.5,
    chestInches: 34.5,
    armInches: 12.0,
    thighInches: 22.0,
    bodyFatPercentage: 26.5,
    notes: 'Current review. Total 6.3 inches lost off waist! Approaching target healthy threshold.',
    loggedBy: 'doctor'
  },

  // Rahul Kapoor (pat-2) - High visceral fat & Fatty Liver Protocol
  {
    id: 'meas-2-1',
    patientId: 'pat-2',
    date: '2026-06-01',
    weightKg: 94.0,
    bmi: 31.4,
    waistInches: 41.5,
    hipInches: 44.0,
    chestInches: 43.0,
    armInches: 15.2,
    thighInches: 26.0,
    bodyFatPercentage: 32.5,
    notes: 'Baseline intake. Central obesity and high waist-to-hip ratio (0.94).',
    loggedBy: 'doctor'
  },
  {
    id: 'meas-2-2',
    patientId: 'pat-2',
    date: '2026-07-01',
    weightKg: 89.6,
    bmi: 29.9,
    waistInches: 38.5,
    hipInches: 42.0,
    chestInches: 42.0,
    armInches: 14.8,
    thighInches: 25.2,
    bodyFatPercentage: 29.8,
    notes: 'Great response to low glycemic load meal plan. 3 inches lost around trunk.',
    loggedBy: 'doctor'
  },
  {
    id: 'meas-2-3',
    patientId: 'pat-2',
    date: '2026-08-10',
    weightKg: 86.2,
    bmi: 28.8,
    waistInches: 36.8,
    hipInches: 40.5,
    chestInches: 41.2,
    armInches: 14.4,
    thighInches: 24.5,
    bodyFatPercentage: 27.2,
    notes: 'Waist circumference now below 37 inches. Blood pressure normalized to 122/80.',
    loggedBy: 'dietitian'
  },

  // Priya Deshmukh (pat-3) - PCOS & Hormonal Balance
  {
    id: 'meas-3-1',
    patientId: 'pat-3',
    date: '2026-05-10',
    weightKg: 72.0,
    bmi: 28.8,
    waistInches: 35.0,
    hipInches: 41.5,
    chestInches: 36.5,
    armInches: 13.0,
    thighInches: 24.0,
    bodyFatPercentage: 33.0,
    notes: 'Baseline PCOS evaluation. Fluid retention and hormonal adiposity in lower abdomen.',
    loggedBy: 'doctor'
  },
  {
    id: 'meas-3-2',
    patientId: 'pat-3',
    date: '2026-07-20',
    weightKg: 66.8,
    bmi: 26.7,
    waistInches: 31.5,
    hipInches: 38.5,
    chestInches: 35.0,
    armInches: 12.2,
    thighInches: 22.5,
    bodyFatPercentage: 28.5,
    notes: 'Menstrual cycle regularized. Significant reduction in waist bloating.',
    loggedBy: 'doctor'
  },

  // Vikramaditya Roy (pat-4) - Type 2 Diabetes Remission
  {
    id: 'meas-4-1',
    patientId: 'pat-4',
    date: '2026-04-12',
    weightKg: 88.0,
    bmi: 29.8,
    waistInches: 39.5,
    hipInches: 41.0,
    chestInches: 41.5,
    armInches: 14.5,
    bodyFatPercentage: 30.5,
    notes: 'Baseline diabetic reversal program. Abdominal girth target < 35 inches.',
    loggedBy: 'doctor'
  },
  {
    id: 'meas-4-2',
    patientId: 'pat-4',
    date: '2026-08-05',
    weightKg: 79.5,
    bmi: 26.9,
    waistInches: 34.0,
    hipInches: 38.0,
    chestInches: 39.5,
    armInches: 13.8,
    bodyFatPercentage: 25.0,
    notes: '5.5 inches off waist. Fasting sugars down from 168 mg/dL to 102 mg/dL without medication increase.',
    loggedBy: 'doctor'
  }
];

// -------------------------------------------------------------
// 2. CLINICAL PROGRESS PHOTOS (BEFORE / PROGRESS / AFTER)
// -------------------------------------------------------------

export const INITIAL_PROGRESS_PHOTOS: ProgressPhoto[] = [
  // Ananya Sharma (pat-1)
  {
    id: 'photo-1-front-before',
    patientId: 'pat-1',
    date: '2026-05-15',
    stage: 'before',
    angle: 'front',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600',
    weightKg: 78.5,
    waistInches: 36.5,
    notes: 'Day 1 baseline clinical front profile. Moderate abdominal protrusion and posture fatigue.',
    verifiedByDoctor: true
  },
  {
    id: 'photo-1-front-after',
    patientId: 'pat-1',
    date: '2026-08-18',
    stage: 'after',
    angle: 'front',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
    weightKg: 68.4,
    waistInches: 30.2,
    notes: 'Week 14 transformation review. Pronounced waist tapering, visible abdominal definition.',
    verifiedByDoctor: true
  },
  {
    id: 'photo-1-side-before',
    patientId: 'pat-1',
    date: '2026-05-15',
    stage: 'before',
    angle: 'side',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
    weightKg: 78.5,
    waistInches: 36.5,
    notes: 'Day 1 baseline side profile showing lordotic posture and visceral bloat.',
    verifiedByDoctor: true
  },
  {
    id: 'photo-1-side-after',
    patientId: 'pat-1',
    date: '2026-08-18',
    stage: 'after',
    angle: 'side',
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600',
    weightKg: 68.4,
    waistInches: 30.2,
    notes: 'Week 14 side transformation. Flat abdominal wall and corrected spinal alignment.',
    verifiedByDoctor: true
  },
  {
    id: 'photo-1-back-before',
    patientId: 'pat-1',
    date: '2026-05-15',
    stage: 'before',
    angle: 'back',
    imageUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=600',
    weightKg: 78.5,
    waistInches: 36.5,
    notes: 'Day 1 back view.',
    verifiedByDoctor: true
  },
  {
    id: 'photo-1-back-after',
    patientId: 'pat-1',
    date: '2026-08-18',
    stage: 'after',
    angle: 'back',
    imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=600',
    weightKg: 68.4,
    waistInches: 30.2,
    notes: 'Week 14 back view. Back fat reduced, toned lat line.',
    verifiedByDoctor: true
  },

  // Rahul Kapoor (pat-2)
  {
    id: 'photo-2-front-before',
    patientId: 'pat-2',
    date: '2026-06-01',
    stage: 'before',
    angle: 'front',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
    weightKg: 94.0,
    waistInches: 41.5,
    notes: 'Initial clinical baseline photo.',
    verifiedByDoctor: true
  },
  {
    id: 'photo-2-front-after',
    patientId: 'pat-2',
    date: '2026-08-10',
    stage: 'after',
    angle: 'front',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600',
    weightKg: 86.2,
    waistInches: 36.8,
    notes: 'Significant chest tightening and abdominal reduction (-7.8 kg).',
    verifiedByDoctor: true
  }
];

// -------------------------------------------------------------
// 3. PATIENT REMINDERS SYSTEM (PUSH, WHATSAPP, SMS)
// -------------------------------------------------------------

export const DEFAULT_PATIENT_REMINDERS: Omit<PatientReminderConfig, 'id' | 'patientId'>[] = [
  {
    type: 'breakfast',
    title: 'Breakfast & Morning Elixir',
    time: '08:30',
    frequency: 'daily',
    channels: { push: true, whatsapp: true, sms: false },
    enabled: true,
    customMessage: '🌅 Good morning! Time for your prescribed high-protein breakfast. Start with your warm lemon-chia water to activate your metabolic enzymes.'
  },
  {
    type: 'lunch',
    title: 'Clinical Lunch Protocol',
    time: '13:00',
    frequency: 'daily',
    channels: { push: true, whatsapp: true, sms: false },
    enabled: true,
    customMessage: '🥗 Lunch Time! Remember to consume your vegetable fiber bowl before your complex carbs to blunt postprandial glucose spikes.'
  },
  {
    type: 'dinner',
    title: 'Light Metabolic Dinner',
    time: '19:30',
    frequency: 'daily',
    channels: { push: true, whatsapp: true, sms: true },
    enabled: true,
    customMessage: '🍲 Dinner reminder! Please finish dinner before 8:00 PM for optimal 12-hour circadian fasting and deep restorative sleep.'
  },
  {
    type: 'water',
    title: 'Hydration Boost (Glass 4/8)',
    time: '11:00',
    frequency: 'daily',
    channels: { push: true, whatsapp: false, sms: false },
    enabled: true,
    customMessage: '💧 Hydration Check! Drink a large glass of water now (250ml). You are on track for your 2.5L daily target.'
  },
  {
    type: 'exercise',
    title: 'Prescribed Movement Session',
    time: '17:30',
    frequency: 'weekdays',
    channels: { push: true, whatsapp: true, sms: false },
    enabled: true,
    customMessage: '🏃 Move & Tone: Today is your 35-minute Metabolic Conditioning routine. Put on your shoes and log your completed routine!'
  },
  {
    type: 'medicine',
    title: 'Supplements & Omega-3 / Vit D',
    time: '09:00',
    frequency: 'daily',
    channels: { push: true, whatsapp: false, sms: true },
    enabled: true,
    customMessage: '💊 Supplement reminder: Take your prescribed Vitamin D3 (60,000 IU) and Omega-3 softgel with your morning healthy fats.'
  },
  {
    type: 'sleep',
    title: 'Circadian Sleep Hygiene & Chamomile',
    time: '22:15',
    frequency: 'daily',
    channels: { push: true, whatsapp: false, sms: false },
    enabled: true,
    customMessage: '🌙 Wind Down: Turn off blue screens and sip your warm nutmeg-infused golden almond milk for optimal growth hormone secretion.'
  },
  {
    type: 'weigh_in',
    title: 'Weekly Fasting Weigh-In & Measurements',
    time: '07:00',
    frequency: 'weekly',
    weeklyDay: 'Sunday',
    channels: { push: true, whatsapp: true, sms: true },
    enabled: true,
    customMessage: '⚖️ Sunday Weigh-In Day! Check your fasting weight immediately after waking up and log your waist measurement in the app.'
  }
];

export const generateInitialRemindersForPatient = (patientId: string): PatientReminderConfig[] => {
  return DEFAULT_PATIENT_REMINDERS.map((rem, idx) => ({
    ...rem,
    id: `rem-${patientId}-${idx + 1}`,
    patientId
  }));
};

// -------------------------------------------------------------
// 4. WHATSAPP-STYLE CLINICAL CHAT CONVERSATIONS & MESSAGES
// -------------------------------------------------------------

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  // Ananya Sharma (pat-1) Thread
  {
    id: 'msg-1',
    patientId: 'pat-1',
    clinicId: 'clinic-1',
    sender: 'doctor',
    senderName: 'Dr. Ashmita Joshi',
    senderRole: 'Chief Clinical Dietitian',
    timestamp: 'Yesterday, 10:15 AM',
    date: '2026-08-22',
    createdAt: 1771733700000,
    content: 'Good morning Ananya! I reviewed your 7-day food logs and your weight drop to 68.4 kg. Your protein compliance is phenomenal this week! 🎉',
    type: 'text',
    isRead: true,
    status: 'read'
  },
  {
    id: 'msg-2',
    patientId: 'pat-1',
    clinicId: 'clinic-1',
    sender: 'patient',
    senderName: 'Ananya Sharma',
    timestamp: 'Yesterday, 10:22 AM',
    date: '2026-08-22',
    createdAt: 1771734120000,
    content: 'Thank you so much Doctor! I am feeling much more energetic in the afternoons without the sugar crashes. I have a question about dining out tonight though — my team is going to an Italian restaurant.',
    type: 'text',
    isRead: true,
    status: 'read'
  },
  {
    id: 'msg-3',
    patientId: 'pat-1',
    clinicId: 'clinic-1',
    sender: 'doctor',
    senderName: 'Dr. Ashmita Joshi',
    senderRole: 'Chief Clinical Dietitian',
    timestamp: 'Yesterday, 10:28 AM',
    date: '2026-08-22',
    createdAt: 1771734480000,
    content: 'No problem! Here is your dining-out gameplan: 1) Order Grilled Chicken or Tofu steak with sauteed vegetables first. 2) Ask for olive oil & balsamic dressing on the side. 3) If having pasta, pick whole wheat arrabbiata and share half portion. Avoid cream sauces (Alfredo).',
    type: 'text',
    isRead: true,
    status: 'read'
  },
  {
    id: 'msg-4',
    patientId: 'pat-1',
    clinicId: 'clinic-1',
    sender: 'patient',
    senderName: 'Ananya Sharma',
    timestamp: 'Yesterday, 08:45 PM',
    date: '2026-08-22',
    createdAt: 1771771500000,
    content: 'Followed your exact advice! Here is what I ordered: Grilled herbs chicken with zucchini ribbons and roasted bell peppers. Felt completely satisfied without overeating.',
    type: 'photo',
    mediaUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600',
    mediaMeta: {
      fileName: 'Italian_Dinner_Check.jpg',
      fileSize: '1.8 MB',
      previewTitle: 'Dinner Photo Verification'
    },
    isRead: true,
    status: 'read'
  },
  {
    id: 'msg-5',
    patientId: 'pat-1',
    clinicId: 'clinic-1',
    sender: 'doctor',
    senderName: 'Dr. Ashmita Joshi',
    senderRole: 'Chief Clinical Dietitian',
    timestamp: 'Yesterday, 09:10 PM',
    date: '2026-08-22',
    createdAt: 1771773000000,
    content: 'Outstanding plate balance! That is 35g of clean protein with under 15g net carbs. You are doing fantastic. Enjoy your evening!',
    type: 'text',
    isRead: true,
    status: 'read'
  },
  {
    id: 'msg-6',
    patientId: 'pat-1',
    clinicId: 'clinic-1',
    sender: 'doctor',
    senderName: 'Dr. Ashmita Joshi',
    senderRole: 'Chief Clinical Dietitian',
    timestamp: 'Today, 08:30 AM',
    date: '2026-08-23',
    createdAt: 1771813800000,
    content: 'I have attached your newly calibrated Phase 3 Meal Plan with customized Gujarati-fusion recipes and adjusted macro targets.',
    type: 'pdf',
    mediaUrl: '#',
    mediaMeta: {
      fileName: 'PBL_Clinical_Meal_Plan_V3_Ananya.pdf',
      fileSize: '2.4 MB',
      previewTitle: 'Clinical Meal Plan Protocol (Phase 3)',
      previewSubtitle: '7-Slot Choice Mode • 1,550 kcal • 92g Protein'
    },
    isRead: false,
    status: 'delivered'
  },
  {
    id: 'msg-7',
    patientId: 'pat-1',
    clinicId: 'clinic-1',
    sender: 'doctor',
    senderName: 'Dr. Ashmita Joshi',
    senderRole: 'Chief Clinical Dietitian',
    timestamp: 'Today, 08:32 AM',
    date: '2026-08-23',
    createdAt: 1771813920000,
    content: 'Also, here is your updated 4-Day Strength & Posture Routine designed for your home kettlebell setup.',
    type: 'exercise_plan',
    mediaMeta: {
      previewTitle: 'Metabolic & Posture Circuit (4 Days/wk)',
      previewSubtitle: '35 mins • 220 kcal • Kettlebell & Core',
      badge: 'Exercise Prescription'
    },
    isRead: false,
    status: 'delivered'
  },

  // Rahul Kapoor (pat-2) Thread
  {
    id: 'msg-2-1',
    patientId: 'pat-2',
    clinicId: 'clinic-1',
    sender: 'patient',
    senderName: 'Rahul Kapoor',
    timestamp: 'Today, 07:15 AM',
    date: '2026-08-23',
    createdAt: 1771809300000,
    content: 'Doc, morning fasting weight is 86.2 kg. Down another 400g! But having severe sugar cravings at 4 PM around office tea time. What can I eat instead of samosas?',
    type: 'text',
    isRead: false,
    status: 'delivered'
  },

  // Priya Deshmukh (pat-3) Thread
  {
    id: 'msg-3-1',
    patientId: 'pat-3',
    clinicId: 'clinic-1',
    sender: 'patient',
    senderName: 'Priya Deshmukh',
    timestamp: 'Yesterday, 04:20 PM',
    date: '2026-08-22',
    createdAt: 1771755600000,
    content: 'Doctor, my latest ultrasound shows significant reduction in ovarian volume! My period came on day 29 naturally. Thank you for the inositol seed rotation plan! 🙏',
    type: 'text',
    isRead: true,
    status: 'read'
  },
  {
    id: 'msg-3-2',
    patientId: 'pat-3',
    clinicId: 'clinic-1',
    sender: 'doctor',
    senderName: 'Dr. Ashmita Joshi',
    timestamp: 'Yesterday, 05:00 PM',
    date: '2026-08-22',
    createdAt: 1771758000000,
    content: 'This is the most wonderful news, Priya! Your consistency with daily spearmint tea and the high-protein breakfast reversed the insulin resistance. Keep up this exact routine.',
    type: 'text',
    isRead: true,
    status: 'read'
  }
];

// -------------------------------------------------------------
// 5. AI COPILOT: FOOD SWAPS & CRAVING REPLACERS
// -------------------------------------------------------------

export const FOOD_SWAPS_CATALOG: FoodSwapSuggestion[] = [
  {
    id: 'swap-1',
    cravingOrDish: 'Chicken Biryani / Mutton Dum Biryani (Commercial)',
    swapOptionName: 'Cauliflower & Quinoa Brown Rice Dum Biryani with Spiced Chicken Tikka',
    category: 'Rice & Heavy Mains',
    originalCalories: 780,
    swapCalories: 380,
    calorieSaving: 400,
    originalGlycemic: 'High',
    swapGlycemic: 'Low',
    swapProteinGrams: 36,
    swapFiberGrams: 9,
    preparationTip: 'Blend 50% grated cauliflower rice with 50% boiled quinoa. Infuse saffron-kewra water and use 1 tsp A2 ghee for authentic aroma without refined oil.',
    clinicalReason: 'Blunts postprandial glucose spike by 65% and doubles dietary prebiotic fiber for gut microbiome diversity.'
  },
  {
    id: 'swap-2',
    cravingOrDish: 'Cheesy Stuffed Crust Pizza (2 slices)',
    swapOptionName: 'Almond-Flour & Egg White Crispy Crust Pizza with Goat Cheese & Grilled Veggies',
    category: 'Fast Food & Cravings',
    originalCalories: 680,
    swapCalories: 310,
    calorieSaving: 370,
    originalGlycemic: 'High',
    swapGlycemic: 'Low',
    swapProteinGrams: 28,
    swapFiberGrams: 7,
    preparationTip: 'Mix almond flour, psyllium husk, Italian oregano, and egg whites to form base dough. Bake for 12 mins at 200°C before topping with sugar-free marinara and fresh basil.',
    clinicalReason: 'Zero refined wheat gluten; preserves intestinal barrier integrity in PCOS and Hashimoto patients.'
  },
  {
    id: 'swap-3',
    cravingOrDish: 'Fried Potato Samosa & Sweet Chutney (2 pieces)',
    swapOptionName: 'Air-Fried Spiced Moong Dal & Edamame Potlis with Raw Mint-Amla Chutney',
    category: 'Tea Time Snacks',
    originalCalories: 520,
    swapCalories: 190,
    calorieSaving: 330,
    originalGlycemic: 'High',
    swapGlycemic: 'Low',
    swapProteinGrams: 16,
    swapFiberGrams: 8,
    preparationTip: 'Use whole wheat phyllo wrap or rice paper wrappers. Brush lightly with cold-pressed mustard oil and air fry at 180°C for 8 minutes.',
    clinicalReason: 'Eliminates trans fats and oxidized cooking oils, shielding cardiovascular endothelial health.'
  },
  {
    id: 'swap-4',
    cravingOrDish: 'Gulab Jamun / Rasgulla (2 pieces in sugar syrup)',
    swapOptionName: 'Warm Cardamom-Saffron Chia-Almond Pudding with Stevia & Pistachio Slivers',
    category: 'Desserts & Sweets',
    originalCalories: 450,
    swapCalories: 140,
    calorieSaving: 310,
    originalGlycemic: 'High',
    swapGlycemic: 'Low',
    swapProteinGrams: 8,
    swapFiberGrams: 6,
    preparationTip: 'Simmer unsweetened almond milk with crushed cardamom pods and Kashmiri saffron strands. Stir in black chia seeds and monk fruit sweetener.',
    clinicalReason: 'Rich in omega-3 alpha-linolenic acid (ALA); curbs evening sugar cravings while keeping serum insulin baseline.'
  },
  {
    id: 'swap-5',
    cravingOrDish: 'Creamy White Sauce Pasta (Penne Alfredo)',
    swapOptionName: 'Zucchini Ribbons & Edamame Pasta in Roasted Garlic-Cashew Nutritional Yeast Sauce',
    category: 'Pasta & Noodles',
    originalCalories: 720,
    swapCalories: 280,
    calorieSaving: 440,
    originalGlycemic: 'High',
    swapGlycemic: 'Low',
    swapProteinGrams: 24,
    swapFiberGrams: 11,
    preparationTip: 'Blend soaked cashews with garlic, lemon juice, fortified nutritional yeast (B12), and warm vegetable broth for a luscious silky sauce.',
    clinicalReason: 'Substitutes heavy saturated dairy fat with heart-healthy monounsaturated fatty acids and bioavailable plant proteins.'
  },
  {
    id: 'swap-6',
    cravingOrDish: 'Sugary Caramel Frappuccino with Whipped Cream',
    swapOptionName: 'Iced Cinnamon-Vanilla Cold Brew with Collagen Peptides & MCT Froth',
    category: 'Beverages',
    originalCalories: 420,
    swapCalories: 95,
    calorieSaving: 325,
    originalGlycemic: 'High',
    swapGlycemic: 'Low',
    swapProteinGrams: 12,
    swapFiberGrams: 2,
    preparationTip: 'Steep dark roast cold brew for 16 hours. Froth with 50ml unsweetened oat milk, Ceylon cinnamon, and grass-fed hydrolyzed peptides.',
    clinicalReason: 'No added sucrose; supports connective tissue and stabilizes dopaminergic alertness.'
  }
];

// -------------------------------------------------------------
// 6. AI COPILOT: NUTRIENT GAP & BIOCHEMICAL DEFICIENCY DIAGNOSTICS
// -------------------------------------------------------------

export const NUTRIENT_GAP_TEMPLATES: NutrientGapAnalysis[] = [
  {
    nutrient: 'Bioavailable Dietary Iron (Ferritin Protection)',
    currentIntake: '11 mg/day (61% RDA)',
    recommendedIntake: '18 mg/day',
    gapPercentage: 39,
    status: 'moderate_deficit',
    clinicalSymptoms: [
      'Afternoon fatigue & brain fog',
      'Cold extremities (hands/feet)',
      'Suboptimal thyroid T4 to T3 conversion',
      'Brittle nail ridges'
    ],
    recommendedFoods: [
      { name: 'Sprouted Horse Gram (Kulthi) Soup', portion: '1 bowl (200ml)', keyBenefit: '6.2mg bioavailable iron with natural bioflavonoids' },
      { name: 'Garden Cress (Halim) Seeds in Lemon Water', portion: '1 tsp soaked', keyBenefit: '12mg elemental iron, potent blood builder' },
      { name: 'Steamed Spinach & Black Sesame (Til) Tikki', portion: '2 pieces', keyBenefit: 'High non-heme iron paired with copper & zinc' }
    ]
  },
  {
    nutrient: 'Active Cholecalciferol (Vitamin D3) & Serum Calcium',
    currentIntake: '220 IU/day (36% RDA)',
    recommendedIntake: '600 - 2,000 IU/day',
    gapPercentage: 64,
    status: 'severe_deficit',
    clinicalSymptoms: [
      'Sore lower back and muscle twitches',
      'Resistance to visceral fat loss despite calorie deficit',
      'Low immune resilience against upper respiratory infections',
      'Depressive mood in mornings'
    ],
    recommendedFoods: [
      { name: 'Sun-Exposed Shiitake / White Button Mushrooms', portion: '100g sauteed in ghee', keyBenefit: 'Natural ergocalciferol activated via UV-B exposure' },
      { name: 'Fortified A2 Grass-Fed Paneer', portion: '80g cubes', keyBenefit: 'Contains optimal Calcium-to-Phosphorus ratio of 1.4:1' },
      { name: 'Prescribed Bioactive D3 (60K IU) Nanodrops', portion: 'Weekly single dose with fats', keyBenefit: 'Restores serum 25(OH)D to optimal >50 ng/mL' }
    ]
  },
  {
    nutrient: 'Total Dietary Prebiotic Fiber (Microbiome Fuel)',
    currentIntake: '16g / day (53% RDA)',
    recommendedIntake: '30 - 35g / day',
    gapPercentage: 47,
    status: 'moderate_deficit',
    clinicalSymptoms: [
      'Irregular bowel transit time (>24 hours)',
      'Post-meal lethargy & glucose fluctuation',
      'Food cravings within 90 minutes of eating',
      'Bloating and sluggish lymphatic flow'
    ],
    recommendedFoods: [
      { name: 'Roasted Flax & Chia Seed Topping on Curd', portion: '2 tbsp daily', keyBenefit: '6g soluble mucilage fiber creating protective gut gel' },
      { name: 'Raw Methi (Fenugreek) Sprout & Cucumber Salad', portion: '1 bowl before lunch', keyBenefit: 'Contains 4-hydroxyisoleucine to sensitize insulin receptors' },
      { name: 'Psyllium Husk (Isabgol) with Lukewarm Water', portion: '1 tsp at bedtime', keyBenefit: 'Normalizes short-chain fatty acid (butyrate) production' }
    ]
  },
  {
    nutrient: 'Lean High Biological Value Protein (Muscle Synthesis)',
    currentIntake: '44g / day (62% of Lean Body Mass target)',
    recommendedIntake: '72 - 80g / day',
    gapPercentage: 38,
    status: 'moderate_deficit',
    clinicalSymptoms: [
      'Loss of resting metabolic rate during weight loss',
      'Hair thinning / slow follicular recovery',
      'Prolonged muscle soreness after 20-minute walks',
      'Flabby skin tone around arms and thighs'
    ],
    recommendedFoods: [
      { name: 'Sprouted Sattu Drink with Roasted Cumin & Mint', portion: '1 glass (300ml)', keyBenefit: '14g plant protein with zero refined starch' },
      { name: 'Steamed Edamame & Low-Fat Paneer Chaat', portion: '1 bowl', keyBenefit: '22g complete amino acid spectrum with leucine' },
      { name: 'Organic Egg White / Moong Chilla Roll', portion: '2 chillas', keyBenefit: 'Highest net protein utilization (NPU 94%)' }
    ]
  }
];

// -------------------------------------------------------------
// 7. ENHANCED DASHBOARD METRICS (GOALS, EXPIRIES, WEIGH-IN DUE)
// -------------------------------------------------------------

export const MOCK_GOAL_DISTRIBUTION: GoalDistributionStat[] = [
  { goalName: 'Visceral Fat & Weight Loss (5-15kg)', patientCount: 28, percentage: 46, color: '#6BBF59' },
  { goalName: 'PCOS & Hormonal Cycle Harmony', patientCount: 14, percentage: 23, color: '#8B5CF6' },
  { goalName: 'Type 2 Diabetes & HbA1c Remission', patientCount: 11, percentage: 18, color: '#F59E0B' },
  { goalName: 'Fatty Liver (NAFLD) & Lipid Reversal', patientCount: 8, percentage: 13, color: '#3B82F6' }
];

export const MOCK_WEIGHT_UPDATES_DUE: WeightUpdateDueItem[] = [
  {
    patientId: 'pat-4',
    patientName: 'Vikramaditya Roy',
    patientCode: 'PBL-1027',
    lastWeighInDate: '2026-08-05',
    daysOverdue: 18,
    currentWeightKg: 79.5,
    targetWeightKg: 74.0,
    status: 'critical'
  },
  {
    patientId: 'pat-2',
    patientName: 'Rahul Kapoor',
    patientCode: 'PBL-1025',
    lastWeighInDate: '2026-08-10',
    daysOverdue: 13,
    currentWeightKg: 86.2,
    targetWeightKg: 78.0,
    status: 'overdue'
  },
  {
    patientId: 'pat-6',
    patientName: 'Amitav Ghosh',
    patientCode: 'PBL-1029',
    lastWeighInDate: '2026-08-16',
    daysOverdue: 7,
    currentWeightKg: 91.0,
    targetWeightKg: 80.0,
    status: 'due_today'
  }
];

export const MOCK_EXPIRING_PLANS: ExpiringPlanItem[] = [
  {
    patientId: 'pat-3',
    patientName: 'Priya Deshmukh',
    patientCode: 'PBL-1026',
    planName: '6-Month Complete Reversal',
    expiryDate: '2026-08-28',
    daysRemaining: 5,
    totalRenewals: 1,
    renewalAmount: 24000,
    status: 'critical_renewal'
  },
  {
    patientId: 'pat-5',
    patientName: 'Sneha Patel',
    patientCode: 'PBL-1028',
    planName: '3-Month Intensive Weight Loss',
    expiryDate: '2026-09-02',
    daysRemaining: 10,
    totalRenewals: 0,
    renewalAmount: 15000,
    status: 'expiring_soon'
  },
  {
    patientId: 'pat-8',
    patientName: 'Rohan Malhotra',
    patientCode: 'PBL-1031',
    planName: '1-Month Metabolic Kickstart',
    expiryDate: '2026-08-20',
    daysRemaining: -3,
    totalRenewals: 0,
    renewalAmount: 6000,
    status: 'expired'
  }
];
