import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { 
  Users, 
  IndianRupee, 
  AlertTriangle, 
  RefreshCw, 
  TrendingUp, 
  UserPlus, 
  CreditCard, 
  ArrowUpRight, 
  Activity, 
  CheckCircle2, 
  Calendar, 
  FileText, 
  Clock, 
  Scale,
  Sparkles,
  ChevronRight,
  Receipt,
  Download,
  MessageSquare,
  Bell,
  Camera,
  Bot,
  PieChart as PieChartIcon,
  TrendingDown,
  ArrowRight,
  PhoneCall,
  KeyRound
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { formatDate } from '../../utils/dateUtils';
import { IssuePatientCodeModal } from './IssuePatientCodeModal';

export const DoctorDashboard: React.FC = () => {
  const { 
    currentClinic, 
    currentUser, 
    patients, 
    payments, 
    activities, 
    getDashboardKpis, 
    navigateTo, 
    setIsRegisterModalOpen, 
    setIsPaymentModalOpen,
    setIsCreatePlanModalOpen,
    weightUpdatesDueList,
    expiringPlansList,
    goalDistributionStats,
    getAllConversationsSummary,
    triggerTestReminderNotification
  } = useClinic();

  const kpis = getDashboardKpis();
  const conversations = getAllConversationsSummary();
  const unreadConversations = conversations.filter(c => c.unreadCount > 0);
  const [isIssueCodeModalOpen, setIsIssueCodeModalOpen] = useState(false);

  // Financial Chart Data
  const revenueChartData = [
    { month: 'Apr', revenue: 48000, collections: 42000, patients: 4 },
    { month: 'May', revenue: 64500, collections: 58000, patients: 5 },
    { month: 'Jun', revenue: 76000, collections: 72000, patients: 6 },
    { month: 'Jul', revenue: 91000, collections: 86500, patients: 7 },
    { month: 'Aug (Current)', revenue: 112000, collections: kpis.totalRevenue, patients: patients.length },
  ];

  // Patients due for renewal
  const renewalPatients = patients.filter(p => p.status === 'pending_renewal' || new Date(p.renewalDate) <= new Date(Date.now() + 15 * 86400000));

  // Goal Distribution Colors
  const GOAL_COLORS = ['#0d9488', '#0284c7', '#8b5cf6', '#f59e0b', '#10b981'];

  // Export clinic roster to CSV
  const handleExportCSV = () => {
    const headers = ['Code', 'Name', 'Mobile', 'Email', 'Age', 'Gender', 'Current Weight (kg)', 'Starting Weight (kg)', 'Food Preference', 'Plan', 'Status', 'Renewal Date'];
    const rows = (patients || []).map(p => [
      p.patientCode || '',
      `"${p.name || 'Patient'}"`,
      p.mobile || '',
      p.email || '',
      p.age || '',
      p.gender || '',
      p.currentWeightKg || '',
      p.startingWeightKg || '',
      p.foodPreference || '',
      `"${p.assignedPlanName || 'Standard'}"`,
      p.status || '',
      p.renewalDate ? formatDate(p.renewalDate) : ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PBL_Clinic_Roster_${currentClinic?.code || 'PBL'}_${formatDate(new Date())}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      
      {/* Welcome & Clinical Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-teal-900 via-slate-900 to-emerald-950 p-6 sm:p-8 rounded-3xl text-white shadow-lg border border-teal-800/40">
        <div>
          <div className="flex items-center gap-2 text-teal-300 text-xs font-bold uppercase tracking-wider mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            Active Clinical Practice Management • Phase 3 Live
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome, {currentUser?.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
            {currentClinic?.name} • Multi-patient engagement engine, in-app chat sync, progress analytics, and AI Copilot active.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => navigateTo('ai_copilot')}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 border border-teal-400/30 text-xs font-bold transition-all shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-teal-300" />
            <span>AI Copilot</span>
          </button>

          <button
            onClick={() => navigateTo('patient_chat')}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat ({kpis.unreadChatCount || 0})</span>
          </button>

          <button
            onClick={() => setIsIssueCodeModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <KeyRound className="w-4 h-4 text-teal-200" />
            <span>Issue Patient Code</span>
          </button>

          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-slate-950 hover:bg-slate-100 text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-teal-700" />
            <span>Register Patient</span>
          </button>
        </div>
      </div>

      {/* PHASE 3 QUICK SHORTCUTS STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <button
          onClick={() => navigateTo('progress_dashboard')}
          className="p-3.5 rounded-2xl bg-white hover:bg-teal-50/60 border border-slate-200 text-left transition-all group shadow-xs flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-110 transition-transform">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-xs text-slate-900">Progress Dashboard</div>
            <div className="text-[10px] text-slate-500">Weight & Circumferences</div>
          </div>
        </button>

        <button
          onClick={() => navigateTo('progress_photos')}
          className="p-3.5 rounded-2xl bg-white hover:bg-teal-50/60 border border-slate-200 text-left transition-all group shadow-xs flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-xs text-slate-900">Progress Photos</div>
            <div className="text-[10px] text-slate-500">Before / After Studio</div>
          </div>
        </button>

        <button
          onClick={() => navigateTo('patient_chat')}
          className="p-3.5 rounded-2xl bg-white hover:bg-teal-50/60 border border-slate-200 text-left transition-all group shadow-xs flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform relative">
            <MessageSquare className="w-5 h-5" />
            {kpis.unreadChatCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                {kpis.unreadChatCount}
              </span>
            )}
          </div>
          <div>
            <div className="font-bold text-xs text-slate-900">In-App Chat</div>
            <div className="text-[10px] text-slate-500">Doctor & Assistant</div>
          </div>
        </button>

        <button
          onClick={() => navigateTo('reminder_settings')}
          className="p-3.5 rounded-2xl bg-white hover:bg-teal-50/60 border border-slate-200 text-left transition-all group shadow-xs flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-xs text-slate-900">Reminder Settings</div>
            <div className="text-[10px] text-slate-500">Push, WhatsApp & SMS</div>
          </div>
        </button>

        <button
          onClick={() => navigateTo('ai_copilot')}
          className="p-3.5 rounded-2xl bg-white hover:bg-teal-50/60 border border-slate-200 text-left transition-all group shadow-xs flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-xs text-slate-900">AI Doctor Copilot</div>
            <div className="text-[10px] text-slate-500">Food Swaps & Gaps</div>
          </div>
        </button>
      </div>

      {/* 5 PRIMARY DASHBOARD KPIS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        
        {/* KPI 1: Active Patients */}
        <div 
          onClick={() => navigateTo('patients')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:border-teal-400 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Active Patients</span>
            <Users className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{kpis.activePatients} <span className="text-xs text-slate-500 font-normal">/ {kpis.totalPatients}</span></div>
          <div className="text-xs font-bold text-emerald-600 mt-1 flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" /> Avg -{kpis.avgWeightLossKg} kg loss
          </div>
        </div>

        {/* KPI 2: Total Revenue */}
        <div 
          onClick={() => navigateTo('payments')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:border-teal-400 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Revenue Collected</span>
            <IndianRupee className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {currentClinic?.currencySymbol}{(kpis?.totalRevenue || 0).toLocaleString()}
          </div>
          <div className="text-xs font-bold text-blue-600 mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> {payments.length} receipts
          </div>
        </div>

        {/* KPI 3: Today's Chats & Unread */}
        <div 
          onClick={() => navigateTo('patient_chat')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:border-teal-400 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Today's Chats</span>
            <MessageSquare className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{conversations.length}</div>
          <div className={`text-xs font-bold mt-1 flex items-center gap-1 ${
            kpis.unreadChatCount > 0 ? 'text-rose-600' : 'text-emerald-600'
          }`}>
            {kpis.unreadChatCount > 0 ? `${kpis.unreadChatCount} unread messages` : 'All caught up ✓'}
          </div>
        </div>

        {/* KPI 4: Weight Updates Due */}
        <div 
          onClick={() => navigateTo('progress_dashboard')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:border-teal-400 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Weigh-ins Due</span>
            <Scale className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{kpis.dueWeighInsCount}</div>
          <div className="text-xs font-bold text-amber-700 mt-1">
            Nudge required today
          </div>
        </div>

        {/* KPI 5: Plan Expirations */}
        <div 
          onClick={() => navigateTo('patients')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:border-teal-400 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Expiring Plans</span>
            <RefreshCw className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{kpis.expiringPlansCount}</div>
          <div className="text-xs font-bold text-purple-700 mt-1">
            Renewal pipeline
          </div>
        </div>

      </div>

      {/* DIET PLAN START DATE REMINDERS & PREPARATION SCHEDULE */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center shadow-2xs">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Upcoming Diet Plans & Start Date Reminders</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-200">
                  Dietitian Workflow
                </span>
                {kpis.dietitianReminderCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse flex items-center gap-1">
                    <Bell className="w-3 h-3 text-amber-700" />
                    {kpis.dietitianReminderCount} Action Due
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Automatic 1-day advance reminder before each patient's diet plan begins. Keep upcoming 7-day cycles ready.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateTo('ai_meal_builder')}
              className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Meal Builder</span>
            </button>
          </div>
        </div>

        {/* Reminders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(kpis.upcomingDietPlanReminders || []).map((item) => (
            <div
              key={item.id}
              onClick={() => navigateTo('ai_meal_builder', { patientId: item.patientId, planId: item.planId })}
              className={`p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md flex flex-col justify-between gap-3 ${
                item.actionRequired
                  ? 'bg-amber-50/50 border-amber-200 hover:border-amber-300 ring-1 ring-amber-200/50'
                  : 'bg-slate-50/60 border-slate-200 hover:border-teal-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 truncate">
                    <div className="w-7 h-7 rounded-full bg-teal-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {(item.patientName || 'PT').slice(0, 2).toUpperCase()}
                    </div>
                    <span className="font-bold text-xs text-slate-900 truncate">
                      {item.patientName}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase shrink-0 ${
                    item.actionRequired
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}>
                    {item.actionRequired ? '⚠️ Action Required' : '✓ Plan Ready'}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-snug">
                  {item.message}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Start: <strong className="font-mono text-teal-800">{formatDate(item.planStartDate)}</strong></span>
                </div>
                <span className="text-teal-700 font-bold text-xs hover:underline flex items-center gap-0.5">
                  Open Plan <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PHASE 3 ENHANCEMENT ROW: TODAY'S CHATS + WEIGHT UPDATES DUE + GOAL DISTRIBUTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 4 Cols: Today's WhatsApp Active Chats */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Today's Patient Chats</h3>
                  <p className="text-[11px] text-slate-500">Live doctor, assistant & patient chats</p>
                </div>
              </div>
              <button
                onClick={() => navigateTo('patient_chat')}
                className="text-xs font-bold text-teal-700 hover:underline"
              >
                Open Studio
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {(conversations || []).slice(0, 4).map((conv) => (
                <div 
                  key={conv.patientId}
                  onClick={() => navigateTo('patient_chat', { patientId: conv.patientId })}
                  className="py-3 flex items-start gap-3 hover:bg-slate-50 rounded-xl px-2 cursor-pointer transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-teal-700 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {(conv.patientName || 'Patient').split(' ').filter(Boolean).map(n => n[0] || '').join('').slice(0, 2) || 'PT'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 truncate">{conv.patientName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{conv.lastMessageTimestamp}</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{conv.lastMessage}</p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigateTo('patient_chat')}
            className="w-full py-2 bg-slate-50 hover:bg-teal-50 text-teal-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
          >
            Open Live In-App Chat ➔
          </button>
        </div>

        {/* Middle 4 Cols: Weight Updates Due (Nudge Protocol) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Weight Updates Due</h3>
                  <p className="text-[11px] text-slate-500">Overdue morning fasting weigh-in check-ins</p>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                {weightUpdatesDueList.length} Due
              </span>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {(weightUpdatesDueList || []).map((item) => (
                <div key={item.patientId} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{item.patientName}</div>
                    <div className="text-[11px] text-slate-500">
                      Last: {item.lastRecordedWeightKg}kg ({formatDate(item.lastLoggedDate)})
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      +{item.daysOverdue}d overdue
                    </span>

                    <button
                      onClick={() => navigateTo('patient_chat', { patientId: item.patientId })}
                      className="px-2.5 py-1 text-[11px] font-bold bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-lg border border-teal-200 transition-colors"
                      title="Nudge via WhatsApp"
                    >
                      Nudge
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigateTo('progress_dashboard')}
            className="w-full py-2 bg-slate-50 hover:bg-teal-50 text-teal-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
          >
            Review Anthropometrics & Curves ➔
          </button>
        </div>

        {/* Right 4 Cols: Goal Distribution Pie Breakdown */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <PieChartIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Clinical Goal Distribution</h3>
                  <p className="text-[11px] text-slate-500">Breakdown of patient cohorts</p>
                </div>
              </div>
            </div>

            <div className="h-40 w-full flex items-center justify-center mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={goalDistributionStats || []}
                    dataKey="count"
                    nameKey="goal"
                    cx="50%"
                    cy="50%"
                    innerRadius={38}
                    outerRadius={65}
                    paddingAngle={3}
                  >
                    {(goalDistributionStats || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={GOAL_COLORS[index % GOAL_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(val: any, name: any) => [`${val} Patients (${(goalDistributionStats || []).find(g => g.goal === name)?.percentage || 0}%)`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Goal Badges */}
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
              {(goalDistributionStats || []).map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: GOAL_COLORS[idx % GOAL_COLORS.length] }} />
                  <span className="truncate">{item.goal}:</span>
                  <span className="font-bold">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>{patients.length} Total Patients Enrolled</span>
            <span className="font-bold text-teal-700">100% Active</span>
          </div>
        </div>

      </div>

      {/* FINANCIAL CHARTS & RENEWAL PIPELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Revenue Performance Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Revenue & Billing Collection Trajectory</h3>
              <p className="text-xs text-slate-500">Gross invoiced clinic billing vs net settled collections</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1 text-slate-700">
                <span className="w-3 h-3 rounded-full bg-slate-900 inline-block" /> Billed
              </span>
              <span className="flex items-center gap-1 text-teal-700">
                <span className="w-3 h-3 rounded-full bg-teal-600 inline-block" /> Collected
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCol" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, '']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', borderColor: '#E2E8F0', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#0f172a" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" name="Billed Revenue" />
                <Area type="monotone" dataKey="collections" stroke="#0d9488" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCol)" name="Collected" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expiring Plans & Renewals Pipeline (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Plan Expiry & Renewal Pipeline</h3>
                  <p className="text-xs text-slate-500">Upcoming clinical protocol conclusions</p>
                </div>
              </div>
              <button
                onClick={() => navigateTo('patients')}
                className="text-xs font-bold text-purple-700 hover:underline"
              >
                View Roster
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-3">
              {(expiringPlansList || []).map((exp) => (
                <div key={exp.patientId} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{exp.patientName}</div>
                    <div className="text-[11px] text-slate-500">
                      {exp.planName} • Expiring in {exp.daysRemaining} days ({formatDate(exp.expiryDate)})
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">₹{(exp.renewalAmount || 12000).toLocaleString()}</span>
                    <button
                      onClick={() => navigateTo('patient_profile', { patientId: exp.patientId })}
                      className="px-2.5 py-1 text-[11px] font-bold bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-lg border border-purple-200 transition-colors"
                    >
                      Renew
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleExportCSV}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            Download Complete Audit Roster (CSV)
          </button>
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
