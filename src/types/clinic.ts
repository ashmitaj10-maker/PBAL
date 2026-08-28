export type UserRole = 'doctor' | 'senior_dietitian' | 'clinic_admin' | 'staff';

export type FoodPreference = 
  | 'Vegetarian'
  | 'Non-Vegetarian'
  | 'Eggetarian'
  | 'Vegan'
  | 'Jain'
  | 'Keto'
  | 'Pescatarian';

export type PatientStatus = 'active' | 'paused' | 'pending_renewal' | 'completed' | 'inactive';

export type PaymentStatus = 'paid' | 'partial' | 'pending' | 'overdue';

export type PaymentMode = 'upi' | 'card' | 'net_banking' | 'cash' | 'bank_transfer' | 'cheque';

export interface Clinic {
  id: string;
  name: string;
  code: string;
  tagline: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  taxNumber: string; // GSTIN or Tax Reg
  currencySymbol: string;
  currencyCode: string;
  logoText: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: UserRole;
  roleTitle: string;
  clinicId: string;
  specialization?: string;
  licenseNumber?: string;
  avatarUrl?: string;
}

export interface WeightRecord {
  id: string;
  patientId: string;
  date: string; // YYYY-MM-DD
  weightKg: number;
  bmi: number;
  bodyFatPercentage?: number;
  waistCm?: number;
  notes?: string;
  loggedBy: string;
}

export interface ClinicPlan {
  id: string;
  clinicId: string;
  name: string;
  category: 'Metabolic Health' | 'Weight Loss' | 'Clinical Reversal' | 'PCOS & Hormonal' | 'Sports Nutrition' | 'weight_loss' | 'diabetes_reversal' | 'pcos_management' | 'thyroid_care' | 'general_wellness' | 'athletic_performance' | string;
  durationDays: number;
  durationMonths: number;
  basePrice: number;
  description: string;
  features: string[];
  isActive: boolean;
  isArchived?: boolean;
}

export interface Patient {
  id: string;
  clinicId: string;
  patientCode: string; // e.g. "PBL-1024"
  name: string;
  mobile: string;
  email: string;
  age: number;
  gender: 'female' | 'male' | 'other';
  heightCm: number;
  currentWeightKg: number;
  startingWeightKg: number;
  targetWeightKg?: number;
  bodyType?: string;
  primaryGoals: string[]; // e.g. ["Weight Loss", "Fertility", "Menopause", "General Wellness"]
  medicalConditions: string[]; // e.g. ["Pre-diabetes", "Hypothyroidism", "Hypertension", "Fatty Liver"]
  foodPreference: FoodPreference;
  allergies: string[];
  assignedDoctorId: string;
  assignedPlanId?: string;
  assignedPlanName?: string;
  status: PatientStatus;
  joiningDate: string; // YYYY-MM-DD
  renewalDate: string; // YYYY-MM-DD
  notes?: string;
  consultationNotes?: string;
  voiceAudioUrl?: string; // Data URL or audio blob URL for recorded consultation
  voiceAudioDuration?: number; // Duration in seconds
  voiceAudioDate?: string; // Timestamp when voice consultation was recorded
  voiceTranscript?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  dailyMotivationMessage?: {
    message: string;
    authorName: string;
    date: string;
    tone?: string;
  };
  pauseDetails?: {
    isPaused: boolean;
    pausedAt?: string; // YYYY-MM-DD
    pausedBy?: string;
    pauseReason?: string;
    resumedAt?: string; // YYYY-MM-DD
  };
}

