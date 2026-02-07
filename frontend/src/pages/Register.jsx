import { useState } from "react";
import api from "../api/api";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      setSuccess("Registration successful. Please login.");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data || "Registration failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-5">
          <h1 className="text-3xl font-bold text-center text-gray-800">
            Register
          </h1>

          <p className="text-sm text-center text-gray-500">
            Create a new account
          </p>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {success && (
            <p className="text-green-600 text-sm text-center">{success}</p>
          )}

          {/* NAME */}
          <div>
            <label className="text-sm text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2
                         outline-none focus:ring-2 focus:ring-indigo-500
                         text-black bg-white"
              required
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2
                         outline-none focus:ring-2 focus:ring-indigo-500
                         text-black bg-white"
              required
            />
          </div>

          {/* PASSWORD WITH EYE */}
          <div className="relative">
            <label className="text-sm text-gray-700">Password</label>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2
                         outline-none focus:ring-2 focus:ring-indigo-500 pr-12
                         text-black bg-white"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-indigo-600"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* CONFIRM PASSWORD WITH EYE */}
          <div className="relative">
            <label className="text-sm text-gray-700">
              Confirm Password
            </label>

            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2
                         outline-none focus:ring-2 focus:ring-indigo-500 pr-12
                         text-black bg-white"
              required
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute right-3 top-9 text-gray-500 hover:text-indigo-600"
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          <button className="w-full bg-indigo-600 text-white py-2 rounded-full font-semibold hover:bg-indigo-700 transition">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
