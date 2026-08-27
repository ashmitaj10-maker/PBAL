import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  MealEntry, 
  FoodItem, 
  MealType, 
  WeeklyMealPlan, 
  PlannedMeal, 
  GroceryItem, 
  ChatMessage, 
  FastingState,
  DayNutritionLog
} from '../types';
import { calculateRecommendedMacros, calculateTdee } from '../utils/nutritionCalculators';

interface NutritionContextType {
  activeTab: 'dashboard' | 'scanner' | 'planner' | 'analytics' | 'chat' | 'grocery';
  setActiveTab: (tab: 'dashboard' | 'scanner' | 'planner' | 'analytics' | 'chat' | 'grocery') => void;
  profile: UserProfile;
  updateProfile: (updated: Partial<UserProfile>) => void;
  todayMeals: MealEntry[];
  addMealEntry: (meal: Omit<MealEntry, 'id' | 'timestamp'>) => void;
  removeMealEntry: (id: string) => void;
  deleteFoodItem: (mealId: string, itemId: string) => void;
  waterMl: number;
  addWater: (amountMl: number) => void;
  resetWater: () => void;
  fasting: FastingState;
  startFasting: (targetHours?: number) => void;
  stopFasting: () => void;
  activeMealPlan: WeeklyMealPlan;
  setActiveMealPlan: (plan: WeeklyMealPlan) => void;
  swapMealInPlan: (dayIndex: number, mealId: string, newMeal: PlannedMeal) => void;
  groceryList: GroceryItem[];
  toggleGroceryItem: (id: string) => void;
  addGroceryItem: (item: Omit<GroceryItem, 'id' | 'checked'>) => void;
  removeGroceryItem: (id: string) => void;
  clearCheckedGroceries: () => void;
  populateGroceriesFromPlan: (items: GroceryItem[]) => void;
  chatMessages: ChatMessage[];
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  weeklyHistory: DayNutritionLog[];
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  isQuickLogOpen: boolean;
  setIsQuickLogOpen: (open: boolean) => void;
  selectedPlannedMealForModal: PlannedMeal | null;
  setSelectedPlannedMealForModal: (meal: PlannedMeal | null) => void;
}

const DEFAULT_PROFILE: UserProfile = {
  name: "Ashmita",
  age: 30,
  gender: "female",
  heightCm: 168,
  weightKg: 64.5,
  targetWeightKg: 60.0,
  activityLevel: "moderate",
  primaryGoal: "metabolic_health",
  dietType: "mediterranean",
  dailyCalorieTarget: 1950,
  proteinTargetGrams: 125,
  carbsTargetGrams: 185,
  fatTargetGrams: 62,
  fiberTargetGrams: 32,
  waterTargetMl: 2500,
  medicalConditions: ["Insulin Optimization", "Mild Joint Inflammation"],
  allergies: ["Shellfish"],
  intermittentFastingHours: 16,
};

