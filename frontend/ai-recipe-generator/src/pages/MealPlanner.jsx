import { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  Plus,
  X,
  ChefHat,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import { format, startOfWeek, addDays } from "date-fns";
import api from "../services/api";

const MEAL_TYPES = ["breakfast", "lunch", "dinner"];
const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAYS_FULL = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const MealPlanner = () => {
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date()));
  const [mealPlan, setMealPlan] = useState({});
  const [recipes, setRecipes] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipes();
  }, []);
  useEffect(() => {
    fetchMealPlan();
  }, [weekStart]);

  const fetchMealPlan = async () => {
    try {
      setLoading(true);
      const startDate = format(weekStart, "yyyy-MM-dd");
      const endDate = format(addDays(weekStart, 6), "yyyy-MM-dd");
      const response = await api.get(
        `/meal-plans/weekly?start_date=${startDate}&end_date=${endDate}`,
      );
      console.log("BACKEND RESPONSE:", response.data);
      const responseData = response.data?.data;
      const meals = Array.isArray(responseData)
        ? responseData
        : responseData?.mealPlans || response.data?.mealPlans || [];
      const organized = {};
      meals.forEach((meal) => {
        const dateKey = format(new Date(meal.meal_date), "yyyy-MM-dd");
        if (!organized[dateKey]) organized[dateKey] = {};
        organized[dateKey][meal.meal_type] = meal;
      });
      setMealPlan(organized);
    } catch (error) {
      toast.error("Failed to load meal plan");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipes = async () => {
    try {
      const response = await api.get("/recipes");
      setRecipes(response.data?.data?.recipes || []);
    } catch (error) {
      console.error("Failed to load recipes");
    }
  };

  const handleAddMeal = (date, mealType) => {
    setSelectedSlot({ date, mealType });
    setShowAddModal(true);
  };

  const handleRemoveMeal = async (mealId) => {
    if (!window.confirm("Remove this meal from your plan?")) return;
    try {
      await api.delete(`/meal-plans/${mealId}`);
      await fetchMealPlan();
      toast.success("Meal Removed");
    } catch (error) {
      toast.error("Failed to remove meal");
    }
  };

  const getDayMeals = (dayIndex) => {
    const date = format(addDays(weekStart, dayIndex), "yyyy-MM-dd");
    return mealPlan[date] || {};
  };

  const totalMealsPlanned = Object.values(mealPlan).reduce(
    (acc, day) => acc + Object.keys(day).length,
    0,
  );

  const today = format(new Date(), "yyyy-MM-dd");

  if (loading && Object.keys(mealPlan).length === 0) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Meal Planner
            </h1>
            <p className="text-gray-400 mt-1 text-sm">Plan your weekly meals</p>
          </div>
          {/* Week nav — desktop */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => setWeekStart(addDays(weekStart, -7))}
              className="flex items-center gap-1.5 px-3 py-2 border border-gray-700 text-gray-400 rounded-xl hover:bg-gray-700 text-sm font-medium transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <button
              onClick={() => setWeekStart(startOfWeek(new Date()))}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-colors"
            >
              This Week
            </button>
            <button
              onClick={() => setWeekStart(addDays(weekStart, 7))}
              className="flex items-center gap-1.5 px-3 py-2 border border-gray-700 text-gray-400 rounded-xl hover:bg-gray-700 text-sm font-medium transition-colors"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Week label + mobile nav */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 px-4 py-3 mb-4 flex items-center justify-between">
          <button
            onClick={() => setWeekStart(addDays(weekStart, -7))}
            className="sm:hidden p-1.5 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div className="text-center flex-1">
            <p className="text-xs text-gray-400">Week of</p>
            <p className="text-sm sm:text-base font-semibold text-white">
              {format(weekStart, "MMM d")} –{" "}
              {format(addDays(weekStart, 6), "MMM d, yyyy")}
            </p>
          </div>
          <button
            onClick={() => setWeekStart(addDays(weekStart, 7))}
            className="sm:hidden p-1.5 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* ── DESKTOP TABLE ── */}
        <div className="hidden md:block bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden mb-6">
          {/* Header row */}
          <div className="grid grid-cols-8 border-b border-gray-700/50 bg-gray-700/30">
            <div className="p-4 text-sm font-semibold text-gray-400 border-r border-gray-700/50">
              Meal
            </div>
            {DAYS_FULL.map((day, index) => {
              const dateStr = format(addDays(weekStart, index), "yyyy-MM-dd");
              const isToday = dateStr === today;
              return (
                <div
                  key={day}
                  className={`p-3 text-center border-r border-gray-700/50 last:border-r-0 ${isToday ? "bg-emerald-500/10" : ""}`}
                >
                  <div
                    className={`text-sm font-semibold ${isToday ? "text-emerald-400" : "text-gray-300"}`}
                  >
                    {day}
                  </div>
                  <div
                    className={`text-xs mt-0.5 ${isToday ? "text-emerald-500" : "text-gray-400"}`}
                  >
                    {format(addDays(weekStart, index), "MMM d")}
                    {isToday && <span className="ml-1">●</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Meal rows */}
          {MEAL_TYPES.map((mealType) => (
            <div
              key={mealType}
              className="grid grid-cols-8 border-b border-gray-700/50 last:border-b-0"
            >
              <div className="p-4 text-sm font-medium text-gray-400 capitalize border-r border-gray-700/50 bg-gray-700/30 flex items-center">
                {mealType}
              </div>
              {DAYS_FULL.map((_, dayIndex) => {
                const date = format(addDays(weekStart, dayIndex), "yyyy-MM-dd");
                const isToday = date === today;
                const meal = getDayMeals(dayIndex)[mealType];
                return (
                  <div
                    key={dayIndex}
                    className={`p-2 border-r border-gray-700/50 last:border-r-0 min-h-[72px] ${isToday ? "bg-emerald-500/5" : "hover:bg-gray-700"} transition-colors`}
                  >
                    {meal ? (
                      <div className="relative group h-full">
                        <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-2.5 h-full">
                          <p className="text-xs font-medium text-emerald-400 line-clamp-2 leading-snug">
                            {meal.recipe_name}
                          </p>
                          <button
                            onClick={() => handleRemoveMeal(meal.id)}
                            className="absolute top-1 right-1 p-1 bg-gray-900/80 rounded-lg shadow-sm text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddMeal(date, mealType)}
                        className="w-full h-full min-h-[56px] flex items-center justify-center text-gray-600 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-all border border-dashed border-transparent hover:border-emerald-500/30"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* ── MOBILE CARDS ── */}
        <div className="md:hidden space-y-3 mb-6">
          {DAYS_FULL.map((day, dayIndex) => {
            const date = format(addDays(weekStart, dayIndex), "yyyy-MM-dd");
            const isToday = date === today;
            const dayMeals = getDayMeals(dayIndex);
            return (
              <div
                key={day}
                className={`bg-gray-800 rounded-2xl border overflow-hidden ${isToday ? "border-emerald-500/40" : "border-gray-700"}`}
              >
                {/* Day header */}
                <div
                  className={`px-4 py-2.5 flex items-center justify-between ${isToday ? "bg-emerald-500/10" : "bg-gray-700/30"} border-b border-gray-700/50`}
                >
                  <span
                    className={`font-semibold text-sm ${isToday ? "text-emerald-400" : "text-gray-300"}`}
                  >
                    {day}{" "}
                    {isToday && <span className="text-emerald-500">●</span>}
                  </span>
                  <span className="text-xs text-gray-400">
                    {format(addDays(weekStart, dayIndex), "MMM d")}
                  </span>
                </div>
                {/* Meal slots */}
                <div className="divide-y divide-gray-700/50">
                  {MEAL_TYPES.map((mealType) => {
                    const meal = dayMeals[mealType];
                    return (
                      <div
                        key={mealType}
                        className="flex items-center gap-3 px-4 py-3"
                      >
                        <span className="text-xs text-gray-400 capitalize w-16 shrink-0">
                          {mealType}
                        </span>
                        {meal ? (
                          <div className="flex-1 flex items-center justify-between bg-emerald-500/20 border border-emerald-500/30 rounded-xl px-3 py-2">
                            <span className="text-xs font-medium text-emerald-400 line-clamp-1">
                              {meal.recipe_name}
                            </span>
                            <button
                              onClick={() => handleRemoveMeal(meal.id)}
                              className="ml-2 text-gray-400 hover:text-red-500 transition-colors shrink-0"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddMeal(date, mealType)}
                            className="flex-1 flex items-center justify-center gap-1.5 border border-dashed border-gray-700 rounded-xl py-2 text-gray-400 hover:text-emerald-500 hover:border-emerald-500/40 hover:bg-emerald-500/10 transition-all text-xs"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-gray-400">Meals planned</p>
            <p className="text-xl sm:text-2xl font-bold text-white mt-1">
              {totalMealsPlanned}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">of 21 slots</p>
          </div>
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-gray-400">Total recipes</p>
            <p className="text-xl sm:text-2xl font-bold text-white mt-1">
              {recipes.length}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">available to add</p>
          </div>
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-gray-400">This week</p>
            <p className="text-sm sm:text-base font-bold text-white mt-1">
              {format(weekStart, "MMM d")} –{" "}
              {format(addDays(weekStart, 6), "MMM d")}
            </p>
          </div>
        </div>
      </div>

      {showAddModal && selectedSlot && (
        <AddMealModal
          date={selectedSlot.date}
          mealType={selectedSlot.mealType}
          recipes={recipes}
          onClose={() => {
            setShowAddModal(false);
            setSelectedSlot(null);
          }}
          onSuccess={() => {
            fetchMealPlan();
            setShowAddModal(false);
            setSelectedSlot(null);
          }}
        />
      )}
    </div>
  );
};

const AddMealModal = ({ date, mealType, recipes, onClose, onSuccess }) => {
  const [selectedRecipe, setSelectedRecipe] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRecipe) {
      toast.error("Please select a recipe");
      return;
    }
    setLoading(true);
    try {
      await api.post("/meal-plans", {
        recipe_id: selectedRecipe,
        meal_date: date,
        meal_type: mealType,
      });
      toast.success("Meal added to plan");
      onSuccess();
    } catch (error) {
      toast.error("Failed to add meal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
      <div className="bg-gray-800 rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md p-6 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-white">Add Meal</h2>
            <p className="text-sm text-gray-400 capitalize mt-0.5">
              {format(new Date(date), "EEEE, MMM d")} · {mealType}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 min-h-0 gap-4"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search recipes..."
            className="w-full px-4 py-2.5 border border-gray-700 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-gray-800 outline-none text-sm transition-all"
          />

          <div className="overflow-y-auto flex-1 space-y-2 pr-1">
            {filteredRecipes.length > 0 ? (
              filteredRecipes.map((recipe) => (
                <label
                  key={recipe.id}
                  className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${
                    String(selectedRecipe) === String(recipe.id)
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-gray-700 hover:bg-gray-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="recipe"
                    value={recipe.id}
                    checked={String(selectedRecipe) === String(recipe.id)}
                    onChange={(e) => setSelectedRecipe(e.target.value)}
                    className="w-4 h-4 text-emerald-500 border-gray-600 bg-gray-700 focus:ring-emerald-500"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white text-sm truncate">
                      {recipe.name}
                    </p>
                    {recipe.cuisine_type && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {recipe.cuisine_type}
                      </p>
                    )}
                  </div>
                </label>
              ))
            ) : (
              <div className="text-center py-10">
                <ChefHat className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No recipes found</p>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-700 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedRecipe}
              className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? "Adding..." : "Add Meal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MealPlanner;
