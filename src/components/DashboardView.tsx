import React from 'react';
import { 
  Flame, 
  Dna, 
  Wheat, 
  Sparkles, 
  Droplet, 
  Timer, 
  Plus, 
  Trash2, 
  ChevronRight, 
  ShieldCheck, 
  ArrowUpRight,
  Camera,
  HeartPulse,
  Info
} from 'lucide-react';
import { useNutrition } from '../context/NutritionContext';
import { calculateDailyHealthScore, calculateBmi } from '../utils/nutritionCalculators';
import { MealType } from '../types';

export const DashboardView: React.FC = () => {
  const { 
    profile, 
    todayMeals, 
    waterMl, 
    addWater, 
    resetWater, 
    fasting, 
    startFasting, 
    stopFasting,
    setActiveTab, 
    setIsQuickLogOpen,
    removeMealEntry,
    deleteFoodItem
  } = useNutrition();

  // Aggregate today's macros
  const totalCalories = todayMeals.reduce((sum, m) => sum + m.totalCalories, 0);
  const totalProtein = todayMeals.reduce((sum, m) => sum + m.totalProtein, 0);
  const totalCarbs = todayMeals.reduce((sum, m) => sum + m.totalCarbs, 0);
  const totalFat = todayMeals.reduce((sum, m) => sum + m.totalFat, 0);
  const totalFiber = todayMeals.reduce((sum, m) => sum + m.totalFiber, 0);

  const remainingCalories = Math.max(0, profile.dailyCalorieTarget - totalCalories);
  const caloriePercent = Math.min(100, Math.round((totalCalories / profile.dailyCalorieTarget) * 100));

  const healthScoreResult = calculateDailyHealthScore({
    caloriesLogged: totalCalories,
    calorieTarget: profile.dailyCalorieTarget,
    proteinLogged: totalProtein,
    proteinTarget: profile.proteinTargetGrams,
    fiberLogged: totalFiber,
    fiberTarget: profile.fiberTargetGrams,
    waterLogged: waterMl,
    waterTarget: profile.waterTargetMl,
  });

  const bmiData = calculateBmi(profile.weightKg, profile.heightCm);

  // Fasting calculations
  let fastingHoursElapsed = 0;
  if (fasting.isFasting && fasting.startTime) {
    fastingHoursElapsed = Number(((Date.now() - fasting.startTime) / 3600000).toFixed(1));
  }
  const fastingPercent = Math.min(100, Math.round((fastingHoursElapsed / fasting.targetHours) * 100));

  // Meals categorized
  const mealCategories: { type: MealType; label: string; iconTime: string }[] = [
    { type: 'breakfast', label: 'Breakfast', iconTime: '7:00 AM - 10:00 AM' },
    { type: 'lunch', label: 'Lunch', iconTime: '12:00 PM - 2:30 PM' },
    { type: 'dinner', label: 'Dinner', iconTime: '6:30 PM - 9:00 PM' },
    { type: 'snack', label: 'Snacks & Fuel', iconTime: 'Throughout the day' },
  ];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Banner / Welcome & Quick Health Status */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[#F8FFF8] border border-[#6BBF59]/30 rounded-2xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#183153] text-white">
              Clinical Protocol Active
            </span>
            <span className="text-xs font-semibold text-[#6BBF59]">
              {(profile.dietType || '').replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#183153] font-['Poppins']">
            Welcome back, {profile.name}
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Targeting <strong className="text-[#183153]">{profile.dailyCalorieTarget} kcal</strong> with high metabolic efficiency. BMI: <strong className="text-[#183153]">{bmiData.bmi} ({bmiData.category})</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            id="scan-meal-cta-btn"
            onClick={() => setActiveTab('scanner')}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#183153] hover:bg-[#244673] active:scale-95 text-white font-semibold text-sm rounded-xl shadow-sm transition-all"
          >
            <Camera className="w-4 h-4 text-[#6BBF59]" />
            <span>AI Meal Scan</span>
          </button>
          
          <button
            onClick={() => setActiveTab('chat')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#183153]/20 hover:border-[#183153]/50 text-[#183153] font-semibold text-sm rounded-xl shadow-sm transition-all"
          >
            <Sparkles className="w-4 h-4 text-[#6BBF59]" />
            <span>Ask Dr. Maya</span>
          </button>
        </div>
      </div>

      {/* Main Nutrition & Calorie KPI Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Caloric Energy Balance & Circular Ring (5 Cols) */}
        <div className="lg:col-span-5 medical-card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-[#183153] font-['Poppins']">Daily Calorie Budget</h2>
              <p className="text-xs text-slate-500">Metabolic energy intake vs clinical target</p>
            </div>
            <div className="p-2 rounded-xl bg-[#6BBF59]/10 text-[#6BBF59]">
              <Flame className="w-5 h-5" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 my-2">
            {/* Circular Gauge */}
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-slate-100"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-[#6BBF59] transition-all duration-700 ease-out"
                  strokeWidth="10"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * caloriePercent) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-extrabold text-[#183153] tracking-tight">
                  {totalCalories}
                </span>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  / {profile.dailyCalorieTarget} kcal
                </span>
                <span className="text-[10px] font-semibold text-[#6BBF59] mt-0.5">
                  {caloriePercent}% Goal
                </span>
              </div>
            </div>

            {/* Calorie Stats Breakdown */}
            <div className="space-y-3 w-full sm:w-auto">
              <div className="p-3 rounded-xl bg-[#F8FFF8] border border-[#6BBF59]/20">
                <p className="text-xs text-slate-500 font-medium">Remaining Today</p>
                <p className="text-xl font-bold text-[#183153]">
                  {remainingCalories} <span className="text-xs font-normal text-slate-500">kcal</span>
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-xs text-slate-500 font-medium">BMR / TDEE Est.</p>
                <p className="text-sm font-bold text-[#183153]">
                  {Math.round(profile.dailyCalorieTarget * 0.78)} / {profile.dailyCalorieTarget} <span className="text-xs font-normal text-slate-500">kcal</span>
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Burn status: Optimized metabolic burn</span>
            <span className="font-semibold text-[#6BBF59]">In deficit window</span>
          </div>
        </div>

        {/* Macronutrient Split Cards (7 Cols) */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-2 gap-4">
          
          {/* Protein */}
          <div className="medical-card p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#183153]">Protein</span>
                <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                  <Dna className="w-4 h-4" />
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-[#183153]">{totalProtein}g</span>
                <span className="text-xs text-slate-400 font-semibold">/ {profile.proteinTargetGrams}g</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Muscle protein synthesis & repair</p>
            </div>
            
            <div className="mt-4">
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (totalProtein / profile.proteinTargetGrams) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[11px] font-medium text-slate-500 mt-1.5">
                <span>{Math.round((totalProtein / profile.proteinTargetGrams) * 100)}% consumed</span>
                <span className="font-bold text-blue-600">{Math.max(0, profile.proteinTargetGrams - totalProtein)}g left</span>
              </div>
            </div>
          </div>

          {/* Complex Carbs */}
          <div className="medical-card p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#183153]">Carbohydrates</span>
                <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                  <Wheat className="w-4 h-4" />
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-[#183153]">{totalCarbs}g</span>
                <span className="text-xs text-slate-400 font-semibold">/ {profile.carbsTargetGrams}g</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Glycogen & cellular energy</p>
            </div>

            <div className="mt-4">
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (totalCarbs / profile.carbsTargetGrams) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[11px] font-medium text-slate-500 mt-1.5">
                <span>{Math.round((totalCarbs / profile.carbsTargetGrams) * 100)}% consumed</span>
                <span className="font-bold text-amber-600">{Math.max(0, profile.carbsTargetGrams - totalCarbs)}g left</span>
              </div>
            </div>
          </div>

          {/* Healthy Fats */}
          <div className="medical-card p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#183153]">Healthy Lipids</span>
                <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                  <Sparkles className="w-4 h-4" />
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-[#183153]">{totalFat}g</span>
                <span className="text-xs text-slate-400 font-semibold">/ {profile.fatTargetGrams}g</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Hormonal homeostasis & brain function</p>
            </div>

            <div className="mt-4">
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (totalFat / profile.fatTargetGrams) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[11px] font-medium text-slate-500 mt-1.5">
                <span>{Math.round((totalFat / profile.fatTargetGrams) * 100)}% consumed</span>
                <span className="font-bold text-emerald-600">{Math.max(0, profile.fatTargetGrams - totalFat)}g left</span>
              </div>
            </div>
          </div>

          {/* Dietary Fiber */}
          <div className="medical-card p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#183153]">Dietary Fiber</span>
                <span className="p-1.5 rounded-lg bg-emerald-50 text-[#6BBF59]">
                  <ShieldCheck className="w-4 h-4" />
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-[#183153]">{totalFiber}g</span>
                <span className="text-xs text-slate-400 font-semibold">/ {profile.fiberTargetGrams}g</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Gut microbiome & insulin moderation</p>
            </div>

            <div className="mt-4">
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-[#6BBF59] h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (totalFiber / profile.fiberTargetGrams) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[11px] font-medium text-slate-500 mt-1.5">
                <span>{Math.round((totalFiber / profile.fiberTargetGrams) * 100)}% target</span>
                <span className="font-bold text-[#6BBF59]">{Math.max(0, profile.fiberTargetGrams - totalFiber)}g left</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Health Score & Hydration & Fasting Tracker Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Clinical Health Index */}
        <div className="medical-card p-6 flex flex-col justify-between border-l-4 border-l-[#6BBF59]">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Clinical Nutrition Index</span>
              <h3 className="text-xl font-bold text-[#183153] mt-0.5">{healthScoreResult.rating}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#6BBF59]/15 flex items-center justify-center font-bold text-xl text-[#2E7D32]">
              {healthScoreResult.score}
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-3 leading-relaxed">
            {healthScoreResult.summary}
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#183153]">
            <span>Biomarker Stability</span>
            <span className="text-[#6BBF59]">Optimal</span>
          </div>
        </div>

        {/* Cellular Hydration */}
        <div className="medical-card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Cellular Hydration</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-bold text-[#183153]">{(waterMl / 1000).toFixed(2)}L</span>
                <span className="text-xs text-slate-500">/ {(profile.waterTargetMl / 1000).toFixed(1)}L</span>
              </div>
            </div>
            <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600">
              <Droplet className="w-5 h-5 fill-blue-600/20" />
            </div>
          </div>

          {/* Quick Water Logging buttons */}
          <div className="mt-4 flex items-center gap-2">
            <button
              id="add-water-250-btn"
              onClick={() => addWater(250)}
              className="flex-1 py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-colors"
            >
              +250 ml
            </button>
            <button
              id="add-water-500-btn"
              onClick={() => addWater(500)}
              className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
            >
              +500 ml
            </button>
            <button
              onClick={resetWater}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 text-xs"
              title="Reset Water"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Intermittent Fasting Window */}
        <div className="medical-card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Autophagy & Fasting</span>
              <h3 className="text-lg font-bold text-[#183153] mt-0.5">
                {fasting.isFasting ? `${fastingHoursElapsed}h Elapsed` : 'Eating Window'}
              </h3>
            </div>
            <div className="p-2.5 rounded-2xl bg-[#183153]/5 text-[#183153]">
              <Timer className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-2">
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-[#183153] h-full rounded-full transition-all duration-500"
                style={{ width: `${fastingPercent}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1.5 font-medium">
              <span>Goal: {fasting.targetHours}:{(24 - fasting.targetHours)} protocol</span>
              <span className="font-bold text-[#183153]">{fastingPercent}% Done</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            {fasting.isFasting ? (
              <button
                onClick={stopFasting}
                className="w-full py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-[#183153] rounded-xl text-xs font-semibold transition-colors"
              >
                End Fast & Open Window
              </button>
            ) : (
              <button
                onClick={() => startFasting(16)}
                className="w-full py-1.5 px-3 bg-[#183153] hover:bg-[#244673] text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
              >
                Start 16-Hour Fast
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Today's Meals Timeline & Log */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#183153] font-['Poppins']">Today's Meal Timeline</h2>
            <p className="text-xs text-slate-500">Tracked nutrition records and bio-availability</p>
          </div>
          <button
            onClick={() => setIsQuickLogOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#F8FFF8] border border-[#6BBF59]/30 hover:bg-[#6BBF59]/15 text-[#2E7D32] font-semibold text-xs rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Meal</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mealCategories.map((cat) => {
            const mealsOfThisType = todayMeals.filter(m => m.mealType === cat.type);
            const totalCatCalories = mealsOfThisType.reduce((sum, m) => sum + m.totalCalories, 0);
            const totalCatProtein = mealsOfThisType.reduce((sum, m) => sum + m.totalProtein, 0);

            return (
              <div key={cat.type} className="medical-card p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#6BBF59]" />
                      <h3 className="font-bold text-[#183153]">{cat.label}</h3>
                      <span className="text-[11px] text-slate-400 font-medium">({cat.iconTime})</span>
                    </div>
                    <span className="text-xs font-bold text-[#183153] bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                      {totalCatCalories} kcal • {totalCatProtein}g P
                    </span>
                  </div>

                  {/* Meal Items List */}
                  <div className="mt-3 space-y-2">
                    {mealsOfThisType.length === 0 ? (
                      <div className="py-4 text-center">
                        <p className="text-xs text-slate-400 italic">No food logged for {(cat.label || '').toLowerCase()} yet</p>
                        <button
                          onClick={() => setIsQuickLogOpen(true)}
                          className="mt-2 text-xs font-semibold text-[#6BBF59] hover:underline"
                        >
                          + Log {cat.label}
                        </button>
                      </div>
                    ) : (
                      mealsOfThisType.map((meal) => (
                        <div key={meal.id} className="space-y-2">
                          {(meal.items || []).map((item) => (
                            <div 
                              key={item.id}
                              className="group flex items-start justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
                            >
                              <div className="flex-1 pr-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-[#183153]">{item.name}</span>
                                  {item.glycemicIndex && (
                                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                                      item.glycemicIndex === 'Low' ? 'bg-[#6BBF59]/15 text-[#2E7D32]' : 'bg-amber-100 text-amber-800'
                                    }`}>
                                      GI: {item.glycemicIndex}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-500 mt-0.5">
                                  {item.portion} • P: <strong className="text-slate-700">{item.protein}g</strong> • C: <strong className="text-slate-700">{item.carbs}g</strong> • F: <strong className="text-slate-700">{item.fat}g</strong>
                                </p>
                                {item.clinicalInsights && (
                                  <p className="text-[10px] text-emerald-700 italic mt-0.5">
                                    💡 {item.clinicalInsights}
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-xs font-extrabold text-[#183153]">{item.calories} kcal</span>
                                <button
                                  onClick={() => deleteFoodItem(meal.id, item.id)}
                                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity p-1"
                                  title="Delete item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-50 flex items-center justify-between">
                  <button
                    onClick={() => setActiveTab('scanner')}
                    className="text-[11px] font-semibold text-[#183153] hover:text-[#6BBF59] flex items-center gap-1 transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#6BBF59]" />
                    <span>Scan with AI</span>
                  </button>
                  <button
                    onClick={() => setIsQuickLogOpen(true)}
                    className="text-[11px] font-semibold text-slate-500 hover:text-[#183153]"
                  >
                    + Quick Add
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
