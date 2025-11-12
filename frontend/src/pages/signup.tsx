import { useState } from "react";
import { signup, saveToken } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.endsWith("@vitstudent.ac.in")) {
      return setError("You must use your VIT student email.");
    }

    try {
      const result = await signup(name, email, password);
      if (result.token) {
        saveToken(result.token);
        navigate("/chat");
      } else {
        setError(result.error || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200 relative overflow-hidden">

      {/* Floating glow circles */}
      <div className="absolute top-10 left-20 w-72 h-72 bg-blue-300 rounded-full blur-[130px] opacity-40 animate-pulse" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-300 rounded-full blur-[150px] opacity-40 animate-pulse" />

      {/* Card */}
      <div className="relative z-10 backdrop-blur-xl bg-white/60 border border-white/30 shadow-xl rounded-2xl p-10 w-[420px]">

        <h2 className="text-3xl font-bold text-center text-blue-800 mb-6 tracking-tight">
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-5">

          {/* Name */}
          <div>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white shadow-sm border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-900 placeholder-blue-400"
            />
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="VIT Email (name@vitstudent.ac.in)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white shadow-sm border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-900 placeholder-blue-400"
            />
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Create Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white shadow-sm border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-900 placeholder-blue-400"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-600 text-sm text-center font-medium">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="mt-2 w-full bg-blue-700 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-800 transition-all shadow-md"
          >
            Sign Up
          </button>
        </form>

        {/* Link */}
        <p className="mt-6 text-center text-blue-700 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-900 font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
