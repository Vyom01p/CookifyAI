import { useState, useEffect } from "react";
import {
  ChefHat,
  Sparkles,
  Plus,
  X,
  Clock,
  Users,
  RefreshCw,
  BookmarkPlus,
} from "lucide-react";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import api from "../services/api";

const CUISINES = [
  "Any",
  "Italian",
  "Mexican",
  "Indian",
  "Chinese",
  "Japanese",
  "Thai",
  "French",
  "Mediterranean",
  "American",
];
const DIETARY_OPTIONS = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Keto",
  "Paleo",
];
const COOKING_TIMES = [
  { value: "quick", label: "Quick (<30 min)" },
  { value: "medium", label: "Medium (30-60 min)" },
  { value: "long", label: "Long (>60 min)" },
];

const RecipeGenerator = () => {
  const [ingredients, setIngredients] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [usePantry, setUsePantry] = useState(false);
  const [cuisineType, setCuisineType] = useState("Any");
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
  const [servings, setServings] = useState(4);
  const [cookingTime, setCookingTime] = useState("medium");
  const [generating, setGenerating] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUserPreferences = async () => {
      try {
        const response = await api.get("/users/profile");
        const preferences = response.data.data.preferences;
        if (preferences) {
          if (preferences.dietaryRestrictions?.length > 0)
            setDietaryRestrictions(preferences.dietaryRestrictions);
          if (preferences.preferred_cuisines?.length > 0)
            setCuisineType(preferences.preferred_cuisines[0]);
          if (preferences.default_servings)
            setServings(preferences.default_servings);
        }
      } catch (error) {
        console.error("Failed load user preferences:", error);
      }
    };
    fetchUserPreferences();
  }, []);

  const addIngredient = () => {
    if (inputValue.trim() && !ingredients.includes(inputValue.trim())) {
      setIngredients([...ingredients, inputValue.trim()]);
      setInputValue("");
    }
  };

  const removeIngredient = (ingredient) =>
    setIngredients(ingredients.filter((i) => i !== ingredient));

  const toggleDietary = (option) => {
    setDietaryRestrictions(
      dietaryRestrictions.includes(option)
        ? dietaryRestrictions.filter((d) => d !== option)
        : [...dietaryRestrictions, option],
    );
  };

  const handleGenerate = async () => {
    if (!usePantry && ingredients.length === 0) {
      toast.error("Please add at least one ingredient or use pantry items");
      return;
    }
    setGenerating(true);
    setGeneratedRecipe(null);
    try {
      const response = await api.post("/recipes/generate", {
        ingredients,
        usePantryIngredients: usePantry,
        dietaryRestrictions,
        cuisineType: cuisineType === "Any" ? "any" : cuisineType,
        servings,
        cookingTime,
      });
      setGeneratedRecipe(response.data.data.recipe);
      toast.success("Recipe Generated Successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate recipe");
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveRecipe = async () => {
    if (!generatedRecipe) return;
    setSaving(true);
    try {
      await api.post("/recipes", {
        name: generatedRecipe.name,
        description: generatedRecipe.description,
        cuisine_type: generatedRecipe.cuisineType,
        difficulty: generatedRecipe.difficulty,
        prep_time: generatedRecipe.prepTime,
        cook_time: generatedRecipe.cookTime,
        servings: generatedRecipe.servings,
        instructions: generatedRecipe.instructions,
        dietary_tags: generatedRecipe.dietaryTags || [],
        ingredients: generatedRecipe.ingredients,
        nutrition: generatedRecipe.nutrition,
      });
      toast.success("Recipe saved to your collection!");
    } catch (error) {
      toast.error("Failed to save recipe");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition-all";

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Generate Recipe
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Let AI craft a recipe from your ingredients
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Left */}
          <div className="space-y-4">
            {/* Ingredients */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-4">
                <ChefHat className="w-4 h-4 text-emerald-400" />
                <h2 className="font-semibold text-white text-sm">
                  Ingredients
                </h2>
              </div>

              {/* Pantry toggle */}
              <label className="flex items-center justify-between gap-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl cursor-pointer mb-4">
                <span className="text-sm font-medium text-emerald-300">
                  Use ingredients from my pantry
                </span>
                <div
                  onClick={() => setUsePantry(!usePantry)}
                  className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${usePantry ? "bg-emerald-500" : "bg-gray-600"}`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${usePantry ? "left-6" : "left-1"}`}
                  />
                </div>
              </label>

              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addIngredient()}
                  placeholder="Add ingredient..."
                  className={`flex-1 ${inputClass}`}
                />
                <button
                  onClick={addIngredient}
                  className="w-10 h-10 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl flex items-center justify-center transition-colors shrink-0"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {ingredients.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {ingredients.map((ingredient, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-medium"
                    >
                      {ingredient}
                      <button
                        onClick={() => removeIngredient(ingredient)}
                        className="hover:text-red-400 transition-colors ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Preferences */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-4 sm:p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h2 className="font-semibold text-white text-sm">
                  Preferences
                </h2>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  Cuisine type
                </label>
                <select
                  value={cuisineType}
                  onChange={(e) => setCuisineType(e.target.value)}
                  className={inputClass}
                >
                  {CUISINES.map((c) => (
                    <option key={c} value={c}>
                      {c === "Any" ? "Any cuisine" : c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">
                  Dietary restrictions
                </label>
                <div className="flex flex-wrap gap-2">
                  {DIETARY_OPTIONS.map((option) => (
                    <button
                      key={option}
                      onClick={() => toggleDietary(option)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        dietaryRestrictions.includes(option)
                          ? "bg-emerald-500 text-white"
                          : "bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  Servings: {servings}
                </label>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={servings}
                  onChange={(e) => setServings(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>1</span>
                  <span>12</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">
                  Cooking time
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {COOKING_TIMES.map((time) => (
                    <button
                      key={time.value}
                      onClick={() => setCookingTime(time.value)}
                      className={`py-2 rounded-xl text-xs font-medium transition-colors ${
                        cookingTime === time.value
                          ? "bg-emerald-500 text-white"
                          : "bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white"
                      }`}
                    >
                      {time.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 active:scale-[0.98] text-white font-semibold py-3.5 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {generating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-400" /> Generate
                  recipe
                </>
              )}
            </button>
          </div>

          {/* Right */}
          <div>
            {generatedRecipe ? (
              <div className="bg-gray-800 rounded-2xl border border-gray-700 p-4 sm:p-5 space-y-5">
                <div>
                  <h2 className="text-xl font-bold text-white leading-snug">
                    {generatedRecipe.name}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {generatedRecipe.prepTime + generatedRecipe.cookTime} mins
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {generatedRecipe.servings} servings
                    </span>
                    {generatedRecipe.difficulty && (
                      <span className="capitalize px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full font-medium">
                        {generatedRecipe.difficulty}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                    {generatedRecipe.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {generatedRecipe.cuisineType && (
                    <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-medium">
                      {generatedRecipe.cuisineType}
                    </span>
                  )}
                  {generatedRecipe.dietaryTags?.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/20 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div>
                  <h3 className="font-semibold text-white text-sm mb-3">
                    Instructions
                  </h3>
                  <ol className="space-y-3">
                    {generatedRecipe.instructions?.map((step, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="shrink-0 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                          {index + 1}
                        </span>
                        <span className="text-sm text-gray-400 pt-0.5 leading-relaxed">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>

                {generatedRecipe.nutrition && (
                  <div>
                    <h3 className="font-semibold text-white text-sm mb-3">
                      Nutrition (per serving)
                    </h3>
                    <div className="grid grid-cols-5 gap-2">
                      {[
                        {
                          label: "Cal",
                          value: generatedRecipe.nutrition.calories,
                          unit: "",
                        },
                        {
                          label: "Protein",
                          value: generatedRecipe.nutrition.protein,
                          unit: "g",
                        },
                        {
                          label: "Carbs",
                          value: generatedRecipe.nutrition.carbs,
                          unit: "g",
                        },
                        {
                          label: "Fats",
                          value: generatedRecipe.nutrition.fats,
                          unit: "g",
                        },
                        {
                          label: "Fiber",
                          value: generatedRecipe.nutrition.fiber,
                          unit: "g",
                        },
                      ].map(({ label, value, unit }) => (
                        <div
                          key={label}
                          className="text-center p-2 bg-gray-700 rounded-xl"
                        >
                          <div className="text-sm font-bold text-white">
                            {value}
                            {unit}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {generatedRecipe.cookingTips?.length > 0 && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
                    <p className="text-xs font-semibold text-emerald-400 mb-1.5">
                      💡 Cooking Tips
                    </p>
                    <ul className="space-y-1">
                      {generatedRecipe.cookingTips.map((tip, index) => (
                        <li key={index} className="text-xs text-emerald-300/80">
                          • {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-3 pt-2 border-t border-gray-700">
                  <button
                    onClick={handleSaveRecipe}
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 text-white font-medium py-2.5 rounded-xl transition-colors disabled:opacity-50 text-sm active:scale-[0.98]"
                  >
                    <BookmarkPlus className="w-4 h-4" />
                    {saving ? "Saving..." : "Save recipe"}
                  </button>
                  <button
                    onClick={handleGenerate}
                    disabled={generating}
                    className="flex-1 flex items-center justify-center gap-2 border border-gray-600 text-gray-300 rounded-xl py-2.5 hover:bg-gray-700 font-medium transition-colors text-sm disabled:opacity-50"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Regenerate
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-2xl border border-gray-700 h-full min-h-[300px] flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                  <ChefHat className="w-8 h-8 text-gray-600" />
                </div>
                <p className="text-gray-500 text-sm">
                  Your generated recipe will appear here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeGenerator;
