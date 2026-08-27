import React, { useState, useEffect } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { calculateBmi } from '../../utils/nutritionCalculators';
import { PatientSelector } from './PatientSelector';
import { 
  X, 
  Scale, 
  TrendingDown, 
  Calendar, 
  CheckCircle2, 
  Sparkles,
  Activity
} from 'lucide-react';

export const LogWeightModal: React.FC = () => {
  const { 
    isWeightModalOpen, 
    setIsWeightModalOpen, 
    patients, 
    selectedPatientId, 
    addWeightRecord 
  } = useClinic();

  const [patientId, setPatientId] = useState<string>(selectedPatientId || patients[0]?.id || '');
  const [weightKg, setWeightKg] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [waistCm, setWaistCm] = useState<string>('');
  const [bodyFatPercentage, setBodyFatPercentage] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const patient = patients.find(p => p.id === patientId);

  useEffect(() => {
    if (selectedPatientId) {
      setPatientId(selectedPatientId);
    }
  }, [selectedPatientId]);

  useEffect(() => {
    if (patient && patient.currentWeightKg) {
      setWeightKg(String(patient.currentWeightKg));
    }
  }, [patient]);

  if (!isWeightModalOpen) return null;

  const numWeight = weightKg.trim() !== '' ? parseFloat(weightKg) : undefined;
  const height = patient ? patient.heightCm : 170;
  const bmiResult = (numWeight && height) ? calculateBmi(numWeight, height) : null;
  const diffFromBaseline = (patient && numWeight) ? Number((patient.startingWeightKg - numWeight).toFixed(1)) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) return;

    addWeightRecord({
      patientId,
      weightKg: numWeight || (patient?.currentWeightKg || 70),
      date: date || new Date().toISOString().split('T')[0],
      waistCm: waistCm.trim() !== '' ? parseFloat(waistCm) : undefined,
      bodyFatPercentage: bodyFatPercentage.trim() !== '' ? parseFloat(bodyFatPercentage) : undefined,
      notes: notes.trim() || undefined
    });

    setIsWeightModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-[#E4E9E4] max-w-md w-full my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#183153] via-teal-900 to-emerald-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-teal-300">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Log Clinical Weigh-In & Body Mass</h2>
              <p className="text-xs text-slate-300">
                All fields are optional — enter only available measurements
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsWeightModalOpen(false)}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Patient Selector */}
          <PatientSelector
            variant="form"
            label="Select Patient"
            selectedPatientId={patientId}
            onSelect={(p) => {
              setPatientId(p.id);
              if (p.currentWeightKg) setWeightKg(String(p.currentWeightKg));
            }}
          />

          {/* Weight & Live BMI Indicator */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-[#183153] text-xs">
                Current Scale Weight (kg) (Optional)
              </label>
              {bmiResult && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ backgroundColor: `${bmiResult.color}15`, color: bmiResult.color }}>
                  BMI {bmiResult.bmi} • {bmiResult.category}
                </span>
              )}
            </div>

            <input
              type="number"
              step="0.1"
              placeholder="e.g. 72.5"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-emerald-300 rounded-xl text-xl font-black text-[#183153] text-center outline-none focus:ring-2 focus:ring-teal-500"
            />

            {patient && numWeight !== undefined && (
              <div className="flex justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                <span>Starting: <strong>{patient.startingWeightKg} kg</strong></span>
                <span className="text-emerald-700 font-bold">
                  {diffFromBaseline > 0 ? `-${diffFromBaseline} kg total lost` : 'At baseline'}
                </span>
                <span>Target: <strong>{patient.targetWeightKg} kg</strong></span>
              </div>
            )}
          </div>

          {/* Additional Biomarkers */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Waist (cm) (Optional)
              </label>
              <input
                type="number"
                step="0.5"
                placeholder="e.g. 88"
                value={waistCm}
                onChange={(e) => setWaistCm(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[#183153] outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Body Fat (%) (Optional)
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 26.5"
                value={bodyFatPercentage}
                onChange={(e) => setBodyFatPercentage(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[#183153] outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Date of Weigh-In
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[#183153] outline-none"
            />
          </div>

          {/* Clinical Notes */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Observations & Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Complied with low-glycemic meal routines. Energy steady."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[#183153] outline-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsWeightModalOpen(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-teal-800 hover:bg-teal-900 text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              <span>Save Record</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
