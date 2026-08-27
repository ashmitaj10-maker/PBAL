import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Ruler, X, Scale, Calendar, FileText, Activity, Sparkles, CheckCircle2 } from 'lucide-react';

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
  const [weightKg, setWeightKg] = useState<number>(selectedPatient?.currentWeightKg || 70);
  const [waistInches, setWaistInches] = useState<number>(32);
  const [hipInches, setHipInches] = useState<number>(38);
  const [chestInches, setChestInches] = useState<number>(36);
  const [armInches, setArmInches] = useState<number>(12.5);
  const [thighInches, setThighInches] = useState<number>(23);
  const [bodyFatPercentage, setBodyFatPercentage] = useState<number>(28);
  const [notes, setNotes] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isMeasurementModalOpen) return null;

  const currentPat = patients.find(p => p.id === patientId) || selectedPatient;
  const heightM = currentPat ? currentPat.heightCm / 100 : 1.65;
  const calculatedBmi = Number((weightKg / (heightM * heightM)).toFixed(1));
  const waistToHipRatio = Number((waistInches / (hipInches || 1)).toFixed(2));
  
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

  const whrStatus = getWhrStatus(waistToHipRatio, currentPat?.gender);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addBodyMeasurement({
      patientId,
      date,
      weightKg: Number(weightKg),
      bmi: calculatedBmi,
      waistInches: Number(waistInches),
      hipInches: Number(hipInches),
      chestInches: Number(chestInches),
      armInches: Number(armInches),
      thighInches: Number(thighInches),
      bodyFatPercentage: Number(bodyFatPercentage),
      notes: notes.trim() || undefined,
      loggedBy: 'doctor'
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setIsMeasurementModalOpen(false);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-teal-700 to-emerald-800 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
              <Ruler className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Log Body Circumference & Composition</h2>
              <p className="text-xs text-teal-100/90">Track visceral fat reduction, waist-to-hip ratio, and limb measurements</p>
            </div>
          </div>
          <button
            onClick={() => setIsMeasurementModalOpen(false)}
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Measurements Logged Successfully!</h3>
            <p className="text-sm text-slate-500">Progress curves and clinical biomarkers updated.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* Patient & Date Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Select Patient</label>
                <select
                  value={patientId}
                  onChange={(e) => {
                    setPatientId(e.target.value);
                    const p = (patients || []).find(pat => pat.id === e.target.value);
                    if (p) setWeightKg(p.currentWeightKg);
                  }}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
                >
                  {(patients || []).map(pat => (
                    <option key={pat.id} value={pat.id}>
                      {pat.name} ({pat.patientCode}) — {pat.currentWeightKg} kg
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Measurement Date</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-sm pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Core Metrics: Weight & BMI Diagnostics */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-teal-600" />
                  Body Mass & Composition
                </span>
                <span className="text-xs text-slate-500">Height: {currentPat?.heightCm || 165} cm</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="30"
                    max="250"
                    value={weightKg}
                    onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 bg-white font-semibold text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Calculated BMI</label>
                  <div className="px-3 py-2 rounded-lg bg-teal-50 border border-teal-200 text-teal-900 font-bold text-sm">
                    {calculatedBmi} kg/m²
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Body Fat % (Optional)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="5"
                    max="60"
                    value={bodyFatPercentage}
                    onChange={(e) => setBodyFatPercentage(parseFloat(e.target.value) || 0)}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Circumference Grid (Inches) */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Ruler className="w-4 h-4 text-teal-600" />
                  Body Circumferences (Inches)
                </span>
                
                {/* WHR Ratio Chip */}
                <div className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${whrStatus.color}`}>
                  <Activity className="w-3.5 h-3.5" />
                  Waist-to-Hip: {waistToHipRatio} ({whrStatus.label})
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80">
                  <label className="block text-xs font-bold text-amber-900 mb-1">Waist (Narrowest / Umbilicus)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.1"
                      min="20"
                      max="70"
                      value={waistInches}
                      onChange={(e) => setWaistInches(parseFloat(e.target.value) || 0)}
                      className="w-full text-base font-bold text-slate-900 px-3 py-1.5 rounded-lg border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500"
                      required
                    />
                    <span className="text-xs font-semibold text-amber-800">in</span>
                  </div>
                </div>

                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/80">
                  <label className="block text-xs font-bold text-blue-900 mb-1">Hip (Widest Gluteal)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.1"
                      min="25"
                      max="80"
                      value={hipInches}
                      onChange={(e) => setHipInches(parseFloat(e.target.value) || 0)}
                      className="w-full text-base font-bold text-slate-900 px-3 py-1.5 rounded-lg border border-blue-300 bg-white focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <span className="text-xs font-semibold text-blue-800">in</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <label className="block text-xs font-medium text-slate-700 mb-1">Chest / Bust</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.1"
                      min="20"
                      max="70"
                      value={chestInches}
                      onChange={(e) => setChestInches(parseFloat(e.target.value) || 0)}
                      className="w-full text-sm font-semibold text-slate-900 px-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
                    />
                    <span className="text-xs text-slate-500">in</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <label className="block text-xs font-medium text-slate-700 mb-1">Upper Arm (Bicep)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.1"
                      min="8"
                      max="30"
                      value={armInches}
                      onChange={(e) => setArmInches(parseFloat(e.target.value) || 0)}
                      className="w-full text-sm font-semibold text-slate-900 px-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
                    />
                    <span className="text-xs text-slate-500">in</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <label className="block text-xs font-medium text-slate-700 mb-1">Mid-Thigh</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.1"
                      min="12"
                      max="45"
                      value={thighInches}
                      onChange={(e) => setThighInches(parseFloat(e.target.value) || 0)}
                      className="w-full text-sm font-semibold text-slate-900 px-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
                    />
                    <span className="text-xs text-slate-500">in</span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200/70 flex flex-col justify-center">
                  <span className="text-xs text-emerald-800 font-medium">Waist in cm</span>
                  <span className="text-lg font-bold text-emerald-950">{Math.round(waistInches * 2.54)} cm</span>
                  <span className="text-[11px] text-emerald-700">Target: &lt; {currentPat?.gender === 'female' ? '80' : '90'} cm</span>
                </div>
              </div>
            </div>

            {/* Clinical Observation Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-teal-600" />
                Doctor / Dietitian Observations & Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Visible abdominal tapering, reduced lower extremity fluid retention, posture alignment improved."
                rows={2}
                className="w-full text-sm p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsMeasurementModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-sm font-bold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 rounded-lg shadow-sm shadow-teal-700/20 flex items-center gap-2 transition-all transform active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                Save Measurements
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
