import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Clinic, 
  User, 
  Patient, 
  WeightRecord, 
  ClinicPlan, 
  PaymentRecord, 
  Invoice, 
  ClinicActivity, 
  UserRole, 
  PaymentMode, 
  PaymentStatus, 
  FoodPreference, 
  PatientStatus,
  PatientAssessment,
  ClinicalMealPlan,
  ExercisePlan,
  ExerciseItem,
  RecipeDetail,
  MealOption,
  PatientDailyLog,
  BodyMeasurementsRecord,
  ProgressPhoto,
  PhotoAngle,
  PhotoStage,
  PatientReminderConfig,
  ChatMessage,
  ChatConversationSummary,
  FoodSwapSuggestion,
  NutrientGapAnalysis,
  GoalDistributionStat,
  WeightUpdateDueItem,
  ExpiringPlanItem,
  PatientCodeInvite,
  PatientSignUpInput,
  DietitianNotification
} from '../types/clinic';
import { 
  INITIAL_CLINICS, 
  INITIAL_USERS, 
  INITIAL_PLANS, 
  INITIAL_PATIENTS, 
  INITIAL_WEIGHT_HISTORY, 
  INITIAL_PAYMENTS, 
  INITIAL_INVOICES, 
  INITIAL_ACTIVITIES,
  INITIAL_PATIENT_INVITES
} from '../data/mockClinicData';
import { 
  INITIAL_ASSESSMENTS, 
  INITIAL_CLINICAL_MEAL_PLANS, 
  INITIAL_EXERCISE_PLANS, 
  INITIAL_PATIENT_LOGS,
  RECIPE_CATALOG 
} from '../data/mockMealAndAssessmentData';
import {
  INITIAL_BODY_MEASUREMENTS,
  INITIAL_PROGRESS_PHOTOS,
  generateInitialRemindersForPatient,
  INITIAL_CHAT_MESSAGES,
  FOOD_SWAPS_CATALOG,
  NUTRIENT_GAP_TEMPLATES,
  MOCK_GOAL_DISTRIBUTION,
  MOCK_WEIGHT_UPDATES_DUE,
  MOCK_EXPIRING_PLANS
} from '../data/mockEngagementData';
import { calculateBmi } from '../utils/nutritionCalculators';
import { 
  formatDate, 
  formatDateTime, 
  getDaysDifference, 
  addDays, 
  calculatePlanEndDateIso, 
  calculatePlanEndDateDisplay, 
  isTomorrow, 
  isToday 
} from '../utils/dateUtils';

export type ClinicScreen = 
  | 'login'
  | 'dashboard' 
  | 'patients' 
  | 'patient_profile' 
  | 'assessment' 
  | 'ai_meal_builder' 
  | 'exercise_planner' 
  | 'patient_portal' 
  | 'payments' 
  | 'invoice_preview'
  | 'progress_dashboard'
  | 'progress_photos'
  | 'reminders'
  | 'reminder_settings'
  | 'chat'
  | 'patient_chat'
  | 'patient_exercise'
  | 'ai_copilot';

interface RegisterPatientInput {
  name: string;
  mobile: string;
  email: string;
  age: number | string;
  gender: 'female' | 'male' | 'other' | string;
  heightCm: number | string;
  weightKg: number | string;
  targetWeightKg?: number | string;
  bodyType?: string;
  primaryGoals: string[];
  medicalConditions: string[];
  foodPreference: FoodPreference | string;
  allergies: string[];
  assignedPlanId?: string;
  assignedDoctorId?: string;
  notes?: string;
  // Lifestyle & Clinical Assessment fields
  wakeTime?: string;
  sleepTime?: string;
  workHours?: string;
  dailyWaterLiters?: number | string;
  physicalActivityLevel?: string;
  exerciseHabits?: string;
  stressLevel?: 'low' | 'moderate' | 'high' | 'severe' | string;
  digestiveIssues?: string[];
  dietaryRestrictions?: string[];
  favoriteFoods?: string[];
  dislikedFoods?: string[];
  medications?: string[];
  supplements?: string[];
  consultationNotes?: string;
  voiceAudioUrl?: string;
  voiceAudioDuration?: number;
  voiceAudioDate?: string;
  voiceTranscript?: string;
}

interface RecordPaymentInput {
  patientId: string;
  planId: string;
  basePrice: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  taxRate: number;
  paidAmount: number;
  paymentMode: PaymentMode;
  transactionRef?: string;
  paymentDate: string;
  dueDate: string;
  notes?: string;
}

export interface ToastAlert {
  id: string;
  title: string;
  message: string;
  channel: 'push' | 'whatsapp' | 'sms';
  time: string;
}

interface ClinicContextType {
  // Navigation & Auth
  activeScreen: ClinicScreen;
  navigateTo: (screen: ClinicScreen, options?: { patientId?: string; invoiceId?: string; planId?: string }) => void;
  isAuthenticated: boolean;
  authToken: string | null;
  currentUser: User | null;
  currentClinic: Clinic | null;
  clinics: Clinic[];
  users: User[];
  
