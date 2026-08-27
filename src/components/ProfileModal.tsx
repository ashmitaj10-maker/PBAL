import React, { useState } from 'react';
import { X, Sparkles, User, Activity, Heart, Shield, Check } from 'lucide-react';
import { useNutrition } from '../context/NutritionContext';
import { calculateBmr, calculateTdee, calculateBmi, calculateRecommendedMacros } from '../utils/nutritionCalculators';
import { ActivityLevel, DietType, PrimaryGoal, UserProfile } from '../types';

export const ProfileModal: React.FC = () => {
  const { profile, updateProfile, isProfileModalOpen, setIsProfileModalOpen } = useNutrition();

  const [formData, setFormData] = useState<UserProfile>({ ...profile });
  const [newAllergy, setNewAllergy] = useState('');
  const [newCondition, setNewCondition] = useState('');

  if (!isProfileModalOpen) return null;

  const currentBmr = calculateBmr(formData);
  const currentTdee = calculateTdee(formData);
  const currentBmi = calculateBmi(formData.weightKg, formData.heightCm);
  const autoMacros = calculateRecommendedMacros(currentTdee, formData.primaryGoal, formData.dietType, formData.weightKg);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setIsProfileModalOpen(false);
  };

  const handleApplyCalculatedMacros = () => {
    setFormData(prev => ({
      ...prev,
      dailyCalorieTarget: autoMacros.calories,
      proteinTargetGrams: autoMacros.proteinGrams,
      carbsTargetGrams: autoMacros.carbsGrams,
      fatTargetGrams: autoMacros.fatGrams,
      fiberTargetGrams: autoMacros.fiberGrams,
      waterTargetMl: autoMacros.waterMl,
    }));
  };

  const handleAddAllergy = () => {
    if (!newAllergy.trim()) return;
    if (!formData.allergies.includes(newAllergy.trim())) {
      setFormData(prev => ({ ...prev, allergies: [...prev.allergies, newAllergy.trim()] }));
    }
    setNewAllergy('');
  };

  const handleRemoveAllergy = (item: string) => {
    setFormData(prev => ({ ...prev, allergies: prev.allergies.filter(a => a !== item) }));
  };

  const handleAddCondition = () => {
    if (!newCondition.trim()) return;
    if (!formData.medicalConditions.includes(newCondition.trim())) {
      setFormData(prev => ({ ...prev, medicalConditions: [...prev.medicalConditions, newCondition.trim()] }));
    }
    setNewCondition('');
  };

  const handleRemoveCondition = (item: string) => {
    setFormData(prev => ({ ...prev, medicalConditions: prev.medicalConditions.filter(c => c !== item) }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#183153] text-[#6BBF59] flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#183153] font-['Poppins']">
                Biometric Profile & Clinical Targets
              </h2>
              <p className="text-xs text-slate-500">Mifflin-St Jeor metabolic calibration</p>
            </div>
          </div>
          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Calculation Preview Banner */}
        <div className="p-4 rounded-xl bg-[#F8FFF8] border border-[#6BBF59]/30 grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-500">BMI Metric</p>
            <p className="text-lg font-extrabold text-[#183153] mt-0.5">{currentBmi.bmi}</p>
            <span className="text-[10px] font-semibold text-[#6BBF59]">{currentBmi.category}</span>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-500">Basal BMR</p>
            <p className="text-lg font-extrabold text-[#183153] mt-0.5">{currentBmr} <span className="text-[10px] font-normal">kcal</span></p>
            <span className="text-[10px] text-slate-500">Resting expenditure</span>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-500">Total TDEE</p>
            <p className="text-lg font-extrabold text-[#183153] mt-0.5">{currentTdee} <span className="text-[10px] font-normal">kcal</span></p>
            <span className="text-[10px] text-slate-500">Maintenance energy</span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          
          {/* Personal Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-[#6BBF59] outline-none text-xs text-[#183153]"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value, 10) || 30 })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-[#6BBF59] outline-none text-xs text-[#183153]"
                min={15}
                max={100}
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Biological Sex</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-[#6BBF59] outline-none text-xs text-[#183153] bg-white"
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Physical Measurements */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Height (cm)</label>
              <input
                type="number"
                value={formData.heightCm}
                onChange={(e) => setFormData({ ...formData, heightCm: parseFloat(e.target.value) || 170 })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-[#6BBF59] outline-none text-xs text-[#183153]"
                min={100}
                max={230}
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Current Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={formData.weightKg}
                onChange={(e) => setFormData({ ...formData, weightKg: parseFloat(e.target.value) || 70 })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-[#6BBF59] outline-none text-xs text-[#183153]"
                min={30}
                max={250}
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Target Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={formData.targetWeightKg}
                onChange={(e) => setFormData({ ...formData, targetWeightKg: parseFloat(e.target.value) || 65 })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-[#6BBF59] outline-none text-xs text-[#183153]"
                min={30}
                max={250}
                required
              />
            </div>
          </div>

          {/* Activity & Goals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Activity Level</label>
              <select
                value={formData.activityLevel}
                onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value as ActivityLevel })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-[#6BBF59] outline-none text-xs text-[#183153] bg-white"
              >
                <option value="sedentary">Sedentary (Desk job, little exercise)</option>
                <option value="light">Light (1-3 days light exercise)</option>
                <option value="moderate">Moderate (3-5 days moderate workouts)</option>
                <option value="very_active">Very Active (6-7 days intense workouts)</option>
                <option value="athlete">Athlete (2x daily rigorous training)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Primary Objective</label>
              <select
                value={formData.primaryGoal}
                onChange={(e) => setFormData({ ...formData, primaryGoal: e.target.value as PrimaryGoal })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-[#6BBF59] outline-none text-xs text-[#183153] bg-white"
              >
                <option value="metabolic_health">Metabolic Health & Steady Energy</option>
                <option value="fat_loss">Targeted Fat Loss & Lean Definition</option>
                <option value="lean_muscle">Lean Muscle Hypertrophy</option>
                <option value="blood_sugar_control">Blood Sugar & Insulin Regulation</option>
                <option value="longevity_wellness">Cellular Longevity & Anti-Aging</option>
              </select>
            </div>
          </div>

          {/* Dietary Goals & Recommended Macro Sync */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#183153]">
                Daily Macronutrient Targets
              </span>
              <button
                type="button"
                onClick={handleApplyCalculatedMacros}
                className="text-[11px] font-bold text-[#2E7D32] hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#6BBF59]" />
                Auto-Calculate by Science ({autoMacros.calories} kcal)
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">Calories (kcal)</label>
                <input
                  type="number"
                  value={formData.dailyCalorieTarget}
                  onChange={(e) => setFormData({ ...formData, dailyCalorieTarget: parseInt(e.target.value, 10) || 2000 })}
                  className="w-full p-2 rounded-lg border border-slate-200 bg-white text-xs font-bold text-[#183153]"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">Protein (g)</label>
                <input
                  type="number"
                  value={formData.proteinTargetGrams}
                  onChange={(e) => setFormData({ ...formData, proteinTargetGrams: parseInt(e.target.value, 10) || 120 })}
                  className="w-full p-2 rounded-lg border border-slate-200 bg-white text-xs font-bold text-[#183153]"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">Carbs (g)</label>
                <input
                  type="number"
                  value={formData.carbsTargetGrams}
                  onChange={(e) => setFormData({ ...formData, carbsTargetGrams: parseInt(e.target.value, 10) || 180 })}
                  className="w-full p-2 rounded-lg border border-slate-200 bg-white text-xs font-bold text-[#183153]"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">Lipids (g)</label>
                <input
                  type="number"
                  value={formData.fatTargetGrams}
                  onChange={(e) => setFormData({ ...formData, fatTargetGrams: parseInt(e.target.value, 10) || 60 })}
                  className="w-full p-2 rounded-lg border border-slate-200 bg-white text-xs font-bold text-[#183153]"
                />
              </div>
            </div>
          </div>

          {/* Allergies & Conditions Tag Editors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1.5">Allergens & Sensitivities</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  placeholder="e.g. Shellfish, Peanuts"
                  className="flex-1 p-2 rounded-lg border border-slate-200 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddAllergy}
                  className="px-3 py-2 rounded-lg bg-[#183153] text-white text-xs font-bold"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {(formData.allergies || []).map(a => (
                  <span key={a} className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 bg-red-50 text-red-700 rounded-md border border-red-100">
                    {a}
                    <button type="button" onClick={() => handleRemoveAllergy(a)} className="hover:text-red-900">&times;</button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1.5">Health Focus / Conditions</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  placeholder="e.g. Insulin Sensitivity, PCOS"
                  className="flex-1 p-2 rounded-lg border border-slate-200 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddCondition}
                  className="px-3 py-2 rounded-lg bg-[#183153] text-white text-xs font-bold"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {(formData.medicalConditions || []).map(c => (
                  <span key={c} className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md border border-blue-100">
                    {c}
                    <button type="button" onClick={() => handleRemoveCondition(c)} className="hover:text-blue-900">&times;</button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(false)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#6BBF59] hover:bg-[#5EAB4D] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Save & Update Clinical Targets</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
