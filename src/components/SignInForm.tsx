/**
 * Sign-In Form — SquarefloCMS Bravo Template
 * =============================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Client component that handles email/password sign-in.
 * Posts credentials to /api/auth/sign-in (server-side proxy),
 * then redirects to the home page on success.
 *
 * If the user is already signed in, shows their name and a sign-out button.
 *
 * Design Reference:
 *   - html-reference/sign-in-r4m7t9w2qx.html (auth card form)
 */

"use client";

import { useEffect, useState } from "react";

interface AuthUser {
  first_name: string;
  last_name: string;
  role: string;
}

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [signedInUser, setSignedInUser] = useState<AuthUser | null>(null);
  const [checking, setChecking] = useState(true);

  // Check if already signed in
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (data?.user) setSignedInUser(data.user);
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);

  async function handleSignOut() {
    await fetch("/api/auth/sign-out", { method: "POST" });
    setSignedInUser(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid email or password.");
        setLoading(false);
        return;
      }

      // Show debug info temporarily
      if (data._debug) {
        console.log("[SignInForm] Debug:", JSON.stringify(data._debug, null, 2));
        if (data._debug.verifyStatus !== 200) {
          setError(`Sign-in OK but token verify failed (${data._debug.verifyStatus}): ${JSON.stringify(data._debug.verifyResult)}`);
          setLoading(false);
          return;
        }
      }

      // Full page redirect to home
      window.location.href = "/";
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  // Still checking auth state
  if (checking) return null;

  // Already signed in
  if (signedInUser) {
    return (
      <div className="auth-card__signed-in">
        <p className="auth-card__signed-in-text">
          {signedInUser.first_name}, you are already signed in.
        </p>
        <a href="/" className="btn btn--block" style={{ marginBottom: 12 }}>
          Go to Home Page
        </a>
        <button
          className="btn btn--outline btn--block"
          onClick={handleSignOut}
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <form className="auth-card__form" onSubmit={handleSubmit}>
      {error && <div className="auth-card__error">{error}</div>}

      <div className="form-field">
        <label htmlFor="signin-email" className="form-field__label">
          E-mail
        </label>
        <input
          id="signin-email"
          type="email"
          className={`form-field__input${error ? " form-field__input--error" : ""}`}
          placeholder="you@example.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="signin-password" className="form-field__label">
          Password
        </label>
        <input
          id="signin-password"
          type="password"
          className={`form-field__input${error ? " form-field__input--error" : ""}`}
          placeholder="••••••••"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        className={`btn btn--block${loading ? " btn--loading" : ""}`}
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
