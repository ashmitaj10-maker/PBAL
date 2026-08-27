import { FoodSwapSuggestion } from '../types/clinic';

export interface CravingKnowledgeEntry {
  keywords: string[];
  dishName: string;
  category: string;
  originalMacros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    glycemicIndex: 'High' | 'Medium' | 'Low';
    drawbacks: string;
  };
  swaps: {
    foodPreference: 'Vegetarian' | 'Jain' | 'Vegan' | 'Eggetarian' | 'Non-Vegetarian' | 'Keto' | 'Gluten-Free';
    swapOptionName: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    glycemicIndex: 'Low' | 'Medium';
    preparationTip: string;
    clinicalReason: string;
    dietaryTags: string[];
    keyIngredients: string[];
  }[];
}

export const CRAVING_KNOWLEDGE_BASE: CravingKnowledgeEntry[] = [
  // 1. PIZZA
  {
    keywords: ['pizza', 'cheese pizza', 'pepperoni', 'slice', 'margherita', 'crust'],
    dishName: 'Commercial Stuffed Crust Double Cheese Pizza (2 large slices)',
    category: 'Fast Food & Cravings',
    originalMacros: {
      calories: 680,
      protein: 18,
      carbs: 76,
      fat: 32,
      fiber: 2,
      glycemicIndex: 'High',
      drawbacks: 'Refined bleached flour (maida), high trans-fats, processed high-sodium cheese leading to rapid postprandial glycemic surge.'
    },
    swaps: [
      {
        foodPreference: 'Vegetarian',
        swapOptionName: 'Paneer & Spelt Thin Crust Artisan Pizza with Roasted Bell Peppers & Basil',
        calories: 320,
        protein: 24,
        carbs: 28,
        fat: 12,
        fiber: 7,
        glycemicIndex: 'Low',
        preparationTip: 'Use ancient grain spelt or rolled oat flour for crust. Top with homemade sugar-free marinara, 60g low-fat fresh paneer, and oregano.',
        clinicalReason: 'Supplies slow-digesting casein protein and dietary bioflavonoids, curbing glucose excursions by 58%.',
        dietaryTags: ['Vegetarian', 'High Protein', 'Low GI', 'Ancient Grains'],
        keyIngredients: ['Spelt Flour', 'Low-Fat A2 Paneer', 'Fresh Basil', 'Sugar-Free Marinara']
      },
      {
        foodPreference: 'Jain',
        swapOptionName: 'Jain Almond-Flour & Raw Banana Crust Pizza with Mozzarella & Herb Puree (No Onion / Garlic)',
        calories: 290,
        protein: 18,
        carbs: 22,
        fat: 14,
        fiber: 8,
        glycemicIndex: 'Low',
        preparationTip: 'Mash steamed green plantain with almond flour & cumin. Bake base until golden. Top with Jain tomato puree (no onion/garlic), capsicum, and fresh cheese.',
        clinicalReason: 'Rich in gut-healing resistant starch from green plantains without insulinogenic root carbohydrates or alliums.',
        dietaryTags: ['Jain Safe', 'Root-Free', 'Gluten-Free', 'Low GI'],
        keyIngredients: ['Almond Flour', 'Green Plantain (Kacha Kela)', 'Jain Tomato Coulis', 'Fresh Mozzarella']
      },
      {
        foodPreference: 'Vegan',
        swapOptionName: 'Cauliflower-Crust Vegan Margherita with Cashew Mozzarella & Nutritional Yeast',
        calories: 260,
        protein: 16,
        carbs: 24,
        fat: 11,
        fiber: 9,
        glycemicIndex: 'Low',
        preparationTip: 'Squeeze moisture from grated cauliflower, bind with chia gel and almond flour. Bake crisp and top with silky soaked-cashew cream & fortified nutritional yeast.',
        clinicalReason: '100% plant-based bioactive folate and sulforaphane for liver detox phase II support and cardiovascular health.',
        dietaryTags: ['Vegan', 'Dairy-Free', 'Grain-Free', 'Sulforaphane Rich'],
        keyIngredients: ['Cauliflower', 'Chia Gel', 'Cashew Cream', 'Nutritional Yeast (B12)']
      },
      {
        foodPreference: 'Eggetarian',
        swapOptionName: 'Golden Egg White & Cottage Cheese Frittata Pizza with Sliced Mushrooms & Tomatoes',
        calories: 280,
        protein: 32,
        carbs: 12,
        fat: 10,
        fiber: 5,
        glycemicIndex: 'Low',
        preparationTip: 'Whisk 3 egg whites + 1 whole egg with herbs as the pan base. When set, layer crushed heirloom tomatoes, low-fat feta, and baby spinach under the broiler.',
        clinicalReason: 'Exceptional protein-to-energy ratio (32g protein), maximizing GLP-1 satiety hormone secretion.',
        dietaryTags: ['Eggetarian', 'Ultra High Protein', 'Ketogenic Friendly'],
        keyIngredients: ['Egg Whites', 'Whole Egg', 'Feta / Paneer', 'Heirloom Tomato', 'Baby Spinach']
      },
      {
        foodPreference: 'Non-Vegetarian',
        swapOptionName: 'Herb-Grilled Chicken Breast Meatza Pizza Crust with Sundried Tomatoes & Buffalo Cheese',
        calories: 340,
        protein: 42,
        carbs: 9,
        fat: 13,
        fiber: 4,
        glycemicIndex: 'Low',
        preparationTip: 'Flatten minced lean chicken breast with garlic & Italian spices into a 7-inch crust. Pre-bake 10 mins, add plum tomato salsa and broil with fresh cheese.',
        clinicalReason: 'Eliminates all refined carbohydrates while delivering 42g lean leucine-rich protein for muscle protein synthesis.',
        dietaryTags: ['Non-Vegetarian', 'Meatza Base', 'High Protein 40g+', 'Zero Refined Carbs'],
        keyIngredients: ['Lean Minced Chicken', 'Sundried Tomatoes', 'Fresh Buffalo Mozzarella', 'Oregano']
      },
      {
        foodPreference: 'Keto',
        swapOptionName: 'Crisp Psyllium-Almond Fathead Keto Pizza with Virgin Olive Oil & Arugula',
        calories: 310,
        protein: 22,
        carbs: 6,
        fat: 21,
        fiber: 9,
        glycemicIndex: 'Low',
        preparationTip: 'Melt mozzarella with cream cheese, almond flour, and psyllium husk. Roll thin, bake until browned, top with roasted zucchini ribbons & peppery arugula.',
        clinicalReason: 'Net carbohydrates under 5g, preserving ketosis and steady fatty acid oxidation.',
        dietaryTags: ['Keto Protocol', 'Ultra Low Carb', 'High Monounsaturated Fats'],
        keyIngredients: ['Almond Meal', 'Psyllium Husk', 'Mozzarella', 'Wild Arugula', 'EVOO']
      },
      {
        foodPreference: 'Gluten-Free',
        swapOptionName: 'Sprouted Ragi & Quinoa Crisp Crust Pizza with Fresh Bocconcini & Roasted Zucchini',
        calories: 300,
        protein: 19,
        carbs: 32,
        fat: 10,
        fiber: 8,
        glycemicIndex: 'Low',
        preparationTip: 'Blend sprouted finger millet (ragi) flour with quinoa flour and lukewarm water. Roll thin, bake at 210°C, and top with roasted garden vegetables.',
        clinicalReason: 'Rich in dietary calcium and polyphenols with zero wheat gluten proteins, soothing intestinal microvilli.',
        dietaryTags: ['Gluten-Free', 'Celiac Safe', 'Calcium Rich', 'Sprouted Millets'],
        keyIngredients: ['Sprouted Ragi Flour', 'Quinoa Flour', 'Bocconcini', 'Zucchini', 'Italian Herbs']
      }
    ]
  },

  // 2. BIRYANI / FRIED RICE
  {
    keywords: ['biryani', 'mutton biryani', 'chicken biryani', 'dum biryani', 'fried rice', 'pulao'],
    dishName: 'Restaurant Dum Biryani with Refined White Basmati & Vanaspati (1 full plate)',
    category: 'Rice & Heavy Mains',
    originalMacros: {
      calories: 780,
      protein: 22,
      carbs: 96,
      fat: 36,
      fiber: 2,
      glycemicIndex: 'High',
      drawbacks: 'High polished white starch paired with heated palm oil / vanaspati, causing steep insulin spikes followed by afternoon lethargy.'
    },
    swaps: [
      {
        foodPreference: 'Vegetarian',
        swapOptionName: 'Saffron Brown Rice & Sprouted Moong-Paneer Dum Biryani with Mint Raita',
        calories: 370,
        protein: 26,
        carbs: 42,
        fat: 10,
        fiber: 10,
        glycemicIndex: 'Low',
        preparationTip: 'Combine 50% sprouted moong & paneer cubes with parboiled Himalayan brown rice. Infuse saffron strands, kewra essence, and 1 tsp pure A2 ghee.',
        clinicalReason: 'Complex starches + sprouted amino acids yield sustained mitochondrial energy with zero postprandial glucose spike.',
        dietaryTags: ['Vegetarian', 'High Fiber 10g', 'Low GI', 'A2 Ghee Infused'],
        keyIngredients: ['Himalayan Brown Rice', 'A2 Paneer', 'Sprouted Moong', 'Kashmiri Saffron']
      },
      {
        foodPreference: 'Jain',
        swapOptionName: 'Jain Cauliflower & Foxtail Millet Dum Biryani with Spiced Raw Plantain & Curd Marinade (No Onion / Garlic)',
        calories: 330,
        protein: 20,
        carbs: 38,
        fat: 9,
        fiber: 11,
        glycemicIndex: 'Low',
        preparationTip: 'Saute steamed raw banana discs and paneer in a turmeric-coriander curd marinade. Layer with foxtail millet and grated cauliflower, seal pot with dough to dum cook.',
        clinicalReason: 'Millet prebiotics nourish bifidobacteria without any root-vegetable FODMAP irritants or heavy starches.',
        dietaryTags: ['Jain Safe', 'Millet Power', 'No Root Veggies', 'High Prebiotic'],
        keyIngredients: ['Foxtail Millet (Kangni)', 'Grated Cauliflower', 'Raw Banana', 'A2 Curd']
      },
      {
        foodPreference: 'Vegan',
        swapOptionName: 'Quinoa & Smoked Tofu Edamame Dum Biryani with Saffron-Infused Almond Milk Raita',
        calories: 340,
        protein: 28,
        carbs: 36,
        fat: 10,
        fiber: 11,
        glycemicIndex: 'Low',
        preparationTip: 'Marinate firm organic tofu and edamame in mustard oil, roasted cumin, and black cardamom. Layer with fluffy Andean quinoa and sealed-pot steam.',
        clinicalReason: 'Complete plant protein matrix containing all 9 essential amino acids plus isoflavones supporting arterial elasticity.',
        dietaryTags: ['Vegan', 'Plant Protein 28g', 'Dairy-Free', 'High Iron'],
        keyIngredients: ['Organic Firm Tofu', 'Edamame', 'Organic Quinoa', 'Black Cardamom', 'Almond Curd']
      },
      {
        foodPreference: 'Eggetarian',
        swapOptionName: 'Spiced Boiled Egg & Wild Rice Pulao with Grated Cauliflower & Toasted Cashews',
        calories: 360,
        protein: 28,
        carbs: 32,
        fat: 12,
        fiber: 8,
        glycemicIndex: 'Low',
        preparationTip: 'Sear 2 boiled egg whites + 1 whole egg in saffron-clove seasoning. Combine with 50/50 wild black rice and riced cauliflower.',
        clinicalReason: 'Choline from egg yolk supports hepatic phospholipid export, reversing fatty liver infiltration.',
        dietaryTags: ['Eggetarian', 'Choline Rich', 'High Protein', 'Liver Protective'],
        keyIngredients: ['Farm Fresh Eggs', 'Wild Rice', 'Riced Cauliflower', 'Cardamom Pods']
      },
      {
        foodPreference: 'Non-Vegetarian',
        swapOptionName: 'Royal Murgh Cauliflower & Quinoa Dum Biryani with Tender Chicken Breast',
        calories: 380,
        protein: 44,
        carbs: 26,
        fat: 9,
        fiber: 8,
        glycemicIndex: 'Low',
        preparationTip: 'Marinate skinless chicken breast in Greek yogurt, mint, ginger-garlic, and biryani spices. Layer with 60% grated cauliflower rice and 40% cooked quinoa.',
        clinicalReason: '44g of ultra-lean protein with massive reduction in glycemic load; maintains continuous fat oxidation.',
        dietaryTags: ['Non-Vegetarian', 'Ultra Lean Chicken', 'Protein 44g', 'Metabolic Boost'],
        keyIngredients: ['Skinless Chicken Breast', 'Greek Yogurt', 'Riced Cauliflower', 'Quinoa', 'Fresh Mint']
      },
      {
        foodPreference: 'Keto',
        swapOptionName: 'Zero-Carb Miracle Konjac & Cauliflower Biryani with Spiced Paneer / Chicken & Ghee',
        calories: 280,
        protein: 30,
        carbs: 4,
        fat: 16,
        fiber: 9,
        glycemicIndex: 'Low',
        preparationTip: 'Rinse shirataki rice thoroughly and dry roast. Fold into spiced sauteed cauliflower and protein with 1 tsp grass-fed A2 ghee and saffron.',
        clinicalReason: 'Virtually 0g net impact carbohydrates; glucomannan soluble fiber promotes prolonged gastric distension and satiety.',
        dietaryTags: ['Keto Protocol', 'Glucomannan Fiber', 'Zero Net Carbs'],
        keyIngredients: ['Shirataki Konjac Rice', 'Cauliflower Rice', 'A2 Ghee', 'Saffron']
      },
      {
        foodPreference: 'Gluten-Free',
        swapOptionName: 'Barnyard Millet (Sama Rice) Hyderabadi Dum Biryani with Golden Paneer & Pine Nuts',
        calories: 350,
        protein: 22,
        carbs: 40,
        fat: 11,
        fiber: 9,
        glycemicIndex: 'Low',
        preparationTip: 'Cook barnyard millet with star anise and cinnamon stick. Layer with pan-seared paneer cubes, saffron milk, and fresh coriander.',
        clinicalReason: 'Barnyard millet has the highest digestibility and lowest glycemic index among all cereal grains, optimal for insulin resistance.',
        dietaryTags: ['Gluten-Free', 'Barnyard Millet', 'Low Glycemic Index'],
        keyIngredients: ['Barnyard Millet (Sama)', 'Paneer', 'Star Anise', 'Pine Nuts']
      }
    ]
  },

  // 3. SAMOSA / FRIED SNACKS / PAKORAS
  {
    keywords: ['samosa', 'pakora', 'kachori', 'bhajiya', 'fried snack', 'vada', 'namkeen'],
    dishName: 'Halwai Deep-Fried Potato Samosas with Tamarind Sugar Chutney (2 pieces)',
    category: 'Tea Time Snacks',
    originalMacros: {
      calories: 540,
      protein: 6,
      carbs: 68,
      fat: 28,
      fiber: 3,
      glycemicIndex: 'High',
      drawbacks: 'Reheated oxidized frying oil creates advanced glycation end-products (AGEs) and high trans-fat loads that trigger systemic inflammation.'
    },
    swaps: [
      {
        foodPreference: 'Vegetarian',
        swapOptionName: 'Air-Fried Spiced Sprouted Moong & Paneer Potlis with Fresh Mint-Amla Chutney',
        calories: 190,
        protein: 16,
        carbs: 20,
        fat: 5,
        fiber: 8,
        glycemicIndex: 'Low',
        preparationTip: 'Wrap spiced sprouted moong and grated paneer in whole wheat phyllo or rice sheets. Brush with cold-pressed mustard oil, air-fry at 180°C for 9 mins.',
        clinicalReason: 'Eliminates 82% of oxidized lipid burden while boosting cellular antioxidant defenses with fresh raw amla (Vitamin C).',
        dietaryTags: ['Vegetarian', 'Air-Fried', 'Sprouted Power', 'Antioxidant Rich'],
        keyIngredients: ['Sprouted Moong', 'Low Fat Paneer', 'Phyllo Sheet', 'Raw Amla', 'Fresh Mint']
      },
      {
        foodPreference: 'Jain',
        swapOptionName: 'Jain Air-Crisped Green Banana & French Bean Samosa Pockets with Raw Coriander Chutney (No Potato / Onion)',
        calories: 175,
        protein: 12,
        carbs: 22,
        fat: 4,
        fiber: 9,
        glycemicIndex: 'Low',
        preparationTip: 'Season boiled raw green banana and crunchy green beans with cumin, amchur, and roasted fennel. Air-fry with minimal sesame oil spray.',
        clinicalReason: 'Replaces high-glycemic potato starch with resistant fiber that generates butyrate in the colon to seal gut tight junctions.',
        dietaryTags: ['Jain Safe', 'No Root Veggies', 'Resistant Starch', 'Air-Fried'],
        keyIngredients: ['Green Plantain (Raw Banana)', 'French Beans', 'Amchur', 'Fennel Seeds']
      },
      {
        foodPreference: 'Vegan',
        swapOptionName: 'Crispy Baked Edamame & Crumbled Tofu Samosa Cones with Stevia Tamarind Sauce',
        calories: 180,
        protein: 18,
        carbs: 16,
        fat: 5,
        fiber: 8,
        glycemicIndex: 'Low',
        preparationTip: 'Sauté smashed edamame and organic tofu with garam masala. Fold into Vietnamese rice paper or whole wheat wraps and bake at 200°C until crunchy.',
        clinicalReason: 'Phytoestrogens and plant sterols balance estrogen-to-progesterone ratios in PCOS patients while satisfying crunch cravings.',
        dietaryTags: ['Vegan', 'Plant Protein', 'Dairy-Free', 'Zero Refined Sugar'],
        keyIngredients: ['Edamame', 'Organic Tofu', 'Rice Paper Wraps', 'Monk Fruit Tamarind']
      },
      {
        foodPreference: 'Eggetarian',
        swapOptionName: 'Spiced Masala Egg-White Filled Crispy Phyllo Triangles with Greek Yogurt Herb Dip',
        calories: 195,
        protein: 22,
        carbs: 14,
        fat: 5,
        fiber: 5,
        glycemicIndex: 'Low',
        preparationTip: 'Scramble finely chopped egg whites with roasted cumin, green chilies, and ginger. Wrap into triangles, brush with egg wash, and bake crisp.',
        clinicalReason: 'Pure high-biological value albumin protein prevents post-snack hunger and stabilizes 4 PM cortisol rhythms.',
        dietaryTags: ['Eggetarian', 'Albumin Protein', 'Low Calorie Satiety'],
        keyIngredients: ['Egg Whites', 'Greek Yogurt', 'Phyllo Wrapper', 'Roasted Cumin']
      },
      {
        foodPreference: 'Non-Vegetarian',
        swapOptionName: 'Air-Fried Spiced Chicken Keema & Herb Samosas with Garlic-Mint Tzatziki',
        calories: 220,
        protein: 28,
        carbs: 12,
        fat: 6,
        fiber: 4,
        glycemicIndex: 'Low',
        preparationTip: 'Simmer extra-lean chicken mince with coriander, pomegranate powder (anardana), and mint. Bake in whole wheat wraps at 190°C for 10 mins.',
        clinicalReason: 'High heme iron and zinc enhance thyroid T4-to-T3 peripheral conversion while maintaining under 220 kcal.',
        dietaryTags: ['Non-Vegetarian', 'Lean Chicken Keema', 'High Iron & Zinc'],
        keyIngredients: ['Lean Chicken Breast Mince', 'Anardana', 'Whole Wheat Wrap', 'Mint']
      },
      {
        foodPreference: 'Keto',
        swapOptionName: 'Keto Almond-Flour Crust Paneer Tikka Samosa Bites with Coconut Mint Chutney',
        calories: 210,
        protein: 16,
        carbs: 4,
        fat: 14,
        fiber: 6,
        glycemicIndex: 'Low',
        preparationTip: 'Knead mozzarella and almond flour into dough. Stuff with spiced paneer / chicken mince and bake until deep golden brown.',
        clinicalReason: 'Zero wheat carbohydrates, zero seed oils; supports uninterrupted hepatic ketone generation.',
        dietaryTags: ['Keto Protocol', 'Under 4g Net Carbs', 'Zero Seed Oils'],
        keyIngredients: ['Almond Flour', 'Mozzarella Dough', 'Spiced Paneer', 'Coconut Mint Dip']
      },
      {
        foodPreference: 'Gluten-Free',
        swapOptionName: 'Buckwheat (Kuttu) & Sweet Potato Air-Fried Patties with Roasted Cumin Yogurt',
        calories: 185,
        protein: 11,
        carbs: 24,
        fat: 4,
        fiber: 7,
        glycemicIndex: 'Low',
        preparationTip: 'Combine roasted buckwheat flour with steamed sweet potato, rock salt, and green chili. Shape into medallions and air-fry until crisp.',
        clinicalReason: 'Buckwheat contains rutin, a potent bioflavonoid that strengthens capillary walls and reduces lower limb edema.',
        dietaryTags: ['Gluten-Free', 'Kuttu (Buckwheat)', 'Rutin Bioflavonoid'],
        keyIngredients: ['Buckwheat Flour', 'Sweet Potato', 'Rock Salt (Sendha Namak)', 'Cumin']
      }
    ]
  },

  // 4. ICE CREAM & FROZEN DESSERTS
  {
    keywords: ['ice cream', 'icecream', 'gelato', 'kulfi', 'sundae', 'frozen dessert', 'soft serve', 'cone'],
    dishName: 'Commercial Triple Chocolate / Vanilla Ice Cream Sundae (2 large scoops)',
    category: 'Desserts & Sweets',
    originalMacros: {
      calories: 460,
      protein: 5,
      carbs: 64,
      fat: 22,
      fiber: 1,
      glycemicIndex: 'High',
      drawbacks: 'High-fructose corn syrup, artificial emulsifiers (polysorbate 80) damaging gut mucosa, and immediate serum insulin spikes.'
    },
    swaps: [
      {
        foodPreference: 'Vegetarian',
        swapOptionName: 'Whipped Greek Yogurt & Frozen Berry Protein Gelato with Crushed Pistachios',
        calories: 145,
        protein: 18,
        carbs: 14,
        fat: 2,
        fiber: 5,
        glycemicIndex: 'Low',
        preparationTip: 'Blend thick hung Greek curd with frozen wild blueberries, pure vanilla bean extract, and stevia. Freeze for 30 mins and top with pistachio slivers.',
        clinicalReason: 'Delivers 18g bioactive whey/casein protein and anthocyanins that improve muscle insulin sensitivity.',
        dietaryTags: ['Vegetarian', 'Probiotic Gelato', 'High Protein 18g', 'Anthocyanin Rich'],
        keyIngredients: ['Strained Greek Yogurt', 'Frozen Blueberries', 'Vanilla Bean', 'Pistachios']
      },
      {
        foodPreference: 'Jain',
        swapOptionName: 'Jain Cardamom-Saffron Golden Almond Milk Frozen Kulfi with Rose Petals & Monk Fruit',
        calories: 120,
        protein: 7,
        carbs: 8,
        fat: 7,
        fiber: 4,
        glycemicIndex: 'Low',
        preparationTip: 'Slow-simmer unsweetened almond milk with Kashmiri saffron, crushed green cardamom, and monk fruit extract. Pour into kulfi molds and freeze.',
        clinicalReason: 'Saffron possesses potent neuroprotective safranal that elevates brain serotonin and curbs evening comfort eating.',
        dietaryTags: ['Jain Safe', 'Saffron Infused', 'Sugar-Free', 'Kulfi Delight'],
        keyIngredients: ['Almond Milk', 'Kashmiri Saffron', 'Cardamom', 'Monk Fruit', 'Dried Rose']
      },
      {
        foodPreference: 'Vegan',
        swapOptionName: 'Frozen Creamy Coconut-Cocoa Nice Cream with Chia Seeds & Raw Cacao Nibs',
        calories: 140,
        protein: 8,
        carbs: 12,
        fat: 8,
        fiber: 6,
        glycemicIndex: 'Low',
        preparationTip: 'Freeze sliced raw banana / avocado cubes. Blend smooth with unsweetened coconut cream, Dutch raw cacao powder, and liquid stevia.',
        clinicalReason: 'Rich in polyphenols and magnesium that relax smooth vascular muscles and optimize evening melatonin synthesis.',
        dietaryTags: ['Vegan', 'Dairy-Free', 'Raw Cacao Polyphenols', 'Magnesium Rich'],
        keyIngredients: ['Avocado / Banana Base', 'Raw Cacao', 'Coconut Cream', 'Cacao Nibs']
      },
      {
        foodPreference: 'Eggetarian',
        swapOptionName: 'Whipped Nitrogen Egg-White Meringue Custard Frost with Espresso & Dark Chocolate Flakes',
        calories: 110,
        protein: 16,
        carbs: 6,
        fat: 2,
        fiber: 3,
        glycemicIndex: 'Low',
        preparationTip: 'Whip pasteurized egg whites to stiff peaks with erythritol and instant espresso powder. Fold gently into frozen yogurt base and chill.',
        clinicalReason: 'Ultra-light caloric density with rapid gastric emptying and sustained branched-chain amino acids.',
        dietaryTags: ['Eggetarian', 'Ultra Low Calorie (110 kcal)', 'High Protein'],
        keyIngredients: ['Egg White Albumin', 'Espresso Extract', 'Erythritol', '85% Dark Chocolate']
      },
      {
        foodPreference: 'Non-Vegetarian',
        swapOptionName: 'Hydrolyzed Collagen Peptide Vanilla Soft Serve with Frozen Raspberries',
        calories: 135,
        protein: 20,
        carbs: 9,
        fat: 2,
        fiber: 5,
        glycemicIndex: 'Low',
        preparationTip: 'Blend grass-fed bovine/marine collagen peptides with chilled unsweetened almond milk, frozen raspberries, and vanilla extract until frothy-thick.',
        clinicalReason: 'Supplies proline and glycine peptides that rebuild intestinal mucosal integrity and joint cartilage.',
        dietaryTags: ['Non-Vegetarian', 'Collagen 20g', 'Gut Healing Glycine', 'Skin Rejuvenation'],
        keyIngredients: ['Hydrolyzed Collagen', 'Frozen Raspberries', 'Almond Milk', 'Vanilla']
      },
      {
        foodPreference: 'Keto',
        swapOptionName: 'Avocado-MCT Oil Keto Dark Velvet Cream with Crushed Macadamia Nuts',
        calories: 160,
        protein: 6,
        carbs: 3,
        fat: 15,
        fiber: 7,
        glycemicIndex: 'Low',
        preparationTip: 'Puree ripe Hass avocado with pure MCT oil, heavy coconut cream, 100% unsweetened chocolate, and monk fruit drops. Freeze 45 mins.',
        clinicalReason: 'Medium-chain triglycerides (C8/C10) convert directly into liver ketone bodies, suppressing ghrelin hunger signals.',
        dietaryTags: ['Keto Protocol', 'C8 MCT Oil', 'Under 3g Net Carbs', 'Zero Blood Sugar Impact'],
        keyIngredients: ['Hass Avocado', 'MCT Oil', 'Raw Cocoa', 'Macadamia Nuts']
      },
      {
        foodPreference: 'Gluten-Free',
        swapOptionName: 'Creamy Mango-Chia Seed Parfait Ice with Toasted Hemp Hearts & Cinnamon',
        calories: 150,
        protein: 9,
        carbs: 18,
        fat: 5,
        fiber: 8,
        glycemicIndex: 'Low',
        preparationTip: 'Soak black chia seeds in coconut milk with natural Alphonso mango pulp and Ceylon cinnamon. Freeze until firm like gelato.',
        clinicalReason: 'Mucilage soluble fiber regulates lipid metabolism and lowers circulating LDL-cholesterol.',
        dietaryTags: ['Gluten-Free', 'High Soluble Fiber', 'Cinnamon Blood Sugar Regulator'],
        keyIngredients: ['Chia Seeds', 'Coconut Milk', 'Natural Mango Puree', 'Hemp Hearts']
      }
    ]
  },

  // 5. GULAB JAMUN & INDIAN SWEETS / MITHAI
  {
    keywords: ['gulab jamun', 'rasgulla', 'jalebi', 'kaju katli', 'mithai', 'barfi', 'halwa', 'laddu', 'ladoo', 'sweet'],
    dishName: 'Traditional Khoya Gulab Jamun in Sugar Syrup (2 pieces)',
    category: 'Desserts & Sweets',
    originalMacros: {
      calories: 450,
      protein: 6,
      carbs: 72,
      fat: 18,
      fiber: 0.5,
      glycemicIndex: 'High',
      drawbacks: 'Concentrated refined sucrose syrup combined with saturated milk fats triggers rapid hepatic de novo lipogenesis (visceral fat storage).'
    },
    swaps: [
      {
        foodPreference: 'Vegetarian',
        swapOptionName: 'Warm Cardamom-Saffron A2 Chenna Dumplings in Stevia Rose Water',
        calories: 130,
        protein: 14,
        carbs: 10,
        fat: 4,
        fiber: 3,
        glycemicIndex: 'Low',
        preparationTip: 'Knead fresh homemade cow milk chenna with crushed cardamom and 1 tsp oat flour. Steam softly, soak in warm Kashmiri rose water infused with stevia & saffron.',
        clinicalReason: 'Preserves the rich melt-in-mouth texture of traditional mithai with 70% fewer calories and zero sucrose.',
        dietaryTags: ['Vegetarian', 'Fresh Chenna', 'Sugar-Free', 'Stevia Rose Infused'],
        keyIngredients: ['A2 Cow Chenna', 'Kashmiri Saffron', 'Rose Water', 'Cardamom', 'Stevia']
      },
      {
        foodPreference: 'Jain',
        swapOptionName: 'Jain Warm Almond-Pistachio Saffron Burfi with Stevia & Nutmeg (Zero Sugar)',
        calories: 125,
        protein: 8,
        carbs: 6,
        fat: 9,
        fiber: 4,
        glycemicIndex: 'Low',
        preparationTip: 'Cook blanched almond flour with a splash of milk, cardamom, nutmeg, and monk fruit sweetener until it forms a soft dough. Cut into diamonds.',
        clinicalReason: 'Supplies alpha-tocopherol (Vitamin E) and magnesium without elevating insulin or uric acid.',
        dietaryTags: ['Jain Safe', 'Almond Flour', 'No Root Veggies', 'Heart Healthy Fats'],
        keyIngredients: ['Blanched Almonds', 'Pistachio Slivers', 'Nutmeg', 'Monk Fruit']
      },
      {
        foodPreference: 'Vegan',
        swapOptionName: 'Steamed Spiced Tofu & Dates-Almond Jamun Spheres in Warm Vanilla Cardamom Tea',
        calories: 120,
        protein: 11,
        carbs: 14,
        fat: 3,
        fiber: 5,
        glycemicIndex: 'Low',
        preparationTip: 'Blend silken tofu with almond butter, rolled oats, and cardamom. Roll into spheres, steam for 6 mins, and rest in warm spiced saffron infusion.',
        clinicalReason: '100% plant-based with zero cholesterol, supporting arterial flexibility and metabolic calming.',
        dietaryTags: ['Vegan', 'Dairy-Free', 'Steamed', 'Zero Refined Sugar'],
        keyIngredients: ['Silken Tofu', 'Almond Butter', 'Oat Meal', 'Saffron Infusion']
      },
      {
        foodPreference: 'Eggetarian',
        swapOptionName: 'Warm Fluffy Egg-White Protein Soufflé with Cardamom Saffron Drizzle',
        calories: 115,
        protein: 18,
        carbs: 5,
        fat: 2,
        fiber: 2,
        glycemicIndex: 'Low',
        preparationTip: 'Whip 3 egg whites with a dash of cream of tartar, erythritol, and saffron. Bake in ramekins at 180°C for 12 mins until puffed and golden.',
        clinicalReason: 'Maximum protein bio-efficiency with under 115 calories, completely displacing sugary cravings.',
        dietaryTags: ['Eggetarian', 'Protein Soufflé', 'Saffron Glaze', 'High Protein'],
        keyIngredients: ['Egg White Albumin', 'Saffron', 'Cardamom', 'Erythritol']
      },
      {
        foodPreference: 'Non-Vegetarian',
        swapOptionName: 'Vanilla-Rose Collagen Peptide Jellies with Pistachio & Saffron Dust',
        calories: 95,
        protein: 16,
        carbs: 4,
        fat: 1,
        fiber: 2,
        glycemicIndex: 'Low',
        preparationTip: 'Dissolve grass-fed bovine gelatin / collagen in warm rose-saffron herbal tea sweetened with stevia. Pour into molds and chill until set.',
        clinicalReason: 'High concentrations of proline and glycine optimize sleep architecture and support gut barrier integrity.',
        dietaryTags: ['Non-Vegetarian', 'Collagen 16g', 'Gut Mucosa Support', 'Under 100 Calories'],
        keyIngredients: ['Grass-Fed Gelatin / Collagen', 'Rose Hydrosol', 'Pistachio Crumbs']
      },
      {
        foodPreference: 'Keto',
        swapOptionName: 'Keto Cardamom-Ghee Fat Bomb Halwa with Crushed Walnuts & Erythritol',
        calories: 140,
        protein: 6,
        carbs: 2,
        fat: 13,
        fiber: 4,
        glycemicIndex: 'Low',
        preparationTip: 'Slow roast almond flour in 1 tsp pure A2 ghee with crushed green cardamom. Sweeten with monk fruit and garnish with roasted walnuts.',
        clinicalReason: 'Zero carbohydrate impact, rich in omega-3 alpha-linolenic acid (ALA) for cognitive clarity.',
        dietaryTags: ['Keto Protocol', 'Under 2g Carbs', 'Omega-3 ALA', 'Ketogenic Mithai'],
        keyIngredients: ['Almond Meal', 'A2 Ghee', 'Walnuts', 'Monk Fruit']
      },
      {
        foodPreference: 'Gluten-Free',
        swapOptionName: 'Sprouted Foxtail Millet & Roasted Jaggery-Free Ladoos with Flaxseeds',
        calories: 135,
        protein: 8,
        carbs: 18,
        fat: 5,
        fiber: 6,
        glycemicIndex: 'Low',
        preparationTip: 'Roast sprouted foxtail millet flour with roasted flaxseed powder and cardamom. Bind with warm date puree and roll into bite-sized balls.',
        clinicalReason: 'Packed with lignans and slow-release millet starch that support estrogen clearance in PCOS.',
        dietaryTags: ['Gluten-Free', 'Sprouted Millet', 'Flax Lignans', 'Hormonal Balance'],
        keyIngredients: ['Sprouted Foxtail Millet', 'Golden Flaxseeds', 'Date Puree', 'Cardamom']
      }
    ]
  },

  // 6. CREAMY PASTA / WHITE SAUCE ALFREDO
  {
    keywords: ['pasta', 'alfredo', 'white sauce', 'mac and cheese', 'spaghetti', 'carbonara', 'penne', 'lasagna'],
    dishName: 'Commercial White Sauce Creamy Penne Alfredo with Garlic Bread',
    category: 'Pasta & Noodles',
    originalMacros: {
      calories: 740,
      protein: 16,
      carbs: 92,
      fat: 36,
      fiber: 3,
      glycemicIndex: 'High',
      drawbacks: 'Refined wheat semolina drenched in heavy cream and butter produces high saturated fat + high glycemic index synergy for arterial stiffness.'
    },
    swaps: [
      {
        foodPreference: 'Vegetarian',
        swapOptionName: 'Edamame & Spelt Pasta in Silky Garlic-Hung Curd & Nutritional Yeast Sauce',
        calories: 310,
        protein: 26,
        carbs: 34,
        fat: 8,
        fiber: 10,
        glycemicIndex: 'Low',
        preparationTip: 'Toss edamame high-protein pasta with a blended sauce of hung Greek yogurt, roasted garlic, black pepper, and nutritional yeast.',
        clinicalReason: 'Cuts 430 calories while delivering 26g complete protein and B-complex vitamins for nervous system resilience.',
        dietaryTags: ['Vegetarian', 'Edamame Protein', 'Low Calorie Alfredo', 'High Fiber 10g'],
        keyIngredients: ['Edamame Pasta', 'Greek Yogurt', 'Roasted Garlic', 'Nutritional Yeast']
      },
      {
        foodPreference: 'Jain',
        swapOptionName: 'Jain Zucchini Ribbons & Green Plantain Gnocchi in Herb-Cashew Cream (No Onion / Garlic)',
        calories: 280,
        protein: 16,
        carbs: 26,
        fat: 12,
        fiber: 9,
        glycemicIndex: 'Low',
        preparationTip: 'Spiralize fresh zucchini into ribbons. Make soft gnocchi from steamed raw green bananas. Coat in blended soaked cashews with basil and oregano.',
        clinicalReason: 'Zero alliums, zero refined wheat; monounsaturated fatty acids from cashews optimize lipid profiles.',
        dietaryTags: ['Jain Safe', 'Cashew Cream', 'Zucchini Ribbons', 'No Root Veggies'],
        keyIngredients: ['Zucchini', 'Green Plantain (Raw Banana)', 'Cashew Milk', 'Italian Basil']
      },
      {
        foodPreference: 'Vegan',
        swapOptionName: 'Hearts of Palm & Konjac Fettuccine in Velvety Roasted Cauliflower-Cashew Alfredo',
        calories: 220,
        protein: 14,
        carbs: 18,
        fat: 9,
        fiber: 11,
        glycemicIndex: 'Low',
        preparationTip: 'Steam cauliflower with vegetable broth and blend with soaked cashews and fortified yeast. Toss with sautéed hearts of palm noodles.',
        clinicalReason: 'Massive caloric deficit with 11g prebiotic fiber supporting microbiome short-chain fatty acid production.',
        dietaryTags: ['Vegan', 'Dairy-Free Alfredo', 'Cauliflower Cream', 'Ultra Low Calorie'],
        keyIngredients: ['Hearts of Palm Noodles', 'Steamed Cauliflower', 'Cashews', 'Nutritional Yeast']
      },
      {
        foodPreference: 'Eggetarian',
        swapOptionName: 'Egg White Noodle Strips in Creamy Feta-Herb Emulsion with Sun-Blistered Tomatoes',
        calories: 260,
        protein: 30,
        carbs: 10,
        fat: 10,
        fiber: 6,
        glycemicIndex: 'Low',
        preparationTip: 'Cook ultra-thin egg-white crêpes and slice into fettuccine noodles. Toss in warm crumbled Greek feta, olive oil, and crushed black pepper.',
        clinicalReason: 'Provides 30g pure bioavailable protein with negligible carbohydrates, promoting daytime metabolic rate.',
        dietaryTags: ['Eggetarian', '30g Protein', 'Low Carb Pasta', 'Mediterranean Style'],
        keyIngredients: ['Egg Whites', 'Greek Feta Cheese', 'Sun-Blistered Tomatoes', 'EVOO']
      },
      {
        foodPreference: 'Non-Vegetarian',
        swapOptionName: 'Grilled Herb Chicken Breast with Zucchini Fettuccine in Creamy Parmesan-Truffle Sauce',
        calories: 340,
        protein: 42,
        carbs: 8,
        fat: 14,
        fiber: 6,
        glycemicIndex: 'Low',
        preparationTip: 'Pan-sear 180g lean chicken breast with rosemary. Serve over warm spiralized zucchini ribbons with light parmesan-yogurt emulsion.',
        clinicalReason: '42g lean protein accelerates thermogenesis (diet-induced thermogenesis) while protecting muscle during fat loss.',
        dietaryTags: ['Non-Vegetarian', 'Chicken & Zoodles', '42g Protein', 'Gourmet Clinical'],
        keyIngredients: ['Skinless Chicken Breast', 'Fresh Zucchini Zoodles', 'Aged Parmesan', 'Rosemary']
      },
      {
        foodPreference: 'Keto',
        swapOptionName: 'Shirataki Konjac Pasta Carbonara with Smoked Pancetta / Paneer & Egg Yolk Sauce',
        calories: 270,
        protein: 22,
        carbs: 2,
        fat: 19,
        fiber: 8,
        glycemicIndex: 'Low',
        preparationTip: 'Dry-sear rinsed shirataki noodles. Whisk egg yolk with grated pecorino and fold into warm pan off heat for an authentic silky carbonara.',
        clinicalReason: 'Under 2g net carbohydrates with rich dietary fat that triggers CCK hormone release for rapid satiety.',
        dietaryTags: ['Keto Protocol', 'Under 2g Carbs', 'Authentic Carbonara Method'],
        keyIngredients: ['Shirataki Noodles', 'Pasture Egg Yolk', 'Pecorino Romano', 'Smoked Crisp']
      },
      {
        foodPreference: 'Gluten-Free',
        swapOptionName: 'Red Lentil (Masoor) Penne Pasta in Roasted Red Pepper & Basil Pomodoro with Goat Cheese',
        calories: 320,
        protein: 24,
        carbs: 38,
        fat: 8,
        fiber: 12,
        glycemicIndex: 'Low',
        preparationTip: 'Boil 100% red lentil penne. Toss in blended roasted red capsicum, tomato, and fresh basil, finished with 20g creamy goat cheese.',
        clinicalReason: 'Celiac safe with 12g soluble fiber and slow-absorbing plant protein that halts blood sugar spikes.',
        dietaryTags: ['Gluten-Free', '100% Red Lentil Penne', 'High Fiber 12g', 'Lycopene Rich'],
        keyIngredients: ['Red Lentil Pasta', 'Roasted Red Bell Peppers', 'Goat Cheese', 'Fresh Basil']
      }
    ]
  },

  // 7. BURGER & SLIDERS
  {
    keywords: ['burger', 'sliders', 'cheeseburger', 'mcchicken', 'whopper', 'patty', 'bun'],
    dishName: 'Fast-Food Double Cheeseburger with Refined White Bun & Mayo',
    category: 'Fast Food & Cravings',
    originalMacros: {
      calories: 690,
      protein: 26,
      carbs: 62,
      fat: 38,
      fiber: 2,
      glycemicIndex: 'High',
      drawbacks: 'Ultra-processed refined flour buns, high-sodium meat/cheese blends, and inflammatory soybean oil mayo.'
    },
    swaps: [
      {
        foodPreference: 'Vegetarian',
        swapOptionName: 'Grilled Portobello Mushroom & Black Bean-Paneer Burger in Romaine Lettuce Wrap',
        calories: 270,
        protein: 22,
        carbs: 18,
        fat: 11,
        fiber: 9,
        glycemicIndex: 'Low',
        preparationTip: 'Grill a large portobello cap and homemade black bean-paneer patty. Wrap in crisp romaine leaves with avocado spread and tomato slice.',
        clinicalReason: 'Portobellos provide ergothioneine, a cellular antioxidant, while the lettuce wrap drops 250 kcal of refined starch.',
        dietaryTags: ['Vegetarian', 'Lettuce Wrap', 'Ergothioneine Rich', 'High Fiber'],
        keyIngredients: ['Portobello Mushroom', 'Black Beans', 'Low Fat Paneer', 'Romaine Lettuce']
      },
      {
        foodPreference: 'Jain',
        swapOptionName: 'Jain Green Banana & Sprouted Moong Patty Burger on Almond Flour Buns (No Onion / Garlic / Potato)',
        calories: 260,
        protein: 18,
        carbs: 22,
        fat: 12,
        fiber: 8,
        glycemicIndex: 'Low',
        preparationTip: 'Bind steamed raw banana and sprouted moong with cumin and coriander. Pan-sear in olive oil and serve inside freshly baked almond buns.',
        clinicalReason: 'Zero root vegetables and high resistant starch promote healthy insulin sensitivity and bowel regularity.',
        dietaryTags: ['Jain Safe', 'Almond Bun', 'No Root Veggies', 'High Protein'],
        keyIngredients: ['Green Plantain (Raw Banana)', 'Sprouted Moong', 'Almond Flour Bun', 'Mint Puree']
      },
      {
        foodPreference: 'Vegan',
        swapOptionName: 'Smoked Tempeh & Edamame Umami Burger with Avocado-Lime Spread & Tomato',
        calories: 250,
        protein: 24,
        carbs: 16,
        fat: 10,
        fiber: 10,
        glycemicIndex: 'Low',
        preparationTip: 'Marinate organic tempeh patty in tamari and smoked paprika. Grill until caramelized and serve in a double lettuce wrap with guacamole.',
        clinicalReason: 'Fermented tempeh provides live bioactive prebiotics and plant isoflavones for metabolic regulation.',
        dietaryTags: ['Vegan', 'Fermented Tempeh', 'Gut Probiotics', 'Dairy-Free'],
        keyIngredients: ['Organic Tempeh', 'Edamame', 'Fresh Guacamole', 'Smoked Paprika']
      },
      {
        foodPreference: 'Eggetarian',
        swapOptionName: 'Sunny-Side Egg & Spiced Cottage Cheese Stack Burger on Portobello Mushroom Buns',
        calories: 280,
        protein: 28,
        carbs: 8,
        fat: 14,
        fiber: 6,
        glycemicIndex: 'Low',
        preparationTip: 'Use two grilled portobello caps as the top and bottom buns. Sandwich a pasture-raised egg, 50g pan-seared paneer, and baby arugula.',
        clinicalReason: 'Choline, lutein, and high protein density stimulate post-meal fullness for over 4 hours.',
        dietaryTags: ['Eggetarian', 'Portobello Buns', 'High Satiety', 'Low Carb'],
        keyIngredients: ['Pasture Raised Egg', 'Paneer Slab', 'Portobello Mushroom Buns', 'Arugula']
      },
      {
        foodPreference: 'Non-Vegetarian',
        swapOptionName: 'Grilled Lean Turkey / Chicken Breast Burger in Crisp Iceberg Wrap with Herb Tzatziki',
        calories: 290,
        protein: 38,
        carbs: 6,
        fat: 10,
        fiber: 4,
        glycemicIndex: 'Low',
        preparationTip: 'Grill a 160g seasoned lean poultry breast. Layer inside crisp iceberg lettuce cups with sliced cucumber, tomato, and Greek yogurt dill tzatziki.',
        clinicalReason: 'Saves 400 calories and delivers 38g pure protein without any refined bread spikes.',
        dietaryTags: ['Non-Vegetarian', 'Ultra Lean 38g Protein', 'Iceberg Wrap', 'Calorie Crusher'],
        keyIngredients: ['Skinless Turkey / Chicken Breast', 'Iceberg Lettuce', 'Greek Yogurt Tzatziki']
      },
      {
        foodPreference: 'Keto',
        swapOptionName: 'Keto Bacon & Avocado Butter-Basted Burger Patty with Cheddar & Pickles',
        calories: 330,
        protein: 28,
        carbs: 3,
        fat: 23,
        fiber: 5,
        glycemicIndex: 'Low',
        preparationTip: 'Pan-sear prime grass-fed patty in grass-fed butter. Top with aged sharp cheddar, avocado slices, and sugar-free dill pickles on butterhead lettuce.',
        clinicalReason: 'Zero carbohydrate load; stimulates ketogenesis and preserves baseline fasting insulin levels.',
        dietaryTags: ['Keto Protocol', 'Under 3g Net Carbs', 'Grass-Fed Fat', 'Zero Glycemic Surge'],
        keyIngredients: ['Grass-Fed Mince Patty', 'Sharp Cheddar', 'Avocado', 'Butterhead Lettuce']
      },
      {
        foodPreference: 'Gluten-Free',
        swapOptionName: 'Sprouted Quinoa & Sweet Potato Patty Burger on Toasted Millet Buns with Tomato Salsa',
        calories: 295,
        protein: 16,
        carbs: 36,
        fat: 8,
        fiber: 8,
        glycemicIndex: 'Low',
        preparationTip: 'Blend cooked quinoa and sweet potato with herbs into a hearty patty. Bake and serve on toasted 100% pearl millet (bajra) buns.',
        clinicalReason: 'Rich in dietary zinc, iron, and slow-burning carbohydrates that stabilize thyroid hormones.',
        dietaryTags: ['Gluten-Free', 'Millet Bun', 'Celiac Friendly', 'Zinc Rich'],
        keyIngredients: ['Cooked Quinoa', 'Sweet Potato', 'Bajra Millet Bun', 'Fresh Salsa']
      }
    ]
  },

  // 8. FRENCH FRIES & POTATO SNACKS
  {
    keywords: ['fries', 'french fries', 'potato chips', 'potato wedges', 'crisps', 'loaded fries'],
    dishName: 'Deep-Fried Salted French Fries (Large Serving)',
    category: 'Fast Food & Cravings',
    originalMacros: {
      calories: 510,
      protein: 5,
      carbs: 66,
      fat: 26,
      fiber: 4,
      glycemicIndex: 'High',
      drawbacks: 'Acrylamides from deep-frying high-starch potatoes at high temperatures, paired with excess sodium that promotes fluid retention.'
    },
    swaps: [
      {
        foodPreference: 'Vegetarian',
        swapOptionName: 'Air-Fried Crispy Zucchini & Sweet Potato Shoestrings with Paprika Herb Dip',
        calories: 160,
        protein: 8,
        carbs: 22,
        fat: 4,
        fiber: 7,
        glycemicIndex: 'Low',
        preparationTip: 'Cut sweet potatoes and zucchini into shoestrings. Toss with 1 tsp cold-pressed olive oil, smoked paprika, and nutritional yeast. Air-fry at 200°C for 14 mins.',
        clinicalReason: 'Cuts 350 calories and delivers beta-carotene and potassium to counteract water retention.',
        dietaryTags: ['Vegetarian', 'Air-Fried', 'Beta-Carotene', 'Low Sodium'],
        keyIngredients: ['Sweet Potato', 'Zucchini', 'Cold-Pressed Olive Oil', 'Smoked Paprika']
      },
      {
        foodPreference: 'Jain',
        swapOptionName: 'Jain Air-Crisped Green Banana Wedges with Chaat Masala & Lemon (No Potato)',
        calories: 140,
        protein: 5,
        carbs: 24,
        fat: 3,
        fiber: 8,
        glycemicIndex: 'Low',
        preparationTip: 'Slice raw green bananas into thick wedges. Steam 3 mins, dust with rock salt and chaat masala, then air-fry until extra crunchy.',
        clinicalReason: 'Resistant starch feeds beneficial gut flora and improves insulin sensitivity without potato glycation.',
        dietaryTags: ['Jain Safe', 'No Potato', 'Resistant Starch', 'Air-Fried Crunch'],
        keyIngredients: ['Green Plantain (Raw Banana)', 'Chaat Masala', 'Lemon Juice', 'Rock Salt']
      },
      {
        foodPreference: 'Vegan',
        swapOptionName: 'Crispy Baked Portobello & Carrot Fries with Silky Avocado-Coriander Crema',
        calories: 145,
        protein: 7,
        carbs: 16,
        fat: 6,
        fiber: 8,
        glycemicIndex: 'Low',
        preparationTip: 'Slice portobello mushrooms and carrots into fry strips. Coat in almond meal and herbs, bake until crisp, and serve with fresh avocado crema.',
        clinicalReason: '100% plant-based antioxidants with low glycemic impact, protecting vascular endothelial walls.',
        dietaryTags: ['Vegan', 'Dairy-Free', 'Almond Crusted', 'Mushroom Power'],
        keyIngredients: ['Portobello Strips', 'Carrots', 'Almond Meal', 'Fresh Avocado']
      },
      {
        foodPreference: 'Eggetarian',
        swapOptionName: 'Egg-White Battered Air-Fried Halloumi / Paneer Fries with Zaatar Dip',
        calories: 190,
        protein: 20,
        carbs: 6,
        fat: 10,
        fiber: 3,
        glycemicIndex: 'Low',
        preparationTip: 'Dip strips of low-fat paneer in whisked egg white, roll in flaxseed powder and zaatar spices. Air-fry at 190°C for 8 mins.',
        clinicalReason: 'Delivers 20g protein with minimal carbs, eliminating insulin peaks and sugar crashes.',
        dietaryTags: ['Eggetarian', 'High Protein 20g', 'Flaxseed Coating'],
        keyIngredients: ['Low Fat Paneer', 'Egg White', 'Golden Flax Meal', 'Zaatar Herbs']
      },
      {
        foodPreference: 'Non-Vegetarian',
        swapOptionName: 'Crispy Herb-Crusted Chicken Tenderloin Dippers with Spicy Greek Yogurt Dip',
        calories: 220,
        protein: 34,
        carbs: 6,
        fat: 5,
        fiber: 3,
        glycemicIndex: 'Low',
        preparationTip: 'Cut chicken breast into fry fingers. Dip in egg white, coat in crushed almonds and herbs, and air-fry until crisp on the outside and tender inside.',
        clinicalReason: 'Swaps empty starch calories for 34g of muscle-preserving protein, ideal for cutting phases.',
        dietaryTags: ['Non-Vegetarian', '34g Protein Fries', 'Almond Crusted Chicken'],
        keyIngredients: ['Chicken Breast Strips', 'Almond Flour', 'Greek Yogurt Dip', 'Smoked Chili']
      },
      {
        foodPreference: 'Keto',
        swapOptionName: 'Crispy Jicama & Avocado Oil Keto Fries with Truffle Sea Salt',
        calories: 120,
        protein: 4,
        carbs: 5,
        fat: 8,
        fiber: 7,
        glycemicIndex: 'Low',
        preparationTip: 'Cut jicama root into fry shape, parboil 8 mins, dry, toss in avocado oil, and air-fry at 210°C until golden. Sprinkle with truffle salt.',
        clinicalReason: 'Jicama contains inulin, a potent prebiotic that nourishes Akkermansia muciniphila to improve metabolic tone.',
        dietaryTags: ['Keto Protocol', 'Inulin Prebiotic', 'Truffle Oil', 'Under 5g Net Carbs'],
        keyIngredients: ['Jicama Root', 'Pure Avocado Oil', 'Truffle Salt', 'Herbs']
      },
      {
        foodPreference: 'Gluten-Free',
        swapOptionName: 'Sprouted Chickpea & Tapioca Crisp Fries with Fresh Tomato-Herb Chutney',
        calories: 170,
        protein: 10,
        carbs: 26,
        fat: 4,
        fiber: 7,
        glycemicIndex: 'Low',
        preparationTip: 'Make baked panisse (chickpea fries) by simmering chickpea flour with vegetable stock into a polenta, chilling, slicing, and air-frying.',
        clinicalReason: '100% gluten-free and rich in folate and resistant starches for sustained energy.',
        dietaryTags: ['Gluten-Free', 'Chickpea Panisse', 'Folate Rich'],
        keyIngredients: ['Chickpea Flour (Besan)', 'Vegetable Stock', 'Rosemary', 'EVOO']
      }
    ]
  }
];

