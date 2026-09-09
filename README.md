# Gens Birthday Picnic

A pastel birthday picnic invitation with:
- RSVP form (name + attending)
- Shared guest list
- Shared picnic items list
- Guests can claim existing items
- Guests can add their own item
- Data stored in Neon Postgres
- Invitation image included

## Event
- Date: September 14, 2026
- Time: 6:45 PM
- Location: Central Park, near 59th St / Columbus Circle
- Dress code: Pastels

## Deploy with Neon + Vercel

1. Create a Neon Postgres database.
2. Run `db.sql` in the Neon SQL Editor.
3. Put your Neon connection string into `DATABASE_URL`.
4. Push this folder to GitHub.
5. Import the repo into Vercel.
6. Add `DATABASE_URL` to Vercel Project Settings → Environment Variables.
7. Deploy.
8. Share the Vercel URL as your invitation link.

The site refreshes shared data every 5 seconds, so RSVP and item changes appear across guests without requiring a manual refresh.

For a custom domain, add one in Vercel after deployment.
