import React, { useState } from 'react';
import { useClinic, ClinicScreen } from '../../context/ClinicContext';
import { 
  Building2, 
  Users, 
  LayoutDashboard, 
  CreditCard, 
  FileText, 
  UserPlus, 
  LogOut, 
  UserCheck, 
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Shield, 
  Activity, 
  Search, 
  Sparkles, 
  ClipboardCheck, 
  Dumbbell, 
  Smartphone, 
  TrendingDown, 
  Camera, 
  Bell, 
  MessageSquare, 
  Bot,
  X,
  User,
  ExternalLink
} from 'lucide-react';

interface ClinicSidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const ClinicSidebar: React.FC<ClinicSidebarProps> = ({
  isMobileOpen,
  setIsMobileOpen,
  isCollapsed,
  setIsCollapsed
}) => {
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

  interface NavSection {
    sectionTitle: string;
    items: {
      id: ClinicScreen;
      label: string;
      icon: React.ElementType;
      badge?: string | number;
      badgeColor?: string;
      description?: string;
    }[];
  }

  const navSections: NavSection[] = [
    {
      sectionTitle: 'Core Clinical',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'patients', label: 'Patients Directory', icon: Users, badge: patients.length },
        { id: 'assessment', label: 'Clinical Intake', icon: ClipboardCheck },
      ]
    },
    {
      sectionTitle: 'AI Protocols & RX',
      items: [
        { id: 'ai_meal_builder', label: 'AI Meal Planner', icon: Sparkles, badge: 'AI', badgeColor: 'bg-teal-500 text-white' },
        { id: 'exercise_planner', label: 'Exercise Planner', icon: Dumbbell },
        { id: 'ai_copilot', label: 'Doctor AI Copilot', icon: Bot, badge: 'AI', badgeColor: 'bg-emerald-600 text-white' },
      ]
    },
    {
      sectionTitle: 'Patient Engagement',
      items: [
        { id: 'progress_dashboard', label: 'Progress & Vitals', icon: TrendingDown },
        { id: 'progress_photos', label: 'Transformation Photos', icon: Camera },
        { 
          id: 'patient_chat', 
          label: 'Patient WhatsApp Chat', 
          icon: MessageSquare, 
          badge: kpis.unreadChatCount > 0 ? kpis.unreadChatCount : undefined,
          badgeColor: 'bg-rose-500 text-white'
        },
        { id: 'reminder_settings', label: 'Automated Reminders', icon: Bell },
        { id: 'patient_portal', label: 'Patient Mobile App', icon: Smartphone, badge: 'Live', badgeColor: 'bg-blue-600 text-white' },
      ]
    },
    {
      sectionTitle: 'Practice & Billing',
      items: [
        { id: 'payments', label: 'Billing & Plans', icon: CreditCard },
        { id: 'invoice_preview', label: 'Tax Invoices', icon: FileText },
      ]
    }
  ];

  const handleNavClick = (screenId: ClinicScreen) => {
    navigateTo(screenId, { patientId: selectedPatient?.id });
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-72'
        } ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Brand & Clinic Switcher */}
        <div className="p-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center justify-between gap-2">
            <button 
              onClick={() => handleNavClick('dashboard')}
              className="flex items-center gap-3 text-left group focus:outline-none cursor-pointer overflow-hidden"
              title="Perfect Body & Life"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform shrink-0">
                <Activity className="w-5 h-5 text-white" />
              </div>
              {!isCollapsed && (
                <div className="min-w-0">
                  <div className="text-sm font-black tracking-tight text-white flex items-center gap-1.5 truncate">
                    Perfect Body & Life
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.2 bg-teal-500/20 text-teal-300 rounded border border-teal-500/30">
                      AI Clinical OS
                    </span>
                  </div>
                </div>
              )}
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Clinic Switcher */}
          {!isCollapsed && (
            <div className="relative mt-3">
              <button
                onClick={() => setIsClinicMenuOpen(!isClinicMenuOpen)}
                className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-xs text-slate-200 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 truncate">
                  <Building2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span className="truncate font-medium">{currentClinic?.name || 'Main Clinic'}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              {isClinicMenuOpen && (
                <div 
                  className="absolute left-0 right-0 mt-1 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 py-1.5 text-slate-200 z-50 animate-in fade-in"
                  onMouseLeave={() => setIsClinicMenuOpen(false)}
                >
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-700/60">
                    Switch Clinic Branch
                  </div>
                  {(clinics || []).map(c => (
                    <button
                      key={c.id}
                      onClick={() => {
                        switchClinic(c.id);
                        setIsClinicMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-slate-700/60 flex items-start gap-2.5 text-xs transition-colors cursor-pointer ${
                        c.id === currentClinic?.id ? 'bg-teal-900/40 text-teal-300 font-bold' : 'text-slate-300'
                      }`}
                    >
                      <Building2 className={`w-4 h-4 mt-0.5 shrink-0 ${c.id === currentClinic?.id ? 'text-teal-400' : 'text-slate-500'}`} />
                      <div className="truncate">
                        <div className="truncate font-medium">{c.name}</div>
                        <div className="text-[10px] text-slate-400">{c.city} • {c.code}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Patient Search (When Expanded) */}
        {!isCollapsed && (
          <div className="px-3 py-2.5 border-b border-slate-800/80 shrink-0">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Quick find patient..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-800/60 border border-slate-700/70 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-slate-800 transition-all"
              />
            </div>

            {/* Search Dropdown Results */}
            {searchResults.length > 0 && (
              <div className="absolute left-3 right-3 mt-1 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 py-1.5 z-50">
                {searchResults.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      navigateTo('patient_profile', { patientId: p.id });
                      setSearchQuery('');
                      setSearchResults([]);
                      setIsMobileOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-700 flex items-center justify-between text-xs transition-colors cursor-pointer text-slate-200"
                  >
                    <div className="truncate pr-2">
                      <span className="font-semibold text-white truncate block">{p.name}</span>
                      <span className="text-[10px] text-teal-400 font-mono">{p.patientCode}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Active Patient Quick Card (When a Patient is Selected) */}
        {!isCollapsed && selectedPatient && (
          <div className="px-3 py-2 border-b border-slate-800/80 bg-teal-950/30">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                Active Dossier
              </span>
              <button 
                onClick={() => handleNavClick('patient_profile')}
                className="text-[10px] text-slate-400 hover:text-teal-300 flex items-center gap-0.5 cursor-pointer"
              >
                View <ChevronRight className="w-2.5 h-2.5" />
              </button>
            </div>
            <div 
              onClick={() => handleNavClick('patient_profile')}
              className="p-2 rounded-xl bg-slate-800/90 border border-teal-500/20 hover:border-teal-500/40 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-600/30 text-teal-300 font-bold text-xs flex items-center justify-center border border-teal-500/30 shrink-0">
                  {(selectedPatient?.name || 'Patient').split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2) || 'PT'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white truncate group-hover:text-teal-300 transition-colors">
                    {selectedPatient?.name || 'Patient'}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {selectedPatient?.patientCode || ''} • {selectedPatient?.foodPreference || 'Prescribed'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5 custom-scrollbar">
          {navSections.map((section, sIdx) => (
            <div key={section.sectionTitle || sIdx} className="space-y-1">
              {!isCollapsed && (
                <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  {section.sectionTitle}
                </div>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = 
                  activeScreen === item.id || 
                  (item.id === 'patients' && activeScreen === 'patient_profile') ||
                  (item.id === 'dashboard' && (activeScreen as string) === 'doctor_dashboard');

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer group ${
                      isActive
                        ? 'bg-teal-500 text-slate-950 font-bold shadow-lg shadow-teal-500/20'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    } ${isCollapsed ? 'justify-center px-0' : ''}`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-slate-950' : 'text-slate-400 group-hover:text-teal-400'
                    }`} />
                    
                    {!isCollapsed && (
                      <div className="flex-1 flex items-center justify-between truncate">
                        <span className="truncate">{item.label}</span>
                        {item.badge !== undefined && (
                          <span className={`px-1.5 py-0.2 text-[9px] font-bold rounded-full ml-1.5 shrink-0 ${
                            item.badgeColor || 'bg-slate-700 text-slate-200'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Quick Action CTAs (Bottom of Sidebar) */}
        {!isCollapsed ? (
          <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 space-y-2 shrink-0">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setIsPaymentModalOpen(true);
                  setIsMobileOpen(false);
                }}
                className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5 text-teal-400" />
                <span>Collect Fee</span>
              </button>

              <button
                onClick={() => {
                  setIsRegisterModalOpen(true);
                  setIsMobileOpen(false);
                }}
                className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-xs transition-all cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-2 border-t border-slate-800 space-y-2 shrink-0 flex flex-col items-center">
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              title="Register Patient"
              className="w-10 h-10 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center hover:bg-teal-400 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              title="Collect Fee"
              className="w-10 h-10 rounded-xl bg-slate-800 text-teal-400 border border-slate-700 flex items-center justify-center hover:bg-slate-700 transition-all cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* User Profile & Collapse Toggle */}
        <div className="p-3 border-t border-slate-800 shrink-0 bg-slate-950">
          <div className="flex items-center justify-between gap-2">
            
            {/* User Dropdown */}
            <div className="relative flex-1 min-w-0">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={`w-full flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-800 text-left transition-colors cursor-pointer ${
                  isCollapsed ? 'justify-center p-0' : ''
                }`}
                title={currentUser?.name}
              >
                <img 
                  src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1594824813686-65be799b6eb8?auto=format&fit=crop&q=80&w=128'} 
                  alt="Doctor" 
                  className="w-8 h-8 rounded-full object-cover border border-teal-500/40 shrink-0"
                />
                {!isCollapsed && (
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate">{currentUser?.name}</p>
                    <p className="text-[10px] text-teal-400 truncate capitalize font-medium">
                      {currentUser?.role ? currentUser.role.replace('_', ' ') : 'Doctor'}
                    </p>
                  </div>
                )}
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div 
                  className="absolute bottom-full left-0 mb-2 w-64 bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 py-2 text-slate-200 z-50 animate-in fade-in"
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-700/60">
                    <p className="font-bold text-xs text-white">{currentUser?.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{currentUser?.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold bg-teal-500/20 text-teal-300 rounded-full border border-teal-500/30">
                      {currentUser?.roleTitle || 'Clinical Nutrition Specialist'}
                    </span>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        navigateTo('login');
                        setIsUserMenuOpen(false);
                        setIsMobileOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-slate-300 hover:bg-slate-700 flex items-center gap-2"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                      Switch User / Login Portal
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                        setIsMobileOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-rose-400 hover:bg-rose-950/40 flex items-center gap-2 font-semibold"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-400" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Desktop Collapse / Expand Toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
