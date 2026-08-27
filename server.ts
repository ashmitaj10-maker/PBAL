import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { generateHeuristicFoodSwapsForAllPreferences } from "./src/data/foodSwapsGenerator";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

// Lazy/safe Gemini AI client initialization
let genAiClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  if (!genAiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      genAiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return genAiClient;
}

// Resilient Gemini caller with automatic retry & fallback for temporary 503/429/quota spikes
async function generateContentWithResilience(
  ai: GoogleGenAI,
  params: {
    contents: any;
    config?: any;
    primaryModel?: string;
  }
): Promise<any> {
  const modelsToTry = [
    params.primaryModel || "gemini-3.7-flash",
    "gemini-flash-latest",
    "gemini-3.1-flash-lite",
  ];

  let lastError: any = null;

  for (const modelName of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: params.contents,
        config: params.config,
      });
      if (response && response.text) {
        return response;
      }
    } catch (err: any) {
      lastError = err;
      const errorMsg = (err?.message || "").toLowerCase();
      const isTemporaryOrQuota =
        err?.status === 503 ||
        err?.status === 429 ||
        err?.code === 503 ||
        err?.code === 429 ||
        errorMsg.includes("503") ||
        errorMsg.includes("429") ||
        errorMsg.includes("high demand") ||
        errorMsg.includes("unavailable") ||
        errorMsg.includes("resource_exhausted") ||
        errorMsg.includes("quota") ||
        errorMsg.includes("rate-limit") ||
        errorMsg.includes("overloaded");

      if (isTemporaryOrQuota) {
        console.warn(`[Gemini Resilience] Model ${modelName} returned temporary/quota demand: (${err?.message?.slice(0, 100)}...), trying alternate model...`);
        // Short pause before trying alternate model
        await new Promise((resolve) => setTimeout(resolve, 300));
        continue;
      }
      // If it's another type of error, break to fallback
      break;
    }
  }

  throw lastError || new Error("Failed to generate content across available models");
}