const INITIAL_TODAY_MEALS: MealEntry[] = [
  {
    id: "meal-1",
    mealType: "breakfast",
    timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
    totalCalories: 430,
    totalProtein: 32,
    totalCarbs: 38,
    totalFat: 14,
    totalFiber: 9,
    notes: "Post-morning walk breakfast",
    items: [
      {
        id: "f1",
        name: "Greek Yogurt with Blueberries & Chia Seeds",
        portion: "1 cup (240g)",
        portionGrams: 240,
        calories: 280,
        protein: 24,
        carbs: 26,
        fat: 8,
        fiber: 6,
        sugar: 12,
        sodium: 85,
        glycemicIndex: "Low",
        glycemicLoad: 6,
        healthScore: 95,
        allergens: ["Dairy"],
        clinicalInsights: "High bioavailability protein and anthocyanins for cognitive and cellular vitality."
      },
      {
        id: "f2",
        name: "Soft Boiled Pasture-Raised Egg",
        portion: "1 large (50g)",
        portionGrams: 50,
        calories: 78,
        protein: 6.5,
        carbs: 0.6,
        fat: 5.3,
        fiber: 0,
        sodium: 62,
        glycemicIndex: "Low",
        healthScore: 92,
        clinicalInsights: "Rich in choline and lutein supporting neurological and hepatic function."
      },
      {
        id: "f3",
        name: "Handful of Raw Walnuts",
        portion: "15g",
        portionGrams: 15,
        calories: 72,
        protein: 1.5,
        carbs: 11.4,
        fat: 0.7,
        fiber: 3,
        glycemicIndex: "Low",
        healthScore: 90,
      }
    ]
  },
  {
    id: "meal-2",
    mealType: "lunch",
    timestamp: new Date(Date.now() - 1 * 3600000).toISOString(),
    totalCalories: 560,
    totalProtein: 44,
    totalCarbs: 48,
    totalFat: 20,
    totalFiber: 11,
    notes: "Mediterranean power bowl",
    items: [
      {
        id: "f4",
        name: "Wild Alaskan Salmon Fillet",
        portion: "150g",
        portionGrams: 150,
        calories: 280,
        protein: 34,
        carbs: 0,
        fat: 15,
        fiber: 0,
        sodium: 90,
        glycemicIndex: "Low",
        healthScore: 98,
        clinicalInsights: "Concentrated EPA & DHA Omega-3 fatty acids for endothelial and cardiovascular health."
      },
      {
        id: "f5",
        name: "Steamed Tricolor Quinoa & Baby Spinach",
        portion: "1 cup (185g)",
        portionGrams: 185,
        calories: 210,
        protein: 8,
        carbs: 39,
        fat: 3.5,
        fiber: 8,
        sodium: 40,
        glycemicIndex: "Low",
        glycemicLoad: 12,
        healthScore: 94,
        clinicalInsights: "Complete amino acid profile paired with non-heme iron and folate."
      },
      {
        id: "f6",
        name: "Avocado & Cold-Pressed EVOO Dressing",
        portion: "1 tbsp dressing + 1/4 avocado",
        portionGrams: 45,
        calories: 70,
        protein: 2,
        carbs: 9,
        fat: 1.5,
        fiber: 3,
        glycemicIndex: "Low",
        healthScore: 96,
      }
    ]
  }
];

