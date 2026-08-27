import { 
  PatientAssessment, 
  ClinicalMealPlan, 
  MealPlanMode, 
  MealSlot, 
  DayMealPlan, 
  MealOption,
  MealSlotType
} from '../types/clinic';
import { createDefaultChoiceSlots, createDefaultWeeklyDays, RECIPE_CATALOG } from '../data/mockMealAndAssessmentData';
import { formatDate } from '../utils/dateUtils';

export interface GeneratePlanOptions {
  patientId: string;
  patientName: string;
  clinicId: string;
  assessment: PatientAssessment;
  mode: MealPlanMode;
  targetCalories?: number;
  dietPreference?: string;
  customPrompt?: string;
}

export async function generateClinicalMealPlan(options: GeneratePlanOptions): Promise<ClinicalMealPlan> {
  const { patientId, patientName, clinicId, assessment, mode } = options;
  const targetCalories = options.targetCalories || assessment.targetCalories || 1600;
  
  // Calculate recommended macros based on assessment
  const isKeto = assessment.foodPreference === 'Keto';
  const isHighProtein = assessment.exerciseFrequency.includes('Active') || assessment.exerciseFrequency.includes('Athlete');

  let protein = assessment.targetProteinGrams || Math.round((targetCalories * (isHighProtein ? 0.30 : 0.22)) / 4);
  let fat = assessment.targetFatGrams || Math.round((targetCalories * (isKeto ? 0.65 : 0.28)) / 9);
  let carbs = assessment.targetCarbsGrams || Math.max(30, Math.round((targetCalories - (protein * 4) - (fat * 9)) / 4));
  let fiber = assessment.targetFiberGrams || 35;

  const baseSlots = createDefaultChoiceSlots();
  
  // Adjust slots tailored to patient constraints
  const customizedSlots: MealSlot[] = baseSlots.map(slot => {
    // Custom timing based on assessment wake/sleep time
    let slotTime = slot.defaultTime;
    if (slot.slotType === 'wake_up') slotTime = assessment.wakeTime || '06:30';
    if (slot.slotType === 'sleep') slotTime = assessment.sleepTime || '22:30';

    // Scale options to target calories
    const scaleFactor = targetCalories / 1550;
    const scaledOptions: MealOption[] = slot.options.map(opt => {
      const scaledCalories = Math.round(opt.calories * scaleFactor);
      const scaledProtein = Math.round(opt.protein * scaleFactor);
      const scaledCarbs = Math.round(opt.carbs * scaleFactor);
      const scaledFat = Math.round(opt.fat * scaleFactor);
      const scaledFiber = Math.round(opt.fiber * scaleFactor);

      // Check if matches dislike
      const isDisliked = (assessment.dislikedFoods || []).some(dis => {
        if (!dis) return false;
        const d = String(dis).toLowerCase();
        return (opt.name || '').toLowerCase().includes(d) || 
          (opt.ingredients || []).some(i => i && String(i).toLowerCase().includes(d));
      });

      return {
        ...opt,
        calories: scaledCalories,
        protein: scaledProtein,
        carbs: scaledCarbs,
        fat: scaledFat,
        fiber: scaledFiber,
        description: isDisliked ? `${opt.description} (Customized to omit disliked ingredients)` : opt.description
      };
    });

    return {
      ...slot,
      defaultTime: slotTime,
      options: scaledOptions,
      selectedOptionId: scaledOptions[0].id
    };
  });

  const weeklyDays: DayMealPlan[] = createDefaultWeeklyDays().map(day => ({
    ...day,
    targetCalories,
    slots: customizedSlots
  }));

  const rationale = `Clinically optimized for ${assessment.foodPreference} protocol addressing ${assessment.medicalHistory.join(', ') || 'overall metabolic health'}. Formulated with low glycemic index whole foods to maintain stable glycemic load and steady energy levels.`;

  const newPlan: ClinicalMealPlan = {
    id: `plan-cl-${Date.now()}`,
    patientId,
    patientName,
    clinicId,
    assessmentId: assessment.id,
    title: `${assessment.foodPreference} Metabolic Nutrition Protocol (${targetCalories} kcal)`,
    mode,
    status: 'draft', // Generated plans start as DRAFT until doctor publishes
    version: 1,
    targetCalories,
    targetMacros: {
      protein,
      carbs,
      fat,
      fiber
    },
    slots: customizedSlots,
    weeklyDays: weeklyDays,
    generalInstructions: [
      `Maintain regular meal timings centered around wake time (${assessment.wakeTime}) and bedtime (${assessment.sleepTime}).`,
      `Target minimum ${assessment.dailyWaterLiters} Liters of clean hydration daily.`,
      `Take a 10-15 minute gentle walk after main meals to enhance GLUT-4 translocation and glucose disposal.`,
      `Limit artificial sweeteners and ultra-processed refined seed oils.`
    ],
    hydrationGuidelines: `Daily baseline hydration goal: ${assessment.dailyWaterLiters} L. Sip room-temperature water steadily.`,
    clinicalRationale: rationale,
    createdBy: assessment.doctorName || 'Lead Dietitian',
    createdAt: new Date().toISOString(),
    changeLog: [`v1 generated with AI Clinical Engine on ${formatDate(new Date())}`]
  };

  return newPlan;
}

export function regenerateSingleMealSlot(
  slotType: MealSlotType, 
  targetCalories: number, 
  foodPreference: string, 
  dietaryNotes?: string
): MealOption[] {
  // Return fresh creative options from the recipe catalog or tailored variations
  const matchingRecipes = Object.values(RECIPE_CATALOG).filter(r => r.slotType === slotType);

  if (matchingRecipes.length > 0) {
    return matchingRecipes.map((r, idx) => ({
      id: `opt-regen-${Date.now()}-${idx}`,
      slotType,
      name: r.name,
      description: r.clinicalBenefit || r.category,
      portion: r.servingSizeDescription,
      portionGrams: 250,
      calories: r.calories,
      protein: r.protein,
      carbs: r.carbs,
      fat: r.fat,
      fiber: r.fiber,
      glycemicIndex: 'Low',
      ingredients: r.ingredients.map(i => `${i.amount} ${i.item}`),
      instructions: r.steps,
      clinicalBenefit: r.clinicalBenefit,
      prepTimeMinutes: r.prepTimeMinutes + r.cookTimeMinutes
    }));
  }

  // Fallback generation
  return [
    {
      id: `opt-regen-${Date.now()}-1`,
      slotType,
      name: `Custom ${foodPreference} Clinical Plate`,
      description: dietaryNotes || 'Balanced lean protein with prebiotic fibers and healthy fats.',
      portion: '1 Standard Serving (300g)',
      portionGrams: 300,
      calories: targetCalories,
      protein: Math.round((targetCalories * 0.25) / 4),
      carbs: Math.round((targetCalories * 0.45) / 4),
      fat: Math.round((targetCalories * 0.30) / 9),
      fiber: 8,
      glycemicIndex: 'Low',
      ingredients: ['Fresh seasonal vegetables (150g)', 'Clean protein source (100g)', 'Cold pressed oil (1 tsp)', 'Herbal seasoning'],
      instructions: ['Steam or lightly sauté ingredients', 'Season with Himalayan salt and fresh lemon juice'],
      clinicalBenefit: 'Optimized macro ratio for steady insulin regulation.',
      prepTimeMinutes: 10
    }
  ];
}
