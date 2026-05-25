/**
 * My Account Page — SquarefloCMS Bravo Template
 * ================================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Protected page for signed-in users. Shows tabs for
 * "My Profile" and "Sign Out".
 */

import type { Metadata } from "next";
import MyAccountClient from "@/components/MyAccountClient";

export const metadata: Metadata = {
  title: "My Account",
};

export default function MyAccountPage() {
  return (
    <main className="page">
      <div className="container">
        <MyAccountClient />
      </div>
    </main>
  );
}
