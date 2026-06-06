import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  X,
  Calendar,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import { format } from "date-fns";
import api from "../services/api";

const CATEGORIES = [
  "Vegetables",
  "Fruits",
  "Dairy",
  "Meat",
  "Grains",
  "Spices",
  "Other",
];

const Pantry = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expiringItems, setExpiringItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPantryItems();
    fetchExpiringItems();
  }, []);

  const fetchPantryItems = async () => {
    try {
      const response = await api.get("/pantry");
      setItems(response.data.data.items);
    } catch (error) {
      toast.error("Failed to load pantry items");
    } finally {
      setLoading(false);
    }
  };

  const fetchExpiringItems = async () => {
    try {
      const response = await api.get("/pantry/expiring-soon?days=7");
      setExpiringItems(response.data.data.items);
    } catch (error) {
      console.error("Failed to load expiring items");
    }
  };

  useEffect(() => {
    filterItems();
  }, [items, searchQuery, selectedCategory]);

  const filterItems = () => {
    let filtered = items;
    if (searchQuery)
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    if (selectedCategory !== "All")
      filtered = filtered.filter((item) => item.category === selectedCategory);
    setFilteredItems(filtered);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await api.delete(`/pantry/${id}`);
      setItems(items.filter((item) => item.id !== id));
      toast.success("Item Deleted");
    } catch (error) {
      toast.error("Failed to delete the item");
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
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Pantry
            </h1>
            <p className="text-gray-400 mt-1 text-sm">
              Manage your ingredients and track expiry dates
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white px-3 sm:px-4 py-2.5 rounded-xl font-medium transition-all text-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Item</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        {/* Expiry Alert */}
        {expiringItems.length > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-amber-300 text-sm">
                Items expiring soon
              </p>
              <p className="text-amber-400/70 text-xs mt-0.5">
                {expiringItems.length} item{expiringItems.length > 1 ? "s" : ""}{" "}
                expiring within 7 days
              </p>
            </div>
          </div>
        )}

        {/* Search + Filter */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-4 mb-6">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ingredients..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition-all"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {["All", ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full font-medium text-xs whitespace-nowrap transition-colors shrink-0 ${
                  selectedCategory === cat
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <PantryItemCard
                key={item.id}
                item={item}
                onDelete={handleDelete}
                isExpiring={expiringItems.some((exp) => exp.id === item.id)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-12 text-center">
            <p className="text-gray-500 text-sm">No items found</p>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddItemModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            fetchPantryItems();
            fetchExpiringItems();
          }}
        />
      )}
    </div>
  );
};

const PantryItemCard = ({ item, onDelete, isExpiring }) => {
  const isExpired = item.expiry_date && new Date(item.expiry_date) < new Date();
  const daysUntilExpiry = item.expiry_date
    ? Math.ceil(
        (new Date(item.expiry_date) - new Date()) / (1000 * 60 * 60 * 24),
      )
    : null;
  const expiryProgress =
    daysUntilExpiry !== null
      ? Math.max(0, Math.min(100, (daysUntilExpiry / 30) * 100))
      : 100;

  return (
    <div
      className={`bg-gray-800 rounded-2xl border p-4 transition-all ${
        isExpired
          ? "border-red-500/50"
          : isExpiring
            ? "border-amber-500/50"
            : "border-gray-700"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-sm truncate">
            {item.name}
          </h3>
          <p className="text-xs text-gray-500 capitalize mt-0.5">
            {item.category}
          </p>
        </div>
        <button
          onClick={() => onDelete(item.id)}
          className="text-gray-600 hover:text-red-400 transition-colors ml-2 shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-500">Quantity</span>
        <span className="font-semibold text-white text-sm">
          {item.quantity} {item.unit}
        </span>
      </div>

      <div className="mb-2">
        <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              isExpired
                ? "bg-red-500"
                : isExpiring
                  ? "bg-amber-400"
                  : "bg-emerald-500"
            }`}
            style={{ width: `${expiryProgress}%` }}
          />
        </div>
      </div>

      {item.expiry_date ? (
        <div
          className={`flex items-center gap-1.5 text-xs ${
            isExpired
              ? "text-red-400"
              : isExpiring
                ? "text-amber-400"
                : "text-gray-500"
          }`}
        >
          {isExpired || isExpiring ? (
            <AlertTriangle className="w-3 h-3" />
          ) : (
            <Calendar className="w-3 h-3" />
          )}
          <span>
            {isExpired ? "Expired" : "Expires"}:{" "}
            {format(new Date(item.expiry_date), "MMM dd, yyyy")}
          </span>
        </div>
      ) : (
        <p className="text-xs text-gray-600">No expiry set</p>
      )}

      {item.is_running_low && (
        <span className="inline-block mt-2 px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs font-medium rounded-full">
          Running Low
        </span>
      )}
    </div>
  );
};

const AddItemModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    unit: "pieces",
    category: "Other",
    expiry_date: "",
    is_running_low: false,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/pantry", {
        ...formData,
        quantity: parseFloat(formData.quantity) || 0,
        expiry_date: formData.expiry_date || null,
      });
      toast.success("Item added to the pantry");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to add item");
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition-all";

  return (
    <div className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white">Add Pantry Item</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={inputClass}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Quantity
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Unit
              </label>
              <select
                value={formData.unit}
                onChange={(e) =>
                  setFormData({ ...formData, unit: e.target.value })
                }
                className={inputClass}
              >
                {["pieces", "kg", "g", "l", "ml", "cups", "tbsp", "tsp"].map(
                  (u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className={inputClass}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">
              Expiry Date (Optional)
            </label>
            <input
              type="date"
              value={formData.expiry_date}
              onChange={(e) =>
                setFormData({ ...formData, expiry_date: e.target.value })
              }
              className={inputClass}
            />
          </div>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_running_low}
              onChange={(e) =>
                setFormData({ ...formData, is_running_low: e.target.checked })
              }
              className="w-4 h-4 text-emerald-500 border-gray-600 rounded bg-gray-700 focus:ring-emerald-500"
            />
            <span className="text-sm text-gray-300">Mark as running low</span>
          </label>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-600 text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? "Adding..." : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Pantry;
