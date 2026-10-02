import { desc } from "drizzle-orm";
import { getDb } from "../../../db";
import { projects } from "../../../db/schema";
import { failure, parseInput } from "./common";
export async function GET() {
  try { return Response.json({ projects: await getDb().select().from(projects).orderBy(desc(projects.createdAt), desc(projects.id)).limit(500) }); }
  catch (error) { return failure(error); }
}
export async function POST(request: Request) {
  try { const input = parseInput(await request.json()); const [project] = await getDb().insert(projects).values(input).returning(); return Response.json({ project }, { status: 201 }); }
  catch (error) { return failure(error); }
}
