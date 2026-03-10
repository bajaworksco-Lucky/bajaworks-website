import { useState, useEffect } from 'react';

// Simple global cart store using custom events
const CART_KEY = 'bw-cart';

function getCart() {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(sessionStorage.getItem(CART_KEY) || '[]'); } catch { return []; }
}

function saveCart(cart: any[]) {
  sessionStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent('cart-updated', { detail: cart }));
}

// Expose global add-to-cart function
if (typeof window !== 'undefined') {
  (window as any).addToCart = (product: any) => {
    const cart = getCart();
    const existing = cart.find((item: any) => item.id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }
    saveCart(cart);
  };
}

export default function CartDrawer() {
  const [cart, setCart] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setCart(getCart());

    const handleUpdate = (e: any) => {
      setCart(e.detail || getCart());
      setOpen(true);
    };

    window.addEventListener('cart-updated', handleUpdate);
    return () => window.removeEventListener('cart-updated', handleUpdate);
  }, []);

  const updateQty = (id: string, delta: number) => {
    const updated = cart.map(item => {
      if (item.id !== id) return item;
      return { ...item, qty: Math.max(0, item.qty + delta) };
    }).filter(item => item.qty > 0);
    setCart(updated);
    saveCart(updated);
  };

  const removeItem = (id: string) => {
    const updated = cart.filter(item => item.id !== id);
    setCart(updated);
    saveCart(updated);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const count = cart.reduce((sum, item) => sum + item.qty, 0);

  // Update nav badge
  useEffect(() => {
    const badge = document.getElementById('cart-count');
    if (badge) {
      badge.textContent = String(count);
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  }, [count]);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{ display: 'none' }}
        id="open-cart-trigger"
      />
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200 }}>
      <div
        onClick={() => setOpen(false)}
        style={{
          position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
        }}
      />
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0,
        width: 'min(420px, 90vw)', background: '#111110', color: '#E8E4DF',
        borderLeft: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column',
        animation: 'slide-in 0.3s ease',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: 2 }}>YOUR CART</span>
          <button onClick={() => setOpen(false)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(232,228,223,0.5)', fontSize: 20,
          }}>✕</button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(232,228,223,0.3)', fontSize: 14 }}>
              Your cart is empty
            </div>
          ) : cart.map(item => (
            <div key={item.id} style={{
              padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.04)',
              display: 'flex', gap: 14, alignItems: 'center',
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 6,
                background: 'rgba(196,160,112,0.08)',
                border: '1px solid rgba(255,255,255,0.04)', flexShrink: 0,
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{item.name}</div>
                <div style={{ fontSize: 13, color: '#C4A070' }}>${(item.price / 100).toFixed(2)}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={() => updateQty(item.id, -1)} style={{
                  width: 26, height: 26, borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)',
                  background: 'transparent', color: '#E8E4DF', cursor: 'pointer', fontSize: 14,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>−</button>
                <span style={{ fontSize: 13, width: 20, textAlign: 'center' }}>{item.qty}</span>
                <button onClick={() => updateQty(item.id, 1)} style={{
                  width: 26, height: 26, borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)',
                  background: 'transparent', color: '#E8E4DF', cursor: 'pointer', fontSize: 14,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>+</button>
                <button onClick={() => removeItem(item.id)} style={{
                  marginLeft: 6, background: 'none', border: 'none',
                  cursor: 'pointer', color: 'rgba(232,228,223,0.25)', fontSize: 14,
                }}>✕</button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{ padding: '20px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontSize: 14 }}>
              <span style={{ color: 'rgba(232,228,223,0.5)' }}>Total</span>
              <span style={{ fontWeight: 600, fontSize: 18 }}>${(total / 100).toFixed(2)}</span>
            </div>
            <a href="/cart" style={{
              display: 'block', width: '100%', padding: '14px 0', borderRadius: 4,
              border: 'none', background: '#C4A070', color: '#0D0D0B',
              cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
              fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase',
              textAlign: 'center',
            }}>Checkout</a>
          </div>
        )}
      </div>
    </div>
  );
}