export interface PaymentRecord {
  id: string;
  invoiceId: string;
  clinicId: string;
  patientId: string;
  patientName: string;
  planId: string;
  planName: string;
  basePrice: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountAmount: number;
  taxRate: number; // e.g. 18 for 18% GST
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  pendingBalance: number;
  paymentMode: PaymentMode;
  transactionRef?: string;
  status: PaymentStatus;
  subscriptionStatus?: 'active' | 'paused' | 'cancelled' | 'completed';
  isPaused?: boolean;
  pausedAt?: string;
  pauseReason?: string;
  paymentDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  notes?: string;
  collectedBy: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  duration: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. "INV-2026-0089"
  clinicId: string;
  patientId: string;
  patientName: string;
  patientMobile: string;
  patientEmail: string;
  patientAddress?: string;
  paymentId: string;
  issueDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  items: InvoiceItem[];
  subtotal: number;
  discountAmount: number;
  taxableAmount: number;
  taxRate: number;
  taxAmount: number;
  grandTotal: number;
  amountPaid: number;
  balanceDue: number;
  status: PaymentStatus;
  paymentMode?: PaymentMode;
  transactionRef?: string;
  notes?: string;
  doctorName: string;
  doctorLicense?: string;
}

export interface ClinicActivity {
  id: string;
  clinicId: string;
  type: 'patient_registered' | 'payment_received' | 'weight_logged' | 'plan_renewed' | 'invoice_generated';
  title: string;
  description: string;
  timestamp: string;
  patientId?: string;
  patientName?: string;
  amount?: number;
  user: string;
}

export interface AuthSession {
  token: string;
  user: User;
  clinic: Clinic;
  expiresAt: number;
}

// -------------------------------------------------------------
// PHASE 2: AI MEAL PLANNING, ASSESSMENT & PATIENT APP TYPES
// -------------------------------------------------------------

export type MealSlotType = 
  | 'wake_up'
  | 'breakfast'
  | 'mid_meal'
  | 'lunch'
  | 'snack'
  | 'dinner'
  | 'sleep'
  | (string & {});

export type MealPlanMode = 'choice' | 'weekly';
export type MealPlanStatus = 'draft' | 'published' | 'archived';

export interface MicronutrientProfile {
  vitaminC?: number; // % RDA
  vitaminD?: number;
  vitaminB12?: number;
  iron?: number;
  calcium?: number;
  magnesium?: number;
  potassium?: number;
  zinc?: number;
  sodium?: number;
}

export interface MealOption {
  id: string;
  slotType: MealSlotType;
  name: string;
  description: string;
  portion: string;
  portionGrams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  glycemicIndex: 'Low' | 'Medium' | 'High' | string;
  glycemicLoad?: number;
  ingredients: string[];
  instructions: string[];
  clinicalBenefit: string;
  prepTimeMinutes: number;
  micronutrients?: MicronutrientProfile;
  tags?: string[];
  isCustom?: boolean;
  eatenToday?: boolean;
  skippedToday?: boolean;
}

export interface MealSlot {
  id?: string;
  slotType: MealSlotType;
  slotName?: string;
  title?: string;
  defaultTime: string; // e.g. "06:30", "08:00 AM", "10:00 AM"
  options: MealOption[]; // 1-5 options in Choice Mode
  selectedOptionId: string;
  notes?: string;
  customIcon?: string;
}

export type ExerciseRoutineItem = ExerciseItem;
export type ExerciseRoutine = DailyWorkout;

export interface DayMealPlan {
  dayIndex: number; // 1 to 7
  dayName: string; // "Monday", "Tuesday", etc.
  targetCalories: number;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  slots: MealSlot[];
}

