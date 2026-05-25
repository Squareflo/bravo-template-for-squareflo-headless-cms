/**
 * Signup Success Page — SquarefloCMS Bravo Template
 * ===================================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Shown after successful email verification. Displays a welcome
 * message and next-step cards.
 *
 * Design Reference:
 *   - html-reference/signup-success-b6n3k8q5jw.html
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "You're In!",
};

export default function SignupSuccessPage() {
  return (
    <main className="page">
      <div className="container">
        <div className="success-wrap">
          <div className="success-icon">
            <i className="fas fa-check" />
          </div>
          <h1 className="success-title">You&apos;re in!</h1>
          <p className="success-subtitle">
            Your email is verified and your account is ready.
            Sign in to access your account area.
          </p>

          <div className="success-actions">
            <a href="/sign-in" className="btn">Sign In</a>
          </div>
        </div>
      </div>
    </main>
  );
}
