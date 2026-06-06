import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  ChefHat,
  Mail,
  Lock,
  Sparkles,
  Calendar,
  ShoppingCart,
} from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      toast.success("Welcome back!");
      navigate("/dashboard");
    } else {
      toast.error(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-gray-800 rounded-3xl shadow-sm border border-gray-700 overflow-hidden flex flex-col md:flex-row min-h-[520px]">
        {/* Left Panel */}
        <div className="bg-green-900 md:w-5/12 flex flex-col items-center justify-center p-8 sm:p-10 gap-6">
          <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
              Cook smarter with AI
            </h2>
            <p className="text-green-300 text-sm mt-2">
              Your personal AI-powered recipe assistant
            </p>
          </div>
          <div className="flex flex-col gap-4 w-full mt-2">
            <Feature
              icon={<Sparkles className="w-4 h-4 text-emerald-400" />}
              text="Generate recipes from your pantry"
            />
            <Feature
              icon={<Calendar className="w-4 h-4 text-emerald-400" />}
              text="Plan your weekly meals effortlessly"
            />
            <Feature
              icon={<ShoppingCart className="w-4 h-4 text-emerald-400" />}
              text="Auto-generate your shopping list"
            />
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 flex flex-col justify-center p-8 sm:p-10">
          <div className="mb-7">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Welcome back
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Sign in to your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-400 mb-1.5"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-600 rounded-xl bg-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-gray-800 outline-none transition-all text-sm"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-400 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-600 rounded-xl bg-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-gray-800 outline-none transition-all text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link
                to="/reset-password"
                className="text-xs text-emerald-600 hover:text-emerald-500 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white font-medium py-2.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-700" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-700" />
          </div>

          {/* Sign Up */}
          <p className="text-center text-xs text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-emerald-500 hover:text-emerald-400 font-medium"
            >
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const Feature = ({ icon, text }) => (
  <div className="flex items-center gap-3">
    <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <span className="text-sm text-green-200">{text}</span>
  </div>
);

export default Login;