export interface PatientAssessment {
  id: string;
  patientId: string;
  version: number;
  createdAt: string; // ISO
  updatedAt: string;
  doctorId: string;
  doctorName: string;
  wakeTime: string; // "06:30"
  sleepTime: string; // "22:30"
  workHours?: string; // "9:00 AM - 6:00 PM"
  dailyWaterLiters: number; // 2.5
  exerciseFrequency?: 'Sedentary' | 'Light (1-2 days/wk)' | 'Moderate (3-4 days/wk)' | 'Active (5+ days/wk)' | 'Athlete / Intense' | string;
  exerciseTypes?: string[];
  physicalActivityLevel?: string; // "Sedentary Desk Job", "Light Active", "Moderately Active", "Very Active"
  exerciseHabits?: string; // "30 min morning walk, 3x gym"
  stressLevel: 'low' | 'moderate' | 'high' | 'severe' | string;
  digestiveIssues: string[];
  dietaryRestrictions?: string[];
  favoriteFoods: string[];
  dislikedFoods: string[];
  medicalHistory: string[];
  medications?: string[];
  supplements?: string[];
  foodPreference: FoodPreference;
  dailyRoutineNotes?: string;
  targetCalories: number;
  targetProteinGrams: number;
  targetCarbsGrams: number;
  targetFatGrams: number;
  targetFiberGrams: number;
  clinicalNotes?: string;
  consultationNotes?: string;
  voiceAudioUrl?: string;
  voiceAudioDuration?: number;
  voiceAudioDate?: string;
  voiceTranscript?: string;
}

export interface ClinicalMealPlan {
  id: string;
  patientId: string;
  patientName: string;
  clinicId: string;
  assessmentId?: string;
  title: string;
  mode: MealPlanMode; // 'choice' or 'weekly'
  status: MealPlanStatus; // 'draft' until doctor publishes
  version: number;
  startDate?: string; // YYYY-MM-DD (e.g. "2026-08-28")
  durationDays?: number; // default 7
  endDate?: string; // YYYY-MM-DD (e.g. "2026-09-03")
  cycleNumber?: number; // e.g. 1, 2, 3
  targetCalories: number;
  targetMacros: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  // Choice Mode representation: 7 slots with 2-5 options each
  slots?: MealSlot[];
  // Weekly Mode representation: 7 days, each with slots
  weeklyDays?: DayMealPlan[];
  generalInstructions: string[];
  hydrationGuidelines: string;
  clinicalRationale: string;
  createdBy: string;
  createdAt: string;
  publishedAt?: string;
  isPaused?: boolean;
  pausedAt?: string;
  pauseReason?: string;
  changeLog?: string[];
}

export interface DietitianNotification {
  id: string;
  type: 'diet_plan_starting_soon' | 'diet_plan_needs_renewal' | 'weight_checkin_due' | 'clinical_alert';
  title: string;
  message: string;
  patientId: string;
  patientName: string;
  patientCode?: string;
  planId?: string;
  planStartDate: string; // YYYY-MM-DD
  planEndDate?: string; // YYYY-MM-DD
  durationDays: number;
  planStatus: 'draft' | 'published' | 'not_created';
  isRead: boolean;
  createdAt: string; // ISO date
  actionRequired: boolean;
  actionUrl?: string;
  cycleNumber?: number;
}

export interface ExerciseItem {
  id: string;
  name: string;
  category: 'Cardio' | 'Strength' | 'Mobility & Yoga' | 'Core & Posture' | 'Rehab / Low-Impact' | string;
  guideId?: string;
  compositeImageUrl?: string;
  durationMinutes?: number;
  durationText?: string;
  sets?: number;
  reps?: string;
  restSeconds?: string;
  intensity: 'Low' | 'Moderate' | 'High' | string;
  targetHeartRateZone?: string;
  timeOfDay: 'Morning' | 'Post-Meal' | 'Evening' | 'Anytime' | string;
  frequencyDays?: string[];
  frequencyText?: string;
  difficulty?: 'Beginner' | 'Moderate' | 'Advanced' | string;
  doctorNotes?: string;
  purpose?: string;
  description?: string;
  howToPerform?: string;
  targetMuscles?: string[];
  primaryMover?: string;
  secondaryStabilizers?: string[];
  tempoGuidance?: string;
  instructions: string[];
  precautions?: string;
  isCustomActivity?: boolean;
  hasAiVisual?: boolean;
  completed?: boolean;
}

