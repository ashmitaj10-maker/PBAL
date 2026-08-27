import React, { useState, useMemo } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { 
  Dumbbell, 
  Sparkles, 
  Search, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Heart, 
  ShieldCheck, 
  AlertTriangle, 
  ChevronRight, 
  Play, 
  Pause, 
  RotateCcw, 
  Filter, 
  BookOpen, 
  Activity, 
  Info, 
  Check, 
  ArrowRight,
  Layers,
  Award,
  Zap,
  Target
} from 'lucide-react';
import { ExerciseDetailItem, EXERCISE_GUIDE_CATALOG } from '../../data/exerciseGuideData';

type ExerciseCategoryFilter = 'All' | 'Strength & Tone' | 'Core & Posture' | 'Cardio & Metabolic' | 'Mobility & Joint Health';

export const PatientExerciseView: React.FC = () => {
  const { 
    selectedPatient, 
    patients, 
    getPatientExercisePlan, 
    getPatientDailyLog, 
    updatePatientDailyLog, 
    loggedInPatient,
    isPatientSession,
    navigateTo 
  } = useClinic();

  const patient = isPatientSession ? (loggedInPatient || selectedPatient || patients[0]) : (selectedPatient || patients[0]);
  const exercisePlan = patient ? getPatientExercisePlan(patient.id) : null;
  const dailyLog = patient ? getPatientDailyLog(patient.id) : {
    date: new Date().toISOString().split('T')[0],
    waterGlassesDrank: 6,
    waterGoalGlasses: 8,
    mealsStatus: {},
    exercisesCompleted: []
  };

  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategoryFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeExerciseModal, setActiveExerciseModal] = useState<ExerciseDetailItem | null>(null);

  // Active Timer state for timed exercises
  const [timerSeconds, setTimerSeconds] = useState<number>(45);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerInitial, setTimerInitial] = useState<number>(45);

  // Filter exercises
  const filteredExercises = useMemo(() => {
    return (EXERCISE_GUIDE_CATALOG || []).filter(ex => {
      if (selectedCategory !== 'All' && ex.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          ex.name.toLowerCase().includes(q) ||
          ex.purpose.toLowerCase().includes(q) ||
          ex.targetMuscles.some(m => m.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  const handleToggleCompleted = (exerciseId: string) => {
    if (!patient) return;
    const currentList = dailyLog.exercisesCompleted || [];
    const updated = currentList.includes(exerciseId)
      ? currentList.filter(id => id !== exerciseId)
      : [...currentList, exerciseId];
    
    updatePatientDailyLog(patient.id, { exercisesCompleted: updated });
  };

  // Timer Handlers
  React.useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const startTimer = (seconds: number) => {
    setTimerInitial(seconds);
    setTimerSeconds(seconds);
    setIsTimerRunning(true);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(timerInitial);
  };

  const completedCount = (dailyLog.exercisesCompleted || []).length;

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      
      {/* Top Banner: Clinical Prescribed Exercise Overview */}
      <div className="bg-gradient-to-r from-[#183153] via-teal-900 to-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 opacity-10 pointer-events-none">
          <Dumbbell className="w-64 h-64 text-white" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-300">
              <Zap className="w-4 h-4 text-emerald-400" />
              Prescribed Metabolic Movement & Exercise Guide
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Guided Exercise & Form Reference
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Detailed step-by-step biomechanics, breathing techniques, and illustrated movement diagrams tailored to optimize your insulin sensitivity and protect joint health.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 shrink-0">
            <div className="text-center px-2">
              <span className="text-[10px] uppercase font-bold text-slate-300 block">Weekly Target</span>
              <span className="text-base font-black text-white">{exercisePlan?.weeklyGoalDays || 4} Days/Wk</span>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center px-2">
              <span className="text-[10px] uppercase font-bold text-slate-300 block">Daily Steps</span>
              <span className="text-base font-black text-emerald-300">{exercisePlan?.dailyStepTarget || 8500}</span>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center px-2">
              <span className="text-[10px] uppercase font-bold text-slate-300 block">Completed Today</span>
              <span className="text-base font-black text-amber-300">{completedCount} Completed</span>
            </div>
          </div>
        </div>

        {/* Doctor's Clinical Note */}
        {exercisePlan?.doctorNotes && (
          <div className="mt-4 pt-3 border-t border-white/15 text-xs text-emerald-200 flex items-start gap-2">
            <Info className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
            <span>
              <strong>Dietitian's Note:</strong> {exercisePlan.doctorNotes}
            </span>
          </div>
        )}
      </div>

      {/* Search & Category Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by exercise name, body area (e.g. glutes, core, posture, hamstrings)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 font-medium text-slate-900 transition-all"
            />
          </div>

          <span className="text-xs text-slate-500 font-medium self-center">
            Showing {filteredExercises.length} exercise{filteredExercises.length === 1 ? '' : 's'}
          </span>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {(['All', 'Strength & Tone', 'Core & Posture', 'Cardio & Metabolic', 'Mobility & Joint Health'] as ExerciseCategoryFilter[]).map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Exercises Grid with AI Illustrated Visual Diagrams */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {(filteredExercises || []).map((exercise) => {
          const isCompleted = (dailyLog.exercisesCompleted || []).includes(exercise.id);

          return (
            <div 
              key={exercise.id}
              className={`bg-white rounded-3xl border transition-all hover:shadow-md flex flex-col justify-between overflow-hidden ${
                isCompleted 
                  ? 'border-emerald-400 ring-2 ring-emerald-100 bg-gradient-to-b from-emerald-50/20 to-white' 
                  : 'border-slate-200 shadow-sm'
              }`}
            >
              
              <div className="p-6 space-y-4">
                
                {/* Header: Category Badge & Completion Toggle */}
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${
                    exercise.category === 'Strength & Tone' ? 'bg-indigo-50 text-indigo-800 border-indigo-200' :
                    exercise.category === 'Core & Posture' ? 'bg-amber-50 text-amber-900 border-amber-200' :
                    exercise.category === 'Cardio & Metabolic' ? 'bg-rose-50 text-rose-800 border-rose-200' :
                    'bg-teal-50 text-teal-800 border-teal-200'
                  }`}>
                    {exercise.category}
                  </span>

                  <button
                    onClick={() => handleToggleCompleted(exercise.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isCompleted
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                    }`}
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 ${isCompleted ? 'text-white' : 'text-slate-400'}`} />
                    <span>{isCompleted ? 'Completed' : 'Mark Done'}</span>
                  </button>
                </div>

                {/* Exercise Title & Metabolic Purpose */}
                <div>
                  <h3 className="text-lg font-black text-slate-900 leading-snug">
                    {exercise.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {exercise.purpose}
                  </p>
                </div>

                {/* Targeted Muscles Pills */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Targeted Areas:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {exercise.targetMuscles.map((muscle, mIdx) => (
                      <span key={mIdx} className="text-xs bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-medium border border-slate-200">
                        {muscle}
                      </span>
                    ))}
                  </div>
                </div>

                {/* AI Visual Exercise Movement Diagram Card */}
                {exercise.diagramSvg && (
                  <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                        AI Biomechanical Movement Diagram
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">Start ➔ Finish Flow</span>
                    </div>

                    <div className="w-full bg-white rounded-xl p-3 border border-slate-200 flex items-center justify-center">
                      <div dangerouslySetInnerHTML={{ __html: exercise.diagramSvg }} className="w-full max-w-sm flex items-center justify-center" />
                    </div>
                  </div>
                )}

                {/* Dose & Repetitions Quick Bar */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs p-3 bg-teal-50/60 rounded-2xl border border-teal-200">
                  <div className="p-1 bg-white rounded-xl border border-teal-100">
                    <span className="text-[10px] text-slate-400 block font-semibold">Sets</span>
                    <span className="font-black text-teal-900 text-sm">{exercise.recommendedDose.sets}</span>
                  </div>
                  <div className="p-1 bg-white rounded-xl border border-teal-100">
                    <span className="text-[10px] text-slate-400 block font-semibold">Reps / Time</span>
                    <span className="font-bold text-teal-900 text-xs">{exercise.recommendedDose.repsOrDuration}</span>
                  </div>
                  <div className="p-1 bg-white rounded-xl border border-teal-100">
                    <span className="text-[10px] text-slate-400 block font-semibold">Rest</span>
                    <span className="font-bold text-slate-700 text-xs">{exercise.recommendedDose.restBetweenSets}</span>
                  </div>
                </div>

                {/* Snapshot Form & Breathing Note */}
                <div className="text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1">
                  <p className="text-[11px] text-slate-700 leading-relaxed">
                    <strong className="text-slate-900">🌬️ Breathing:</strong> {exercise.breathingGuidance}
                  </p>
                </div>

              </div>

              {/* Card Footer: View Step-by-Step Instructions */}
              <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => setActiveExerciseModal(exercise)}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-teal-300" />
                  View Full Step-by-Step Guide & Form Tips
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* =========================================================================
          DETAILED EXERCISE MODAL & GUIDED INSTRUCTION DRAWER
          ========================================================================= */}
      {activeExerciseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-gradient-to-r from-teal-50/60 to-white">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-teal-700 text-white">
                    {activeExerciseModal.category}
                  </span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                    ⏱️ {activeExerciseModal.recommendedDose.sets} Sets • {activeExerciseModal.recommendedDose.repsOrDuration}
                  </span>
                </div>
                <h2 className="text-xl font-black text-slate-900">
                  {activeExerciseModal.name}
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  {activeExerciseModal.purpose}
                </p>
              </div>

              <button
                onClick={() => setActiveExerciseModal(null)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* AI Biomechanical Diagram in Full View */}
              {activeExerciseModal.diagramSvg && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-teal-600" />
                    AI Visual Biomechanics & Movement Path
                  </span>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-center">
                    <div dangerouslySetInnerHTML={{ __html: activeExerciseModal.diagramSvg }} className="w-full max-w-md" />
                  </div>
                </div>
              )}

              {/* Starting Position & Posture Check */}
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-teal-600" />
                  1. Starting Position & Posture Setup:
                </h3>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium">
                  {activeExerciseModal.startingPosition}
                </div>
              </div>

              {/* Step-by-Step Execution Instructions */}
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-teal-600" />
                  2. Step-by-Step Movement Execution:
                </h3>
                <div className="space-y-2">
                  {activeExerciseModal.stepByStepInstructions.map((step, sIdx) => (
                    <div key={sIdx} className="flex items-start gap-3 p-3 bg-white rounded-2xl border border-slate-200 text-xs">
                      <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-900 font-black flex items-center justify-center shrink-0 text-xs">
                        {sIdx + 1}
                      </span>
                      <p className="text-slate-700 leading-relaxed pt-0.5">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Breathing & Cadence Guide */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1 text-xs text-emerald-950">
                <strong className="flex items-center gap-1.5 text-emerald-900 font-bold">
                  🌬️ Breathing & Timing Pattern:
                </strong>
                <p className="text-[11px] leading-relaxed">
                  {activeExerciseModal.breathingGuidance}
                </p>
              </div>

              {/* Common Mistakes & Safety Tips */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                
                {/* Mistakes to Avoid */}
                <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 space-y-1.5">
                  <strong className="text-rose-900 font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    Common Mistakes to Avoid:
                  </strong>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-rose-900">
                    {activeExerciseModal.commonMistakes.map((mistake, mIdx) => (
                      <li key={mIdx}>{mistake}</li>
                    ))}
                  </ul>
                </div>

                {/* Safety & Form Tips */}
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-1.5">
                  <strong className="text-amber-900 font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                    Safety & Joint Protection:
                  </strong>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-900">
                    {activeExerciseModal.safetyTips.map((tip, tIdx) => (
                      <li key={tIdx}>{tip}</li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Beginner & Advanced Modifications */}
              {activeExerciseModal.modifications && (
                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 space-y-1 text-xs text-purple-950">
                  <strong className="text-purple-900 font-bold">
                    🔄 Level Modifications & Easier Alternatives:
                  </strong>
                  <p className="text-[11px] leading-relaxed">
                    {activeExerciseModal.modifications}
                  </p>
                </div>
              )}

              {/* Integrated Rest & Hold Timer */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-300 flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    Guided Rest & Hold Timer
                  </span>
                  <span className="font-mono text-base font-black text-emerald-400">
                    {timerSeconds}s
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => startTimer(30)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 cursor-pointer"
                    >
                      30s
                    </button>
                    <button
                      onClick={() => startTimer(45)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 cursor-pointer"
                    >
                      45s
                    </button>
                    <button
                      onClick={() => startTimer(60)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 cursor-pointer"
                    >
                      60s
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer ${
                        isTimerRunning ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500 text-slate-950'
                      }`}
                    >
                      {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      {isTimerRunning ? 'Pause' : 'Start'}
                    </button>
                    <button
                      onClick={resetTimer}
                      className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  handleToggleCompleted(activeExerciseModal.id);
                  setActiveExerciseModal(null);
                }}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-2xs cursor-pointer"
              >
                <Check className="w-4 h-4" />
                {(dailyLog.exercisesCompleted || []).includes(activeExerciseModal.id)
                  ? 'Completed Today (Click to Unmark)'
                  : 'Mark Exercise Completed for Today'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
