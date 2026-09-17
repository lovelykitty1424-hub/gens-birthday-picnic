import { db } from "../../../lib";

export async function GET() {
  try {
    const sql = db();
    const rsvps = await sql`SELECT id, name, attending, created_at FROM rsvps ORDER BY created_at ASC`;
    return Response.json({ rsvps });
  } catch (e) {
    return Response.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, attending } = await request.json();
    if (!name || typeof attending !== "boolean") {
      return Response.json({ error: "Nombre y asistencia son obligatorios." }, { status: 400 });
    }
    const sql = db();
    const existing = await sql`SELECT id FROM rsvps WHERE LOWER(name) = LOWER(${name.trim()}) LIMIT 1`;
    if (existing.length) {
      await sql`UPDATE rsvps SET attending=${attending}, updated_at=NOW() WHERE id=${existing[0].id}`;
    } else {
      await sql`INSERT INTO rsvps (name, attending) VALUES (${name.trim()}, ${attending})`;
    }
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: "No se pudo guardar la confirmación." }, { status: 500 });
  }
}
