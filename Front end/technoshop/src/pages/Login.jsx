import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCallback, useState } from "react";
import { useShop } from "../context/ShopContext";
import GoogleAuthButton from "../components/GoogleAuthButton";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser, googleAuthUser } = useShop();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/profile";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginUser(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Could not log in");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = useCallback(
    async (credential) => {
      setError("");
      setLoading(true);

      try {
        await googleAuthUser(credential);
        navigate(from, { replace: true });
      } catch (err) {
        setError(err.message || "Google sign-in failed");
      } finally {
        setLoading(false);
      }
    },
    [from, googleAuthUser, navigate]
  );

  return (
    <div className="pt-24 min-h-screen bg-[#F2F0EB] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-black mb-6">Sign In</h1>
        <p className="text-gray-500 mb-6">Welcome back! Enter your details to continue.</p>

        <GoogleAuthButton
          onCredential={handleGoogleSignIn}
          disabled={loading}
          buttonText="signin_with"
        />

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
          <Link to="/forgot-password" className="text-black hover:text-gray-700 font-medium">
            Forgot password?
          </Link>
          <Link to="/signup" className="font-semibold text-black hover:text-gray-700">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