const INITIAL_MEAL_PLAN: WeeklyMealPlan = {
  id: "plan-med-default",
  title: "Clinical Mediterranean Longevity & Metabolic Plan",
  dietType: "mediterranean",
  description: "Scientifically formulated with anti-inflammatory whole foods, high polyphenol ratios, and optimized protein distribution for sustained metabolic rate.",
  createdDate: new Date().toISOString(),
  days: [
    {
      dayIndex: 1,
      dayName: "Monday",
      totalCalories: 1980,
      totalProtein: 138,
      totalCarbs: 175,
      totalFat: 64,
      totalFiber: 36,
      meals: [
        {
          id: "mon-1",
          mealType: "breakfast",
          name: "Organic Greek Yogurt & Wild Berry Bowl",
          description: "2% Strained Greek yogurt topped with wild blueberries, organic chia seeds, and raw crushed walnuts.",
          prepTimeMinutes: 6,
          calories: 410,
          protein: 32,
          carbs: 36,
          fat: 14,
          fiber: 9,
          glycemicIndex: "Low",
          ingredients: ["1 cup Greek yogurt 2%", "1/2 cup blueberries", "1 tbsp chia seeds", "15g raw walnuts"],
          instructions: ["Combine Greek yogurt in a glass bowl.", "Stir in chia seeds and allow to hydrate for 2 mins.", "Top with blueberries and walnuts."],
          clinicalBenefit: "High leucine for muscle protein synthesis + prebiotic soluble fiber."
        },
        {
          id: "mon-2",
          mealType: "lunch",
          name: "Grilled Wild Salmon & Tricolor Quinoa Bowl",
          description: "Wild salmon fillet over cooked quinoa, baby arugula, cherry tomatoes, and cold-pressed extra virgin olive oil.",
          prepTimeMinutes: 18,
          calories: 590,
          protein: 44,
          carbs: 48,
          fat: 22,
          fiber: 10,
          glycemicIndex: "Low",
          ingredients: ["160g wild salmon fillet", "3/4 cup cooked quinoa", "2 cups baby arugula", "6 cherry tomatoes", "1 tbsp EVOO", "1/2 lemon juice"],
          instructions: ["Season salmon with sea salt, pepper, and oregano.", "Pan sear in olive oil for 4 mins per side.", "Plate over quinoa and greens with fresh lemon."],
          clinicalBenefit: "Provides 2.1g of marine Omega-3s (EPA/DHA) to suppress NF-kB inflammatory cascades."
        },
        {
          id: "mon-3",
          mealType: "dinner",
          name: "Lemon-Herb Roasted Free-Range Chicken & Asparagus",
          description: "Lean skinless chicken breast roasted with rosemary and garlic, served with steamed asparagus spears and roasted sweet potato wedges.",
          prepTimeMinutes: 25,
          calories: 620,
          protein: 48,
          carbs: 52,
          fat: 16,
          fiber: 11,
          glycemicIndex: "Low",
          ingredients: ["180g chicken breast", "1 medium sweet potato", "12 asparagus spears", "1 tbsp olive oil", "2 cloves fresh garlic", "Fresh rosemary"],
          instructions: ["Cube sweet potato and toss with olive oil, roast at 200°C for 20 mins.", "Pan-sear chicken with garlic and rosemary.", "Steam asparagus for 4 mins until tender-crisp."],
          clinicalBenefit: "Abundant potassium and magnesium to support nocturnal parasympathetic activation and blood pressure."
        },
        {
          id: "mon-4",
          mealType: "snack",
          name: "Green Apple Slices & Raw Almond Butter",
          description: "Crisp tart green apple wedges paired with pure stone-ground almond butter.",
          prepTimeMinutes: 3,
          calories: 220,
          protein: 6,
          carbs: 24,
          fat: 12,
          fiber: 6,
          glycemicIndex: "Low",
          ingredients: ["1 medium Granny Smith apple", "1 tbsp raw unsweetened almond butter", "Pinch of Ceylon cinnamon"],
          instructions: ["Slice apple into wedges.", "Serve with almond butter for dipping."],
          clinicalBenefit: "Apple pectin slows carbohydrate absorption, preventing glycemic volatility."
        }
      ]
    },
    {
      dayIndex: 2,
      dayName: "Tuesday",
      totalCalories: 1940,
      totalProtein: 135,
      totalCarbs: 168,
      totalFat: 68,
      totalFiber: 34,
      meals: [
        {
          id: "tue-1",
          mealType: "breakfast",
          name: "Spinach, Tomato & Feta Pasture-Raised Omelette",
          description: "3 whole pasture-raised eggs whisked with baby spinach, vine-ripened tomatoes, and authentic sheep's feta with 1 slice sourdough toast.",
          prepTimeMinutes: 10,
          calories: 440,
          protein: 28,
          carbs: 26,
          fat: 24,
          fiber: 6,
          glycemicIndex: "Low",
          ingredients: ["3 pasture-raised eggs", "1 cup fresh spinach", "1/2 cup diced tomato", "25g feta cheese", "1 slice artisan sourdough"],
          instructions: ["Whisk eggs with a splash of water and sea salt.", "Sauté spinach and tomatoes in a skillet with olive oil.", "Pour eggs over vegetables, top with crumbled feta and fold."],
          clinicalBenefit: "High bioavailability choline and zeaxanthin for cellular membrane integrity."
        },
        {
          id: "tue-2",
          mealType: "lunch",
          name: "Mediterranean Tuna & Chickpea Herb Salad",
          description: "Wild skipjack tuna tossed with tender chickpeas, diced Persian cucumbers, kalamata olives, flat-leaf parsley, and red wine vinaigrette.",
          prepTimeMinutes: 12,
          calories: 540,
          protein: 46,
          carbs: 44,
          fat: 18,
          fiber: 12,
          glycemicIndex: "Low",
          ingredients: ["1 can (160g) wild tuna in olive oil", "1/2 cup cooked chickpeas", "1 Persian cucumber", "6 kalamata olives", "Fresh parsley", "Red wine vinegar"],
          instructions: ["Rinse chickpeas and combine in a bowl with drained tuna.", "Add diced cucumber, sliced olives, and chopped parsley.", "Toss with red wine vinegar and extra virgin olive oil."],
          clinicalBenefit: "Resistant starch from chickpeas feeds Bifidobacteria in the distal colon."
        },
        {
          id: "tue-3",
          mealType: "dinner",
          name: "Pan-Seared Grass-Fed Beef & Roasted Mediterranean Veggies",
          description: "Lean grass-fed sirloin cutlet served alongside roasted zucchini, bell peppers, red onion, and fresh rosemary.",
          prepTimeMinutes: 20,
          calories: 640,
          protein: 48,
          carbs: 38,
          fat: 24,
          fiber: 9,
          glycemicIndex: "Low",
          ingredients: ["170g grass-fed sirloin steak", "1 medium zucchini", "1 red bell pepper", "1/2 red onion", "1 tbsp extra virgin olive oil"],
          instructions: ["Chop vegetables into chunks and roast at 200°C for 18 mins.", "Sear steak in a cast-iron skillet for 3 mins per side.", "Rest steak for 5 mins before slicing."],
          clinicalBenefit: "High bioavailable heme iron and zinc to support red blood cell hemoglobin and enzymatic metabolism."
        },
        {
          id: "tue-4",
          mealType: "snack",
          name: "Edamame & Pumpkin Seed Protein Crunch",
          description: "Steamed organic edamame in pods dusted with sea salt and roasted pepitas.",
          prepTimeMinutes: 4,
          calories: 210,
          protein: 13,
          carbs: 14,
          fat: 10,
          fiber: 7,
          glycemicIndex: "Low",
          ingredients: ["1 cup steamed edamame in pod", "1 tbsp raw pumpkin seeds", "Flaky sea salt"],
          instructions: ["Steam edamame pods for 3 mins.", "Sprinkle with sea salt and pumpkin seeds."],
          clinicalBenefit: "Abundant magnesium and phytoestrogenic lignans for hormone balance."
        }
      ]
    }
  ]
};

