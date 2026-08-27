import { 
  PatientAssessment, 
  ClinicalMealPlan, 
  ExercisePlan, 
  RecipeDetail, 
  MealSlot, 
  DayMealPlan, 
  MealOption,
  PatientDailyLog
} from '../types/clinic';

// -------------------------------------------------------------------
// 1. INITIAL PATIENT ASSESSMENTS (WITH VERSIONING)
// -------------------------------------------------------------------
export const INITIAL_ASSESSMENTS: PatientAssessment[] = [
  {
    id: 'asmt-101',
    patientId: 'pat-1', // Priya Sharma
    version: 2,
    createdAt: '2026-02-15T09:30:00Z',
    updatedAt: '2026-02-20T11:15:00Z',
    doctorId: 'usr-1',
    doctorName: 'Dr. Ashmita Joshi, MD, RD',
    wakeTime: '06:30',
    sleepTime: '22:45',
    dailyWaterLiters: 2.2,
    exerciseFrequency: 'Light (1-2 days/wk)',
    exerciseTypes: ['Walking', 'Light Yoga'],
    stressLevel: 'moderate',
    digestiveIssues: ['Bloating post-lunch', 'Occasional Acidity / GERD'],
    favoriteFoods: ['Rolled Oats', 'Greek Yogurt', 'Paneer Tikka', 'Blueberries', 'Sprouted Moong', 'Avocado Toast'],
    dislikedFoods: ['Bitter Gourd (Karela)', 'Eggplant (Brinjal)', 'Excess Raw Onion', 'Deep Fried Snacks'],
    medicalHistory: ['Pre-diabetes (HbA1c 6.2%)', 'Mild Hypothyroidism (TSH 5.6)', 'Metabolic Weight Gain'],
    foodPreference: 'Vegetarian',
    dailyRoutineNotes: 'Works 9-6 at IT desk. Struggles with 4 PM cravings and energy dip. Prefers easy warm breakfast and quick dinner.',
    targetCalories: 1550,
    targetProteinGrams: 90,
    targetCarbsGrams: 145,
    targetFatGrams: 45,
    targetFiberGrams: 35,
    clinicalNotes: 'Optimize thyroid conversion via selenium & zinc; keep glycemic load < 12 per meal to normalize morning fasting glucose and reverse pre-diabetic curve.'
  },
  {
    id: 'asmt-100',
    patientId: 'pat-1', // Priya Sharma (Version 1 baseline)
    version: 1,
    createdAt: '2025-11-20T10:00:00Z',
    updatedAt: '2025-11-20T10:00:00Z',
    doctorId: 'usr-1',
    doctorName: 'Dr. Ashmita Joshi, MD, RD',
    wakeTime: '07:30',
    sleepTime: '23:30',
    dailyWaterLiters: 1.5,
    exerciseFrequency: 'Sedentary',
    exerciseTypes: ['None'],
    stressLevel: 'high',
    digestiveIssues: ['Severe Bloating', 'Constipation', 'Acid reflux 3x/week'],
    favoriteFoods: ['White Rice', 'Paneer Butter Masala', 'Biscuits with Chai', 'Sweets'],
    dislikedFoods: ['Raw Salads', 'Bitter Gourd'],
    medicalHistory: ['Pre-diabetes (HbA1c 6.5%)', 'Hypothyroidism (TSH 6.8)'],
    foodPreference: 'Vegetarian',
    dailyRoutineNotes: 'High sedentary screen time, late dinners at 9:30 PM.',
    targetCalories: 1650,
    targetProteinGrams: 70,
    targetCarbsGrams: 180,
    targetFatGrams: 55,
    targetFiberGrams: 22,
    clinicalNotes: 'Initial intake baseline. Patient complaining of chronic fatigue and brain fog.'
  },
  {
    id: 'asmt-102',
    patientId: 'pat-2', // Rahul Verma
    version: 1,
    createdAt: '2026-01-10T14:20:00Z',
    updatedAt: '2026-01-10T14:20:00Z',
    doctorId: 'usr-1',
    doctorName: 'Dr. Ashmita Joshi, MD, RD',
    wakeTime: '06:00',
    sleepTime: '22:00',
    dailyWaterLiters: 3.0,
    exerciseFrequency: 'Moderate (3-4 days/wk)',
    exerciseTypes: ['Strength Training', 'Brisk Walking'],
    stressLevel: 'moderate',
    digestiveIssues: ['Sluggish digestion', 'Mild fatty liver discomfort'],
    favoriteFoods: ['Grilled Chicken Breast', 'Egg Whites', 'Quinoa', 'Peanut Butter', 'Broccoli', 'Fish'],
    dislikedFoods: ['Red Meat', 'Heavy Cream Curries', 'Sweet Beverages'],
    medicalHistory: ['Grade 1 Fatty Liver', 'Borderline Dyslipidemia (High Triglycerides 210)'],
    foodPreference: 'Non-Vegetarian',
    dailyRoutineNotes: 'Gym in the morning at 6:45 AM. Needs high-protein recovery fuel and lean liver-protective nutrition.',
    targetCalories: 2100,
    targetProteinGrams: 155,
    targetCarbsGrams: 195,
    targetFatGrams: 58,
    targetFiberGrams: 40,
    clinicalNotes: 'Focus on choline, milk thistle extracts, high omega-3 EPA/DHA to resolve hepatic steatosis.'
  },
  {
    id: 'asmt-103',
    patientId: 'pat-3', // Ananya Sen
    version: 1,
    createdAt: '2026-02-01T16:00:00Z',
    updatedAt: '2026-02-01T16:00:00Z',
    doctorId: 'usr-2',
    doctorName: 'Dr. Rahul Singhania',
    wakeTime: '07:00',
    sleepTime: '23:00',
    dailyWaterLiters: 2.0,
    exerciseFrequency: 'Light (1-2 days/wk)',
    exerciseTypes: ['Pilates', 'Evening Stroll'],
    stressLevel: 'high',
    digestiveIssues: ['PCOS Irritable Bowel', 'Severe Sugar Cravings in late evening'],
    favoriteFoods: ['Avocado', 'Tofu Stir Fry', 'Chia Pudding', 'Dark Chocolate (85%)', 'Almond Milk'],
    dislikedFoods: ['Dairy (triggers cystic acne)', 'Gluten (causes brain fog)'],
    medicalHistory: ['PCOS with Hyperandrogenism', 'Insulin Resistance (HOMA-IR 3.4)', 'Irregular Menstrual Cycle (45-60 days)'],
    foodPreference: 'Vegan',
    dailyRoutineNotes: 'Architect with erratic project deadlines. Needs inositol-rich, anti-inflammatory seed cycling.',
    targetCalories: 1480,
    targetProteinGrams: 85,
    targetCarbsGrams: 130,
    targetFatGrams: 52,
    targetFiberGrams: 36,
    clinicalNotes: 'Dairy-free, gluten-free anti-inflammatory protocol with spearmint infusion to downregulate LH/FSH ratio.'
  }
];

