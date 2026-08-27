import React from 'react';
import { useClinic, ClinicScreen } from '../../context/ClinicContext';
import { 
  Activity, 
  Sparkles, 
  Utensils, 
  MessageSquare, 
  TrendingDown, 
  User, 
  LogOut, 
  Stethoscope, 
  ShieldCheck, 
  ChevronRight,
  Bot,
  Calendar,
  Heart,
  Droplets,
  Flame,
  Award
} from 'lucide-react';
import { PatientMobileHomeView } from './PatientMobileHomeView';
import { AiCopilotView } from './AiCopilotView';
import { PatientChatView } from './PatientChatView';
import { ProgressDashboardView } from './ProgressDashboardView';
import { PatientProfileView } from './PatientProfileView';

export const PatientAppLayout: React.FC = () => {
  const { 
    loggedInPatient, 
    selectedPatient,
    users, 
    activeScreen, 
    navigateTo, 
    logout, 
    switchToDoctorMode, 
    getUnreadChatCount,
    currentClinic 
  } = useClinic();

  const patient = loggedInPatient || selectedPatient;
  const assignedDietician = (users || []).find(u => u.id === patient?.assignedDoctorId) || users[0];
  const unreadChats = patient ? getUnreadChatCount(patient.id) : 0;

  interface NavItem {
    id: ClinicScreen;
    label: string;
    icon: React.ElementType;
    badge?: number | string;
    description: string;
  }

  const navItems: NavItem[] = [
    {
      id: 'patient_portal',
      label: 'My Day & Plan',
      icon: Utensils,
      description: 'Daily meals, hydration & workouts'
    },
    {
      id: 'ai_copilot',
      label: 'Doctor AI Copilot',
      icon: Bot,
      badge: 'Cravings AI',
      description: 'Search cravings & healthy food swaps'
    },
    {
      id: 'patient_chat',
      label: 'Dietitian Chat',
      icon: MessageSquare,
      badge: unreadChats > 0 ? unreadChats : undefined,
      description: 'Direct messaging with your doctor'
    },
    {
      id: 'progress_dashboard',
      label: 'My Progress',
      icon: TrendingDown,
      description: 'Scale weight curves & milestones'
    },
    {
      id: 'patient_profile',
      label: 'My Health Profile',
      icon: User,
      description: 'Read-only clinical details & plan'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FFF8]/80 text-slate-900 flex flex-col font-sans selection:bg-teal-500/20">
      
      {/* Top Header Bar for Patients */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Brand Logo & Live Patient Status */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-800 via-[#183153] to-emerald-900 flex items-center justify-center text-white shadow-sm">
              <Activity className="w-5 h-5 text-[#6BBF59]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-black tracking-tight text-[#183153]">
                  Perfect Body & Life
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Patient Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Prescribed Medical Nutrition & Wellness
              </p>
            </div>
          </div>

          {/* Assigned Dietitian Chip (Visible on desktop & tablet) */}
          <div 
            onClick={() => navigateTo('patient_chat')}
            className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-teal-50/80 hover:bg-teal-100/80 border border-teal-200/80 cursor-pointer transition-all group"
            title="Click to message your dietitian"
          >
            <div className="w-7 h-7 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-xs">
              {assignedDietician?.name?.charAt(0) || 'D'}
            </div>
            <div className="text-left text-xs">
              <div className="font-bold text-teal-950 flex items-center gap-1">
                <span>{assignedDietician?.name || 'Dr. Ashmita Joshi'}</span>
                <span className="text-[9px] bg-teal-200 text-teal-900 px-1.5 py-0.2 rounded font-bold">Dietitian</span>
              </div>
              <p className="text-[10px] text-teal-700 truncate max-w-[160px]">
                {assignedDietician?.roleTitle || 'Clinical Nutrition Specialist'}
              </p>
            </div>
          </div>

          {/* Patient Profile & Mode Switch Actions */}
          <div className="flex items-center gap-2">
            
            {/* Patient Badge */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-100 border border-slate-200">
              <div className="w-6 h-6 rounded-full bg-[#183153] text-white flex items-center justify-center text-[11px] font-bold">
                {patient?.name?.charAt(0) || 'P'}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-[#183153] leading-none">
                  {patient?.name || 'Patient Member'}
                </div>
                <div className="text-[10px] text-teal-700 font-mono font-bold leading-tight">
                  {patient?.patientCode || 'PBL-CODE'}
                </div>
              </div>
            </div>

            {/* Switch to Doctor Mode (Demo paired testing tool) */}
            <button
              onClick={switchToDoctorMode}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-[11px] font-bold transition-all shadow-xs cursor-pointer"
              title="Switch to Doctor Dashboard for review"
            >
              <Stethoscope className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden sm:inline">Doctor View</span>
            </button>

            {/* Sign Out */}
            <button
              onClick={logout}
              className="p-1.5 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Sign Out of Patient Portal"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Desktop Navigation Tabs Strip */}
        <div className="hidden sm:block border-t border-slate-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-1 overflow-x-auto py-1.5 scrollbar-none">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeScreen === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigateTo(item.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-gradient-to-r from-[#183153] to-teal-900 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                        isActive 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 sm:pb-8">
        {activeScreen === 'patient_portal' && <PatientMobileHomeView />}
        {activeScreen === 'ai_copilot' && <AiCopilotView />}
        {activeScreen === 'patient_chat' && <PatientChatView />}
        {activeScreen === 'progress_dashboard' && <ProgressDashboardView />}
        {activeScreen === 'patient_profile' && <PatientProfileView />}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-lg flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-bold transition-all relative ${
                isActive ? 'text-teal-900 font-black' : 'text-slate-500'
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-teal-100 text-teal-900 scale-110' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="mt-0.5 truncate max-w-[64px]">{item.label.split(' ')[0]}</span>
              {item.badge && (
                <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              )}
            </button>
          );
        })}
      </div>

      {/* Patient Footer */}
      <footer className="hidden sm:block border-t border-emerald-100 bg-white py-4 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-semibold text-slate-700">
            Perfect Body & Life • Supervised by Clinical Dietitian {assignedDietician?.name || 'Dr. Ashmita Joshi'}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            For medical emergencies or acute clinical updates, please contact your clinic helpline or message your dietitian directly in chat.
          </p>
        </div>
      </footer>

    </div>
  );
};
