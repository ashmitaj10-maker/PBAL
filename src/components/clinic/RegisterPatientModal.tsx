import React, { useState, useRef } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { FoodPreference } from '../../types/clinic';
import { calculateBmi } from '../../utils/nutritionCalculators';
import { formatDateTime } from '../../utils/dateUtils';
import { 
  X, 
  UserPlus, 
  CheckCircle2, 
  Scale, 
  Heart, 
  Utensils, 
  AlertCircle,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  Mic,
  Plus,
  Trash2,
  FileText,
  Clock,
  BookOpen
} from 'lucide-react';
import { VoiceRecorderAndPlayer } from './VoiceRecorderAndPlayer';

const COMMON_CONDITIONS = [
  'Pre-diabetes',
  'Type 2 Diabetes',
  'PCOS (Polycystic Ovary Syndrome)',
  'Hypothyroidism',
  'Hashimotos Thyroiditis',
  'Fatty Liver (Grade 1/2)',
  'Hypertension',
  'Hyperlipidemia / High Cholesterol',
  'Hyperuricemia / Gout',
  'Insulin Resistance',
  'Acid Reflux / GERD',
  'Chronic Bloating / IBS',
  'Menopause & Hormonal Shift'
];

const COMMON_ALLERGIES = [
  'Dairy / Lactose',
  'Gluten / Wheat',
  'Peanuts & Tree Nuts',
  'Soy & Soy Products',
  'Eggs',
  'Shellfish',
  'Fish',
  'Sesame'
];

const COMMON_INTOLERANCES = [
  'Fructose Intolerance',
  'Histamine Intolerance',
  'FODMAP Sensitivity',
  'Caffeine Sensitivity',
  'Artificial Sweeteners'
];

const COUNTRY_CODES = [
  { code: '+91', label: 'India (+91)', flag: '🇮🇳' },
  { code: '+1', label: 'USA / Canada (+1)', flag: '🇺🇸' },
  { code: '+44', label: 'United Kingdom (+44)', flag: '🇬🇧' },
  { code: '+971', label: 'UAE (+971)', flag: '🇦🇪' },
  { code: '+61', label: 'Australia (+61)', flag: '🇦🇺' },
  { code: '+65', label: 'Singapore (+65)', flag: '🇸🇬' },
  { code: '+49', label: 'Germany (+49)', flag: '🇩🇪' },
  { code: '+33', label: 'France (+33)', flag: '🇫🇷' },
];

