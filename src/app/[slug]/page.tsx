import { cms } from "@/lib/cms";
import { TwoColumnLayout } from "@/components/ContentBlock";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { page } = await cms<{ page: any }>(`/pages/${slug}`);
    return {
      title: page.meta?.title || page.title,
      description: page.meta?.description || undefined,
    };
  } catch {
    return {};
  }
}

export async function generateStaticParams() {
  try {
    const { pages } = await cms<{ pages: any[] }>("/pages");
    return pages
      .filter((p) => !p.is_home)
      .map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;

  let page;
  try {
    const data = await cms<{ page: any }>(`/pages/${slug}`);
    page = data.page;
  } catch {
    notFound();
  }

  if (!page) notFound();

  return (
    <div className="container page">
      <h1 className="page-title">{page.title}</h1>
      <hr className="page-title-rule" />
      <TwoColumnLayout content={page.headless_content} />
    </div>
  );
}
