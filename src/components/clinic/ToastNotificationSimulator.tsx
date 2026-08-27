import React, { useEffect } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Bell, MessageSquare, Smartphone, X, CheckCircle2, Volume2 } from 'lucide-react';

export const ToastNotificationSimulator: React.FC = () => {
  const { activeToastNotification, dismissToastNotification } = useClinic();

  useEffect(() => {
    if (activeToastNotification) {
      const timer = setTimeout(() => {
        dismissToastNotification();
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [activeToastNotification, dismissToastNotification]);

  if (!activeToastNotification) return null;

  const getChannelStyles = (channel: 'push' | 'whatsapp' | 'sms') => {
    switch (channel) {
      case 'whatsapp':
        return {
          icon: <MessageSquare className="w-5 h-5 text-emerald-400" />,
          bgColor: 'bg-emerald-950/95 border-emerald-500/40 text-emerald-50',
          badgeColor: 'bg-emerald-800 text-emerald-200',
          accent: 'border-l-4 border-l-emerald-500',
          header: 'WhatsApp Reminder Service'
        };
      case 'sms':
        return {
          icon: <Smartphone className="w-5 h-5 text-sky-400" />,
          bgColor: 'bg-slate-900/95 border-sky-500/40 text-slate-100',
          badgeColor: 'bg-sky-900 text-sky-200',
          accent: 'border-l-4 border-l-sky-500',
          header: 'SMS Priority Gateway'
        };
      default: // push
        return {
          icon: <Bell className="w-5 h-5 text-teal-400" />,
          bgColor: 'bg-slate-900/95 border-teal-500/40 text-slate-100',
          badgeColor: 'bg-teal-900 text-teal-200',
          accent: 'border-l-4 border-l-teal-500',
          header: 'Clinic Mobile Push Alert'
        };
    }
  };

  const styles = getChannelStyles(activeToastNotification.channel);

  return (
    <div className="fixed top-5 right-5 z-[9999] max-w-md w-full animate-in slide-in-from-top-4 fade-in duration-300">
      <div className={`rounded-2xl shadow-2xl backdrop-blur-md border p-4 ${styles.bgColor} ${styles.accent} relative overflow-hidden`}>
        
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm shrink-0 mt-0.5">
              {styles.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold tracking-wider uppercase opacity-80">{styles.header}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${styles.badgeColor}`}>
                  {activeToastNotification.time}
                </span>
                <span className="flex items-center text-[10px] text-emerald-400 font-medium gap-0.5">
                  <CheckCircle2 className="w-3 h-3" /> Sent
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">{activeToastNotification.title}</h4>
              <p className="text-xs text-slate-200/90 leading-relaxed">{activeToastNotification.message}</p>
            </div>
          </div>

          <button
            onClick={dismissToastNotification}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Simulation Badge */}
        <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
          <span className="flex items-center gap-1">
            <Volume2 className="w-3.5 h-3.5 text-teal-400" /> Patient Device Notification Triggered
          </span>
          <button
            onClick={dismissToastNotification}
            className="text-xs font-semibold text-teal-300 hover:text-teal-200 underline"
          >
            Dismiss
          </button>
        </div>

      </div>
    </div>
  );
};
