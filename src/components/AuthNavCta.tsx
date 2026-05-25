/**
 * Auth-Aware Nav CTA — SquarefloCMS Bravo Template
 * ==================================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Client component that replaces the static "Sign In" CTA in the header.
 * Shows "MY ACCOUNT" linking to /my-account when signed in,
 * otherwise shows the original CTA label/link from the CMS nav item.
 */

"use client";

import { useEffect, useState } from "react";

interface AuthNavCtaProps {
  defaultLabel: string;
  defaultUrl: string;
  className: string;
}

export default function AuthNavCta({ defaultLabel, defaultUrl, className }: AuthNavCtaProps) {
  const [signedIn, setSignedIn] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "same-origin" })
      .then((res) => res.json())
      .then((data) => {
        if (data?.user?.id) setSignedIn(true);
      })
      .catch(() => {})
      .finally(() => setChecked(true));
  }, []);

  if (!checked) {
    return (
      <a href={defaultUrl} className={className}>
        {defaultLabel}
      </a>
    );
  }

  if (signedIn) {
    return (
      <a href="/my-account" className={className}>
        My Account
      </a>
    );
  }

  return (
    <a href={defaultUrl} className={className}>
      {defaultLabel}
    </a>
  );
}
