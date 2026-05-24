/**
 * Sign-In Page — SquarefloCMS Bravo Template
 * =============================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * CMS system page (slug: "sign-in", is_system: true).
 * Renders a centered auth card with a sign-in form.
 * Uses its own layout — no site header or footer.
 *
 * On successful sign-in the user is redirected to the home page (/).
 *
 * Design Reference:
 *   - html-reference/sign-in-r4m7t9w2qx.html
 */

import SignInForm from "@/components/SignInForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
};

export default async function SignInPage() {
  return (
    <main>
      <div className="auth-wrap">
        <div className="auth-card">
          <h1 className="auth-card__title">Welcome back</h1>
          <p className="auth-card__subtitle">Sign in to your account</p>

          <SignInForm />
        </div>
      </div>
    </main>
  );
}
