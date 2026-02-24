import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", formData);
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: "url('/images/polavaram.jpg')" }}
      >
        <div className="absolute inset-0 backdrop-blur-[1px] bg-black/40"></div>
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl grid md:grid-cols-2 gap-12 px-6">

        {/* Left Side Welcome */}
        <div className="text-white flex flex-col justify-center">
          <h1 className="text-5xl font-serif font-bold mb-6">
            Welcome Back
          </h1>

          <p className="text-lg leading-relaxed text-gray-200">
            Polavaram Project – Rehabilitation & Resettlement  
            Grievance Redressal Monitoring System.
            <br /><br />
            Secure access for authorized officials only.
          </p>

          <div className="mt-8 border-t border-gray-400 pt-6 text-sm text-gray-300">
            Government of Andhra Pradesh  
            R&R Department
          </div>
        </div>

        {/* Right Side Login Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-10">

          <h2 className="text-2xl font-semibold text-center mb-6">
            Officer Sign In
          </h2>

          {error && (
            <div className="mb-4 text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-800 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-800 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-800 transition duration-300 disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

          </form>

          <div className="mt-6 text-xs text-center text-gray-500">
            Authorized Personnel Access Only
          </div>

        </div>
      </div>
    </div>
  );
}
