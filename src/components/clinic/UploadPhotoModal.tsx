import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Camera, X, CheckCircle2, Image as ImageIcon, Calendar, Sparkles } from 'lucide-react';
import { PhotoAngle, PhotoStage } from '../../types/clinic';
import { PatientSelector } from './PatientSelector';

const PHOTO_PRESETS = [
  {
    name: 'Front View (Neutral)',
    angle: 'front' as PhotoAngle,
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Side Profile (Posture)',
    angle: 'side' as PhotoAngle,
    url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Back View (Lat/Spine)',
    angle: 'back' as PhotoAngle,
    url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Male Front Transformation',
    angle: 'front' as PhotoAngle,
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600'
  }
];

export const UploadPhotoModal: React.FC = () => {
  const { 
    isPhotoModalOpen, 
    setIsPhotoModalOpen, 
    selectedPatient, 
    patients, 
    addProgressPhoto 
  } = useClinic();

  const [patientId, setPatientId] = useState<string>(selectedPatient?.id || patients[0]?.id || 'pat-1');
  const [stage, setStage] = useState<PhotoStage>('in_progress');
  const [angle, setAngle] = useState<PhotoAngle>('front');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [weightKg, setWeightKg] = useState<number>(selectedPatient?.currentWeightKg || 68.4);
  const [waistInches, setWaistInches] = useState<number>(31.0);
  const [imageUrl, setImageUrl] = useState<string>(PHOTO_PRESETS[0].url);
  const [notes, setNotes] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isPhotoModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProgressPhoto({
      patientId,
      date,
      stage,
      angle,
      imageUrl: imageUrl.trim() || PHOTO_PRESETS[0].url,
      weightKg: Number(weightKg),
      waistInches: Number(waistInches),
      notes: notes.trim() || `Clinical ${stage} progress photo from ${angle} angle.`,
      verifiedByDoctor: true
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setIsPhotoModalOpen(false);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 to-emerald-800 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
              <Camera className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Add Clinical Progress Photo</h2>
              <p className="text-xs text-teal-100/90">Standardized posture, angle, and milestone documentation</p>
            </div>
          </div>
          <button
            onClick={() => setIsPhotoModalOpen(false)}
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
            <h3 className="text-xl font-bold text-slate-800">Progress Photo Saved!</h3>
            <p className="text-sm text-slate-500">Photo added to the patient's comparative timeline.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            
            {/* Patient & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PatientSelector
                variant="form"
                label="Select Patient"
                selectedPatientId={patientId}
                onSelect={(p) => {
                  setPatientId(p.id);
                  setWeightKg(p.currentWeightKg);
                }}
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Date Taken (DD-MM-YYYY)</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-sm pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Stage & Angle Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Transformation Stage</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['before', 'in_progress', 'after'] as PhotoStage[]).map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStage(st)}
                      className={`py-2 text-xs font-bold rounded-lg border text-center capitalize transition-all ${
                        stage === st
                          ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Camera Angle</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['front', 'side', 'back'] as PhotoAngle[]).map(ang => (
                    <button
                      key={ang}
                      type="button"
                      onClick={() => setAngle(ang)}
                      className={`py-2 text-xs font-bold rounded-lg border text-center capitalize transition-all ${
                        angle === ang
                          ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {ang}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Weight & Waist at this photo */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Weight at Photo (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                  className="w-full text-sm px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-semibold text-slate-800"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Waist Measurement (in)</label>
                <input
                  type="number"
                  step="0.1"
                  value={waistInches}
                  onChange={(e) => setWaistInches(parseFloat(e.target.value) || 0)}
                  className="w-full text-sm px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-semibold text-slate-800"
                  required
                />
              </div>
            </div>

            {/* Photo Preset / URL Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>Select Medical Photo Preset or Paste Image URL</span>
                <span className="text-[11px] text-teal-600 font-normal">HD Clinical Standard</span>
              </label>
              
              <div className="grid grid-cols-4 gap-2 mb-2">
                {PHOTO_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setImageUrl(preset.url);
                      setAngle(preset.angle);
                    }}
                    className={`p-1 rounded-lg border text-left overflow-hidden transition-all group ${
                      imageUrl === preset.url ? 'ring-2 ring-teal-600 border-teal-600' : 'border-slate-200 hover:border-teal-300'
                    }`}
                  >
                    <img src={preset.url} alt={preset.name} className="w-full h-14 object-cover rounded" />
                    <span className="block text-[10px] text-slate-600 font-medium truncate mt-1">{preset.name}</span>
                  </button>
                ))}
              </div>

              <div className="relative">
                <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 font-mono"
                  required
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Clinical Evaluation Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Visible reduction in visceral bloat, improved midsection firmness and spinal alignment."
                rows={2}
                className="w-full text-sm p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsPhotoModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-sm font-bold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 rounded-lg shadow-sm shadow-teal-700/20 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Save Progress Photo
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
