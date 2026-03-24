import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useUser } from "./admin/UserContext.jsx";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      console.log("Attempting login...");
      const loggedInUser = await login({ email, password });
      console.log("Login successful, user:", loggedInUser);
      navigate(loggedInUser?.role === 'ADMIN' || loggedInUser?.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      console.error("Login failed:", err);
      const data = err.response?.data;
      if (data?.errors && data.errors.length > 0) {
        setError(data.errors.join(", "));
      } else if (data?.message) {
        setError(data.message);
      } else {
        setError("लॉगिन विफल। कृपया दोबारा कोशिश करें।");
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center mb-6 text-red-600">
          लॉगिन
        </h2>

        {/* Error banner */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded text-sm">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="ईमेल"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />

          {/* Password with eye toggle */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="पासवर्ड"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2 pr-10"
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

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-red-600 text-white py-2 rounded font-semibold ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-red-700"}`}
          >
            {loading ? "लॉगिन हो रहा है..." : "लॉगिन करें"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          अकाउंट नहीं है?
          <Link to="/signup" className="text-red-600 font-semibold ml-1">
            साइन अप करें
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

