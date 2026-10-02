export type ProjectInput = { title: string; authors: string; summary: string; problem: string; solution: string; tools: string; category: string; url: string };
export const categories = ["Gestão", "Finanças", "Marketing", "Educação", "Saúde", "Sustentabilidade", "Outros"];
export function parseInput(value: unknown): ProjectInput {
  if (!value || typeof value !== "object") throw new Error("Dados inválidos.");
  const data = value as Record<string, unknown>;
  const field = (key: string, max: number) => {
    if (data[key] !== undefined && typeof data[key] !== "string") throw new Error(`Campo ${key} inválido.`);
    const text = String(data[key] ?? "").trim();
    if (text.length > max) throw new Error(`Campo ${key} muito longo.`);
    return text;
  };
  const input = { title: field("title", 120), authors: field("authors", 180), summary: field("summary", 600), problem: field("problem", 1200), solution: field("solution", 1200), tools: field("tools", 250), category: field("category", 50), url: field("url", 500) };
  if (!input.title || !input.authors || !input.summary) throw new Error("Preencha título, autores e resumo.");
  if (!categories.includes(input.category)) throw new Error("Categoria inválida.");
  if (input.url) {
    try { const u = new URL(input.url); if (!["http:", "https:"].includes(u.protocol)) throw new Error(); }
    catch { throw new Error("Informe uma URL começando com https:// ou http://."); }
  }
  return input;
}
export function failure(error: unknown) {
  if (error instanceof Error && (error.message.includes("Campo ") || error.message.includes("Preencha ") || error.message.includes("Categoria ") || error.message.includes("URL ") || error.message.includes("Dados inválidos"))) return Response.json({ error: error.message }, { status: 400 });
  console.error("Falha ao acessar projetos", error);
  return Response.json({ error: "Não foi possível acessar os projetos. Tente novamente." }, { status: 500 });
}
