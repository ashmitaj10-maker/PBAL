import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { calculateBmi } from '../../utils/nutritionCalculators';
import { 
  ArrowLeft, 
  User, 
  Scale, 
  Heart, 
  CreditCard, 
  FileText, 
  PlusCircle, 
  Calendar, 
  Phone, 
  Mail, 
  Activity, 
  TrendingDown, 
  CheckCircle2, 
  AlertCircle, 
  Utensils, 
  ShieldAlert, 
  Receipt, 
  Clock, 
  Edit, 
  Trash2,
  Share2,
  Sparkles,
  ClipboardCheck,
  Dumbbell,
  Smartphone,
  Eye,
  ChevronRight,
  MessageSquare,
  Bot,
  Mic,
  Save,
  Check,
  ShieldCheck,
  Pause,
  Play,
  X
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { formatDate, formatDateTime } from '../../utils/dateUtils';
import { VoiceRecorderAndPlayer } from './VoiceRecorderAndPlayer';
import { PatientSelector } from './PatientSelector';

export const PatientProfileView: React.FC = () => {
  const { 
    selectedPatient, 
    navigateTo, 
    updatePatient,
    getPatientWeightHistory, 
    setIsWeightModalOpen, 
    setIsPaymentModalOpen,
    payments,
    invoices,
    setSelectedInvoiceId,
    currentClinic,
    getPatientAssessments,
    getActiveMealPlan,
    getPatientExercisePlan,
    isPatientSession,
    users,
    pausePatientPlan,
    resumePatientPlan
  } = useClinic();

  const [activeProfileTab, setActiveProfileTab] = useState<'overview' | 'nutrition_ai' | 'weight' | 'billing'>('overview');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedNotes, setEditedNotes] = useState('');
  const [noteSavedFeedback, setNoteSavedFeedback] = useState(false);
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
  const [pauseReasonInput, setPauseReasonInput] = useState('');

  if (!selectedPatient) {
    return (
      <div className="py-16 text-center space-y-4">
        <User className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-lg font-bold text-[#183153]">No Patient Selected</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Please select a patient from the patient directory to view their clinical profile.
        </p>
        <button
          onClick={() => navigateTo(isPatientSession ? 'patient_portal' : 'patients')}
          className="px-4 py-2 bg-[#183153] text-white rounded-xl text-xs font-semibold"
        >
          {isPatientSession ? 'Go to Patient Dashboard' : 'Go to Patient Directory'}
        </button>
      </div>
    );
  }

  const patient = selectedPatient;
  const assignedDietician = (users || []).find(u => u.id === patient?.assignedDoctorId) || users[0];
  const bmiInfo = calculateBmi(patient.currentWeightKg, patient.heightCm);
  const startBmiInfo = calculateBmi(patient.startingWeightKg, patient.heightCm);
  const weightHistory = getPatientWeightHistory(patient.id);
  const totalLost = Number((patient.startingWeightKg - patient.currentWeightKg).toFixed(1));
  const targetRemaining = Number((patient.currentWeightKg - patient.targetWeightKg).toFixed(1));

  // Phase 2 Data
  const assessments = getPatientAssessments(patient.id);
  const latestAssessment = assessments[0];
  const activeMealPlan = getActiveMealPlan(patient.id);
  const exercisePlan = getPatientExercisePlan(patient.id);

  // Patient specific payments & invoices
  const patientPayments = payments.filter(p => p.patientId === patient.id);
  const patientInvoices = invoices.filter(i => i.patientId === patient.id);
  const totalBilled = patientPayments.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalPaid = patientPayments.reduce((acc, curr) => acc + curr.paidAmount, 0);
  const pendingBalance = patientPayments.reduce((acc, curr) => acc + curr.pendingBalance, 0);

  // Chart data for weight tracking
  const chartData = (weightHistory || []).map(w => ({
    date: w.date,
    weight: w.weightKg,
    bmi: w.bmi,
    notes: w.notes
  }));

  const handleSavePatientAudio = (audioUrl: string, durationSeconds: number) => {
    if (isPatientSession) return;
    const dateStr = formatDateTime(new Date());
    updatePatient(patient.id, {
      voiceAudioUrl: audioUrl,
      voiceAudioDuration: durationSeconds,
      voiceAudioDate: dateStr
    });
  };

  const handleDeletePatientAudio = () => {
    if (isPatientSession) return;
    updatePatient(patient.id, {
      voiceAudioUrl: undefined,
      voiceAudioDuration: 0,
      voiceAudioDate: undefined
    });
  };

  const handleStartEditNotes = () => {
    if (isPatientSession) return;
    setEditedNotes(patient.consultationNotes || patient.notes || '');
    setIsEditingNotes(true);
  };

  const handleSaveNotes = () => {
    if (isPatientSession) return;
    updatePatient(patient.id, {
      notes: editedNotes.trim(),
      consultationNotes: editedNotes.trim()
    });
    setIsEditingNotes(false);
    setNoteSavedFeedback(true);
    setTimeout(() => setNoteSavedFeedback(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Action Strip */}
      {isPatientSession ? (
        <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-teal-950">
                Supervised Health Profile (Read-Only)
              </h3>
              <p className="text-xs text-teal-800">
                Medically managed by <strong>{assignedDietician?.name || 'Dr. Ashmita Joshi'}</strong>. Contact your dietitian to request changes.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigateTo('patient_chat')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Message Dietitian</span>
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center flex-wrap gap-2.5">
            <button
              onClick={() => navigateTo('patients')}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#183153] transition-colors cursor-pointer py-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Patient Directory</span>
              <span className="sm:hidden">Directory</span>
            </button>
            <PatientSelector />
          </div>

          {/* Doctor Quick Action Buttons */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={() => navigateTo('assessment', { patientId: patient.id })}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#183153] text-xs font-semibold transition-colors cursor-pointer"
            >
              <ClipboardCheck className="w-3.5 h-3.5 text-[#6BBF59]" />
              <span>Assessment Intake</span>
            </button>

            <button
              onClick={() => navigateTo('ai_meal_builder', { patientId: patient.id })}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>AI Meal Builder</span>
            </button>

            <button
              onClick={() => navigateTo('exercise_planner', { patientId: patient.id })}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Dumbbell className="w-3.5 h-3.5 text-amber-600" />
              <span>Exercise Planner</span>
            </button>

            <button
              onClick={() => navigateTo('patient_chat', { patientId: patient.id })}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
              <span>In-App Chat</span>
            </button>

            <button
              onClick={() => navigateTo('ai_copilot', { patientId: patient.id })}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5 text-teal-600" />
              <span>Doctor Copilot</span>
            </button>

            <button
              onClick={() => navigateTo('patient_portal', { patientId: patient.id })}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#6BBF59] hover:bg-[#5EAB4D] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Patient App Preview</span>
            </button>

            {/* Pause / Resume Plan Action (Doctor Authority) */}
            {patient.status === 'paused' ? (
              <button
                onClick={() => resumePatientPlan(patient.id)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                title="Resume this patient's plan, billing and reminders"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Resume Plan</span>
              </button>
            ) : (
              <button
                onClick={() => setIsPauseModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-bold transition-all cursor-pointer"
                title="Pause this patient's plan, billing and reminders"
              >
                <Pause className="w-3.5 h-3.5 text-amber-700" />
                <span>Pause Plan</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* PLAN PAUSED ALERT BANNER */}
      {patient.status === 'paused' && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-300/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-xs shrink-0 mt-0.5">
              <Pause className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-extrabold text-amber-950">Plan Currently Paused</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-200 text-amber-950 border border-amber-300">
                  Paused on {formatDate(patient.pauseDetails?.pausedAt || patient.renewalDate)}
                </span>
                {patient.pauseDetails?.pausedBy && (
                  <span className="text-xs text-amber-800 font-medium">
                    by {patient.pauseDetails.pausedBy}
                  </span>
                )}
              </div>
              <p className="text-xs text-amber-900 mt-1 font-medium">
                <strong>Reason:</strong> {patient.pauseDetails?.pauseReason || 'Doctor initiated pause'}.
              </p>
              <p className="text-[11px] text-amber-800 mt-0.5">
                • <strong>Payment & Billing:</strong> Recurring fee debits are paused. Previous transaction records are fully preserved.<br />
                • <strong>Notifications:</strong> Future automated meal and diet plan preparation reminders are stopped.<br />
                • <strong>Patient Access:</strong> Patient retains complete read-only access to historical meal plans, weight logs, and assessments.
              </p>
            </div>
          </div>

          {!isPatientSession ? (
            <button
              onClick={() => resumePatientPlan(patient.id)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4" />
              <span>Resume Plan Now</span>
            </button>
          ) : (
            <button
              onClick={() => navigateTo('patient_chat')}
              className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Message Dietitian</span>
            </button>
          )}
        </div>
      )}

      {/* PATIENT SUMMARY DOSSIER BANNER */}
      <div className="medical-card p-6 bg-gradient-to-r from-[#183153] to-[#244673] text-white rounded-2xl shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Avatar & Key Demographics */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white text-2xl font-black shrink-0">
              {patient.name.charAt(0)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{patient.name}</h1>
                <span className="px-2 py-0.5 rounded-md bg-white/20 text-emerald-300 font-mono text-xs font-semibold">
                  {patient.patientCode}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold capitalize ${
                  patient.status === 'paused'
                    ? 'bg-amber-400 text-amber-950 border border-amber-500'
                    : 'bg-[#6BBF59] text-white'
                }`}>
                  {patient.status === 'paused' ? '⏸️ Paused' : (patient?.status ? patient.status.replace('_', ' ') : 'Active')}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white/15 text-slate-200">
                  {patient.foodPreference}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-2 text-xs text-slate-300">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#6BBF59]" /> {patient.mobile}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-[#6BBF59]" /> {patient.email}
                </span>
                <span>• {patient.age} yrs • {patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}</span>
                <span>• Joined {formatDate(patient.joiningDate)}</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-3 bg-white/10 p-3 rounded-xl border border-white/10 text-center">
            <div className="px-2">
              <div className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">Current Weight</div>
              <div className="text-lg font-black text-white mt-0.5">{patient.currentWeightKg} <span className="text-xs font-normal text-slate-300">kg</span></div>
              <div className="text-[10px] text-emerald-300 font-medium">-{totalLost} kg lost</div>
            </div>

            <div className="px-2 border-x border-white/10">
              <div className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">Target Weight</div>
              <div className="text-lg font-black text-white mt-0.5">{patient.targetWeightKg} <span className="text-xs font-normal text-slate-300">kg</span></div>
              <div className="text-[10px] text-slate-300">{targetRemaining > 0 ? `${targetRemaining} kg left` : 'Goal Met!'}</div>
            </div>

            <div className="px-2">
              <div className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">Current BMI</div>
              <div className="text-lg font-black text-white mt-0.5">{bmiInfo.bmi}</div>
              <div className="text-[10px] text-emerald-300 font-medium">{bmiInfo.category.split(' ')[0]}</div>
            </div>
          </div>

        </div>

        {/* Tab Navigation */}
        <div className="flex items-center flex-wrap gap-2 mt-6 pt-4 border-t border-white/10 text-xs">
          <button
            onClick={() => setActiveProfileTab('overview')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              activeProfileTab === 'overview' ? 'bg-white text-[#183153]' : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Clinical Overview & Profile
          </button>
          <button
            onClick={() => setActiveProfileTab('nutrition_ai')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeProfileTab === 'nutrition_ai' ? 'bg-white text-[#183153]' : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#6BBF59]" />
            <span>AI Nutrition & Movement Protocol</span>
          </button>
          <button
            onClick={() => setActiveProfileTab('weight')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              activeProfileTab === 'weight' ? 'bg-white text-[#183153]' : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Weight Tracking & History ({weightHistory.length})
          </button>
          <button
            onClick={() => setActiveProfileTab('billing')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              activeProfileTab === 'billing' ? 'bg-white text-[#183153]' : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Financial & Invoices ({patientInvoices.length})
          </button>
        </div>
      </div>

      {/* TAB 1: CLINICAL OVERVIEW & METRICS */}
      {activeProfileTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Physical & Auto BMI Gauge (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Auto BMI Calculation & Category Card */}
            <div className="medical-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#6BBF59] flex items-center justify-center">
                    <Scale className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#183153]">Auto Body Mass Index (BMI)</h3>
                    <p className="text-[11px] text-slate-500">Calculated from Height: {patient.heightCm} cm & Weight: {patient.currentWeightKg} kg</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: `${bmiInfo.color}15`, color: bmiInfo.color }}>
                  {bmiInfo.category}
                </span>
              </div>

              {/* Visual BMI Gauge Meter */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                  <span>Underweight (&lt;18.5)</span>
                  <span>Optimal (18.5-24.9)</span>
                  <span>Overweight (25-29.9)</span>
                  <span>Obese (&gt;30)</span>
                </div>
                <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                  <div className="h-full bg-blue-400 w-[20%]" title="Underweight"></div>
                  <div className="h-full bg-[#6BBF59] w-[35%]" title="Optimal Health"></div>
                  <div className="h-full bg-amber-400 w-[25%]" title="Overweight"></div>
                  <div className="h-full bg-rose-500 w-[20%]" title="Obesity"></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Starting BMI: {startBmiInfo.bmi}</span>
                  <span className="font-bold text-[#183153]">Current: {bmiInfo.bmi} kg/m²</span>
                  <span>Target: {calculateBmi(patient.targetWeightKg, patient.heightCm).bmi}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F8FFF8] border border-[#E4E9E4] text-xs space-y-1 text-slate-700">
                <div className="font-semibold text-[#183153]">Clinical Body Composition Assessment:</div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Patient has successfully dropped from starting BMI {startBmiInfo.bmi} ({startBmiInfo.category}) to {bmiInfo.bmi}. Target healthy bodyweight for {patient.heightCm}cm height is between 54kg - 72kg.
                </p>
              </div>
            </div>

            {/* Medical History & Clinical Conditions */}
            <div className="medical-card p-5 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#183153]">Medical Conditions & Clinical Flags</h3>
                  <p className="text-[11px] text-slate-500">Documented pathologies and biochemical considerations</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Diagnosed Conditions</div>
                <div className="flex flex-wrap gap-1.5">
                  {patient.medicalConditions && patient.medicalConditions.length > 0 ? (
                    (patient.medicalConditions || []).map((cond, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-50 border border-rose-200 text-rose-800">
                        {cond}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">No medical conditions reported</span>
                  )}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Allergies & Food Intolerances</div>
                <div className="flex flex-wrap gap-1.5">
                  {patient.allergies && patient.allergies.length > 0 ? (
                    (patient.allergies || []).map((all, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 border border-amber-200 text-amber-900">
                        ⚠️ {all}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">No allergies recorded</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dietary Preferences & Goals (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Primary Goals & Nutritional Archetype */}
            <div className="medical-card p-5 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#183153]">Primary Therapeutic Goals</h3>
                  <p className="text-[11px] text-slate-500">Target milestones agreed during clinical onboarding</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {patient.primaryGoals && patient.primaryGoals.length > 0 ? (
                    (patient.primaryGoals || []).map((goal, idx) => (
                      <span key={idx} className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#F8FFF8] border border-emerald-200 text-[#183153] flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#6BBF59]" />
                        {goal}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">No goals assigned</span>
                  )}
                </div>
              </div>

              {/* Food Preference Badge */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-semibold text-slate-500">Dietary Archetype</div>
                  <div className="text-sm font-bold text-[#183153]">{patient.foodPreference}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-semibold text-slate-500">Assigned Clinical Plan</div>
                  <div className="text-xs font-bold text-[#6BBF59]">{patient.assignedPlanName || '3-Month Metabolic Care'}</div>
                </div>
              </div>

              {/* Doctor / Dietitian Clinical Notes & Voice Memo Controls (STRICTLY HIDDEN IN PATIENT SESSION) */}
              {!isPatientSession ? (
                <>
                  {/* Clinical Consultation Notes (Interactive Editor - Doctor Only) */}
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-emerald-50 text-[#6BBF59]">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-[#183153]">Doctor Clinical Intake Notes</h4>
                          <p className="text-[10px] text-slate-500">Documented observations, habits & metabolic guidelines</p>
                        </div>
                      </div>

                      {!isEditingNotes ? (
                        <button
                          onClick={handleStartEditNotes}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit className="w-3 h-3 text-slate-600" />
                          <span>Edit Notes</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setIsEditingNotes(false)}
                            className="px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveNotes}
                            className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-white bg-[#6BBF59] hover:bg-[#5EAB4D] rounded-lg transition-colors shadow-xs cursor-pointer"
                          >
                            <Save className="w-3 h-3" />
                            <span>Save Notes</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {noteSavedFeedback && (
                      <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] font-semibold text-emerald-800 flex items-center gap-1.5 animate-in fade-in">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Clinical consultation notes saved successfully to patient chart.</span>
                      </div>
                    )}

                    {!isEditingNotes ? (
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed whitespace-pre-line font-normal">
                        {patient.consultationNotes || patient.notes || (
                          <span className="italic text-slate-400">No consultation notes documented for this patient yet. Click "Edit Notes" to add clinical impressions.</span>
                        )}
                      </div>
                    ) : (
                      <textarea
                        rows={5}
                        value={editedNotes}
                        onChange={(e) => setEditedNotes(e.target.value)}
                        placeholder="Enter clinical consultation notes, dietary history, lab insights, or patient guidelines..."
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#183153] leading-relaxed focus:bg-white focus:ring-2 focus:ring-[#6BBF59]/30 outline-none resize-y"
                      />
                    )}
                  </div>

                  {/* Voice Consultation Audio Memo & Replay (Doctor / Dietitian Only) */}
                  <VoiceRecorderAndPlayer
                    audioUrl={patient.voiceAudioUrl}
                    audioDuration={patient.voiceAudioDuration}
                    recordedDate={patient.voiceAudioDate}
                    title="Doctor Voice Consultation Memo"
                    subtitle="Replay recorded intake audio, listen with variable speeds, scrub waveform, or record updated clinical audio memos."
                    onSaveAudio={handleSavePatientAudio}
                    onDeleteAudio={handleDeletePatientAudio}
                  />
                </>
              ) : (
                /* Patient Clean Read-Only Care & Support Card (No doctor notes, no voice memos) */
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                    <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Clinical Care Team</h4>
                      <p className="text-[10px] text-slate-500">Your assigned clinical nutritionist & support</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 p-3.5 bg-gradient-to-r from-teal-50/80 to-emerald-50/60 rounded-2xl border border-teal-200/80">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-teal-700 text-white flex items-center justify-center text-sm font-bold shadow-2xs">
                        👩‍⚕️
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{assignedDietician?.name || 'Dr. Ashmita Joshi'}</div>
                        <p className="text-[11px] text-teal-700 font-medium">{assignedDietician?.roleTitle || 'Clinical Dietitian & Metabolic Nutritionist'}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => navigateTo('patient_chat')}
                      className="px-3.5 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Protocol</span>
                      <span className="text-xs font-bold text-slate-800 mt-0.5 block">{patient.assignedPlanName || '3-Month Metabolic Care'}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Daily Hydration Target</span>
                      <span className="text-xs font-bold text-slate-800 mt-0.5 block">{patient.dailyWaterLiters || 2.5} Liters / Day</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
                    To modify clinical goals, report new allergies, or request medical protocol updates, please message your dietitian directly in chat.
                  </p>
                </div>
              )}
            </div>

            {/* Quick Weight Progress Sparkline Card */}
            <div className="medical-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#183153] flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-[#6BBF59]" />
                  Weight Trajectory Summary
                </h3>
                <button
                  onClick={() => setActiveProfileTab('weight')}
                  className="text-xs text-[#6BBF59] hover:underline font-semibold cursor-pointer"
                >
                  View Full Graph →
                </button>
              </div>

              <div className="h-40 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis domain={['dataMin - 2', 'dataMax + 2']} tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="weight" stroke="#6BBF59" strokeWidth={2.5} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: AI NUTRITION & MOVEMENT PROTOCOL */}
      {activeProfileTab === 'nutrition_ai' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Active AI Meal Plan Card */}
            <div className="medical-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#183153]">Active AI Clinical Meal Plan</h3>
                    <p className="text-xs text-slate-500">{activeMealPlan?.title || 'Personalized Protocol'}</p>
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  activeMealPlan?.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                }`}>
                  {activeMealPlan?.status === 'published' ? 'Published' : 'Draft'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl text-xs font-mono">
                <div>
                  <span className="text-slate-500 block">Daily Calorie Target:</span>
                  <strong className="text-[#183153] text-sm">{activeMealPlan?.targetCalories || 1550} kcal</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Mode:</span>
                  <strong className="text-[#183153] text-sm capitalize">{activeMealPlan?.mode || 'Choice'} Mode (7 Slots)</strong>
                </div>
              </div>

              <div className="flex gap-2">
                {!isPatientSession ? (
                  <button
                    onClick={() => navigateTo('ai_meal_builder', { patientId: patient.id })}
                    className="flex-1 py-2 bg-[#183153] text-white text-xs font-semibold rounded-xl hover:bg-[#244673] transition-colors cursor-pointer"
                  >
                    Open AI Meal Builder
                  </button>
                ) : (
                  <button
                    onClick={() => navigateTo('patient_portal')}
                    className="flex-1 py-2 bg-teal-800 text-white text-xs font-bold rounded-xl hover:bg-teal-900 transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Utensils className="w-3.5 h-3.5" />
                    <span>View Today's Meal Plan</span>
                  </button>
                )}
              </div>
            </div>

            {/* Active Exercise Protocol Card */}
            <div className="medical-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
                    <Dumbbell className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#183153]">Clinical Movement Routine</h3>
                    <p className="text-xs text-slate-500">{exercisePlan?.title || 'Movement Prescription'}</p>
                  </div>
                </div>

                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  {exercisePlan?.frequencyPerWeek || 4} Days/wk
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl text-xs font-mono">
                <div>
                  <span className="text-slate-500 block">Duration / Session:</span>
                  <strong className="text-[#183153] text-sm">{exercisePlan?.targetMinutesPerSession || 35} mins</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Est. Burn:</span>
                  <strong className="text-[#183153] text-sm">{exercisePlan?.estimatedCaloriesBurnPerSession || 220} kcal</strong>
                </div>
              </div>

              <div className="flex gap-2">
                {!isPatientSession ? (
                  <button
                    onClick={() => navigateTo('exercise_planner', { patientId: patient.id })}
                    className="flex-1 py-2 bg-[#183153] text-white text-xs font-semibold rounded-xl hover:bg-[#244673] transition-colors cursor-pointer"
                  >
                    Open Exercise Planner
                  </button>
                ) : (
                  <button
                    onClick={() => navigateTo('patient_exercise')}
                    className="flex-1 py-2 bg-emerald-700 text-white text-xs font-bold rounded-xl hover:bg-emerald-800 transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Dumbbell className="w-3.5 h-3.5" />
                    <span>View Guided Exercises</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: WEIGHT HISTORY & LOGS */}
      {activeProfileTab === 'weight' && (
        <div className="space-y-6">
          <div className="medical-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#183153]">Longitudinal Weight Loss Progress Curve</h3>
                <p className="text-xs text-slate-500">Starting: {patient.startingWeightKg} kg → Current: {patient.currentWeightKg} kg (Target: {patient.targetWeightKg} kg)</p>
              </div>
              {!isPatientSession && (
                <button
                  onClick={() => setIsWeightModalOpen(true)}
                  className="px-3 py-1.5 bg-[#6BBF59] text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  + Log Weight
                </button>
              )}
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="date" tickFormatter={(val) => formatDate(val)} tick={{ fontSize: 11 }} />
                  <YAxis domain={['dataMin - 2', 'dataMax + 2']} tick={{ fontSize: 11 }} />
                  <Tooltip labelFormatter={(val) => formatDate(val)} />
                  <ReferenceLine y={patient.targetWeightKg} stroke="#EF4444" strokeDasharray="4 4" label={{ value: `Target: ${patient.targetWeightKg}kg`, fill: '#EF4444', fontSize: 10 }} />
                  <Line type="monotone" dataKey="weight" stroke="#6BBF59" strokeWidth={3} dot={{ r: 4, fill: '#183153' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FINANCIALS & INVOICES */}
      {activeProfileTab === 'billing' && (
        <div className="space-y-6">
          <div className="medical-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#183153]">{isPatientSession ? 'My Invoices & Receipts' : 'Patient Billing & Invoices'}</h3>
                <p className="text-xs text-slate-500">Total Billed: {currentClinic?.currencySymbol || '₹'}{(totalBilled || 0).toLocaleString()} • Paid: {currentClinic?.currencySymbol || '₹'}{(totalPaid || 0).toLocaleString()} • Balance: {currentClinic?.currencySymbol || '₹'}{(pendingBalance || 0).toLocaleString()}</p>
              </div>
              {!isPatientSession && (
                <button
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="px-3 py-1.5 bg-[#6BBF59] text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Collect Fee
                </button>
              )}
            </div>

            {patient.status === 'paused' && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                <Pause className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  <strong>Subscription Billing on Hold:</strong> Plan is currently paused by doctor. No recurring scheduled fees will be billed until resumed.
                </span>
              </div>
            )}

            <div className="space-y-2">
              {(patientInvoices || []).map(inv => (
                <div 
                  key={inv.id}
                  onClick={() => {
                    setSelectedInvoiceId(inv.id);
                    navigateTo('invoice_preview');
                  }}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-emerald-300 flex items-center justify-between text-xs cursor-pointer transition-all"
                >
                  <div>
                    <span className="font-bold text-[#183153]">{inv.invoiceNumber}</span>
                    <span className="text-slate-500 ml-2 font-mono">{formatDate(inv.issueDate)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-[#183153]">{currentClinic?.currencySymbol || '₹'}{(inv.grandTotal || 0).toLocaleString()}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      inv.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PAUSE PLAN MODAL (DOCTOR / DIETITIAN ONLY) */}
      {isPauseModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Pause className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Pause Patient Plan</h3>
                  <p className="text-xs text-slate-500">{patient.name} ({patient.patientCode})</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsPauseModalOpen(false);
                  setPauseReasonInput('');
                }}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-amber-950">
                <AlertCircle className="w-4 h-4 text-amber-700" />
                <span>What happens when paused:</span>
              </div>
              <ul className="list-disc list-inside text-[11px] text-amber-800 space-y-0.5 ml-1">
                <li>Plan status changes to <strong>Paused</strong> immediately.</li>
                <li>Future scheduled payment dues & subscription billings are put on hold.</li>
                <li>Automated meal/exercise reminders and preparation notices stop.</li>
                <li>Patient retains full access to their past meals, logs, and assessments.</li>
                <li>Only you (the doctor/dietitian) can resume the plan when the patient returns.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Reason for Pause (Optional note for clinical records):
              </label>

              {/* Quick Reason Chips */}
              <div className="flex flex-wrap gap-1.5">
                {['Travel / Out of Station', 'Medical Recovery / Surgery', 'Family Emergency', 'Work / Exam Schedule', 'Temporary Health Break'].map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setPauseReasonInput(r)}
                    className={`px-2 py-1 text-[11px] rounded-lg border transition-colors cursor-pointer ${
                      pauseReasonInput === r
                        ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <textarea
                value={pauseReasonInput}
                onChange={(e) => setPauseReasonInput(e.target.value)}
                placeholder="Enter specific clinical reason or patient request details..."
                rows={3}
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsPauseModalOpen(false);
                  setPauseReasonInput('');
                }}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  pausePatientPlan(patient.id, pauseReasonInput || 'Doctor initiated pause');
                  setIsPauseModalOpen(false);
                  setPauseReasonInput('');
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Pause className="w-3.5 h-3.5" />
                <span>Confirm & Pause Plan</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