// Heuristic Multi-Preference Food Swap Generator
export function generateHeuristicFoodSwapsForAllPreferences(
  cravingQuery: string,
  patientPreference?: string
): {
  craving: string;
  category: string;
  originalDish: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    glycemicIndex: 'High' | 'Medium' | 'Low';
    drawbacks: string;
  };
  swaps: FoodSwapSuggestion[];
} {
  const query = (cravingQuery || 'Pizza').toLowerCase().trim();

  // 1. Try matching against our clinical knowledge base
  const matchedEntry = CRAVING_KNOWLEDGE_BASE.find(entry => 
    entry.keywords.some(kw => query.includes(kw) || kw.includes(query)) ||
    entry.dishName.toLowerCase().includes(query) ||
    entry.category.toLowerCase().includes(query)
  );

  if (matchedEntry) {
    const orig = matchedEntry.originalMacros;
    const enrichedSwaps: FoodSwapSuggestion[] = matchedEntry.swaps.map((s, idx) => {
      const calSaving = Math.max(0, orig.calories - s.calories);
      return {
        id: `swap-kb-${Date.now()}-${idx}`,
        cravingOrDish: matchedEntry.dishName,
        swapOptionName: s.swapOptionName,
        clinicalSwap: s.swapOptionName,
        category: matchedEntry.category,
        foodPreference: s.foodPreference,
        originalCalories: orig.calories,
        swapCalories: s.calories,
        calorieSaving: calSaving,
        originalGlycemic: orig.glycemicIndex,
        swapGlycemic: s.glycemicIndex,
        swapProteinGrams: s.protein,
        swapFiberGrams: s.fiber,
        swapCarbsGrams: s.carbs,
        swapFatGrams: s.fat,
        originalMacros: {
          calories: orig.calories,
          protein: orig.protein,
          carbs: orig.carbs,
          fat: orig.fat,
          fiber: orig.fiber,
          glycemicIndex: orig.glycemicIndex
        },
        swapMacros: {
          calories: s.calories,
          protein: s.protein,
          carbs: s.carbs,
          fat: s.fat,
          fiber: s.fiber,
          glycemicIndex: s.glycemicIndex
        },
        preparationTip: s.preparationTip,
        instructions: s.preparationTip,
        clinicalReason: s.clinicalReason,
        clinicalRationale: s.clinicalReason,
        dietaryTags: s.dietaryTags,
        keyIngredients: s.keyIngredients,
        isAiGenerated: false
      };
    });

    return {
      craving: matchedEntry.dishName,
      category: matchedEntry.category,
      originalDish: {
        name: matchedEntry.dishName,
        ...orig
      },
      swaps: enrichedSwaps
    };
  }

  // 2. Synthesize a smart multi-preference alternative for any novel or custom query
  const cleanTitle = cravingQuery.charAt(0).toUpperCase() + cravingQuery.slice(1);
  const baselineCal = 650;
  const baselineProt = 10;
  const baselineCarb = 75;
  const baselineFat = 30;

  const defaultPreferences: Array<'Vegetarian' | 'Jain' | 'Vegan' | 'Eggetarian' | 'Non-Vegetarian' | 'Keto' | 'Gluten-Free'> = [
    'Vegetarian',
    'Jain',
    'Vegan',
    'Eggetarian',
    'Non-Vegetarian',
    'Keto',
    'Gluten-Free'
  ];

  const preferenceConfigs: Record<string, {
    nameSuffix: string;
    cal: number;
    prot: number;
    carb: number;
    fat: number;
    fiber: number;
    prep: string;
    reason: string;
    tags: string[];
    ingredients: string[];
  }> = {
    'Vegetarian': {
      nameSuffix: 'Low-GI Sprouted Grain & Paneer Bowl with Cold-Pressed Herb Dressing',
      cal: 310,
      prot: 24,
      carb: 28,
      fat: 10,
      fiber: 8,
      prep: `Swap refined starches in ${cleanTitle} with a combination of steamed sprouted moong, 60g low-fat fresh paneer, and a dressing of cold-pressed olive oil, lemon, and Himalayan pink salt.`,
      reason: 'Reduces glycemic index to Low, provides 24g bioavailable protein to stimulate CCK and PYY satiety peptides, and eliminates inflammatory seed oils.',
      tags: ['Vegetarian', 'High Protein 24g', 'Low GI', 'Gut Friendly'],
      ingredients: ['Sprouted Moong', 'A2 Paneer', 'Cold-Pressed Olive Oil', 'Fresh Lemon', 'Mint']
    },
    'Jain': {
      nameSuffix: 'Jain Green Plantain & Almond-Flour Formulation (Strictly No Root Veggies / Onion / Garlic)',
      cal: 280,
      prot: 18,
      carb: 24,
      fat: 12,
      fiber: 9,
      prep: `Prepare using steamed raw banana (kacha kela) and almond flour seasoned with cumin, coriander, and amchur. Strictly avoid all root vegetables and alliums.`,
      reason: '100% compliant with Jain dietary protocols. Resistant starch from green plantains feeds colonic short-chain fatty acid producing bacteria.',
      tags: ['Jain Safe', 'Zero Root Vegetables', 'Resistant Starch', 'Low GI'],
      ingredients: ['Green Plantain (Raw Banana)', 'Almond Flour', 'Amchur', 'Roasted Cumin', 'Sesame Oil']
    },
    'Vegan': {
      nameSuffix: 'Organic Tofu, Edamame & Cauliflower-Base Creation with Nutritional Yeast',
      cal: 260,
      prot: 22,
      carb: 20,
      fat: 9,
      fiber: 10,
      prep: `Sauté organic firm tofu and edamame over a base of riced cauliflower and zucchini ribbons. Season with fortified nutritional yeast (B12) and avocado oil.`,
      reason: '100% plant-based and dairy-free. Delivers sulforaphane for hepatic detox and complete essential amino acids without dietary cholesterol.',
      tags: ['Vegan', 'Dairy-Free', 'High Prebiotic Fiber', 'Nutritional Yeast B12'],
      ingredients: ['Organic Firm Tofu', 'Edamame', 'Cauliflower Rice', 'Nutritional Yeast', 'Avocado Oil']
    },
    'Eggetarian': {
      nameSuffix: 'Whipped Egg-White & Cottage Cheese Protein Skillet with Garden Herbs',
      cal: 270,
      prot: 30,
      carb: 10,
      fat: 10,
      fiber: 6,
      prep: `Whisk 3 egg whites + 1 whole pasture egg with crumbled cottage cheese and baby spinach. Bake or pan-sear on low heat with extra virgin olive oil.`,
      reason: 'Pure albumin protein with superior biological value, keeping insulin baseline flat and suppressing afternoon cravings.',
      tags: ['Eggetarian', 'Ultra High Protein 30g', 'Low Carb', 'Metabolic Igniter'],
      ingredients: ['Egg Whites', 'Pasture Raised Egg', 'Cottage Cheese', 'Baby Spinach', 'EVOO']
    },
    'Non-Vegetarian': {
      nameSuffix: 'Herb-Grilled Lean Chicken Breast / Wild Fish Medallions with Zucchini Ribbons',
      cal: 320,
      prot: 40,
      carb: 8,
      fat: 10,
      fiber: 5,
      prep: `Marinate 180g lean chicken breast or wild fish fillet in garlic, lemon, rosemary, and olive oil. Pan-sear and serve alongside sautéed zucchini ribbons.`,
      reason: 'Delivers 40g of complete lean protein, maximizing muscle protein synthesis and diet-induced thermogenesis during caloric restriction.',
      tags: ['Non-Vegetarian', 'Ultra Lean Protein 40g', 'Zero Refined Starch', 'Thermogenic'],
      ingredients: ['Skinless Chicken Breast / Wild Fish', 'Zucchini Zoodles', 'Fresh Rosemary', 'Lemon']
    },
    'Keto': {
      nameSuffix: 'Ultra Low-Carb Almond & Avocado Ketogenic Formulation',
      cal: 290,
      prot: 20,
      carb: 4,
      fat: 20,
      fiber: 8,
      prep: `Construct using almond meal, avocado slices, and grass-fed butter or cheese. Keep net carbohydrates under 5g to preserve ongoing ketosis.`,
      reason: 'Eliminates carbohydrate-driven insulin surges while providing monounsaturated fats that sustain steady mental clarity and fat adaptation.',
      tags: ['Keto Protocol', 'Under 4g Net Carbs', 'Monounsaturated Fats', 'Ketogenic'],
      ingredients: ['Almond Meal', 'Hass Avocado', 'Grass-Fed Butter / Paneer', 'Olive Oil']
    },
    'Gluten-Free': {
      nameSuffix: 'Ancient Sprouted Millet & Quinoa Bowl with Toasted Hemp Seeds',
      cal: 300,
      prot: 19,
      carb: 34,
      fat: 9,
      fiber: 8,
      prep: `Cook sprouted finger millet (ragi) or quinoa in vegetable broth. Toss with steamed garden vegetables, hemp hearts, and cold-pressed sesame oil.`,
      reason: 'Celiac safe with zero wheat prolamins; supplies slow-digesting complex carbohydrates rich in zinc, magnesium, and bioflavonoids.',
      tags: ['Gluten-Free', 'Celiac Safe', 'Sprouted Millets', 'Mineral Dense'],
      ingredients: ['Sprouted Ragi / Quinoa', 'Hemp Hearts', 'Steamed Vegetables', 'Cold-Pressed Sesame Oil']
    }
  };

  const synthesizedSwaps: FoodSwapSuggestion[] = defaultPreferences.map((pref, idx) => {
    const config = preferenceConfigs[pref];
    const swapTitle = `${cleanTitle} (${pref} Clinical Swap) - ${config.nameSuffix}`;
    const calSaving = Math.max(0, baselineCal - config.cal);

    return {
      id: `swap-synth-${Date.now()}-${idx}`,
      cravingOrDish: `${cleanTitle} (Commercial / Standard Prep)`,
      swapOptionName: swapTitle,
      clinicalSwap: swapTitle,
      category: 'Smart Food Swaps',
      foodPreference: pref,
      originalCalories: baselineCal,
      swapCalories: config.cal,
      calorieSaving: calSaving,
      originalGlycemic: 'High',
      swapGlycemic: 'Low',
      swapProteinGrams: config.prot,
      swapFiberGrams: config.fiber,
      swapCarbsGrams: config.carb,
      swapFatGrams: config.fat,
      originalMacros: {
        calories: baselineCal,
        protein: baselineProt,
        carbs: baselineCarb,
        fat: baselineFat,
        fiber: 2,
        glycemicIndex: 'High'
      },
      swapMacros: {
        calories: config.cal,
        protein: config.prot,
        carbs: config.carb,
        fat: config.fat,
        fiber: config.fiber,
        glycemicIndex: 'Low'
      },
      preparationTip: config.prep,
      instructions: config.prep,
      clinicalReason: config.reason,
      clinicalRationale: config.reason,
      dietaryTags: config.tags,
      keyIngredients: config.ingredients,
      isAiGenerated: false
    };
  });

  return {
    craving: cleanTitle,
    category: 'Smart Food Swaps',
    originalDish: {
      name: `${cleanTitle} (Commercial / High-Calorie Prep)`,
      calories: baselineCal,
      protein: baselineProt,
      carbs: baselineCarb,
      fat: baselineFat,
      fiber: 2,
      glycemicIndex: 'High',
      drawbacks: 'High glycemic carbohydrates paired with oxidized fats trigger postprandial glucose surges, insulin spikes, and visceral adiposity storage.'
    },
    swaps: synthesizedSwaps
  };
}
