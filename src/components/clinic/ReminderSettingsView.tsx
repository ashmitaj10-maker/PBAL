import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { 
  Bell, 
  Clock, 
  MessageSquare, 
  Smartphone, 
  Send, 
  Check, 
  Sparkles, 
  User, 
  Utensils, 
  Droplets, 
  Dumbbell, 
  Pill, 
  Moon, 
  Scale, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { PatientReminderConfig, ReminderType } from '../../types/clinic';
import { PatientSelector } from './PatientSelector';

export const ReminderSettingsView: React.FC = () => {
  const { 
    selectedPatient, 
    patients, 
    setSelectedPatientId, 
    getPatientReminders, 
    updatePatientReminder, 
    toggleReminderChannel, 
    triggerTestReminderNotification 
  } = useClinic();

  const currentPatient = selectedPatient || patients[0];
  const reminders = currentPatient ? getPatientReminders(currentPatient.id) : [];

  const [selectedReminderId, setSelectedReminderId] = useState<string>(reminders[0]?.id || 'rem-water');
  const [activePreviewChannel, setActivePreviewChannel] = useState<'push' | 'whatsapp' | 'sms'>('whatsapp');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const activeReminder = reminders.find(r => r.id === selectedReminderId) || reminders[0];

  const getReminderIcon = (type: ReminderType) => {
    switch (type) {
      case 'breakfast': return <Utensils className="w-4 h-4 text-amber-500" />;
      case 'lunch': return <Utensils className="w-4 h-4 text-orange-500" />;
      case 'dinner': return <Utensils className="w-4 h-4 text-indigo-500" />;
      case 'water': return <Droplets className="w-4 h-4 text-sky-500" />;
      case 'exercise': return <Dumbbell className="w-4 h-4 text-emerald-500" />;
      case 'medicine': return <Pill className="w-4 h-4 text-rose-500" />;
      case 'sleep': return <Moon className="w-4 h-4 text-purple-500" />;
      case 'weigh_in': return <Scale className="w-4 h-4 text-teal-500" />;
    }
  };

  const handleUpdate = (field: keyof PatientReminderConfig, val: any) => {
    if (!currentPatient || !activeReminder) return;
    updatePatientReminder(currentPatient.id, activeReminder.id, { [field]: val });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 1200);
  };

  const handleTestNotification = (channel: 'push' | 'whatsapp' | 'sms') => {
    if (!activeReminder) return;
    triggerTestReminderNotification(activeReminder, channel);
  };

  // Preview Message
  const renderedMessage = activeReminder 
    ? activeReminder.customMessage
        .replace('{name}', currentPatient?.name ? currentPatient.name.split(' ')[0] : 'Patient')
        .replace('{time}', activeReminder.scheduledTime)
    : '';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600 mb-1">
            <Bell className="w-4 h-4" />
            Automated Engagement Protocol • Phase 3
          </div>
          <h1 className="text-2xl font-black text-slate-900">Patient Reminder & Nudge Engine</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Multi-channel automated triggers across Push, WhatsApp, and SMS for meals, water, exercise & weigh-ins
          </p>
        </div>

        {/* Patient Switcher */}
        <div className="flex items-center gap-3">
          <PatientSelector />
        </div>
      </div>

      {/* Main Layout: Left = Reminders List & Config, Right = Live Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Cols: Reminders Accordion & Editor */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Reminder Cards List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Configured Reminders ({(reminders || []).filter(r => r.isEnabled).length}/{(reminders || []).length} Active)
              </span>
              <span className="text-xs text-slate-500">Tap to edit schedule & channels</span>
            </div>

            {(reminders || []).map((rem) => {
              const isSelected = rem.id === activeReminder?.id;
              return (
                <div
                  key={rem.id}
                  onClick={() => setSelectedReminderId(rem.id)}
                  className={`p-4 transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    isSelected ? 'bg-teal-50/60 border-l-4 border-l-teal-600' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                      {getReminderIcon(rem.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{rem.title}</h4>
                        {!rem.isEnabled && (
                          <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                            Paused
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="font-mono font-semibold text-slate-700">{rem.scheduledTime}</span>
                        <span>•</span>
                        <span className="capitalize">{rem.frequency}</span>
                      </div>
                    </div>
                  </div>

                  {/* Channel Badges & Toggle */}
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <div className="hidden sm:flex items-center gap-1">
                      <button
                        onClick={() => currentPatient && toggleReminderChannel(currentPatient.id, rem.id, 'push')}
                        className={`p-1.5 rounded-lg text-xs font-bold border transition-colors ${
                          rem.channels.push ? 'bg-teal-600 text-white border-teal-600' : 'bg-slate-50 text-slate-400 border-slate-200'
                        }`}
                        title="Push Notification"
                      >
                        <Bell className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => currentPatient && toggleReminderChannel(currentPatient.id, rem.id, 'whatsapp')}
                        className={`p-1.5 rounded-lg text-xs font-bold border transition-colors ${
                          rem.channels.whatsapp ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-400 border-slate-200'
                        }`}
                        title="WhatsApp Alert"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => currentPatient && toggleReminderChannel(currentPatient.id, rem.id, 'sms')}
                        className={`p-1.5 rounded-lg text-xs font-bold border transition-colors ${
                          rem.channels.sms ? 'bg-sky-600 text-white border-sky-600' : 'bg-slate-50 text-slate-400 border-slate-200'
                        }`}
                        title="SMS Gateway"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Enable Switch */}
                    <button
                      onClick={() => currentPatient && updatePatientReminder(currentPatient.id, rem.id, { isEnabled: !rem.isEnabled })}
                      className={`w-10 h-6 rounded-full transition-colors p-0.5 flex items-center ${
                        rem.isEnabled ? 'bg-teal-600 justify-end' : 'bg-slate-300 justify-start'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full bg-white shadow-xs" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Reminder Editor Box */}
          {activeReminder && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-teal-50 text-teal-700">
                    {getReminderIcon(activeReminder.type)}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Edit {activeReminder.title}</h3>
                    <p className="text-xs text-slate-500">Fine-tune scheduled time, recurrence, and message copywriting</p>
                  </div>
                </div>

                {saveSuccess && (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Saved
                  </span>
                )}
              </div>

              {/* Time & Recurrence */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    Scheduled Trigger Time
                  </label>
                  <input
                    type="time"
                    value={activeReminder.scheduledTime || activeReminder.time || '08:00'}
                    onChange={(e) => {
                      handleUpdate('time', e.target.value);
                      handleUpdate('scheduledTime', e.target.value);
                    }}
                    className="w-full text-sm font-mono px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Frequency</label>
                  <select
                    value={activeReminder.frequency}
                    onChange={(e) => handleUpdate('frequency', e.target.value)}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 bg-white capitalize"
                  >
                    <option value="daily">Daily (7 Days / Week)</option>
                    <option value="weekdays">Weekdays Only (Mon-Fri)</option>
                    <option value="weekly">Weekly (Every Monday)</option>
                  </select>
                </div>
              </div>

              {/* Channels Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Delivery Channels</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => currentPatient && toggleReminderChannel(currentPatient.id, activeReminder.id, 'push')}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                      activeReminder.channels.push 
                        ? 'bg-teal-50 border-teal-500 text-teal-900 font-bold shadow-xs' 
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <Bell className="w-5 h-5 text-teal-600" />
                    <span className="text-xs">Push Alert</span>
                    <span className="text-[10px] text-teal-700 font-normal">In-App Banner</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => currentPatient && toggleReminderChannel(currentPatient.id, activeReminder.id, 'whatsapp')}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                      activeReminder.channels.whatsapp 
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold shadow-xs' 
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <MessageSquare className="w-5 h-5 text-emerald-600" />
                    <span className="text-xs">WhatsApp</span>
                    <span className="text-[10px] text-emerald-700 font-normal">Interactive Chat</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => currentPatient && toggleReminderChannel(currentPatient.id, activeReminder.id, 'sms')}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                      activeReminder.channels.sms 
                        ? 'bg-sky-50 border-sky-500 text-sky-900 font-bold shadow-xs' 
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-sky-600" />
                    <span className="text-xs">SMS Text</span>
                    <span className="text-[10px] text-sky-700 font-normal">Direct Cellular</span>
                  </button>
                </div>
              </div>

              {/* Message Template Editor */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">Personalized Message Copy</label>
                  <span className="text-[11px] text-slate-400">Available tags: {'{name}'}, {'{time}'}</span>
                </div>
                <textarea
                  value={activeReminder.customMessage}
                  onChange={(e) => handleUpdate('customMessage', e.target.value)}
                  rows={3}
                  className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 font-sans"
                />
              </div>

              {/* Trigger Instant Test Alert */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                  Test alert simulates instant patient reception in preview
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTestNotification('whatsapp')}
                    className="px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Test WhatsApp
                  </button>
                  <button
                    onClick={() => handleTestNotification('push')}
                    className="px-3 py-1.5 text-xs font-bold text-teal-800 bg-teal-100 hover:bg-teal-200 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <Bell className="w-3.5 h-3.5" /> Test Push
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Right 5 Cols: Interactive Phone Simulator */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl border border-slate-800 flex flex-col justify-between min-h-[580px]">
            
            {/* Simulator Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-teal-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Live Device Simulation</h3>
                </div>

                {/* Channel Switcher */}
                <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl text-[11px]">
                  <button
                    onClick={() => setActivePreviewChannel('whatsapp')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      activePreviewChannel === 'whatsapp' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    WhatsApp
                  </button>
                  <button
                    onClick={() => setActivePreviewChannel('push')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      activePreviewChannel === 'push' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Push Banner
                  </button>
                  <button
                    onClick={() => setActivePreviewChannel('sms')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      activePreviewChannel === 'sms' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    SMS
                  </button>
                </div>
              </div>

              {/* Phone Frame */}
              <div className="mt-6 mx-auto w-full max-w-[320px] bg-slate-950 rounded-[40px] p-4 border-4 border-slate-700 shadow-2xl relative">
                
                {/* Dynamic Island / Notch */}
                <div className="w-24 h-4 bg-black rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-900 inline-block" />
                </div>

                {/* Lockscreen or App View */}
                {activePreviewChannel === 'push' && (
                  <div className="space-y-4 py-4">
                    <div className="text-center text-slate-400 font-mono text-3xl font-light">
                      {activeReminder?.scheduledTime || '08:00'}
                    </div>
                    <div className="text-center text-[10px] text-slate-400">
                      Wednesday, August 26
                    </div>

                    {/* Push Card */}
                    <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-white space-y-1.5 shadow-lg animate-in slide-in-from-top-2">
                      <div className="flex items-center justify-between text-[10px] text-teal-300 font-bold">
                        <span className="flex items-center gap-1">
                          <Bell className="w-3 h-3" /> CLINIC ENGAGE
                        </span>
                        <span className="text-slate-400">now</span>
                      </div>
                      <div className="text-xs font-bold text-white">{activeReminder?.title}</div>
                      <p className="text-[11px] text-slate-300 leading-snug">{renderedMessage}</p>
                    </div>
                  </div>
                )}

                {activePreviewChannel === 'whatsapp' && (
                  <div className="bg-[#0b141a] rounded-2xl p-3 text-slate-100 min-h-[260px] flex flex-col justify-between border border-slate-800">
                    {/* Chat Header */}
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-xs font-bold text-white">
                      <div className="w-7 h-7 rounded-full bg-teal-700 flex items-center justify-center text-[11px]">
                        AJ
                      </div>
                      <div>
                        <div className="text-[11px]">Dr. Ashmita Joshi</div>
                        <div className="text-[9px] text-emerald-400 font-normal">Official Clinic Assistant</div>
                      </div>
                    </div>

                    {/* Bubble */}
                    <div className="bg-[#005c4b] p-3 rounded-2xl rounded-tl-xs text-white max-w-[90%] my-3 shadow-md space-y-1">
                      <div className="text-[10px] font-bold text-emerald-200 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> {activeReminder?.title}
                      </div>
                      <p className="text-xs leading-relaxed">{renderedMessage}</p>
                      <div className="text-[9px] text-emerald-200/80 text-right flex items-center justify-end gap-1">
                        <span>{activeReminder?.scheduledTime}</span>
                        <span>✓✓</span>
                      </div>
                    </div>

                    <div className="bg-[#1f2c34] p-1.5 rounded-xl text-[10px] text-slate-400 text-center">
                      Quick Action: Reply &quot;Done&quot; to log
                    </div>
                  </div>
                )}

                {activePreviewChannel === 'sms' && (
                  <div className="bg-slate-900 rounded-2xl p-4 min-h-[260px] flex flex-col justify-between text-slate-200 border border-slate-800">
                    <div className="text-center text-[10px] text-slate-400 pb-2 border-b border-slate-800 font-mono">
                      +91 98200 CLINIC (Priority SMS)
                    </div>

                    <div className="bg-sky-950/80 border border-sky-600/40 p-3 rounded-2xl text-xs space-y-1 shadow">
                      <div className="font-bold text-sky-300 text-[10px]">{activeReminder?.title.toUpperCase()}</div>
                      <p className="text-[11px] leading-relaxed">{renderedMessage}</p>
                      <div className="text-[9px] text-sky-400 text-right">{activeReminder?.scheduledTime}</div>
                    </div>

                    <div className="text-[10px] text-slate-500 text-center">
                      Delivered via Enterprise SMS
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Recipient: {currentPatient?.name} ({currentPatient?.phone})</span>
              <button
                onClick={() => handleTestNotification(activePreviewChannel)}
                className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-slate-950 font-bold text-xs rounded-xl shadow flex items-center gap-1.5 transition-all"
              >
                <Send className="w-3.5 h-3.5" /> Fire Live Trigger
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
