"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex font-body">
      {/* Left panel — branding */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12"
        style={{
          background: "linear-gradient(135deg, #1a1118 0%, #2d1b28 50%, #1a1118 100%)",
        }}
      >
        <div>
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #C8553D 0%, #E8913A 100%)",
              }}
            >
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <div className="text-white font-semibold text-lg tracking-wide font-display">
                Saffron
              </div>
              <div className="text-white/30 text-[10px] tracking-[0.2em] uppercase">
                Wedding Planner
              </div>
            </div>
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white font-display leading-tight">
            Where tradition
            <br />
            meets precision.
          </h1>
          <p className="text-white/40 text-sm mt-4 max-w-md leading-relaxed">
            The complete operations platform for luxury Indian wedding planning.
            Manage ceremonies, vendors, guests, and finances — all in one place.
          </p>
        </div>
        <div className="text-white/20 text-xs">
          © 2026 Saffron Wedding Planner
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#faf9f7]">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #C8553D, #E8913A)",
              }}
            >
              <span className="text-white font-bold">S</span>
            </div>
            <div className="text-lg font-bold font-display text-gray-900">
              Saffron
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 font-display">
            Welcome back
          </h2>
          <p className="text-sm text-gray-400 mt-1 mb-8">
            Sign in to your planner dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@saffronweddings.com"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition"
                required
              />
            </div>

            {error && (
              <div className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 text-sm font-semibold text-white rounded-xl shadow-sm transition disabled:opacity-60"
              style={{
                background: "linear-gradient(135deg, #C8553D, #E8913A)",
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-xs text-gray-300 text-center mt-6">
            Contact your admin for access
          </p>
        </div>
      </div>
    </div>
  );
}