export interface DailyWorkout {
  dayName: string;
  dayShort: string;
  focus: string;
  isRestDay: boolean;
  targetMinutes: number;
  exercises: ExerciseItem[];
}

export interface ExercisePlan {
  id: string;
  patientId: string;
  patientName?: string;
  clinicId: string;
  title: string;
  status: 'draft' | 'published';
  weeklyGoalDays: number;
  dailyStepTarget: number;
  assignedExercises?: ExerciseItem[];
  routines: DailyWorkout[];
  doctorNotes: string;
  createdAt: string;
  publishedAt?: string;
}

export interface RecipeDetail {
  id: string;
  name: string;
  category: string;
  slotType: MealSlotType;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  servingSizeDescription: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  micronutrients: MicronutrientProfile;
  ingredients: { item: string; amount: string; notes?: string }[];
  steps: string[];
  dietaryTags: string[];
  chefTip: string;
  clinicalBenefit: string;
  imageUrl?: string;
}

export interface PatientDailyLog {
  date: string; // YYYY-MM-DD
  waterGlassesDrank: number; // e.g. 6 out of 8
  waterGoalGlasses: number; // 8
  mealsStatus: Record<string, 'eaten' | 'skipped' | 'swapped' | 'pending'>; // mealOptionId -> status
  exercisesCompleted: string[]; // exerciseItemIds
  weightKg?: number;
  notes?: string;
}

// -------------------------------------------------------------
// PHASE 3: PATIENT ENGAGEMENT, PROGRESS, CHAT & AI COPILOT
// -------------------------------------------------------------

export interface BodyMeasurementsRecord {
  id: string;
  patientId: string;
  date: string; // YYYY-MM-DD
  weightKg?: number;
  heightCm?: number;
  bmi?: number;
  bodyFatPercentage?: number;
  muscleMassKg?: number;
  visceralFat?: number;
  waterPercentage?: number;
  boneMassKg?: number;
  waistInches?: number;
  waistCm?: number;
  hipInches?: number;
  chestInches?: number;
  armInches?: number;
  thighInches?: number;
  calfInches?: number;
  notes?: string;
  loggedBy?: 'patient' | 'doctor' | 'dietitian' | string;
}

export type PhotoAngle = 'front' | 'side' | 'back';
export type PhotoStage = 'before' | 'in_progress' | 'after';

export interface ProgressPhoto {
  id: string;
  patientId: string;
  date: string; // YYYY-MM-DD
  stage: PhotoStage;
  angle: PhotoAngle;
  imageUrl: string;
  weightKg: number;
  waistInches?: number;
  notes?: string;
  verifiedByDoctor: boolean;
}

export type ReminderType = 
  | 'breakfast' 
  | 'lunch' 
  | 'dinner' 
  | 'water' 
  | 'exercise' 
  | 'medicine' 
  | 'sleep' 
  | 'weigh_in';

export interface ReminderChannelConfig {
  push: boolean;
  whatsapp: boolean;
  sms: boolean;
}

export interface PatientReminderConfig {
  id: string;
  patientId: string;
  type: ReminderType;
  title: string;
  time: string; // "08:00"
  scheduledTime?: string;
  frequency: 'daily' | 'weekdays' | 'weekly';
  weeklyDay?: string; // "Sunday"
  channels: ReminderChannelConfig;
  enabled?: boolean;
  isEnabled?: boolean;
  customMessage: string;
}

export type ChatMessageType = 'text' | 'photo' | 'pdf' | 'meal_plan' | 'exercise_plan';

export interface ChatMessage {
  id: string;
  patientId: string;
  clinicId: string;
  sender: 'doctor' | 'patient' | 'system';
  senderName: string;
  senderRole?: string;
  timestamp: string; // ISO string or time string e.g. "10:45 AM"
  date: string; // YYYY-MM-DD
  createdAt?: number; // Epoch timestamp ms for robust chronological sorting
  content: string;
  type: ChatMessageType;
  mediaUrl?: string;
  mediaMeta?: {
    fileName?: string;
    fileSize?: string;
    planId?: string;
    previewTitle?: string;
    previewSubtitle?: string;
    badge?: string;
  };
  isRead: boolean;
  status: 'sent' | 'delivered' | 'read';
}

