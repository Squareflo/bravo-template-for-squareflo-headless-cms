/**
 * Sign-In Form — SquarefloCMS Bravo Template
 * =============================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Client component that handles email/password sign-in.
 * Posts credentials to /api/auth/sign-in (server-side proxy),
 * then redirects to the home page on success.
 *
 * Design Reference:
 *   - html-reference/sign-in-r4m7t9w2qx.html (auth card form)
 */

"use client";

import { useState } from "react";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

      // Full page redirect — must cross layout boundaries (sign-in layout → root layout)
      window.location.href = "/";
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
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
