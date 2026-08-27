import React, { useState, useEffect } from 'react';
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
  User,
  PlusCircle,
  Copy,
  SlidersHorizontal,
  X,
  Search,
  CheckCheck,
  AlertCircle,
  Bell
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
import { 
  formatDate, 
  formatDateTime, 
  calculatePlanEndDateIso, 
  calculatePlanEndDateDisplay, 
  isTomorrow, 
  isToday, 
  getDaysDifference, 
  addDays, 
  getTodayIso 
} from '../../utils/dateUtils';
import { PatientSelector } from './PatientSelector';
import { RECIPE_CATALOG } from '../../data/mockMealAndAssessmentData';

const DEFAULT_SLOT_META: Record<string, { label: string; defaultTime: string; icon: string; bg: string }> = {
  wake_up: { label: 'Wake Up Elixir', defaultTime: '06:30 AM', icon: '🌅', bg: 'from-amber-500/10 to-orange-500/10' },
  breakfast: { label: 'Breakfast', defaultTime: '08:30 AM', icon: '🍳', bg: 'from-emerald-500/10 to-teal-500/10' },
  mid_meal: { label: 'Mid Meal Booster', defaultTime: '11:30 AM', icon: '🍏', bg: 'from-lime-500/10 to-green-500/10' },
  lunch: { label: 'Lunch (Main Meal)', defaultTime: '01:30 PM', icon: '🥗', bg: 'from-sky-500/10 to-blue-500/10' },
  snack: { label: 'Evening Energy Snack', defaultTime: '05:00 PM', icon: '🥜', bg: 'from-indigo-500/10 to-purple-500/10' },
  dinner: { label: 'Dinner (Low Glycemic)', defaultTime: '08:00 PM', icon: '🍲', bg: 'from-violet-500/10 to-fuchsia-500/10' },
  sleep: { label: 'Bedtime Recovery Drink', defaultTime: '10:15 PM', icon: '🌙', bg: 'from-slate-500/10 to-zinc-500/10' },
  pre_workout: { label: 'Pre-Workout Fuel', defaultTime: '06:00 AM', icon: '⚡', bg: 'from-rose-500/10 to-amber-500/10' },
  post_workout: { label: 'Post-Workout Recovery', defaultTime: '07:30 AM', icon: '🥤', bg: 'from-teal-500/10 to-emerald-500/10' }
};

