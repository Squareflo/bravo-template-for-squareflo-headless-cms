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
            Welcome aboard. Your email is verified and your account is ready to go.
          </p>

          <div className="success-next-steps">
            <div className="success-next-step">
              <div className="success-next-step__icon">
                <i className="fas fa-bookmark" />
              </div>
              <h3 className="success-next-step__title">Add us to your contacts</h3>
              <p className="success-next-step__text">
                So our emails skip the spam folder and reach your inbox cleanly.
              </p>
            </div>
            <div className="success-next-step">
              <div className="success-next-step__icon">
                <i className="fas fa-book-open" />
              </div>
              <h3 className="success-next-step__title">Explore the site</h3>
              <p className="success-next-step__text">
                Browse our content, products, and services now that you have an account.
              </p>
            </div>
            <div className="success-next-step">
              <div className="success-next-step__icon">
                <i className="fas fa-share-alt" />
              </div>
              <h3 className="success-next-step__title">Tell a friend</h3>
              <p className="success-next-step__text">
                If you think someone you know would enjoy it, pass it along.
              </p>
            </div>
          </div>

          <div className="success-actions">
            <a href="/" className="btn">Back to Home</a>
            <a href="/sign-in" className="btn btn--secondary">Sign In</a>
          </div>
        </div>
      </div>
    </main>
  );
}
