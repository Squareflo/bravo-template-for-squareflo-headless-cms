/**
 * Sign-Up Form — SquarefloCMS Bravo Template
 * =============================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Client component that handles user registration.
 * Fetches public subscriber groups for opt-in checkboxes.
 * On success, redirects to /verify-email?email=... for code entry.
 *
 * Design Reference:
 *   - html-reference/sign-up-b6n3k8q5jw.html
 */

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface SubscriberGroup {
  id: string;
  name: string;
  description?: string;
}

export default function SignUpForm() {
  const searchParams = useSearchParams();
  const prefillEmail = searchParams.get("email") || "";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState(prefillEmail);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState<SubscriberGroup[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/subscriber-groups")
      .then((res) => res.json())
      .then((data) => {
        if (data.groups?.length) {
          setGroups(data.groups);
          setSelectedGroups(data.groups.map((g: SubscriberGroup) => g.id));
        }
      })
      .catch(() => {});
  }, []);

  function toggleGroup(id: string) {
    setSelectedGroups((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id],
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    setLoading(true);

    try {
      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          subscriber_group_ids: selectedGroups,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Sign-up failed. Please try again.");
        setLoading(false);
        return;
      }

      window.location.href = `/verify-email?email=${encodeURIComponent(email)}`;
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form className="auth-card__form" onSubmit={handleSubmit}>
      {error && <div className="auth-card__error">{error}</div>}

      <div className="form-field">
        <label htmlFor="signup-name" className="form-field__label">
          First name
        </label>
        <input
          id="signup-name"
          type="text"
          className="form-field__input"
          placeholder="Jane"
          autoComplete="given-name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="signup-lastname" className="form-field__label">
          Last name
        </label>
        <input
          id="signup-lastname"
          type="text"
          className="form-field__input"
          placeholder="Doe"
          autoComplete="family-name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>

      <div className="form-field">
        <label htmlFor="signup-email" className="form-field__label">
          E-mail
        </label>
        <input
          id="signup-email"
          type="email"
          className="form-field__input"
          placeholder="you@example.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="signup-password" className="form-field__label">
          Password
        </label>
        <input
          id="signup-password"
          type="password"
          className="form-field__input"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />
      </div>

      {groups.length > 0 && (
        <div className="form-field">
          <span className="form-field__label">Subscribe to</span>
          {groups.map((g) => (
            <label key={g.id} className="auth-card__checkbox-label">
              <input
                type="checkbox"
                checked={selectedGroups.includes(g.id)}
                onChange={() => toggleGroup(g.id)}
              />
              {g.name}
            </label>
          ))}
        </div>
      )}

      <button
        type="submit"
        className={`btn btn--block${loading ? " btn--loading" : ""}`}
        disabled={loading}
      >
        {loading ? "Creating account..." : "Create Account"}
      </button>
    </form>
  );
}