const COMMON_TIME_PRESETS = [
  '06:00 AM', '06:30 AM', '07:00 AM', '07:30 AM', '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM',
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM',
  '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM',
  '08:30 PM', '09:00 PM', '09:30 PM', '10:00 PM', '10:15 PM', '10:30 PM'
];

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
    createdBy: currentUser?.name || 'Dr. Ashmita Joshi, MD, RD',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  } : clinicalMealPlans[0]);

  const assessment = patient ? getPatientAssessments(patient.id)[0] : null;

  // Active builder states
  const [currentMode, setCurrentMode] = useState<MealPlanMode>(activePlan?.mode || 'choice');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [isRegeneratingAll, setIsRegeneratingAll] = useState(false);
  const [regeneratingSlot, setRegeneratingSlot] = useState<string | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Modals state
  const [swapModalSlot, setSwapModalSlot] = useState<MealSlot | null>(null);
  const [swapModalTab, setSwapModalTab] = useState<'ai_suggest' | 'custom_item'>('ai_suggest');
  const [searchRecipeQuery, setSearchRecipeQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Custom Item Form State (for adding a new custom recipe/meal)
  const [customName, setCustomName] = useState('');
  const [customPortion, setCustomPortion] = useState('1 bowl (200g)');
  const [customPortionGrams, setCustomPortionGrams] = useState(200);
  const [customCalories, setCustomCalories] = useState(250);
  const [customProtein, setCustomProtein] = useState(15);
  const [customCarbs, setCustomCarbs] = useState(30);
  const [customFat, setCustomFat] = useState(7);
  const [customFiber, setCustomFiber] = useState(5);
  const [customGlycemicIndex, setCustomGlycemicIndex] = useState<'Low' | 'Medium' | 'High'>('Low');
  const [customPrepTimeMinutes, setCustomPrepTimeMinutes] = useState(15);
  const [customIngredientsText, setCustomIngredientsText] = useState('');
  const [customInstructionsText, setCustomInstructionsText] = useState('');
  const [customClinicalBenefit, setCustomClinicalBenefit] = useState('');
  const [customSetAsPrimary, setCustomSetAsPrimary] = useState(true);

  // Edit Existing Option Modal State
  const [editingOptionModal, setEditingOptionModal] = useState<{
    slotType: string;
    option: MealOption;
  } | null>(null);
  const [editOptionData, setEditOptionData] = useState<Partial<MealOption>>({});
  const [editIngredientsText, setEditIngredientsText] = useState('');
  const [editInstructionsText, setEditInstructionsText] = useState('');

  // Add Custom Meal Slot Modal State
  const [isAddSlotModalOpen, setIsAddSlotModalOpen] = useState(false);
  const [newSlotTitle, setNewSlotTitle] = useState('');
  const [newSlotTime, setNewSlotTime] = useState('10:00 AM');
  const [newSlotIcon, setNewSlotIcon] = useState('🍽️');

  // Edit Targets & Guidelines Modal State
  const [isTargetsModalOpen, setIsTargetsModalOpen] = useState(false);
  const [targetCalsInput, setTargetCalsInput] = useState(activePlan?.targetCalories || 1550);
  const [targetProtInput, setTargetProtInput] = useState(activePlan?.targetMacros?.protein || 90);
  const [targetCarbInput, setTargetCarbInput] = useState(activePlan?.targetMacros?.carbs || 145);
  const [targetFatInput, setTargetFatInput] = useState(activePlan?.targetMacros?.fat || 45);
  const [targetFiberInput, setTargetFiberInput] = useState(activePlan?.targetMacros?.fiber || 35);
  const [hydrationInput, setHydrationInput] = useState(activePlan?.hydrationGuidelines || '');
  const [instructionsInput, setInstructionsInput] = useState((activePlan?.generalInstructions || []).join('\n'));
  const [rationaleInput, setRationaleInput] = useState(activePlan?.clinicalRationale || '');

  // Inline Timing Editor State (slotType being edited)
  const [editingTimeSlotType, setEditingTimeSlotType] = useState<string | null>(null);
  const [tempTimeValue, setTempTimeValue] = useState('');

  // Sync mode when activePlan changes
  useEffect(() => {
    if (activePlan?.mode) {
      setCurrentMode(activePlan.mode);
    }
    if (activePlan) {
      setTargetCalsInput(activePlan.targetCalories);
      setTargetProtInput(activePlan.targetMacros?.protein || 90);
      setTargetCarbInput(activePlan.targetMacros?.carbs || 145);
      setTargetFatInput(activePlan.targetMacros?.fat || 45);
      setTargetFiberInput(activePlan.targetMacros?.fiber || 35);
      setHydrationInput(activePlan.hydrationGuidelines || '');
      setInstructionsInput((activePlan.generalInstructions || []).join('\n'));
      setRationaleInput(activePlan.clinicalRationale || '');
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

  // Helper to commit updated slots to activePlan
  const commitSlotsUpdate = (updatedSlots: MealSlot[], logMessage?: string) => {
    const updatedPlan: ClinicalMealPlan = {
      ...activePlan,
      status: 'draft',
      slots: currentMode === 'choice' ? updatedSlots : activePlan.slots,
      weeklyDays: currentMode === 'weekly' 
        ? (activePlan.weeklyDays?.map((d, i) => i === selectedDayIndex ? { ...d, slots: updatedSlots } : d) || [])
        : activePlan.weeklyDays,
      changeLog: logMessage 
        ? [...(activePlan.changeLog || []), `${logMessage} on ${formatDateTime(new Date())}`]
        : activePlan.changeLog
    };

    saveMealPlan(updatedPlan);
  };

  // -------------------------------------------------------------
  // 1. MEAL TIMINGS MANAGEMENT (Direct Dietitian Editing)
  // -------------------------------------------------------------
  const handleSaveSlotTime = (slotType: string, newTime: string) => {
    if (!newTime.trim()) return;
    const updatedSlots = (currentSlots || []).map(s => {
      if (s.slotType === slotType) {
        return { ...s, defaultTime: newTime.trim() };
      }
      return s;
    });

    commitSlotsUpdate(updatedSlots, `Updated timing for ${slotType} to ${newTime.trim()}`);
    setEditingTimeSlotType(null);
    setSaveSuccessMsg(`Timing updated to ${newTime.trim()}`);
    setTimeout(() => setSaveSuccessMsg(null), 2500);
  };

  // -------------------------------------------------------------
  // 2. ADD & REMOVE MEAL SLOTS (Custom Schedule Structures)
  // -------------------------------------------------------------
  const handleAddNewMealSlot = () => {
    if (!newSlotTitle.trim()) return;

    const uniqueSlotKey = `custom_${Date.now()}`;
    const newSlot: MealSlot = {
      id: `slot-${Date.now()}`,
      slotType: uniqueSlotKey,
      slotName: newSlotTitle.trim(),
      title: newSlotTitle.trim(),
      defaultTime: newSlotTime.trim() || '10:00 AM',
      customIcon: newSlotIcon || '🍽️',
      options: [
        {
          id: `opt-${Date.now()}`,
          slotType: uniqueSlotKey,
          name: `${newSlotTitle.trim()} Selection`,
          description: `Custom diet prescribed by dietitian for ${patient.name}.`,
          portion: '1 serving (150g)',
          portionGrams: 150,
          calories: 180,
          protein: 10,
          carbs: 22,
          fat: 5,
          fiber: 4,
          glycemicIndex: 'Low',
          ingredients: ['Fresh seasonal whole ingredients', 'Herbs and mild spices'],
          instructions: ['Prepare freshly as prescribed by your clinical dietitian.'],
          clinicalBenefit: 'Prescribed tailored nourishment for optimal metabolic balance.',
          prepTimeMinutes: 10,
          isCustom: true
        }
      ],
      selectedOptionId: `opt-${Date.now()}`
    };

    const updatedSlots = [...(currentSlots || []), newSlot];
    commitSlotsUpdate(updatedSlots, `Added custom meal slot "${newSlotTitle.trim()}"`);

    setIsAddSlotModalOpen(false);
    setNewSlotTitle('');
    setSaveSuccessMsg(`Added new meal slot "${newSlot.title}"!`);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleDeleteMealSlot = (slotType: string, slotTitle: string) => {
    if (!window.confirm(`Are you sure you want to remove "${slotTitle}" from this patient's meal plan?`)) {
      return;
    }

    const updatedSlots = (currentSlots || []).filter(s => s.slotType !== slotType);
    commitSlotsUpdate(updatedSlots, `Removed meal slot "${slotTitle}"`);
    setSaveSuccessMsg(`Removed slot "${slotTitle}" from meal plan.`);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  // -------------------------------------------------------------
  // 3. ADD CUSTOM MEAL / RECIPE (Manual Dietitian Entry)
  // -------------------------------------------------------------
  const handleSaveCustomItem = () => {
    if (!swapModalSlot || !customName.trim()) return;

    const ingredientsList = customIngredientsText
      .split('\n')
      .map(i => i.trim())
      .filter(Boolean);

    const instructionsList = customInstructionsText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const newOptionId = `opt-custom-${Date.now()}`;
    const customOption: MealOption = {
      id: newOptionId,
      slotType: swapModalSlot.slotType,
      name: customName.trim(),
      description: customClinicalBenefit.trim() || `Custom dietitian-curated meal for ${patient.name}.`,
      portion: customPortion.trim() || `${customPortionGrams}g portion`,
      portionGrams: Number(customPortionGrams) || 200,
      calories: Number(customCalories) || 0,
      protein: Number(customProtein) || 0,
      carbs: Number(customCarbs) || 0,
      fat: Number(customFat) || 0,
      fiber: Number(customFiber) || 0,
      glycemicIndex: customGlycemicIndex,
      ingredients: ingredientsList.length ? ingredientsList : ['Fresh whole food ingredients'],
      instructions: instructionsList.length ? instructionsList : ['Prepare cleanly as advised by your clinical dietitian.'],
      clinicalBenefit: customClinicalBenefit.trim() || 'Customized for specific patient tolerance & pantry availability.',
      prepTimeMinutes: Number(customPrepTimeMinutes) || 15,
      isCustom: true
    };

    const updatedSlots = (currentSlots || []).map(s => {
      if (s.slotType === swapModalSlot.slotType) {
        const nextOptions = [...(s.options || []), customOption];
        return {
          ...s,
          options: nextOptions,
          selectedOptionId: customSetAsPrimary ? newOptionId : (s.selectedOptionId || newOptionId)
        };
      }
      return s;
    });

    commitSlotsUpdate(updatedSlots, `Added custom meal "${customName.trim()}" to ${swapModalSlot.slotName || swapModalSlot.slotType}`);

    // Reset custom form
    setCustomName('');
    setCustomIngredientsText('');
    setCustomInstructionsText('');
    setCustomClinicalBenefit('');
    setSwapModalSlot(null);
    setSaveSuccessMsg(`Added custom item "${customOption.name}"!`);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  // -------------------------------------------------------------
  // 4. EDIT EXISTING MEAL / RECIPE OPTION
  // -------------------------------------------------------------
  const handleOpenEditOption = (slotType: string, option: MealOption) => {
    setEditingOptionModal({ slotType, option });
    setEditOptionData({ ...option });
    setEditIngredientsText((option.ingredients || []).join('\n'));
    setEditInstructionsText((option.instructions || []).join('\n'));
  };

  const handleSaveEditedOption = () => {
    if (!editingOptionModal || !editOptionData.name?.trim()) return;

    const ingredientsList = editIngredientsText
      .split('\n')
      .map(i => i.trim())
      .filter(Boolean);

    const instructionsList = editInstructionsText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const updatedOption: MealOption = {
      ...(editingOptionModal.option),
      ...editOptionData,
      name: editOptionData.name.trim(),
      portion: editOptionData.portion?.trim() || `${editOptionData.portionGrams || 200}g`,
      portionGrams: Number(editOptionData.portionGrams) || 200,
      calories: Number(editOptionData.calories) || 0,
      protein: Number(editOptionData.protein) || 0,
      carbs: Number(editOptionData.carbs) || 0,
      fat: Number(editOptionData.fat) || 0,
      fiber: Number(editOptionData.fiber) || 0,
      ingredients: ingredientsList.length ? ingredientsList : ['Fresh clinical ingredients'],
      instructions: instructionsList.length ? instructionsList : ['Prepare as recommended.'],
      clinicalBenefit: editOptionData.clinicalBenefit || 'Custom clinical recipe adjustments.',
      isCustom: true
    };

    const updatedSlots = (currentSlots || []).map(s => {
      if (s.slotType === editingOptionModal.slotType) {
        return {
          ...s,
          options: (s.options || []).map(opt => opt.id === updatedOption.id ? updatedOption : opt)
        };
      }
      return s;
    });

    commitSlotsUpdate(updatedSlots, `Edited recipe "${updatedOption.name}"`);
    setEditingOptionModal(null);
    setSaveSuccessMsg(`Saved changes to "${updatedOption.name}"!`);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  // -------------------------------------------------------------
  // 5. DELETE & DUPLICATE MEAL OPTIONS
  // -------------------------------------------------------------
  const handleDeleteOption = (slotType: string, optionId: string, optionName: string) => {
    const updatedSlots = (currentSlots || []).map(s => {
      if (s.slotType === slotType) {
        const nextOptions = (s.options || []).filter(o => o.id !== optionId);
        const nextSelected = s.selectedOptionId === optionId 
          ? (nextOptions[0]?.id || '') 
          : s.selectedOptionId;
        return {
          ...s,
          options: nextOptions,
          selectedOptionId: nextSelected
        };
      }
      return s;
    });

    commitSlotsUpdate(updatedSlots, `Deleted option "${optionName}" from ${slotType}`);
    setSaveSuccessMsg(`Removed "${optionName}".`);
    setTimeout(() => setSaveSuccessMsg(null), 2500);
  };

  const handleDuplicateOption = (slotType: string, option: MealOption) => {
    const clonedOption: MealOption = {
      ...option,
      id: `opt-clone-${Date.now()}`,
      name: `${option.name} (Custom Copy)`,
      isCustom: true
    };

    const updatedSlots = (currentSlots || []).map(s => {
      if (s.slotType === slotType) {
        return {
          ...s,
          options: [...(s.options || []), clonedOption]
        };
      }
      return s;
    });

    commitSlotsUpdate(updatedSlots, `Duplicated "${option.name}"`);
    setSaveSuccessMsg(`Cloned "${option.name}" for custom modifications.`);
    setTimeout(() => setSaveSuccessMsg(null), 2500);
  };

  // -------------------------------------------------------------
  // 6. PORTION SCALING & PRIMARY SELECTION
  // -------------------------------------------------------------
  const handleScalePortion = (slotType: string, optionId: string, factor: number) => {
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

    commitSlotsUpdate(updatedSlots);
  };

  const handleSetPrimaryOption = (slotType: string, optionId: string) => {
    const updatedSlots = (currentSlots || []).map(s => 
      s.slotType === slotType ? { ...s, selectedOptionId: optionId } : s
    );
    commitSlotsUpdate(updatedSlots);
  };

  // -------------------------------------------------------------
  // 7. AI ASSISTANCE HANDLERS (Assistant on Demand)
  // -------------------------------------------------------------
  const handleRegenerateSlot = async (slotType: string) => {
    setRegeneratingSlot(slotType);
    
    setTimeout(() => {
      const freshOptions = regenerateSingleMealSlot(
        slotType as any, 
        Math.round(activePlan.targetCalories / Math.max(1, currentSlots.length)), 
        assessment?.foodPreference || patient.foodPreference || 'Vegetarian'
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

      commitSlotsUpdate(updatedSlots, `AI regenerated options for ${slotType}`);
      setRegeneratingSlot(null);
      setSaveSuccessMsg(`AI suggested fresh variations for this slot!`);
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    }, 600);
  };

  const handleRegenerateFullPlan = async () => {
    if (!window.confirm('Do you want AI to generate a fresh baseline plan? Any custom changes you made will be replaced by the new AI baseline.')) {
      return;
    }

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
          doctorId: currentUser?.id || 'usr-1',
          doctorName: currentUser?.name || 'Dr. Ashmita Joshi, MD, RD',
          wakeTime: '06:30',
          sleepTime: '22:30',
          dailyWaterLiters: 2.5,
          exerciseFrequency: 'Moderate (3-4 days/wk)',
          exerciseTypes: ['Walking'],
          stressLevel: 'moderate',
          digestiveIssues: [],
          favoriteFoods: [],
          dislikedFoods: patient.allergies || [],
          medicalHistory: patient.medicalConditions || [],
          foodPreference: patient.foodPreference,
          targetCalories: activePlan.targetCalories || 1550,
          targetProteinGrams: activePlan.targetMacros?.protein || 90,
          targetCarbsGrams: activePlan.targetMacros?.carbs || 145,
          targetFatGrams: activePlan.targetMacros?.fat || 45,
          targetFiberGrams: activePlan.targetMacros?.fiber || 35
        },
        mode: currentMode,
        targetCalories: activePlan.targetCalories
      });

      saveMealPlan(freshPlan);
      setSelectedMealPlanId(freshPlan.id);
      setSaveSuccessMsg('Fresh AI Meal Plan synthesized! You can now freely edit, add, or customize anything.');
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRegeneratingAll(false);
    }
  };

  // -------------------------------------------------------------
  // 8. SAVE TARGETS & GUIDELINES
  // -------------------------------------------------------------
  const handleSaveTargetsAndGuidelines = () => {
    const updatedPlan: ClinicalMealPlan = {
      ...activePlan,
      targetCalories: Number(targetCalsInput) || 1550,
      targetMacros: {
        protein: Number(targetProtInput) || 90,
        carbs: Number(targetCarbInput) || 145,
        fat: Number(targetFatInput) || 45,
        fiber: Number(targetFiberInput) || 35
      },
      hydrationGuidelines: hydrationInput.trim(),
      generalInstructions: instructionsInput.split('\n').map(s => s.trim()).filter(Boolean),
      clinicalRationale: rationaleInput.trim()
    };

    saveMealPlan(updatedPlan);
    setIsTargetsModalOpen(false);
    setSaveSuccessMsg('Updated clinical targets and instructions!');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  // -------------------------------------------------------------
  // 9. UPDATE PLAN START DATE & DURATION SCHEDULE
  // -------------------------------------------------------------
  const handleUpdatePlanSchedule = (newStartDate: string, newDuration: number, newCycle: number = 1) => {
    const calcEndDate = calculatePlanEndDateIso(newStartDate, newDuration);
    const updatedPlan: ClinicalMealPlan = {
      ...activePlan,
      startDate: newStartDate,
      durationDays: newDuration,
      endDate: calcEndDate,
      cycleNumber: newCycle,
      changeLog: [...(activePlan.changeLog || []), `Plan schedule updated: Starts ${formatDate(newStartDate)} (${newDuration} days) on ${formatDateTime(new Date())}`]
    };

    saveMealPlan(updatedPlan);
    setSaveSuccessMsg(`Plan schedule updated! Starts: ${formatDate(newStartDate)} • Active Period: ${formatDate(newStartDate)} → ${formatDate(calcEndDate)} (${newDuration} Days)`);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  // Publish Plan to Patient App
  const handlePublish = () => {
    publishMealPlan(activePlan.id);
    setSaveSuccessMsg(`Published "${activePlan.title}" directly to ${patient.name}'s mobile app!`);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  // Filter recipes for the AI Suggest & Catalog tab
  const filteredCatalogRecipes = Object.values(RECIPE_CATALOG).filter(r => {
    const matchesSearch = !searchRecipeQuery.trim() || 
      r.name.toLowerCase().includes(searchRecipeQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchRecipeQuery.toLowerCase()) ||
      r.clinicalBenefit.toLowerCase().includes(searchRecipeQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'All' || r.category.toLowerCase().includes(categoryFilter.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 pb-20">
      
      {/* =========================================================================
          TOP BANNER: PATIENT CONTEXT & DIETITIAN MASTER CONTROL STATUS
          ========================================================================= */}
      <div className="bg-white p-5 rounded-2xl border border-[#E4E9E4] shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigateTo('patient_profile', { patientId: patient.id })}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
              title="Back to Patient Profile"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-[#183153]">
                  Clinical Meal Planner
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-200 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-teal-600" />
                  Dietitian Master Control
                </span>
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
                Patient: <strong className="text-[#183153]">{patient.name}</strong> • AI Assistant active for instant suggestions, full manual customization enabled.
              </p>
            </div>
          </div>

          {/* Action CTAs & Patient Switcher */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* Patient Selector */}
            <PatientSelector onSelect={(p) => handlePatientSelect(p.id)} />

            {/* Edit Targets & Guidelines */}
            <button
              onClick={() => setIsTargetsModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-[#183153] hover:bg-slate-200 transition-colors cursor-pointer"
              title="Edit Target Calories, Macros, and Instructions"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600" />
              <span>Targets & Guidelines</span>
            </button>

            {/* Add Custom Meal Slot */}
            <button
              onClick={() => setIsAddSlotModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-teal-50 border border-teal-200 text-teal-900 hover:bg-teal-100 transition-colors cursor-pointer"
              title="Add a new custom meal slot (e.g. Pre-Workout, Afternoon Tea)"
            >
              <PlusCircle className="w-3.5 h-3.5 text-teal-600" />
              <span>+ Add Meal Slot</span>
            </button>

            {/* Preview in Patient App */}
            <button
              onClick={() => navigateTo('patient_portal', { patientId: patient.id })}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-[#183153] hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Preview App</span>
            </button>

            {/* AI Regenerate Plan */}
            <button
              onClick={handleRegenerateFullPlan}
              disabled={isRegeneratingAll}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-50 border border-indigo-200 text-indigo-900 hover:bg-indigo-100 transition-all cursor-pointer disabled:opacity-50"
              title="Have AI synthesize a fresh baseline plan"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${isRegeneratingAll ? 'animate-spin' : ''}`} />
              <span>{isRegeneratingAll ? 'Synthesizing...' : 'AI Regenerate'}</span>
            </button>

            {/* Publish Plan to Patient */}
            <button
              onClick={handlePublish}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#6BBF59] text-white hover:bg-[#5EAB4D] shadow-xs hover:shadow transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish to Patient</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            PLAN START DATE & SCHEDULE SELECTOR (DIETITIAN EXPLICIT CONTROL)
            ========================================================================= */}
        <div className="bg-gradient-to-r from-teal-50/70 via-emerald-50/40 to-slate-50 border border-teal-200/80 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-600 text-white rounded-xl shadow-xs shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-[#183153] uppercase tracking-wider">
                  Plan Schedule & Active Period
                </h3>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-200">
                  Cycle {activePlan.cycleNumber || 1}
                </span>
                {isTomorrow(activePlan.startDate || '2026-08-28') && (
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase flex items-center gap-1 ${
                    activePlan.status === 'published' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                  }`}>
                    <Bell className="w-3 h-3 text-amber-600" />
                    Starts Tomorrow
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Active Period: <strong className="text-slate-900 font-mono">{formatDate(activePlan.startDate || '2026-08-28')}</strong> ➔ <strong className="text-slate-900 font-mono">{formatDate(activePlan.endDate || calculatePlanEndDateIso(activePlan.startDate || '2026-08-28', activePlan.durationDays || 7))}</strong> ({activePlan.durationDays || 7} Days)
              </p>
            </div>
          </div>

          {/* Schedule Controls */}
          <div className="flex items-center flex-wrap gap-3">
            {/* Start Date Picker */}
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
              <label htmlFor="plan-start-date" className="text-xs font-bold text-slate-700">Start Date:</label>
              <input
                id="plan-start-date"
                type="date"
                value={activePlan.startDate || '2026-08-28'}
                onChange={(e) => handleUpdatePlanSchedule(e.target.value, activePlan.durationDays || 7, activePlan.cycleNumber || 1)}
                className="text-xs font-bold text-teal-900 font-mono bg-transparent outline-none cursor-pointer"
              />
              <span className="text-[11px] font-bold font-mono text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                {formatDate(activePlan.startDate || '2026-08-28')}
              </span>
            </div>

            {/* Duration Selector */}
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
              <label htmlFor="plan-duration" className="text-xs font-bold text-slate-700">Duration:</label>
              <select
                id="plan-duration"
                value={activePlan.durationDays || 7}
                onChange={(e) => handleUpdatePlanSchedule(activePlan.startDate || '2026-08-28', Number(e.target.value), activePlan.cycleNumber || 1)}
                className="text-xs font-bold text-[#183153] bg-transparent outline-none cursor-pointer pr-1"
              >
                <option value={7}>7 Days (1 Week)</option>
                <option value={14}>14 Days (2 Weeks)</option>
                <option value={21}>21 Days (3 Weeks)</option>
                <option value={28}>28 Days (4 Weeks)</option>
                <option value={30}>30 Days (1 Month)</option>
              </select>
            </div>

            {/* Cycle Number */}
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
              <label htmlFor="plan-cycle" className="text-xs font-bold text-slate-700">Cycle:</label>
              <select
                id="plan-cycle"
                value={activePlan.cycleNumber || 1}
                onChange={(e) => handleUpdatePlanSchedule(activePlan.startDate || '2026-08-28', activePlan.durationDays || 7, Number(e.target.value))}
                className="text-xs font-bold text-[#183153] bg-transparent outline-none cursor-pointer"
              >
                <option value={1}>Week 1</option>
                <option value={2}>Week 2</option>
                <option value={3}>Week 3</option>
                <option value={4}>Week 4</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dietitian-Only Reminder Alert Banner */}
        {isTomorrow(activePlan.startDate || '2026-08-28') && (
          <div className={`p-3.5 rounded-2xl border flex items-start gap-3 shadow-2xs ${
            activePlan.status === 'published'
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
              : 'bg-amber-50/90 border-amber-300 text-amber-950 ring-1 ring-amber-300'
          }`}>
            <div className={`p-2 rounded-xl shrink-0 ${activePlan.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-200 text-amber-900'}`}>
              <Bell className="w-4 h-4" />
            </div>
            <div className="flex-1 text-xs">
              <div className="flex items-center gap-2">
                <strong className="font-bold text-sm">
                  {activePlan.status === 'published'
                    ? 'Diet Plan Starts Tomorrow (Plan Ready)'
                    : 'Diet Plan Reminder (Action Required)'}
                </strong>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                  activePlan.status === 'published' ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-950'
                }`}>
                  {activePlan.status === 'published' ? '✓ Finalized' : '⚠️ Draft Pending'}
                </span>
                <span className="text-[11px] text-slate-500 ml-auto font-medium">
                  🔒 Dietitian Workflow Notice (Hidden from Patient)
                </span>
              </div>
              <p className="mt-1 leading-relaxed text-slate-700">
                {patient.name}'s {activePlan.durationDays || 7}-day diet plan starts tomorrow ({formatDate(activePlan.startDate)}). {
                  activePlan.status === 'published'
                    ? 'The plan is finalized and will be active for the patient tomorrow morning.'
                    : 'Make sure their 7-day plan is customized and published before tomorrow.'
                }
              </p>
            </div>
            {activePlan.status !== 'published' && (
              <button
                onClick={handlePublish}
                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs shrink-0 cursor-pointer transition-all"
              >
                Finalize & Publish Now
              </button>
            )}
          </div>
        )}

        {/* Mode Selector Tabs & Day Selector */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 mr-1">Meal Architecture:</span>
            
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
                <span>Choice Mode (Options / Slot)</span>
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
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-center justify-between gap-2 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{saveSuccessMsg}</span>
          </div>
          <button onClick={() => setSaveSuccessMsg(null)} className="text-emerald-700 hover:text-emerald-950 p-1">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* =========================================================================
          DYNAMIC MACRONUTRIENT & CALORIC RECALIBRATION BAR
          ========================================================================= */}
      <div className="bg-gradient-to-r from-[#183153] to-[#203D66] text-white p-5 rounded-2xl shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="text-xs uppercase tracking-wider text-emerald-300 font-semibold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#6BBF59]" />
              Real-Time Dynamic Metabolic Recalibration
            </div>
            <div className="text-sm font-bold mt-0.5 text-white flex items-center gap-2 flex-wrap">
              <span>Calculated Total:</span>
              <span className="font-mono text-emerald-400 text-base font-black">{currentMacros.totalCals} kcal</span>
              <span className="text-slate-400">/ Target:</span>
              <span className="font-mono text-slate-200 font-bold">{activePlan.targetCalories} kcal</span>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/15 text-slate-300">
                {currentSlots.length} Active Meal Slots
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-slate-300">
                Caloric Delta: <span className={`font-mono font-bold ${Math.abs(currentMacros.totalCals - activePlan.targetCalories) <= 80 ? 'text-emerald-400' : 'text-amber-300'}`}>
                  {currentMacros.totalCals - activePlan.targetCalories > 0 ? `+${currentMacros.totalCals - activePlan.targetCalories}` : currentMacros.totalCals - activePlan.targetCalories} kcal
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsTargetsModalOpen(true)}
              className="px-2.5 py-1 text-[11px] font-bold text-teal-200 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
            >
              Adjust Targets ➔
            </button>
          </div>
        </div>

        {/* Macro Progress Bars */}
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

      {/* =========================================================================
          MEAL SLOTS BUILDER: FULLY CUSTOMIZABLE (TIMINGS, OPTIONS, CUSTOM ITEMS)
          ========================================================================= */}
      <div className="space-y-6">
        {(currentSlots || []).map((slot, sIdx) => {
          const meta = DEFAULT_SLOT_META[slot.slotType] || { 
            label: slot.slotName || slot.title || 'Custom Meal Slot', 
            defaultTime: slot.defaultTime || '10:00 AM', 
            icon: slot.customIcon || '🍽️', 
            bg: 'from-slate-500/10 to-zinc-500/10' 
          };
          const isSlotRegen = regeneratingSlot === slot.slotType;
          const isEditingTiming = editingTimeSlotType === slot.slotType;
          const displayTitle = slot.slotName || slot.title || meta.label;

          return (
            <div 
              key={slot.id || slot.slotType || sIdx}
              className="bg-white rounded-2xl border border-[#E4E9E4] overflow-hidden shadow-xs hover:border-slate-300 transition-all"
            >
              {/* -------------------------------------------------------------
                  SLOT HEADER: ICON, TITLE, EDITABLE TIMING & DOCTOR CONTROLS
                  ------------------------------------------------------------- */}
              <div className="p-4 bg-slate-50 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-2 bg-white rounded-xl shadow-2xs border border-slate-200 shrink-0">
                    {slot.customIcon || meta.icon}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-[#183153]">
                        {displayTitle}
                      </h3>

                      {/* EDITABLE MEAL TIMING */}
                      {isEditingTiming ? (
                        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-teal-300 shadow-xs">
                          <input
                            type="text"
                            value={tempTimeValue}
                            onChange={(e) => setTempTimeValue(e.target.value)}
                            placeholder="e.g. 10:00 AM"
                            className="text-xs font-mono font-bold text-[#183153] px-2 py-1 w-24 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-teal-500"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveSlotTime(slot.slotType, tempTimeValue)}
                            className="p-1 bg-teal-600 text-white rounded-lg hover:bg-teal-700 cursor-pointer"
                            title="Save Timing"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setEditingTimeSlotType(null)}
                            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                            title="Cancel"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingTimeSlotType(slot.slotType);
                            setTempTimeValue(slot.defaultTime || '08:30 AM');
                          }}
                          className="group flex items-center gap-1 text-[11px] font-mono font-bold text-slate-700 bg-white hover:bg-teal-50 hover:text-teal-900 px-2.5 py-1 rounded-lg border border-slate-200 hover:border-teal-300 transition-all cursor-pointer"
                          title="Click to edit meal timing (e.g. change to 10:00 AM)"
                        >
                          <Clock className="w-3 h-3 text-slate-400 group-hover:text-teal-600" />
                          <span>{slot.defaultTime || '08:30 AM'}</span>
                          <Edit3 className="w-2.5 h-2.5 text-slate-300 group-hover:text-teal-600 ml-0.5" />
                        </button>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {currentMode === 'choice' 
                        ? `${(slot.options || []).length} Prescribed options for patient` 
                        : 'Scheduled day plate formulation'}
                    </p>
                  </div>
                </div>

                {/* SLOT LEVEL DOCTOR CONTROLS */}
                <div className="flex items-center flex-wrap gap-2">
                  {/* AI Regenerate Slot Options */}
                  <button
                    onClick={() => handleRegenerateSlot(slot.slotType)}
                    disabled={isSlotRegen}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-[#183153] hover:bg-slate-100 text-xs font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50"
                    title="Have AI suggest alternative options for this slot"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-[#6BBF59] ${isSlotRegen ? 'animate-spin' : ''}`} />
                    <span>{isSlotRegen ? 'Regenerating...' : 'AI Suggest Slot'}</span>
                  </button>

                  {/* Add / Swap Recipe Button (Opens 2-tab Modal: AI Suggest & Add Custom Item) */}
                  <button
                    onClick={() => {
                      setSwapModalSlot(slot);
                      setSwapModalTab('ai_suggest');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-900 hover:bg-emerald-100 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Add / Swap Recipe</span>
                  </button>

                  {/* Direct Add Custom Item Shortcut */}
                  <button
                    onClick={() => {
                      setSwapModalSlot(slot);
                      setSwapModalTab('custom_item');
                      setCustomPortion('1 serving (200g)');
                      setCustomPortionGrams(200);
                      setCustomCalories(240);
                      setCustomProtein(16);
                      setCustomCarbs(28);
                      setCustomFat(6);
                      setCustomFiber(5);
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-teal-50 border border-teal-200 text-teal-800 hover:bg-teal-100 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                    title="Manually enter a custom meal/recipe"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-teal-600" />
                    <span>+ Custom Item</span>
                  </button>

                  {/* Delete Slot Button */}
                  <button
                    onClick={() => handleDeleteMealSlot(slot.slotType, displayTitle)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                    title={`Delete "${displayTitle}" slot from meal plan`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* -------------------------------------------------------------
                  MEAL OPTIONS IN SLOT (CARDS WITH FULL EDIT, DELETE & SCALING)
                  ------------------------------------------------------------- */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(slot.options || []).map((option, optIdx) => {
                  const isSelected = slot.selectedOptionId === option.id;

                  return (
                    <div 
                      key={option.id}
                      className={`relative p-4 rounded-xl border transition-all flex flex-col justify-between ${
                        isSelected 
                          ? 'border-[#6BBF59] bg-[#F8FFF8]/70 shadow-xs ring-1 ring-[#6BBF59]/30' 
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      {/* Option Header & Doctor Action Icons */}
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#183153] text-white">
                              Option {optIdx + 1}
                            </span>
                            {isSelected && (
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 flex items-center gap-1">
                                <Check className="w-2.5 h-2.5 text-emerald-600" />
                                Primary
                              </span>
                            )}
                            {option.isCustom && (
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-teal-100 text-teal-800">
                                Custom
                              </span>
                            )}
                          </div>

                          {/* Action Toolbar: View Recipe, Edit Option, Duplicate, Delete */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openRecipeModal(option)}
                              className="p-1 text-slate-400 hover:text-[#183153] hover:bg-slate-100 rounded-md cursor-pointer"
                              title="View Full Recipe & Cooking Steps"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleOpenEditOption(slot.slotType, option)}
                              className="p-1 text-slate-400 hover:text-teal-700 hover:bg-teal-50 rounded-md cursor-pointer"
                              title="Edit this meal's details, ingredients, macros or instructions"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDuplicateOption(slot.slotType, option)}
                              className="p-1 text-slate-400 hover:text-[#183153] hover:bg-slate-100 rounded-md cursor-pointer"
                              title="Duplicate as a new custom variation"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            {(slot.options || []).length > 1 && (
                              <button
                                onClick={() => handleDeleteOption(slot.slotType, option.id, option.name)}
                                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md cursor-pointer"
                                title="Remove this option"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Title & Description */}
                        <h4 className="text-sm font-bold text-[#183153] mb-1">
                          {option.name}
                        </h4>
                        <p className="text-xs text-slate-600 mb-2 leading-relaxed line-clamp-2">
                          {option.description}
                        </p>

                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium mb-3">
                          <Utensils className="w-3 h-3 text-slate-400" />
                          <span>Portion: <strong className="text-slate-800">{option.portion}</strong></span>
                        </div>

                        {/* Macro Badges */}
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
                          {option.fiber !== undefined && (
                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-900 border border-indigo-200 rounded-md">
                              Fib: {option.fiber}g
                            </span>
                          )}
                        </div>

                        {/* Clinical Benefit Highlight */}
                        {option.clinicalBenefit && (
                          <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-600 mb-3 flex items-start gap-1.5">
                            <Info className="w-3.5 h-3.5 text-[#6BBF59] shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{option.clinicalBenefit}</span>
                          </div>
                        )}
                      </div>

                      {/* Doctor Editing Toolbar & Primary Selector */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleScalePortion(slot.slotType, option.id, 0.85)}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-md text-[10px] font-bold text-slate-700 cursor-pointer"
                            title="Decrease portion & calories by 15%"
                          >
                            -15%
                          </button>
                          <button
                            onClick={() => handleScalePortion(slot.slotType, option.id, 1.15)}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-md text-[10px] font-bold text-slate-700 cursor-pointer"
                            title="Increase portion & calories by 15%"
                          >
                            +15%
                          </button>
                        </div>

                        <button
                          onClick={() => handleSetPrimaryOption(slot.slotType, option.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            isSelected 
                              ? 'bg-[#6BBF59] text-white font-bold shadow-2xs' 
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

        {/* BOTTOM ACTION: ADD CUSTOM MEAL SLOT */}
        <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl text-center space-y-2">
          <p className="text-xs text-slate-600 font-medium">
            Need a specialized eating window, pre-workout booster, or customized fasting schedule?
          </p>
          <button
            onClick={() => setIsAddSlotModalOpen(true)}
            className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-[#183153] text-xs font-bold rounded-xl shadow-xs inline-flex items-center gap-2 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4 text-teal-600" />
            <span>+ Add Custom Meal Slot to Protocol</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          MODAL 1: ADD OR SWAP RECIPE (AI SUGGEST + ADD CUSTOM ITEM)
          ========================================================================= */}
      {swapModalSlot && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-[#183153] to-[#244673] text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{swapModalSlot.customIcon || '🍽️'}</span>
                  <h3 className="text-base font-bold">
                    Add or Swap Meal: {swapModalSlot.slotName || swapModalSlot.title || swapModalSlot.slotType}
                  </h3>
                </div>
                <p className="text-xs text-slate-200 mt-0.5">
                  Scheduled for {swapModalSlot.defaultTime || '08:30 AM'} • Choose an AI-suggested recipe or enter a completely custom meal
                </p>
              </div>
              <button 
                onClick={() => setSwapModalSlot(null)} 
                className="p-1.5 rounded-xl hover:bg-white/10 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* TWO PRIMARY TABS: AI SUGGEST vs ADD CUSTOM ITEM */}
            <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center gap-2">
              <button
                onClick={() => setSwapModalTab('ai_suggest')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  swapModalTab === 'ai_suggest'
                    ? 'bg-white text-[#183153] shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>1. AI Suggest & Recipe Library</span>
              </button>

              <button
                onClick={() => setSwapModalTab('custom_item')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  swapModalTab === 'custom_item'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>2. Add Custom Item (Manual Entry)</span>
              </button>
            </div>

            {/* TAB CONTENT */}
            <div className="p-5 overflow-y-auto flex-1">
              
              {/* TAB 1: AI SUGGEST & RECIPE CATALOG */}
              {swapModalTab === 'ai_suggest' && (
                <div className="space-y-4">
                  {/* Search and Category Filter */}
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative flex-1 w-full">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search recipes by name, ingredient, or benefit..."
                        value={searchRecipeQuery}
                        onChange={(e) => setSearchRecipeQuery(e.target.value)}
                        className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
                      {['All', 'Protein', 'Thyroid', 'Digestive', 'Glycemic'].map(cat => (
                        <button
                          key={cat}
                          onClick={() => setCategoryFilter(cat)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                            categoryFilter === cat ? 'bg-[#183153] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* AI Generate New Variations Quick Button */}
                  <div className="p-3 bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 rounded-xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
                      <span className="text-xs text-teal-900 font-medium">
                        Need tailored recipes based on {patient.name}'s food preference ({patient.foodPreference})?
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        handleRegenerateSlot(swapModalSlot.slotType);
                        setSwapModalSlot(null);
                      }}
                      className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg shrink-0 cursor-pointer shadow-xs"
                    >
                      AI Synthesize 3 New Swaps
                    </button>
                  </div>

                  {/* Catalog Recipe Cards */}
                  <div className="space-y-3">
                    {filteredCatalogRecipes.map(recipe => (
                      <div 
                        key={recipe.id}
                        className="p-3.5 rounded-2xl border border-slate-200 hover:border-teal-400 bg-white hover:bg-teal-50/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                      >
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-[#183153]">{recipe.name}</h4>
                            <span className="text-[10px] px-2 py-0.5 bg-slate-100 rounded-md text-slate-700 font-semibold">{recipe.category}</span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">{recipe.clinicalBenefit}</p>
                          <div className="text-[11px] font-mono text-slate-500 flex flex-wrap gap-2 pt-0.5">
                            <strong className="text-amber-700">{recipe.calories} kcal</strong>
                            <span>P: {recipe.protein}g</span>
                            <span>C: {recipe.carbs}g</span>
                            <span>F: {recipe.fat}g</span>
                            <span>Portion: {recipe.servingSizeDescription}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => openRecipeModal(recipe)}
                            className="px-2.5 py-1.5 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium cursor-pointer"
                          >
                            View Recipe
                          </button>
                          <button
                            onClick={() => {
                              const newOption: MealOption = {
                                id: `opt-swap-${Date.now()}`,
                                slotType: swapModalSlot.slotType,
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
                                if (s.slotType === swapModalSlot.slotType) {
                                  return {
                                    ...s,
                                    options: [...(s.options || []), newOption],
                                    selectedOptionId: newOption.id
                                  };
                                }
                                return s;
                              });

                              commitSlotsUpdate(updatedSlots, `Appended recipe "${recipe.name}"`);
                              setSwapModalSlot(null);
                              setSaveSuccessMsg(`Added ${recipe.name} to meal options!`);
                              setTimeout(() => setSaveSuccessMsg(null), 3000);
                            }}
                            className="px-3 py-1.5 bg-[#183153] hover:bg-[#244673] text-white text-xs font-bold rounded-xl cursor-pointer"
                          >
                            + Select Recipe
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: ADD CUSTOM ITEM (MANUAL ENTRY) */}
              {swapModalTab === 'custom_item' && (
                <div className="space-y-4">
                  <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-bold">Full Dietitian Manual Override</strong>
                      Enter any meal or recipe based on what the patient actually has in their pantry or personal preference. No AI approval or database restrictions needed.
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Meal / Recipe Name */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Meal / Recipe Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Besan Chilla with Paneer Filling & Mint Chutney"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 font-semibold"
                        required
                      />
                    </div>

                    {/* Portion Description */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Portion / Serving Size Description *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 2 medium chillas (180g)"
                        value={customPortion}
                        onChange={(e) => setCustomPortion(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 font-medium"
                      />
                    </div>

                    {/* Portion in Grams */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Portion Weight (Grams)
                      </label>
                      <input
                        type="number"
                        placeholder="180"
                        value={customPortionGrams}
                        onChange={(e) => setCustomPortionGrams(Number(e.target.value))}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 font-medium"
                      />
                    </div>

                    {/* Calories and Macros Grid */}
                    <div className="sm:col-span-2 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                        Macronutrient & Energy Profile
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-amber-800">Calories (kcal)</label>
                          <input
                            type="number"
                            value={customCalories}
                            onChange={(e) => setCustomCalories(Number(e.target.value))}
                            className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg font-bold text-amber-900"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-emerald-800">Protein (g)</label>
                          <input
                            type="number"
                            value={customProtein}
                            onChange={(e) => setCustomProtein(Number(e.target.value))}
                            className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg font-bold text-emerald-900"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-sky-800">Carbs (g)</label>
                          <input
                            type="number"
                            value={customCarbs}
                            onChange={(e) => setCustomCarbs(Number(e.target.value))}
                            className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg font-bold text-sky-900"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-rose-800">Fat (g)</label>
                          <input
                            type="number"
                            value={customFat}
                            onChange={(e) => setCustomFat(Number(e.target.value))}
                            className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg font-bold text-rose-900"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-indigo-800">Fiber (g)</label>
                          <input
                            type="number"
                            value={customFiber}
                            onChange={(e) => setCustomFiber(Number(e.target.value))}
                            className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg font-bold text-indigo-900"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Glycemic Index & Prep Time */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Glycemic Index (GI)
                      </label>
                      <select
                        value={customGlycemicIndex}
                        onChange={(e: any) => setCustomGlycemicIndex(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-medium outline-none"
                      >
                        <option value="Low">Low Glycemic (Steadier Glucose)</option>
                        <option value="Medium">Medium Glycemic</option>
                        <option value="High">High Glycemic</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Preparation Time (Mins)
                      </label>
                      <input
                        type="number"
                        value={customPrepTimeMinutes}
                        onChange={(e) => setCustomPrepTimeMinutes(Number(e.target.value))}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-medium"
                      />
                    </div>

                    {/* Ingredients Textarea */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Ingredients (One item per line)
                      </label>
                      <textarea
                        rows={3}
                        placeholder={"Besan (gram flour): 60g\nLow-fat paneer (grated): 40g\nChopped onions & green chilies: 20g\nCold-pressed mustard oil: 1 tsp\nMint chutney: 1 tbsp"}
                        value={customIngredientsText}
                        onChange={(e) => setCustomIngredientsText(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 font-mono"
                      />
                    </div>

                    {/* Cooking / Preparation Instructions Textarea */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Preparation Steps / Cooking Instructions
                      </label>
                      <textarea
                        rows={3}
                        placeholder={"1. Mix besan with water, turmeric, ajwain and salt to form smooth batter.\n2. Spread on non-stick pan with 1 tsp oil.\n3. Sprinkle grated paneer on top, fold and cook until crisp."}
                        value={customInstructionsText}
                        onChange={(e) => setCustomInstructionsText(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    {/* Clinical Benefit / Notes for Patient */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Dietitian Notes / Clinical Benefit for Patient
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. High protein, rich in zinc and fiber. Great post-workout breakfast."
                        value={customClinicalBenefit}
                        onChange={(e) => setCustomClinicalBenefit(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 font-medium"
                      />
                    </div>

                    {/* Checkbox: Set as Primary Selection */}
                    <div className="sm:col-span-2 flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="setPrimaryChk"
                        checked={customSetAsPrimary}
                        onChange={(e) => setCustomSetAsPrimary(e.target.checked)}
                        className="w-4 h-4 rounded text-teal-600 accent-teal-600 cursor-pointer"
                      />
                      <label htmlFor="setPrimaryChk" className="text-xs font-semibold text-slate-700 cursor-pointer">
                        Set as the active primary option for this slot immediately
                      </label>
                    </div>
                  </div>

                  {/* Add Custom Item Button */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setSwapModalSlot(null)}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveCustomItem}
                      disabled={!customName.trim()}
                      className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Custom Item to Meal Plan</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: EDIT EXISTING MEAL / RECIPE OPTION
          ========================================================================= */}
      {editingOptionModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-teal-400" />
                  Edit Meal Item: {editingOptionModal.option.name}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Modify title, ingredients, calories, macros, or preparation steps directly
                </p>
              </div>
              <button 
                onClick={() => setEditingOptionModal(null)} 
                className="p-1.5 rounded-xl hover:bg-white/10 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Meal Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Meal / Recipe Name</label>
                  <input
                    type="text"
                    value={editOptionData.name || ''}
                    onChange={(e) => setEditOptionData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Portion Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Portion Description</label>
                  <input
                    type="text"
                    value={editOptionData.portion || ''}
                    onChange={(e) => setEditOptionData(prev => ({ ...prev, portion: e.target.value }))}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-medium"
                  />
                </div>

                {/* Portion Grams */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Portion Grams</label>
                  <input
                    type="number"
                    value={editOptionData.portionGrams || 200}
                    onChange={(e) => setEditOptionData(prev => ({ ...prev, portionGrams: Number(e.target.value) }))}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-medium"
                  />
                </div>

                {/* Macros Grid */}
                <div className="sm:col-span-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    Energy & Macronutrients
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-amber-800">Calories</label>
                      <input
                        type="number"
                        value={editOptionData.calories || 0}
                        onChange={(e) => setEditOptionData(prev => ({ ...prev, calories: Number(e.target.value) }))}
                        className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg font-bold text-amber-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-emerald-800">Protein (g)</label>
                      <input
                        type="number"
                        value={editOptionData.protein || 0}
                        onChange={(e) => setEditOptionData(prev => ({ ...prev, protein: Number(e.target.value) }))}
                        className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg font-bold text-emerald-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-sky-800">Carbs (g)</label>
                      <input
                        type="number"
                        value={editOptionData.carbs || 0}
                        onChange={(e) => setEditOptionData(prev => ({ ...prev, carbs: Number(e.target.value) }))}
                        className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg font-bold text-sky-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-rose-800">Fat (g)</label>
                      <input
                        type="number"
                        value={editOptionData.fat || 0}
                        onChange={(e) => setEditOptionData(prev => ({ ...prev, fat: Number(e.target.value) }))}
                        className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg font-bold text-rose-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-indigo-800">Fiber (g)</label>
                      <input
                        type="number"
                        value={editOptionData.fiber || 0}
                        onChange={(e) => setEditOptionData(prev => ({ ...prev, fiber: Number(e.target.value) }))}
                        className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg font-bold text-indigo-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Ingredients */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ingredients List (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={editIngredientsText}
                    onChange={(e) => setEditIngredientsText(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-mono"
                  />
                </div>

                {/* Instructions */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Preparation & Cooking Steps
                  </label>
                  <textarea
                    rows={3}
                    value={editInstructionsText}
                    onChange={(e) => setEditInstructionsText(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                  />
                </div>

                {/* Clinical Benefit / Notes */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Clinical Notes / Benefit for Patient
                  </label>
                  <input
                    type="text"
                    value={editOptionData.clinicalBenefit || ''}
                    onChange={(e) => setEditOptionData(prev => ({ ...prev, clinicalBenefit: e.target.value }))}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-medium"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingOptionModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEditedOption}
                  className="px-5 py-2.5 bg-[#183153] hover:bg-[#244673] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Meal Changes</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: CREATE CUSTOM MEAL SLOT (e.g. Pre-Workout, Afternoon Tea)
          ========================================================================= */}
      {isAddSlotModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-teal-800 to-emerald-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-teal-300" />
                  Add Custom Meal Slot
                </h3>
                <p className="text-xs text-teal-100 mt-0.5">
                  Configure custom eating times, workout boosters, or specialized windows
                </p>
              </div>
              <button 
                onClick={() => setIsAddSlotModalOpen(false)} 
                className="p-1.5 rounded-xl hover:bg-white/10 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Quick Template Presets */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Quick Slot Templates:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { title: 'Pre-Workout Fuel', time: '05:30 AM', icon: '⚡' },
                    { title: 'Post-Workout Shake', time: '07:30 AM', icon: '🥤' },
                    { title: 'Mid-Morning Green Tea', time: '11:00 AM', icon: '🍵' },
                    { title: 'Late Afternoon Energy', time: '04:30 PM', icon: '🥜' },
                    { title: 'Evening Protein Boost', time: '06:00 PM', icon: '🥑' },
                    { title: 'Bedtime Calming Drink', time: '10:00 PM', icon: '🌙' }
                  ].map((tpl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setNewSlotTitle(tpl.title);
                        setNewSlotTime(tpl.time);
                        setNewSlotIcon(tpl.icon);
                      }}
                      className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-teal-50 hover:text-teal-900 border border-slate-200 rounded-lg text-slate-700 font-medium transition-colors cursor-pointer"
                    >
                      {tpl.icon} {tpl.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slot Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Slot Title / Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. 5 PM Pre-Gym Protein Snack"
                  value={newSlotTitle}
                  onChange={(e) => setNewSlotTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 font-bold"
                  required
                />
              </div>

              {/* Slot Timing */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Default Meal Timing
                </label>
                <input
                  type="text"
                  placeholder="e.g. 05:00 PM"
                  value={newSlotTime}
                  onChange={(e) => setNewSlotTime(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-mono font-bold"
                />
              </div>

              {/* Icon Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Slot Icon:
                </label>
                <div className="flex flex-wrap gap-2">
                  {['🌅', '🍳', '🍏', '🥗', '🥜', '🍲', '🌙', '⚡', '🥤', '🍵', '🥑', '🥣', '🥛', '🍌'].map(ic => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setNewSlotIcon(ic)}
                      className={`text-xl p-2 rounded-xl border transition-all cursor-pointer ${
                        newSlotIcon === ic ? 'bg-teal-100 border-teal-500 scale-110 shadow-xs' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddSlotModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddNewMealSlot}
                  disabled={!newSlotTitle.trim()}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Meal Slot</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: EDIT TARGETS, MACROS & CLINICAL GUIDELINES
          ========================================================================= */}
      {isTargetsModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 bg-[#183153] text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-teal-400" />
                  Edit Target Calories, Macros & Clinical Guidelines
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Set the metabolic target thresholds and instructions for {patient.name}
                </p>
              </div>
              <button 
                onClick={() => setIsTargetsModalOpen(false)} 
                className="p-1.5 rounded-xl hover:bg-white/10 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Daily Calorie Target */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Daily Target Calories (kcal)
                </label>
                <input
                  type="number"
                  value={targetCalsInput}
                  onChange={(e) => setTargetCalsInput(Number(e.target.value))}
                  className="w-full text-sm p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-black text-[#183153]"
                />
              </div>

              {/* Target Macros Grid */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Prescribed Daily Macronutrient Split (Grams)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-emerald-800">Target Protein (g)</label>
                    <input
                      type="number"
                      value={targetProtInput}
                      onChange={(e) => setTargetProtInput(Number(e.target.value))}
                      className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg font-bold text-emerald-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-sky-800">Target Net Carbs (g)</label>
                    <input
                      type="number"
                      value={targetCarbInput}
                      onChange={(e) => setTargetCarbInput(Number(e.target.value))}
                      className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg font-bold text-sky-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-rose-800">Target Fats (g)</label>
                    <input
                      type="number"
                      value={targetFatInput}
                      onChange={(e) => setTargetFatInput(Number(e.target.value))}
                      className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg font-bold text-rose-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-indigo-800">Target Fiber (g)</label>
                    <input
                      type="number"
                      value={targetFiberInput}
                      onChange={(e) => setTargetFiberInput(Number(e.target.value))}
                      className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg font-bold text-indigo-900"
                    />
                  </div>
                </div>
              </div>

              {/* Hydration Guidelines */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Hydration & Fluid Intake Guidelines
                </label>
                <input
                  type="text"
                  value={hydrationInput}
                  onChange={(e) => setHydrationInput(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-medium"
                />
              </div>

              {/* General Instructions */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  General Patient Instructions (One per line)
                </label>
                <textarea
                  rows={3}
                  value={instructionsInput}
                  onChange={(e) => setInstructionsInput(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                />
              </div>

              {/* Clinical Rationale */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Clinical Rationale / Protocol Description
                </label>
                <textarea
                  rows={2}
                  value={rationaleInput}
                  onChange={(e) => setRationaleInput(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsTargetsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveTargetsAndGuidelines}
                  className="px-5 py-2.5 bg-[#183153] hover:bg-[#244673] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Targets & Guidelines</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
