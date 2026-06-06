import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  ChefHat,
  UtensilsCrossed,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import api from "../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRecipes: 0,
    pantryItems: 0,
    mealsThisWeek: 0,
  });
  const [recentRecipes, setRecentRecipes] = useState([]);
  const [upcomingMeals, setUpcomingMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [recipesRes, pantryRes, mealRes, recentRes, upcomingRes] =
        await Promise.all([
          api.get("/recipes/stats"),
          api.get("/pantry/stats"),
          api.get("/meal-plans/stats"),
          api.get("/recipes/recent?limit=5"),
          api.get("/meal-plans/upcoming?limit=5"),
        ]);
      setStats({
        totalRecipes: recipesRes.data.data.stats.total_recipes || 0,
        pantryItems: pantryRes.data.data.stats.total_items || 0,
        mealsThisWeek: mealRes.data.data.stats.this_week_count || 0,
      });
      setRecentRecipes(recentRes.data.data.recipes || []);
      setUpcomingMeals(upcomingRes.data.data.meals || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {greeting} 👋
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Here's what's cooking today
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
          <StatCard
            icon={<ChefHat className="w-5 h-5" />}
            label="Total Recipes"
            value={stats.totalRecipes}
            color="emerald"
          />
          <StatCard
            icon={<UtensilsCrossed className="w-5 h-5" />}
            label="Pantry Items"
            value={stats.pantryItems}
            color="amber"
          />
          <StatCard
            icon={<Calendar className="w-5 h-5" />}
            label="This Week"
            value={stats.mealsThisWeek}
            color="purple"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
          <Link
            to="/generate"
            className="bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] p-4 sm:p-5 rounded-2xl transition-all group flex items-center gap-4"
          >
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white text-sm sm:text-base">
                Generate a recipe
              </h3>
              <p className="text-emerald-100 text-xs mt-0.5">
                Let AI create from your pantry
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-white/60 shrink-0" />
          </Link>

          <Link
            to="/pantry"
            className="bg-gray-800 hover:bg-gray-750 border border-gray-700 active:scale-[0.98] p-4 sm:p-5 rounded-2xl transition-all group flex items-center gap-4"
          >
            <div className="w-10 h-10 bg-gray-700 rounded-xl flex items-center justify-center shrink-0">
              <UtensilsCrossed className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white text-sm sm:text-base">
                Manage pantry
              </h3>
              <p className="text-gray-400 text-xs mt-0.5">
                Add and track ingredients
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-600 shrink-0" />
          </Link>
        </div>

        {/* Recent + Upcoming */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Recent Recipes */}
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white text-sm sm:text-base">
                Recent Recipes
              </h2>
              <Link
                to="/recipes"
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
              >
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {recentRecipes.length > 0 ? (
              <div className="space-y-2">
                {recentRecipes.map((recipe) => (
                  <Link
                    key={recipe.id}
                    to={`/recipes/${recipe.id}`}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-700 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-gray-700 rounded-xl flex items-center justify-center shrink-0">
                      <ChefHat className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white truncate text-sm">
                        {recipe.name}
                      </h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {recipe.cook_time} mins
                      </p>
                    </div>
                    <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full shrink-0">
                      Easy
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                  <ChefHat className="w-6 h-6 text-gray-500" />
                </div>
                <p className="text-gray-500 text-sm">No recipes yet</p>
                <Link
                  to="/generate"
                  className="text-xs text-emerald-400 font-medium mt-1"
                >
                  Generate your first one →
                </Link>
              </div>
            )}
          </div>

          {/* Upcoming Meals */}
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white text-sm sm:text-base">
                Upcoming Meals
              </h2>
              <Link
                to="/meal-plan"
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
              >
                View calendar <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {upcomingMeals.length > 0 ? (
              <div className="space-y-2">
                {upcomingMeals.map((meal) => (
                  <div
                    key={meal.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-700"
                  >
                    <div className="w-10 h-10 bg-gray-700 rounded-xl flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white truncate text-sm">
                        {meal.recipe_name}
                      </h3>
                      <p className="text-xs text-gray-500 capitalize mt-0.5">
                        {meal.meal_type}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-gray-500" />
                </div>
                <p className="text-gray-500 text-sm">No meals planned yet</p>
                <Link
                  to="/meal-plan"
                  className="text-xs text-emerald-400 font-medium mt-1"
                >
                  Plan your week →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => {
  const colors = {
    emerald: "bg-emerald-500/20 text-emerald-400",
    amber: "bg-amber-500/20 text-amber-400",
    purple: "bg-purple-500/20 text-purple-400",
  };
  return (
    <div className="bg-gray-800 rounded-2xl border border-gray-700 p-3 sm:p-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${colors[color]}`}
        >
          {icon}
        </div>
        <div>
          <p className="text-xs text-gray-500 leading-tight">{label}</p>
          <p className="text-xl sm:text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