// -------------------------------------------------------------------
// 2. RECIPE CATALOG (NUTRITION, INGREDIENTS, STEPS, MICRONUTRIENTS)
// -------------------------------------------------------------------
export const RECIPE_CATALOG: Record<string, RecipeDetail> = {
  'rec-chia-lemon': {
    id: 'rec-chia-lemon',
    name: 'Warm Lemon Chia & Himalayan Pink Salt Elixir',
    category: 'Detox & Metabolism',
    slotType: 'wake_up',
    prepTimeMinutes: 5,
    cookTimeMinutes: 0,
    servings: 1,
    servingSizeDescription: '1 Glass (300 ml)',
    calories: 45,
    protein: 2,
    carbs: 4,
    fat: 2.5,
    fiber: 3.5,
    micronutrients: {
      vitaminC: 40,
      calcium: 8,
      magnesium: 12,
      potassium: 10,
      sodium: 120
    },
    ingredients: [
      { item: 'Warm filtered water (40°C)', amount: '300 ml' },
      { item: 'Raw organic chia seeds (soaked overnight)', amount: '1 tbsp (12g)' },
      { item: 'Fresh lemon juice', amount: '1/2 lemon' },
      { item: 'Himalayan pink salt', amount: '1 pinch' },
      { item: 'Organic Ceylon cinnamon', amount: '1/4 tsp' }
    ],
    steps: [
      'Warm 300ml of pure water to drinking temperature (not boiling).',
      'Stir in the pre-soaked mucilage chia seeds.',
      'Squeeze in fresh lemon juice and add the pinch of pink salt.',
      'Dust with cinnamon, stir vigorously and sip slowly on an empty stomach.'
    ],
    dietaryTags: ['Vegan', 'Gluten-Free', 'Low-Glycemic', 'Keto-Friendly'],
    chefTip: 'Soaking chia seeds creates soluble mucilage fiber that lines the stomach lining and slows glucose absorption.',
    clinicalBenefit: 'Stimulates gastrocolic reflex, supports adrenals with natural electrolytes, and prevents morning cortisol spikes.',
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600'
  },
  'rec-aloe-ginger': {
    id: 'rec-aloe-ginger',
    name: 'Cold-Pressed Aloe Ginger & Amla Tonic',
    category: 'Gut Healing & Immunity',
    slotType: 'wake_up',
    prepTimeMinutes: 3,
    cookTimeMinutes: 0,
    servings: 1,
    servingSizeDescription: '1 Shot (150 ml)',
    calories: 30,
    protein: 1,
    carbs: 5,
    fat: 0.2,
    fiber: 2,
    micronutrients: {
      vitaminC: 95,
      zinc: 6,
      potassium: 8,
      iron: 4
    },
    ingredients: [
      { item: 'Pure organic Aloe Vera juice (inner leaf)', amount: '30 ml' },
      { item: 'Fresh wild Amla (Indian Gooseberry) extract', amount: '20 ml' },
      { item: 'Freshly grated ginger juice', amount: '1 tsp' },
      { item: 'Lukewarm water', amount: '100 ml' }
    ],
    steps: [
      'Combine aloe vera juice and fresh amla juice in a glass.',
      'Add freshly pressed ginger juice.',
      'Top with lukewarm water, stir well and consume immediately.'
    ],
    dietaryTags: ['Vegan', 'Ayu-Clinical', 'Zero Added Sugar', 'Anti-Inflammatory'],
    chefTip: 'Use pure inner leaf aloe gel without aloin to avoid laxative irritation while healing gastric mucosa.',
    clinicalBenefit: 'Massive antioxidant surge with natural ascorbic acid; reduces systemic TNF-alpha and enhances hepatic bile flow.',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600'
  },
  'rec-oats-greek': {
    id: 'rec-oats-greek',
    name: 'High-Protein Rolled Oats & Greek Yogurt Antioxidant Bowl',
    category: 'High Protein Breakfast',
    slotType: 'breakfast',
    prepTimeMinutes: 8,
    cookTimeMinutes: 4,
    servings: 1,
    servingSizeDescription: '1 Medium Bowl (320g)',
    calories: 385,
    protein: 26,
    carbs: 46,
    fat: 9,
    fiber: 8.5,
    micronutrients: {
      vitaminC: 25,
      calcium: 32,
      magnesium: 28,
      iron: 18,
      potassium: 16,
      zinc: 20
    },
    ingredients: [
      { item: 'Gluten-free rolled oats', amount: '45g' },
      { item: 'Strained 2% Greek Yogurt (unsweetened)', amount: '150g' },
      { item: 'Wild organic blueberries & raspberries', amount: '1/2 cup (60g)' },
      { item: 'Raw California walnuts (chopped)', amount: '12g (4 halves)' },
      { item: 'Ground flaxseed meal', amount: '1 tbsp (10g)' },
      { item: 'Ceylon cinnamon & stevia drops', amount: 'To taste' }
    ],
    steps: [
      'Simmer rolled oats in 100ml water for 3-4 minutes until creamy; let cool to lukewarm.',
      'Fold in the cold strained Greek yogurt and ground flaxseed.',
      'Top with fresh antioxidant-rich berries and crushed walnuts.',
      'Dust lightly with Ceylon cinnamon for insulin sensitization.'
    ],
    dietaryTags: ['High Protein', 'Low Glycemic', 'Vegetarian', 'Gut Friendly'],
    chefTip: 'Cooling oats slightly before adding yogurt preserves the beneficial live probiotic cultures (L. acidophilus).',
    clinicalBenefit: 'Beta-glucan soluble fiber blunts insulin response by 35% while providing slow-release amino acids for sustained satiety.',
    imageUrl: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&q=80&w=600'
  },
  'rec-paneer-chilla': {
    id: 'rec-paneer-chilla',
    name: 'Sprouted Moong & Paneer Protein Chilla with Mint Chutney',
    category: 'Ayurvedic Clinical Breakfast',
    slotType: 'breakfast',
    prepTimeMinutes: 10,
    cookTimeMinutes: 8,
    servings: 1,
    servingSizeDescription: '2 Medium Chillas (260g)',
    calories: 360,
    protein: 24,
    carbs: 34,
    fat: 12,
    fiber: 9,
    micronutrients: {
      vitaminC: 30,
      calcium: 35,
      iron: 24,
      magnesium: 22,
      potassium: 18,
      sodium: 280
    },
    ingredients: [
      { item: 'Sprouted yellow/green moong batter', amount: '1 cup (180g)' },
      { item: 'Low-fat fresh cow milk paneer (crumbled)', amount: '60g' },
      { item: 'Finely chopped spinach & coriander', amount: '1/2 cup' },
      { item: 'Cold-pressed coconut or olive oil', amount: '1 tsp (5ml)' },
      { item: 'Fresh Mint & Coriander Chutney with lemon', amount: '2 tbsp (30g)' }
    ],
    steps: [
      'Blend sprouted moong with ginger, green chili, turmeric, and pink salt into a smooth batter.',
      'Heat a seasoned cast-iron skillet, brush with 1/2 tsp oil, and spread a ladle of batter thinly.',
      'Scatter crumbled fresh paneer and chopped spinach over the center.',
      'Cook until golden-crisp on both sides and serve hot with fresh alkaline mint chutney.'
    ],
    dietaryTags: ['Gluten-Free', 'High Protein', 'Vegetarian', 'Diabetic-Safe'],
    chefTip: 'Sprouting moong decreases phytic acid by 60%, drastically increasing the bioavailability of zinc, iron, and magnesium.',
    clinicalBenefit: 'Optimal 1:1.4 protein-to-carb ratio; provides complete branch-chain amino acids without elevating triglycerides.',
    imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=600'
  },
  'rec-tender-coconut': {
    id: 'rec-tender-coconut',
    name: 'Electrolyte Tender Coconut Water & Activated Almonds',
    category: 'Mid-Meal Recharge',
    slotType: 'mid_meal',
    prepTimeMinutes: 2,
    cookTimeMinutes: 0,
    servings: 1,
    servingSizeDescription: '1 Tender Coconut (250ml) + 6 Almonds',
    calories: 120,
    protein: 3.5,
    carbs: 12,
    fat: 6.5,
    fiber: 3.8,
    micronutrients: {
      potassium: 42,
      magnesium: 24,
      vitaminC: 15,
      calcium: 8
    },
    ingredients: [
      { item: 'Fresh young green tender coconut water', amount: '250 ml' },
      { item: 'Overnight soaked & peeled Mamra almonds', amount: '6 nuts (8g)' },
      { item: 'Peeled Brazil nut (for selenium)', amount: '1 piece (4g)' }
    ],
    steps: [
      'Drink freshly tapped coconut water at room temperature.',
      'Chew soaked almonds and single Brazil nut thoroughly.'
    ],
    dietaryTags: ['Vegan', 'Raw Whole Food', 'Natural Electrolyte', 'Keto-Friendly'],
    chefTip: 'A single Brazil nut contains ~70mcg of bioavailable selenium, fulfilling 100% of the daily thyroid deiodinase cofactor requirement.',
    clinicalBenefit: 'High natural potassium and magnesium balance sodium excess, relaxing vascular tone and preventing mid-day cortisol slump.',
    imageUrl: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&q=80&w=600'
  },
  'rec-papaya-seeds': {
    id: 'rec-papaya-seeds',
    name: 'Enzyme-Rich Ripe Papaya Bowl with Pumpkin Seeds',
    category: 'Digestive Support',
    slotType: 'mid_meal',
    prepTimeMinutes: 4,
    cookTimeMinutes: 0,
    servings: 1,
    servingSizeDescription: '1 Bowl (180g)',
    calories: 110,
    protein: 3,
    carbs: 18,
    fat: 3.5,
    fiber: 4.2,
    micronutrients: {
      vitaminC: 65,
      zinc: 15,
      magnesium: 18,
      potassium: 14
    },
    ingredients: [
      { item: 'Fresh diced ripe papaya', amount: '150g' },
      { item: 'Raw unsalted pumpkin seeds', amount: '1 tbsp (10g)' },
      { item: 'Fresh lime squeeze', amount: '1 tsp' }
    ],
    steps: [
      'Dice chilled ripe papaya into bite-sized cubes.',
      'Toss with lime juice and sprinkle raw zinc-rich pumpkin seeds on top.'
    ],
    dietaryTags: ['Vegan', 'Enzyme Rich', 'Gut Friendly', 'High Fiber'],
    chefTip: 'Contains papain, a natural proteolytic enzyme that pre-digests proteins and alleviates lower gastrointestinal heaviness.',
    clinicalBenefit: 'Supports gut motility, reduces bloating, and provides zinc for pancreatic beta-cell insulin storage.',
    imageUrl: 'https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?auto=format&fit=crop&q=80&w=600'
  },
  'rec-quinoa-paneer-bowl': {
    id: 'rec-quinoa-paneer-bowl',
    name: 'Herb Grilled Paneer & Quinoa Mediterranean Macro Bowl',
    category: 'Clinical Lunch',
    slotType: 'lunch',
    prepTimeMinutes: 12,
    cookTimeMinutes: 12,
    servings: 1,
    servingSizeDescription: '1 Large Nourish Bowl (380g)',
    calories: 460,
    protein: 28,
    carbs: 44,
    fat: 18,
    fiber: 10.5,
    micronutrients: {
      calcium: 40,
      iron: 28,
      magnesium: 32,
      potassium: 24,
      vitaminC: 35,
      zinc: 22
    },
    ingredients: [
      { item: 'Fresh low-fat cow milk paneer cubes', amount: '100g' },
      { item: 'Cooked tri-color organic quinoa', amount: '3/4 cup (130g)' },
      { item: 'Sautéed broccoli, bell peppers, zucchini', amount: '1.5 cups (150g)' },
      { item: 'Baby spinach leaves', amount: '1 cup' },
      { item: 'Cold-pressed extra virgin olive oil', amount: '1 tsp (5ml)' },
      { item: 'Lemon-herb dressing with oregano & garlic', amount: '1.5 tbsp' }
    ],
    steps: [
      'Pan-sear paneer cubes with turmeric, oregano, and black pepper for 3 minutes until golden.',
      'Sauté bell peppers, broccoli florets, and zucchini lightly in olive oil, keeping them crisp-tender.',
      'Layer warm quinoa and fresh spinach at the base of the bowl.',
      'Top with grilled paneer and vibrant veggies; drizzle lemon-garlic dressing over the bowl.'
    ],
    dietaryTags: ['High Protein', 'Low Glycemic', 'Vegetarian', 'Gluten-Free'],
    chefTip: 'Al dente vegetables retain their cellular structure, prolonging digestion time and flattening post-meal glucose spikes.',
    clinicalBenefit: 'Complete protein profile with high sulfur amino acids (methionine/cysteine) supporting glutathione synthesis.',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600'
  },
  'rec-salmon-asparagus': {
    id: 'rec-salmon-asparagus',
    name: 'Wild Atlantic Salmon with Garlic Asparagus & Sweet Potato Mash',
    category: 'Clinical Lunch',
    slotType: 'lunch',
    prepTimeMinutes: 15,
    cookTimeMinutes: 14,
    servings: 1,
    servingSizeDescription: '1 Plated Entrée (360g)',
    calories: 490,
    protein: 36,
    carbs: 38,
    fat: 20,
    fiber: 8,
    micronutrients: {
      vitaminD: 85,
      vitaminB12: 120,
      potassium: 35,
      iron: 20,
      magnesium: 28,
      zinc: 25
    },
    ingredients: [
      { item: 'Wild-caught Atlantic salmon fillet', amount: '160g' },
      { item: 'Steamed young asparagus spears', amount: '10 spears (100g)' },
      { item: 'Roasted sweet potato (mashed with rosemary)', amount: '100g' },
      { item: 'Extra virgin olive oil', amount: '1 tsp' },
      { item: 'Lemon zest and fresh dill', amount: '1 tbsp' }
    ],
    steps: [
      'Season salmon with coarse sea salt, cracked black pepper, and lemon zest.',
      'Pan-sear in cast iron for 4 minutes per side until flesh flakes easily.',
      'Quickly sauté asparagus spears with crushed garlic in olive oil for 3 minutes.',
      'Serve beside warm sweet potato mash garnished with fresh dill.'
    ],
    dietaryTags: ['High Omega-3', 'Anti-Inflammatory', 'Gluten-Free', 'High Protein'],
    chefTip: 'Wild salmon delivers 1,800mg of EPA/DHA per serving compared to farmed alternatives, with zero synthetic feed dyes.',
    clinicalBenefit: 'Suppresses inflammatory prostaglandins, promotes vascular endothelial elasticity, and lowers serum triglycerides.',
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=600'
  },
  'rec-roasted-makhana': {
    id: 'rec-roasted-makhana',
    name: 'Turmeric Spiced Fox Nuts (Makhana) & Organic Green Tea',
    category: 'Metabolic Evening Snack',
    slotType: 'snack',
    prepTimeMinutes: 5,
    cookTimeMinutes: 5,
    servings: 1,
    servingSizeDescription: '1 Bowl (30g) + 1 Cup Tea',
    calories: 140,
    protein: 4.5,
    carbs: 22,
    fat: 4,
    fiber: 5.5,
    micronutrients: {
      magnesium: 25,
      calcium: 12,
      potassium: 15,
      iron: 10
    },
    ingredients: [
      { item: 'Fox nuts / Lotus seeds (Makhana)', amount: '30g (1.5 cups)' },
      { item: 'Cold-pressed A2 cow ghee or olive oil', amount: '1/2 tsp (2.5ml)' },
      { item: 'Turmeric, roasted cumin powder & rock salt', amount: '1/2 tsp' },
      { item: 'Organic Sencha green tea with spearmint', amount: '1 cup (240ml)' }
    ],
    steps: [
      'Dry roast makhana in a wide heavy skillet on low flame for 4-5 minutes until crunchy.',
      'Add 1/2 tsp ghee/oil, sprinkle turmeric, cumin, and pink salt, toss quickly to coat.',
      'Brew loose-leaf green tea in 80°C hot water for 3 minutes.',
      'Enjoy crunchy makhana with warm antioxidant green tea.'
    ],
    dietaryTags: ['Gluten-Free', 'Low-GI', 'Vegetarian', 'Anti-Inflammatory'],
    chefTip: 'Fox nuts have an extremely low glycemic index (GI 35) and are naturally astringent, curing late-afternoon snacking fatigue.',
    clinicalBenefit: 'High magnesium relaxes arterial smooth muscle; EGCG in green tea stimulates hepatic lipid oxidation.',
    imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=600'
  },
  'rec-plant-shake': {
    id: 'rec-plant-shake',
    name: 'Clean Pea & Hemp Seed Cold Brew Protein Shake',
    category: 'Post-Workout Fuel',
    slotType: 'snack',
    prepTimeMinutes: 3,
    cookTimeMinutes: 0,
    servings: 1,
    servingSizeDescription: '1 Tall Glass (350ml)',
    calories: 195,
    protein: 22,
    carbs: 12,
    fat: 6.5,
    fiber: 6,
    micronutrients: {
      iron: 30,
      zinc: 20,
      magnesium: 35,
      calcium: 15
    },
    ingredients: [
      { item: 'Organic fermented Pea Protein isolate (unsweetened)', amount: '25g scoop' },
      { item: 'Unsweetened almond or coconut milk', amount: '250 ml' },
      { item: 'Hulled hemp seeds', amount: '1 tbsp (10g)' },
      { item: 'Raw cacao powder', amount: '1 tsp (5g)' },
      { item: 'Ground cinnamon & ice cubes', amount: 'As desired' }
    ],
    steps: [
      'Add cold almond milk, pea protein, hemp seeds, and raw cacao into a high-speed blender.',
      'Blend for 30 seconds until silky and frothy.',
      'Pour over ice cubes and consume within 20 minutes.'
    ],
    dietaryTags: ['Vegan', 'High Protein', 'Dairy-Free', 'Zero Added Sugar'],
    chefTip: 'Fermented pea protein is hypoallergenic with a 98% digestibility score (PDCAAS = 1.0), avoiding bloating seen with dairy whey.',
    clinicalBenefit: 'Provides 4.5g of Branched-Chain Amino Acids (BCAA) without triggering dairy-related IGF-1 spikes in acne/PCOS patients.',
    imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&q=80&w=600'
  },
  'rec-moong-khichdi': {
    id: 'rec-moong-khichdi',
    name: 'Ayurvedic Yellow Moong & Vegetable Khichdi with Roasted Papad',
    category: 'Clinical Dinner',
    slotType: 'dinner',
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    servings: 1,
    servingSizeDescription: '1 Bowl (320g)',
    calories: 340,
    protein: 18,
    carbs: 48,
    fat: 8,
    fiber: 11,
    micronutrients: {
      iron: 22,
      potassium: 20,
      magnesium: 25,
      calcium: 15,
      sodium: 260
    },
    ingredients: [
      { item: 'Yellow split moong dal (soaked 30 mins)', amount: '50g' },
      { item: 'Brown or hand-pounded rice', amount: '30g' },
      { item: 'Diced bottle gourd (lauki), carrots, french beans', amount: '1 cup (120g)' },
      { item: 'A2 cow ghee for tadka', amount: '1 tsp (5ml)' },
      { item: 'Cumin seeds, hing (asafoetida), turmeric, ginger', amount: '1 tsp' },
      { item: 'Roasted urad dal papad', amount: '1 piece' }
    ],
    steps: [
      'In a pressure cooker or pot, heat 1 tsp ghee; splutter cumin seeds, pinch of hing, and grated ginger.',
      'Add soaked moong dal, rice, turmeric, and diced vegetables; sauté for 1 minute.',
      'Add 3 cups of water and cook until soft and soothingly porridge-like.',
      'Garnish with fresh cilantro and serve warm with roasted papad.'
    ],
    dietaryTags: ['Easy Digestion', 'Tridoshic', 'Gluten-Free', 'Vegetarian'],
    chefTip: 'Bottle gourd and yellow moong have the highest gastric emptying rate of any whole food, making this ideal for GERD and insomnia.',
    clinicalBenefit: 'Minimizes nighttime digestive workload, allowing core body temperature to drop efficiently for deep Phase 3 NREM sleep.',
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=600'
  },
  'rec-tofu-stirfry': {
    id: 'rec-tofu-stirfry',
    name: 'Sesame-Crusted Tofu & Bok Choy Zucchini Noodle Stir-Fry',
    category: 'Low-Carb Clinical Dinner',
    slotType: 'dinner',
    prepTimeMinutes: 12,
    cookTimeMinutes: 10,
    servings: 1,
    servingSizeDescription: '1 Large Plate (340g)',
    calories: 320,
    protein: 26,
    carbs: 18,
    fat: 16,
    fiber: 9.5,
    micronutrients: {
      calcium: 45,
      iron: 35,
      vitaminC: 50,
      magnesium: 30,
      potassium: 22
    },
    ingredients: [
      { item: 'Firm organic Non-GMO tofu (pressed & cubed)', amount: '150g' },
      { item: 'Fresh spiralized zucchini noodles (zoodles)', amount: '2 cups (200g)' },
      { item: 'Baby Bok Choy & Shiitake mushrooms', amount: '1 cup (100g)' },
      { item: 'Toasted sesame oil', amount: '1 tsp (5ml)' },
      { item: 'Tamari gluten-free soy sauce + grated ginger', amount: '1.5 tbsp' },
      { item: 'White & black sesame seeds', amount: '1 tsp' }
    ],
    steps: [
      'Pan-sear pressed tofu cubes in a non-stick skillet with sesame oil until golden on all sides.',
      'Add shiitake mushrooms and bok choy; stir-fry on high heat for 3 minutes with ginger and tamari.',
      'Toss in spiralized zucchini noodles during the last 90 seconds to preserve crunch.',
      'Plate immediately and sprinkle toasted sesame seeds.'
    ],
    dietaryTags: ['Vegan', 'Keto / Low-Carb', 'Gluten-Free', 'High Calcium'],
    chefTip: 'Do not overcook zoodles; flash-heating prevents water release and keeps the dish rich and saucy without needing cornstarch.',
    clinicalBenefit: 'High in bioavailable phytoestrogenic isoflavones (genistein) that gently balance estrogen-progesterone receptors in PCOS.',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600'
  },
  'rec-golden-turmeric': {
    id: 'rec-golden-turmeric',
    name: 'Bedtime Golden Turmeric & Ashwagandha Nightcap',
    category: 'Restorative Sleep & Adrenal',
    slotType: 'sleep',
    prepTimeMinutes: 4,
    cookTimeMinutes: 3,
    servings: 1,
    servingSizeDescription: '1 Mug (200ml)',
    calories: 75,
    protein: 3,
    carbs: 6,
    fat: 4.5,
    fiber: 1.5,
    micronutrients: {
      calcium: 25,
      magnesium: 30,
      potassium: 10,
      iron: 8
    },
    ingredients: [
      { item: 'Unsweetened almond milk or A2 cow milk', amount: '200 ml' },
      { item: 'High-curcumin (7%) Lakadong turmeric powder', amount: '1/2 tsp' },
      { item: 'Organic KSM-66 Ashwagandha root powder', amount: '1/4 tsp (300mg)' },
      { item: 'Freshly ground black pepper (for piperine)', amount: '1 tiny pinch' },
      { item: 'Nutmeg powder & raw organic honey (optional)', amount: '1 pinch' }
    ],
    steps: [
      'Warm milk in a small saucepan over medium-low heat (do not boil).',
      'Whisk in Lakadong turmeric, ashwagandha, pinch of black pepper, and nutmeg.',
      'Froth with a hand whisk, pour into a favorite mug, and sip 30 minutes before sleep.'
    ],
    dietaryTags: ['Ayurvedic', 'Sleep Aid', 'Anti-Inflammatory', 'Low Calorie'],
    chefTip: 'Piperine in black pepper enhances curcumin bioavailability by 2000%, ensuring active crossing of the blood-brain barrier.',
    clinicalBenefit: 'Withanolides in ashwagandha lower evening salivary cortisol, facilitating restorative deep REM sleep architecture.',
    imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=600'
  },
  'rec-chamomile-mag': {
    id: 'rec-chamomile-mag',
    name: 'Organic Chamomile Blossom & Magnesium Glycinate Infusion',
    category: 'Restorative Sleep',
    slotType: 'sleep',
    prepTimeMinutes: 3,
    cookTimeMinutes: 0,
    servings: 1,
    servingSizeDescription: '1 Cup (250ml)',
    calories: 10,
    protein: 0.2,
    carbs: 2,
    fat: 0,
    fiber: 0.5,
    micronutrients: {
      magnesium: 45,
      potassium: 6
    },
    ingredients: [
      { item: 'Whole Egyptian chamomile flowers', amount: '1.5 tbsp (loose)' },
      { item: 'Boiling water', amount: '250 ml' },
      { item: 'Magnesium glycinate soluble powder', amount: '200 mg' },
      { item: 'Fresh lemon balm leaves', amount: '3 leaves' }
    ],
    steps: [
      'Steep chamomile flowers and lemon balm in boiling water for 6 minutes covered.',
      'Strain into a cup and stir in soluble magnesium glycinate until dissolved completely.',
      'Sip in dim lighting 45 minutes before bedtime.'
    ],
    dietaryTags: ['Vegan', 'Zero Calorie', 'Caffeine Free', 'Nervous System Relaxant'],
    chefTip: 'Covering the tea while steeping traps volatile apigenin oils that bind to GABA-A receptors in the brain.',
    clinicalBenefit: 'Apigenin produces natural calming anxiolytic effects without next-morning grogginess or dependence.',
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=600'
  }
};

