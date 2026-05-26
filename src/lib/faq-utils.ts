/**
 * FAQ Utilities — SquarefloCMS Bravo Template
 * Powered by SquarefloCMS (https://squareflo.com)
 */

/** Generate a URL-friendly slug from a FAQ question */
export function faqSlug(question: string): string {
  return question
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