const INITIAL_GROCERIES: GroceryItem[] = [
  { id: "g1", name: "Wild Alaskan Salmon Fillets", category: "Lean Proteins", quantity: "4 portions (600g)", estimatedPrice: "$18.00", checked: false, nutritionalHighlight: "High EPA/DHA Omega-3s" },
  { id: "g2", name: "Organic Baby Spinach & Arugula", category: "Produce & Greens", quantity: "2 large containers", estimatedPrice: "$6.00", checked: true, nutritionalHighlight: "Lutein, Folate, Iron" },
  { id: "g3", name: "Extra Virgin Olive Oil (Cold-Pressed)", category: "Healthy Fats & Oils", quantity: "1 bottle (500ml)", estimatedPrice: "$12.50", checked: true, nutritionalHighlight: "75% Oleic Acid, High Polyphenols" },
  { id: "g4", name: "Organic Tricolor Quinoa", category: "Whole Grains & Complex Carbs", quantity: "1 bag (500g)", estimatedPrice: "$4.50", checked: false, nutritionalHighlight: "Complete Protein & Magnesium" },
  { id: "g5", name: "Greek Strained Yogurt 2%", category: "Dairy & Alternatives", quantity: "1 kg tub", estimatedPrice: "$5.80", checked: false, nutritionalHighlight: "Probiotics & Casein Protein" },
  { id: "g6", name: "Fresh Hass Avocados", category: "Healthy Fats & Oils", quantity: "4 medium", estimatedPrice: "$5.00", checked: false, nutritionalHighlight: "Potassium & Monounsaturated Lipids" },
  { id: "g7", name: "Raw Chia Seeds", category: "Spices, Seeds & Superfoods", quantity: "250g bag", estimatedPrice: "$3.50", checked: false, nutritionalHighlight: "Soluble prebiotic fiber" },
  { id: "g8", name: "Organic Wild Blueberries", category: "Produce & Greens", quantity: "2 punnets (300g)", estimatedPrice: "$5.50", checked: false, nutritionalHighlight: "Anthocyanins & Vitamin C" },
];

