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
  Edit3
} from 'lucide-react';

export const PaymentManagementView: React.FC = () => {
  const { 
    payments, 
    plans, 
    currentClinic, 
    navigateTo, 
    setIsPaymentModalOpen, 
    setIsCreatePlanModalOpen,
    openPlanModal,
    setSelectedInvoiceId,
    getDashboardKpis
  } = useClinic();

  const [activeTab, setActiveTab] = useState<'transactions' | 'plans'>('transactions');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [modeFilter, setModeFilter] = useState<string>('all');

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

      {/* TAB 2: CLINICAL PLANS CATALOGUE */}
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

    </div>
  );
};
