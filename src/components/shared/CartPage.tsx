import { useState, useEffect } from 'react';

function getCart() {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(sessionStorage.getItem('bw-cart') || '[]'); } catch { return []; }
}

function saveCart(cart: any[]) {
  sessionStorage.setItem('bw-cart', JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent('cart-updated', { detail: cart }));
}

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    setCart(getCart());
    const handler = (e: any) => setCart(e.detail || getCart());
    window.addEventListener('cart-updated', handler);
    return () => window.removeEventListener('cart-updated', handler);
  }, []);

  const updateQty = (id: string, delta: number) => {
    const updated = cart.map(item => item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item).filter(i => i.qty > 0);
    setCart(updated);
    saveCart(updated);
  };

  const removeItem = (id: string) => {
    const updated = cart.filter(i => i.id !== id);
    setCart(updated);
    saveCart(updated);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleCheckout = async () => {
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(item => ({ name: item.name, price: item.price, qty: item.qty })),
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error('Checkout error:', err);
    }
  };

  return (
    <section style={{ maxWidth: 700, margin: '0 auto', padding: '76px clamp(18px, 4vw, 40px) 100px' }}>
      <h1 style={{
        fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(36px, 6vw, 56px)',
        letterSpacing: 2, margin: '0 0 36px',
      }}>Your Cart</h1>

      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <p style={{ fontSize: 15, color: 'rgba(232,228,223,0.35)', marginBottom: 24 }}>Your cart is empty.</p>
          <a href="/casa" style={{
            display: 'inline-block', padding: '12px 28px', borderRadius: 4,
            border: '1px solid rgba(196,160,112,0.3)', background: 'transparent',
            color: '#C4A070', fontFamily: "'Outfit', sans-serif", fontSize: 12.5,
            letterSpacing: 1.5, textTransform: 'uppercase',
          }}>Browse Products</a>
        </div>
      ) : (
        <>
          {cart.map(item => (
            <div key={item.id} style={{
              padding: '20px 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
              display: 'flex', gap: 16, alignItems: 'center',
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: 6,
                background: 'rgba(196,160,112,0.06)', border: '1px solid rgba(255,255,255,0.04)',
                flexShrink: 0,
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>{item.name}</div>
                <div style={{ fontSize: 14, color: '#C4A070' }}>${(item.price / 100).toFixed(2)}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button onClick={() => updateQty(item.id, -1)} style={{
                  width: 30, height: 30, borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)',
                  background: 'transparent', color: '#E8E4DF', cursor: 'pointer', fontSize: 15,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>−</button>
                <span style={{ fontSize: 14, width: 24, textAlign: 'center' }}>{item.qty}</span>
                <button onClick={() => updateQty(item.id, 1)} style={{
                  width: 30, height: 30, borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)',
                  background: 'transparent', color: '#E8E4DF', cursor: 'pointer', fontSize: 15,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>+</button>
                <button onClick={() => removeItem(item.id)} style={{
                  marginLeft: 10, background: 'none', border: 'none',
                  cursor: 'pointer', color: 'rgba(232,228,223,0.25)', fontSize: 15,
                }}>✕</button>
              </div>
            </div>
          ))}

          <div style={{ padding: '28px 0', borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <span style={{ fontSize: 14, color: 'rgba(232,228,223,0.5)' }}>Total</span>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: 1 }}>${(total / 100).toFixed(2)}</span>
            </div>
            <button onClick={handleCheckout} style={{
              width: '100%', padding: '15px 0', borderRadius: 4, border: 'none',
              background: '#C4A070', color: '#0D0D0B', cursor: 'pointer',
              fontFamily: "'Outfit', sans-serif", fontSize: 14,
              fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase',
            }}>Proceed to Checkout</button>
            <p style={{ fontSize: 12, color: 'rgba(232,228,223,0.25)', textAlign: 'center', marginTop: 12 }}>
              Secure checkout powered by Stripe
            </p>
          </div>
        </>
      )}
    </section>
  );
}
