import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  BookOpen, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { useNutrition } from '../context/NutritionContext';
import { chatNutritionistApi } from '../services/api';
import { ChatMessage } from '../types';
import { formatDateTime } from '../utils/dateUtils';

export const AiNutritionistView: React.FC = () => {
  const { profile, chatMessages, addChatMessage } = useNutrition();
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeakingId, setIsSpeakingId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    "What are the best food combinations to maximize non-heme iron absorption?",
    "How can I prevent afternoon energy crashes with glycemic food timing?",
    "What is the optimal protein intake per meal to trigger muscle protein synthesis?",
    "Recommend clinical food swaps for reducing systemic joint inflammation",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    const userMsg: Omit<ChatMessage, 'id' | 'timestamp'> = {
      sender: 'user',
      text: query.trim(),
    };

    addChatMessage(userMsg);
    setInputText('');
    setIsLoading(true);

    try {
      const updatedMessages = [...chatMessages, { ...userMsg, id: 'temp', timestamp: new Date().toISOString() }];
      const response = await chatNutritionistApi({
        messages: updatedMessages,
        userContext: profile,
      });

      addChatMessage({
        sender: 'assistant',
        text: response.reply,
        suggestedFollowUps: response.suggestedFollowUps,
        clinicalSources: response.clinicalSources,
      });
    } catch (err: any) {
      console.error("Chat consultation error:", err);
      addChatMessage({
        sender: 'assistant',
        text: "I experienced a temporary communication hiccup. Please ask again or refine your query.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSpeech = (msgId: string, text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeakingId === msgId) {
        window.speechSynthesis.cancel();
        setIsSpeakingId(null);
      } else {
        window.speechSynthesis.cancel();
        const cleanText = text.replace(/[*#_`]/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.onend = () => setIsSpeakingId(null);
        utterance.onerror = () => setIsSpeakingId(null);
        window.speechSynthesis.speak(utterance);
        setIsSpeakingId(msgId);
      }
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#183153] text-white">
              Clinical Nutrition AI
            </span>
            <span className="text-xs font-semibold text-[#6BBF59]">Dr. Maya • PhD, RD Clinical Lead</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#183153] font-['Poppins'] mt-1">
            AI Nutritionist & Metabolic Advisor
          </h1>
          <p className="text-sm text-slate-600">
            Ask complex dietetic questions, request biochemical food explanations, or customize recipes.
          </p>
        </div>

        <div className="p-2.5 rounded-2xl bg-[#F8FFF8] border border-[#6BBF59]/30 text-xs font-semibold text-[#183153] flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#6BBF59] animate-pulse" />
          <span>Surveillance for: {profile.name} ({(profile.dietType || '').replace('_', ' ')})</span>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="medical-card flex flex-col h-[640px] overflow-hidden">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {(chatMessages || []).map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-[#183153] text-[#6BBF59]'
                      : 'bg-[#F8FFF8] border border-[#6BBF59]/40 text-[#2E7D32]'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-5 h-5" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed space-y-3 ${
                    isUser
                      ? 'bg-[#183153] text-white rounded-tr-none'
                      : 'bg-slate-50 border border-slate-200/80 text-[#183153] rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap">
                    {msg.text}
                  </div>

                  {/* Clinical Sources if assistant */}
                  {!isUser && msg.clinicalSources && msg.clinicalSources.length > 0 && (
                    <div className="pt-2.5 border-t border-slate-200 text-xs text-slate-500 flex flex-wrap items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5 text-[#6BBF59]" />
                      <span className="font-semibold text-slate-700">Clinical References:</span>
                      {(msg.clinicalSources || []).map((src, i) => (
                        <span key={i} className="bg-white px-2 py-0.5 rounded-md border border-slate-200 text-[11px]">
                          {src}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Audio Read-aloud button for Assistant */}
                  {!isUser && (
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-slate-400 font-mono">
                        {formatDateTime(msg.timestamp)}
                      </span>
                      <button
                        onClick={() => handleToggleSpeech(msg.id, msg.text)}
                        className="text-slate-400 hover:text-[#183153] transition-colors p-1"
                        title={isSpeakingId === msg.id ? "Stop voice" : "Read aloud"}
                      >
                        {isSpeakingId === msg.id ? (
                          <VolumeX className="w-4 h-4 text-red-500" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  )}

                  {/* Suggested Follow-ups */}
                  {!isUser && msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                    <div className="pt-2 border-t border-slate-200/60 flex flex-wrap gap-1.5">
                      {(msg.suggestedFollowUps || []).map((prompt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(prompt)}
                          className="text-left text-xs bg-white hover:bg-[#F8FFF8] hover:border-[#6BBF59]/40 border border-slate-200 text-[#183153] px-2.5 py-1 rounded-lg transition-colors font-medium"
                        >
                          → {prompt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F8FFF8] border border-[#6BBF59]/40 text-[#2E7D32] flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-none p-4 text-xs text-slate-500 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-[#6BBF59]" />
                <span>Dr. Maya is reviewing clinical nutrition literature & your bio-profile...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Starter Chips */}
        {(chatMessages || []).length <= 2 && (
          <div className="px-6 py-2 bg-[#F8FFF8] border-t border-b border-[#6BBF59]/20 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
              Suggestions:
            </span>
            {(suggestedPrompts || []).map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="text-xs bg-white hover:bg-[#6BBF59]/10 border border-[#6BBF59]/30 text-[#183153] px-3 py-1 rounded-full whitespace-nowrap font-medium transition-colors shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-100 flex items-center gap-2">
          <input
            id="nutritionist-chat-input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Ask Dr. Maya about micronutrients, meal prep, metabolism, or blood sugar..."
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:border-[#6BBF59] focus:ring-2 focus:ring-[#6BBF59]/20 outline-none text-sm text-[#183153] placeholder:text-slate-400 transition-all"
          />

          <button
            id="send-chat-btn"
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputText.trim()}
            className="p-3 bg-[#183153] hover:bg-[#244673] active:scale-95 text-white rounded-xl shadow-sm transition-all disabled:opacity-40"
          >
            <Send className="w-5 h-5 text-[#6BBF59]" />
          </button>
        </div>

      </div>

    </div>
  );
};
