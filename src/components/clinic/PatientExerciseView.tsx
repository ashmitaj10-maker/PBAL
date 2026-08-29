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
  Maximize2,
  Stethoscope,
  FileText,
  Footprints
} from 'lucide-react';
import { ExerciseDetailItem, ExercisePhotoPose, EXERCISE_GUIDE_CATALOG } from '../../data/exerciseGuideData';

type ExerciseCategoryFilter = 'All' | 'Strength & Tone' | 'Core & Posture' | 'Cardio & Metabolic' | 'Mobility & Joint Health' | 'Rehab / Low-Impact' | 'Sports & Lifestyle';

export const PatientExerciseView: React.FC = () => {
  const { 
    selectedPatient, 
    patients, 
    getPatientExercisePlan, 
    getPatientDailyLog, 
    updatePatientDailyLog, 
    getPatientAssignedExercises,
    loggedInPatient,
    isPatientSession,
    navigateTo 
  } = useClinic();

  const patient = isPatientSession ? (loggedInPatient || selectedPatient || patients[0]) : (selectedPatient || patients[0]);
  const exercisePlan = patient ? getPatientExercisePlan(patient.id) : null;
  const assignedItems = patient ? getPatientAssignedExercises(patient.id) : [];

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
  const [selectedStepIndex, setSelectedStepIndex] = useState<number>(0);

  // Active Timer state for timed exercises
  const [timerSeconds, setTimerSeconds] = useState<number>(45);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerInitial, setTimerInitial] = useState<number>(45);

  // Combine doctor-assigned exercises with catalog rich guides
  const displayExercises: ExerciseDetailItem[] = useMemo(() => {
    if (assignedItems.length > 0) {
      return assignedItems.map(assigned => {
        const catalogMatch = EXERCISE_GUIDE_CATALOG.find(
          c => c.name.toLowerCase() === assigned.name.toLowerCase() || c.id === assigned.guideId
        );

        return {
          id: assigned.id,
          name: assigned.name,
          category: (assigned.category || catalogMatch?.category || 'Strength & Tone') as any,
          purpose: assigned.purpose || assigned.description || catalogMatch?.purpose || 'Prescribed clinical movement for metabolic conditioning.',
          targetMuscles: assigned.targetMuscles || catalogMatch?.targetMuscles || ['Target Muscle Group', 'Core'],
          primaryMover: assigned.primaryMover || catalogMatch?.primaryMover || (assigned.targetMuscles?.[0] || 'Target Musculature'),
          secondaryStabilizers: assigned.secondaryStabilizers || catalogMatch?.secondaryStabilizers || ['Core Stabilizers'],
          startingPosition: catalogMatch?.startingPosition || 'Adopt a balanced, upright starting stance with relaxed shoulders and active core.',
          correctForm: catalogMatch?.correctForm || (assigned.howToPerform || 'Maintain controlled cadence and proper joint alignment throughout.'),
          stepByStepInstructions: assigned.instructions?.length 
            ? assigned.instructions 
            : (catalogMatch?.stepByStepInstructions || [assigned.howToPerform || 'Execute the movement with controlled breathing and strict posture.']),
          breathingGuidance: catalogMatch?.breathingGuidance || 'Maintain relaxed, rhythmic nasal breathing: Inhale on preparation/descent, exhale on drive.',
          tempoGuidance: assigned.tempoGuidance || catalogMatch?.tempoGuidance || 'Controlled steady cadence.',
          compositeImageUrl: assigned.compositeImageUrl || catalogMatch?.compositeImageUrl || '',
          photoSequence: catalogMatch?.photoSequence || [],
          recommendedDose: {
            sets: assigned.sets || catalogMatch?.recommendedDose.sets || 1,
            repsOrDuration: assigned.reps || (assigned.durationMinutes ? `${assigned.durationMinutes} mins` : catalogMatch?.recommendedDose.repsOrDuration || '12-15 reps'),
            restBetweenSets: assigned.restSeconds || catalogMatch?.recommendedDose.restBetweenSets || '60 seconds'
          },
          restAndRecovery: catalogMatch?.restAndRecovery || 'Rest as prescribed between sets. Hydrate with electrolyte water.',
          commonMistakes: catalogMatch?.commonMistakes || [
            'Rushing through repetitions without controlled tempo',
            'Compromising spine alignment or joint posture'
          ],
          safetyTips: assigned.doctorNotes 
            ? [`Doctor's Instruction: ${assigned.doctorNotes}`, ...(catalogMatch?.safetyTips || [])]
            : (catalogMatch?.safetyTips || ['Stop immediately if you experience sharp pain.']),
          modifications: assigned.frequencyDays?.length 
            ? `Assigned Days: ${assigned.frequencyDays.join(', ')} • Intensity: ${assigned.intensity || 'Moderate'}`
            : (catalogMatch?.modifications || `Scheduled for ${patient?.name || 'patient'}`)
        };
      });
    }
    // Fallback to core exercise library
    return EXERCISE_GUIDE_CATALOG;
  }, [assignedItems]);

  // Filter exercises by category and search
  const filteredExercises = useMemo(() => {
    return (displayExercises || []).filter(ex => {
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
  }, [displayExercises, selectedCategory, searchQuery]);

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
    <div className="space-y-4 sm:space-y-6 pb-20 animate-in fade-in duration-200 max-w-full overflow-hidden">
      
      {/* Top Banner: Clinical Prescribed Exercise Overview */}
      <div className="bg-gradient-to-r from-[#183153] via-teal-900 to-emerald-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 opacity-10 pointer-events-none">
          <Dumbbell className="w-64 h-64 text-white" />
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 relative z-10 min-w-0">
          <div className="space-y-1.5 sm:space-y-2 max-w-2xl min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-black uppercase tracking-wider text-emerald-300 flex-wrap">
              <Stethoscope className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
              <span>Doctor Prescribed Movement & Form Guide</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white break-words">
              My Prescribed Exercise Plan
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed break-words">
              Personalized physical activities and exercises prescribed by your clinical dietitian with movement demonstrations, execution instructions, and custom advice.
            </p>
          </div>

          {/* Quick Stats Pill (Responsive 3-Column Grid without clipping) */}
          <div className="grid grid-cols-3 gap-1 sm:gap-2 bg-white/10 backdrop-blur-md p-2.5 sm:p-3.5 rounded-2xl border border-white/20 w-full lg:w-auto lg:shrink-0">
            <div className="text-center px-1 sm:px-2 min-w-0">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-300 block truncate">Prescribed</span>
              <span className="text-xs sm:text-base font-black text-white block truncate">{displayExercises.length} Movements</span>
            </div>
            <div className="text-center px-1 sm:px-2 border-x border-white/20 min-w-0">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-300 block truncate">Weekly Target</span>
              <span className="text-xs sm:text-base font-black text-emerald-300 block truncate">{exercisePlan?.weeklyGoalDays || 4} Days/Wk</span>
            </div>
            <div className="text-center px-1 sm:px-2 min-w-0">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-300 block truncate">Completed Today</span>
              <span className="text-xs sm:text-base font-black text-amber-300 block truncate">{completedCount} Done</span>
            </div>
          </div>
        </div>

        {/* Doctor's Clinical Note (Full Text Wrapping without clipping) */}
        {exercisePlan?.doctorNotes && (
          <div className="mt-3.5 sm:mt-4 pt-3 border-t border-white/15 text-xs text-emerald-200 flex items-start gap-2 min-w-0">
            <Info className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
            <span className="min-w-0 flex-1 break-words leading-relaxed">
              <strong className="text-white font-bold">Dietitian's Note:</strong> {exercisePlan.doctorNotes}
            </span>
          </div>
        )}
      </div>

      {/* Search & Category Filter Bar */}
      <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200 shadow-sm space-y-3 min-w-0">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 min-w-0">
          
          {/* Search Box */}
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search your prescribed exercises (e.g. walking, squats, glutes, core, yoga)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs sm:text-sm pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 font-medium text-slate-900 transition-all outline-none"
            />
          </div>

          <span className="text-xs text-slate-500 font-medium self-start sm:self-center shrink-0">
            Showing {filteredExercises.length} prescribed exercise{filteredExercises.length === 1 ? '' : 's'}
          </span>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 no-scrollbar min-w-0">
          {(['All', 'Strength & Tone', 'Core & Posture', 'Cardio & Metabolic', 'Mobility & Joint Health'] as ExerciseCategoryFilter[]).map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
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

      {/* Prescribed Exercises Grid */}
      <div className="space-y-6 sm:space-y-8 min-w-0">
        {(filteredExercises || []).map((exercise) => {
          const isCompleted = (dailyLog.exercisesCompleted || []).includes(exercise.id);

          return (
            <div 
              key={exercise.id}
              className={`bg-white rounded-2xl sm:rounded-3xl border transition-all hover:shadow-md overflow-hidden min-w-0 ${
                isCompleted 
                  ? 'border-emerald-400 ring-2 ring-emerald-100 bg-gradient-to-b from-emerald-50/20 to-white' 
                  : 'border-slate-200 shadow-sm'
              }`}
            >
              
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 min-w-0">
                
                {/* Header: Title, Category Badge & Completion Toggle */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg border bg-teal-50 text-teal-800 border-teal-200">
                        {exercise.category}
                      </span>
                      <span className="text-[11px] sm:text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                        ⏱️ Prescribed: {exercise.recommendedDose.sets} {exercise.recommendedDose.sets === 1 ? 'Set' : 'Sets'} • {exercise.recommendedDose.repsOrDuration}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug break-words">
                      {exercise.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed break-words">
                      {exercise.purpose}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-stretch sm:self-center shrink-0">
                    <button
                      onClick={() => handleToggleCompleted(exercise.id)}
                      className={`w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2 sm:py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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

                {/* 4-POSE MOVEMENT DEMONSTRATION GRAPHIC OR WRITTEN ACTIVITY BANNER */}
                {exercise.compositeImageUrl ? (
                  <div className="space-y-2.5 sm:space-y-3 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                      <span className="text-xs font-black uppercase tracking-wider text-teal-900 flex items-center gap-1.5 break-words">
                        <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
                        <span>4-Pose Movement Demonstration:</span>
                      </span>
                      <span className="text-[10px] text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200 self-start sm:self-auto">
                        Start ➔ Movement ➔ Peak ➔ Lockout
                      </span>
                    </div>

                    {/* Main Sequence Image */}
                    <div 
                      onClick={() => {
                        setActiveExerciseModal(exercise);
                        setSelectedStepIndex(0);
                      }}
                      className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 group cursor-pointer shadow-2xs hover:border-teal-400 transition-all min-w-0"
                    >
                      <img
                        src={exercise.compositeImageUrl}
                        alt={`${exercise.name} demonstration`}
                        className="w-full object-cover group-hover:scale-[1.01] transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3 sm:p-4">
                        <span className="text-xs font-bold text-white bg-slate-900/80 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl backdrop-blur-sm flex items-center gap-1.5">
                          <Maximize2 className="w-3.5 h-3.5" /> Inspect Breakdown
                        </span>
                      </div>
                    </div>

                    {/* 4 Step Summary Badges if poses exist */}
                    {exercise.photoSequence && exercise.photoSequence.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 min-w-0">
                        {exercise.photoSequence.map((pose, pIdx) => (
                          <div 
                            key={pIdx} 
                            onClick={() => {
                              setActiveExerciseModal(exercise);
                              setSelectedStepIndex(pIdx);
                            }}
                            className="p-2 sm:p-2.5 bg-slate-50 hover:bg-teal-50/60 rounded-xl border border-slate-200 text-xs space-y-1 transition-all cursor-pointer min-w-0"
                          >
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[9px] sm:text-[10px] font-black uppercase text-teal-800 shrink-0">
                                Pose {pose.stepNumber}
                              </span>
                              <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono truncate">
                                {pose.motionDirection}
                              </span>
                            </div>
                            <div className="font-bold text-slate-900 text-xs truncate">
                              {pose.stepTitle.split('.')[1] || pose.stepTitle}
                            </div>
                            <p className="text-[10px] sm:text-[11px] text-slate-600 leading-snug line-clamp-2 break-words">
                              {pose.postureCue}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-3.5 sm:p-4 bg-teal-50/60 rounded-xl sm:rounded-2xl border border-teal-200 space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 text-xs font-bold text-teal-950">
                      <FileText className="w-4 h-4 text-teal-700 shrink-0" />
                      <span>Doctor's Execution Protocol:</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed break-words">
                      {exercise.correctForm}
                    </p>
                  </div>
                )}

                {/* Target Muscles & Breathing Guide */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 pt-2 border-t border-slate-100 text-xs min-w-0">
                  
                  {/* Prime Movers & Stabilizers */}
                  <div className="space-y-1.5 min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Target Muscle Focus:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg font-bold border border-emerald-200 text-xs">
                        🎯 {exercise.primaryMover}
                      </span>
                      {exercise.targetMuscles.slice(0, 3).map((muscle, mIdx) => (
                        <span key={mIdx} className="bg-slate-100 text-slate-700 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg font-medium border border-slate-200 text-xs">
                          {muscle}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Breathing & Doctor Guidance */}
                  <div className="space-y-1.5 min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Breathing & Cadence:
                    </span>
                    <div className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-200/80 text-[11px] text-emerald-950 flex items-start gap-2 min-w-0">
                      <Wind className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <span className="min-w-0 flex-1 break-words">{exercise.breathingGuidance}</span>
                    </div>
                  </div>

                </div>

              </div>

              {/* Card Footer: View Full Step-by-Step Instructions */}
              <div className="p-3.5 sm:p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    setActiveExerciseModal(exercise);
                    setSelectedStepIndex(0);
                  }}
                  className="w-full py-2 sm:py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-teal-300 shrink-0" />
                  <span>View Detailed Instructions & Form Guide</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* =========================================================================
          DETAILED EXERCISE MODAL & FULL-SIZE MOVEMENT SEQUENCE INSPECTOR
          ========================================================================= */}
      {activeExerciseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-4xl w-full max-h-[92vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-auto min-w-0">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-3 bg-gradient-to-r from-teal-50/60 to-white min-w-0">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1 flex-wrap">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 sm:px-2.5 py-0.5 rounded-md bg-teal-700 text-white">
                    {activeExerciseModal.category}
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 sm:px-2.5 py-0.5 rounded-md">
                    ⏱️ {activeExerciseModal.recommendedDose.sets} {activeExerciseModal.recommendedDose.sets === 1 ? 'Set' : 'Sets'} • {activeExerciseModal.recommendedDose.repsOrDuration}
                  </span>
                  {activeExerciseModal.tempoGuidance && (
                    <span className="text-[11px] sm:text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                      Tempo: {activeExerciseModal.tempoGuidance}
                    </span>
                  )}
                </div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 break-words">
                  {activeExerciseModal.name}
                </h2>
                <p className="text-xs text-slate-600 mt-0.5 break-words">
                  {activeExerciseModal.purpose}
                </p>
              </div>

              <button
                onClick={() => setActiveExerciseModal(null)}
                className="p-1.5 sm:p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 min-w-0">
              
              {/* FULL-SIZE 4-POSE MOVEMENT SEQUENCE GRAPHIC IF AVAILABLE */}
              {activeExerciseModal.compositeImageUrl && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-teal-600" />
                      Complete 4-Pose Movement Demonstration:
                    </h3>
                    <span className="text-[10px] text-teal-700 font-bold bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
                      Consistent Studio Series
                    </span>
                  </div>

                  <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm">
                    <img
                      src={activeExerciseModal.compositeImageUrl}
                      alt={`${activeExerciseModal.name} full demonstration`}
                      className="w-full object-contain"
                    />
                  </div>

                  {/* Step Tabs if poses exist */}
                  {activeExerciseModal.photoSequence && activeExerciseModal.photoSequence.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                      {activeExerciseModal.photoSequence.map((pose, pIdx) => (
                        <button
                          key={pIdx}
                          onClick={() => setSelectedStepIndex(pIdx)}
                          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                            selectedStepIndex === pIdx
                              ? 'bg-teal-900 text-white border-teal-950 shadow-xs ring-2 ring-teal-500/20'
                              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-[10px] font-black uppercase tracking-wider ${
                              selectedStepIndex === pIdx ? 'text-emerald-300' : 'text-slate-500'
                            }`}>
                              Pose {pose.stepNumber}
                            </span>
                            {selectedStepIndex === pIdx && (
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            )}
                          </div>
                          <div className="text-xs font-bold truncate">
                            {pose.stepTitle.split('.')[1] || pose.stepTitle}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Active Selected Step Callout Box */}
                  {activeExerciseModal.photoSequence && activeExerciseModal.photoSequence[selectedStepIndex] && (
                    <div className="p-4 bg-teal-50/80 border border-teal-200 rounded-2xl space-y-2 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-teal-950">
                          {activeExerciseModal.photoSequence[selectedStepIndex].stepTitle}
                        </span>
                        <span className="text-[10px] font-bold text-teal-800 bg-white px-2 py-0.5 rounded-full border border-teal-200">
                          {activeExerciseModal.photoSequence[selectedStepIndex].motionDirection}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 font-medium">
                        💡 <strong>Form Cue:</strong> {activeExerciseModal.photoSequence[selectedStepIndex].postureCue}
                      </p>
                      <p className="text-[11px] text-emerald-800 font-mono">
                        ✓ <strong>Joint Alignment:</strong> {activeExerciseModal.photoSequence[selectedStepIndex].jointAlignment}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Step-by-Step Movement Instructions */}
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-teal-600" />
                  Execution & Step-by-Step Breakdown:
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

              {/* Safety & Form Tips */}
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-1.5 text-xs">
                <strong className="text-amber-900 font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                  Clinical Advice & Precautions:
                </strong>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-900">
                  {activeExerciseModal.safetyTips.map((tip, tIdx) => (
                    <li key={tIdx}>{tip}</li>
                  ))}
                </ul>
              </div>

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
