import { UserProfile, ActivityLevel, DietType, PrimaryGoal } from "../types";

/**
 * Calculates Basal Metabolic Rate (BMR) using the clinically validated Mifflin-St Jeor Equation
 */
export function calculateBmr(profile: UserProfile): number {
  const { gender, weightKg, heightCm, age } = profile;
  if (gender === 'male') {
    // BMR = 10 * weight (kg) + 6.25 * height (cm) - 5 * age (y) + 5
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + 5);
  } else {
    // BMR = 10 * weight (kg) + 6.25 * height (cm) - 5 * age - 161
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age - 161);
  }
}

/**
 * Calculates Total Daily Energy Expenditure (TDEE) based on activity multipliers
 */
export function calculateTdee(profile: UserProfile): number {
  const bmr = calculateBmr(profile);
  const multipliers: Record<ActivityLevel, number> = {
    sedentary: 1.2,      // Little or no exercise
    light: 1.375,        // Light exercise 1-3 days/week
    moderate: 1.55,      // Moderate exercise 3-5 days/week
    very_active: 1.725,  // Heavy exercise 6-7 days/week
    athlete: 1.9,        // Professional athlete / 2x daily training
  };
  return Math.round(bmr * (multipliers[profile.activityLevel] || 1.4));
}

/**
 * Clinically calculates recommended target calories and macronutrient ratios
 */
export function calculateRecommendedMacros(
  tdee: number,
  goal: PrimaryGoal,
  dietType: DietType,
  weightKg: number
): {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams: number;
  waterMl: number;
} {
  let targetCalories = tdee;
  
  if (goal === 'fat_loss') {
    targetCalories = Math.round(tdee * 0.82); // 18% moderate deficit
  } else if (goal === 'lean_muscle') {
    targetCalories = Math.round(tdee * 1.12); // 12% clean surplus
  } else if (goal === 'blood_sugar_control' || goal === 'metabolic_health') {
    targetCalories = Math.round(tdee * 0.95);
  }

  // Protein targets based on clinical bodyweight guidelines (g/kg)
  let proteinPerKg = 1.6;
  if (goal === 'lean_muscle') proteinPerKg = 2.0;
  if (goal === 'fat_loss') proteinPerKg = 2.1; // Protect lean mass during deficit
  if (dietType === 'high_protein') proteinPerKg = 2.2;

  let proteinGrams = Math.round(weightKg * proteinPerKg);
  const proteinCalories = proteinGrams * 4;

  let fatPercentage = 0.28; // standard healthy fat ratio
  if (dietType === 'mediterranean') fatPercentage = 0.35;
  if (dietType === 'low_carb_keto') fatPercentage = 0.65;
  if (dietType === 'dash_cardiac') fatPercentage = 0.22;

  let fatCalories = targetCalories * fatPercentage;
  let fatGrams = Math.round(fatCalories / 9);

  let remainingCalories = targetCalories - proteinCalories - (fatGrams * 9);
  if (remainingCalories < 0) {
    // Adjust if ketogenic or high protein
    remainingCalories = targetCalories * 0.15;
    fatGrams = Math.round((targetCalories - proteinCalories - remainingCalories) / 9);
  }

  let carbsGrams = Math.max(20, Math.round(remainingCalories / 4));
  let fiberGrams = Math.round(Math.max(28, (targetCalories / 1000) * 14)); // 14g per 1000 kcal

  // Hydration calculation: 35ml per kg of bodyweight
  let waterMl = Math.round(weightKg * 35);
  if (waterMl < 2200) waterMl = 2200;

  return {
    calories: targetCalories,
    proteinGrams,
    carbsGrams,
    fatGrams,
    fiberGrams,
    waterMl,
  };
}

/**
 * Calculates BMI and categorical classification
 */
export function calculateBmi(weightKg: number, heightCm: number): {
  bmi: number;
  category: 'Underweight' | 'Optimal Health' | 'Overweight' | 'Obesity Class I' | 'Obesity Class II+';
  color: string;
} {
  const heightMeters = heightCm / 100;
  const bmi = Number((weightKg / (heightMeters * heightMeters)).toFixed(1));

  if (bmi < 18.5) return { bmi, category: 'Underweight', color: '#3B82F6' };
  if (bmi <= 24.9) return { bmi, category: 'Optimal Health', color: '#6BBF59' };
  if (bmi <= 29.9) return { bmi, category: 'Overweight', color: '#F59E0B' };
  if (bmi <= 34.9) return { bmi, category: 'Obesity Class I', color: '#EF4444' };
  return { bmi, category: 'Obesity Class II+', color: '#DC2626' };
}

/**
 * Calculates overall metabolic nutrition index score (1-100)
 */
export function calculateDailyHealthScore(params: {
  caloriesLogged: number;
  calorieTarget: number;
  proteinLogged: number;
  proteinTarget: number;
  fiberLogged: number;
  fiberTarget: number;
  waterLogged: number;
  waterTarget: number;
}): { score: number; rating: string; summary: string } {
  const {
    caloriesLogged,
    calorieTarget,
    proteinLogged,
    proteinTarget,
    fiberLogged,
    fiberTarget,
    waterLogged,
    waterTarget,
  } = params;

  if (caloriesLogged === 0) {
    return { score: 0, rating: 'Pending', summary: 'Log your first meal to calculate today’s metabolic index.' };
  }

  // Calorie accuracy (within +-15% is optimal)
  const calRatio = caloriesLogged / (calorieTarget || 2000);
  let calScore = 30;
  if (calRatio >= 0.85 && calRatio <= 1.15) {
    calScore = 30;
  } else if (calRatio >= 0.70 && calRatio <= 1.30) {
    calScore = 22;
  } else {
    calScore = 14;
  }

  // Protein sufficiency (up to 30 pts)
  const protRatio = Math.min(1.2, proteinLogged / (proteinTarget || 120));
  const protScore = Math.round(protRatio * 30);

  // Fiber sufficiency (up to 20 pts)
  const fibRatio = Math.min(1.2, fiberLogged / (fiberTarget || 30));
  const fibScore = Math.round(fibRatio * 20);

  // Hydration sufficiency (up to 20 pts)
  const waterRatio = Math.min(1.0, waterLogged / (waterTarget || 2500));
  const waterScore = Math.round(waterRatio * 20);

  const total = Math.min(100, Math.max(10, calScore + protScore + fibScore + waterScore));

  let rating = 'Needs Improvement';
  let summary = 'Increase protein density and water intake for optimal metabolic recovery.';

  if (total >= 90) {
    rating = 'Optimal Clinical State';
    summary = 'Outstanding macronutrient distribution, high antioxidant intake, and cellular hydration.';
  } else if (total >= 75) {
    rating = 'High Metabolic Health';
    summary = 'Strong dietary balance with steady insulin regulation and sustained energy.';
  } else if (total >= 60) {
    rating = 'Moderate Balance';
    summary = 'Good foundation. Focus on reaching your daily dietary fiber and hydration targets.';
  }

  return { score: total, rating, summary };
}
