import { useState, useEffect } from "react";
import { ShoppingCart, Plus, X, Check, Trash2 } from "lucide-react";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import api from "../services/api";

const CATEGORIES = [
  "Produce",
  "Dairy",
  "Meat",
  "Grains",
  "Spices",
  "Beverages",
  "Other",
];

const ShoppingList = () => {
  const [items, setItems] = useState([]);
  const [groupedItems, setGroupedItems] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShoppingList();
  }, []);

  const fetchShoppingList = async () => {
    try {
      const response = await api.get("shopping-list?grouped=true");
      const grouped = response.data.data.items;
      const flatItems = [];
      grouped.forEach((group) => {
        group.items.forEach((item) =>
          flatItems.push({ ...item, category: group.category }),
        );
      });
      setItems(flatItems);
      organizeByCategory(flatItems);
    } catch (error) {
      toast.error("Failed to load shopping list");
    } finally {
      setLoading(false);
    }
  };

  const organizeByCategory = (itemsList) => {
    const grouped = {};
    itemsList.forEach((item) => {
      const category = item.category || "Other";
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(item);
    });
    setGroupedItems(grouped);
  };

  const handleToggleChecked = async (id) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, is_checked: !item.is_checked } : item,
    );
    setItems(updatedItems);
    organizeByCategory(updatedItems);
    try {
      await api.put(`/shopping-list/${id}/toggle`);
    } catch (error) {
      toast.error("Failed to update item");
      fetchShoppingList();
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await api.delete(`/shopping-list/${id}`);
      const updatedItems = items.filter((item) => item.id !== id);
      setItems(updatedItems);
      organizeByCategory(updatedItems);
      toast.success("Item removed");
    } catch (error) {
      toast.error("Failed to delete item");
    }
  };

  const handleClearChecked = async () => {
    if (!confirm("Remove all checked items?")) return;
    try {
      await api.delete("/shopping-list/clear/checked");
      const updatedItems = items.filter((item) => !item.is_checked);
      setItems(updatedItems);
      organizeByCategory(updatedItems);
      toast.success("Checked items cleared");
    } catch (error) {
      toast.error("Failed to clear items");
    }
  };

  const handleAddToPantry = async () => {
    const checkedCount = items.filter((item) => item.is_checked).length;
    if (checkedCount === 0) {
      toast.error("No items checked");
      return;
    }
    if (!confirm(`Add ${checkedCount} checked items to pantry?`)) return;
    try {
      await api.post("/shopping-list/add-to-pantry");
      const updatedItems = items.filter((item) => !item.is_checked);
      setItems(updatedItems);
      organizeByCategory(updatedItems);
      toast.success("Items added to pantry");
    } catch (error) {
      toast.error("Failed to add items to pantry");
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

  const checkedCount = items.filter((item) => item.is_checked).length;
  const totalCount = items.length;
  const progressPct =
    totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Shopping List
            </h1>
            <p className="text-gray-400 mt-1 text-sm">
              {totalCount > 0
                ? `${checkedCount} of ${totalCount} items bought`
                : "Everything you need to buy"}
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

        {totalCount > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* List */}
            <div className="lg:col-span-2 space-y-3">
              {/* Progress */}
              <div className="bg-gray-800 rounded-2xl border border-gray-700 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-400">
                    Progress
                  </span>
                  <span className="text-xs text-gray-500">
                    {checkedCount} of {totalCount} items bought
                  </span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              {Object.entries(groupedItems).map(([category, categoryItems]) => (
                <div
                  key={category}
                  className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                      <span className="font-semibold text-white text-sm">
                        {category}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {categoryItems.length} items
                    </span>
                  </div>
                  <div className="divide-y divide-gray-700/50">
                    {categoryItems.map((item) => (
                      <ShoppingListItem
                        key={item.id}
                        item={item}
                        onToggle={handleToggleChecked}
                        onDelete={handleDeleteItem}
                      />
                    ))}
                  </div>
                </div>
              ))}

              {checkedCount > 0 && (
                <div className="flex gap-3">
                  <button
                    onClick={handleAddToPantry}
                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-medium transition-colors text-sm"
                  >
                    <ShoppingCart className="w-4 h-4" /> Add to Pantry (
                    {checkedCount})
                  </button>
                  <button
                    onClick={handleClearChecked}
                    className="flex items-center gap-2 border border-gray-600 text-gray-400 hover:bg-gray-800 px-4 py-2.5 rounded-xl font-medium transition-colors text-sm"
                  >
                    <Trash2 className="w-4 h-4" /> Clear
                  </button>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="space-y-4">
              <div className="bg-gray-800 rounded-2xl border border-gray-700 p-4">
                <h3 className="font-semibold text-white text-sm mb-4">
                  Summary
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      label: "Total items",
                      value: totalCount,
                      color: "text-white",
                    },
                    {
                      label: "Bought",
                      value: checkedCount,
                      color: "text-emerald-400 font-semibold",
                    },
                    {
                      label: "Remaining",
                      value: totalCount - checkedCount,
                      color: "text-white",
                    },
                  ].map(({ label, value, color }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-500">{label}</span>
                      <span className={color}>{value}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-gray-700 flex items-center justify-between text-sm">
                    <span className="text-gray-500">Complete</span>
                    <span className="font-semibold text-emerald-400">
                      {progressPct}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-2xl border border-gray-700 p-4">
                <h3 className="font-semibold text-white text-sm mb-3">
                  Categories
                </h3>
                <div className="space-y-2">
                  {Object.entries(groupedItems).map(
                    ([category, categoryItems]) => (
                      <div
                        key={category}
                        className="flex items-center justify-between text-xs"
                      >
                        <span className="text-gray-400">{category}</span>
                        <span className="text-gray-600">
                          {categoryItems.length}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-12 text-center">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-gray-500 text-sm mb-4">
              Your shopping list is empty
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium transition-colors text-sm"
            >
              <Plus className="w-4 h-4" /> Add First Item
            </button>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddItemModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            fetchShoppingList();
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
};

const ShoppingListItem = ({ item, onToggle, onDelete }) => (
  <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700/50 transition-colors group">
    <button onClick={() => onToggle(item.id)} className="shrink-0">
      <div
        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
          item.is_checked
            ? "bg-emerald-500 border-emerald-500"
            : "border-gray-600 hover:border-emerald-500"
        }`}
      >
        {item.is_checked && <Check className="w-3 h-3 text-white" />}
      </div>
    </button>
    <div className="flex-1 min-w-0">
      <p
        className={`text-sm font-medium ${item.is_checked ? "line-through text-gray-600" : "text-white"}`}
      >
        {item.ingredient_name}
      </p>
      <p
        className={`text-xs ${item.is_checked ? "text-gray-700" : "text-gray-500"}`}
      >
        {item.quantity} {item.unit}
        {item.from_meal_plan && (
          <span className="ml-2 text-emerald-500">• From meal plan</span>
        )}
      </p>
    </div>
    <button
      onClick={() => onDelete(item.id)}
      className="shrink-0 p-1.5 text-gray-600 hover:text-red-400 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
    >
      <X className="w-4 h-4" />
    </button>
  </div>
);

const AddItemModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    ingredient_name: "",
    quantity: "",
    unit: "pieces",
    category: "Other",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/shopping-list", {
        ...formData,
        quantity: parseFloat(formData.quantity),
      });
      toast.success("Item added to shopping list");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition-all";

  return (
    <div className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white">Add Item</h2>
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
              Item Name
            </label>
            <input
              type="text"
              value={formData.ingredient_name}
              onChange={(e) =>
                setFormData({ ...formData, ingredient_name: e.target.value })
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

export default ShoppingList;
