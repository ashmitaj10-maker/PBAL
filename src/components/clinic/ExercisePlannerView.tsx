import React, { useState, useMemo } from 'react';
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
  User,
  Search,
  Edit2,
  X,
  ShieldCheck,
  AlertTriangle,
  Wind,
  Target
} from 'lucide-react';
import { ExercisePlan, ExerciseItem } from '../../types/clinic';
import { PatientSelector } from './PatientSelector';
import { EXERCISE_GUIDE_CATALOG, ExerciseDetailItem } from '../../data/exerciseGuideData';

export const ExercisePlannerView: React.FC = () => {
  const { 
    selectedPatient, 
    patients, 
    navigateTo, 
    currentClinic, 
    currentUser, 
    getPatientExercisePlan, 
    saveExercisePlan, 
    publishExercisePlan,
    addExerciseToPatientPlan,
    updateExerciseInPatientPlan,
    removeExerciseFromPatientPlan,
    getPatientAssignedExercises
  } = useClinic();

  const patient = selectedPatient || patients[0];

  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<ExerciseItem | null>(null);
  const [selectedLibraryItem, setSelectedLibraryItem] = useState<ExerciseDetailItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Form states for adding/editing exercise parameters
  const [formSets, setFormSets] = useState<number>(3);
  const [formReps, setFormReps] = useState<string>('12-15 reps');
  const [formDuration, setFormDuration] = useState<number>(15);
  const [formRest, setFormRest] = useState<string>('60 seconds');
  const [formIntensity, setFormIntensity] = useState<string>('Moderate');
  const [formDifficulty, setFormDifficulty] = useState<string>('Moderate');
  const [formFrequencyDays, setFormFrequencyDays] = useState<string[]>(['Mon', 'Wed', 'Fri']);
  const [formDoctorNotes, setFormDoctorNotes] = useState<string>('');

  const assignedExercises = patient ? getPatientAssignedExercises(patient.id) : [];
  const activePlan = patient ? getPatientExercisePlan(patient.id) : null;

  // Filter exercise catalog for modal browser
  const filteredCatalog = useMemo(() => {
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
          ex.primaryMover.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  const handleOpenAddModal = (catalogItem?: ExerciseDetailItem) => {
    const item = catalogItem || EXERCISE_GUIDE_CATALOG[0];
    setSelectedLibraryItem(item);
    setEditingExercise(null);
    setFormSets(item.recommendedDose.sets || 3);
    setFormReps(item.recommendedDose.repsOrDuration || '12-15 reps');
    setFormRest(item.recommendedDose.restBetweenSets || '60 seconds');
    setFormDuration(15);
    setFormIntensity('Moderate');
    setFormDifficulty('Moderate');
    setFormFrequencyDays(['Mon', 'Wed', 'Fri']);
    setFormDoctorNotes(`Focus on controlled eccentric tempo. Inhale on descent and exhale forcefully on lockout.`);
    setIsLibraryModalOpen(true);
  };

  const handleOpenEditModal = (exercise: ExerciseItem) => {
    setEditingExercise(exercise);
    setSelectedLibraryItem(null);
    setFormSets(exercise.sets || 3);
    setFormReps(exercise.reps || '12-15 reps');
    setFormRest(exercise.restSeconds || '60 seconds');
    setFormDuration(exercise.durationMinutes || 15);
    setFormIntensity(exercise.intensity || 'Moderate');
    setFormDifficulty(exercise.difficulty || 'Moderate');
    setFormFrequencyDays(exercise.frequencyDays || ['Mon', 'Wed', 'Fri']);
    setFormDoctorNotes(exercise.doctorNotes || '');
    setIsLibraryModalOpen(true);
  };

  const handleSaveExerciseAssignment = () => {
    if (!patient) return;

    if (editingExercise) {
      // Update existing
      updateExerciseInPatientPlan(patient.id, editingExercise.id, {
        sets: formSets,
        reps: formReps,
        restSeconds: formRest,
        durationMinutes: formDuration,
        intensity: formIntensity,
        difficulty: formDifficulty,
        frequencyDays: formFrequencyDays,
        doctorNotes: formDoctorNotes
      });
      setSaveToast(`Updated ${editingExercise.name} parameters!`);
    } else if (selectedLibraryItem) {
      // Add new
      addExerciseToPatientPlan(patient.id, {
        name: selectedLibraryItem.name,
        category: selectedLibraryItem.category,
        guideId: selectedLibraryItem.id,
        compositeImageUrl: selectedLibraryItem.compositeImageUrl,
        sets: formSets,
        reps: formReps,
        restSeconds: formRest,
        durationMinutes: formDuration,
        intensity: formIntensity,
        difficulty: formDifficulty,
        frequencyDays: formFrequencyDays,
        doctorNotes: formDoctorNotes,
        purpose: selectedLibraryItem.purpose,
        targetMuscles: selectedLibraryItem.targetMuscles,
        primaryMover: selectedLibraryItem.primaryMover,
        secondaryStabilizers: selectedLibraryItem.secondaryStabilizers,
        tempoGuidance: selectedLibraryItem.tempoGuidance,
        instructions: selectedLibraryItem.stepByStepInstructions
      });
      setSaveToast(`Assigned ${selectedLibraryItem.name} to ${patient.name}!`);
    }

    setIsLibraryModalOpen(false);
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleRemoveExercise = (exerciseId: string, exerciseName: string) => {
    if (!patient) return;
    if (window.confirm(`Are you sure you want to remove "${exerciseName}" from ${patient.name}'s plan?`)) {
      removeExerciseFromPatientPlan(patient.id, exerciseId);
      setSaveToast(`Removed ${exerciseName} from patient plan.`);
      setTimeout(() => setSaveToast(null), 3000);
    }
  };

  const handlePublishPlan = () => {
    if (!patient || !activePlan) return;
    publishExercisePlan(activePlan.id);
    setSaveToast(`Exercise protocol published live to ${patient.name}'s mobile portal!`);
    setTimeout(() => setSaveToast(null), 3500);
  };

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

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-200">
      
      {/* Top Header Banner with Patient Selector & Actions */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
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
                Clinical Exercise & Movement Protocol
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                activePlan?.status === 'published' 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-amber-100 text-amber-900'
              }`}>
                {activePlan?.status === 'published' ? 'Published' : 'Draft'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Prescribing exercises for: <strong className="text-[#183153]">{patient.name}</strong> ({patient.patientCode})
            </p>
          </div>
        </div>

        {/* Top Controls: Patient Selector & Actions */}
        <div className="flex items-center flex-wrap gap-2.5">
          <PatientSelector />

          <button
            onClick={() => handleOpenAddModal()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-teal-50 text-teal-900 hover:bg-teal-100 border border-teal-200 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-teal-600" />
            <span>Add Exercise</span>
          </button>

          <button
            onClick={handlePublishPlan}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs hover:shadow transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publish to Patient App</span>
          </button>
        </div>
      </div>

      {/* Save Notification Toast */}
      {saveToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold rounded-xl flex items-center gap-2 animate-in fade-in duration-150">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Patient Clinical Rx Overview Card */}
      <div className="bg-gradient-to-r from-[#183153] via-teal-900 to-emerald-900 text-white rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-xl">
          <div className="text-[10px] font-black uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
            <Dumbbell className="w-3.5 h-3.5" />
            Doctor Exercise Prescription
          </div>
          <h2 className="text-xl font-bold text-white">
            {patient.name}’s Prescribed Movement Plan
          </h2>
          <p className="text-xs text-emerald-100/90 leading-relaxed">
            Exercises assigned here will be strictly isolated and displayed directly in {patient.name}’s patient portal with purpose-built 4-pose movement demonstrations.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 shrink-0 text-xs">
          <div className="text-center px-2">
            <span className="text-[10px] uppercase font-bold text-slate-300 block">Total Exercises</span>
            <span className="text-base font-black text-white">{assignedExercises.length}</span>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center px-2">
            <span className="text-[10px] uppercase font-bold text-slate-300 block">Weekly Target</span>
            <span className="text-base font-black text-emerald-300">{activePlan?.weeklyGoalDays || 4} Days</span>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center px-2">
            <span className="text-[10px] uppercase font-bold text-slate-300 block">Daily Steps</span>
            <span className="text-base font-black text-amber-300">{activePlan?.dailyStepTarget || 8500}</span>
          </div>
        </div>
      </div>

      {/* List of Assigned Exercises */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-teal-600" />
            Assigned Exercises ({assignedExercises.length})
          </h2>

          <button
            onClick={() => handleOpenAddModal()}
            className="flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-900 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Browse Library & Assign More</span>
          </button>
        </div>

        {assignedExercises.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center space-y-3">
            <Dumbbell className="w-10 h-10 text-slate-300 mx-auto" />
            <div>
              <h3 className="text-sm font-bold text-slate-700">No exercises assigned yet</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Click below to browse the exercise library and assign tailored movements for {patient.name}.
              </p>
            </div>
            <button
              onClick={() => handleOpenAddModal()}
              className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              ➕ Browse Library & Assign Exercise
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignedExercises.map((exercise) => {
              const guideMatch = EXERCISE_GUIDE_CATALOG.find(g => g.name.toLowerCase() === exercise.name.toLowerCase() || g.id === exercise.guideId);
              const displayImage = exercise.compositeImageUrl || guideMatch?.compositeImageUrl || '/exercises/squat_guide.jpg';

              return (
                <div 
                  key={exercise.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200">
                          {exercise.category}
                        </span>
                        <h3 className="text-base font-black text-slate-900 mt-1">
                          {exercise.name}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditModal(exercise)}
                          className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit Sets, Reps & Notes"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleRemoveExercise(exercise.id, exercise.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Remove Exercise"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Continuous 4-Pose Visual Thumbnail */}
                    <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                      <img
                        src={displayImage}
                        alt={exercise.name}
                        className="w-full h-28 object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Prescribed Parameters Grid */}
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 block font-semibold">Sets</span>
                        <span className="font-bold text-slate-900">{exercise.sets || 3} Sets</span>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 block font-semibold">Reps / Time</span>
                        <span className="font-bold text-slate-900">{exercise.reps || `${exercise.durationMinutes || 15} mins`}</span>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 block font-semibold">Rest</span>
                        <span className="font-bold text-slate-900">{exercise.restSeconds || '60s'}</span>
                      </div>
                    </div>

                    {/* Doctor's Custom Guidance */}
                    {exercise.doctorNotes && (
                      <div className="p-2.5 bg-amber-50/80 rounded-xl border border-amber-200/80 text-[11px] text-amber-950 flex items-start gap-1.5">
                        <Info className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                        <span>
                          <strong>Doctor's Advice:</strong> {exercise.doctorNotes}
                        </span>
                      </div>
                    )}

                  </div>

                  {/* Footer Frequency Badges */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                    <span className="font-semibold text-slate-700">
                      Days: {exercise.frequencyDays?.join(', ') || 'Mon, Wed, Fri'}
                    </span>
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold">
                      {exercise.difficulty || 'Moderate'}
                    </span>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =========================================================================
          EXERCISE LIBRARY BROWSER & PARAMETERS CUSTOMIZATION MODAL
          ========================================================================= */}
      {isLibraryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between gap-4 bg-gradient-to-r from-teal-50/60 to-white">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-800 bg-teal-100 px-2 py-0.5 rounded-md">
                  {editingExercise ? 'Edit Exercise Assignment' : 'Assign Exercise from Library'}
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-1">
                  {editingExercise ? `Edit ${editingExercise.name}` : 'Exercise Library & Custom Parameters'}
                </h2>
                <p className="text-xs text-slate-500">
                  Assigning to: <strong>{patient.name}</strong> ({patient.patientCode})
                </p>
              </div>

              <button
                onClick={() => setIsLibraryModalOpen(false)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Exercise Selector (Only if adding new) */}
              {!editingExercise && (
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        placeholder="Search exercises by name, body area, target muscle..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full text-xs pl-10 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 font-medium"
                      />
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                      {['All', 'Strength & Tone', 'Core & Posture', 'Cardio & Metabolic', 'Mobility & Joint Health'].map(cat => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                            selectedCategory === cat ? 'bg-teal-800 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Horizontal Scroll / Grid of Library Items */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-56 overflow-y-auto p-1 border border-slate-100 rounded-2xl bg-slate-50/50">
                    {filteredCatalog.map(item => {
                      const isSelected = selectedLibraryItem?.id === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            setSelectedLibraryItem(item);
                            setFormSets(item.recommendedDose.sets || 3);
                            setFormReps(item.recommendedDose.repsOrDuration || '12-15 reps');
                            setFormRest(item.recommendedDose.restBetweenSets || '60 seconds');
                          }}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected 
                              ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-300/40 shadow-xs' 
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between text-[10px] text-teal-800 font-bold mb-1">
                              <span>{item.category}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-teal-700" />}
                            </div>
                            <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                            <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{item.purpose}</p>
                          </div>

                          <div className="mt-2 text-[10px] text-slate-400 font-mono">
                            {item.recommendedDose.sets} sets • {item.recommendedDose.repsOrDuration}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Selected Exercise Preview Box */}
              {(selectedLibraryItem || editingExercise) && (
                <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-teal-800">
                        Selected Movement
                      </span>
                      <h3 className="text-base font-black text-slate-900">
                        {editingExercise?.name || selectedLibraryItem?.name}
                      </h3>
                    </div>

                    <span className="text-xs bg-white text-teal-900 px-2.5 py-1 rounded-lg font-bold border border-teal-200">
                      🎯 {editingExercise?.primaryMover || selectedLibraryItem?.primaryMover}
                    </span>
                  </div>

                  {/* 4-Pose Continuous Demonstration Preview */}
                  <div className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-2xs">
                    <img
                      src={editingExercise?.compositeImageUrl || selectedLibraryItem?.compositeImageUrl || '/exercises/squat_guide.jpg'}
                      alt="Movement demonstration"
                      className="w-full h-32 object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Parameters Customization Form */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-teal-600" />
                  Customize Prescription Parameters for {patient.name}:
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Sets */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Sets:
                    </label>
                    <select
                      value={formSets}
                      onChange={(e) => setFormSets(Number(e.target.value))}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 font-bold"
                    >
                      <option value={1}>1 Set</option>
                      <option value={2}>2 Sets</option>
                      <option value={3}>3 Sets</option>
                      <option value={4}>4 Sets</option>
                      <option value={5}>5 Sets</option>
                    </select>
                  </div>

                  {/* Repetitions / Hold Duration */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Reps / Hold Duration:
                    </label>
                    <input
                      type="text"
                      value={formReps}
                      onChange={(e) => setFormReps(e.target.value)}
                      placeholder="e.g. 12-15 reps, 45s hold"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 font-medium"
                    />
                  </div>

                  {/* Rest Time */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Rest Between Sets:
                    </label>
                    <select
                      value={formRest}
                      onChange={(e) => setFormRest(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 font-bold"
                    >
                      <option value="30 seconds">30 seconds</option>
                      <option value="45 seconds">45 seconds</option>
                      <option value="60 seconds">60 seconds</option>
                      <option value="75 seconds">75 seconds</option>
                      <option value="90 seconds">90 seconds</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Difficulty */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Difficulty Level:
                    </label>
                    <select
                      value={formDifficulty}
                      onChange={(e) => setFormDifficulty(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 font-medium"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  {/* Intensity */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Metabolic Intensity:
                    </label>
                    <select
                      value={formIntensity}
                      onChange={(e) => setFormIntensity(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 font-medium"
                    >
                      <option value="Low">Low (Zone 1 - Recovery)</option>
                      <option value="Moderate">Moderate (Zone 2 - Fat Oxidation)</option>
                      <option value="High">High (Zone 3 - Conditioning)</option>
                    </select>
                  </div>
                </div>

                {/* Days of Week Frequency */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Assigned Days of Week:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                      const isChecked = formFrequencyDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => {
                            setFormFrequencyDays(prev => 
                              isChecked ? prev.filter(d => d !== day) : [...prev, day]
                            );
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isChecked 
                              ? 'bg-teal-700 text-white shadow-2xs' 
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Doctor Notes */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Doctor's Custom Clinical Notes / Instructions for {patient.name}:
                  </label>
                  <textarea
                    rows={3}
                    value={formDoctorNotes}
                    onChange={(e) => setFormDoctorNotes(e.target.value)}
                    placeholder="e.g. Focus on 3-second descent. Keep heels flat on the floor to optimize glucose disposal..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500"
                  />
                </div>

              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsLibraryModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveExerciseAssignment}
                className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{editingExercise ? 'Save Changes' : 'Assign Exercise to Patient'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