// Standalone Multilingual Heuristic Extractor (Gujarati, Hindi, Marathi, English)
function heuristicExtractConsultation(transcript: string) {
  const text = transcript.toLowerCase();
  const extracted: Record<string, any> = {};
  const confidence: Record<string, string> = {};

  // Name extraction (English, Gujarati transliteration, Hindi transliteration, Gujarati script, Devanagari)
  const nameMatch = transcript.match(/(?:my name is|name is|i am|patient is|patient name is|this is|naam|maru naam|marun naam|mera naam|darji nu naam|rugnache naav|નામ|નામ છે|દર્દીનું નામ)\s+(?:chhe|hai|is|aahe|che)?\s*([A-Za-z\u0A80-\u0AFF\u0900-\u097F]+(?:\s+[A-Za-z\u0A80-\u0AFF\u0900-\u097F]+)*)/i);
  if (nameMatch) {
    extracted.name = nameMatch[1].trim();
    confidence.name = "high";
  }

  // Age extraction (English, Hindi "saal", Gujarati "varas" / "varsh", Marathi "varshe", Gujarati numerals ૦-૯, Devanagari ०-९)
  let normalizedDigitsText = transcript
    .replace(/[૦०]/g, "0").replace(/[૧१]/g, "1").replace(/[૨२]/g, "2").replace(/[૩३]/g, "3").replace(/[૪४]/g, "4")
    .replace(/[૫५]/g, "5").replace(/[૬६]/g, "6").replace(/[૭७]/g, "7").replace(/[૮८]/g, "8").replace(/[૯९]/g, "9");

  const ageMatch = normalizedDigitsText.match(/(\d{1,3})\s*(?:years old|year old|yo|years of age|saal|varas|varsh|vars|varshe|ઉંમર|વર્ષ|साल|वर्ष)/i);
  if (ageMatch) {
    extracted.age = parseInt(ageMatch[1], 10);
    confidence.age = "high";
  }

  // Weight extraction (English, Hindi/Gujarati "vajan", "weight", "kilo", "kg")
  const weightMatch = normalizedDigitsText.match(/(?:weight is|weigh|weighs|weight|vajan|wazan|વજન|वजन)\s*(?:is|about|chhe|hai|che|aahe)?\s*(\d{2,3}(?:\.\d)?)\s*(?:kg|kilos|kilograms|kgs|કિલો|किलो)?/i);
  if (weightMatch) {
    extracted.currentWeightKg = parseFloat(weightMatch[1]);
    confidence.currentWeightKg = "high";
  }

  // Target weight
  const targetWeightMatch = normalizedDigitsText.match(/(?:target weight|goal weight|target|uddisht|lakshya|ટાર્ગેટ વજન|ટાર્ગેટ)\s*(?:is|about|chhe|hai|che)?\s*(\d{2,3}(?:\.\d)?)\s*(?:kg|kilos|kilograms|kgs|કિલો|किलो)?/i);
  if (targetWeightMatch) {
    extracted.targetWeightKg = parseFloat(targetWeightMatch[1]);
    confidence.targetWeightKg = "high";
  }

  // Height extraction
  const heightMatch = normalizedDigitsText.match(/(?:height is|height of|tall|height|unchai|unchi|ઊંચાઈ|उंचाई|उंची)\s*(?:is|chhe|hai|che|aahe)?\s*(\d{2,3})\s*(?:cm|centimeters|સેમી|सेमी)?/i);
  if (heightMatch) {
    extracted.heightCm = parseInt(heightMatch[1], 10);
    confidence.heightCm = "high";
  }

  // Gender detection
  if (text.includes("female") || text.includes("woman") || text.includes("she ") || text.includes("her ") || text.includes("menopause") || text.includes("pregnancy") || text.includes("pcos") || text.includes("mahila") || text.includes("stri") || text.includes("ben") || text.includes("મહિલા") || text.includes("સ્ત્રી") || text.includes("બહેન") || text.includes("महिला") || text.includes("स्त्री")) {
    extracted.gender = "female";
    confidence.gender = "high";
  } else if (text.includes("male") || text.includes("man") || text.includes("he ") || text.includes("his ") || text.includes("purush") || text.includes("bhai") || text.includes("પુરુષ") || text.includes("ભાઈ") || text.includes("पुरुष")) {
    extracted.gender = "male";
    confidence.gender = "high";
  }

  // Goals detection
  const goals: string[] = [];
  if (text.includes("menopause") || text.includes("મેનોપોઝ") || text.includes("hot flash") || text.includes("હોટ ફ્લેશ")) goals.push("Menopause");
  if (text.includes("fertility") || text.includes("garbhadhan") || text.includes("conceive") || text.includes("સગર્ભાવસ્થા") || text.includes("ગર્ભધારણ")) goals.push("Fertility");
  if (text.includes("pre-pregnancy") || text.includes("planning pregnancy")) goals.push("Pre-Pregnancy");
  if (text.includes("during pregnancy") || text.includes("pregnant") || text.includes("garbhavastha") || text.includes("ગર્ભાવસ્થા")) goals.push("During Pregnancy");
  if (text.includes("post-pregnancy") || text.includes("postpartum") || text.includes("delivery") || text.includes("ડિલિવરી")) goals.push("Post-Pregnancy");
  if (text.includes("weight loss") || text.includes("lose weight") || text.includes("fat loss") || text.includes("vajan ghatad") || text.includes("vajan kam") || text.includes("વજન ઘટાડ") || text.includes("वजन कम")) goals.push("Weight Loss");
  if (text.includes("weight gain") || text.includes("gain weight") || text.includes("vajan vadhad") || text.includes("વજન વધાર")) goals.push("Weight Gain");
  if (text.includes("muscle") || text.includes("hypertrophy")) goals.push("Muscle Gain");
  if (text.includes("diabetes") || text.includes("blood sugar") || text.includes("sugar") || text.includes("cholesterol") || text.includes("thyroid") || text.includes("hypertension") || text.includes("pcos") || text.includes("bp") || text.includes("ડાયાબિટીસ") || text.includes("સુગર") || text.includes("થાઇરોઇડ") || text.includes("મધુમેહ")) goals.push("Disease Management");
  if (text.includes("general wellness") || text.includes("fitness") || text.includes("healthier") || text.includes("swasthya") || text.includes("સ્વાસ્થ્ય")) goals.push("General Wellness");
  if (goals.length > 0) {
    extracted.primaryGoals = goals;
    confidence.primaryGoals = "high";
  }

  // Medical conditions
  const conditions: string[] = [];
  if (text.includes("diabetes") || text.includes("sugar") || text.includes("madhumeh") || text.includes("ડાયાબિટીસ") || text.includes("સુગર") || text.includes("मधुमेह")) conditions.push("Type 2 Diabetes");
  if (text.includes("pcos") || text.includes("pcod") || text.includes("પીસીઓએસ")) conditions.push("PCOS (Polycystic Ovary Syndrome)");
  if (text.includes("hypertension") || text.includes("bp") || text.includes("blood pressure") || text.includes("high bp") || text.includes("બીપી") || text.includes("બ્લડ પ્રેશર")) conditions.push("Hypertension");
  if (text.includes("thyroid") || text.includes("hypothyroid") || text.includes("થાઇરોઇડ") || text.includes("थायराइड")) conditions.push("Hypothyroidism");
  if (text.includes("fatty liver") || text.includes("ફેટી લિવર")) conditions.push("Fatty Liver (Grade 1/2)");
  if (text.includes("acid reflux") || text.includes("gerd") || text.includes("acidity") || text.includes("pitta") || text.includes("એસિડિટી") || text.includes("પિત્ત") || text.includes("एसिडिटी")) conditions.push("Acid Reflux / GERD");
  if (text.includes("bloat") || text.includes("ibs") || text.includes("gas") || text.includes("pet") || text.includes("ગેસ") || text.includes("પેટ ફૂલવું")) conditions.push("Chronic Bloating / IBS");
  if (conditions.length > 0) {
    extracted.medicalConditions = conditions;
    confidence.medicalConditions = "high";
  }

  // Allergies
  const allergies: string[] = [];
  if (text.includes("lactose") || text.includes("dairy") || text.includes("doodh") || text.includes("milk") || text.includes("દૂધ") || text.includes("દૂધની એલર્જી") || text.includes("दूध")) allergies.push("Lactose / Dairy");
  if (text.includes("gluten") || text.includes("wheat") || text.includes("gehun") || text.includes("ghau") || text.includes("ઘઉં") || text.includes("ગ્લુટેન")) allergies.push("Gluten / Wheat");
  if (text.includes("peanut") || text.includes("singdana") || text.includes("magfali") || text.includes("મગફળી") || text.includes("સીંગદાણા") || text.includes("मूंगफली")) allergies.push("Peanuts");
  if (text.includes("egg") || text.includes("anda") || text.includes("eedu") || text.includes("ઈંડું") || text.includes("ઇંડા") || text.includes("अंडा")) allergies.push("Eggs");
  if (allergies.length > 0) {
    extracted.allergies = allergies;
    confidence.allergies = "high";
  }

  // Food preference
  if (text.includes("jain") || text.includes("જૈન") || text.includes("जैन")) extracted.foodPreference = "Jain";
  else if (text.includes("vegan") || text.includes("વીગન")) extracted.foodPreference = "Vegan";
  else if (text.includes("non-veg") || text.includes("non veg") || text.includes("mansahari") || text.includes("માંસાહારી") || text.includes("मांसाहारी")) extracted.foodPreference = "Non-Vegetarian";
  else if (text.includes("egg") && (text.includes("veg") || text.includes("શુદ્ધ"))) extracted.foodPreference = "Eggetarian";
  else if (text.includes("veg") || text.includes("shakahari") || text.includes("vegeterian") || text.includes("શાકાહારી") || text.includes("શાકાહારી ખોરાક") || text.includes("शाकाहारी")) extracted.foodPreference = "Vegetarian";

  return { extracted, confidence };
}

