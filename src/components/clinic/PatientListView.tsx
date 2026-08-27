import React, { useState, useMemo } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Patient, FoodPreference, PatientStatus } from '../../types/clinic';
import { calculateBmi } from '../../utils/nutritionCalculators';
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  Eye, 
  Scale, 
  CreditCard, 
  MoreVertical, 
  ChevronRight, 
  Download, 
  Phone, 
  Mail, 
  Sparkles,
  ArrowUpDown,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trash2,
  Edit,
  MessageSquare,
  Bot,
  KeyRound
} from 'lucide-react';
import { IssuePatientCodeModal } from './IssuePatientCodeModal';

export const PatientListView: React.FC = () => {
  const { 
    patients, 
    navigateTo, 
    setIsRegisterModalOpen, 
    setIsPaymentModalOpen, 
    setIsWeightModalOpen,
    setSelectedPatientId,
    deletePatient
  } = useClinic();

  const [searchQuery, setSearchQuery] = useState('');
  const [isIssueCodeModalOpen, setIsIssueCodeModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [foodFilter, setFoodFilter] = useState<string>('all');
  const [conditionFilter, setConditionFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'joiningDate' | 'weightLoss' | 'currentWeight'>('joiningDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Collect all unique medical conditions across clinic patients for the filter
  const allConditions = useMemo(() => {
    const set = new Set<string>();
    (patients || []).forEach(p => (p.medicalConditions || []).forEach(c => c && set.add(c)));
    return Array.from(set);
  }, [patients]);

  // Filter & sort patients
  const filteredPatients = useMemo(() => {
    const search = (searchQuery || '').toLowerCase().trim();
    return (patients || []).filter(p => {
      // Search
      const matchesSearch = !search ||
        (p.name || '').toLowerCase().includes(search) ||
        (p.patientCode || '').toLowerCase().includes(search) ||
        (p.mobile || '').includes(search) ||
        (p.email || '').toLowerCase().includes(search);

      // Status
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;

      // Food
      const matchesFood = foodFilter === 'all' || p.foodPreference === foodFilter;

      // Condition
      const matchesCondition = conditionFilter === 'all' || (p.medicalConditions || []).includes(conditionFilter);

      return matchesSearch && matchesStatus && matchesFood && matchesCondition;
    }).sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' ? (a.name || '').localeCompare(b.name || '') : (b.name || '').localeCompare(a.name || '');
      }
      if (sortBy === 'joiningDate') {
        return sortOrder === 'asc' 
          ? new Date(a.joiningDate).getTime() - new Date(b.joiningDate).getTime()
          : new Date(b.joiningDate).getTime() - new Date(a.joiningDate).getTime();
      }
      if (sortBy === 'weightLoss') {
        const lossA = a.startingWeightKg - a.currentWeightKg;
        const lossB = b.startingWeightKg - b.currentWeightKg;
        return sortOrder === 'asc' ? lossA - lossB : lossB - lossA;
      }
      if (sortBy === 'currentWeight') {
        return sortOrder === 'asc' ? a.currentWeightKg - b.currentWeightKg : b.currentWeightKg - a.currentWeightKg;
      }
      return 0;
    });
  }, [patients, searchQuery, statusFilter, foodFilter, conditionFilter, sortBy, sortOrder]);

  const handleExportCSV = () => {
    const headers = ['Patient Code', 'Name', 'Mobile', 'Email', 'Age', 'Gender', 'Height (cm)', 'Current Weight (kg)', 'Starting Weight (kg)', 'Weight Lost (kg)', 'BMI', 'Food Preference', 'Medical Conditions', 'Assigned Plan', 'Status', 'Renewal Date'];
    const rows = (filteredPatients || []).map(p => {
      const bmi = calculateBmi(p.currentWeightKg, p.heightCm).bmi;
      const weightLost = (p.startingWeightKg - p.currentWeightKg).toFixed(1);
      return [
        p.patientCode,
        `"${p.name}"`,
        p.mobile,
        p.email,
        p.age,
        p.gender,
        p.heightCm,
        p.currentWeightKg,
        p.startingWeightKg,
        weightLost,
        bmi,
        p.foodPreference,
        `"${(p.medicalConditions || []).join(', ')}"`,
        `"${p.assignedPlanName || 'Standard'}"`,
        p.status,
        p.renewalDate
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PBL_Patients_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#183153]">Patient Directory</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-[#183153]">
              {filteredPatients.length} Patients
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Search, filter, calculate auto BMI, and manage clinical nutrition profiles.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-[#E4E9E4] text-xs font-semibold text-[#183153] transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsIssueCodeModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5 text-teal-200" />
            <span>Issue Patient Code</span>
          </button>

          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#6BBF59] hover:bg-[#5EAB4D] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register New Patient</span>
          </button>
        </div>
      </div>

      {/* SEARCH AND FILTERS TOOLBAR */}
      <div className="medical-card p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          
          {/* Search Box (5 cols) */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, phone, PBL code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-[#183153] focus:ring-2 focus:ring-[#6BBF59]/30 focus:border-[#6BBF59] outline-none"
            />
          </div>

          {/* Status Filter (2 cols) */}
          <div className="lg:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-[#183153] font-medium focus:ring-2 focus:ring-[#6BBF59]/30 focus:border-[#6BBF59] outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Plan</option>
              <option value="pending_renewal">Renewal Due</option>
              <option value="completed">Completed</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Food Preference Filter (2 cols) */}
          <div className="lg:col-span-2">
            <select
              value={foodFilter}
              onChange={(e) => setFoodFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-[#183153] font-medium focus:ring-2 focus:ring-[#6BBF59]/30 focus:border-[#6BBF59] outline-none"
            >
              <option value="all">All Food Diets</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Non-Vegetarian">Non-Vegetarian</option>
              <option value="Eggetarian">Eggetarian</option>
              <option value="Vegan">Vegan</option>
              <option value="Jain">Jain</option>
              <option value="Keto">Keto</option>
            </select>
          </div>

          {/* Medical Condition Filter (2 cols) */}
          <div className="lg:col-span-2">
            <select
              value={conditionFilter}
              onChange={(e) => setConditionFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-[#183153] font-medium focus:ring-2 focus:ring-[#6BBF59]/30 focus:border-[#6BBF59] outline-none"
            >
              <option value="all">All Conditions</option>
              {allConditions.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Sort Selector (2 cols) */}
          <div className="lg:col-span-2 flex items-center gap-1.5">
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-[#183153] font-medium focus:ring-2 focus:ring-[#6BBF59]/30 focus:border-[#6BBF59] outline-none"
            >
              <option value="joiningDate">Sort: Joining Date</option>
              <option value="name">Sort: Name (A-Z)</option>
              <option value="weightLoss">Sort: Max Weight Loss</option>
              <option value="currentWeight">Sort: Current Weight</option>
            </select>
            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 text-xs cursor-pointer"
              title={`Toggle sort order (${sortOrder})`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* PATIENTS TABLE */}
      <div className="medical-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FFF8] border-b border-[#E4E9E4] text-[#183153] uppercase tracking-wider font-semibold text-[11px]">
              <tr>
                <th className="py-3 px-4">Patient Code & Name</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4 text-center">Weight & BMI</th>
                <th className="py-3 px-4 text-center">Weight Loss</th>
                <th className="py-3 px-4">Food & Medical Conditions</th>
                <th className="py-3 px-4">Assigned Plan & Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-[#183153]">No matching patients found</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Try adjusting search filters or register a new patient.</p>
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => {
                  const bmiInfo = calculateBmi(patient.currentWeightKg, patient.heightCm);
                  const totalLost = Number((patient.startingWeightKg - patient.currentWeightKg).toFixed(1));

                  return (
                    <tr 
                      key={patient.id} 
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => navigateTo('patient_profile', { patientId: patient.id })}
                    >
                      {/* Patient Name & Code */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#183153]/5 text-[#183153] font-bold flex items-center justify-center border border-slate-200 shrink-0">
                            {patient.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-[#183153] group-hover:text-[#6BBF59] transition-colors flex items-center gap-1.5">
                              {patient.name}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              {patient.patientCode} • {patient.age}y • {patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="py-3.5 px-4">
                        <div className="text-xs text-[#183153] font-medium">{patient.mobile}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[150px]">{patient.email}</div>
                      </td>

                      {/* Weight & Auto BMI */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="font-black text-[#183153] text-sm">
                          {patient.currentWeightKg} <span className="text-[11px] font-normal text-slate-500">kg</span>
                        </div>
                        <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold mt-0.5" style={{ backgroundColor: `${bmiInfo.color}15`, color: bmiInfo.color }}>
                          <span>BMI {bmiInfo.bmi}</span>
                          <span>•</span>
                          <span>{bmiInfo.category.split(' ')[0]}</span>
                        </div>
                      </td>

                      {/* Weight Loss Progress */}
                      <td className="py-3.5 px-4 text-center">
                        {totalLost > 0 ? (
                          <div className="font-bold text-emerald-600">
                            -{totalLost} kg
                            <span className="block text-[10px] text-slate-400 font-normal">from {patient.startingWeightKg}kg</span>
                          </div>
                        ) : totalLost === 0 ? (
                          <span className="text-slate-400 font-medium">Baseline</span>
                        ) : (
                          <span className="text-amber-600 font-medium">+{Math.abs(totalLost)} kg</span>
                        )}
                      </td>

                      {/* Food Preference & Conditions */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap items-center gap-1 max-w-[200px]">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-semibold">
                            {patient.foodPreference}
                          </span>
                          {(patient.medicalConditions || []).slice(0, 2).map((c, i) => (
                            <span key={i} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">
                              {c}
                            </span>
                          ))}
                          {(patient.medicalConditions || []).length > 2 && (
                            <span className="text-[10px] text-slate-400 font-medium">
                              +{(patient.medicalConditions || []).length - 2}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Plan & Status */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#183153] truncate max-w-[170px]">
                          {patient.assignedPlanName || 'Clinical Care'}
                        </div>
                        <div className="mt-1">
                          {patient.status === 'active' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> Active
                            </span>
                          )}
                          {patient.status === 'pending_renewal' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              <Clock className="w-2.5 h-2.5 text-amber-600" /> Renewal Due
                            </span>
                          )}
                          {patient.status === 'completed' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                              Completed
                            </span>
                          )}
                          {patient.status === 'inactive' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                              Inactive
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => navigateTo('patient_chat', { patientId: patient.id })}
                            className="p-1.5 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                            title="Open In-App Chat"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => navigateTo('ai_copilot', { patientId: patient.id })}
                            className="p-1.5 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                            title="Open Doctor Copilot"
                          >
                            <Bot className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              setSelectedPatientId(patient.id);
                              setIsWeightModalOpen(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                            title="Log new weigh-in"
                          >
                            <Scale className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              setSelectedPatientId(patient.id);
                              setIsPaymentModalOpen(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title="Collect Fee / Renew Plan"
                          >
                            <CreditCard className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => navigateTo('patient_profile', { patientId: patient.id })}
                            className="p-1.5 text-[#183153] hover:text-white hover:bg-[#183153] rounded-lg transition-colors cursor-pointer font-medium"
                            title="View Full Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue Patient Registration Code Modal */}
      <IssuePatientCodeModal 
        isOpen={isIssueCodeModalOpen} 
        onClose={() => setIsIssueCodeModalOpen(false)} 
      />

    </div>
  );
};
