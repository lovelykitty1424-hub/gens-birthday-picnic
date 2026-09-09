import { db } from "../../../lib";

export async function GET() {
  const sql = db();
  const rows = await sql`
    SELECT id, name, attending, created_at
    FROM rsvps
    ORDER BY created_at DESC
  `;
  return Response.json(rows);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const attending = Boolean(body.attending);

    if (!name) return Response.json({ error: "Name is required." }, { status: 400 });

    const sql = db();
    const rows = await sql`
      INSERT INTO rsvps (name, attending)
      VALUES (${name}, ${attending})
      RETURNING id, name, attending, created_at
    `;
    return Response.json(rows[0], { status: 201 });
  } catch (error) {
    return Response.json({ error: "Could not save RSVP." }, { status: 500 });
  }
}
