import { useState } from 'react';
import products from '../../data/products.json';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: '◆' },
  { id: 'home', label: 'Home', icon: '⬡' },
  { id: 'kids', label: 'Kids', icon: '△' },
  { id: 'pets', label: 'Pets', icon: '◎' },
  { id: 'gifts', label: 'Gifts & Custom', icon: '◇' },
];

export default function CasaShop() {
  const [active, setActive] = useState('all');
  const casaProducts = products.filter((p: any) => p.division === 'casa' && (active === 'all' || p.category === active));

  const addToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window !== 'undefined' && (window as any).addToCart) {
      (window as any).addToCart(product);
    }
  };

  return (
    <>
      {/* Category Tabs */}
      <div style={{
        borderBottom: '1px solid rgba(26,26,26,0.07)',
        position: 'sticky', top: 64, zIndex: 50,
        background: 'rgba(250,247,241,0.96)', backdropFilter: 'blur(12px)',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: '0 clamp(18px, 4vw, 40px)',
          display: 'flex', gap: 2, overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}>
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setActive(cat.id)} style={{
              padding: '14px 16px', border: 'none', cursor: 'pointer', background: 'transparent',
              fontFamily: "'Outfit', sans-serif", fontSize: 12.5,
              letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 500,
              color: active === cat.id ? '#2A2520' : 'rgba(26,26,26,0.3)',
              borderBottom: active === cat.id ? '2px solid #C4A070' : '2px solid transparent',
              transition: 'all 0.2s', whiteSpace: 'nowrap',
              minHeight: 48,
            }}>{cat.icon} {cat.label}</button>
          ))}
        </div>
      </div>

      {/* Products */}
      <div style={{ padding: '48px 0 72px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(18px, 4vw, 40px)' }}>
          <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, letterSpacing: 2, margin: 0, color: '#2A2520' }}>
              {CATEGORIES.find(c => c.id === active)?.label || 'All'}
            </h2>
            <span style={{ fontSize: 12.5, color: 'rgba(26,26,26,0.35)' }}>{casaProducts.length} items</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }} className="product-grid">
            {casaProducts.map((product: any, i: number) => (
              <a
                key={product.id}
                href={`/casa/${product.id}`}
                className="product-card"
                style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit', display: 'block' }}
              >
                <div style={{
                  height: 190,
                  background: `linear-gradient(135deg, rgba(196,160,112,${0.06 + (i % 3) * 0.02}), rgba(168,145,122,${0.04 + (i % 3) * 0.015}))`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative',
                }}>
                  <span style={{ fontSize: 36, color: 'rgba(26,26,26,0.06)' }}>⬡</span>
                  {product.badge && (
                    <span style={{
                      position: 'absolute', top: 12, left: 12,
                      padding: '3px 10px', borderRadius: 3,
                      background: product.badge === 'New' ? '#C4A070' : product.badge === 'Best Seller' ? '#E8753A' : 'rgba(139,109,79,0.8)',
                      color: '#fff', fontSize: 10, fontWeight: 600,
                      letterSpacing: 1, textTransform: 'uppercase',
                    }}>{product.badge}</span>
                  )}
                </div>
                <div style={{ padding: '14px 16px 16px' }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#2A2520', marginBottom: 6, lineHeight: 1.4 }}>{product.name}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: '#8B6D4F' }}>${(product.price / 100).toFixed(2)}</span>
                    <button onClick={(e) => addToCart(e, product)} style={{
                      padding: '6px 14px', borderRadius: 4, cursor: 'pointer',
                      fontFamily: "'Outfit', sans-serif", fontSize: 11,
                      fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase',
                      background: '#2A2520', border: 'none', color: '#FAF7F1',
                      transition: 'opacity 0.2s',
                    }}>Add</button>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
