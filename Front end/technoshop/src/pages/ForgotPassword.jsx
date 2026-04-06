import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: integrate reset flow
    alert(`Password reset link sent to ${email}`);
    navigate("/login");
  };

  return (
    <div className="pt-24 min-h-screen bg-[#F2F0EB] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-black mb-6">Forgot Password</h1>
        <p className="text-gray-500 mb-6">Enter your email and we’ll send a link to reset your password.</p>

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

          <button
            type="submit"
            className="w-full py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
          >
            Send Reset Link
          </button>
        </form>

        <p className="mt-4 text-gray-600 text-sm">
          Remembered password? <Link to="/login" className="text-black font-semibold hover:text-gray-700">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
