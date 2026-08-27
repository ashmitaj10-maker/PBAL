import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Invoice } from '../../types/clinic';
import { formatDate } from '../../utils/dateUtils';
import { 
  Printer, 
  Download, 
  Share2, 
  ArrowLeft, 
  CheckCircle2, 
  Building2, 
  Receipt, 
  FileCheck, 
  CreditCard, 
  Mail, 
  Phone,
  Clock,
  Sparkles
} from 'lucide-react';

export const InvoicePreviewView: React.FC = () => {
  const { 
    invoices, 
    selectedInvoice, 
    setSelectedInvoiceId, 
    currentClinic, 
    navigateTo, 
    markInvoicePaid,
    currentUser 
  } = useClinic();

  const [shareSuccess, setShareSuccess] = useState<string | null>(null);

  // If no invoice is selected, default to the first one
  const invoice: Invoice | undefined = selectedInvoice || invoices[0];

  const handlePrint = () => {
    window.print();
  };

  const handleShare = (channel: 'whatsapp' | 'email') => {
    if (!invoice) return;
    if (channel === 'whatsapp') {
      const message = `Hello ${invoice.patientName}, your medical nutrition invoice ${invoice.invoiceNumber} for ₹${(invoice.grandTotal || 0).toLocaleString()} from ${currentClinic?.name} is ready. Total Paid: ₹${(invoice.amountPaid || 0).toLocaleString()}, Balance: ₹${(invoice.balanceDue || 0).toLocaleString()}.`;
      const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    } else {
      setShareSuccess(`Invoice receipt PDF sent to ${invoice.patientEmail || invoice.patientName}`);
      setTimeout(() => setShareSuccess(null), 4000);
    }
  };

  if (!invoice) {
    return (
      <div className="py-16 text-center space-y-4">
        <Receipt className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-lg font-bold text-[#183153]">No Invoices Available</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Record a patient payment to generate and preview medical tax invoices.
        </p>
        <button
          onClick={() => navigateTo('payments')}
          className="px-4 py-2 bg-[#183153] text-white rounded-xl text-xs font-semibold"
        >
          Go to Payments
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Header & Actions (Hidden during print) */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('payments')}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#183153] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Payments</span>
          </button>
          
          {/* Invoice Selector Dropdown */}
          <div className="relative">
            <select
              value={invoice.id}
              onChange={(e) => setSelectedInvoiceId(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-[#183153] focus:ring-2 focus:ring-[#6BBF59]/30 outline-none"
            >
              {(invoices || []).map(inv => (
                <option key={inv.id} value={inv.id}>
                  {inv.invoiceNumber} — {inv.patientName} (₹{(inv.grandTotal || 0).toLocaleString()})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(invoice.balanceDue || 0) > 0 && (
            <button
              onClick={() => markInvoicePaid(invoice.id, 'upi')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#6BBF59]" />
              <span>Mark Balance Paid (₹{(invoice.balanceDue || 0).toLocaleString()})</span>
            </button>
          )}

          <button
            onClick={() => handleShare('whatsapp')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-50 hover:bg-green-100 text-green-800 border border-green-200 text-xs font-semibold transition-all cursor-pointer"
            title="Share payment receipt via WhatsApp"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>

          <button
            onClick={() => handleShare('email')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-semibold transition-all cursor-pointer"
            title="Email PDF receipt to patient"
          >
            <Mail className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Email Receipt</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#183153] hover:bg-[#244673] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {shareSuccess && (
        <div className="print:hidden p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#6BBF59]" />
          <span>{shareSuccess}</span>
        </div>
      )}

      {/* PRINTABLE CLINICAL TAX INVOICE CARD */}
      <div className="max-w-3xl mx-auto bg-white border border-[#E4E9E4] shadow-lg rounded-2xl p-8 sm:p-12 text-[#183153] relative overflow-hidden print:border-none print:shadow-none print:p-0">
        
        {/* WATERMARK STAMP */}
        <div className="absolute right-8 top-28 pointer-events-none opacity-15 rotate-[-15deg] select-none">
          <div className={`text-6xl font-black border-4 px-6 py-2 rounded-2xl uppercase tracking-widest ${
            invoice.status === 'paid' ? 'border-emerald-600 text-emerald-600' :
            invoice.status === 'partial' ? 'border-amber-600 text-amber-600' : 'border-rose-600 text-rose-600'
          }`}>
            {invoice.status === 'paid' ? 'PAID' : invoice.status === 'partial' ? 'PARTIAL' : 'PENDING'}
          </div>
        </div>

        {/* CLINIC HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b-2 border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#183153] text-[#6BBF59] font-black text-sm flex items-center justify-center">
                PBL
              </div>
              <h2 className="text-xl font-bold tracking-tight text-[#183153]">
                {currentClinic?.name}
              </h2>
            </div>
            <p className="text-xs text-[#5EAB4D] font-semibold mt-1">
              {currentClinic?.tagline}
            </p>
            <p className="text-xs text-slate-500 mt-2 max-w-sm leading-relaxed">
              {currentClinic?.address}<br />
              {currentClinic?.city}
            </p>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              Tel: {currentClinic?.phone} • Email: {currentClinic?.email}
            </p>
            <p className="text-xs font-semibold text-[#183153] mt-1 font-mono">
              {currentClinic?.taxNumber}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <div className="inline-block px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold uppercase tracking-wider text-[#183153]">
              Tax Invoice / Fee Receipt
            </div>
            <div className="mt-3 font-mono text-lg font-black text-[#183153]">
              {invoice.invoiceNumber}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Issue Date: <strong className="text-[#183153] font-mono">{formatDate(invoice.issueDate)}</strong>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Due Date: <strong className="text-[#183153] font-mono">{formatDate(invoice.dueDate)}</strong>
            </div>
          </div>
        </div>

        {/* PATIENT & CONSULTANT DETAILS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-slate-100 text-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Billed To (Patient Details)
            </span>
            <h4 className="text-sm font-bold text-[#183153]">{invoice.patientName}</h4>
            <p className="text-slate-600 mt-0.5 font-mono">{invoice.patientMobile}</p>
            <p className="text-slate-500 truncate">{invoice.patientEmail}</p>
            {invoice.patientAddress && (
              <p className="text-slate-500 mt-1 max-w-xs">{invoice.patientAddress}</p>
            )}
          </div>

          <div className="sm:text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Attending Medical Consultant
            </span>
            <h4 className="text-sm font-bold text-[#183153]">{invoice.doctorName}</h4>
            <p className="text-slate-500 mt-0.5 font-mono text-[11px]">
              Reg No: {invoice.doctorLicense || 'MCI-REG-84920/MAH'}
            </p>
            <p className="text-slate-500 text-[11px]">Department of Clinical Endocrinology</p>
          </div>
        </div>

        {/* ITEMIZED TABLE */}
        <div className="py-6">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-2.5">Service & Clinical Protocol Description</th>
                <th className="py-2.5 text-center">Duration</th>
                <th className="py-2.5 text-right">Fee Rate</th>
                <th className="py-2.5 text-right">Amount (INR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(invoice.items || []).map((item) => (
                <tr key={item.id}>
                  <td className="py-3.5 pr-4">
                    <div className="font-bold text-[#183153]">{item.description}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Includes personalized macro algorithms, weekly doctor reviews & body composition scans.</div>
                  </td>
                  <td className="py-3.5 text-center font-medium text-slate-600">{item.duration}</td>
                  <td className="py-3.5 text-right font-mono text-slate-600">₹{(item.unitPrice || 0).toLocaleString()}</td>
                  <td className="py-3.5 text-right font-mono font-bold text-[#183153]">₹{(item.total || 0).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FINANCIAL CALCULATION BREAKDOWN */}
        <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row justify-between gap-6 text-xs">
          
          {/* Payment Mode info */}
          <div className="space-y-2 max-w-xs">
            <div className="p-3 rounded-xl bg-[#F8FFF8] border border-[#E4E9E4]">
              <div className="font-bold text-[#183153] flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#6BBF59]" />
                Payment Record Verified
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                Payment Mode: <strong className="uppercase">{invoice.paymentMode?.replace('_', ' ') || 'UPI'}</strong>
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                Txn Ref: {invoice.transactionRef || 'TXN-DIRECT-CLEARED'}
              </p>
            </div>

            {invoice.notes && (
              <p className="text-[10px] text-slate-500 italic leading-relaxed">
                *{invoice.notes}
              </p>
            )}
          </div>

          {/* Totals Table */}
          <div className="space-y-2 min-w-[260px] self-end sm:self-auto">
            <div className="flex justify-between text-slate-600">
              <span>Gross Fee Subtotal:</span>
              <span className="font-mono">₹{(invoice.subtotal || 0).toLocaleString()}</span>
            </div>

            {(invoice.discountAmount || 0) > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Promotional / Clinic Discount:</span>
                <span className="font-mono">-₹{(invoice.discountAmount || 0).toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600">
              <span>Taxable Value:</span>
              <span className="font-mono">₹{(invoice.taxableAmount || 0).toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Integrated GST (18%):</span>
              <span className="font-mono">₹{(invoice.taxAmount || 0).toLocaleString()}</span>
            </div>

            <div className="border-t-2 border-slate-200 pt-2 flex justify-between text-sm font-black text-[#183153]">
              <span>Grand Total:</span>
              <span className="font-mono">₹{(invoice.grandTotal || 0).toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-xs font-bold text-emerald-700">
              <span>Amount Paid:</span>
              <span className="font-mono">₹{(invoice.amountPaid || 0).toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-xs font-bold pt-1 border-t border-slate-100">
              <span className={(invoice.balanceDue || 0) > 0 ? 'text-amber-700' : 'text-slate-400'}>
                Balance Due:
              </span>
              <span className={`font-mono ${(invoice.balanceDue || 0) > 0 ? 'text-amber-700' : 'text-slate-400'}`}>
                ₹{(invoice.balanceDue || 0).toLocaleString()}
              </span>
            </div>
          </div>

        </div>

        {/* CLINICAL SIGNATURE & STAMP FOOTER */}
        <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-end justify-between gap-6 text-[11px] text-slate-500">
          <div className="max-w-sm">
            <p className="font-semibold text-[#183153]">Terms & Conditions</p>
            <p className="mt-0.5 text-[10px] text-slate-400 leading-relaxed">
              Medical nutrition therapy fees are non-refundable. Consultation appointments can be rescheduled up to 24 hours in advance. Computer generated tax invoice valid without physical signature.
            </p>
          </div>

          <div className="text-right">
            <div className="w-36 border-b border-slate-300 pb-1 mb-1 text-center font-serif text-slate-800 italic">
              Dr. Ashmita Joshi
            </div>
            <p className="font-semibold text-[#183153]">Authorized Signatory</p>
            <p className="text-[10px] text-slate-400">Chief Medical Nutritionist</p>
          </div>
        </div>

      </div>

    </div>
  );
};