export const RegisterPatientModal: React.FC = () => {
  const { 
    isRegisterModalOpen, 
    setIsRegisterModalOpen, 
    registerPatient, 
    plans, 
    navigateTo,
    currentUser 
  } = useClinic();

  // 1. All mandatory fields start completely empty
  const [name, setName] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [heightCm, setHeightCm] = useState<string>('');
  const [weightKg, setWeightKg] = useState<string>('');
  const [targetWeightKg, setTargetWeightKg] = useState<string>(''); // Optional
  const [bodyType, setBodyType] = useState<string>('');
  const [foodPreference, setFoodPreference] = useState<string>('');

  // Touched state for live feedback
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // 7. AI Medical Condition & Allergy Search Chips
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [conditionInput, setConditionInput] = useState('');

  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [allergyInput, setAllergyInput] = useState('');

  const [selectedIntolerances, setSelectedIntolerances] = useState<string[]>([]);
  const [intoleranceInput, setIntoleranceInput] = useState('');

  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [goalInput, setGoalInput] = useState('');

  // 6. Lifestyle Assessment Fields inside Registration
  const [wakeTime, setWakeTime] = useState('06:30');
  const [sleepTime, setSleepTime] = useState('22:30');
  const [workHours, setWorkHours] = useState('09:00 - 18:00');
  const [physicalActivityLevel, setPhysicalActivityLevel] = useState('Light Active');
  const [dailyWaterLiters, setDailyWaterLiters] = useState<number | ''>(2.5);
  const [stressLevel, setStressLevel] = useState('moderate');
  const [digestiveIssues, setDigestiveIssues] = useState<string[]>([]);
  const [newDigestiveIssue, setNewDigestiveIssue] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [newDietaryRestriction, setNewDietaryRestriction] = useState('');

  const [favoriteFoods, setFavoriteFoods] = useState<string[]>([]);
  const [favFoodInput, setFavFoodInput] = useState('');
  
  const [dislikedFoods, setDislikedFoods] = useState<string[]>([]);
  const [dislikedFoodInput, setDislikedFoodInput] = useState('');

  const [medications, setMedications] = useState<string[]>([]);
  const [medInput, setMedInput] = useState('');

  const [supplements, setSupplements] = useState<string[]>([]);
  const [suppInput, setSuppInput] = useState('');

  const [consultationNotes, setConsultationNotes] = useState('');
  const [assignedPlanId, setAssignedPlanId] = useState<string>(plans[0]?.id || '');

  // Voice Consultation Recording & Notes
  const [voiceAudioUrl, setVoiceAudioUrl] = useState<string | undefined>(undefined);
  const [voiceAudioDuration, setVoiceAudioDuration] = useState<number>(0);
  const [voiceAudioDate, setVoiceAudioDate] = useState<string | undefined>(undefined);

  const [formError, setFormError] = useState('');

  // Validation functions according to clinical intake rules
  const cleanPhone = mobileNumber.trim();
  const getPhoneError = (): string | null => {
    if (!cleanPhone) return 'Phone number is required (numbers only, minimum 10 digits).';
    if (!/^\d+$/.test(cleanPhone)) return 'Phone number must contain only numbers (no letters, spaces, or symbols).';
    if (cleanPhone.length < 10) return `Phone number must be at least 10 digits (currently ${cleanPhone.length}/10 entered).`;
    return null;
  };

  const cleanEmail = email.trim();
  const getEmailError = (): string | null => {
    if (!cleanEmail) return 'Email address is required (must contain "@" and ".").';
    if (!cleanEmail.includes('@') && !cleanEmail.includes('.')) {
      return 'Email address must contain both "@" and "." (e.g. patient@example.com).';
    }
    if (!cleanEmail.includes('@')) {
      return 'Email address must contain an "@" symbol (e.g. patient@example.com).';
    }
    if (!cleanEmail.includes('.')) {
      return 'Email address must contain a domain with "." (e.g. patient@example.com).';
    }
    const parts = cleanEmail.split('@');
    if (parts.length !== 2 || !parts[0] || !parts[1] || !parts[1].includes('.')) {
      return 'Please enter a complete and valid email address (e.g. patient@example.com).';
    }
    const domainParts = parts[1].split('.');
    if (!domainParts[0] || !domainParts[domainParts.length - 1] || domainParts[domainParts.length - 1].length < 2) {
      return 'Please enter a valid domain ending with "." (e.g. patient@example.com).';
    }
    return null;
  };

  const getAgeError = (): string | null => {
    const trimmed = String(age).trim();
    if (!trimmed) return 'Patient age is required and must be a number.';
    if (!/^\d+$/.test(trimmed)) return 'Age must contain only numbers (no letters or decimal points).';
    const num = Number(trimmed);
    if (isNaN(num) || num < 1 || num > 120) return 'Age must be a valid number between 1 and 120.';
    return null;
  };

  const getHeightError = (): string | null => {
    const trimmed = String(heightCm).trim();
    if (!trimmed) return null; // Optional
    if (!/^\d+(\.\d+)?$/.test(trimmed)) return 'Height must contain only numbers in cm (e.g. 165 or 172.5).';
    const num = Number(trimmed);
    if (isNaN(num) || num < 40 || num > 280) return 'Height must be a valid number between 40 cm and 280 cm.';
    return null;
  };

  const getWeightError = (): string | null => {
    const trimmed = String(weightKg).trim();
    if (!trimmed) return null; // Optional
    if (!/^\d+(\.\d+)?$/.test(trimmed)) return 'Weight must contain only numbers in kg (e.g. 70 or 68.5).';
    const num = Number(trimmed);
    if (isNaN(num) || num < 15 || num > 350) return 'Weight must be a valid number between 15 kg and 350 kg.';
    return null;
  };

  const getTargetWeightError = (): string | null => {
    const trimmed = String(targetWeightKg).trim();
    if (!trimmed) return null;
    if (!/^\d+(\.\d+)?$/.test(trimmed)) return 'Target weight must contain only numbers in kg (e.g. 62).';
    const num = Number(trimmed);
    if (isNaN(num) || num < 15 || num > 350) return 'Target weight must be a valid number between 15 kg and 350 kg.';
    return null;
  };

  const getNameError = (): string | null => {
    if (!name.trim()) return 'Patient Full Name is required.';
    return null;
  };

  const getGenderError = (): string | null => {
    if (!gender) return 'Patient Gender selection is required.';
    return null;
  };

  const getFoodPreferenceError = (): string | null => {
    if (!foodPreference) return 'Food preference selection is required.';
    return null;
  };

  const phoneError = getPhoneError();
  const emailError = getEmailError();
  const ageError = getAgeError();
  const heightError = getHeightError();
  const weightError = getWeightError();
  const targetWeightError = getTargetWeightError();
  const nameError = getNameError();
  const genderError = getGenderError();
  const foodPreferenceError = getFoodPreferenceError();

  const isFormValid = !phoneError && !emailError && !ageError && !heightError && !weightError && 
    !targetWeightError && !nameError && !genderError && !foodPreferenceError;

  const markTouched = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  if (!isRegisterModalOpen) return null;

  // BMI calc if height and weight are provided
  const bmiCalc = (weightKg && heightCm && !isNaN(Number(weightKg)) && !isNaN(Number(heightCm)) && Number(heightCm) > 0) 
    ? calculateBmi(Number(weightKg), Number(heightCm)) 
    : null;

  const handleAddCondition = (cond: string) => {
    if (cond.trim() && !selectedConditions.includes(cond.trim())) {
      setSelectedConditions(prev => [...prev, cond.trim()]);
      setConditionInput('');
    }
  };

  const handleAddAllergy = (all: string) => {
    if (all.trim() && !selectedAllergies.includes(all.trim())) {
      setSelectedAllergies(prev => [...prev, all.trim()]);
      setAllergyInput('');
    }
  };

  const handleAddIntolerance = (intol: string) => {
    if (intol.trim() && !selectedIntolerances.includes(intol.trim())) {
      setSelectedIntolerances(prev => [...prev, intol.trim()]);
      setIntoleranceInput('');
    }
  };

  const handleAddGoal = (goal: string) => {
    if (goal.trim() && !selectedGoals.includes(goal.trim())) {
      setSelectedGoals(prev => [...prev, goal.trim()]);
      setGoalInput('');
    }
  };

  const insertNoteTemplate = (templateText: string) => {
    setConsultationNotes(prev => {
      if (!prev.trim()) return templateText;
      return `${prev.trim()}\n\n${templateText}`;
    });
  };

  const handleSaveVoiceAudio = (dataUrl: string, durationSeconds: number) => {
    setVoiceAudioUrl(dataUrl);
    setVoiceAudioDuration(durationSeconds);
    const dateStr = formatDateTime(new Date());
    setVoiceAudioDate(dateStr);
  };

  const handleDeleteVoiceAudio = () => {
    setVoiceAudioUrl(undefined);
    setVoiceAudioDuration(0);
    setVoiceAudioDate(undefined);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setHasAttemptedSubmit(true);

    // Validate mandatory fields with strict error checks
    if (!isFormValid) {
      const errorList = [
        nameError,
        phoneError,
        emailError,
        ageError,
        genderError,
        heightError,
        weightError,
        targetWeightError,
        foodPreferenceError
      ].filter(Boolean);
      
      setFormError(`Validation Error: Please correct the highlighted red fields before saving (${errorList[0] || 'Invalid inputs'}).`);
      return;
    }

    const fullMobile = `${countryCode} ${mobileNumber.trim()}`;
    const allAllergies = [...selectedAllergies, ...selectedIntolerances];

    const newPatient = registerPatient({
      name: name.trim(),
      mobile: fullMobile,
      email: email.trim(),
      age: Number(age),
      gender: gender as any,
      heightCm: heightCm.trim() !== '' ? Number(heightCm) : 165,
      weightKg: weightKg.trim() !== '' ? Number(weightKg) : 65,
      targetWeightKg: targetWeightKg.trim() !== '' ? Number(targetWeightKg) : undefined,
      bodyType: bodyType || 'Medium Frame',
      primaryGoals: selectedGoals.length > 0 ? selectedGoals : ['Metabolic Optimization', 'General Wellness'],
      medicalConditions: selectedConditions,
      foodPreference: foodPreference as FoodPreference,
      allergies: allAllergies,
      assignedPlanId: assignedPlanId || undefined,
      assignedDoctorId: currentUser?.id,
      notes: consultationNotes.trim() || 'Initial clinical intake.',
      consultationNotes: consultationNotes.trim(),
      voiceAudioUrl,
      voiceAudioDuration,
      voiceAudioDate,
      // Integrated Lifestyle Assessment
      wakeTime,
      sleepTime,
      workHours,
      dailyWaterLiters: Number(dailyWaterLiters) || 2.5,
      physicalActivityLevel,
      stressLevel,
      digestiveIssues,
      dietaryRestrictions,
      favoriteFoods,
      dislikedFoods,
      medications,
      supplements
    });

    setIsRegisterModalOpen(false);
    navigateTo('patient_profile', { patientId: newPatient.id });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#E4E9E4] max-w-3xl w-full my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#183153] to-[#244673] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#6BBF59]">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Register New Patient & Clinical Intake</h2>
              <p className="text-xs text-slate-300">
                Mandatory demographics, AI-assisted conditions & integrated lifestyle assessment
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsRegisterModalOpen(false)}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Banner */}
        {formError && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center gap-2 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
          
          {/* SECTION 1: Patient Demographics & International Phone */}
          <div>
            <h3 className="text-xs font-bold text-[#183153] uppercase tracking-wider mb-2.5 pb-1 border-b border-slate-100 flex items-center justify-between">
              <span>1. Patient Demographics & Contact *</span>
              <span className="text-[10px] text-slate-400 font-normal">All starred (*) fields are strictly required</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Full Name *</span>
                  {(touched.name || hasAttemptedSubmit) && nameError && (
                    <span className="text-[10px] text-rose-600 font-bold">Required</span>
                  )}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Shreya Mukherjee"
                  value={name}
                  onBlur={() => markTouched('name')}
                  onChange={(e) => {
                    setName(e.target.value);
                    markTouched('name');
                  }}
                  className={`w-full px-3 py-2 rounded-xl outline-none font-medium transition-all ${
                    (touched.name || hasAttemptedSubmit) && nameError
                      ? 'bg-rose-50/80 border-2 border-rose-500 text-rose-950 focus:ring-2 focus:ring-rose-400 focus:border-rose-500 shadow-xs shadow-rose-200/50'
                      : 'bg-slate-50 border border-slate-200 text-[#183153] focus:ring-2 focus:ring-[#6BBF59]/30'
                  }`}
                />
                {(touched.name || hasAttemptedSubmit) && nameError && (
                  <p className="mt-1 text-[11px] font-semibold text-rose-600 flex items-center gap-1 animate-in fade-in">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>{nameError}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Mobile Number (International) *</span>
                  {(touched.mobile || hasAttemptedSubmit) && phoneError && (
                    <span className="text-[10px] text-rose-600 font-bold">Digits only (min 10)</span>
                  )}
                </label>
                <div className="flex gap-1.5">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-28 px-2 py-2 bg-slate-100 border border-slate-200 rounded-xl text-[#183153] font-semibold text-xs outline-none"
                  >
                    {COUNTRY_CODES.map(c => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                  <div className="relative flex-1">
                    <Phone className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${
                      (touched.mobile || hasAttemptedSubmit) && phoneError ? 'text-rose-500' : 'text-slate-400'
                    }`} />
                    <input
                      type="tel"
                      inputMode="numeric"
                      placeholder="98201 99881"
                      value={mobileNumber}
                      onBlur={() => markTouched('mobile')}
                      onChange={(e) => {
                        setMobileNumber(e.target.value);
                        markTouched('mobile');
                      }}
                      className={`w-full pl-8 pr-3 py-2 rounded-xl outline-none font-medium transition-all ${
                        (touched.mobile || hasAttemptedSubmit) && phoneError
                          ? 'bg-rose-50/80 border-2 border-rose-500 text-rose-950 focus:ring-2 focus:ring-rose-400 focus:border-rose-500 shadow-xs shadow-rose-200/50'
                          : 'bg-slate-50 border border-slate-200 text-[#183153] focus:ring-2 focus:ring-[#6BBF59]/30'
                      }`}
                    />
                  </div>
                </div>
                {(touched.mobile || hasAttemptedSubmit) && phoneError && (
                  <p className="mt-1 text-[11px] font-semibold text-rose-600 flex items-center gap-1 animate-in fade-in">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>{phoneError}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Email Address *</span>
                  {(touched.email || hasAttemptedSubmit) && emailError && (
                    <span className="text-[10px] text-rose-600 font-bold">Requires '@' and '.'</span>
                  )}
                </label>
                <div className="relative">
                  <Mail className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${
                    (touched.email || hasAttemptedSubmit) && emailError ? 'text-rose-500' : 'text-slate-400'
                  }`} />
                  <input
                    type="email"
                    placeholder="patient@email.com"
                    value={email}
                    onBlur={() => markTouched('email')}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      markTouched('email');
                    }}
                    className={`w-full pl-8 pr-3 py-2 rounded-xl outline-none transition-all ${
                      (touched.email || hasAttemptedSubmit) && emailError
                        ? 'bg-rose-50/80 border-2 border-rose-500 text-rose-950 focus:ring-2 focus:ring-rose-400 focus:border-rose-500 shadow-xs shadow-rose-200/50 font-medium'
                        : 'bg-slate-50 border border-slate-200 text-[#183153] focus:ring-2 focus:ring-[#6BBF59]/30'
                    }`}
                  />
                </div>
                {(touched.email || hasAttemptedSubmit) && emailError && (
                  <p className="mt-1 text-[11px] font-semibold text-rose-600 flex items-center gap-1 animate-in fade-in">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>{emailError}</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Age *</span>
                    {(touched.age || hasAttemptedSubmit) && ageError && (
                      <span className="text-[10px] text-rose-600 font-bold">Number</span>
                    )}
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="e.g. 35"
                    value={age}
                    onBlur={() => markTouched('age')}
                    onChange={(e) => {
                      setAge(e.target.value);
                      markTouched('age');
                    }}
                    className={`w-full px-3 py-2 rounded-xl font-bold outline-none transition-all ${
                      (touched.age || hasAttemptedSubmit) && ageError
                        ? 'bg-rose-50/80 border-2 border-rose-500 text-rose-950 focus:ring-2 focus:ring-rose-400 focus:border-rose-500 shadow-xs shadow-rose-200/50'
                        : 'bg-slate-50 border border-slate-200 text-[#183153] focus:ring-2 focus:ring-[#6BBF59]/30'
                    }`}
                  />
                  {(touched.age || hasAttemptedSubmit) && ageError && (
                    <p className="mt-1 text-[11px] font-semibold text-rose-600 flex items-center gap-1 animate-in fade-in">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span>{ageError}</span>
                    </p>
                  )}
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Gender *</span>
                    {(touched.gender || hasAttemptedSubmit) && genderError && (
                      <span className="text-[10px] text-rose-600 font-bold">Required</span>
                    )}
                  </label>
                  <select
                    value={gender}
                    onBlur={() => markTouched('gender')}
                    onChange={(e) => {
                      setGender(e.target.value);
                      markTouched('gender');
                    }}
                    className={`w-full px-3 py-2 rounded-xl font-medium outline-none transition-all ${
                      (touched.gender || hasAttemptedSubmit) && genderError
                        ? 'bg-rose-50/80 border-2 border-rose-500 text-rose-950 focus:ring-2 focus:ring-rose-400 focus:border-rose-500 shadow-xs shadow-rose-200/50'
                        : 'bg-slate-50 border border-slate-200 text-[#183153] focus:ring-2 focus:ring-[#6BBF59]/30'
                    }`}
                  >
                    <option value="">Select Gender...</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                  {(touched.gender || hasAttemptedSubmit) && genderError && (
                    <p className="mt-1 text-[11px] font-semibold text-rose-600 flex items-center gap-1 animate-in fade-in">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span>{genderError}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Physical Metrics & Optional Target Weight */}
          <div>
            <div className="flex items-center justify-between pb-1 mb-2.5 border-b border-slate-100">
              <h3 className="text-xs font-bold text-[#183153] uppercase tracking-wider">
                2. Physical Metrics & Body Composition (Optional)
              </h3>
              {bmiCalc && (
                <span className="text-[11px] font-bold" style={{ color: bmiCalc.color }}>
                  BMI {bmiCalc.bmi} ({bmiCalc.category})
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Height (cm) <span className="text-slate-400 font-normal">(Optional)</span></span>
                  {(touched.height || hasAttemptedSubmit) && heightError && (
                    <span className="text-[10px] text-rose-600 font-bold">Number in cm</span>
                  )}
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="e.g. 165"
                  value={heightCm}
                  onBlur={() => markTouched('height')}
                  onChange={(e) => {
                    setHeightCm(e.target.value);
                    markTouched('height');
                  }}
                  className={`w-full px-3 py-2 rounded-xl font-bold outline-none transition-all ${
                    (touched.height || hasAttemptedSubmit) && heightError
                      ? 'bg-rose-50/80 border-2 border-rose-500 text-rose-950 focus:ring-2 focus:ring-rose-400 focus:border-rose-500 shadow-xs shadow-rose-200/50'
                      : 'bg-slate-50 border border-slate-200 text-[#183153] focus:ring-2 focus:ring-[#6BBF59]/30'
                  }`}
                />
                {(touched.height || hasAttemptedSubmit) && heightError && (
                  <p className="mt-1 text-[11px] font-semibold text-rose-600 flex items-center gap-1 animate-in fade-in">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>{heightError}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Current Weight (kg) <span className="text-slate-400 font-normal">(Optional)</span></span>
                  {(touched.weight || hasAttemptedSubmit) && weightError && (
                    <span className="text-[10px] text-rose-600 font-bold">Number in kg</span>
                  )}
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="e.g. 70"
                  value={weightKg}
                  onBlur={() => markTouched('weight')}
                  onChange={(e) => {
                    setWeightKg(e.target.value);
                    markTouched('weight');
                  }}
                  className={`w-full px-3 py-2 rounded-xl font-bold outline-none transition-all ${
                    (touched.weight || hasAttemptedSubmit) && weightError
                      ? 'bg-rose-50/80 border-2 border-rose-500 text-rose-950 focus:ring-2 focus:ring-rose-400 focus:border-rose-500 shadow-xs shadow-rose-200/50'
                      : 'bg-slate-50 border border-slate-200 text-[#183153] focus:ring-2 focus:ring-[#6BBF59]/30'
                  }`}
                />
                {(touched.weight || hasAttemptedSubmit) && weightError && (
                  <p className="mt-1 text-[11px] font-semibold text-rose-600 flex items-center gap-1 animate-in fade-in">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>{weightError}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Target Weight (kg) <span className="text-slate-400 font-normal">(Optional)</span></span>
                  {(touched.targetWeight || hasAttemptedSubmit) && targetWeightError && (
                    <span className="text-[10px] text-rose-600 font-bold">Number in kg</span>
                  )}
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="Optional (e.g. 62)"
                  value={targetWeightKg}
                  onBlur={() => markTouched('targetWeight')}
                  onChange={(e) => {
                    setTargetWeightKg(e.target.value);
                    markTouched('targetWeight');
                  }}
                  className={`w-full px-3 py-2 rounded-xl font-bold outline-none transition-all ${
                    (touched.targetWeight || hasAttemptedSubmit) && targetWeightError
                      ? 'bg-rose-50/80 border-2 border-rose-500 text-rose-950 focus:ring-2 focus:ring-rose-400 focus:border-rose-500 shadow-xs shadow-rose-200/50'
                      : 'bg-slate-50 border border-slate-200 text-emerald-800 focus:ring-2 focus:ring-[#6BBF59]/30'
                  }`}
                />
                {(touched.targetWeight || hasAttemptedSubmit) && targetWeightError && (
                  <p className="mt-1 text-[11px] font-semibold text-rose-600 flex items-center gap-1 animate-in fade-in">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>{targetWeightError}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 3: Food Preference & Dietary Flags */}
          <div>
            <h3 className="text-xs font-bold text-[#183153] uppercase tracking-wider mb-2.5 pb-1 border-b border-slate-100">
              3. Food Preference & Dietary Flags *
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Food Preference *</span>
                  {(touched.foodPref || hasAttemptedSubmit) && foodPreferenceError && (
                    <span className="text-[10px] text-rose-600 font-bold">Required</span>
                  )}
                </label>
                <select
                  value={foodPreference}
                  onBlur={() => markTouched('foodPref')}
                  onChange={(e) => {
                    setFoodPreference(e.target.value);
                    markTouched('foodPref');
                  }}
                  className={`w-full px-3 py-2 rounded-xl font-medium outline-none transition-all ${
                    (touched.foodPref || hasAttemptedSubmit) && foodPreferenceError
                      ? 'bg-rose-50/80 border-2 border-rose-500 text-rose-950 focus:ring-2 focus:ring-rose-400 focus:border-rose-500 shadow-xs shadow-rose-200/50'
                      : 'bg-slate-50 border border-slate-200 text-[#183153] focus:ring-2 focus:ring-[#6BBF59]/30'
                  }`}
                >
                  <option value="">Select Preference...</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                  <option value="Eggetarian">Eggetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Jain">Jain (No Root Veg)</option>
                  <option value="Keto">Keto / Low-Carb</option>
                  <option value="Pescatarian">Pescatarian</option>
                </select>
                {(touched.foodPref || hasAttemptedSubmit) && foodPreferenceError && (
                  <p className="mt-1 text-[11px] font-semibold text-rose-600 flex items-center gap-1 animate-in fade-in">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>{foodPreferenceError}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Body Frame Type</label>
                <select
                  value={bodyType}
                  onChange={(e) => setBodyType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[#183153] font-medium focus:ring-2 focus:ring-[#6BBF59]/30 outline-none"
                >
                  <option value="">Select Frame Type...</option>
                  <option value="Ectomorph (Slim / Lean)">Ectomorph (Slim / Lean)</option>
                  <option value="Mesomorph (Athletic / Muscular)">Mesomorph (Athletic / Muscular)</option>
                  <option value="Endomorph (Stocky / Curvy)">Endomorph (Stocky / Curvy)</option>
                  <option value="Medium Frame">Medium Frame</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 4: AI Medical Condition Search & Chips */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Diagnosed Medical Conditions (Search & Multi-Select Chips)
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {selectedConditions.map((cond) => (
                <span key={cond} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-100 text-rose-900 font-bold text-[11px] border border-rose-200">
                  {cond}
                  <button type="button" onClick={() => setSelectedConditions(prev => prev.filter(c => c !== cond))} className="hover:text-rose-600">×</button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type to search or add medical condition (e.g. Type 2 Diabetes, PCOS)..."
                value={conditionInput}
                onChange={(e) => setConditionInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && conditionInput.trim()) {
                    e.preventDefault();
                    handleAddCondition(conditionInput);
                  }
                }}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
              <button
                type="button"
                onClick={() => conditionInput.trim() && handleAddCondition(conditionInput)}
                className="px-3 py-2 bg-[#183153] text-white rounded-xl font-bold text-xs"
              >
                Add
              </button>
            </div>

            {/* Suggestions */}
            <div className="flex flex-wrap gap-1 mt-2">
              {COMMON_CONDITIONS.filter(c => !selectedConditions.includes(c)).slice(0, 6).map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleAddCondition(c)}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-medium"
                >
                  + {c}
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 5: Allergies & Intolerances */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Allergies</label>
              <div className="flex flex-wrap gap-1 mb-2">
                {selectedAllergies.map((all) => (
                  <span key={all} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold text-[11px]">
                    {all}
                    <button type="button" onClick={() => setSelectedAllergies(prev => prev.filter(a => a !== all))} className="hover:text-amber-700">×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="Add allergy..."
                  value={allergyInput}
                  onChange={(e) => setAllergyInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), allergyInput.trim() && (handleAddAllergy(allergyInput), setAllergyInput('')))}
                  className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
                <button type="button" onClick={() => allergyInput.trim() && (handleAddAllergy(allergyInput), setAllergyInput(''))} className="px-2.5 py-1.5 bg-slate-200 rounded-lg text-xs font-bold">Add</button>
              </div>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {COMMON_ALLERGIES.filter(a => !selectedAllergies.includes(a)).slice(0, 4).map(a => (
                  <button key={a} type="button" onClick={() => handleAddAllergy(a)} className="px-2 py-0.5 bg-slate-100 text-[10px] rounded hover:bg-slate-200">+ {a}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Intolerances</label>
              <div className="flex flex-wrap gap-1 mb-2">
                {selectedIntolerances.map((intol) => (
                  <span key={intol} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 font-bold text-[11px]">
                    {intol}
                    <button type="button" onClick={() => setSelectedIntolerances(prev => prev.filter(i => i !== intol))} className="hover:text-purple-700">×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="Add intolerance..."
                  value={intoleranceInput}
                  onChange={(e) => setIntoleranceInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), intoleranceInput.trim() && (handleAddIntolerance(intoleranceInput), setIntoleranceInput('')))}
                  className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
                <button type="button" onClick={() => intoleranceInput.trim() && (handleAddIntolerance(intoleranceInput), setIntoleranceInput(''))} className="px-2.5 py-1.5 bg-slate-200 rounded-lg text-xs font-bold">Add</button>
              </div>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {COMMON_INTOLERANCES.filter(i => !selectedIntolerances.includes(i)).slice(0, 3).map(i => (
                  <button key={i} type="button" onClick={() => handleAddIntolerance(i)} className="px-2 py-0.5 bg-slate-100 text-[10px] rounded hover:bg-slate-200">+ {i}</button>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 6: Primary Goals */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Primary Health & Body Goals (Select or Add)
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {selectedGoals.map((goal) => (
                <span key={goal} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-bold text-[11px] border border-emerald-200">
                  {goal}
                  <button type="button" onClick={() => setSelectedGoals(prev => prev.filter(g => g !== goal))} className="hover:text-emerald-700">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add primary goal (e.g. Sustainable Fat Loss, Fertility, Menopause Balance)..."
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), goalInput.trim() && handleAddGoal(goalInput))}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
              <button type="button" onClick={() => goalInput.trim() && handleAddGoal(goalInput)} className="px-3 py-2 bg-[#183153] text-white rounded-xl text-xs font-bold">Add</button>
            </div>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {['Sustainable Fat Loss', 'Fertility & Pre-Conception', 'Menopause Balance', 'HbA1c Reduction', 'Thyroid Optimization', 'Gut Health'].map(g => (
                !selectedGoals.includes(g) && (
                  <button key={g} type="button" onClick={() => handleAddGoal(g)} className="px-2 py-0.5 bg-slate-100 text-[10px] rounded hover:bg-slate-200">+ {g}</button>
                )
              ))}
            </div>
          </div>

          {/* SECTION 7: Integrated Lifestyle Assessment */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-xs font-bold text-[#183153] uppercase tracking-wider flex items-center gap-2">
              <span>6. Integrated Lifestyle & Clinical Assessment</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Wake-up Time</label>
                <input
                  type="time"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Target Bedtime</label>
                <input
                  type="time"
                  value={sleepTime}
                  onChange={(e) => setSleepTime(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Office / Work Hours</label>
                <input
                  type="text"
                  placeholder="09:00 - 18:00"
                  value={workHours}
                  onChange={(e) => setWorkHours(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Physical Activity Level</label>
                <select
                  value={physicalActivityLevel}
                  onChange={(e) => setPhysicalActivityLevel(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                >
                  <option value="Sedentary Desk Job">Sedentary Desk Job</option>
                  <option value="Light Active">Light Active (1-2 days/wk)</option>
                  <option value="Moderately Active">Moderately Active (3-4 days/wk)</option>
                  <option value="Very Active">Very Active / Athlete</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Daily Water (Liters)</label>
                <input
                  type="number"
                  step="0.5"
                  min={0.5}
                  max={8}
                  value={dailyWaterLiters}
                  onChange={(e) => setDailyWaterLiters(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Stress Level</label>
                <select
                  value={stressLevel}
                  onChange={(e) => setStressLevel(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                >
                  <option value="low">Low Stress</option>
                  <option value="moderate">Moderate Stress</option>
                  <option value="high">High Stress</option>
                  <option value="severe">Severe Stress</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 8: Voice Recorder & Clinical Note Taker */}
          <div className="space-y-4">
            {/* Voice Consultation Recorder */}
            <VoiceRecorderAndPlayer
              audioUrl={voiceAudioUrl}
              audioDuration={voiceAudioDuration}
              recordedDate={voiceAudioDate}
              title="Voice Consultation Recorder"
              subtitle="Record audio notes during intake. Saved audio will be stored in the patient chart and can be replayed by the doctor at any time."
              onSaveAudio={handleSaveVoiceAudio}
              onDeleteAudio={handleDeleteVoiceAudio}
            />

            {/* Clinical Note Taker */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-50 text-[#6BBF59]">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#183153]">Doctor Intake & Consultation Note Taker</h3>
                    <p className="text-[10px] text-slate-500">Record clinical impressions, observations, dietary history, and treatment directives.</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => insertNoteTemplate('CHIEF COMPLAINTS:\n- \n- ')}
                    className="text-[10px] font-semibold px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                  >
                    + Chief Complaints
                  </button>
                  <button
                    type="button"
                    onClick={() => insertNoteTemplate('DIET & LIFESTYLE:\n- Meal timing:\n- Hunger triggers:\n- Physical activity:')}
                    className="text-[10px] font-semibold px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                  >
                    + Diet & Routine
                  </button>
                  <button
                    type="button"
                    onClick={() => insertNoteTemplate('CLINICAL ACTION PLAN:\n- Primary nutrition strategy:\n- Recommended blood work:\n- Next review date:')}
                    className="text-[10px] font-semibold px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                  >
                    + Action Plan
                  </button>
                  {consultationNotes && (
                    <button
                      type="button"
                      onClick={() => setConsultationNotes('')}
                      className="text-[10px] font-semibold px-2 py-1 text-rose-600 hover:bg-rose-50 rounded-md transition-colors ml-1"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <textarea
                rows={4}
                placeholder="Type clinical consultation notes, dietary history, lab findings, or patient guidance here..."
                value={consultationNotes}
                onChange={(e) => setConsultationNotes(e.target.value)}
                className="w-full p-3 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-[#183153] leading-relaxed focus:bg-white focus:ring-2 focus:ring-[#6BBF59]/30 outline-none transition-all resize-y font-normal"
              />
            </div>
          </div>

          {/* SECTION 9: Plan Assignment */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Assign Clinical Care Plan
            </label>
            <select
              value={assignedPlanId}
              onChange={(e) => setAssignedPlanId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[#183153] font-medium focus:ring-2 focus:ring-[#6BBF59]/30 outline-none"
            >
              {plans.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} — ₹{(p.basePrice || 0).toLocaleString()} ({p.durationMonths} Months)
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button & Validation Status */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {hasAttemptedSubmit && !isFormValid ? (
              <div className="flex items-center gap-2 text-rose-700 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Fix red highlighted fields above to save patient chart.</span>
              </div>
            ) : (
              <p className="text-[11px] text-slate-400">
                Ensure phone digits, email, age, height, and weight are verified.
              </p>
            )}

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(false)}
                className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold cursor-pointer text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-6 py-2.5 font-bold rounded-xl shadow-md transition-all cursor-pointer text-xs flex items-center gap-2 ${
                  hasAttemptedSubmit && !isFormValid
                    ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200'
                    : 'bg-[#6BBF59] hover:bg-[#5EAB4D] text-white'
                }`}
              >
                {hasAttemptedSubmit && !isFormValid ? (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    <span>Correct Errors to Save</span>
                  </>
                ) : (
                  <span>Register & Open Profile</span>
                )}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
