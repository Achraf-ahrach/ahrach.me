"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/supabase-client";
import { Lock, Mail, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      router.push("/YoBarber/admin");
      router.refresh();
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/YoBarber/admin`,
        },
      });

      if (authError) {
        setError(authError.message);
        setGoogleLoading(false);
      }
    } catch {
      setError("An unexpected error occurred during Google sign in.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      {/* Background effects */}
      <div className="admin-login-glow admin-login-glow-1" />
      <div className="admin-login-glow admin-login-glow-2" />

      <div className="admin-login-container">
        {/* Logo */}
        <div className="admin-login-logo">
          <Image
            src="/yobarber/logo.png"
            alt="YoBarber"
            width={56}
            height={56}
            className="admin-login-logo-img"
            priority
          />
          <h1>YoBarber Admin</h1>
          <p>Sign in to access the admin dashboard</p>
        </div>

        {error && (
          <div className="admin-login-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading || loading}
          className="admin-google-btn"
        >
          {googleLoading ? (
            <Loader2 size={18} className="admin-spinner" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
              />
            </svg>
          )}
          <span>{googleLoading ? "Connecting to Google…" : "Sign in with Google"}</span>
        </button>

        {/* Divider */}
        <div className="admin-login-divider">
          <span>or sign in with email</span>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="admin-login-field">
            <label htmlFor="admin-email">Email</label>
            <div className="admin-login-input-wrapper">
              <Mail size={18} className="admin-login-input-icon" />
              <input
                id="admin-email"
                type="email"
                placeholder="admin@yobarber.app"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="admin-login-field">
            <label htmlFor="admin-password">Password</label>
            <div className="admin-login-input-wrapper">
              <Lock size={18} className="admin-login-input-icon" />
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="admin-login-toggle-pw"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="admin-login-submit"
            disabled={loading || googleLoading}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="admin-spinner" />
                Signing in…
              </>
            ) : (
              <>
                <Lock size={18} />
                Sign In with Email
              </>
            )}
          </button>
        </form>

        <div className="admin-login-footer">
          <a href="/YoBarber">← Back to YoBarber</a>
        </div>
      </div>
    </div>
  );
}
