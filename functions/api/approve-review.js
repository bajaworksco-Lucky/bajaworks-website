// functions/api/approve-review.js
// GET /api/approve-review?id=12&token=...
// Hit from the link in the moderation email. The token is generated per-review
// and stored in D1, so only someone with the email can approve.

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const token = url.searchParams.get("token");

  const page = (title, message, ok) =>
    new Response(
      `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head>
      <body style="font-family:sans-serif;background:#0D0D0B;color:#E8E4DF;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;">
        <div style="text-align:center;padding:24px;">
          <h1 style="letter-spacing:2px;color:${ok ? "#C4A070" : "#E8753A"};">${title}</h1>
          <p style="color:rgba(232,228,223,0.6);">${message}</p>
        </div>
      </body></html>`,
      { status: ok ? 200 : 400, headers: { "Content-Type": "text/html" } }
    );

  if (!id || !token) return page("Invalid Link", "Missing parameters.", false);

  const review = await env.DB.prepare(
    "SELECT id, approved FROM reviews WHERE id = ? AND approve_token = ?"
  )
    .bind(id, token)
    .first();

  if (!review)
    return page("Not Found", "This review doesn't exist or the link is invalid.", false);

  if (review.approved)
    return page("Already Live", "This review was already approved and is on the site.", true);

  await env.DB.prepare("UPDATE reviews SET approved = 1 WHERE id = ?").bind(id).run();

  return page("Review Published", "It's live on the product page now.", true);
}
