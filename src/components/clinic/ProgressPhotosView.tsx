import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { 
  Camera, 
  Plus, 
  SlidersHorizontal, 
  Trash2, 
  CheckCircle2, 
  Calendar, 
  Scale, 
  Ruler, 
  ArrowLeft, 
  Sparkles, 
  User, 
  Maximize2,
  ChevronRight
} from 'lucide-react';
import { PhotoAngle, PhotoStage, ProgressPhoto } from '../../types/clinic';
import { PatientSelector } from './PatientSelector';
import { formatDate } from '../../utils/dateUtils';

export const ProgressPhotosView: React.FC = () => {
  const { 
    selectedPatient, 
    patients, 
    setSelectedPatientId, 
    getPatientPhotos, 
    deleteProgressPhoto, 
    setIsPhotoModalOpen, 
    navigateTo 
  } = useClinic();

  const [angleFilter, setAngleFilter] = useState<PhotoAngle | 'all'>('all');
  const [stageFilter, setStageFilter] = useState<PhotoStage | 'all'>('all');
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [selectedBeforeId, setSelectedBeforeId] = useState<string>('');
  const [selectedAfterId, setSelectedAfterId] = useState<string>('');
  const [previewPhoto, setPreviewPhoto] = useState<ProgressPhoto | null>(null);

  const currentPatient = selectedPatient || patients[0];
  const allPatientPhotos = currentPatient ? getPatientPhotos(currentPatient.id) : [];

  // Reset selected comparison photos on patient change
  React.useEffect(() => {
    if (currentPatient) {
      const photos = getPatientPhotos(currentPatient.id);
      const befores = photos.filter(p => p.stage === 'before');
      const afters = photos.filter(p => p.stage === 'after' || p.stage === 'in_progress');
      setSelectedBeforeId(befores[0]?.id || photos[0]?.id || '');
      setSelectedAfterId(afters[afters.length - 1]?.id || photos[photos.length - 1]?.id || '');
    }
  }, [currentPatient?.id]);

  // Filtered photos
  const filteredPhotos = allPatientPhotos.filter(p => {
    if (angleFilter !== 'all' && p.angle !== angleFilter) return false;
    if (stageFilter !== 'all' && p.stage !== stageFilter) return false;
    return true;
  });

  // Pick default before & after photos
  const beforePhotos = allPatientPhotos.filter(p => p.stage === 'before');
  const afterOrProgressPhotos = allPatientPhotos.filter(p => p.stage === 'after' || p.stage === 'in_progress');

  const beforePhoto = allPatientPhotos.find(p => p.id === selectedBeforeId) || beforePhotos[0] || allPatientPhotos[0];
  const afterPhoto = allPatientPhotos.find(p => p.id === selectedAfterId) || afterOrProgressPhotos[afterOrProgressPhotos.length - 1] || allPatientPhotos[allPatientPhotos.length - 1];

  // Calculated Deltas
  const weightDelta = (beforePhoto && afterPhoto) ? (beforePhoto.weightKg - afterPhoto.weightKg).toFixed(1) : '0';
  const waistDelta = (beforePhoto && afterPhoto) ? (beforePhoto.waistInches - afterPhoto.waistInches).toFixed(1) : '0';
  
  const daysElapsed = (beforePhoto && afterPhoto) 
    ? Math.max(1, Math.round((new Date(afterPhoto.date).getTime() - new Date(beforePhoto.date).getTime()) / (1000 * 3600 * 24)))
    : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600 mb-1">
            <button
              onClick={() => navigateTo('progress_dashboard', { patientId: currentPatient?.id })}
              className="hover:underline flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </button>
            <span>•</span>
            <span>Clinical Visual Transformation</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">Before & After Transformation Gallery</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Standardized posture evaluation, abdominal tapering, and visual compliance tracking
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <PatientSelector />

          <button
            onClick={() => setIsPhotoModalOpen(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 rounded-xl shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Progress Photo
          </button>
        </div>
      </div>

      {/* Interactive Split Comparison Studio */}
      {beforePhoto && afterPhoto && (
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl p-6 lg:p-8 shadow-xl border border-slate-700 relative overflow-hidden">
          
          {/* Top Studio Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-700">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-teal-500/20 text-teal-300 rounded-lg">
                  <SlidersHorizontal className="w-4 h-4" />
                </span>
                <h2 className="text-lg font-bold text-white">Interactive Transformation Comparison Studio</h2>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Drag the interactive slider horizontally to compare tissue firmness, visceral reduction, and silhouette changes.
              </p>
            </div>

            {/* Photo Selectors */}
            <div className="flex items-center gap-3">
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Baseline (Left)</label>
                <select
                  value={beforePhoto.id}
                  onChange={(e) => setSelectedBeforeId(e.target.value)}
                  className="bg-slate-800 text-xs text-white px-2.5 py-1.5 rounded-lg border border-slate-600 focus:outline-none"
                >
                  {(allPatientPhotos || []).map(p => (
                    <option key={p.id} value={p.id}>
                      {p.stage.toUpperCase()} • {formatDate(p.date)} ({p.weightKg}kg)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Target / Current (Right)</label>
                <select
                  value={afterPhoto.id}
                  onChange={(e) => setSelectedAfterId(e.target.value)}
                  className="bg-slate-800 text-xs text-white px-2.5 py-1.5 rounded-lg border border-slate-600 focus:outline-none"
                >
                  {(allPatientPhotos || []).map(p => (
                    <option key={p.id} value={p.id}>
                      {p.stage.toUpperCase()} • {formatDate(p.date)} ({p.weightKg}kg)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Transformation Metrics Summary Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
              <span className="text-[11px] text-slate-300">Net Weight Dropped</span>
              <div className="text-xl font-black text-emerald-400 mt-0.5">-{weightDelta} kg</div>
            </div>

            <div className="p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
              <span className="text-[11px] text-slate-300">Waist Trimmed</span>
              <div className="text-xl font-black text-teal-300 mt-0.5">-{waistDelta}&quot;</div>
            </div>

            <div className="p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
              <span className="text-[11px] text-slate-300">Time Span</span>
              <div className="text-xl font-black text-white mt-0.5">{daysElapsed} days</div>
            </div>

            <div className="p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
              <span className="text-[11px] text-slate-300">Doctor Verification</span>
              <div className="text-sm font-bold text-emerald-300 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Certified Clinical
              </div>
            </div>
          </div>

          {/* Split Slider Canvas Container */}
          <div className="relative w-full max-w-2xl mx-auto h-96 sm:h-[460px] rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-600 select-none">
            
            {/* After Image (Background full width) */}
            <img
              src={afterPhoto.imageUrl}
              alt="After Transformation"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-teal-900/90 text-teal-100 text-xs font-bold px-3 py-1.5 rounded-xl shadow backdrop-blur-sm border border-teal-400/40">
              {afterPhoto.stage.toUpperCase()}: {afterPhoto.weightKg} kg • {afterPhoto.waistInches}&quot; ({formatDate(afterPhoto.date)})
            </div>

            {/* Before Image (Clipped Left Side) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={beforePhoto.imageUrl}
                alt="Before Baseline"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ width: '100%', maxWidth: 'none', objectFit: 'cover' }}
              />
              <div className="absolute top-4 left-4 bg-slate-900/90 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow backdrop-blur-sm border border-white/20">
                {beforePhoto.stage.toUpperCase()}: {beforePhoto.weightKg} kg • {beforePhoto.waistInches}&quot; ({formatDate(beforePhoto.date)})
              </div>
            </div>

            {/* Dividing Line & Draggable Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl cursor-ew-resize"
              style={{ left: `calc(${sliderPosition}% - 2px)` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white text-slate-900 shadow-xl border-2 border-teal-600 flex items-center justify-center font-bold text-xs">
                ⇄
              </div>
            </div>

            {/* Hidden Input Range for smooth slider manipulation */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-20"
              aria-label="Comparison slider"
            />
          </div>

          <div className="text-center text-xs text-slate-400 mt-4">
            Drag handle horizontally across image or use slider to inspect visceral waistline transformation
          </div>

        </div>
      )}

      {/* Gallery Filter & Grid */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Transformation Progress Photo Archive</h3>
            <p className="text-xs text-slate-500">Chronological catalog of verified photographic milestones</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Angle Filters */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs">
              {(['all', 'front', 'side', 'back'] as const).map(ang => (
                <button
                  key={ang}
                  onClick={() => setAngleFilter(ang)}
                  className={`px-3 py-1.5 font-bold rounded-lg capitalize transition-all ${
                    angleFilter === ang ? 'bg-white text-teal-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {ang}
                </button>
              ))}
            </div>

            {/* Stage Filters */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs">
              {(['all', 'before', 'in_progress', 'after'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setStageFilter(st)}
                  className={`px-3 py-1.5 font-bold rounded-lg capitalize transition-all ${
                    stageFilter === st ? 'bg-white text-teal-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Photos Grid */}
        {filteredPhotos.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl">
            <Camera className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700">No photos match the selected filters</h4>
            <p className="text-xs text-slate-400 mt-1">Try switching angle/stage filters or upload a new photo.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {(filteredPhotos || []).map((photo) => (
              <div 
                key={photo.id}
                className="group rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all bg-white flex flex-col justify-between"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                  <img
                    src={photo.imageUrl}
                    alt={photo.notes}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onClick={() => setPreviewPhoto(photo)}
                  />
                  
                  {/* Stage Pill */}
                  <span className={`absolute top-2.5 left-2.5 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md shadow-sm ${
                    photo.stage === 'before' ? 'bg-slate-900 text-white' :
                    photo.stage === 'after' ? 'bg-emerald-600 text-white' :
                    'bg-teal-600 text-white'
                  }`}>
                    {photo.stage.replace('_', ' ')} • {photo.angle}
                  </span>

                  <button
                    onClick={() => setPreviewPhoto(photo)}
                    className="absolute top-2.5 right-2.5 w-7 h-7 bg-black/60 hover:bg-black/80 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="absolute bottom-2 inset-x-2 bg-black/70 backdrop-blur-xs text-white p-2 rounded-xl text-xs flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1">
                      <Scale className="w-3 h-3 text-teal-400" /> {photo.weightKg} kg
                    </span>
                    <span className="font-bold flex items-center gap-1">
                      <Ruler className="w-3 h-3 text-amber-400" /> {photo.waistInches}&quot;
                    </span>
                  </div>
                </div>

                {/* Card Meta & Actions */}
                <div className="p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> {formatDate(photo.date)}
                    </span>
                    {photo.verifiedByDoctor && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {photo.notes || 'Clinical progress record.'}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setSelectedBeforeId(photo.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-[11px] font-bold text-teal-600 hover:text-teal-800"
                    >
                      Compare in Studio ➔
                    </button>

                    <button
                      onClick={() => deleteProgressPhoto(photo.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                      title="Delete Photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Photo Preview Modal */}
      {previewPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-3xl overflow-hidden max-w-2xl w-full border border-slate-700 text-white animate-in zoom-in-95">
            <div className="relative">
              <img src={previewPhoto.imageUrl} alt={previewPhoto.notes} className="w-full max-h-[70vh] object-contain bg-black" />
              <button
                onClick={() => setPreviewPhoto(null)}
                className="absolute top-4 right-4 bg-black/70 text-white p-2 rounded-full hover:bg-black"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-3 bg-slate-900">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                  {previewPhoto.stage.toUpperCase()} • {previewPhoto.angle.toUpperCase()} VIEW
                </span>
                <span className="text-xs text-slate-400">{formatDate(previewPhoto.date)}</span>
              </div>
              <div className="flex items-center gap-4 text-sm font-bold">
                <span>Weight: {previewPhoto.weightKg} kg</span>
                <span>Waist: {previewPhoto.waistInches} inches</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{previewPhoto.notes}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