// -------------------------------------------------------------------
// 3. INITIAL CLINICAL MEAL PLANS (CHOICE MODE & WEEKLY MODE)
// -------------------------------------------------------------------

// Helper to construct standard choice mode slots
export const createDefaultChoiceSlots = (): MealSlot[] => [
  {
    slotType: 'wake_up',
    slotName: 'Wake Up Protocol',
    defaultTime: '06:30',
    selectedOptionId: 'rec-chia-lemon',
    notes: 'Consume within 15 minutes of waking to kickstart hydration and gut peristalsis.',
    options: [
      {
        id: 'rec-chia-lemon',
        slotType: 'wake_up',
        name: 'Warm Lemon Chia & Pink Salt Elixir',
        description: 'Warm filtered water with soaked chia mucilage, lemon juice, and Himalayan minerals.',
        portion: '1 Glass (300ml)',
        portionGrams: 300,
        calories: 45,
        protein: 2,
        carbs: 4,
        fat: 2.5,
        fiber: 3.5,
        glycemicIndex: 'Low',
        ingredients: ['300ml warm water', '1 tbsp soaked chia seeds', '1/2 lemon juice', 'Pinch Himalayan salt', 'Ceylon cinnamon'],
        instructions: ['Stir chia and lemon into warm water', 'Dust with cinnamon and sip slowly'],
        clinicalBenefit: 'Hydrates intestinal mucosa and promotes smooth bowel evacuation.',
        prepTimeMinutes: 5
      },
      {
        id: 'rec-aloe-ginger',
        slotType: 'wake_up',
        name: 'Cold-Pressed Aloe Ginger & Amla Tonic',
        description: 'Inner leaf aloe vera with fresh amla vitamin C and warm ginger extract.',
        portion: '1 Shot (150ml)',
        portionGrams: 150,
        calories: 30,
        protein: 1,
        carbs: 5,
        fat: 0.2,
        fiber: 2,
        glycemicIndex: 'Low',
        ingredients: ['30ml pure Aloe Vera', '20ml fresh Amla extract', '1 tsp ginger juice', '100ml warm water'],
        instructions: ['Mix juices into warm water and drink in 2-3 sips.'],
        clinicalBenefit: 'High antioxidant dose reduces morning oxidative stress and calms gastric acidity.',
        prepTimeMinutes: 3
      },
      {
        id: 'opt-methi-water',
        slotType: 'wake_up',
        name: 'Overnight Soaked Fenugreek (Methi) Infusion',
        description: 'Methi seed water with chewed soaked seeds for blood sugar control.',
        portion: '1 Cup (250ml)',
        portionGrams: 250,
        calories: 25,
        protein: 1.5,
        carbs: 3,
        fat: 0.5,
        fiber: 2.5,
        glycemicIndex: 'Low',
        ingredients: ['1 tsp fenugreek seeds soaked in 250ml water overnight'],
        instructions: ['Warm slightly in morning, strain water, chew seeds.'],
        clinicalBenefit: '4-hydroxyisoleucine in fenugreek stimulates glucose-dependent insulin secretion.',
        prepTimeMinutes: 2
      }
    ]
  },
  {
    slotType: 'breakfast',
    slotName: 'Breakfast (Metabolic Ignition)',
    defaultTime: '08:30',
    selectedOptionId: 'rec-oats-greek',
    notes: 'Aim for at least 22g protein to suppress ghrelin throughout the morning.',
    options: [
      {
        id: 'rec-oats-greek',
        slotType: 'breakfast',
        name: 'High-Protein Rolled Oats & Greek Yogurt Bowl',
        description: 'Gluten-free rolled oats folded with strained Greek yogurt, wild berries, walnuts, and flaxseeds.',
        portion: '1 Bowl (320g)',
        portionGrams: 320,
        calories: 385,
        protein: 26,
        carbs: 46,
        fat: 9,
        fiber: 8.5,
        glycemicIndex: 'Low',
        ingredients: ['45g rolled oats', '150g Greek Yogurt 2%', '60g blueberries', '12g raw walnuts', '10g ground flaxseed'],
        instructions: ['Cook oats in water', 'Fold in Greek yogurt and berries', 'Top with walnuts'],
        clinicalBenefit: 'Supplies soluble prebiotic fiber and gut-friendly probiotics.',
        prepTimeMinutes: 8
      },
      {
        id: 'rec-paneer-chilla',
        slotType: 'breakfast',
        name: 'Sprouted Moong & Paneer Protein Chilla (2 pcs)',
        description: 'Crispy sprouted mung bean crepes stuffed with fresh crumbled paneer and baby spinach.',
        portion: '2 Chillas (260g)',
        portionGrams: 260,
        calories: 360,
        protein: 24,
        carbs: 34,
        fat: 12,
        fiber: 9,
        glycemicIndex: 'Low',
        ingredients: ['1 cup sprouted moong batter', '60g crumbled cow paneer', '1/2 cup spinach', '1 tsp oil', 'Mint chutney'],
        instructions: ['Spread batter on skillet', 'Add paneer and spinach', 'Cook until crisp'],
        clinicalBenefit: 'Sprouting eliminates phytic acid and maximizes protein absorption.',
        prepTimeMinutes: 10
      },
      {
        id: 'opt-tofu-scramble',
        slotType: 'breakfast',
        name: 'Tofu & Vegetable Scramble with Sourdough',
        description: 'Crumbled organic tofu with turmeric, bell peppers, tomatoes, and 1 slice artisanal sourdough.',
        portion: '1 Plate (280g)',
        portionGrams: 280,
        calories: 340,
        protein: 22,
        carbs: 32,
        fat: 11,
        fiber: 7,
        glycemicIndex: 'Low',
        ingredients: ['140g firm tofu', '1 slice sourdough', 'Bell peppers', 'Turmeric & nutritional yeast', '1 tsp olive oil'],
        instructions: ['Sauté veggies and crumbled tofu', 'Serve with toasted sourdough'],
        clinicalBenefit: 'Naturally dairy-free with slow-fermented prebiotic sourdough.',
        prepTimeMinutes: 12
      }
    ]
  },
  {
    slotType: 'mid_meal',
    slotName: 'Mid Meal (Cellular Refresh)',
    defaultTime: '11:00',
    selectedOptionId: 'rec-tender-coconut',
    notes: 'Hydration and mineral repletion to maintain mental clarity.',
    options: [
      {
        id: 'rec-tender-coconut',
        slotType: 'mid_meal',
        name: 'Tender Coconut Water & Activated Almonds (6 pcs)',
        description: 'Fresh potassium-rich coconut water with peeled soaked California almonds.',
        portion: '1 Coconut + 6 Almonds',
        portionGrams: 260,
        calories: 120,
        protein: 3.5,
        carbs: 12,
        fat: 6.5,
        fiber: 3.8,
        glycemicIndex: 'Low',
        ingredients: ['250ml tender coconut water', '6 soaked Mamra almonds', '1 Brazil nut'],
        instructions: ['Drink coconut water fresh at room temperature', 'Chew nuts slowly'],
        clinicalBenefit: 'Natural intracellular electrolyte replenishment.',
        prepTimeMinutes: 2
      },
      {
        id: 'rec-papaya-seeds',
        slotType: 'mid_meal',
        name: 'Enzyme-Rich Papaya Bowl with Pumpkin Seeds',
        description: 'Freshly cubed ripe papaya topped with raw zinc-rich pumpkin seeds and lime.',
        portion: '1 Bowl (180g)',
        portionGrams: 180,
        calories: 110,
        protein: 3,
        carbs: 18,
        fat: 3.5,
        fiber: 4.2,
        glycemicIndex: 'Low',
        ingredients: ['150g ripe papaya cubes', '1 tbsp raw pumpkin seeds', 'Lime squeeze'],
        instructions: ['Toss papaya with lime and sprinkle seeds.'],
        clinicalBenefit: 'Papain enzyme soothes gastrointestinal tract and prevents bloating.',
        prepTimeMinutes: 4
      }
    ]
  },
  {
    slotType: 'lunch',
    slotName: 'Lunch (Primary Metabolic Fuel)',
    defaultTime: '13:30',
    selectedOptionId: 'rec-quinoa-paneer-bowl',
    notes: 'Balanced plate with 50% fiber veggies, 25% clean protein, and 25% complex slow carbs.',
    options: [
      {
        id: 'rec-quinoa-paneer-bowl',
        slotType: 'lunch',
        name: 'Herb Grilled Paneer & Quinoa Mediterranean Bowl',
        description: '100g pan-seared paneer with tri-color quinoa, roasted broccoli, zucchini, bell peppers, and lemon-herb olive dressing.',
        portion: '1 Nourish Bowl (380g)',
        portionGrams: 380,
        calories: 460,
        protein: 28,
        carbs: 44,
        fat: 18,
        fiber: 10.5,
        glycemicIndex: 'Low',
        ingredients: ['100g low-fat paneer', '3/4 cup cooked quinoa', '1.5 cups mixed roasted veggies', '1 tsp EVOO', 'Lemon herb dressing'],
        instructions: ['Pan sear paneer and veggies', 'Assemble over quinoa and spinach base'],
        clinicalBenefit: 'High dietary fiber and leucine for sustained energy and zero post-lunch dip.',
        prepTimeMinutes: 15
      },
      {
        id: 'rec-salmon-asparagus',
        slotType: 'lunch',
        name: 'Wild Salmon Fillet with Asparagus & Sweet Potato',
        description: 'Pan-seared Atlantic wild salmon over steamed garlic asparagus and mashed sweet potato.',
        portion: '1 Plated Entrée (360g)',
        portionGrams: 360,
        calories: 490,
        protein: 36,
        carbs: 38,
        fat: 20,
        fiber: 8,
        glycemicIndex: 'Low',
        ingredients: ['160g wild salmon fillet', '100g steamed asparagus', '100g sweet potato', '1 tsp olive oil', 'Lemon and fresh dill'],
        instructions: ['Pan sear salmon 4 mins per side', 'Sauté asparagus with garlic', 'Serve with warm mash'],
        clinicalBenefit: 'Rich in EPA/DHA fatty acids to lower CRP and systemic inflammation.',
        prepTimeMinutes: 18
      },
      {
        id: 'opt-chickpea-salad',
        slotType: 'lunch',
        name: 'Spiced Chickpea & Avocado Rainbow Salad Bowl',
        description: 'Warm seasoned kabuli chana with diced avocado, cucumbers, cherry tomatoes, and tahini lemon drizzle.',
        portion: '1 Large Bowl (350g)',
        portionGrams: 350,
        calories: 430,
        protein: 20,
        carbs: 48,
        fat: 16,
        fiber: 14,
        glycemicIndex: 'Low',
        ingredients: ['1.5 cups boiled chickpeas', '1/2 diced avocado', 'Cucumber, cherry tomatoes', '1.5 tbsp tahini dressing'],
        instructions: ['Toss boiled chickpeas with spices', 'Mix with fresh diced vegetables and tahini'],
        clinicalBenefit: 'Resistant starch feeds short-chain fatty acid (butyrate) producing colonic bacteria.',
        prepTimeMinutes: 12
      }
    ]
  },
  {
    slotType: 'snack',
    slotName: 'Evening Snack (4-5 PM Craving Buffer)',
    defaultTime: '17:00',
    selectedOptionId: 'rec-roasted-makhana',
    notes: 'Crucial slot to prevent overeating at dinner and maintain stable glycemic index.',
    options: [
      {
        id: 'rec-roasted-makhana',
        slotType: 'snack',
        name: 'Turmeric Spiced Makhana & Organic Green Tea',
        description: 'Crisp roasted lotus seeds tossed in A2 ghee, turmeric, and rock salt served with Sencha green tea.',
        portion: '1 Bowl (30g) + 1 Cup Tea',
        portionGrams: 270,
        calories: 140,
        protein: 4.5,
        carbs: 22,
        fat: 4,
        fiber: 5.5,
        glycemicIndex: 'Low',
        ingredients: ['30g fox nuts (makhana)', '1/2 tsp A2 ghee', 'Turmeric and rock salt', '1 cup organic green tea'],
        instructions: ['Roast makhana on low heat until crunchy', 'Toss in spices and ghee', 'Brew green tea'],
        clinicalBenefit: 'Calms late-afternoon dopamine cravings with zero sugar spike.',
        prepTimeMinutes: 5
      },
      {
        id: 'rec-plant-shake',
        slotType: 'snack',
        name: 'Clean Pea Protein & Hemp Seed Cacao Shake',
        description: 'Fermented pea protein blended with unsweetened almond milk, hulled hemp seeds, and raw antioxidant cacao.',
        portion: '1 Glass (350ml)',
        portionGrams: 350,
        calories: 195,
        protein: 22,
        carbs: 12,
        fat: 6.5,
        fiber: 6,
        glycemicIndex: 'Low',
        ingredients: ['25g pea protein scoop', '250ml almond milk', '1 tbsp hemp seeds', '1 tsp raw cacao', 'Ice cubes'],
        instructions: ['Blend all ingredients for 30s until frothy.'],
        clinicalBenefit: 'Rapid muscle amino acid delivery without dairy-related digestive sluggishness.',
        prepTimeMinutes: 3
      },
      {
        id: 'opt-sprouts-chaat',
        slotType: 'snack',
        name: 'Zesty Mixed Sprouts Chaat with Pomegranate',
        description: 'Steamed green moong and black chana sprouts with chopped onions, tomatoes, chaat masala, and ruby pomegranate arils.',
        portion: '1 Cup (160g)',
        portionGrams: 160,
        calories: 150,
        protein: 8,
        carbs: 26,
        fat: 1.5,
        fiber: 7,
        glycemicIndex: 'Low',
        ingredients: ['1 cup steamed sprouts', 'Diced tomatoes and onions', '2 tbsp pomegranate', 'Lemon juice & chaat masala'],
        instructions: ['Toss steamed sprouts with fresh chopped salad and lemon.'],
        clinicalBenefit: 'High polyphenols and raw enzymes enhance micronutrient absorption.',
        prepTimeMinutes: 5
      }
    ]
  },
  {
    slotType: 'dinner',
    slotName: 'Dinner (Restorative & Light)',
    defaultTime: '20:00',
    selectedOptionId: 'rec-moong-khichdi',
    notes: 'Finish dinner at least 2.5 hours before sleeping to optimize overnight growth hormone secretion.',
    options: [
      {
        id: 'rec-moong-khichdi',
        slotType: 'dinner',
        name: 'Ayurvedic Yellow Moong & Veggie Khichdi with Papad',
        description: 'Soothing split yellow moong and brown rice simmered with bottle gourd, beans, carrots, and a mild cumin-hing tadka.',
        portion: '1 Bowl (320g)',
        portionGrams: 320,
        calories: 340,
        protein: 18,
        carbs: 48,
        fat: 8,
        fiber: 11,
        glycemicIndex: 'Low',
        ingredients: ['50g yellow moong dal', '30g brown rice', '1 cup diced bottle gourd and carrots', '1 tsp ghee', 'Cumin, hing, turmeric', '1 roasted papad'],
        instructions: ['Pressure cook dal, rice and veggies with cumin ghee tadka', 'Serve warm with papad'],
        clinicalBenefit: 'Lightest gastric transit time, promoting restful deep REM sleep cycles.',
        prepTimeMinutes: 15
      },
      {
        id: 'rec-tofu-stirfry',
        slotType: 'dinner',
        name: 'Sesame-Crusted Tofu & Bok Choy Zoodle Stir-Fry',
        description: 'Pan-seared organic firm tofu tossed with spiralized zucchini noodles, shiitake mushrooms, bok choy, and ginger-tamari sauce.',
        portion: '1 Plate (340g)',
        portionGrams: 340,
        calories: 320,
        protein: 26,
        carbs: 18,
        fat: 16,
        fiber: 9.5,
        glycemicIndex: 'Low',
        ingredients: ['150g firm tofu', '2 cups spiralized zucchini noodles', '1 cup bok choy and mushrooms', '1 tsp sesame oil', 'Tamari & ginger'],
        instructions: ['Sear tofu cubes', 'Quickly stir fry bok choy and mushrooms', 'Toss zoodles in last 90s'],
        clinicalBenefit: 'Low carbohydrate load keeps evening insulin flat, maximizing lipolysis during fasting.',
        prepTimeMinutes: 12
      },
      {
        id: 'opt-grilled-paneer-soup',
        slotType: 'dinner',
        name: 'Clear Vegetable & Herb Broth with Grilled Paneer Skewers',
        description: 'Simmered lemongrass, ginger, and mushroom vegetable broth paired with 4 herb-marinated grilled paneer cubes.',
        portion: '1 Bowl Soup + 4 Skewers (310g)',
        portionGrams: 310,
        calories: 290,
        protein: 20,
        carbs: 16,
        fat: 14,
        fiber: 6.5,
        glycemicIndex: 'Low',
        ingredients: ['300ml clear vegetable broth', '80g grilled cow paneer', 'Shiitake mushrooms', 'Lemongrass, ginger, cilantro'],
        instructions: ['Simmer fragrant broth with herbs', 'Serve beside grilled paneer skewers'],
        clinicalBenefit: 'Hyper-hydrating and anti-inflammatory; ideal for patients with sluggish evening digestion.',
        prepTimeMinutes: 14
      }
    ]
  },
  {
    slotType: 'sleep',
    slotName: 'Bedtime (Nightcap & Adrenal Reset)',
    defaultTime: '22:00',
    selectedOptionId: 'rec-golden-turmeric',
    notes: 'Sip 30 minutes before sleep in warm lighting.',
    options: [
      {
        id: 'rec-golden-turmeric',
        slotType: 'sleep',
        name: 'Golden Turmeric & Ashwagandha Nightcap',
        description: 'Warm almond milk whisked with Lakadong high-curcumin turmeric, KSM-66 Ashwagandha, and a pinch of black pepper.',
        portion: '1 Mug (200ml)',
        portionGrams: 200,
        calories: 75,
        protein: 3,
        carbs: 6,
        fat: 4.5,
        fiber: 1.5,
        glycemicIndex: 'Low',
        ingredients: ['200ml almond milk', '1/2 tsp Lakadong turmeric', '1/4 tsp Ashwagandha KSM-66', 'Pinch black pepper', 'Nutmeg'],
        instructions: ['Warm milk gently', 'Whisk in turmeric, ashwagandha and pepper', 'Sip warm'],
        clinicalBenefit: 'Withanolides lower evening cortisol while curcumin suppresses nocturnal neuro-inflammation.',
        prepTimeMinutes: 4
      },
      {
        id: 'rec-chamomile-mag',
        slotType: 'sleep',
        name: 'Organic Chamomile Blossom & Magnesium Infusion',
        description: 'Loose-leaf Egyptian chamomile tea with 200mg elemental Magnesium Glycinate.',
        portion: '1 Cup (250ml)',
        portionGrams: 250,
        calories: 10,
        protein: 0.2,
        carbs: 2,
        fat: 0,
        fiber: 0.5,
        glycemicIndex: 'Low',
        ingredients: ['1.5 tbsp whole chamomile flowers', '250ml boiling water', '200mg Magnesium Glycinate', 'Lemon balm'],
        instructions: ['Steep chamomile 6 mins covered', 'Dissolve magnesium powder and sip'],
        clinicalBenefit: 'Apigenin and magnesium activate GABA-A receptors, calming neuromuscular tension.',
        prepTimeMinutes: 3
      }
    ]
  }
];

