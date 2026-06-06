import { useState, useEffect } from "react";
import { User, Lock, Trash2, Save } from "lucide-react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const DIETARY_OPTIONS = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Keto",
  "Paleo",
];
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

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [preferences, setPreferences] = useState({
    dietary_restrictions: [],
    allergies: [],
    preferred_cuisines: [],
    default_servings: 4,
    measurement_unit: "metric",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await api.get("/users/profile");
      const { user, preferences: userPrefs } = response.data.data;
      setProfile({ name: user.name, email: user.email });
      if (userPrefs)
        setPreferences({
          dietary_restrictions: userPrefs.dietary_restrictions || [],
          allergies: userPrefs.allergies || [],
          preferred_cuisines: userPrefs.preferred_cuisines || [],
          default_servings: userPrefs.default_servings || 4,
          measurement_unit: userPrefs.measurement_unit || "metric",
        });
    } catch (error) {
      toast.error("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/users/profile", profile);
      toast.success("Profile updated successfully");
      localStorage.setItem("user", JSON.stringify({ ...user, ...profile }));
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePreferencesUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/users/preferences", preferences);
      toast.success("Preferences Updated Successfully");
    } catch (error) {
      toast.error("Failed to update preferences");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setSaving(true);
    try {
      await api.put("/users/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success("Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    )
      return;
    const confirmation = window.prompt(
      'Type "DELETE" to confirm account deletion:',
    );
    if (confirmation !== "DELETE") {
      toast.error("Account deletion cancelled");
      return;
    }
    try {
      await api.delete("/users/account");
      toast.success("Account deleted successfully");
      logout();
      navigate("/login");
    } catch (error) {
      toast.error("Failed to delete account");
    }
  };

  const toggleDietary = (option) =>
    setPreferences((prev) => ({
      ...prev,
      dietary_restrictions: prev.dietary_restrictions.includes(option)
        ? prev.dietary_restrictions.filter((d) => d !== option)
        : [...prev.dietary_restrictions, option],
    }));

  const toggleCuisine = (cuisine) =>
    setPreferences((prev) => ({
      ...prev,
      preferred_cuisines: prev.preferred_cuisines.includes(cuisine)
        ? prev.preferred_cuisines.filter((c) => c !== cuisine)
        : [...prev.preferred_cuisines, cuisine],
    }));

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

  const inputClass =
    "w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition-all";

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Settings
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Manage your account and preferences
          </p>
        </div>

        <div className="space-y-4">
          {/* Profile */}
          <Section
            icon={<User className="w-4 h-4 text-emerald-400" />}
            iconBg="bg-emerald-500/20"
            title="Profile Information"
          >
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className={`${inputClass} opacity-50 cursor-not-allowed`}
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 active:scale-[0.98]"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </form>
          </Section>

          {/* Password */}
          <Section
            icon={<Lock className="w-4 h-4 text-blue-400" />}
            iconBg="bg-blue-500/20"
            title="Change Password"
          >
            <form onSubmit={handlePasswordChange} className="space-y-4">
              {[
                { label: "Current Password", key: "currentPassword" },
                { label: "New Password", key: "newPassword" },
                { label: "Confirm New Password", key: "confirmPassword" },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    {label}
                  </label>
                  <input
                    type="password"
                    value={passwordData[key]}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        [key]: e.target.value,
                      })
                    }
                    className={inputClass}
                    required
                    minLength={key !== "currentPassword" ? 6 : undefined}
                  />
                </div>
              ))}
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 active:scale-[0.98]"
              >
                <Lock className="w-4 h-4" />
                {saving ? "Changing..." : "Change Password"}
              </button>
            </form>
          </Section>

          {/* Dietary Preferences */}
          <Section title="Dietary Preferences">
            <form onSubmit={handlePreferencesUpdate} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">
                  Dietary Restrictions
                </label>
                <div className="flex flex-wrap gap-2">
                  {DIETARY_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleDietary(option)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        preferences.dietary_restrictions.includes(option)
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
                  Allergies (comma-separated)
                </label>
                <input
                  type="text"
                  value={preferences.allergies.join(", ")}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      allergies: e.target.value
                        .split(",")
                        .map((a) => a.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="e.g., peanuts, shellfish, soy"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">
                  Preferred Cuisines
                </label>
                <div className="flex flex-wrap gap-2">
                  {CUISINES.map((cuisine) => (
                    <button
                      key={cuisine}
                      type="button"
                      onClick={() => toggleCuisine(cuisine)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        preferences.preferred_cuisines.includes(cuisine)
                          ? "bg-emerald-500 text-white"
                          : "bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white"
                      }`}
                    >
                      {cuisine}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  Default Servings: {preferences.default_servings}
                </label>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={preferences.default_servings}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      default_servings: parseInt(e.target.value),
                    })
                  }
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>1</span>
                  <span>12</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">
                  Measurement Unit
                </label>
                <div className="flex gap-2">
                  {[
                    { value: "metric", label: "Metric (kg, L)" },
                    { value: "imperial", label: "Imperial (lb, gal)" },
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setPreferences({
                          ...preferences,
                          measurement_unit: value,
                        })
                      }
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        preferences.measurement_unit === value
                          ? "bg-emerald-500 text-white"
                          : "bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 active:scale-[0.98]"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save Preferences"}
              </button>
            </form>
          </Section>

          {/* Danger Zone */}
          <div className="bg-gray-800 rounded-2xl border border-red-500/30 p-4 sm:p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-red-500/20 rounded-xl flex items-center justify-center">
                <Trash2 className="w-4 h-4 text-red-400" />
              </div>
              <h2 className="font-semibold text-white text-sm">Danger Zone</h2>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              Deleting your account permanently removes all your recipes, meal
              plans, and data.
            </p>
            <button
              onClick={handleDeleteAccount}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors active:scale-[0.98]"
            >
              <Trash2 className="w-4 h-4" /> Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Section = ({ icon, iconBg, title, children }) => (
  <div className="bg-gray-800 rounded-2xl border border-gray-700 p-4 sm:p-5">
    <div className="flex items-center gap-3 mb-5">
      {icon && (
        <div
          className={`w-8 h-8 ${iconBg} rounded-xl flex items-center justify-center shrink-0`}
        >
          {icon}
        </div>
      )}
      <h2 className="font-semibold text-white text-sm">{title}</h2>
    </div>
    {children}
  </div>
);

export default Settings;
