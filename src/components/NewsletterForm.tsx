/**
 * Newsletter Form — SquarefloCMS Bravo Template
 * ================================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Client component used in footer newsletter sections.
 * When the user submits their email:
 *   1. POST /api/auth/check-email → does the user already exist?
 *   2. If yes → redirect to /sign-in?email=...
 *   3. If no  → redirect to /sign-up?email=...
 */

"use client";

import { useState } from "react";

interface NewsletterFormProps {
  prefix: string;
  inputStyle?: React.CSSProperties;
  btnStyle?: React.CSSProperties;
}

export default function NewsletterForm({ prefix, inputStyle, btnStyle }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }

      if (data.exists) {
        window.location.href = `/sign-in?email=${encodeURIComponent(email)}`;
      } else {
        window.location.href = `/sign-up?email=${encodeURIComponent(email)}`;
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <>
      <form className={`${prefix}-newsletter`} onSubmit={handleSubmit}>
        <input
          type="email"
          className={`${prefix}-newsletter__input`}
          placeholder="Email address"
          aria-label="Email"
          style={inputStyle}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className={`${prefix}-newsletter__btn`}
          style={btnStyle}
          disabled={loading}
        >
          {loading ? "..." : "Subscribe"}
        </button>
      </form>
      {error && <p style={{ color: "#dc3545", fontSize: "0.85rem", marginTop: 6 }}>{error}</p>}
    </>
  );
}
