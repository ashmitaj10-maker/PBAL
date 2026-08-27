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
  Target,
  Footprints,
  Bike,
  Waves,
  Heart,
  FileText,
  CheckCircle2,
  Stethoscope
} from 'lucide-react';
import { ExercisePlan, ExerciseItem } from '../../types/clinic';
import { PatientSelector } from './PatientSelector';
import { EXERCISE_GUIDE_CATALOG, ExerciseDetailItem } from '../../data/exerciseGuideData';

// Common Activity Presets for 1-Click Doctor Custom Creation
interface ActivityPreset {
  name: string;
  category: string;
  icon: string;
  defaultDuration: number;
  defaultRepsOrDistance: string;
  defaultPurpose: string;
  defaultHowTo: string;
  defaultNotes: string;
  visualUrl?: string;
  targetMuscles: string[];
}

const COMMON_ACTIVITY_PRESETS: ActivityPreset[] = [
  {
    name: 'Post-Meal Brisk Walking',
    category: 'Cardio & Metabolic',
    icon: '🚶‍♂️',
    defaultDuration: 30,
    defaultRepsOrDistance: '3,500 - 4,500 steps',
    defaultPurpose: 'Accelerates postprandial glucose disposal, flattens blood sugar spikes, and promotes visceral fat mobilization.',
    defaultHowTo: 'Walk at a brisk conversational pace (105-115 BPM cadence). Keep chest proud and swing arms naturally. Begin within 20 minutes following your meal.',
    defaultNotes: 'Wear supportive cushioned footwear. Maintain relaxed nasal breathing throughout.',
    visualUrl: '/exercises/walking_guide.jpg',
    targetMuscles: ['Cardiovascular System', 'Calves', 'Gluteal Complex', 'Quadriceps']
  },
  {
    name: 'Zone 2 Cardio Jogging / Running',
    category: 'Cardio & Metabolic',
    icon: '🏃',
    defaultDuration: 35,
    defaultRepsOrDistance: '3.5 - 5.0 km',
    defaultPurpose: 'Builds aerobic base mitochondrial density and optimizes fatty acid oxidation without excessive cortisol elevation.',
    defaultHowTo: 'Maintain an easy conversational pace where you can speak full sentences without gasping. Heart rate should remain in Zone 2 (60-70% max HR).',
    defaultNotes: 'Do not sprint. Focus on smooth foot turn-over and landing softly under your center of mass.',
    targetMuscles: ['Cardiorespiratory System', 'Hamstrings', 'Calves', 'Core']
  },
  {
    name: 'Outdoor / Stationary Cycling',
    category: 'Cardio & Metabolic',
    icon: '🚴',
    defaultDuration: 40,
    defaultRepsOrDistance: '8 - 12 km (Cadence: 75-85 RPM)',
    defaultPurpose: 'Low-impact cardiovascular conditioning that builds lower body muscular endurance while completely sparing knees and spinal joints.',
    defaultHowTo: 'Adjust saddle height so knee has a slight 15-degree bend at lowest pedal stroke. Maintain smooth circular pedaling cadence at moderate resistance.',
    defaultNotes: 'Keep shoulders relaxed and avoid locking elbows on handlebars.',
    targetMuscles: ['Quadriceps', 'Gluteus Maximus', 'Calves', 'Cardiovascular System']
  },
  {
    name: 'Lap Swimming / Water Aerobics',
    category: 'Cardio & Metabolic',
    icon: '🏊',
    defaultDuration: 30,
    defaultRepsOrDistance: '12 - 20 laps (Freestyle / Breaststroke)',
    defaultPurpose: 'Full-body buoyancy conditioning that stimulates lymphatic circulation and decompresses spinal discs.',
    defaultHowTo: 'Alternate between freestyle, backstroke, and breaststroke. Focus on long, relaxed strokes and steady bilateral breathing.',
    defaultNotes: 'Stay hydrated with electrolyte water between lap sets.',
    targetMuscles: ['Latissimus Dorsi', 'Pectorals', 'Deltoids', 'Core Cylinder']
  },
  {
    name: 'Morning Sun Salutation & Dynamic Yoga',
    category: 'Mobility & Yoga',
    icon: '🧘',
    defaultDuration: 20,
    defaultRepsOrDistance: '6 - 8 flow rounds',
    defaultPurpose: 'Mobilizes thoracic vertebrae, releases tight hamstrings and hip flexors, and activates parasympathetic relaxation.',
    defaultHowTo: 'Move with the rhythm of your breath: Inhale as chest expands and reaches overhead; exhale as you fold forward from hips with soft knees.',
    defaultNotes: 'Move gently within a pain-free range of motion. Never force a stretch.',
    visualUrl: '/exercises/yoga_guide.jpg',
    targetMuscles: ['Entire Posterior Chain', 'Spinal Articulators', 'Shoulder Girdle']
  },
  {
    name: 'Full-Body Dynamic Stretching Routine',
    category: 'Mobility & Yoga',
    icon: '🤸',
    defaultDuration: 15,
    defaultRepsOrDistance: '10 reps per stretch',
    defaultPurpose: 'Restores synovial joint lubrication, relieves posture fatigue from desk work, and prevents muscle stiffness.',
    defaultHowTo: 'Perform arm circles, torso twists, hip openers, and hamstring sweeps continuously without bouncing.',
    defaultNotes: 'Perform either first thing in the morning or as a warm-up before resistance workouts.',
    targetMuscles: ['Thoracic Spine', 'Hip Flexors', 'Hamstrings', 'Pectorals']
  },
  {
    name: 'Home Bodyweight Calisthenics Circuit',
    category: 'Strength & Tone',
    icon: '🏠',
    defaultDuration: 25,
    defaultRepsOrDistance: '3 rounds × 12 reps per exercise',
    defaultPurpose: 'Builds lean functional muscle tone and improves insulin receptor sensitivity with zero gym equipment required.',
    defaultHowTo: 'Cycle through: 1) Bodyweight Squats, 2) Incline Push-Ups on Chair, 3) Glute Bridges, 4) Forearm Plank. Rest 60s after each circuit.',
    defaultNotes: 'Maintain strict form over speed. Take 3 seconds on the eccentric lowering phase.',
    visualUrl: '/exercises/squat_guide.jpg',
    targetMuscles: ['Full Body', 'Quadriceps', 'Core', 'Chest']
  },
  {
    name: 'Badminton / Tennis / Recreational Sports',
    category: 'Rehab / Low-Impact',
    icon: '🏸',
    defaultDuration: 45,
    defaultRepsOrDistance: '2 - 3 active sets',
    defaultPurpose: 'High-engagement multi-planar agility and cardiovascular conditioning that boosts endorphins and metabolic flexibility.',
    defaultHowTo: 'Enjoy continuous rally play with light lateral footwork. Warm up wrists and ankles for 5 minutes prior.',
    defaultNotes: 'Wear court-specific grip shoes and hydrate every 15 minutes.',
    targetMuscles: ['Cardiovascular System', 'Rotator Cuff', 'Leg Agility', 'Core']
  }
];

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

  // Modal & Mode state: 'library' or 'custom'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'custom' | 'library'>('custom');
  const [editingExercise, setEditingExercise] = useState<ExerciseItem | null>(null);
  const [selectedLibraryItem, setSelectedLibraryItem] = useState<ExerciseDetailItem | null>(null);
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Form Fields for Custom Exercise
  const [customName, setCustomName] = useState<string>('');
  const [customCategory, setCustomCategory] = useState<string>('Cardio & Metabolic');
  const [customPurpose, setCustomPurpose] = useState<string>('');
  const [customHowTo, setCustomHowTo] = useState<string>('');
  const [customPrescriptionType, setCustomPrescriptionType] = useState<'duration' | 'reps'>('duration');
  const [customSets, setCustomSets] = useState<number>(3);
  const [customReps, setCustomReps] = useState<string>('12 - 15 reps');
  const [customDuration, setCustomDuration] = useState<number>(30);
  const [customRest, setCustomRest] = useState<string>('60 seconds');
  const [customFrequencyDays, setCustomFrequencyDays] = useState<string[]>(['Mon', 'Wed', 'Fri']);
  const [customIntensity, setCustomIntensity] = useState<string>('Moderate');
  const [customDifficulty, setCustomDifficulty] = useState<string>('Moderate');
  const [customTargetMuscles, setCustomTargetMuscles] = useState<string>('Cardiovascular System, Core');
  const [customDoctorNotes, setCustomDoctorNotes] = useState<string>('');
  const [hasAiVisual, setHasAiVisual] = useState<boolean>(true);
  const [selectedVisualUrl, setSelectedVisualUrl] = useState<string>('/exercises/walking_guide.jpg');

  const assignedExercises = patient ? getPatientAssignedExercises(patient.id) : [];
  const activePlan = patient ? getPatientExercisePlan(patient.id) : null;

  // Filter existing library catalog
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

  // Open modal in "Create Custom Exercise" mode
  const handleOpenCreateCustom = () => {
    setEditingExercise(null);
    setSelectedLibraryItem(null);
    setModalTab('custom');
    
    // Default values
    setCustomName('Post-Meal 20-Min Brisk Walk');
    setCustomCategory('Cardio & Metabolic');
    setCustomPurpose('Accelerates postprandial glucose uptake and minimizes insulin spikes after meals.');
    setCustomHowTo('Walk at a brisk, purposeful pace (100-115 BPM). Keep chest upright and swing arms naturally.');
    setCustomPrescriptionType('duration');
    setCustomDuration(20);
    setCustomSets(1);
    setCustomReps('2,500 steps');
    setCustomRest('Continuous');
    setCustomFrequencyDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
    setCustomIntensity('Moderate');
    setCustomDifficulty('Beginner');
    setCustomTargetMuscles('Cardiovascular System, Calves, Glutes');
    setCustomDoctorNotes('Start walking within 15-20 minutes after dinner for optimal blood sugar control.');
    setHasAiVisual(true);
    setSelectedVisualUrl('/exercises/walking_guide.jpg');
    
    setIsModalOpen(true);
  };

  // Open modal in "Browse Library" mode
  const handleOpenBrowseLibrary = () => {
    setEditingExercise(null);
    setModalTab('library');
    const firstItem = EXERCISE_GUIDE_CATALOG[0];
    setSelectedLibraryItem(firstItem);
    setIsModalOpen(true);
  };

  // Quick fill preset
  const handleApplyPreset = (preset: ActivityPreset) => {
    setCustomName(preset.name);
    setCustomCategory(preset.category);
    setCustomPurpose(preset.defaultPurpose);
    setCustomHowTo(preset.defaultHowTo);
    setCustomDuration(preset.defaultDuration);
    setCustomReps(preset.defaultRepsOrDistance);
    setCustomTargetMuscles(preset.targetMuscles.join(', '));
    setCustomDoctorNotes(preset.defaultNotes);
    if (preset.visualUrl) {
      setHasAiVisual(true);
      setSelectedVisualUrl(preset.visualUrl);
    } else {
      setHasAiVisual(false);
    }
  };

  // Open modal in "Edit" mode
  const handleOpenEditModal = (exercise: ExerciseItem) => {
    setEditingExercise(exercise);
    setSelectedLibraryItem(null);
    setModalTab('custom');
    
    setCustomName(exercise.name);
    setCustomCategory(exercise.category || 'Strength & Tone');
    setCustomPurpose(exercise.purpose || exercise.description || '');
    setCustomHowTo(exercise.howToPerform || (exercise.instructions || []).join('\n'));
    setCustomSets(exercise.sets || 3);
    setCustomReps(exercise.reps || '12 reps');
    setCustomDuration(exercise.durationMinutes || 20);
    setCustomRest(exercise.restSeconds || '60 seconds');
    setCustomFrequencyDays(exercise.frequencyDays || ['Mon', 'Wed', 'Fri']);
    setCustomIntensity(exercise.intensity || 'Moderate');
    setCustomDifficulty(exercise.difficulty || 'Moderate');
    setCustomTargetMuscles((exercise.targetMuscles || []).join(', ') || 'Full Body');
    setCustomDoctorNotes(exercise.doctorNotes || '');
    setHasAiVisual(!!exercise.compositeImageUrl);
    setSelectedVisualUrl(exercise.compositeImageUrl || '/exercises/squat_guide.jpg');
    
    setIsModalOpen(true);
  };

  // Save / Assign Exercise
  const handleSaveExercise = () => {
    if (!patient) return;
    if (!customName.trim() && modalTab === 'custom') {
      alert('Please enter an exercise or activity name.');
      return;
    }

    const targetMusclesArray = customTargetMuscles
      .split(',')
      .map(m => m.trim())
      .filter(Boolean);

    const instructionsArray = customHowTo
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    if (editingExercise) {
      // Update existing
      updateExerciseInPatientPlan(patient.id, editingExercise.id, {
        name: customName.trim(),
        category: customCategory,
        purpose: customPurpose,
        description: customPurpose,
        howToPerform: customHowTo,
        sets: customSets,
        reps: customReps,
        durationMinutes: customDuration,
        durationText: `${customDuration} mins`,
        restSeconds: customRest,
        intensity: customIntensity,
        difficulty: customDifficulty,
        frequencyDays: customFrequencyDays,
        doctorNotes: customDoctorNotes,
        targetMuscles: targetMusclesArray,
        compositeImageUrl: hasAiVisual ? selectedVisualUrl : undefined,
        instructions: instructionsArray.length ? instructionsArray : editingExercise.instructions
      });
      setSaveToast(`Updated "${customName}" parameters for ${patient.name}!`);
    } else if (modalTab === 'custom') {
      // Add custom exercise
      addExerciseToPatientPlan(patient.id, {
        name: customName.trim(),
        category: customCategory,
        purpose: customPurpose,
        description: customPurpose,
        howToPerform: customHowTo,
        sets: customSets,
        reps: customReps,
        durationMinutes: customDuration,
        durationText: `${customDuration} mins`,
        restSeconds: customRest,
        intensity: customIntensity,
        difficulty: customDifficulty,
        frequencyDays: customFrequencyDays,
        doctorNotes: customDoctorNotes,
        targetMuscles: targetMusclesArray,
        primaryMover: targetMusclesArray[0] || 'Full Body',
        compositeImageUrl: hasAiVisual ? selectedVisualUrl : undefined,
        isCustomActivity: true,
        hasAiVisual,
        instructions: instructionsArray.length ? instructionsArray : [customHowTo || 'Perform as instructed by dietitian.']
      });
      setSaveToast(`Added "${customName}" to ${patient.name}’s plan!`);
    } else if (selectedLibraryItem) {
      // Add from library
      addExerciseToPatientPlan(patient.id, {
        name: selectedLibraryItem.name,
        category: selectedLibraryItem.category,
        guideId: selectedLibraryItem.id,
        compositeImageUrl: selectedLibraryItem.compositeImageUrl,
        sets: customSets || selectedLibraryItem.recommendedDose.sets,
        reps: customReps || selectedLibraryItem.recommendedDose.repsOrDuration,
        restSeconds: customRest || selectedLibraryItem.recommendedDose.restBetweenSets,
        durationMinutes: customDuration || 15,
        durationText: `${customDuration || 15} mins`,
        intensity: customIntensity,
        difficulty: customDifficulty,
        frequencyDays: customFrequencyDays,
        doctorNotes: customDoctorNotes || `Focus on controlled tempo and proper joint alignment.`,
        purpose: selectedLibraryItem.purpose,
        targetMuscles: selectedLibraryItem.targetMuscles,
        primaryMover: selectedLibraryItem.primaryMover,
        secondaryStabilizers: selectedLibraryItem.secondaryStabilizers,
        tempoGuidance: selectedLibraryItem.tempoGuidance,
        instructions: selectedLibraryItem.stepByStepInstructions
      });
      setSaveToast(`Assigned "${selectedLibraryItem.name}" to ${patient.name}!`);
    }

    setIsModalOpen(false);
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleRemoveExercise = (exerciseId: string, exerciseName: string) => {
    if (!patient) return;
    if (window.confirm(`Are you sure you want to remove "${exerciseName}" from ${patient.name}'s plan?`)) {
      removeExerciseFromPatientPlan(patient.id, exerciseId);
      setSaveToast(`Removed "${exerciseName}" from patient plan.`);
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
                Clinical Exercise & Movement Management
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
              Prescribing for: <strong className="text-[#183153]">{patient.name}</strong> ({patient.patientCode}) • Flexibility to add any exercise or custom activity
            </p>
          </div>
        </div>

        {/* Top Controls: Patient Selector & Actions */}
        <div className="flex items-center flex-wrap gap-2.5">
          <PatientSelector />

          {/* Add Custom Exercise Button */}
          <button
            onClick={handleOpenCreateCustom}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-teal-800 text-white hover:bg-teal-900 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-teal-300" />
            <span>➕ Add Any Exercise / Activity</span>
          </button>

          {/* Browse Library Button */}
          <button
            onClick={handleOpenBrowseLibrary}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
          >
            <Layers className="w-4 h-4 text-slate-500" />
            <span>Browse Library</span>
          </button>

          {/* Publish Live */}
          <button
            onClick={handlePublishPlan}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs hover:shadow transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publish to Patient</span>
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
            <Stethoscope className="w-3.5 h-3.5" />
            Doctor Exercise Prescription
          </div>
          <h2 className="text-xl font-bold text-white">
            {patient.name}’s Tailored Exercise Routine
          </h2>
          <p className="text-xs text-emerald-100/90 leading-relaxed">
            You have the complete flexibility to add any exercise, walking protocol, sport, yoga flow, or home routine. Each exercise can include purpose-built visual sequences or written clinical guidance.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 shrink-0 text-xs">
          <div className="text-center px-2">
            <span className="text-[10px] uppercase font-bold text-slate-300 block">Prescribed</span>
            <span className="text-base font-black text-white">{assignedExercises.length} Movements</span>
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

      {/* Quick 1-Click Activity Presets Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-teal-600" />
            Quick Prescribe Common Activities & Custom Routines:
          </span>
          <span className="text-[11px] text-slate-500">
            Click any activity to customize and assign to {patient.name}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {COMMON_ACTIVITY_PRESETS.map((preset, pIdx) => (
            <button
              key={pIdx}
              onClick={() => {
                handleOpenCreateCustom();
                handleApplyPreset(preset);
              }}
              className="px-3.5 py-2 bg-slate-50 hover:bg-teal-50 hover:border-teal-300 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span className="text-base">{preset.icon}</span>
              <span>{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* List of Assigned Exercises for this Patient */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-teal-600" />
            Assigned Exercises for {patient.name} ({assignedExercises.length})
          </h2>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenCreateCustom}
              className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Exercise</span>
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={handleOpenBrowseLibrary}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Browse Library
            </button>
          </div>
        </div>

        {assignedExercises.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-10 text-center space-y-4">
            <Dumbbell className="w-12 h-12 text-slate-300 mx-auto" />
            <div className="max-w-md mx-auto">
              <h3 className="text-base font-bold text-slate-800">No exercises assigned to {patient.name} yet</h3>
              <p className="text-xs text-slate-500 mt-1">
                You can add any exercise, walking protocol, swimming, yoga flow, or gym routine tailored to {patient.name}'s specific health condition.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handleOpenCreateCustom}
                className="px-4 py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Any Custom Exercise
              </button>
              <button
                onClick={handleOpenBrowseLibrary}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Browse Library
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignedExercises.map((exercise) => {
              const guideMatch = EXERCISE_GUIDE_CATALOG.find(g => g.name.toLowerCase() === exercise.name.toLowerCase() || g.id === exercise.guideId);
              const displayImage = exercise.compositeImageUrl || guideMatch?.compositeImageUrl;

              return (
                <div 
                  key={exercise.id}
                  className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4 hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200">
                            {exercise.category || 'Cardio & Strength'}
                          </span>
                          {exercise.isCustomActivity && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                              Custom Prescription
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-black text-slate-900">
                          {exercise.name}
                        </h3>
                        {exercise.purpose && (
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                            {exercise.purpose}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleOpenEditModal(exercise)}
                          className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit Exercise Parameters"
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

                    {/* Continuous 4-Pose Visual Thumbnail if available */}
                    {displayImage ? (
                      <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                        <img
                          src={displayImage}
                          alt={exercise.name}
                          className="w-full h-28 object-cover"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100 flex items-center gap-2.5 text-xs text-teal-900 font-medium">
                        <FileText className="w-4 h-4 text-teal-600 shrink-0" />
                        <span>Written Clinical Protocol & Form Instructions</span>
                      </div>
                    )}

                    {/* Prescribed Parameters Grid */}
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 block font-semibold">Sets</span>
                        <span className="font-bold text-slate-900">{exercise.sets || 1} {exercise.sets === 1 ? 'Set' : 'Sets'}</span>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 block font-semibold">Reps / Duration</span>
                        <span className="font-bold text-slate-900">{exercise.reps || `${exercise.durationMinutes || 20} mins`}</span>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 block font-semibold">Rest</span>
                        <span className="font-bold text-slate-900">{exercise.restSeconds || '60s'}</span>
                      </div>
                    </div>

                    {/* How to Perform summary */}
                    {exercise.howToPerform && (
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-700">
                        <strong>Execution:</strong> {exercise.howToPerform}
                      </div>
                    )}

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
          ADD ANY EXERCISE / CUSTOM ACTIVITY & PARAMETERS MODAL
          ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header & Tabs */}
            <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-teal-50/60 to-white flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-800 bg-teal-100 px-2 py-0.5 rounded-md">
                    {editingExercise ? 'Edit Exercise Assignment' : 'Prescribe Exercise for Patient'}
                  </span>
                  <h2 className="text-xl font-black text-slate-900 mt-1">
                    {editingExercise ? `Edit "${editingExercise.name}"` : 'Add Any Custom Exercise or Physical Activity'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Patient: <strong>{patient.name}</strong> ({patient.patientCode})
                  </p>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mode Switcher Tabs */}
              {!editingExercise && (
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setModalTab('custom')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      modalTab === 'custom'
                        ? 'bg-teal-800 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    ✏️ Create Custom Exercise / Activity
                  </button>
                  <button
                    onClick={() => setModalTab('library')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      modalTab === 'library'
                        ? 'bg-teal-800 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    📚 Select from Existing Guided Library
                  </button>
                </div>
              )}
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* TAB 1: CREATE COMPLETELY CUSTOM EXERCISE */}
              {modalTab === 'custom' && (
                <div className="space-y-5">
                  
                  {/* Quick Preset Picker */}
                  {!editingExercise && (
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <span className="text-[11px] font-bold text-slate-600 block">
                        ⚡ Quick-fill common activity templates:
                      </span>
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                        {COMMON_ACTIVITY_PRESETS.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleApplyPreset(preset)}
                            className="px-2.5 py-1 bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-lg text-xs font-medium text-slate-700 whitespace-nowrap cursor-pointer transition-colors"
                          >
                            {preset.icon} {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Exercise Name & Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Exercise / Activity Name: *
                      </label>
                      <input
                        type="text"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        placeholder="e.g. Post-Meal Brisk Walk, Dumbbell Lunges, Yoga Flow..."
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 font-bold text-slate-900"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Category:
                      </label>
                      <select
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 font-medium"
                      >
                        <option value="Cardio & Metabolic">Cardio & Metabolic (Walking, Cycling, Jogging)</option>
                        <option value="Strength & Tone">Strength & Tone (Weights, Calisthenics, Bands)</option>
                        <option value="Core & Posture">Core & Posture (Plank, Bird-Dog, Pilates)</option>
                        <option value="Mobility & Yoga">Mobility & Yoga (Stretching, Sun Salutation)</option>
                        <option value="Rehab / Low-Impact">Rehab / Low-Impact (Joint-friendly, Swimming)</option>
                        <option value="Sports & Lifestyle">Sports & Lifestyle (Badminton, Tennis, Hiking)</option>
                      </select>
                    </div>
                  </div>

                  {/* Clinical Description / Purpose */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Clinical Purpose / What this exercise is for:
                    </label>
                    <textarea
                      rows={2}
                      value={customPurpose}
                      onChange={(e) => setCustomPurpose(e.target.value)}
                      placeholder="e.g. Clears post-meal blood sugar spikes, accelerates fat burning, and relieves lower back tension..."
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 font-medium"
                    />
                  </div>

                  {/* How to Perform / Step-by-Step Instructions */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      How to Perform / Form Guidance:
                    </label>
                    <textarea
                      rows={3}
                      value={customHowTo}
                      onChange={(e) => setCustomHowTo(e.target.value)}
                      placeholder="e.g. 1. Start with tall posture and soft knees. 2. Push hips back into hinge. 3. Squeeze glutes to stand tall..."
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 font-medium"
                    />
                  </div>

                  {/* Prescription Parameters Grid */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-teal-600" />
                      Prescription Dosages & Target Schedule:
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Sets */}
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Sets:
                        </label>
                        <select
                          value={customSets}
                          onChange={(e) => setCustomSets(Number(e.target.value))}
                          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-teal-500 font-bold"
                        >
                          <option value={1}>1 Set (Continuous)</option>
                          <option value={2}>2 Sets</option>
                          <option value={3}>3 Sets</option>
                          <option value={4}>4 Sets</option>
                          <option value={5}>5 Sets</option>
                        </select>
                      </div>

                      {/* Reps / Distance / Duration */}
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Reps / Distance:
                        </label>
                        <input
                          type="text"
                          value={customReps}
                          onChange={(e) => setCustomReps(e.target.value)}
                          placeholder="e.g. 12-15 reps, 3.5 km, 4,000 steps"
                          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-teal-500 font-medium"
                        />
                      </div>

                      {/* Duration in Mins */}
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Session Duration:
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={customDuration}
                            onChange={(e) => setCustomDuration(Number(e.target.value))}
                            className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-teal-500 font-bold"
                          />
                          <span className="text-xs text-slate-500 font-medium shrink-0">mins</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Rest Time */}
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Rest Between Sets:
                        </label>
                        <select
                          value={customRest}
                          onChange={(e) => setCustomRest(e.target.value)}
                          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-teal-500 font-medium"
                        >
                          <option value="Continuous / None">Continuous / None</option>
                          <option value="30 seconds">30 seconds</option>
                          <option value="45 seconds">45 seconds</option>
                          <option value="60 seconds">60 seconds</option>
                          <option value="75 seconds">75 seconds</option>
                          <option value="90 seconds">90 seconds</option>
                        </select>
                      </div>

                      {/* Difficulty */}
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Difficulty / Level:
                        </label>
                        <select
                          value={customDifficulty}
                          onChange={(e) => setCustomDifficulty(e.target.value)}
                          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-teal-500 font-medium"
                        >
                          <option value="Beginner">Beginner / Gentle</option>
                          <option value="Moderate">Moderate</option>
                          <option value="Advanced">Advanced / High Intensity</option>
                        </select>
                      </div>

                      {/* Intensity */}
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Metabolic Intensity:
                        </label>
                        <select
                          value={customIntensity}
                          onChange={(e) => setCustomIntensity(e.target.value)}
                          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-teal-500 font-medium"
                        >
                          <option value="Low">Zone 1 - Recovery</option>
                          <option value="Moderate">Zone 2 - Fat Oxidation</option>
                          <option value="High">Zone 3 - Conditioning</option>
                        </select>
                      </div>
                    </div>

                    {/* Assigned Days */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">
                        Assigned Frequency Days:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                          const isChecked = customFrequencyDays.includes(day);
                          return (
                            <button
                              key={day}
                              type="button"
                              onClick={() => {
                                setCustomFrequencyDays(prev => 
                                  isChecked ? prev.filter(d => d !== day) : [...prev, day]
                                );
                              }}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                isChecked 
                                  ? 'bg-teal-800 text-white shadow-2xs' 
                                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Target Muscles */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Target Muscles / Body Focus:
                    </label>
                    <input
                      type="text"
                      value={customTargetMuscles}
                      onChange={(e) => setCustomTargetMuscles(e.target.value)}
                      placeholder="e.g. Quadriceps, Glutes, Hamstrings, Core"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 font-medium"
                    />
                  </div>

                  {/* AI Visual Demonstration Option */}
                  <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-teal-950 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-teal-600" />
                          AI Movement Demonstration Graphic:
                        </span>
                        <p className="text-[11px] text-teal-800 mt-0.5">
                          Include a purpose-built continuous 4-pose demonstration graphic or use written clinical instructions only.
                        </p>
                      </div>

                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hasAiVisual}
                          onChange={(e) => setHasAiVisual(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-700"></div>
                      </label>
                    </div>

                    {hasAiVisual && (
                      <div className="space-y-2 pt-2 border-t border-teal-200/60">
                        <span className="text-[10px] font-bold text-teal-900 uppercase tracking-wider block">
                          Select Matching 4-Pose Demonstration Visual Template:
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {[
                            { name: 'Brisk Walking', url: '/exercises/walking_guide.jpg' },
                            { name: 'Goblet Squats', url: '/exercises/squat_guide.jpg' },
                            { name: 'Romanian Deadlift', url: '/exercises/rdl_guide.jpg' },
                            { name: 'Glute Bridges', url: '/exercises/glute_bridge_guide.jpg' },
                            { name: 'Forearm Plank', url: '/exercises/plank_guide.jpg' },
                            { name: 'Bird-Dog', url: '/exercises/bird_dog_guide.jpg' },
                            { name: 'Band Rows', url: '/exercises/band_row_guide.jpg' },
                            { name: 'Yoga Flow', url: '/exercises/yoga_guide.jpg' },
                          ].map((tmpl, tIdx) => (
                            <div
                              key={tIdx}
                              onClick={() => setSelectedVisualUrl(tmpl.url)}
                              className={`p-1.5 rounded-xl border transition-all cursor-pointer text-center ${
                                selectedVisualUrl === tmpl.url
                                  ? 'bg-teal-900 text-white border-teal-950 ring-2 ring-teal-500/20'
                                  : 'bg-white border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              <img src={tmpl.url} alt={tmpl.name} className="w-full h-14 object-cover rounded-lg mb-1" />
                              <span className="text-[10px] font-bold block truncate">{tmpl.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Doctor's Custom Clinical Notes */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Doctor's Custom Clinical Advice / Precautions for {patient.name}:
                    </label>
                    <textarea
                      rows={2}
                      value={customDoctorNotes}
                      onChange={(e) => setCustomDoctorNotes(e.target.value)}
                      placeholder="e.g. Avoid high-impact jumping. Keep heart rate under 135 BPM..."
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 font-medium"
                    />
                  </div>

                </div>
              )}

              {/* TAB 2: SELECT FROM EXISTING GUIDED LIBRARY */}
              {modalTab === 'library' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        placeholder="Search guided library by name, body area, muscle..."
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

                  {/* Grid of Library Items */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto p-1 border border-slate-100 rounded-2xl bg-slate-50/50">
                    {filteredCatalog.map(item => {
                      const isSelected = selectedLibraryItem?.id === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            setSelectedLibraryItem(item);
                            setCustomName(item.name);
                            setCustomCategory(item.category);
                            setCustomPurpose(item.purpose);
                            setCustomSets(item.recommendedDose.sets || 3);
                            setCustomReps(item.recommendedDose.repsOrDuration || '12-15 reps');
                            setCustomRest(item.recommendedDose.restBetweenSets || '60 seconds');
                            setCustomTargetMuscles(item.targetMuscles.join(', '));
                            setCustomHowTo(item.stepByStepInstructions.join('\n'));
                            setHasAiVisual(true);
                            setSelectedVisualUrl(item.compositeImageUrl);
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

                  {/* Selected Preview */}
                  {selectedLibraryItem && (
                    <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-teal-800">
                            Selected Movement
                          </span>
                          <h3 className="text-base font-black text-slate-900">
                            {selectedLibraryItem.name}
                          </h3>
                        </div>

                        <span className="text-xs bg-white text-teal-900 px-2.5 py-1 rounded-lg font-bold border border-teal-200">
                          🎯 {selectedLibraryItem.primaryMover}
                        </span>
                      </div>

                      <div className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-2xs">
                        <img
                          src={selectedLibraryItem.compositeImageUrl}
                          alt={selectedLibraryItem.name}
                          className="w-full h-32 object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveExercise}
                className="px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
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