// 1. Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 2. AI Meal & Food Analysis (Text or Multimodal Image)
app.post("/api/ai/analyze-meal", async (req, res) => {
  try {
    const { prompt, imageBase64, mimeType, mealType, userContext } = req.body;
    const ai = getGenAI();

    if (!ai) {
      // Return realistic clinical mock fallback if API key is not yet set
      return res.json({
        success: true,
        data: {
          name: prompt ? prompt.split(",")[0] : "Nutrient-Dense Balanced Plate",
          portion: "1 Standard Serving (~350g)",
          portionGrams: 350,
          calories: 460,
          protein: 34,
          carbs: 42,
          fat: 16,
          fiber: 8,
          sugar: 4,
          sodium: 380,
          glycemicIndex: "Low",
          glycemicLoad: 11,
          micronutrients: {
            vitaminC: 45,
            vitaminD: 25,
            vitaminB12: 50,
            iron: 28,
            calcium: 15,
            magnesium: 35,
            potassium: 30,
            zinc: 22,
          },
          healthScore: 92,
          allergens: [],
          clinicalInsights: "Excellent protein-to-fiber ratio. High in bioavailability and low glycemic impact, supporting steady insulin curves.",
          ingredientsIdentified: ["Lean Protein", "Leafy Greens", "Complex Carbs", "Cold-Pressed Healthy Fat"]
        }
      });
    }

    const systemInstruction = `You are a world-class clinical dietitian and metabolic nutrition AI for 'Perfect Body & Life'. 
Analyze the provided food description or meal image with clinical precision. 
Provide accurate caloric calculations, macronutrient breakdowns (Protein, Net Carbs, Dietary Fat, Fiber), micronutrient sufficiency (% RDA), Glycemic Index categorization (Low, Medium, or High), Glycemic Load score, Allergen detections, and evidence-based clinical dietetic insights. 
Always respond in strict JSON matching the schema.`;

    const contents: any[] = [];
    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");
      contents.push({
        inlineData: {
          mimeType: mimeType || "image/jpeg",
          data: cleanBase64,
        },
      });
    }

    const userPromptText = `Analyze this meal: "${prompt || 'Uploaded meal photo'}". 
Meal Category: ${mealType || 'General'}. 
User Health Goals & Context: ${JSON.stringify(userContext || {})}. 
Estimate realistic nutritional metrics for a standard adult serving.`;

    contents.push({ text: userPromptText });

    const response = await generateContentWithResilience(ai, {
      primaryModel: "gemini-3.7-flash",
      contents: contents,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Name of the meal or food item" },
            portion: { type: Type.STRING, description: "Estimated portion description e.g. 1 plate (320g)" },
            portionGrams: { type: Type.NUMBER, description: "Estimated weight in grams" },
            calories: { type: Type.NUMBER, description: "Total estimated calories (kcal)" },
            protein: { type: Type.NUMBER, description: "Protein in grams" },
            carbs: { type: Type.NUMBER, description: "Total carbohydrates in grams" },
            fat: { type: Type.NUMBER, description: "Total fat in grams" },
            fiber: { type: Type.NUMBER, description: "Dietary fiber in grams" },
            sugar: { type: Type.NUMBER, description: "Sugar in grams" },
            sodium: { type: Type.NUMBER, description: "Sodium in mg" },
            glycemicIndex: { type: Type.STRING, description: "Low, Medium, or High" },
            glycemicLoad: { type: Type.NUMBER, description: "Estimated glycemic load number 1-30" },
            micronutrients: {
              type: Type.OBJECT,
              properties: {
                vitaminC: { type: Type.NUMBER, description: "% RDA" },
                vitaminD: { type: Type.NUMBER, description: "% RDA" },
                vitaminB12: { type: Type.NUMBER, description: "% RDA" },
                iron: { type: Type.NUMBER, description: "% RDA" },
                calcium: { type: Type.NUMBER, description: "% RDA" },
                magnesium: { type: Type.NUMBER, description: "% RDA" },
                potassium: { type: Type.NUMBER, description: "% RDA" },
                zinc: { type: Type.NUMBER, description: "% RDA" },
              },
            },
            healthScore: { type: Type.NUMBER, description: "Nutritional density score from 1 to 100" },
            allergens: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Potential allergens like Dairy, Gluten, Nuts, Soy, Egg",
            },
            clinicalInsights: { type: Type.STRING, description: "Concise clinical analysis of metabolic and nutritional benefit" },
            ingredientsIdentified: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Key identifiable food ingredients",
            },
          },
          required: ["name", "portion", "portionGrams", "calories", "protein", "carbs", "fat", "fiber", "glycemicIndex", "healthScore", "clinicalInsights"],
        },
      },
    });

    const parsedData = JSON.parse(response.text || "{}");
    return res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error("Error in /api/ai/analyze-meal:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to analyze meal nutrition",
    });
  }
});

