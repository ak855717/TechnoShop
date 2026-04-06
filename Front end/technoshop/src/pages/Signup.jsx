import { Link, useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";
import { useShop } from "../context/ShopContext";
import GoogleAuthButton from "../components/GoogleAuthButton";

export default function Signup() {
  const navigate = useNavigate();
  const { registerUser, googleAuthUser } = useShop();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    setLoading(true);

    try {
      await registerUser(name, email, password);
      navigate("/profile", { replace: true });
    } catch (err) {
      setError(err.message || "Could not sign up");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = useCallback(
    async (credential) => {
      setError("");
      setLoading(true);

      try {
        await googleAuthUser(credential);
        navigate("/profile", { replace: true });
      } catch (err) {
        setError(err.message || "Google sign-up failed");
      } finally {
        setLoading(false);
      }
    },
    [googleAuthUser, navigate]
  );

  return (
    <div className="pt-24 min-h-screen bg-[#F2F0EB] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-black mb-6">Create Account</h1>
        <p className="text-gray-500 mb-6">Fill in your details to join TechnoShop.</p>

        <GoogleAuthButton
          onCredential={handleGoogleSignUp}
          disabled={loading}
          buttonText="signup_with"
        />

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">or create with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
            />
          </div>

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

          <div>
            <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
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
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-gray-600 text-sm">
          Already have an account? <Link to="/login" className="text-black font-semibold hover:text-gray-700">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
