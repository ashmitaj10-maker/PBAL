import React from 'react';
import { useClinic } from '../../context/ClinicContext';
import { 
  X, 
  Clock, 
  Users, 
  Flame, 
  Check, 
  Sparkles, 
  Printer, 
  ChefHat, 
  Heart, 
  Utensils,
  Layers,
  Award
} from 'lucide-react';

export const RecipeDetailModal: React.FC = () => {
  const { isRecipeModalOpen, closeRecipeModal, selectedRecipe } = useClinic();

  if (!isRecipeModalOpen || !selectedRecipe) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header with Image banner or vibrant gradient */}
        <div className="relative h-48 sm:h-56 bg-slate-900 overflow-hidden shrink-0">
          {selectedRecipe.imageUrl ? (
            <img 
              src={selectedRecipe.imageUrl} 
              alt={selectedRecipe.name} 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-85"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-[#183153] to-[#2B5488] flex items-center justify-center">
              <ChefHat className="w-16 h-16 text-white/20" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Close & Print Buttons */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-all cursor-pointer"
              title="Print Clinical Recipe Sheet"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={closeRecipeModal}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Title & Badge on Image */}
          <div className="absolute bottom-4 left-5 right-5 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#6BBF59] text-white">
                {selectedRecipe.category || 'Clinical Protocol'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white">
                {selectedRecipe.servingSizeDescription || `${selectedRecipe.servings} Serving`}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-xs">
              {selectedRecipe.name}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700">
          
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Total Energy</div>
              <div className="text-base font-bold font-mono text-[#183153]">{selectedRecipe.calories} kcal</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Protein</div>
              <div className="text-base font-bold font-mono text-emerald-700">{selectedRecipe.protein}g</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Carbs / Fiber</div>
              <div className="text-base font-bold font-mono text-sky-700">{selectedRecipe.carbs}g / {selectedRecipe.fiber}g</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Total Prep Time</div>
              <div className="text-base font-bold font-mono text-amber-700">
                {selectedRecipe.prepTimeMinutes + selectedRecipe.cookTimeMinutes} mins
              </div>
            </div>
          </div>

          {/* Clinical Benefit & Doctor Advice */}
          {selectedRecipe.clinicalBenefit && (
            <div className="p-4 bg-[#F8FFF8] rounded-2xl border border-emerald-200/80 text-xs space-y-1">
              <div className="font-bold text-[#183153] flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#6BBF59]" />
                Metabolic & Clinical Indication
              </div>
              <p className="text-slate-600 leading-relaxed">
                {selectedRecipe.clinicalBenefit}
              </p>
            </div>
          )}

          {/* Two Column Layout: Ingredients & Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Ingredients */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#183153] flex items-center gap-1.5 pb-1 border-b border-slate-200">
                <Utensils className="w-3.5 h-3.5 text-[#6BBF59]" />
                Prescribed Ingredients ({(selectedRecipe.ingredients || []).length})
              </h3>
              <ul className="space-y-2 text-xs">
                {(selectedRecipe.ingredients || []).map((ing, idx) => (
                  <li key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="font-medium text-slate-800">{ing.item}</span>
                    <span className="font-mono text-slate-500 font-semibold">{ing.amount}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Preparation Steps */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#183153] flex items-center gap-1.5 pb-1 border-b border-slate-200">
                <ChefHat className="w-3.5 h-3.5 text-[#6BBF59]" />
                Culinary Preparation Steps
              </h3>
              <ol className="space-y-2.5 text-xs">
                {(selectedRecipe.steps || []).map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#183153] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed text-slate-700">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Micronutrient Profile */}
          {selectedRecipe.micronutrients && (
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#183153] flex items-center gap-1.5 pb-1 border-b border-slate-200">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                Micronutrient Daily Value Index (% RDA)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-100 text-center">
                  <span className="text-[10px] text-slate-500 block">Vitamin C</span>
                  <span className="font-bold text-indigo-900 font-mono">{selectedRecipe.micronutrients.vitaminC}%</span>
                </div>
                <div className="p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-100 text-center">
                  <span className="text-[10px] text-slate-500 block">Calcium</span>
                  <span className="font-bold text-indigo-900 font-mono">{selectedRecipe.micronutrients.calcium}%</span>
                </div>
                <div className="p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-100 text-center">
                  <span className="text-[10px] text-slate-500 block">Iron</span>
                  <span className="font-bold text-indigo-900 font-mono">{selectedRecipe.micronutrients.iron}%</span>
                </div>
                <div className="p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-100 text-center">
                  <span className="text-[10px] text-slate-500 block">Magnesium</span>
                  <span className="font-bold text-indigo-900 font-mono">{selectedRecipe.micronutrients.magnesium}%</span>
                </div>
                <div className="p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-100 text-center">
                  <span className="text-[10px] text-slate-500 block">Potassium</span>
                  <span className="font-bold text-indigo-900 font-mono">{selectedRecipe.micronutrients.potassium}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Chef Tip */}
          {selectedRecipe.chefTip && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Nutritionist's Pro Tip:</strong> {selectedRecipe.chefTip}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
          <button
            onClick={closeRecipeModal}
            className="px-5 py-2 rounded-xl bg-[#183153] hover:bg-[#244673] text-white text-xs font-bold transition-all cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