// Helper to construct full weekly days
export const createDefaultWeeklyDays = (): DayMealPlan[] => {
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  return dayNames.map((name, idx) => {
    const slots = createDefaultChoiceSlots();
    // Rotate selections for variety across days
    if (idx % 2 === 1) {
      slots[1].selectedOptionId = slots[1].options[1]?.id || slots[1].options[0].id;
      slots[3].selectedOptionId = slots[3].options[1]?.id || slots[3].options[0].id;
      slots[4].selectedOptionId = slots[4].options[1]?.id || slots[4].options[0].id;
      slots[5].selectedOptionId = slots[5].options[1]?.id || slots[5].options[0].id;
    } else if (idx % 3 === 2) {
      slots[1].selectedOptionId = slots[1].options[2]?.id || slots[1].options[0].id;
      slots[3].selectedOptionId = slots[3].options[2]?.id || slots[3].options[0].id;
      slots[5].selectedOptionId = slots[5].options[2]?.id || slots[5].options[0].id;
    }

    // Calculate totals based on selected options
    let totalCals = 0;
    let totalProt = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalFiber = 0;

    slots.forEach(slot => {
      const activeOpt = slot.options.find(o => o.id === slot.selectedOptionId) || slot.options[0];
      totalCals += activeOpt.calories;
      totalProt += activeOpt.protein;
      totalCarbs += activeOpt.carbs;
      totalFat += activeOpt.fat;
      totalFiber += activeOpt.fiber;
    });

    return {
      dayIndex: idx + 1,
      dayName: name,
      targetCalories: 1550,
      totalCalories: totalCals,
      totalProtein: totalProt,
      totalCarbs: totalCarbs,
      totalFat: totalFat,
      totalFiber: totalFiber,
      slots
    };
  });
};