  // Auth actions
  loginWithPassword: (email: string, password: string, clinicId: string) => Promise<{ success: boolean; error?: string }>;
  requestOtp: (identifier: string) => Promise<{ success: boolean; mockOtp: string }>;
  verifyOtp: (identifier: string, otp: string, clinicId: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchClinic: (clinicId: string) => void;
  switchUserRole: (role: UserRole) => void;

  // Patient Self Sign-Up & Code Validation
  patientInvites: PatientCodeInvite[];
  validatePatientCode: (code: string) => { valid: boolean; error?: string; invite?: PatientCodeInvite; dietician?: User };
  registerPatientWithCode: (input: PatientSignUpInput) => Promise<{ success: boolean; error?: string; patient?: Patient }>;
  issuePatientInviteCode: (dieticianId: string, options?: { patientName?: string; planId?: string }) => PatientCodeInvite;
  loginPatient: (identifier: string, password?: string) => Promise<{ success: boolean; error?: string; patient?: Patient }>;
  isPatientSession: boolean;
  loggedInPatient: Patient | null;

  // Selected Entities
  selectedPatientId: string | null;
  setSelectedPatientId: (id: string | null) => void;
  selectedPatient: Patient | null;
  selectedInvoiceId: string | null;
  setSelectedInvoiceId: (id: string | null) => void;
  selectedInvoice: Invoice | null;
  selectedMealPlanId: string | null;
  setSelectedMealPlanId: (id: string | null) => void;

  // Data Collections (Scoped to current clinic)
  patients: Patient[];
  weightRecords: WeightRecord[];
  plans: ClinicPlan[];
  payments: PaymentRecord[];
  invoices: Invoice[];
  activities: ClinicActivity[];
  assessments: PatientAssessment[];
  clinicalMealPlans: ClinicalMealPlan[];
  exercisePlans: ExercisePlan[];
  patientLogs: Record<string, PatientDailyLog>;

  // Patient CRUD
  registerPatient: (input: RegisterPatientInput) => Patient;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  deletePatient: (id: string) => void;

  // Weight History
  getPatientWeightHistory: (patientId: string) => WeightRecord[];
  addWeightRecord: (params: { patientId: string; weightKg: number; date?: string; notes?: string; waistCm?: number; bodyFatPercentage?: number }) => WeightRecord;
  deleteWeightRecord: (id: string) => void;

  // Plans & Financials
  createPlan: (plan: Omit<ClinicPlan, 'id' | 'clinicId'>) => ClinicPlan;
  addPlan: (plan: Omit<ClinicPlan, 'id' | 'clinicId'>) => ClinicPlan;
  updatePlan: (id: string, updates: Partial<ClinicPlan>) => void;
  editPlan: (id: string, updates: Partial<ClinicPlan>) => void;
  archivePlan: (id: string) => void;
  unarchivePlan: (id: string) => void;
  deletePlan: (id: string) => void;
  recordPayment: (input: RecordPaymentInput) => { payment: PaymentRecord; invoice: Invoice };
  markInvoicePaid: (invoiceId: string, paymentMode?: PaymentMode, transactionRef?: string) => void;

  // Phase 2: Patient Assessment Methods
  saveAssessment: (assessment: PatientAssessment) => void;
  getPatientAssessments: (patientId: string) => PatientAssessment[];
  getLatestAssessment: (patientId: string) => PatientAssessment | null;

  // Phase 2: AI Clinical Meal Plans Methods
  saveMealPlan: (plan: ClinicalMealPlan) => void;
  publishMealPlan: (planId: string) => void;
  getPatientMealPlans: (patientId: string) => ClinicalMealPlan[];
  getActiveMealPlan: (patientId: string) => ClinicalMealPlan | null;

  // Phase 2: Exercise Planner Methods
  saveExercisePlan: (plan: ExercisePlan) => void;
  publishExercisePlan: (planId: string) => void;
  getPatientExercisePlan: (patientId: string) => ExercisePlan | null;
  addExerciseToPatientPlan: (patientId: string, exerciseData: Omit<ExerciseItem, 'id'>) => ExerciseItem;
  updateExerciseInPatientPlan: (patientId: string, exerciseId: string, updates: Partial<ExerciseItem>) => void;
  removeExerciseFromPatientPlan: (patientId: string, exerciseId: string) => void;
  getPatientAssignedExercises: (patientId: string) => ExerciseItem[];

  // Phase 2: Recipe Modal & Details
  selectedRecipe: RecipeDetail | null;
  isRecipeModalOpen: boolean;
  openRecipeModal: (recipeOrOption: RecipeDetail | MealOption | string) => void;
  closeRecipeModal: () => void;

  // Phase 2: Patient Mobile App Tracking
  updatePatientDailyLog: (patientId: string, updates: Partial<PatientDailyLog>) => void;
  getPatientDailyLog: (patientId: string) => PatientDailyLog;

  // Phase 3: Body Circumference Measurements
  bodyMeasurements: BodyMeasurementsRecord[];
  addBodyMeasurement: (record: Omit<BodyMeasurementsRecord, 'id'>) => BodyMeasurementsRecord;
  getPatientMeasurements: (patientId: string) => BodyMeasurementsRecord[];

  // Phase 3: Progress Photos
  progressPhotos: ProgressPhoto[];
  addProgressPhoto: (photo: Omit<ProgressPhoto, 'id'>) => ProgressPhoto;
  deleteProgressPhoto: (id: string) => void;
  getPatientPhotos: (patientId: string, angle?: PhotoAngle, stage?: PhotoStage) => ProgressPhoto[];

  // Phase 3: Patient Reminder System
  getPatientReminders: (patientId: string) => PatientReminderConfig[];
  updatePatientReminder: (patientId: string, reminderId: string, updates: Partial<PatientReminderConfig>) => void;
  toggleReminderChannel: (patientId: string, reminderId: string, channel: 'push' | 'whatsapp' | 'sms') => void;
  triggerTestReminderNotification: (reminder: PatientReminderConfig, channel: 'push' | 'whatsapp' | 'sms') => void;
  activeToastNotification: ToastAlert | null;
  dismissToastNotification: () => void;

  // Phase 3: WhatsApp-Style Clinical Chat
  chatMessages: ChatMessage[];
  sendChatMessage: (input: { 
    patientId: string; 
    content: string; 
    type?: 'text' | 'photo' | 'pdf' | 'meal_plan' | 'exercise_plan'; 
    sender?: 'doctor' | 'patient'; 
    mediaUrl?: string; 
    mediaMeta?: any 
  }) => ChatMessage;
  markChatAsRead: (patientId: string) => void;
  getPatientChatMessages: (patientId: string) => ChatMessage[];
  getUnreadChatCount: (patientId?: string) => number;
  getAllConversationsSummary: () => ChatConversationSummary[];

  // Phase 3: AI Copilot & Engagement Data
  foodSwapsCatalog: FoodSwapSuggestion[];
  nutrientGapsTemplates: NutrientGapAnalysis[];
  goalDistributionStats: GoalDistributionStat[];
  weightUpdatesDueList: WeightUpdateDueItem[];
  generateCopilotMotivation: (patientId: string, tone?: 'celebratory' | 'empathetic' | 'strict_discipline') => string;
  generateCopilotProgressSummary: (patientId: string) => string;
  generateCopilotFoodSwap: (cravingText: string) => FoodSwapSuggestion | null;
  setPatientDailyMotivation: (patientId: string, message: string, tone?: string) => void;

  // Modals state
  isRegisterModalOpen: boolean;
  setIsRegisterModalOpen: (open: boolean) => void;
  isPaymentModalOpen: boolean;
  setIsPaymentModalOpen: (open: boolean) => void;
  isWeightModalOpen: boolean;
  setIsWeightModalOpen: (open: boolean) => void;
  isCreatePlanModalOpen: boolean;
  setIsCreatePlanModalOpen: (open: boolean) => void;
  editingPlan: ClinicPlan | null;
  setEditingPlan: (plan: ClinicPlan | null) => void;
  openPlanModal: (plan?: ClinicPlan) => void;
  closePlanModal: () => void;
  isMeasurementModalOpen: boolean;
  setIsMeasurementModalOpen: (open: boolean) => void;
  isPhotoModalOpen: boolean;
  setIsPhotoModalOpen: (open: boolean) => void;

  // Phase 4: Dietitian Workflow Notifications & Start Date Reminders
  dietitianNotifications: DietitianNotification[];
  getDietitianNotifications: () => DietitianNotification[];
  dismissDietitianNotification: (id: string) => void;
  markDietitianNotificationAsRead: (id: string) => void;
  markAllDietitianNotificationsAsRead: () => void;
  getDietPlanReminderForPatient: (patientId: string) => DietitianNotification | null;

  // KPIs calculation helpers
  getDashboardKpis: () => {
    activePatients: number;
    totalPatients: number;
    monthlyRevenue: number;
    totalRevenue: number;
    pendingPaymentsAmount: number;
    pendingInvoicesCount: number;
    renewalsDueCount: number;
    avgWeightLossKg: number;
    activeMealPlansCount: number;
    unreadChatCount: number;
    dueWeighInsCount: number;
    expiringPlansCount: number;
    dietitianReminderCount: number;
    upcomingDietPlanReminders: DietitianNotification[];
  };
}

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

const STORAGE_KEYS = {
  AUTH: 'pbl_clinic_auth_v2',
  CLINICS: 'pbl_clinics_v3',
  USERS: 'pbl_clinic_users_v3',
  PATIENTS: 'pbl_clinic_patients_v2',
  WEIGHT: 'pbl_clinic_weight_v2',
  PLANS: 'pbl_clinic_plans_v2',
  PAYMENTS: 'pbl_clinic_payments_v2',
  INVOICES: 'pbl_clinic_invoices_v2',
  ACTIVITIES: 'pbl_clinic_activities_v2',
  ASSESSMENTS: 'pbl_clinic_assessments_v2',
  MEAL_PLANS: 'pbl_clinic_meal_plans_v2',
  EXERCISE_PLANS: 'pbl_clinic_exercise_plans_v2',
  PATIENT_LOGS: 'pbl_clinic_patient_logs_v2',
  MEASUREMENTS: 'pbl_clinic_measurements_v3',
  PHOTOS: 'pbl_clinic_photos_v3',
  REMINDERS: 'pbl_clinic_reminders_v3',
  CHATS: 'pbl_clinic_chats_v3',
  INVITES: 'pbl_clinic_patient_invites_v2'
};

export const ClinicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial states or fallback to mock data
  const [clinics] = useState<Clinic[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CLINICS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 1 && parsed[0].name === 'Perfect Body & Life') {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem(STORAGE_KEYS.CLINICS, JSON.stringify(INITIAL_CLINICS));
    return INITIAL_CLINICS;
  });

  const [users] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.every((u: User) => u.clinicId === 'clinic-1')) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  });

  const [selectedClinicId, setSelectedClinicId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTH);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.clinicId) return parsed.clinicId;
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_CLINICS[0].id;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTH);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.userId) {
          const u = INITIAL_USERS.find(user => user.id === parsed.userId);
          if (u) return u;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_USERS[0];
  });

  const [authToken, setAuthToken] = useState<string | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTH);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed?.token || null;
      } catch (e) {
        console.error(e);
      }
    }
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3ItMSIsInJvbGUiOiJkb2N0b3IiLCJleHAiOjE3OTk5OTk5OTl9.demo_valid_jwt_token';
  });

  const [activeScreen, setActiveScreen] = useState<ClinicScreen>('dashboard');
  const [selectedPatientId, setSelectedPatientIdState] = useState<string | null>(() => {
    const saved = localStorage.getItem('pbl_selected_patient_id');
    return saved || 'pat-1';
  });
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>('inv-101');
  const [selectedMealPlanId, setSelectedMealPlanId] = useState<string | null>('plan-cl-101');

  const [patientInvites, setPatientInvites] = useState<PatientCodeInvite[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INVITES);
    return saved ? JSON.parse(saved) : INITIAL_PATIENT_INVITES;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVITES, JSON.stringify(patientInvites));
  }, [patientInvites]);

  const [isPatientSession, setIsPatientSession] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTH);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return !!parsed?.isPatient;
      } catch (e) {
        console.error(e);
      }
    }
    return false;
  });

  const [loggedInPatient, setLoggedInPatient] = useState<Patient | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTH);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.isPatient && parsed?.patientId) {
          return INITIAL_PATIENTS.find(p => p.id === parsed.patientId) || null;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });

  useEffect(() => {
    if (selectedPatientId) {
      localStorage.setItem('pbl_selected_patient_id', selectedPatientId);
    }
  }, [selectedPatientId]);

  // Modals
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [isCreatePlanModalOpen, setIsCreatePlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<ClinicPlan | null>(null);
  const [isMeasurementModalOpen, setIsMeasurementModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  const openPlanModal = (plan?: ClinicPlan) => {
    setEditingPlan(plan || null);
    setIsCreatePlanModalOpen(true);
  };

  const closePlanModal = () => {
    setEditingPlan(null);
    setIsCreatePlanModalOpen(false);
  };

  // Phase 2 Recipe Modal
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeDetail | null>(null);

  // Phase 3 Toast Simulation
  const [activeToastNotification, setActiveToastNotification] = useState<ToastAlert | null>(null);

  // Collections
  const [allPatients, setAllPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PATIENTS);
    return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
  });

  const [allWeightRecords, setAllWeightRecords] = useState<WeightRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WEIGHT);
    return saved ? JSON.parse(saved) : INITIAL_WEIGHT_HISTORY;
  });

  const [allPlans, setAllPlans] = useState<ClinicPlan[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PLANS);
    return saved ? JSON.parse(saved) : INITIAL_PLANS;
  });

  const [allPayments, setAllPayments] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [allInvoices, setAllInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INVOICES);
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [allActivities, setAllActivities] = useState<ClinicActivity[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  // Phase 2 Collections
  const [allAssessments, setAllAssessments] = useState<PatientAssessment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ASSESSMENTS);
    return saved ? JSON.parse(saved) : INITIAL_ASSESSMENTS;
  });

  const [allClinicalMealPlans, setAllClinicalMealPlans] = useState<ClinicalMealPlan[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MEAL_PLANS);
    return saved ? JSON.parse(saved) : INITIAL_CLINICAL_MEAL_PLANS;
  });

  const [allExercisePlans, setAllExercisePlans] = useState<ExercisePlan[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EXERCISE_PLANS);
    return saved ? JSON.parse(saved) : INITIAL_EXERCISE_PLANS;
  });

  const [allPatientLogs, setAllPatientLogs] = useState<Record<string, PatientDailyLog>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PATIENT_LOGS);
    return saved ? JSON.parse(saved) : INITIAL_PATIENT_LOGS;
  });

  // Phase 3 Collections
  const [allBodyMeasurements, setAllBodyMeasurements] = useState<BodyMeasurementsRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MEASUREMENTS);
    return saved ? JSON.parse(saved) : INITIAL_BODY_MEASUREMENTS;
  });

  const [allProgressPhotos, setAllProgressPhotos] = useState<ProgressPhoto[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PHOTOS);
    return saved ? JSON.parse(saved) : INITIAL_PROGRESS_PHOTOS;
  });

  const [allReminders, setAllReminders] = useState<Record<string, PatientReminderConfig[]>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REMINDERS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    const initReminders: Record<string, PatientReminderConfig[]> = {};
    INITIAL_PATIENTS.forEach(p => {
      initReminders[p.id] = generateInitialRemindersForPatient(p.id);
    });
    return initReminders;
  });

  const [allChatMessages, setAllChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CHATS);
    const rawList: ChatMessage[] = saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
    const baseTime = Date.now() - (rawList.length * 60000);
    return rawList.map((m, idx) => ({
      ...m,
      createdAt: m.createdAt || (baseTime + idx * 60000)
    }));
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(allPatients));
  }, [allPatients]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WEIGHT, JSON.stringify(allWeightRecords));
  }, [allWeightRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(allPlans));
  }, [allPlans]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(allPayments));
  }, [allPayments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(allInvoices));
  }, [allInvoices]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(allActivities));
  }, [allActivities]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(allAssessments));
  }, [allAssessments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEAL_PLANS, JSON.stringify(allClinicalMealPlans));
  }, [allClinicalMealPlans]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXERCISE_PLANS, JSON.stringify(allExercisePlans));
  }, [allExercisePlans]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PATIENT_LOGS, JSON.stringify(allPatientLogs));
  }, [allPatientLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEASUREMENTS, JSON.stringify(allBodyMeasurements));
  }, [allBodyMeasurements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(allProgressPhotos));
  }, [allProgressPhotos]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(allReminders));
  }, [allReminders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(allChatMessages));
  }, [allChatMessages]);

  const currentClinic = clinics.find(c => c.id === selectedClinicId) || clinics[0];

  // RBAC SCOPED COLLECTIONS:
  // Patients are strictly locked to their own single record in patient session mode.
  const patients = isPatientSession
    ? (loggedInPatient ? [loggedInPatient] : (allPatients.filter(p => p.id === selectedPatientId)))
    : allPatients.filter(p => p.clinicId === currentClinic.id);

  const weightRecords = allWeightRecords;
  const plans = allPlans.filter(p => p.clinicId === currentClinic.id || p.clinicId === 'clinic-1');
  const payments = isPatientSession
    ? allPayments.filter(p => p.patientId === (loggedInPatient?.id || selectedPatientId))
    : allPayments.filter(p => p.clinicId === currentClinic.id);
  const invoices = isPatientSession
    ? allInvoices.filter(i => i.patientId === (loggedInPatient?.id || selectedPatientId))
    : allInvoices.filter(i => i.clinicId === currentClinic.id);
  const activities = isPatientSession
    ? allActivities.filter(a => a.patientId === (loggedInPatient?.id || selectedPatientId))
    : allActivities.filter(a => a.clinicId === currentClinic.id);
  const assessments = allAssessments;
  const clinicalMealPlans = allClinicalMealPlans.filter(p => p.clinicId === currentClinic.id);
  const exercisePlans = allExercisePlans.filter(p => p.clinicId === currentClinic.id);

  // RBAC: Patient cannot switch to any other patient ID
  const selectedPatient = isPatientSession
    ? (loggedInPatient || allPatients.find(p => p.id === selectedPatientId) || patients[0] || null)
    : (allPatients.find(p => p.id === selectedPatientId) || patients[0] || null);

  const selectedInvoice = allInvoices.find(i => i.id === selectedInvoiceId) || null;

  // RBAC ALLOWED SCREENS FOR PATIENTS
  const PATIENT_PERMITTED_SCREENS: ClinicScreen[] = [
    'patient_portal',
    'patient_exercise',
    'ai_copilot',
    'patient_chat',
    'progress_dashboard',
    'patient_profile'
  ];

  const setSelectedPatientId = (id: string | null) => {
    if (isPatientSession) {
      if (loggedInPatient) {
        setSelectedPatientIdState(loggedInPatient.id);
      }
      return;
    }
    setSelectedPatientIdState(id);
  };

  const navigateTo = (screen: ClinicScreen, options?: { patientId?: string; invoiceId?: string; planId?: string }) => {
    if (isPatientSession) {
      // RBAC: Force patient ID lock and restrict to patient-facing views
      if (loggedInPatient) {
        setSelectedPatientIdState(loggedInPatient.id);
      }
      const targetScreen = PATIENT_PERMITTED_SCREENS.includes(screen) ? screen : 'patient_portal';
      setActiveScreen(targetScreen);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (options?.patientId) {
      setSelectedPatientId(options.patientId);
    }
    if (options?.invoiceId) {
      setSelectedInvoiceId(options.invoiceId);
    }
    if (options?.planId) {
      setSelectedMealPlanId(options.planId);
    }
    setActiveScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth Operations
  const loginWithPassword = async (email: string, _password: string, clinicId: string) => {
    const inputEmail = (email || '').toLowerCase().trim();
    const user = users.find(u => (u.email || '').toLowerCase() === inputEmail) || users[0];
    const mockToken = `jwt_token_${Date.now()}_${user.id}`;
    setCurrentUser(user);
    setSelectedClinicId(clinicId || user.clinicId);
    setAuthToken(mockToken);
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify({
      token: mockToken,
      userId: user.id,
      clinicId: clinicId || user.clinicId
    }));
    setActiveScreen('dashboard');
    return { success: true };
  };

  const requestOtp = async (_identifier: string) => {
    return { success: true, mockOtp: '849201' };
  };

  const verifyOtp = async (identifier: string, otp: string, clinicId: string) => {
    if (otp !== '849201' && otp.length !== 6) {
      return { success: false, error: 'Invalid OTP. Enter 849201 for test verification.' };
    }
    const inputId = (identifier || '').toLowerCase().trim();
    const user = users.find(u => (u.email || '').toLowerCase() === inputId || (u.mobile || '').includes(inputId)) || users[0];
    const mockToken = `jwt_otp_token_${Date.now()}_${user.id}`;
    setCurrentUser(user);
    setSelectedClinicId(clinicId || user.clinicId);
    setAuthToken(mockToken);
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify({
      token: mockToken,
      userId: user.id,
      clinicId: clinicId || user.clinicId
    }));
    setActiveScreen('dashboard');
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setLoggedInPatient(null);
    setIsPatientSession(false);
    setAuthToken(null);
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    setActiveScreen('login');
  };

  // Patient Code Validation
  const validatePatientCode = (code: string) => {
    const cleanCode = (code || '').trim().toUpperCase();
    if (!cleanCode) {
      return { valid: false, error: 'Please enter your Patient Code.' };
    }

    // 1. Check patient invites
    const invite = patientInvites.find(inv => inv.code.toUpperCase() === cleanCode);
    if (invite) {
      if (invite.status === 'expired' || (invite.expiresAt && new Date(invite.expiresAt) < new Date('2026-08-27'))) {
        return { 
          valid: false, 
          error: 'This Patient Code has expired. Please contact your dietician to receive an active code.' 
        };
      }
      if (invite.status === 'used') {
        return { 
          valid: false, 
          error: 'This Patient Code has already been registered. Please sign in with your email or mobile number.' 
        };
      }
      const dietician = users.find(u => u.id === invite.issuedByDieticianId) || users[0];
      return {
        valid: true,
        invite,
        dietician,
        clinicId: invite.clinicId
      };
    }

    // 2. Check if it's already an active patient code in the clinic roster
    const existingPat = allPatients.find(p => p.patientCode.toUpperCase() === cleanCode);
    if (existingPat) {
      return {
        valid: false,
        error: `Patient Code "${cleanCode}" is already in use for ${existingPat.name}. Please sign in to access your portal.`
      };
    }

    // 3. Invalid code
    return {
      valid: false,
      error: 'Invalid Patient Code. Please enter the unique code provided by your dietician (e.g. PBL-DR-ASHMITA, PBL-CARE-2026, or PBL-1008).'
    };
  };

  // Issue new Patient Invite Code (Dietician Action)
  const issuePatientInviteCode = (dieticianId: string, options?: { patientName?: string; planId?: string }): PatientCodeInvite => {
    const dietician = users.find(u => u.id === dieticianId) || currentUser || users[0];
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newCode = `PBL-${randomSuffix}`;
    const plan = plans.find(p => p.id === options?.planId);

    const newInvite: PatientCodeInvite = {
      code: newCode,
      issuedByDieticianId: dietician.id,
      dieticianName: dietician.name,
      dieticianTitle: dietician.roleTitle,
      clinicId: currentClinic.id,
      patientName: options?.patientName,
      preAssignedPlanId: plan?.id,
      preAssignedPlanName: plan?.name,
      status: 'valid',
      createdAt: new Date().toISOString().split('T')[0],
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    setPatientInvites(prev => [newInvite, ...prev]);

    const newAct: ClinicActivity = {
      id: `act-${Date.now()}`,
      clinicId: currentClinic.id,
      type: 'patient_registered',
      title: 'Patient Code Issued',
      description: `Issued registration code ${newCode} for new patient onboarding.`,
      timestamp: 'Just now',
      user: dietician.name
    };
    setAllActivities(prev => [newAct, ...prev]);

    return newInvite;
  };

  // Patient Self Sign-Up with 3-Piece Info (Email/Phone, Password, Patient Code)
  const registerPatientWithCode = async (input: PatientSignUpInput): Promise<{ success: boolean; error?: string; patient?: Patient }> => {
    // 1. Validate Patient Code First
    const validation = validatePatientCode(input.patientCode);
    if (!validation.valid || !validation.invite) {
      return { success: false, error: validation.error || 'Invalid or unverified Patient Code.' };
    }

    // 2. Validate Email or Phone Number
    const rawIdentifier = (input.emailOrPhone || '').trim();
    if (!rawIdentifier) {
      return { success: false, error: 'Please enter your email address or phone number.' };
    }

    const isEmail = rawIdentifier.includes('@');
    const cleanEmail = isEmail ? rawIdentifier.toLowerCase() : '';
    const cleanMobile = !isEmail ? rawIdentifier : '';
    const normalizedMobile = rawIdentifier.replace(/\s+/g, '');

    // Check if email or phone is already registered in patients roster
    const existingPatient = allPatients.find(p => {
      if (isEmail && p.email && p.email.toLowerCase() === cleanEmail) return true;
      if (!isEmail && p.mobile && p.mobile.replace(/\s+/g, '') === normalizedMobile) return true;
      return false;
    });

    if (existingPatient) {
      return { 
        success: false, 
        error: `This ${isEmail ? 'email address' : 'phone number'} is already registered. Please sign in to your account.` 
      };
    }

    // 3. Validate Password
    if (!input.password || input.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }
    if (input.password !== input.confirmPassword) {
      return { success: false, error: 'Password and confirm password do not match.' };
    }

    const dietician = validation.dietician || users[0];
    const newPatientId = `pat-${Date.now()}`;
    const assignedPlan = plans.find(p => p.id === validation.invite?.preAssignedPlanId) || plans[0];

    // Determine a clean friendly name without asking the patient personal questions
    let derivedName = input.name?.trim() || validation.invite?.patientName?.trim() || '';
    if (!derivedName) {
      if (isEmail) {
        const username = cleanEmail.split('@')[0].replace(/[._-]/g, ' ');
        derivedName = username.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      } else {
        derivedName = `Patient (${validation.invite.code})`;
      }
    }

    const newPatient: Patient = {
      id: newPatientId,
      clinicId: currentClinic.id,
      patientCode: validation.invite.code,
      name: derivedName,
      email: isEmail ? cleanEmail : `${rawIdentifier.replace(/[^0-9]/g, '')}@patient.perfectbodyandlife.com`,
      mobile: !isEmail ? rawIdentifier : '+91 98000 00000',
      age: 30,
      gender: 'female',
      heightCm: 165,
      currentWeightKg: 68.0,
      startingWeightKg: 68.0,
      targetWeightKg: 60.0,
      primaryGoals: ['Doctor-Supervised Nutrition & Metabolic Health'],
      medicalConditions: [],
      foodPreference: 'Vegetarian',
      allergies: [],
      assignedDoctorId: dietician.id,
      assignedPlanId: assignedPlan?.id,
      assignedPlanName: assignedPlan?.name,
      status: 'active',
      joiningDate: new Date().toISOString().split('T')[0],
      renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: `Registered via Patient Code ${validation.invite.code} issued by ${dietician.name}.`
    };

    // 1. Add to patients collection
    setAllPatients(prev => [newPatient, ...prev]);

    // 2. Mark code as used
    setPatientInvites(prev => prev.map(inv => {
      if (inv.code.toUpperCase() === validation.invite?.code.toUpperCase()) {
        return {
          ...inv,
          status: 'used',
          usedByPatientId: newPatient.id,
          usedAt: new Date().toISOString()
        };
      }
      return inv;
    }));

    // 3. Log initial baseline weight record
    const newWeight: WeightRecord = {
      id: `wt-${Date.now()}`,
      patientId: newPatient.id,
      date: new Date().toISOString().split('T')[0],
      weightKg: newPatient.currentWeightKg,
      bmi: Number((newPatient.currentWeightKg / Math.pow(newPatient.heightCm / 100, 2)).toFixed(1)),
      notes: 'Initial registration',
      loggedBy: dietician.name
    };
    setAllWeightRecords(prev => [newWeight, ...prev]);

    // 4. Log clinic activity
    const newAct: ClinicActivity = {
      id: `act-${Date.now()}`,
      clinicId: currentClinic.id,
      type: 'patient_registered',
      title: 'Patient Account Created',
      description: `${newPatient.name} registered with code ${validation.invite.code} (Linked to ${dietician.name}).`,
      timestamp: 'Just now',
      patientId: newPatient.id,
      patientName: newPatient.name,
      user: dietician.name
    };
    setAllActivities(prev => [newAct, ...prev]);

    // 5. Authenticate patient session & navigate to dashboard
    const mockToken = `jwt_patient_token_${Date.now()}_${newPatient.id}`;
    setAuthToken(mockToken);
    setSelectedPatientId(newPatient.id);
    setIsPatientSession(true);
    setLoggedInPatient(newPatient);

    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify({
      token: mockToken,
      patientId: newPatient.id,
      isPatient: true,
      clinicId: currentClinic.id
    }));

    setActiveScreen('patient_portal');
    return { success: true, patient: newPatient };
  };

  // Patient Login with Email / Code / Mobile
  const loginPatient = async (identifier: string, _password?: string): Promise<{ success: boolean; error?: string; patient?: Patient }> => {
    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanMobile = cleanId.replace(/\s+/g, '');
    
    const patient = allPatients.find(p => 
      p.email.toLowerCase() === cleanId || 
      p.patientCode.toLowerCase() === cleanId || 
      p.mobile.replace(/\s+/g, '') === cleanMobile
    );

    if (!patient) {
      return { 
        success: false, 
        error: 'No patient account found with this email, mobile number, or Patient Code. Please sign up if you have an invite code.' 
      };
    }

    const mockToken = `jwt_patient_token_${Date.now()}_${patient.id}`;
    setAuthToken(mockToken);
    setSelectedPatientId(patient.id);
    setIsPatientSession(true);
    setLoggedInPatient(patient);

    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify({
      token: mockToken,
      patientId: patient.id,
      isPatient: true,
      clinicId: patient.clinicId || currentClinic.id
    }));

    setActiveScreen('patient_portal');
    return { success: true, patient };
  };

  const switchClinic = (clinicId: string) => {
    const cl = clinics.find(c => c.id === clinicId);
    if (cl) {
      setSelectedClinicId(clinicId);
      const newAct: ClinicActivity = {
        id: `act-${Date.now()}`,
        clinicId,
        type: 'patient_registered',
        title: 'Clinic Switched',
        description: `Switched operational context to ${cl.name}`,
        timestamp: 'Just now',
        user: currentUser?.name || 'Doctor'
      };
      setAllActivities(prev => [newAct, ...prev]);
    }
  };

  const switchUserRole = (role: UserRole) => {
    const matchingUser = users.find(u => u.role === role) || users[0];
    setCurrentUser(matchingUser);
  };

  // Patient Actions
  const registerPatient = (input: RegisterPatientInput): Patient => {
    const nextCodeNumber = 1000 + allPatients.length + 1;
    const patientCode = `PBL-${nextCodeNumber}`;
    const id = `pat-${Date.now()}`;
    const todayStr = new Date().toISOString().split('T')[0];
    
    const renewalDate = new Date();
    renewalDate.setMonth(renewalDate.getMonth() + 3);
    const renewalStr = renewalDate.toISOString().split('T')[0];

    const plan = allPlans.find(p => p.id === input.assignedPlanId);

    const newPatient: Patient = {
      id,
      clinicId: currentClinic.id,
      patientCode,
      name: input.name,
      mobile: input.mobile,
      email: input.email,
      age: Number(input.age) || 0,
      gender: (input.gender as any) || 'female',
      heightCm: Number(input.heightCm) || 0,
      currentWeightKg: Number(input.weightKg) || 0,
      startingWeightKg: Number(input.weightKg) || 0,
      targetWeightKg: input.targetWeightKg ? Number(input.targetWeightKg) : undefined,
      bodyType: input.bodyType || 'Medium Frame',
      primaryGoals: input.primaryGoals?.filter(Boolean) || [],
      medicalConditions: input.medicalConditions?.filter(Boolean) || [],
      foodPreference: (input.foodPreference as FoodPreference) || 'Vegetarian',
      allergies: input.allergies?.filter(Boolean) || [],
      assignedDoctorId: input.assignedDoctorId || currentUser?.id || 'usr-1',
      assignedPlanId: input.assignedPlanId,
      assignedPlanName: plan?.name || 'Clinical Nutrition Protocol',
      status: 'active',
      joiningDate: todayStr,
      renewalDate: renewalStr,
      notes: input.consultationNotes || input.notes || 'Intake registered.',
      consultationNotes: input.consultationNotes || input.notes,
      voiceAudioUrl: input.voiceAudioUrl,
      voiceAudioDuration: input.voiceAudioDuration,
      voiceAudioDate: input.voiceAudioDate || (input.voiceAudioUrl ? formatDateTime(new Date()) : undefined),
      voiceTranscript: input.voiceTranscript
    };

    setAllPatients(prev => [newPatient, ...prev]);

    // Initial weight log
    if (input.weightKg && input.heightCm) {
      const bmiResult = calculateBmi(Number(input.weightKg), Number(input.heightCm));
      const initialWeight: WeightRecord = {
        id: `w-${Date.now()}`,
        patientId: id,
        date: todayStr,
        weightKg: Number(input.weightKg),
        bmi: bmiResult.bmi,
        notes: 'Baseline intake weight.',
        loggedBy: currentUser?.name || 'Doctor'
      };
      setAllWeightRecords(prev => [initialWeight, ...prev]);
    }

    // Create Initial Comprehensive Baseline Assessment (Single Editable Assessment)
    const initialAssessment: PatientAssessment = {
      id: `asmt-${Date.now()}`,
      patientId: id,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      doctorId: currentUser?.id || 'usr-1',
      doctorName: currentUser?.name || 'Dr. Ashmita Joshi, MD, RD',
      wakeTime: input.wakeTime || '06:30',
      sleepTime: input.sleepTime || '22:30',
      workHours: input.workHours || '09:00 - 18:00',
      dailyWaterLiters: input.dailyWaterLiters ? Number(input.dailyWaterLiters) : 2.5,
      physicalActivityLevel: input.physicalActivityLevel || 'Light Active',
      exerciseHabits: input.exerciseHabits || 'Brisk Walking & Light Activity',
      stressLevel: (input.stressLevel as any) || 'moderate',
      digestiveIssues: input.digestiveIssues || [],
      dietaryRestrictions: input.dietaryRestrictions || [],
      favoriteFoods: input.favoriteFoods || [],
      dislikedFoods: input.dislikedFoods || input.allergies || [],
      medicalHistory: input.medicalConditions || [],
      medications: input.medications || [],
      supplements: input.supplements || [],
      foodPreference: (input.foodPreference as FoodPreference) || 'Vegetarian',
      targetCalories: 1550,
      targetProteinGrams: 90,
      targetCarbsGrams: 145,
      targetFatGrams: 45,
      targetFiberGrams: 35,
      clinicalNotes: input.consultationNotes || input.notes || `Initial clinical assessment for ${newPatient.name}. Primary health goals: ${(newPatient.primaryGoals || []).join(', ') || 'Metabolic Optimization'}.`,
      consultationNotes: input.consultationNotes || input.notes,
      voiceAudioUrl: input.voiceAudioUrl,
      voiceAudioDuration: input.voiceAudioDuration,
      voiceAudioDate: input.voiceAudioDate || (input.voiceAudioUrl ? formatDateTime(new Date()) : undefined),
      voiceTranscript: input.voiceTranscript
    };
    setAllAssessments(prev => [initialAssessment, ...prev]);

    // Log Activity
    const act: ClinicActivity = {
      id: `act-${Date.now()}`,
      clinicId: currentClinic.id,
      type: 'patient_registered',
      title: 'New Patient Registered',
      description: `${newPatient.name} (${patientCode}) onboarded with baseline ${newPatient.currentWeightKg} kg.`,
      timestamp: 'Just now',
      patientId: id,
      patientName: newPatient.name,
      user: currentUser?.name || 'Doctor'
    };
    setAllActivities(prev => [act, ...prev]);

    return newPatient;
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    if (isPatientSession) {
      console.warn('RBAC Violation: Patient accounts are not authorized to update clinical records directly.');
      return;
    }
    setAllPatients(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deletePatient = (id: string) => {
    if (isPatientSession) {
      console.warn('RBAC Violation: Patient accounts cannot delete records.');
      return;
    }
    setAllPatients(prev => prev.filter(p => p.id !== id));
    if (selectedPatientId === id) {
      setSelectedPatientId(allPatients.find(p => p.id !== id)?.id || null);
    }
  };

  // Weight History Actions
  const getPatientWeightHistory = (patientId: string): WeightRecord[] => {
    return allWeightRecords
      .filter(w => w.patientId === patientId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const addWeightRecord = (params: {
    patientId: string;
    weightKg: number;
    date?: string;
    notes?: string;
    waistCm?: number;
    bodyFatPercentage?: number;
  }): WeightRecord => {
    const patient = allPatients.find(p => p.id === params.patientId);
    const height = patient ? patient.heightCm : 170;
    const bmiResult = calculateBmi(params.weightKg, height);
    const date = params.date || new Date().toISOString().split('T')[0];

    const newRecord: WeightRecord = {
      id: `w-${Date.now()}`,
      patientId: params.patientId,
      date,
      weightKg: Number(params.weightKg),
      bmi: bmiResult.bmi,
      notes: params.notes || 'Routine clinical weigh-in.',
      waistCm: params.waistCm,
      bodyFatPercentage: params.bodyFatPercentage,
      loggedBy: currentUser?.name || 'Doctor'
    };

    setAllWeightRecords(prev => [...prev, newRecord]);

    if (patient) {
      const weightDiff = Number((patient.startingWeightKg - params.weightKg).toFixed(1));
      updatePatient(params.patientId, { currentWeightKg: params.weightKg });

      const act: ClinicActivity = {
        id: `act-${Date.now()}`,
        clinicId: currentClinic.id,
        type: 'weight_logged',
        title: 'Weight Logged',
        description: `${patient.name} weighed ${params.weightKg} kg (${weightDiff > 0 ? `${weightDiff} kg total lost` : 'stable'}).`,
        timestamp: 'Just now',
        patientId: patient.id,
        patientName: patient.name,
        user: currentUser?.name || 'Doctor'
      };
      setAllActivities(prev => [act, ...prev]);
    }

    return newRecord;
  };

  const deleteWeightRecord = (id: string) => {
    setAllWeightRecords(prev => prev.filter(w => w.id !== id));
  };

  // Plan Actions
  const createPlan = (input: Omit<ClinicPlan, 'id' | 'clinicId'>): ClinicPlan => {
    const newPlan: ClinicPlan = {
      ...input,
      id: `plan-${Date.now()}`,
      clinicId: currentClinic.id,
      isActive: true,
      isArchived: false
    };
    setAllPlans(prev => [...prev, newPlan]);
    return newPlan;
  };

  const addPlan = (input: Omit<ClinicPlan, 'id' | 'clinicId'>): ClinicPlan => {
    return createPlan(input);
  };

  const updatePlan = (id: string, updates: Partial<ClinicPlan>) => {
    setAllPlans(prev => prev.map(pl => pl.id === id ? { ...pl, ...updates } : pl));
  };

  const editPlan = (id: string, updates: Partial<ClinicPlan>) => {
    updatePlan(id, updates);
  };

  const archivePlan = (id: string) => {
    setAllPlans(prev => prev.map(pl => pl.id === id ? { ...pl, isArchived: true, isActive: false } : pl));
  };

  const unarchivePlan = (id: string) => {
    setAllPlans(prev => prev.map(pl => pl.id === id ? { ...pl, isArchived: false, isActive: true } : pl));
  };

  const deletePlan = (id: string) => {
    setAllPlans(prev => prev.filter(pl => pl.id !== id));
  };

  // Payments and Invoices
  const recordPayment = (input: RecordPaymentInput): { payment: PaymentRecord; invoice: Invoice } => {
    const patient = allPatients.find(p => p.id === input.patientId);
    const plan = allPlans.find(p => p.id === input.planId);

    const discountAmount = input.discountType === 'percentage' 
      ? Number(((input.basePrice * input.discountValue) / 100).toFixed(2))
      : Number(input.discountValue);

    const taxableAmount = Math.max(0, input.basePrice - discountAmount);
    const taxAmount = Number(((taxableAmount * input.taxRate) / 100).toFixed(2));
    const totalAmount = Number((taxableAmount + taxAmount).toFixed(2));
    const paidAmount = Number(input.paidAmount);
    const pendingBalance = Math.max(0, Number((totalAmount - paidAmount).toFixed(2)));

    let status: PaymentStatus = 'paid';
    if (paidAmount === 0) status = 'pending';
    else if (pendingBalance > 0) status = 'partial';

    const paymentId = `pay-${Date.now()}`;
    const invoiceId = `inv-${Date.now()}`;
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(allInvoices.length + 88).padStart(4, '0')}`;
    const todayStr = input.paymentDate || new Date().toISOString().split('T')[0];

    const payment: PaymentRecord = {
      id: paymentId,
      invoiceId,
      clinicId: currentClinic.id,
      patientId: input.patientId,
      patientName: patient?.name || 'Patient',
      planId: input.planId,
      planName: plan?.name || 'Clinical Nutrition Plan',
      basePrice: input.basePrice,
      discountType: input.discountType,
      discountValue: input.discountValue,
      discountAmount,
      taxRate: input.taxRate,
      taxAmount,
      totalAmount,
      paidAmount,
      pendingBalance,
      paymentMode: input.paymentMode,
      transactionRef: input.transactionRef || `TXN-${Date.now().toString().slice(-6)}`,
      status,
      paymentDate: todayStr,
      dueDate: input.dueDate || todayStr,
      notes: input.notes,
      collectedBy: currentUser?.name || 'Clinic Desk'
    };

    const invoice: Invoice = {
      id: invoiceId,
      invoiceNumber,
      clinicId: currentClinic.id,
      patientId: input.patientId,
      patientName: patient?.name || 'Patient',
      patientMobile: patient?.mobile || '',
      patientEmail: patient?.email || '',
      paymentId,
      issueDate: todayStr,
      dueDate: input.dueDate || todayStr,
      items: [
        {
          id: `item-${Date.now()}`,
          description: `${plan?.name || 'Clinical Nutrition Protocol'} — Medical Nutrition Therapy & Body Composition`,
          duration: `${plan?.durationDays || 30} Days Active Care`,
          quantity: 1,
          unitPrice: input.basePrice,
          total: input.basePrice
        }
      ],
      subtotal: input.basePrice,
      discountAmount,
      taxableAmount,
      taxRate: input.taxRate,
      taxAmount,
      grandTotal: totalAmount,
      amountPaid: paidAmount,
      balanceDue: pendingBalance,
      status,
      paymentMode: input.paymentMode,
      transactionRef: payment.transactionRef,
      notes: input.notes || 'Thank you for choosing Perfect Body & Life Clinic.',
      doctorName: currentUser?.name || 'Dr. Ashmita Joshi, MD, RD',
      doctorLicense: currentUser?.licenseNumber || 'MCI-REG-84920/MAH'
    };

    setAllPayments(prev => [payment, ...prev]);
    setAllInvoices(prev => [invoice, ...prev]);

    if (patient && plan) {
      updatePatient(patient.id, {
        assignedPlanId: plan.id,
        assignedPlanName: plan.name,
        status: 'active'
      });
    }

    const act: ClinicActivity = {
      id: `act-${Date.now()}`,
      clinicId: currentClinic.id,
      type: 'payment_received',
      title: 'Payment Collected',
      description: `Collected ${currentClinic.currencySymbol}${(paidAmount || 0).toLocaleString()} (${status}) for ${payment.planName} - ${payment.patientName}.`,
      timestamp: 'Just now',
      patientId: patient?.id,
      patientName: payment.patientName,
      amount: paidAmount,
      user: currentUser?.name || 'Clinic Desk'
    };
    setAllActivities(prev => [act, ...prev]);

    return { payment, invoice };
  };

  const markInvoicePaid = (invoiceId: string, paymentMode: PaymentMode = 'upi', transactionRef?: string) => {
    const inv = allInvoices.find(i => i.id === invoiceId);
    if (!inv) return;

    const remaining = inv.balanceDue;
    const newPaid = inv.grandTotal;

    setAllInvoices(prev => prev.map(i => {
      if (i.id === invoiceId) {
        return {
          ...i,
          amountPaid: newPaid,
          balanceDue: 0,
          status: 'paid',
          paymentMode,
          transactionRef: transactionRef || `TXN-REC-${Date.now().toString().slice(-6)}`
        };
      }
      return i;
    }));

    setAllPayments(prev => prev.map(p => {
      if (p.invoiceId === invoiceId) {
        return {
          ...p,
          paidAmount: newPaid,
          pendingBalance: 0,
          status: 'paid',
          paymentMode,
          transactionRef: transactionRef || p.transactionRef
        };
      }
      return p;
    }));

    const act: ClinicActivity = {
      id: `act-${Date.now()}`,
      clinicId: currentClinic.id,
      type: 'payment_received',
      title: 'Invoice Cleared',
      description: `Received balance ${currentClinic.currencySymbol}${(remaining || 0).toLocaleString()} on ${inv.invoiceNumber}.`,
      timestamp: 'Just now',
      patientId: inv.patientId,
      patientName: inv.patientName,
      amount: remaining,
      user: currentUser?.name || 'Doctor'
    };
    setAllActivities(prev => [act, ...prev]);
  };

  // Phase 2: Assessment Methods
  const saveAssessment = (assessment: PatientAssessment) => {
    setAllAssessments(prev => {
      const exists = prev.some(a => a.id === assessment.id);
      if (exists) {
        return prev.map(a => a.id === assessment.id ? { ...assessment, updatedAt: new Date().toISOString() } : a);
      }
      return [assessment, ...prev];
    });

    const pat = allPatients.find(p => p.id === assessment.patientId);
    const act: ClinicActivity = {
      id: `act-${Date.now()}`,
      clinicId: currentClinic.id,
      type: 'patient_registered',
      title: 'Assessment Recorded (v' + assessment.version + ')',
      description: `Clinical assessment updated for ${pat?.name || 'Patient'} (Version ${assessment.version}).`,
      timestamp: 'Just now',
      patientId: assessment.patientId,
      patientName: pat?.name,
      user: currentUser?.name || 'Doctor'
    };
    setAllActivities(prev => [act, ...prev]);
  };

  const getPatientAssessments = (patientId: string): PatientAssessment[] => {
    return allAssessments
      .filter(a => a.patientId === patientId)
      .sort((a, b) => b.version - a.version);
  };

  const getLatestAssessment = (patientId: string): PatientAssessment | null => {
    const list = getPatientAssessments(patientId);
    return list[0] || null;
  };

  // Phase 2: AI Clinical Meal Plan Methods
  const saveMealPlan = (plan: ClinicalMealPlan) => {
    setAllClinicalMealPlans(prev => {
      const exists = prev.some(p => p.id === plan.id);
      if (exists) {
        return prev.map(p => p.id === plan.id ? plan : p);
      }
      return [plan, ...prev];
    });
    setSelectedMealPlanId(plan.id);
  };

  const publishMealPlan = (planId: string) => {
    setAllClinicalMealPlans(prev => prev.map(p => {
      if (p.id === planId) {
        return {
          ...p,
          status: 'published',
          publishedAt: new Date().toISOString(),
          changeLog: [...(p.changeLog || []), `Published to patient app on ${formatDate(new Date())}`]
        };
      }
      return p;
    }));

    const targetPlan = allClinicalMealPlans.find(p => p.id === planId);
    if (targetPlan) {
      const act: ClinicActivity = {
        id: `act-${Date.now()}`,
        clinicId: currentClinic.id,
        type: 'plan_renewed',
        title: 'AI Meal Plan Published',
        description: `Plan "${targetPlan.title}" published live for ${targetPlan.patientName}.`,
        timestamp: 'Just now',
        patientId: targetPlan.patientId,
        patientName: targetPlan.patientName,
        user: currentUser?.name || 'Doctor'
      };
      setAllActivities(prev => [act, ...prev]);
    }
  };

  const getPatientMealPlans = (patientId: string): ClinicalMealPlan[] => {
    return allClinicalMealPlans
      .filter(p => p.patientId === patientId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const getActiveMealPlan = (patientId: string): ClinicalMealPlan | null => {
    const plans = getPatientMealPlans(patientId);
    // Find published or latest draft
    return plans.find(p => p.status === 'published') || plans[0] || null;
  };

  // Phase 2: Exercise Plan Methods
  const saveExercisePlan = (plan: ExercisePlan) => {
    setAllExercisePlans(prev => {
      const exists = prev.some(p => p.id === plan.id);
      if (exists) {
        return prev.map(p => p.id === plan.id ? plan : p);
      }
      return [plan, ...prev];
    });
  };

  const publishExercisePlan = (planId: string) => {
    setAllExercisePlans(prev => prev.map(p => {
      if (p.id === planId) {
        return {
          ...p,
          status: 'published',
          publishedAt: new Date().toISOString()
        };
      }
      return p;
    }));

    const targetPlan = allExercisePlans.find(p => p.id === planId);
    if (targetPlan) {
      const act: ClinicActivity = {
        id: `act-${Date.now()}`,
        clinicId: currentClinic.id,
        type: 'plan_renewed',
        title: 'Exercise Protocol Published',
        description: `Prescribed exercise routine published live for patient.`,
        timestamp: 'Just now',
        patientId: targetPlan.patientId,
        patientName: targetPlan.patientName || 'Patient',
        user: currentUser?.name || 'Doctor'
      };
      setAllActivities(prev => [act, ...prev]);
    }
  };

  const getPatientExercisePlan = (patientId: string): ExercisePlan | null => {
    const existing = allExercisePlans.find(p => p.patientId === patientId);
    if (existing) return existing;
    if (patientId === 'pat-1' && INITIAL_EXERCISE_PLANS[0]) {
      return INITIAL_EXERCISE_PLANS[0];
    }
    return null;
  };

  const addExerciseToPatientPlan = (patientId: string, exerciseData: Omit<ExerciseItem, 'id'>): ExerciseItem => {
    const targetPatient = allPatients.find(p => p.id === patientId) || selectedPatient;
    const newExercise: ExerciseItem = {
      ...exerciseData,
      id: `ex-assigned-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    };

    setAllExercisePlans(prev => {
      const existingPlan = prev.find(p => p.patientId === patientId);
      if (existingPlan) {
        const currentAssigned = existingPlan.assignedExercises || [];
        const updatedPlan: ExercisePlan = {
          ...existingPlan,
          assignedExercises: [...currentAssigned, newExercise],
          status: 'published'
        };
        return prev.map(p => p.id === existingPlan.id ? updatedPlan : p);
      } else {
        const newPlan: ExercisePlan = {
          id: `explan-${Date.now()}`,
          patientId,
          patientName: targetPatient?.name || 'Patient',
          clinicId: currentClinic.id,
          title: 'Prescribed Metabolic Exercise & Form Guide',
          status: 'published',
          weeklyGoalDays: 4,
          dailyStepTarget: 8500,
          assignedExercises: [newExercise],
          routines: [],
          doctorNotes: 'Follow the assigned movement sequence with strict posture adherence and prescribed rest intervals.',
          createdAt: new Date().toISOString(),
          publishedAt: new Date().toISOString()
        };
        return [newPlan, ...prev];
      }
    });

    // Record activity
    const act: ClinicActivity = {
      id: `act-${Date.now()}`,
      clinicId: currentClinic.id,
      type: 'plan_renewed',
      title: 'Exercise Prescribed',
      description: `Assigned "${newExercise.name}" (${newExercise.sets || 3} sets × ${newExercise.reps || '12 reps'}) to ${targetPatient?.name || 'patient'}.`,
      timestamp: 'Just now',
      patientId,
      patientName: targetPatient?.name || 'Patient',
      user: currentUser?.name || 'Dr. Ashmita Joshi'
    };
    setAllActivities(prev => [act, ...prev]);

    return newExercise;
  };

  const updateExerciseInPatientPlan = (patientId: string, exerciseId: string, updates: Partial<ExerciseItem>) => {
    setAllExercisePlans(prev => {
      return prev.map(plan => {
        if (plan.patientId !== patientId) return plan;
        const currentAssigned = plan.assignedExercises || [];
        const updatedAssigned = currentAssigned.map(ex => {
          if (ex.id === exerciseId) {
            return { ...ex, ...updates };
          }
          return ex;
        });

        const updatedRoutines = (plan.routines || []).map(r => ({
          ...r,
          exercises: (r.exercises || []).map(ex => ex.id === exerciseId ? { ...ex, ...updates } : ex)
        }));

        return {
          ...plan,
          assignedExercises: updatedAssigned,
          routines: updatedRoutines
        };
      });
    });
  };

  const removeExerciseFromPatientPlan = (patientId: string, exerciseId: string) => {
    setAllExercisePlans(prev => {
      return prev.map(plan => {
        if (plan.patientId !== patientId) return plan;
        const currentAssigned = plan.assignedExercises || [];
        const updatedAssigned = currentAssigned.filter(ex => ex.id !== exerciseId);
        const updatedRoutines = (plan.routines || []).map(r => ({
          ...r,
          exercises: (r.exercises || []).filter(ex => ex.id !== exerciseId)
        }));

        return {
          ...plan,
          assignedExercises: updatedAssigned,
          routines: updatedRoutines
        };
      });
    });
  };

  const getPatientAssignedExercises = (patientId: string): ExerciseItem[] => {
    const plan = allExercisePlans.find(p => p.patientId === patientId);
    if (plan && plan.assignedExercises && plan.assignedExercises.length > 0) {
      return plan.assignedExercises;
    }
    if (plan && plan.routines && plan.routines.length > 0) {
      const routineExercises = plan.routines.flatMap(r => r.exercises || []);
      if (routineExercises.length > 0) {
        return routineExercises;
      }
    }
    // For demo starter patient pat-1, return the initial published exercise list
    if (patientId === 'pat-1' && INITIAL_EXERCISE_PLANS[0]) {
      return INITIAL_EXERCISE_PLANS[0].routines.flatMap(r => r.exercises || []);
    }
    return [];
  };

  // Phase 2: Recipe Modal
  const openRecipeModal = (recipeOrOption: RecipeDetail | MealOption | string) => {
    if (typeof recipeOrOption === 'string') {
      const found = RECIPE_CATALOG[recipeOrOption];
      if (found) {
        setSelectedRecipe(found);
      } else {
        // Fallback default recipe
        setSelectedRecipe(Object.values(RECIPE_CATALOG)[0]);
      }
    } else if ('servings' in recipeOrOption) {
      // RecipeDetail
      setSelectedRecipe(recipeOrOption);
    } else {
      // MealOption to RecipeDetail conversion
      const mo = recipeOrOption as MealOption;
      const catalogMatch = RECIPE_CATALOG[mo.id];
      if (catalogMatch) {
        setSelectedRecipe(catalogMatch);
      } else {
        setSelectedRecipe({
          id: mo.id,
          name: mo.name,
          category: 'Clinical Protocol',
          slotType: mo.slotType,
          prepTimeMinutes: mo.prepTimeMinutes || 8,
          cookTimeMinutes: 10,
          servings: 1,
          servingSizeDescription: mo.portion,
          calories: mo.calories,
          protein: mo.protein,
          carbs: mo.carbs,
          fat: mo.fat,
          fiber: mo.fiber,
          micronutrients: mo.micronutrients || {
            vitaminC: 35,
            calcium: 20,
            iron: 18,
            magnesium: 25,
            potassium: 22
          },
          ingredients: (mo.ingredients || ['Fresh ingredients']).map(i => ({ item: i, amount: '1 serving' })),
          steps: mo.instructions?.length ? mo.instructions : [
            'Assemble fresh clinical ingredients as instructed.',
            'Steam or pan-sear with healthy cold-pressed oil.',
            'Serve warm and enjoy mindfully.'
          ],
          dietaryTags: [mo.glycemicIndex + ' GI', 'Clinical Nutrition'],
          chefTip: 'Eat mindfully and chew thoroughly for optimal enzymatic digestion.',
          clinicalBenefit: mo.clinicalBenefit || 'Formulated for metabolic stabilization.',
          imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600'
        });
      }
    }
    setIsRecipeModalOpen(true);
  };

  const closeRecipeModal = () => {
    setIsRecipeModalOpen(false);
    setSelectedRecipe(null);
  };

  // Phase 2: Patient Daily Logs
  const updatePatientDailyLog = (patientId: string, updates: Partial<PatientDailyLog>) => {
    setAllPatientLogs(prev => {
      const existing = prev[patientId] || {
        date: new Date().toISOString().split('T')[0],
        waterGlassesDrank: 4,
        waterGoalGlasses: 8,
        mealsStatus: {},
        exercisesCompleted: []
      };
      return {
        ...prev,
        [patientId]: {
          ...existing,
          ...updates,
          mealsStatus: {
            ...existing.mealsStatus,
            ...(updates.mealsStatus || {})
          }
        }
      };
    });
  };

  const getPatientDailyLog = (patientId: string): PatientDailyLog => {
    return allPatientLogs[patientId] || {
      date: new Date().toISOString().split('T')[0],
      waterGlassesDrank: 4,
      waterGoalGlasses: 8,
      mealsStatus: {},
      exercisesCompleted: []
    };
  };

  // Phase 3: Body Circumference Measurements
  const addBodyMeasurement = (record: Omit<BodyMeasurementsRecord, 'id'>): BodyMeasurementsRecord => {
    const pat = allPatients.find(p => p.id === record.patientId);
    const heightM = (record.heightCm || pat?.heightCm) ? ((record.heightCm || pat!.heightCm) / 100) : undefined;
    const bmi = (record.weightKg !== undefined && heightM) ? Number((record.weightKg / (heightM * heightM)).toFixed(1)) : record.bmi;
    const newRecord: BodyMeasurementsRecord = {
      ...record,
      id: `meas-${Date.now()}`,
      bmi
    };

    setAllBodyMeasurements(prev => [newRecord, ...prev]);

    // Also update patient current weight and add to weight history if weight was provided
    if (pat && record.weightKg !== undefined) {
      updatePatient(pat.id, { currentWeightKg: record.weightKg });
      addWeightRecord({
        patientId: pat.id,
        weightKg: record.weightKg,
        date: record.date,
        waistCm: record.waistCm || (record.waistInches ? Math.round(record.waistInches * 2.54) : undefined),
        bodyFatPercentage: record.bodyFatPercentage,
        notes: record.notes ? `Circumference log: ${record.notes}` : (record.waistInches ? `Logged waist ${record.waistInches}"` : undefined)
      });
    }

    return newRecord;
  };

  const getPatientMeasurements = (patientId: string): BodyMeasurementsRecord[] => {
    return allBodyMeasurements
      .filter(m => m.patientId === patientId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  // Phase 3: Progress Photos
  const addProgressPhoto = (photo: Omit<ProgressPhoto, 'id'>): ProgressPhoto => {
    const newPhoto: ProgressPhoto = {
      ...photo,
      id: `photo-${Date.now()}`
    };
    setAllProgressPhotos(prev => [newPhoto, ...prev]);
    return newPhoto;
  };

  const deleteProgressPhoto = (id: string) => {
    setAllProgressPhotos(prev => prev.filter(p => p.id !== id));
  };

  const getPatientPhotos = (patientId: string, angle?: PhotoAngle, stage?: PhotoStage): ProgressPhoto[] => {
    return allProgressPhotos.filter(p => {
      if (p.patientId !== patientId) return false;
      if (angle && p.angle !== angle) return false;
      if (stage && p.stage !== stage) return false;
      return true;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  // Phase 3: Reminders System
  const getPatientReminders = (patientId: string): PatientReminderConfig[] => {
    if (allReminders[patientId] && allReminders[patientId].length > 0) {
      return allReminders[patientId];
    }
    const generated = generateInitialRemindersForPatient(patientId);
    setAllReminders(prev => ({ ...prev, [patientId]: generated }));
    return generated;
  };

  const updatePatientReminder = (patientId: string, reminderId: string, updates: Partial<PatientReminderConfig>) => {
    setAllReminders(prev => {
      const currentList = prev[patientId] || generateInitialRemindersForPatient(patientId);
      const updatedList = currentList.map(r => r.id === reminderId ? { ...r, ...updates } : r);
      return { ...prev, [patientId]: updatedList };
    });
  };

  const toggleReminderChannel = (patientId: string, reminderId: string, channel: 'push' | 'whatsapp' | 'sms') => {
    setAllReminders(prev => {
      const currentList = prev[patientId] || generateInitialRemindersForPatient(patientId);
      const updatedList = currentList.map(r => {
        if (r.id === reminderId) {
          return {
            ...r,
            channels: {
              ...r.channels,
              [channel]: !r.channels[channel]
            }
          };
        }
        return r;
      });
      return { ...prev, [patientId]: updatedList };
    });
  };

  const triggerTestReminderNotification = (reminder: PatientReminderConfig, channel: 'push' | 'whatsapp' | 'sms') => {
    const pat = allPatients.find(p => p.id === reminder.patientId);
    const channelNames = { push: '📱 Push Notification', whatsapp: '💬 WhatsApp Message', sms: '✉️ SMS Alert' };
    
    setActiveToastNotification({
      id: `alert-${Date.now()}`,
      title: `${channelNames[channel]}: ${reminder.title}`,
      message: reminder.customMessage.replace('{name}', pat?.name ? pat.name.split(' ')[0] : 'Patient'),
      channel,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  };

  const dismissToastNotification = () => {
    setActiveToastNotification(null);
  };

  // Phase 3: WhatsApp Chat
  const sendChatMessage = (input: { 
    patientId: string; 
    content: string; 
    type?: 'text' | 'photo' | 'pdf' | 'meal_plan' | 'exercise_plan'; 
    sender?: 'doctor' | 'patient'; 
    mediaUrl?: string; 
    mediaMeta?: any 
  }): ChatMessage => {
    const sender: 'doctor' | 'patient' = isPatientSession ? 'patient' : (input.sender || 'doctor');
    const targetPatient = allPatients.find(p => p.id === input.patientId) || loggedInPatient || selectedPatient;
    const senderName = sender === 'doctor' 
      ? (currentUser?.name || 'Dr. Ashmita Joshi') 
      : (targetPatient?.name || 'Patient');
    const senderRole = sender === 'doctor' ? (currentUser?.roleTitle || 'Clinical Dietitian') : 'Patient';
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toISOString().split('T')[0];
    const nowMs = Date.now();

    const newMsg: ChatMessage = {
      id: `msg-${nowMs}-${Math.random().toString(36).substring(2, 7)}`,
      patientId: input.patientId,
      clinicId: currentClinic.id,
      sender,
      senderName,
      senderRole,
      timestamp: `Today, ${timeStr}`,
      date: dateStr,
      createdAt: nowMs,
      content: input.content,
      type: input.type || 'text',
      mediaUrl: input.mediaUrl,
      mediaMeta: input.mediaMeta,
      isRead: sender === 'doctor' && !isPatientSession, // Marked unread if sent to doctor
      status: 'delivered'
    };

    setAllChatMessages(prev => [...prev, newMsg]);
    return newMsg;
  };

  const markChatAsRead = (patientId: string) => {
    setAllChatMessages(prev => prev.map(m => {
      if (m.patientId === patientId && !m.isRead) {
        return { ...m, isRead: true, status: 'read' };
      }
      return m;
    }));
  };

  const getPatientChatMessages = (patientId: string): ChatMessage[] => {
    return allChatMessages
      .filter(m => m.patientId === patientId)
      .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
  };

  const getUnreadChatCount = (patientId?: string): number => {
    if (patientId) {
      return allChatMessages.filter(m => m.patientId === patientId && m.sender === 'patient' && !m.isRead).length;
    }
    return allChatMessages.filter(m => m.sender === 'patient' && !m.isRead).length;
  };

  const getAllConversationsSummary = (): ChatConversationSummary[] => {
    return patients.map(pat => {
      const patientMsgs = allChatMessages
        .filter(m => m.patientId === pat.id)
        .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
      const lastMsg = patientMsgs[patientMsgs.length - 1];
      const unreadCount = patientMsgs.filter(m => m.sender === 'patient' && !m.isRead).length;
      return {
        patientId: pat.id,
        patientName: pat.name,
        patientCode: pat.patientCode,
        patientStatus: pat.status,
        lastMessage: lastMsg ? (lastMsg.type === 'photo' ? '📷 Photo' : lastMsg.type === 'pdf' ? '📄 Document' : lastMsg.type === 'exercise_plan' ? '🏋️ Exercise Routine' : lastMsg.content) : 'No conversations yet',
        lastMessageTimestamp: lastMsg?.timestamp || 'New',
        unreadCount,
        isOnline: pat.id === 'pat-1' || pat.id === 'pat-2'
      };
    });
  };

  // Phase 3: AI Copilot Generators
  const generateCopilotMotivation = (patientId: string, tone: 'celebratory' | 'empathetic' | 'strict_discipline' = 'celebratory'): string => {
    const pat = allPatients.find(p => p.id === patientId) || selectedPatient;
    const name = pat ? pat.name.split(' ')[0] : 'there';
    const lostKg = pat ? Math.max(0, Number((pat.startingWeightKg - pat.currentWeightKg).toFixed(1))) : 3.5;
    
    if (tone === 'celebratory') {
      return `🌟 Clinical Milestone for ${name}: Outstanding adherence! You have systematically dropped ${lostKg} kg of visceral fat while protecting your lean muscle mass. Your metabolic flexibility and blood sugar stabilization are clearly visible. Keep this momentum into the weekend! 💪🥗`;
    } else if (tone === 'empathetic') {
      return `🌱 Gentle check-in for ${name}: Remember that hormonal and metabolic adaptation takes steady consistency, not perfection. If you experienced higher stress or a dining out fluctuation, don't worry. Hydrate well with 2.5L today, prioritize protein in your next meal, and let's reset together. You are doing great! ❤️`;
    }
  };

  const setPatientDailyMotivation = (patientId: string, message: string, tone?: string) => {
    if (isPatientSession) return; // Patients cannot edit or publish motivation
    const targetPatient = allPatients.find(p => p.id === patientId);
    if (!targetPatient) return;
    
    const motivationPayload = {
      message,
      authorName: currentUser?.name || 'Dr. Ashmita Joshi',
      date: new Date().toISOString().split('T')[0],
      tone: tone || 'celebratory'
    };

    updatePatient(patientId, {
      dailyMotivationMessage: motivationPayload
    });
  };

  const generateCopilotProgressSummary = (patientId: string): string => {
    const pat = allPatients.find(p => p.id === patientId) || selectedPatient;
    if (!pat) return 'Patient record not found.';
    const measurements = getPatientMeasurements(pat.id);
    const latestMeas = measurements[measurements.length - 1];
    const initialMeas = measurements[0];
    const lostKg = (pat.startingWeightKg - pat.currentWeightKg).toFixed(1);
    const waistLost = (initialMeas && latestMeas) ? (initialMeas.waistInches - latestMeas.waistInches).toFixed(1) : '4.5';
    
    return `[CLINICAL PROGRESS SOAP DIGEST - ${pat.name.toUpperCase()} (${pat.patientCode})]
• Subjective: Patient reports elevated daytime vitality, absence of mid-afternoon hypoglycemia crashes, and improved sleep quality.
• Objective: Starting Weight: ${pat.startingWeightKg}kg ➔ Current Weight: ${pat.currentWeightKg}kg (Net Loss: -${lostKg} kg).
• Circumference Trajectory: Waistline reduced by -${waistLost} inches (Visceral fat index decreased from High to Optimal).
• Assessment: Excellent compliance with low-GI macronutrient splits. Insulin sensitivity markers demonstrating positive reversal.
• Plan: Maintain Phase 3 Choice Meal Plan at 1,550 kcal with 92g target protein. Continue 4x weekly resistance circuit. Review in 14 days.`;
  };

  const generateCopilotFoodSwap = (cravingText: string): FoodSwapSuggestion | null => {
    const lower = (cravingText || '').toLowerCase().trim();
    if (!lower) return FOOD_SWAPS_CATALOG[0] || null;
    const found = FOOD_SWAPS_CATALOG.find(item => {
      const dish = (item.cravingOrDish || '').toLowerCase();
      const cat = (item.category || '').toLowerCase();
      const firstWord = dish.split(' ')[0] || '';
      return dish.includes(lower) || (firstWord && lower.includes(firstWord)) || cat.includes(lower);
    });
    return found || FOOD_SWAPS_CATALOG[0];
  };

  // Phase 4: Dietitian Workflow Notifications & Start Date Reminders
  const [dismissedNotifIds, setDismissedNotifIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('pbal_dismissed_dietitian_notifs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [readNotifIds, setReadNotifIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('pbal_read_dietitian_notifs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('pbal_dismissed_dietitian_notifs', JSON.stringify(dismissedNotifIds));
    } catch (e) {
      console.error(e);
    }
  }, [dismissedNotifIds]);

  useEffect(() => {
    try {
      localStorage.setItem('pbal_read_dietitian_notifs', JSON.stringify(readNotifIds));
    } catch (e) {
      console.error(e);
    }
  }, [readNotifIds]);

  const getDietitianNotifications = (): DietitianNotification[] => {
    const notifs: DietitianNotification[] = [];
    const today = new Date();

    allClinicalMealPlans.forEach(plan => {
      if (!plan.startDate) return;
      const pat = allPatients.find(p => p.id === plan.patientId);
      if (!pat) return;

      const diffDays = getDaysDifference(today, plan.startDate);
      const duration = plan.durationDays || 7;
      const formattedStartDate = formatDate(plan.startDate);
      const notifId = `notif-plan-${plan.id}-${plan.startDate}`;

      if (dismissedNotifIds.includes(notifId)) return;

      // 1 Day before start date (diffDays === 1)
      if (diffDays === 1) {
        if (plan.status === 'published') {
          notifs.push({
            id: notifId,
            type: 'diet_plan_starting_soon',
            title: 'Diet Plan Starts Tomorrow (Ready)',
            message: `${pat.name}'s ${duration}-day diet plan starts tomorrow (${formattedStartDate}). Plan is finalized & published.`,
            patientId: pat.id,
            patientName: pat.name,
            patientCode: pat.patientCode,
            planId: plan.id,
            planStartDate: plan.startDate,
            planEndDate: plan.endDate,
            durationDays: duration,
            planStatus: 'published',
            isRead: readNotifIds.includes(notifId),
            createdAt: plan.createdAt,
            actionRequired: false,
            cycleNumber: plan.cycleNumber || 1
          });
        } else {
          notifs.push({
            id: notifId,
            type: 'diet_plan_starting_soon',
            title: 'Diet Plan Reminder (Action Required)',
            message: `${pat.name}'s diet plan starts tomorrow (${formattedStartDate}). Make sure their ${duration}-day plan is ready.`,
            patientId: pat.id,
            patientName: pat.name,
            patientCode: pat.patientCode,
            planId: plan.id,
            planStartDate: plan.startDate,
            planEndDate: plan.endDate,
            durationDays: duration,
            planStatus: 'draft',
            isRead: readNotifIds.includes(notifId),
            createdAt: plan.createdAt,
            actionRequired: true,
            cycleNumber: plan.cycleNumber || 1
          });
        }
      } else if (diffDays === 0) {
        notifs.push({
          id: notifId,
          type: 'diet_plan_starting_soon',
          title: plan.status === 'published' ? 'Diet Plan Active Today' : 'Diet Plan Starts Today (Action Required)',
          message: plan.status === 'published'
            ? `${pat.name}'s ${duration}-day diet plan is active starting today (${formattedStartDate}).`
            : `${pat.name}'s diet plan starts today (${formattedStartDate}). Finalization required.`,
          patientId: pat.id,
          patientName: pat.name,
          patientCode: pat.patientCode,
          planId: plan.id,
          planStartDate: plan.startDate,
          planEndDate: plan.endDate,
          durationDays: duration,
          planStatus: plan.status,
          isRead: readNotifIds.includes(notifId),
          createdAt: plan.createdAt,
          actionRequired: plan.status !== 'published',
          cycleNumber: plan.cycleNumber || 1
        });
      } else if (diffDays > 1 && diffDays <= 3) {
        notifs.push({
          id: notifId,
          type: 'diet_plan_starting_soon',
          title: plan.status === 'published' ? `Diet Plan Scheduled (Starts in ${diffDays} days)` : `Diet Plan Draft (Starts in ${diffDays} days)`,
          message: `${pat.name}'s ${duration}-day diet plan starts on ${formattedStartDate} (${diffDays} days away).`,
          patientId: pat.id,
          patientName: pat.name,
          patientCode: pat.patientCode,
          planId: plan.id,
          planStartDate: plan.startDate,
          planEndDate: plan.endDate,
          durationDays: duration,
          planStatus: plan.status,
          isRead: readNotifIds.includes(notifId),
          createdAt: plan.createdAt,
          actionRequired: plan.status !== 'published',
          cycleNumber: plan.cycleNumber || 1
        });
      }

      // Check recurring cycle end reminder (1 day before endDate)
      if (plan.endDate) {
        const endDiffDays = getDaysDifference(today, plan.endDate);
        const recurringNotifId = `notif-recurring-${plan.id}-${plan.endDate}`;
        if (!dismissedNotifIds.includes(recurringNotifId) && (endDiffDays === 1 || endDiffDays === 0)) {
          const nextStartDate = addDays(plan.endDate, 1);
          const formattedNextStart = formatDate(nextStartDate);
          notifs.push({
            id: recurringNotifId,
            type: 'diet_plan_needs_renewal',
            title: `Recurring Plan: Cycle ${(plan.cycleNumber || 1) + 1} Preparation Due`,
            message: `${pat.name}'s current ${duration}-day cycle completes ${endDiffDays === 1 ? 'tomorrow' : 'today'}. Prepare Week ${(plan.cycleNumber || 1) + 1} plan starting ${formattedNextStart}.`,
            patientId: pat.id,
            patientName: pat.name,
            patientCode: pat.patientCode,
            planId: plan.id,
            planStartDate: plan.startDate,
            planEndDate: plan.endDate,
            durationDays: duration,
            planStatus: 'draft',
            isRead: readNotifIds.includes(recurringNotifId),
            createdAt: new Date().toISOString(),
            actionRequired: true,
            cycleNumber: (plan.cycleNumber || 1) + 1
          });
        }
      }
    });

    return notifs;
  };

  const dismissDietitianNotification = (id: string) => {
    setDismissedNotifIds(prev => [...prev, id]);
  };

  const markDietitianNotificationAsRead = (id: string) => {
    setReadNotifIds(prev => prev.includes(id) ? prev : [...prev, id]);
  };

  const markAllDietitianNotificationsAsRead = () => {
    const allIds = getDietitianNotifications().map(n => n.id);
    setReadNotifIds(prev => Array.from(new Set([...prev, ...allIds])));
  };

  const getDietPlanReminderForPatient = (patientId: string): DietitianNotification | null => {
    const notifs = getDietitianNotifications();
    return notifs.find(n => n.patientId === patientId) || null;
  };

  // KPIs Calculations
  const getDashboardKpis = () => {
    const active = patients.filter(p => p.status === 'active').length;
    const totalPatients = patients.length;
    const totalRev = payments.reduce((acc, curr) => acc + (curr.paidAmount || 0), 0);
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyRev = payments.reduce((acc, curr) => {
      const pDate = new Date(curr.paymentDate);
      if (pDate.getMonth() === currentMonth && pDate.getFullYear() === currentYear) {
        return acc + (curr.paidAmount || 0);
      }
      return acc;
    }, 0);

    const pendingPayments = payments.reduce((acc, curr) => acc + (curr.pendingBalance || 0), 0);
    const pendingInvoices = invoices.filter(i => i.status === 'pending' || i.status === 'partial' || i.status === 'overdue').length;
    const renewalsDue = patients.filter(p => p.status === 'pending_renewal').length;

    let totalWeightLost = 0;
    let countedPatients = 0;
    patients.forEach(p => {
      const diff = p.startingWeightKg - p.currentWeightKg;
      if (diff > 0) {
        totalWeightLost += diff;
        countedPatients++;
      }
    });
    const avgWeightLossKg = countedPatients > 0 ? Number((totalWeightLost / countedPatients).toFixed(1)) : 4.5;
    const activeMealPlansCount = clinicalMealPlans.filter(p => p.status === 'published').length;
    const unreadChatCount = allChatMessages.filter(m => m.sender === 'patient' && !m.isRead).length;
    const dueWeighInsCount = MOCK_WEIGHT_UPDATES_DUE.length;
    const expiringPlansCount = MOCK_EXPIRING_PLANS.length;
    const dietitianNotifs = getDietitianNotifications();
    const dietitianReminderCount = dietitianNotifs.filter(n => !n.isRead).length;

    return {
      activePatients: active,
      totalPatients,
      monthlyRevenue: monthlyRev,
      totalRevenue: totalRev,
      pendingPaymentsAmount: pendingPayments,
      pendingInvoicesCount: pendingInvoices,
      renewalsDueCount: renewalsDue,
      avgWeightLossKg,
      activeMealPlansCount,
      unreadChatCount,
      dueWeighInsCount,
      expiringPlansCount,
      dietitianReminderCount,
      upcomingDietPlanReminders: dietitianNotifs
    };
  };

  return (
    <ClinicContext.Provider
      value={{
        activeScreen,
        navigateTo,
        isAuthenticated: !!authToken,
        authToken,
        currentUser,
        currentClinic,
        clinics,
        users,
        loginWithPassword,
        requestOtp,
        verifyOtp,
        logout,
        switchClinic,
        switchUserRole,
        // Patient Auth & Invites
        patientInvites,
        validatePatientCode,
        registerPatientWithCode,
        issuePatientInviteCode,
        loginPatient,
        isPatientSession,
        loggedInPatient,
        selectedPatientId,
        setSelectedPatientId,
        selectedPatient,
        selectedInvoiceId,
        setSelectedInvoiceId,
        selectedInvoice,
        selectedMealPlanId,
        setSelectedMealPlanId,
        patients,
        weightRecords,
        plans,
        payments,
        invoices,
        activities,
        assessments,
        clinicalMealPlans,
        exercisePlans,
        patientLogs: allPatientLogs,
        registerPatient,
        updatePatient,
        deletePatient,
        getPatientWeightHistory,
        addWeightRecord,
        deleteWeightRecord,
        createPlan,
        addPlan,
        updatePlan,
        editPlan,
        archivePlan,
        unarchivePlan,
        deletePlan,
        recordPayment,
        markInvoicePaid,
        saveAssessment,
        getPatientAssessments,
        getLatestAssessment,
        saveMealPlan,
        publishMealPlan,
        getPatientMealPlans,
        getActiveMealPlan,
        saveExercisePlan,
        publishExercisePlan,
        getPatientExercisePlan,
        addExerciseToPatientPlan,
        updateExerciseInPatientPlan,
        removeExerciseFromPatientPlan,
        getPatientAssignedExercises,
        selectedRecipe,
        isRecipeModalOpen,
        openRecipeModal,
        closeRecipeModal,
        updatePatientDailyLog,
        getPatientDailyLog,
        // Phase 3
        bodyMeasurements: allBodyMeasurements,
        addBodyMeasurement,
        getPatientMeasurements,
        progressPhotos: allProgressPhotos,
        addProgressPhoto,
        deleteProgressPhoto,
        getPatientPhotos,
        getPatientReminders,
        updatePatientReminder,
        toggleReminderChannel,
        triggerTestReminderNotification,
        activeToastNotification,
        dismissToastNotification,
        chatMessages: allChatMessages,
        sendChatMessage,
        markChatAsRead,
        getPatientChatMessages,
        getUnreadChatCount,
        getAllConversationsSummary,
        foodSwapsCatalog: FOOD_SWAPS_CATALOG,
        nutrientGapsTemplates: NUTRIENT_GAP_TEMPLATES,
        goalDistributionStats: MOCK_GOAL_DISTRIBUTION,
        weightUpdatesDueList: MOCK_WEIGHT_UPDATES_DUE,
        expiringPlansList: MOCK_EXPIRING_PLANS,
        generateCopilotMotivation,
        generateCopilotProgressSummary,
        generateCopilotFoodSwap,
        setPatientDailyMotivation,
        // Modals
        isRegisterModalOpen,
        setIsRegisterModalOpen,
        isPaymentModalOpen,
        setIsPaymentModalOpen,
        isWeightModalOpen,
        setIsWeightModalOpen,
        isCreatePlanModalOpen,
        setIsCreatePlanModalOpen,
        editingPlan,
        setEditingPlan,
        openPlanModal,
        closePlanModal,
        isMeasurementModalOpen,
        setIsMeasurementModalOpen,
        // Phase 4: Dietitian Workflow Notifications & Start Date Reminders
        dietitianNotifications: getDietitianNotifications(),
        getDietitianNotifications,
        dismissDietitianNotification,
        markDietitianNotificationAsRead,
        markAllDietitianNotificationsAsRead,
        getDietPlanReminderForPatient,
        getDashboardKpis
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error('useClinic must be used within a ClinicProvider');
  }
  return context;
};

