import { FoodSwapSuggestion, SwapRecipe } from '../types/clinic';

export interface CravingKnowledgeEntry {
  category: string;
  identifiedCraving: string;
  keywords: string[];
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
  swaps: {
    foodPreference: 'Vegetarian' | 'Jain' | 'Vegan' | 'Eggetarian' | 'Non-Vegetarian' | 'Keto' | 'Gluten-Free';
    optionNumber: 1 | 2;
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
    recipe: SwapRecipe;
  }[];
}

export const CRAVING_KNOWLEDGE_BASE: CravingKnowledgeEntry[] = [
  // =========================================================================
  // 1. PIZZA & CHEESY COMFORT CRAVINGS
  // =========================================================================
  {
    category: 'Pizza & Cheesy Comfort',
    identifiedCraving: 'Commercial Stuffed Crust Double Cheese Pizza (2 Large Slices)',
    keywords: [
      'pizza', 'cheese pizza', 'pepperoni', 'slice', 'margherita', 'crust', 'cheesy', 
      'cheese pull', 'stuffed crust', 'dominos', 'pizza hut', 'deep dish', 'i want pizza',
      'craving pizza', 'want something cheesy'
    ],
    originalDish: {
      name: 'Commercial Stuffed Crust Double Cheese Pizza (2 large slices)',
      calories: 680,
      protein: 18,
      carbs: 78,
      fat: 34,
      fiber: 2,
      glycemicIndex: 'High',
      drawbacks: 'Refined bleached flour (maida), high trans-fats, processed high-sodium cheese causing acute postprandial glucose excursions and insulin surges.'
    },
    swaps: [
      // Vegetarian Option 1
      {
        foodPreference: 'Vegetarian',
        optionNumber: 1,
        swapOptionName: 'Spelt Crust High-Protein Paneer & Roasted Bell Pepper Pizza',
        calories: 320,
        protein: 25,
        carbs: 28,
        fat: 12,
        fiber: 7,
        glycemicIndex: 'Low',
        preparationTip: 'Use stoneground spelt or rolled oat flour for crust. Top with homemade sugar-free marinara, 60g low-fat fresh paneer, and oregano.',
        clinicalReason: 'Ancient grain spelt provides beta-glucans and slow-release starch, while fresh paneer provides casein protein to blunt insulin spikes by 55%.',
        dietaryTags: ['Vegetarian', 'High Protein 25g', 'Low GI', 'Ancient Grains'],
        keyIngredients: ['Stoneground Spelt Flour', 'Low-Fat Fresh Paneer', 'Sugar-Free Marinara', 'Bell Peppers', 'Oregano'],
        recipe: {
          recipeName: 'Artisan Spelt & Fresh Paneer Thin-Crust Pizza',
          servings: '1 personal pizza (approx. 240g)',
          prepTimeMinutes: 10,
          cookTimeMinutes: 12,
          ingredients: [
            { item: 'Spelt flour (or rolled oat flour)', amount: '60g', notes: 'Ancient grain, high fiber' },
            { item: 'Greek yogurt (unsweetened 2%)', amount: '50g', notes: 'Dough binder & protein booster' },
            { item: 'Homemade plum tomato marinara', amount: '3 tbsp', notes: 'No added sugar' },
            { item: 'Low-fat fresh paneer (crumbled)', amount: '60g', notes: 'Rich casein protein' },
            { item: 'Sliced bell peppers & red onions', amount: '40g' },
            { item: 'Dried oregano & chili flakes', amount: '1/2 tsp each' },
            { item: 'Extra virgin olive oil', amount: '1 tsp', notes: 'Cold-pressed' }
          ],
          steps: [
            'In a bowl, mix spelt flour with Greek yogurt and a pinch of salt to form a smooth dough ball.',
            'Roll out the dough between two sheets of parchment paper into a 7-inch round disc.',
            'Pre-bake the base on a hot skillet or oven at 200°C (400°F) for 4 minutes until lightly firm.',
            'Spread tomato marinara evenly, top with crumbled paneer, bell peppers, oregano, and olive oil.',
            'Bake at 210°C (410°F) for 7-8 minutes until edges are crisp and golden brown.'
          ],
          optionalSubstitutions: ['Can substitute spelt flour with whole wheat or oat flour', 'Can substitute paneer with firm tofu for dairy sensitivity'],
          chefTip: 'Preheat your baking tray or skillet so the crust gets an authentic stone-baked crisp bottom.',
          clinicalBenefit: 'Delivers 25g protein and 7g dietary fiber with glycemic load under 10.'
        }
      },
      // Vegetarian Option 2
      {
        foodPreference: 'Vegetarian',
        optionNumber: 2,
        swapOptionName: 'Portobello Mushroom Cap Mini Pizzas with Bocconcini & Fresh Basil',
        calories: 210,
        protein: 16,
        carbs: 10,
        fat: 11,
        fiber: 5,
        glycemicIndex: 'Low',
        preparationTip: 'Use large grilled Portobello mushroom caps as naturally grain-free, nutrient-dense pizza bases.',
        clinicalReason: 'Virtually eliminates flour while delivering ergothioneine antioxidants and immune-modulating beta-glucans.',
        dietaryTags: ['Vegetarian', 'Grain-Free', 'Low Carb', 'Antioxidant Rich'],
        keyIngredients: ['Portobello Mushroom Caps', 'Fresh Bocconcini Cheese', 'Heirloom Tomato Coulis', 'Fresh Sweet Basil'],
        recipe: {
          recipeName: 'Baked Portobello Cap Margherita Bites',
          servings: '2 large stuffed caps',
          prepTimeMinutes: 5,
          cookTimeMinutes: 10,
          ingredients: [
            { item: 'Large Portobello mushroom caps', amount: '2 large units', notes: 'Gills gently scraped' },
            { item: 'Extra virgin olive oil', amount: '1 tsp', notes: 'For brushing' },
            { item: 'Crushed garlic & Italian herbs', amount: '1/2 tsp' },
            { item: 'Sugar-free crushed tomato sauce', amount: '3 tbsp' },
            { item: 'Fresh bocconcini or mozzarella pearls', amount: '40g', notes: 'Torn' },
            { item: 'Fresh sweet basil leaves', amount: '6 leaves' }
          ],
          steps: [
            'Wipe mushroom caps clean and brush lightly with olive oil, garlic, and sea salt.',
            'Place caps top-down on a baking sheet and roast at 200°C for 5 minutes to release excess moisture.',
            'Remove and spoon tomato sauce into each cap; top with bocconcini pieces and Italian herbs.',
            'Broil for 4-5 minutes until cheese melts and bubbles with golden spots.',
            'Garnish with torn fresh basil and cracked black pepper before serving hot.'
          ],
          optionalSubstitutions: ['Can use low-fat feta or cottage cheese instead of bocconcini'],
          chefTip: 'Pat the mushroom caps dry with a paper towel after the first 5-minute pre-roast to prevent sogginess.',
          clinicalBenefit: 'Only 10g net carbs with zero refined starches, perfect for evening craving control.'
        }
      },

      // Non-Vegetarian Option 1
      {
        foodPreference: 'Non-Vegetarian',
        optionNumber: 1,
        swapOptionName: 'Herb-Crusted Lean Chicken Breast Meatza Pizza with Buffalo Mozzarella',
        calories: 340,
        protein: 44,
        carbs: 7,
        fat: 13,
        fiber: 3,
        glycemicIndex: 'Low',
        preparationTip: 'Flatten minced lean chicken breast with garlic & herbs into a thin crust. Pre-bake, then top and melt cheese.',
        clinicalReason: 'Zero refined flour delivering 44g lean leucine-rich protein for maximal muscle protein synthesis and prolonged satiety.',
        dietaryTags: ['Non-Vegetarian', 'Ultra High Protein 44g', 'Zero Flour', 'Keto Aligned'],
        keyIngredients: ['Lean Minced Chicken Breast', 'Buffalo Mozzarella', 'Sundried Tomato Salsa', 'Oregano & Garlic'],
        recipe: {
          recipeName: 'Savory Chicken Breast Meatza Supreme',
          servings: '1 large 8-inch Meatza',
          prepTimeMinutes: 10,
          cookTimeMinutes: 15,
          ingredients: [
            { item: 'Lean minced chicken breast (95% lean)', amount: '160g', notes: 'Finely ground' },
            { item: 'Egg white', amount: '1 unit', notes: 'Natural binder' },
            { item: 'Italian seasoning & garlic powder', amount: '1 tsp each' },
            { item: 'Tomato puree (no added sugar)', amount: '3 tbsp' },
            { item: 'Shredded part-skim mozzarella', amount: '35g' },
            { item: 'Sliced black olives & cherry tomatoes', amount: '25g' }
          ],
          steps: [
            'In a bowl, mix ground chicken breast, egg white, salt, garlic powder, and Italian herbs.',
            'Press the chicken mixture onto a parchment-lined baking sheet into an 8-inch thin round disc.',
            'Bake at 200°C (400°F) for 10 minutes until chicken is cooked through and firm.',
            'Spread tomato puree over the chicken crust, top with mozzarella, olives, and cherry tomatoes.',
            'Return to oven and broil for 4-5 minutes until the cheese is melted and bubbling.'
          ],
          optionalSubstitutions: ['Can use ground turkey breast in place of chicken'],
          chefTip: 'Bake on parchment paper to easily lift and slide the Meatza onto your serving plate.',
          clinicalBenefit: 'Supplies 44g bioavailable protein with less than 7g carbs, ideal for fat loss.'
        }
      },
      // Non-Vegetarian Option 2
      {
        foodPreference: 'Non-Vegetarian',
        optionNumber: 2,
        swapOptionName: 'Seared Salmon & Pesto Crispy Cauliflower Pizza Flatbread',
        calories: 330,
        protein: 32,
        carbs: 12,
        fat: 16,
        fiber: 6,
        glycemicIndex: 'Low',
        preparationTip: 'Top a crisp cauliflower crust with basil walnut pesto, baby spinach, and wild salmon flakes.',
        clinicalReason: 'Supplies 1,800mg cardio-protective EPA & DHA omega-3 fatty acids with zero glycemic spike.',
        dietaryTags: ['Non-Vegetarian', 'Omega-3 Rich', 'Cardioprotective', 'Grain-Free'],
        keyIngredients: ['Cauliflower Crust Base', 'Wild Caught Salmon', 'Basil Walnut Pesto', 'Baby Spinach'],
        recipe: {
          recipeName: 'Wild Salmon & Basil Pesto Cauliflower Flatbread',
          servings: '1 flatbread',
          prepTimeMinutes: 10,
          cookTimeMinutes: 12,
          ingredients: [
            { item: 'Riced cauliflower (steamed & squeezed dry)', amount: '150g' },
            { item: 'Egg white + almond flour', amount: '1 white + 1 tbsp almond flour' },
            { item: 'Cooked wild salmon flakes', amount: '80g', notes: 'Rich in EPA/DHA' },
            { item: 'Fresh basil walnut pesto', amount: '1.5 tbsp' },
            { item: 'Baby spinach & red onion slivers', amount: '30g' }
          ],
          steps: [
            'Mix squeezed cauliflower rice, egg white, almond flour, and sea salt. Flatten onto baking tray.',
            'Bake crust at 205°C (400°F) for 12 minutes until edges are browned and crisp.',
            'Spread basil pesto over the crust, layer with baby spinach and flaked wild salmon.',
            'Warm in the oven for 3 minutes and drizzle with lemon juice before slicing.'
          ],
          optionalSubstitutions: ['Can substitute salmon with grilled garlic prawns or shredded chicken'],
          chefTip: 'Squeeze the steamed cauliflower in a cheesecloth thoroughly to extract all moisture for a crispy crust.',
          clinicalBenefit: 'Reduces systemic inflammation markers (hs-CRP) through potent marine omega-3 fatty acids.'
        }
      },

      // Vegan Option 1
      {
        foodPreference: 'Vegan',
        optionNumber: 1,
        swapOptionName: 'Crispy Cauliflower-Crust Vegan Margherita with Cultured Cashew Mozzarella',
        calories: 260,
        protein: 15,
        carbs: 24,
        fat: 11,
        fiber: 9,
        glycemicIndex: 'Low',
        preparationTip: 'Squeeze moisture from steamed cauliflower, bind with chia gel and almond meal. Top with soaked cashew cream & nutritional yeast.',
        clinicalReason: 'Provides sulforaphane for liver detox phase II support and fortified B-vitamins without dairy casein.',
        dietaryTags: ['Vegan', 'Dairy-Free', '100% Plant-Based', 'High Fiber 9g'],
        keyIngredients: ['Cauliflower Rice', 'Chia Seed Gel', 'Raw Cashew Mozzarella', 'Fortified Nutritional Yeast'],
        recipe: {
          recipeName: 'Cauliflower & Cashew Mozzarella Vegan Margherita',
          servings: '1 pizza',
          prepTimeMinutes: 15,
          cookTimeMinutes: 15,
          ingredients: [
            { item: 'Riced cauliflower (moisture squeezed out)', amount: '200g' },
            { item: 'Chia seed gel (1 tbsp chia + 3 tbsp water)', amount: '1 portion', notes: 'Plant egg binder' },
            { item: 'Almond flour', amount: '2 tbsp' },
            { item: 'Soaked raw cashews blended with lemon & garlic', amount: '35g cashew paste' },
            { item: 'Plum tomato puree with oregano', amount: '3 tbsp' },
            { item: 'Nutritional yeast', amount: '1 tbsp', notes: 'Vitamin B12 & cheesy flavor' }
          ],
          steps: [
            'Mix dry cauliflower rice with chia gel, almond flour, garlic powder, and sea salt to form dough.',
            'Press firmly into a 7-inch circle on parchment paper and bake at 200°C for 14 minutes until firm.',
            'Spread tomato sauce, dollop cashew cream mozzarella, and dust with nutritional yeast.',
            'Bake an additional 6 minutes until cashew cheese sets. Top with fresh basil.'
          ],
          optionalSubstitutions: ['Can use flaxseed meal instead of chia seeds', 'Can use sunflower seed cream for nut allergies'],
          chefTip: 'Nutritional yeast adds authentic savory umami and complete B-complex vitamins.',
          clinicalBenefit: '100% plant-based bioactive sulforaphane supports cellular antioxidant pathways.'
        }
      },
      // Vegan Option 2
      {
        foodPreference: 'Vegan',
        optionNumber: 2,
        swapOptionName: 'Sprouted Chickpea Flour (Socca) Skillet Pizza with Roasted Vegetables',
        calories: 275,
        protein: 17,
        carbs: 32,
        fat: 8,
        fiber: 8,
        glycemicIndex: 'Low',
        preparationTip: 'Whisk sprouted besan (chickpea flour) with water, rosemary, and olive oil into a batter. Pour into a hot cast-iron skillet, bake, and top.',
        clinicalReason: 'Traditional Mediterranean socca is naturally gluten-free, high in prebiotic fiber, and supports beneficial Bifidobacteria.',
        dietaryTags: ['Vegan', 'Grain-Free', 'High Fiber', 'Prebiotic Rich'],
        keyIngredients: ['Sprouted Chickpea Flour (Besan)', 'Fresh Rosemary', 'Roasted Zucchini & Cherry Tomatoes', 'Tahini Drizzle'],
        recipe: {
          recipeName: 'Mediterranean Chickpea Socca Skillet Pizza',
          servings: '1 skillet pizza',
          prepTimeMinutes: 10,
          cookTimeMinutes: 12,
          ingredients: [
            { item: 'Sprouted chickpea flour (besan)', amount: '65g' },
            { item: 'Lukewarm water', amount: '80ml' },
            { item: 'Cold-pressed extra virgin olive oil', amount: '1 tsp' },
            { item: 'Finely chopped fresh rosemary', amount: '1/2 tsp' },
            { item: 'Roasted cherry tomatoes, zucchini & kalamata olives', amount: '50g' },
            { item: 'Creamy lemon tahini drizzle', amount: '1 tbsp' }
          ],
          steps: [
            'Whisk chickpea flour with water, olive oil, minced rosemary, and salt until smooth. Rest 10 minutes.',
            'Heat an oven-safe cast iron pan with a drop of olive oil over medium-high heat.',
            'Pour batter into pan and cook 2 minutes until bottom sets, then transfer to oven at 220°C for 6 minutes.',
            'Remove, top with roasted veggies and warm in oven for 3 minutes.',
            'Drizzle with lemon tahini and sprinkle with cracked red pepper.'
          ],
          optionalSubstitutions: ['Can use red lentil flour instead of chickpea flour'],
          chefTip: 'Letting chickpea batter rest for 10 minutes hydrates the starches for a crepe-like crisp texture.',
          clinicalBenefit: 'High prebiotic arabinogalactans nourish the gut microbiome without blood sugar spikes.'
        }
      },

      // Jain Option 1
      {
        foodPreference: 'Jain',
        optionNumber: 1,
        swapOptionName: 'Jain Green Banana & Almond Flour Crust Pizza with Herb Tomato Coulis',
        calories: 290,
        protein: 19,
        carbs: 24,
        fat: 13,
        fiber: 8,
        glycemicIndex: 'Low',
        preparationTip: 'Mash steamed green plantain (kacha kela) with almond flour & cumin. Bake crisp and top with Jain tomato coulis and fresh cheese.',
        clinicalReason: 'Supplies resistant starch type-2 from green plantains without insulinogenic root vegetables or alliums.',
        dietaryTags: ['Jain Safe', 'Root-Free', 'No Onion No Garlic', 'Low GI'],
        keyIngredients: ['Green Plantain (Kacha Kela)', 'Almond Flour', 'Fresh Mozzarella', 'Jain Herb Tomato Coulis'],
        recipe: {
          recipeName: 'Jain Green Banana & Almond Artisan Pizza',
          servings: '1 personal pizza',
          prepTimeMinutes: 15,
          cookTimeMinutes: 14,
          ingredients: [
            { item: 'Steamed green raw banana (mashed)', amount: '1 medium (80g)' },
            { item: 'Fine almond flour', amount: '35g' },
            { item: 'Roasted cumin powder & rock salt (sendha namak)', amount: '1/2 tsp each' },
            { item: 'Jain tomato coulis (tomatoes, basil, cumin, no onion/garlic)', amount: '3 tbsp' },
            { item: 'Fresh paneer or mozzarella cheese', amount: '45g' },
            { item: 'Diced green bell pepper (capsicum)', amount: '30g' }
          ],
          steps: [
            'Knead mashed steamed green plantain with almond flour, cumin, and rock salt into a pliable dough.',
            'Roll out between parchment sheets to 6mm thickness and bake at 200°C for 10 minutes until edges brown.',
            'Spread the Jain tomato coulis, layer fresh cheese and diced capsicum on top.',
            'Bake for 5 minutes until cheese melts smoothly and serves hot.'
          ],
          optionalSubstitutions: ['Can use water chestnut flour (singhare ka atta) alongside almond flour during fasting days'],
          chefTip: 'Green bananas are starchy when raw but become elastic and dough-like when steamed and mashed.',
          clinicalBenefit: 'Resistant starch acts as soluble fiber, promoting butyrate production in the colon.'
        }
      },
      // Jain Option 2
      {
        foodPreference: 'Jain',
        optionNumber: 2,
        swapOptionName: 'Jain Spelt & Low-Fat Cottage Cheese Pan Pizza with Bell Peppers & Basil',
        calories: 310,
        protein: 23,
        carbs: 27,
        fat: 11,
        fiber: 7,
        glycemicIndex: 'Low',
        preparationTip: 'Use ancient grain spelt flour, top with pure tomato-basil puree, fresh paneer, and oregano.',
        clinicalReason: 'High fiber with zero root ingredients or alliums, ensuring peaceful digestion and balanced glycemia.',
        dietaryTags: ['Jain Safe', 'Ancient Grains', 'High Protein 23g', 'No Root Veggies'],
        keyIngredients: ['Stoneground Spelt Flour', 'Fresh A2 Paneer', 'Plum Tomato Basil Sauce', 'Crisp Bell Peppers'],
        recipe: {
          recipeName: 'Jain Spelt & A2 Paneer Pan Pizza',
          servings: '1 pizza',
          prepTimeMinutes: 10,
          cookTimeMinutes: 12,
          ingredients: [
            { item: 'Spelt flour', amount: '55g' },
            { item: 'A2 cow milk curd (yogurt)', amount: '45g' },
            { item: 'Pure tomato-basil sauce (no onion/garlic)', amount: '3 tbsp' },
            { item: 'Fresh A2 paneer cubes', amount: '55g' },
            { item: 'Finely sliced green and yellow bell peppers', amount: '40g' },
            { item: 'Dried oregano & dried basil', amount: '1 tsp' }
          ],
          steps: [
            'Mix spelt flour with A2 curd to knead a non-sticky pizza base dough.',
            'Roll out to 7 inches and cook on a dry cast iron skillet on both sides for 3 minutes.',
            'Spread tomato-basil sauce, top with fresh paneer cubes and bell peppers.',
            'Cover with lid on low heat for 5 minutes or broil in oven for 4 minutes until cheese softens.'
          ],
          optionalSubstitutions: ['Can use oat flour instead of spelt flour'],
          chefTip: 'Using fresh sweet basil leaves gives a bright, aromatic fragrance without needing garlic.',
          clinicalBenefit: 'Casein protein and complex grain fiber maintain steady satiety for 4-5 hours.'
        }
      },

      // Eggetarian Option 1
      {
        foodPreference: 'Eggetarian',
        optionNumber: 1,
        swapOptionName: 'Golden Egg White & Cottage Cheese Frittata Pizza with Sliced Tomatoes',
        calories: 280,
        protein: 34,
        carbs: 10,
        fat: 10,
        fiber: 4,
        glycemicIndex: 'Low',
        preparationTip: 'Whisk 3 egg whites + 1 whole egg with herbs as the pan base. Layer tomato coulis, feta, and spinach under broiler.',
        clinicalReason: 'Exceptional protein-to-energy ratio (34g protein), stimulating GLP-1 and PYY satiety hormones.',
        dietaryTags: ['Eggetarian', 'Ultra High Protein 34g', 'Ketogenic Aligned'],
        keyIngredients: ['Egg Whites', 'Whole Egg', 'Low-Fat Feta', 'Cherry Tomatoes', 'Baby Spinach'],
        recipe: {
          recipeName: 'High-Protein Egg White Frittata Pizza',
          servings: '1 skillet pizza',
          prepTimeMinutes: 5,
          cookTimeMinutes: 8,
          ingredients: [
            { item: 'Egg whites', amount: '3 large' },
            { item: 'Whole egg', amount: '1 large' },
            { item: 'Low-fat feta or crumbled paneer', amount: '40g' },
            { item: 'Heirloom cherry tomatoes (halved)', amount: '40g' },
            { item: 'Baby spinach leaves', amount: '20g' },
            { item: 'Oregano, basil, and cracked pepper', amount: '1 tsp' }
          ],
          steps: [
            'Whisk egg whites, whole egg, salt, and Italian herbs in a bowl.',
            'Pour into a preheated non-stick skillet on medium heat. Cook until bottom sets (3 mins).',
            'Top the half-set egg base with cherry tomatoes, spinach, and crumbled feta cheese.',
            'Place skillet under the oven broiler for 3-4 minutes until top is golden and puffed.'
          ],
          optionalSubstitutions: ['Can use 4 egg whites with zero whole eggs for ultra-lean macros'],
          chefTip: 'Cooking the eggs slowly on medium-low heat keeps the base soft and pliable like pizza crust.',
          clinicalBenefit: 'Supplies complete amino acids (high in leucine) to fuel metabolic rate.'
        }
      },
      // Eggetarian Option 2
      {
        foodPreference: 'Eggetarian',
        optionNumber: 2,
        swapOptionName: 'Almond & Egg-Wired Thin Crust Pizza with Bocconcini and Arugula',
        calories: 310,
        protein: 26,
        carbs: 8,
        fat: 18,
        fiber: 6,
        glycemicIndex: 'Low',
        preparationTip: 'Blend almond flour with 2 egg whites into a savory crepe-like crust, bake until crisp, and top with cheese & arugula.',
        clinicalReason: 'Net carbohydrates under 5g, providing monounsaturated fatty acids and bioavailable choline.',
        dietaryTags: ['Eggetarian', 'Keto Friendly', 'Choline Rich', 'Grain-Free'],
        keyIngredients: ['Almond Flour', 'Egg Whites', 'Bocconcini', 'Fresh Wild Arugula', 'Plum Tomato Coulis'],
        recipe: {
          recipeName: 'Almond & Egg-Crust Personal Pizza',
          servings: '1 personal pizza',
          prepTimeMinutes: 8,
          cookTimeMinutes: 10,
          ingredients: [
            { item: 'Fine almond flour', amount: '40g' },
            { item: 'Egg whites (whisked)', amount: '2 large' },
            { item: 'Crushed garlic & oregano', amount: '1/2 tsp' },
            { item: 'Tomato puree', amount: '2.5 tbsp' },
            { item: 'Fresh bocconcini cheese', amount: '40g' },
            { item: 'Fresh arugula (rocket leaves)', amount: '1 cup (20g)' }
          ],
          steps: [
            'Whisk almond flour and egg whites with Italian seasonings into a spreadable thick batter.',
            'Spread thinly onto parchment paper and bake at 195°C (385°F) for 8 minutes until golden.',
            'Spread tomato puree and top with torn bocconcini cheese.',
            'Bake 4 minutes until cheese is molten, then pile high with fresh peppery arugula and a squeeze of lemon.'
          ],
          optionalSubstitutions: ['Can substitute almond flour with hazelnut flour or coconut flour (use half amount)'],
          chefTip: 'Tossing arugula with lemon juice right before placing on pizza cuts the richness beautifully.',
          clinicalBenefit: 'Zero grain carbohydrates with optimal brain-supportive choline and lutein.'
        }
      },

      // Keto Option 1
      {
        foodPreference: 'Keto',
        optionNumber: 1,
        swapOptionName: 'Psyllium-Almond Fathead Keto Pizza with Mozzarella & Herb Puree',
        calories: 310,
        protein: 24,
        carbs: 5,
        fat: 22,
        fiber: 8,
        glycemicIndex: 'Low',
        preparationTip: 'Melt mozzarella with cream cheese, almond flour, and psyllium husk. Roll thin, bake until browned, and top.',
        clinicalReason: 'Net carbs under 5g, preserving ketosis and steady ketone body generation while quenching cheese cravings.',
        dietaryTags: ['Keto Protocol', 'Ultra Low Carb (5g Net)', 'High Monounsaturated Fats'],
        keyIngredients: ['Almond Meal', 'Psyllium Husk', 'Mozzarella', 'Sugar-Free Marinara', 'Wild Arugula'],
        recipe: {
          recipeName: 'Classic Fathead Keto Thin Crust Pizza',
          servings: '1 pizza (6 slices)',
          prepTimeMinutes: 10,
          cookTimeMinutes: 12,
          ingredients: [
            { item: 'Shredded whole milk mozzarella', amount: '80g', notes: 'For crust dough' },
            { item: 'Cream cheese (full fat)', amount: '1.5 tbsp (25g)' },
            { item: 'Almond flour', amount: '45g' },
            { item: 'Psyllium husk powder', amount: '1 tsp', notes: 'Gives bread-like chew' },
            { item: 'Sugar-free tomato paste with oregano', amount: '2 tbsp' },
            { item: 'Extra mozzarella & sliced olives for topping', amount: '30g' }
          ],
          steps: [
            'Melt mozzarella and cream cheese in a microwave-safe bowl (45 seconds) until smooth.',
            'Stir in almond flour, psyllium husk, and pinch of salt. Knead quickly into a soft dough ball.',
            'Roll between 2 sheets of parchment paper to 4mm thinness.',
            'Prick holes with a fork and bake at 200°C (400°F) for 8 minutes until golden.',
            'Add tomato paste, toppings, and extra cheese. Bake for 4-5 minutes until bubbly.'
          ],
          optionalSubstitutions: ['Can use lupin flour instead of almond flour to lower calories'],
          chefTip: 'Work quickly while the melted mozzarella is warm so the dough incorporates uniformly.',
          clinicalBenefit: 'Keeps fasting insulin baseline flat and triggers prolonged satiety through cholecystokinin.'
        }
      },
      // Keto Option 2
      {
        foodPreference: 'Keto',
        optionNumber: 2,
        swapOptionName: 'Crispy Zucchini Ribbon & Cheddar Crustless Pizza Bake',
        calories: 260,
        protein: 21,
        carbs: 6,
        fat: 17,
        fiber: 5,
        glycemicIndex: 'Low',
        preparationTip: 'Layer drained zucchini ribbons with aged cheddar, marinara, and basil in a baking dish.',
        clinicalReason: 'Ultra-low carbohydrate density (3g net carbs) rich in potassium to support electrolyte balance on Keto.',
        dietaryTags: ['Keto Protocol', 'Crustless Bake', 'Potassium Rich', 'Under 6g Carbs'],
        keyIngredients: ['Zucchini Ribbons', 'Aged Cheddar / Mozzarella', 'Sugar-Free Marinara', 'Oregano'],
        recipe: {
          recipeName: 'Keto Cheesy Zucchini Crustless Pizza Bake',
          servings: '1 casserole portion',
          prepTimeMinutes: 8,
          cookTimeMinutes: 14,
          ingredients: [
            { item: 'Medium zucchini (sliced into ribbons)', amount: '200g' },
            { item: 'Olive oil', amount: '1 tsp' },
            { item: 'Sugar-free marinara sauce', amount: '3 tbsp' },
            { item: 'Shredded sharp cheddar and mozzarella', amount: '50g combined' },
            { item: 'Italian seasoning & red pepper flakes', amount: '1 tsp' }
          ],
          steps: [
            'Salt zucchini ribbons and rest 5 minutes, then squeeze out excess water in a kitchen towel.',
            'Layer half the zucchini in a mini oven-safe dish, spoon marinara, and sprinkle half the cheese.',
            'Add remaining zucchini, marinara, and top with the rest of the cheese and seasonings.',
            'Bake at 200°C (400°F) for 14 minutes until cheese is deep golden and bubbly.'
          ],
          optionalSubstitutions: ['Can add sliced mushrooms or cooked chicken chunks for extra protein'],
          chefTip: 'Squeezing the zucchini dry is essential so the bake stays rich and cheesy without excess liquid.',
          clinicalBenefit: 'Provides 21g protein and under 6g total carbs with zero grain allergens.'
        }
      },

      // Gluten-Free Option 1
      {
        foodPreference: 'Gluten-Free',
        optionNumber: 1,
        swapOptionName: 'Sprouted Ragi & Quinoa Crisp Crust Pizza with Bocconcini & Vegetables',
        calories: 300,
        protein: 20,
        carbs: 32,
        fat: 10,
        fiber: 8,
        glycemicIndex: 'Low',
        preparationTip: 'Blend sprouted finger millet (ragi) flour with quinoa flour. Roll thin, bake at 210°C, and top with roasted garden veggies.',
        clinicalReason: 'Rich in dietary calcium and polyphenols with zero wheat gluten prolamins, soothing gut permeability.',
        dietaryTags: ['Gluten-Free', 'Celiac Safe', 'Calcium Rich', 'Sprouted Millets'],
        keyIngredients: ['Sprouted Ragi Flour', 'Quinoa Flour', 'Fresh Bocconcini', 'Roasted Zucchini', 'Oregano'],
        recipe: {
          recipeName: 'Sprouted Ragi & Quinoa Artisan Pizza',
          servings: '1 pizza',
          prepTimeMinutes: 10,
          cookTimeMinutes: 12,
          ingredients: [
            { item: 'Sprouted ragi (finger millet) flour', amount: '35g', notes: 'High calcium & iron' },
            { item: 'Quinoa flour (or brown rice flour)', amount: '25g' },
            { item: 'Lukewarm water + 1 tsp olive oil', amount: '50ml' },
            { item: 'Crushed plum tomato sauce', amount: '3 tbsp' },
            { item: 'Fresh bocconcini or paneer', amount: '45g' },
            { item: 'Sliced bell peppers, zucchini, oregano', amount: '40g' }
          ],
          steps: [
            'Mix sprouted ragi and quinoa flour with salt, olive oil, and warm water to form dough.',
            'Roll out thinly on parchment paper and bake at 210°C (410°F) for 6 minutes until edges set.',
            'Spread tomato sauce, top with cheese and vegetables.',
            'Bake for another 6 minutes until crust is crispy and cheese is melted.'
          ],
          optionalSubstitutions: ['Can use jowar (sorghum) flour instead of ragi for a lighter color'],
          chefTip: 'Sprouting the ragi deactivates phytic acid, making its natural calcium 300% more bioavailable.',
          clinicalBenefit: 'Delivers 240mg natural plant calcium and 8g dietary fiber without celiac triggers.'
        }
      },
      // Gluten-Free Option 2
      {
        foodPreference: 'Gluten-Free',
        optionNumber: 2,
        swapOptionName: 'Sweet Potato Crust Margherita Pizza with Buffalo Mozzarella & Basil',
        calories: 270,
        protein: 17,
        carbs: 29,
        fat: 9,
        fiber: 7,
        glycemicIndex: 'Low',
        preparationTip: 'Grate raw sweet potato, combine with egg white or chia gel and oat flour, press thin and bake.',
        clinicalReason: 'Supplies beta-carotene provitamin A and slow-burning complex starches that do not irritate intestinal microvilli.',
        dietaryTags: ['Gluten-Free', 'Beta-Carotene Dense', 'Gut Healing', '100% Celiac Safe'],
        keyIngredients: ['Grated Sweet Potato', 'Certified GF Oat Flour', 'Fresh Mozzarella', 'Plum Tomatoes', 'Basil'],
        recipe: {
          recipeName: 'Golden Sweet Potato Crust Margherita',
          servings: '1 pizza',
          prepTimeMinutes: 12,
          cookTimeMinutes: 15,
          ingredients: [
            { item: 'Grated raw sweet potato (peeled)', amount: '120g' },
            { item: 'Certified gluten-free oat flour', amount: '25g' },
            { item: 'Egg white (or 1 tbsp chia gel)', amount: '1 unit' },
            { item: 'Tomato puree with basil', amount: '3 tbsp' },
            { item: 'Fresh mozzarella cheese', amount: '40g' }
          ],
          steps: [
            'Squeeze moisture from grated sweet potato in a towel. Mix with oat flour, egg white, and salt.',
            'Press firmly into a thin round on a parchment-lined tray.',
            'Bake at 200°C for 12 minutes until edges are crisp and golden.',
            'Top with tomato puree and mozzarella; bake 4 minutes until melted. Garnish with fresh basil.'
          ],
          optionalSubstitutions: ['Can use pumpkin or butternut squash in place of sweet potato'],
          chefTip: 'A finely grated sweet potato base binds much better and cooks to an appetizing caramelized edge.',
          clinicalBenefit: 'High in carotenoid antioxidants to reduce oxidative stress while satisfying pizza cravings.'
        }
      }
    ]
  },

  // =========================================================================
  // 2. SWEETS, DESSERTS & SUGAR CRAVINGS (Gulab Jamun, Pastry, Kheer, Halwa)
  // =========================================================================
  {
    category: 'Sweets, Desserts & Sugar Cravings',
    identifiedCraving: 'Traditional Sugar Syrup Sweets (Gulab Jamun, Jalebi, Pastry, Heavy Halwa)',
    keywords: [
      'sweet', 'something sweet', 'sweet craving', 'dessert', 'sugar', 'sugar craving',
      'gulab jamun', 'jalebi', 'halwa', 'kheer', 'rasgulla', 'pastry', 'cake', 'sweet tooth',
      'craving dessert', 'after dinner sweet', 'mithai'
    ],
    originalDish: {
      name: 'Traditional Mawa Gulab Jamun in Sugar Syrup (2 pieces)',
      calories: 520,
      protein: 6,
      carbs: 84,
      fat: 19,
      fiber: 0.5,
      glycemicIndex: 'High',
      drawbacks: 'Refined white sucrose syrup, deep-fried mawa and trans fats creating acute glycemic hyper-insulinemia, energy crash, and advanced glycation end-products (AGEs).'
    },
    swaps: [
      // Vegetarian Option 1
      {
        foodPreference: 'Vegetarian',
        optionNumber: 1,
        swapOptionName: 'Warm Cardamom Almond-Meal & Roasted Paneer Halwa (Stevia / Monk Fruit Infused)',
        calories: 190,
        protein: 14,
        carbs: 10,
        fat: 11,
        fiber: 5,
        glycemicIndex: 'Low',
        preparationTip: 'Roast blanched almond flour in 1 tsp A2 ghee, add grated fresh paneer, saffron milk, and sweeten with stevia or monk fruit.',
        clinicalReason: 'Supplies alpha-tocopherol (Vitamin E) and healthy fats, keeping post-dessert blood glucose completely flat.',
        dietaryTags: ['Vegetarian', 'Zero Sugar Spike', 'Keto Aligned', 'Cardamom & Saffron Infused'],
        keyIngredients: ['Almond Flour', 'Fresh Low-Fat Paneer', 'A2 Cow Ghee', 'Saffron Strands', 'Monk Fruit Sweetener'],
        recipe: {
          recipeName: 'Royal Saffron-Almond & Low-Fat Paneer Halwa',
          servings: '1 generous bowl (approx. 150g)',
          prepTimeMinutes: 5,
          cookTimeMinutes: 8,
          ingredients: [
            { item: 'Fine almond flour', amount: '35g' },
            { item: 'Fresh low-fat paneer (finely grated)', amount: '50g' },
            { item: 'A2 cow ghee', amount: '1 tsp (5g)' },
            { item: 'Warm almond milk or low-fat A2 milk', amount: '60ml' },
            { item: 'Kashmiri saffron strands + green cardamom powder', amount: '4 strands + 1/4 tsp' },
            { item: 'Pure monk fruit or stevia drops', amount: 'to taste (approx. 4 drops / 1 tsp erythritol)' },
            { item: 'Slivered pistachios & almonds', amount: '1 tsp for garnish' }
          ],
          steps: [
            'Steep saffron strands in 2 tbsp of warm milk for 3 minutes until golden yellow.',
            'Heat A2 ghee in a non-stick pan over medium heat. Add almond flour and roast for 3 minutes until fragrant and pale golden.',
            'Add grated paneer and sauté for 1 minute.',
            'Pour in saffron milk and cardamom powder. Stir continuously for 2 minutes until halwa thickens and leaves the sides of pan.',
            'Turn off the heat, stir in monk fruit sweetener, and garnish with slivered pistachios. Serve warm.'
          ],
          optionalSubstitutions: ['Can use walnut meal instead of almond flour', 'Can substitute paneer with firm tofu'],
          chefTip: 'Never boil artificial sweeteners on high flame; always fold them in after turning off the stove to preserve clean flavor.',
          clinicalBenefit: 'Supplies 14g high-biological-value protein and 5g fiber with less than 2g simple sugars.'
        }
      },
      // Vegetarian Option 2
      {
        foodPreference: 'Vegetarian',
        optionNumber: 2,
        swapOptionName: 'Thick Whipped Greek Yogurt Berry & Pistachio Shrikhand Parfait',
        calories: 165,
        protein: 18,
        carbs: 12,
        fat: 4,
        fiber: 4,
        glycemicIndex: 'Low',
        preparationTip: 'Whip hung Greek yogurt with saffron, cardamom, and stevia. Layer with crushed blackberries or strawberries and roasted pistachios.',
        clinicalReason: 'Supplies 10 billion CFU live active probiotics and 18g slow-digesting micellar casein protein.',
        dietaryTags: ['Vegetarian', 'Probiotic Rich', 'High Protein 18g', 'Gut Healing'],
        keyIngredients: ['Strained Greek Yogurt (Hung Curd)', 'Saffron & Cardamom', 'Wild Berries', 'Pistachios'],
        recipe: {
          recipeName: 'Kesar Pista Greek Yogurt Shrikhand Parfait',
          servings: '1 parfait glass',
          prepTimeMinutes: 5,
          cookTimeMinutes: 0,
          ingredients: [
            { item: 'Strained plain Greek yogurt (2% fat)', amount: '150g' },
            { item: 'Saffron strands steeped in 1 tsp milk', amount: '5 strands' },
            { item: 'Green cardamom powder', amount: '1/4 tsp' },
            { item: 'Monk fruit sweetener or stevia', amount: 'to taste' },
            { item: 'Fresh blueberries or raspberries', amount: '35g' },
            { item: 'Chopped roasted pistachios', amount: '1 tbsp (10g)' }
          ],
          steps: [
            'In a glass bowl, whisk the thick Greek yogurt with saffron extract, cardamom powder, and sweetener until glossy and silky.',
            'Spoon half the whipped shrikhand into a glass.',
            'Add a layer of fresh berries, then top with the remaining shrikhand.',
            'Garnish with chopped pistachios and chill for 15 minutes before enjoying.'
          ],
          optionalSubstitutions: ['Can use coconut yogurt for dairy-free adaptation'],
          chefTip: 'Whisking the yogurt with a balloon whisk aerates the texture into a luxurious dessert mousse.',
          clinicalBenefit: 'Improves gut microbiome diversity and delivers 18g protein for metabolic evening satiety.'
        }
      },

      // Vegan Option 1
      {
        foodPreference: 'Vegan',
        optionNumber: 1,
        swapOptionName: 'Creamy Coconut Chia & Wild Berry Pudding with Toasted Almond Slivers',
        calories: 180,
        protein: 8,
        carbs: 14,
        fat: 10,
        fiber: 9,
        glycemicIndex: 'Low',
        preparationTip: 'Soak black chia seeds in unsweetened coconut-almond milk with vanilla bean and monk fruit. Top with mashed wild berries.',
        clinicalReason: 'Chia seeds form a mucilage gel in the stomach, slowing carbohydrate digestion and delivering 4g plant ALA omega-3s.',
        dietaryTags: ['Vegan', 'Dairy-Free', 'High Fiber 9g', 'Omega-3 ALA'],
        keyIngredients: ['Chia Seeds', 'Coconut-Almond Milk', 'Vanilla Bean', 'Mashed Raspberries', 'Toasted Almonds'],
        recipe: {
          recipeName: 'Velvety Coconut Chia & Berry Pudding',
          servings: '1 jar (approx. 200ml)',
          prepTimeMinutes: 5,
          cookTimeMinutes: 0,
          ingredients: [
            { item: 'Organic black chia seeds', amount: '2.5 tbsp (30g)' },
            { item: 'Unsweetened coconut-almond milk', amount: '160ml' },
            { item: 'Pure vanilla extract', amount: '1/2 tsp' },
            { item: 'Monk fruit drops or erythritol', amount: '1 tsp equivalent' },
            { item: 'Fresh or thawed raspberries/strawberries (mashed)', amount: '40g' },
            { item: 'Toasted coconut flakes & almond slivers', amount: '1 tbsp' }
          ],
          steps: [
            'In a glass mason jar, stir chia seeds, coconut milk, vanilla extract, and monk fruit sweetener.',
            'Stir well for 1 minute, wait 3 minutes, then stir again to prevent chia seeds from sinking to the bottom.',
            'Cover and refrigerate for at least 30 minutes (or overnight) until a thick pudding forms.',
            'Top with mashed fresh berries, toasted coconut flakes, and sliced almonds before serving.'
          ],
          optionalSubstitutions: ['Can use oat milk or soy milk instead of coconut milk'],
          chefTip: 'The second stir after 3 minutes is key to getting an even, clump-free pudding texture.',
          clinicalBenefit: '9g soluble fiber keeps gut transit smooth and suppresses ghrelin (hunger hormone).'
        }
      },
      // Vegan Option 2
      {
        foodPreference: 'Vegan',
        optionNumber: 2,
        swapOptionName: 'Silken Tofu Saffron & Cardamom Dessert Kheer Cup with Crushed Walnuts',
        calories: 170,
        protein: 15,
        carbs: 11,
        fat: 7,
        fiber: 4,
        glycemicIndex: 'Low',
        preparationTip: 'Blend organic silken tofu with cardamom, saffron, almond milk, and stevia into a chilled, protein-packed vegan kheer.',
        clinicalReason: 'Supplies 15g complete plant isoflavones and soy protein with zero cholesterol or saturated animal fats.',
        dietaryTags: ['Vegan', 'High Plant Protein 15g', 'Zero Cholesterol', 'Low Calorie'],
        keyIngredients: ['Organic Silken Tofu', 'Almond Milk', 'Saffron & Cardamom', 'Chopped Walnuts'],
        recipe: {
          recipeName: 'Chilled Saffron-Cardamom Silken Tofu Custard',
          servings: '1 dessert bowl',
          prepTimeMinutes: 5,
          cookTimeMinutes: 0,
          ingredients: [
            { item: 'Organic soft silken tofu (drained)', amount: '140g' },
            { item: 'Unsweetened almond milk', amount: '50ml' },
            { item: 'Kashmiri saffron + green cardamom powder', amount: '4 strands + 1/3 tsp' },
            { item: 'Stevia / monk fruit extract', amount: 'to taste' },
            { item: 'Chopped walnuts & rose petals', amount: '1 tbsp' }
          ],
          steps: [
            'Place silken tofu, almond milk, cardamom powder, steeped saffron, and sweetener into a blender.',
            'Blend on high speed for 45 seconds until completely silky, creamy, and uniform with no lumps.',
            'Pour into a dessert cup and chill in the freezer for 15 minutes.',
            'Garnish with crushed walnuts and dried edible rose petals.'
          ],
          optionalSubstitutions: ['Can substitute almond milk with cashew milk for extra creaminess'],
          chefTip: 'Silken tofu has a completely neutral flavor and takes on the aroma of cardamom and saffron flawlessly.',
          clinicalBenefit: '15g plant protein blunts evening sweet cravings and supports thyroid hormone balance.'
        }
      },

      // Non-Vegetarian Option 1
      {
        foodPreference: 'Non-Vegetarian',
        optionNumber: 1,
        swapOptionName: 'Baked Cinnamon Vanilla Whey Protein Souffle Cup',
        calories: 175,
        protein: 26,
        carbs: 6,
        fat: 5,
        fiber: 3,
        glycemicIndex: 'Low',
        preparationTip: 'Whip 2 egg whites with vanilla whey isolate and cinnamon. Bake for 8 minutes into a warm, puffy protein souffle.',
        clinicalReason: 'Supplies 26g ultra-fast absorbing branched-chain amino acids (BCAAs) with virtually zero sugar.',
        dietaryTags: ['Non-Vegetarian', 'Ultra High Protein 26g', 'Zero Sugar', 'BCAA Rich'],
        keyIngredients: ['Pasture-Raised Egg Whites', 'Vanilla Whey Protein Isolate', 'Ceylon Cinnamon', 'Monk Fruit'],
        recipe: {
          recipeName: 'Warm Vanilla Cinnamon Protein Souffle',
          servings: '1 ramekin cup',
          prepTimeMinutes: 5,
          cookTimeMinutes: 8,
          ingredients: [
            { item: 'Fresh egg whites', amount: '2 large' },
            { item: 'Vanilla whey protein isolate powder', amount: '25g (1 scoop)' },
            { item: 'Almond milk', amount: '2 tbsp' },
            { item: 'Ceylon cinnamon powder', amount: '1/2 tsp', notes: 'Insulin sensitizer' },
            { item: 'Baking powder', amount: '1/4 tsp' }
          ],
          steps: [
            'In a clean glass bowl, whip egg whites with a pinch of salt until soft peaks form.',
            'In a small cup, whisk whey isolate with almond milk, cinnamon, and baking powder into a smooth slurry.',
            'Gently fold the whey mixture into the whipped egg whites using a spatula.',
            'Pour into a greased ceramic ramekin and bake at 180°C (350°F) for 8 minutes until puffed and golden.'
          ],
          optionalSubstitutions: ['Can use chocolate whey isolate for a chocolate souffle'],
          chefTip: 'Ceylon cinnamon enhances insulin receptor sensitivity, accelerating glucose disposal into muscle cells.',
          clinicalBenefit: '26g protein stops sugar cravings cold by increasing satiety hormones.'
        }
      },
      // Non-Vegetarian Option 2
      {
        foodPreference: 'Non-Vegetarian',
        optionNumber: 2,
        swapOptionName: 'Silky Collagen Berry Panna Cotta with Mint & Pomegranate',
        calories: 145,
        protein: 18,
        carbs: 8,
        fat: 4,
        fiber: 3,
        glycemicIndex: 'Low',
        preparationTip: 'Dissolve grass-fed collagen peptides and gelatin in warm almond milk, sweeten with monk fruit, and chill with fresh berries.',
        clinicalReason: 'Rich in glycine and proline amino acids that repair intestinal mucosal lining and enhance skin elasticity.',
        dietaryTags: ['Non-Vegetarian', 'Collagen Peptides', 'Gut Mucosa Repair', 'Joint Health'],
        keyIngredients: ['Grass-Fed Hydrolyzed Collagen', 'Unsweetened Almond Milk', 'Monk Fruit', 'Fresh Pomegranate Arils'],
        recipe: {
          recipeName: 'Grass-Fed Collagen & Berry Panna Cotta',
          servings: '1 dessert glass',
          prepTimeMinutes: 6,
          cookTimeMinutes: 4,
          ingredients: [
            { item: 'Grass-fed hydrolyzed collagen peptides', amount: '15g' },
            { item: 'Grass-fed gelatin powder', amount: '1 tsp (4g)' },
            { item: 'Almond milk (unsweetened)', amount: '150ml' },
            { item: 'Vanilla bean paste & stevia', amount: '1/2 tsp + to taste' },
            { item: 'Fresh pomegranate arils and mint', amount: '2 tbsp' }
          ],
          steps: [
            'Sprinkle gelatin over 30ml cold water in a small dish and let bloom for 3 minutes.',
            'Heat almond milk in a small saucepan until warm (not boiling). Stir in collagen peptides and sweetener.',
            'Add the bloomed gelatin to the warm milk and whisk until completely dissolved.',
            'Pour into a dessert cup and refrigerate for 45 minutes until softly set.',
            'Top with fresh pomegranate arils and mint leaves.'
          ],
          optionalSubstitutions: ['Can use coconut milk for a richer tropical panna cotta'],
          chefTip: 'Glycine in collagen peptides before bedtime promotes deeper slow-wave REM sleep.',
          clinicalBenefit: 'Supports connective tissue collagen synthesis and tight junction gut integrity.'
        }
      },

      // Jain Option 1
      {
        foodPreference: 'Jain',
        optionNumber: 1,
        swapOptionName: 'Jain Almond & Saffron Paneer Halwa (Zero Sugar)',
        calories: 195,
        protein: 14,
        carbs: 10,
        fat: 12,
        fiber: 5,
        glycemicIndex: 'Low',
        preparationTip: 'Roast almond flour in pure A2 ghee, add fresh crumbled paneer, saffron, cardamom, and sweeten with monk fruit.',
        clinicalReason: '100% Jain compliant with zero root ingredients; provides high calcium and sustained mental energy.',
        dietaryTags: ['Jain Safe', 'Root-Free', 'Zero Sugar', 'Low GI'],
        keyIngredients: ['Almond Flour', 'Fresh A2 Paneer', 'A2 Cow Ghee', 'Saffron & Cardamom', 'Monk Fruit'],
        recipe: {
          recipeName: 'Jain Royal Badam & Paneer Halwa',
          servings: '1 bowl',
          prepTimeMinutes: 5,
          cookTimeMinutes: 7,
          ingredients: [
            { item: 'Fine almond flour', amount: '35g' },
            { item: 'Fresh A2 paneer (crumbled fine)', amount: '50g' },
            { item: 'Pure A2 ghee', amount: '1 tsp' },
            { item: 'Warm A2 milk with saffron', amount: '60ml' },
            { item: 'Cardamom powder & monk fruit', amount: '1/4 tsp + to taste' }
          ],
          steps: [
            'Warm A2 ghee in a pan, add almond flour, and roast 3 minutes on low heat until aromatic.',
            'Add crumbled paneer, saffron milk, and cardamom powder.',
            'Stir continuously for 2 minutes until halwa thickens smoothly.',
            'Turn off heat, stir in monk fruit sweetener, and serve warm.'
          ],
          optionalSubstitutions: ['Can use water chestnut flour during fasting days'],
          chefTip: 'Almond flour releases healthy natural oils when gently roasted on low heat.',
          clinicalBenefit: '14g protein keeps blood sugar steady and satisfies dessert cravings cleanly.'
        }
      },
      // Jain Option 2
      {
        foodPreference: 'Jain',
        optionNumber: 2,
        swapOptionName: 'Jain Roasted Makhana (Foxnut) Kheer with Saffron & Crushed Almonds',
        calories: 160,
        protein: 9,
        carbs: 22,
        fat: 4,
        fiber: 4,
        glycemicIndex: 'Low',
        preparationTip: 'Roast phool makhana crisp in 1/2 tsp ghee, crush coarsely, simmer in A2 milk with saffron, cardamom, and stevia.',
        clinicalReason: 'Fox nuts are rich in kaempferol flavonoid antioxidants, low in sodium, and calm adrenal stress.',
        dietaryTags: ['Jain Safe', 'Ancient Superfood', 'Kaempferol Rich', 'Low Fat'],
        keyIngredients: ['Phool Makhana (Foxnuts)', 'A2 Cow Milk', 'Saffron & Green Cardamom', 'Stevia'],
        recipe: {
          recipeName: 'Jain Saffron Makhana Kheer',
          servings: '1 bowl',
          prepTimeMinutes: 5,
          cookTimeMinutes: 10,
          ingredients: [
            { item: 'Phool makhana (foxnuts)', amount: '30g' },
            { item: 'A2 cow milk (or almond milk)', amount: '200ml' },
            { item: 'A2 ghee', amount: '1/2 tsp' },
            { item: 'Saffron strands & cardamom powder', amount: '4 strands + 1/4 tsp' },
            { item: 'Monk fruit / stevia', amount: 'to taste' }
          ],
          steps: [
            'Roast makhana in ghee on low flame for 4 minutes until crunchy. Coarsely crush half the makhana in a mortar.',
            'Bring milk to a gentle simmer in a saucepan with saffron and cardamom.',
            'Add whole and crushed makhana to the milk and simmer for 5 minutes until creamy and thick.',
            'Turn off the heat, stir in sweetener, and serve warm or chilled.'
          ],
          optionalSubstitutions: ['Can use coconut milk for a vegan Jain option'],
          chefTip: 'Crushing half the makhana naturally thickens the kheer without needing cornstarch or rice.',
          clinicalBenefit: 'Provides low-glycemic magnesium to calm the nervous system in the evening.'
        }
      },

      // Eggetarian Option 1
      {
        foodPreference: 'Eggetarian',
        optionNumber: 1,
        swapOptionName: 'Baked Cinnamon Vanilla Egg Custard Cup with Nutmeg',
        calories: 140,
        protein: 14,
        carbs: 5,
        fat: 7,
        fiber: 1,
        glycemicIndex: 'Low',
        preparationTip: 'Whisk 1 whole egg + 2 egg whites with warm almond milk, vanilla, nutmeg, and monk fruit. Bake in a water bath.',
        clinicalReason: 'Provides bioavailable egg albumin and lutein with under 5g carbohydrates, keeping insulin low.',
        dietaryTags: ['Eggetarian', 'Low Carb', 'High Bioavailable Protein', 'Keto Aligned'],
        keyIngredients: ['Pasture Eggs', 'Almond Milk', 'Ground Nutmeg & Cinnamon', 'Monk Fruit'],
        recipe: {
          recipeName: 'Silky Cinnamon & Nutmeg Baked Egg Custard',
          servings: '1 ramekin',
          prepTimeMinutes: 5,
          cookTimeMinutes: 15,
          ingredients: [
            { item: 'Whole egg + egg white', amount: '1 whole + 1 white' },
            { item: 'Warm unsweetened almond milk', amount: '120ml' },
            { item: 'Vanilla extract & ground nutmeg', amount: '1/2 tsp vanilla + pinch nutmeg' },
            { item: 'Monk fruit sweetener', amount: '1 tsp equivalent' }
          ],
          steps: [
            'Whisk eggs, vanilla, nutmeg, and monk fruit together in a small bowl.',
            'Slowly pour in warm almond milk while whisking gently.',
            'Strain mixture through a fine sieve into a ceramic ramekin.',
            'Place ramekin in a baking dish filled with 1 inch hot water (bain-marie) and bake at 165°C (325°F) for 15 minutes until set.'
          ],
          optionalSubstitutions: ['Can add lemon zest for a citrus custard'],
          chefTip: 'Baking in a water bath prevents the custard from curdling and gives a silky French texture.',
          clinicalBenefit: 'Delivers 14g high-biological-value protein with negligible blood glucose impact.'
        }
      },
      // Eggetarian Option 2
      {
        foodPreference: 'Eggetarian',
        optionNumber: 2,
        swapOptionName: 'Fluffy Stevia-Sweetened Egg White Meringue Cloud with Crushed Strawberries',
        calories: 95,
        protein: 12,
        carbs: 8,
        fat: 0.5,
        fiber: 2,
        glycemicIndex: 'Low',
        preparationTip: 'Whip egg whites to stiff peaks with cream of tartar and monk fruit. Bake at low heat until crispy on outside, soft inside.',
        clinicalReason: 'Ultra-low calorie (under 100 kcal) dessert satisfying the sweet tooth with 12g pure protein.',
        dietaryTags: ['Eggetarian', 'Fat-Free', 'Under 100 Calories', 'High Protein'],
        keyIngredients: ['Egg Whites', 'Cream of Tartar', 'Monk Fruit Powder', 'Fresh Strawberries'],
        recipe: {
          recipeName: 'Crisp Meringue Cloud with Strawberry Coulis',
          servings: '2 meringue clouds',
          prepTimeMinutes: 8,
          cookTimeMinutes: 20,
          ingredients: [
            { item: 'Fresh egg whites', amount: '3 large' },
            { item: 'Cream of tartar', amount: '1/8 tsp', notes: 'Stabilizes egg foam' },
            { item: 'Powdered monk fruit / erythritol', amount: '2 tbsp' },
            { item: 'Fresh strawberries (mashed with lemon juice)', amount: '40g' }
          ],
          steps: [
            'Whip egg whites and cream of tartar with an electric beater on medium speed until frothy.',
            'Gradually add powdered sweetener 1 tsp at a time while beating on high speed until stiff, glossy peaks form.',
            'Dollop into 2 mounds on a parchment baking sheet and bake at 120°C (250°F) for 20 minutes until crisp.',
            'Cool completely and serve topped with fresh mashed strawberry coulis.'
          ],
          optionalSubstitutions: ['Can dust with unsweetened cocoa powder for a chocolate cloud'],
          chefTip: 'Ensure your bowl and whisk are completely grease-free so egg whites achieve maximum volume.',
          clinicalBenefit: 'Completely satisfies the desire for sweet crunch without added fats or high fructose syrup.'
        }
      },

      // Keto Option 1
      {
        foodPreference: 'Keto',
        optionNumber: 1,
        swapOptionName: 'Keto Almond Butter & Coconut Oil Fat Bomb Fudge',
        calories: 185,
        protein: 7,
        carbs: 4,
        fat: 17,
        fiber: 3,
        glycemicIndex: 'Low',
        preparationTip: 'Melt natural almond butter with virgin coconut oil, vanilla, cinnamon, and monk fruit. Freeze in silicone molds.',
        clinicalReason: 'Medium-chain triglycerides (MCTs) from coconut oil convert directly to hepatic ketones, ending carb cravings.',
        dietaryTags: ['Keto Protocol', 'MCT Rich', 'Under 2g Net Carbs', 'Zero Insulin Spike'],
        keyIngredients: ['Natural Almond Butter', 'Cold-Pressed Virgin Coconut Oil', 'Ceylon Cinnamon', 'Monk Fruit'],
        recipe: {
          recipeName: 'Keto Cinnamon-Almond Butter Fat Bomb Fudge',
          servings: '2 fudge squares',
          prepTimeMinutes: 5,
          cookTimeMinutes: 0,
          ingredients: [
            { item: 'Creamy roasted almond butter (unsweetened)', amount: '2 tbsp (32g)' },
            { item: 'Virgin coconut oil (melted)', amount: '1 tbsp (14g)' },
            { item: 'Ceylon cinnamon & vanilla extract', amount: '1/2 tsp each' },
            { item: 'Monk fruit sweetener', amount: '1 tsp equivalent' },
            { item: 'Flaky sea salt', amount: 'a pinch for top' }
          ],
          steps: [
            'In a small bowl, mix almond butter, melted coconut oil, vanilla, cinnamon, and monk fruit until glossy.',
            'Pour evenly into 2 silicone candy or muffin molds.',
            'Sprinkle with a tiny pinch of flaky sea salt on top.',
            'Freeze for 20 minutes until solid. Pop out and enjoy chilled.'
          ],
          optionalSubstitutions: ['Can use peanut butter, tahini, or sunflower seed butter'],
          chefTip: 'Store in the freezer because coconut oil melts at room temperature (24°C).',
          clinicalBenefit: 'Rapidly triggers cholecystokinin release in the duodenum to shut off hunger signaling.'
        }
      },
      // Keto Option 2
      {
        foodPreference: 'Keto',
        optionNumber: 2,
        swapOptionName: 'Whipped Mascarpone & Espresso Berry Mousse Cup',
        calories: 195,
        protein: 5,
        carbs: 4,
        fat: 19,
        fiber: 2,
        glycemicIndex: 'Low',
        preparationTip: 'Whip fresh Italian mascarpone with a splash of decaf espresso, vanilla, and monk fruit.',
        clinicalReason: 'Supplies high monounsaturated and saturated fatty acids with virtually zero glycemic effect, stabilizing ketones.',
        dietaryTags: ['Keto Protocol', 'High Fat (19g)', 'Ultra Low Carb', 'Espresso Infused'],
        keyIngredients: ['Italian Mascarpone Cheese', 'Decaf Espresso Shot', 'Vanilla Extract', 'Monk Fruit'],
        recipe: {
          recipeName: 'Keto Espresso & Mascarpone Mousse',
          servings: '1 dessert cup',
          prepTimeMinutes: 4,
          cookTimeMinutes: 0,
          ingredients: [
            { item: 'Fresh mascarpone cheese (or full-fat cream cheese)', amount: '50g' },
            { item: 'Concentrated decaf espresso (cooled)', amount: '1.5 tbsp' },
            { item: 'Pure vanilla extract', amount: '1/2 tsp' },
            { item: 'Monk fruit sweetener', amount: '1 tsp equivalent' },
            { item: 'Grated 90% dark chocolate for garnish', amount: '5g' }
          ],
          steps: [
            'In a dessert cup, whip mascarpone with espresso, vanilla, and monk fruit using a small whisk for 1 minute until fluffy.',
            'Dust top with finely grated 90% dark chocolate.',
            'Chill in fridge for 10 minutes and enjoy with a demitasse spoon.'
          ],
          optionalSubstitutions: ['Can use thick clotted cream or whipped heavy cream instead of mascarpone'],
          chefTip: 'Using decaf espresso gives authentic Tiramisu flavor without causing late-night insomnia.',
          clinicalBenefit: 'Keeps carbohydrate intake under 3g net carbs while delivering luxury comfort.'
        }
      },

      // Gluten-Free Option 1
      {
        foodPreference: 'Gluten-Free',
        optionNumber: 1,
        swapOptionName: 'Sprouted Buckwheat & Roasted Apple Cinnamon Bowl',
        calories: 185,
        protein: 8,
        carbs: 28,
        fat: 5,
        fiber: 7,
        glycemicIndex: 'Low',
        preparationTip: 'Simmer sprouted buckwheat groats with diced apples, cinnamon, and almond milk. Top with roasted walnuts.',
        clinicalReason: 'Buckwheat contains D-chiro-inositol, a potent natural compound that improves cellular insulin sensitivity.',
        dietaryTags: ['Gluten-Free', 'Celiac Safe', 'D-Chiro-Inositol', 'High Fiber 7g'],
        keyIngredients: ['Sprouted Buckwheat Groats', 'Diced Crisp Apple', 'Ceylon Cinnamon', 'Walnuts', 'Almond Milk'],
        recipe: {
          recipeName: 'Sprouted Buckwheat & Apple Cinnamon Comfort Porridge',
          servings: '1 bowl',
          prepTimeMinutes: 5,
          cookTimeMinutes: 8,
          ingredients: [
            { item: 'Sprouted buckwheat groats', amount: '35g' },
            { item: 'Diced crisp green apple', amount: '50g' },
            { item: 'Almond milk', amount: '150ml' },
            { item: 'Ceylon cinnamon powder', amount: '1/2 tsp' },
            { item: 'Crushed walnuts', amount: '1 tbsp (10g)' }
          ],
          steps: [
            'Rinse sprouted buckwheat and place in a saucepan with almond milk and diced apple.',
            'Simmer on medium heat for 6-8 minutes until buckwheat is tender and porridge is thick and creamy.',
            'Stir in cinnamon powder and monk fruit sweetener if extra sweetness is desired.',
            'Transfer to a bowl and top with crushed walnuts.'
          ],
          optionalSubstitutions: ['Can use quinoa flakes or certified GF rolled oats instead of buckwheat'],
          chefTip: 'Buckwheat is not a wheat grain; it is a fruit seed related to rhubarb and is 100% gluten-free.',
          clinicalBenefit: 'D-chiro-inositol assists glucose transporter translocation (GLUT4) into cells.'
        }
      },
      // Gluten-Free Option 2
      {
        foodPreference: 'Gluten-Free',
        optionNumber: 2,
        swapOptionName: 'Steamed Sweet Potato & Coconut Cardamom Halwa (Refined Sugar Free)',
        calories: 175,
        protein: 6,
        carbs: 26,
        fat: 6,
        fiber: 6,
        glycemicIndex: 'Low',
        preparationTip: 'Mash steamed orange sweet potato with coconut milk, green cardamom, and a touch of jaggery / monk fruit.',
        clinicalReason: 'Natural carotenoids and prebiotic soluble fiber slow digestion while providing deep dessert sweetness.',
        dietaryTags: ['Gluten-Free', 'Carotenoid Rich', 'Celiac Safe', 'Refined Sugar Free'],
        keyIngredients: ['Orange Sweet Potato (Shakarkandi)', 'Coconut Milk', 'Green Cardamom', 'Toasted Cashews'],
        recipe: {
          recipeName: 'Steamed Sweet Potato & Coconut Cardamom Halwa',
          servings: '1 bowl',
          prepTimeMinutes: 8,
          cookTimeMinutes: 6,
          ingredients: [
            { item: 'Steamed sweet potato (mashed smooth)', amount: '130g' },
            { item: 'Thick coconut milk', amount: '40ml' },
            { item: 'A2 ghee or coconut oil', amount: '1/2 tsp' },
            { item: 'Cardamom powder', amount: '1/4 tsp' },
            { item: 'Toasted cashew nuts', amount: '1 tbsp' }
          ],
          steps: [
            'Warm ghee or coconut oil in a non-stick pan, add mashed sweet potato, and sauté for 2 minutes.',
            'Add coconut milk and cardamom powder. Cook on low flame for 4 minutes until halwa turns aromatic and glossy.',
            'Stir in monk fruit sweetener or a teaspoon of black dates syrup if desired.',
            'Serve warm garnished with toasted cashew nuts.'
          ],
          optionalSubstitutions: ['Can use steamed pumpkin or butternut squash'],
          chefTip: 'Sweet potatoes become naturally sweeter when steamed gently, needing almost zero extra sweetener.',
          clinicalBenefit: 'Soluble fiber binds bile acids to assist healthy lipid metabolism.'
        }
      }
    ]
  },

  // =========================================================================
  // 3. CHOCOLATE & BROWNIE CRAVINGS
  // =========================================================================
  {
    category: 'Chocolate, Brownies & Cocoa Indulgence',
    identifiedCraving: 'Rich Chocolate Fudge Brownie / Milk Chocolate Bar',
    keywords: [
      'chocolate', 'dark chocolate', 'brownie', 'cocoa', 'fudge', 'lava cake', 'nutella',
      'chocolate cake', 'choc', 'chocolate craving', 'want chocolate', 'hot chocolate'
    ],
    originalDish: {
      name: 'Commercial Chocolate Fudge Brownie with Ice Cream',
      calories: 580,
      protein: 7,
      carbs: 82,
      fat: 26,
      fiber: 2,
      glycemicIndex: 'High',
      drawbacks: 'Refined flour, hydrogenated fats, ultra-processed cocoa butter, and 50g+ refined white sugar triggering dopamine desensitization and inflammatory AGEs.'
    },
    swaps: [
      // Vegetarian Option 1
      {
        foodPreference: 'Vegetarian',
        optionNumber: 1,
        swapOptionName: 'Dark Raw Cacao & Avocado Chocolate Protein Pudding',
        calories: 195,
        protein: 15,
        carbs: 12,
        fat: 11,
        fiber: 7,
        glycemicIndex: 'Low',
        preparationTip: 'Blend ripe Hass avocado with raw organic cacao powder, whey isolate or Greek yogurt, and monk fruit into a rich fudge pudding.',
        clinicalReason: 'Raw cacao supplies 80mg bioavailable elemental magnesium (which is often the underlying nutrient deficit driving chocolate cravings).',
        dietaryTags: ['Vegetarian', 'Magnesium Rich 80mg', 'High Polyphenols', 'Low GI'],
        keyIngredients: ['Ripe Hass Avocado', 'Raw Organic Cacao Powder', 'Greek Yogurt / Whey', 'Monk Fruit', 'Vanilla'],
        recipe: {
          recipeName: 'Raw Cacao & Avocado Silk Chocolate Mousse',
          servings: '1 dessert bowl',
          prepTimeMinutes: 5,
          cookTimeMinutes: 0,
          ingredients: [
            { item: 'Ripe Hass avocado flesh', amount: '60g (approx 1/2 avocado)' },
            { item: 'Raw unsweetened dark cacao powder', amount: '2 tbsp (15g)' },
            { item: 'Plain Greek yogurt (2%) or almond milk', amount: '60g' },
            { item: 'Pure vanilla extract', amount: '1/2 tsp' },
            { item: 'Monk fruit sweetener or stevia', amount: 'to taste' },
            { item: 'Dark cacao nibs for topping', amount: '1 tsp (5g)' }
          ],
          steps: [
            'Place avocado, raw cacao powder, Greek yogurt, vanilla extract, and monk fruit into a mini food processor.',
            'Blend on high for 1 minute until completely rich, thick, and velvety chocolate mousse forms.',
            'Spoon into a serving cup and top with crunchy raw cacao nibs.',
            'Serve chilled.'
          ],
          optionalSubstitutions: ['Can use ripe banana instead of avocado (slightly higher carbs)', 'Can use coconut cream for dairy-free'],
          chefTip: 'Avocado has zero avocado taste when combined with rich dark cacao powder, creating the texture of premium French ganache.',
          clinicalBenefit: 'High magnesium relaxes vascular smooth muscle and alleviates premenstrual / stress cravings.'
        }
      },
      // Vegetarian Option 2
      {
        foodPreference: 'Vegetarian',
        optionNumber: 2,
        swapOptionName: '90-Second Dark Chocolate Whey Microwave Mug Brownie',
        calories: 180,
        protein: 22,
        carbs: 8,
        fat: 6,
        fiber: 5,
        glycemicIndex: 'Low',
        preparationTip: 'Whisk almond flour, chocolate protein powder, raw cacao, egg white, and almond milk in a coffee mug. Microwave 75 seconds.',
        clinicalReason: 'Provides 22g fast protein with 70% fewer calories than bakery brownies, keeping insulin low.',
        dietaryTags: ['Vegetarian', 'Quick 90s Prep', 'High Protein 22g', 'Zero Refined Flour'],
        keyIngredients: ['Almond Flour', 'Chocolate Whey Isolate', 'Raw Cacao Powder', 'Almond Milk', 'Baking Powder'],
        recipe: {
          recipeName: '90-Second Molten Chocolate Protein Mug Cake',
          servings: '1 mug cake',
          prepTimeMinutes: 2,
          cookTimeMinutes: 2,
          ingredients: [
            { item: 'Almond flour', amount: '1.5 tbsp (15g)' },
            { item: 'Chocolate whey protein powder', amount: '20g' },
            { item: 'Raw dark cacao powder', amount: '1 tbsp (8g)' },
            { item: 'Baking powder', amount: '1/4 tsp' },
            { item: 'Unsweetened almond milk', amount: '4 tbsp (60ml)' },
            { item: '85% dark chocolate square (placed in center)', amount: '1 square (10g)' }
          ],
          steps: [
            'In a microwave-safe ceramic coffee mug, whisk almond flour, whey powder, cacao powder, and baking powder.',
            'Add almond milk and stir with a fork into a smooth, thick brownie batter.',
            'Press the dark chocolate square into the center of the batter.',
            'Microwave on high for 70-80 seconds until the top is set but the center remains molten.',
            'Let cool 1 minute and enjoy warm with a spoon.'
          ],
          optionalSubstitutions: ['Can substitute almond flour with oat flour or coconut flour'],
          chefTip: 'Do not overcook in microwave; taking it out when the edges are just set ensures a molten lava center.',
          clinicalBenefit: '22g protein triggers satiety center in hypothalamus while satisfying intense chocolate cravings.'
        }
      },

      // Non-Vegetarian Option 1
      {
        foodPreference: 'Non-Vegetarian',
        optionNumber: 1,
        swapOptionName: 'Dark Chocolate Collagen & Egg White Lava Cake',
        calories: 170,
        protein: 24,
        carbs: 6,
        fat: 5,
        fiber: 4,
        glycemicIndex: 'Low',
        preparationTip: 'Whisk 2 egg whites with hydrolyzed collagen peptides, dark cocoa, and monk fruit. Bake in oven for 6 minutes.',
        clinicalReason: 'Supplies complete amino acids + joint-nourishing collagen with zero wheat flour or refined butter.',
        dietaryTags: ['Non-Vegetarian', 'Collagen Peptides', 'High Protein 24g', 'Gluten-Free'],
        keyIngredients: ['Egg Whites', 'Collagen Peptides', 'Dutch Process Cocoa', 'Almond Milk', 'Monk Fruit'],
        recipe: {
          recipeName: 'Dark Chocolate Collagen Lava Cake',
          servings: '1 ramekin',
          prepTimeMinutes: 4,
          cookTimeMinutes: 6,
          ingredients: [
            { item: 'Egg whites', amount: '2 large' },
            { item: 'Hydrolyzed collagen peptides powder', amount: '15g' },
            { item: 'Dutch process dark cocoa powder', amount: '1.5 tbsp (12g)' },
            { item: 'Almond flour', amount: '1 tbsp (10g)' },
            { item: 'Monk fruit sweetener', amount: '1 tbsp equivalent' },
            { item: '90% dark chocolate button for center', amount: '8g' }
          ],
          steps: [
            'Whisk egg whites, collagen, cocoa powder, almond flour, and sweetener into a silky batter.',
            'Pour into a small greased ceramic ramekin.',
            'Drop the 90% dark chocolate button into the center.',
            'Bake at 190°C (375°F) for 6-7 minutes until the edges are firm and center is gooey.',
            'Serve immediately.'
          ],
          optionalSubstitutions: ['Can use whey isolate instead of collagen'],
          chefTip: 'Collagen peptides dissolve without altering the delicate chocolate cake texture.',
          clinicalBenefit: 'Combines magnesium for vascular relaxation with collagen for tendon and gut wall repair.'
        }
      },
      // Non-Vegetarian Option 2
      {
        foodPreference: 'Non-Vegetarian',
        optionNumber: 2,
        swapOptionName: 'Silky Chocolate Egg Custard Brulee Cup',
        calories: 160,
        protein: 15,
        carbs: 6,
        fat: 9,
        fiber: 3,
        glycemicIndex: 'Low',
        preparationTip: 'Blend whole egg, egg white, dark cocoa, vanilla, and almond milk; bake in hot water bath.',
        clinicalReason: 'Provides egg yolk choline and high-absorption iron alongside cocoa flavanols.',
        dietaryTags: ['Non-Vegetarian', 'Choline Rich', 'Low Carb', 'Keto Aligned'],
        keyIngredients: ['Whole Egg + Egg White', 'Dark Cocoa Powder', 'Vanilla', 'Almond Milk', 'Stevia'],
        recipe: {
          recipeName: 'Dark Chocolate Baked Pot de Creme',
          servings: '1 ramekin',
          prepTimeMinutes: 5,
          cookTimeMinutes: 14,
          ingredients: [
            { item: 'Whole egg + egg white', amount: '1 whole + 1 white' },
            { item: 'Dark unsweetened cocoa powder', amount: '1.5 tbsp (12g)' },
            { item: 'Warm unsweetened almond milk', amount: '120ml' },
            { item: 'Vanilla extract & monk fruit', amount: '1/2 tsp + to taste' }
          ],
          steps: [
            'Whisk cocoa powder with warm almond milk until dissolved and smooth.',
            'Whisk in eggs, vanilla, and monk fruit sweetener.',
            'Strain into a ramekin and place in a water bath dish.',
            'Bake at 160°C (320°F) for 14 minutes until center jiggles softly like custard.',
            'Chill in fridge for 20 minutes before serving.'
          ],
          optionalSubstitutions: ['Can use coconut milk for a richer chocolate pot de creme'],
          chefTip: 'Straining through a sieve gives a silky restaurant-grade chocolate custard texture.',
          clinicalBenefit: 'Choline from egg yolk optimizes liver fatty acid export and neurotransmitter synthesis.'
        }
      },

      // Vegan Option 1
      {
        foodPreference: 'Vegan',
        optionNumber: 1,
        swapOptionName: 'Dark Cocoa Chia Seed Chocolate Pudding with Roasted Hazelnuts (Healthy Nutella)',
        calories: 185,
        protein: 8,
        carbs: 14,
        fat: 11,
        fiber: 9,
        glycemicIndex: 'Low',
        preparationTip: 'Whisk chia seeds with almond milk, raw cacao, hazelnut butter, and monk fruit. Chill until set.',
        clinicalReason: 'Delivers 9g soluble fiber, healthy monounsaturated fats, and plant magnesium to quell sugar binges.',
        dietaryTags: ['Vegan', 'Healthy Nutella Swap', 'High Fiber 9g', '100% Plant-Based'],
        keyIngredients: ['Chia Seeds', 'Raw Cacao Powder', 'Natural Hazelnut Butter', 'Almond Milk', 'Vanilla'],
        recipe: {
          recipeName: 'Raw Cocoa & Roasted Hazelnut Chia Pudding',
          servings: '1 jar',
          prepTimeMinutes: 5,
          cookTimeMinutes: 0,
          ingredients: [
            { item: 'Black chia seeds', amount: '2.5 tbsp (30g)' },
            { item: 'Raw dark cacao powder', amount: '1.5 tbsp (12g)' },
            { item: 'Roasted hazelnut butter', amount: '1 tbsp (16g)' },
            { item: 'Unsweetened almond milk', amount: '160ml' },
            { item: 'Pure vanilla extract & monk fruit', amount: '1/2 tsp + to taste' }
          ],
          steps: [
            'Whisk cacao powder and hazelnut butter with 3 tbsp warm almond milk until smooth.',
            'Add remaining cold almond milk, chia seeds, vanilla, and sweetener. Stir well.',
            'Rest 5 minutes and stir again to disperse seeds.',
            'Refrigerate for 30 minutes until set into a rich chocolate hazelnut cream.'
          ],
          optionalSubstitutions: ['Can use almond butter or peanut butter if hazelnut butter is unavailable'],
          chefTip: 'Hazelnut butter paired with dark cocoa creates the exact flavor profile of Nutella without 21g of sugar.',
          clinicalBenefit: '9g fiber regulates blood sugar and promotes short-chain fatty acid gut health.'
        }
      },
      // Vegan Option 2
      {
        foodPreference: 'Vegan',
        optionNumber: 2,
        swapOptionName: 'Silken Tofu Dark Chocolate Ganache Mousse',
        calories: 165,
        protein: 14,
        carbs: 11,
        fat: 7,
        fiber: 5,
        glycemicIndex: 'Low',
        preparationTip: 'Melt 85% dark chocolate, blend with silken tofu, raw cacao, and vanilla into an ultra-creamy ganache.',
        clinicalReason: 'Supplies 14g plant protein and cocoa polyphenols that enhance endothelial nitric oxide production.',
        dietaryTags: ['Vegan', 'Dairy-Free', 'High Plant Protein 14g', 'Polyphenol Rich'],
        keyIngredients: ['Organic Silken Tofu', '85% Dark Chocolate', 'Raw Cacao Powder', 'Vanilla Bean'],
        recipe: {
          recipeName: 'Velvety Silken Tofu Dark Chocolate Mousse',
          servings: '1 dessert bowl',
          prepTimeMinutes: 6,
          cookTimeMinutes: 1,
          ingredients: [
            { item: 'Organic silken tofu (drained)', amount: '130g' },
            { item: '85% dark chocolate (melted)', amount: '20g' },
            { item: 'Raw dark cacao powder', amount: '1 tbsp' },
            { item: 'Pure vanilla extract & monk fruit', amount: '1/2 tsp + to taste' },
            { item: 'Unsweetened almond milk', amount: '2 tbsp' }
          ],
          steps: [
            'Melt dark chocolate in a microwave-safe cup in 20-second bursts.',
            'Add silken tofu, melted chocolate, cacao powder, vanilla, almond milk, and sweetener to blender.',
            'Blend on high for 1 minute until completely smooth and satiny.',
            'Chill in fridge for 20 minutes to firm up into a classic mousse texture.'
          ],
          optionalSubstitutions: ['Can add orange zest for chocolate-orange mousse'],
          chefTip: 'Silken tofu completely disappears into the chocolate, giving a restaurant-grade mousse with zero cream.',
          clinicalBenefit: 'Polyphenols improve cerebral blood flow and satisfy chocolate cravings.'
        }
      },

      // Jain Option 1
      {
        foodPreference: 'Jain',
        optionNumber: 1,
        swapOptionName: 'Jain Warm Almond-Cacao Fudge with Roasted Pistachios',
        calories: 190,
        protein: 12,
        carbs: 10,
        fat: 12,
        fiber: 6,
        glycemicIndex: 'Low',
        preparationTip: 'Roast almond flour in 1/2 tsp A2 ghee, add dark cocoa, warm A2 milk, and monk fruit into a warm fudge.',
        clinicalReason: '100% Jain compliant; provides natural cocoa flavanols and magnesium without roots or eggs.',
        dietaryTags: ['Jain Safe', 'Root-Free', 'Low GI', 'Magnesium Dense'],
        keyIngredients: ['Almond Flour', 'Dark Raw Cacao', 'A2 Cow Milk', 'Monk Fruit', 'Roasted Pistachios'],
        recipe: {
          recipeName: 'Jain Warm Almond-Cocoa Halwa Fudge',
          servings: '1 bowl',
          prepTimeMinutes: 4,
          cookTimeMinutes: 5,
          ingredients: [
            { item: 'Almond flour', amount: '35g' },
            { item: 'Raw unsweetened cacao powder', amount: '1.5 tbsp (12g)' },
            { item: 'A2 cow ghee', amount: '1/2 tsp' },
            { item: 'Warm A2 cow milk', amount: '60ml' },
            { item: 'Green cardamom powder & monk fruit', amount: '1/4 tsp + to taste' },
            { item: 'Slivered pistachios', amount: '1 tsp' }
          ],
          steps: [
            'Heat ghee in a pan, add almond flour and cacao powder. Roast on low heat for 2 minutes.',
            'Pour in warm A2 milk and cardamom. Stir continuously for 2 minutes until glossy and thick.',
            'Turn off heat, stir in monk fruit sweetener, and top with pistachios.'
          ],
          optionalSubstitutions: ['Can use water chestnut flour during fasting days'],
          chefTip: 'Cardamom pairs unexpectedly well with dark cocoa, creating an authentic Indian royal mithai fusion.',
          clinicalBenefit: '12g protein and rich magnesium ease tension and support restful evening relaxation.'
        }
      },
      // Jain Option 2
      {
        foodPreference: 'Jain',
        optionNumber: 2,
        swapOptionName: 'Jain Dark Chocolate Makhana (Foxnut) Crunch Clusters',
        calories: 155,
        protein: 7,
        carbs: 18,
        fat: 6,
        fiber: 4,
        glycemicIndex: 'Low',
        preparationTip: 'Roast fox nuts crisp, toss with melted 85% dark chocolate, sea salt, and chia seeds. Cool into crunch clusters.',
        clinicalReason: 'Replaces processed chocolate bars with antioxidant-rich crunchy fox nuts and zero sugar spikes.',
        dietaryTags: ['Jain Safe', 'Ancient Foxnuts', 'Antioxidant Rich', 'Low Calorie'],
        keyIngredients: ['Phool Makhana', '85% Dark Chocolate', 'Chia Seeds', 'Flaky Sea Salt'],
        recipe: {
          recipeName: 'Jain Dark Chocolate Foxnut Crunch Bites',
          servings: '1 snack bowl',
          prepTimeMinutes: 5,
          cookTimeMinutes: 4,
          ingredients: [
            { item: 'Phool makhana (foxnuts)', amount: '30g' },
            { item: '85% dark chocolate (chopped)', amount: '25g' },
            { item: 'Chia seeds', amount: '1 tsp' },
            { item: 'Flaky sea salt', amount: 'a pinch' }
          ],
          steps: [
            'Dry roast makhana in a skillet on low flame for 4 minutes until brittle and crunchy.',
            'Melt dark chocolate in a bowl over a double boiler or in microwave.',
            'Toss roasted makhana and chia seeds into melted chocolate until evenly coated.',
            'Spread onto parchment paper, sprinkle sea salt, and chill for 10 minutes until set.'
          ],
          optionalSubstitutions: ['Can use roasted almonds or pumpkin seeds'],
          chefTip: 'The sea salt accentuates the deep cocoa notes without requiring added sugar.',
          clinicalBenefit: 'Satisfies both chocolate craving and crunchy texture needs in under 160 calories.'
        }
      },

      // Keto Option 1
      {
        foodPreference: 'Keto',
        optionNumber: 1,
        swapOptionName: 'Keto Dark Chocolate Avocado Molten Truffle',
        calories: 190,
        protein: 6,
        carbs: 4,
        fat: 18,
        fiber: 6,
        glycemicIndex: 'Low',
        preparationTip: 'Mash avocado with dark cocoa, coconut oil, and monk fruit. Roll into truffles and dust in cacao.',
        clinicalReason: 'Net carbs under 2g, supplying monounsaturated oleic acid and triggering rapid ketosis.',
        dietaryTags: ['Keto Protocol', 'Ultra Low Carb (2g Net)', 'Zero Sugar', 'MCT Rich'],
        keyIngredients: ['Avocado', 'Dark Raw Cacao', 'Virgin Coconut Oil', 'Monk Fruit', 'Sea Salt'],
        recipe: {
          recipeName: 'Keto Dark Cocoa Avocado Truffles',
          servings: '3 truffles',
          prepTimeMinutes: 6,
          cookTimeMinutes: 0,
          ingredients: [
            { item: 'Ripe avocado (mashed completely smooth)', amount: '60g' },
            { item: 'Raw dark cacao powder', amount: '2 tbsp (15g)' },
            { item: 'Melted coconut oil', amount: '1 tsp' },
            { item: 'Vanilla extract & monk fruit', amount: '1/2 tsp + to taste' },
            { item: 'Extra cacao powder for rolling', amount: '1 tbsp' }
          ],
          steps: [
            'Mash avocado with a fork until perfectly smooth with zero chunks.',
            'Stir in cacao powder, melted coconut oil, vanilla, and monk fruit until a stiff fudge dough forms.',
            'Freeze dough for 10 minutes to firm up.',
            'Roll into 3 balls and roll through extra cacao powder to coat.',
            'Enjoy immediately or store in fridge.'
          ],
          optionalSubstitutions: ['Can roll in crushed pecans or unsweetened shredded coconut'],
          chefTip: 'Using dark Dutch-process cocoa gives a rich, velvety European truffle bite.',
          clinicalBenefit: 'Zero insulin response with potent polyphenol protection for vascular endothelial lining.'
        }
      },
      // Keto Option 2
      {
        foodPreference: 'Keto',
        optionNumber: 2,
        swapOptionName: 'Keto 90% Dark Chocolate Pecan Bark with Sea Salt',
        calories: 185,
        protein: 5,
        carbs: 3,
        fat: 18,
        fiber: 4,
        glycemicIndex: 'Low',
        preparationTip: 'Melt 90% chocolate with coconut oil and monk fruit, fold in toasted pecans, and freeze into crisp bark.',
        clinicalReason: 'Pecans have the lowest net carbohydrates among nuts (1g net carb per serving), ideal for ketogenic protocols.',
        dietaryTags: ['Keto Protocol', 'High Healthy Fats', 'Pecan Rich', 'Under 3g Total Carbs'],
        keyIngredients: ['90% Dark Chocolate', 'Toasted Pecans', 'Cold-Pressed Coconut Oil', 'Flaky Sea Salt'],
        recipe: {
          recipeName: 'Keto Dark Chocolate & Toasted Pecan Bark',
          servings: '2 bark shards',
          prepTimeMinutes: 5,
          cookTimeMinutes: 0,
          ingredients: [
            { item: '90% dark chocolate (chopped)', amount: '25g' },
            { item: 'Toasted pecan halves (coarsely chopped)', amount: '20g' },
            { item: 'Virgin coconut oil', amount: '1/2 tsp' },
            { item: 'Monk fruit sweetener', amount: '1/2 tsp' },
            { item: 'Flaky Maldon sea salt', amount: 'a pinch' }
          ],
          steps: [
            'Melt chocolate and coconut oil in a microwave bowl in 15-second intervals.',
            'Stir in monk fruit sweetener and half the chopped pecans.',
            'Pour chocolate onto parchment paper and spread into a thin layer.',
            'Top with remaining pecans and sea salt. Freeze for 15 minutes until snap-crisp, then break into shards.'
          ],
          optionalSubstitutions: ['Can use walnuts or macadamia nuts'],
          chefTip: 'Toasting the pecans in a dry pan for 2 minutes brings out natural buttery oils.',
          clinicalBenefit: 'Healthy fats stabilize cell membranes while keeping blood ketone levels high.'
        }
      },

      // Gluten-Free Option 1
      {
        foodPreference: 'Gluten-Free',
        optionNumber: 1,
        swapOptionName: 'Gluten-Free Sprouted Oat & Dark Cacao Skillet Brownie',
        calories: 195,
        protein: 16,
        carbs: 22,
        fat: 6,
        fiber: 6,
        glycemicIndex: 'Low',
        preparationTip: 'Blend certified GF sprouted rolled oats with raw cacao, Greek yogurt, and chocolate protein. Bake for 12 minutes.',
        clinicalReason: 'Celiac safe with oat beta-glucan soluble fiber to trap dietary cholesterol and maintain even glucose curve.',
        dietaryTags: ['Gluten-Free', 'Celiac Safe', 'Oat Beta-Glucan', 'High Protein 16g'],
        keyIngredients: ['Certified GF Oat Flour', 'Raw Cacao Powder', 'Greek Yogurt', 'Chocolate Protein', 'Almond Milk'],
        recipe: {
          recipeName: 'Gluten-Free Sprouted Oat & Cacao Skillet Brownie',
          servings: '1 brownie cake',
          prepTimeMinutes: 5,
          cookTimeMinutes: 12,
          ingredients: [
            { item: 'Certified gluten-free oat flour', amount: '30g' },
            { item: 'Raw dark cacao powder', amount: '1.5 tbsp (12g)' },
            { item: 'Chocolate protein powder (or extra oat flour)', amount: '15g' },
            { item: 'Baking powder', amount: '1/4 tsp' },
            { item: 'Unsweetened almond milk', amount: '70ml' },
            { item: '85% dark chocolate chips', amount: '10g' }
          ],
          steps: [
            'In a small bowl, whisk oat flour, cacao powder, protein powder, baking powder, and pinch of salt.',
            'Stir in almond milk until smooth batter forms. Fold in dark chocolate chips.',
            'Pour into a mini greased skillet or ramekin and bake at 180°C (350°F) for 12 minutes.',
            'Serve warm with a gooey chocolate center.'
          ],
          optionalSubstitutions: ['Can use almond flour instead of oat flour for a grain-free brownie'],
          chefTip: 'Make sure the oats are certified gluten-free to avoid agricultural cross-contamination with wheat.',
          clinicalBenefit: 'Beta-glucans reduce post-meal insulin demand by 40%.'
        }
      },
      // Gluten-Free Option 2
      {
        foodPreference: 'Gluten-Free',
        optionNumber: 2,
        swapOptionName: 'Dark Chocolate Chia & Almond Butter Mousse Cup',
        calories: 175,
        protein: 8,
        carbs: 12,
        fat: 11,
        fiber: 7,
        glycemicIndex: 'Low',
        preparationTip: 'Whisk ground chia seeds with cocoa, almond butter, and almond milk. Chill into a thick mousse.',
        clinicalReason: '100% grain-free and gluten-free; delivers magnesium, calcium, and plant omega-3s.',
        dietaryTags: ['Gluten-Free', 'Grain-Free', 'High Fiber 7g', 'Omega-3 ALA'],
        keyIngredients: ['Ground Chia Seeds', 'Dark Cocoa Powder', 'Almond Butter', 'Almond Milk'],
        recipe: {
          recipeName: 'Grain-Free Dark Chocolate Chia Mousse',
          servings: '1 dessert cup',
          prepTimeMinutes: 5,
          cookTimeMinutes: 0,
          ingredients: [
            { item: 'Finely ground chia seed powder', amount: '2 tbsp (20g)' },
            { item: 'Dark cocoa powder', amount: '1.5 tbsp (12g)' },
            { item: 'Creamy almond butter', amount: '1 tbsp (16g)' },
            { item: 'Warm almond milk', amount: '120ml' },
            { item: 'Monk fruit sweetener & vanilla', amount: 'to taste + 1/2 tsp' }
          ],
          steps: [
            'Whisk cocoa powder and almond butter with warm almond milk until smooth.',
            'Add ground chia seeds, vanilla, and sweetener. Whisk vigorously for 1 minute.',
            'Refrigerate for 20 minutes until set into a thick chocolate mousse.',
            'Top with sliced strawberries and enjoy.'
          ],
          optionalSubstitutions: ['Can use peanut butter or cashew butter'],
          chefTip: 'Grinding the chia seeds in a spice grinder creates a silky mousse with no seed texture.',
          clinicalBenefit: 'Eliminates all gut-irritating gluten proteins while satisfying chocolate cravings.'
        }
      }
    ]
  },

  // =========================================================================
  // 4. CRISPY, CRUNCHY & SALTY SNACKS (Chips, Wafers, Namkeen, Nachos)
  // =========================================================================
  {
    category: 'Crispy, Crunchy & Salty Snacks',
    identifiedCraving: 'Commercial Deep-Fried Potato Chips / Salted Wafers / Namkeen',
    keywords: [
      'crunchy', 'crispy', 'chips', 'wafers', 'potato chips', 'namkeen', 'salty',
      'salty snack', 'kurkure', 'popcorn', 'nachos', 'something crunchy', 'crisps',
      'salted chips', 'fried chips'
    ],
    originalDish: {
      name: 'Commercial Deep-Fried Potato Wafers & Salted Namkeen (1 large bag 100g)',
      calories: 540,
      protein: 6,
      carbs: 62,
      fat: 32,
      fiber: 2.5,
      glycemicIndex: 'High',
      drawbacks: 'Deep-fried in reused palm oil at high temperatures producing toxic acrolein and oxidized fats, paired with refined high sodium triggering water retention and blood pressure spikes.'
    },
    swaps: [
      // Vegetarian Option 1
      {
        foodPreference: 'Vegetarian',
        optionNumber: 1,
        swapOptionName: 'Air-Fried Crispy Spiced Makhana (Foxnuts) with Turmeric & Himalayan Salt',
        calories: 140,
        protein: 6,
        carbs: 22,
        fat: 3,
        fiber: 5,
        glycemicIndex: 'Low',
        preparationTip: 'Toss organic phool makhana with 1/2 tsp cold-pressed olive oil, turmeric, chaat masala, and Himalayan pink salt. Air fry 5 mins at 160°C.',
        clinicalReason: 'Supplies superior crunch with 74% fewer calories and high potassium to flush excess sodium water retention.',
        dietaryTags: ['Vegetarian', 'Air-Fried', 'Under 150 Calories', 'High Potassium'],
        keyIngredients: ['Phool Makhana (Foxnuts)', 'Cold-Pressed Olive Oil', 'Turmeric', 'Chaat Masala', 'Himalayan Pink Salt'],
        recipe: {
          recipeName: 'Air-Fried Golden Turmeric Makhana Crisps',
          servings: '1 generous snack bowl (approx. 40g)',
          prepTimeMinutes: 2,
          cookTimeMinutes: 5,
          ingredients: [
            { item: 'Phool makhana (foxnuts)', amount: '35g' },
            { item: 'Cold-pressed extra virgin olive oil', amount: '1/2 tsp (2.5ml)' },
            { item: 'Turmeric powder', amount: '1/4 tsp', notes: 'Curcumin anti-inflammatory' },
            { item: 'Chaat masala & roasted cumin powder', amount: '1/2 tsp combined' },
            { item: 'Himalayan pink salt', amount: '1/4 tsp' }
          ],
          steps: [
            'Place makhana in a bowl, spray or toss with 1/2 tsp olive oil to coat evenly.',
            'Sprinkle turmeric, chaat masala, cumin, and pink salt. Toss thoroughly.',
            'Transfer to air fryer basket at 160°C (320°F) for 5 minutes (or roast in a dry pan on low flame for 6 minutes).',
            'Let cool 2 minutes to reach maximum shatter-crisp crunch.'
          ],
          optionalSubstitutions: ['Can season with peri-peri, black pepper, or nutritional yeast for a cheesy flavor'],
          chefTip: 'Makhana crisps up further as it cools down, so let it sit for 2 minutes after roasting.',
          clinicalBenefit: 'Delivers bioavailable magnesium and anti-inflammatory curcumin while cutting 400 kcal.'
        }
      },
      // Vegetarian Option 2
      {
        foodPreference: 'Vegetarian',
        optionNumber: 2,
        swapOptionName: 'Air-Fried Roasted Crunchy Spiced Chickpeas (Chana Crisps)',
        calories: 180,
        protein: 11,
        carbs: 26,
        fat: 4,
        fiber: 8,
        glycemicIndex: 'Low',
        preparationTip: 'Dry boiled kabuli chana thoroughly, toss with smoked paprika and garlic powder, and roast at 200°C for 15 mins.',
        clinicalReason: 'Supplies 11g plant protein and 8g prebiotic fiber to nourish Akkermansia muciniphila gut bacteria.',
        dietaryTags: ['Vegetarian', 'High Protein 11g', 'Prebiotic Rich', 'High Fiber 8g'],
        keyIngredients: ['Cooked Chickpeas (Kabuli Chana)', 'Smoked Paprika', 'Garlic Powder', 'Olive Oil', 'Sea Salt'],
        recipe: {
          recipeName: 'Smoked Paprika & Garlic Roasted Chickpea Crunch',
          servings: '1 snack cup',
          prepTimeMinutes: 5,
          cookTimeMinutes: 15,
          ingredients: [
            { item: 'Cooked chickpeas (rinsed & thoroughly dried)', amount: '120g' },
            { item: 'Extra virgin olive oil', amount: '1 tsp (5ml)' },
            { item: 'Smoked paprika', amount: '1/2 tsp' },
            { item: 'Garlic powder & onion powder', amount: '1/4 tsp each' },
            { item: 'Sea salt & cracked black pepper', amount: '1/4 tsp each' }
          ],
          steps: [
            'Dry chickpeas thoroughly with paper towels (removing excess moisture is critical for crispiness).',
            'Toss with olive oil, smoked paprika, garlic powder, onion powder, and sea salt.',
            'Spread in a single layer in the air fryer at 200°C (400°F) for 14-16 minutes, shaking halfway.',
            'Cool for 5 minutes until crunchy.'
          ],
          optionalSubstitutions: ['Can use edamame beans or green peas instead of chickpeas'],
          chefTip: 'Roll chickpeas in a clean kitchen towel to remove loose skins before baking for extra crunch.',
          clinicalBenefit: '8g fiber stabilizes postprandial glucose and provides lasting fullness.'
        }
      },

      // Non-Vegetarian Option 1
      {
        foodPreference: 'Non-Vegetarian',
        optionNumber: 1,
        swapOptionName: 'Crispy Baked Herb & Parmesan Chicken Skin / Breast Crisps',
        calories: 190,
        protein: 28,
        carbs: 2,
        fat: 8,
        fiber: 1,
        glycemicIndex: 'Low',
        preparationTip: 'Slice chicken breast paper-thin, season with rosemary, garlic, and parmesan; bake between parchment until snap-crisp.',
        clinicalReason: 'Eliminates all refined carbohydrates while delivering 28g complete protein to support muscle protein synthesis.',
        dietaryTags: ['Non-Vegetarian', 'Zero Carb', 'Ultra High Protein 28g', 'Keto Aligned'],
        keyIngredients: ['Paper-Thin Chicken Breast Slivers', 'Aged Parmesan', 'Rosemary & Garlic', 'Sea Salt'],
        recipe: {
          recipeName: 'Crispy Parmesan & Rosemary Chicken Jerky Crisps',
          servings: '1 snack plate',
          prepTimeMinutes: 8,
          cookTimeMinutes: 18,
          ingredients: [
            { item: 'Lean chicken breast (shaved paper-thin)', amount: '120g' },
            { item: 'Finely grated parmesan cheese', amount: '1 tbsp (10g)' },
            { item: 'Garlic powder & dried rosemary', amount: '1/2 tsp each' },
            { item: 'Coarse sea salt & black pepper', amount: '1/4 tsp' }
          ],
          steps: [
            'Place chicken breast in freezer for 20 minutes to firm, then slice paper-thin across the grain.',
            'Pound slices between parchment paper until 1-2mm thin.',
            'Dust both sides with garlic powder, rosemary, salt, and finely grated parmesan.',
            'Bake on parchment at 160°C (320°F) for 18-20 minutes until dehydrated and golden crisp.'
          ],
          optionalSubstitutions: ['Can use lean turkey breast slices'],
          chefTip: 'Freezing the chicken for 20 minutes makes paper-thin slicing easy and safe.',
          clinicalBenefit: '28g protein provides prolonged satiety with zero glycemic surge.'
        }
      },
      // Non-Vegetarian Option 2
      {
        foodPreference: 'Non-Vegetarian',
        optionNumber: 2,
        swapOptionName: 'Baked Wild Salmon & Nori Seaweed Crisps with Sesame',
        calories: 175,
        protein: 20,
        carbs: 3,
        fat: 9,
        fiber: 2,
        glycemicIndex: 'Low',
        preparationTip: 'Brush nori seaweed sheets with egg white, layer wild salmon flakes and sesame seeds; bake crisp.',
        clinicalReason: 'Supplies marine iodine, selenium, and 1,200mg EPA/DHA omega-3 fatty acids for thyroid and cognitive support.',
        dietaryTags: ['Non-Vegetarian', 'Iodine Rich', 'Omega-3 EPA/DHA', 'Thyroid Support'],
        keyIngredients: ['Roasted Nori Seaweed Sheets', 'Wild Salmon Flakes', 'Toasted Sesame Seeds', 'Sea Salt'],
        recipe: {
          recipeName: 'Baked Nori & Wild Salmon Crunch Snaps',
          servings: '1 bowl',
          prepTimeMinutes: 5,
          cookTimeMinutes: 8,
          ingredients: [
            { item: 'Roasted nori seaweed sheets', amount: '3 sheets (cut into squares)' },
            { item: 'Flaked cooked wild salmon', amount: '60g' },
            { item: 'Egg white (for brushing)', amount: '1 unit' },
            { item: 'Toasted white & black sesame seeds', amount: '1 tbsp' },
            { item: 'Sea salt & shichimi togarashi (chili spice)', amount: 'pinch' }
          ],
          steps: [
            'Lay nori squares on a baking sheet, brush lightly with egg white.',
            'Press salmon flakes and sesame seeds firmly onto the nori.',
            'Bake at 170°C (340°F) for 7-8 minutes until crisp and brittle.',
            'Dust with sea salt and serve.'
          ],
          optionalSubstitutions: ['Can use tuna flakes or shrimp paste'],
          chefTip: 'Nori seaweed is one of the richest dietary sources of iodine for thyroid metabolism.',
          clinicalBenefit: 'Provides essential iodine for T3/T4 thyroid hormone production.'
        }
      },

      // Vegan Option 1
      {
        foodPreference: 'Vegan',
        optionNumber: 1,
        swapOptionName: 'Crispy Baked Spiced Kale & Nutritional Yeast Cheesy Chips',
        calories: 110,
        protein: 7,
        carbs: 11,
        fat: 4,
        fiber: 6,
        glycemicIndex: 'Low',
        preparationTip: 'Massage curly kale with olive oil, nutritional yeast, garlic powder, and sea salt. Bake at 140°C for 12 mins until paper-crisp.',
        clinicalReason: 'Packed with sulforaphane, lutein, and vitamin K1 with under 120 calories for an entire large bowl.',
        dietaryTags: ['Vegan', 'Under 120 Calories', 'Cheesy Umami', 'Vitamin K1 Rich'],
        keyIngredients: ['Organic Curly Kale', 'Fortified Nutritional Yeast', 'Extra Virgin Olive Oil', 'Garlic Powder', 'Sea Salt'],
        recipe: {
          recipeName: 'Cheesy Nutritional Yeast & Garlic Kale Chips',
          servings: '1 giant bowl',
          prepTimeMinutes: 6,
          cookTimeMinutes: 12,
          ingredients: [
            { item: 'Fresh curly kale (stems removed, torn into pieces)', amount: '100g' },
            { item: 'Extra virgin olive oil', amount: '1 tsp (5ml)' },
            { item: 'Fortified nutritional yeast', amount: '2 tbsp (15g)', notes: 'Cheesy flavor & B12' },
            { item: 'Garlic powder & smoked sea salt', amount: '1/2 tsp each' }
          ],
          steps: [
            'Wash kale and spin in a salad spinner until completely bone-dry.',
            'In a large bowl, massage kale leaves with olive oil for 1 minute until tender.',
            'Toss with nutritional yeast, garlic powder, and sea salt.',
            'Spread onto baking sheet in a single layer (do not overlap). Bake at 140°C (285°F) for 12-14 minutes until crisp.',
            'Let cool 2 minutes on the tray to crisp up fully.'
          ],
          optionalSubstitutions: ['Can use collard greens or swiss chard'],
          chefTip: 'Bake at low heat (140°C) so the kale crisps up without scorching the delicate green leaves.',
          clinicalBenefit: 'High in lutein and zeaxanthin for retinal health and cellular protection.'
        }
      },
      // Vegan Option 2
      {
        foodPreference: 'Vegan',
        optionNumber: 2,
        swapOptionName: 'Air-Fried Seasoned Edamame (Soybean) Protein Crunch',
        calories: 160,
        protein: 16,
        carbs: 10,
        fat: 6,
        fiber: 7,
        glycemicIndex: 'Low',
        preparationTip: 'Toss thawed green edamame beans with sesame oil, garlic, and sea salt. Air fry at 190°C for 10 mins.',
        clinicalReason: 'Supplies 16g complete plant protein containing all 9 essential amino acids and isoflavones.',
        dietaryTags: ['Vegan', 'Complete Protein 16g', 'Air-Fried', 'High Fiber 7g'],
        keyIngredients: ['Shelled Green Edamame', 'Toasted Sesame Oil', 'Garlic Sea Salt', 'Cracked Pepper'],
        recipe: {
          recipeName: 'Air-Fried Garlic & Sesame Edamame Crunch',
          servings: '1 snack cup',
          prepTimeMinutes: 3,
          cookTimeMinutes: 10,
          ingredients: [
            { item: 'Shelled green edamame beans (thawed & dried)', amount: '130g' },
            { item: 'Toasted sesame oil', amount: '1/2 tsp' },
            { item: 'Garlic powder & sea salt', amount: '1/2 tsp each' },
            { item: 'Toasted sesame seeds', amount: '1 tsp' }
          ],
          steps: [
            'Pat edamame dry with a kitchen towel.',
            'Toss with sesame oil, garlic powder, and sea salt in a bowl.',
            'Air fry at 190°C (375°F) for 10-12 minutes, shaking basket every 3 minutes until crunchy and blistered.',
            'Toss with toasted sesame seeds and serve.'
          ],
          optionalSubstitutions: ['Can season with wasabi powder for spicy wasabi edamame'],
          chefTip: 'Edamame shrinks as it crisps, locking in a nutty, crunchy bite.',
          clinicalBenefit: '16g complete plant protein curbs late-night snacking desire.'
        }
      },

      // Jain Option 1
      {
        foodPreference: 'Jain',
        optionNumber: 1,
        swapOptionName: 'Jain Spiced Air-Fried Makhana with Cumin & Himalayan Salt (No Root Spices)',
        calories: 140,
        protein: 6,
        carbs: 22,
        fat: 3,
        fiber: 5,
        glycemicIndex: 'Low',
        preparationTip: 'Roast makhana in 1/2 tsp A2 ghee with roasted cumin powder, black pepper, and rock salt.',
        clinicalReason: '100% Jain compliant, low glycemic index, and rich in natural antioxidants.',
        dietaryTags: ['Jain Safe', 'Root-Free', 'No Onion No Garlic', 'Low Calorie'],
        keyIngredients: ['Phool Makhana', 'A2 Cow Ghee', 'Roasted Cumin (Jeera)', 'Black Pepper', 'Sendha Namak'],
        recipe: {
          recipeName: 'Jain Roasted Jeera-Kali Mirch Makhana',
          servings: '1 bowl',
          prepTimeMinutes: 2,
          cookTimeMinutes: 5,
          ingredients: [
            { item: 'Phool makhana', amount: '35g' },
            { item: 'A2 cow ghee', amount: '1/2 tsp' },
            { item: 'Freshly roasted cumin powder (bhuna jeera)', amount: '1/2 tsp' },
            { item: 'Freshly ground black pepper', amount: '1/4 tsp' },
            { item: 'Sendha namak (rock salt)', amount: '1/4 tsp' }
          ],
          steps: [
            'Heat ghee in a heavy-bottomed kadai or skillet on low heat.',
            'Add phool makhana and roast on low flame for 5 minutes, stirring continuously until crisp.',
            'Sprinkle roasted cumin, black pepper, and sendha namak. Toss well to coat.',
            'Turn off the heat and let cool 2 minutes before eating.'
          ],
          optionalSubstitutions: ['Can add dried mint leaf powder for pudina makhana'],
          chefTip: 'Roasting cumin seeds in a dry pan before grinding gives an intoxicating smoky aroma without alliums.',
          clinicalBenefit: 'Cumin aids digestion while fox nuts provide gentle, sustained carbohydrates.'
        }
      },
      // Jain Option 2
      {
        foodPreference: 'Jain',
        optionNumber: 2,
        swapOptionName: 'Jain Crisp Raw Banana (Kacha Kela) Air-Fried Wafers with Sendha Namak',
        calories: 165,
        protein: 3,
        carbs: 28,
        fat: 5,
        fiber: 6,
        glycemicIndex: 'Low',
        preparationTip: 'Slice raw green banana paper-thin, toss in 1 tsp olive oil and rock salt, air fry at 180°C for 10 mins.',
        clinicalReason: 'Non-root resistant starch snack satisfying traditional banana wafer cravings with 70% less oil.',
        dietaryTags: ['Jain Safe', 'Non-Root', 'Resistant Starch', 'Air-Fried (Low Oil)'],
        keyIngredients: ['Green Raw Banana (Kacha Kela)', 'Olive Oil', 'Sendha Namak', 'Black Pepper'],
        recipe: {
          recipeName: 'Air-Fried Jain Raw Banana Wafers',
          servings: '1 snack portion',
          prepTimeMinutes: 5,
          cookTimeMinutes: 10,
          ingredients: [
            { item: 'Green raw plantain (peeled)', amount: '1 medium (100g)' },
            { item: 'Cold-pressed oil', amount: '1 tsp (5ml)' },
            { item: 'Sendha namak (rock salt)', amount: '1/2 tsp' },
            { item: 'Black pepper powder', amount: '1/4 tsp' }
          ],
          steps: [
            'Using a mandoline slicer, slice raw banana directly into ice-cold water to prevent browning.',
            'Drain and pat thoroughly dry between kitchen towels.',
            'Toss with 1 tsp oil, sendha namak, and black pepper.',
            'Spread in air fryer at 180°C (350°F) for 9-11 minutes, shaking halfway until golden and crispy.'
          ],
          optionalSubstitutions: ['Can bake on a parchment sheet in the oven at 190°C for 14 minutes'],
          chefTip: 'Ice water bath removes surface starch, making the baked wafers extra crisp.',
          clinicalBenefit: 'Resistant starch feeds beneficial gut flora without spiking blood sugar.'
        }
      },

      // Keto Option 1
      {
        foodPreference: 'Keto',
        optionNumber: 1,
        swapOptionName: 'Keto Baked Cheddar & Parmesan Herb Crisp Crackers',
        calories: 175,
        protein: 14,
        carbs: 2,
        fat: 13,
        fiber: 1,
        glycemicIndex: 'Low',
        preparationTip: 'Bake small mounds of aged cheddar and parmesan with jalapeno slices or herbs until lace-crisp.',
        clinicalReason: 'Zero carbohydrate density (under 1g net carb), rich in calcium and fat for instant ketosis support.',
        dietaryTags: ['Keto Protocol', 'Zero Carb', 'Lace Crisps', 'High Calcium'],
        keyIngredients: ['Aged Sharp Cheddar', 'Parmigiano Reggiano', 'Jalapeno Slices', 'Oregano'],
        recipe: {
          recipeName: 'Keto Artisan Cheddar & Jalapeno Lace Crisps',
          servings: '6 crunchy crisps',
          prepTimeMinutes: 3,
          cookTimeMinutes: 7,
          ingredients: [
            { item: 'Grated sharp cheddar cheese', amount: '35g' },
            { item: 'Grated Parmigiano Reggiano', amount: '20g' },
            { item: 'Pickled or fresh jalapeno slices (thin)', amount: '6 slices' },
            { item: 'Dried oregano and smoked paprika', amount: 'pinch' }
          ],
          steps: [
            'Line a baking sheet with parchment paper.',
            'Drop 6 small mounds of mixed cheese onto the sheet, spacing 2 inches apart.',
            'Press a thin jalapeno slice on top of each mound and dust with oregano.',
            'Bake at 190°C (375°F) for 6-8 minutes until edges are golden brown and bubbly.',
            'Cool for 3 minutes until completely rigid and snappy.'
          ],
          optionalSubstitutions: ['Can use gouda or provolone cheese'],
          chefTip: 'Letting them cool completely on the parchment makes them shatter-crisp like commercial chips.',
          clinicalBenefit: 'Pure protein and healthy fat with zero net carbs to preserve fat adaptation.'
        }
      },
      // Keto Option 2
      {
        foodPreference: 'Keto',
        optionNumber: 2,
        swapOptionName: 'Keto Spiced Roasted Pumpkin & Sunflower Seed Crunch',
        calories: 165,
        protein: 8,
        carbs: 4,
        fat: 14,
        fiber: 3,
        glycemicIndex: 'Low',
        preparationTip: 'Toss raw pepitas (pumpkin seeds) and sunflower seeds with avocado oil, smoked sea salt, and paprika. Roast at 170°C.',
        clinicalReason: 'Supplies high zinc, magnesium, and plant phytosterols with under 2g net carbs.',
        dietaryTags: ['Keto Protocol', 'Zinc Rich 4mg', 'Phytosterols', 'Low Net Carb (2g)'],
        keyIngredients: ['Raw Pepitas (Pumpkin Seeds)', 'Sunflower Seeds', 'Avocado Oil', 'Smoked Sea Salt'],
        recipe: {
          recipeName: 'Toasted Keto Pepita & Sunflower Seed Crunch',
          servings: '1 snack portion (35g)',
          prepTimeMinutes: 2,
          cookTimeMinutes: 8,
          ingredients: [
            { item: 'Raw pumpkin seeds (pepitas)', amount: '20g' },
            { item: 'Raw sunflower seeds', amount: '15g' },
            { item: 'Avocado oil', amount: '1/2 tsp' },
            { item: 'Smoked paprika & garlic sea salt', amount: '1/2 tsp' }
          ],
          steps: [
            'Toss seeds with avocado oil and spices in a small bowl.',
            'Spread in a single layer in a skillet over medium-low heat (or oven at 170°C).',
            'Roast for 6-8 minutes, stirring frequently until seeds pop and turn golden brown.',
            'Cool and store in an airtight container.'
          ],
          optionalSubstitutions: ['Can add hemp seeds or chia seeds after roasting'],
          chefTip: 'Pumpkin seeds provide bioavailable zinc, crucial for immune defense and hormone synthesis.',
          clinicalBenefit: 'High magnesium and zinc support testosterone/estrogen hormonal equilibrium.'
        }
      },

      // Gluten-Free Option 1
      {
        foodPreference: 'Gluten-Free',
        optionNumber: 1,
        swapOptionName: 'Sprouted Moong & Flaxseed Roasted Papad Crunch',
        calories: 130,
        protein: 8,
        carbs: 18,
        fat: 3,
        fiber: 6,
        glycemicIndex: 'Low',
        preparationTip: 'Roast sprouted moong dal papad dry over flame, brush with a drop of olive oil, and top with chopped cucumbers and chaat masala.',
        clinicalReason: '100% gluten-free high-protein pulse snack with zero deep frying or rancid trans fats.',
        dietaryTags: ['Gluten-Free', 'Celiac Safe', 'Under 140 Calories', 'High Protein 8g'],
        keyIngredients: ['Moong Dal Papad', 'Flaxseed Meal', 'Cucumber & Tomato Salsa', 'Chaat Masala'],
        recipe: {
          recipeName: 'Roasted Moong Dal Masala Papad Crisp',
          servings: '1 large roasted papad',
          prepTimeMinutes: 5,
          cookTimeMinutes: 2,
          ingredients: [
            { item: 'Certified GF moong dal papad', amount: '1 large unit' },
            { item: 'Finely chopped cucumber, tomato, green chili', amount: '40g' },
            { item: 'Chaat masala & lemon juice', amount: '1/2 tsp + 1 tsp' },
            { item: 'Fresh coriander leaves', amount: '1 tbsp' }
          ],
          steps: [
            'Roast the papad on a dry skillet or over an open gas flame using tongs for 45 seconds until blistered and crisp.',
            'Toss chopped cucumbers, tomatoes, green chili, lemon juice, and chaat masala in a small bowl.',
            'Spread the fresh salad evenly over the hot crispy papad and serve immediately.'
          ],
          optionalSubstitutions: ['Can use urad dal papad or ragi papad'],
          chefTip: 'Always add the salad topping right before eating so the papad stays crackling crisp.',
          clinicalBenefit: 'Sprouted mung protein and raw vegetable enzymes aid gastric motility.'
        }
      },
      // Gluten-Free Option 2
      {
        foodPreference: 'Gluten-Free',
        optionNumber: 2,
        swapOptionName: 'Air-Fried Sweet Potato & Beetroot Sea Salt Kettle Chips',
        calories: 150,
        protein: 3,
        carbs: 26,
        fat: 4,
        fiber: 5,
        glycemicIndex: 'Low',
        preparationTip: 'Slice orange sweet potato and ruby beetroot paper-thin, toss with olive oil and rosemary, and air fry crisp.',
        clinicalReason: 'Betalain pigments from beetroot support nitric oxide vasodilation, paired with carotenoids from sweet potato.',
        dietaryTags: ['Gluten-Free', 'Nitric Oxide Boosting', 'Celiac Safe', 'Antioxidant Rich'],
        keyIngredients: ['Ruby Beetroot', 'Orange Sweet Potato', 'Extra Virgin Olive Oil', 'Crushed Rosemary', 'Sea Salt'],
        recipe: {
          recipeName: 'Air-Fried Sweet Potato & Beetroot Kettle Chips',
          servings: '1 bowl',
          prepTimeMinutes: 6,
          cookTimeMinutes: 12,
          ingredients: [
            { item: 'Orange sweet potato (sliced paper-thin)', amount: '60g' },
            { item: 'Fresh beetroot (sliced paper-thin)', amount: '60g' },
            { item: 'Olive oil', amount: '1 tsp' },
            { item: 'Dried rosemary & sea salt', amount: '1/2 tsp' }
          ],
          steps: [
            'Soak vegetable slices in cold water for 10 minutes, then dry thoroughly on kitchen towels.',
            'Toss with olive oil, crushed rosemary, and sea salt.',
            'Air fry at 160°C (320°F) for 12-14 minutes, shaking every 3 minutes until dehydrated and crispy.',
            'Cool for 3 minutes before serving.'
          ],
          optionalSubstitutions: ['Can add parsnip or lotus root slices'],
          chefTip: 'Beetroot chips crisp faster than sweet potatoes, so keep an eye on them during the last 3 minutes.',
          clinicalBenefit: 'Betalains and dietary nitrates improve microvascular blood flow.'
        }
      }
    ]
  }
];

