import React, { useState, useRef, useEffect } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Patient } from '../../types/clinic';
import { 
  Search, 
  ChevronDown, 
  Check, 
  User, 
  UserPlus, 
  X, 
  Sparkles,
  ArrowRight,
  Scale
} from 'lucide-react';

interface PatientSelectorProps {
  selectedPatientId?: string | null;
  onSelect?: (patient: Patient) => void;
  className?: string;
  variant?: 'header' | 'form' | 'compact';
  label?: string;
  showRegisterQuickAction?: boolean;
}

export const PatientSelector: React.FC<PatientSelectorProps> = ({
  selectedPatientId: propSelectedPatientId,
  onSelect,
  className = '',
  variant = 'header',
  label,
  showRegisterQuickAction = true,
}) => {
  const { 
    patients, 
    selectedPatient: contextSelectedPatient, 
    setSelectedPatientId, 
    setIsRegisterModalOpen 
  } = useClinic();

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Active patient determination: prop if provided, else context patient, else first patient
  const activePatient = propSelectedPatientId
    ? patients.find(p => p.id === propSelectedPatientId) || contextSelectedPatient || patients[0] || null
    : contextSelectedPatient || patients[0] || null;

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Auto-focus search input on open
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Filter patients based on search query (name, code, mobile, email, diet preference, goal)
  const filteredPatients = (patients || []).filter(p => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      (p.name || '').toLowerCase().includes(q) ||
      (p.patientCode || '').toLowerCase().includes(q) ||
      (p.mobile || '').includes(q) ||
      (p.email || '').toLowerCase().includes(q) ||
      (p.foodPreference || '').toLowerCase().includes(q) ||
      (p.primaryGoal || '').toLowerCase().includes(q) ||
      (p.gender || '').toLowerCase().includes(q)
    );
  });

  const handleSelect = (patient: Patient) => {
    setSelectedPatientId(patient.id);
    if (onSelect) {
      onSelect(patient);
    }
    setIsOpen(false);
    setSearchQuery('');
  };

  const getInitials = (name: string) => {
    return (name || 'Patient')
      .split(' ')
      .filter(Boolean)
      .map(part => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'PT';
  };

  // 1. Header Variant (Standard view header pill / card)
  if (variant === 'header') {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        {label && (
          <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1 leading-none">
            {label}
          </span>
        )}

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-between gap-3 px-3.5 py-2 rounded-2xl bg-white hover:bg-slate-50/90 border transition-all cursor-pointer text-left shadow-xs group ${
            isOpen 
              ? 'border-teal-500 ring-2 ring-teal-500/20 bg-teal-50/30' 
              : 'border-slate-200/90 hover:border-slate-300'
          }`}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
              {activePatient ? getInitials(activePatient.name) : <User className="w-4 h-4" />}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-bold text-slate-900 truncate block group-hover:text-teal-700 transition-colors">
                  {activePatient?.name || 'Select a Patient'}
                </span>
                {activePatient?.patientCode && (
                  <span className="px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600 font-mono text-[10px] font-semibold shrink-0">
                    {activePatient.patientCode}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 truncate">
                <span>{activePatient?.foodPreference || 'Prescribed'}</span>
                {activePatient?.currentWeightKg && (
                  <>
                    <span>•</span>
                    <span className="font-medium text-slate-700">{activePatient.currentWeightKg} kg</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-teal-600' : ''}`} />
        </button>

        {/* Floating Dropdown */}
        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Search Box */}
            <div className="p-3 border-b border-slate-100 bg-slate-50/70">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search by name, code, phone, diet..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded-full"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Scrollable Patient List */}
            <div className="max-h-72 overflow-y-auto divide-y divide-slate-100/80 custom-scrollbar p-1">
              {filteredPatients.length === 0 ? (
                <div className="py-8 px-4 text-center">
                  <User className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-700">No matching patients found</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Try searching with a different name or patient code</p>
                </div>
              ) : (
                filteredPatients.map(p => {
                  const isSelected = activePatient?.id === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelect(p)}
                      className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between gap-3 transition-colors cursor-pointer group ${
                        isSelected 
                          ? 'bg-teal-50/90 text-teal-950 font-semibold' 
                          : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-teal-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 group-hover:bg-slate-200'
                        }`}>
                          {getInitials(p.name)}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-slate-900 truncate">
                              {p.name}
                            </span>
                            <span className="text-[10px] font-mono px-1 py-0.2 bg-slate-100 text-slate-600 rounded">
                              {p.patientCode}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500">
                            <span>{p.age}y • {p.gender}</span>
                            <span>•</span>
                            <span className="text-teal-700 font-medium">{p.foodPreference}</span>
                            <span>•</span>
                            <span className="font-semibold text-slate-700">{p.currentWeightKg} kg</span>
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Dropdown Footer */}
            <div className="p-2.5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between text-[11px] text-slate-500">
              <span>Showing {filteredPatients.length} of {patients.length} patients</span>

              {showRegisterQuickAction && (
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setIsRegisterModalOpen(true);
                  }}
                  className="flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-800 transition-colors cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>New Patient</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. Form Variant (Full-width for modal dialogs)
  if (variant === 'form') {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        {label && (
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {label}
          </label>
        )}

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border text-xs text-slate-800 transition-all cursor-pointer ${
            isOpen ? 'border-teal-500 ring-2 ring-teal-500/20 bg-white' : 'border-slate-200'
          }`}
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-teal-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0">
              {activePatient ? getInitials(activePatient.name) : <User className="w-3.5 h-3.5" />}
            </div>
            <div className="min-w-0 text-left">
              <div className="font-bold text-slate-900 truncate">
                {activePatient?.name || 'Select a patient...'}
              </div>
              <div className="text-[10px] text-slate-500 truncate">
                {activePatient?.patientCode} • {activePatient?.currentWeightKg} kg • {activePatient?.foodPreference}
              </div>
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-teal-600' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-2.5 border-b border-slate-100 bg-slate-50">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search patient..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-7 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto p-1 divide-y divide-slate-100 custom-scrollbar">
              {filteredPatients.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-500">No patients found</div>
              ) : (
                filteredPatients.map(p => {
                  const isSelected = activePatient?.id === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelect(p)}
                      className={`w-full text-left p-2 rounded-lg flex items-center justify-between text-xs transition-colors cursor-pointer ${
                        isSelected ? 'bg-teal-50 text-teal-900 font-bold' : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className="truncate">
                        <div className="font-semibold text-slate-900 truncate">{p.name}</div>
                        <div className="text-[10px] text-slate-500">{p.patientCode} • {p.currentWeightKg}kg • {p.foodPreference}</div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-teal-600 shrink-0" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. Compact Variant
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
      >
        <User className="w-3.5 h-3.5 text-teal-600" />
        <span className="truncate max-w-[120px]">{activePatient?.name || 'Select'}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-72 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
          <div className="p-2 border-b border-slate-100">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
          <div className="max-h-52 overflow-y-auto p-1 divide-y divide-slate-100">
            {filteredPatients.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelect(p)}
                className={`w-full text-left p-2 text-xs rounded-lg flex items-center justify-between ${
                  activePatient?.id === p.id ? 'bg-teal-50 font-bold text-teal-900' : 'hover:bg-slate-50'
                }`}
              >
                <span>{p.name} ({p.patientCode})</span>
                {activePatient?.id === p.id && <Check className="w-3.5 h-3.5 text-teal-600" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
