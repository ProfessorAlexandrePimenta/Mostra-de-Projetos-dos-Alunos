import { eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { projects } from "../../../../db/schema";
import { failure, parseInput } from "../common";
function projectId(id: string) { const n = Number(id); return Number.isSafeInteger(n) && n > 0 ? n : null; }
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = projectId((await params).id);
  if (!id) return Response.json({ error: "Projeto inválido." }, { status: 400 });
  try { const input = parseInput(await request.json()); const [project] = await getDb().update(projects).set({ ...input, updatedAt: new Date().toISOString() }).where(eq(projects.id, id)).returning(); return project ? Response.json({ project }) : Response.json({ error: "Projeto não encontrado." }, { status: 404 }); }
  catch (error) { return failure(error); }
}
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = projectId((await params).id);
  if (!id) return Response.json({ error: "Projeto inválido." }, { status: 400 });
  try { const [project] = await getDb().delete(projects).where(eq(projects.id, id)).returning(); return project ? Response.json({ success: true }) : Response.json({ error: "Projeto não encontrado." }, { status: 404 }); }
  catch (error) { return failure(error); }
}