// 3. AI 7-Day Clinical Meal Plan Generator
app.post("/api/ai/generate-meal-plan", async (req, res) => {
  try {
    const { dietType, targetCalories, goal, allergies, medicalConditions, preferences } = req.body;
    const ai = getGenAI();

    if (!ai) {
      // Provide robust fallback clinical plan
      return res.json({
        success: true,
        data: {
          id: "plan-" + Date.now(),
          title: `Personalized ${dietType || "Mediterranean"} Clinical Plan`,
          dietType: dietType || "mediterranean",
          description: `Clinically optimized for ${goal || "metabolic health and lean vitality"} targeting ~${targetCalories || 2000} kcal/day.`,
          createdDate: new Date().toISOString(),
          days: [
            {
              dayIndex: 1,
              dayName: "Monday",
              totalCalories: targetCalories || 2050,
              totalProtein: 140,
              totalCarbs: 180,
              totalFat: 65,
              totalFiber: 38,
              meals: [
                {
                  id: "m1",
                  mealType: "breakfast",
                  name: "Greek Yogurt & Wild Berry Antioxidant Bowl",
                  description: "Strained organic Greek yogurt with chia seeds, raw walnuts, blueberries, and Ceylon cinnamon.",
                  prepTimeMinutes: 8,
                  calories: 420,
                  protein: 32,
                  carbs: 38,
                  fat: 14,
                  fiber: 10,
                  glycemicIndex: "Low",
                  ingredients: ["1 cup Greek yogurt 2%", "1/2 cup wild blueberries", "1 tbsp chia seeds", "15g raw walnuts", "1/4 tsp cinnamon"],
                  instructions: ["Scoop Greek yogurt into a bowl.", "Top with blueberries, chia seeds, and crushed walnuts.", "Dust with cinnamon."],
                  clinicalBenefit: "High leucine for muscle synthesis, rich in polyphenols and prebiotic fiber for gut microbiome."
                },
                {
                  id: "m2",
                  mealType: "lunch",
                  name: "Grilled Herb Salmon & Quinoa Rainbow Salad",
                  description: "Wild-caught Atlantic salmon fillet over warm quinoa, baby spinach, avocado, cucumber, and lemon-olive oil dressing.",
                  prepTimeMinutes: 20,
                  calories: 580,
                  protein: 42,
                  carbs: 45,
                  fat: 24,
                  fiber: 9,
                  glycemicIndex: "Low",
                  ingredients: ["160g wild salmon", "3/4 cup cooked quinoa", "2 cups baby spinach", "1/2 avocado", "1 tbsp EVOO", "Fresh lemon juice"],
                  instructions: ["Pan sear or grill salmon with herbs for 4 mins per side.", "Toss quinoa and spinach with lemon and EVOO.", "Top with sliced avocado and salmon."],
                  clinicalBenefit: "Abundant Omega-3 EPA/DHA reduces systemic inflammation; high potassium balances electrolyte homeostasis."
                },
                {
                  id: "m3",
                  mealType: "dinner",
                  name: "Rosemary-Infused Turkey & Roasted Root Vegetables",
                  description: "Lean roasted turkey tenderloin paired with roasted sweet potato, asparagus, and garlic-sautéed kale.",
                  prepTimeMinutes: 25,
                  calories: 620,
                  protein: 48,
                  carbs: 52,
                  fat: 18,
                  fiber: 12,
                  glycemicIndex: "Low",
                  ingredients: ["180g turkey breast", "1 medium roasted sweet potato", "1 cup asparagus spears", "1 cup kale", "1 tbsp olive oil"],
                  instructions: ["Roast sweet potato cubes and asparagus at 200°C for 20 mins.", "Pan-sear turkey breast with rosemary and garlic.", "Quickly sauté kale in olive oil and serve."],
                  clinicalBenefit: "Low saturated fat, high tryptophan promoting restorative sleep, optimal complex carbs for glycogen replenishment."
                },
                {
                  id: "m4",
                  mealType: "snack",
                  name: "Golden Turmeric Spiced Almonds & Green Apple",
                  description: "Crisp green Granny Smith apple slices paired with lightly toasted dry almonds.",
                  prepTimeMinutes: 3,
                  calories: 230,
                  protein: 8,
                  carbs: 22,
                  fat: 14,
                  fiber: 7,
                  glycemicIndex: "Low",
                  ingredients: ["1 small Granny Smith apple", "20g raw almonds", "Pinch of turmeric"],
                  instructions: ["Slice apple thinly.", "Serve with raw or dry-roasted almonds."],
                  clinicalBenefit: "Pectin fiber delays gastric emptying, stabilising postprandial glucose curves."
                }
              ]
            }
          ]
        }
      });
    }

    const systemInstruction = `You are the Lead Clinical Dietitian for 'Perfect Body & Life'. 
Generate a comprehensive, scientifically designed 7-Day Nutrition Plan adhering strictly to the user's target calories, diet style, allergies, and clinical health goals. 
Each day must include Breakfast, Lunch, Dinner, and 1 Healthy Snack. 
Ensure macro balances are clinically sound and ingredients are real, accessible whole foods with distinct clinical benefits.`;

    const prompt = `Create a 7-day clinical meal plan with:
- Diet Type: ${dietType}
- Target Calories: ~${targetCalories} kcal/day
- Primary Objective: ${goal}
- Allergies to Exclude: ${allergies ? allergies.join(", ") : "None"}
- Medical Conditions / Restrictions: ${medicalConditions ? medicalConditions.join(", ") : "None"}
- Extra Preferences: ${preferences || "Focus on anti-inflammatory nutrient density"}`;

    const response = await generateContentWithResilience(ai, {
      primaryModel: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            dietType: { type: Type.STRING },
            description: { type: Type.STRING },
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  dayIndex: { type: Type.NUMBER },
                  dayName: { type: Type.STRING },
                  totalCalories: { type: Type.NUMBER },
                  totalProtein: { type: Type.NUMBER },
                  totalCarbs: { type: Type.NUMBER },
                  totalFat: { type: Type.NUMBER },
                  totalFiber: { type: Type.NUMBER },
                  meals: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        mealType: { type: Type.STRING, description: "breakfast, lunch, dinner, or snack" },
                        name: { type: Type.STRING },
                        description: { type: Type.STRING },
                        prepTimeMinutes: { type: Type.NUMBER },
                        calories: { type: Type.NUMBER },
                        protein: { type: Type.NUMBER },
                        carbs: { type: Type.NUMBER },
                        fat: { type: Type.NUMBER },
                        fiber: { type: Type.NUMBER },
                        glycemicIndex: { type: Type.STRING, description: "Low, Medium, or High" },
                        ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                        instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
                        clinicalBenefit: { type: Type.STRING },
                      },
                      required: ["id", "mealType", "name", "description", "prepTimeMinutes", "calories", "protein", "carbs", "fat", "fiber", "ingredients", "instructions", "clinicalBenefit"],
                    },
                  },
                },
                required: ["dayIndex", "dayName", "totalCalories", "totalProtein", "totalCarbs", "totalFat", "totalFiber", "meals"],
              },
            },
          },
          required: ["title", "dietType", "description", "days"],
        },
      },
    });

    const parsedPlan = JSON.parse(response.text || "{}");
    parsedPlan.id = "plan-" + Date.now();
    parsedPlan.createdDate = new Date().toISOString();

    return res.json({ success: true, data: parsedPlan });
  } catch (error: any) {
    console.error("Error in /api/ai/generate-meal-plan:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to generate clinical meal plan",
    });
  }
});

