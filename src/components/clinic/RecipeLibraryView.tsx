import React, { useState, useMemo } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Copy, 
  Sparkles, 
  ChefHat, 
  Utensils, 
  Clock, 
  Flame, 
  Info, 
  Check, 
  User, 
  X, 
  Filter, 
  ArrowRight, 
  SlidersHorizontal,
  LayoutGrid,
  List,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Tag
} from 'lucide-react';
import { RecipeDetail, MealSlotType, Patient } from '../../types/clinic';
import { formatDate } from '../../utils/dateUtils';

const SLOT_TYPES: { id: MealSlotType; label: string; icon: string }[] = [
  { id: 'wake_up', label: 'Wake Up Elixir', icon: '🌅' },
  { id: 'breakfast', label: 'Breakfast', icon: '🍳' },
  { id: 'mid_meal', label: 'Mid-Meal Booster', icon: '🍏' },
  { id: 'lunch', label: 'Lunch (Main Meal)', icon: '🥗' },
  { id: 'snack', label: 'Evening Snack', icon: '🥜' },
  { id: 'dinner', label: 'Dinner', icon: '🍲' },
  { id: 'sleep', label: 'Bedtime Elixir', icon: '🌙' },
  { id: 'pre_workout', label: 'Pre-Workout', icon: '⚡' },
  { id: 'post_workout', label: 'Post-Workout', icon: '🥤' }
];

const PRESET_TAGS = [
  'Low GI', 
  'High Protein', 
  'Vegetarian', 
  'Vegan', 
  'Gluten-Free', 
  'Dairy-Free', 
  'Thyroid-Friendly', 
  'PCOS-Friendly', 
  'Pre-Diabetes', 
  'Heart-Healthy', 
  'Anti-Inflammatory', 
  'Gut-Health'
];

