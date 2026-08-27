import React, { useState } from 'react';
import { X, Plus, Search, CheckCircle2, Flame, Dna, Wheat, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useNutrition } from '../context/NutritionContext';
import { MealType, FoodItem } from '../types';

interface ClinicalFoodDbItem {
  name: string;
  defaultPortion: string;
  portionGrams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  glycemicIndex: 'Low' | 'Medium' | 'High';
  clinicalHighlight: string;
}

const CLINICAL_FOOD_DATABASE: ClinicalFoodDbItem[] = [
  { name: "Wild Alaskan Salmon Fillet", defaultPortion: "150g fillet", portionGrams: 150, calories: 280, protein: 34, carbs: 0, fat: 15, fiber: 0, glycemicIndex: "Low", clinicalHighlight: "High marine Omega-3s EPA/DHA" },
  { name: "Free-Range Pasture Boiled Egg", defaultPortion: "2 large eggs (100g)", portionGrams: 100, calories: 148, protein: 13, carbs: 1.1, fat: 10, fiber: 0, glycemicIndex: "Low", clinicalHighlight: "Choline & lutein for brain vitality" },
  { name: "Greek Strained Yogurt 2%", defaultPortion: "1 cup (240g)", portionGrams: 240, calories: 170, protein: 22, carbs: 9, fat: 4.5, fiber: 0, glycemicIndex: "Low", clinicalHighlight: "Slow-digesting casein & active probiotics" },
  { name: "Organic Tricolor Quinoa", defaultPortion: "1 cup cooked (185g)", portionGrams: 185, calories: 222, protein: 8.1, carbs: 39, fat: 3.6, fiber: 5.2, glycemicIndex: "Low", clinicalHighlight: "Complete plant amino acids" },
  { name: "Fresh Hass Avocado", defaultPortion: "1/2 medium (100g)", portionGrams: 100, calories: 160, protein: 2, carbs: 8.5, fat: 14.7, fiber: 6.7, glycemicIndex: "Low", clinicalHighlight: "Oleic acid & 485mg potassium" },
  { name: "Steamed Organic Broccoli", defaultPortion: "1.5 cups (150g)", portionGrams: 150, calories: 52, protein: 4.2, carbs: 10, fat: 0.6, fiber: 3.9, glycemicIndex: "Low", clinicalHighlight: "Sulforaphane antioxidant activator" },
  { name: "Organic Wild Blueberries", defaultPortion: "1 cup (150g)", portionGrams: 150, calories: 84, protein: 1.1, carbs: 21, fat: 0.5, fiber: 3.6, glycemicIndex: "Low", clinicalHighlight: "High anthocyanins for brain plasticity" },
  { name: "Raw Unsalted Almonds", defaultPortion: "1 ounce (28g)", portionGrams: 28, calories: 164, protein: 6, carbs: 6, fat: 14, fiber: 3.5, glycemicIndex: "Low", clinicalHighlight: "Vitamin E & magnesium" },
  { name: "Lean Chicken Breast (Grilled)", defaultPortion: "150g cooked", portionGrams: 150, calories: 248, protein: 46, carbs: 0, fat: 5.4, fiber: 0, glycemicIndex: "Low", clinicalHighlight: "Ultra-lean high leucine protein" },
  { name: "Extra Virgin Olive Oil", defaultPortion: "1 tablespoon (15ml)", portionGrams: 14, calories: 120, protein: 0, carbs: 0, fat: 14, fiber: 0, glycemicIndex: "Low", clinicalHighlight: "Polyphenols & monounsaturated lipids" },
  { name: "Steel-Cut Organic Oats", defaultPortion: "1 cup cooked (234g)", portionGrams: 234, calories: 166, protein: 6, carbs: 28, fat: 3.6, fiber: 4.1, glycemicIndex: "Low", clinicalHighlight: "Beta-glucan soluble cholesterol buffer" },
  { name: "Baked Garnet Sweet Potato", defaultPortion: "1 medium (150g)", portionGrams: 150, calories: 135, protein: 3, carbs: 31, fat: 0.2, fiber: 4.5, glycemicIndex: "Low", clinicalHighlight: "Complex carbohydrate beta-carotene" },
];

