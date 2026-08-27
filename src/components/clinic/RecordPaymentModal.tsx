import React, { useState, useEffect } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { PaymentMode } from '../../types/clinic';
import { 
  X, 
  CreditCard, 
  IndianRupee, 
  Percent, 
  Receipt, 
  CheckCircle2, 
  AlertTriangle,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

export const RecordPaymentModal: React.FC = () => {
  const { 
    isPaymentModalOpen, 
    setIsPaymentModalOpen, 
    patients, 
    plans, 
    selectedPatientId, 
    recordPayment, 
    navigateTo,
    currentClinic 
  } = useClinic();

  const [patientId, setPatientId] = useState<string>(selectedPatientId || patients[0]?.id || '');
  const [planId, setPlanId] = useState<string>(plans[0]?.id || '');
  const [basePrice, setBasePrice] = useState<number>(plans[0]?.basePrice || 16500);
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [taxRate, setTaxRate] = useState<number>(18); // 18% GST standard in India
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('upi');
  const [transactionRef, setTransactionRef] = useState<string>('');
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');

  // Update base price when plan changes
  useEffect(() => {
    const selectedPlan = plans.find(p => p.id === planId);
    if (selectedPlan) {
      setBasePrice(selectedPlan.basePrice);
    }
  }, [planId, plans]);

  // Keep patient in sync with selectedPatientId if modal opens
  useEffect(() => {
    if (selectedPatientId) {
      setPatientId(selectedPatientId);
    }
  }, [selectedPatientId]);

  if (!isPaymentModalOpen) return null;

  // Real-time discount & tax calculations
  const discountAmount = discountType === 'percentage'
    ? Number(((basePrice * discountValue) / 100).toFixed(2))
    : Number(discountValue);

  const taxableAmount = Math.max(0, basePrice - discountAmount);
  const taxAmount = Number(((taxableAmount * taxRate) / 100).toFixed(2));
  const totalAmount = Number((taxableAmount + taxAmount).toFixed(2));
  const pendingBalance = Math.max(0, Number((totalAmount - paidAmount).toFixed(2)));

  const handleSetFullPayment = () => {
    setPaidAmount(totalAmount);
  };

  const handleSetHalfPayment = () => {
    setPaidAmount(Math.round(totalAmount / 2));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !planId) return;

    const result = recordPayment({
      patientId,
      planId,
      basePrice,
      discountType,
      discountValue,
      taxRate,
      paidAmount: paidAmount === 0 && pendingBalance === 0 ? totalAmount : paidAmount,
      paymentMode,
      transactionRef: transactionRef || `UPI/${new Date().toISOString().slice(0,10).replace(/-/g,'')}/${Math.floor(100000 + Math.random() * 900000)}`,
      paymentDate,
      dueDate,
      notes
    });

    setIsPaymentModalOpen(false);
    navigateTo('invoice_preview', { invoiceId: result.invoice.id });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#E4E9E4] max-w-xl w-full my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#183153] to-[#244673] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#6BBF59]">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Collect Fee & Issue Invoice</h2>
              <p className="text-xs text-slate-300">
                Calculate discounts, GST 18%, and balance installments
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsPaymentModalOpen(false)}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Patient Selection */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Select Patient *
            </label>
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[#183153] font-bold focus:ring-2 focus:ring-[#6BBF59]/30 outline-none"
            >
              {(patients || []).map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.patientCode} • {p.mobile})
                </option>
              ))}
            </select>
          </div>

          {/* Plan Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Clinical Plan *
              </label>
              <select
                value={planId}
                onChange={(e) => setPlanId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[#183153] font-semibold focus:ring-2 focus:ring-[#6BBF59]/30 outline-none"
              >
                {(plans || []).map(pl => (
                  <option key={pl.id} value={pl.id}>
                    {pl.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Base Fee (₹)
              </label>
              <input
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[#183153] font-bold focus:ring-2 focus:ring-[#6BBF59]/30 outline-none"
              />
            </div>
          </div>

          {/* Discount Section */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#183153] uppercase tracking-wider text-[11px]">
                Discount & Concession
              </span>
              <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setDiscountType('percentage')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer ${
                    discountType === 'percentage' ? 'bg-[#183153] text-white' : 'text-slate-500'
                  }`}
                >
                  Percentage (%)
                </button>
                <button
                  type="button"
                  onClick={() => setDiscountType('fixed')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer ${
                    discountType === 'fixed' ? 'bg-[#183153] text-white' : 'text-slate-500'
                  }`}
                >
                  Fixed (₹)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 mb-1">
                  {discountType === 'percentage' ? 'Discount Rate (%)' : 'Discount Amount (₹)'}
                </label>
                <input
                  type="number"
                  min={0}
                  max={discountType === 'percentage' ? 100 : basePrice}
                  value={discountValue}
                  onChange={(e) => setDiscountValue(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-[#183153] outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Applied GST Rate (%)</label>
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-[#183153] outline-none"
                />
              </div>
            </div>
          </div>

          {/* TOTAL & PAID AMOUNT CALCULATION BANNER */}
          <div className="p-4 rounded-xl bg-[#F8FFF8] border border-[#E4E9E4] space-y-2">
            <div className="flex justify-between text-slate-600">
              <span>Gross Fee:</span>
              <span className="font-mono">₹{(basePrice || 0).toLocaleString()}</span>
            </div>
            {(discountAmount || 0) > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Discount Deduction:</span>
                <span className="font-mono">-₹{(discountAmount || 0).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>GST ({taxRate || 18}%):</span>
              <span className="font-mono">+₹{(taxAmount || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm font-black text-[#183153] pt-1 border-t border-slate-200">
              <span>Net Grand Total:</span>
              <span className="font-mono">₹{(totalAmount || 0).toLocaleString()}</span>
            </div>

            {/* Quick buttons */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] font-bold text-slate-500">Quick Paid Amount:</span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={handleSetFullPayment}
                  className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] hover:bg-emerald-200 cursor-pointer"
                >
                  Full (₹{(totalAmount || 0).toLocaleString()})
                </button>
                <button
                  type="button"
                  onClick={handleSetHalfPayment}
                  className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px] hover:bg-blue-200 cursor-pointer"
                >
                  50% Deposit
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block font-bold text-[#183153] mb-1">Amount Paid Now (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl font-black text-emerald-700 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pending Balance (₹)</label>
                <div className={`w-full px-3 py-2 rounded-xl font-black text-sm border ${
                  pendingBalance > 0 ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-slate-100 text-slate-500 border-slate-200'
                }`}>
                  ₹{(pendingBalance || 0).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Mode & Reference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Payment Mode *
              </label>
              <select
                value={paymentMode}
                onChange={(e: any) => setPaymentMode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[#183153] font-semibold focus:ring-2 focus:ring-[#6BBF59]/30 outline-none"
              >
                <option value="upi">UPI (GPay / PhonePe / Paytm)</option>
                <option value="card">Credit / Debit Card (POS)</option>
                <option value="net_banking">Net Banking (NEFT / IMPS)</option>
                <option value="bank_transfer">Direct Bank Transfer (RTGS)</option>
                <option value="cash">Cash Receipt</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Transaction / Receipt Ref
              </label>
              <input
                type="text"
                placeholder="e.g. UPI/20260823/99214"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[#183153] font-mono focus:ring-2 focus:ring-[#6BBF59]/30 outline-none"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Payment Date</label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[#183153] outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Balance Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[#183153] outline-none"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Payment Notes / Remark</label>
            <input
              type="text"
              placeholder="e.g. 1st installment paid. 2nd installment due before 2nd scan."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[#183153] outline-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsPaymentModalOpen(false)}
              className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#183153] hover:bg-[#244673] text-white font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <Receipt className="w-4 h-4 text-[#6BBF59]" />
              <span>Record & View Invoice</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