export const INITIAL_CLINICAL_MEAL_PLANS: ClinicalMealPlan[] = [
  {
    id: 'plan-cl-101',
    patientId: 'pat-1', // Priya Sharma
    patientName: 'Priya Sharma',
    clinicId: 'clinic-1',
    assessmentId: 'asmt-101',
    title: 'Metabolic Reset & Insulin Sensitization Protocol',
    mode: 'choice',
    status: 'published',
    version: 2,
    targetCalories: 1550,
    targetMacros: {
      protein: 90,
      carbs: 145,
      fat: 45,
      fiber: 35
    },
    slots: createDefaultChoiceSlots(),
    weeklyDays: createDefaultWeeklyDays(),
    generalInstructions: [
      'Maintain minimum 12-hour overnight fasting window between Bedtime drink and Wake-up elixir.',
      'Chew all food thoroughly (at least 20 chews per bite) to maximize salivary amylase action.',
      'Do not consume cold iced water during meals; sip warm water if needed.',
      'Take a brisk 10-minute walk within 30 minutes after Lunch and Dinner to lower postprandial glucose.'
    ],
    hydrationGuidelines: 'Drink 2.5 - 2.8 Liters of filtered water daily. Finish 80% of hydration before 7:00 PM.',
    clinicalRationale: 'Focuses on low glycemic load whole foods, high bioavailable leucine from paneer/yogurt, and soluble mucilage fiber to normalize HbA1c from 6.2% to <5.6% within 90 days.',
    createdBy: 'Dr. Ashmita Joshi, MD, RD',
    createdAt: '2026-02-16T10:00:00Z',
    publishedAt: '2026-02-18T14:30:00Z',
    changeLog: [
      'v1 created as baseline draft.',
      'v2 adjusted evening snack to high-protein pea shake and added Ashwagandha nightcap.'
    ]
  },
  {
    id: 'plan-cl-102',
    patientId: 'pat-2', // Rahul Verma
    patientName: 'Rahul Verma',
    clinicId: 'clinic-1',
    assessmentId: 'asmt-102',
    title: 'Hepatic Recovery & Lean Muscle Hypertrophy Plan',
    mode: 'weekly',
    status: 'published',
    version: 1,
    targetCalories: 2100,
    targetMacros: {
      protein: 155,
      carbs: 195,
      fat: 58,
      fiber: 40
    },
    slots: createDefaultChoiceSlots(),
    weeklyDays: createDefaultWeeklyDays(),
    generalInstructions: [
      'Post-workout meal should be consumed within 45 minutes of training.',
      'Strictly avoid trans-fats and ultra-processed seed oils to accelerate hepatic steatosis reversal.',
      'Include 2 servings of cruciferous vegetables daily (broccoli, cabbage, kale).'
    ],
    hydrationGuidelines: 'Target 3.2 - 3.5 Liters of water daily to support high protein clearance and creatine filtration.',
    clinicalRationale: 'High omega-3 and choline protocol designed to mobilize liver fat stores while fueling 4x/week resistance training.',
    createdBy: 'Dr. Ashmita Joshi, MD, RD',
    createdAt: '2026-01-12T11:00:00Z',
    publishedAt: '2026-01-12T17:00:00Z'
  }
];

