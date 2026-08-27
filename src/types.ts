export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type DietType = 
  | 'mediterranean'
  | 'high_protein'
  | 'low_carb_keto'
  | 'dash_cardiac'
  | 'diabetic_glycemic'
  | 'plant_based'
  | 'balanced_clinical';

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very_active' | 'athlete';

export type PrimaryGoal = 'fat_loss' | 'lean_muscle' | 'metabolic_health' | 'blood_sugar_control' | 'longevity_wellness' | 'maintenance';

export interface FoodItem {
  id: string;
  name: string;
  portion: string; // e.g. "1 bowl (200g)"
  portionGrams: number;
  calories: number;
  protein: number; // in grams
  carbs: number;   // in grams
  fat: number;     // in grams
  fiber: number;   // in grams
  sugar?: number;  // in grams
  sodium?: number; // in mg
  glycemicIndex?: 'Low' | 'Medium' | 'High';
  glycemicLoad?: number;
  micronutrients?: {
    vitaminC?: number; // % RDA
    vitaminD?: number; // % RDA
    vitaminB12?: number; // % RDA
    iron?: number; // % RDA
    calcium?: number; // % RDA
    magnesium?: number; // % RDA
    potassium?: number; // % RDA
    zinc?: number; // % RDA
  };
  healthScore?: number; // 1-100
  allergens?: string[];
  clinicalInsights?: string;
  imageUrl?: string;
}

export interface MealEntry {
  id: string;
  mealType: MealType;
  timestamp: string; // ISO string
  items: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  notes?: string;
  photoUrl?: string;
}

export interface DayNutritionLog {
  date: string; // YYYY-MM-DD
  meals: MealEntry[];
  waterMl: number;
  targetWaterMl: number;
  fastingHoursCompleted?: number;
  weightKg?: number;
}

export interface UserProfile {
  name: string;
  age: number;
  gender: 'female' | 'male' | 'other';
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
  activityLevel: ActivityLevel;
  primaryGoal: PrimaryGoal;
  dietType: DietType;
  dailyCalorieTarget: number;
  proteinTargetGrams: number;
  carbsTargetGrams: number;
  fatTargetGrams: number;
  fiberTargetGrams: number;
  waterTargetMl: number;
  medicalConditions: string[]; // e.g. ["Pre-diabetes", "Hypertension", "Lactose Intolerance"]
  allergies: string[]; // e.g. ["Peanuts", "Shellfish"]
  intermittentFastingHours: number; // e.g. 16
}

export interface RecipeStep {
  stepNumber: number;
  instruction: string;
}

export interface PlannedMeal {
  id: string;
  mealType: MealType;
  name: string;
  description: string;
  prepTimeMinutes: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  glycemicIndex: 'Low' | 'Medium' | 'High';
  ingredients: string[];
  instructions: string[];
  clinicalBenefit: string;
}

export interface DayPlan {
  dayIndex: number;
  dayName: string; // e.g. "Monday"
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  meals: PlannedMeal[];
}

export interface WeeklyMealPlan {
  id: string;
  title: string;
  dietType: DietType;
  description: string;
  createdDate: string;
  days: DayPlan[];
}

export interface GroceryItem {
  id: string;
  name: string;
  category: 'Produce & Greens' | 'Lean Proteins' | 'Whole Grains & Complex Carbs' | 'Healthy Fats & Oils' | 'Dairy & Alternatives' | 'Spices, Seeds & Superfoods' | 'Pantry Essentials';
  quantity: string;
  estimatedPrice?: string;
  checked: boolean;
  notes?: string;
  nutritionalHighlight?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  clinicalSources?: string[];
  suggestedFollowUps?: string[];
}

export interface FastingState {
  isFasting: boolean;
  startTime: number | null; // epoch timestamp
  targetHours: number;
}
