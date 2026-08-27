import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  Utensils, 
  Plus, 
  RefreshCw,
  Flame,
  Dna,
  Wheat,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useNutrition } from '../context/NutritionContext';
import { analyzeMealApi, AnalyzeMealResponse } from '../services/api';
import { MealType, FoodItem } from '../types';

export const MealScannerView: React.FC = () => {
  const { profile, addMealEntry, setActiveTab } = useNutrition();

  const [promptInput, setPromptInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [mealType, setMealType] = useState<MealType>('lunch');
  const [isLoading, setIsLoading] = useState(false);
  const [analyzedResult, setAnalyzedResult] = useState<AnalyzeMealResponse | null>(null);
  const [portionScale, setPortionScale] = useState<number>(1.0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  // Preset sample meals for instant testing
  const samplePresets = [
    { title: "Grilled Salmon Quinoa Bowl", prompt: "160g wild grilled salmon, 1 cup cooked quinoa, 2 cups baby spinach, 1/2 avocado, 1 tbsp olive oil, lemon" },
    { title: "Pasture Egg Omelette & Avocado Toast", prompt: "3 pasture-raised eggs, fresh baby spinach, 30g feta cheese, 1 slice sourdough toast with 1/3 avocado" },
    { title: "Greek Yogurt Berry Parfait", prompt: "1 cup Greek yogurt 2%, 1/2 cup wild blueberries, 1 tbsp chia seeds, 15g walnuts, cinnamon" },
    { title: "Grass-Fed Steak & Asparagus", prompt: "180g grass-fed sirloin steak, 12 asparagus spears, 1 baked medium sweet potato, 1 tbsp olive oil" }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMimeType(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Camera access failed", err);
      setIsCameraActive(false);
      setErrorMsg("Camera permission not granted or device camera unavailable.");
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setSelectedImage(dataUrl);
      setMimeType('image/jpeg');
    }
    // Stop camera stream
    const stream = videoRef.current.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraActive(false);
  };

  const handleAnalyze = async () => {
    if (!promptInput && !selectedImage) {
      setErrorMsg("Please provide a food description or upload a meal image.");
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);

    try {
      const result = await analyzeMealApi({
        prompt: promptInput || undefined,
        imageBase64: selectedImage || undefined,
        mimeType: mimeType,
        mealType: mealType,
        userContext: profile,
      });

      setAnalyzedResult(result);
      setPortionScale(1.0);
    } catch (err: any) {
      console.error("Analysis error:", err);
      setErrorMsg("Could not analyze meal. Please check your prompt and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogMeal = () => {
    if (!analyzedResult) return;

    const scaledItem: FoodItem = {
      id: "item-" + Date.now(),
      name: analyzedResult.name,
      portion: `${Math.round(analyzedResult.portionGrams * portionScale)}g serving (${portionScale}x standard)`,
      portionGrams: Math.round(analyzedResult.portionGrams * portionScale),
      calories: Math.round(analyzedResult.calories * portionScale),
      protein: Math.round(analyzedResult.protein * portionScale * 10) / 10,
      carbs: Math.round(analyzedResult.carbs * portionScale * 10) / 10,
      fat: Math.round(analyzedResult.fat * portionScale * 10) / 10,
      fiber: Math.round(analyzedResult.fiber * portionScale * 10) / 10,
      sugar: analyzedResult.sugar ? Math.round(analyzedResult.sugar * portionScale) : undefined,
      sodium: analyzedResult.sodium ? Math.round(analyzedResult.sodium * portionScale) : undefined,
      glycemicIndex: analyzedResult.glycemicIndex,
      glycemicLoad: analyzedResult.glycemicLoad ? Math.round(analyzedResult.glycemicLoad * portionScale) : undefined,
      healthScore: analyzedResult.healthScore,
      allergens: analyzedResult.allergens,
      clinicalInsights: analyzedResult.clinicalInsights,
      imageUrl: selectedImage || undefined,
    };

    addMealEntry({
      mealType: mealType,
      items: [scaledItem],
      totalCalories: scaledItem.calories,
      totalProtein: scaledItem.protein,
      totalCarbs: scaledItem.carbs,
      totalFat: scaledItem.fat,
      totalFiber: scaledItem.fiber,
      notes: `AI Analyzed (${analyzedResult.name})`,
      photoUrl: selectedImage || undefined,
    });

    // Trigger celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6BBF59', '#183153', '#4CAF50']
    });

    // Reset scanner and redirect to dashboard
    setTimeout(() => {
      setActiveTab('dashboard');
    }, 600);
  };

  // Scaled nutritional values
  const scaledCalories = analyzedResult ? Math.round(analyzedResult.calories * portionScale) : 0;
  const scaledProtein = analyzedResult ? Math.round(analyzedResult.protein * portionScale * 10) / 10 : 0;
  const scaledCarbs = analyzedResult ? Math.round(analyzedResult.carbs * portionScale * 10) / 10 : 0;
  const scaledFat = analyzedResult ? Math.round(analyzedResult.fat * portionScale * 10) / 10 : 0;
  const scaledFiber = analyzedResult ? Math.round(analyzedResult.fiber * portionScale * 10) / 10 : 0;

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#183153] text-white">
              Multimodal Vision AI
            </span>
            <span className="text-xs font-semibold text-[#6BBF59]">Powered by Gemini 3.7 Flash</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#183153] font-['Poppins'] mt-1">
            AI Meal Scanner & Clinical Breakdown
          </h1>
          <p className="text-sm text-slate-600">
            Upload food photos or type your meal to instantly estimate calories, macros, micronutrient density, and glycemic impact.
          </p>
        </div>

        {/* Meal Category Selector */}
        <div className="flex items-center gap-1.5 p-1.5 bg-[#F8FFF8] rounded-xl border border-[#6BBF59]/30">
          {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map((t) => (
            <button
              key={t}
              onClick={() => setMealType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                mealType === t
                  ? 'bg-[#183153] text-white shadow-sm'
                  : 'text-[#183153] hover:bg-[#6BBF59]/15'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Main Scanner Card & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Input & Photo Section (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="medical-card p-6 space-y-4">
            
            <h2 className="text-base font-bold text-[#183153]">1. Capture or Describe Food</h2>

            {/* Camera View or Photo Preview */}
            {isCameraActive ? (
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center">
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline />
                <button
                  onClick={capturePhoto}
                  className="absolute bottom-4 px-6 py-2.5 bg-[#6BBF59] text-white font-bold text-sm rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform"
                >
                  Snap Photo
                </button>
              </div>
            ) : selectedImage ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-video bg-slate-900 flex items-center justify-center group">
                <img src={selectedImage} alt="Uploaded meal" className="w-full h-full object-contain" />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/80 text-white rounded-xl text-xs font-semibold backdrop-blur-sm transition-colors"
                >
                  Change Photo
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <button
                  id="camera-open-btn"
                  onClick={startCamera}
                  className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-[#183153]/20 hover:border-[#6BBF59] hover:bg-[#F8FFF8] transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#183153]/5 group-hover:bg-[#6BBF59]/15 flex items-center justify-center text-[#183153] group-hover:text-[#6BBF59] transition-colors mb-2">
                    <Camera className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-[#183153]">Take Live Photo</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Use device camera</span>
                </button>

                <button
                  id="file-upload-btn"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-[#183153]/20 hover:border-[#6BBF59] hover:bg-[#F8FFF8] transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#183153]/5 group-hover:bg-[#6BBF59]/15 flex items-center justify-center text-[#183153] group-hover:text-[#6BBF59] transition-colors mb-2">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-[#183153]">Upload Image</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, WebP</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            )}

            {/* Food Text Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Food Name / Ingredients / Portions
              </label>
              <textarea
                id="food-description-input"
                rows={3}
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="e.g. 150g grilled wild salmon with 1 cup tri-color quinoa, steamed broccoli, and 1 tbsp cold-pressed olive oil"
                className="w-full p-3.5 rounded-xl border border-slate-200 focus:border-[#6BBF59] focus:ring-2 focus:ring-[#6BBF59]/20 outline-none text-sm text-[#183153] placeholder:text-slate-400 resize-none transition-all"
              />
            </div>

            {/* Quick Sample Presets */}
            <div className="space-y-1.5">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Or choose a clinical sample meal:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {samplePresets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setPromptInput(preset.prompt);
                      setSelectedImage(null);
                    }}
                    className="text-xs font-semibold px-2.5 py-1 bg-slate-50 hover:bg-[#F8FFF8] hover:border-[#6BBF59]/40 border border-slate-200 text-[#183153] rounded-lg transition-colors"
                  >
                    {preset.title}
                  </button>
                ))}
              </div>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-100">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Scan Action Button */}
            <button
              id="analyze-food-btn"
              onClick={handleAnalyze}
              disabled={isLoading}
              className="w-full py-3.5 bg-[#183153] hover:bg-[#244673] active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#6BBF59]" />
                  <span>Analyzing Nutritional Biochemistry...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#6BBF59]" />
                  <span>Analyze Nutrition with Gemini AI</span>
                </>
              )}
            </button>

          </div>
        </div>

        {/* AI Results & Scalable Portion Panel (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          {analyzedResult ? (
            <div className="medical-card p-6 space-y-5 animate-in fade-in duration-300">
              
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#6BBF59]/15 text-[#2E7D32]">
                      Nutritional Analysis Ready
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      GI: <strong className={analyzedResult.glycemicIndex === 'Low' ? 'text-[#6BBF59]' : 'text-amber-600'}>{analyzedResult.glycemicIndex}</strong>
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-[#183153] mt-1 font-['Poppins']">
                    {analyzedResult.name}
                  </h2>
                  <p className="text-xs text-slate-500">{analyzedResult.portion}</p>
                </div>

                <div className="text-right">
                  <span className="text-3xl font-extrabold text-[#183153]">{scaledCalories}</span>
                  <span className="text-xs font-bold text-slate-400 block">KCAL</span>
                </div>
              </div>

              {/* Interactive Portion Multiplier Slider */}
              <div className="p-4 rounded-xl bg-[#F8FFF8] border border-[#6BBF59]/25 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#183153]">
                  <span className="flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-[#6BBF59]" />
                    <span>Serving Portion Multiplier</span>
                  </span>
                  <span className="px-2 py-0.5 bg-white rounded-lg border border-[#6BBF59]/30 text-[#2E7D32]">
                    {portionScale}x ({Math.round(analyzedResult.portionGrams * portionScale)}g)
                  </span>
                </div>
                <input
                  type="range"
                  min="0.25"
                  max="3.0"
                  step="0.25"
                  value={portionScale}
                  onChange={(e) => setPortionScale(parseFloat(e.target.value))}
                  className="w-full accent-[#6BBF59] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                  <span>0.25x (Light Snack)</span>
                  <span>1.0x (Standard)</span>
                  <span>2.0x (Large)</span>
                  <span>3.0x (Double Feast)</span>
                </div>
              </div>

              {/* Macronutrient Grid */}
              <div className="grid grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Protein</p>
                  <p className="text-lg font-bold text-[#183153] mt-0.5">{scaledProtein}g</p>
                </div>
                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Carbs</p>
                  <p className="text-lg font-bold text-[#183153] mt-0.5">{scaledCarbs}g</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Lipids</p>
                  <p className="text-lg font-bold text-[#183153] mt-0.5">{scaledFat}g</p>
                </div>
                <div className="p-3 rounded-xl bg-[#F8FFF8] border border-[#6BBF59]/30 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#2E7D32]">Fiber</p>
                  <p className="text-lg font-bold text-[#183153] mt-0.5">{scaledFiber}g</p>
                </div>
              </div>

              {/* Micronutrients and Bio-availability */}
              {analyzedResult.micronutrients && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Key Micronutrients (% Daily Recommended Intake)
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {Object.entries(analyzedResult.micronutrients || {}).map(([key, val]) => {
                      if (val === undefined || typeof val !== 'number') return null;
                      const numVal = Number(val);
                      const formattedName = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                      return (
                        <div key={key} className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                          <p className="text-slate-500 truncate">{formattedName}</p>
                          <p className="font-bold text-[#183153]">{Math.round(numVal * portionScale)}% RDA</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Clinical Insights */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                <strong className="text-[#183153] block mb-1">Clinical Dietetic Note:</strong>
                {analyzedResult.clinicalInsights}
              </div>

              {/* Log Button */}
              <button
                id="log-scanned-meal-btn"
                onClick={handleLogMeal}
                className="w-full py-3.5 bg-[#6BBF59] hover:bg-[#5EAB4D] active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Log to Today's {mealType.toUpperCase()} ({scaledCalories} kcal)</span>
              </button>

            </div>
          ) : (
            <div className="medical-card p-10 flex flex-col items-center justify-center text-center text-slate-400 space-y-3 min-h-[380px]">
              <div className="w-16 h-16 rounded-2xl bg-[#F8FFF8] border border-[#6BBF59]/20 flex items-center justify-center text-[#6BBF59]">
                <Utensils className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-base text-[#183153]">Awaiting Meal Input</h3>
              <p className="text-xs text-slate-500 max-w-xs">
                Capture a photo or enter meal ingredients to view full biochemical macro and micronutrient analysis.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
