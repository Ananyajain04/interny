import { useState } from "react";
import { login, saveToken } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const result = await login(email, password);
      if (result.token) {
        saveToken(result.token);
        navigate("/chat");
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 relative overflow-hidden">

      {/* Floating blur blobs for aesthetic effect */}
      <div className="absolute top-10 left-20 w-72 h-72 bg-blue-200 rounded-full blur-[100px] opacity-50 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-300 rounded-full blur-[120px] opacity-40 animate-pulse"></div>

      {/* Frosted glass card */}
      <div className="backdrop-blur-xl bg-white/40 border border-white/30 shadow-2xl p-8 rounded-3xl w-[400px]">
        <h2 className="text-3xl font-extrabold text-blue-800 text-center mb-6">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="VIT Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 rounded-xl bg-white/80 text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-3 rounded-xl bg-white/80 text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
          />

          {error && (
            <p className="text-red-500 text-sm text-center font-medium">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 shadow-md transition duration-200"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-blue-800/80">
          Don’t have an account?{" "}
          <span
            className="text-blue-600 font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}
