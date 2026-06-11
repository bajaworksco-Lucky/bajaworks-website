// functions/api/reviews.js
// GET  /api/reviews?product_id=c-013  → approved reviews for a product
// POST /api/reviews                   → submit a review (held for approval)
//
// Required Cloudflare Pages bindings/env vars:
//   DB              — D1 database binding (bajaworks-reviews)
//   RESEND_API_KEY  — Resend API key (free tier: 3,000 emails/mo)
//   NOTIFY_EMAIL    — where moderation emails go (bajaworksco@gmail.com)
//   SITE_URL        — https://bajaworksco.com

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const productId = url.searchParams.get("product_id");
  if (!productId) return json({ error: "product_id required" }, 400);

  const { results } = await env.DB.prepare(
    "SELECT id, author, rating, text, created_at FROM reviews WHERE product_id = ? AND approved = 1 ORDER BY created_at DESC LIMIT 50"
  )
    .bind(productId)
    .all();

  return json({ reviews: results });
}

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request" }, 400);
  }

  const { productId, author, rating, text, website } = body;

  // Honeypot — real users never fill this hidden field
  if (website) return json({ ok: true });

  // Validation
  if (!productId || typeof productId !== "string" || productId.length > 20)
    return json({ error: "Invalid product" }, 400);
  const name = (author || "").trim().slice(0, 60);
  const reviewText = (text || "").trim().slice(0, 1200);
  const stars = Number(rating);
  if (!name) return json({ error: "Please add your name" }, 400);
  if (reviewText.length < 10)
    return json({ error: "Please write at least a short review" }, 400);
  if (!Number.isInteger(stars) || stars < 1 || stars > 5)
    return json({ error: "Invalid rating" }, 400);

  const token = crypto.randomUUID();

  const result = await env.DB.prepare(
    "INSERT INTO reviews (product_id, author, rating, text, approve_token) VALUES (?, ?, ?, ?, ?)"
  )
    .bind(productId, name, stars, reviewText, token)
    .run();

  const reviewId = result.meta.last_row_id;
  const approveUrl = `${env.SITE_URL}/api/approve-review?id=${reviewId}&token=${token}`;
  const starsDisplay = "★".repeat(stars) + "☆".repeat(5 - stars);

  // Notify Oscar for moderation — failure here shouldn't fail the submission
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Baja Works Reviews <reviews@bajaworksco.com>",
        to: [env.REVIEWS_EMAIL],
        subject: `New review pending: ${productId} — ${starsDisplay}`,
        html: `
          <div style="font-family:sans-serif;max-width:520px;">
            <h2 style="margin:0 0 4px;">New review awaiting approval</h2>
            <p style="color:#666;margin:0 0 16px;">Product: <strong>${productId}</strong></p>
            <p style="font-size:18px;margin:0 0 4px;color:#C4A070;">${starsDisplay}</p>
            <p style="margin:0 0 4px;"><strong>${escapeHtml(name)}</strong></p>
            <blockquote style="margin:8px 0 20px;padding:12px 16px;background:#f6f3ee;border-left:3px solid #C4A070;">
              ${escapeHtml(reviewText)}
            </blockquote>
            <a href="${approveUrl}"
               style="display:inline-block;padding:12px 28px;background:#2A2520;color:#fff;text-decoration:none;border-radius:4px;font-weight:600;">
              Approve &amp; Publish
            </a>
            <p style="color:#999;font-size:12px;margin-top:16px;">
              Ignore this email to leave the review unpublished. Nothing appears on the site until you approve it.
            </p>
          </div>`,
      }),
    });
  } catch (err) {
    console.error("Moderation email failed:", err);
  }

  return json({ ok: true });
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
