import React, { useState } from 'react';
import { 
  CalendarDays, 
  Sparkles, 
  RefreshCw, 
  Clock, 
  ChefHat, 
  ArrowRightLeft, 
  ShoppingBag, 
  Check, 
  Flame, 
  Dna, 
  Wheat, 
  ShieldCheck,
  ChevronRight,
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { useNutrition } from '../context/NutritionContext';
import { generateMealPlanApi, swapMealApi, generateGroceryListApi } from '../services/api';
import { DietType, PlannedMeal, PrimaryGoal } from '../types';

export const MealPlannerView: React.FC = () => {
  const { 
    profile, 
    activeMealPlan, 
    setActiveMealPlan, 
    swapMealInPlan, 
    populateGroceriesFromPlan, 
    setActiveTab,
    setSelectedPlannedMealForModal
  } = useNutrition();

  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(1);
  const [selectedDiet, setSelectedDiet] = useState<DietType>(profile.dietType);
  const [targetCalories, setTargetCalories] = useState<number>(profile.dailyCalorieTarget);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSwappingId, setIsSwappingId] = useState<string | null>(null);
  const [grocerySuccess, setGrocerySuccess] = useState(false);

  const dietProtocols: { id: DietType; label: string; desc: string }[] = [
    { id: 'mediterranean', label: 'Mediterranean Longevity', desc: 'High polyphenol EVOO, wild seafood, legumes, and greens' },
    { id: 'high_protein', label: 'High-Protein Hypertrophy', desc: '1.8-2.2g/kg lean protein for muscle preservation' },
    { id: 'low_carb_keto', label: 'Low-Carb & Metabolic', desc: 'Stable insulin curves with healthy fats and fiber' },
    { id: 'dash_cardiac', label: 'DASH Cardiovascular', desc: 'Potassium-rich foods with strict sodium moderation' },
    { id: 'diabetic_glycemic', label: 'Diabetic Glycemic Balance', desc: 'Low GI complex carbs with soluble fiber buffering' },
    { id: 'plant_based', label: 'Plant-Based Anti-Inflammatory', desc: 'Whole-food plant diversity and antioxidant density' },
  ];

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    try {
      const plan = await generateMealPlanApi({
        dietType: selectedDiet,
        targetCalories: targetCalories,
        goal: profile.primaryGoal,
        allergies: profile.allergies,
        medicalConditions: profile.medicalConditions,
        preferences: `Optimize for clinical metabolic health and micronutrient completeness.`,
      });

      setActiveMealPlan(plan);
      setSelectedDayIndex(1);
    } catch (err) {
      console.error("Plan generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSwapMeal = async (meal: PlannedMeal) => {
    setIsSwappingId(meal.id);
    try {
      const newMeal = await swapMealApi({
        mealToSwap: meal,
        dietType: activeMealPlan.dietType,
        calories: meal.calories,
        preferences: "Provide a distinct, nutritious alternative matching exact calories and high protein",
      });

      swapMealInPlan(selectedDayIndex, meal.id, newMeal);
    } catch (err) {
      console.error("Swap meal error:", err);
    } finally {
      setIsSwappingId(null);
    }
  };

  const handleExportToGrocery = async () => {
    try {
      const items = await generateGroceryListApi({
        mealPlan: activeMealPlan,
        daysCount: activeMealPlan.days.length || 7,
      });
      populateGroceriesFromPlan(items);
      setGrocerySuccess(true);
      setTimeout(() => {
        setGrocerySuccess(false);
        setActiveTab('grocery');
      }, 700);
    } catch (err) {
      console.error("Grocery export error:", err);
    }
  };

  const currentDayPlan = activeMealPlan.days.find(d => d.dayIndex === selectedDayIndex) || activeMealPlan.days[0];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#183153] text-white">
              Clinical Dietetics Engine
            </span>
            <span className="text-xs font-semibold text-[#6BBF59]">Personalized Bio-Nutrition</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#183153] font-['Poppins'] mt-1">
            Personalized Clinical Meal Planner
          </h1>
          <p className="text-sm text-slate-600">
            Scientifically optimized weekly nutrition protocols matching your biochemical targets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="export-to-grocery-btn"
            onClick={handleExportToGrocery}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#F8FFF8] border border-[#6BBF59]/40 hover:bg-[#6BBF59]/15 text-[#2E7D32] font-semibold text-sm rounded-xl transition-all shadow-sm"
          >
            {grocerySuccess ? <Check className="w-4 h-4 text-emerald-600" /> : <ShoppingBag className="w-4 h-4 text-[#6BBF59]" />}
            <span>{grocerySuccess ? 'Added to Pantry!' : 'Generate Smart Grocery List'}</span>
          </button>
        </div>
      </div>

      {/* Protocol Configuration Box */}
      <div className="medical-card p-6 bg-gradient-to-r from-white via-white to-[#F8FFF8]">
        <div className="flex items-center gap-2 mb-3">
          <SlidersHorizontal className="w-4 h-4 text-[#183153]" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#183153]">
            Customize Clinical Protocol & Daily Caloric Target
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="md:col-span-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Dietary Protocol
            </label>
            <select
              value={selectedDiet}
              onChange={(e) => setSelectedDiet(e.target.value as DietType)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-[#183153] focus:border-[#6BBF59] outline-none"
            >
              {dietProtocols.map(p => (
                <option key={p.id} value={p.id}>{p.label} - {p.desc}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Target Calories / Day
            </label>
            <input
              type="number"
              value={targetCalories}
              onChange={(e) => setTargetCalories(parseInt(e.target.value, 10) || 2000)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-[#183153] focus:border-[#6BBF59] outline-none"
              step={50}
              min={1200}
              max={4500}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Info className="w-4 h-4 text-[#6BBF59]" />
            <span>Excludes user allergies: <strong>{profile.allergies.join(", ") || "None"}</strong></span>
          </div>

          <button
            id="regenerate-plan-btn"
            onClick={handleGeneratePlan}
            disabled={isGenerating}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#183153] hover:bg-[#244673] active:scale-95 text-white font-bold text-xs rounded-xl shadow-sm transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#6BBF59]" />
                <span>Formulating 7-Day Plan...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#6BBF59]" />
                <span>Generate Plan with Gemini AI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 7-Day Tab Bar */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {(activeMealPlan.days || []).map((day) => {
            const isSelected = day.dayIndex === selectedDayIndex;
            return (
              <button
                key={day.dayIndex}
                onClick={() => setSelectedDayIndex(day.dayIndex)}
                className={`flex-1 min-w-[120px] p-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-[#183153] text-white border-[#183153] shadow-md'
                    : 'bg-white text-[#183153] border-slate-200 hover:border-[#6BBF59]/50 hover:bg-[#F8FFF8]'
                }`}
              >
                <p className="text-xs font-bold uppercase tracking-wider opacity-80">{day.dayName}</p>
                <p className="text-base font-extrabold mt-0.5">{day.totalCalories} <span className="text-[10px] font-normal">kcal</span></p>
                <p className="text-[11px] opacity-90 mt-0.5">{day.totalProtein}g Protein</p>
              </button>
            );
          })}
        </div>

        {/* Current Selected Day Summary Bar */}
        {currentDayPlan && (
          <div className="p-4 rounded-xl bg-[#F8FFF8] border border-[#6BBF59]/25 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-[#183153]">{currentDayPlan.dayName} Nutrition Breakdown:</span>
              <span className="text-slate-500">Target calibrated for {(activeMealPlan.dietType || '').replace('_', ' ')} protocol</span>
            </div>
            <div className="flex items-center gap-4 font-semibold text-[#183153]">
              <span>🔥 <strong>{currentDayPlan.totalCalories}</strong> kcal</span>
              <span>🥩 <strong>{currentDayPlan.totalProtein}g</strong> Protein</span>
              <span>🌾 <strong>{currentDayPlan.totalCarbs}g</strong> Carbs</span>
              <span>🥑 <strong>{currentDayPlan.totalFat}g</strong> Fats</span>
              <span>🥗 <strong>{currentDayPlan.totalFiber}g</strong> Fiber</span>
            </div>
          </div>
        )}
      </div>

      {/* Planned Meals Cards for Selected Day */}
      {currentDayPlan && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {(currentDayPlan.meals || []).map((meal) => (
            <div 
              key={meal.id} 
              className="medical-card p-6 flex flex-col justify-between space-y-4 hover:border-[#6BBF59]/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-[#183153] text-white">
                      {meal.mealType}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {meal.prepTimeMinutes} mins prep
                    </span>
                  </div>
                  <span className="text-sm font-extrabold text-[#183153]">
                    {meal.calories} kcal
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#183153] font-['Poppins'] mt-3">
                  {meal.name}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {meal.description}
                </p>

                {/* Macro Pills */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
                    {meal.protein || 0}g Protein
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700">
                    {meal.carbs || 0}g Carbs
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
                    {meal.fat || 0}g Fat
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#F8FFF8] border border-[#6BBF59]/30 text-[#2E7D32]">
                    {meal.fiber || 0}g Fiber
                  </span>
                </div>

                {/* Clinical Benefit Highlight */}
                {meal.clinicalBenefit && (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-700 mt-3">
                    <strong className="text-[#183153]">Clinical Benefit: </strong>
                    {meal.clinicalBenefit}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedPlannedMealForModal(meal)}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#183153] hover:text-[#6BBF59] transition-colors"
                >
                  <ChefHat className="w-4 h-4 text-[#6BBF59]" />
                  <span>View Recipe & Steps</span>
                </button>

                <button
                  onClick={() => handleSwapMeal(meal)}
                  disabled={isSwappingId === meal.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#F8FFF8] hover:border-[#6BBF59]/30 border border-transparent text-xs font-bold text-[#183153] transition-all disabled:opacity-50"
                  title="Intelligently swap this dish with another matching macro item"
                >
                  <ArrowRightLeft className={`w-3.5 h-3.5 ${isSwappingId === meal.id ? 'animate-spin text-[#6BBF59]' : 'text-slate-500'}`} />
                  <span>{isSwappingId === meal.id ? 'Swapping...' : 'AI Swap Dish'}</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