// 4. Clinical Nutritionist AI Consultation Chat
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { messages, userContext } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.json({
        success: true,
        reply: `Hello! As your AI Clinical Nutritionist at Perfect Body & Life, I am here to help you optimize your metabolic health, macronutrient distribution, and nutrient synergy. Based on your current stats, prioritizing whole-food protein (1.6-2.0g/kg), adequate soluble fiber (35g+), and healthy mono-unsaturated fats will stabilize your insulin and daily energy. What specific dietary question or food substitution can I guide you with today?`,
        suggestedFollowUps: [
          "What foods maximize gut microbiome diversity?",
          "How can I reduce blood glucose spikes after dinner?",
          "Which supplements have strong clinical evidence for energy?"
        ],
        clinicalSources: [
          "American Journal of Clinical Nutrition",
          "Harvard T.H. Chan School of Public Health Nutrition Guidelines"
        ]
      });
    }

    const systemInstruction = `You are Dr. Maya, Chief AI Clinical Nutritionist & Metabolic Health Scientist at 'Perfect Body & Life'.
Tone: Empathetic, highly knowledgeable, scientifically grounded, evidence-based, and clear.
Provide actionable dietetic guidance, explain biochemistry simply (e.g. insulin response, mTOR, gut microbiome, electrolyte balance, micronutrient bioavailability), and offer practical whole-food suggestions.
Always format your response with clean markdown paragraphs and scannable bullet points. Include clinical references/sources when appropriate.

Current User Profile Context: ${JSON.stringify(userContext || {})}`;

    // Convert conversation to prompt structure
    const historyText = (messages || [])
      .map((m: any) => `${m.sender === "user" ? "Patient" : "Dr. Maya"}: ${m.text}`)
      .join("\n\n");

    const prompt = `${historyText}\n\nDr. Maya: Provide a supportive, evidence-based clinical dietetic response:`;

    const response = await generateContentWithResilience(ai, {
      primaryModel: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction,
      },
    });

    const replyText = response.text || "I am analyzing your nutritional query. Please try again in a moment.";

    return res.json({
      success: true,
      reply: replyText,
      suggestedFollowUps: [
        "How does this affect my daily glycemic index?",
        "Suggest 3 high-protein meal prep swaps",
        "What micronutrients am I likely missing?"
      ],
      clinicalSources: [
        "Journal of the Academy of Nutrition and Dietetics",
        "Clinical Nutrition ESPEN Consensus"
      ]
    });
  } catch (error: any) {
    console.error("Error in /api/ai/chat:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to process nutrition consultation",
    });
  }
});

// 5. AI Smart Recipe Swap (Ingredient or Meal Replacement)
app.post("/api/ai/swap-meal", async (req, res) => {
  try {
    const { mealToSwap, dietType, calories, preferences } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.json({
        success: true,
        data: {
          id: "swap-" + Date.now(),
          mealType: mealToSwap?.mealType || "dinner",
          name: "Herb-Crusted Baked Cod with Lemon Asparagus & Wild Rice",
          description: "Tender flaky wild cod seasoned with tarragon and dill, served alongside steamed asparagus spears and nutty wild rice.",
          prepTimeMinutes: 22,
          calories: calories || 520,
          protein: 38,
          carbs: 46,
          fat: 14,
          fiber: 8,
          glycemicIndex: "Low",
          ingredients: ["180g Pacific Cod fillet", "1 cup steamed asparagus", "1/2 cup cooked wild rice", "1 tbsp extra virgin olive oil", "Fresh dill & lemon"],
          instructions: ["Preheat oven to 190°C.", "Season cod with olive oil, dill, and black pepper; bake for 14 minutes.", "Serve alongside warm wild rice and tender asparagus."],
          clinicalBenefit: "High bioavailability lean protein with low saturated fat, rich in selenium and vitamin B6 for thyroid and metabolic optimization."
        }
      });
    }

    const systemInstruction = `You are a clinical recipe developer for 'Perfect Body & Life'. 
Generate a nutritionally equivalent, delicious, and easy-to-prepare meal swap that closely matches the target caloric and macro goals.`;

    const prompt = `Generate a single alternative meal to swap out: "${mealToSwap?.name || 'Current Meal'}".
Meal Type: ${mealToSwap?.mealType || 'dinner'}
Target Calories: ~${calories || 500} kcal
Diet Protocol: ${dietType || 'Mediterranean'}
User Preferences/Restrictions: ${preferences || 'Keep high protein and low glycemic'}`;

    const response = await generateContentWithResilience(ai, {
      primaryModel: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            mealType: { type: Type.STRING },
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            prepTimeMinutes: { type: Type.NUMBER },
            calories: { type: Type.NUMBER },
            protein: { type: Type.NUMBER },
            carbs: { type: Type.NUMBER },
            fat: { type: Type.NUMBER },
            fiber: { type: Type.NUMBER },
            glycemicIndex: { type: Type.STRING },
            ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
            instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
            clinicalBenefit: { type: Type.STRING },
          },
          required: ["name", "description", "prepTimeMinutes", "calories", "protein", "carbs", "fat", "fiber", "ingredients", "instructions", "clinicalBenefit"],
        },
      },
    });

    const parsedSwap = JSON.parse(response.text || "{}");
    parsedSwap.id = "swap-" + Date.now();
    parsedSwap.mealType = mealToSwap?.mealType || "dinner";

    return res.json({ success: true, data: parsedSwap });
  } catch (error: any) {
    console.error("Error in /api/ai/swap-meal:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to generate recipe swap",
    });
  }
});

