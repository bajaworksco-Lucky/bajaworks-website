// functions/api/stripe-webhook.js
// Emails you a full order summary the moment a checkout completes.
//
// Setup:
// 1. Stripe Dashboard → Developers → Webhooks → Add endpoint
//    URL: https://bajaworksco.com/api/stripe-webhook
//    Event: checkout.session.completed
// 2. Copy the signing secret into Cloudflare Pages env var STRIPE_WEBHOOK_SECRET
// 3. Uses the same RESEND_API_KEY / NOTIFY_EMAIL / STRIPE_SECRET_KEY env vars

import Stripe from "stripe";

export async function onRequestPost({ request, env }) {
  const stripe = new Stripe(env.STRIPE_SECRET_KEY);
  const signature = request.headers.get("stripe-signature");
  const payload = await request.text();

  let event;
  try {
    // NOTE: must be the Async variant — the sync version doesn't work in
    // the Cloudflare Workers runtime (no synchronous crypto).
    event = await stripe.webhooks.constructEventAsync(
      payload,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // Pull the line items for the order summary
    let itemsHtml = "<li>(could not load line items — check Stripe dashboard)</li>";
    try {
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 50 });
      itemsHtml = lineItems.data
        .map(
          (li) =>
            `<li><strong>${li.quantity}×</strong> ${escapeHtml(li.description || "Item")} — $${((li.amount_total || 0) / 100).toFixed(2)}</li>`
        )
        .join("");
    } catch (err) {
      console.error("Could not fetch line items:", err);
    }

    const total = ((session.amount_total || 0) / 100).toFixed(2);
    const customerEmail = session.customer_details?.email || "not provided";
    const customerName = session.customer_details?.name || "";

    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Baja Works Orders <orders@bajaworksco.com>",
          to: [env.NOTIFY_EMAIL],
          subject: `💰 New order — $${total}`,
          html: `
            <div style="font-family:sans-serif;max-width:520px;">
              <h2 style="margin:0 0 16px;">New order: $${total}</h2>
              <p style="margin:0 0 6px;"><strong>Customer:</strong> ${escapeHtml(customerName)} (${escapeHtml(customerEmail)})</p>
              <p style="margin:0 0 16px;color:#666;font-size:13px;">Session: ${session.id}</p>
              <h3 style="margin:0 0 8px;">Items</h3>
              <ul style="margin:0 0 20px;padding-left:20px;line-height:1.8;">${itemsHtml}</ul>
              <p style="color:#999;font-size:12px;">
                If this order includes custom artwork, watch for the customer's file email referencing their order.
                Full details in your <a href="https://dashboard.stripe.com/payments">Stripe dashboard</a>.
              </p>
            </div>`,
        }),
      });
    } catch (err) {
      console.error("Order notification email failed:", err);
    }
  }

  // Always 200 so Stripe doesn't retry endlessly
  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