const INITIAL_CHAT: ChatMessage[] = [
  {
    id: "welcome-1",
    sender: "assistant",
    text: `### Welcome to Perfect Body & Life Nutrition AI

I am **Dr. Maya**, your AI Clinical Nutritionist and Metabolic Health Scientist. 

I'm here to provide evidence-based nutritional guidance, optimize your macronutrient balance, review your food logs, and design targeted dietary protocols for your health goals.

Here are a few ways we can work together:
- **Biochemical food optimization**: Ask how specific meals affect your insulin, gut microbiome, and athletic recovery.
- **Personalized swaps**: Request ingredient alternatives for food sensitivities or macro balancing.
- **Meal planning**: Generate clinical weekly plans (Mediterranean, High-Protein, Low-Glycemic, DASH).

What would you like to explore today?`,
    timestamp: new Date().toISOString(),
    clinicalSources: [
      "American Journal of Clinical Nutrition",
      "Harvard T.H. Chan School of Public Health Dietary Guidelines"
    ],
    suggestedFollowUps: [
      "How can I optimize protein distribution across 3 meals?",
      "What foods improve post-meal insulin sensitivity?",
      "Recommend healthy snacks with low glycemic load"
    ]
  }
];

const NutritionContext = createContext<NutritionContextType | undefined>(undefined);