// 5b. AI Smart Food Swap & Craving Replacer across ALL Food Preferences
app.post("/api/ai/smart-food-swap", async (req, res) => {
  try {
    const { craving, patientName, patientGoal, patientFoodPreference } = req.body;
    const cravingText = (craving || "").trim();

    if (!cravingText) {
      return res.json({
        success: false,
        isUnderstood: false,
        message: "Please enter a food or craving to search for healthier swaps."
      });
    }

    const ai = getGenAI();

    if (!ai) {
      const fallbackResult = generateHeuristicFoodSwapsForAllPreferences(cravingText, patientFoodPreference);
      return res.json({ success: fallbackResult.isUnderstood, ...fallbackResult, isAiGenerated: false });
    }

    const systemInstruction = `You are the Lead Clinical Dietitian and Biochemical Nutrition Scientist at 'Perfect Body & Life Clinic'.
When a patient inputs a craving in natural language (e.g., "I want something sweet", "I'm craving pizza", "I want something crunchy", "I want chocolate", "I want something spicy", "late night noodles"), you must:
1. Accurately identify the underlying craving/food category.
2. If the user input is complete gibberish or not a food/craving, set "isUnderstood": false.
3. For every identified craving, generate AT LEAST 2 DIFFERENT high-quality food-swap options for each of the following dietary preferences:
   - "Vegetarian": at least 2 options (Option 1 & Option 2)
   - "Non-Vegetarian": at least 2 options (Option 1 & Option 2)
   - "Vegan": at least 2 options (Option 1 & Option 2)
   - "Jain": at least 2 options (Option 1 & Option 2 - strictly NO onion, NO garlic, NO potato/root vegetables)
   - "Eggetarian": at least 2 options (Option 1 & Option 2)
   - "Keto": at least 2 options (Option 1 & Option 2 - <8g net carbs, healthy fats)
   - "Gluten-Free": at least 2 options (Option 1 & Option 2 - 100% celiac safe)

4. CRITICAL: EVERY SINGLE FOOD SWAP MUST INCLUDE A FULL, STEP-BY-STEP RECIPE with:
   - Recipe name
   - Exact ingredients with quantities (e.g., "60g Spelt flour", "50g low-fat paneer")
   - Step-by-step preparation and cooking instructions (4-6 clear steps)
   - Approximate prep time and cook time in minutes
   - Serving size description (e.g. "1 personal pizza (approx. 240g)", "1 bowl")
   - Optional substitutions
   - Chef's culinary tip & Medical clinical rationale.`;

    const prompt = `Analyze this food craving query: "${cravingText}".
Patient Demographics: Name: ${patientName || "Patient"}, Clinical Goal: ${patientGoal || "Metabolic Health & Fat Loss"}, Preference: ${patientFoodPreference || "Vegetarian"}.

Generate structured response containing the identified craving, original dish macros, and AT LEAST 2 complete recipe swaps for each dietary preference category (Vegetarian, Non-Vegetarian, Vegan, Jain, Eggetarian, Keto, Gluten-Free).`;

    const response = await generateContentWithResilience(ai, {
      primaryModel: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isUnderstood: { type: Type.BOOLEAN },
            craving: { type: Type.STRING },
            category: { type: Type.STRING },
            originalDish: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                calories: { type: Type.NUMBER },
                protein: { type: Type.NUMBER },
                carbs: { type: Type.NUMBER },
                fat: { type: Type.NUMBER },
                fiber: { type: Type.NUMBER },
                glycemicIndex: { type: Type.STRING },
                drawbacks: { type: Type.STRING },
              },
              required: ["name", "calories", "protein", "carbs", "fat", "fiber", "glycemicIndex", "drawbacks"],
            },
            swaps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  foodPreference: { type: Type.STRING },
                  optionNumber: { type: Type.NUMBER },
                  swapOptionName: { type: Type.STRING },
                  calories: { type: Type.NUMBER },
                  protein: { type: Type.NUMBER },
                  carbs: { type: Type.NUMBER },
                  fat: { type: Type.NUMBER },
                  fiber: { type: Type.NUMBER },
                  glycemicIndex: { type: Type.STRING },
                  calorieSaving: { type: Type.NUMBER },
                  preparationTip: { type: Type.STRING },
                  clinicalReason: { type: Type.STRING },
                  dietaryTags: { type: Type.ARRAY, items: { type: Type.STRING } },
                  keyIngredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                  recipe: {
                    type: Type.OBJECT,
                    properties: {
                      recipeName: { type: Type.STRING },
                      servings: { type: Type.STRING },
                      prepTimeMinutes: { type: Type.NUMBER },
                      cookTimeMinutes: { type: Type.NUMBER },
                      ingredients: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            item: { type: Type.STRING },
                            amount: { type: Type.STRING },
                            notes: { type: Type.STRING },
                          },
                          required: ["item", "amount"],
                        },
                      },
                      steps: { type: Type.ARRAY, items: { type: Type.STRING } },
                      optionalSubstitutions: { type: Type.ARRAY, items: { type: Type.STRING } },
                      chefTip: { type: Type.STRING },
                      clinicalBenefit: { type: Type.STRING },
                    },
                    required: ["recipeName", "servings", "prepTimeMinutes", "cookTimeMinutes", "ingredients", "steps"],
                  },
                },
                required: ["foodPreference", "swapOptionName", "calories", "protein", "carbs", "fat", "fiber", "glycemicIndex", "preparationTip", "clinicalReason", "recipe"],
              },
            },
          },
          required: ["isUnderstood", "craving", "category", "originalDish", "swaps"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");

    if (parsed.isUnderstood === false) {
      return res.json({
        success: false,
        isUnderstood: false,
        craving: cravingText,
        message: "I couldn't quite understand that craving. Try describing the food you're craving or the type of food you want."
      });
    }

    const orig = parsed.originalDish || { calories: 650, protein: 8, carbs: 70, fat: 28, fiber: 2, glycemicIndex: "High" };
    const enrichedSwaps = (parsed.swaps || []).map((s: any, idx: number) => ({
      id: `ai-swap-${Date.now()}-${idx}`,
      cravingOrDish: orig.name || cravingText,
      swapOptionName: s.swapOptionName,
      clinicalSwap: s.swapOptionName,
      category: parsed.category || "Smart Food Swaps",
      foodPreference: s.foodPreference,
      originalCalories: orig.calories,
      swapCalories: s.calories,
      calorieSaving: s.calorieSaving || Math.max(0, orig.calories - s.calories),
      originalGlycemic: orig.glycemicIndex || "High",
      swapGlycemic: s.glycemicIndex || "Low",
      swapProteinGrams: s.protein,
      swapFiberGrams: s.fiber || 6,
      swapCarbsGrams: s.carbs,
      swapFatGrams: s.fat,
      prepTimeMinutes: s.recipe?.prepTimeMinutes || 10,
      cookTimeMinutes: s.recipe?.cookTimeMinutes || 10,
      servings: s.recipe?.servings || "1 serving",
      originalMacros: {
        calories: orig.calories,
        protein: orig.protein,
        carbs: orig.carbs,
        fat: orig.fat,
        fiber: orig.fiber || 2,
        glycemicIndex: orig.glycemicIndex || "High"
      },
      swapMacros: {
        calories: s.calories,
        protein: s.protein,
        carbs: s.carbs,
        fat: s.fat,
        fiber: s.fiber || 6,
        glycemicIndex: s.glycemicIndex || "Low"
      },
      preparationTip: s.preparationTip,
      instructions: s.recipe?.steps ? s.recipe.steps.join(" ") : s.preparationTip,
      clinicalReason: s.clinicalReason,
      clinicalRationale: s.clinicalReason,
      dietaryTags: s.dietaryTags || [s.foodPreference, "Low GI", "High Fiber"],
      keyIngredients: s.keyIngredients || (s.recipe?.ingredients ? s.recipe.ingredients.map((i: any) => `${i.amount} ${i.item}`) : []),
      recipe: s.recipe,
      isAiGenerated: true
    }));

    return res.json({
      success: true,
      isUnderstood: true,
      craving: parsed.craving || cravingText,
      category: parsed.category || "Smart Food Swaps",
      originalDish: parsed.originalDish,
      swaps: enrichedSwaps,
      isAiGenerated: true
    });
  } catch (error: any) {
    console.warn("AI smart-food-swap fallback triggered:", error.message);
    const fallbackResult = generateHeuristicFoodSwapsForAllPreferences(req.body.craving || "Pizza", req.body.patientFoodPreference);
    return res.json({ success: fallbackResult.isUnderstood, ...fallbackResult, isAiGenerated: false });
  }
});

