import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/auth";
import { Eye, EyeOff, LogIn, Stethoscope } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const handleRegister = async () => {
    setError(null);

    if (!username.trim() || !password || !confirm) {
      setError("All fields are required.");
      return;
    }
    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await register(username.trim(), password);
      navigate("/login?registered=1");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-up">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            ABC Clinic
          </h1>
          <p className="text-sm text-gray-500 mt-1">Notes & Billing System</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              Create an account
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Register to access the clinic system
            </p>
          </div>

          {/* Form */}
          <div className="px-6 py-5 space-y-4">
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
                <span>⚠️</span>
                {error}
              </div>
            )}

            {/* Username */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="choose a username"
                autoFocus
                className="w-full px-4 py-2.5 text-sm text-gray-900 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="at least 6 characters"
                  className="w-full px-4 py-2.5 text-sm text-gray-900 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPassword2 ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                  placeholder="repeat your password"
                  className={`w-full px-4 py-2.5 text-sm border rounded-lg outline-none transition-all focus:ring-2 ${confirm && password !== confirm
                    ? "border-red-300 focus:ring-red-500 focus:border-transparent"
                    : "border-gray-200 focus:ring-teal-500 focus:border-transparent"
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword2(!showPassword2)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword2 ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {confirm && password !== confirm && (
                <p className="text-xs text-red-500">Passwords do not match</p>
              )}
            </div>

            {/* Submit */}
            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-semibold hover:bg-teal-700 transition-all disabled:opacity-50 mt-4"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <LogIn size={16} />
                  Create Account
                </>
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-teal-600 font-medium hover:text-teal-700 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}