export interface ChatConversationSummary {
  patientId: string;
  patientName: string;
  patientCode: string;
  patientAvatar?: string;
  patientStatus: PatientStatus;
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount: number;
  isOnline?: boolean;
}

export interface SwapRecipe {
  recipeName: string;
  servings: string; // e.g. "1 serving (approx 250g)"
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  ingredients: { item: string; amount: string; notes?: string }[];
  steps: string[];
  optionalSubstitutions?: string[];
  chefTip?: string;
  clinicalBenefit?: string;
}

export interface FoodSwapSuggestion {
  id: string;
  cravingOrDish: string;
  swapOptionName: string;
  clinicalSwap?: string;
  category: string;
  foodPreference?: 'Vegetarian' | 'Jain' | 'Vegan' | 'Eggetarian' | 'Non-Vegetarian' | 'Keto' | 'Gluten-Free' | 'All' | string;
  dietaryTags?: string[];
  originalCalories: number;
  swapCalories: number;
  calorieSaving: number;
  originalGlycemic: 'High' | 'Medium' | 'Low';
  swapGlycemic: 'High' | 'Medium' | 'Low';
  swapProteinGrams: number;
  swapFiberGrams: number;
  swapCarbsGrams?: number;
  swapFatGrams?: number;
  prepTimeMinutes?: number;
  cookTimeMinutes?: number;
  servings?: string;
  originalMacros?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
    glycemicIndex?: 'High' | 'Medium' | 'Low' | string;
  };
  swapMacros?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
    glycemicIndex?: 'High' | 'Medium' | 'Low' | string;
  };
  preparationTip: string;
  instructions?: string;
  clinicalReason: string;
  clinicalRationale?: string;
  keyIngredients?: string[];
  recipe?: SwapRecipe;
  isAiGenerated?: boolean;
}

export interface NutrientGapAnalysis {
  nutrient: string; // e.g. "Iron", "Vitamin D3", "Dietary Fiber", "Lean Protein"
  currentIntake: string;
  recommendedIntake: string;
  gapPercentage: number;
  status: 'optimal' | 'moderate_deficit' | 'severe_deficit';
  clinicalSymptoms: string[];
  recommendedFoods: { name: string; portion: string; keyBenefit: string }[];
}

export interface GoalDistributionStat {
  goalName: string;
  patientCount: number;
  percentage: number;
  color: string;
}

export interface WeightUpdateDueItem {
  patientId: string;
  patientName: string;
  patientCode: string;
  lastWeighInDate: string;
  daysOverdue: number;
  currentWeightKg: number;
  targetWeightKg: number;
  status: 'due_today' | 'overdue' | 'critical';
}

export interface ExpiringPlanItem {
  patientId: string;
  patientName: string;
  patientCode: string;
  planName: string;
  expiryDate: string;
  daysRemaining: number;
  totalRenewals: number;
  renewalAmount?: number;
  status: 'expiring_soon' | 'critical_renewal' | 'expired';
}

export interface PatientCodeInvite {
  code: string;
  issuedByDieticianId: string;
  dieticianName: string;
  dieticianTitle?: string;
  clinicId: string;
  patientName?: string;
  patientEmail?: string;
  patientMobile?: string;
  preAssignedPlanId?: string;
  preAssignedPlanName?: string;
  status: 'valid' | 'used' | 'expired';
  createdAt: string;
  expiresAt: string;
  usedByPatientId?: string;
  usedAt?: string;
}

export interface PatientSignUpInput {
  emailOrPhone: string;
  password: string;
  confirmPassword: string;
  patientCode: string;
  name?: string;
}


