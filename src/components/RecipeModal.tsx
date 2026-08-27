import React from 'react';
import { X, ChefHat, Clock, Flame, Dna, Wheat, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { useNutrition } from '../context/NutritionContext';

export const RecipeModal: React.FC = () => {
  const { selectedPlannedMealForModal, setSelectedPlannedMealForModal } = useNutrition();

  if (!selectedPlannedMealForModal) return null;

  const meal = selectedPlannedMealForModal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 sm:p-7 space-y-6">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#183153] text-white">
                {meal.mealType}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {meal.prepTimeMinutes} mins
              </span>
            </div>
            <h2 className="text-xl font-bold text-[#183153] font-['Poppins'] mt-1">
              {meal.name}
            </h2>
          </div>
          <button
            onClick={() => setSelectedPlannedMealForModal(null)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Macros Strip */}
        <div className="grid grid-cols-4 gap-2 text-center p-3 rounded-xl bg-[#F8FFF8] border border-[#6BBF59]/30">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Calories</p>
            <p className="text-base font-extrabold text-[#183153]">{meal.calories}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-blue-600">Protein</p>
            <p className="text-base font-extrabold text-[#183153]">{meal.protein}g</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-amber-600">Carbs</p>
            <p className="text-base font-extrabold text-[#183153]">{meal.carbs}g</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-emerald-600">Lipids</p>
            <p className="text-base font-extrabold text-[#183153]">{meal.fat}g</p>
          </div>
        </div>

        {/* Clinical Benefit */}
        {meal.clinicalBenefit && (
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
            <strong className="text-[#183153] block mb-1">Clinical Benefit & Bio-Availability:</strong>
            {meal.clinicalBenefit}
          </div>
        )}

        {/* Ingredients */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#183153] flex items-center gap-1.5">
            <ChefHat className="w-4 h-4 text-[#6BBF59]" />
            <span>Ingredients & Portions</span>
          </h3>
          <ul className="space-y-1.5 pl-2">
            {(meal.ingredients || []).map((ing, i) => (
              <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6BBF59] mt-1.5 shrink-0" />
                <span>{ing}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Preparation Instructions */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#183153]">
            Preparation Steps
          </h3>
          <ol className="space-y-2 pl-2">
            {(meal.instructions || []).map((step, i) => (
              <li key={i} className="text-xs text-slate-700 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#183153] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                  {i + 1}
                </span>
                <span className="mt-0.5 leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Close Button */}
        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => setSelectedPlannedMealForModal(null)}
            className="px-5 py-2.5 rounded-xl bg-[#183153] text-white font-bold text-xs hover:bg-[#244673]"
          >
            Close Recipe
          </button>
        </div>

      </div>
    </div>
  );
};