// -------------------------------------------------------------------
// 4. INITIAL EXERCISE PLANS
// -------------------------------------------------------------------
export const INITIAL_EXERCISE_PLANS: ExercisePlan[] = [
  {
    id: 'ex-plan-101',
    patientId: 'pat-1', // Priya Sharma
    clinicId: 'clinic-1',
    title: 'PCOS & Insulin Sensitizing Metabolic Flow',
    status: 'published',
    weeklyGoalDays: 4,
    dailyStepTarget: 8500,
    doctorNotes: 'Focus on low-cortisol resistance training and post-meal glucose walks. Avoid excessive high-intensity chronic cardio that can trigger adrenal fatigue.',
    createdAt: '2026-02-16T11:00:00Z',
    publishedAt: '2026-02-18T14:30:00Z',
    routines: [
      {
        dayName: 'Monday',
        dayShort: 'Mon',
        focus: 'Lower Body Strength & Glucose Disposal',
        isRestDay: false,
        targetMinutes: 35,
        exercises: [
          {
            id: 'ex-1',
            name: 'Bodyweight Goblet Squats',
            category: 'Strength',
            sets: 3,
            reps: '12-15 reps',
            intensity: 'Moderate',
            timeOfDay: 'Morning',
            instructions: ['Keep feet shoulder-width apart', 'Descend slowly over 3 seconds', 'Drive up through heels']
          },
          {
            id: 'ex-2',
            name: 'Dumbbell Romanian Deadlifts',
            category: 'Strength',
            sets: 3,
            reps: '10-12 reps',
            intensity: 'Moderate',
            timeOfDay: 'Morning',
            instructions: ['Hinge at hips with flat back', 'Feel hamstring stretch', 'Squeeze glutes at top']
          },
          {
            id: 'ex-3',
            name: 'Glute Bridges with Mini-Band',
            category: 'Core & Posture',
            sets: 3,
            reps: '15 reps',
            intensity: 'Low',
            timeOfDay: 'Morning',
            instructions: ['Drive knees outwards against resistance band', 'Hold top for 2 seconds']
          },
          {
            id: 'ex-4',
            name: 'Post-Lunch Metabolic Stroll',
            category: 'Cardio',
            durationMinutes: 15,
            intensity: 'Low',
            timeOfDay: 'Post-Meal',
            instructions: ['Brisk continuous walking immediately after lunch to lower glucose spike by 40%']
          }
        ]
      },
      {
        dayName: 'Tuesday',
        dayShort: 'Tue',
        focus: 'Active Recovery & Vagus Nerve Yoga',
        isRestDay: false,
        targetMinutes: 25,
        exercises: [
          {
            id: 'ex-5',
            name: 'Cat-Cow Spinal Mobility & Diaphragmatic Breath',
            category: 'Mobility & Yoga',
            durationMinutes: 8,
            intensity: 'Low',
            timeOfDay: 'Morning',
            instructions: ['Inhale to arch spine and expand belly', 'Exhale to tuck chin and engage pelvic floor']
          },
          {
            id: 'ex-6',
            name: 'Pigeon Pose Hip Opener',
            category: 'Mobility & Yoga',
            durationMinutes: 6,
            intensity: 'Low',
            timeOfDay: 'Evening',
            instructions: ['Hold each side for 90 seconds', 'Release deep pelvic tension']
          },
          {
            id: 'ex-7',
            name: 'Evening 2,000 Step De-Stress Walk',
            category: 'Cardio',
            durationMinutes: 15,
            intensity: 'Low',
            timeOfDay: 'Evening',
            instructions: ['Relaxed walking without listening to work podcasts']
          }
        ]
      },
      {
        dayName: 'Wednesday',
        dayShort: 'Wed',
        focus: 'Upper Body & Posture Alignment',
        isRestDay: false,
        targetMinutes: 30,
        exercises: [
          {
            id: 'ex-8',
            name: 'Resistance Band Lat Pulldowns / Rows',
            category: 'Strength',
            sets: 3,
            reps: '12 reps',
            intensity: 'Moderate',
            timeOfDay: 'Morning',
            instructions: ['Retract shoulder blades fully before pulling']
          },
          {
            id: 'ex-9',
            name: 'Incline Push-Ups (Desk / Wall)',
            category: 'Strength',
            sets: 3,
            reps: '10 reps',
            intensity: 'Moderate',
            timeOfDay: 'Morning',
            instructions: ['Maintain plank core tightness throughout']
          },
          {
            id: 'ex-10',
            name: 'Bird-Dog Core Stability',
            category: 'Core & Posture',
            sets: 3,
            reps: '10 reps per side',
            intensity: 'Low',
            timeOfDay: 'Morning',
            instructions: ['Extend opposite arm and leg without arching lumbar spine']
          }
        ]
      },
      {
        dayName: 'Thursday',
        dayShort: 'Thu',
        focus: 'Full Rest & Cellular Restoration',
        isRestDay: true,
        targetMinutes: 0,
        exercises: []
      },
      {
        dayName: 'Friday',
        dayShort: 'Fri',
        focus: 'Full-Body Metabolic Circuit',
        isRestDay: false,
        targetMinutes: 35,
        exercises: [
          {
            id: 'ex-11',
            name: 'Dumbbell Step-Ups on Bench',
            category: 'Strength',
            sets: 3,
            reps: '10 per leg',
            intensity: 'Moderate',
            timeOfDay: 'Morning',
            instructions: ['Drive through lead heel without bouncing off back foot']
          },
          {
            id: 'ex-12',
            name: 'Standing Overhead Dumbbell Press',
            category: 'Strength',
            sets: 3,
            reps: '12 reps',
            intensity: 'Moderate',
            timeOfDay: 'Morning',
            instructions: ['Exhale pressing up; do not flare ribs']
          },
          {
            id: 'ex-13',
            name: 'Plank with Shoulder Taps',
            category: 'Core & Posture',
            sets: 3,
            reps: '16 taps total',
            intensity: 'Moderate',
            timeOfDay: 'Morning',
            instructions: ['Prevent hip sway as hands tap opposite shoulder']
          }
        ]
      },
      {
        dayName: 'Saturday',
        dayShort: 'Sat',
        focus: 'Nature Zone 2 Cardio & Sunlight Walk',
        isRestDay: false,
        targetMinutes: 45,
        exercises: [
          {
            id: 'ex-14',
            name: 'Outdoor Morning Sunlight Brisk Walk',
            category: 'Cardio',
            durationMinutes: 45,
            intensity: 'Moderate',
            timeOfDay: 'Morning',
            instructions: ['Walk at conversational pace (Heart Rate ~115-125 bpm) in direct natural sunlight']
          }
        ]
      },
      {
        dayName: 'Sunday',
        dayShort: 'Sun',
        focus: 'Deep Rest & Magnesium Bath',
        isRestDay: true,
        targetMinutes: 0,
        exercises: []
      }
    ]
  }
];

// -------------------------------------------------------------------
// 5. INITIAL PATIENT DAILY LOGS (WATER, MEALS CHECK-OFF, EXERCISE)
// -------------------------------------------------------------------
export const INITIAL_PATIENT_LOGS: Record<string, PatientDailyLog> = {
  'pat-1': {
    date: new Date().toISOString().split('T')[0],
    waterGlassesDrank: 6,
    waterGoalGlasses: 8,
    mealsStatus: {
      'rec-chia-lemon': 'eaten',
      'rec-oats-greek': 'eaten',
      'rec-tender-coconut': 'eaten',
      'rec-quinoa-paneer-bowl': 'eaten',
      'rec-roasted-makhana': 'pending',
      'rec-moong-khichdi': 'pending',
      'rec-golden-turmeric': 'pending'
    },
    exercisesCompleted: ['ex-1', 'ex-2', 'ex-4'],
    weightKg: 68.2,
    notes: 'Feeling light after morning oats and walk!'
  }
};
