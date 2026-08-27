import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  AreaChart, 
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { 
  Activity, 
  TrendingUp, 
  ShieldCheck, 
  HeartPulse, 
  Droplet, 
  Zap, 
  Award,
  Sparkles,
  Info
} from 'lucide-react';
import { useNutrition } from '../context/NutritionContext';
import { calculateBmi } from '../utils/nutritionCalculators';

export const AnalyticsView: React.FC = () => {
  const { profile, weeklyHistory, todayMeals, waterMl } = useNutrition();

  const bmi = calculateBmi(profile.weightKg, profile.heightCm);

  // Calorie & macro adherence history
  const calorieTrendData = [
    { day: 'Mon', calories: 1980, target: profile.dailyCalorieTarget, protein: 135, carbs: 175, fat: 65 },
    { day: 'Tue', calories: 2020, target: profile.dailyCalorieTarget, protein: 140, carbs: 180, fat: 68 },
    { day: 'Wed', calories: 1940, target: profile.dailyCalorieTarget, protein: 132, carbs: 165, fat: 64 },
    { day: 'Thu', calories: 1990, target: profile.dailyCalorieTarget, protein: 138, carbs: 178, fat: 62 },
    { day: 'Fri', calories: 2050, target: profile.dailyCalorieTarget, protein: 145, carbs: 185, fat: 70 },
    { day: 'Sat', calories: 1920, target: profile.dailyCalorieTarget, protein: 130, carbs: 160, fat: 60 },
    { 
      day: 'Sun (Today)', 
      calories: todayMeals.reduce((s, m) => s + m.totalCalories, 0) || 1950, 
      target: profile.dailyCalorieTarget, 
      protein: todayMeals.reduce((s, m) => s + m.totalProtein, 0) || 135, 
      carbs: todayMeals.reduce((s, m) => s + m.totalCarbs, 0) || 170, 
      fat: todayMeals.reduce((s, m) => s + m.totalFat, 0) || 62 
    },
  ];

  // Micronutrient Radar Data
  const micronutrientData = [
    { nutrient: 'Vitamin C', coverage: 95, fullMark: 100 },
    { nutrient: 'Vitamin D', coverage: 82, fullMark: 100 },
    { nutrient: 'Vitamin B12', coverage: 98, fullMark: 100 },
    { nutrient: 'Iron', coverage: 88, fullMark: 100 },
    { nutrient: 'Calcium', coverage: 84, fullMark: 100 },
    { nutrient: 'Magnesium', coverage: 92, fullMark: 100 },
    { nutrient: 'Potassium', coverage: 90, fullMark: 100 },
    { nutrient: 'Zinc', coverage: 86, fullMark: 100 },
  ];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#183153] text-white">
            Clinical Health Analytics
          </span>
          <span className="text-xs font-semibold text-[#6BBF59]">Biomarker & Metabolic Surveillance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#183153] font-['Poppins'] mt-1">
          Metabolic & Nutritional Trends
        </h1>
        <p className="text-sm text-slate-600">
          7-Day adherence records, micronutrient density radar, and metabolic projections.
        </p>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="medical-card p-5">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">7-Day Adherence</span>
            <Award className="w-4 h-4 text-[#6BBF59]" />
          </div>
          <p className="text-2xl font-extrabold text-[#183153]">94.8%</p>
          <p className="text-[11px] text-[#6BBF59] font-semibold mt-1">Within optimal ±5% deficit band</p>
        </div>

        <div className="medical-card p-5">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Daily Protein</span>
            <Zap className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-[#183153]">137.5g</p>
          <p className="text-[11px] text-slate-500 font-semibold mt-1">Target: {profile.proteinTargetGrams}g (1.9g/kg lean mass)</p>
        </div>

        <div className="medical-card p-5">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Glycemic Stability</span>
            <ShieldCheck className="w-4 h-4 text-[#6BBF59]" />
          </div>
          <p className="text-2xl font-extrabold text-[#183153]">92 / 100</p>
          <p className="text-[11px] text-[#6BBF59] font-semibold mt-1">Low insulin excursion index</p>
        </div>

        <div className="medical-card p-5">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Body Mass Index</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-[#183153]">{bmi.bmi}</p>
          <p className="text-[11px] text-[#6BBF59] font-semibold mt-1">{bmi.category} (Weight: {profile.weightKg} kg)</p>
        </div>

      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Weekly Calorie Ingestion vs Target (7 Cols) */}
        <div className="lg:col-span-7 medical-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-base font-bold text-[#183153] font-['Poppins']">
                  Weekly Energy Intake vs Target
                </h2>
                <p className="text-xs text-slate-500">Adherence to daily {profile.dailyCalorieTarget} kcal target</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-[#183153]">
                  <span className="w-3 h-3 rounded-full bg-[#183153]" /> Intake
                </span>
                <span className="flex items-center gap-1.5 text-[#6BBF59]">
                  <span className="w-3 h-3 rounded-full bg-[#6BBF59]" /> Target
                </span>
              </div>
            </div>

            <div className="h-64 mt-4 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={calorieTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} domain={[1200, 2400]} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#183153', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="calories" fill="#183153" radius={[6, 6, 0, 0]} maxBarSize={36} />
                  <Bar dataKey="target" fill="#6BBF59" radius={[6, 6, 0, 0]} maxBarSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Average deficit: <strong>-380 kcal/day</strong></span>
            <span className="text-[#6BBF59] font-bold">Target Weight Progress: On Track</span>
          </div>
        </div>

        {/* Micronutrient Density Radar (5 Cols) */}
        <div className="lg:col-span-5 medical-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-base font-bold text-[#183153] font-['Poppins']">
                  Micronutrient Sufficiency
                </h2>
                <p className="text-xs text-slate-500">Vitamin & mineral RDA saturation</p>
              </div>
              <span className="text-xs font-bold text-[#6BBF59] bg-[#F8FFF8] border border-[#6BBF59]/30 px-2 py-1 rounded-lg">
                89% Avg
              </span>
            </div>

            <div className="h-64 mt-2 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={micronutrientData} outerRadius="75%">
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="nutrient" tick={{ fontSize: 10, fill: '#183153', fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Sufficiency" dataKey="coverage" stroke="#6BBF59" fill="#6BBF59" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Lowest: Vitamin D (82% RDA)</span>
            <span className="text-[#183153] font-semibold">Highest: Vit B12 (98%)</span>
          </div>
        </div>

      </div>

      {/* Macronutrient Stack Area Trend */}
      <div className="medical-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-[#183153] font-['Poppins']">
              7-Day Macronutrient Distribution (Grams)
            </h2>
            <p className="text-xs text-slate-500">Balanced macronutrient energy partitioning over time</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-blue-600">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Protein
            </span>
            <span className="flex items-center gap-1.5 text-amber-500">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Carbs
            </span>
            <span className="flex items-center gap-1.5 text-emerald-600">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> Fats
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={calorieTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#183153', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="protein" stackId="1" stroke="#2563EB" fill="#3B82F6" fillOpacity={0.7} />
              <Area type="monotone" dataKey="carbs" stackId="1" stroke="#D97706" fill="#F59E0B" fillOpacity={0.7} />
              <Area type="monotone" dataKey="fat" stackId="1" stroke="#059669" fill="#10B981" fillOpacity={0.7} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
