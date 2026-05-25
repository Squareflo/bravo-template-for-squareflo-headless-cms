/**
 * Verify Email Page — SquarefloCMS Bravo Template
 * =================================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * 6-digit verification code entry page shown after sign-up.
 * The email address is passed via ?email= query parameter.
 *
 * Design Reference:
 *   - html-reference/verify-email-b6n3k8q5jw.html
 */

import { Suspense } from "react";
import VerifyEmailForm from "@/components/VerifyEmailForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Your Email",
};

export default function VerifyEmailPage() {
  return (
    <main>
      <div className="auth-wrap">
        <div className="auth-card auth-card--verify">
          <div className="verify__icon">
            <i className="fas fa-envelope-open-text" />
          </div>
          <h1 className="auth-card__title">Check your email</h1>
          <p className="auth-card__subtitle">
            We sent a 6-digit verification code to your email.
            Look for an email from <strong>SquarefloCMS</strong> — it may take a moment to arrive.
            Enter the code below to confirm your address.
          </p>

          <Suspense>
            <VerifyEmailForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
