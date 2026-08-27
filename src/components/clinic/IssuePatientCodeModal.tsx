import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { 
  X, 
  KeyRound, 
  Copy, 
  Check, 
  Sparkles, 
  UserPlus, 
  ShieldCheck, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Share2,
  Send,
  User,
  Filter
} from 'lucide-react';
import { PatientCodeInvite } from '../../types/clinic';

interface IssuePatientCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IssuePatientCodeModal: React.FC<IssuePatientCodeModalProps> = ({ isOpen, onClose }) => {
  const { 
    currentUser, 
    users, 
    plans, 
    currentClinic, 
    patientInvites, 
    issuePatientInviteCode 
  } = useClinic();

  const [dieticianId, setDieticianId] = useState<string>(currentUser?.id || users[0]?.id || 'usr-1');
  const [patientName, setPatientName] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState<string>(plans[0]?.id || '');
  
  const [newlyIssuedInvite, setNewlyIssuedInvite] = useState<PatientCodeInvite | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [filterTab, setFilterTab] = useState<'all' | 'valid' | 'used' | 'expired'>('all');

  if (!isOpen) return null;

  const handleGenerateCode = (e: React.FormEvent) => {
    e.preventDefault();
    const invite = issuePatientInviteCode(dieticianId, {
      patientName: patientName.trim() || undefined,
      planId: selectedPlanId || undefined
    });
    setNewlyIssuedInvite(invite);
    setCopiedCode(false);
    setCopiedMessage(false);
    setPatientName('');
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleCopyInviteMessage = (invite: PatientCodeInvite) => {
    const dietician = users.find(u => u.id === invite.issuedByDieticianId);
    const msg = `Hello ${invite.patientName || 'there'}! Welcome to Perfect Body & Life. Your clinical dietitian ${dietician?.name || invite.dieticianName} has generated your unique registration Patient Code: *${invite.code}*. Please visit the portal and sign up using this code to link your customized health plan.`;
    navigator.clipboard.writeText(msg);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2500);
  };

  const filteredInvites = (patientInvites || []).filter(inv => {
    if (filterTab === 'all') return true;
    return inv.status === filterTab;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-teal-900 via-slate-900 to-emerald-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center border border-teal-400/30">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight text-white">
                Issue Patient Registration Code
              </h3>
              <p className="text-xs text-slate-300">
                Generate unique dietician-verified codes for patient self sign-up
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          
          {/* Section 1: Code Generator Form */}
          <form onSubmit={handleGenerateCode} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#183153] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Generate New Code</span>
              </span>
              <span className="text-slate-400 text-[11px]">Valid for 60 days</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Issuing Dietician *</label>
                <select
                  value={dieticianId}
                  onChange={(e) => setDieticianId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 font-semibold focus:ring-2 focus:ring-teal-500 outline-none"
                >
                  {(users || []).map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.roleTitle || u.role})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Patient Name (Optional)</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Ananya Rao"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Pre-Assigned Plan (Optional)</label>
                <select
                  value={selectedPlanId}
                  onChange={(e) => setSelectedPlanId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 font-semibold focus:ring-2 focus:ring-teal-500 outline-none"
                >
                  <option value="">-- No Pre-assigned Plan --</option>
                  {(plans || []).map(pl => (
                    <option key={pl.id} value={pl.id}>{pl.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <KeyRound className="w-4 h-4 text-emerald-300" />
              <span>Generate & Issue Patient Code</span>
            </button>
          </form>

          {/* Section 2: Newly Generated Code Box */}
          {newlyIssuedInvite && (
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-3 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-950 font-bold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Patient Code Generated Successfully!</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded-full">
                  Status: Ready for Sign-Up
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 bg-white rounded-xl border border-emerald-200">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Unique Patient Code:</span>
                  <span className="text-xl font-black font-mono tracking-widest text-[#183153]">
                    {newlyIssuedInvite.code}
                  </span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => handleCopyCode(newlyIssuedInvite.code)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-all cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied Code!' : 'Copy Code'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyInviteMessage(newlyIssuedInvite)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all cursor-pointer shadow-xs"
                  >
                    {copiedMessage ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                    <span>{copiedMessage ? 'Copied Message!' : 'Copy WhatsApp Text'}</span>
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-emerald-800">
                Share this code with your patient. When they visit the portal, they will enter <strong>{newlyIssuedInvite.code}</strong> during sign-up to link directly to your practice.
              </p>
            </div>
          )}

          {/* Section 3: History of Issued Codes */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="font-bold text-[#183153] text-sm">Issued Patient Codes & Invites</h4>
                <p className="text-slate-400 text-[11px]">Audit trail of active, claimed, and expired codes</p>
              </div>

              {/* Filter Tabs */}
              <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
                {(['all', 'valid', 'used', 'expired'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setFilterTab(tab)}
                    className={`px-2.5 py-1 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                      filterTab === tab ? 'bg-white text-[#183153] shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {tab === 'valid' ? 'Active' : tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
              {filteredInvites.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  No patient codes found for this filter.
                </div>
              ) : (
                filteredInvites.map((inv) => (
                  <div key={inv.code} className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="font-mono font-bold text-xs bg-slate-100 px-2.5 py-1 rounded-lg text-[#183153] border border-slate-200">
                        {inv.code}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 flex items-center gap-1.5">
                          <span>{inv.patientName || 'Open Patient Code'}</span>
                          {inv.preAssignedPlanName && (
                            <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                              {inv.preAssignedPlanName}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Issued by {inv.dieticianName} • Expires: {inv.expiresAt}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        inv.status === 'valid' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : inv.status === 'used' 
                            ? 'bg-sky-100 text-sky-800' 
                            : 'bg-rose-100 text-rose-800'
                      }`}>
                        {inv.status === 'valid' ? '● Active' : inv.status === 'used' ? '✓ Registered' : '✕ Expired'}
                      </span>

                      {inv.status === 'valid' && (
                        <button
                          type="button"
                          onClick={() => handleCopyCode(inv.code)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                          title="Copy Code"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Perfect Body & Life • Clinical Code Issuance Engine
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