export const RecipeLibraryView: React.FC = () => {
  const { 
    recipes, 
    addRecipeToLibrary, 
    updateRecipeInLibrary, 
    deleteRecipeFromLibrary, 
    openRecipeModal,
    addRecipeToPatientPlan,
    patients,
    selectedPatient,
    setSelectedPatientId,
    navigateTo
  } = useClinic();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSlotFilter, setSelectedSlotFilter] = useState<string>('all');
  const [selectedOriginFilter, setSelectedOriginFilter] = useState<'all' | 'custom' | 'ai' | 'core'>('all');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'name' | 'calories_asc' | 'calories_desc' | 'protein_desc'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<RecipeDetail | null>(null);
  const [assignRecipeModal, setAssignRecipeModal] = useState<RecipeDetail | null>(null);
  const [selectedAssignPatientId, setSelectedAssignPatientId] = useState<string>(selectedPatient?.id || patients[0]?.id || '');
  const [selectedAssignSlotType, setSelectedAssignSlotType] = useState<string>('breakfast');
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Form State for Create / Edit
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Breakfast Bowl');
  const [formSlotType, setFormSlotType] = useState<MealSlotType>('breakfast');
  const [formPrepTime, setFormPrepTime] = useState(10);
  const [formCookTime, setFormCookTime] = useState(10);
  const [formServingSize, setFormServingSize] = useState('1 bowl (220g)');
  const [formServings, setFormServings] = useState(1);
  const [formCalories, setFormCalories] = useState(250);
  const [formProtein, setFormProtein] = useState(15);
  const [formCarbs, setFormCarbs] = useState(30);
  const [formFat, setFormFat] = useState(6);
  const [formFiber, setFormFiber] = useState(5);
  const [formGlycemicIndex, setFormGlycemicIndex] = useState<'Low' | 'Medium' | 'High'>('Low');
  const [formIngredientsText, setFormIngredientsText] = useState('');
  const [formStepsText, setFormStepsText] = useState('');
  const [formClinicalBenefit, setFormClinicalBenefit] = useState('');
  const [formChefTip, setFormChefTip] = useState('');
  const [formTags, setFormTags] = useState<string[]>(['Low GI', 'High Protein']);
  const [formImageUrl, setFormImageUrl] = useState('');

  const showToast = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  // Open Create Modal with clean fields
  const handleOpenCreateModal = () => {
    setEditingRecipe(null);
    setFormName('');
    setFormCategory('Nutrient-Dense Breakfast');
    setFormSlotType('breakfast');
    setFormPrepTime(10);
    setFormCookTime(10);
    setFormServingSize('1 portion (220g)');
    setFormServings(1);
    setFormCalories(280);
    setFormProtein(18);
    setFormCarbs(32);
    setFormFat(7);
    setFormFiber(6);
    setFormGlycemicIndex('Low');
    setFormIngredientsText('Besan (gram flour): 50g\nGrated Paneer: 40g\nChopped Spinach: 30g\nCold pressed oil: 1 tsp\nPinch of turmeric & salt');
    setFormStepsText('1. Whisk besan with water, spinach, turmeric and salt to make smooth batter.\n2. Spread on warm pan with 1 tsp oil.\n3. Add paneer filling, fold, and serve warm.');
    setFormClinicalBenefit('High protein and low glycemic index. Stabilizes morning fasting blood sugar.');
    setFormChefTip('Cook on medium heat with minimal oil for optimum crispness.');
    setFormTags(['Low GI', 'High Protein', 'Vegetarian']);
    setFormImageUrl('https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600');
    setIsCreateModalOpen(true);
  };

  // Open Edit Modal with existing recipe data
  const handleOpenEditModal = (recipe: RecipeDetail) => {
    setEditingRecipe(recipe);
    setFormName(recipe.name);
    setFormCategory(recipe.category || 'Clinical Protocol');
    setFormSlotType(recipe.slotType || 'breakfast');
    setFormPrepTime(recipe.prepTimeMinutes || 10);
    setFormCookTime(recipe.cookTimeMinutes || 10);
    setFormServingSize(recipe.servingSizeDescription || '1 portion');
    setFormServings(recipe.servings || 1);
    setFormCalories(recipe.calories || 0);
    setFormProtein(recipe.protein || 0);
    setFormCarbs(recipe.carbs || 0);
    setFormFat(recipe.fat || 0);
    setFormFiber(recipe.fiber || 0);
    setFormGlycemicIndex((recipe.glycemicIndex as any) || 'Low');
    
    const ingText = (recipe.ingredients || []).map(i => `${i.item}: ${i.amount}`).join('\n');
    setFormIngredientsText(ingText);

    const stepsText = (recipe.steps || []).join('\n');
    setFormStepsText(stepsText);

    setFormClinicalBenefit(recipe.clinicalBenefit || '');
    setFormChefTip(recipe.chefTip || '');
    setFormTags(recipe.dietaryTags || []);
    setFormImageUrl(recipe.imageUrl || '');
    setIsCreateModalOpen(true);
  };

  // Save recipe (Create new or Update existing)
  const handleSaveRecipeForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const parsedIngredients = formIngredientsText
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => {
        const parts = line.split(':');
        if (parts.length >= 2) {
          return { item: parts[0].trim(), amount: parts.slice(1).join(':').trim() };
        }
        return { item: line, amount: '1 portion' };
      });

    const parsedSteps = formStepsText
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);

    const recipeData: Omit<RecipeDetail, 'id'> = {
      name: formName.trim(),
      category: formCategory.trim() || 'Clinical Meal',
      slotType: formSlotType,
      prepTimeMinutes: Number(formPrepTime) || 10,
      cookTimeMinutes: Number(formCookTime) || 10,
      servings: Number(formServings) || 1,
      servingSizeDescription: formServingSize.trim() || '1 serving',
      calories: Number(formCalories) || 0,
      protein: Number(formProtein) || 0,
      carbs: Number(formCarbs) || 0,
      fat: Number(formFat) || 0,
      fiber: Number(formFiber) || 0,
      glycemicIndex: formGlycemicIndex,
      micronutrients: {
        vitaminC: 25,
        calcium: 20,
        iron: 15,
        magnesium: 20,
        potassium: 18
      },
      ingredients: parsedIngredients.length ? parsedIngredients : [{ item: 'Wholesome ingredients', amount: '1 serving' }],
      steps: parsedSteps.length ? parsedSteps : ['Prepare cleanly and serve fresh.'],
      dietaryTags: formTags.length ? formTags : ['Low GI', 'Clinical Nutrition'],
      chefTip: formChefTip.trim() || 'Serve fresh and warm.',
      clinicalBenefit: formClinicalBenefit.trim() || 'Formulated for metabolic optimization.',
      imageUrl: formImageUrl.trim() || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600',
      isCustom: editingRecipe ? editingRecipe.isCustom : true,
      isAiGenerated: editingRecipe ? editingRecipe.isAiGenerated : false,
      updatedAt: new Date().toISOString()
    };

    if (editingRecipe) {
      updateRecipeInLibrary(editingRecipe.id, recipeData);
      showToast(`Updated "${formName.trim()}" in Recipe Library!`);
    } else {
      addRecipeToLibrary(recipeData);
      showToast(`Added "${formName.trim()}" to Recipe Library! Available for all patients.`);
    }

    setIsCreateModalOpen(false);
    setEditingRecipe(null);
  };

  // Duplicate recipe
  const handleDuplicateRecipe = (recipe: RecipeDetail) => {
    const cloneData: Omit<RecipeDetail, 'id'> = {
      ...recipe,
      name: `${recipe.name} (Custom Copy)`,
      isCustom: true,
      isAiGenerated: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    addRecipeToLibrary(cloneData);
    showToast(`Duplicated "${recipe.name}" as a new custom template!`);
  };

  // Delete recipe with confirmation
  const handleDeleteRecipe = (recipe: RecipeDetail) => {
    if (window.confirm(`Are you sure you want to delete "${recipe.name}" from the Recipe Library?`)) {
      deleteRecipeFromLibrary(recipe.id);
      showToast(`Removed "${recipe.name}" from library.`);
    }
  };

  // Open Add to Patient Plan Modal
  const handleOpenAssignModal = (recipe: RecipeDetail) => {
    setAssignRecipeModal(recipe);
    setSelectedAssignSlotType(recipe.slotType || 'breakfast');
    setSelectedAssignPatientId(selectedPatient?.id || patients[0]?.id || '');
  };

  // Execute Add to Patient Plan
  const handleExecuteAssignToPlan = () => {
    if (!assignRecipeModal || !selectedAssignPatientId) return;

    const targetPatient = patients.find(p => p.id === selectedAssignPatientId);
    addRecipeToPatientPlan(selectedAssignPatientId, assignRecipeModal, selectedAssignSlotType);

    showToast(`Added "${assignRecipeModal.name}" to ${targetPatient?.name || 'patient'}'s diet plan!`);
    setAssignRecipeModal(null);
  };

  // Toggle Tag in Form
  const toggleFormTag = (tag: string) => {
    setFormTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // Stats calculation
  const totalCount = recipes.length;
  const customCount = recipes.filter(r => r.isCustom && !r.isAiGenerated).length;
  const aiCount = recipes.filter(r => r.isAiGenerated).length;
  const coreCount = recipes.filter(r => !r.isCustom && !r.isAiGenerated).length;

  // Filtered & Sorted Recipes
  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = (recipe.name || '').toLowerCase().includes(q);
        const matchesBenefit = (recipe.clinicalBenefit || '').toLowerCase().includes(q);
        const matchesCategory = (recipe.category || '').toLowerCase().includes(q);
        const matchesIngredients = (recipe.ingredients || []).some(i => (i.item || '').toLowerCase().includes(q));
        const matchesTags = (recipe.dietaryTags || []).some(t => t.toLowerCase().includes(q));
        if (!matchesName && !matchesBenefit && !matchesCategory && !matchesIngredients && !matchesTags) {
          return false;
        }
      }

      // Slot filter
      if (selectedSlotFilter !== 'all' && recipe.slotType !== selectedSlotFilter) {
        return false;
      }

      // Origin filter
      if (selectedOriginFilter === 'custom' && (!recipe.isCustom || recipe.isAiGenerated)) {
        return false;
      }
      if (selectedOriginFilter === 'ai' && !recipe.isAiGenerated) {
        return false;
      }
      if (selectedOriginFilter === 'core' && (recipe.isCustom || recipe.isAiGenerated)) {
        return false;
      }

      // Tag filter
      if (selectedTagFilter !== 'all') {
        const hasTag = (recipe.dietaryTags || []).some(t => t.toLowerCase() === selectedTagFilter.toLowerCase());
        if (!hasTag) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        const timeA = new Date(a.createdAt || a.updatedAt || 0).getTime();
        const timeB = new Date(b.createdAt || b.updatedAt || 0).getTime();
        return timeB - timeA;
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'calories_asc') {
        return a.calories - b.calories;
      }
      if (sortBy === 'calories_desc') {
        return b.calories - a.calories;
      }
      if (sortBy === 'protein_desc') {
        return b.protein - a.protein;
      }
      return 0;
    });
  }, [recipes, searchQuery, selectedSlotFilter, selectedOriginFilter, selectedTagFilter, sortBy]);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* TOAST NOTIFICATION ALERT */}
      {notificationMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#183153] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-teal-500/30 flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
          <span className="text-xs font-semibold">{notificationMsg}</span>
          <button onClick={() => setNotificationMsg(null)} className="p-1 hover:bg-white/10 rounded-lg text-slate-300">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* TOP HEADER & ACTION BANNER */}
      <div className="bg-gradient-to-r from-[#183153] via-[#203D66] to-[#2B5488] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-500/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[11px] font-bold tracking-wide uppercase text-teal-300 border border-white/10">
              <ChefHat className="w-3.5 h-3.5" />
              <span>Shared Clinical Recipe Library</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Master Recipe & Protocol Library
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Dietitian-curated master recipe collection, custom kitchen formulations, and saved AI protocols. 
              Any custom item created for a patient is automatically cataloged here and reusable across all patient diet plans.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => navigateTo('ai_meal_builder', { patientId: selectedPatient?.id })}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-2xl border border-white/20 transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Open AI Meal Planner</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleOpenCreateModal}
              className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white text-xs font-bold rounded-2xl shadow-lg hover:shadow-teal-500/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Create Custom Recipe</span>
            </button>
          </div>
        </div>

        {/* METRICS STRIP */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10 text-white">
          <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
            <span className="text-[10px] uppercase font-bold text-slate-300 block">Total Catalog</span>
            <div className="text-xl font-extrabold font-mono mt-0.5">{totalCount}</div>
            <span className="text-[10px] text-teal-300">Active Recipes</span>
          </div>

          <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
            <span className="text-[10px] uppercase font-bold text-slate-300 block">Dietitian Custom</span>
            <div className="text-xl font-extrabold font-mono mt-0.5 text-emerald-300">{customCount}</div>
            <span className="text-[10px] text-slate-300">Formulated in Clinic</span>
          </div>

          <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
            <span className="text-[10px] uppercase font-bold text-slate-300 block">Saved AI Protocols</span>
            <div className="text-xl font-extrabold font-mono mt-0.5 text-sky-300">{aiCount}</div>
            <span className="text-[10px] text-slate-300">Curated from Planner</span>
          </div>

          <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
            <span className="text-[10px] uppercase font-bold text-slate-300 block">Core Clinical</span>
            <div className="text-xl font-extrabold font-mono mt-0.5 text-amber-300">{coreCount}</div>
            <span className="text-[10px] text-slate-300">Baseline Formulations</span>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH CONTROL TOOLBAR */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        
        {/* Search Bar + Sort + View Mode */}
        <div className="flex flex-col md:flex-row items-center gap-3 justify-between">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by recipe name, ingredient (e.g. paneer, oats), dietary tag, or clinical benefit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-teal-500 font-medium"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-slate-600 rounded-md"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-between md:justify-end">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className="text-slate-400 font-medium text-[11px]">Sort:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="text-xs py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold outline-none cursor-pointer"
              >
                <option value="newest">Recently Added</option>
                <option value="name">Name (A → Z)</option>
                <option value="protein_desc">Highest Protein</option>
                <option value="calories_asc">Lowest Calories</option>
                <option value="calories_desc">Highest Calories</option>
              </select>
            </div>

            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white text-[#183153] shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'table' ? 'bg-white text-[#183153] shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Meal Slot Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-thin">
          <button
            onClick={() => setSelectedSlotFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedSlotFilter === 'all'
                ? 'bg-[#183153] text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Meal Slots ({recipes.length})
          </button>

          {SLOT_TYPES.map(slot => {
            const count = recipes.filter(r => r.slotType === slot.id).length;
            return (
              <button
                key={slot.id}
                onClick={() => setSelectedSlotFilter(slot.id)}
                className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedSlotFilter === slot.id
                    ? 'bg-teal-600 text-white shadow-2xs font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{slot.icon}</span>
                <span>{slot.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedSlotFilter === slot.id ? 'bg-teal-700 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Origin / Source Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Source:</span>
            
            <button
              onClick={() => setSelectedOriginFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                selectedOriginFilter === 'all' ? 'bg-slate-800 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Sources
            </button>

            <button
              onClick={() => setSelectedOriginFilter('custom')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                selectedOriginFilter === 'custom' ? 'bg-emerald-600 text-white font-bold' : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <ChefHat className="w-3 h-3" />
              <span>Dietitian Custom ({customCount})</span>
            </button>

            <button
              onClick={() => setSelectedOriginFilter('ai')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                selectedOriginFilter === 'ai' ? 'bg-sky-600 text-white font-bold' : 'bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Saved AI Protocols ({aiCount})</span>
            </button>

            <button
              onClick={() => setSelectedOriginFilter('core')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                selectedOriginFilter === 'core' ? 'bg-slate-700 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Core Baseline ({coreCount})
            </button>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing <strong>{filteredRecipes.length}</strong> of {totalCount} recipes
          </div>
        </div>
      </div>

      {/* RECIPES LISTING (GRID VS TABLE) */}
      {filteredRecipes.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <ChefHat className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">No matching recipes found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No recipes matched your search or filters. Try adjusting your query or create a new custom recipe template.
            </p>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 bg-[#183153] hover:bg-[#203D66] text-white text-xs font-bold rounded-xl shadow-xs inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Custom Recipe</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRecipes.map(recipe => {
            const isCustom = recipe.isCustom && !recipe.isAiGenerated;
            const isAi = recipe.isAiGenerated;

            return (
              <div 
                key={recipe.id}
                className="bg-white rounded-3xl border border-slate-200/90 hover:border-teal-400 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Image / Header Banner */}
                  <div className="relative h-36 bg-slate-900 overflow-hidden shrink-0">
                    {recipe.imageUrl ? (
                      <img 
                        src={recipe.imageUrl} 
                        alt={recipe.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-[#183153] to-[#2B5488] flex items-center justify-center text-white/20">
                        <ChefHat className="w-12 h-12" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    {/* Origin Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                      {isCustom && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-emerald-500 text-white shadow-sm flex items-center gap-1">
                          <ChefHat className="w-3 h-3" />
                          <span>Custom Dietitian</span>
                        </span>
                      )}
                      {isAi && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-sky-500 text-white shadow-sm flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>Saved AI Protocol</span>
                        </span>
                      )}
                      {!isCustom && !isAi && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-slate-700 text-white shadow-sm">
                          Core Protocol
                        </span>
                      )}
                    </div>

                    {/* Slot Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 backdrop-blur-md text-white border border-white/20">
                        {recipe.slotType ? recipe.slotType.replace('_', ' ').toUpperCase() : 'MEAL'}
                      </span>
                    </div>

                    {/* Title on Image */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="text-sm font-bold tracking-tight line-clamp-1 text-white drop-shadow-xs">
                        {recipe.name}
                      </h3>
                      <div className="flex items-center gap-2 text-[11px] text-slate-200 mt-0.5">
                        <span>{recipe.servingSizeDescription || '1 serving'}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {(recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0)}m
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3">
                    {/* Nutrition Macros Strip */}
                    <div className="grid grid-cols-4 gap-1.5 text-center text-[11px] font-mono bg-slate-50 p-2 rounded-xl border border-slate-200">
                      <div>
                        <div className="text-[9px] text-slate-400 uppercase font-bold">Cals</div>
                        <div className="font-bold text-amber-900">{recipe.calories}</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-slate-400 uppercase font-bold">Protein</div>
                        <div className="font-bold text-emerald-800">{recipe.protein}g</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-slate-400 uppercase font-bold">Carbs</div>
                        <div className="font-bold text-sky-800">{recipe.carbs}g</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-slate-400 uppercase font-bold">Fat</div>
                        <div className="font-bold text-rose-800">{recipe.fat}g</div>
                      </div>
                    </div>

                    {/* Clinical Benefit Highlight */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {recipe.clinicalBenefit || 'Optimized clinical nutrition formulation.'}
                    </p>

                    {/* Dietary Tags */}
                    {recipe.dietaryTags && recipe.dietaryTags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {recipe.dietaryTags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-semibold">
                            {tag}
                          </span>
                        ))}
                        {recipe.dietaryTags.length > 3 && (
                          <span className="px-1.5 py-0.5 text-slate-400 text-[10px] font-bold">
                            +{recipe.dietaryTags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Ingredients Snippet */}
                    <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 flex items-start gap-1.5">
                      <Utensils className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">
                        {(recipe.ingredients || []).map(i => i.item).join(', ')}
                      </span>
                    </div>

                    {/* Source Patient Attribution */}
                    {recipe.sourcePatientName && (
                      <div className="text-[10px] text-teal-800 bg-teal-50 px-2 py-1 rounded-lg flex items-center gap-1 font-medium">
                        <User className="w-3 h-3 text-teal-600" />
                        <span>Formulated for {recipe.sourcePatientName}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(recipe)}
                      className="p-1.5 text-slate-500 hover:text-[#183153] hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                      title="Edit Master Template"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDuplicateRecipe(recipe)}
                      className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                      title="Duplicate Recipe"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteRecipe(recipe)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Recipe"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openRecipeModal(recipe)}
                      className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleOpenAssignModal(recipe)}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Plan</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE / LIST VIEW */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Recipe</th>
                  <th className="py-3 px-4">Slot & Origin</th>
                  <th className="py-3 px-4">Serving</th>
                  <th className="py-3 px-4">Energy / Macros</th>
                  <th className="py-3 px-4">Key Ingredients</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecipes.map(recipe => {
                  const isCustom = recipe.isCustom && !recipe.isAiGenerated;
                  const isAi = recipe.isAiGenerated;

                  return (
                    <tr key={recipe.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {recipe.imageUrl ? (
                            <img src={recipe.imageUrl} alt={recipe.name} referrerPolicy="no-referrer" className="w-10 h-10 rounded-xl object-cover shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                              <ChefHat className="w-5 h-5" />
                            </div>
                          )}
                          <div>
                            <button 
                              onClick={() => openRecipeModal(recipe)}
                              className="font-bold text-[#183153] hover:text-teal-600 text-left transition-colors cursor-pointer line-clamp-1"
                            >
                              {recipe.name}
                            </button>
                            <span className="text-[11px] text-slate-500 line-clamp-1">{recipe.clinicalBenefit}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 block w-fit">
                            {recipe.slotType ? recipe.slotType.replace('_', ' ').toUpperCase() : 'MEAL'}
                          </span>
                          {isCustom && <span className="text-[10px] font-bold text-emerald-700 block">✨ Custom Dietitian</span>}
                          {isAi && <span className="text-[10px] font-bold text-sky-700 block">🤖 Saved AI</span>}
                          {!isCustom && !isAi && <span className="text-[10px] text-slate-500 block">Core Standard</span>}
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-medium text-slate-800">{recipe.servingSizeDescription || '1 portion'}</div>
                        <div className="text-[10px] text-slate-400">{(recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0)} min total</div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px]">
                        <div className="font-bold text-amber-900">{recipe.calories} kcal</div>
                        <div className="text-slate-500 text-[10px]">P: {recipe.protein}g • C: {recipe.carbs}g • F: {recipe.fat}g</div>
                      </td>

                      <td className="py-3 px-4 max-w-xs text-slate-600 truncate">
                        {(recipe.ingredients || []).map(i => i.item).join(', ')}
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openRecipeModal(recipe)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-[11px] cursor-pointer"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleOpenAssignModal(recipe)}
                            className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold text-[11px] cursor-pointer shadow-2xs"
                          >
                            + Add to Plan
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(recipe)}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteRecipe(recipe)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded-md"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 1: CREATE OR EDIT RECIPE MASTER TEMPLATE
          ========================================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-[#183153] to-[#244673] text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-teal-300" />
                  <span>{editingRecipe ? 'Edit Master Recipe' : 'Create Custom Recipe for Library'}</span>
                </h3>
                <p className="text-xs text-slate-200 mt-0.5">
                  Saved recipes are stored in the shared library and instantly accessible when building plans for any patient.
                </p>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(false)} 
                className="p-1.5 rounded-xl hover:bg-white/10 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveRecipeForm} className="p-6 overflow-y-auto space-y-4 flex-1 text-slate-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Recipe Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Recipe Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. High-Protein Vegetable Wrap with Sprouted Moong"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold focus:bg-white focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Target Meal Slot */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Target Meal Slot Type
                  </label>
                  <select
                    value={formSlotType}
                    onChange={(e: any) => setFormSlotType(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-semibold outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {SLOT_TYPES.map(s => (
                      <option key={s.id} value={s.id}>{s.icon} {s.label}</option>
                    ))}
                  </select>
                </div>

                {/* Category Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Category / Dish Group
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Low-Carb Breakfast / High-Protein Wrap"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-medium"
                  />
                </div>

                {/* Serving Size Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Portion Description *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1 wrap (220g) / 1 bowl (300ml)"
                    value={formServingSize}
                    onChange={(e) => setFormServingSize(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-medium"
                  />
                </div>

                {/* Prep & Cook Times */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Prep (Mins)</label>
                    <input
                      type="number"
                      value={formPrepTime}
                      onChange={(e) => setFormPrepTime(Number(e.target.value))}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Cook (Mins)</label>
                    <input
                      type="number"
                      value={formCookTime}
                      onChange={(e) => setFormCookTime(Number(e.target.value))}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-medium"
                    />
                  </div>
                </div>

                {/* Energy & Macros Strip */}
                <div className="sm:col-span-2 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    Macronutrient & Energy Profile
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-amber-800">Calories (kcal)</label>
                      <input
                        type="number"
                        value={formCalories}
                        onChange={(e) => setFormCalories(Number(e.target.value))}
                        className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg font-bold text-amber-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-emerald-800">Protein (g)</label>
                      <input
                        type="number"
                        value={formProtein}
                        onChange={(e) => setFormProtein(Number(e.target.value))}
                        className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg font-bold text-emerald-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-sky-800">Carbs (g)</label>
                      <input
                        type="number"
                        value={formCarbs}
                        onChange={(e) => setFormCarbs(Number(e.target.value))}
                        className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg font-bold text-sky-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-rose-800">Fat (g)</label>
                      <input
                        type="number"
                        value={formFat}
                        onChange={(e) => setFormFat(Number(e.target.value))}
                        className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg font-bold text-rose-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-indigo-800">Fiber (g)</label>
                      <input
                        type="number"
                        value={formFiber}
                        onChange={(e) => setFormFiber(Number(e.target.value))}
                        className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg font-bold text-indigo-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Ingredients Textarea */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Ingredients & Quantities (One item per line with colon, e.g. "Rolled Oats: 50g")
                  </label>
                  <textarea
                    rows={4}
                    placeholder={"Besan (gram flour): 60g\nLow-fat paneer (grated): 40g\nChopped spinach: 30g\nCold pressed oil: 1 tsp\nPinch of turmeric & salt"}
                    value={formIngredientsText}
                    onChange={(e) => setFormIngredientsText(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-mono focus:bg-white focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Preparation Steps Textarea */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Preparation & Cooking Instructions (One step per line)
                  </label>
                  <textarea
                    rows={3}
                    placeholder={"1. Mix ingredients into a smooth batter.\n2. Cook on medium heat on non-stick pan.\n3. Serve hot with green mint chutney."}
                    value={formStepsText}
                    onChange={(e) => setFormStepsText(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Clinical Benefit & Chef Tip */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Clinical Benefit / Rationale for Patient
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Low glycemic index, aids sustained satiety and blood glucose stabilization."
                    value={formClinicalBenefit}
                    onChange={(e) => setFormClinicalBenefit(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Chef / Preparation Tip
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Soak seeds for 20 minutes before mixing for optimal enzymatic activation."
                    value={formChefTip}
                    onChange={(e) => setFormChefTip(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-medium"
                  />
                </div>

                {/* Dietary Tags Preset Chips */}
                <div className="sm:col-span-2 space-y-2">
                  <label className="block text-xs font-bold text-slate-800">
                    Dietary & Clinical Tags
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_TAGS.map(tag => {
                      const isSelected = formTags.includes(tag);
                      return (
                        <button
                          type="button"
                          key={tag}
                          onClick={() => toggleFormTag(tag)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                            isSelected 
                              ? 'bg-teal-600 text-white shadow-2xs' 
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {isSelected && '✓ '}
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Image URL */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Photo URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-medium"
                  />
                </div>
              </div>

              {/* Submit / Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingRecipe ? 'Update Master Recipe' : 'Save to Recipe Library'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: ADD RECIPE TO PATIENT PLAN ASSIGNMENT MODAL
          ========================================================================= */}
      {assignRecipeModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95">
            
            <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-teal-600 to-emerald-700 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-white" />
                  <span>Add to Patient Diet Plan</span>
                </h3>
                <p className="text-xs text-teal-100 mt-0.5">
                  Insert "{assignRecipeModal.name}" as an independent customizable template
                </p>
              </div>
              <button 
                onClick={() => setAssignRecipeModal(null)} 
                className="p-1.5 rounded-xl hover:bg-white/10 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-slate-700">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1 text-xs">
                <div className="font-bold text-[#183153]">{assignRecipeModal.name}</div>
                <div className="text-slate-500">{assignRecipeModal.servingSizeDescription} • {assignRecipeModal.calories} kcal (P: {assignRecipeModal.protein}g, C: {assignRecipeModal.carbs}g, F: {assignRecipeModal.fat}g)</div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Select Patient *
                </label>
                <select
                  value={selectedAssignPatientId}
                  onChange={(e) => setSelectedAssignPatientId(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-slate-50 font-semibold outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.patientCode}) • {p.foodPreference}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Target Meal Slot *
                </label>
                <select
                  value={selectedAssignSlotType}
                  onChange={(e) => setSelectedAssignSlotType(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-slate-50 font-semibold outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {SLOT_TYPES.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.icon} {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 flex items-start gap-2">
                <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Independent Copy:</strong> Adding this recipe to the patient's plan will not change the master template in the Recipe Library. You can freely adjust portion sizes and ingredient amounts specifically for this patient.
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAssignRecipeModal(null)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecuteAssignToPlan}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Add to Patient Plan</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
