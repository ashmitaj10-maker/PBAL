import React, { useState, useEffect } from 'react';
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
  Check,
  Eye,
  EyeOff,
  Info,
  UserPlus,
  LogIn
} from 'lucide-react';

type PortalMode = 'patient_signup' | 'patient_signin' | 'staff_signin';

export const LoginScreen: React.FC = () => {
  const { 
    loginWithPassword, 
    requestOtp, 
    verifyOtp, 
    clinics, 
    users, 
    patients,
    currentClinic, 
    validatePatientCode,
    registerPatientWithCode,
    loginPatient
  } = useClinic();

  const [portalMode, setPortalMode] = useState<PortalMode>('patient_signup');
  const [authMode, setAuthMode] = useState<'password' | 'otp'>('password');
  const [selectedClinicId, setSelectedClinicId] = useState<string>(currentClinic?.id || clinics[0]?.id || 'clinic-1');

  // =========================================================================
  // STREAMLINED PATIENT SIGN-UP STATE (Strictly 3 Pieces of Information)
  // 1. Email ID or Phone Number
  // 2. Password & Confirm Password
  // 3. Patient Code
  // =========================================================================
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [patientPassword, setPatientPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [patientCode, setPatientCode] = useState('PBL-DR-ASHMITA');
  const [showPassword, setShowPassword] = useState(false);

  const [codeValidationState, setCodeValidationState] = useState<{
    tested: boolean;
    valid: boolean;
    error?: string;
    dietician?: any;
    invite?: any;
  }>({ tested: false, valid: false });

  // =========================================================================
  // PATIENT SIGN-IN STATE
  // =========================================================================
  const [patientLoginIdentifier, setPatientLoginIdentifier] = useState('rohan.kapoor@gmail.com');
  const [patientLoginPassword, setPatientLoginPassword] = useState('Password@123');

  // =========================================================================
  // STAFF SIGN-IN STATE
  // =========================================================================
  const [staffEmail, setStaffEmail] = useState('dr.ashmita@perfectbodyandlife.com');
  const [staffPassword, setStaffPassword] = useState('Doctor@PBL2026');
  const [staffMobileOrEmail, setStaffMobileOrEmail] = useState('+91 98201 11223');
  const [staffOtp, setStaffOtp] = useState('');
  const [staffOtpSent, setStaffOtpSent] = useState(false);
  const [staffGeneratedMockOtp, setStaffGeneratedMockOtp] = useState('');

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isDuplicateUser, setIsDuplicateUser] = useState(false);

  // Validate patient code helper
  const handleValidateCode = (codeToTest?: string) => {
    const code = (codeToTest !== undefined ? codeToTest : patientCode).trim();
    if (!code) {
      setCodeValidationState({
        tested: true,
        valid: false,
        error: 'Please enter the Patient Code provided by your dietician.'
      });
      return;
    }

    const result = validatePatientCode(code);
    if (result.valid && result.invite) {
      setCodeValidationState({
        tested: true,
        valid: true,
        dietician: result.dietician,
        invite: result.invite
      });
      setErrorMessage(null);
    } else {
      setCodeValidationState({
        tested: true,
        valid: false,
        error: result.error || 'Invalid Patient Code.'
      });
    }
  };

  // Test initial default code on mount
  useEffect(() => {
    if (portalMode === 'patient_signup' && patientCode && !codeValidationState.tested) {
      handleValidateCode(patientCode);
    }
  }, [portalMode]);

  // =========================================================================
  // HANDLE PATIENT SIGN-UP (3 FIELDS ONLY)
  // =========================================================================
  const handlePatientSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsDuplicateUser(false);

    // 1. Validate Code
    const validation = validatePatientCode(patientCode);
    if (!validation.valid || !validation.invite) {
      setCodeValidationState({
        tested: true,
        valid: false,
        error: validation.error || 'Please enter a valid Patient Code provided by your dietician.'
      });
      setErrorMessage(validation.error || 'Registration blocked: A valid Patient Code from your dietician is required.');
      return;
    }

    // 2. Validate Email or Phone
    const cleanIdentifier = emailOrPhone.trim();
    if (!cleanIdentifier) {
      setErrorMessage('Please enter your Email ID or Phone Number.');
      return;
    }

    // 3. Validate Password
    if (patientPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (patientPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please ensure both passwords match.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await registerPatientWithCode({
        emailOrPhone: cleanIdentifier,
        password: patientPassword,
        confirmPassword,
        patientCode: validation.invite.code
      });

      if (!res.success) {
        setErrorMessage(res.error || 'Registration failed. Please try again.');
        if (res.error?.toLowerCase().includes('already registered')) {
          setIsDuplicateUser(true);
        }
      } else {
        setSuccessMessage(`Account created successfully! Welcome to Perfect Body & Life, ${res.patient?.name}!`);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Patient Sign-In
  const handlePatientSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await loginPatient(patientLoginIdentifier, patientLoginPassword);
      if (!res.success) {
        setErrorMessage(res.error || 'Sign in failed. Check your email or phone number.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Sign in failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Staff Password Login
  const handleStaffPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await loginWithPassword(staffEmail, staffPassword, selectedClinicId);
      if (!res.success) {
        setErrorMessage(res.error || 'Invalid staff credentials.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Staff login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Staff OTP request
  const handleStaffSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await requestOtp(staffMobileOrEmail);
      if (res.success) {
        setStaffOtpSent(true);
        setStaffGeneratedMockOtp(res.mockOtp);
        setSuccessMessage(`OTP sent to ${staffMobileOrEmail}. Demo verification code: ${res.mockOtp}`);
      }
    } catch (err: any) {
      setErrorMessage('Failed to send OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Staff OTP verification
  const handleStaffVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await verifyOtp(staffMobileOrEmail, staffOtp, selectedClinicId);
      if (!res.success) {
        setErrorMessage(res.error || 'Invalid OTP code.');
      }
    } catch (err: any) {
      setErrorMessage('OTP verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-[#F8FFF8]/60 to-slate-100 flex items-center justify-center py-10 px-4">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Clinic Branding & Info */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-10">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-[#183153] flex items-center justify-center text-white shadow-lg shadow-teal-900/10 border border-teal-800/30">
              <Activity className="w-8 h-8 text-[#6BBF59]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#183153] tracking-tight leading-none">
                Perfect Body & Life
              </h1>
              <p className="text-xs text-[#5EAB4D] font-bold tracking-wider uppercase mt-1">
                Clinical Practice & Nutrition Portal
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#183153] leading-snug">
              Doctor-Supervised Nutrition & Metabolic Health
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Personalized medical nutrition therapy, real-time anthropometric tracking, and continuous habit coaching directly from your assigned dietitian.
            </p>
          </div>

          {/* Value Pillars */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-[#E4E9E4] shadow-xs">
              <ShieldCheck className="w-5 h-5 text-[#6BBF59] mt-0.5 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-[#183153]">Dietician-Linked Registration</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Your Patient Code automatically connects you to your dedicated clinical dietitian.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <Sparkles className="w-5 h-5 text-teal-600 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-[#183153]">Simple 3-Step Setup</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Sign up in seconds with just your Email/Phone, Password, and Dietician Code.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <Stethoscope className="w-5 h-5 text-[#183153] mt-0.5 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-[#183153]">Direct Care Team Connection</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Access your customized meal plans, hydration logs, and in-app chat immediately.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Authentication & Registration Card */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-slate-200 shadow-xl rounded-3xl overflow-hidden">
            
            {/* Top Navigation Tabs */}
            <div className="grid grid-cols-3 bg-slate-100/80 p-1.5 border-b border-slate-200 gap-1 text-center">
              <button
                type="button"
                onClick={() => {
                  setPortalMode('patient_signup');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                  setIsDuplicateUser(false);
                }}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  portalMode === 'patient_signup'
                    ? 'bg-white text-teal-900 shadow-sm border border-teal-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5 text-teal-600" />
                <span>Patient Sign-Up</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPortalMode('patient_signin');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                  setIsDuplicateUser(false);
                }}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  portalMode === 'patient_signin'
                    ? 'bg-white text-teal-900 shadow-sm border border-teal-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-600" />
                <span>Patient Sign-In</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPortalMode('staff_signin');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                  setIsDuplicateUser(false);
                }}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  portalMode === 'staff_signin'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-300'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5 text-[#183153]" />
                <span>Doctor & Staff</span>
              </button>
            </div>

            <div className="p-6 sm:p-8">
              
              {/* Error Notice */}
              {errorMessage && (
                <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start justify-between gap-2.5 animate-in fade-in duration-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                    <div className="leading-relaxed font-medium">{errorMessage}</div>
                  </div>
                  {isDuplicateUser && (
                    <button
                      type="button"
                      onClick={() => {
                        setPatientLoginIdentifier(emailOrPhone);
                        setPortalMode('patient_signin');
                        setErrorMessage(null);
                      }}
                      className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-[11px] shrink-0 cursor-pointer shadow-xs"
                    >
                      Go to Sign-In
                    </button>
                  )}
                </div>
              )}

              {/* Success Notice */}
              {successMessage && (
                <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                  <div className="leading-relaxed font-semibold">{successMessage}</div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* VIEW 1: PATIENT SIGN-UP (STRICTLY 3 PIECES OF INFORMATION)                */}
              {/* 1. Email ID or Phone Number                                               */}
              {/* 2. Password & Confirm Password                                            */}
              {/* 3. Patient Code (with exact helper note below the field)                  */}
              {/* ========================================================================= */}
              {portalMode === 'patient_signup' && (
                <form onSubmit={handlePatientSignUp} className="space-y-5">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800">
                      Patient Registration
                    </span>
                    <h3 className="text-xl font-black text-[#183153] mt-1">
                      Create Your Patient Account
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Register with your Email or Phone, Password, and your Dietician’s Patient Code.
                    </p>
                  </div>

                  {/* FIELD 1: EMAIL ID OR PHONE NUMBER */}
                  <div>
                    <label className="block text-xs font-bold text-[#183153] mb-1.5">
                      Email ID or Phone Number *
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-slate-400">
                        <Mail className="w-3.5 h-3.5" />
                        <span className="text-[10px] text-slate-300">/</span>
                        <Smartphone className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="text"
                        required
                        value={emailOrPhone}
                        onChange={(e) => setEmailOrPhone(e.target.value)}
                        placeholder="Enter email address or mobile phone number"
                        className="w-full pl-14 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#183153] focus:ring-2 focus:ring-teal-500 focus:bg-white outline-none font-medium"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      You can register using either your email address or your mobile number.
                    </p>
                  </div>

                  {/* FIELD 2: PASSWORD & CONFIRM PASSWORD */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-[#183153] mb-1.5">
                        Password *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={patientPassword}
                          onChange={(e) => setPatientPassword(e.target.value)}
                          placeholder="Min 6 characters"
                          className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#183153] focus:ring-2 focus:ring-teal-500 focus:bg-white outline-none font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#183153] mb-1.5">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter password"
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#183153] focus:ring-2 focus:ring-teal-500 focus:bg-white outline-none font-medium"
                        />
                      </div>
                      {patientPassword && confirmPassword && (
                        <span className={`text-[10px] mt-1 block font-medium ${patientPassword === confirmPassword ? 'text-emerald-600' : 'text-rose-500'}`}>
                          {patientPassword === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* FIELD 3: PATIENT CODE & REQUIRED HELPER NOTE */}
                  <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-[#183153]">
                        Patient Code *
                      </label>
                      <span className="text-[10px] text-slate-400">Unique dietician code</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={patientCode}
                          onChange={(e) => {
                            const val = e.target.value.toUpperCase();
                            setPatientCode(val);
                            handleValidateCode(val);
                          }}
                          placeholder="e.g. PBL-DR-ASHMITA"
                          className="w-full pl-9 pr-3 py-2.5 font-mono text-xs font-bold tracking-wider bg-white border border-slate-300 rounded-xl text-[#183153] focus:ring-2 focus:ring-teal-500 outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleValidateCode(patientCode)}
                        className="px-4 py-2.5 bg-[#183153] hover:bg-[#244673] text-white text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap"
                      >
                        Verify Code
                      </button>
                    </div>

                    {/* MANDATORY HELPER NOTE SPECIFIED BY USER */}
                    <p className="text-[11px] text-slate-600 font-medium leading-relaxed pt-0.5">
                      Your Patient Code is provided by your dietician. If you don't have a code, please contact your dietician.
                    </p>

                    {/* Quick Demo Code helper pills */}
                    <div className="pt-1 flex items-center flex-wrap gap-1.5 text-[10px]">
                      <span className="text-slate-400 font-medium">Demo Codes:</span>
                      <button
                        type="button"
                        onClick={() => {
                          setPatientCode('PBL-DR-ASHMITA');
                          handleValidateCode('PBL-DR-ASHMITA');
                        }}
                        className="px-2 py-0.5 rounded-lg bg-teal-100/80 hover:bg-teal-200 text-teal-800 font-mono font-bold cursor-pointer transition-colors"
                      >
                        PBL-DR-ASHMITA (Dr. Ashmita)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPatientCode('PBL-CARE-2026');
                          handleValidateCode('PBL-CARE-2026');
                        }}
                        className="px-2 py-0.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-mono font-bold cursor-pointer transition-colors"
                      >
                        PBL-CARE-2026 (Pooja Sharma)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPatientCode('PBL-1008');
                          handleValidateCode('PBL-1008');
                        }}
                        className="px-2 py-0.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-mono font-bold cursor-pointer transition-colors"
                      >
                        PBL-1008
                      </button>
                    </div>

                    {/* LIVE VALIDATION FEEDBACK */}
                    {codeValidationState.tested && (
                      <div className="pt-1 animate-in fade-in duration-200">
                        {codeValidationState.valid ? (
                          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 flex items-start gap-2.5">
                            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                            <div className="text-xs">
                              <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                                <span>Verified & Active Patient Code</span>
                                <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded font-mono font-bold">
                                  {codeValidationState.invite?.code}
                                </span>
                              </div>
                              <p className="text-emerald-800 text-[11px] mt-0.5 leading-snug">
                                Linked to <strong>{codeValidationState.dietician?.name || codeValidationState.invite?.dieticianName}</strong> ({codeValidationState.dietician?.roleTitle || 'Clinical Dietitian'}) at Perfect Body & Life.
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                            <div className="leading-snug">
                              <div className="font-bold text-rose-900">Code Validation Failed</div>
                              <p className="text-[11px] mt-0.5">{codeValidationState.error}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button
                    type="submit"
                    disabled={isLoading || !codeValidationState.valid}
                    className="w-full py-3.5 bg-gradient-to-r from-teal-700 via-teal-800 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white text-xs font-bold rounded-2xl shadow-lg shadow-teal-900/10 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span>Creating your patient account...</span>
                    ) : (
                      <>
                        <span>Create Account & Go to Dashboard</span>
                        <ArrowRight className="w-4 h-4 text-emerald-300" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-1">
                    <p className="text-[11px] text-slate-500">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setPortalMode('patient_signin');
                          setErrorMessage(null);
                        }}
                        className="text-teal-700 font-bold hover:underline cursor-pointer"
                      >
                        Sign In to Patient Portal
                      </button>
                    </p>
                  </div>
                </form>
              )}

              {/* ========================================================================= */}
              {/* VIEW 2: PATIENT SIGN-IN (EXISTING PATIENT PORTAL LOGIN)                   */}
              {/* ========================================================================= */}
              {portalMode === 'patient_signin' && (
                <form onSubmit={handlePatientSignIn} className="space-y-4">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                      Patient Portal
                    </span>
                    <h3 className="text-xl font-black text-[#183153] mt-1">
                      Patient Sign-In
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Access your prescribed meal plans, hydration logs, and doctor chat.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#183153] mb-1.5">
                      Email ID, Phone Number, or Patient Code
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={patientLoginIdentifier}
                        onChange={(e) => setPatientLoginIdentifier(e.target.value)}
                        placeholder="e.g. rohan.kapoor@gmail.com or PBL-1001"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#183153] focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-[#183153]">
                        Password
                      </label>
                      <span className="text-[11px] text-slate-400">Demo: Any password</span>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={patientLoginPassword}
                        onChange={(e) => setPatientLoginPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#183153] focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none font-medium"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-bold rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? <span>Signing In...</span> : (
                      <>
                        <span>Sign In to Patient Portal</span>
                        <ArrowRight className="w-4 h-4 text-emerald-200" />
                      </>
                    )}
                  </button>

                  {/* 1-Click Demo Accounts */}
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                      1-Click Demo Patient Accounts:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {(patients || []).slice(0, 2).map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setPatientLoginIdentifier(p.email);
                            loginPatient(p.email);
                          }}
                          className="p-2.5 text-left rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition-all text-xs cursor-pointer"
                        >
                          <div className="font-bold text-[#183153] truncate">{p.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{p.patientCode} • {p.foodPreference}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </form>
              )}

              {/* ========================================================================= */}
              {/* VIEW 3: STAFF / DOCTOR SIGN-IN                                            */}
              {/* ========================================================================= */}
              {portalMode === 'staff_signin' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-800">
                        Clinical Administration
                      </span>
                      <h3 className="text-xl font-black text-[#183153] mt-1">
                        Doctor & Staff Sign-In
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Access patient roster, AI meal planner, and billing console.
                      </p>
                    </div>

                    {/* Mode Toggle: Password vs OTP */}
                    <div className="flex bg-slate-100 p-1 rounded-xl shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('password');
                          setErrorMessage(null);
                        }}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
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
                        }}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                          authMode === 'otp' ? 'bg-white text-[#183153] shadow-xs' : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        OTP
                      </button>
                    </div>
                  </div>

                  {/* FORM: Staff Password */}
                  {authMode === 'password' && (
                    <form onSubmit={handleStaffPasswordLogin} className="space-y-3.5">
                      <div>
                        <label className="block text-xs font-bold text-[#183153] mb-1">
                          Staff Email / Doctor ID
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            required
                            value={staffEmail}
                            onChange={(e) => setStaffEmail(e.target.value)}
                            placeholder="dr.ashmita@perfectbodyandlife.com"
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#183153] focus:ring-2 focus:ring-teal-500 focus:bg-white outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-bold text-[#183153]">
                            Secure Password
                          </label>
                          <span className="text-[11px] text-slate-400">Default: Doctor@PBL2026</span>
                        </div>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="password"
                            required
                            value={staffPassword}
                            onChange={(e) => setStaffPassword(e.target.value)}
                            placeholder="••••••••••••"
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#183153] focus:ring-2 focus:ring-teal-500 focus:bg-white outline-none"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-2 py-3 bg-[#183153] hover:bg-[#244673] text-white text-xs font-bold rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                      >
                        {isLoading ? <span>Authenticating...</span> : (
                          <>
                            <span>Sign In to Clinical Workspace</span>
                            <ArrowRight className="w-4 h-4 text-[#6BBF59]" />
                          </>
                        )}
                      </button>
                    </form>
                  )}

                  {/* FORM: Staff OTP */}
                  {authMode === 'otp' && (
                    <div className="space-y-3.5">
                      {!staffOtpSent ? (
                        <form onSubmit={handleStaffSendOtp} className="space-y-3.5">
                          <div>
                            <label className="block text-xs font-bold text-[#183153] mb-1">
                              Registered Staff Mobile Number
                            </label>
                            <div className="relative">
                              <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                              <input
                                type="text"
                                required
                                value={staffMobileOrEmail}
                                onChange={(e) => setStaffMobileOrEmail(e.target.value)}
                                placeholder="+91 98201 11223"
                                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#183153] focus:ring-2 focus:ring-teal-500 outline-none"
                              />
                            </div>
                          </div>

                          <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-[#6BBF59] hover:bg-[#5EAB4D] text-white text-xs font-bold rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                          >
                            {isLoading ? <span>Dispatching OTP...</span> : <span>Send 6-Digit OTP</span>}
                          </button>
                        </form>
                      ) : (
                        <form onSubmit={handleStaffVerifyOtp} className="space-y-3.5">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="block text-xs font-bold text-[#183153]">Enter OTP Code</label>
                              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                                Mock Code: {staffGeneratedMockOtp || '849201'}
                              </span>
                            </div>
                            <input
                              type="text"
                              maxLength={6}
                              value={staffOtp}
                              onChange={(e) => setStaffOtp(e.target.value)}
                              placeholder="849201"
                              className="w-full py-2 tracking-widest font-mono text-base bg-slate-50 border border-slate-200 rounded-xl text-[#183153] text-center font-bold outline-none"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={isLoading || staffOtp.length < 6}
                            className="w-full py-3 bg-[#183153] hover:bg-[#244673] text-white text-xs font-bold rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                          >
                            {isLoading ? <span>Verifying...</span> : <span>Verify & Access Dashboard</span>}
                          </button>
                        </form>
                      )}
                    </div>
                  )}

                  {/* 1-Click Quick Staff Logins */}
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                      1-Click Doctor & Staff Logins:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {(users || []).slice(0, 2).map((u) => (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => {
                            setStaffEmail(u.email);
                            loginWithPassword(u.email, 'Doctor@PBL2026', u.clinicId);
                          }}
                          className="p-2 text-left rounded-xl bg-slate-50 hover:bg-[#F8FFF8] border border-slate-200 hover:border-emerald-300 transition-all text-xs cursor-pointer group"
                        >
                          <div className="font-bold text-[#183153] group-hover:text-emerald-700 truncate">
                            {u.name.split(',')[0]}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate capitalize">
                            {u.roleTitle || u.role.replace('_', ' ')}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
