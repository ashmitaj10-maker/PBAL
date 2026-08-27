import React, { useState } from 'react';
import { useClinic, ClinicScreen } from '../../context/ClinicContext';
import { 
  Building2, 
  Users, 
  LayoutDashboard, 
  CreditCard, 
  FileText, 
  UserPlus, 
  PlusCircle, 
  LogOut, 
  UserCheck, 
  ChevronDown,
  Shield,
  Activity,
  Receipt,
  Search,
  Sparkles,
  ClipboardCheck,
  Utensils,
  Dumbbell,
  Smartphone,
  TrendingDown,
  Camera,
  Bell,
  MessageSquare,
  Bot
} from 'lucide-react';

export const ClinicNavbar: React.FC = () => {
  const { 
    activeScreen, 
    navigateTo, 
    currentClinic, 
    clinics, 
    switchClinic, 
    currentUser, 
    logout, 
    setIsRegisterModalOpen,
    setIsPaymentModalOpen,
    patients,
    selectedPatient,
    getDashboardKpis
  } = useClinic();

  const [isClinicMenuOpen, setIsClinicMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isEngagementMenuOpen, setIsEngagementMenuOpen] = useState(false);
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

  const mainNavItems: { id: ClinicScreen; label: string; icon: React.ElementType; badge?: string | number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'assessment', label: 'Assessment', icon: ClipboardCheck },
    { id: 'ai_meal_builder', label: 'Meal Planner', icon: Sparkles, badge: 'AI' },
    { id: 'exercise_planner', label: 'Exercise', icon: Dumbbell },
    { id: 'progress_dashboard', label: 'Progress', icon: TrendingDown },
    { id: 'progress_photos', label: 'Photos', icon: Camera },
    { id: 'patient_chat', label: 'Chat', icon: MessageSquare, badge: kpis.unreadChatCount > 0 ? kpis.unreadChatCount : undefined },
    { id: 'reminder_settings', label: 'Reminders', icon: Bell },
    { id: 'ai_copilot', label: 'Copilot', icon: Bot, badge: 'AI' },
    { id: 'patient_portal', label: 'Patient App', icon: Smartphone },
    { id: 'payments', label: 'Billing', icon: CreditCard },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Clinic Header & System Bar */}
      <div className="bg-slate-900 text-white px-4 sm:px-6 py-2 text-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Phase 3 Patient Engagement Live
          </div>

          {/* Clinic Selector / Multi-Clinic Isolation */}
          <div className="relative">
            <button
              onClick={() => setIsClinicMenuOpen(!isClinicMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors font-medium text-white text-xs cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-teal-400" />
              <span className="max-w-[200px] truncate">{currentClinic?.name}</span>
              <ChevronDown className="w-3 h-3 text-slate-300" />
            </button>

            {isClinicMenuOpen && (
              <div 
                className="absolute left-0 mt-1.5 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 text-slate-800 z-50 animate-in fade-in zoom-in-95 duration-100"
                onMouseLeave={() => setIsClinicMenuOpen(false)}
              >
                <div className="px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  Switch Clinic Branch
                </div>
                {clinics.map(c => (
                  <button
                    key={c.id}
                    onClick={() => {
                      switchClinic(c.id);
                      setIsClinicMenuOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 hover:bg-slate-50 flex items-start gap-2.5 text-xs transition-colors cursor-pointer ${
                      c.id === currentClinic?.id ? 'bg-teal-50 text-teal-900 font-bold' : ''
                    }`}
                  >
                    <Building2 className={`w-4 h-4 mt-0.5 shrink-0 ${c.id === currentClinic?.id ? 'text-teal-600' : 'text-slate-400'}`} />
                    <div>
                      <div className="font-semibold text-slate-900">{c.name}</div>
                      <div className="text-[11px] text-slate-500">{c.city} • {c.code}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* User Role & Quick Switch */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-slate-300 text-xs">
            <Shield className="w-3.5 h-3.5 text-teal-400" />
            <span>Role: <strong className="text-white capitalize">{currentUser?.role ? currentUser.role.replace('_', ' ') : 'Doctor'}</strong></span>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-xs font-medium cursor-pointer"
            >
              <img 
                src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1594824813686-65be799b6eb8?auto=format&fit=crop&q=80&w=128'} 
                alt="User" 
                className="w-5 h-5 rounded-full object-cover border border-white/30"
              />
              <span className="hidden sm:inline font-medium text-white">{currentUser?.name}</span>
              <ChevronDown className="w-3 h-3 text-slate-300" />
            </button>

            {isUserMenuOpen && (
              <div 
                className="absolute right-0 mt-1.5 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 text-slate-800 z-50 animate-in fade-in"
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="font-bold text-xs text-slate-900">{currentUser?.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold bg-teal-50 text-teal-800 rounded-full">
                    {currentUser?.roleTitle || 'Clinical Nutrition Specialist'}
                  </span>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      navigateTo('login');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                    Switch User / Login Portal
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-500" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main App Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => navigateTo('dashboard')}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-900 to-slate-900 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <div className="text-base font-black tracking-tight text-slate-900 flex items-center gap-1.5">
                  Perfect Body & Life
                  <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.5 bg-teal-100 text-teal-800 rounded">
                    AI Clinical
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 -mt-0.5 hidden xl:block">
                  Metabolic Endocrinology & Patient Engagement
                </div>
              </div>
            </button>
          </div>

          {/* Nav Items (Desktop Horizontal Scroll/Pills) */}
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
            {mainNavItems.map(item => {
              const Icon = item.icon;
              const isActive = activeScreen === item.id || (item.id === 'patients' && activeScreen === 'patient_profile');
              return (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id, { patientId: selectedPatient?.id })}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className={`px-1.5 py-0.2 text-[9px] font-bold rounded-full ${
                      typeof item.badge === 'number'
                        ? 'bg-rose-500 text-white'
                        : 'bg-teal-500 text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Search Bar */}
          <div className="hidden xl:block relative max-w-[180px] w-full">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search patient..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
              />
            </div>

            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50">
                {searchResults.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      navigateTo('patient_profile', { patientId: p.id });
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-teal-50 flex items-center justify-between text-xs transition-colors cursor-pointer"
                  >
                    <div>
                      <span className="font-bold text-slate-900">{p.name}</span>
                      <span className="text-[10px] text-slate-500 ml-2 font-mono">{p.patientCode}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Action CTAs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5 text-teal-600" />
              <span>Collect Fee</span>
            </button>

            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-all cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register</span>
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Sub Navigation */}
        <div className="lg:hidden flex items-center border-t border-slate-100 py-2 overflow-x-auto gap-1 no-scrollbar">
          {mainNavItems.map(item => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id || (item.id === 'patients' && activeScreen === 'patient_profile');
            return (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id, { patientId: selectedPatient?.id })}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 ${
                  isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="px-1.5 py-0.2 bg-teal-600 text-white text-[9px] font-bold rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
