import React, { useState, useEffect } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { 
  X, 
  Layers, 
  Plus, 
  Trash2, 
  Edit3,
  Archive,
  RotateCcw
} from 'lucide-react';

export const CreatePlanModal: React.FC = () => {
  const { 
    isCreatePlanModalOpen, 
    setIsCreatePlanModalOpen,
    editingPlan,
    closePlanModal,
    addPlan,
    editPlan,
    archivePlan,
    unarchivePlan
  } = useClinic();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<string>('weight_loss');
  const [durationMonths, setDurationMonths] = useState<number>(3);
  const [basePrice, setBasePrice] = useState<number>(15000);
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState<string[]>([
    'Bi-weekly doctor consultation & body composition scan',
    'Personalized clinical macro-nutrient plan',
    'Dedicated WhatsApp doctor support'
  ]);
  const [newFeatureText, setNewFeatureText] = useState('');

  useEffect(() => {
    if (editingPlan) {
      setName(editingPlan.name || '');
      setCategory(editingPlan.category || 'weight_loss');
      setDurationMonths(editingPlan.durationMonths || 3);
      setBasePrice(editingPlan.basePrice || 15000);
      setDescription(editingPlan.description || '');
      setFeatures(editingPlan.features && editingPlan.features.length > 0 ? editingPlan.features : [
        'Bi-weekly doctor consultation & body composition scan',
        'Personalized clinical macro-nutrient plan'
      ]);
    } else {
      setName('');
      setCategory('weight_loss');
      setDurationMonths(3);
      setBasePrice(15000);
      setDescription('');
      setFeatures([
        'Bi-weekly doctor consultation & body composition scan',
        'Personalized clinical macro-nutrient plan',
        'Dedicated WhatsApp doctor support'
      ]);
    }
  }, [editingPlan, isCreatePlanModalOpen]);

  if (!isCreatePlanModalOpen) return null;

  const handleAddFeature = () => {
    if (newFeatureText.trim()) {
      setFeatures(prev => [...prev, newFeatureText.trim()]);
      setNewFeatureText('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingPlan) {
      editPlan(editingPlan.id, {
        name,
        category,
        durationMonths: Number(durationMonths),
        durationDays: Number(durationMonths) * 30,
        basePrice: Number(basePrice),
        description: description || `${durationMonths}-Month intensive clinical nutrition program.`,
        features: features.length > 0 ? features : ['Weekly doctor reviews', 'Personalized nutrition targets']
      });
    } else {
      addPlan({
        name,
        category,
        durationMonths: Number(durationMonths),
        durationDays: Number(durationMonths) * 30,
        basePrice: Number(basePrice),
        description: description || `${durationMonths}-Month intensive clinical nutrition program.`,
        features: features.length > 0 ? features : ['Weekly check-ins', 'Customized meal blueprints']
      });
    }

    closePlanModal ? closePlanModal() : setIsCreatePlanModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#E4E9E4] max-w-lg w-full my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#183153] to-[#244673] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#6BBF59]">
              {editingPlan ? <Edit3 className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-bold">
                {editingPlan ? 'Edit Clinical Care Plan' : 'Create Clinical Care Plan'}
              </h2>
              <p className="text-xs text-slate-300">
                {editingPlan ? 'Update pricing, duration & inclusions for future enrollments' : 'Define duration, base price & therapeutic inclusions'}
              </p>
            </div>
          </div>
          <button
            onClick={() => closePlanModal ? closePlanModal() : setIsCreatePlanModalOpen(false)}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Plan Program Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 3-Month Metabolic Reset & Fat Loss"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[#183153] font-bold focus:ring-2 focus:ring-[#6BBF59]/30 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[#183153] outline-none"
              >
                <option value="weight_loss">Weight Loss</option>
                <option value="diabetes_reversal">Diabetes Care</option>
                <option value="pcos_management">PCOS & Hormones</option>
                <option value="fertility">Fertility & Pre-Conception</option>
                <option value="pregnancy">Pregnancy & Postpartum</option>
                <option value="menopause">Menopause & Hormonal Balance</option>
                <option value="thyroid_care">Thyroid Health</option>
                <option value="general_wellness">General Wellness</option>
                <option value="athletic_performance">Athletic Performance</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Duration (Months) *
              </label>
              <input
                type="number"
                min={1}
                max={36}
                required
                value={durationMonths}
                onChange={(e) => setDurationMonths(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[#183153] font-bold outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Base Fee (₹) *
              </label>
              <input
                type="number"
                min={0}
                step={500}
                required
                value={basePrice}
                onChange={(e) => setBasePrice(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-emerald-800 font-bold outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Program Description
            </label>
            <textarea
              rows={2}
              placeholder="Clinical protocol scope and target patient demographic..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[#183153] outline-none"
            />
          </div>

          {/* Features Inclusions List */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Plan Inclusions & Features
            </label>
            <div className="space-y-1.5 mb-2 max-h-36 overflow-y-auto">
              {(features || []).map((f, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-700 font-medium">{f}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="text-slate-400 hover:text-rose-600 cursor-pointer p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add inclusion (e.g. Weekly body composition scan)..."
                value={newFeatureText}
                onChange={(e) => setNewFeatureText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-3 py-1.5 bg-[#183153] text-white rounded-lg font-semibold cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>

          {/* Archive / Status Action if editing */}
          {editingPlan && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-amber-900">
                  {editingPlan.isArchived ? 'Plan is currently archived' : 'Plan is active'}
                </p>
                <p className="text-[11px] text-amber-700">
                  {editingPlan.isArchived ? 'Hidden from new registrations. Existing enrolled patients retain their history.' : 'Archiving removes it from new enrollments without altering generated invoices.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (editingPlan.isArchived) {
                    unarchivePlan(editingPlan.id);
                  } else {
                    archivePlan(editingPlan.id);
                  }
                  closePlanModal();
                }}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer text-xs ${
                  editingPlan.isArchived 
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                    : 'bg-amber-600 text-white hover:bg-amber-700'
                }`}
              >
                {editingPlan.isArchived ? <RotateCcw className="w-3.5 h-3.5" /> : <Archive className="w-3.5 h-3.5" />}
                {editingPlan.isArchived ? 'Unarchive Plan' : 'Archive Plan'}
              </button>
            </div>
          )}

          {/* Submit */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => closePlanModal ? closePlanModal() : setIsCreatePlanModalOpen(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#6BBF59] hover:bg-[#5EAB4D] text-white font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              {editingPlan ? 'Update Plan' : 'Save Care Plan'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

