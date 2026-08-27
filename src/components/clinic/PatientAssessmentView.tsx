import React, { useState, useEffect } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { 
  ClipboardCheck, 
  Sparkles, 
  History, 
  Clock, 
  Droplet, 
  Activity, 
  Flame, 
  HeartPulse, 
  AlertCircle, 
  Check, 
  ChevronRight, 
  ChevronDown, 
  User, 
  ArrowLeft, 
  Plus, 
  X, 
  Save, 
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { PatientAssessment, FoodPreference } from '../../types/clinic';
import { generateClinicalMealPlan } from '../../services/aiMealService';

export const PatientAssessmentView: React.FC = () => {
  const { 
    selectedPatient, 
    setSelectedPatientId,
    patients, 
    navigateTo, 
    getPatientAssessments, 
    saveAssessment, 
    currentUser, 
    currentClinic,
    saveMealPlan
  } = useClinic();

  const patient = selectedPatient || patients[0];
  const assessments = patient ? getPatientAssessments(patient.id) : [];
  
  const [selectedVersion, setSelectedVersion] = useState<number>(assessments[0]?.version || 1);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync version when patient changes
  useEffect(() => {
    if (patient) {
      const pAssessments = getPatientAssessments(patient.id);
      if (pAssessments.length > 0) {
        setSelectedVersion(pAssessments[0].version);
      } else {
        setSelectedVersion(1);
      }
    }
  }, [patient?.id]);

  // Form State
  const currentAssessment = assessments.find(a => a.version === selectedVersion) || assessments[0];

  const [wakeTime, setWakeTime] = useState('06:30');
  const [sleepTime, setSleepTime] = useState('22:30');
  const [dailyWaterLiters, setDailyWaterLiters] = useState(2.5);
  const [exerciseFrequency, setExerciseFrequency] = useState<PatientAssessment['exerciseFrequency']>('Moderate (3-4 days/wk)');
  const [exerciseTypes, setExerciseTypes] = useState<string[]>(['Brisk Walking', 'Strength Training']);
  const [stressLevel, setStressLevel] = useState<'low' | 'moderate' | 'high' | 'severe'>('moderate');
  const [digestiveIssues, setDigestiveIssues] = useState<string[]>(['Occasional Bloating']);
  const [favoriteFoods, setFavoriteFoods] = useState<string[]>(['Oats', 'Paneer', 'Greek Yogurt', 'Berries']);
  const [dislikedFoods, setDislikedFoods] = useState<string[]>(['Bitter Gourd', 'Excess Raw Onion']);
  const [medicalHistory, setMedicalHistory] = useState<string[]>([]);
  const [foodPreference, setFoodPreference] = useState<FoodPreference>('Vegetarian');
  const [targetCalories, setTargetCalories] = useState(1550);
  const [targetProteinGrams, setTargetProteinGrams] = useState(90);
  const [targetCarbsGrams, setTargetCarbsGrams] = useState(145);
  const [targetFatGrams, setTargetFatGrams] = useState(45);
  const [targetFiberGrams, setTargetFiberGrams] = useState(35);
  const [clinicalNotes, setClinicalNotes] = useState('');

  // Input helpers
  const [newExerciseInput, setNewExerciseInput] = useState('');
  const [newDigestiveInput, setNewDigestiveInput] = useState('');
  const [newFavInput, setNewFavInput] = useState('');
  const [newDislikeInput, setNewDislikeInput] = useState('');
  const [newMedInput, setNewMedInput] = useState('');

  // Sync when patient or version changes
  useEffect(() => {
    if (currentAssessment) {
      setWakeTime(currentAssessment.wakeTime || '06:30');
      setSleepTime(currentAssessment.sleepTime || '22:30');
      setDailyWaterLiters(currentAssessment.dailyWaterLiters || 2.5);
      setExerciseFrequency(currentAssessment.exerciseFrequency || 'Moderate (3-4 days/wk)');
      setExerciseTypes(currentAssessment.exerciseTypes || ['Walking']);
      setStressLevel(currentAssessment.stressLevel || 'moderate');
      setDigestiveIssues(currentAssessment.digestiveIssues || []);
      setFavoriteFoods(currentAssessment.favoriteFoods || []);
      setDislikedFoods(currentAssessment.dislikedFoods || []);
      setMedicalHistory(currentAssessment.medicalHistory || patient?.medicalConditions || []);
      setFoodPreference(currentAssessment.foodPreference || patient?.foodPreference || 'Vegetarian');
      setTargetCalories(currentAssessment.targetCalories || 1550);
      setTargetProteinGrams(currentAssessment.targetProteinGrams || 90);
      setTargetCarbsGrams(currentAssessment.targetCarbsGrams || 145);
      setTargetFatGrams(currentAssessment.targetFatGrams || 45);
      setTargetFiberGrams(currentAssessment.targetFiberGrams || 35);
      setClinicalNotes(currentAssessment.clinicalNotes || '');
    } else if (patient) {
      setMedicalHistory(patient.medicalConditions || []);
      setFoodPreference(patient.foodPreference || 'Vegetarian');
      setDislikedFoods(patient.allergies || []);
    }
  }, [selectedVersion, patient?.id, currentAssessment]);

  if (!patient) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-500">No patient selected. Please choose a patient from directory.</p>
        <button onClick={() => navigateTo('patients')} className="mt-4 px-4 py-2 bg-[#183153] text-white text-xs font-semibold rounded-xl">
          Go to Patient Directory
        </button>
      </div>
    );
  }

  const handleSaveAsNewVersion = () => {
    const nextVersion = assessments.length > 0 ? Math.max(...assessments.map(a => a.version)) + 1 : 1;
    const newAsmt: PatientAssessment = {
      id: `asmt-${Date.now()}`,
      patientId: patient.id,
      version: nextVersion,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      doctorId: currentUser?.id || 'usr-1',
      doctorName: currentUser?.name || 'Dr. Ashmita Joshi, MD, RD',
      wakeTime,
      sleepTime,
      dailyWaterLiters,
      exerciseFrequency,
      exerciseTypes,
      stressLevel,
      digestiveIssues,
      favoriteFoods,
      dislikedFoods,
      medicalHistory,
      foodPreference,
      targetCalories,
      targetProteinGrams,
      targetCarbsGrams,
      targetFatGrams,
      targetFiberGrams,
      clinicalNotes
    };

    saveAssessment(newAsmt);
    setSelectedVersion(nextVersion);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleUpdateCurrentVersion = () => {
    if (!currentAssessment) {
      handleSaveAsNewVersion();
      return;
    }
    const updated: PatientAssessment = {
      ...currentAssessment,
      wakeTime,
      sleepTime,
      dailyWaterLiters,
      exerciseFrequency,
      exerciseTypes,
      stressLevel,
      digestiveIssues,
      favoriteFoods,
      dislikedFoods,
      medicalHistory,
      foodPreference,
      targetCalories,
      targetProteinGrams,
      targetCarbsGrams,
      targetFatGrams,
      targetFiberGrams,
      clinicalNotes,
      updatedAt: new Date().toISOString()
    };
    saveAssessment(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleGenerateMealPlanFromAssessment = async () => {
    setIsGeneratingPlan(true);
    try {
      const activeAsmt: PatientAssessment = {
        id: currentAssessment?.id || `asmt-${Date.now()}`,
        patientId: patient.id,
        version: selectedVersion,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        doctorId: currentUser?.id || 'usr-1',
        doctorName: currentUser?.name || 'Dr. Ashmita Joshi',
        wakeTime,
        sleepTime,
        dailyWaterLiters,
        exerciseFrequency,
        exerciseTypes,
        stressLevel,
        digestiveIssues,
        favoriteFoods,
        dislikedFoods,
        medicalHistory,
        foodPreference,
        targetCalories,
        targetProteinGrams,
        targetCarbsGrams,
        targetFatGrams,
        targetFiberGrams,
        clinicalNotes
      };

      const generatedPlan = await generateClinicalMealPlan({
        patientId: patient.id,
        patientName: patient.name,
        clinicId: currentClinic?.id || 'clinic-1',
        assessment: activeAsmt,
        mode: 'choice',
        targetCalories
      });

      saveMealPlan(generatedPlan);
      navigateTo('ai_meal_builder', { patientId: patient.id, planId: generatedPlan.id });
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header & Patient Context Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E4E9E4] shadow-xs">
        <div className="flex items-center gap-3.5">
          <button 
            onClick={() => navigateTo('patient_profile', { patientId: patient.id })}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
            title="Back to Patient Dossier"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-[#183153]">
                Clinical Assessment Intake
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#6BBF59]/15 text-[#5EAB4D]">
                Version {selectedVersion}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Patient: <strong className="text-[#183153]">{patient.name}</strong> ({patient.patientCode}) • Age: {patient.age}y • Baseline: {patient.currentWeightKg} kg
            </p>
          </div>
        </div>

        {/* Patient Switcher, Version Selector & AI Generator Action */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Patient Selector */}
          <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-xs">
            <User className="w-4 h-4 text-teal-600 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[9px] uppercase font-bold text-slate-400 leading-none">Select Patient</span>
              <select
                value={patient?.id || ''}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="bg-transparent text-xs sm:text-sm font-bold text-slate-800 focus:outline-none cursor-pointer pr-1"
              >
                {(patients || []).map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.patientCode})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Version Selector */}
          <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200 text-xs">
            <History className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
            <span className="text-slate-500 font-medium hidden sm:inline">Versions:</span>
            {(assessments || []).map(a => (
              <button
                key={a.id}
                onClick={() => setSelectedVersion(a.version)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  selectedVersion === a.version 
                    ? 'bg-[#183153] text-white shadow-xs' 
                    : 'text-slate-600 hover:bg-white'
                }`}
              >
                v{a.version}
              </button>
            ))}
          </div>

          <button
            onClick={handleGenerateMealPlanFromAssessment}
            disabled={isGeneratingPlan}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#183153] to-[#244673] text-white hover:opacity-95 shadow-xs hover:shadow transition-all cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#6BBF59]" />
            <span>{isGeneratingPlan ? 'Generating AI Plan...' : 'Generate AI Meal Plan'}</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Assessment saved successfully to patient clinical history!</span>
        </div>
      )}

      {/* Main Assessment Grid Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1: Circadian & Lifestyle Rhythms */}
        <div className="space-y-6">
          
          {/* Circadian Timings */}
          <div className="bg-white p-5 rounded-2xl border border-[#E4E9E4] shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#183153] pb-2 border-b border-slate-100">
              <Clock className="w-4 h-4 text-[#6BBF59]" />
              Circadian & Hydration Rhythms
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Wake Up Time
                </label>
                <input
                  type="time"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#6BBF59]/30 focus:border-[#6BBF59] font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Target Bedtime
                </label>
                <input
                  type="time"
                  value={sleepTime}
                  onChange={(e) => setSleepTime(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#6BBF59]/30 focus:border-[#6BBF59] font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1">
                <span>Daily Water Intake Target</span>
                <span className="text-[#183153] font-bold font-mono">{dailyWaterLiters} Liters/day</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.1"
                value={dailyWaterLiters}
                onChange={(e) => setDailyWaterLiters(parseFloat(e.target.value))}
                className="w-full accent-[#6BBF59] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>1.0 L (Minimum)</span>
                <span>2.5 L (Standard)</span>
                <span>5.0 L (High Hydration)</span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                Stress Level & Adrenal Load
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['low', 'moderate', 'high', 'severe'] as const).map(lvl => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setStressLevel(lvl)}
                    className={`py-1.5 px-2 text-center text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                      stressLevel === lvl
                        ? 'bg-[#183153] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Exercise & Physical Activity */}
          <div className="bg-white p-5 rounded-2xl border border-[#E4E9E4] shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#183153] pb-2 border-b border-slate-100">
              <Activity className="w-4 h-4 text-[#6BBF59]" />
              Exercise & Activity Capacity
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                Workout Frequency
              </label>
              <select
                value={exerciseFrequency}
                onChange={(e) => setExerciseFrequency(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#6BBF59]/30 focus:border-[#6BBF59]"
              >
                <option value="Sedentary">Sedentary (Desk Job, under 3000 steps)</option>
                <option value="Light (1-2 days/wk)">Light (1-2 days/wk, 5000 steps)</option>
                <option value="Moderate (3-4 days/wk)">Moderate (3-4 days/wk, 8000 steps)</option>
                <option value="Active (5+ days/wk)">Active (5+ days/wk resistance/cardio)</option>
                <option value="Athlete / Intense">Athlete / Competitive Heavy Training</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                Active Workout Modalities
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {(exerciseTypes || []).map((type, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-[#F8FFF8] border border-emerald-200 text-[#183153] rounded-lg">
                    {type}
                    <button 
                      type="button" 
                      onClick={() => setExerciseTypes((exerciseTypes || []).filter((_, i) => i !== idx))}
                      className="hover:text-rose-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="e.g. Pilates, Brisk Walking, HIIT"
                  value={newExerciseInput}
                  onChange={(e) => setNewExerciseInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newExerciseInput.trim()) {
                      e.preventDefault();
                      setExerciseTypes([...exerciseTypes, newExerciseInput.trim()]);
                      setNewExerciseInput('');
                    }
                  }}
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#6BBF59]"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newExerciseInput.trim()) {
                      setExerciseTypes([...exerciseTypes, newExerciseInput.trim()]);
                      setNewExerciseInput('');
                    }
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-xs font-semibold rounded-xl text-slate-700"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Clinical Gut & Food Biometrics */}
        <div className="space-y-6">
          
          {/* Digestive & Gut Health */}
          <div className="bg-white p-5 rounded-2xl border border-[#E4E9E4] shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#183153] pb-2 border-b border-slate-100">
              <HeartPulse className="w-4 h-4 text-rose-500" />
              Digestive & Gastrointestinal Flags
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                Reported Digestive Symptoms
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {(digestiveIssues || []).length === 0 ? (
                  <span className="text-xs text-slate-400 italic">No acute GI issues recorded.</span>
                ) : (
                  (digestiveIssues || []).map((issue, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-rose-50 border border-rose-200 text-rose-800 rounded-lg">
                      {issue}
                      <button 
                        type="button" 
                        onClick={() => setDigestiveIssues((digestiveIssues || []).filter((_, i) => i !== idx))}
                        className="hover:text-rose-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="e.g. Post-dinner acidity, IBS, Gas"
                  value={newDigestiveInput}
                  onChange={(e) => setNewDigestiveInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newDigestiveInput.trim()) {
                      e.preventDefault();
                      setDigestiveIssues([...(digestiveIssues || []), newDigestiveInput.trim()]);
                      setNewDigestiveInput('');
                    }
                  }}
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#6BBF59]"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newDigestiveInput.trim()) {
                      setDigestiveIssues([...(digestiveIssues || []), newDigestiveInput.trim()]);
                      setNewDigestiveInput('');
                    }
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-xs font-semibold rounded-xl text-slate-700"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Medical History */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                Medical Conditions & Clinical Diagnoses
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {(medicalHistory || []).map((med, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-amber-50 border border-amber-200 text-amber-900 rounded-lg font-medium">
                    {med}
                    <button 
                      type="button" 
                      onClick={() => setMedicalHistory((medicalHistory || []).filter((_, i) => i !== idx))}
                      className="hover:text-amber-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="e.g. Pre-diabetes HbA1c 6.2%, PCOS"
                  value={newMedInput}
                  onChange={(e) => setNewMedInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newMedInput.trim()) {
                      e.preventDefault();
                      setMedicalHistory([...(medicalHistory || []), newMedInput.trim()]);
                      setNewMedInput('');
                    }
                  }}
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#6BBF59]"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newMedInput.trim()) {
                      setMedicalHistory([...(medicalHistory || []), newMedInput.trim()]);
                      setNewMedInput('');
                    }
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-xs font-semibold rounded-xl text-slate-700"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Food Preferences & Dislikes */}
          <div className="bg-white p-5 rounded-2xl border border-[#E4E9E4] shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#183153] pb-2 border-b border-slate-100">
              <Flame className="w-4 h-4 text-amber-500" />
              Dietary Preference & Ingredient Exclusions
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                Dietary Archetype
              </label>
              <select
                value={foodPreference}
                onChange={(e) => setFoodPreference(e.target.value as FoodPreference)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#6BBF59]/30 focus:border-[#6BBF59] font-medium"
              >
                <option value="Vegetarian">Vegetarian (Dairy, Grains, Legumes)</option>
                <option value="Eggetarian">Eggetarian (Vegetarian + Eggs)</option>
                <option value="Non-Vegetarian">Non-Vegetarian (Poultry, Fish, Eggs)</option>
                <option value="Vegan">Vegan (100% Plant-Based)</option>
                <option value="Jain">Jain (No Root Veg, Strict Vegetarian)</option>
                <option value="Keto">Keto / Very Low Carb High Fat</option>
                <option value="Pescatarian">Pescatarian (Fish & Seafood)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Favorite / High-Compliance Foods
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {(favoriteFoods || []).map((f, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg">
                    {f}
                    <button type="button" onClick={() => setFavoriteFoods((favoriteFoods || []).filter((_, i) => i !== idx))}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="e.g. Avocado, Greek Yogurt, Oats"
                  value={newFavInput}
                  onChange={(e) => setNewFavInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newFavInput.trim()) {
                      e.preventDefault();
                      setFavoriteFoods([...(favoriteFoods || []), newFavInput.trim()]);
                      setNewFavInput('');
                    }
                  }}
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newFavInput.trim()) {
                      setFavoriteFoods([...(favoriteFoods || []), newFavInput.trim()]);
                      setNewFavInput('');
                    }
                  }}
                  className="px-3 py-1.5 bg-slate-100 text-xs font-semibold rounded-xl"
                >
                  Add
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Strict Dislikes & Allergens
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {(dislikedFoods || []).map((d, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-rose-50 border border-rose-200 text-rose-800 rounded-lg">
                    {d}
                    <button type="button" onClick={() => setDislikedFoods((dislikedFoods || []).filter((_, i) => i !== idx))}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="e.g. Bitter gourd, Eggplant, Dairy"
                  value={newDislikeInput}
                  onChange={(e) => setNewDislikeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newDislikeInput.trim()) {
                      e.preventDefault();
                      setDislikedFoods([...dislikedFoods, newDislikeInput.trim()]);
                      setNewDislikeInput('');
                    }
                  }}
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newDislikeInput.trim()) {
                      setDislikedFoods([...dislikedFoods, newDislikeInput.trim()]);
                      setNewDislikeInput('');
                    }
                  }}
                  className="px-3 py-1.5 bg-slate-100 text-xs font-semibold rounded-xl"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Clinical Macro Prescriptions & Actions */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-[#E4E9E4] shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#183153] pb-2 border-b border-slate-100">
              <ClipboardCheck className="w-4 h-4 text-[#6BBF59]" />
              Prescribed Metabolic Targets
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Daily Caloric Ceiling</span>
                <span className="text-base font-mono font-bold text-[#183153]">{targetCalories} kcal</span>
              </div>
              <input
                type="number"
                value={targetCalories}
                onChange={(e) => setTargetCalories(parseInt(e.target.value) || 1500)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-semibold"
              />
            </div>

            {/* Macro Sliders */}
            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                  <span>Protein Target</span>
                  <span className="text-emerald-700 font-bold">{targetProteinGrams}g (~{targetProteinGrams * 4} kcal)</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="220"
                  value={targetProteinGrams}
                  onChange={(e) => setTargetProteinGrams(parseInt(e.target.value))}
                  className="w-full accent-[#6BBF59]"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                  <span>Net Carbs Target</span>
                  <span className="text-sky-700 font-bold">{targetCarbsGrams}g (~{targetCarbsGrams * 4} kcal)</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="350"
                  value={targetCarbsGrams}
                  onChange={(e) => setTargetCarbsGrams(parseInt(e.target.value))}
                  className="w-full accent-sky-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                  <span>Healthy Fats Target</span>
                  <span className="text-amber-700 font-bold">{targetFatGrams}g (~{targetFatGrams * 9} kcal)</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="120"
                  value={targetFatGrams}
                  onChange={(e) => setTargetFatGrams(parseInt(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                  <span>Dietary Fiber Goal</span>
                  <span className="text-indigo-700 font-bold">{targetFiberGrams}g</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="60"
                  value={targetFiberGrams}
                  onChange={(e) => setTargetFiberGrams(parseInt(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>
            </div>

            {/* Doctor Clinical Notes */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Dietitian / Clinical Notes
              </label>
              <textarea
                rows={3}
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                placeholder="Specific biochemical objectives, e.g. lower fasting glucose, optimize thyroid conversion, increase mitochondrial density..."
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#6BBF59]/30 focus:border-[#6BBF59]"
              />
            </div>

            {/* Save Buttons */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleUpdateCurrentVersion}
                className="w-full py-2.5 px-4 bg-[#183153] text-white font-semibold text-xs rounded-xl hover:bg-[#244673] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Save className="w-4 h-4 text-[#6BBF59]" />
                <span>Save Changes to v{selectedVersion}</span>
              </button>

              <button
                type="button"
                onClick={handleSaveAsNewVersion}
                className="w-full py-2 px-4 bg-emerald-50 text-[#183153] border border-emerald-200 font-semibold text-xs rounded-xl hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#6BBF59]" />
                <span>Save as New Version (v{(assessments[0]?.version || 1) + 1})</span>
              </button>
            </div>
          </div>

          {/* Assessment Version Dossier History */}
          <div className="bg-[#F8FFF8] p-4 rounded-2xl border border-emerald-200/80 text-xs text-slate-600 space-y-2">
            <div className="font-bold text-[#183153] flex items-center gap-1.5">
              <History className="w-4 h-4 text-[#6BBF59]" />
              Assessment Version History
            </div>
            <div className="space-y-1.5">
              {(assessments || []).map(a => (
                <div 
                  key={a.id}
                  onClick={() => setSelectedVersion(a.version)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedVersion === a.version 
                      ? 'bg-white border-[#6BBF59] shadow-xs' 
                      : 'bg-white/60 border-slate-200 hover:bg-white'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-[#183153]">
                      Version {a.version} • {new Date(a.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {a.targetCalories} kcal • {a.foodPreference}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
