import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Clock, ChefHat, Trash2, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import api from "../services/api";

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [loading, setLoading] = useState(true);

  const cuisines = [
    "All",
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
  const difficulties = ["All", "easy", "medium", "hard"];

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await api.get("/recipes");
      setRecipes(response.data.data.recipes);
    } catch (error) {
      toast.error("Failed to load recipes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = recipes;
    if (searchQuery)
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    if (selectedCuisine !== "All")
      filtered = filtered.filter((r) => r.cuisine_type === selectedCuisine);
    if (selectedDifficulty !== "All")
      filtered = filtered.filter((r) => r.difficulty === selectedDifficulty);
    setFilteredRecipes(filtered);
  }, [recipes, searchQuery, selectedCuisine, selectedDifficulty]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;
    try {
      await api.delete(`/recipes/${id}`);
      setRecipes(recipes.filter((r) => r.id !== id));
      toast.success("Recipe Deleted");
    } catch (error) {
      toast.error("Failed to delete Recipe");
    }
  };

  if (loading) {
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
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            My Recipes
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Your collection of saved recipes
          </p>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-4 mb-6 flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipes..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition-all"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
              className="flex-1 px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition-all"
            >
              {cuisines.map((c) => (
                <option key={c} value={c}>
                  {c === "All" ? "All Cuisines" : c}
                </option>
              ))}
            </select>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="flex-1 px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition-all"
            >
              {difficulties.map((d) => (
                <option key={d} value={d}>
                  {d === "All"
                    ? "All Difficulties"
                    : d.charAt(0).toUpperCase() + d.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="text-xs text-gray-600 mb-4">
          Showing {filteredRecipes.length} of {recipes.length} recipes
        </p>

        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-12 text-center">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <ChefHat className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-gray-500 text-sm mb-4">
              {recipes.length === 0
                ? "No recipes yet"
                : "No recipes match your filters"}
            </p>
            {recipes.length === 0 && (
              <Link
                to="/generate"
                className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium transition-colors text-sm"
              >
                Generate Your First Recipe
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const cuisineColors = {
  Indian: "bg-orange-500/20 text-orange-400",
  Italian: "bg-red-500/20 text-red-400",
  Mexican: "bg-yellow-500/20 text-yellow-400",
  Chinese: "bg-rose-500/20 text-rose-400",
  Japanese: "bg-pink-500/20 text-pink-400",
  Thai: "bg-lime-500/20 text-lime-400",
  French: "bg-blue-500/20 text-blue-400",
  Mediterranean: "bg-cyan-500/20 text-cyan-400",
  American: "bg-indigo-500/20 text-indigo-400",
};

const RecipeCard = ({ recipe, onDelete }) => {
  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);
  const cuisineColor =
    cuisineColors[recipe.cuisine_type] || "bg-emerald-500/20 text-emerald-400";

  return (
    <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-all group flex flex-col">
      <div className="relative h-40 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
        {recipe.cuisine_type && (
          <span
            className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold ${cuisineColor}`}
          >
            {recipe.cuisine_type}
          </span>
        )}
        <button
          onClick={() => onDelete(recipe.id)}
          className="absolute top-3 right-3 w-8 h-8 bg-gray-900/80 rounded-full flex items-center justify-center text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
        <ChefHat className="w-12 h-12 text-gray-600" />
      </div>

      <div className="p-4 flex flex-col flex-1">
        <Link to={`/recipes/${recipe.id}`} className="block mb-2 flex-1">
          <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors line-clamp-2 text-sm leading-snug">
            {recipe.name}
          </h3>
          {recipe.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
              {recipe.description}
            </p>
          )}
        </Link>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {recipe.difficulty && (
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                recipe.difficulty === "easy"
                  ? "bg-green-500/20 text-green-400"
                  : recipe.difficulty === "medium"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-red-500/20 text-red-400"
              }`}
            >
              {recipe.difficulty}
            </span>
          )}
          {recipe.dietary_tags?.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-700">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3.5 h-3.5" />
            <span>{totalTime} mins</span>
          </div>
          <Link
            to={`/recipes/${recipe.id}`}
            className="flex items-center gap-1 text-xs text-emerald-400 font-medium hover:text-emerald-300"
          >
            View <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyRecipes;
