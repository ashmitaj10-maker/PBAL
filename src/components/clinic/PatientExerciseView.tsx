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
  Target,
  Wind,
  Camera,
  Maximize2
} from 'lucide-react';
import { ExerciseDetailItem, ExercisePhotoPose, EXERCISE_GUIDE_CATALOG } from '../../data/exerciseGuideData';

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
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);

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
          ex.targetMuscles.some(m => m.toLowerCase().includes(q)) ||
          (ex.primaryMover || '').toLowerCase().includes(q)
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
              <Camera className="w-4 h-4 text-emerald-400" />
              Professional Fitness Photography & Movement Sequence Guide
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Guided Exercise & Form Reference
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Demonstrated through sequential professional fitness photography showing the exact starting posture, descent path, peak depth, and return to standing for safe and effective form.
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
              placeholder="Search by exercise name, target muscle (e.g. quads, glutes, hamstrings, core)..."
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

      {/* Main Exercises Grid with Realistic 4-Frame Photographic Sequences */}
      <div className="space-y-6">
        {(filteredExercises || []).map((exercise) => {
          const isCompleted = (dailyLog.exercisesCompleted || []).includes(exercise.id);

          return (
            <div 
              key={exercise.id}
              className={`bg-white rounded-3xl border transition-all hover:shadow-md overflow-hidden ${
                isCompleted 
                  ? 'border-emerald-400 ring-2 ring-emerald-100 bg-gradient-to-b from-emerald-50/20 to-white' 
                  : 'border-slate-200 shadow-sm'
              }`}
            >
              
              <div className="p-6 space-y-5">
                
                {/* Header: Title, Category Badge & Completion Toggle */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${
                        exercise.category === 'Strength & Tone' ? 'bg-indigo-50 text-indigo-800 border-indigo-200' :
                        exercise.category === 'Core & Posture' ? 'bg-amber-50 text-amber-900 border-amber-200' :
                        exercise.category === 'Cardio & Metabolic' ? 'bg-rose-50 text-rose-800 border-rose-200' :
                        'bg-teal-50 text-teal-800 border-teal-200'
                      }`}>
                        {exercise.category}
                      </span>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                        ⏱️ {exercise.recommendedDose.sets} Sets • {exercise.recommendedDose.repsOrDuration}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-slate-900 leading-snug">
                      {exercise.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {exercise.purpose}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                    <button
                      onClick={() => handleToggleCompleted(exercise.id)}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isCompleted
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
                      }`}
                    >
                      <CheckCircle2 className={`w-4 h-4 ${isCompleted ? 'text-white' : 'text-slate-400'}`} />
                      <span>{isCompleted ? 'Completed' : 'Mark Completed'}</span>
                    </button>
                  </div>
                </div>

                {/* 4-POSE PHOTOREALISTIC MOVEMENT SEQUENCE STRIP */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-teal-600" />
                      4-Step Movement Sequence:
                    </span>
                    <span className="text-[11px] text-teal-700 font-semibold hidden sm:inline">
                      Starting ➔ Lowering ➔ Lowest Position ➔ Return
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {exercise.photoSequence.map((pose, pIdx) => (
                      <div 
                        key={pIdx}
                        onClick={() => {
                          setActiveExerciseModal(exercise);
                          setSelectedPhotoIndex(pIdx);
                        }}
                        className="group bg-slate-50 hover:bg-teal-50/50 rounded-2xl border border-slate-200 p-2 space-y-2 transition-all cursor-pointer hover:border-teal-300 hover:shadow-xs"
                      >
                        {/* Realistic Photography Image with Step Number Overlay */}
                        <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-900/10">
                          <img
                            src={pose.imageUrl}
                            alt={pose.stepTitle}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          <div className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider">
                            Step {pose.stepNumber}
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                            <span className="text-[10px] text-white font-bold flex items-center gap-1">
                              <Maximize2 className="w-3 h-3" /> Zoom Form
                            </span>
                          </div>
                        </div>

                        {/* Step Title & Posture Cue */}
                        <div>
                          <div className="text-xs font-bold text-slate-900 truncate">
                            {pose.stepTitle}
                          </div>
                          <p className="text-[11px] text-slate-600 leading-snug line-clamp-2 mt-0.5">
                            {pose.postureCue}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Target Muscles & Form Checklist */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100 text-xs">
                  
                  {/* Prime Movers & Stabilizers */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Target Muscle Groups:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-lg font-bold border border-emerald-200">
                        🎯 {exercise.primaryMover}
                      </span>
                      {exercise.targetMuscles.map((muscle, mIdx) => (
                        <span key={mIdx} className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-medium border border-slate-200">
                          {muscle}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Breathing & Tempo Cadence */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Breathing Cadence:
                    </span>
                    <div className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-200/80 text-[11px] text-emerald-950 flex items-start gap-2">
                      <Wind className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <span>{exercise.breathingGuidance}</span>
                    </div>
                  </div>

                </div>

              </div>

              {/* Card Footer: View Full Step-by-Step Instructions */}
              <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    setActiveExerciseModal(exercise);
                    setSelectedPhotoIndex(0);
                  }}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-teal-300" />
                  View Step-by-Step Biomechanics & Full Pose Breakdown
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* =========================================================================
          DETAILED EXERCISE MODAL & INTERACTIVE PHOTOGRAPHIC FORM INSPECTOR
          ========================================================================= */}
      {activeExerciseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
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
                  {activeExerciseModal.tempoGuidance && (
                    <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                      Tempo: {activeExerciseModal.tempoGuidance}
                    </span>
                  )}
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
              
              {/* PHOTOGRAPHIC MULTI-FRAME SEQUENCE INSPECTOR */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-teal-600" />
                    Interactive Step Sequence Inspector:
                  </h3>
                  <span className="text-[10px] text-teal-700 font-bold">
                    Click any pose to view detailed form cues
                  </span>
                </div>

                {/* Active Large Display Photo */}
                {activeExerciseModal.photoSequence[selectedPhotoIndex] && (
                  <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-200 relative group">
                    <div className="aspect-16/9 w-full relative">
                      <img
                        src={activeExerciseModal.photoSequence[selectedPhotoIndex].imageUrl}
                        alt={activeExerciseModal.photoSequence[selectedPhotoIndex].stepTitle}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex flex-col justify-end p-5 text-white space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-xs font-black">
                            Step {activeExerciseModal.photoSequence[selectedPhotoIndex].stepNumber} of {activeExerciseModal.photoSequence.length}
                          </span>
                          <span className="text-sm font-bold text-white">
                            {activeExerciseModal.photoSequence[selectedPhotoIndex].stepTitle}
                          </span>
                        </div>
                        <p className="text-xs text-slate-200 font-medium">
                          💡 <strong>Form Cue:</strong> {activeExerciseModal.photoSequence[selectedPhotoIndex].postureCue}
                        </p>
                        <p className="text-[11px] text-emerald-300 font-mono">
                          ✓ {activeExerciseModal.photoSequence[selectedPhotoIndex].jointAlignment}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4 Thumbnails Selector Strip */}
                <div className="grid grid-cols-4 gap-2">
                  {activeExerciseModal.photoSequence.map((pose, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => setSelectedPhotoIndex(pIdx)}
                      className={`relative aspect-4/3 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        selectedPhotoIndex === pIdx
                          ? 'border-emerald-500 ring-2 ring-emerald-300 scale-102'
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={pose.imageUrl}
                        alt={pose.stepTitle}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 left-1 bg-slate-900/80 text-white text-[9px] px-1.5 py-0.2 rounded font-black">
                        {pIdx + 1}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Starting Position & Joint Alignment */}
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-teal-600" />
                  1. Starting Position & Joint Setup:
                </h3>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium">
                  {activeExerciseModal.startingPosition}
                </div>
              </div>

              {/* Step-by-Step Movement Instructions */}
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-teal-600" />
                  2. Step-by-Step Execution Breakdown:
                </h3>
                <div className="space-y-2">
                  {activeExerciseModal.stepByStepInstructions.map((step, sIdx) => (
                    <div key={sIdx} className="flex items-start gap-3 p-3 bg-white rounded-2xl border border-slate-200 text-xs">
                      <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-900 font-black flex items-center justify-center shrink-0 text-xs">
                        {sIdx + 1}
                      </span>
                      <p className="text-slate-700 leading-relaxed pt-0.5" dangerouslySetInnerHTML={{ __html: step }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Breathing & Cadence Guide */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1 text-xs text-emerald-950">
                <strong className="flex items-center gap-1.5 text-emerald-900 font-bold">
                  <Wind className="w-4 h-4 text-emerald-700" />
                  Breathing & Cadence Pattern:
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
