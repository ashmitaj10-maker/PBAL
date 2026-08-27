import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { 
  Check, 
  Clock, 
  Droplets, 
  Flame, 
  Sparkles, 
  Download, 
  ChevronRight, 
  Utensils, 
  Dumbbell, 
  Heart, 
  Activity, 
  Smartphone, 
  Calendar, 
  ArrowLeft, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  HelpCircle,
  FileText,
  Award,
  Zap,
  TrendingDown,
  User,
  MessageSquare,
  Stethoscope
} from 'lucide-react';
import { calculateBmi } from '../../utils/nutritionCalculators';
import { formatDate } from '../../utils/dateUtils';
import { PatientSelector } from './PatientSelector';

export const PatientMobileHomeView: React.FC = () => {
  const { 
    selectedPatient, 
    setSelectedPatientId,
    patients, 
    users,
    navigateTo, 
    getActiveMealPlan, 
    getPatientExercisePlan, 
    getPatientWeightHistory, 
    openRecipeModal,
    updatePatientDailyLog,
    getPatientDailyLog,
    currentClinic,
    isPatientSession,
    logout
  } = useClinic();

  const patient = selectedPatient || patients[0];
  const assignedDietician = (users || []).find(u => u.id === patient?.assignedDoctorId) || users[0];
  const mealPlan = patient ? getActiveMealPlan(patient.id) : null;
  const exercisePlan = patient ? getPatientExercisePlan(patient.id) : null;
  const weightHistory = patient ? getPatientWeightHistory(patient.id) : [];
  const dailyLog = patient ? getPatientDailyLog(patient.id) : {
    date: new Date().toISOString().split('T')[0],
    waterGlassesDrank: 5,
    waterGoalGlasses: 10,
    mealsStatus: {},
    exercisesCompleted: []
  };

  const [deviceFrameMode, setDeviceFrameMode] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!patient) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-500">No patient selected.</p>
        <button onClick={() => navigateTo('patients')} className="mt-4 px-4 py-2 bg-[#183153] text-white text-xs font-semibold rounded-xl">
          Go to Directory
        </button>
      </div>
    );
  }

  const bmiData = calculateBmi(patient.currentWeightKg, patient.heightCm);
  const weightLossSoFar = Number((patient.startingWeightKg - patient.currentWeightKg).toFixed(1));

  // Water Actions
  const handleAddWater = () => {
    const nextVal = Math.min(dailyLog.waterGoalGlasses, dailyLog.waterGlassesDrank + 1);
    updatePatientDailyLog(patient.id, { waterGlassesDrank: nextVal });
  };

  const handleResetWater = () => {
    updatePatientDailyLog(patient.id, { waterGlassesDrank: 0 });
  };

  // Meal Status toggling
  const handleSetMealStatus = (slotType: string, status: 'eaten' | 'skipped' | 'swapped') => {
    updatePatientDailyLog(patient.id, {
      mealsStatus: {
        ...dailyLog.mealsStatus,
        [slotType]: status
      }
    });
  };

  // Exercise toggle
  const handleToggleExercise = (exerciseId: string) => {
    const currentList = dailyLog.exercisesCompleted || [];
    const updated = currentList.includes(exerciseId)
      ? currentList.filter(id => id !== exerciseId)
      : [...currentList, exerciseId];
    
    updatePatientDailyLog(patient.id, { exercisesCompleted: updated });
  };

  const handleDownloadPdf = () => {
    setDownloadSuccess(true);
    setTimeout(() => {
      window.print();
      setDownloadSuccess(false);
    }, 400);
  };

  const slotsToRender = mealPlan?.slots || [];
  const todayRoutine = exercisePlan?.routines[0] || null;

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      
      {/* Top Navigation & View Toggle */}
      {!isPatientSession && (
        <div className="bg-white p-4 rounded-2xl border border-[#E4E9E4] shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigateTo('patients')}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
              title="Back to Directory"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-[#183153]">
                  Patient Portal (Doctor Preview)
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#6BBF59]/15 text-[#5EAB4D]">
                  Doctor View
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Viewing as patient: <strong className="text-[#183153]">{patient.name}</strong> • Code: <strong className="font-mono text-teal-700">{patient.patientCode}</strong>
              </p>
            </div>
          </div>

          {/* Action Controls & Patient Selector */}
          <div className="flex items-center flex-wrap gap-2.5">
            <PatientSelector />

            <button
              onClick={() => setDeviceFrameMode(!deviceFrameMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                deviceFrameMode 
                  ? 'bg-[#183153] text-white border-[#183153]' 
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{deviceFrameMode ? 'Mobile Viewport' : 'Expanded View'}</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#6BBF59] hover:bg-[#5EAB4D] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Plan PDF</span>
            </button>
          </div>
        </div>
      )}

      {/* Patient Mobile Portal Container */}
      <div className={`transition-all duration-300 ${deviceFrameMode ? 'max-w-md mx-auto bg-slate-900 p-4 rounded-[40px] shadow-2xl border-4 border-slate-800' : 'w-full'}`}>
        
        {/* App Frame Header in mobile view */}
        {deviceFrameMode && (
          <div className="flex justify-between items-center px-4 py-2 text-white text-xs font-mono font-semibold mb-2">
            <span>09:41</span>
            <div className="w-20 h-4 bg-black rounded-full" />
            <span>5G 100%</span>
          </div>
        )}

        <div className={`bg-[#F8FFF8] rounded-3xl overflow-hidden border border-emerald-100 ${deviceFrameMode ? 'max-h-[780px] overflow-y-auto' : ''}`}>
          
          {/* Patient App Header Card */}
          <div className="bg-gradient-to-br from-[#183153] via-[#1F3D64] to-[#2B5488] text-white p-6 rounded-b-3xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-emerald-300 font-semibold uppercase tracking-wider">
                  Perfect Body & Life
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white mt-0.5">
                  Welcome back, {patient?.name ? patient.name.split(' ')[0] : 'Patient'}!
                </h2>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-lg font-bold text-[#6BBF59]">
                {patient?.name?.charAt(0) || 'P'}
              </div>
            </div>

            {/* Quick Metrics Bar: Weight Progress, Target, Compliance */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="bg-white/10 p-2.5 rounded-2xl backdrop-blur-xs text-center">
                <span className="text-[10px] text-slate-300 block font-medium">Current Wt</span>
                <span className="text-sm font-bold font-mono text-white">{patient.currentWeightKg} kg</span>
                <span className="text-[10px] text-emerald-300 block font-semibold">
                  {weightLossSoFar > 0 ? `-${weightLossSoFar} kg` : 'Stable'}
                </span>
              </div>

              <div className="bg-white/10 p-2.5 rounded-2xl backdrop-blur-xs text-center">
                <span className="text-[10px] text-slate-300 block font-medium">BMI</span>
                <span className="text-sm font-bold font-mono text-white">{bmiData.bmi}</span>
                <span className="text-[10px] text-emerald-300 block font-semibold">{bmiData.category}</span>
              </div>

              <div className="bg-white/10 p-2.5 rounded-2xl backdrop-blur-xs text-center">
                <span className="text-[10px] text-slate-300 block font-medium">Weekly Streak</span>
                <span className="text-sm font-bold font-mono text-amber-300">6 Days 🔥</span>
                <span className="text-[10px] text-slate-300 block">94% Compliant</span>
              </div>
            </div>
          </div>

          <div className="p-5 space-y-6">
            
            {/* Quick In-App Chat Banner with Doctor */}
            <div 
              onClick={() => navigateTo('patient_chat', { patientId: patient.id })}
              className="bg-gradient-to-r from-teal-50 via-emerald-50 to-teal-50 p-4 rounded-2xl border border-teal-200/80 shadow-xs flex items-center justify-between cursor-pointer hover:border-teal-400 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-[#183153]">
                      Direct Chat with {assignedDietician?.name || 'Your Dietitian'}
                    </h4>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {assignedDietician?.roleTitle || 'Clinical Dietitian'} • {assignedDietician?.specialization || 'Metabolic & Weight Management'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs font-bold text-teal-700 group-hover:translate-x-0.5 transition-transform">
                <span>Open Chat</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Daily Motivation & Mindset Card (Read-Only for Patient) */}
            <div className="bg-gradient-to-br from-teal-50/80 via-emerald-50/50 to-white p-5 rounded-2xl border border-teal-200/80 shadow-xs space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  Daily Motivation & Mindset
                </span>
                <span className="text-[10px] text-teal-700 font-semibold">Today's Focus</span>
              </div>
              <blockquote className="text-xs font-bold text-slate-800 italic leading-relaxed">
                "{patient.dailyMotivationMessage?.message || 'Small, consistent choices add up to meaningful change. Focus on what you can do today.'}"
              </blockquote>
              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                <span>{patient.dailyMotivationMessage?.authorName ? `Assigned by ${patient.dailyMotivationMessage.authorName}` : 'Consistency over perfection'}</span>
                <button 
                  onClick={() => navigateTo('ai_copilot')}
                  className="font-bold text-teal-700 hover:underline cursor-pointer flex items-center gap-0.5"
                >
                  View Mindset & Swaps ➔
                </button>
              </div>
            </div>

            {/* Section 1: Live Interactive Hydration Tracker */}
            <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-sky-50 rounded-xl text-sky-600">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#183153]">Daily Hydration Tracker</h3>
                    <p className="text-[11px] text-slate-500">
                      Goal: {dailyLog.waterGoalGlasses * 250} ml ({dailyLog.waterGoalGlasses} Glasses)
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleResetWater}
                  className="text-slate-400 hover:text-slate-600 p-1 text-xs"
                  title="Reset Counter"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Water Visual Bar */}
              <div>
                <div className="flex justify-between text-xs font-mono font-semibold mb-1.5">
                  <span className="text-sky-700 font-bold">{dailyLog.waterGlassesDrank * 250} ml logged</span>
                  <span className="text-slate-500">{Math.round((dailyLog.waterGlassesDrank / dailyLog.waterGoalGlasses) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
                  <div 
                    className="bg-gradient-to-r from-sky-400 to-blue-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (dailyLog.waterGlassesDrank / dailyLog.waterGoalGlasses) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Quick Tap Buttons */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="flex gap-1 overflow-x-auto">
                  {Array.from({ length: dailyLog.waterGoalGlasses }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => updatePatientDailyLog(patient.id, { waterGlassesDrank: idx + 1 })}
                      className={`w-7 h-8 rounded-lg flex items-center justify-center text-xs transition-all cursor-pointer ${
                        idx < dailyLog.waterGlassesDrank 
                          ? 'bg-sky-500 text-white font-bold shadow-2xs' 
                          : 'bg-slate-100 text-slate-400 hover:bg-sky-50'
                      }`}
                    >
                      💧
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleAddWater}
                  className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-2xs transition-all cursor-pointer shrink-0"
                >
                  +250 ml
                </button>
              </div>
            </div>

            {/* Section 2: Today's Clinical Meals (All 7 Slots with Recipe Integration) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#183153] flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-[#6BBF59]" />
                  Today's Prescribed Meals (7 Slots)
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  {mealPlan?.targetCalories || 1550} kcal Total
                </span>
              </div>

              <div className="space-y-3">
                {(slotsToRender || []).map((slot, idx) => {
                  const selectedOption = (slot.options || []).find(o => o.id === slot.selectedOptionId) || slot.options?.[0];
                  const currentStatus = dailyLog.mealsStatus?.[slot.slotType];

                  return (
                    <div 
                      key={slot.id || idx}
                      className={`p-4 rounded-2xl border transition-all ${
                        currentStatus === 'eaten'
                          ? 'bg-white border-emerald-300 shadow-xs'
                          : currentStatus === 'skipped'
                          ? 'bg-slate-50 border-slate-200 opacity-60'
                          : 'bg-white border-slate-200 shadow-2xs hover:border-emerald-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#183153]">
                              {slot.title}
                            </span>
                            <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {slot.defaultTime}
                            </span>
                          </div>
                          <h4 
                            onClick={() => selectedOption && openRecipeModal(selectedOption)}
                            className="text-sm font-bold text-[#183153] hover:text-[#6BBF59] transition-colors cursor-pointer mt-0.5 flex items-center gap-1.5"
                          >
                            {selectedOption?.name}
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                          </h4>
                        </div>

                        {/* Calories & Portion Badge */}
                        <div className="text-right">
                          <span className="text-xs font-mono font-bold text-[#183153]">
                            {selectedOption?.calories} kcal
                          </span>
                          <span className="block text-[10px] text-slate-500">
                            {selectedOption?.portion}
                          </span>
                        </div>
                      </div>

                      {/* Ingredients Preview */}
                      <p className="text-xs text-slate-600 mb-3 line-clamp-1">
                        {selectedOption?.ingredients?.join(', ')}
                      </p>

                      {/* Meal Action Status Buttons */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <button
                          onClick={() => selectedOption && openRecipeModal(selectedOption)}
                          className="text-xs font-semibold text-[#6BBF59] hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <span>View Full Recipe & Steps</span>
                        </button>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleSetMealStatus(slot.slotType, 'skipped')}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                              currentStatus === 'skipped'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            Skipped
                          </button>

                          <button
                            onClick={() => handleSetMealStatus(slot.slotType, 'eaten')}
                            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              currentStatus === 'eaten'
                                ? 'bg-[#6BBF59] text-white shadow-2xs'
                                : 'bg-slate-100 text-slate-700 hover:bg-[#6BBF59]/20'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{currentStatus === 'eaten' ? 'Completed' : 'Mark Eaten'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 3: Today's Exercise Movement Prescription */}
            {todayRoutine && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
                      <Dumbbell className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#183153]">{todayRoutine.focusTitle}</h3>
                      <p className="text-[11px] text-slate-500">
                        {(todayRoutine.exercises || []).length} Prescribed Movements • ~220 kcal
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  {(todayRoutine.exercises || []).map((ex) => {
                    const isDone = dailyLog.exercisesCompleted?.includes(ex.id);

                    return (
                      <div 
                        key={ex.id}
                        onClick={() => handleToggleExercise(ex.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          isDone 
                            ? 'bg-emerald-50/60 border-emerald-300 text-emerald-900' 
                            : 'bg-slate-50 border-slate-200 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                            isDone ? 'bg-[#6BBF59] border-[#6BBF59] text-white' : 'border-slate-300 bg-white'
                          }`}>
                            {isDone && <Check className="w-3.5 h-3.5" />}
                          </div>
                          <div>
                            <div className={`text-xs font-bold ${isDone ? 'line-through text-slate-500' : 'text-[#183153]'}`}>
                              {ex.name}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {ex.sets ? `${ex.sets} sets • ` : ''}{ex.reps || `${ex.durationMinutes} mins`}
                            </div>
                          </div>
                        </div>

                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 font-medium">
                          {ex.clinicalFocus || 'Conditioning'}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => navigateTo('patient_exercise')}
                    className="text-xs font-bold text-teal-700 hover:text-teal-900 hover:underline flex items-center gap-1.5 cursor-pointer"
                  >
                    <Dumbbell className="w-3.5 h-3.5" />
                    <span>View Form Diagrams & Step-by-Step Guides ➔</span>
                  </button>
                </div>
              </div>
            )}

            {/* Section 4: Clinical Weight Evolution Graph */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#183153] flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-[#6BBF59]" />
                  Weight Transformation History
                </h3>
                <span className="text-xs text-emerald-700 font-bold">
                  {patient.startingWeightKg} kg → {patient.currentWeightKg} kg
                </span>
              </div>

              {/* Visual weight bar tracker */}
              <div className="space-y-2 pt-1">
                {(weightHistory || []).slice(-4).map((w, idx) => (
                  <div key={w.id || idx} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="font-medium text-slate-600 font-mono">{formatDate(w.date)}</span>
                    <span className="font-mono font-bold text-[#183153]">{w.weightKg} kg</span>
                    <span className="text-[11px] text-slate-500 font-mono">BMI {w.bmi}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};
