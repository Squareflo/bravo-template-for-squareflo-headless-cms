const API_URL = process.env.SQUAREFLO_API_URL!;
const API_KEY = process.env.SQUAREFLO_API_KEY!;

export async function cms<T>(
  endpoint: string,
  params?: Record<string, string>,
): Promise<T> {
  const url = new URL(`${API_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const res = await fetch(url.toString(), {
    headers: { "x-api-key": API_KEY },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`CMS API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
