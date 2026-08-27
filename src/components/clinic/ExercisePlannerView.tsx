import React, { useState, useEffect } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { 
  Activity, 
  Dumbbell, 
  Flame, 
  HeartPulse, 
  Calendar, 
  Clock, 
  Plus, 
  Trash2, 
  Check, 
  ArrowLeft, 
  Send, 
  Save, 
  Info, 
  Sparkles,
  Layers,
  ChevronRight,
  User
} from 'lucide-react';
import { ExercisePlan, ExerciseRoutineItem } from '../../types/clinic';
import { INITIAL_EXERCISE_PLANS } from '../../data/mockMealAndAssessmentData';

export const ExercisePlannerView: React.FC = () => {
  const { 
    selectedPatient, 
    setSelectedPatientId,
    patients, 
    navigateTo, 
    exercisePlans, 
    saveExercisePlan, 
    publishExercisePlan,
    currentClinic,
    currentUser,
    getPatientAssessments
  } = useClinic();

  const patient = selectedPatient || patients[0];
  const assessment = patient ? getPatientAssessments(patient.id)[0] : null;

  const existingPlan = patient ? exercisePlans.find(p => p.patientId === patient.id) : null;
  const [activePlan, setActivePlan] = useState<ExercisePlan>(() => {
    if (existingPlan) return existingPlan;
    if (INITIAL_EXERCISE_PLANS[0]) {
      return {
        ...INITIAL_EXERCISE_PLANS[0],
        id: `ex-${Date.now()}`,
        patientId: patient?.id || 'pat-1',
        patientName: patient?.name || 'Patient',
        clinicId: currentClinic?.id || 'clinic-1',
        status: 'draft'
      };
    }
    return {
      id: `ex-${Date.now()}`,
      patientId: patient?.id || 'pat-1',
      patientName: patient?.name || 'Patient',
      clinicId: currentClinic?.id || 'clinic-1',
      title: 'Clinical Metabolic Conditioning & Resistance Protocol',
      frequencyPerWeek: 4,
      targetMinutesPerSession: 35,
      estimatedCaloriesBurnPerSession: 220,
      status: 'draft',
      routines: [],
      instructions: [
        'Perform gentle dynamic warm-up before every session.',
        'Prioritize progressive overload with controlled tempo.',
        'Stay well hydrated with electrolyte infused water.'
      ],
      createdAt: new Date().toISOString()
    };
  });

  // Sync plan when patient changes
  useEffect(() => {
    if (patient) {
      const pPlan = exercisePlans.find(p => p.patientId === patient.id);
      if (pPlan) {
        setActivePlan(pPlan);
      } else {
        setActivePlan({
          id: `ex-${Date.now()}`,
          patientId: patient.id,
          patientName: patient.name,
          clinicId: currentClinic?.id || 'clinic-1',
          title: 'Clinical Metabolic Conditioning & Resistance Protocol',
          frequencyPerWeek: 4,
          targetMinutesPerSession: 35,
          estimatedCaloriesBurnPerSession: 220,
          status: 'draft',
          routines: INITIAL_EXERCISE_PLANS[0]?.routines || [],
          instructions: [
            'Perform gentle dynamic warm-up before every session.',
            'Prioritize progressive overload with controlled tempo.',
            'Stay well hydrated with electrolyte infused water.'
          ],
          createdAt: new Date().toISOString()
        });
      }
    }
  }, [patient?.id]);

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [newExName, setNewExName] = useState('');
  const [newExSets, setNewExSets] = useState(3);
  const [newExReps, setNewExReps] = useState('12 reps');
  const [newExDuration, setNewExDuration] = useState(10);
  const [newExIntensity, setNewExIntensity] = useState<'low' | 'moderate' | 'high'>('moderate');
  const [newExFocus, setNewExFocus] = useState('Metabolic Insulin Sensitivity');
  const [saveToast, setSaveToast] = useState<string | null>(null);

  if (!patient) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-500">Please select a patient first.</p>
        <button onClick={() => navigateTo('patients')} className="mt-4 px-4 py-2 bg-[#183153] text-white text-xs font-semibold rounded-xl">
          Go to Directory
        </button>
      </div>
    );
  }

  const currentRoutine = activePlan.routines[selectedDayIndex] || activePlan.routines[0];

  const handleSavePlan = () => {
    saveExercisePlan(activePlan);
    setSaveToast('Exercise protocol saved successfully!');
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handlePublish = () => {
    publishExercisePlan(activePlan.id);
    setActivePlan(prev => ({ ...prev, status: 'published' }));
    setSaveToast(`Exercise plan published live to ${patient.name}'s mobile portal!`);
    setTimeout(() => setSaveToast(null), 3500);
  };

  const handleAddExerciseToCurrentDay = () => {
    if (!newExName.trim()) return;

    const newItem: ExerciseRoutineItem = {
      id: `ex-item-${Date.now()}`,
      name: newExName.trim(),
      category: 'Strength',
      durationMinutes: newExDuration,
      sets: newExSets,
      reps: newExReps,
      intensity: newExIntensity,
      timeOfDay: 'Morning',
      instructions: ['Follow controlled tempo and maintain proper form throughout the movement.']
    };

    const updatedRoutines = (activePlan.routines || []).map((r, idx) => {
      if (idx === selectedDayIndex) {
        return {
          ...r,
          exercises: [...(r.exercises || []), newItem]
        };
      }
      return r;
    });

    const updated = {
      ...activePlan,
      status: 'draft' as const,
      routines: updatedRoutines
    };

    setActivePlan(updated);
    saveExercisePlan(updated);
    setIsAddingExercise(false);
    setNewExName('');
    setSaveToast(`Added ${newItem.name} to ${currentRoutine.dayName}!`);
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleDeleteExercise = (dayIdx: number, itemId: string) => {
    const updatedRoutines = (activePlan.routines || []).map((r, idx) => {
      if (idx === dayIdx) {
        return {
          ...r,
          exercises: (r.exercises || []).filter(e => e.id !== itemId)
        };
      }
      return r;
    });

    const updated = {
      ...activePlan,
      status: 'draft' as const,
      routines: updatedRoutines
    };

    setActivePlan(updated);
    saveExercisePlan(updated);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-[#E4E9E4] shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigateTo('patient_profile', { patientId: patient.id })}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
            title="Back to Patient"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-[#183153]">
                Clinical Exercise & Movement Protocol
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                activePlan.status === 'published' 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-amber-100 text-amber-900'
              }`}>
                {activePlan.status === 'published' ? 'Published' : 'Draft Protocol'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Prescribed for: <strong className="text-[#183153]">{patient.name}</strong> • Frequency: {activePlan.frequencyPerWeek} Days/wk
            </p>
          </div>
        </div>

        {/* Top Controls & Patient Selector */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Patient Selector */}
          <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-xs">
            <User className="w-4 h-4 text-teal-600 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[9px] uppercase font-bold text-slate-400 leading-none">Select Patient</span>
              <select
                value={patient.id}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="bg-transparent text-xs sm:text-sm font-bold text-slate-800 focus:outline-none cursor-pointer pr-1"
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.patientCode})</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleSavePlan}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>

          <button
            onClick={handlePublish}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#6BBF59] text-white hover:bg-[#5EAB4D] shadow-xs hover:shadow transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publish to Patient App</span>
          </button>
        </div>
      </div>

      {saveToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Target Prescription KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-emerald-50 rounded-xl text-[#6BBF59]">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Target Frequency</div>
            <div className="text-base font-bold text-[#183153]">{activePlan.frequencyPerWeek} Days / Week</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-sky-50 rounded-xl text-sky-600">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Session Duration</div>
            <div className="text-base font-bold text-[#183153]">{activePlan.targetMinutesPerSession} Minutes / Day</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Est. Metabolic Burn</div>
            <div className="text-base font-bold text-[#183153]">~{activePlan.estimatedCaloriesBurnPerSession} kcal / Session</div>
          </div>
        </div>
      </div>

      {/* Day-by-day Routine Editor */}
      <div className="bg-white rounded-2xl border border-[#E4E9E4] overflow-hidden shadow-xs">
        
        {/* Day Tabs */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto">
          {(activePlan.routines || []).map((routine, idx) => (
            <button
              key={routine.dayName}
              onClick={() => setSelectedDayIndex(idx)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                selectedDayIndex === idx
                  ? 'bg-[#183153] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{routine.dayName}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                routine.isRestDay ? 'bg-slate-200 text-slate-700' : 'bg-[#6BBF59]/20 text-[#183153]'
              }`}>
                {routine.isRestDay ? 'Rest' : `${(routine.exercises || []).length} Ex`}
              </span>
            </button>
          ))}
        </div>

        {/* Selected Routine Detail */}
        {currentRoutine && (
          <div className="p-6 space-y-6">
            
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-[#183153] flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-[#6BBF59]" />
                  {currentRoutine.focusTitle}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Day Focus: {currentRoutine.dayName} • {currentRoutine.isRestDay ? 'Active Recovery & Stretching' : 'Targeted Resistance / Zone 2 Cardio'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddingExercise(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#183153] text-white text-xs font-semibold rounded-xl hover:bg-[#244673] transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#6BBF59]" />
                  <span>Add Exercise</span>
                </button>
              </div>
            </div>

            {/* Exercise Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(currentRoutine.exercises || []).map((ex, exIdx) => (
                <div 
                  key={ex.id || exIdx}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-[#F8FFF8] hover:border-emerald-200 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#183153] text-white">
                        Ex #{exIdx + 1}
                      </span>

                      <button
                        onClick={() => handleDeleteExercise(selectedDayIndex, ex.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Delete exercise"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="text-sm font-bold text-[#183153] mb-1">
                      {ex.name}
                    </h4>

                    <div className="flex flex-wrap gap-1.5 text-[11px] font-mono text-slate-600 mb-3">
                      {ex.sets && (
                        <span className="px-2 py-0.5 bg-white border border-slate-200 rounded-md font-semibold">
                          {ex.sets} Sets
                        </span>
                      )}
                      {ex.reps && (
                        <span className="px-2 py-0.5 bg-white border border-slate-200 rounded-md font-semibold">
                          {ex.reps}
                        </span>
                      )}
                      {ex.durationMinutes && (
                        <span className="px-2 py-0.5 bg-white border border-slate-200 rounded-md font-semibold">
                          {ex.durationMinutes} mins
                        </span>
                      )}
                    </div>

                    {ex.clinicalFocus && (
                      <div className="p-2 bg-white rounded-lg border border-slate-200 text-[11px] text-slate-600 flex items-start gap-1.5">
                        <HeartPulse className="w-3 h-3 text-[#6BBF59] shrink-0 mt-0.5" />
                        <span>{ex.clinicalFocus}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Add Form Modal */}
            {isAddingExercise && (
              <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 space-y-3">
                <div className="text-xs font-bold text-[#183153]">
                  Add New Clinical Movement to {currentRoutine.dayName}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Exercise Name (e.g. Dumbbell Romanian Deadlifts)"
                    value={newExName}
                    onChange={(e) => setNewExName(e.target.value)}
                    className="col-span-2 px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
                  />
                  <input
                    type="text"
                    placeholder="Reps / Tempo (e.g. 10 reps @ 3010)"
                    value={newExReps}
                    onChange={(e) => setNewExReps(e.target.value)}
                    className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Sets</label>
                    <input
                      type="number"
                      value={newExSets}
                      onChange={(e) => setNewExSets(parseInt(e.target.value) || 3)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Duration (Mins)</label>
                    <input
                      type="number"
                      value={newExDuration}
                      onChange={(e) => setNewExDuration(parseInt(e.target.value) || 10)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Clinical Focus</label>
                    <input
                      type="text"
                      placeholder="e.g. Glute Hypertrophy"
                      value={newExFocus}
                      onChange={(e) => setNewExFocus(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setIsAddingExercise(false)}
                    className="px-3 py-1.5 bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddExerciseToCurrentDay}
                    className="px-4 py-1.5 bg-[#183153] text-white text-xs font-bold rounded-xl"
                  >
                    Save Movement
                  </button>
                </div>
              </div>
            )}

          </div>
        )}
      </div>

    </div>
  );
};
