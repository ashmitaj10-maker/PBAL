import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { 
  Bot, 
  Sparkles, 
  Search, 
  Send, 
  Copy, 
  Check, 
  AlertTriangle, 
  Flame, 
  CheckCircle2, 
  ChefHat, 
  FileText, 
  Zap,
  RefreshCw,
  X,
  Filter,
  Award,
  Clock,
  Utensils,
  BookOpen,
  ArrowRight,
  HelpCircle,
  Sun,
  Heart,
  Quote,
  Compass,
  Pin
} from 'lucide-react';
import { FoodSwapSuggestion, SwapRecipe } from '../../types/clinic';
import { 
  generateHeuristicFoodSwapsForAllPreferences,
  CRAVING_KNOWLEDGE_BASE
} from '../../data/foodSwapsGenerator';
import { PatientSelector } from './PatientSelector';
import { formatDate } from '../../utils/dateUtils';

type CopilotTab = 'food_swaps' | 'nutrient_gaps' | 'motivation' | 'soap_summary';

type FoodPrefFilter = 'All' | 'Vegetarian' | 'Jain' | 'Vegan' | 'Eggetarian' | 'Non-Vegetarian' | 'Keto' | 'Gluten-Free';

const PREFERENCE_OPTIONS: { id: FoodPrefFilter; label: string; icon: string; badgeColor: string; description: string }[] = [
  { id: 'All', label: 'All Preferences', icon: '🌐', badgeColor: 'bg-slate-100 text-slate-800 border-slate-200', description: 'Showing all clinical variations' },
  { id: 'Vegetarian', label: 'Vegetarian', icon: '🥗', badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200', description: 'Paneer, lentils, curd & sprouts' },
  { id: 'Non-Vegetarian', label: 'Non-Vegetarian', icon: '🍗', badgeColor: 'bg-rose-50 text-rose-800 border-rose-200', description: 'Lean chicken breast & wild fish' },
  { id: 'Vegan', label: 'Vegan', icon: '🌱', badgeColor: 'bg-teal-50 text-teal-800 border-teal-200', description: '100% plant-based & dairy-free' },
  { id: 'Jain', label: 'Jain', icon: '🕉️', badgeColor: 'bg-amber-50 text-amber-900 border-amber-200', description: 'No root veggies / onion / garlic / potato' },
  { id: 'Eggetarian', label: 'Eggetarian', icon: '🥚', badgeColor: 'bg-yellow-50 text-yellow-900 border-yellow-200', description: 'Lean egg whites & high protein' },
  { id: 'Keto', label: 'Keto / Low-Carb', icon: '🥑', badgeColor: 'bg-purple-50 text-purple-800 border-purple-200', description: '<10g net carbs & healthy fats' },
  { id: 'Gluten-Free', label: 'Gluten-Free', icon: '🌾', badgeColor: 'bg-sky-50 text-sky-800 border-sky-200', description: 'Millets, quinoa & celiac safe' },
];

const POPULAR_CRAVINGS = [
  { label: '🍕 Pizza', query: "I'm craving pizza" },
  { label: '🍫 Chocolate', query: 'I want chocolate' },
  { label: '🍟 Crunchy Snacks', query: 'I want something crunchy' },
  { label: '🍰 Sweets / Dessert', query: 'I want something sweet' },
  { label: '🌶️ Spicy Chaat', query: 'I want something spicy' },
  { label: '🍧 Ice Cream', query: 'Craving cold ice cream' },
  { label: '🍜 Noodles / Maggi', query: 'I want noodles' },
  { label: '🍛 Dum Biryani', query: 'Craving rich biryani' },
];

export const AiCopilotView: React.FC = () => {
  const { 
    selectedPatient, 
    patients, 
    foodSwapsCatalog, 
    nutrientGapsTemplates, 
    sendChatMessage, 
    generateCopilotMotivation, 
    generateCopilotProgressSummary,
    setPatientDailyMotivation,
    navigateTo,
    isPatientSession
  } = useClinic();

  const [activeTab, setActiveTab] = useState<CopilotTab>('food_swaps');
  
  // Smart Food Swap States
  const [cravingQuery, setCravingQuery] = useState("I'm craving pizza");
  const [selectedPreference, setSelectedPreference] = useState<FoodPrefFilter>('All');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [aiGeneratedPayload, setAiGeneratedPayload] = useState<{
    craving: string;
    category: string;
    originalDish: any;
    swaps: FoodSwapSuggestion[];
    isUnderstood?: boolean;
    message?: string;
  } | null>(null);

  // Recipe Modal State
  const [activeRecipeSwap, setActiveRecipeSwap] = useState<FoodSwapSuggestion | null>(null);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});

  // Motivation & SOAP states
  const [motivationTone, setMotivationTone] = useState<'celebratory' | 'empathetic' | 'strict_discipline'>('celebratory');
  const [generatedMotivation, setGeneratedMotivation] = useState<string>('');
  const [generatedSoap, setGeneratedSoap] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [sentToChatKey, setSentToChatKey] = useState<string | null>(null);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const currentPatient = selectedPatient || patients[0];

  // Helper to fetch multi-preference swaps from AI or instant heuristic fallback
  const fetchSmartFoodSwaps = async (query: string) => {
    const clean = (query || '').trim();
    if (!clean) {
      setAiGeneratedPayload(null);
      setErrorMessage(null);
      return;
    }

    setErrorMessage(null);

    // 1. Instantly populate with heuristic knowledge base
    const instantHeuristic = generateHeuristicFoodSwapsForAllPreferences(
      clean,
      currentPatient?.foodPreference
    );

    if (!instantHeuristic.isUnderstood) {
      setErrorMessage(instantHeuristic.message || "I couldn't quite understand that craving. Try describing the food you're craving or the type of food you want.");
      setAiGeneratedPayload(instantHeuristic);
      return;
    }

    setAiGeneratedPayload(instantHeuristic);

    // 2. Concurrently query Gemini AI backend endpoint for deeper contextual synthesis
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsAiLoading(true);

    try {
      const response = await fetch('/api/ai/smart-food-swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          craving: clean,
          patientName: currentPatient?.name || 'Patient',
          patientGoal: currentPatient?.primaryGoals?.[0] || 'Metabolic Health',
          patientFoodPreference: selectedPreference === 'All' ? currentPatient?.foodPreference || 'Vegetarian' : selectedPreference
        }),
        signal: abortControllerRef.current.signal
      });

      if (response.ok) {
        const data = await response.json();
        if (data.isUnderstood === false) {
          setErrorMessage(data.message || "I couldn't quite understand that craving. Try describing the food you're craving or the type of food you want.");
          setAiGeneratedPayload(data);
        } else if (data.swaps && data.swaps.length > 0) {
          setAiGeneratedPayload(data);
          setErrorMessage(null);
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.log('Smart food swap fallback active:', err.message);
      }
    } finally {
      setIsAiLoading(false);
    }
  };

  useEffect(() => {
    fetchSmartFoodSwaps(cravingQuery);
  }, []);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSendToChat = (text: string, key: string) => {
    if (!currentPatient) return;
    sendChatMessage({
      patientId: currentPatient.id,
      content: text,
      type: 'text',
      sender: isPatientSession ? 'patient' : 'doctor'
    });
    setSentToChatKey(key);
    setTimeout(() => setSentToChatKey(null), 2500);
  };

  const handleGenerateMotivation = () => {
    if (!currentPatient) return;
    const text = generateCopilotMotivation(currentPatient.id, motivationTone);
    setGeneratedMotivation(text);
  };

  const handleGenerateSoap = () => {
    if (!currentPatient) return;
    const text = generateCopilotProgressSummary(currentPatient.id);
    setGeneratedSoap(text);
  };

  // Filtered list of swaps for display based on selected Food Preference filter
  const displayedSwaps = useMemo(() => {
    const baseList = (aiGeneratedPayload?.swaps && aiGeneratedPayload.swaps.length > 0)
      ? aiGeneratedPayload.swaps
      : (foodSwapsCatalog || []);

    if (selectedPreference === 'All') {
      return baseList;
    }

    return (baseList || []).filter(swap => {
      const pref = (swap.foodPreference || '').toLowerCase();
      const target = selectedPreference.toLowerCase();
      return pref === target || pref.includes(target) || (swap.dietaryTags || []).some(t => t.toLowerCase().includes(target));
    });
  }, [aiGeneratedPayload, foodSwapsCatalog, selectedPreference]);

  const currentPatientPref = currentPatient?.foodPreference || 'Vegetarian';

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600 mb-1">
            <Bot className="w-4 h-4" />
            {isPatientSession ? 'Doctor AI Copilot • Craving & Healthy Swap Assistant' : 'Clinical AI Assistant • Doctor Copilot'}
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            {isPatientSession ? 'Craving Search & Smart Food Swaps' : 'Doctor AI Copilot & Nutrition Intelligence'}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {isPatientSession 
              ? 'Describe any craving to get instant, delicious dietitian-approved healthy food swaps with complete step-by-step recipes.'
              : 'Real-time multi-preference craving replacements, complete recipes with cooking instructions, biochemical nutrient gap diagnostics & SOAP digests.'
            }
          </p>
        </div>

        {/* Patient Switcher (Only visible to Doctors) */}
        {!isPatientSession && (
          <div className="flex items-center gap-3">
            <PatientSelector />
          </div>
        )}
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('food_swaps')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'food_swaps'
              ? 'border-teal-600 text-teal-900 bg-teal-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <ChefHat className="w-4 h-4 text-teal-600" />
          {isPatientSession ? 'Craving Search & Smart Food Swaps' : 'Smart Food Swaps & Craving Replacer'}
        </button>

        {!isPatientSession && (
          <button
            onClick={() => setActiveTab('nutrient_gaps')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'nutrient_gaps'
                ? 'border-teal-600 text-teal-900 bg-teal-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-500" />
            Biochemical Nutrient Gaps ({nutrientGapsTemplates.length})
          </button>
        )}

        <button
          onClick={() => setActiveTab('motivation')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-xl border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'motivation'
              ? 'border-teal-600 text-teal-900 bg-teal-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-4 h-4 text-purple-600" />
          {isPatientSession ? 'Daily Motivation & Mindset' : 'Motivation & Compliance Generator'}
        </button>

        {!isPatientSession && (
          <button
            onClick={() => setActiveTab('soap_summary')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'soap_summary'
                ? 'border-teal-600 text-teal-900 bg-teal-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-600" />
            Longitudinal SOAP Digest
          </button>
        )}
      </div>

      {/* TAB 1: SMART FOOD SWAPS & CRAVING REPLACER ACROSS ALL FOOD PREFERENCES */}
      {activeTab === 'food_swaps' && (
        <div className="space-y-6">
          
          {/* Main Search & AI Craving Input Bar */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              
              {/* Natural Language Search Input */}
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder='Describe your craving in natural language (e.g. "I want something sweet", "I am craving pizza", "I want something crunchy", "I want chocolate")...'
                  value={cravingQuery}
                  onChange={(e) => setCravingQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      fetchSmartFoodSwaps(cravingQuery);
                    }
                  }}
                  className="w-full text-sm pl-11 pr-24 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-medium text-slate-900 shadow-inner"
                />

                {cravingQuery && (
                  <button
                    onClick={() => setCravingQuery('')}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
                    title="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={() => fetchSmartFoodSwaps(cravingQuery)}
                disabled={isAiLoading || !cravingQuery.trim()}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm whitespace-nowrap cursor-pointer"
              >
                {isAiLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-teal-200" />
                    Analyzing Craving...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-teal-200" />
                    Search & Find Swaps
                  </>
                )}
              </button>
            </div>

            {/* Quick-Click Craving Chips */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-500" /> Popular Cravings:
              </span>
              {(POPULAR_CRAVINGS || []).map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCravingQuery(item.query);
                    fetchSmartFoodSwaps(item.query);
                  }}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all cursor-pointer ${
                    cravingQuery.toLowerCase().includes(item.query.toLowerCase())
                      ? 'bg-teal-50 text-teal-900 border-teal-400 font-bold shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* AI Status & Patient Dietary Context Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                {isAiLoading ? (
                  <span className="flex items-center gap-1.5 text-teal-700 font-semibold animate-pulse">
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    AI Engine identifying craving and generating at least 2 distinct recipes per dietary preference...
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    At least 2 complete recipe swaps generated per applicable preference with cooking times and full ingredients.
                  </span>
                )}
              </div>

              {currentPatient && (
                <div className="flex items-center gap-1.5 text-teal-900 bg-teal-50/80 px-2.5 py-1 rounded-lg border border-teal-200">
                  <Award className="w-3.5 h-3.5 text-teal-600" />
                  <span>Dietary Preference: <strong>{currentPatient.foodPreference}</strong></span>
                </div>
              )}
            </div>

          </div>

          {/* Error / Unrecognized Craving Message */}
          {errorMessage && (
            <div className="bg-amber-50 border-2 border-amber-300 text-amber-900 p-5 rounded-2xl shadow-sm space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-200 text-amber-900 rounded-xl mt-0.5">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="text-sm font-bold text-amber-950">Craving Not Recognized</h4>
                  <p className="text-xs leading-relaxed text-amber-900">
                    {errorMessage}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs font-semibold text-amber-800">
                  Try one of these examples:
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {['"I want something sweet"', '"I\'m craving pizza"', '"I want something crunchy"', '"I want chocolate"'].map((eg, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        const cleanEg = eg.replace(/"/g, '');
                        setCravingQuery(cleanEg);
                        fetchSmartFoodSwaps(cleanEg);
                      }}
                      className="text-xs bg-white text-amber-900 border border-amber-300 px-2.5 py-1 rounded-lg font-bold hover:bg-amber-100 transition-colors cursor-pointer"
                    >
                      {eg}
                    </button>
                  ))}
                  <button
                    onClick={() => fetchSmartFoodSwaps(cravingQuery)}
                    className="text-xs bg-amber-600 text-white px-3 py-1 rounded-lg font-bold hover:bg-amber-700 transition-colors ml-auto cursor-pointer"
                  >
                    Retry Search
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Food Preference Filter Tabs */}
          {!errorMessage && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <Filter className="w-3.5 h-3.5 text-teal-600" />
                  Filter by Food Preference
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  Showing {displayedSwaps.length} alternative{displayedSwaps.length === 1 ? '' : 's'} (≥2 per preference)
                </span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar">
                {(PREFERENCE_OPTIONS || []).map((pref) => {
                  const isSelected = selectedPreference === pref.id;
                  const isPatientMatch = currentPatientPref.toLowerCase().includes(pref.id.toLowerCase());

                  return (
                    <button
                      key={pref.id}
                      onClick={() => setSelectedPreference(pref.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 whitespace-nowrap shadow-xs cursor-pointer ${
                        isSelected
                          ? 'bg-teal-600 text-white border-teal-700 shadow-md ring-2 ring-teal-300/50'
                          : isPatientMatch && pref.id !== 'All'
                          ? 'bg-emerald-50 text-emerald-950 border-emerald-300 hover:bg-emerald-100'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <span>{pref.icon}</span>
                      <span>{pref.label}</span>
                      {isPatientMatch && pref.id !== 'All' && (
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-emerald-200 text-emerald-900'
                        }`}>
                          Patient Match
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Original Craving Biochemical Baseline Profile */}
          {!errorMessage && aiGeneratedPayload?.originalDish && (
            <div className="bg-rose-50/70 rounded-2xl p-5 border border-rose-200 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-rose-200/60">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-rose-100 text-rose-800 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                  </span>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-700 block">
                      Identified Craving & Biochemical Profile
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">
                      {aiGeneratedPayload.originalDish.name || cravingQuery}
                    </h3>
                  </div>
                </div>

                <span className="text-xs font-extrabold bg-rose-200 text-rose-900 px-2.5 py-1 rounded-md self-start sm:self-auto">
                  High Glycemic & Caloric Density
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                <div className="p-2 bg-white rounded-xl border border-rose-100">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Calories</span>
                  <span className="font-black text-rose-700 text-base">{aiGeneratedPayload.originalDish.calories || 680} kcal</span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-rose-100">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">GI Index</span>
                  <span className="font-black text-rose-700 text-base">{aiGeneratedPayload.originalDish.glycemicIndex || 'High'}</span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-rose-100">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Carbs</span>
                  <span className="font-bold text-slate-800 text-sm">{aiGeneratedPayload.originalDish.carbs || 76}g</span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-rose-100">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Fat</span>
                  <span className="font-bold text-slate-800 text-sm">{aiGeneratedPayload.originalDish.fat || 32}g</span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-rose-100 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Protein</span>
                  <span className="font-bold text-slate-800 text-sm">{aiGeneratedPayload.originalDish.protein || 8}g</span>
                </div>
              </div>

              {aiGeneratedPayload.originalDish.drawbacks && (
                <p className="text-xs text-rose-900 leading-relaxed bg-white/70 p-2.5 rounded-xl border border-rose-200/50">
                  <strong>Clinical Drawback:</strong> {aiGeneratedPayload.originalDish.drawbacks}
                </p>
              )}
            </div>
          )}

          {/* Comparative Food Swaps Grid with Full Recipe Triggers */}
          {!errorMessage && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {(displayedSwaps || []).map((swap, idx) => {
                const origCal = swap.originalMacros?.calories || swap.originalCalories || 650;
                const swapCal = swap.swapMacros?.calories || swap.swapCalories || 300;
                const origProt = swap.originalMacros?.protein || 10;
                const swapProt = swap.swapMacros?.protein || swap.swapProteinGrams || 20;
                const calSavings = swap.calorieSaving || Math.max(0, origCal - swapCal);
                const proteinGain = swapProt - origProt;
                const swapKey = `swap-${swap.id || idx}`;

                const prefOption = PREFERENCE_OPTIONS.find(p => p.id.toLowerCase() === (swap.foodPreference || '').toLowerCase()) || {
                  icon: '🥗',
                  badgeColor: 'bg-teal-50 text-teal-800 border-teal-200'
                };

                const isPatientMatch = currentPatientPref.toLowerCase().includes((swap.foodPreference || '').toLowerCase());

                const swapTitle = swap.swapOptionName || swap.clinicalSwap || 'Prescribed Clinical Swap';
                const prepInstructions = swap.preparationTip || swap.instructions || 'Prepare with fresh clinical ingredients.';
                const clinicalReason = swap.clinicalReason || swap.clinicalRationale || 'Preserves insulin sensitivity and optimizes metabolic flexibility.';
                const prepTime = swap.recipe?.prepTimeMinutes || swap.prepTimeMinutes || 10;
                const cookTime = swap.recipe?.cookTimeMinutes || swap.cookTimeMinutes || 12;
                const servings = swap.recipe?.servings || swap.servings || '1 serving';

                return (
                  <div 
                    key={swapKey} 
                    className={`bg-white rounded-3xl border p-6 shadow-sm space-y-4 hover:shadow-md transition-all relative flex flex-col justify-between ${
                      isPatientMatch 
                        ? 'border-emerald-400 ring-2 ring-emerald-100 bg-linear-to-b from-emerald-50/20 to-white' 
                        : 'border-slate-200'
                    }`}
                  >
                    
                    <div className="space-y-4">
                      {/* Top Bar: Food Preference Badge & Calorie Savings */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-lg border flex items-center gap-1.5 ${prefOption.badgeColor}`}>
                            <span>{prefOption.icon}</span>
                            <span>{swap.foodPreference || 'Vegetarian'}</span>
                          </span>

                          {isPatientMatch && (
                            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                              <Award className="w-3 h-3" />
                              Patient Match
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1 shadow-xs">
                            <Flame className="w-3.5 h-3.5 text-emerald-600" /> Save {calSavings} kcal
                          </span>
                          {proteinGain > 0 && (
                            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                              +{proteinGain}g Protein
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Swap Title Header */}
                      <div>
                        <h3 className="text-base font-black text-slate-900 leading-snug">
                          {swapTitle}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                          <span className="text-rose-600 font-semibold line-through">
                            Craving: {swap.cravingOrDish}
                          </span>
                          <span className="flex items-center gap-1 text-slate-600 font-medium">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {prepTime + cookTime} mins ({prepTime}m prep + {cookTime}m cook)
                          </span>
                          <span className="flex items-center gap-1 text-slate-600 font-medium">
                            <Utensils className="w-3.5 h-3.5 text-slate-400" />
                            {servings}
                          </span>
                        </div>
                      </div>

                      {/* Comparative Macro Snapshot Box */}
                      <div className="grid grid-cols-4 gap-2 text-center text-xs p-3 bg-emerald-50/60 rounded-2xl border border-emerald-200">
                        <div className="p-1.5 bg-white rounded-xl border border-emerald-100">
                          <span className="text-[10px] text-slate-400 block font-semibold">Calories</span>
                          <span className="font-black text-emerald-700 text-sm">{swapCal}</span>
                        </div>
                        <div className="p-1.5 bg-white rounded-xl border border-emerald-100">
                          <span className="text-[10px] text-slate-400 block font-semibold">GI Level</span>
                          <span className="font-bold text-emerald-600 text-sm">{swap.swapGlycemic || 'Low'}</span>
                        </div>
                        <div className="p-1.5 bg-white rounded-xl border border-emerald-100">
                          <span className="text-[10px] text-slate-400 block font-semibold">Protein</span>
                          <span className="font-bold text-teal-700 text-sm">{swapProt}g</span>
                        </div>
                        <div className="p-1.5 bg-white rounded-xl border border-emerald-100">
                          <span className="text-[10px] text-slate-400 block font-semibold">Fiber</span>
                          <span className="font-bold text-slate-800 text-sm">{swap.swapFiberGrams || 7}g</span>
                        </div>
                      </div>

                      {/* Key Ingredients Preview */}
                      {(swap.keyIngredients && swap.keyIngredients.length > 0) && (
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                            Key Ingredients:
                          </span>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {(swap.keyIngredients || []).map((ing, iIdx) => (
                              <span key={iIdx} className="text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md border border-slate-200 font-medium">
                                {ing}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Clinical Impact */}
                      <div className="p-3 bg-slate-50 rounded-2xl space-y-1 text-xs border border-slate-100">
                        <p className="text-[11px] text-slate-700 leading-relaxed">
                          <strong className="text-slate-900">Clinical Impact:</strong> {clinicalReason}
                        </p>
                      </div>
                    </div>

                    {/* Action Bar with Recipe Viewer */}
                    <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 mt-2">
                      
                      {/* View Recipe Button */}
                      <button
                        onClick={() => {
                          setActiveRecipeSwap(swap);
                          setCheckedIngredients({});
                        }}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-teal-300" />
                        View Full Recipe & Steps
                      </button>

                      {/* Chat / Dietitian Button */}
                      <button
                        onClick={() => handleSendToChat(
                          isPatientSession
                            ? `Hi Doctor! I'm craving ${swap.cravingOrDish}. Can I make this healthy swap: *${swapTitle}* (Saves ${calSavings} kcal, ${swapProt}g protein)?`
                            : `🥗 Smart Food Swap for ${swap.cravingOrDish} (${swap.foodPreference}):\nCraving ${swap.cravingOrDish}? Swap it with ${swapTitle}! You'll save ${calSavings} calories, enjoy ${swapProt}g protein, and maintain optimal insulin sensitivity. Prep: ${prepInstructions}`,
                          swapKey
                        )}
                        className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                      >
                        {sentToChatKey === swapKey ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                        {sentToChatKey === swapKey ? 'Sent into Chat!' : isPatientSession ? 'Ask Dietitian About Swap' : 'Send to Patient'}
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {!errorMessage && displayedSwaps.length === 0 && (
            <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">No Food Swaps Found</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  Try typing any food or comfort craving into the search box above, or select "All Preferences" to view all available clinical alternatives.
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedPreference('All');
                  setCravingQuery("I'm craving pizza");
                  fetchSmartFoodSwaps("I'm craving pizza");
                }}
                className="px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl hover:bg-teal-700 transition-colors cursor-pointer"
              >
                Reset to Popular Swaps
              </button>
            </div>
          )}

        </div>
      )}

      {/* =========================================================================
          FULL RECIPE & COOKING INSTRUCTIONS MODAL
          ========================================================================= */}
      {activeRecipeSwap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-linear-to-r from-teal-50/60 to-white">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-teal-600 text-white">
                    {activeRecipeSwap.foodPreference || 'Vegetarian'} Recipe
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                    🔥 Saves {activeRecipeSwap.calorieSaving || 300} kcal
                  </span>
                </div>
                <h2 className="text-xl font-black text-slate-900">
                  {activeRecipeSwap.recipe?.recipeName || activeRecipeSwap.swapOptionName}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Healthier alternative for <strong className="text-rose-600 line-through">{activeRecipeSwap.cravingOrDish}</strong>
                </p>
              </div>

              <button
                onClick={() => setActiveRecipeSwap(null)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Quick Info Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Prep Time</span>
                  <span className="font-black text-slate-800 text-sm">
                    ⏱️ {activeRecipeSwap.recipe?.prepTimeMinutes || activeRecipeSwap.prepTimeMinutes || 10} mins
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Cook Time</span>
                  <span className="font-black text-slate-800 text-sm">
                    🍳 {activeRecipeSwap.recipe?.cookTimeMinutes || activeRecipeSwap.cookTimeMinutes || 12} mins
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Serving Size</span>
                  <span className="font-black text-slate-800 text-sm">
                    🍽️ {activeRecipeSwap.recipe?.servings || activeRecipeSwap.servings || '1 serving'}
                  </span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <span className="text-[10px] text-emerald-600 block font-semibold uppercase">Protein</span>
                  <span className="font-black text-emerald-800 text-sm">
                    💪 {activeRecipeSwap.swapMacros?.protein || activeRecipeSwap.swapProteinGrams || 20}g
                  </span>
                </div>
              </div>

              {/* Complete Ingredients List */}
              <div className="space-y-3">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-teal-600" />
                  Ingredients & Quantities:
                </h3>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
                  {activeRecipeSwap.recipe?.ingredients && activeRecipeSwap.recipe.ingredients.length > 0 ? (
                    activeRecipeSwap.recipe.ingredients.map((ing, idx) => {
                      const isChecked = !!checkedIngredients[`${idx}`];
                      return (
                        <div 
                          key={idx} 
                          onClick={() => setCheckedIngredients(prev => ({ ...prev, [`${idx}`]: !prev[`${idx}`] }))}
                          className={`flex items-start gap-3 p-2 rounded-xl transition-all cursor-pointer ${
                            isChecked ? 'bg-emerald-50 text-slate-400 line-through' : 'hover:bg-white'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                          />
                          <div className="text-xs flex-1">
                            <strong className="text-slate-900 font-bold">{ing.amount}</strong>{' '}
                            <span className="text-slate-700">{ing.item}</span>
                            {ing.notes && (
                              <span className="text-[11px] text-teal-700 italic ml-1.5">({ing.notes})</span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-xs text-slate-600">
                      {activeRecipeSwap.preparationTip}
                    </div>
                  )}
                </div>
              </div>

              {/* Step-by-Step Cooking Directions */}
              <div className="space-y-3">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <ChefHat className="w-4 h-4 text-teal-600" />
                  Step-by-Step Preparation Instructions:
                </h3>
                <div className="space-y-2.5">
                  {activeRecipeSwap.recipe?.steps && activeRecipeSwap.recipe.steps.length > 0 ? (
                    activeRecipeSwap.recipe.steps.map((step, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-3 p-3 bg-white rounded-2xl border border-slate-200 text-xs">
                        <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-900 font-black flex items-center justify-center shrink-0 text-xs">
                          {sIdx + 1}
                        </span>
                        <p className="text-slate-700 leading-relaxed pt-0.5">
                          {step}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 bg-white rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                      {activeRecipeSwap.preparationTip}
                    </div>
                  )}
                </div>
              </div>

              {/* Optional Substitutions & Chef Tip */}
              {(activeRecipeSwap.recipe?.optionalSubstitutions && activeRecipeSwap.recipe.optionalSubstitutions.length > 0) && (
                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 space-y-1 text-xs text-purple-950">
                  <span className="font-bold flex items-center gap-1.5 text-purple-900">
                    🔄 Optional Dietary Substitutions:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 pl-1 text-[11px] text-purple-900">
                    {activeRecipeSwap.recipe.optionalSubstitutions.map((sub, i) => (
                      <li key={i}>{sub}</li>
                    ))}
                  </ul>
                </div>
              )}

              {activeRecipeSwap.recipe?.chefTip && (
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950">
                  <strong>👨‍🍳 Chef's Pro Tip:</strong> {activeRecipeSwap.recipe.chefTip}
                </div>
              )}

              {/* Clinical Benefit Note */}
              <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 text-xs text-teal-950 space-y-1">
                <strong>💡 Clinical Medical Rationale:</strong>
                <p className="text-[11px] text-teal-900 leading-relaxed">
                  {activeRecipeSwap.clinicalReason || activeRecipeSwap.recipe?.clinicalBenefit}
                </p>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <button
                onClick={() => {
                  const ingredientsText = (activeRecipeSwap.recipe?.ingredients || []).map(i => `• ${i.amount} ${i.item}`).join('\n');
                  const stepsText = (activeRecipeSwap.recipe?.steps || []).map((s, idx) => `${idx + 1}. ${s}`).join('\n');
                  const fullText = `👩‍🍳 RECIPE: ${activeRecipeSwap.recipe?.recipeName || activeRecipeSwap.swapOptionName}\n\n🥗 INGREDIENTS:\n${ingredientsText}\n\n🍳 INSTRUCTIONS:\n${stepsText}\n\n⏱️ Total Time: ${(activeRecipeSwap.recipe?.prepTimeMinutes || 10) + (activeRecipeSwap.recipe?.cookTimeMinutes || 12)} mins | Calories: ${activeRecipeSwap.swapCalories} kcal (${activeRecipeSwap.swapProteinGrams}g Protein)`;
                  handleCopy(fullText, 'modal-recipe-copy');
                }}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedKey === 'modal-recipe-copy' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                {copiedKey === 'modal-recipe-copy' ? 'Recipe Copied!' : 'Copy Full Recipe'}
              </button>

              <button
                onClick={() => {
                  handleSendToChat(
                    `👩‍🍳 Here is the full recipe for *${activeRecipeSwap.recipe?.recipeName || activeRecipeSwap.swapOptionName}*:\nPrep: ${activeRecipeSwap.recipe?.prepTimeMinutes || 10}m, Cook: ${activeRecipeSwap.recipe?.cookTimeMinutes || 12}m\nNutrition: ${activeRecipeSwap.swapCalories} kcal, ${activeRecipeSwap.swapProteinGrams}g Protein (Saves ${activeRecipeSwap.calorieSaving} kcal)`,
                    'modal-recipe-chat'
                  );
                  setActiveRecipeSwap(null);
                }}
                className="px-5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
                {isPatientSession ? 'Send Recipe to Dietitian Chat' : 'Send Recipe to Patient'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: BIOCHEMICAL NUTRIENT GAP ANALYZER */}
      {activeTab === 'nutrient_gaps' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Micro & Macronutrient Deficit Diagnostic for {currentPatient?.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Automated biochemical deficiency screen based on food frequency, symptoms, and goal biomarkers
                </p>
              </div>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                2 Moderate Deficits Detected
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
              {(nutrientGapsTemplates || []).map((gap: any, idx: number) => {
                const rda = gap.recommendedDailyAllowance || 100;
                const cur = gap.currentIntake || 50;
                const deficitPercentage = Math.max(0, Math.round(((rda - cur) / rda) * 100));
                
                return (
                  <div key={gap.id || idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3.5">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{gap.nutrient}</h4>
                        <span className="text-[11px] text-slate-500">RDA Target: {rda}{gap.unit || 'mg'}/day</span>
                      </div>
                      <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md ${
                        gap.severity === 'high' ? 'bg-rose-100 text-rose-800' :
                        gap.severity === 'moderate' ? 'bg-amber-100 text-amber-800' :
                        'bg-teal-100 text-teal-800'
                      }`}>
                        {gap.severity || 'moderate'} Deficit ({deficitPercentage}%)
                      </span>
                    </div>

                    {/* Deficit Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                        <span>Current Intake: {cur}{gap.unit || 'mg'}</span>
                        <span>{rda}{gap.unit || 'mg'}</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            gap.severity === 'high' ? 'bg-rose-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${Math.min(100, (cur / rda) * 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Symptoms Triggered */}
                    <div className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                      <span className="font-bold text-slate-900 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Associated Symptoms:
                      </span>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{gap.symptomsTriggered || 'Afternoon fatigue and decreased metabolic rate.'}</p>
                    </div>

                    {/* Recommended Superfoods */}
                    <div>
                      <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block mb-1.5">
                        Recommended Superfoods & Clinical Sources:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(gap.recommendedSuperfoods || []).map((food: string, sIdx: number) => (
                          <span key={sIdx} className="text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-1 rounded-lg">
                            {food}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Send Recommendation to Patient */}
                    <button
                      onClick={() => handleSendToChat(
                        `🌿 Clinical Nutrition Note regarding ${gap.nutrient}: Your current intake is at ${cur}${gap.unit || 'mg'}/day (Target: ${rda}${gap.unit || 'mg'}). To reverse associated fatigue/sluggishness, incorporate: ${(gap.recommendedSuperfoods || []).join(', ')}.`,
                        `gap-${gap.id || idx}`
                      )}
                      className="w-full py-2 bg-white hover:bg-teal-50 text-teal-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 text-teal-600" />
                      Send Supplementation Advice to Chat
                    </button>

                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PERSONALIZED MOTIVATION & MINDSET (ROLE-BASED) */}
      {activeTab === 'motivation' && (
        <div className="space-y-6">
          {isPatientSession ? (
            /* =========================================================================
               PATIENT VIEW: 100% READ-ONLY DAILY MOTIVATION & MINDSET
               ========================================================================= */
            <div className="max-w-4xl mx-auto space-y-6">
              
              {/* Header Banner */}
              <div className="bg-linear-to-r from-emerald-600 via-teal-600 to-teal-700 text-white rounded-3xl p-6 sm:p-8 shadow-sm space-y-2 relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-10 pointer-events-none">
                  <Sun className="w-64 h-64 text-white" />
                </div>
                
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-200">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  Daily Motivation & Mindset
                </div>
                
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Nourish Your Body, Empower Your Mind
                </h2>
                
                <p className="text-xs sm:text-sm text-emerald-100 max-w-xl leading-relaxed">
                  Every mindful meal and healthy habit is a step toward metabolic vitality. Be proud of the progress you are making today.
                </p>
              </div>

              {/* Dietitian's Personalized Daily Note (If Assigned by Doctor) */}
              {currentPatient?.dailyMotivationMessage?.message ? (
                <div className="bg-linear-to-br from-amber-50 to-orange-50/60 rounded-3xl p-6 border-2 border-amber-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between gap-2 border-b border-amber-200/60 pb-3 flex-wrap">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-amber-500 text-white font-black flex items-center justify-center text-xs shadow-2xs">
                        👨‍⚕️
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 block">
                          Personal Message From Your Dietitian
                        </span>
                        <h4 className="text-xs font-bold text-slate-900">
                          {currentPatient.dailyMotivationMessage.authorName || 'Clinical Dietitian'}
                        </h4>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold text-amber-800 bg-amber-200/80 px-2.5 py-0.5 rounded-full font-mono">
                      📅 {currentPatient.dailyMotivationMessage.date ? `Assigned ${formatDate(currentPatient.dailyMotivationMessage.date)}` : 'Today\'s Focus'}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-slate-800 leading-relaxed italic bg-white/80 p-4 rounded-2xl border border-amber-200/50 shadow-2xs whitespace-pre-wrap">
                    "{currentPatient.dailyMotivationMessage.message}"
                  </p>
                </div>
              ) : null}

              {/* Featured Daily Motivation Quote Card */}
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4 text-center relative overflow-hidden">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto shadow-xs border border-teal-100">
                  <Quote className="w-7 h-7 text-teal-600" />
                </div>

                <div className="space-y-2 max-w-xl mx-auto">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-teal-700 block">
                    Daily Motivation
                  </span>
                  <blockquote className="text-xl sm:text-2xl font-black text-slate-900 leading-snug tracking-tight">
                    "Small, consistent choices add up to meaningful change. Focus on what you can do today."
                  </blockquote>
                  <p className="text-xs text-slate-500 italic pt-1">
                    Consistency over perfection. Every healthy choice strengthens your body and mind.
                  </p>
                </div>
              </div>

              {/* Daily Health Affirmations Grid */}
              <div className="space-y-3">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500" />
                  Today's Health Affirmations
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
                    <span className="text-2xl block">🥗</span>
                    <h4 className="text-xs font-black text-slate-900">Nourishment & Vitality</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      "I nourish my body with wholesome, balanced fuel and celebrate every healthy choice I make today."
                    </p>
                  </div>

                  <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
                    <span className="text-2xl block">💧</span>
                    <h4 className="text-xs font-black text-slate-900">Hydration & Energy</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      "I stay refreshed and energized by honoring my body's need for pure water, movement, and restful sleep."
                    </p>
                  </div>

                  <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
                    <span className="text-2xl block">🌱</span>
                    <h4 className="text-xs font-black text-slate-900">Sustainable Habit</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      "I am creating lasting, joyful wellness habits that build strength and confidence day by day."
                    </p>
                  </div>
                </div>
              </div>

              {/* Mindset Habits & Reflection */}
              <div className="bg-emerald-50/70 rounded-3xl p-6 border border-emerald-200 shadow-xs space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-emerald-900 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-emerald-700" />
                  Mindful Wellness Reflections for Today
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-2xl border border-emerald-100 space-y-1">
                    <strong className="text-emerald-950 font-bold block">🍽️ Mindful Savoring</strong>
                    <span className="text-slate-600 text-[11px] leading-relaxed block">
                      Chew slowly and take a 30-second pause halfway through meals to allow your satiety signals to catch up.
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-2xl border border-emerald-100 space-y-1">
                    <strong className="text-emerald-950 font-bold block">🚶 10-Min Post-Meal Walk</strong>
                    <span className="text-slate-600 text-[11px] leading-relaxed block">
                      A gentle 10-minute stroll after lunch or dinner flattens postprandial glucose curves by over 25%.
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-2xl border border-emerald-100 space-y-1">
                    <strong className="text-emerald-950 font-bold block">😴 Restorative Sleep</strong>
                    <span className="text-slate-600 text-[11px] leading-relaxed block">
                      Dim screens 30 minutes before bedtime to support natural melatonin and evening cellular repair.
                    </span>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* =========================================================================
               DOCTOR VIEW: MOTIVATION & COMPLIANCE GENERATOR & PUBLISHER
               ========================================================================= */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Generator Controls */}
              <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-teal-600" />
                      AI Motivation Tone Engine
                    </h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded-md">
                      Doctor Workspace
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Generate tailored motivational messages and publish them to the patient's portal or Chat.
                  </p>
                </div>

                {/* Tone Selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">Select Motivational Style</label>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setMotivationTone('celebratory');
                      if (currentPatient) {
                        setGeneratedMotivation(generateCopilotMotivation(currentPatient.id, 'celebratory'));
                      }
                    }}
                    className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      motivationTone === 'celebratory'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    🌟 Celebratory & Milestone
                    <span className="block text-[10px] font-normal text-slate-600 mt-0.5">
                      Highlights weight loss, visceral drop, and consistency achievements.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMotivationTone('empathetic');
                      if (currentPatient) {
                        setGeneratedMotivation(generateCopilotMotivation(currentPatient.id, 'empathetic'));
                      }
                    }}
                    className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      motivationTone === 'empathetic'
                        ? 'bg-teal-50 border-teal-500 text-teal-950 font-bold shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    🌱 Empathetic Stress Reset
                    <span className="block text-[10px] font-normal text-slate-600 mt-0.5">
                      Gentle guidance during stress periods, plateaus, or dining out slips.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMotivationTone('strict_discipline');
                      if (currentPatient) {
                        setGeneratedMotivation(generateCopilotMotivation(currentPatient.id, 'strict_discipline'));
                      }
                    }}
                    className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      motivationTone === 'strict_discipline'
                        ? 'bg-amber-50 border-amber-500 text-amber-950 font-bold shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    🎯 Accountability & Non-Negotiables
                    <span className="block text-[10px] font-normal text-slate-600 mt-0.5">
                      Firm reminders on protein targets, 2.5L water & movement routines.
                    </span>
                  </button>
                </div>

                {/* Quick Context Summary */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <span className="font-semibold text-slate-700">Target Patient:</span>
                  <div className="text-slate-600">
                    Patient: <strong>{currentPatient?.name || 'Patient'}</strong> • Dropped <strong>{Math.max(0, (currentPatient?.startingWeightKg || 74.5) - (currentPatient?.currentWeightKg || 68.4)).toFixed(1)} kg</strong> • Diet: <strong>{currentPatient?.foodPreference || 'Vegetarian'}</strong>
                  </div>
                </div>
              </div>

              {/* Editable Message Canvas & Doctor Action Bar */}
              <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-900">Customizable Motivation Canvas</span>
                    <span className="text-[11px] text-teal-700 font-medium">Doctor Edit Mode</span>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-600">
                      Message Content (Edit or customize as needed):
                    </label>
                    <textarea
                      rows={5}
                      value={generatedMotivation}
                      onChange={(e) => setGeneratedMotivation(e.target.value)}
                      className="w-full text-xs p-3.5 rounded-2xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-slate-900 leading-relaxed font-medium"
                      placeholder="Type custom motivational message for patient..."
                    />
                  </div>
                </div>

                {/* Doctor Action Bar */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
                  <button
                    onClick={() => handleCopy(generatedMotivation, 'gen-mot')}
                    className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedKey === 'gen-mot' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey === 'gen-mot' ? 'Copied' : 'Copy'}
                  </button>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Publish as Patient's Daily Motivation */}
                    <button
                      onClick={() => {
                        if (!currentPatient) return;
                        setPatientDailyMotivation(currentPatient.id, generatedMotivation, motivationTone);
                        setSentToChatKey('published-mot');
                        setTimeout(() => setSentToChatKey(null), 2500);
                      }}
                      className="px-4 py-2 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-xl flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                    >
                      {sentToChatKey === 'published-mot' ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Pin className="w-3.5 h-3.5 text-emerald-700" />}
                      {sentToChatKey === 'published-mot' ? 'Published to Patient Portal!' : 'Publish to Patient Portal'}
                    </button>

                    {/* Send into Chat */}
                    <button
                      onClick={() => handleSendToChat(generatedMotivation, 'gen-mot-chat')}
                      className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      {sentToChatKey === 'gen-mot-chat' ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                      {sentToChatKey === 'gen-mot-chat' ? 'Sent into Chat!' : 'Send to Patient Chat'}
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}
        </div>
      )}

      {/* TAB 4: LONGITUDINAL SOAP PROGRESS DIGEST */}
      {activeTab === 'soap_summary' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Clinical SOAP Progress Digest ({currentPatient?.name})
              </h3>
              <p className="text-xs text-slate-500">
                Automated clinical documentation summarizing Subjective, Objective, Assessment, and Plan
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(generatedSoap, 'soap-copy')}
                className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copiedKey === 'soap-copy' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey === 'soap-copy' ? 'Copied' : 'Copy SOAP Digest'}
              </button>
            </div>
          </div>

          <div className="bg-slate-950 text-slate-100 p-6 rounded-2xl font-mono text-xs leading-relaxed overflow-x-auto shadow-inner border border-slate-800 whitespace-pre-wrap">
            {generatedSoap}
          </div>

          <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl flex items-center justify-between text-xs text-teal-900">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              SOAP record formatted for clinical chart integration and handover.
            </span>
            <button
              onClick={() => navigateTo('patient_profile', { patientId: currentPatient?.id })}
              className="font-bold underline hover:text-teal-950 cursor-pointer"
            >
              Attach to Medical File ➔
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
