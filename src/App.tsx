import React, { useState } from 'react';
import { ClinicProvider, useClinic } from './context/ClinicContext';
import { NutritionProvider } from './context/NutritionContext';
import { ClinicSidebar } from './components/clinic/ClinicSidebar';
import { ClinicTopBar } from './components/clinic/ClinicTopBar';
import { LoginScreen } from './components/clinic/LoginScreen';
import { DoctorDashboard } from './components/clinic/DoctorDashboard';
import { PatientListView } from './components/clinic/PatientListView';
import { PatientProfileView } from './components/clinic/PatientProfileView';
import { PaymentManagementView } from './components/clinic/PaymentManagementView';
import { InvoicePreviewView } from './components/clinic/InvoicePreviewView';

// Phase 2 Views
import { PatientAssessmentView } from './components/clinic/PatientAssessmentView';
import { AiMealBuilderView } from './components/clinic/AiMealBuilderView';
import { RecipeLibraryView } from './components/clinic/RecipeLibraryView';
import { ExercisePlannerView } from './components/clinic/ExercisePlannerView';
import { PatientMobileHomeView } from './components/clinic/PatientMobileHomeView';
import { RecipeDetailModal } from './components/clinic/RecipeDetailModal';

// Phase 3 Views
import { ProgressDashboardView } from './components/clinic/ProgressDashboardView';
import { ProgressPhotosView } from './components/clinic/ProgressPhotosView';
import { ReminderSettingsView } from './components/clinic/ReminderSettingsView';
import { PatientChatView } from './components/clinic/PatientChatView';
import { AiCopilotView } from './components/clinic/AiCopilotView';

// Modals & Simulator
import { RegisterPatientModal } from './components/clinic/RegisterPatientModal';
import { RecordPaymentModal } from './components/clinic/RecordPaymentModal';
import { LogWeightModal } from './components/clinic/LogWeightModal';
import { LogMeasurementsModal } from './components/clinic/LogMeasurementsModal';
import { UploadPhotoModal } from './components/clinic/UploadPhotoModal';
import { CreatePlanModal } from './components/clinic/CreatePlanModal';
import { ToastNotificationSimulator } from './components/clinic/ToastNotificationSimulator';
import { PatientAppLayout } from './components/clinic/PatientAppLayout';

const ClinicAppContent: React.FC = () => {
  const { isAuthenticated, activeScreen, isPatientSession } = useClinic();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Screen 1: If not logged in, display full-screen Login with OTP + Password + Clinic Isolation
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // =========================================================================
  // DEDICATED SEPARATE PATIENT APP EXPERIENCE (Zero Doctor Tool Access)
  // =========================================================================
  if (isPatientSession) {
    return (
      <>
        <PatientAppLayout />
        <RecipeDetailModal />
        <ToastNotificationSimulator />
      </>
    );
  }

  // =========================================================================
  // DEDICATED CLINICAL PRACTICE DOCTOR EXPERIENCE (Full Practice Management)
  // =========================================================================
  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 flex selection:bg-teal-500/20 selection:text-teal-900">
      {/* Left Sidebar Navigation */}
      <ClinicSidebar 
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Main App Content Layout (offset dynamically based on sidebar collapsed state) */}
      <div 
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'
        }`}
      >
        {/* Top Header Bar */}
        <ClinicTopBar 
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          isCollapsed={isSidebarCollapsed}
        />

        {/* Dynamic Screen Views */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Screen 2: Doctor Dashboard */}
          {(activeScreen === 'dashboard' || (activeScreen as string) === 'doctor_dashboard') && <DoctorDashboard />}

          {/* Screen 3: Patient List & Directory */}
          {activeScreen === 'patients' && <PatientListView />}

          {/* Screen 4: Patient Profile Dossier */}
          {activeScreen === 'patient_profile' && <PatientProfileView />}

          {/* Phase 2 Screen 1: Patient Assessment Intake */}
          {activeScreen === 'assessment' && <PatientAssessmentView />}

          {/* Phase 2 Screen 2: AI Clinical Meal Builder */}
          {activeScreen === 'ai_meal_builder' && <AiMealBuilderView />}

          {/* Phase 2 Screen 2b: Master Recipe & Protocol Library */}
          {activeScreen === 'recipe_library' && <RecipeLibraryView />}

          {/* Phase 2 Screen 3: Clinical Exercise Planner */}
          {activeScreen === 'exercise_planner' && <ExercisePlannerView />}

          {/* Phase 2 Screen 4: Patient Mobile Portal */}
          {activeScreen === 'patient_portal' && <PatientMobileHomeView />}

          {/* Phase 3 Screen 1: Progress Dashboard (Anthropometrics, Circumferences, Graphs) */}
          {activeScreen === 'progress_dashboard' && <ProgressDashboardView />}

          {/* Phase 3 Screen 2: Transformation Photos & Before/After Comparison Studio */}
          {activeScreen === 'progress_photos' && <ProgressPhotosView />}

          {/* Phase 3 Screen 3: Patient WhatsApp-Style Chat & Media Attachments */}
          {activeScreen === 'patient_chat' && <PatientChatView />}

          {/* Phase 3 Screen 4: Multi-Channel Reminder & Nudge Engine */}
          {activeScreen === 'reminder_settings' && <ReminderSettingsView />}

          {/* Phase 3 Screen 5: Doctor AI Copilot (Food Swaps, Nutrient Gaps, SOAP) */}
          {activeScreen === 'ai_copilot' && <AiCopilotView />}

          {/* Screen 5: Payment & Plan Management */}
          {activeScreen === 'payments' && <PaymentManagementView />}

          {/* Screen 6: Medical Tax Invoice & Fee Preview */}
          {activeScreen === 'invoice_preview' && <InvoicePreviewView />}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 mt-auto">
          <div className="max-w-7xl mx-auto px-4">
            <p className="font-bold text-slate-800">
              Perfect Body & Life • AI Nutrition & Patient Engagement Platform
            </p>
            <p className="mt-1 text-[11px] text-slate-400 max-w-2xl mx-auto">
              Clinical Practice Management, AI Meal Generation, WhatsApp Engagement, Anthropometrics & Doctor Copilot.
            </p>
          </div>
        </footer>
      </div>

      {/* Global Interactive Modals */}
      <RegisterPatientModal />
      <RecordPaymentModal />
      <LogWeightModal />
      <LogMeasurementsModal />
      <UploadPhotoModal />
      <CreatePlanModal />
      <RecipeDetailModal />

      {/* Live Toast Notification Simulator for Push, WhatsApp & SMS */}
      <ToastNotificationSimulator />
    </div>
  );
};

export default function App() {
  return (
    <NutritionProvider>
      <ClinicProvider>
        <ClinicAppContent />
      </ClinicProvider>
    </NutritionProvider>
  );
}
