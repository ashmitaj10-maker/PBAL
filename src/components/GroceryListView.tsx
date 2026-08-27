import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Check, 
  Trash2, 
  Copy, 
  Share2, 
  Sparkles, 
  CheckCircle2, 
  Circle,
  FolderOpen
} from 'lucide-react';
import { useNutrition } from '../context/NutritionContext';
import { GroceryItem } from '../types';

export const GroceryListView: React.FC = () => {
  const { 
    groceryList, 
    toggleGroceryItem, 
    addGroceryItem, 
    removeGroceryItem, 
    clearCheckedGroceries 
  } = useNutrition();

  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<GroceryItem['category']>('Produce & Greens');
  const [newItemHighlight, setNewItemHighlight] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [copied, setCopied] = useState(false);

  const categories: GroceryItem['category'][] = [
    'Produce & Greens',
    'Lean Proteins',
    'Whole Grains & Complex Carbs',
    'Healthy Fats & Oils',
    'Dairy & Alternatives',
    'Spices, Seeds & Superfoods',
    'Pantry Essentials'
  ];

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    addGroceryItem({
      name: newItemName.trim(),
      quantity: newItemQuantity.trim() || '1 item',
      category: newItemCategory,
      nutritionalHighlight: newItemHighlight.trim() || undefined,
    });

    setNewItemName('');
    setNewItemQuantity('');
    setNewItemHighlight('');
    setIsAdding(false);
  };

  const handleCopyList = () => {
    const text = (groceryList || [])
      .map(item => `[${item.checked ? 'X' : ' '}] ${item.name} (${item.quantity}) - ${item.category}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const checkedCount = (groceryList || []).filter(i => i.checked).length;
  const progressPercent = (groceryList || []).length > 0 ? Math.round((checkedCount / (groceryList || []).length) * 100) : 0;

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#183153] text-white">
              Pantry & Nutrition Shopping
            </span>
            <span className="text-xs font-semibold text-[#6BBF59]">Smart Bio-Pantry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#183153] font-['Poppins'] mt-1">
            Smart Grocery & Nutrition List
          </h1>
          <p className="text-sm text-slate-600">
            Categorized whole foods curated from your clinical meal plans for optimal freshness and nutrient density.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyList}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#183153]/20 hover:border-[#183153]/50 text-[#183153] font-semibold text-xs transition-colors shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#6BBF59]" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Shopping List'}</span>
          </button>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6BBF59] hover:bg-[#5EAB4D] text-white font-semibold text-xs transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Progress & Quick Stats Card */}
      <div className="medical-card p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-white via-white to-[#F8FFF8]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#6BBF59]/15 text-[#2E7D32] flex items-center justify-center font-extrabold text-lg">
            {progressPercent}%
          </div>
          <div>
            <h2 className="text-base font-bold text-[#183153]">
              {checkedCount} of {groceryList.length} items collected
            </h2>
            <p className="text-xs text-slate-500">All whole foods selected for anti-inflammatory bioactive density</p>
          </div>
        </div>

        {checkedCount > 0 && (
          <button
            onClick={clearCheckedGroceries}
            className="text-xs font-semibold text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-xl transition-colors self-start sm:self-auto"
          >
            Clear Collected Items ({checkedCount})
          </button>
        )}
      </div>

      {/* Quick Add Form */}
      {isAdding && (
        <form onSubmit={handleAddItem} className="medical-card p-6 space-y-4 animate-in fade-in duration-200">
          <h3 className="text-sm font-bold text-[#183153] uppercase tracking-wider">Add Custom Grocery Item</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="text-xs font-bold text-slate-500 block mb-1">Item Name</label>
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="e.g. Organic Wild Blackberries"
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-[#6BBF59] outline-none text-xs text-[#183153]"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Quantity</label>
              <input
                type="text"
                value={newItemQuantity}
                onChange={(e) => setNewItemQuantity(e.target.value)}
                placeholder="e.g. 2 punnets (250g)"
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-[#6BBF59] outline-none text-xs text-[#183153]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Aisle Category</label>
              <select
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-[#6BBF59] outline-none text-xs text-[#183153] bg-white"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-[#183153] hover:bg-[#244673] text-white shadow-sm"
            >
              Save to List
            </button>
          </div>
        </form>
      )}

      {/* Category Groups */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category) => {
          const itemsInCat = groceryList.filter(item => item.category === category);
          if (itemsInCat.length === 0) return null;

          return (
            <div key={category} className="medical-card p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#6BBF59]" />
                  <h3 className="font-bold text-sm text-[#183153]">{category}</h3>
                </div>
                <span className="text-xs font-semibold text-slate-400">
                  {itemsInCat.length} {itemsInCat.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              <div className="space-y-2">
                {itemsInCat.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleGroceryItem(item.id)}
                    className={`group flex items-start justify-between p-3 rounded-xl cursor-pointer border transition-all ${
                      item.checked
                        ? 'bg-slate-50/60 border-slate-100 opacity-60'
                        : 'bg-white hover:bg-[#F8FFF8] border-slate-150 hover:border-[#6BBF59]/40'
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1 pr-2">
                      <div className="mt-0.5 text-[#6BBF59]">
                        {item.checked ? (
                          <CheckCircle2 className="w-4 h-4 fill-[#6BBF59] text-white" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-300" />
                        )}
                      </div>

                      <div>
                        <span className={`text-xs font-bold ${item.checked ? 'line-through text-slate-400' : 'text-[#183153]'}`}>
                          {item.name}
                        </span>
                        <p className="text-[11px] text-slate-500 font-medium">{item.quantity}</p>
                        {item.nutritionalHighlight && (
                          <span className="inline-block text-[10px] font-semibold text-[#2E7D32] bg-[#6BBF59]/10 px-1.5 py-0.2 rounded mt-1">
                            ✨ {item.nutritionalHighlight}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.estimatedPrice && (
                        <span className="text-xs font-bold text-slate-500">{item.estimatedPrice}</span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeGroceryItem(item.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
