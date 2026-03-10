import products from '../../data/products.json';

export default function StudioShop() {
  const studioProducts = products.filter((p: any) => p.division === 'studio');

  const addToCart = (product: any) => {
    if (typeof window !== 'undefined' && (window as any).addToCart) {
      (window as any).addToCart(product);
    }
  };

  return (
    <div style={{ padding: '56px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(18px, 4vw, 40px)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 28, flexWrap: 'wrap', gap: 8 }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, letterSpacing: 2, margin: 0 }}>Shop Studio</h2>
          <span style={{ fontSize: 12.5, color: 'rgba(17,17,17,0.3)' }}>{studioProducts.length} items</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }} className="product-grid">
          {studioProducts.map((product: any, i: number) => (
            <div key={product.id} className="product-card" style={{ cursor: 'pointer' }}>
              <div style={{
                height: 190,
                background: `linear-gradient(135deg, rgba(232,117,58,${0.04 + (i % 3) * 0.02}), rgba(196,160,112,${0.03 + (i % 3) * 0.01}))`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
              }}>
                <span style={{ fontSize: 36, color: 'rgba(17,17,17,0.05)' }}>▣</span>
                {product.badge && (
                  <span style={{
                    position: 'absolute', top: 12, left: 12,
                    padding: '3px 10px', borderRadius: 3,
                    background: product.badge === 'New' ? '#E8753A' : 'rgba(139,109,79,0.8)',
                    color: '#fff', fontSize: 10, fontWeight: 600,
                    letterSpacing: 1, textTransform: 'uppercase',
                  }}>{product.badge}</span>
                )}
              </div>
              <div style={{ padding: '14px 16px 16px' }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#111', marginBottom: 6, lineHeight: 1.4 }}>{product.name}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: '#E8753A' }}>${(product.price / 100).toFixed(2)}</span>
                  <button onClick={() => addToCart(product)} style={{
                    padding: '6px 14px', borderRadius: 4, cursor: 'pointer',
                    fontFamily: "'Outfit', sans-serif", fontSize: 11,
                    fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase',
                    background: '#111', border: 'none', color: '#F2F0EC',
                  }}>Add</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
