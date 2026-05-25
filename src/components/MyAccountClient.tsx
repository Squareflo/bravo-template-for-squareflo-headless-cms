/**
 * My Account Client — SquarefloCMS Bravo Template
 * ==================================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Client component that checks auth state and renders
 * tabbed account UI or redirects to sign-in.
 */

"use client";

import { useEffect, useState } from "react";

interface AuthUser {
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

type Tab = "profile" | "signout";

export default function MyAccountClient() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checking, setChecking] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
        } else {
          window.location.href = "/sign-in";
        }
      })
      .catch(() => {
        window.location.href = "/sign-in";
      })
      .finally(() => setChecking(false));
  }, []);

  async function handleSignOut() {
    await fetch("/api/auth/sign-out", { method: "POST" });
    window.location.href = "/";
  }

  if (checking) return null;
  if (!user) return null;

  return (
    <div className="my-account">
      <h1 className="my-account__title">My Account</h1>

      <div className="my-account__tabs">
        <button
          className={`my-account__tab${activeTab === "profile" ? " my-account__tab--active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          My Profile
        </button>
        <button
          className={`my-account__tab${activeTab === "signout" ? " my-account__tab--active" : ""}`}
          onClick={handleSignOut}
        >
          Sign Out
        </button>
      </div>

      {activeTab === "profile" && (
        <div className="my-account__panel">
          <div className="my-account__field">
            <span className="my-account__label">First Name</span>
            <span className="my-account__value">{user.first_name}</span>
          </div>
          <div className="my-account__field">
            <span className="my-account__label">Last Name</span>
            <span className="my-account__value">{user.last_name || "—"}</span>
          </div>
          <div className="my-account__field">
            <span className="my-account__label">Email</span>
            <span className="my-account__value">{user.email}</span>
          </div>
        </div>
      )}
    </div>
  );
}
