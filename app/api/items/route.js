import { db } from "../../../lib";

export async function GET() {
  const sql = db();
  const rows = await sql`
    SELECT id, item, claimed_by, created_at
    FROM picnic_items
    ORDER BY created_at ASC
  `;
  return Response.json(rows);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const item = String(body.item || "").trim();
    const claimedBy = String(body.claimedBy || "").trim();

    if (!item) return Response.json({ error: "Item is required." }, { status: 400 });
    if (!claimedBy) return Response.json({ error: "Name is required." }, { status: 400 });

    const sql = db();
    const rows = await sql`
      INSERT INTO picnic_items (item, claimed_by)
      VALUES (${item}, ${claimedBy})
      RETURNING id, item, claimed_by, created_at
    `;
    return Response.json(rows[0], { status: 201 });
  } catch (error) {
    return Response.json({ error: "Could not add item." }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const id = Number(body.id);
    const claimedBy = String(body.claimedBy || "").trim();

    if (!id || !claimedBy) {
      return Response.json({ error: "Item and name are required." }, { status: 400 });
    }

    const sql = db();
    const rows = await sql`
      UPDATE picnic_items
      SET claimed_by = ${claimedBy}
      WHERE id = ${id} AND (claimed_by IS NULL OR claimed_by = '')
      RETURNING id, item, claimed_by, created_at
    `;

    if (!rows.length) {
      return Response.json({ error: "That item was already claimed." }, { status: 409 });
    }

    return Response.json(rows[0]);
  } catch (error) {
    return Response.json({ error: "Could not claim item." }, { status: 500 });
  }
}