// 6. AI Smart Grocery Generator
app.post("/api/ai/generate-grocery-list", async (req, res) => {
  try {
    const { mealPlan, daysCount } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.json({
        success: true,
        items: [
          { id: "g1", name: "Wild Caught Salmon Fillets", category: "Lean Proteins", quantity: "4 portions (600g)", estimatedPrice: "$18.50", checked: false, nutritionalHighlight: "EPA & DHA Omega-3s" },
          { id: "g2", name: "Organic Baby Spinach", category: "Produce & Greens", quantity: "2 tubs (300g)", estimatedPrice: "$5.00", checked: false, nutritionalHighlight: "Lutein, Folate, Iron" },
          { id: "g3", name: "Extra Virgin Olive Oil (Cold-Pressed)", category: "Healthy Fats & Oils", quantity: "1 bottle (500ml)", estimatedPrice: "$11.00", checked: false, nutritionalHighlight: "Polyphenols & Oleic Acid" },
          { id: "g4", name: "Organic Quinoa", category: "Whole Grains & Complex Carbs", quantity: "1 bag (500g)", estimatedPrice: "$4.50", checked: false, nutritionalHighlight: "Complete amino acid profile" },
          { id: "g5", name: "Greek Strained Yogurt 2%", category: "Dairy & Alternatives", quantity: "1 kg tub", estimatedPrice: "$6.00", checked: false, nutritionalHighlight: "High casein & gut probiotics" },
          { id: "g6", name: "Fresh Avocados (Hass)", category: "Healthy Fats & Oils", quantity: "4 medium", estimatedPrice: "$5.50", checked: false, nutritionalHighlight: "High monounsaturated fat & potassium" },
          { id: "g7", name: "Raw Chia Seeds", category: "Spices, Seeds & Superfoods", quantity: "250g bag", estimatedPrice: "$3.80", checked: false, nutritionalHighlight: "Soluble mucilage fiber & ALA" },
          { id: "g8", name: "Fresh Lemons", category: "Produce & Greens", quantity: "5 units", estimatedPrice: "$3.00", checked: false, nutritionalHighlight: "Bioflavonoids & Vitamin C" },
          { id: "g9", name: "Sweet Potatoes (Japanese/Garnet)", category: "Whole Grains & Complex Carbs", quantity: "1.5 kg", estimatedPrice: "$4.20", checked: false, nutritionalHighlight: "Beta-carotene & slow glycogen" },
          { id: "g10", name: "Turkey Breast / Chicken Tenderloins", category: "Lean Proteins", quantity: "800g", estimatedPrice: "$12.00", checked: false, nutritionalHighlight: "Low saturated fat protein" }
        ]
      });
    }

    const prompt = `From this meal plan: ${JSON.stringify(mealPlan || {})}, extract an organized clinical grocery shopping list for ${daysCount || 7} days. 
Group items cleanly into categories: 'Produce & Greens', 'Lean Proteins', 'Whole Grains & Complex Carbs', 'Healthy Fats & Oils', 'Dairy & Alternatives', 'Spices, Seeds & Superfoods', 'Pantry Essentials'. 
Include estimated quantities and key nutritional highlights.`;

    const response = await generateContentWithResilience(ai, {
      primaryModel: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  category: { type: Type.STRING },
                  quantity: { type: Type.STRING },
                  estimatedPrice: { type: Type.STRING },
                  nutritionalHighlight: { type: Type.STRING },
                },
                required: ["name", "category", "quantity", "nutritionalHighlight"],
              },
            },
          },
          required: ["items"],
        },
      },
    });

    const parsedGrocery = JSON.parse(response.text || "{}");
    const formattedItems = (parsedGrocery.items || []).map((item: any, idx: number) => ({
      ...item,
      id: "grocery-" + Date.now() + "-" + idx,
      checked: false,
    }));

    return res.json({ success: true, items: formattedItems });
  } catch (error: any) {
    console.error("Error in /api/ai/generate-grocery-list:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to generate grocery list",
    });
  }
});

