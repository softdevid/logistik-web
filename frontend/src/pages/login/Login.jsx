import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_12px_32px_-8px_rgba(15,23,42,0.12)] p-8">
          <div className="flex flex-col items-center mb-8">
            <img src="/logo.svg" alt="Logo" className="w-28 mb-4" />
            <h1 className="text-xl font-bold text-slate-800">Masuk Sistem</h1>
            <p className="text-[13px] text-slate-400 mt-1">Masukkan akun Anda untuk melanjutkan</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-[13px] font-medium text-slate-600 mb-1.5">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                autoComplete="username"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F5C4C]/40 focus:border-[#0F5C4C] transition-colors"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[13px] font-medium text-slate-600 mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                autoComplete="current-password"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F5C4C]/40 focus:border-[#0F5C4C] transition-colors"
                required
              />
            </div>

            {error && (
              <div className="px-3.5 py-2.5 rounded-lg bg-rose-50 border border-rose-200 text-[13px] text-rose-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-[#0F5C4C] text-white text-sm font-semibold hover:bg-[#0d5042] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Sistem Logistik &copy; 2026
        </p>
      </div>
    </div>
  );
}
