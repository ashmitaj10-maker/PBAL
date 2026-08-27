import React, { useState, useEffect, useRef } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { 
  MessageSquare, 
  Send, 
  Paperclip, 
  Image as ImageIcon, 
  FileText, 
  Dumbbell, 
  Sparkles, 
  Search, 
  Check, 
  CheckCheck, 
  User, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Bot,
  Stethoscope,
  Utensils,
  Flame,
  Clock,
  Heart
} from 'lucide-react';
import { ChatMessage } from '../../types/clinic';

const DOCTOR_CANNED_REPLIES = [
  'Great plate balance! Lean protein and high fiber well executed. 🥗',
  'Please hydrate with 500ml of room-temp water before this meal. 💧',
  'Ensure dinner is finished by 8:00 PM for optimal circadian insulin sensitivity. 🌙',
  'Don’t forget your weekly morning fasting weigh-in today! ⚖️',
  'Light 15-min post-meal walk is recommended to flatten glucose spike. 🚶'
];

const PATIENT_QUICK_REPLIES = [
  'Can I have fruit after dinner? 🍎',
  'What fruits would you suggest? 🍓',
  'Quick question about afternoon snack options around 4 PM 🍵',
  'Fasting weight is down another 300g this morning! ⚖️',
  'Completed today’s prescribed 35-min metabolic routine! 🏃‍♀️'
];

