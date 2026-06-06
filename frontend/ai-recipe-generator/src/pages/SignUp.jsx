import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  ChefHat,
  Mail,
  Lock,
  User,
  Sparkles,
  Calendar,
  ShoppingCart,
} from "lucide-react";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await register(name, email, password);
    if (result.success) {
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-gray-800 rounded-3xl shadow-sm border border-gray-700 overflow-hidden flex flex-col md:flex-row min-h-[560px]">
        {/* Left Panel */}
        <div className="bg-green-900 md:w-5/12 flex flex-col items-center justify-center p-8 sm:p-10 gap-6">
          <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
              Start cooking smarter
            </h2>
            <p className="text-green-300 text-sm mt-2">
              Your AI-powered kitchen companion
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
              Create account
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Join and start your culinary journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              {
                id: "name",
                label: "Full Name",
                type: "text",
                value: name,
                onChange: setName,
                icon: <User className="w-4 h-4 text-gray-400" />,
                placeholder: "John Doe",
              },
              {
                id: "email",
                label: "Email",
                type: "email",
                value: email,
                onChange: setEmail,
                icon: <Mail className="w-4 h-4 text-gray-400" />,
                placeholder: "you@example.com",
              },
              {
                id: "password",
                label: "Password",
                type: "password",
                value: password,
                onChange: setPassword,
                icon: <Lock className="w-4 h-4 text-gray-400" />,
                placeholder: "••••••••",
                minLength: 6,
              },
            ].map(
              ({
                id,
                label,
                type,
                value,
                onChange,
                icon,
                placeholder,
                minLength,
              }) => (
                <div key={id}>
                  <label
                    htmlFor={id}
                    className="block text-sm font-medium text-gray-400 mb-1.5"
                  >
                    {label}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">
                      {icon}
                    </span>
                    <input
                      id={id}
                      type={type}
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-600 rounded-xl bg-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-gray-800 outline-none transition-all text-sm"
                      placeholder={placeholder}
                      required
                      minLength={minLength}
                    />
                  </div>
                  {id === "password" && (
                    <p className="text-xs text-gray-400 mt-1">
                      Must be at least 6 characters
                    </p>
                  )}
                </div>
              ),
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white font-medium py-2.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-2"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-700" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-700" />
          </div>

          <p className="text-center text-xs text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-emerald-500 hover:text-emerald-400 font-medium"
            >
              Sign in
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

export default SignUp;
