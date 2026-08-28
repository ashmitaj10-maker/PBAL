import React, { useState } from 'react';
import { useClinic, ClinicScreen } from '../../context/ClinicContext';
import { 
  Activity, 
  Sparkles, 
  Utensils, 
  MessageSquare, 
  TrendingDown, 
  User, 
  LogOut, 
  ShieldCheck, 
  ChevronRight,
  Bot,
  Calendar,
  Heart,
  Droplets,
  Flame,
  Award,
  Dumbbell,
  Menu,
  X,
  Clock,
  ExternalLink
} from 'lucide-react';
import { PatientMobileHomeView } from './PatientMobileHomeView';
import { PatientExerciseView } from './PatientExerciseView';
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
    getUnreadChatCount,
    currentClinic 
  } = useClinic();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const patient = loggedInPatient || selectedPatient;
  const assignedDietitian = (users || []).find(u => u.id === patient?.assignedDoctorId) || {
    name: 'Dr. Ashmita Joshi',
    roleTitle: 'Chief Clinical Dietitian',
    specialization: 'Metabolic & Clinical Nutrition'
  };
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
      label: 'My Day & Meals',
      icon: Utensils,
      description: 'Daily meals, hydration & logs'
    },
    {
      id: 'patient_exercise',
      label: 'Guided Exercises',
      icon: Dumbbell,
      badge: 'Visual Guides',
      description: 'Form diagrams & step-by-step guidance'
    },
    {
      id: 'ai_copilot',
      label: 'Craving Search & Swaps',
      icon: Bot,
      badge: 'Cravings AI',
      description: 'Find healthy swaps & full recipes'
    },
    {
      id: 'patient_chat',
      label: 'Dietitian Chat',
      icon: MessageSquare,
      badge: unreadChats > 0 ? unreadChats : undefined,
      description: 'Direct 2-way clinical messaging'
    },
    {
      id: 'progress_dashboard',
      label: 'My Progress & Stats',
      icon: TrendingDown,
      description: 'Weight curves & body milestones'
    },
    {
      id: 'patient_profile',
      label: 'My Health Profile',
      icon: User,
      description: 'Clinical file & metabolic targets'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FFF8]/80 text-slate-900 flex flex-col md:flex-row font-sans selection:bg-teal-500/20">
      
      {/* =========================================================================
          LEFT-SIDE VERTICAL SCROLLABLE SIDEBAR (PATIENT APP NAVIGATION)
          ========================================================================= */}
      <aside className="hidden md:flex w-72 lg:w-80 bg-white border-r border-emerald-100 flex-col shrink-0 h-screen sticky top-0 z-30 shadow-xs">
        
        {/* Top Branding */}
        <div className="p-5 border-b border-emerald-100/80 bg-gradient-to-br from-white to-[#F8FFF8]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-800 via-[#183153] to-emerald-900 flex items-center justify-center text-white shadow-sm shrink-0">
              <Activity className="w-5 h-5 text-[#6BBF59]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight text-[#183153]">
                  Perfect Body & Life
                </span>
              </div>
              <p className="text-[11px] text-teal-700 font-semibold flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Patient Health Portal
              </p>
            </div>
          </div>

          {/* Patient Info Card */}
          <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#183153] text-white flex items-center justify-center text-xs font-bold shrink-0">
                {patient?.name?.charAt(0) || 'P'}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900 truncate">
                  {patient?.name || 'Patient Member'}
                </h4>
                <span className="text-[10px] text-teal-700 font-mono font-bold block truncate">
                  Code: {patient?.patientCode || 'PBL-CODE'}
                </span>
              </div>
            </div>

            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md shrink-0 uppercase tracking-wider ${
              patient?.status === 'paused'
                ? 'bg-amber-100 text-amber-950 border border-amber-300'
                : 'bg-emerald-100 text-emerald-900'
            }`}>
              {patient?.status === 'paused' ? '⏸️ Paused' : 'Active'}
            </span>
          </div>
        </div>

        {/* Assigned Dietitian Card */}
        <div className="p-3 mx-4 my-3 bg-gradient-to-r from-teal-50/90 to-emerald-50/70 rounded-2xl border border-teal-200/80 shadow-2xs">
          <div 
            onClick={() => navigateTo('patient_chat')}
            className="flex items-center justify-between cursor-pointer group"
            title="Click to chat with your dietitian"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-teal-700 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
                👩‍⚕️
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-teal-950 flex items-center gap-1">
                  <span>{assignedDietitian?.name || 'Dr. Ashmita Joshi'}</span>
                </div>
                <p className="text-[10px] text-teal-700">
                  {assignedDietitian?.roleTitle || 'Clinical Dietitian'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-0.5 text-xs font-bold text-teal-800 group-hover:translate-x-0.5 transition-transform">
              <span className="text-[10px]">Chat</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Scrollable Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-200">
          <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 py-1">
            Menu Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;

            return (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`w-full flex items-start gap-3 p-3 rounded-2xl text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#183153] to-teal-900 text-white shadow-sm ring-1 ring-teal-950/10'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className={`p-1.5 rounded-xl shrink-0 mt-0.5 ${
                  isActive ? 'bg-white/15 text-emerald-300' : 'bg-slate-100 text-slate-500'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-slate-900'}`}>
                      {item.label}
                    </span>

                    {item.badge && (
                      <span className={`px-1.5 py-0.2 rounded-md text-[9px] font-black shrink-0 ${
                        isActive 
                          ? 'bg-emerald-400 text-slate-950 shadow-2xs' 
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className={`text-[10px] truncate mt-0.5 ${isActive ? 'text-emerald-100/80' : 'text-slate-500'}`}>
                    {item.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer: Sign Out & Support */}
        <div className="p-4 border-t border-slate-100 bg-white space-y-2 shrink-0">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
            title="Sign Out of Patient Portal"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>

          <p className="text-[10px] text-center text-slate-400 leading-tight">
            Perfect Body & Life • Supervised Clinical Care
          </p>
        </div>

      </aside>

      {/* =========================================================================
          MOBILE TOP BAR (FOR SMALL SCREENS)
          ========================================================================= */}
      <header className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-800 to-emerald-900 flex items-center justify-center text-white shadow-2xs">
            <Activity className="w-4 h-4 text-[#6BBF59]" />
          </div>
          <div>
            <span className="text-xs font-black text-[#183153]">
              Perfect Body & Life
            </span>
            <span className="text-[10px] text-emerald-700 font-bold block leading-none">
              Patient Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={logout}
            className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* =========================================================================
          MAIN CONTENT AREA (SCROLLABLE RIGHT VIEWPORT)
          ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
          {activeScreen === 'patient_portal' && <PatientMobileHomeView />}
          {activeScreen === 'patient_exercise' && <PatientExerciseView />}
          {activeScreen === 'ai_copilot' && <AiCopilotView />}
          {activeScreen === 'patient_chat' && <PatientChatView />}
          {activeScreen === 'progress_dashboard' && <ProgressDashboardView />}
          {activeScreen === 'patient_profile' && <PatientProfileView />}
        </main>
      </div>

      {/* =========================================================================
          MOBILE BOTTOM NAVIGATION STRIP
          ========================================================================= */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 px-1.5 py-1 shadow-lg flex items-center justify-around overflow-x-auto no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`flex flex-col items-center py-1 px-1.5 rounded-xl text-[9px] font-bold transition-all relative shrink-0 ${
                isActive ? 'text-teal-900 font-black' : 'text-slate-500'
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-teal-100 text-teal-900 scale-105' : ''}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="mt-0.5 truncate max-w-[56px]">{item.label.split(' ')[0]}</span>
              {item.badge && (
                <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-emerald-500" />
              )}
            </button>
          );
        })}
      </div>

    </div>
  );
};