export const NutritionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'scanner' | 'planner' | 'analytics' | 'chat' | 'grocery'>('dashboard');
  
  // Persisted state with local storage fallback
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('pbl_user_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return DEFAULT_PROFILE;
  });

  const [todayMeals, setTodayMeals] = useState<MealEntry[]>(() => {
    const saved = localStorage.getItem('pbl_today_meals');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_TODAY_MEALS;
  });

  const [waterMl, setWaterMl] = useState<number>(() => {
    const saved = localStorage.getItem('pbl_water_ml');
    return saved ? parseInt(saved, 10) : 1500;
  });

  const [fasting, setFasting] = useState<FastingState>(() => {
    const saved = localStorage.getItem('pbl_fasting');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      isFasting: true,
      startTime: Date.now() - 14.5 * 3600000, // 14.5 hours into a 16 hour fast
      targetHours: 16
    };
  });

  const [activeMealPlan, setActiveMealPlan] = useState<WeeklyMealPlan>(() => {
    const saved = localStorage.getItem('pbl_active_meal_plan');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_MEAL_PLAN;
  });

  const [groceryList, setGroceryList] = useState<GroceryItem[]>(() => {
    const saved = localStorage.getItem('pbl_grocery_list');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_GROCERIES;
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('pbl_chat_messages');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_CHAT;
  });

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [selectedPlannedMealForModal, setSelectedPlannedMealForModal] = useState<PlannedMeal | null>(null);

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem('pbl_user_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('pbl_today_meals', JSON.stringify(todayMeals));
  }, [todayMeals]);

  useEffect(() => {
    localStorage.setItem('pbl_water_ml', waterMl.toString());
  }, [waterMl]);

  useEffect(() => {
    localStorage.setItem('pbl_fasting', JSON.stringify(fasting));
  }, [fasting]);

  useEffect(() => {
    localStorage.setItem('pbl_active_meal_plan', JSON.stringify(activeMealPlan));
  }, [activeMealPlan]);

  useEffect(() => {
    localStorage.setItem('pbl_grocery_list', JSON.stringify(groceryList));
  }, [groceryList]);

  useEffect(() => {
    localStorage.setItem('pbl_chat_messages', JSON.stringify(chatMessages));
  }, [chatMessages]);

  const updateProfile = (updated: Partial<UserProfile>) => {
    setProfile(prev => {
      const merged = { ...prev, ...updated };
      // Recalculate TDEE and macros if biometrics changed
      if (updated.weightKg || updated.heightCm || updated.age || updated.activityLevel || updated.primaryGoal || updated.dietType) {
        const tdee = calculateTdee(merged);
        const macros = calculateRecommendedMacros(tdee, merged.primaryGoal, merged.dietType, merged.weightKg);
        merged.dailyCalorieTarget = macros.calories;
        merged.proteinTargetGrams = macros.proteinGrams;
        merged.carbsTargetGrams = macros.carbsGrams;
        merged.fatTargetGrams = macros.fatGrams;
        merged.fiberTargetGrams = macros.fiberGrams;
        merged.waterTargetMl = macros.waterMl;
      }
      return merged;
    });
  };

  const addMealEntry = (mealData: Omit<MealEntry, 'id' | 'timestamp'>) => {
    const newEntry: MealEntry = {
      ...mealData,
      id: "meal-" + Date.now(),
      timestamp: new Date().toISOString(),
    };
    setTodayMeals(prev => [newEntry, ...prev]);
  };

  const removeMealEntry = (id: string) => {
    setTodayMeals(prev => prev.filter(m => m.id !== id));
  };

  const deleteFoodItem = (mealId: string, itemId: string) => {
    setTodayMeals(prev => {
      return prev.map(meal => {
        if (meal.id !== mealId) return meal;
        const filteredItems = meal.items.filter(i => i.id !== itemId);
        if (filteredItems.length === 0) return null as any;
        const totalCalories = filteredItems.reduce((sum, item) => sum + item.calories, 0);
        const totalProtein = filteredItems.reduce((sum, item) => sum + item.protein, 0);
        const totalCarbs = filteredItems.reduce((sum, item) => sum + item.carbs, 0);
        const totalFat = filteredItems.reduce((sum, item) => sum + item.fat, 0);
        const totalFiber = filteredItems.reduce((sum, item) => sum + item.fiber, 0);
        return {
          ...meal,
          items: filteredItems,
          totalCalories,
          totalProtein,
          totalCarbs,
          totalFat,
          totalFiber,
        };
      }).filter(Boolean);
    });
  };

  const addWater = (amountMl: number) => {
    setWaterMl(prev => Math.min(6000, Math.max(0, prev + amountMl)));
  };

  const resetWater = () => {
    setWaterMl(0);
  };

  const startFasting = (targetHours = 16) => {
    setFasting({
      isFasting: true,
      startTime: Date.now(),
      targetHours,
    });
  };

  const stopFasting = () => {
    setFasting(prev => ({
      ...prev,
      isFasting: false,
    }));
  };

  const swapMealInPlan = (dayIndex: number, mealId: string, newMeal: PlannedMeal) => {
    setActiveMealPlan(prev => {
      const updatedDays = prev.days.map(d => {
        if (d.dayIndex !== dayIndex) return d;
        const updatedMeals = d.meals.map(m => m.id === mealId ? newMeal : m);
        const totalCalories = updatedMeals.reduce((sum, m) => sum + m.calories, 0);
        const totalProtein = updatedMeals.reduce((sum, m) => sum + m.protein, 0);
        const totalCarbs = updatedMeals.reduce((sum, m) => sum + m.carbs, 0);
        const totalFat = updatedMeals.reduce((sum, m) => sum + m.fat, 0);
        const totalFiber = updatedMeals.reduce((sum, m) => sum + m.fiber, 0);
        return {
          ...d,
          meals: updatedMeals,
          totalCalories,
          totalProtein,
          totalCarbs,
          totalFat,
          totalFiber,
        };
      });
      return {
        ...prev,
        days: updatedDays,
      };
    });
  };

  const toggleGroceryItem = (id: string) => {
    setGroceryList(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const addGroceryItem = (item: Omit<GroceryItem, 'id' | 'checked'>) => {
    const newItem: GroceryItem = {
      ...item,
      id: "grocery-" + Date.now(),
      checked: false,
    };
    setGroceryList(prev => [newItem, ...prev]);
  };

  const removeGroceryItem = (id: string) => {
    setGroceryList(prev => prev.filter(item => item.id !== id));
  };

  const clearCheckedGroceries = () => {
    setGroceryList(prev => prev.filter(item => !item.checked));
  };

  const populateGroceriesFromPlan = (items: GroceryItem[]) => {
    setGroceryList(items);
  };

  const addChatMessage = (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMsg: ChatMessage = {
      ...msg,
      id: "msg-" + Date.now(),
      timestamp: new Date().toISOString(),
    };
    setChatMessages(prev => [...prev, newMsg]);
  };

  // Mock historical 7-day data for rich analytics charts
  const weeklyHistory: DayNutritionLog[] = [
    { date: "Mon", meals: [], waterMl: 2600, targetWaterMl: 2500, fastingHoursCompleted: 16.2, weightKg: 64.9 },
    { date: "Tue", meals: [], waterMl: 2400, targetWaterMl: 2500, fastingHoursCompleted: 16.0, weightKg: 64.8 },
    { date: "Wed", meals: [], waterMl: 2750, targetWaterMl: 2500, fastingHoursCompleted: 15.5, weightKg: 64.7 },
    { date: "Thu", meals: [], waterMl: 2500, targetWaterMl: 2500, fastingHoursCompleted: 16.5, weightKg: 64.6 },
    { date: "Fri", meals: [], waterMl: 2300, targetWaterMl: 2500, fastingHoursCompleted: 16.0, weightKg: 64.6 },
    { date: "Sat", meals: [], waterMl: 2800, targetWaterMl: 2500, fastingHoursCompleted: 14.8, weightKg: 64.5 },
    { date: "Sun", meals: todayMeals, waterMl: waterMl, targetWaterMl: profile.waterTargetMl, fastingHoursCompleted: 16.0, weightKg: 64.5 }
  ];

  return (
    <NutritionContext.Provider
      value={{
        activeTab,
        setActiveTab,
        profile,
        updateProfile,
        todayMeals,
        addMealEntry,
        removeMealEntry,
        deleteFoodItem,
        waterMl,
        addWater,
        resetWater,
        fasting,
        startFasting,
        stopFasting,
        activeMealPlan,
        setActiveMealPlan,
        swapMealInPlan,
        groceryList,
        toggleGroceryItem,
        addGroceryItem,
        removeGroceryItem,
        clearCheckedGroceries,
        populateGroceriesFromPlan,
        chatMessages,
        addChatMessage,
        weeklyHistory,
        isProfileModalOpen,
        setIsProfileModalOpen,
        isQuickLogOpen,
        setIsQuickLogOpen,
        selectedPlannedMealForModal,
        setSelectedPlannedMealForModal,
      }}
    >
      {children}
    </NutritionContext.Provider>
  );
};

export const useNutrition = () => {
  const context = useContext(NutritionContext);
  if (!context) {
    throw new Error('useNutrition must be used within a NutritionProvider');
  }
  return context;
};
