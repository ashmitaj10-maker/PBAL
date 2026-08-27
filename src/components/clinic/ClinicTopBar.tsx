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
    getDashboardKpis
  } = useClinic();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ id: string; name: string; patientCode: string; mobile: string }[]>([]);

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
        return selectedPatient ? `${selectedPatient.name} • Clinical Dossier` : 'Patient Profile';
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
        return 'Patient Engagement & WhatsApp Chat';
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

          {/* Quick Chat / Reminder Indicators */}
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

          <button
            onClick={() => navigateTo('reminder_settings', { patientId: selectedPatient?.id })}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer hidden sm:block"
            title="Automated Reminders"
          >
            <Bell className="w-4 h-4 text-slate-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-teal-500 rounded-full" />
          </button>

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