export const PatientChatView: React.FC = () => {
  const { 
    selectedPatient, 
    patients, 
    setSelectedPatientId, 
    getPatientChatMessages, 
    sendChatMessage, 
    markChatAsRead, 
    getAllConversationsSummary,
    generateCopilotMotivation,
    navigateTo,
    isPatientSession,
    loggedInPatient,
    currentUser,
    users
  } = useClinic();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'unread'>('all');
  const [inputText, setInputText] = useState('');
  const [senderRole, setSenderRole] = useState<'doctor' | 'patient'>(isPatientSession ? 'patient' : 'doctor');
  const [isCopilotPromptOpen, setIsCopilotPromptOpen] = useState(false);
  const [isAttachOpen, setIsAttachOpen] = useState(false);
  const [isDietitianTyping, setIsDietitianTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentPatient = isPatientSession 
    ? (loggedInPatient || selectedPatient || patients[0])
    : (selectedPatient || patients[0]);

  const assignedDietitian = (users || []).find(u => u.id === currentPatient?.assignedDoctorId) || {
    name: 'Dr. Ashmita Joshi',
    roleTitle: 'Chief Clinical Dietitian',
    specialization: 'Metabolic Health & Clinical Nutrition'
  };

  const conversations = getAllConversationsSummary();
  const currentMessages = currentPatient ? getPatientChatMessages(currentPatient.id) : [];

  // Filter conversations for Doctor view
  const filteredConversations = (conversations || []).filter(c => {
    if (filterTab === 'unread' && c.unreadCount === 0) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (c.patientName || '').toLowerCase().includes(q) || (c.patientCode || '').toLowerCase().includes(q);
    }
    return true;
  });

  // Mark as read when patient conversation is active
  useEffect(() => {
    if (currentPatient) {
      markChatAsRead(currentPatient.id);
    }
  }, [currentPatient?.id]);

  // Keep senderRole synced with session
  useEffect(() => {
    setSenderRole(isPatientSession ? 'patient' : 'doctor');
  }, [isPatientSession]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages.length, isDietitianTyping]);

  // Simulated live clinical reply for patient inquiries
  const triggerSimulatedDietitianResponse = (patientQuestion: string, patientId: string) => {
    const q = (patientQuestion || '').toLowerCase();
    let replyText = '';

    if (q.includes('fruit') && (q.includes('after dinner') || q.includes('night') || q.includes('late'))) {
      replyText = `Yes, you can have fruit after dinner! 🍓 I'd recommend low-glycemic fruits such as fresh strawberries, blueberries, or a small green apple with a pinch of cinnamon. Avoid high-sugar fruits like mangoes, chickoo, or grapes late in the evening to prevent insulin spikes before sleep.`;
    } else if (q.includes('fruit') && (q.includes('suggest') || q.includes('what') || q.includes('which'))) {
      replyText = `The best metabolic fruits for your protocol are: 1) Berries (strawberries, blueberries), 2) Papaya (rich in digestive papain), 3) Kiwi, and 4) Guava. They offer high polyphenol density and prebiotic fiber with minimal glucose impact. 🍎`;
    } else if (q.includes('snack') || q.includes('4 pm') || q.includes('afternoon')) {
      replyText = `For your 4 PM snack window, here are 3 great options:\n1) Air-fried spiced makhana (foxnuts) with green tea 🍵\n2) 25g roasted chana or edamame crunch\n3) Cucumber slices with 2 tbsp fresh hummus. This keeps your satiety high without an energy crash!`;
    } else if (q.includes('weight') || q.includes('300g') || q.includes('scale') || q.includes('down')) {
      replyText = `Fantastic progress! 🎉 Dropping weight steadily while keeping your energy up shows your body is tapping into stored visceral fat. Continue logging your 2.5L water today!`;
    } else if (q.includes('routine') || q.includes('workout') || q.includes('exercise') || q.includes('walk')) {
      replyText = `Excellent effort on completing your movement session! 💪 Make sure to rehydrate with 500ml water and ensure your next meal contains at least 25g of protein for muscle recovery.`;
    } else {
      replyText = `Thank you for the update! I have reviewed this and noted it in your clinical chart. Keep up the steady consistency, and let me know if you need any adjustments to your meal plan! 🌟`;
    }

    setIsDietitianTyping(true);
    setTimeout(() => {
      setIsDietitianTyping(false);
      sendChatMessage({
        patientId,
        content: replyText,
        type: 'text',
        sender: 'doctor'
      });
    }, 1200);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const textToSend = inputText.trim();
    if (!textToSend || !currentPatient) return;

    const activeSender = isPatientSession ? 'patient' : senderRole;

    sendChatMessage({
      patientId: currentPatient.id,
      content: textToSend,
      type: 'text',
      sender: activeSender
    });

    setInputText('');

    if (isPatientSession) {
      triggerSimulatedDietitianResponse(textToSend, currentPatient.id);
    }

    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleSendCanned = (text: string) => {
    if (!currentPatient) return;
    const activeSender = isPatientSession ? 'patient' : senderRole;

    sendChatMessage({
      patientId: currentPatient.id,
      content: text,
      type: 'text',
      sender: activeSender
    });

    if (isPatientSession) {
      triggerSimulatedDietitianResponse(text, currentPatient.id);
    }

    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleSendCopilotMotivation = (tone: 'celebratory' | 'empathetic' | 'strict_discipline') => {
    if (!currentPatient || isPatientSession) return;
    const msg = generateCopilotMotivation(currentPatient.id, tone);
    sendChatMessage({
      patientId: currentPatient.id,
      content: msg,
      type: 'text',
      sender: 'doctor'
    });
    setIsCopilotPromptOpen(false);
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleSendMedia = (type: 'photo' | 'pdf' | 'exercise_plan') => {
    if (!currentPatient) return;
    setIsAttachOpen(false);

    if (type === 'photo') {
      sendChatMessage({
        patientId: currentPatient.id,
        content: isPatientSession 
          ? 'Here is a photo of my lunch plate for review!' 
          : 'Clinical Assessment & Meal Plate Review.',
        type: 'photo',
        sender: isPatientSession ? 'patient' : 'doctor',
        mediaUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600'
      });
    } else if (type === 'pdf') {
      sendChatMessage({
        patientId: currentPatient.id,
        content: 'Here is your official 14-Day High-Protein Metabolic Meal Plan (PDF).',
        type: 'pdf',
        sender: 'doctor',
        mediaUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        mediaMeta: { fileName: 'Metabolic_Plan_V3.pdf', fileSize: '1.8 MB' }
      });
    } else if (type === 'exercise_plan') {
      sendChatMessage({
        patientId: currentPatient.id,
        content: 'Prescribed Exercise Routine: 4x Weekly Metabolic Resistance Circuit (35 mins).',
        type: 'exercise_plan',
        sender: 'doctor',
        mediaMeta: { planTitle: 'Metabolic Resistance Routine', days: 4, durationMins: 35 }
      });
    }
  };

  // Helper to determine whether a message was sent by the CURRENT viewing user
  const isMessageFromCurrentUser = (msg: ChatMessage) => {
    if (isPatientSession) {
      return msg.sender === 'patient';
    }
    return msg.sender === 'doctor';
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden h-[calc(100vh-140px)] min-h-[620px] flex flex-col md:flex-row animate-in fade-in duration-200">
      
      {/* =========================================================================
          LEFT SIDEBAR: CONVERSATIONS LIST (DOCTOR VIEW ONLY)
          ========================================================================= */}
      {!isPatientSession && (
        <div className="w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col bg-slate-50/70 shrink-0">
          
          {/* Sidebar Header */}
          <div className="p-4 border-b border-slate-200 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-teal-600" />
                Patient Conversations
              </h2>
              <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                Doctor Inbox
              </span>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search patients by name or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 transition-all"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => setFilterTab('all')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all text-center ${
                  filterTab === 'all' ? 'bg-teal-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All ({conversations.length})
              </button>
              <button
                onClick={() => setFilterTab('unread')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all text-center flex items-center justify-center gap-1 ${
                  filterTab === 'unread' ? 'bg-teal-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Unread
                {conversations.filter(c => c.unreadCount > 0).length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center">
                    {conversations.filter(c => c.unreadCount > 0).length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {(filteredConversations || []).map((conv) => {
              const isSelected = conv.patientId === currentPatient?.id;
              return (
                <div
                  key={conv.patientId}
                  onClick={() => setSelectedPatientId(conv.patientId)}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer transition-all ${
                    isSelected ? 'bg-teal-50/80 border-l-4 border-l-teal-600' : 'hover:bg-white'
                  }`}
                >
                  {/* Avatar with Online indicator */}
                  <div className="relative shrink-0 mt-0.5">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-700 to-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      {(conv.patientName || '').split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2) || 'PT'}
                    </div>
                    {conv.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{conv.patientName}</h4>
                      <span className="text-[10px] text-slate-400 shrink-0 font-mono">{conv.lastMessageTimestamp}</span>
                    </div>

                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs text-slate-500 truncate leading-relaxed">
                        {conv.lastMessage}
                      </p>
                      {conv.unreadCount > 0 && (
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>

                    <span className="inline-block text-[10px] text-slate-400 font-mono mt-0.5">
                      {conv.patientCode}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* =========================================================================
          RIGHT PANE: TWO-WAY CHAT CANVAS (ADAPTED BY ROLE)
          ========================================================================= */}
      <div className="flex-1 flex flex-col bg-[#efeae2]/30 relative overflow-hidden">
        
        {/* Chat Top Header */}
        <div className="p-3.5 sm:p-4 bg-white border-b border-slate-200 flex items-center justify-between shadow-xs z-10">
          
          {isPatientSession ? (
            /* Patient View Header: Talking to Dietitian */
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-700 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                  👩‍⚕️
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full animate-pulse" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-slate-900">
                    {assignedDietitian?.name || 'Dr. Ashmita Joshi'}
                  </h3>
                  <span className="text-[10px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full font-bold">
                    Clinical Dietitian
                  </span>
                </div>
                <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Online • Perfect Body & Life Clinical Team
                </p>
              </div>
            </div>
          ) : (
            /* Doctor View Header: Talking to Patient */
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-700 to-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                  {currentPatient?.name ? currentPatient.name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2) : 'PT'}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">{currentPatient?.name || 'Select a Patient'}</h3>
                  {currentPatient?.patientCode && (
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono font-bold">
                      {currentPatient.patientCode}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Online in In-App Chat • Goal: {currentPatient?.primaryGoals?.[0] || 'Metabolic Health'}
                </p>
              </div>
            </div>
          )}

          {/* Quick Context Action Links */}
          <div className="flex items-center gap-2">
            {isPatientSession ? (
              <>
                <button
                  onClick={() => navigateTo('patient_portal')}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  <Utensils className="w-3.5 h-3.5 text-teal-600" />
                  My Diet Plan
                </button>

                <button
                  onClick={() => navigateTo('ai_copilot')}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  Craving Search
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigateTo('patient_profile', { patientId: currentPatient?.id })}
                  className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-teal-600" />
                  Profile
                </button>

                <button
                  onClick={() => navigateTo('ai_copilot', { patientId: currentPatient?.id })}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  Doctor AI Copilot
                </button>
              </>
            )}
          </div>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* Encryption / HIPAA clinical security notice */}
          <div className="flex justify-center">
            <div className="bg-amber-50 border border-amber-200/80 rounded-xl px-3.5 py-1.5 text-[11px] text-amber-900 flex items-center gap-1.5 shadow-2xs text-center max-w-md">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                {isPatientSession 
                  ? 'Your messages are private and reviewed directly by Dr. Ashmita Joshi.' 
                  : 'Messages are secure & synced live between doctors, assistants, and the patient.'}
              </span>
            </div>
          </div>

          {/* Render Chronological Messages with Correct Perspective */}
          {(currentMessages || []).map((msg) => {
            const isMe = isMessageFromCurrentUser(msg);

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-3.5 shadow-sm space-y-2 relative ${
                    isMe 
                      ? 'bg-[#d9fdd3] text-slate-900 rounded-tr-xs border border-emerald-200/60' 
                      : 'bg-white text-slate-900 rounded-tl-xs border border-slate-200/80'
                  }`}
                >
                  {/* Sender Header Label */}
                  <div className="text-[10px] font-black uppercase tracking-wider flex items-center justify-between gap-2">
                    {isMe ? (
                      <span className="text-emerald-800">You ({isPatientSession ? 'Patient' : 'Doctor'})</span>
                    ) : (
                      <span className="text-teal-700">
                        {isPatientSession 
                          ? `${assignedDietitian?.name || 'Dr. Ashmita Joshi'} (Clinical Dietitian)` 
                          : `${msg.senderName || currentPatient?.name || 'Patient'} (Patient)`}
                      </span>
                    )}
                  </div>

                  {/* Message Photo Content */}
                  {msg.type === 'photo' && msg.mediaUrl && (
                    <div className="rounded-xl overflow-hidden border border-slate-200/60">
                      <img src={msg.mediaUrl} alt="Attached media" className="w-full max-h-60 object-cover" />
                    </div>
                  )}

                  {/* Message PDF Content */}
                  {msg.type === 'pdf' && (
                    <div className="p-3 bg-white/80 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{msg.mediaMeta?.fileName || 'Clinical_Meal_Plan.pdf'}</div>
                          <div className="text-[10px] text-slate-500">{msg.mediaMeta?.fileSize || '1.8 MB'} • PDF Document</div>
                        </div>
                      </div>
                      <a
                        href={msg.mediaUrl || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 text-[11px] font-bold text-teal-700 bg-teal-50 rounded-lg hover:bg-teal-100"
                      >
                        Open
                      </a>
                    </div>
                  )}

                  {/* Message Exercise Plan Card */}
                  {msg.type === 'exercise_plan' && (
                    <div className="p-3 bg-teal-900 text-white rounded-xl space-y-1.5 shadow-sm">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-teal-300 flex items-center gap-1">
                        <Dumbbell className="w-3.5 h-3.5" /> Prescribed Clinical Routine
                      </div>
                      <div className="text-xs font-bold">{msg.mediaMeta?.planTitle || 'Metabolic Resistance Plan'}</div>
                      <div className="text-[11px] text-teal-100/90">
                        {msg.mediaMeta?.days || 4} sessions/week • {msg.mediaMeta?.durationMins || 35} mins per workout
                      </div>
                    </div>
                  )}

                  {/* Text Content */}
                  <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>

                  {/* Time & Read status ticks */}
                  <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 font-mono pt-0.5">
                    <span>{msg.timestamp}</span>
                    {isMe && (
                      <CheckCheck className={`w-3.5 h-3.5 ${msg.status === 'read' ? 'text-teal-600' : 'text-slate-400'}`} />
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator for simulated responses */}
          {isDietitianTyping && (
            <div className="flex flex-col items-start animate-in fade-in duration-200">
              <div className="bg-white rounded-2xl px-4 py-2.5 border border-slate-200/80 shadow-xs flex items-center gap-2">
                <span className="text-xs text-teal-700 font-bold">Dr. Ashmita is typing</span>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestions Chips Bar */}
        <div className="px-4 py-2 bg-white/90 border-t border-slate-200 overflow-x-auto flex items-center gap-2 no-scrollbar">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
            {isPatientSession ? '💡 Ask Your Dietitian:' : 'Clinical Nudges:'}
          </span>
          {(isPatientSession ? PATIENT_QUICK_REPLIES : DOCTOR_CANNED_REPLIES).map((canned, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendCanned(canned)}
              className={`text-xs px-3 py-1 rounded-full whitespace-nowrap transition-colors shrink-0 font-medium border cursor-pointer ${
                isPatientSession
                  ? 'text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border-emerald-300 font-bold shadow-2xs'
                  : 'text-slate-700 bg-slate-100 hover:bg-teal-50 hover:text-teal-900 hover:border-teal-200 border-slate-200'
              }`}
            >
              {canned}
            </button>
          ))}
        </div>

        {/* Input Bar & Attachment Menus */}
        <div className="p-3.5 bg-white border-t border-slate-200 relative">
          
          {/* Doctor Controls (Only visible to Doctors) */}
          {!isPatientSession && (
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold text-slate-500">Send as:</span>
                <button
                  type="button"
                  onClick={() => setSenderRole('doctor')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    senderRole === 'doctor'
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  🩺 Doctor (Dr. Ashmita)
                </button>
                <button
                  type="button"
                  onClick={() => setSenderRole('patient')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    senderRole === 'patient'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  👤 Patient Simulation ({currentPatient?.name ? currentPatient.name.split(' ')[0] : 'Patient'})
                </button>
              </div>

              <span className="text-[11px] font-medium text-slate-400 hidden sm:inline">
                {senderRole === 'doctor' ? 'Clinical Outgoing' : 'Patient Incoming Simulation'}
              </span>
            </div>
          )}
          
          {/* AI Copilot Motivation Generator Popover (Doctor Only) */}
          {!isPatientSession && isCopilotPromptOpen && (
            <div className="absolute bottom-20 left-4 right-4 sm:right-auto sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 space-y-3 z-30 animate-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-teal-600" />
                  AI Copilot Message Generator
                </span>
                <button
                  type="button"
                  onClick={() => setIsCopilotPromptOpen(false)}
                  className="text-slate-400 hover:text-slate-700 text-xs font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <p className="text-[11px] text-slate-500">Select tone to auto-generate personalized clinical compliance text:</p>
              
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleSendCopilotMotivation('celebratory')}
                  className="w-full text-left p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/70 text-xs font-bold text-emerald-950 transition-colors cursor-pointer"
                >
                  🌟 Celebratory Milestone
                  <span className="block font-normal text-[10px] text-emerald-800">Celebrates fat loss and consistent habit tracking</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSendCopilotMotivation('empathetic')}
                  className="w-full text-left p-2.5 rounded-xl border border-teal-200 bg-teal-50/50 hover:bg-teal-100/70 text-xs font-bold text-teal-950 transition-colors cursor-pointer"
                >
                  🌱 Empathetic Stress Reset
                  <span className="block font-normal text-[10px] text-teal-800">For missed logs, emotional eating, or plateaus</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSendCopilotMotivation('strict_discipline')}
                  className="w-full text-left p-2.5 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100/70 text-xs font-bold text-amber-950 transition-colors cursor-pointer"
                >
                  🎯 Accountability & Non-Negotiables
                  <span className="block font-normal text-[10px] text-amber-800">Firm reminder on water, protein splits & steps</span>
                </button>
              </div>
            </div>
          )}

          {/* Attachment Selector Popover */}
          {isAttachOpen && (
            <div className="absolute bottom-20 left-4 bg-white rounded-2xl shadow-xl border border-slate-200 p-2.5 space-y-1 z-30 animate-in slide-in-from-bottom-2">
              <button
                type="button"
                onClick={() => handleSendMedia('photo')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-teal-50 hover:text-teal-900 transition-colors cursor-pointer"
              >
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                {isPatientSession ? 'Attach Meal Plate Photo' : 'Attach Assessment Photo'}
              </button>
              
              {!isPatientSession && (
                <>
                  <button
                    type="button"
                    onClick={() => handleSendMedia('pdf')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-teal-50 hover:text-teal-900 transition-colors cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-rose-600" />
                    Attach Meal Plan PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendMedia('exercise_plan')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-teal-50 hover:text-teal-900 transition-colors cursor-pointer"
                  >
                    <Dumbbell className="w-4 h-4 text-teal-600" />
                    Attach Exercise Routine
                  </button>
                </>
              )}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            
            {/* Attachment Button */}
            <button
              type="button"
              onClick={() => setIsAttachOpen(!isAttachOpen)}
              className="p-2 text-slate-500 hover:text-teal-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Attach meal photo or documents"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            {/* AI Generator Button (Doctor Only) */}
            {!isPatientSession && senderRole === 'doctor' && (
              <button
                type="button"
                onClick={() => setIsCopilotPromptOpen(!isCopilotPromptOpen)}
                className="p-2 text-teal-600 bg-teal-50 hover:bg-teal-100 rounded-xl transition-colors cursor-pointer"
                title="Generate AI Clinical Motivation"
              >
                <Sparkles className="w-5 h-5" />
              </button>
            )}

            {/* Main Text Input */}
            <input
              type="text"
              placeholder={
                isPatientSession
                  ? "Type a message or question to your dietitian (e.g. fruit after dinner, cravings, snacks)..."
                  : senderRole === 'doctor'
                  ? `Message ${currentPatient?.name || 'patient'} as Dr. Ashmita...`
                  : `Type reply as ${currentPatient?.name || 'patient'}...`
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className={`flex-1 text-xs sm:text-sm px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 bg-slate-50 focus:bg-white transition-all ${
                isPatientSession
                  ? 'border-emerald-300 focus:ring-emerald-500'
                  : senderRole === 'doctor'
                  ? 'border-slate-200 focus:ring-teal-500'
                  : 'border-emerald-300 focus:ring-emerald-500'
              }`}
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim()}
              className={`p-2.5 rounded-xl text-white font-bold transition-all cursor-pointer ${
                inputText.trim() 
                  ? 'bg-teal-600 hover:bg-teal-700 shadow-md transform active:scale-95'
                  : 'bg-slate-300 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>

          </form>

        </div>

      </div>

    </div>
  );
};
