/**
 * Verify Email Form — SquarefloCMS Bravo Template
 * =================================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Client component for the 6-digit email verification code entry.
 * Auto-advances between digit inputs, supports paste, and backspace navigation.
 * On success, redirects to /signup-success.
 *
 * Design Reference:
 *   - html-reference/verify-email-b6n3k8q5jw.html
 */

"use client";

import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  function updateDigit(idx: number, value: string) {
    const v = value.replace(/[^0-9]/g, "").slice(0, 1);
    setDigits((prev) => {
      const next = [...prev];
      next[idx] = v;
      return next;
    });
    if (v && idx < 5) {
      inputRefs.current[idx + 1]?.focus();
    }
  }

  function handleKeyDown(idx: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  }

  function handlePaste(idx: number, e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "");
    setDigits((prev) => {
      const next = [...prev];
      for (let j = 0; j < pasted.length && idx + j < 6; j++) {
        next[idx + j] = pasted[j];
      }
      return next;
    });
    const nextEmpty = Math.min(idx + pasted.length, 5);
    inputRefs.current[nextEmpty]?.focus();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = digits.join("");
    if (code.length < 6) {
      setError("Please enter the full 6-digit code.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Verification failed. Please try again.");
        setLoading(false);
        return;
      }

      window.location.href = `/signup-success?email=${encodeURIComponent(email)}`;
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  async function handleResend() {
    setResendMsg("");
    setError("");

    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to resend code.");
        return;
      }

      setResendMsg("A new code has been sent to your email.");
    } catch {
      setError("Failed to resend code. Please try again.");
    }
  }

  return (
    <form className="verify__form" onSubmit={handleSubmit}>
      {error && <div className="auth-card__error">{error}</div>}
      {resendMsg && <div className="auth-card__success">{resendMsg}</div>}

      <div className="verify__code">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            className="verify__digit"
            aria-label={`Digit ${i + 1}`}
            autoFocus={i === 0}
            value={d}
            onChange={(e) => updateDigit(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={(e) => handlePaste(i, e)}
          />
        ))}
      </div>

      <button
        type="submit"
        className={`btn btn--block${loading ? " btn--loading" : ""}`}
        disabled={loading}
      >
        {loading ? "Verifying..." : "Verify Email"}
      </button>

      <p className="verify__resend">
        Didn&apos;t get the code?{" "}
        <button type="button" className="verify__resend-btn" onClick={handleResend}>
          Resend code
        </button>
      </p>
      <p className="verify__resend">
        Wrong email? <a href={`/sign-up?email=${encodeURIComponent(email)}`}>Use a different address</a>
      </p>
    </form>
  );
}
