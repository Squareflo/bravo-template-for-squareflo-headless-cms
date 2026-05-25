/**
 * Sign-Up Page — SquarefloCMS Bravo Template
 * =============================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * User registration page. Collects name, email, password, and
 * optional subscriber group opt-ins. On success redirects to
 * /verify-email for the 6-digit code entry.
 *
 * Design Reference:
 *   - html-reference/sign-up-b6n3k8q5jw.html
 */

import { Suspense } from "react";
import SignUpForm from "@/components/SignUpForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
};

export default function SignUpPage() {
  return (
    <main>
      <div className="auth-wrap">
        <div className="auth-card">
          <h1 className="auth-card__title">Create your account</h1>
          <p className="auth-card__subtitle">Join us to get started</p>

          <Suspense>
            <SignUpForm />
          </Suspense>

          <p className="auth-card__footer">
            Already have an account? <a href="/sign-in">Sign in</a>
          </p>
        </div>
      </div>
    </main>
  );
}
