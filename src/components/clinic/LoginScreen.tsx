import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { 
  Building2, 
  Lock, 
  Mail, 
  Smartphone, 
  ArrowRight, 
  ShieldCheck, 
  Activity, 
  KeyRound, 
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  Sparkles,
  UserCheck
} from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { 
    loginWithPassword, 
    requestOtp, 
    verifyOtp, 
    clinics, 
    users, 
    currentClinic, 
    switchClinic 
  } = useClinic();

  const [authMode, setAuthMode] = useState<'password' | 'otp'>('password');
  const [selectedClinicId, setSelectedClinicId] = useState<string>(currentClinic?.id || clinics[0].id);
  
  // Password Mode States
  const [email, setEmail] = useState('dr.ashmita@perfectbodyandlife.com');
  const [password, setPassword] = useState('Doctor@PBL2026');
  
  // OTP Mode States
  const [mobileOrEmail, setMobileOrEmail] = useState('+91 98201 11223');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [generatedMockOtp, setGeneratedMockOtp] = useState('');
  const [countdown, setCountdown] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle password login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await loginWithPassword(email, password, selectedClinicId);
      if (!res.success) {
        setErrorMessage(res.error || 'Invalid credentials.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP request
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await requestOtp(mobileOrEmail);
      if (res.success) {
        setOtpSent(true);
        setGeneratedMockOtp(res.mockOtp);
        setSuccessMessage(`OTP sent successfully to ${mobileOrEmail}. Demo code: ${res.mockOtp}`);
        setCountdown(60);
      }
    } catch (err: any) {
      setErrorMessage('Failed to send OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await verifyOtp(mobileOrEmail, otp, selectedClinicId);
      if (!res.success) {
        setErrorMessage(res.error || 'Invalid OTP code.');
      }
    } catch (err: any) {
      setErrorMessage('OTP verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick select demo user
  const handleQuickDemoLogin = (userEmail: string, clinicId: string) => {
    setEmail(userEmail);
    setSelectedClinicId(clinicId);
    setPassword('Doctor@PBL2026');
    loginWithPassword(userEmail, 'Doctor@PBL2026', clinicId);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: Clinic Intro & Features */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#183153] flex items-center justify-center text-white shadow-md">
              <Activity className="w-7 h-7 text-[#6BBF59]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#183153] tracking-tight">
                Perfect Body & Life
              </h1>
              <p className="text-xs text-[#5EAB4D] font-semibold tracking-wide uppercase">
                Clinic Management System
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-[#183153] leading-tight">
              Clinical Nutrition & Practice Operations
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Secure, centralized portal for dietitians, physicians, and clinic staff to manage patient dossiers, body composition metrics, and billing.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F8FFF8] border border-[#E4E9E4]">
              <ShieldCheck className="w-5 h-5 text-[#6BBF59] mt-0.5 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-[#183153]">Clinic Isolation & Multi-Branch</h4>
                <p className="text-[11px] text-slate-500">Separated patient rosters, billing ledgers, and doctors per branch.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <KeyRound className="w-5 h-5 text-[#183153] mt-0.5 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-[#183153]">Dual-Factor Authentication (OTP & JWT)</h4>
                <p className="text-[11px] text-slate-500">Secure token authentication with role-based access control.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <Stethoscope className="w-5 h-5 text-[#183153] mt-0.5 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-[#183153]">Automated Health Calculations</h4>
                <p className="text-[11px] text-slate-500">Real-time BMI categories, weight trends, and customized plans.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Card */}
        <div className="lg:col-span-7">
          <div className="medical-card p-6 sm:p-8 bg-white border border-[#E4E9E4] shadow-lg rounded-2xl">
            
            {/* Header with clinic isolation badge */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <span className="text-[11px] font-bold text-[#6BBF59] tracking-wider uppercase">
                  Staff Authentication
                </span>
                <h3 className="text-lg font-bold text-[#183153]">Sign In to Clinic Portal</h3>
              </div>

              {/* Mode Toggle: Password vs OTP */}
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('password');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    authMode === 'password' ? 'bg-white text-[#183153] shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('otp');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    authMode === 'otp' ? 'bg-white text-[#183153] shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  OTP Verification
                </button>
              </div>
            </div>

            {/* Clinic Isolation Dropdown */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-[#183153] mb-1.5 flex items-center justify-between">
                <span>Select Clinic Location</span>
                <span className="text-[10px] text-slate-400 font-normal">Data isolated per branch</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={selectedClinicId}
                  onChange={(e) => setSelectedClinicId(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#183153] font-medium focus:ring-2 focus:ring-[#6BBF59]/30 focus:border-[#6BBF59] outline-none"
                >
                  {(clinics || []).map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Error or Success Notice */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-[#6BBF59]" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* FORM 1: Password Login */}
            {authMode === 'password' && (
              <form onSubmit={handlePasswordLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#183153] mb-1">
                    Staff Email / Doctor ID
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="doctor@perfectbodyandlife.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#183153] focus:ring-2 focus:ring-[#6BBF59]/30 focus:border-[#6BBF59] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-[#183153]">
                      Secure Password
                    </label>
                    <span className="text-[11px] text-slate-400">Default: Doctor@PBL2026</span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#183153] focus:ring-2 focus:ring-[#6BBF59]/30 focus:border-[#6BBF59] outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3 bg-[#183153] hover:bg-[#244673] text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Authenticating JWT...</span>
                  ) : (
                    <>
                      <span>Sign In with Password</span>
                      <ArrowRight className="w-4 h-4 text-[#6BBF59]" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* FORM 2: OTP Login */}
            {authMode === 'otp' && (
              <div className="space-y-4">
                {!otpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#183153] mb-1">
                        Registered Mobile Number / Email
                      </label>
                      <div className="relative">
                        <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={mobileOrEmail}
                          onChange={(e) => setMobileOrEmail(e.target.value)}
                          placeholder="+91 98201 11223"
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#183153] focus:ring-2 focus:ring-[#6BBF59]/30 focus:border-[#6BBF59] outline-none"
                        />
                      </div>
                      <p className="mt-1 text-[11px] text-slate-400">
                        A 6-digit OTP will be dispatched instantly.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-[#6BBF59] hover:bg-[#5EAB4D] text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? <span>Requesting OTP...</span> : <span>Send Secure OTP</span>}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-semibold text-[#183153]">
                          Enter 6-Digit OTP Code
                        </label>
                        <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          Mock Code: {generatedMockOtp || '849201'}
                        </span>
                      </div>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="849201"
                          className="w-full pl-9 pr-3 py-2.5 tracking-widest font-mono text-base bg-slate-50 border border-slate-200 rounded-xl text-[#183153] focus:ring-2 focus:ring-[#6BBF59]/30 focus:border-[#6BBF59] outline-none text-center"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Sent to {mobileOrEmail}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setOtpSent(false);
                          setOtp('');
                        }}
                        className="text-emerald-700 hover:underline font-medium cursor-pointer"
                      >
                        Change Number
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || otp.length < 6}
                      className="w-full py-3 bg-[#183153] hover:bg-[#244673] text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? <span>Verifying OTP...</span> : <span>Verify & Access Clinic Dashboard</span>}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Quick 1-Click Demo Accounts */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Quick Demo Logins (1-Click)
                </span>
                <span className="text-[10px] text-slate-400">Pre-seeded accounts</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(users || []).slice(0, 2).map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleQuickDemoLogin(u.email, u.clinicId)}
                    className="p-2.5 text-left rounded-xl bg-slate-50 hover:bg-[#F8FFF8] border border-slate-200 hover:border-emerald-300 transition-all text-xs cursor-pointer group"
                  >
                    <div className="font-semibold text-[#183153] group-hover:text-emerald-700 truncate">
                      {u.name.split(',')[0]}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate capitalize">
                      {u.role.replace('_', ' ')} • {u.clinicId === 'clinic-1' ? 'Mumbai' : 'Bengaluru'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
