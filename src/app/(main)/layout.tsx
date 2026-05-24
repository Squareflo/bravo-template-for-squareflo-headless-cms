/**
 * Main Layout — SquarefloCMS Bravo Template
 * ============================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Layout for all standard pages (home, [slug], etc.).
 * Renders the site header with navigation. Auth pages use a separate
 * (auth) route group and don't get this header.
 */

import { cms } from "@/lib/cms";
import { NavItem, SiteSettings } from "@/lib/types";
import Header from "@/components/Header";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let settings: SiteSettings | null = null;
  let headerNav: NavItem[] = [];

  try {
    [settings, { navigation: headerNav }] = await Promise.all([
      cms<SiteSettings>("/settings"),
      cms<{ navigation: NavItem[] }>("/navigation", { location: "header" }),
    ]);
  } catch (e) {
    console.error("Failed to fetch CMS data:", e);
  }

  return (
    <>
      {settings && <Header nav={headerNav} settings={settings} />}
      <main>{children}</main>
    </>
  );
}