export const QuickLogModal: React.FC = () => {
  const { isQuickLogOpen, setIsQuickLogOpen, addMealEntry } = useNutrition();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMealType, setSelectedMealType] = useState<MealType>('lunch');
  const [customName, setCustomName] = useState('');
  const [customCalories, setCustomCalories] = useState('');
  const [customProtein, setCustomProtein] = useState('');
  const [customCarbs, setCustomCarbs] = useState('');
  const [customFat, setCustomFat] = useState('');
  const [customFiber, setCustomFiber] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);

  if (!isQuickLogOpen) return null;

  const q = (searchQuery || '').toLowerCase().trim();
  const filteredFoods = (CLINICAL_FOOD_DATABASE || []).filter(f => 
    !q ||
    (f.name || '').toLowerCase().includes(q) ||
    (f.clinicalHighlight || '').toLowerCase().includes(q)
  );

  const handleLogPreset = (food: ClinicalFoodDbItem) => {
    const item: FoodItem = {
      id: "food-" + Date.now(),
      name: food.name,
      portion: food.defaultPortion,
      portionGrams: food.portionGrams,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      fiber: food.fiber,
      glycemicIndex: food.glycemicIndex,
      healthScore: 95,
      clinicalInsights: food.clinicalHighlight,
    };

    addMealEntry({
      mealType: selectedMealType,
      items: [item],
      totalCalories: item.calories,
      totalProtein: item.protein,
      totalCarbs: item.carbs,
      totalFat: item.fat,
      totalFiber: item.fiber,
      notes: "Quick Logged",
    });

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#6BBF59', '#183153']
    });

    setIsQuickLogOpen(false);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const cal = parseInt(customCalories, 10) || 250;
    const prot = parseFloat(customProtein) || 15;
    const carb = parseFloat(customCarbs) || 20;
    const fat = parseFloat(customFat) || 8;
    const fib = parseFloat(customFiber) || 4;

    const item: FoodItem = {
      id: "custom-" + Date.now(),
      name: customName.trim(),
      portion: "1 standard serving",
      portionGrams: 200,
      calories: cal,
      protein: prot,
      carbs: carb,
      fat: fat,
      fiber: fib,
      glycemicIndex: "Low",
      healthScore: 90,
      clinicalInsights: "Custom user-logged nutritional record.",
    };

    addMealEntry({
      mealType: selectedMealType,
      items: [item],
      totalCalories: cal,
      totalProtein: prot,
      totalCarbs: carb,
      totalFat: fat,
      totalFiber: fib,
      notes: "Custom entry",
    });

    setIsQuickLogOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[85vh] overflow-hidden shadow-2xl border border-slate-100 flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#6BBF59]/15 text-[#2E7D32] flex items-center justify-center font-bold">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#183153] font-['Poppins']">Quick Food Logger</h2>
              <p className="text-xs text-slate-500">Instant macro entry or search clinical foods</p>
            </div>
          </div>
          <button
            onClick={() => setIsQuickLogOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Meal Type Bar */}
        <div className="px-5 pt-3 flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Log to:</span>
          <div className="flex gap-1 bg-[#F8FFF8] p-1 rounded-xl border border-[#6BBF59]/30">
            {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedMealType(t)}
                className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                  selectedMealType === t
                    ? 'bg-[#183153] text-white shadow-sm'
                    : 'text-[#183153] hover:bg-[#6BBF59]/15'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Search / Toggle Tabs */}
        <div className="p-5 space-y-3">
          <div className="flex gap-2">
            <button
              onClick={() => setIsCustomMode(false)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                !isCustomMode ? 'bg-[#183153] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Search Clinical Whole Foods
            </button>
            <button
              onClick={() => setIsCustomMode(true)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                isCustomMode ? 'bg-[#183153] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Enter Custom Macros
            </button>
          </div>

          {!isCustomMode && (
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search salmon, avocado, quinoa, berries..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#6BBF59] outline-none text-xs text-[#183153]"
              />
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-2">
          {!isCustomMode ? (
            <div className="space-y-2">
              {filteredFoods.map((food, idx) => (
                <div
                  key={idx}
                  onClick={() => handleLogPreset(food)}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-[#6BBF59]/40 hover:bg-[#F8FFF8] cursor-pointer group transition-all"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#183153]">{food.name}</span>
                      <span className="text-[10px] text-slate-400">({food.defaultPortion})</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      P: <strong className="text-slate-700">{food.protein}g</strong> • C: <strong className="text-slate-700">{food.carbs}g</strong> • F: <strong className="text-slate-700">{food.fat}g</strong> • Fib: {food.fiber}g
                    </p>
                    <p className="text-[10px] text-emerald-700 mt-0.5">
                      ✨ {food.clinicalHighlight}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-extrabold text-[#183153] block">{food.calories} kcal</span>
                    <span className="text-[10px] font-bold text-[#6BBF59] group-hover:underline">+ Add Food</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={handleCustomSubmit} className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Meal / Food Title</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Protein Smoothie Bowl"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-[#183153]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Calories (kcal)</label>
                  <input
                    type="number"
                    value={customCalories}
                    onChange={(e) => setCustomCalories(e.target.value)}
                    placeholder="350"
                    className="w-full p-2 rounded-lg border border-slate-200 text-xs text-[#183153] font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Protein (g)</label>
                  <input
                    type="number"
                    value={customProtein}
                    onChange={(e) => setCustomProtein(e.target.value)}
                    placeholder="25"
                    className="w-full p-2 rounded-lg border border-slate-200 text-xs text-[#183153]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    value={customCarbs}
                    onChange={(e) => setCustomCarbs(e.target.value)}
                    placeholder="30"
                    className="w-full p-2 rounded-lg border border-slate-200 text-xs text-[#183153]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Fat (g)</label>
                  <input
                    type="number"
                    value={customFat}
                    onChange={(e) => setCustomFat(e.target.value)}
                    placeholder="10"
                    className="w-full p-2 rounded-lg border border-slate-200 text-xs text-[#183153]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#6BBF59] hover:bg-[#5EAB4D] text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                >
                  Log Custom Food Entry
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
