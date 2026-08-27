import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { 
  Sparkles, 
  RefreshCw, 
  Check, 
  Clock, 
  Flame, 
  Utensils, 
  ChefHat, 
  Send, 
  Edit3, 
  Plus, 
  Trash2, 
  Layers, 
  Calendar, 
  ArrowLeft, 
  Eye, 
  Sliders, 
  ChevronDown, 
  Save, 
  FileText, 
  BookOpen, 
  TrendingUp,
  Info,
  CheckCircle2,
  Lock,
  Zap,
  ArrowRight,
  User
} from 'lucide-react';
import { 
  MealPlanMode, 
  MealSlotType, 
  ClinicalMealPlan, 
  MealSlot, 
  MealOption, 
  DayMealPlan 
} from '../../types/clinic';
import { regenerateSingleMealSlot, generateClinicalMealPlan } from '../../services/aiMealService';
import { RECIPE_CATALOG } from '../../data/mockMealAndAssessmentData';

const SLOT_META: Record<MealSlotType, { label: string; defaultTime: string; icon: string; bg: string }> = {
  wake_up: { label: 'Wake Up Elixir', defaultTime: '06:30', icon: '🌅', bg: 'from-amber-500/10 to-orange-500/10' },
  breakfast: { label: 'Breakfast', defaultTime: '08:30', icon: '🍳', bg: 'from-emerald-500/10 to-teal-500/10' },
  mid_meal: { label: 'Mid Meal Booster', defaultTime: '11:30', icon: '🍏', bg: 'from-lime-500/10 to-green-500/10' },
  lunch: { label: 'Lunch (Main Meal)', defaultTime: '13:30', icon: '🥗', bg: 'from-sky-500/10 to-blue-500/10' },
  snack: { label: 'Evening Energy Snack', defaultTime: '17:00', icon: '🥜', bg: 'from-indigo-500/10 to-purple-500/10' },
  dinner: { label: 'Dinner (Low Glycemic)', defaultTime: '20:00', icon: '🍲', bg: 'from-violet-500/10 to-fuchsia-500/10' },
  sleep: { label: 'Bedtime Recovery Drink', defaultTime: '22:15', icon: '🌙', bg: 'from-slate-500/10 to-zinc-500/10' }
};

