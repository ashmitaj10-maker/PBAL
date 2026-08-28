import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { PaymentRecord, PaymentStatus, PaymentMode, ClinicPlan } from '../../types/clinic';
import { formatDate } from '../../utils/dateUtils';
import { 
  CreditCard, 
  PlusCircle, 
  FileText, 
  IndianRupee, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Filter, 
  Receipt, 
  Clock, 
  Eye, 
  Download, 
  Sparkles,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Edit3,
  Pause,
  Play,
  X,
  AlertCircle,
  User,
  ShieldAlert
} from 'lucide-react';

export const PaymentManagementView: React.FC = () => {
  const { 
    payments, 
    plans, 
    patients,
    currentClinic, 
    navigateTo, 
    setIsPaymentModalOpen, 
    setIsCreatePlanModalOpen,
    openPlanModal,
    setSelectedInvoiceId,
    getDashboardKpis,
    pausePatientPlan,
    resumePatientPlan
  } = useClinic();

  const [activeTab, setActiveTab] = useState<'transactions' | 'subscriptions' | 'plans'>('transactions');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [modeFilter, setModeFilter] = useState<string>('all');
  const [subscriptionFilter, setSubscriptionFilter] = useState<string>('all');

  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
  const [selectedPatientForPause, setSelectedPatientForPause] = useState<any>(null);
  const [pauseReasonInput, setPauseReasonInput] = useState('');

  const kpis = getDashboardKpis();

  // Filter payments
  const filteredPayments = (payments || []).filter(p => {
    const q = (searchQuery || '').toLowerCase().trim();
    const matchesSearch = !q ||
      (p.patientName || '').toLowerCase().includes(q) ||
      (p.planName || '').toLowerCase().includes(q) ||
      (p.transactionRef || '').toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesMode = modeFilter === 'all' || p.paymentMode === modeFilter;

    return matchesSearch && matchesStatus && matchesMode;
  });

  const handleExportPaymentsCSV = () => {
    const headers = ['Receipt / Txn Ref', 'Date', 'Patient Name', 'Plan Name', 'Base Price', 'Discount', 'Tax (GST)', 'Total Amount', 'Paid Amount', 'Pending Balance', 'Mode', 'Status'];
    const rows = (filteredPayments || []).map(p => [
      p.transactionRef || 'TXN',
      p.paymentDate ? formatDate(p.paymentDate) : '',
      `"${p.patientName || 'Patient'}"`,
      `"${p.planName || 'Plan'}"`,
      p.basePrice || 0,
      p.discountAmount || 0,
      p.taxAmount || 0,
      p.totalAmount || 0,
      p.paidAmount || 0,
      p.pendingBalance || 0,
      p.paymentMode || '',
      p.status || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PBL_Payment_Ledger_${formatDate(new Date())}.csv`);
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
            <h1 className="text-xl font-bold text-[#183153]">Payment & Plan Management</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-[#183153]">
              {payments.length} Transactions
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage clinical plans, discount structures, pending fee balances, and GST invoices.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportPaymentsCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-[#E4E9E4] text-xs font-semibold text-[#183153] transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Ledger (CSV)</span>
          </button>

          <button
            onClick={() => setIsCreatePlanModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-bold transition-all cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-purple-600" />
            <span>+ Create Plan</span>
          </button>

          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#6BBF59] hover:bg-[#5EAB4D] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* FINANCIAL OVERVIEW STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="medical-card p-5">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>Total Fees Collected</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#6BBF59] flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#183153] mt-2">
            {currentClinic?.currencySymbol}{(kpis?.totalRevenue || 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> {payments.filter(p => p.status === 'paid').length} payments fully cleared
          </div>
        </div>

        <div className="medical-card p-5">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>Pending Balance Due</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-700 mt-2">
            {currentClinic?.currencySymbol}{(kpis?.pendingPaymentsAmount || 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-amber-700 font-semibold mt-1">
            Across {kpis.pendingInvoicesCount} partial & pending invoices
          </div>
        </div>

        <div className="medical-card p-5">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>Active Clinical Plans</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#183153] mt-2">
            {plans.length} <span className="text-sm font-normal text-slate-500">Tiered Programs</span>
          </div>
          <div className="text-[11px] text-purple-700 font-semibold mt-1">
            From 1-month kickstart to 12-month annual
          </div>
        </div>
      </div>

      {/* TABS SWITCHER */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'transactions' ? 'bg-[#183153] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Payment Transactions ({payments.length})
        </button>
        <button
          onClick={() => setActiveTab('subscriptions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'subscriptions' ? 'bg-[#183153] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Patient Subscriptions & Plan Status</span>
          {(patients || []).filter(p => p.status === 'paused').length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-200 text-amber-950">
              {(patients || []).filter(p => p.status === 'paused').length} Paused
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('plans')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'plans' ? 'bg-[#183153] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Clinical Plans Catalogue ({plans.length})
        </button>
      </div>

      {/* TAB 1: TRANSACTIONS & LEDGER */}
      {activeTab === 'transactions' && (
        <div className="space-y-4">
          
          {/* Filters Bar */}
          <div className="medical-card p-4">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-5 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search patient, plan, txn ref..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-[#183153] focus:ring-2 focus:ring-[#6BBF59]/30 focus:border-[#6BBF59] outline-none"
                />
              </div>

              <div className="sm:col-span-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-[#183153] font-medium focus:ring-2 focus:ring-[#6BBF59]/30 focus:border-[#6BBF59] outline-none"
                >
                  <option value="all">All Payment Statuses</option>
                  <option value="paid">Paid in Full</option>
                  <option value="partial">Partial / Installment</option>
                  <option value="pending">Pending</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>

              <div className="sm:col-span-4">
                <select
                  value={modeFilter}
                  onChange={(e) => setModeFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-[#183153] font-medium focus:ring-2 focus:ring-[#6BBF59]/30 focus:border-[#6BBF59] outline-none"
                >
                  <option value="all">All Payment Modes</option>
                  <option value="upi">UPI (GPay / PhonePe / Paytm)</option>
                  <option value="card">Credit / Debit Card (POS)</option>
                  <option value="net_banking">Net Banking (NEFT / IMPS)</option>
                  <option value="bank_transfer">Direct Bank Transfer (RTGS)</option>
                  <option value="cash">Cash Receipt</option>
                </select>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="medical-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FFF8] border-b border-[#E4E9E4] text-[#183153] uppercase tracking-wider font-semibold text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Date & Txn Ref</th>
                    <th className="py-3 px-4">Patient Name</th>
                    <th className="py-3 px-4">Plan Item</th>
                    <th className="py-3 px-4 text-right">Base / Disc</th>
                    <th className="py-3 px-4 text-right">Total (Incl GST)</th>
                    <th className="py-3 px-4 text-right">Paid</th>
                    <th className="py-3 px-4 text-right">Pending Balance</th>
                    <th className="py-3 px-4 text-center">Mode & Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400">
                        No transactions match your search filter.
                      </td>
                    </tr>
                  ) : (
                    (filteredPayments || []).map((p) => {
                      return (
                        <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-[#183153] font-mono">{formatDate(p.paymentDate)}</div>
                            <div className="font-mono text-[10px] text-slate-400">{p.transactionRef || 'N/A'}</div>
                          </td>

                          <td className="py-3.5 px-4 font-bold text-[#183153]">
                            {p.patientName}
                          </td>

                          <td className="py-3.5 px-4 font-medium text-slate-700 max-w-[180px] truncate">
                            {p.planName}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="text-slate-600">₹{(p.basePrice || 0).toLocaleString()}</div>
                            {(p.discountAmount || 0) > 0 && (
                              <div className="text-[10px] text-emerald-600">-₹{(p.discountAmount || 0).toLocaleString()}</div>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-right font-bold text-[#183153]">
                            ₹{(p.totalAmount || 0).toLocaleString()}
                          </td>

                          <td className="py-3.5 px-4 text-right font-black text-emerald-700">
                            ₹{(p.paidAmount || 0).toLocaleString()}
                          </td>

                          <td className="py-3.5 px-4 text-right font-bold">
                            {(p.pendingBalance || 0) > 0 ? (
                              <span className="text-amber-700">₹{(p.pendingBalance || 0).toLocaleString()}</span>
                            ) : (
                              <span className="text-slate-400 font-normal">₹0 (Nil)</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            <span className="block text-[10px] font-mono uppercase text-slate-500 mb-0.5">
                              {p?.paymentMode ? p.paymentMode.replace('_', ' ') : 'UPI'}
                            </span>
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                              p.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                              p.status === 'partial' ? 'bg-amber-100 text-amber-800' :
                              p.status === 'overdue' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {p.status}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedInvoiceId(p.invoiceId);
                                navigateTo('invoice_preview', { invoiceId: p.invoiceId });
                              }}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#183153] hover:text-white text-[#183153] font-semibold text-[11px] transition-colors cursor-pointer"
                              title="View and print tax invoice"
                            >
                              Invoice
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: PATIENT SUBSCRIPTIONS & PLAN PAUSE/RESUME */}
      {activeTab === 'subscriptions' && (
        <div className="space-y-4">
          
          {/* Subscriptions Overview Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="medical-card p-4 bg-white border border-slate-200">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Enrolled Patients</div>
              <div className="text-xl font-black text-[#183153] mt-1">
                {(patients || []).filter(p => p.assignedPlanName || p.assignedPlanId).length}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Purchased clinical nutrition plans</div>
            </div>

            <div className="medical-card p-4 bg-emerald-50/60 border border-emerald-200">
              <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Active Subscriptions</div>
              <div className="text-xl font-black text-emerald-900 mt-1">
                {(patients || []).filter(p => p.status === 'active' && (p.assignedPlanName || p.assignedPlanId)).length}
              </div>
              <div className="text-[11px] text-emerald-700 mt-0.5">Billing & automated reminders active</div>
            </div>

            <div className="medical-card p-4 bg-amber-50/70 border border-amber-200">
              <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">Paused Subscriptions</div>
              <div className="text-xl font-black text-amber-950 mt-1">
                {(patients || []).filter(p => p.status === 'paused').length}
              </div>
              <div className="text-[11px] text-amber-800 mt-0.5">Billing & future notifications on hold</div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="medical-card p-4">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-8 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search patient by name, code, mobile, or plan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-[#183153] focus:ring-2 focus:ring-[#6BBF59]/30 focus:border-[#6BBF59] outline-none"
                />
              </div>

              <div className="sm:col-span-4">
                <select
                  value={subscriptionFilter}
                  onChange={(e) => setSubscriptionFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-[#183153] font-medium focus:ring-2 focus:ring-[#6BBF59]/30 focus:border-[#6BBF59] outline-none"
                >
                  <option value="all">All Subscription States</option>
                  <option value="active">Active Only</option>
                  <option value="paused">Paused Only</option>
                  <option value="pending_renewal">Renewal Due Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Subscriptions Table */}
          <div className="medical-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">Patient Profile</th>
                    <th className="py-3 px-4">Assigned Plan</th>
                    <th className="py-3 px-4">Start & Renewal Period</th>
                    <th className="py-3 px-4 text-center">Subscription Status</th>
                    <th className="py-3 px-4 text-right">Doctor Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(() => {
                    const q = (searchQuery || '').toLowerCase().trim();
                    const list = (patients || []).filter(p => {
                      const hasPlan = !!p.assignedPlanName || !!p.assignedPlanId;
                      const matchesSearch = !q ||
                        (p.name || '').toLowerCase().includes(q) ||
                        (p.patientCode || '').toLowerCase().includes(q) ||
                        (p.assignedPlanName || '').toLowerCase().includes(q) ||
                        (p.mobile || '').includes(q);

                      const matchesSub = subscriptionFilter === 'all' || p.status === subscriptionFilter;
                      return hasPlan && matchesSearch && matchesSub;
                    });

                    if (list.length === 0) {
                      return (
                        <tr>
                          <td colSpan={5} className="py-10 text-center text-slate-400">
                            No patient subscriptions found matching the selected filter.
                          </td>
                        </tr>
                      );
                    }

                    return list.map(pat => {
                      const isPaused = pat.status === 'paused';
                      return (
                        <tr key={pat.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-[#183153] text-white font-bold flex items-center justify-center text-xs shrink-0">
                                {pat.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-bold text-[#183153]">{pat.name}</div>
                                <div className="text-[10px] text-slate-400 font-mono">{pat.patientCode} • {pat.mobile}</div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-900">{pat.assignedPlanName || 'Clinical Care Plan'}</div>
                            <div className="text-[10px] text-slate-500">{pat.foodPreference} Diet</div>
                          </td>

                          <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                            <div>Joined: {formatDate(pat.joiningDate)}</div>
                            <div className="text-slate-400">Renewal: {pat.renewalDate ? formatDate(pat.renewalDate) : 'Ongoing'}</div>
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            {isPaused ? (
                              <div className="inline-block text-left">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-950 border border-amber-300">
                                  <Pause className="w-2.5 h-2.5 text-amber-700" /> Plan Paused
                                </span>
                                {pat.pauseDetails?.pausedAt && (
                                  <div className="text-[9px] text-amber-800 mt-0.5 font-mono">
                                    Since {formatDate(pat.pauseDetails.pausedAt)}
                                  </div>
                                )}
                                {pat.pauseDetails?.pauseReason && (
                                  <div className="text-[9px] text-slate-500 truncate max-w-[150px]" title={pat.pauseDetails.pauseReason}>
                                    "{pat.pauseDetails.pauseReason}"
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> Active Plan
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {isPaused ? (
                                <button
                                  onClick={() => resumePatientPlan(pat.id)}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
                                  title="Resume patient subscription, billing and automated reminders"
                                >
                                  <Play className="w-3.5 h-3.5" />
                                  <span>Resume Plan</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    setSelectedPatientForPause(pat);
                                    setIsPauseModalOpen(true);
                                  }}
                                  className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-[11px] transition-all flex items-center gap-1 cursor-pointer"
                                  title="Pause patient subscription and pause future billings"
                                >
                                  <Pause className="w-3.5 h-3.5 text-amber-700" />
                                  <span>Pause Plan</span>
                                </button>
                              )}

                              <button
                                onClick={() => navigateTo('patient_profile', { patientId: pat.id })}
                                className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-[#183153] hover:text-white text-[#183153] font-semibold text-[11px] transition-colors cursor-pointer"
                                title="View Patient Profile"
                              >
                                View Profile
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: CLINICAL PLANS CATALOGUE */}
      {activeTab === 'plans' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Configured clinical programs, duration timelines, and standard base prices for {currentClinic?.name}.
            </p>
            <button
              onClick={() => openPlanModal()}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#6BBF59] text-white text-xs font-bold cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Plan</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(plans || []).map((plan) => (
              <div key={plan.id} className="medical-card p-5 space-y-4 border border-[#E4E9E4]">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px] font-bold uppercase tracking-wider">
                      {plan.category}
                    </span>
                    <h3 className="text-base font-bold text-[#183153] mt-1">{plan.name}</h3>
                    <div className="text-xs text-slate-500 mt-0.5">{plan.durationMonths} Months ({plan.durationDays} Days Duration)</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black text-[#183153]">
                      ₹{(plan.basePrice || 0).toLocaleString()}
                    </div>
                    <span className="text-[10px] text-slate-400">+ 18% GST Applicable</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {plan.description}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Plan Inclusions:</div>
                  {(plan.features || []).map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#6BBF59] mt-0.5 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold flex items-center gap-1 ${plan.isArchived ? 'text-amber-600' : 'text-emerald-600'}`}>
                      <span className={`w-2 h-2 rounded-full ${plan.isArchived ? 'bg-amber-500' : 'bg-[#6BBF59]'}`}></span> 
                      {plan.isArchived ? 'Archived Plan' : 'Active Plan'}
                    </span>
                    <button
                      onClick={() => openPlanModal(plan)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#183153] hover:text-white text-[#183153] font-bold text-[11px] transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" /> Edit
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setIsPaymentModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#183153] hover:text-white text-[#183153] font-bold text-xs transition-colors cursor-pointer"
                  >
                    Assign to Patient
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PAUSE PLAN MODAL (DOCTOR / DIETITIAN ONLY) */}
      {isPauseModalOpen && selectedPatientForPause && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Pause className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Pause Patient Plan</h3>
                  <p className="text-xs text-slate-500">{selectedPatientForPause.name} ({selectedPatientForPause.patientCode})</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsPauseModalOpen(false);
                  setSelectedPatientForPause(null);
                  setPauseReasonInput('');
                }}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-amber-950">
                <AlertCircle className="w-4 h-4 text-amber-700" />
                <span>What happens when paused:</span>
              </div>
              <ul className="list-disc list-inside text-[11px] text-amber-800 space-y-0.5 ml-1">
                <li>Plan status changes to <strong>Paused</strong> immediately.</li>
                <li>Future scheduled payment dues & subscription billings are put on hold.</li>
                <li>Automated meal/exercise reminders and preparation notices stop.</li>
                <li>Patient retains full access to their past meals, logs, and assessments.</li>
                <li>Only you (the doctor/dietitian) can resume the plan when the patient returns.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Reason for Pause (Optional note for medical records):
              </label>

              {/* Quick Reason Chips */}
              <div className="flex flex-wrap gap-1.5">
                {['Travel / Out of Station', 'Medical Recovery / Surgery', 'Family Emergency', 'Work / Exam Schedule', 'Temporary Health Break'].map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setPauseReasonInput(r)}
                    className={`px-2 py-1 text-[11px] rounded-lg border transition-colors cursor-pointer ${
                      pauseReasonInput === r
                        ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <textarea
                value={pauseReasonInput}
                onChange={(e) => setPauseReasonInput(e.target.value)}
                placeholder="Enter specific clinical reason or patient request details..."
                rows={3}
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsPauseModalOpen(false);
                  setSelectedPatientForPause(null);
                  setPauseReasonInput('');
                }}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  pausePatientPlan(selectedPatientForPause.id, pauseReasonInput || 'Doctor initiated pause');
                  setIsPauseModalOpen(false);
                  setSelectedPatientForPause(null);
                  setPauseReasonInput('');
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Pause className="w-3.5 h-3.5" />
                <span>Confirm & Pause Plan</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