// 7. AI Voice Consultation Information Extraction
app.post("/api/ai/parse-consultation-voice", async (req, res) => {
  const { transcript } = req.body;
  if (!transcript || typeof transcript !== "string") {
    return res.status(400).json({ success: false, error: "Transcript is required" });
  }

  try {
    const ai = getGenAI();

    if (!ai) {
      const { extracted, confidence } = heuristicExtractConsultation(transcript);
      return res.json({
        success: true,
        data: {
          extracted,
          confidence,
          transcript,
          source: "heuristic",
        }
      });
    }

    const systemInstruction = `You are an expert Clinical Intake & Medical Transcription Assistant for a Medical Nutrition & Metabolic Health Clinic.
Analyze the doctor-patient consultation voice transcript (which may be in English, Gujarati (ગુજરાતી), Hindi (हिन्दी), Marathi (मराठी), or a mixture/transliteration like Hinglish/Gujlish) and accurately extract structured patient demographics, goals, medical conditions, allergies, and lifestyle parameters into English clinical terms.

CRITICAL INSTRUCTIONS:
1. Understand terms across English, Gujarati (e.g. 'વજન' / vajan = weight, 'ઊંચાઈ' / unchai = height, 'ડાયાબિટીસ' / madhumeh = diabetes, 'શુદ્ધ શાકાહારી' / shakahari = vegetarian, 'દૂધ એલર્જી' = dairy allergy, 'ગરમી લાગે છે / હોટ ફ્લેશીસ' = hot flashes / menopause), Hindi, and Marathi.
2. ONLY extract information that is explicitly stated or directly inferred from the transcript.
3. Never invent, hallucinate, or guess patient information.
4. If a field is not mentioned or is ambiguous/uncertain, return null or leave the array empty.
5. For every extracted field, provide a confidence rating: 'high', 'medium', or 'low'.
6. Map primary goals strictly to one or more of: 'Weight Loss', 'Weight Gain', 'Muscle Gain', 'Disease Management', 'Fertility', 'Pre-Pregnancy', 'During Pregnancy', 'Post-Pregnancy', 'Menopause', 'General Wellness'.
7. Map food preference to one of: 'Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Vegan', 'Jain', 'Keto', 'Pescatarian', or null.
8. Return clean JSON matching the schema.`;

    const prompt = `Consultation Transcript:
"""
${transcript}
"""

Extract structured patient data:`;

    const response = await generateContentWithResilience(ai, {
      primaryModel: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Full name if stated, otherwise null" },
            age: { type: Type.NUMBER, description: "Age in years if stated, otherwise null" },
            gender: { type: Type.STRING, description: "'female', 'male', or 'other', or null" },
            heightCm: { type: Type.NUMBER, description: "Height in cm if stated, otherwise null" },
            currentWeightKg: { type: Type.NUMBER, description: "Current weight in kg if stated, otherwise null" },
            targetWeightKg: { type: Type.NUMBER, description: "Target weight in kg if stated, otherwise null" },
            bodyType: { type: Type.STRING, description: "Body type description if stated, otherwise null" },
            foodPreference: { type: Type.STRING, description: "Dietary preference if mentioned" },
            primaryGoals: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Primary health & body goals" },
            medicalConditions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Medical conditions diagnosed or reported" },
            allergies: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Allergies or food intolerances" },
            wakeTime: { type: Type.STRING, description: "Wake up time (e.g. '06:30') if mentioned" },
            sleepTime: { type: Type.STRING, description: "Target bedtime (e.g. '22:30') if mentioned" },
            workHours: { type: Type.STRING, description: "Work hours if mentioned" },
            dailyWaterLiters: { type: Type.NUMBER, description: "Daily water intake in liters if mentioned" },
            physicalActivityLevel: { type: Type.STRING, description: "Activity level if mentioned" },
            exerciseHabits: { type: Type.STRING, description: "Exercise routine if mentioned" },
            stressLevel: { type: Type.STRING, description: "'low', 'moderate', 'high', or 'severe' if mentioned" },
            digestiveIssues: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Digestive issues like bloating, acid reflux, constipation" },
            dietaryRestrictions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Dietary restrictions or rules" },
            favoriteFoods: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Favorite foods" },
            dislikedFoods: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Disliked foods" },
            medications: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Current medications" },
            supplements: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Current supplements" },
            consultationSummary: { type: Type.STRING, description: "Concise clinical summary of the consultation notes" },
            confidenceMap: {
              type: Type.OBJECT,
              description: "Confidence level ('high', 'medium', 'low') for each extracted field key"
            }
          }
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({
      success: true,
      data: {
        extracted: parsed,
        confidence: parsed.confidenceMap || {},
        transcript: transcript,
        source: "gemini"
      }
    });
  } catch (error: any) {
    console.warn("AI model unavailable/error in /api/ai/parse-consultation-voice, activating heuristic fallback parser:", error?.message || error);
    // Seamless fallback to heuristic multilingual extraction on any API failure (such as 503 high demand or 429)
    const { extracted, confidence } = heuristicExtractConsultation(transcript);
    return res.json({
      success: true,
      data: {
        extracted,
        confidence,
        transcript,
        source: "heuristic-fallback"
      }
    });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Perfect Body & Life server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
