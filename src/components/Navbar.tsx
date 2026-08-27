import React, { useState } from 'react';
import { 
  Activity, 
  Sparkles, 
  Camera, 
  CalendarDays, 
  BarChart3, 
  Bot, 
  ShoppingBag, 
  User, 
  Plus, 
  Menu, 
  X,
  Flame,
  Droplet
} from 'lucide-react';
import { useNutrition } from '../context/NutritionContext';

export const Navbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    profile, 
    setIsProfileModalOpen, 
    setIsQuickLogOpen,
    waterMl
  } = useNutrition();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'scanner', label: 'AI Meal Scan', icon: Camera },
    { id: 'planner', label: 'Clinical Planner', icon: CalendarDays },
    { id: 'analytics', label: 'Metabolic Trends', icon: BarChart3 },
    { id: 'chat', label: 'AI Nutritionist', icon: Bot },
    { id: 'grocery', label: 'Smart Grocery', icon: ShoppingBag },
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#183153]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Brand & Logo */}
          <div 
            id="brand-logo"
            onClick={() => setActiveTab('dashboard')} 
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#183153] flex items-center justify-center text-[#6BBF59] shadow-sm group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-[#183153] font-['Poppins']">
                  Perfect Body <span className="text-[#6BBF59]">&</span> Life
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-[#6BBF59]/15 text-[#2E7D32] border border-[#6BBF59]/30">
                  AI Medical
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Clinical Nutrition Management</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#F8FFF8] p-1.5 rounded-2xl border border-[#6BBF59]/20">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-[#183153] text-white shadow-sm'
                      : 'text-[#183153]/80 hover:text-[#183153] hover:bg-[#6BBF59]/10'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#6BBF59]' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Actions & Profile */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Water Quick Indicator */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8FFF8] border border-[#6BBF59]/25 text-xs font-semibold text-[#183153]">
              <Droplet className="w-3.5 h-3.5 text-[#3B82F6] fill-[#3B82F6]/20" />
              <span>{(waterMl / 1000).toFixed(1)}L / {(profile.waterTargetMl / 1000).toFixed(1)}L</span>
            </div>

            {/* Quick Food Log Button */}
            <button
              id="quick-log-food-btn"
              onClick={() => setIsQuickLogOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#6BBF59] hover:bg-[#5EAB4D] active:scale-95 text-white font-medium text-sm rounded-xl shadow-sm transition-all duration-150"
            >
              <Plus className="w-4 h-4" />
              <span>Log Food</span>
            </button>

            {/* User Profile Biometric Pill */}
            <button
              id="open-profile-modal-btn"
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-[#183153]/15 hover:border-[#183153]/40 bg-white hover:bg-slate-50 transition-all duration-150"
              title="Edit Biometrics & Dietary Goals"
            >
              <div className="w-7 h-7 rounded-lg bg-[#183153] text-[#6BBF59] flex items-center justify-center text-xs font-bold">
                {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-xs font-bold text-[#183153] leading-tight">{profile.name}</p>
                <p className="text-[11px] text-slate-500 leading-tight">{profile.dailyCalorieTarget} kcal/d</p>
              </div>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setIsQuickLogOpen(true)}
              className="p-2 bg-[#6BBF59] text-white rounded-xl shadow-sm"
              title="Quick Log"
            >
              <Plus className="w-5 h-5" />
            </button>
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#183153] hover:bg-slate-100 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#183153]/10 bg-white px-4 pt-3 pb-5 space-y-1.5 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#183153] text-white'
                    : 'text-[#183153] hover:bg-[#F8FFF8]'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#6BBF59]' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                setIsProfileModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-sm font-semibold text-[#183153] p-2 hover:bg-slate-50 rounded-xl"
            >
              <User className="w-4 h-4 text-[#6BBF59]" />
              <span>Biometrics & Nutrition Target ({profile.dailyCalorieTarget} kcal)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