// =========================================================================
// NATURAL LANGUAGE CRAVING DETECTOR & MULTI-PREFERENCE FALLBACK ENGINE
// =========================================================================

export function parseNaturalLanguageCraving(query: string): {
  matchedEntry: CravingKnowledgeEntry | null;
  detectedCravingTerm: string;
  category: string;
  isUnderstood: boolean;
} {
  const clean = (query || '').toLowerCase().trim();
  if (!clean || clean.length < 2) {
    return {
      matchedEntry: null,
      detectedCravingTerm: '',
      category: '',
      isUnderstood: false
    };
  }

  // 1. Direct keyword search across knowledge base
  for (const entry of CRAVING_KNOWLEDGE_BASE) {
    for (const kw of entry.keywords) {
      if (clean.includes(kw.toLowerCase()) || kw.toLowerCase().includes(clean)) {
        return {
          matchedEntry: entry,
          detectedCravingTerm: entry.identifiedCraving,
          category: entry.category,
          isUnderstood: true
        };
      }
    }
  }

  // 2. Secondary heuristic intent matching (sweet, crunchy, salty, cheesy, chocolate, spicy, dessert, etc.)
  if (clean.match(/\b(sweet|sugar|dessert|halwa|kheer|gulab|jalebi|cake|pastry|ice cream|kulfi|pudding|mithai)\b/i)) {
    const entry = CRAVING_KNOWLEDGE_BASE.find(e => e.category.includes('Sweets')) || CRAVING_KNOWLEDGE_BASE[1];
    return {
      matchedEntry: entry,
      detectedCravingTerm: 'Sweet / Dessert Craving',
      category: entry.category,
      isUnderstood: true
    };
  }

  if (clean.match(/\b(chocolate|cocoa|brownie|fudge|choc|nutella|lava cake|dark chocolate)\b/i)) {
    const entry = CRAVING_KNOWLEDGE_BASE.find(e => e.category.includes('Chocolate')) || CRAVING_KNOWLEDGE_BASE[2];
    return {
      matchedEntry: entry,
      detectedCravingTerm: 'Chocolate / Cocoa Craving',
      category: entry.category,
      isUnderstood: true
    };
  }

  if (clean.match(/\b(crunchy|crispy|chips|wafers|namkeen|salty|nachos|kurkure|popcorn|crackers|fry|fried)\b/i)) {
    const entry = CRAVING_KNOWLEDGE_BASE.find(e => e.category.includes('Crispy')) || CRAVING_KNOWLEDGE_BASE[3];
    return {
      matchedEntry: entry,
      detectedCravingTerm: 'Crunchy / Salty Snack Craving',
      category: entry.category,
      isUnderstood: true
    };
  }

  if (clean.match(/\b(pizza|cheesy|cheese|crust|margherita|italian|garlic bread|slice)\b/i)) {
    const entry = CRAVING_KNOWLEDGE_BASE.find(e => e.category.includes('Pizza')) || CRAVING_KNOWLEDGE_BASE[0];
    return {
      matchedEntry: entry,
      detectedCravingTerm: 'Pizza & Cheesy Comfort Craving',
      category: entry.category,
      isUnderstood: true
    };
  }

  // If input contains at least 3 alphanumeric characters but no direct category match,
  // we synthesize custom swaps for the user's specific craving term.
  if (clean.replace(/[^a-z0-9]/gi, '').length >= 3) {
    return {
      matchedEntry: null,
      detectedCravingTerm: query.trim(),
      category: 'Smart Food Swaps',
      isUnderstood: true
    };
  }

  return {
    matchedEntry: null,
    detectedCravingTerm: '',
    category: '',
    isUnderstood: false
  };
}

