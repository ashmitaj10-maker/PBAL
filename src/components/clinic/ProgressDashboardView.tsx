import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { 
  TrendingDown, 
  Ruler, 
  Scale, 
  Camera, 
  Calendar, 
  Award, 
  Sparkles, 
  ArrowDownRight, 
  Plus, 
  ChevronRight, 
  Activity, 
  CheckCircle2, 
  FileText,
  User
} from 'lucide-react';
import { BodyMeasurementsRecord } from '../../types/clinic';
import { PatientSelector } from './PatientSelector';
import { formatDate } from '../../utils/dateUtils';

type MetricTab = 'weight_bmi' | 'waist_hip' | 'arms_chest' | 'all';
type DateFilter = '30d' | '90d' | '180d' | 'all';

export const ProgressDashboardView: React.FC = () => {
  const { 
    selectedPatient, 
    patients, 
    setSelectedPatientId, 
    getPatientMeasurements, 
    getPatientPhotos, 
    setIsMeasurementModalOpen,
    setIsPhotoModalOpen,
    navigateTo,
    isPatientSession 
  } = useClinic();

  const [activeTab, setActiveTab] = useState<MetricTab>('weight_bmi');
  const [dateFilter, setDateFilter] = useState<DateFilter>('90d');
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);

  const currentPatient = selectedPatient || patients[0];
  const measurements: BodyMeasurementsRecord[] = currentPatient ? getPatientMeasurements(currentPatient.id) : [];
  const photos = currentPatient ? getPatientPhotos(currentPatient.id) : [];

  // Filter measurements by date
  const now = new Date().getTime();
  const filteredMeasurements = measurements.filter(m => {
    if (dateFilter === 'all') return true;
    const itemTime = new Date(m.date).getTime();
    const daysDiff = (now - itemTime) / (1000 * 3600 * 24);
    if (dateFilter === '30d') return daysDiff <= 30;
    if (dateFilter === '90d') return daysDiff <= 90;
    if (dateFilter === '180d') return daysDiff <= 180;
    return true;
  });

  const latestMeas = measurements[measurements.length - 1] || {
    weightKg: currentPatient?.currentWeightKg || 68.4,
    bmi: 24.2,
    waistInches: 31.0,
    hipInches: 37.5,
    chestInches: 36.0,
    armInches: 12.0,
    thighInches: 22.0,
    bodyFatPercentage: 26.5,
    date: '2026-08-20'
  };

  const initialMeas = measurements[0] || {
    weightKg: currentPatient?.startingWeightKg || 74.5,
    bmi: 26.4,
    waistInches: 35.5,
    hipInches: 40.5,
    chestInches: 38.0,
    armInches: 13.5,
    thighInches: 24.0,
    bodyFatPercentage: 31.0,
    date: '2026-06-01'
  };

  // Deltas (safely calculated only when measurements exist)
  const totalWeightLoss = (initialMeas.weightKg !== undefined && latestMeas.weightKg !== undefined)
    ? Number((initialMeas.weightKg - latestMeas.weightKg).toFixed(1))
    : null;
  const totalWaistReduction = (initialMeas.waistInches !== undefined && latestMeas.waistInches !== undefined)
    ? Number((initialMeas.waistInches - latestMeas.waistInches).toFixed(1))
    : null;
  const totalHipReduction = (initialMeas.hipInches !== undefined && latestMeas.hipInches !== undefined)
    ? Number((initialMeas.hipInches - latestMeas.hipInches).toFixed(1))
    : null;
  const totalArmReduction = (initialMeas.armInches !== undefined && latestMeas.armInches !== undefined)
    ? Number((initialMeas.armInches - latestMeas.armInches).toFixed(1))
    : null;
  const totalFatLoss = (initialMeas.bodyFatPercentage !== undefined && latestMeas.bodyFatPercentage !== undefined)
    ? Number((initialMeas.bodyFatPercentage - latestMeas.bodyFatPercentage).toFixed(1))
    : null;

  const waistToHipRatio = (latestMeas.waistInches !== undefined && latestMeas.hipInches !== undefined && latestMeas.hipInches > 0)
    ? Number((latestMeas.waistInches / latestMeas.hipInches).toFixed(2))
    : null;
  const isOptimalWHR = waistToHipRatio !== null && waistToHipRatio <= (currentPatient?.gender === 'female' ? 0.80 : 0.90);

  // SVG Chart Calculation Helpers
  const chartData = filteredMeasurements.length > 0 ? filteredMeasurements : [initialMeas, latestMeas];
  const chartWidth = 700;
  const chartHeight = 220;
  const paddingX = 45;
  const paddingY = 30;

  const getMetricKey = () => {
    switch (activeTab) {
      case 'weight_bmi': return 'weightKg';
      case 'waist_hip': return 'waistInches';
      case 'arms_chest': return 'armInches';
      default: return 'weightKg';
    }
  };

  const getMetricLabel = () => {
    switch (activeTab) {
      case 'weight_bmi': return 'Weight (kg)';
      case 'waist_hip': return 'Waist (Inches)';
      case 'arms_chest': return 'Arm Circumference (Inches)';
      default: return 'Weight (kg)';
    }
  };

  const currentMetricKey = getMetricKey();
  const values = chartData.map(d => Number((d as any)[currentMetricKey] || 0));
  const minVal = Math.min(...values) - 1;
  const maxVal = Math.max(...values) + 1;
  const range = Math.max(maxVal - minVal, 1);

  const getCoordinates = (index: number, val: number) => {
    const x = paddingX + (index / Math.max(1, chartData.length - 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - ((val - minVal) / range) * (chartHeight - paddingY * 2);
    return { x, y };
  };

  const points = chartData.map((d, idx) => {
    const val = Number((d as any)[currentMetricKey] || 0);
    return getCoordinates(idx, val);
  });

  const pathD = points.reduce((acc, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaD = points.length > 0 
    ? `${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`
    : '';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header & Patient Actions */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600 mb-1">
            <TrendingDown className="w-4 h-4" />
            {isPatientSession ? 'My Personal Health Transformation' : 'Patient Clinical Engagement • Phase 3'}
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            {isPatientSession ? 'My Scale Progress & Body Transformation' : 'Progress & Body Composition Dashboard'}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {isPatientSession 
              ? 'Visual scale weight curve, circumference reductions, and metabolic milestones tracked over time.'
              : 'Longitudinal anthropometric tracking, visceral fat reduction, and transformation milestones.'
            }
          </p>
        </div>

        {/* Patient Switcher & CTA Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {!isPatientSession && <PatientSelector />}

          {!isPatientSession && (
            <button
              onClick={() => setIsMeasurementModalOpen(true)}
              className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 rounded-xl shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Log Measurements
            </button>
          )}

          <button
            onClick={() => navigateTo('patient_chat')}
            className="px-4 py-2 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Activity className="w-4 h-4" />
            <span>Discuss with Dietitian</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid: Net Changes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        {/* Weight Card */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Current Weight</span>
            <Scale className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {latestMeas.weightKg !== undefined ? latestMeas.weightKg : '—'} 
            {latestMeas.weightKg !== undefined && <span className="text-xs font-normal text-slate-500"> kg</span>}
          </div>
          {totalWeightLoss !== null ? (
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 mt-1">
              <ArrowDownRight className="w-3.5 h-3.5" />
              {totalWeightLoss > 0 ? `-${totalWeightLoss} kg net` : `${totalWeightLoss} kg`}
            </div>
          ) : (
            <div className="text-xs text-slate-400 mt-1 font-medium">Logged entry</div>
          )}
        </div>

        {/* Waist Card */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Waistline</span>
            <Ruler className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {latestMeas.waistInches !== undefined ? `${latestMeas.waistInches}"` : '—'} 
            {latestMeas.waistInches !== undefined && <span className="text-xs font-normal text-slate-500"> ({Math.round(latestMeas.waistInches * 2.54)} cm)</span>}
          </div>
          {totalWaistReduction !== null ? (
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 mt-1">
              <ArrowDownRight className="w-3.5 h-3.5" />
              {totalWaistReduction > 0 ? `-${totalWaistReduction}" lost` : `${totalWaistReduction}"`}
            </div>
          ) : (
            <div className="text-xs text-slate-400 mt-1 font-medium">Optional metric</div>
          )}
        </div>

        {/* Hip Card */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Hip Width</span>
            <Ruler className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {latestMeas.hipInches !== undefined ? `${latestMeas.hipInches}"` : '—'} 
            {latestMeas.hipInches !== undefined && <span className="text-xs font-normal text-slate-500"> ({Math.round(latestMeas.hipInches * 2.54)} cm)</span>}
          </div>
          {totalHipReduction !== null ? (
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 mt-1">
              <ArrowDownRight className="w-3.5 h-3.5" />
              {totalHipReduction > 0 ? `-${totalHipReduction}" lost` : `${totalHipReduction}"`}
            </div>
          ) : (
            <div className="text-xs text-slate-400 mt-1 font-medium">Optional metric</div>
          )}
        </div>

        {/* BMI Card */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Clinical BMI</span>
            <Activity className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {latestMeas.bmi !== undefined ? latestMeas.bmi : '—'} 
            {latestMeas.bmi !== undefined && <span className="text-xs font-normal text-slate-500"> kg/m²</span>}
          </div>
          <div className="text-xs font-semibold text-slate-500 mt-1">
            {initialMeas.bmi !== undefined ? `Start: ${initialMeas.bmi} kg/m²` : 'Calculated when Wt/Ht entered'}
          </div>
        </div>

        {/* Arm / Bicep Card */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Arm / Bicep</span>
            <Ruler className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {latestMeas.armInches !== undefined ? `${latestMeas.armInches}"` : '—'}
          </div>
          {totalArmReduction !== null ? (
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 mt-1">
              <ArrowDownRight className="w-3.5 h-3.5" />
              {totalArmReduction > 0 ? `-${totalArmReduction}" toned` : `${totalArmReduction}"`}
            </div>
          ) : (
            <div className="text-xs text-slate-400 mt-1 font-medium">Optional metric</div>
          )}
        </div>

        {/* Body Fat % */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Body Fat %</span>
            <Sparkles className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {latestMeas.bodyFatPercentage !== undefined ? `${latestMeas.bodyFatPercentage}%` : '—'}
          </div>
          {totalFatLoss !== null ? (
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 mt-1">
              <ArrowDownRight className="w-3.5 h-3.5" />
              {totalFatLoss > 0 ? `-${totalFatLoss}% fat` : `${totalFatLoss}%`}
            </div>
          ) : (
            <div className="text-xs text-slate-400 mt-1 font-medium">Optional metric</div>
          )}
        </div>

      </div>

      {/* Main Graph & Diagnostics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Interactive Multi-Metric Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              {/* Metric Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => { setActiveTab('weight_bmi'); setSelectedPointIndex(null); }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    activeTab === 'weight_bmi' ? 'bg-white text-teal-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Weight (kg)
                </button>
                <button
                  onClick={() => { setActiveTab('waist_hip'); setSelectedPointIndex(null); }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    activeTab === 'waist_hip' ? 'bg-white text-teal-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Waistline (in)
                </button>
                <button
                  onClick={() => { setActiveTab('arms_chest'); setSelectedPointIndex(null); }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    activeTab === 'arms_chest' ? 'bg-white text-teal-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Arms & Limbs (in)
                </button>
              </div>

              {/* Date Filters */}
              <div className="flex items-center gap-1 text-xs">
                {(['30d', '90d', '180d', 'all'] as DateFilter[]).map(df => (
                  <button
                    key={df}
                    onClick={() => { setDateFilter(df); setSelectedPointIndex(null); }}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                      dateFilter === df ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {df === 'all' ? 'All' : df.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected point inspection banner */}
            <div className="mt-4 mb-2 flex items-center justify-between text-xs bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
              <span className="text-slate-600 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-teal-600" />
                {selectedPointIndex !== null 
                  ? `Selected Log: ${formatDate(chartData[selectedPointIndex]?.date)}` 
                  : `Showing ${chartData.length} records (${dateFilter.toUpperCase()})`}
              </span>
              <span className="font-bold text-slate-800">
                {selectedPointIndex !== null ? (
                  <span>
                    Weight: {chartData[selectedPointIndex]?.weightKg}kg • Waist: {chartData[selectedPointIndex]?.waistInches}&quot; • BMI: {chartData[selectedPointIndex]?.bmi}
                  </span>
                ) : (
                  <span>Net Trajectory: -{totalWeightLoss} kg ({(((totalWeightLoss || 0) / (initialMeas.weightKg || 1)) * 100).toFixed(1)}% body mass reduction)</span>
                )}
              </span>
            </div>

            {/* SVG Visualizer */}
            <div className="relative w-full overflow-x-auto py-2">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-56">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0d9488" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#0d9488" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                {[0.2, 0.4, 0.6, 0.8].map((ratio, idx) => {
                  const y = paddingY + ratio * (chartHeight - paddingY * 2);
                  const val = (maxVal - ratio * (maxVal - minVal)).toFixed(1);
                  return (
                    <g key={idx}>
                      <line x1={paddingX} y1={y} x2={chartWidth - paddingX} y2={y} stroke="#e2e8f0" strokeDasharray="3 3" />
                      <text x={paddingX - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#94a3b8">{val}</text>
                    </g>
                  );
                })}

                {/* Target baseline */}
                <line 
                  x1={paddingX} 
                  y1={chartHeight - paddingY - 15} 
                  x2={chartWidth - paddingX} 
                  y2={chartHeight - paddingY - 15} 
                  stroke="#10b981" 
                  strokeWidth="1.5" 
                  strokeDasharray="4 4" 
                />

                {/* Filled Area */}
                {areaD && <path d={areaD} fill="url(#chartGradient)" />}

                {/* Main Line */}
                {pathD && <path d={pathD} fill="none" stroke="#0d9488" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />}

                {/* Interactive Points */}
                {points.map((pt, idx) => {
                  const isSelected = selectedPointIndex === idx;
                  const record = chartData[idx];
                  const val = (record as any)[currentMetricKey];
                  return (
                    <g 
                      key={idx} 
                      className="cursor-pointer group"
                      onClick={() => setSelectedPointIndex(idx)}
                    >
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isSelected ? 7 : 5}
                        fill={isSelected ? '#0f766e' : '#0d9488'}
                        stroke="#ffffff"
                        strokeWidth="2"
                        className="transition-all hover:scale-125"
                      />
                      {/* Date label at bottom */}
                      <text 
                        x={pt.x} 
                        y={chartHeight - 8} 
                        textAnchor="middle" 
                        fontSize="9" 
                        fill="#64748b"
                        fontWeight={isSelected ? 'bold' : 'normal'}
                      >
                        {formatDate(record.date)}
                      </text>
                      {/* Value tag above point */}
                      <text 
                        x={pt.x} 
                        y={pt.y - 10} 
                        textAnchor="middle" 
                        fontSize="10" 
                        fontWeight="bold"
                        fill="#0f766e"
                      >
                        {val}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-teal-600 inline-block" />
              Recorded Patient Measurement
            </span>
            <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <span className="w-3 h-1 bg-emerald-500 inline-block rounded" />
              Clinical Target Baseline ({currentPatient?.targetWeightKg || 60} kg)
            </span>
          </div>

        </div>

        {/* Right 1 Col: Visceral Risk & WHR Assessment */}
        <div className="space-y-6">
          
          {/* WHR Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-600" />
                Waist-to-Hip Ratio (WHR)
              </h3>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                isOptimalWHR ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {isOptimalWHR ? 'Low Risk' : 'Moderate'}
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500 font-medium">Current Ratio</div>
                <div className="text-2xl font-black text-slate-900">{waistToHipRatio}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500 font-medium">Target Threshold</div>
                <div className="text-sm font-bold text-emerald-700">&le; {currentPatient?.gender === 'female' ? '0.80' : '0.90'}</div>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {isOptimalWHR 
                ? 'Excellent visceral fat distribution. Decreased cardiovascular and metabolic syndrome susceptibility.' 
                : 'Waist circumference indicates upper abdominal fat storage. Continue low glycemic dietary protocol.'}
            </p>

            {/* Quick Copilot Jump */}
            <button
              onClick={() => navigateTo('ai_copilot', { patientId: currentPatient?.id })}
              className="w-full py-2 bg-gradient-to-r from-teal-50 to-emerald-50 hover:from-teal-100 hover:to-emerald-100 text-teal-900 border border-teal-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              Ask AI Copilot to Analyze Progress
            </button>
          </div>

          {/* Transformation Teaser */}
          <div className="bg-gradient-to-br from-slate-900 to-teal-950 text-white rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-300 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5" />
                Transformation Photos
              </span>
              <span className="text-xs text-slate-300 font-mono">{photos.length} Captured</span>
            </div>

            {photos.length >= 2 ? (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="relative rounded-lg overflow-hidden border border-white/20">
                  <img src={photos[0].imageUrl} alt="Before" className="w-full h-24 object-cover" />
                  <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    Before ({photos[0].weightKg}kg)
                  </span>
                </div>
                <div className="relative rounded-lg overflow-hidden border border-teal-500/50">
                  <img src={photos[photos.length - 1].imageUrl} alt="Latest" className="w-full h-24 object-cover" />
                  <span className="absolute bottom-1 left-1 bg-teal-800/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    Latest ({photos[photos.length - 1].weightKg}kg)
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-white/5 rounded-xl text-center text-xs text-slate-300 border border-white/10">
                Upload front, side, and back photos to unlock comparative slider view.
              </div>
            )}

            <button
              onClick={() => navigateTo('progress_photos', { patientId: currentPatient?.id })}
              className="w-full py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              Open Before / After Comparison Studio
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* Milestone Badges & Patient Wins */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Clinical Milestones & Transformation Badges
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Automated positive reinforcement for clinical adherence and metrics</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            4 Milestones Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-emerald-950">5 kg Fat Loss Club</h4>
              <p className="text-[11px] text-emerald-800 mt-0.5">Successfully dropped {totalWeightLoss} kg of visceral mass.</p>
              <span className="inline-block mt-2 text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-300">
                Unlocked
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-950">Waist Trim Milestone</h4>
              <p className="text-[11px] text-amber-800 mt-0.5">Reduced waistline by {totalWaistReduction} inches from baseline.</p>
              <span className="inline-block mt-2 text-[10px] font-bold text-amber-700 bg-white px-2 py-0.5 rounded border border-amber-300">
                Unlocked
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/50 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-teal-950">Insulin Sensitivity Rebound</h4>
              <p className="text-[11px] text-teal-800 mt-0.5">Glycemic markers normal with 0 mid-day energy dips.</p>
              <span className="inline-block mt-2 text-[10px] font-bold text-teal-700 bg-white px-2 py-0.5 rounded border border-teal-300">
                Active
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-purple-950">14-Day Perfect Logging</h4>
              <p className="text-[11px] text-purple-800 mt-0.5">Consistent water intake & meal compliance.</p>
              <span className="inline-block mt-2 text-[10px] font-bold text-purple-700 bg-white px-2 py-0.5 rounded border border-purple-300">
                Streak 14d
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Anthropometric Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Historical Anthropometric Logs</h3>
            <p className="text-xs text-slate-500">Full chronology of verified clinic measurement entries</p>
          </div>
          <button
            onClick={() => setIsMeasurementModalOpen(true)}
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Entry
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Weight (kg)</th>
                <th className="px-4 py-3">BMI</th>
                <th className="px-4 py-3">Waist (in)</th>
                <th className="px-4 py-3">Hip (in)</th>
                <th className="px-4 py-3">Chest (in)</th>
                <th className="px-4 py-3">Arm (in)</th>
                <th className="px-4 py-3">Body Fat</th>
                <th className="px-4 py-3">Clinical Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(measurements || []).map((m, idx) => {
                const prev = (measurements || [])[idx - 1];
                const weightDiff = (prev && prev.weightKg !== undefined && m.weightKg !== undefined) 
                  ? (m.weightKg - prev.weightKg).toFixed(1) 
                  : null;
                return (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-900 whitespace-nowrap">{formatDate(m.date)}</td>
                    <td className="px-4 py-3 font-bold text-slate-900 whitespace-nowrap">
                      {m.weightKg !== undefined ? `${m.weightKg} kg` : '—'}
                      {weightDiff !== null && Number(weightDiff) !== 0 && (
                        <span className={`ml-1.5 text-[10px] font-bold ${Number(weightDiff) < 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          ({Number(weightDiff) > 0 ? `+${weightDiff}` : weightDiff})
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-700 font-mono">{m.bmi !== undefined ? m.bmi : '—'}</td>
                    <td className="px-4 py-3 text-slate-800 font-semibold">{m.waistInches !== undefined ? `${m.waistInches}" (${Math.round(m.waistInches * 2.54)}cm)` : '—'}</td>
                    <td className="px-4 py-3 text-slate-800">{m.hipInches !== undefined ? `${m.hipInches}"` : '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{m.chestInches !== undefined ? `${m.chestInches}"` : '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{m.armInches !== undefined ? `${m.armInches}"` : '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{m.bodyFatPercentage !== undefined ? `${m.bodyFatPercentage}%` : '—'}</td>
                    <td className="px-4 py-3 text-slate-500 max-w-xs truncate">{m.notes || 'Routine follow-up entry.'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
