import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { 
  Menu, 
  Search, 
  UserPlus, 
  CreditCard, 
  Bell, 
  MessageSquare, 
  Sparkles, 
  ChevronRight,
  Building2,
  Activity,
  CheckCircle2
} from 'lucide-react';

import { formatDate } from '../../utils/dateUtils';

interface ClinicTopBarProps {
  onOpenMobileSidebar: () => void;
  isCollapsed: boolean;
}

export const ClinicTopBar: React.FC<ClinicTopBarProps> = ({
  onOpenMobileSidebar,
}) => {
  const { 
    activeScreen, 
    navigateTo, 
    currentClinic, 
    selectedPatient,
    patients,
    currentUser,
    setIsRegisterModalOpen,
    setIsPaymentModalOpen,
    getDashboardKpis,
    dietitianNotifications,
    markDietitianNotificationAsRead,
    markAllDietitianNotificationsAsRead
  } = useClinic();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ id: string; name: string; patientCode: string; mobile: string }[]>([]);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);

  const kpis = getDashboardKpis();

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }
    const search = (q || '').toLowerCase().trim();
    const filtered = (patients || [])
      .filter(p => 
        (p.name || '').toLowerCase().includes(search) ||
        (p.patientCode || '').toLowerCase().includes(search) ||
        (p.mobile || '').includes(search) ||
        (p.email || '').toLowerCase().includes(search)
      )
      .slice(0, 5)
      .map(p => ({ id: p.id, name: p.name || 'Patient', patientCode: p.patientCode || '', mobile: p.mobile || '' }));
    setSearchResults(filtered);
  };

  const getScreenTitle = () => {
    switch (activeScreen) {
      case 'dashboard':
        return 'Practice Command Center';
      case 'patients':
        return 'Patient Directory & Registry';
      case 'patient_profile':
        return selectedPatient ? `${selectedPatient.name} • Clinical Profile` : 'Patient Profile';
      case 'assessment':
        return 'Clinical Intake & Anthropometrics';
      case 'ai_meal_builder':
        return 'AI Clinical Meal Planner';
      case 'exercise_planner':
        return 'Therapeutic Exercise & Movement Plan';
      case 'patient_portal':
        return 'Patient Mobile App Preview';
      case 'progress_dashboard':
        return 'Anthropometric & Vitals Progress';
      case 'progress_photos':
        return 'Transformation Photos Studio';
      case 'patient_chat':
        return 'Chat';
      case 'reminder_settings':
        return 'Automated Clinical Reminders';
      case 'ai_copilot':
        return 'Doctor AI Copilot & SOAP Generator';
      case 'payments':
        return 'Billing & Subscription Plans';
      case 'invoice_preview':
        return 'Medical Tax Invoices';
      default:
        return 'Clinical Practice';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        
        {/* Left side: Hamburger (mobile) + Breadcrumbs & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Open Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium truncate">
              <span className="text-teal-700 font-bold flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                {currentClinic?.name || 'Perfect Body & Life'}
              </span>
              <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="text-slate-700 font-semibold truncate capitalize">
                {activeScreen.replace('_', ' ')}
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight truncate">
              {getScreenTitle()}
            </h1>
          </div>
        </div>

        {/* Right side: Global Search, Quick Actions & Status */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Header Search (Desktop) */}
          <div className="hidden md:block relative w-48 lg:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
            />

            {searchResults.length > 0 && (
              <div className="absolute top-full right-0 left-0 mt-1 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50">
                {searchResults.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      navigateTo('patient_profile', { patientId: p.id });
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-teal-50 flex items-center justify-between text-xs transition-colors cursor-pointer"
                  >
                    <div className="truncate pr-2">
                      <span className="font-bold text-slate-900 block truncate">{p.name}</span>
                      <span className="text-[10px] text-teal-700 font-mono">{p.patientCode}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Chat */}
          <button
            onClick={() => navigateTo('patient_chat', { patientId: selectedPatient?.id })}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Patient Chat"
          >
            <MessageSquare className="w-4 h-4 text-slate-600" />
            {kpis.unreadChatCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {kpis.unreadChatCount}
              </span>
            )}
          </button>

          {/* Dietitian Clinical Notifications & Diet Plan Reminders Popover */}
          <div className="relative">
            <button
              onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
              className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Dietitian Notifications & Diet Plan Reminders"
            >
              <Bell className="w-4 h-4 text-slate-600" />
              {kpis.dietitianReminderCount > 0 ? (
                <span className="absolute top-1 right-1 px-1 min-w-4 h-4 bg-amber-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {kpis.dietitianReminderCount}
                </span>
              ) : (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-teal-500 rounded-full" />
              )}
            </button>

            {isNotifDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 pb-2.5 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-teal-600" />
                    <h3 className="text-xs font-bold text-slate-900">Clinical Reminders</h3>
                    {kpis.dietitianReminderCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                        {kpis.dietitianReminderCount} new
                      </span>
                    )}
                  </div>
                  {dietitianNotifications.length > 0 && (
                    <button
                      onClick={markAllDietitianNotificationsAsRead}
                      className="text-[10px] font-bold text-teal-700 hover:text-teal-800 hover:underline cursor-pointer"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {dietitianNotifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                      <p className="font-semibold text-slate-700">All diet plans are on schedule!</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Reminders appear 1 day before patient start dates.</p>
                    </div>
                  ) : (
                    dietitianNotifications.map(notif => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markDietitianNotificationAsRead(notif.id);
                          setIsNotifDropdownOpen(false);
                          navigateTo('ai_meal_builder', { patientId: notif.patientId, planId: notif.planId });
                        }}
                        className={`p-3 hover:bg-teal-50/60 transition-colors cursor-pointer flex items-start gap-3 ${
                          !notif.isRead ? 'bg-amber-50/40' : ''
                        }`}
                      >
                        <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                          notif.actionRequired ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          <Bell className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="text-xs font-bold text-slate-900 truncate">
                              {notif.patientName}
                            </span>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 uppercase ${
                              notif.actionRequired 
                                ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            }`}>
                              {notif.actionRequired ? 'Action Required' : 'Plan Ready'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 leading-snug">
                            {notif.message}
                          </p>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5">
                            <span className="font-mono font-bold text-teal-700">
                              Starts: {formatDate(notif.planStartDate)}
                            </span>
                            <span className="text-teal-600 font-semibold hover:underline">
                              Open Plan ➔
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="px-3 pt-2.5 mt-1 border-t border-slate-100 text-center">
                  <span className="text-[10px] text-slate-400">
                    🔒 Dietitian workflow reminder • Invisible to patients
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Fast CTA Buttons */}
          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
          >
            <CreditCard className="w-3.5 h-3.5 text-teal-600" />
            <span>Collect Fee</span>
          </button>

          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-all cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Register Patient</span>
            <span className="sm:hidden">Register</span>
          </button>
        </div>
      </div>
    </header>
  );
};
