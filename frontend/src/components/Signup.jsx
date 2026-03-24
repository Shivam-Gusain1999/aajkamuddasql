import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import api from "../assets/api.js";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUserName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Error states
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();

  /**
   * Parse the backend errors array to map each error to its field.
   * Backend sends errors like: ["fullName: Full name must be at least 2 characters", "password: Password must be ..."]
   */
  const parseFieldErrors = (errorsArray) => {
    const mapped = {};
    if (Array.isArray(errorsArray)) {
      errorsArray.forEach((errStr) => {
        const colonIndex = errStr.indexOf(":");
        if (colonIndex !== -1) {
          const field = errStr.substring(0, colonIndex).trim();
          const message = errStr.substring(colonIndex + 1).trim();
          // Map to existing fields (could be nested path like "password")
          if (mapped[field]) {
            mapped[field] += `, ${message}`;
          } else {
            mapped[field] = message;
          }
        }
      });
    }
    return mapped;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("username", username);
      formData.append("password", password);

      await api.post("/users/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccessMsg("✅ साइन अप सफल! लॉगिन पेज पर जा रहे हैं...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      try {
        const data = err.response?.data;

        if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
          // Field-level validation errors from Zod
          const parsed = parseFieldErrors(data.errors);
          if (Object.keys(parsed).length > 0) {
            setFieldErrors(parsed);
          } else {
            // Errors exist but couldn't be parsed to fields — show as general
            setGeneralError(data.errors.join(", "));
          }
        } else if (data?.message) {
          // General error (duplicate user, server error, etc.)
          setGeneralError(data.message);
        } else {
          setGeneralError("कुछ गलत हो गया। कृपया दोबारा कोशिश करें।");
        }
      } catch (parseErr) {
        // Fallback if error parsing itself fails
        console.error("Error parsing failed:", parseErr);
        setGeneralError("कुछ गलत हो गया। कृपया दोबारा कोशिश करें।");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center mb-6 text-red-600">
          साइन अप
        </h2>

        {/* General error banner */}
        {generalError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded text-sm">
            ⚠️ {generalError}
          </div>
        )}

        {/* Success message */}
        {successMsg && (
          <div className="mb-4 p-3 bg-green-50 border border-green-300 text-green-700 rounded text-sm">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <input
              type="text"
              placeholder="नाम"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={`w-full border rounded px-3 py-2 ${fieldErrors.fullName ? "border-red-500" : ""}`}
              required
            />
            {fieldErrors.fullName && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.fullName}</p>
            )}
          </div>

          {/* Username */}
          <div>
            <input
              type="text"
              placeholder="यूजरनेम"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              className={`w-full border rounded px-3 py-2 ${fieldErrors.username ? "border-red-500" : ""}`}
              required
            />
            {fieldErrors.username && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.username}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="ईमेल"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full border rounded px-3 py-2 ${fieldErrors.email ? "border-red-500" : ""}`}
              required
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password with eye toggle */}
          <div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="पासवर्ड"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full border rounded px-3 py-2 pr-10 ${fieldErrors.password ? "border-red-500" : ""}`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-red-600 text-white py-2 rounded font-semibold ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-red-700"}`}
          >
            {loading ? "साइन अप हो रहा है..." : "साइन अप करें"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          पहले से अकाउंट है?
          <Link to="/login" className="text-red-600 font-semibold ml-1">
            लॉगिन करें
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
