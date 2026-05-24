/**
 * Auth Bar — SquarefloCMS Bravo Template
 * ========================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Thin dark bar shown above the navigation when a CMS user is signed in.
 * Displays the user's first name on the left and a sign-out link on the right.
 *
 * Only shown for users with roles: site_owner, super_admin, page_builder.
 *
 * This is a client component because it checks auth state on mount
 * and handles the sign-out action.
 *
 * CSS: src/styles/header.css (.auth-bar)
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthUser {
  first_name: string;
  last_name: string;
  role: string;
}

const ALLOWED_ROLES = ["site_owner", "super_admin", "page_builder"];

export default function AuthBar() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    // Only check auth if the cookie exists (avoids 401 console noise)
    if (!document.cookie.includes("sqf_token")) return;
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (data?.user && ALLOWED_ROLES.includes(data.user.role)) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  if (!user) return null;

  async function handleSignOut() {
    await fetch("/api/auth/sign-out", { method: "POST" });
    setUser(null);
    router.refresh();
  }

  return (
    <div className="auth-bar">
      <div className="auth-bar__inner">
        <span className="auth-bar__greeting">
          {user.first_name}, you are signed in.
        </span>
        <button className="auth-bar__sign-out" onClick={handleSignOut}>
          Sign out
        </button>
      </div>
    </div>
  );
}
