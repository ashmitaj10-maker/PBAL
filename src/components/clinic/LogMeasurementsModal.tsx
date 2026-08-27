import React, { useState, useEffect } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Ruler, X, Scale, Calendar, FileText, Activity, Sparkles, CheckCircle2, Info, HeartPulse } from 'lucide-react';
import { PatientSelector } from './PatientSelector';

export const LogMeasurementsModal: React.FC = () => {
  const { 
    isMeasurementModalOpen, 
    setIsMeasurementModalOpen, 
    selectedPatient, 
    patients, 
    addBodyMeasurement 
  } = useClinic();

  const [patientId, setPatientId] = useState<string>(selectedPatient?.id || patients[0]?.id || 'pat-1');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  // All Body Mass & Composition fields are stored as strings to support completely optional / empty inputs
  const [weightKg, setWeightKg] = useState<string>('');
  const [heightCm, setHeightCm] = useState<string>('');
  const [bodyFatPercentage, setBodyFatPercentage] = useState<string>('');
  const [muscleMassKg, setMuscleMassKg] = useState<string>('');
  const [visceralFat, setVisceralFat] = useState<string>('');
  const [waterPercentage, setWaterPercentage] = useState<string>('');
  const [boneMassKg, setBoneMassKg] = useState<string>('');

  // Circumference fields (All optional)
  const [waistInches, setWaistInches] = useState<string>('');
  const [hipInches, setHipInches] = useState<string>('');
  const [chestInches, setChestInches] = useState<string>('');
  const [armInches, setArmInches] = useState<string>('');
  const [thighInches, setThighInches] = useState<string>('');
  const [calfInches, setCalfInches] = useState<string>('');

  const [notes, setNotes] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);

  const currentPat = patients.find(p => p.id === patientId) || selectedPatient;

  // Initialize/reset when modal opens or patient changes
  useEffect(() => {
    if (currentPat) {
      setHeightCm(currentPat.heightCm ? String(currentPat.heightCm) : '');
      // If patient has existing weight, provide as quick starting reference or leave editable
      if (currentPat.currentWeightKg) {
        setWeightKg(String(currentPat.currentWeightKg));
      }
    }
  }, [patientId, currentPat?.id, isMeasurementModalOpen]);

  if (!isMeasurementModalOpen) return null;

  // Derived calculations: ONLY calculated if inputs are actually provided by doctor
  const numWeight = weightKg.trim() !== '' ? parseFloat(weightKg) : undefined;
  const numHeight = heightCm.trim() !== '' ? parseFloat(heightCm) : (currentPat?.heightCm || undefined);
  const heightM = numHeight ? numHeight / 100 : undefined;
  
  const calculatedBmi = (numWeight !== undefined && heightM !== undefined && heightM > 0) 
    ? Number((numWeight / (heightM * heightM)).toFixed(1)) 
    : undefined;

  const numWaist = waistInches.trim() !== '' ? parseFloat(waistInches) : undefined;
  const numHip = hipInches.trim() !== '' ? parseFloat(hipInches) : undefined;
  
  const waistToHipRatio = (numWaist !== undefined && numHip !== undefined && numHip > 0) 
    ? Number((numWaist / numHip).toFixed(2)) 
    : undefined;
  
  const getWhrStatus = (whr: number, gender: 'female' | 'male' | 'other' = 'female') => {
    if (gender === 'female') {
      if (whr <= 0.80) return { label: 'Optimal / Low Risk', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
      if (whr <= 0.85) return { label: 'Moderate Risk', color: 'text-amber-700 bg-amber-50 border-amber-200' };
      return { label: 'High Visceral Risk', color: 'text-rose-700 bg-rose-50 border-rose-200' };
    } else {
      if (whr <= 0.90) return { label: 'Optimal / Low Risk', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
      if (whr <= 0.95) return { label: 'Moderate Risk', color: 'text-amber-700 bg-amber-50 border-amber-200' };
      return { label: 'High Visceral Risk', color: 'text-rose-700 bg-rose-50 border-rose-200' };
    }
  };

  const whrStatus = waistToHipRatio !== undefined ? getWhrStatus(waistToHipRatio, currentPat?.gender) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Parse only filled fields; empty fields remain undefined without forced zeroes or placeholders
    addBodyMeasurement({
      patientId,
      date: date || new Date().toISOString().split('T')[0],
      weightKg: numWeight,
      heightCm: numHeight,
      bmi: calculatedBmi,
      bodyFatPercentage: bodyFatPercentage.trim() !== '' ? parseFloat(bodyFatPercentage) : undefined,
      muscleMassKg: muscleMassKg.trim() !== '' ? parseFloat(muscleMassKg) : undefined,
      visceralFat: visceralFat.trim() !== '' ? parseFloat(visceralFat) : undefined,
      waterPercentage: waterPercentage.trim() !== '' ? parseFloat(waterPercentage) : undefined,
      boneMassKg: boneMassKg.trim() !== '' ? parseFloat(boneMassKg) : undefined,
      waistInches: numWaist,
      waistCm: numWaist ? Math.round(numWaist * 2.54) : undefined,
      hipInches: numHip,
      chestInches: chestInches.trim() !== '' ? parseFloat(chestInches) : undefined,
      armInches: armInches.trim() !== '' ? parseFloat(armInches) : undefined,
      thighInches: thighInches.trim() !== '' ? parseFloat(thighInches) : undefined,
      calfInches: calfInches.trim() !== '' ? parseFloat(calfInches) : undefined,
      notes: notes.trim() || undefined,
      loggedBy: 'doctor'
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setIsMeasurementModalOpen(false);
    }, 850);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#183153] via-teal-900 to-emerald-900 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
              <Ruler className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Log Body Mass & Circumferences</h2>
              <p className="text-xs text-teal-100/90">All fields are optional — enter only the measurements you have available</p>
            </div>
          </div>
          <button
            onClick={() => setIsMeasurementModalOpen(false)}
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Measurements Recorded Successfully!</h3>
            <p className="text-sm text-slate-500">Clinical biomarkers and available records updated.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* Patient & Date Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PatientSelector 
                variant="form" 
                label="Select Patient" 
                selectedPatientId={patientId} 
                onSelect={(p) => {
                  setPatientId(p.id);
                  if (p.currentWeightKg) setWeightKg(String(p.currentWeightKg));
                  if (p.heightCm) setHeightCm(String(p.heightCm));
                }} 
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Measurement Date</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 1: BODY MASS & COMPOSITION (ALL OPTIONAL) */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-teal-600" />
                  Body Mass & Composition (Optional)
                </span>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  No Required Fields
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Weight (kg) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 68.5"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 bg-white font-bold text-slate-900"
                  />
                </div>

                {/* Height (cm) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="e.g. 165"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 bg-white font-medium text-slate-900"
                  />
                </div>

                {/* Calculated BMI - Only shown if both weight & height are available */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Calculated BMI
                  </label>
                  <div className={`px-3 py-2 rounded-xl border text-xs font-bold ${
                    calculatedBmi 
                      ? 'bg-teal-50 border-teal-200 text-teal-950' 
                      : 'bg-slate-100 border-slate-200 text-slate-400'
                  }`}>
                    {calculatedBmi ? `${calculatedBmi} kg/m²` : '— (Enter Wt & Ht)'}
                  </div>
                </div>
              </div>

              {/* Extended Composition Biomarkers */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-200/60">
                {/* Body Fat % */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Body Fat (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 24.5"
                    value={bodyFatPercentage}
                    onChange={(e) => setBodyFatPercentage(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 bg-white"
                  />
                </div>

                {/* Muscle Mass (kg) */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Muscle Mass (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 28.2"
                    value={muscleMassKg}
                    onChange={(e) => setMuscleMassKg(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 bg-white"
                  />
                </div>

                {/* Visceral Fat Rating */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Visceral Fat (1-20)
                  </label>
                  <input
                    type="number"
                    step="1"
                    placeholder="e.g. 6"
                    value={visceralFat}
                    onChange={(e) => setVisceralFat(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 bg-white"
                  />
                </div>

                {/* Total Body Water % */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Body Water (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 52.0"
                    value={waterPercentage}
                    onChange={(e) => setWaterPercentage(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: BODY CIRCUMFERENCES (INCHES) (ALL OPTIONAL) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Ruler className="w-4 h-4 text-teal-600" />
                  Body Circumferences (Inches - Optional)
                </span>
                
                {/* WHR Ratio Chip - Only shown if both waist & hip are entered */}
                {whrStatus && (
                  <div className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border flex items-center gap-1.5 ${whrStatus.color}`}>
                    <Activity className="w-3.5 h-3.5" />
                    WHR: {waistToHipRatio} ({whrStatus.label})
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {/* Waist */}
                <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200">
                  <label className="block text-xs font-bold text-amber-950 mb-1">
                    Waist (Umbilicus)
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step="0.1"
                      placeholder="e.g. 32.0"
                      value={waistInches}
                      onChange={(e) => setWaistInches(e.target.value)}
                      className="w-full text-sm font-bold text-slate-900 px-3 py-1.5 rounded-lg border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500"
                    />
                    <span className="text-xs font-semibold text-amber-800 shrink-0">in</span>
                  </div>
                  {numWaist && (
                    <span className="text-[10px] text-amber-800 block mt-1">
                      ≈ {Math.round(numWaist * 2.54)} cm
                    </span>
                  )}
                </div>

                {/* Hip */}
                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-200">
                  <label className="block text-xs font-bold text-blue-950 mb-1">
                    Hip (Gluteal)
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step="0.1"
                      placeholder="e.g. 38.5"
                      value={hipInches}
                      onChange={(e) => setHipInches(e.target.value)}
                      className="w-full text-sm font-bold text-slate-900 px-3 py-1.5 rounded-lg border border-blue-300 bg-white focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-xs font-semibold text-blue-800 shrink-0">in</span>
                  </div>
                </div>

                {/* Chest */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Chest / Bust
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step="0.1"
                      placeholder="e.g. 36.0"
                      value={chestInches}
                      onChange={(e) => setChestInches(e.target.value)}
                      className="w-full text-xs font-semibold text-slate-900 px-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
                    />
                    <span className="text-xs text-slate-400 shrink-0">in</span>
                  </div>
                </div>

                {/* Arm */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Upper Arm (Bicep)
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step="0.1"
                      placeholder="e.g. 12.0"
                      value={armInches}
                      onChange={(e) => setArmInches(e.target.value)}
                      className="w-full text-xs font-semibold text-slate-900 px-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
                    />
                    <span className="text-xs text-slate-400 shrink-0">in</span>
                  </div>
                </div>

                {/* Thigh */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Mid-Thigh
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step="0.1"
                      placeholder="e.g. 22.5"
                      value={thighInches}
                      onChange={(e) => setThighInches(e.target.value)}
                      className="w-full text-xs font-semibold text-slate-900 px-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
                    />
                    <span className="text-xs text-slate-400 shrink-0">in</span>
                  </div>
                </div>

                {/* Calf */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Calf
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step="0.1"
                      placeholder="e.g. 14.0"
                      value={calfInches}
                      onChange={(e) => setCalfInches(e.target.value)}
                      className="w-full text-xs font-semibold text-slate-900 px-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
                    />
                    <span className="text-xs text-slate-400 shrink-0">in</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Clinical Observation Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-teal-600" />
                Doctor / Dietitian Observations & Clinical Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Patient noted reduced abdominal bloating and increased energy..."
                rows={2}
                className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-medium"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <span className="text-[11px] text-slate-500 font-medium">
                Tip: Enter any single measurement or all of them. Incomplete data is fully supported.
              </span>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsMeasurementModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-xs font-bold text-white bg-teal-800 hover:bg-teal-900 rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-teal-300" />
                  Save Measurements
                </button>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
