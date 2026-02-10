import Stripe from "stripe";

export async function onRequestPost({ request, env }) {
  const stripe = new Stripe(env.STRIPE_SECRET_KEY);

  const { items } = await request.json(); // [{name, price, qty}]
  const line_items = items.map((i) => ({
    price_data: {
      currency: "usd",
      product_data: { name: i.name },
      unit_amount: i.price
    },
    quantity: i.qty
  }));

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items,
    success_url: "https://bajaworksco.com/success",
    cancel_url: "https://bajaworksco.com/cart"
  });

  return new Response(JSON.stringify({ url: session.url }), {
    headers: { "Content-Type": "application/json" }
  });
}
