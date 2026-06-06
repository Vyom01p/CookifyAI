import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ChefHat,
  Home,
  UtensilsCrossed,
  Calendar,
  ShoppingCart,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

const NAV_ITEMS = [
  { to: "/dashboard", icon: <Home className="w-5 h-5" />, label: "Dashboard" },
  {
    to: "/pantry",
    icon: <UtensilsCrossed className="w-5 h-5" />,
    label: "Pantry",
  },
  {
    to: "/generate",
    icon: <Sparkles className="w-5 h-5" />,
    label: "Generate",
  },
  { to: "/recipes", icon: <ChefHat className="w-5 h-5" />, label: "Recipes" },
  {
    to: "/meal-plan",
    icon: <Calendar className="w-5 h-5" />,
    label: "Meal Plan",
  },
  {
    to: "/shopping-list",
    icon: <ShoppingCart className="w-5 h-5" />,
    label: "Shopping",
  },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setSidebarOpen(false);
  };

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebarOpen(false);
      }
    };
    if (sidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const userInitial = user?.name?.charAt(0).toUpperCase() || "U";

  return (
    <>
      {/* Top Navbar */}
      <nav className="bg-gray-900 border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-base sm:text-lg font-semibold text-white"
              >
                <ChefHat className="w-6 h-6 text-emerald-500" />
                <span className="hidden sm:inline">AI Recipe Generator</span>
                <span className="sm:hidden">AI Recipe</span>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/settings"
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-colors"
              >
                <Settings className="w-5 h-5" />
              </Link>
              <button
                onClick={() => setSidebarOpen(true)}
                className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-semibold text-sm"
              >
                {userInitial}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 z-50 transition-opacity duration-300 ${
          sidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-72 bg-gray-900 border-r border-gray-700 z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-emerald-500" />
            <span className="font-semibold text-white">
              AI Recipe Generator
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User info */}
        <div className="px-5 py-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-semibold shrink-0">
              {userInitial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {user?.email || "user@example.com"}
              </p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ to, icon, label }) => {
            const isActive =
              location.pathname === to ||
              (to !== "/dashboard" && location.pathname.startsWith(to));
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-emerald-500 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <span className={isActive ? "text-white" : "text-gray-500"}>
                  {icon}
                </span>
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-gray-700 space-y-1">
          <Link
            to="/settings"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              location.pathname === "/settings"
                ? "bg-emerald-500 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <Settings
              className={`w-5 h-5 ${location.pathname === "/settings" ? "text-white" : "text-gray-500"}`}
            />
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