export const AiMealBuilderView: React.FC = () => {
  const { 
    selectedPatient, 
    setSelectedPatientId,
    patients, 
    navigateTo, 
    clinicalMealPlans, 
    saveMealPlan, 
    publishMealPlan, 
    selectedMealPlanId, 
    setSelectedMealPlanId, 
    getPatientAssessments, 
    openRecipeModal,
    currentUser,
    currentClinic
  } = useClinic();

  const patient = selectedPatient || patients[0];
  const patientPlans = patient ? clinicalMealPlans.filter(p => p.patientId === patient.id) : [];
  const activePlan: ClinicalMealPlan = patientPlans.find(p => p.id === selectedMealPlanId) || patientPlans[0] || (patient ? {
    id: `meal-plan-${patient.id}-default`,
    patientId: patient.id,
    patientName: patient.name,
    clinicId: currentClinic?.id || 'clinic-1',
    title: `${patient.foodPreference || 'Personalized'} Metabolic Optimization Protocol`,
    targetCalories: 1550,
    version: 1,
    targetMacros: {
      protein: 90,
      carbs: 145,
      fat: 45,
      fiber: 35
    },
    mode: 'choice' as MealPlanMode,
    status: 'draft' as const,
    slots: clinicalMealPlans[0]?.slots || [],
    generalInstructions: [
      'Drink 500ml warm water with lemon upon waking.',
      'Maintain 3-4 hours interval between main meals.',
      'Chew slowly and avoid liquids 20 mins before and after meals.'
    ],
    hydrationGuidelines: '3.0 - 3.5 Liters daily, infused with mint and cucumber.',
    clinicalRationale: 'Optimized macro ratios designed to balance post-prandial glycemic spikes and preserve lean metabolic mass.',
    createdBy: currentUser?.name || 'Dr. Ananya Sharma',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  } : clinicalMealPlans[0]);

  const assessment = patient ? getPatientAssessments(patient.id)[0] : null;

  // Active builder states
  const [currentMode, setCurrentMode] = useState<MealPlanMode>(activePlan?.mode || 'choice');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [isRegeneratingAll, setIsRegeneratingAll] = useState(false);
  const [regeneratingSlot, setRegeneratingSlot] = useState<MealSlotType | null>(null);
  const [isEditingOptionId, setIsEditingOptionId] = useState<string | null>(null);
  const [editedOptionData, setEditedOptionData] = useState<Partial<MealOption>>({});
  const [swapModalSlotType, setSwapModalSlotType] = useState<MealSlotType | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Sync mode when activePlan changes
  React.useEffect(() => {
    if (activePlan?.mode) {
      setCurrentMode(activePlan.mode);
    }
  }, [activePlan?.id]);

  const handlePatientSelect = (newPatientId: string) => {
    setSelectedPatientId(newPatientId);
    const foundPlans = clinicalMealPlans.filter(p => p.patientId === newPatientId);
    if (foundPlans.length > 0) {
      setSelectedMealPlanId(foundPlans[0].id);
      setCurrentMode(foundPlans[0].mode || 'choice');
    }
  };

  if (!patient || !activePlan) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-500">No active meal plan found for this patient.</p>
        <button onClick={() => navigateTo('assessment', { patientId: patient?.id })} className="mt-4 px-4 py-2 bg-[#183153] text-white text-xs font-semibold rounded-xl">
          Complete Patient Assessment First
        </button>
      </div>
    );
  }

  // Active slots to render depending on Choice vs Weekly mode
  const currentSlots: MealSlot[] = currentMode === 'choice' 
    ? (activePlan.slots || []) 
    : (activePlan.weeklyDays?.[selectedDayIndex]?.slots || activePlan.slots || []);

  // Total calculated metrics
  const calculateTotalMacros = () => {
    let totalCals = 0;
    let totalProt = 0;
    let totalCarb = 0;
    let totalFat = 0;
    let totalFiber = 0;

    (currentSlots || []).forEach(slot => {
      const selectedOption = (slot.options || []).find(o => o.id === slot.selectedOptionId) || slot.options?.[0];
      if (selectedOption) {
        totalCals += selectedOption.calories || 0;
        totalProt += selectedOption.protein || 0;
        totalCarb += selectedOption.carbs || 0;
        totalFat += selectedOption.fat || 0;
        totalFiber += selectedOption.fiber || 0;
      }
    });

    return { totalCals, totalProt, totalCarb, totalFat, totalFiber };
  };

  const currentMacros = calculateTotalMacros();

  // Single Slot Regeneration Handler
  const handleRegenerateSlot = async (slotType: MealSlotType) => {
    setRegeneratingSlot(slotType);
    
    setTimeout(() => {
      const freshOptions = regenerateSingleMealSlot(
        slotType, 
        Math.round(activePlan.targetCalories / 6), 
        assessment?.foodPreference || 'Vegetarian'
      );

      const updatedSlots = (currentSlots || []).map(slot => {
        if (slot.slotType === slotType) {
          return {
            ...slot,
            options: freshOptions,
            selectedOptionId: freshOptions[0].id
          };
        }
        return slot;
      });

      const updatedPlan: ClinicalMealPlan = {
        ...activePlan,
        status: 'draft',
        slots: currentMode === 'choice' ? updatedSlots : activePlan.slots,
        weeklyDays: currentMode === 'weekly' 
          ? (activePlan.weeklyDays?.map((d, i) => i === selectedDayIndex ? { ...d, slots: updatedSlots } : d) || [])
          : activePlan.weeklyDays,
        changeLog: [...(activePlan.changeLog || []), `Regenerated slot ${slotType} via AI Engine on ${new Date().toLocaleTimeString()}`]
      };

      saveMealPlan(updatedPlan);
      setRegeneratingSlot(null);
      setSaveSuccessMsg(`Regenerated ${SLOT_META[slotType].label} with new clinical variations!`);
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    }, 600);
  };

  // Full Plan Regeneration Handler (<1 min AI execution)
  const handleRegenerateFullPlan = async () => {
    setIsRegeneratingAll(true);
    try {
      const freshPlan = await generateClinicalMealPlan({
        patientId: patient.id,
        patientName: patient.name,
        clinicId: currentClinic?.id || 'clinic-1',
        assessment: assessment || {
          id: 'temp-asmt',
          patientId: patient.id,
          version: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          wakeTime: '06:30',
          sleepTime: '22:30',
          dailyWaterLiters: 2.5,
          exerciseFrequency: 'Moderate (3-4 days/wk)',
          exerciseTypes: ['Walking'],
          stressLevel: 'moderate',
          digestiveIssues: [],
          favoriteFoods: [],
          dislikedFoods: patient.allergies,
          medicalHistory: patient.medicalConditions,
          foodPreference: patient.foodPreference,
          targetCalories: 1550,
          targetProteinGrams: 90,
          targetCarbsGrams: 145,
          targetFatGrams: 45,
          targetFiberGrams: 35
        },
        mode: currentMode,
        targetCalories: activePlan.targetCalories
      });

      saveMealPlan(freshPlan);
      setSelectedMealPlanId(freshPlan.id);
      setSaveSuccessMsg('Full AI Meal Plan synthesized in under 15 seconds!');
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRegeneratingAll(false);
    }
  };

  // Portion Scaling Modifier
  const handleScalePortion = (slotType: MealSlotType, optionId: string, factor: number) => {
    const updatedSlots = (currentSlots || []).map(slot => {
      if (slot.slotType === slotType) {
        return {
          ...slot,
          options: (slot.options || []).map(opt => {
            if (opt.id === optionId) {
              const newGrams = Math.round((opt.portionGrams || 200) * factor);
              return {
                ...opt,
                portionGrams: newGrams,
                portion: `${newGrams}g portion`,
                calories: Math.round(opt.calories * factor),
                protein: Math.round(opt.protein * factor),
                carbs: Math.round(opt.carbs * factor),
                fat: Math.round(opt.fat * factor),
                fiber: Math.round(opt.fiber * factor)
              };
            }
            return opt;
          })
        };
      }
      return slot;
    });

    const updatedPlan: ClinicalMealPlan = {
      ...activePlan,
      status: 'draft',
      slots: currentMode === 'choice' ? updatedSlots : activePlan.slots,
      weeklyDays: currentMode === 'weekly' 
        ? (activePlan.weeklyDays?.map((d, i) => i === selectedDayIndex ? { ...d, slots: updatedSlots } : d) || [])
        : activePlan.weeklyDays
    };

    saveMealPlan(updatedPlan);
  };

  // Publish Plan to Patient App
  const handlePublish = () => {
    publishMealPlan(activePlan.id);
    setSaveSuccessMsg(`Published "${activePlan.title}" directly to ${patient.name}'s mobile app!`);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Banner: Patient Context, Mode Switcher, Status & Publish */}
      <div className="bg-white p-5 rounded-2xl border border-[#E4E9E4] shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigateTo('patient_profile', { patientId: patient.id })}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-[#183153]">
                  AI Clinical Meal Builder
                </h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${
                  activePlan.status === 'published' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}>
                  {activePlan.status === 'published' ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Lock className="w-3 h-3 text-amber-600" />}
                  {activePlan.status === 'published' ? 'Published Live' : 'Draft (Editable)'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Patient: <strong className="text-[#183153]">{patient.name}</strong> • Protocol: <span className="font-semibold text-slate-700">{activePlan.title}</span>
              </p>
            </div>
          </div>

          {/* Action CTAs & Patient Switcher */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* Patient Selector */}
            <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-xs">
              <User className="w-4 h-4 text-teal-600 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-bold text-slate-400 leading-none">Select Patient</span>
                <select
                  value={patient.id}
                  onChange={(e) => handlePatientSelect(e.target.value)}
                  className="bg-transparent text-xs sm:text-sm font-bold text-slate-800 focus:outline-none cursor-pointer pr-1"
                >
                  {(patients || []).map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.patientCode})</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={() => navigateTo('patient_portal', { patientId: patient.id })}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-[#183153] hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Preview App</span>
            </button>

            <button
              onClick={handleRegenerateFullPlan}
              disabled={isRegeneratingAll}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-50 border border-indigo-200 text-indigo-900 hover:bg-indigo-100 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${isRegeneratingAll ? 'animate-spin' : ''}`} />
              <span>{isRegeneratingAll ? 'Synthesizing...' : 'Regenerate Plan'}</span>
            </button>

            <button
              onClick={handlePublish}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#6BBF59] text-white hover:bg-[#5EAB4D] shadow-xs hover:shadow transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish</span>
            </button>
          </div>
        </div>

        {/* Mode Selector Tabs & Day Selector */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 mr-1">Planning Architecture:</span>
            
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setCurrentMode('choice')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentMode === 'choice' 
                    ? 'bg-[#183153] text-white shadow-xs' 
                    : 'text-slate-600 hover:text-[#183153]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Choice Mode (2–5 Options / Slot)</span>
              </button>

              <button
                onClick={() => setCurrentMode('weekly')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentMode === 'weekly' 
                    ? 'bg-[#183153] text-white shadow-xs' 
                    : 'text-slate-600 hover:text-[#183153]'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Weekly Mode (Mon – Sun Schedule)</span>
              </button>
            </div>
          </div>

          {/* If weekly mode, show Monday through Sunday Pills */}
          {currentMode === 'weekly' && (
            <div className="flex items-center gap-1 overflow-x-auto py-1">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, idx) => (
                <button
                  key={day}
                  onClick={() => setSelectedDayIndex(idx)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    selectedDayIndex === idx
                      ? 'bg-[#6BBF59] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Live Caloric & Macro Real-time Recalibration Dashboard */}
      <div className="bg-gradient-to-r from-[#183153] to-[#203D66] text-white p-5 rounded-2xl shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="text-xs uppercase tracking-wider text-emerald-300 font-semibold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#6BBF59]" />
              Real-Time Dynamic Metabolic Recalibration
            </div>
            <div className="text-sm font-bold mt-0.5 text-white">
              Current Daily Total: <span className="font-mono text-emerald-400 text-base">{currentMacros.totalCals} kcal</span> / Target: <span className="font-mono text-slate-300">{activePlan.targetCalories} kcal</span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-300">
              Caloric Variance: <span className={`font-mono font-bold ${Math.abs(currentMacros.totalCals - activePlan.targetCalories) <= 80 ? 'text-emerald-400' : 'text-amber-300'}`}>
                {currentMacros.totalCals - activePlan.targetCalories > 0 ? `+${currentMacros.totalCals - activePlan.targetCalories}` : currentMacros.totalCals - activePlan.targetCalories} kcal
              </span>
            </div>
          </div>
        </div>

        {/* Macro Bars */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 text-xs">
          <div className="bg-white/10 p-3 rounded-xl backdrop-blur-xs">
            <div className="flex justify-between text-slate-300 font-medium mb-1">
              <span>Protein</span>
              <span className="font-mono font-bold text-white">{currentMacros.totalProt}g / {activePlan.targetMacros?.protein || 90}g</span>
            </div>
            <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-[#6BBF59] h-full rounded-full transition-all" 
                style={{ width: `${Math.min(100, (currentMacros.totalProt / (activePlan.targetMacros?.protein || 90)) * 100)}%` }}
              />
            </div>
          </div>

          <div className="bg-white/10 p-3 rounded-xl backdrop-blur-xs">
            <div className="flex justify-between text-slate-300 font-medium mb-1">
              <span>Net Carbs</span>
              <span className="font-mono font-bold text-white">{currentMacros.totalCarb}g / {activePlan.targetMacros?.carbs || 145}g</span>
            </div>
            <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-sky-400 h-full rounded-full transition-all" 
                style={{ width: `${Math.min(100, (currentMacros.totalCarb / (activePlan.targetMacros?.carbs || 145)) * 100)}%` }}
              />
            </div>
          </div>

          <div className="bg-white/10 p-3 rounded-xl backdrop-blur-xs">
            <div className="flex justify-between text-slate-300 font-medium mb-1">
              <span>Fats</span>
              <span className="font-mono font-bold text-white">{currentMacros.totalFat}g / {activePlan.targetMacros?.fat || 45}g</span>
            </div>
            <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-amber-400 h-full rounded-full transition-all" 
                style={{ width: `${Math.min(100, (currentMacros.totalFat / (activePlan.targetMacros?.fat || 45)) * 100)}%` }}
              />
            </div>
          </div>

          <div className="bg-white/10 p-3 rounded-xl backdrop-blur-xs">
            <div className="flex justify-between text-slate-300 font-medium mb-1">
              <span>Dietary Fiber</span>
              <span className="font-mono font-bold text-white">{currentMacros.totalFiber}g / {activePlan.targetMacros?.fiber || 35}g</span>
            </div>
            <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-400 h-full rounded-full transition-all" 
                style={{ width: `${Math.min(100, (currentMacros.totalFiber / (activePlan.targetMacros?.fiber || 35)) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* The 7 Meal Slots Builder Grid */}
      <div className="space-y-6">
        {(currentSlots || []).map((slot, sIdx) => {
          const meta = SLOT_META[slot.slotType] || { label: slot.slotName || slot.title || 'Meal Slot', defaultTime: slot.defaultTime, icon: '🍽️', bg: 'from-slate-500/10 to-zinc-500/10' };
          const isSlotRegen = regeneratingSlot === slot.slotType;

          return (
            <div 
              key={slot.id || slot.slotType || sIdx}
              className="bg-white rounded-2xl border border-[#E4E9E4] overflow-hidden shadow-xs hover:border-slate-300 transition-all"
            >
              {/* Slot Header */}
              <div className="p-4 bg-slate-50 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-2 bg-white rounded-xl shadow-2xs border border-slate-200">
                    {meta.icon}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[#183153]">
                        {slot.slotName || slot.title || meta.label}
                      </h3>
                      <span className="flex items-center gap-1 text-[11px] font-mono font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {slot.defaultTime}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {currentMode === 'choice' 
                        ? `${slot.options.length} Personalized clinical choices configured` 
                        : 'Scheduled day plate formulation'}
                    </p>
                  </div>
                </div>

                {/* Slot Level Doctor Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRegenerateSlot(slot.slotType)}
                    disabled={isSlotRegen}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-[#183153] hover:bg-slate-100 text-xs font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50"
                    title="Regenerate this single meal slot with AI"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-[#6BBF59] ${isSlotRegen ? 'animate-spin' : ''}`} />
                    <span>{isSlotRegen ? 'Regenerating...' : 'Regenerate Meal'}</span>
                  </button>

                  <button
                    onClick={() => setSwapModalSlotType(slot.slotType)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-[#183153] hover:bg-emerald-100 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#6BBF59]" />
                    <span>Add / Swap Recipe</span>
                  </button>
                </div>
              </div>

              {/* Meal Options in Slot */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(slot.options || []).map((option, optIdx) => {
                  const isSelected = slot.selectedOptionId === option.id;
                  const isEditing = isEditingOptionId === option.id;

                  return (
                    <div 
                      key={option.id}
                      className={`relative p-4 rounded-xl border transition-all flex flex-col justify-between ${
                        isSelected 
                          ? 'border-[#6BBF59] bg-[#F8FFF8]/60 shadow-xs ring-1 ring-[#6BBF59]/30' 
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      {/* Option Header & Badges */}
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#183153] text-white">
                              Option {optIdx + 1}
                            </span>
                            {isSelected && (
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 flex items-center gap-1">
                                <Check className="w-2.5 h-2.5 text-emerald-600" />
                                Primary
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openRecipeModal(option)}
                              className="p-1 text-slate-400 hover:text-[#183153] hover:bg-slate-100 rounded-md cursor-pointer"
                              title="View Full Recipe & Cooking Steps"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Title & Portion */}
                        <h4 className="text-sm font-bold text-[#183153] mb-1">
                          {option.name}
                        </h4>
                        <p className="text-xs text-slate-600 mb-2 leading-relaxed">
                          {option.description}
                        </p>

                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium mb-3">
                          <Utensils className="w-3 h-3 text-slate-400" />
                          <span>Portion: <strong>{option.portion}</strong></span>
                        </div>

                        {/* Macro Chips */}
                        <div className="flex flex-wrap gap-1.5 text-[11px] font-mono mb-3">
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-md font-bold">
                            {option.calories} kcal
                          </span>
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-md">
                            P: {option.protein}g
                          </span>
                          <span className="px-2 py-0.5 bg-sky-50 text-sky-900 border border-sky-200 rounded-md">
                            C: {option.carbs}g
                          </span>
                          <span className="px-2 py-0.5 bg-rose-50 text-rose-900 border border-rose-200 rounded-md">
                            F: {option.fat}g
                          </span>
                          {option.fiber && (
                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-900 border border-indigo-200 rounded-md">
                              Fib: {option.fiber}g
                            </span>
                          )}
                        </div>

                        {/* Clinical Benefit Highlight */}
                        {option.clinicalBenefit && (
                          <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-600 mb-3 flex items-start gap-1.5">
                            <Info className="w-3.5 h-3.5 text-[#6BBF59] shrink-0 mt-0.5" />
                            <span>{option.clinicalBenefit}</span>
                          </div>
                        )}
                      </div>

                      {/* Doctor Editing & Portion Adjuster Toolbar */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleScalePortion(slot.slotType, option.id, 0.85)}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-md text-[10px] font-bold text-slate-700 cursor-pointer"
                            title="Decrease portion by 15%"
                          >
                            -15%
                          </button>
                          <button
                            onClick={() => handleScalePortion(slot.slotType, option.id, 1.15)}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-md text-[10px] font-bold text-slate-700 cursor-pointer"
                            title="Increase portion by 15%"
                          >
                            +15%
                          </button>
                        </div>

                        <button
                          onClick={() => {
                            const updatedSlots = (currentSlots || []).map(s => s.slotType === slot.slotType ? { ...s, selectedOptionId: option.id } : s);
                            saveMealPlan({
                              ...activePlan,
                              slots: currentMode === 'choice' ? updatedSlots : activePlan.slots,
                              weeklyDays: currentMode === 'weekly' 
                                ? (activePlan.weeklyDays?.map((d, i) => i === selectedDayIndex ? { ...d, slots: updatedSlots } : d) || [])
                                : activePlan.weeklyDays
                            });
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            isSelected 
                              ? 'bg-[#6BBF59] text-white font-bold' 
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {isSelected ? 'Active Selection' : 'Set as Primary'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recipe Swap / Add Modal */}
      {swapModalSlotType && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-2xl">
              <div>
                <h3 className="text-sm font-bold text-[#183153]">
                  Clinical Recipe Catalog & Swap
                </h3>
                <p className="text-xs text-slate-500">
                  Select a certified recipe to append to {SLOT_META[swapModalSlotType].label}
                </p>
              </div>
              <button 
                onClick={() => setSwapModalSlotType(null)} 
                className="p-1 rounded-lg hover:bg-slate-200 text-slate-500"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 flex-1">
              {Object.values(RECIPE_CATALOG).map(recipe => (
                <div 
                  key={recipe.id}
                  className="p-3 rounded-xl border border-slate-200 hover:border-[#6BBF59] bg-slate-50/50 hover:bg-[#F8FFF8] transition-all flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#183153]">{recipe.name}</span>
                      <span className="text-[10px] px-2 py-0.5 bg-slate-200 rounded-md text-slate-700 font-semibold">{recipe.category}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-1">{recipe.clinicalBenefit}</p>
                    <div className="text-[11px] font-mono text-slate-500 flex gap-2">
                      <span>{recipe.calories} kcal</span>
                      <span>P: {recipe.protein}g</span>
                      <span>C: {recipe.carbs}g</span>
                      <span>F: {recipe.fat}g</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const newOption: MealOption = {
                        id: `opt-swap-${Date.now()}`,
                        slotType: swapModalSlotType,
                        name: recipe.name,
                        description: recipe.clinicalBenefit,
                        portion: recipe.servingSizeDescription,
                        portionGrams: 220,
                        calories: recipe.calories,
                        protein: recipe.protein,
                        carbs: recipe.carbs,
                        fat: recipe.fat,
                        fiber: recipe.fiber,
                        glycemicIndex: 'Low',
                        ingredients: (recipe.ingredients || []).map(i => `${i.amount} ${i.item}`),
                        instructions: recipe.steps || [],
                        clinicalBenefit: recipe.clinicalBenefit,
                        prepTimeMinutes: (recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0)
                      };

                      const updatedSlots = (currentSlots || []).map(s => {
                        if (s.slotType === swapModalSlotType) {
                          return {
                            ...s,
                            options: [...(s.options || []), newOption]
                          };
                        }
                        return s;
                      });

                      saveMealPlan({
                        ...activePlan,
                        status: 'draft',
                        slots: currentMode === 'choice' ? updatedSlots : activePlan.slots,
                        weeklyDays: currentMode === 'weekly' 
                          ? (activePlan.weeklyDays?.map((d, i) => i === selectedDayIndex ? { ...d, slots: updatedSlots } : d) || [])
                          : activePlan.weeklyDays
                      });

                      setSwapModalSlotType(null);
                      setSaveSuccessMsg(`Added ${recipe.name} to meal options!`);
                      setTimeout(() => setSaveSuccessMsg(null), 3000);
                    }}
                    className="px-3 py-1.5 bg-[#183153] hover:bg-[#244673] text-white text-xs font-semibold rounded-xl cursor-pointer shrink-0"
                  >
                    Select Recipe
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
