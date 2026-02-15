import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";
import "./auth.css";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";


function Login() {
  const { login, register, isLoading } = useAuth();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isWakingUp, setIsWakingUp] = useState(false);

  // 🚀 Proactive server wakeup on mount
  useEffect(() => {
    const wakeup = async () => {
      try {
        await api.get("/auth/health");
      } catch (err) {
        // Ignore error, we just want to wake up Render
      }
    };
    wakeup();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const ok = await login(email, password);
    if (!ok) {
      setError("Invalid email or password");
    } else {
      setEmail("");
      setPassword("");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const ok = await register(name, email, password);
    if (!ok) {
      setError("Registration failed. Email may already be in use.");
    } else {
      setSuccess("Registration successful! Please login.");
      setIsRegisterMode(false);
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }
  };

  const handleDemoLogin = async () => {
    setError("");
    setSuccess("");

    // If it takes more than 2s, show "Waking up server"
    const timer = setTimeout(() => setIsWakingUp(true), 2000);

    const ok = await login("demo@gmail.com", "demo123");

    clearTimeout(timer);
    setIsWakingUp(false);

    if (!ok) {
      setError("Demo login failed. Please contact the administrator.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 relative">
      {/* Demo Button - Responsive positioning */}
      <div className="fixed top-4 right-4 sm:absolute sm:top-6 sm:right-6 z-10">
        <button
          onClick={handleDemoLogin}
          disabled={isLoading}
          className="bg-indigo-600 text-white px-4 sm:px-6 py-2 rounded-full font-bold shadow-lg 
                     hover:bg-indigo-700 transition-all transform hover:scale-105
                     disabled:bg-indigo-400 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          {isLoading ? (isWakingUp ? "Waking up server..." : "Wait...") : "Demo"}
        </button>
      </div>

      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg">
        <form
          onSubmit={isRegisterMode ? handleRegister : handleLogin}
          className="space-y-5"
        >
          <h1 className="text-3xl font-bold text-center text-gray-800">
            {isRegisterMode ? "Register" : "Login"}
          </h1>

          <p className="text-sm text-center text-gray-500">
            {isRegisterMode
              ? "Create a new account"
              : "Please login to use the platform"}
          </p>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {success && (
            <p className="text-green-600 text-sm text-center">{success}</p>
          )}

          {isRegisterMode && (
            <div>
              <label className="text-sm text-gray-700">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none
                           focus:ring-2 focus:ring-indigo-500
                           text-black dark:text-black"
                required
                disabled={isLoading}
              />
            </div>
          )}

          <div>
            <label className="text-sm text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none
                         focus:ring-2 focus:ring-indigo-500
                         text-black dark:text-black"
              required
              disabled={isLoading}
            />
          </div>

          <div className="relative">
            <label className="text-sm text-gray-700">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none
                         focus:ring-2 focus:ring-indigo-500 pr-12
                         text-black dark:text-black"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-indigo-600"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>


          {isRegisterMode && (
            <div className="relative">
              <label className="text-sm text-gray-700">
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none
                           focus:ring-2 focus:ring-indigo-500 pr-12
                           text-black dark:text-black"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-gray-500 hover:text-indigo-600"
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-2 rounded-full font-semibold hover:bg-indigo-700 transition disabled:bg-indigo-400 disabled:cursor-not-allowed mb-2"
          >
            {isLoading ? "Processing..." : (isRegisterMode ? "Register" : "Login")}
          </button>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-zinc-200"></div>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-zinc-200"></div>
          </div>

          <button
            type="button"
            onClick={() => alert("Google Auth requires a Client ID to be configured in Google Cloud Console.")}
            className="w-full flex items-center justify-center gap-3 bg-white border border-zinc-200 text-zinc-700 py-2 rounded-full font-semibold hover:bg-zinc-50 transition shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          <p className="text-sm text-center text-gray-600 pt-4">
            {isRegisterMode
              ? "Already have an account?"
              : "Don't have an account?"}{" "}
            <button
              type="button"
              className="text-indigo-600 font-semibold underline hover:text-indigo-700 disabled:opacity-50"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setError("");
                setSuccess("");
              }}
              disabled={isLoading}
            >
              {isRegisterMode ? "Login" : "Register"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
