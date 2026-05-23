import { cms } from "@/lib/cms";
import { TwoColumnLayout } from "@/components/ContentBlock";
import type { Metadata } from "next";

async function getHomePage() {
  try {
    // Try home_only first, fall back to first page
    const data = await cms<{ pages: any[] }>("/pages", { home_only: "true" });
    if (data.pages.length > 0) return data.pages[0];

    // If no home page flagged, get all pages and use first one
    const all = await cms<{ pages: any[] }>("/pages");
    return all.pages[0] || null;
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomePage();
  if (!page) return {};
  return {
    title: page.meta?.title || page.title,
    description: page.meta?.description || undefined,
  };
}

export default async function HomePage() {
  const page = await getHomePage();

  if (!page) {
    return (
      <div className="container page">
        <h1>Welcome</h1>
        <p>No home page has been created yet. Add one in the CMS.</p>
      </div>
    );
  }

  return (
    <div className="container page">
      <TwoColumnLayout content={page.headless_content} />
    </div>
  );
}
