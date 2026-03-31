import { useState } from 'react';

interface ProductOption {
  label: string;
  value: string;
  priceAdd?: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  division: string;
  category: string;
  badge?: string | null;
  image: string;
  images?: string[];
  description?: string;
  features?: string[];
  materials?: string[];
  options?: ProductOption[];
  care?: string;
}

const PLACEHOLDER_REVIEWS = [
  { author: 'Maria L.', rating: 5, date: 'Mar 2026', text: 'Beautifully made. The wood grain is gorgeous and you can tell it was crafted with real care. Arrived well-packaged too.' },
  { author: 'James T.', rating: 5, date: 'Feb 2026', text: 'Bought this as a gift and they loved it. Quality is top-notch — feels substantial and looks even better in person.' },
  { author: 'Sofia R.', rating: 4, date: 'Jan 2026', text: 'Great craftsmanship. Took a couple extra days to ship but well worth the wait. Would order again.' },
];

export default function ProductDetail({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedOption, setSelectedOption] = useState(product.options?.[0]?.value || '');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');

  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const optionPriceAdd = product.options?.find(o => o.value === selectedOption)?.priceAdd || 0;
  const totalPrice = product.price + optionPriceAdd;

  const addToCart = () => {
    if (typeof window !== 'undefined' && (window as any).addToCart) {
      const cartProduct = {
        ...product,
        price: totalPrice,
        name: selectedOption && product.options
          ? `${product.name} — ${product.options.find(o => o.value === selectedOption)?.label || ''}`
          : product.name,
      };
      for (let i = 0; i < qty; i++) {
        (window as any).addToCart(cartProduct);
      }
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const avgRating = (PLACEHOLDER_REVIEWS.reduce((sum, r) => sum + r.rating, 0) / PLACEHOLDER_REVIEWS.length).toFixed(1);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px clamp(18px, 4vw, 40px) 80px' }}>

      {/* Breadcrumb */}
      <nav style={{ fontSize: 12.5, color: 'rgba(26,26,26,0.35)', marginBottom: 28, display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
        <a href="/" style={{ color: 'rgba(26,26,26,0.35)' }}>Home</a>
        <span>›</span>
        <a href="/casa" style={{ color: 'rgba(26,26,26,0.35)' }}>Casa Baja</a>
        <span>›</span>
        <span style={{ color: '#2A2520' }}>{product.name}</span>
      </nav>

      {/* Main Grid */}
      <div className="pdp-grid" style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 'clamp(28px, 4vw, 56px)', alignItems: 'start' }}>

        {/* LEFT: Image Gallery */}
        <div>
          <div style={{
            width: '100%', aspectRatio: '1 / 1', borderRadius: 10, overflow: 'hidden',
            border: '1px solid rgba(26,26,26,0.07)',
            background: `linear-gradient(135deg, rgba(196,160,112,0.08), rgba(168,145,122,0.05))`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
          }}>
            <div style={{
              width: '100%', height: '100%',
              backgroundImage: `url(${images[selectedImage]})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 64, color: 'rgba(26,26,26,0.06)' }}>⬡</span>
            </div>
            {product.badge && (
              <span style={{
                position: 'absolute', top: 16, left: 16,
                padding: '4px 12px', borderRadius: 4,
                background: product.badge === 'New' ? '#C4A070' : product.badge === 'Best Seller' ? '#E8753A' : 'rgba(139,109,79,0.85)',
                color: '#fff', fontSize: 10.5, fontWeight: 600,
                letterSpacing: 1.2, textTransform: 'uppercase',
              }}>{product.badge}</span>
            )}
          </div>

          {images.length > 1 && (
            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  style={{
                    width: 72, height: 72, borderRadius: 8, overflow: 'hidden', cursor: 'pointer',
                    border: selectedImage === i ? '2px solid #C4A070' : '1px solid rgba(26,26,26,0.08)',
                    background: `linear-gradient(135deg, rgba(196,160,112,${0.06 + i * 0.02}), rgba(168,145,122,0.04))`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: 0, opacity: selectedImage === i ? 1 : 0.6,
                    transition: 'opacity 0.2s, border-color 0.2s',
                  }}
                >
                  <div style={{
                    width: '100%', height: '100%',
                    backgroundImage: `url(${img})`,
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontSize: 18, color: 'rgba(26,26,26,0.06)' }}>⬡</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Product Info */}
        <div>
          <div style={{
            fontSize: 10.5, letterSpacing: 2.5, textTransform: 'uppercase',
            color: '#C4A070', fontWeight: 500, marginBottom: 10,
          }}>
            Casa Baja · {product.category}
          </div>

          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(32px, 5vw, 48px)',
            letterSpacing: 2, lineHeight: 1, margin: '0 0 16px', color: '#2A2520',
          }}>
            {product.name}
          </h1>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 20 }}>
            <span style={{ fontSize: 26, fontWeight: 700, color: '#8B6D4F' }}>
              ${(totalPrice / 100).toFixed(2)}
            </span>
            {optionPriceAdd > 0 && (
              <span style={{ fontSize: 13, color: 'rgba(26,26,26,0.3)', textDecoration: 'line-through' }}>
                ${(product.price / 100).toFixed(2)}
              </span>
            )}
          </div>

          {/* Rating Summary */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            <div style={{ display: 'flex', gap: 2 }}>
              {[1,2,3,4,5].map(star => (
                <span key={star} style={{ color: star <= Math.round(Number(avgRating)) ? '#C4A070' : 'rgba(26,26,26,0.12)', fontSize: 16 }}>★</span>
              ))}
            </div>
            <span style={{ fontSize: 13, color: 'rgba(26,26,26,0.4)' }}>
              {avgRating} ({PLACEHOLDER_REVIEWS.length} reviews)
            </span>
          </div>

          {product.description && (
            <p style={{ fontSize: 14.5, lineHeight: 1.75, color: 'rgba(26,26,26,0.55)', margin: '0 0 28px', maxWidth: '52ch' }}>
              {product.description}
            </p>
          )}

          {/* Options */}
          {product.options && product.options.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(26,26,26,0.35)', marginBottom: 10, fontWeight: 500 }}>
                Options
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {product.options.map((opt: ProductOption) => (
                  <button
                    key={opt.value}
                    onClick={() => setSelectedOption(opt.value)}
                    style={{
                      padding: '9px 18px', borderRadius: 6, cursor: 'pointer',
                      fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 500,
                      border: selectedOption === opt.value ? '2px solid #C4A070' : '1px solid rgba(26,26,26,0.12)',
                      background: selectedOption === opt.value ? 'rgba(196,160,112,0.08)' : 'transparent',
                      color: selectedOption === opt.value ? '#2A2520' : 'rgba(26,26,26,0.5)',
                      transition: 'all 0.2s',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Materials */}
          {product.materials && product.materials.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(26,26,26,0.35)', marginBottom: 8, fontWeight: 500 }}>
                Material
              </div>
              <div style={{ fontSize: 14, color: '#2A2520' }}>
                {product.materials.join(' · ')}
              </div>
            </div>
          )}

          {/* Quantity + Add to Cart */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 28 }}>
            <div style={{
              display: 'flex', alignItems: 'center', border: '1px solid rgba(26,26,26,0.12)',
              borderRadius: 6, overflow: 'hidden',
            }}>
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                style={{
                  width: 40, height: 44, border: 'none', background: 'transparent',
                  cursor: 'pointer', fontSize: 18, color: '#2A2520',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >−</button>
              <span style={{
                width: 40, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 600, borderLeft: '1px solid rgba(26,26,26,0.08)',
                borderRight: '1px solid rgba(26,26,26,0.08)',
              }}>{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                style={{
                  width: 40, height: 44, border: 'none', background: 'transparent',
                  cursor: 'pointer', fontSize: 18, color: '#2A2520',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >+</button>
            </div>

            <button
              onClick={addToCart}
              style={{
                flex: 1, padding: '13px 0', borderRadius: 6, border: 'none', cursor: 'pointer',
                fontFamily: "'Outfit', sans-serif", fontSize: 13.5, fontWeight: 600,
                letterSpacing: 1.5, textTransform: 'uppercase',
                background: added ? '#4a7c59' : '#2A2520',
                color: '#FAF7F1',
                transition: 'background 0.3s',
              }}
            >
              {added ? '✓ Added to Cart' : 'Add to Cart'}
            </button>
          </div>

          {/* Shipping Note */}
          <div style={{
            padding: '14px 18px', borderRadius: 6,
            border: '1px solid rgba(26,26,26,0.06)',
            background: 'rgba(196,160,112,0.04)',
            fontSize: 12.5, color: 'rgba(26,26,26,0.4)', lineHeight: 1.6,
          }}>
            <strong style={{ color: 'rgba(26,26,26,0.55)' }}>Handcrafted to order.</strong> Most items ship within 5–7 business days. Custom/engraved items may take 7–10 days.
          </div>
        </div>
      </div>

      {/* TABS: Details / Reviews */}
      <div style={{ marginTop: 64 }}>
        <div style={{
          display: 'flex', gap: 0, borderBottom: '1px solid rgba(26,26,26,0.08)',
          marginBottom: 32,
        }}>
          {(['details', 'reviews'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '14px 24px', border: 'none', cursor: 'pointer',
                background: 'transparent',
                fontFamily: "'Outfit', sans-serif", fontSize: 13,
                letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 500,
                color: activeTab === tab ? '#2A2520' : 'rgba(26,26,26,0.3)',
                borderBottom: activeTab === tab ? '2px solid #C4A070' : '2px solid transparent',
                transition: 'all 0.2s',
              }}
            >
              {tab === 'details' ? 'Details & Care' : `Reviews (${PLACEHOLDER_REVIEWS.length})`}
            </button>
          ))}
        </div>

        {activeTab === 'details' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, maxWidth: 800 }} className="pdp-details-grid">
            {product.features && product.features.length > 0 && (
              <div>
                <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(26,26,26,0.3)', marginBottom: 14, fontWeight: 500 }}>
                  Features
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {product.features.map((f, i) => (
                    <li key={i} style={{ fontSize: 14, color: 'rgba(26,26,26,0.6)', display: 'flex', alignItems: 'flex-start', gap: 10, lineHeight: 1.5 }}>
                      <span style={{ color: '#C4A070', fontSize: 8, marginTop: 6, flexShrink: 0 }}>●</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.care && (
              <div>
                <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(26,26,26,0.3)', marginBottom: 14, fontWeight: 500 }}>
                  Care Instructions
                </div>
                <p style={{ fontSize: 14, color: 'rgba(26,26,26,0.55)', lineHeight: 1.7, margin: 0 }}>
                  {product.care}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div style={{ maxWidth: 700 }}>
            {/* Rating Overview */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32,
              padding: '20px 24px', borderRadius: 8,
              border: '1px solid rgba(26,26,26,0.06)', background: 'rgba(196,160,112,0.03)',
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 42, color: '#2A2520', lineHeight: 1 }}>{avgRating}</div>
                <div style={{ display: 'flex', gap: 2, justifyContent: 'center', marginTop: 4 }}>
                  {[1,2,3,4,5].map(star => (
                    <span key={star} style={{ color: star <= Math.round(Number(avgRating)) ? '#C4A070' : 'rgba(26,26,26,0.12)', fontSize: 14 }}>★</span>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(26,26,26,0.35)', marginTop: 4 }}>{PLACEHOLDER_REVIEWS.length} reviews</div>
              </div>
              <div style={{ flex: 1 }}>
                {[5,4,3,2,1].map(stars => {
                  const count = PLACEHOLDER_REVIEWS.filter(r => r.rating === stars).length;
                  const pct = (count / PLACEHOLDER_REVIEWS.length) * 100;
                  return (
                    <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                      <span style={{ fontSize: 11, color: 'rgba(26,26,26,0.35)', width: 14, textAlign: 'right' }}>{stars}</span>
                      <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(26,26,26,0.06)', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', borderRadius: 3, background: '#C4A070', transition: 'width 0.3s' }} />
                      </div>
                      <span style={{ fontSize: 11, color: 'rgba(26,26,26,0.25)', width: 20 }}>{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {PLACEHOLDER_REVIEWS.map((review, i) => (
              <div key={i} style={{
                padding: '20px 0',
                borderBottom: i < PLACEHOLDER_REVIEWS.length - 1 ? '1px solid rgba(26,26,26,0.06)' : 'none',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: 'rgba(196,160,112,0.12)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 600, color: '#8B6D4F',
                    }}>
                      {review.author[0]}
                    </div>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: '#2A2520' }}>{review.author}</div>
                      <div style={{ display: 'flex', gap: 2 }}>
                        {[1,2,3,4,5].map(star => (
                          <span key={star} style={{ color: star <= review.rating ? '#C4A070' : 'rgba(26,26,26,0.1)', fontSize: 11 }}>★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: 11.5, color: 'rgba(26,26,26,0.25)' }}>{review.date}</span>
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(26,26,26,0.55)', margin: 0 }}>
                  {review.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 820px) {
          .pdp-grid { grid-template-columns: 1fr !important; }
          .pdp-details-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