// Generate at least 2 complete recipe swaps for each applicable food preference
export function generateHeuristicFoodSwapsForAllPreferences(
  cravingQuery: string,
  _patientFoodPreference?: string
): {
  craving: string;
  category: string;
  originalDish: any;
  swaps: FoodSwapSuggestion[];
  isUnderstood: boolean;
  message?: string;
} {
  const { matchedEntry, detectedCravingTerm, category, isUnderstood } = parseNaturalLanguageCraving(cravingQuery);

  if (!isUnderstood) {
    return {
      craving: cravingQuery,
      category: 'Unrecognized Craving',
      originalDish: null,
      swaps: [],
      isUnderstood: false,
      message: "I couldn't quite understand that craving. Try describing the food you're craving or the type of food you want (e.g., 'sweet chocolate dessert', 'crispy crunchy snack', 'spicy street food', 'warm cheesy pizza')."
    };
  }

  // If we matched a curated knowledge base entry with rich multi-option recipes:
  if (matchedEntry) {
    const formattedSwaps: FoodSwapSuggestion[] = matchedEntry.swaps.map((s, idx) => ({
      id: `swap-kb-${Date.now()}-${idx}`,
      cravingOrDish: matchedEntry.originalDish.name,
      swapOptionName: s.swapOptionName,
      clinicalSwap: s.swapOptionName,
      category: matchedEntry.category,
      foodPreference: s.foodPreference,
      originalCalories: matchedEntry.originalDish.calories,
      swapCalories: s.calories,
      calorieSaving: Math.max(0, matchedEntry.originalDish.calories - s.calories),
      originalGlycemic: matchedEntry.originalDish.glycemicIndex,
      swapGlycemic: s.glycemicIndex,
      swapProteinGrams: s.protein,
      swapFiberGrams: s.fiber,
      swapCarbsGrams: s.carbs,
      swapFatGrams: s.fat,
      prepTimeMinutes: s.recipe.prepTimeMinutes,
      cookTimeMinutes: s.recipe.cookTimeMinutes,
      servings: s.recipe.servings,
      originalMacros: {
        calories: matchedEntry.originalDish.calories,
        protein: matchedEntry.originalDish.protein,
        carbs: matchedEntry.originalDish.carbs,
        fat: matchedEntry.originalDish.fat,
        fiber: matchedEntry.originalDish.fiber,
        glycemicIndex: matchedEntry.originalDish.glycemicIndex
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
      instructions: s.recipe.steps.join(' '),
      clinicalReason: s.clinicalReason,
      clinicalRationale: s.clinicalReason,
      dietaryTags: s.dietaryTags,
      keyIngredients: s.keyIngredients,
      recipe: s.recipe,
      isAiGenerated: false
    }));

    return {
      craving: matchedEntry.identifiedCraving,
      category: matchedEntry.category,
      originalDish: matchedEntry.originalDish,
      swaps: formattedSwaps,
      isUnderstood: true
    };
  }

  // Generic dynamic multi-preference generator (providing at least 2 options per preference)
  const cleanTitle = detectedCravingTerm.charAt(0).toUpperCase() + detectedCravingTerm.slice(1);
  const baselineCal = 560;
  const baselineProt = 8;
  const baselineCarb = 68;
  const baselineFat = 28;

  const preferences: ('Vegetarian' | 'Jain' | 'Vegan' | 'Eggetarian' | 'Non-Vegetarian' | 'Keto' | 'Gluten-Free')[] = [
    'Vegetarian', 'Non-Vegetarian', 'Vegan', 'Jain', 'Eggetarian', 'Keto', 'Gluten-Free'
  ];

  const generatedSwaps: FoodSwapSuggestion[] = [];

  preferences.forEach((pref, pIdx) => {
    // Option 1: Quick Nutrient-Dense Swap
    const opt1Name = `High-Protein ${pref} ${cleanTitle} Swap with Fresh Herbs`;
    const opt1Recipe: SwapRecipe = {
      recipeName: `${pref} ${cleanTitle} Nutrient-Dense Preparation`,
      servings: '1 serving (approx 250g)',
      prepTimeMinutes: 8,
      cookTimeMinutes: 10,
      ingredients: [
        { item: pref === 'Non-Vegetarian' ? 'Lean chicken breast / wild fish' : pref === 'Vegan' ? 'Organic firm tofu / tempeh' : 'Fresh low-fat paneer / cottage cheese', amount: '120g' },
        { item: 'Steamed garden vegetables (zucchini, bell peppers, spinach)', amount: '100g' },
        { item: 'Cold-pressed extra virgin olive oil', amount: '1 tsp (5ml)' },
        { item: 'Herbs & spices (cumin, oregano, sea salt, turmeric)', amount: '1 tsp combined' }
      ],
      steps: [
        'Prepare and season protein source with spices and olive oil.',
        'Sauté or air-fry on medium heat for 7-8 minutes until golden and cooked through.',
        'Toss with steamed garden vegetables and fresh herbs.',
        'Serve hot with a squeeze of fresh lemon juice.'
      ],
      optionalSubstitutions: ['Can adjust spices according to taste'],
      chefTip: 'Cooking on medium-low preserves delicate micronutrients and prevents lipid peroxidation.',
      clinicalBenefit: 'Supplies high bioavailable protein and dietary fiber to keep postprandial glucose flat.'
    };

    generatedSwaps.push({
      id: `dyn-swap-${Date.now()}-${pIdx}-1`,
      cravingOrDish: `${cleanTitle} (Standard / Commercial Prep)`,
      swapOptionName: opt1Name,
      clinicalSwap: opt1Name,
      category: 'Smart Food Swaps',
      foodPreference: pref,
      originalCalories: baselineCal,
      swapCalories: 260,
      calorieSaving: 300,
      originalGlycemic: 'High',
      swapGlycemic: 'Low',
      swapProteinGrams: 24,
      swapFiberGrams: 7,
      swapCarbsGrams: 16,
      swapFatGrams: 9,
      prepTimeMinutes: 8,
      cookTimeMinutes: 10,
      servings: '1 serving',
      originalMacros: {
        calories: baselineCal,
        protein: baselineProt,
        carbs: baselineCarb,
        fat: baselineFat,
        fiber: 2,
        glycemicIndex: 'High'
      },
      swapMacros: {
        calories: 260,
        protein: 24,
        carbs: 16,
        fat: 9,
        fiber: 7,
        glycemicIndex: 'Low'
      },
      preparationTip: 'Use lean, unrefined whole-food protein combined with high-fiber vegetables.',
      instructions: opt1Recipe.steps.join(' '),
      clinicalReason: 'Supplies complete amino acids and soluble fiber, reducing glycemic load by over 60%.',
      clinicalRationale: 'Reduces glycemic load and prevents postprandial insulin surges.',
      dietaryTags: [pref, 'Low GI', 'High Protein 24g', 'Fiber Rich'],
      keyIngredients: ['Lean Whole Protein', 'Steamed Vegetables', 'Cold-Pressed Olive Oil'],
      recipe: opt1Recipe,
      isAiGenerated: false
    });

    // Option 2: Sprouted Grain & Herb Artisan Bowl
    const opt2Name = `Sprouted Ancient-Grain & Spiced ${pref} ${cleanTitle} Bowl`;
    const opt2Recipe: SwapRecipe = {
      recipeName: `Sprouted Grain & ${pref} ${cleanTitle} Artisan Bowl`,
      servings: '1 large bowl',
      prepTimeMinutes: 10,
      cookTimeMinutes: 12,
      ingredients: [
        { item: 'Sprouted quinoa / sprouted millets (ragi/jowar)', amount: '45g dry (cooked in broth)' },
        { item: pref === 'Non-Vegetarian' ? 'Poached egg or grilled turkey' : 'Edamame or hemp hearts', amount: '80g' },
        { item: 'Roasted cherry tomatoes and baby spinach', amount: '60g' },
        { item: 'Lemon-tahini or cold-pressed sesame dressing', amount: '1 tbsp' }
      ],
      steps: [
        'Cook sprouted grains in vegetable or bone broth until fluffy (10 mins).',
        'Layer cooked grains in a bowl, top with seasoned protein source.',
        'Add roasted cherry tomatoes and baby spinach.',
        'Drizzle with lemon-tahini dressing and garnish with pumpkin seeds.'
      ],
      optionalSubstitutions: ['Can use cauliflower rice for a keto-aligned version'],
      chefTip: 'Sprouted grains deactivate enzyme inhibitors, enhancing zinc and magnesium absorption.',
      clinicalBenefit: 'Lowers inflammatory cytokines and provides sustained, slow-burning mitochondrial energy.'
    };

    generatedSwaps.push({
      id: `dyn-swap-${Date.now()}-${pIdx}-2`,
      cravingOrDish: `${cleanTitle} (Standard / Commercial Prep)`,
      swapOptionName: opt2Name,
      clinicalSwap: opt2Name,
      category: 'Smart Food Swaps',
      foodPreference: pref,
      originalCalories: baselineCal,
      swapCalories: 280,
      calorieSaving: 280,
      originalGlycemic: 'High',
      swapGlycemic: 'Low',
      swapProteinGrams: 20,
      swapFiberGrams: 9,
      swapCarbsGrams: 24,
      swapFatGrams: 10,
      prepTimeMinutes: 10,
      cookTimeMinutes: 12,
      servings: '1 large bowl',
      originalMacros: {
        calories: baselineCal,
        protein: baselineProt,
        carbs: baselineCarb,
        fat: baselineFat,
        fiber: 2,
        glycemicIndex: 'High'
      },
      swapMacros: {
        calories: 280,
        protein: 20,
        carbs: 24,
        fat: 10,
        fiber: 9,
        glycemicIndex: 'Low'
      },
      preparationTip: 'Simmer sprouted ancient grains with fresh greens and heart-healthy dressings.',
      instructions: opt2Recipe.steps.join(' '),
      clinicalReason: 'Rich in dietary fiber and polyphenols, keeping post-meal blood sugar flat.',
      clinicalRationale: 'Slow release complex starches maintain steady GLP-1 satiety for hours.',
      dietaryTags: [pref, 'Sprouted Grains', 'Prebiotic Rich', 'High Fiber 9g'],
      keyIngredients: ['Sprouted Ancient Grains', 'Fresh Greens', 'Tahini / Olive Oil'],
      recipe: opt2Recipe,
      isAiGenerated: false
    });
  });

  return {
    craving: cleanTitle,
    category: 'Smart Food Swaps',
    originalDish: {
      name: `${cleanTitle} (Standard Commercial Prep)`,
      calories: baselineCal,
      protein: baselineProt,
      carbs: baselineCarb,
      fat: baselineFat,
      fiber: 2,
      glycemicIndex: 'High',
      drawbacks: 'High-glycemic simple carbohydrates paired with oxidized fats trigger rapid glucose spikes, insulin surges, and subsequent rebound hunger.'
    },
    swaps: generatedSwaps,
    isUnderstood: true
  };
}
